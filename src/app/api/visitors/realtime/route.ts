import { NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";
import { Redis } from "@upstash/redis";

const redis = new Redis({
    url: process.env.KV_REST_API_URL || '',
    token: process.env.KV_REST_API_TOKEN || '',
});

export async function POST() {
    try {
        // Get current visitor data
        const now = new Date();
        const monthKey = `visitors:${now.getFullYear()}-${now.getMonth() + 1}`;
        
        const [monthlyCount, totalCount] = await Promise.all([
            redis.get<number>(monthKey) || 0,
            redis.get<number>('visitors:total') || 0,
        ]);

        const visitorData = {
            count: totalCount,
            monthlyCount,
            month: now.toLocaleString("default", { month: "short" }),
            year: now.getFullYear(),
            onlineCount: await redis.keys('online:*').then(keys => keys.length)
        };

        // Trigger Pusher event
        await pusherServer.trigger('visitors-channel', 'visitor-update', visitorData);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
