// app/api/visitors/realtime/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { pusherServer } from "@/lib/pusher";  // Ganti import
import { VisitorData, StatusChangeRequest } from "@/types/visitors";

const redis = new Redis({
    url: process.env.KV_REST_API_URL || '',
    token: process.env.KV_REST_API_TOKEN || '',
});

const CACHE_TTL = 5; // 5 seconds

async function cleanupOldData() {
    const now = new Date();
    const currentMonthKey = `visitors:${now.getFullYear()}-${now.getMonth() + 1}`;

    // Get all keys
    const keys = await redis.keys('visitors:*');

    // Filter dan hapus keys dari bulan sebelumnya
    const oldKeys = keys.filter(key => key !== currentMonthKey);
    if (oldKeys.length > 0) {
        await redis.del(...oldKeys);
    }
}

async function getVisitorData(): Promise<VisitorData> {
    const now = new Date();
    const monthKey = `visitors:${now.getFullYear()}-${now.getMonth() + 1}`;
    const cacheKey = 'visitor_data_cache';

    // Cek dan bersihkan data lama
    await cleanupOldData();

    // Coba ambil dari cache
    const cached = await redis.get<string>(cacheKey);
    if (cached) return JSON.parse(cached);

    // Ambil data real-time
    const [visitorIPs, onlineIPs, idleIPs] = await Promise.all([
        redis.smembers(`${monthKey}:visitors`),
        redis.smembers('online_visitors'),
        redis.smembers('idle_visitors')
    ]);

    const data: VisitorData = {
        monthlyCount: visitorIPs.length,
        month: now.toLocaleString("default", { month: "short" }),
        year: now.getFullYear(),
        onlineCount: onlineIPs.length,
        idleCount: idleIPs.length
    };

    // Cache data
    await redis.set(cacheKey, JSON.stringify(data), { ex: CACHE_TTL });
    return data;
}

async function updateVisitorStatus(ip: string, status: 'online' | 'idle'): Promise<void> {
    const now = new Date();
    const monthKey = `visitors:${now.getFullYear()}-${now.getMonth() + 1}`;

    const pipeline = redis.pipeline();

    // Update online/idle status
    if (status === 'online') {
        pipeline.sadd('online_visitors', ip);
        pipeline.srem('idle_visitors', ip);
    } else {
        pipeline.sadd('idle_visitors', ip);
        pipeline.srem('online_visitors', ip);
    }

    // Add IP to monthly visitors set if not exists
    pipeline.sadd(`${monthKey}:visitors`, ip);

    await pipeline.exec();
}

export async function POST(request: NextRequest) {
    try {
        // Get real IP address
        const forwardedFor = request.headers.get("x-forwarded-for");
        const realIP = request.headers.get("x-real-ip");
        const ip = forwardedFor ? forwardedFor.split(',')[0] : realIP || 'unknown';

        const body = await request.json();
        const { status } = body as StatusChangeRequest;

        // Update status
        await updateVisitorStatus(ip, status);

        // Get dan broadcast data
        const visitorData = await getVisitorData();
        await pusherServer.trigger('visitors-channel', 'visitor-update', visitorData);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
