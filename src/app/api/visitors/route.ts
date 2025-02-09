import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "data", "visitors.json");

// Ensure data directory exists
const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

// Ensure visitors.json exists
if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify({}));
}

export async function GET(request: NextRequest) {
    try {
        const data = JSON.parse(fs.readFileSync(dataFilePath, "utf-8"));

        const now = new Date();
        const monthKey = `${now.getFullYear()}-${now.getMonth() + 1}`;
        const today = now.toISOString().split("T")[0];

        if (!data[monthKey]) {
            data[monthKey] = {
                count: 1,
                dailyVisitors: { [today]: [request.headers.get("user-agent")] }
            };
        } else {
            const dailyVisitors = new Set(data[monthKey].dailyVisitors[today] || []);
            const userAgent = request.headers.get("user-agent");

            if (userAgent && !dailyVisitors.has(userAgent)) {
                dailyVisitors.add(userAgent);
                data[monthKey].count += 1;
            }

            data[monthKey].dailyVisitors[today] = Array.from(dailyVisitors);
        }

        fs.writeFileSync(dataFilePath, JSON.stringify(data));

        return NextResponse.json({
            count: data[monthKey].count,
            month: now.toLocaleString("default", { month: "short" }),
            year: now.getFullYear()
        });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
