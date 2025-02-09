import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = new Redis({
    // Gunakan KV_REST_API_URL dan KV_REST_API_TOKEN
    url: process.env.KV_REST_API_URL || '',
    token: process.env.KV_REST_API_TOKEN || '',
});

export async function GET(request: NextRequest) {
    try {
        const now = new Date();
        const monthKey = `visitors:${now.getFullYear()}-${now.getMonth() + 1}`;
        const totalKey = 'visitors:total';
        const today = now.toISOString().split("T")[0];
        const visitorId = request.headers.get("user-agent") || "unknown";
        const dailyKey = `${monthKey}:${today}:${visitorId}`;

        // Hitung waktu sampai tanggal 1 bulan depan jam 00:00:00
        const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0, 0);
        const secondsUntilNextMonth = Math.floor((nextMonth.getTime() - now.getTime()) / 1000);

        // Check if this visitor has been counted today
        const hasVisited = await redis.exists(dailyKey);

        if (!hasVisited) {
            // Mark this visitor as counted for today (expires in 24 hours)
            await redis.set(dailyKey, 1, { ex: 86400 });

            // Increment both monthly and total counters
            await redis.incr(monthKey);
            await redis.incr(totalKey);

            // Set expiry untuk data bulanan sampai tanggal 1 bulan depan
            await redis.expire(monthKey, secondsUntilNextMonth);

            // Store month in history if not exists
            const monthHistoryKey = `visitors:history:${now.getFullYear()}-${now.getMonth() + 1}`;
            const monthExists = await redis.exists(monthHistoryKey);
            if (!monthExists) {
                await redis.set(monthHistoryKey, 0, { ex: secondsUntilNextMonth });
            }
        }

        // Get current counts
        const [monthlyCount, totalCount] = await Promise.all([
            redis.get<number>(monthKey) || 0,
            redis.get<number>(totalKey) || 0
        ]);

        return NextResponse.json({
            count: totalCount, // menampilkan total pengunjung
            monthlyCount, // jumlah pengunjung bulan ini
            month: now.toLocaleString("default", { month: "short" }),
            year: now.getFullYear(),
        });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { error: "Internal server error", count: 0, monthlyCount: 0 },
            { status: 500 }
        );
    }
}
