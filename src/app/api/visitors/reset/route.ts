import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { pusherServer } from "@/lib/pusher";

const redis = new Redis({
    url: process.env.KV_REST_API_URL || '',
    token: process.env.KV_REST_API_TOKEN || '',
});

function getCurrentMonthKey(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export async function POST() {
    try {
        const monthKey = getCurrentMonthKey();

        // Get all keys that need to be deleted
        const keysToDelete = await Promise.all([
            // Get all online visitors
            redis.smembers(`online:${monthKey}`),
            // Get all visitors
            redis.smembers(`visitors:${monthKey}`)
        ]);

        const [onlineVisitors, allVisitors] = keysToDelete;

        // Create pipeline for batch operations
        const pipeline = redis.pipeline();

        // Delete online visitors
        for (const visitorId of onlineVisitors) {
            pipeline.del(`visitor:${visitorId}`);
        }

        // Delete visitor records
        for (const visitorId of allVisitors) {
            pipeline.del(`visitor:${visitorId}`);
        }

        // Delete sets
        pipeline.del(`online:${monthKey}`);
        pipeline.del(`visitors:${monthKey}`);

        // Execute all delete operations
        await pipeline.exec();

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
