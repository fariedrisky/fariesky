import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { pusherServer } from "@/lib/pusher";
import { VisitorData, StatusChangeRequest } from "@/types/visitors";

const redis = new Redis({
    url: process.env.KV_REST_API_URL || '',
    token: process.env.KV_REST_API_TOKEN || '',
});

const CACHE_TTL = 5; // 5 seconds

// Moved to a separate utility file if needed
// export async function cleanupOldData() {
//     const now = new Date();
//     const currentMonthKey = `visitors:${now.getFullYear()}-${now.getMonth() + 1}`;
//     const keys = await redis.keys('visitors:*');
//     const oldKeys = keys.filter(key => key !== currentMonthKey);
//     if (oldKeys.length > 0) {
//         await redis.del(...oldKeys);
//     }
// }

async function getVisitorData(): Promise<VisitorData> {
    const now = new Date();
    const monthKey = `visitors:${now.getFullYear()}-${now.getMonth() + 1}`;
    const cacheKey = 'visitor_data_cache';

    try {
        // Get real-time data
        const [visitorIPs, onlineIPs, idleIPs] = await Promise.all([
            redis.smembers(`${monthKey}:visitors`),
            redis.smembers('online_visitors'),
            redis.smembers('idle_visitors')
        ]);

        // Log connected IPs for debugging
        console.log('Current visitors state:', {
            totalVisitors: visitorIPs,
            onlineVisitors: onlineIPs,
            idleVisitors: idleIPs
        });

        const data: VisitorData = {
            monthlyCount: visitorIPs.length,
            month: now.toLocaleString("default", { month: "short" }),
            year: now.getFullYear(),
            onlineCount: onlineIPs.length,
            idleCount: idleIPs.length
        };

        // Cache the stringified data
        const stringifiedData = JSON.stringify(data);
        await redis.set(cacheKey, stringifiedData, { ex: CACHE_TTL });

        return data;
    } catch (error) {
        console.error('Error in getVisitorData:', error);
        // Return default data in case of error
        return {
            monthlyCount: 0,
            month: now.toLocaleString("default", { month: "short" }),
            year: now.getFullYear(),
            onlineCount: 0,
            idleCount: 0
        };
    }
}

async function updateVisitorStatus(ip: string, status: 'online' | 'idle'): Promise<void> {
    try {
        const now = new Date();
        const monthKey = `visitors:${now.getFullYear()}-${now.getMonth() + 1}`;

        console.log(`Updating status for IP ${ip} to ${status}`);

        // Remove IP from both sets first
        await redis.srem('online_visitors', ip);
        await redis.srem('idle_visitors', ip);

        // Add to appropriate set based on status
        if (status === 'online') {
            await redis.sadd('online_visitors', ip);
        } else {
            await redis.sadd('idle_visitors', ip);
        }

        // Add to monthly visitors
        await redis.sadd(`${monthKey}:visitors`, ip);

        // Log current state after update
        const [onlineCount, idleCount] = await Promise.all([
            redis.scard('online_visitors'),
            redis.scard('idle_visitors')
        ]);

        console.log('Current counts:', {
            online: onlineCount,
            idle: idleCount
        });

    } catch (error) {
        console.error('Error in updateVisitorStatus:', error);
        throw error;
    }
}

export async function POST(request: NextRequest) {
    try {
        // Get the real IP address using headers
        const forwardedFor = request.headers.get("x-forwarded-for");
        const realIP = request.headers.get("x-real-ip");
        
        // Get IP address and handle localhost cases
        const ip = forwardedFor
            ? forwardedFor.split(',')[0]
            : realIP || '127.0.0.1';  // Default to localhost if no IP found

        // Log IP information for debugging
        console.log('IP Details:', {
            forwardedFor: forwardedFor || 'none',
            realIP: realIP || 'none',
            finalIP: ip,
            isLocalhost: ip === '127.0.0.1' || ip === '::1'
        });

        console.log('Incoming request from IP:', ip);

        const body = await request.json();
        const { status } = body as StatusChangeRequest;

        // Update visitor status
        await updateVisitorStatus(ip, status);

        // Get updated visitor data
        const visitorData = await getVisitorData();

        // Broadcast update via Pusher
        await pusherServer.trigger('visitors-channel', 'visitor-update', visitorData);

        return NextResponse.json({
            success: true,
            data: visitorData
        });

    } catch (error) {
        console.error('Error in POST handler:', error);
        return NextResponse.json(
            { error: "Internal server error", details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
