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

    try {
        // Get all visitor IDs for the current month
        const monthlyVisitors = await redis.smembers(`${monthKey}:visitors`);

        // Get all visitor details
        const visitorDetailsPromises = monthlyVisitors.map(id => getVisitorDetails(id));
        const visitorDetails = await Promise.all(visitorDetailsPromises);

        // Filter out null values and inactive visitors
        const validVisitors = visitorDetails.filter((v): v is VisitorDetails =>
            v !== null && v.status !== 'offline'
        );

        // Count only active visitors
        const onlineCount = validVisitors.filter(v => v.status === 'online').length;
        const idleCount = validVisitors.filter(v => v.status === 'idle').length;

        return {
            monthlyCount: monthlyVisitors.length,
            month: now.toLocaleString("default", { month: "short" }),
            year: now.getFullYear(),
            onlineCount,
            idleCount
        };
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

        // Get current visitor details
        const currentDetails = await getVisitorDetails(visitorId);

        // If visitor is already in the desired state, do nothing
        if (currentDetails?.status === status) {
            return;
        }

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

        if (status === 'offline') {
            // For offline status, remove the visitor details after delay
            await redis.del(`visitor:${visitorId}:details`);
            console.log('Visitor marked as offline:', visitorId);
        } else {
            // For online/idle status, update the details
            const stringifiedDetails = JSON.stringify(visitorDetails);
            await redis.set(`visitor:${visitorId}:details`, stringifiedDetails);
            await redis.sadd(`${monthKey}:visitors`, visitorId);
        }

    } catch (error) {
        console.error('Error in updateVisitorStatus:', error);
        throw error;
    }
}

export async function POST(request: NextRequest) {
    try {
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
