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
        const { status, browserId, action } = body;
        
        // Handle status change
        if (action === "status_change") {
            if (status === 'idle') {
                await redis.sadd('idle_users', browserId);
                await redis.srem('online_users', browserId);
            } else if (status === 'connected') {
                await redis.sadd('online_users', browserId);
                await redis.srem('idle_users', browserId);
            }
        }

        // Check if this is a new visitor
        const visitorKey = `visitor:${browserId}`;
        const isExistingVisitor = await redis.exists(visitorKey);
        if (!isExistingVisitor) {
            const now = new Date();
            const monthKey = `visitors:${now.getFullYear()}-${now.getMonth() + 1}`;
            await Promise.all([
                redis.incr('visitors:total'),
                redis.incr(monthKey),
                redis.set(visitorKey, new Date().toISOString())
            ]);
        }

        // Get current counts
        const now = new Date();
        const monthKey = `visitors:${now.getFullYear()}-${now.getMonth() + 1}`;
        
        const [monthlyCount, totalCount, onlineUsers, idleUsers] = await Promise.all([
            redis.get<number>(monthKey) || 0,
            redis.get<number>('visitors:total') || 0,
            redis.smembers('online_users'),
            redis.smembers('idle_users')
        ]);

        const visitorData = {
            count: totalCount,
            monthlyCount,
            month: now.toLocaleString("default", { month: "short" }),
            year: now.getFullYear(),
            onlineCount: onlineUsers.length,
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
            // Remove from both sets
            await Promise.all([
                redis.srem('online_users', browserId),
                redis.srem('idle_users', browserId)
            ]);

            const now = new Date();
            const monthKey = `visitors:${now.getFullYear()}-${now.getMonth() + 1}`;

            const [monthlyCount, totalCount, onlineUsers, idleUsers] = await Promise.all([
                redis.get<number>(monthKey) || 0,
                redis.get<number>('visitors:total') || 0,
                redis.smembers('online_users'),
                redis.smembers('idle_users')
            ]);

            const visitorData = {
                count: totalCount,
                monthlyCount,
                month: now.toLocaleString("default", { month: "short" }),
                year: now.getFullYear(),
                onlineCount: onlineUsers.length,
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
