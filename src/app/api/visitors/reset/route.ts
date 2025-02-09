// app/api/visitors/reset/route.ts
import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = new Redis({
    url: process.env.KV_REST_API_URL || '',
    token: process.env.KV_REST_API_TOKEN || '',
});

export async function POST() {
    try {
        // Reset semua data pengunjung
        const pipeline = redis.pipeline();

        // Hapus semua set pengunjung
        pipeline.del('online_visitors');
        pipeline.del('idle_visitors');

        // Hapus counter bulanan
        const now = new Date();
        const monthKey = `visitors:${now.getFullYear()}-${now.getMonth() + 1}`;
        pipeline.del(monthKey);

        // Hapus cache
        pipeline.del('visitor_data_cache');

        // Eksekusi pipeline
        await pipeline.exec();

        return NextResponse.json({
            success: true,
            message: "All visitor data has been reset"
        });
    } catch (error) {
        console.error('Error resetting data:', error);
        return NextResponse.json(
            { error: "Failed to reset visitor data" },
            { status: 500 }
        );
    }
}
