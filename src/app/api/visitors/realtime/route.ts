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

    // Get monthly visitors and online count
    const [monthlyVisitors, onlineVisitors] = await Promise.all([
        redis.scard(`visitors:${monthKey}`),
        redis.scard(`online:${monthKey}`)
    ]);

    return {
        monthlyCount: monthlyVisitors,
        onlineCount: onlineVisitors
    };
}

export async function POST(request: NextRequest) {
    try {
        const visitorId = request.headers.get("X-Visitor-ID");
        if (!visitorId) {
            return NextResponse.json({ error: "Visitor ID required" }, { status: 400 });
        }

        const body = await request.json();
        const { status, isNewVisit } = body;

        const now = new Date();
        const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

        // If it's a new visit, add to monthly visitors
        if (isNewVisit) {
            await redis.sadd(`visitors:${monthKey}`, visitorId);
        }

        // Handle online status
        const onlineKey = `online:${monthKey}`;
        if (status === "online") {
            await redis.sadd(onlineKey, visitorId);
            // Set 1 minute expiry for online status - if no update received, user will be considered offline
            await redis.expire(onlineKey, 60);
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
