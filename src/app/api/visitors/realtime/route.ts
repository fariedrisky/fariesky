import { NextRequest, NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";
import { Redis } from "@upstash/redis";

const redis = new Redis({
    url: process.env.KV_REST_API_URL || '',
    token: process.env.KV_REST_API_TOKEN || '',
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { status, browserId } = body;

        const onlineKey = `online:${browserId}`;
        const idleKey = `idle:${browserId}`;
        const visitorKey = `visitor:${browserId}`;

        // Handle user status
        if (status === 'idle') {
            await redis.del(onlineKey);
            await redis.set(idleKey, new Date().toISOString(), { ex: 30 });
        } else {
            await redis.del(idleKey);
            await redis.set(onlineKey, new Date().toISOString(), { ex: 30 });
        }

        const now = new Date();
        const monthKey = `visitors:${now.getFullYear()}-${now.getMonth() + 1}`;

        // Check if this is a new visitor (browser)
        const isExistingVisitor = await redis.exists(visitorKey);
        if (!isExistingVisitor) {
            await Promise.all([
                redis.incr('visitors:total'),
                redis.incr(monthKey),
                redis.set(visitorKey, new Date().toISOString(), { ex: 86400 }) // 24 hours
            ]);
        }

        const [monthlyCount, totalCount] = await Promise.all([
            redis.get<number>(monthKey) || 0,
            redis.get<number>('visitors:total') || 0,
        ]);

        // Get active and idle users count by unique browsers
        const [activeUsers, idleUsers] = await Promise.all([
            redis.keys('online:*'),
            redis.keys('idle:*')
        ]);

        const visitorData = {
            count: totalCount,
            monthlyCount,
            month: now.toLocaleString("default", { month: "short" }),
            year: now.getFullYear(),
            onlineCount: activeUsers.length,
            idleCount: idleUsers.length
        };

        await pusherServer.trigger('visitors-channel', 'visitor-update', visitorData);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const body = await request.json();
        const { browserId } = body;

        if (browserId) {
            await Promise.all([
                redis.del(`online:${browserId}`),
                redis.del(`idle:${browserId}`)
            ]);

            const now = new Date();
            const monthKey = `visitors:${now.getFullYear()}-${now.getMonth() + 1}`;

            const [monthlyCount, totalCount, activeUsers, idleUsers] = await Promise.all([
                redis.get<number>(monthKey) || 0,
                redis.get<number>('visitors:total') || 0,
                redis.keys('online:*'),
                redis.keys('idle:*')
            ]);

            const visitorData = {
                count: totalCount,
                monthlyCount,
                month: now.toLocaleString("default", { month: "short" }),
                year: now.getFullYear(),
                onlineCount: activeUsers.length,
                idleCount: idleUsers.length
            };

            await pusherServer.trigger('visitors-channel', 'visitor-update', visitorData);
        }
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
