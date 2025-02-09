// components/ViewCounter.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Eye, Moon } from "lucide-react";
import { pusherClient } from "@/lib/pusher";
import type { VisitorData } from "@/types/visitors";

interface ViewCounterProps {
  variant?: "mobile" | "tablet" | "desktop";
}

export default function ViewCounter({ variant = "desktop" }: ViewCounterProps) {
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<VisitorData>({
    monthlyCount: 0,
    month: "",
    year: new Date().getFullYear(),
    onlineCount: 0,
    idleCount: 0,
  });
  const [loading, setLoading] = useState(true);

  async function updateStatus(status: "online" | "idle") {
    try {
      await fetch("/api/visitors/realtime", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  }

  useEffect(() => {
    // Setup visibility change handler
    const handleVisibilityChange = () => {
      const status = document.visibilityState === "visible" ? "online" : "idle";
      updateStatus(status);
    };

    // Setup Pusher
    const channel = pusherClient.subscribe("visitors-channel");
    channel.bind("visitor-update", (newData: VisitorData) => {
      setData(newData);
      setLoading(false);
    });

    // Initial status update
    if (document.visibilityState === "visible") {
      updateStatus("online");
    }

    // Add event listeners
    document.addEventListener("visibilitychange", handleVisibilityChange);

    setMounted(true);

    // Cleanup
    return () => {
      channel.unbind("visitor-update");
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
          <div className="flex items-center gap-1.5 border-l border-neutral-200 pl-2">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
            <span
              className={`text-neutral-400 ${
                variant === "mobile" ? "text-[10px]" : "text-xs"
              }`}
            >
              {loading ? (
                <span className="animate-pulse">...</span>
              ) : (
                data.onlineCount
              )}
            </span>
            <div className="ml-2 border-l border-neutral-200" />
            <div className="flex items-center gap-1.5 pl-2">
              <Moon
                size={variant === "mobile" ? 12 : 14}
                className="text-yellow-400"
              />
              <span
                className={`text-neutral-400 ${
                  variant === "mobile" ? "text-[10px]" : "text-xs"
                }`}
              >
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
