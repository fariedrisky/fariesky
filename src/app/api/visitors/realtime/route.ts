// app/api/visitors/realtime/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { pusherServer } from "@/lib/pusher";
import { VisitorData, StatusChangeRequest, VisitorDetails } from "@/types/visitors";
import { getDeviceInfo } from "@/utils/deviceDetection";

const redis = new Redis({
    url: process.env.KV_REST_API_URL || '',
    token: process.env.KV_REST_API_TOKEN || '',
});

const CACHE_TTL = 5; // 5 seconds

// Helper function to check if IP is localhost
function isLocalhost(ip: string): boolean {
    return ip === '127.0.0.1' || ip === '::1' || ip === 'localhost';
}

// Helper function to get visitor details by IP with fixed types
async function getVisitorDetailsByIPs(ips: string[]): Promise<VisitorDetails[]> {
    try {
        const details = await Promise.all(
            ips.map(async (ip) => {
                const userAgent = (await redis.get(`visitor:${ip}:useragent`)) as string | null;
                const deviceInfo = userAgent ? getDeviceInfo(userAgent) : null;
                const lastSeen = (await redis.get(`visitor:${ip}:lastSeen`)) as string | null;

                return {
                    ip,
                    deviceInfo,
                    lastSeen: lastSeen || 'Unknown',
                    userAgent: userAgent || 'Unknown'
                } satisfies VisitorDetails;
            })
        );
        return details;
    } catch (error) {
        console.error('Error getting visitor details:', error);
        return [];
    }
}

async function getVisitorData(): Promise<VisitorData> {
    const now = new Date();
    const monthKey = `visitors:${now.getFullYear()}-${now.getMonth() + 1}`;
    const cacheKey = 'visitor_data_cache';

    try {
        // Get real-time data
        const [allVisitorIPs, onlineIPs, idleIPs] = await Promise.all([
            redis.smembers(`${monthKey}:visitors`),
            redis.smembers('online_visitors'),
            redis.smembers('idle_visitors')
        ]);

        // Filter out localhost IPs
        const visitorIPs = allVisitorIPs.filter(ip => !isLocalhost(ip));
        const filteredOnlineIPs = onlineIPs.filter(ip => !isLocalhost(ip));
        const filteredIdleIPs = idleIPs.filter(ip => !isLocalhost(ip));

        // Get detailed information for online and idle visitors
        const [onlineDetails, idleDetails] = await Promise.all([
            getVisitorDetailsByIPs(filteredOnlineIPs),
            getVisitorDetailsByIPs(filteredIdleIPs)
        ]);

        // Log detailed visitor information
        console.log('\nDetailed Visitor Status:');
        console.log('\nOnline Visitors:', {
            count: filteredOnlineIPs.length,
            visitors: onlineDetails.map(detail => ({
                ip: detail.ip,
                device: detail.deviceInfo?.deviceName || 'Unknown Device',
                browser: detail.deviceInfo?.browser || 'Unknown Browser',
                os: detail.deviceInfo?.os || 'Unknown OS',
                lastSeen: detail.lastSeen
            }))
        });

        console.log('\nIdle Visitors:', {
            count: filteredIdleIPs.length,
            visitors: idleDetails.map(detail => ({
                ip: detail.ip,
                device: detail.deviceInfo?.deviceName || 'Unknown Device',
                browser: detail.deviceInfo?.browser || 'Unknown Browser',
                os: detail.deviceInfo?.os || 'Unknown OS',
                lastSeen: detail.lastSeen
            }))
        });

        const data: VisitorData = {
            monthlyCount: visitorIPs.length,
            month: now.toLocaleString("default", { month: "short" }),
            year: now.getFullYear(),
            onlineCount: filteredOnlineIPs.length,
            idleCount: filteredIdleIPs.length
        };

        // Cache the stringified data
        const stringifiedData = JSON.stringify(data);
        await redis.set(cacheKey, stringifiedData, { ex: CACHE_TTL });

        return data;
    } catch (error) {
        console.error('Error in getVisitorData:', error);
        return {
            monthlyCount: 0,
            month: now.toLocaleString("default", { month: "short" }),
            year: now.getFullYear(),
            onlineCount: 0,
            idleCount: 0
        };
    }
}

async function updateVisitorStatus(ip: string, userAgent: string, status: 'online' | 'idle'): Promise<void> {
    try {
        // Skip if localhost in production
        if (process.env.NODE_ENV === 'production' && isLocalhost(ip)) {
            console.log('Skipping localhost in production:', ip);
            return;
        }

        const now = new Date();
        const monthKey = `visitors:${now.getFullYear()}-${now.getMonth() + 1}`;

        console.log(`\nUpdating status for visitor:`, {
            ip,
            status,
            timestamp: now.toISOString()
        });

        // Store user agent and last seen time
        await Promise.all([
            redis.set(`visitor:${ip}:useragent`, userAgent),
            redis.set(`visitor:${ip}:lastSeen`, now.toISOString())
        ]);

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
        const userAgent = request.headers.get("user-agent") || "Unknown Device";

        // Get IP address and handle localhost cases
        const ip = forwardedFor
            ? forwardedFor.split(',')[0]
            : realIP || '127.0.0.1';

        // Get device information
        const deviceInfo = getDeviceInfo(userAgent);

        // Log new visitor information
        console.log('\nNew Visitor Details:', {
            ip: {
                forwardedFor: forwardedFor || 'none',
                realIP: realIP || 'none',
                finalIP: ip,
                isLocalhost: isLocalhost(ip)
            },
            device: {
                ...deviceInfo,
                userAgent
            },
            timestamp: new Date().toISOString()
        });

        const body = await request.json();
        const { status } = body as StatusChangeRequest;

        // Update visitor status with user agent
        await updateVisitorStatus(ip, userAgent, status);

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
