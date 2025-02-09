// components/ViewCounter.tsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Eye, Moon } from "lucide-react";
import { pusherClient } from "@/lib/pusher";
import type { VisitorData, PusherError } from "@/types/visitors";
import { v4 as uuidv4 } from "uuid";

interface ViewCounterProps {
  variant?: "mobile" | "tablet" | "desktop";
}

const VISITOR_ID_KEY = "visitor_uuid";
const LAST_STATUS_KEY = "last_visitor_status";

export default function ViewCounter({ variant = "desktop" }: ViewCounterProps) {
  const [mounted, setMounted] = useState(false);
  const [visitorId, setVisitorId] = useState<string>("");
  const [currentStatus, setCurrentStatus] = useState<
    "online" | "idle" | "offline"
  >("offline");
  const [data, setData] = useState<VisitorData>({
    monthlyCount: 0,
    month: "",
    year: new Date().getFullYear(),
    onlineCount: 0,
    idleCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize or get visitor UUID and last status
  useEffect(() => {
    let id = localStorage.getItem(VISITOR_ID_KEY);
    if (!id) {
      id = uuidv4();
      localStorage.setItem(VISITOR_ID_KEY, id);
    }
    setVisitorId(id);

    const lastStatus = localStorage.getItem(LAST_STATUS_KEY) as
      | "online"
      | "idle"
      | null;
    if (lastStatus) {
      setCurrentStatus(lastStatus);
    }
  }, []);

  // Memoized update status function
  const updateStatus = useCallback(
    async (status: "online" | "idle" | "offline") => {
      if (!visitorId) return;

      try {
        setError(null);

        // Only update if status actually changed
        if (status === currentStatus) return;

        setCurrentStatus(status);
        localStorage.setItem(LAST_STATUS_KEY, status);

        const response = await fetch("/api/visitors/realtime", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Visitor-ID": visitorId,
          },
          body: JSON.stringify({ status }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to update status");
        }

        const result = await response.json();
        if (result.data) {
          setData(result.data);
        }
      } catch (error) {
        console.error("Error updating status:", error);
        setError(
          error instanceof Error ? error.message : "Unknown error occurred",
        );
      }
    },
    [visitorId, currentStatus],
  );

  // Handle tab/window close
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (visitorId) {
        localStorage.removeItem(LAST_STATUS_KEY);
        const data = JSON.stringify({ status: "offline" });
        navigator.sendBeacon(
          `/api/visitors/realtime?visitorId=${visitorId}`,
          data,
        );
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [visitorId]);

  // Handle visibility change
  const handleVisibilityChange = useCallback(() => {
    if (document.visibilityState === "visible") {
      updateStatus("online");
    } else {
      // Only go idle if we were previously online
      if (currentStatus === "online") {
        updateStatus("idle");
      }
    }
  }, [updateStatus, currentStatus]);

  // Setup effect
  useEffect(() => {
    if (!visitorId) return;

    let mounted = true;
    let retryCount = 0;
    const maxRetries = 3;

    const setupPusher = () => {
      try {
        const channel = pusherClient.subscribe("visitors-channel");

        channel.bind("visitor-update", (newData: VisitorData) => {
          if (mounted) {
            setData(newData);
            setLoading(false);
          }
        });

        channel.bind("pusher:subscription_error", (error: PusherError) => {
          console.error("Pusher subscription error:", error);
          if (retryCount < maxRetries) {
            retryCount++;
            setTimeout(setupPusher, 2000 * retryCount);
          }
        });

        return channel;
      } catch (error) {
        console.error("Error setting up Pusher:", error);
        return null;
      }
    };

    const channel = setupPusher();

    // Initial status update based on visibility
    if (document.visibilityState === "visible") {
      updateStatus("online");
    } else {
      updateStatus("idle");
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    setMounted(true);

    return () => {
      mounted = false;
      if (channel) {
        channel.unbind_all();
        pusherClient.unsubscribe("visitors-channel");
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      updateStatus("offline");
    };
  }, [handleVisibilityChange, updateStatus, visitorId]);

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
        {error ? (
          <div className="text-xs text-red-500">Error loading data</div>
        ) : (
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
        )}
      </div>
    </div>
  );
}
