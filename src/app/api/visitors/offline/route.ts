import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = new Redis({
    url: process.env.KV_REST_API_URL || '',
    token: process.env.KV_REST_API_TOKEN || '',
});

export async function POST(request: NextRequest) {
    try {
        const userId = request.headers.get("user-agent") || "unknown";
        const onlineKey = `online:${userId}`;

        // Hapus user dari daftar online
        await redis.del(onlineKey);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
