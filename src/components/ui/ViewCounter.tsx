"use client";

import React, { useEffect, useState } from "react";
import { Eye } from "lucide-react";
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
}

export default function ViewCounter({ variant }: ViewCounterProps) {
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<ViewCounterData>({
    count: 0,
    monthlyCount: 0,
    month: "",
    year: new Date().getFullYear(),
    onlineCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<
    "connected" | "connecting" | "disconnected"
  >("connecting");

  useEffect(() => {
    const channel = pusherClient.subscribe("visitors-channel");

    // Initial data fetch
    fetch("/api/visitors/realtime", { method: "POST" })
      .then((res) => res.json())
      .then(() => {
        setLoading(false);
        setConnectionStatus("connected");
      })
      .catch((error) => {
        console.error("Error fetching initial data:", error);
        setConnectionStatus("disconnected");
      });

    // Listen for real-time updates
    channel.bind("visitor-update", (newData: ViewCounterData) => {
      setData(newData);
      setLoading(false);
      setConnectionStatus("connected");
    });

    // Connection status handling
    pusherClient.connection.bind("connected", () => {
      setConnectionStatus("connected");
    });

    pusherClient.connection.bind("connecting", () => {
      setConnectionStatus("connecting");
    });

    pusherClient.connection.bind("disconnected", () => {
      setConnectionStatus("disconnected");
    });

    // Handle visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetch("/api/visitors/realtime", { method: "POST" }).catch(
          console.error,
        );
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    setMounted(true);

    // Cleanup
    return () => {
      pusherClient.unsubscribe("visitors-channel");
      document.removeEventListener("visibilitychange", handleVisibilityChange);
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
          <div
            className={`flex items-center gap-1.5 border-l border-neutral-200 pl-2 ${
              variant === "mobile" ? "text-[10px]" : "text-xs"
            }`}
          >
            <div
              className={`h-1.5 w-1.5 rounded-full ${
                connectionStatus === "connected"
                  ? "animate-pulse bg-green-500"
                  : connectionStatus === "connecting"
                    ? "animate-pulse bg-yellow-500"
                    : "bg-red-500"
              }`}
            ></div>
            <span className="text-neutral-400">
              {loading ? (
                <span className="animate-pulse">...</span>
              ) : (
                data.onlineCount
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
