import { NextRequest, NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";
import { Redis } from "@upstash/redis";

const redis = new Redis({
    url: process.env.KV_REST_API_URL || '',
    token: process.env.KV_REST_API_TOKEN || '',
});

export async function POST(request: NextRequest) {
    try {
        // Generate or get visitor ID
        const userId = request.cookies.get('visitor_id')?.value ||
            Math.random().toString(36).substring(7);
        const onlineKey = `online:${userId}`;

        // Mark user as online with 30 second expiry
        await redis.set(onlineKey, new Date().toISOString(), { ex: 30 });

        // Get current date info
        const now = new Date();
        const monthKey = `visitors:${now.getFullYear()}-${now.getMonth() + 1}`;

        // Increment monthly and total counters if new visitor
        if (!request.cookies.get('visitor_id')) {
            await Promise.all([
                redis.incr('visitors:total'),
                redis.incr(monthKey)
            ]);
        }

        // Get current counts
        const [monthlyCount, totalCount] = await Promise.all([
            redis.get<number>(monthKey) || 0,
            redis.get<number>('visitors:total') || 0,
        ]);

        // Get online users count
        const onlineUsers = await redis.keys('online:*');

        const visitorData = {
            count: totalCount,
            monthlyCount,
            month: now.toLocaleString("default", { month: "short" }),
            year: now.getFullYear(),
            onlineCount: onlineUsers.length
        };

        // Trigger Pusher event with updated data
        await pusherServer.trigger('visitors-channel', 'visitor-update', visitorData);

        // Prepare response
        const response = NextResponse.json({ success: true });

        // Set cookie for new visitors
        if (!request.cookies.get('visitor_id')) {
            response.cookies.set('visitor_id', userId, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 365 // 1 year
            });
        }

        return response;
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const userId = request.cookies.get('visitor_id')?.value;
        if (userId) {
            // Remove user from online list
            await redis.del(`online:${userId}`);

            // Get updated counts
            const now = new Date();
            const monthKey = `visitors:${now.getFullYear()}-${now.getMonth() + 1}`;

            const [monthlyCount, totalCount, onlineUsers] = await Promise.all([
                redis.get<number>(monthKey) || 0,
                redis.get<number>('visitors:total') || 0,
                redis.keys('online:*')
            ]);

            const visitorData = {
                count: totalCount,
                monthlyCount,
                month: now.toLocaleString("default", { month: "short" }),
                year: now.getFullYear(),
                onlineCount: onlineUsers.length
            };

            // Trigger update
            await pusherServer.trigger('visitors-channel', 'visitor-update', visitorData);
        }
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
