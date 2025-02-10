// components/ViewCounter.tsx
"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { Eye, User } from "lucide-react";
import { pusherClient } from "@/lib/pusher";
import type { VisitorData } from "@/types/visitors";
import { v4 as uuidv4 } from "uuid";

interface ViewCounterProps {
  variant?: "mobile" | "tablet" | "desktop";
}

const VISITOR_ID_KEY = "visitor_uuid";

export default function ViewCounter({ variant = "desktop" }: ViewCounterProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [visitorId, setVisitorId] = useState<string>("");
  const [currentStatus, setCurrentStatus] = useState<"online" | "offline">(
    "offline",
  );
  const [data, setData] = useState<VisitorData>({
    monthlyCount: 0,
    month: "",
    year: new Date().getFullYear(),
    onlineCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mountedRef = useRef(false);

  useEffect(() => {
    let id = localStorage.getItem(VISITOR_ID_KEY);
    if (!id) {
      id = uuidv4();
      localStorage.setItem(VISITOR_ID_KEY, id);
    }
    setVisitorId(id);
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  const updateStatus = useCallback(
    async (status: "online" | "offline") => {
      if (!visitorId || !mountedRef.current) return;
      if (status === currentStatus) return;

      try {
        setError(null);
        setCurrentStatus(status);

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
        if (result.data && mountedRef.current) {
          setData(result.data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error updating status:", error);
        if (mountedRef.current) {
          setError(
            error instanceof Error ? error.message : "Unknown error occurred",
          );
        }
      }
    },
    [visitorId, currentStatus],
  );

  const handleVisibilityChange = useCallback(() => {
    if (!mountedRef.current) return;

    const status =
      document.visibilityState === "visible" ? "online" : "offline";
    updateStatus(status);
  }, [updateStatus]);

  useEffect(() => {
    if (!visitorId) return;

    const channel = pusherClient.subscribe("visitors-channel");

    channel.bind("visitor-update", (newData: VisitorData) => {
      if (mountedRef.current) {
        setData(newData);
        setLoading(false);
      }
    });

    // Set initial status
    const initialStatus =
      document.visibilityState === "visible" ? "online" : "offline";
    updateStatus(initialStatus);

    // Add event listeners
    document.addEventListener("visibilitychange", handleVisibilityChange);

    setIsLoaded(true);

    return () => {
      channel.unbind_all();
      pusherClient.unsubscribe("visitors-channel");
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      if (mountedRef.current) {
        updateStatus("offline");
      }
    };
  }, [visitorId, handleVisibilityChange, updateStatus]);

  if (!isLoaded) return null;

  return (
    <div
      className={`fixed z-50 ${variant === "mobile" ? "bottom-3 right-3" : "bottom-4 right-4"}`}
    >
      <div
        className={`group flex items-center gap-2.5 rounded-full bg-white/95 px-3 py-1.5 shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-white ${
          variant === "mobile" ? "text-xs" : "text-sm"
        }`}
      >
        {error ? (
          <div className="flex items-center gap-1.5 text-xs text-red-500">
            <div className="h-1 w-1 rounded-full bg-red-500" />
            Error
          </div>
        ) : (
          <>
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
                  {data.monthlyCount} View in {data.month} {data.year}
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
          </>
        )}
      </div>
    </div>
  );
}
