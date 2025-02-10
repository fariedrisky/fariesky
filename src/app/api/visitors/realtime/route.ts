// app/api/visitors/realtime/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { pusherServer } from "@/lib/pusher";

interface StatusChangeRequest {
    status: 'online' | 'offline';
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

async function updateVisitorStatus(
    visitorId: string,
    status: 'online' | 'offline'
): Promise<void> {
    const monthKey = getCurrentMonthKey();
    const now = new Date();

    try {
        // Handle online status
        if (status === 'online') {
            // Add to online users set
            await redis.sadd(`online:${monthKey}`, visitorId);

            // Add to unique monthly visitors
            await redis.sadd(`visitors:${monthKey}`, visitorId);

            // Update online status
            const visitorDetails: VisitorDetails = {
                id: visitorId,
                lastSeen: now.toISOString(),
                status
            };
            await redis.set(`visitor:${visitorId}`, JSON.stringify(visitorDetails));
        } else {
            // Remove from online users
            await redis.srem(`online:${monthKey}`, visitorId);
            await redis.del(`visitor:${visitorId}`);
        }
    } catch (error) {
        console.error('Error updating visitor status:', error);
        throw error;
    }
}

async function cleanupPreviousMonth(): Promise<void> {
    const now = new Date();
    // Only run on the first day of the month
    if (now.getDate() === 1) {
        const prevMonth = new Date(now);
        prevMonth.setMonth(now.getMonth() - 1);
        const prevMonthKey = `${prevMonth.getFullYear()}-${String(prevMonth.getMonth() + 1).padStart(2, '0')}`;

        // Delete previous month's data
        await redis.del(`visitors:${prevMonthKey}`);
        await redis.del(`online:${prevMonthKey}`);
    }
}

async function getVisitorData(): Promise<VisitorData> {
    const monthKey = getCurrentMonthKey();
    const now = new Date();

    try {
        await cleanupPreviousMonth();

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
        console.error('Error getting visitor data:', error);
        return {
            monthlyCount: 0,
            month: now.toLocaleString('default', { month: 'short' }),
            year: now.getFullYear(),
            onlineCount: 0
        };
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
