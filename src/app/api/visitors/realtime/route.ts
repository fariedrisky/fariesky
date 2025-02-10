import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { pusherServer } from "@/lib/pusher";

interface StatusChangeRequest {
    status: 'online' | 'offline';
    isNewVisit: boolean;
}

interface VisitorData {
    monthlyCount: number;
    month: string;
    year: number;
    onlineCount: number;
}

const redis = new Redis({
    url: process.env.KV_REST_API_URL || '',
    token: process.env.KV_REST_API_TOKEN || '',
});

interface VisitorDetails {
    id: string;
    lastSeen: string;
    status: 'online' | 'offline';
}

function getCurrentMonthKey(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

async function cleanupInactiveVisitors(): Promise<void> {
    try {
        const monthKey = getCurrentMonthKey();
        const now = new Date();
        const onlineKey = `online:${monthKey}`;

        // Get all online visitors
        const onlineVisitors = await redis.smembers(onlineKey);

        for (const visitorId of onlineVisitors) {
            const visitorKey = `visitor:${visitorId}`;
            const details = await redis.get(visitorKey);

            if (!details) {
                await redis.srem(onlineKey, visitorId);
                continue;
            }

            const visitorDetails = JSON.parse(details as string) as VisitorDetails;
            const lastSeen = new Date(visitorDetails.lastSeen);
            const timeDiff = Math.floor((now.getTime() - lastSeen.getTime()) / 1000);

            if (timeDiff > 35) { // 35 seconds timeout
                await redis.srem(onlineKey, visitorId);
                await redis.del(visitorKey);
            }
        }
    } catch (error) {
        console.error('Error in cleanupInactiveVisitors:', error);
    }
}

async function updateVisitorStatus(
    visitorId: string,
    status: 'online' | 'offline',
    isNewVisit: boolean
): Promise<void> {
    try {
        const monthKey = getCurrentMonthKey();
        const now = new Date();
        const onlineKey = `online:${monthKey}`;
        const visitorKey = `visitor:${visitorId}`;

        if (status === 'online') {
            // Only add to monthly visitors if it's a new visit
            if (isNewVisit) {
                await redis.sadd(`visitors:${monthKey}`, visitorId);
            }

            // Update visitor details
            const visitorDetails: VisitorDetails = {
                id: visitorId,
                lastSeen: now.toISOString(),
                status
            };

            await redis.set(visitorKey, JSON.stringify(visitorDetails));
            await redis.sadd(onlineKey, visitorId);
        } else {
            // Remove from online users
            await redis.srem(onlineKey, visitorId);
            await redis.del(visitorKey);
        }
    } catch (error) {
        console.error('Error in updateVisitorStatus:', error);
        throw error;
    }
}

async function getVisitorData(): Promise<VisitorData> {
    try {
        const monthKey = getCurrentMonthKey();
        const now = new Date();

        // Clean up inactive visitors before counting
        await cleanupInactiveVisitors();

        const [uniqueVisitors, onlineUsers] = await Promise.all([
            redis.scard(`visitors:${monthKey}`),
            redis.scard(`online:${monthKey}`)
        ]);

        return {
            monthlyCount: uniqueVisitors,
            month: now.toLocaleString('default', { month: 'short' }),
            year: now.getFullYear(),
            onlineCount: onlineUsers
        };
    } catch (error) {
        console.error('Error in getVisitorData:', error);
        throw error;
    }
}

async function cleanupPreviousMonth(): Promise<void> {
    const now = new Date();
    if (now.getDate() === 1) {
        const prevMonth = new Date(now);
        prevMonth.setMonth(now.getMonth() - 1);
        const prevMonthKey = `${prevMonth.getFullYear()}-${String(prevMonth.getMonth() + 1).padStart(2, '0')}`;

        try {
            await Promise.all([
                redis.del(`visitors:${prevMonthKey}`),
                redis.del(`online:${prevMonthKey}`)
            ]);
        } catch (error) {
            console.error('Error cleaning up previous month:', error);
        }
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
        const { status, isNewVisit } = body as StatusChangeRequest;

        await Promise.all([
            cleanupPreviousMonth(),
            updateVisitorStatus(visitorId, status, isNewVisit)
        ]);

        const visitorData = await getVisitorData();
        await pusherServer.trigger('visitors-channel', 'visitor-update', visitorData);

        return NextResponse.json({
            success: true,
            data: visitorData
        });
    } catch (error) {
        console.error('Error in POST handler:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown server error';
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
