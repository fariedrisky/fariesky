import { NextRequest } from "next/server";
import { Redis } from "@upstash/redis";

const redis = new Redis({
    url: process.env.KV_REST_API_URL || '',
    token: process.env.KV_REST_API_TOKEN || '',
});

export const runtime = 'edge';
export const preferredRegion = 'sin1';
export const dynamic = 'force-dynamic';

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
        // Send initial data
        const initialData = await getVisitorData();
        const initialDataString = `data: ${JSON.stringify(initialData)}\n\n`;
        await writer.write(encoder.encode(initialDataString));

        // Kirim ping setiap 15 detik untuk menjaga koneksi
        const pingInterval = setInterval(async () => {
            await writer.write(encoder.encode(": ping\n\n"));
        }, 15000);

        // Update data setiap 30 detik
        const updateInterval = setInterval(async () => {
            try {
                const data = await getVisitorData();
                const dataString = `data: ${JSON.stringify(data)}\n\n`;
                await writer.write(encoder.encode(dataString));
            } catch (error) {
                console.error('Error sending SSE update:', error);
            }
        }, 30000);

        // Cleanup on client disconnect
        request.signal.addEventListener('abort', async () => {
            clearInterval(pingInterval);
            clearInterval(updateInterval);
            await redis.del(onlineKey);
            writer.close();
        });

        return new Response(stream.readable, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache, no-transform',
                'Connection': 'keep-alive',
                'X-Accel-Buffering': 'no'
            },
        });
    } catch (error) {
        console.error('SSE Error:', error);
        return new Response('Error', { status: 500 });
    }
}
