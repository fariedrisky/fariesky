"use client";

import React, { useEffect, useState } from "react";
import { Eye, Moon } from "lucide-react";
import { pusherClient } from "@/lib/pusher";

interface ViewCounterProps {
  variant?: "mobile" | "tablet" | "desktop";
}

interface ViewCounterData {
  count: number;
  monthlyCount: number;
  month: string;
  year: number;
  onlineCount: number;
  idleCount: number;
}

type ConnectionState = "connected" | "connecting" | "disconnected" | "idle";

export default function ViewCounter({ variant }: ViewCounterProps) {
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<ViewCounterData>({
    count: 0,
    monthlyCount: 0,
    month: "",
    year: new Date().getFullYear(),
    onlineCount: 0,
    idleCount: 0,
  });
  const [loading, setLoading] = useState(true);

  const getBrowserId = () => {
    const storedId = localStorage.getItem('browser_id');
    if (storedId) return storedId;

    const newId = Math.random().toString(36).substring(7);
    localStorage.setItem('browser_id', newId);
    return newId;
  };

  useEffect(() => {
    const tabId = Math.random().toString(36).substring(7);
    const channel = pusherClient.subscribe("visitors-channel");
    let heartbeatInterval: NodeJS.Timeout;

    const updateVisitorStatus = async (status: ConnectionState) => {
      const browserId = getBrowserId();
      try {
        await fetch("/api/visitors/realtime", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
            browserId,
            action: "status_change"
          }),
        });
        setLoading(false);
      } catch (error) {
        console.error("Error updating visitor status:", error);
        console.error("Connection failed");
      }
    };

    const startHeartbeat = () => {
      updateVisitorStatus(document.visibilityState === "visible" ? "connected" : "idle");
      heartbeatInterval = setInterval(() => {
        updateVisitorStatus(document.visibilityState === "visible" ? "connected" : "idle");
      }, 15000);
    };

    const stopHeartbeat = () => {
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
      }
      const browserId = getBrowserId();
      fetch("/api/visitors/realtime", {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ browserId }),
      });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        localStorage.setItem('tab_active', tabId);
        updateVisitorStatus("connected");
        startHeartbeat();
      } else {
        updateVisitorStatus("idle");
        stopHeartbeat();
      }
    };

    const handleUserActivity = () => {
      if (document.visibilityState === "visible") {
        updateVisitorStatus("connected");
      }
    };

    channel.bind("visitor-update", (newData: ViewCounterData) => {
      setData(newData);
      setLoading(false);
    });

    pusherClient.connection.bind("connected", () => {
      if (document.visibilityState === "visible") {
        startHeartbeat();
      }
    });

    pusherClient.connection.bind("disconnected", () => {
      stopHeartbeat();
    });

    // Add event listeners
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("mousemove", handleUserActivity);
    document.addEventListener("keypress", handleUserActivity);
    document.addEventListener("click", handleUserActivity);
    document.addEventListener("scroll", handleUserActivity);

    window.addEventListener("beforeunload", stopHeartbeat);

    // Initial setup
    if (document.visibilityState === "visible") {
      startHeartbeat();
    }
    setMounted(true);

    // Cleanup
    return () => {
      stopHeartbeat();
      channel.unbind("visitor-update");
      pusherClient.unsubscribe("visitors-channel");
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("mousemove", handleUserActivity);
      document.removeEventListener("keypress", handleUserActivity);
      document.removeEventListener("click", handleUserActivity);
      document.removeEventListener("scroll", handleUserActivity);
      window.removeEventListener("beforeunload", stopHeartbeat);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      className={`fixed z-50 transition-all duration-300 ease-in-out ${
        variant === "mobile" ? "bottom-3 right-3" : "bottom-4 right-4"
      }`}
    >
      <div
        className={`border border-neutral-200/50 bg-white/90 shadow-lg backdrop-blur-sm transition-all duration-300 ease-in-out hover:bg-white ${
          variant === "mobile"
            ? "rounded-lg px-2.5 py-1.5"
            : "rounded-full px-4 py-2"
        }`}
      >
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-1.5 text-neutral-600 ${
              variant === "mobile" ? "text-xs" : "text-sm"
            }`}
          >
            <Eye
              size={variant === "mobile" ? 14 : 16}
              className="text-neutral-500"
            />
            {loading ? (
              <span className="animate-pulse">...</span>
            ) : (
              <span className="font-medium">
                {data.monthlyCount.toLocaleString()}
              </span>
            )}
          </div>
          <div
            className={`border-l border-neutral-200 pl-2 text-neutral-400 ${
              variant === "mobile" ? "text-[10px]" : "text-xs"
            }`}
          >
            {loading ? (
              <span className="animate-pulse">...</span>
            ) : (
              `${data.month} ${data.year}`
            )}
          </div>
          <div className="flex items-center gap-1.5 border-l border-neutral-200 pl-2">
            <div
              className={`h-1.5 w-1.5 rounded-full animate-pulse bg-green-500`}
            />
            <span className={`text-neutral-400 ${
              variant === "mobile" ? "text-[10px]" : "text-xs"
            }`}>
              {loading ? (
                <span className="animate-pulse">...</span>
              ) : (
                data.onlineCount
              )}
            </span>
            <div className="border-l border-neutral-200 ml-2"></div>
            <div className="flex items-center gap-1.5 pl-2">
              <Moon
                size={variant === "mobile" ? 12 : 14}
                className="text-yellow-400"
              />
              <span className={`text-neutral-400 ${
                variant === "mobile" ? "text-[10px]" : "text-xs"
              }`}>
                {loading ? (
                  <span className="animate-pulse">...</span>
                ) : (
                  data.idleCount
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
