"use client";

import React, { useEffect, useState } from "react";
import { Eye } from "lucide-react";

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

  useEffect(() => {
    let eventSource: EventSource | null = null;
    let retryCount = 0;
    const maxRetries = 5;

    const setupSSE = () => {
      if (retryCount >= maxRetries) {
        console.error("Max retries reached");
        return;
      }

      if (eventSource) {
        eventSource.close();
      }

      eventSource = new EventSource("/api/visitors/sse");

      eventSource.onmessage = (event) => {
        try {
          const newData = JSON.parse(event.data);
          setData(newData);
          setLoading(false);
          retryCount = 0; // Reset retry count on successful connection
        } catch (error) {
          console.error("Error parsing SSE data:", error);
        }
      };

      eventSource.onerror = (error) => {
        console.error("SSE Error:", error);
        eventSource?.close();
        retryCount++;

        // Exponential backoff for retry
        const retryDelay = Math.min(1000 * Math.pow(2, retryCount), 30000);
        setTimeout(setupSSE, retryDelay);
      };
    };

    setupSSE();
    setMounted(true);

    // Handle tab close atau navigasi away
    const handleOffline = async () => {
      if (eventSource) {
        eventSource.close();
      }
      try {
        await fetch("/api/visitors/offline", {
          method: "POST",
          keepalive: true,
        });
      } catch (error) {
        console.error("Error marking offline:", error);
      }
    };

    window.addEventListener("beforeunload", handleOffline);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        handleOffline();
      } else {
        setupSSE();
      }
    });

    return () => {
      window.removeEventListener("beforeunload", handleOffline);
      if (eventSource) {
        eventSource.close();
      }
      handleOffline();
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
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500"></div>
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
