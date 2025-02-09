// components/ViewCounter.tsx
"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { Eye, Moon } from "lucide-react";
import { pusherClient } from "@/lib/pusher";
import type { VisitorData } from "@/types/visitors";
import { v4 as uuidv4 } from "uuid";

interface ViewCounterProps {
  variant?: "mobile" | "tablet" | "desktop";
}

const VISITOR_ID_KEY = "visitor_uuid";
const LAST_STATUS_KEY = "last_visitor_status";
const STATUS_UPDATE_DEBOUNCE = 200;

export default function ViewCounter({ variant = "desktop" }: ViewCounterProps) {
  const [isLoaded, setIsLoaded] = useState(false);
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

  // Use refs instead of state for timeouts
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(false);

  // Initialize visitor ID only once
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
    async (status: "online" | "idle" | "offline") => {
      if (!visitorId || !mountedRef.current) return;
      if (status === currentStatus) return;

      try {
        setError(null);
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
        if (result.data && mountedRef.current) {
          setData(result.data);
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

  const debouncedStatusUpdate = useCallback(
    (status: "online" | "idle" | "offline") => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(() => {
        updateStatus(status);
      }, STATUS_UPDATE_DEBOUNCE);
    },
    [updateStatus],
  );

  const handleVisibilityChange = useCallback(() => {
    if (!mountedRef.current) return;

    const isVisible = document.visibilityState === "visible";
    const isFocused = document.hasFocus();

    if (isVisible && isFocused) {
      debouncedStatusUpdate("online");
    } else {
      debouncedStatusUpdate("idle");
    }
  }, [debouncedStatusUpdate]);

  // Setup Pusher and event listeners
  useEffect(() => {
    if (!visitorId) return;

    const channel = pusherClient.subscribe("visitors-channel");

    channel.bind("visitor-update", (newData: VisitorData) => {
      if (mountedRef.current) {
        setData(newData);
        setLoading(false);
      }
    });

    // Initial status check
    if (document.visibilityState === "visible" && document.hasFocus()) {
      debouncedStatusUpdate("online");
    } else {
      debouncedStatusUpdate("idle");
    }

    // Event listeners
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", () => debouncedStatusUpdate("online"));
    window.addEventListener("blur", () => debouncedStatusUpdate("idle"));

    setIsLoaded(true);

    // Cleanup
    return () => {
      channel.unbind_all();
      pusherClient.unsubscribe("visitors-channel");
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", () =>
        debouncedStatusUpdate("online"),
      );
      window.removeEventListener("blur", () => debouncedStatusUpdate("idle"));

      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      if (mountedRef.current) {
        updateStatus("offline");
      }
    };
  }, [visitorId, handleVisibilityChange, debouncedStatusUpdate, updateStatus]);

  if (!isLoaded) return null;

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
