// app/api/visitors/realtime/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { pusherServer } from "@/lib/pusher";
import { StatusChangeRequest } from "@/types/visitors";

const redis = new Redis({
    url: process.env.KV_REST_API_URL || '',
    token: process.env.KV_REST_API_TOKEN || '',
});

const IDLE_TIMEOUT = 30 * 1000; // 30 seconds timeout for idle
const OFFLINE_TIMEOUT = 60 * 1000; // 1 minute timeout for offline cleanup

interface VisitorDetails {
    id: string;
    lastSeen: string;
    status: 'online' | 'idle' | 'offline';
}

interface VisitorData {
    monthlyCount: number;
    month: string;
    year: number;
    onlineCount: number;
    idleCount: number;
}

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
        console.error('Error getting visitor details:', error);
        return null;
    }
}

async function cleanupInactiveVisitors(): Promise<void> {
    const monthKey = getCurrentMonthKey();
    const now = new Date();

    try {
        const allVisitors = await redis.smembers(`${monthKey}:visitors`);
        for (const visitorId of allVisitors) {
            const details = await getVisitorDetails(visitorId);
            if (!details) continue;

            const lastSeenTime = new Date(details.lastSeen).getTime();
            const timeDiff = now.getTime() - lastSeenTime;

            if (details.status === 'idle' && timeDiff > IDLE_TIMEOUT) {
                await updateVisitorStatus(visitorId, 'offline');
            } else if (details.status === 'online' && timeDiff > IDLE_TIMEOUT) {
                await updateVisitorStatus(visitorId, 'idle');
            } else if (timeDiff > OFFLINE_TIMEOUT) {
                await redis.del(`visitor:${visitorId}:details`);
                await redis.srem(`${monthKey}:visitors`, visitorId);
            }
        }
    } catch (error) {
        console.error("Error during cleanup:", error);
        // Ignore cleanup errors
    }
}

async function getVisitorData(): Promise<VisitorData> {
    const now = new Date();
    const monthKey = getCurrentMonthKey();

    try {
        const monthlyVisitors = await redis.smembers(`${monthKey}:visitors`);
        const visitorDetails = await Promise.all(
            monthlyVisitors.map(id => getVisitorDetails(id))
        );

        const validVisitors = visitorDetails.filter((v): v is VisitorDetails =>
            v !== null && v.status !== 'offline'
        );

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
        console.error('Error getting visitor data:', error);
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
    status: 'online' | 'idle' | 'offline'
): Promise<void> {
    try {
        const monthKey = getCurrentMonthKey();
        const currentDetails = await getVisitorDetails(visitorId);
        const now = new Date();

        if (currentDetails?.status === status) {
            return;
        }

        const visitorDetails: VisitorDetails = {
            id: visitorId,
            lastSeen: now.toISOString(),
            status
        };

        if (status === 'offline') {
            await redis.del(`visitor:${visitorId}:details`);
            await redis.srem(`${monthKey}:visitors`, visitorId);
        } else {
            await redis.set(`visitor:${visitorId}:details`, JSON.stringify(visitorDetails));
            await redis.sadd(`${monthKey}:visitors`, visitorId);
        }
    } catch (error) {
        throw error;
    }
}

export async function POST(request: NextRequest) {
    try {
        const visitorId = request.headers.get("X-Visitor-ID");

        if (!visitorId) {
            return NextResponse.json(
                { error: "Visitor ID is required" },
                { status: 400 }
            );
        }

        const body = await request.json();
        const { status } = body as StatusChangeRequest;

        await cleanupInactiveVisitors();
        await updateVisitorStatus(visitorId, status);
        const visitorData = await getVisitorData();
        await pusherServer.trigger('visitors-channel', 'visitor-update', visitorData);

        return NextResponse.json({
            success: true,
            data: visitorData
        });

    } catch (error) {
        console.error("Error updating visitor status:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
