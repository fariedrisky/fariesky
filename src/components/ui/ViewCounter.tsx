"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Eye, User } from "lucide-react";
import { pusherClient } from "@/lib/pusher";
import { v4 as uuidv4 } from "uuid";

interface ViewCounterProps {
  variant?: "mobile" | "tablet" | "desktop";
}

interface VisitorData {
  monthlyCount: number;
  month: string;
  year: number;
  onlineCount: number;
}

const DEVICE_ID_KEY = "device_id";
const MONTHLY_VISIT_KEY = "monthly_visit";
const ONLINE_HEARTBEAT_INTERVAL = 20000;

export default function ViewCounter({ variant = "desktop" }: ViewCounterProps) {
  const [data, setData] = useState<VisitorData>({
    monthlyCount: 0,
    month: "",
    year: new Date().getFullYear(),
    onlineCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [deviceId, setDeviceId] = useState<string>("");

  const updateOnlineStatus = useCallback(
    async (isOnline: boolean) => {
      if (!deviceId) return;

      try {
        const now = new Date();
        const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
        const lastVisitMonth = localStorage.getItem(MONTHLY_VISIT_KEY);

        // Consider it a new visit only if this is first visit this month
        const isNewVisit = !lastVisitMonth || lastVisitMonth !== currentMonth;

        const response = await fetch("/api/visitors/realtime", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Device-ID": deviceId,
          },
          body: JSON.stringify({
            status: isOnline ? "online" : "offline",
            isNewVisit,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to update visitor status: ${errorText}`);
        }

        const result = await response.json();
        if (result.data) {
          setData(result.data);
          setLoading(false);

          if (isNewVisit) {
            localStorage.setItem(MONTHLY_VISIT_KEY, currentMonth);
          }
        }
      } catch (error) {
        console.error("Error updating status:", error);
      }
    },
    [deviceId],
  );

  useEffect(() => {
    const setupDevice = () => {
      // Get or create device ID from localStorage
      let id = localStorage.getItem(DEVICE_ID_KEY);
      if (!id) {
        id = uuidv4();
        localStorage.setItem(DEVICE_ID_KEY, id);
      }
      setDeviceId(id);
    };

    setupDevice();
  }, []);

  // Handle visibility change and Pusher setup
  useEffect(() => {
    if (!deviceId) return;

    let heartbeatInterval: NodeJS.Timeout | null = null;

    const handleVisibilityChange = () => {
      const isVisible = document.visibilityState === "visible";
      updateOnlineStatus(isVisible);

      if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
        heartbeatInterval = null;
      }

      if (isVisible) {
        heartbeatInterval = setInterval(() => {
          updateOnlineStatus(true);
        }, ONLINE_HEARTBEAT_INTERVAL);
      }
    };

    // Set up Pusher subscription
    const channel = pusherClient.subscribe("visitors-channel");
    channel.bind("visitor-update", (newData: VisitorData) => {
      setData(newData);
      setLoading(false);
    });

    // Initial online status
    const isInitiallyVisible = document.visibilityState === "visible";
    updateOnlineStatus(isInitiallyVisible);

    if (isInitiallyVisible) {
      heartbeatInterval = setInterval(() => {
        updateOnlineStatus(true);
      }, ONLINE_HEARTBEAT_INTERVAL);
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    window.addEventListener("beforeunload", () => {
      updateOnlineStatus(false);
    });

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
      }
      updateOnlineStatus(false);
      channel.unbind_all();
      pusherClient.unsubscribe("visitors-channel");
    };
  }, [deviceId, updateOnlineStatus]);

  return (
    <div
      className={`fixed z-50 ${variant === "mobile" ? "bottom-3 right-3" : "bottom-4 right-4"}`}
    >
      <div
        className={`group flex items-center gap-2.5 rounded-full bg-white/95 px-3 py-1.5 shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-white ${
          variant === "mobile" ? "text-xs" : "text-sm"
        }`}
      >
        <div className="flex items-center gap-1.5">
          <Eye
            size={variant === "mobile" ? 13 : 14}
            className="text-neutral-400"
            strokeWidth={2}
          />
          {loading ? (
            <span className="animate-pulse text-neutral-400">...</span>
          ) : (
            <span className="whitespace-nowrap text-neutral-600">
              {data.monthlyCount} {data.monthlyCount === 1 ? "View" : "Views"}{" "}
              in {data.month} {data.year}
            </span>
          )}
        </div>
        <div className="h-3 w-[1px] bg-neutral-200" />
        <div className="flex items-center gap-1.5">
          <div className="relative h-1.5 w-1.5">
            <div className="absolute inset-0 animate-ping rounded-full bg-green-500/30" />
            <div className="relative h-1.5 w-1.5 rounded-full bg-green-500" />
          </div>
          <User
            size={variant === "mobile" ? 12 : 13}
            className="text-neutral-400"
            strokeWidth={2}
          />
          <span className="text-neutral-500">
            {loading ? (
              <span className="animate-pulse">...</span>
            ) : (
              data.onlineCount
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
