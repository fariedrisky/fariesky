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

        // Get all visitor IDs
        const allVisitors = await redis.smembers(`${monthKey}:visitors`);

        // Delete all visitor details and related keys
        const pipeline = redis.pipeline();

        // Delete individual visitor details
        for (const visitorId of allVisitors) {
            pipeline.del(`visitor:${visitorId}:details`);
        }

        // Delete the visitors set
        pipeline.del(`${monthKey}:visitors`);

        // Execute all operations
        await pipeline.exec();

        // Clear all members from the set (for safety)
        if (allVisitors.length > 0) {
            await redis.srem(`${monthKey}:visitors`, ...allVisitors);
        }

        const newVisitorData = {
            monthlyCount: 0,
            month: new Date().toLocaleString("default", { month: "short" }),
            year: new Date().getFullYear(),
            onlineCount: 0
        };

        // Trigger update to all clients
        await pusherServer.trigger('visitors-channel', 'visitor-update', newVisitorData);

        return NextResponse.json({
            success: true,
            message: "All visitor data has been reset successfully",
            data: newVisitorData
        });

    } catch (error) {
        console.error('Error resetting visitor data:', error);
        return NextResponse.json(
            { error: "Failed to reset visitor data" },
            { status: 500 }
        );
    }
}
