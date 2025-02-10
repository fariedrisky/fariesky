// app/api/visitors/realtime/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { pusherServer } from "@/lib/pusher";
import { StatusChangeRequest } from "@/types/visitors";

const redis = new Redis({
    url: process.env.KV_REST_API_URL || '',
    token: process.env.KV_REST_API_TOKEN || '',
});

const OFFLINE_TIMEOUT = 60 * 1000; // 1 minute timeout for offline cleanup

interface VisitorDetails {
    id: string;
    lastSeen: string;
    status: 'online' | 'offline';
}

interface VisitorData {
    monthlyCount: number;
    month: string;
    year: number;
    onlineCount: number;
}

function getCurrentMonthKey(): string {
    const now = new Date();
    return `visitors:${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function getUniqueVisitorsKey(): string {
    const now = new Date();
    return `unique_visitors:${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
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
        const allVisitors = await redis.smembers(monthKey);
        for (const visitorId of allVisitors) {
            const details = await getVisitorDetails(visitorId);
            if (!details) continue;

            const lastSeenTime = new Date(details.lastSeen).getTime();
            const timeDiff = now.getTime() - lastSeenTime;

            if (timeDiff > OFFLINE_TIMEOUT) {
                await redis.del(`visitor:${visitorId}:details`);
                await redis.srem(monthKey, visitorId);
            }
        }

        // Check if it's the first day of a new month
        if (now.getDate() === 1 && now.getHours() === 0) {
            const lastMonthDate = new Date(now);
            lastMonthDate.setMonth(now.getMonth() - 1);
            const lastMonthKey = `visitors:${lastMonthDate.getFullYear()}-${String(lastMonthDate.getMonth() + 1).padStart(2, '0')}`;
            const lastMonthUniqueKey = `unique_visitors:${lastMonthDate.getFullYear()}-${String(lastMonthDate.getMonth() + 1).padStart(2, '0')}`;

            // Clear last month's data
            const lastMonthVisitors = await redis.smembers(lastMonthKey);
            for (const visitorId of lastMonthVisitors) {
                await redis.del(`visitor:${visitorId}:details`);
            }
            await redis.del(lastMonthKey);
            await redis.del(lastMonthUniqueKey);
        }
    } catch (error) {
        console.error("Error during cleanup:", error);
    }
}

async function getVisitorData(): Promise<VisitorData> {
    const now = new Date();
    const monthKey = getCurrentMonthKey();
    const uniqueKey = getUniqueVisitorsKey();

    try {
        // Get online users
        const onlineVisitors = await redis.smembers(monthKey);
        const visitorDetails = await Promise.all(
            onlineVisitors.map(id => getVisitorDetails(id))
        );

        const validVisitors = visitorDetails.filter((v): v is VisitorDetails =>
            v !== null && v.status === 'online'
        );

        // Get total unique visitors for the month
        const uniqueVisitors = await redis.scard(uniqueKey);

        return {
            monthlyCount: uniqueVisitors,
            month: now.toLocaleString("default", { month: "short" }),
            year: now.getFullYear(),
            onlineCount: validVisitors.length,
        };
    } catch (error) {
        console.error('Error getting visitor data:', error);
        return {
            monthlyCount: 0,
            month: now.toLocaleString("default", { month: "short" }),
            year: now.getFullYear(),
            onlineCount: 0,
        };
    }
}

async function updateVisitorStatus(
    visitorId: string,
    status: 'online' | 'offline'
): Promise<void> {
    try {
        const monthKey = getCurrentMonthKey();
        const uniqueKey = getUniqueVisitorsKey();
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

        // Always add to unique visitors set when updating status
        await redis.sadd(uniqueKey, visitorId);

        if (status === 'offline') {
            await redis.del(`visitor:${visitorId}:details`);
            await redis.srem(monthKey, visitorId);
        } else {
            await redis.set(`visitor:${visitorId}:details`, JSON.stringify(visitorDetails));
            await redis.sadd(monthKey, visitorId);
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
