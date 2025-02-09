// app/api/visitors/realtime/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { pusherServer } from "@/lib/pusher";
import { VisitorData, StatusChangeRequest, DeviceInfo } from "@/types/visitors";
import { getDeviceInfo } from "@/utils/deviceDetection";

const redis = new Redis({
    url: process.env.KV_REST_API_URL || '',
    token: process.env.KV_REST_API_TOKEN || '',
});

const CACHE_TTL = 5; // 5 seconds

interface VisitorDetails {
    id: string;
    userAgent: string;
    deviceInfo: DeviceInfo;
    lastSeen: string;
    status: 'online' | 'idle' | 'offline';
}

// Helper to get current month key
function getCurrentMonthKey(): string {
    const now = new Date();
    return `visitors:${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

// Check if it's a new month and reset if needed
async function checkAndResetMonthly(): Promise<void> {
    try {
        const now = new Date();
        const isFirstDayOfMonth = now.getDate() === 1;
        const lastResetKey = 'last_monthly_reset';

        if (!isFirstDayOfMonth) return;

        const lastReset = await redis.get(lastResetKey);
        if (!lastReset) {
            // First time running, just set the reset date
            await redis.set(lastResetKey, now.toISOString());
            return;
        }

        const lastResetDate = new Date(lastReset as string);
        const isSameMonth = lastResetDate.getMonth() === now.getMonth() &&
            lastResetDate.getFullYear() === now.getFullYear();

        if (!isSameMonth) {
            // It's a new month, perform reset
            const monthKey = getCurrentMonthKey();

            // Delete all visitor details
            const allKeys = await redis.keys(`${monthKey}:*`);
            for (const key of allKeys) {
                await redis.del(key);
            }

            // Update reset timestamp
            await redis.set(lastResetKey, now.toISOString());

            console.log('Monthly visitor reset performed:', {
                month: monthKey,
                resetTime: now.toISOString()
            });
        }
    } catch (error) {
        console.error('Error in monthly reset:', error);
    }
}

async function getVisitorDetails(id: string): Promise<VisitorDetails | null> {
    try {
        const details = await redis.get(`visitor:${id}:details`);
        if (!details) return null;

        if (typeof details === 'string') {
            return JSON.parse(details);
        } else if (typeof details === 'object') {
            return details as VisitorDetails;
        }
        return null;
    } catch (error) {
        console.error(`Error getting visitor details for ${id}:`, error);
        return null;
    }
}

async function getVisitorData(): Promise<VisitorData> {
    const now = new Date();
    const monthKey = getCurrentMonthKey();
    const cacheKey = 'visitor_data_cache';

    try {
        // Get all visitor IDs for the current month
        const monthlyVisitors = await redis.smembers(`${monthKey}:visitors`);

        // Get all visitor details
        const visitorDetailsPromises = monthlyVisitors.map(id => getVisitorDetails(id));
        const visitorDetails = await Promise.all(visitorDetailsPromises);

        // Filter out null values and count statuses
        const validVisitors = visitorDetails.filter((v): v is VisitorDetails => v !== null);
        const onlineCount = validVisitors.filter(v => v.status === 'online').length;
        const idleCount = validVisitors.filter(v => v.status === 'idle').length;

        const data: VisitorData = {
            monthlyCount: monthlyVisitors.length,
            month: now.toLocaleString("default", { month: "short" }),
            year: now.getFullYear(),
            onlineCount,
            idleCount
        };

        await redis.set(cacheKey, JSON.stringify(data), { ex: CACHE_TTL });
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

async function updateVisitorStatus(
    visitorId: string,
    userAgent: string,
    status: 'online' | 'idle' | 'offline'
): Promise<void> {
    try {
        const monthKey = getCurrentMonthKey();

        // Get device info
        const deviceInfo: DeviceInfo = getDeviceInfo(userAgent);

        // Create visitor details
        const visitorDetails: VisitorDetails = {
            id: visitorId,
            userAgent,
            deviceInfo,
            lastSeen: new Date().toISOString(),
            status
        };

        const stringifiedDetails = JSON.stringify(visitorDetails);
        await redis.set(`visitor:${visitorId}:details`, stringifiedDetails);
        await redis.sadd(`${monthKey}:visitors`, visitorId);

        if (status === 'offline') {
            setTimeout(async () => {
                const currentDetails = await getVisitorDetails(visitorId);
                if (currentDetails?.status === 'offline') {
                    await redis.del(`visitor:${visitorId}:details`);
                }
            }, 5000);
        }

        console.log('Updated visitor status:', {
            visitorId,
            status,
            monthKey,
            details: visitorDetails
        });

    } catch (error) {
        console.error('Error in updateVisitorStatus:', error);
        throw error;
    }
}

export async function POST(request: NextRequest) {
    try {
        // Check for monthly reset on each request
        await checkAndResetMonthly();

        const visitorId = request.headers.get("X-Visitor-ID");
        const userAgent = request.headers.get("user-agent") || "Unknown Device";

        if (!visitorId) {
            return NextResponse.json(
                { error: "Visitor ID is required" },
                { status: 400 }
            );
        }

        const body = await request.json();
        const { status } = body as StatusChangeRequest;

        await updateVisitorStatus(visitorId, userAgent, status);
        const visitorData = await getVisitorData();
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
