import { NextRequest } from "next/server";
import { Redis } from "@upstash/redis";

const redis = new Redis({
    url: process.env.KV_REST_API_URL || '',
    token: process.env.KV_REST_API_TOKEN || '',
});

export const runtime = 'edge';
export const preferredRegion = 'sin1';
export const dynamic = 'force-dynamic';

// Set shorter connection time to avoid timeout
const MAX_DURATION = 25000; // 25 seconds

export async function GET(request: NextRequest) {
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();
    const encoder = new TextEncoder();

    // Set user sebagai online
    const userId = request.headers.get("user-agent") || "unknown";
    const onlineKey = `online:${userId}`;
    await redis.set(onlineKey, 1);

    // Function untuk mendapatkan jumlah user online
    const getOnlineUsers = async () => {
        const pattern = "online:*";
        const keys = await redis.keys(pattern);
        return keys.length;
    };

    // Function to get visitor data
    const getVisitorData = async () => {
        const now = new Date();
        const monthKey = `visitors:${now.getFullYear()}-${now.getMonth() + 1}`;
        const [monthlyCount, totalCount, onlineCount] = await Promise.all([
            redis.get<number>(monthKey) || 0,
            redis.get<number>('visitors:total') || 0,
            getOnlineUsers()
        ]);

        return {
            count: totalCount,
            monthlyCount,
            month: now.toLocaleString("default", { month: "short" }),
            year: now.getFullYear(),
            onlineCount
        };
    };

    try {
        const startTime = Date.now();

        // Send initial data
        const initialData = await getVisitorData();
        const initialDataString = `data: ${JSON.stringify(initialData)}\n\n`;
        await writer.write(encoder.encode(initialDataString));

        // Force close after MAX_DURATION
        setTimeout(async () => {
            await redis.del(onlineKey);
            writer.close();
        }, MAX_DURATION);

        // Send updates every 5 seconds until MAX_DURATION
        const interval = setInterval(async () => {
            if (Date.now() - startTime >= MAX_DURATION) {
                clearInterval(interval);
                return;
            }

            try {
                const data = await getVisitorData();
                const dataString = `data: ${JSON.stringify(data)}\n\n`;
                await writer.write(encoder.encode(dataString));
            } catch (error) {
                console.error('Error sending update:', error);
            }
        }, 5000);

        // Cleanup on client disconnect
        request.signal.addEventListener('abort', async () => {
            clearInterval(interval);
            await redis.del(onlineKey);
            writer.close();
        });

        return new Response(stream.readable, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache, no-transform',
                'Connection': 'keep-alive',
            },
        });
    } catch (error) {
        console.error('SSE Error:', error);
        await redis.del(onlineKey);
        return new Response('Error', { status: 500 });
    }
}
