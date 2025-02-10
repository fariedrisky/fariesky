// app/api/visitors/realtime/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { pusherServer } from "@/lib/pusher";

const redis = new Redis({
    url: process.env.KV_REST_API_URL || "",
    token: process.env.KV_REST_API_TOKEN || "",
});

async function getCurrentMonthVisitors(): Promise<{
    monthlyCount: number;
    onlineCount: number;
}> {
    const now = new Date();
    const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    const [monthlyVisitors, onlineVisitors] = await Promise.all([
        redis.scard(`visitors:${monthKey}`),
        redis.scard(`online:${monthKey}`)
    ]);

    return {
        monthlyCount: monthlyVisitors,
        onlineCount: onlineVisitors
    };
}

async function cleanupPreviousMonth() {
    const now = new Date();
    if (now.getDate() === 1) {
        const prevMonth = new Date(now);
        prevMonth.setMonth(now.getMonth() - 1);
        const prevMonthKey = `${prevMonth.getFullYear()}-${String(prevMonth.getMonth() + 1).padStart(2, "0")}`;

        try {
            await Promise.all([
                redis.del(`visitors:${prevMonthKey}`),
                redis.del(`online:${prevMonthKey}`),
                redis.del(`devices:${prevMonthKey}`)  // Also cleanup device tracking
            ]);
        } catch (error) {
            console.error('Error cleaning up previous month:', error);
        }
    }
}

export async function POST(request: NextRequest) {
    try {
        const visitorId = request.headers.get("X-Visitor-ID");
        const deviceFingerprint = request.headers.get("X-Device-Fingerprint");

        if (!visitorId || !deviceFingerprint) {
            return NextResponse.json(
                { error: "Visitor ID and Device Fingerprint required" },
                { status: 400 }
            );
        }

        let body;
        try {
            body = await request.json();
        } catch (error) {
            console.error('Error parsing request body:', error);
            return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
        }

        const { status, isNewVisit } = body;
        const now = new Date();
        const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

        // Cleanup previous month data
        await cleanupPreviousMonth();

        // Check if this device has already been counted this month
        const deviceKey = `devices:${monthKey}`;
        const isNewDevice = !(await redis.sismember(deviceKey, deviceFingerprint));

        // Add to monthly visitors only if it's both a new visit and a new device
        if (isNewVisit && isNewDevice) {
            await Promise.all([
                redis.sadd(`visitors:${monthKey}`, visitorId),
                redis.sadd(deviceKey, deviceFingerprint)
            ]);

            // Set expiry for both keys to end of current month
            const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            const secondsUntilMonthEnd = Math.floor((lastDayOfMonth.getTime() - now.getTime()) / 1000);

            await Promise.all([
                redis.expire(`visitors:${monthKey}`, secondsUntilMonthEnd),
                redis.expire(deviceKey, secondsUntilMonthEnd)
            ]);
        }

        // Handle online status
        const onlineKey = `online:${monthKey}`;
        if (status === "online") {
            await redis.sadd(onlineKey, visitorId);
            await redis.expire(onlineKey, 30);  // 30-second expiry for online status
        } else {
            await redis.srem(onlineKey, visitorId);
        }

        // Get updated counts
        const counts = await getCurrentMonthVisitors();

        const visitorData = {
            ...counts,
            month: now.toLocaleString('default', { month: 'short' }),
            year: now.getFullYear()
        };

        // Broadcast update via Pusher
        await pusherServer.trigger('visitors-channel', 'visitor-update', visitorData);

        return NextResponse.json({ success: true, data: visitorData });
    } catch (error) {
        console.error('Error in visitor tracking:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
