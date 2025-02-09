// app/api/visitors/reset/route.ts
import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { pusherServer } from "@/lib/pusher";

const redis = new Redis({
    url: process.env.KV_REST_API_URL || '',
    token: process.env.KV_REST_API_TOKEN || '',
});

function getCurrentMonthKey(): string {
    const now = new Date();
    return `visitors:${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export async function POST() {
    try {
        const monthKey = getCurrentMonthKey();

        // Get all visitor IDs first
        const allVisitors = await redis.smembers(monthKey);

        // Create a pipeline for batch operations
        const pipeline = redis.pipeline();

        // Delete all individual visitor details
        for (const visitorId of allVisitors) {
            pipeline.del(`visitor:${visitorId}:details`);
        }

        // Delete the monthly visitors set
        pipeline.del(monthKey);

        // Execute all delete operations
        await pipeline.exec();

        // Send update via Pusher to refresh all clients
        await pusherServer.trigger('visitors-channel', 'visitor-update', {
            monthlyCount: 0,
            month: new Date().toLocaleString("default", { month: "short" }),
            year: new Date().getFullYear(),
            onlineCount: 0,
            idleCount: 0
        });

        return NextResponse.json({
            success: true,
            message: "All visitor data has been reset successfully"
        });
    } catch (error) {
        console.error('Error resetting visitor data:', error);
        return NextResponse.json(
            { error: "Failed to reset visitor data" },
            { status: 500 }
        );
    }
}
