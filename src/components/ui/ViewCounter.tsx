"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Eye, User } from "lucide-react";
import { pusherClient } from "@/lib/pusher";
import { v4 as uuidv4 } from "uuid";
import Cookies from "js-cookie";

interface ViewCounterProps {
  variant?: "mobile" | "tablet" | "desktop";
}

interface VisitorData {
  monthlyCount: number;
  month: string;
  year: number;
  onlineCount: number;
}

const VISITOR_ID_KEY = "visitor_id";
const MONTHLY_VISIT_KEY = "monthly_visit";
const ONLINE_HEARTBEAT_INTERVAL = 20000; // 20 seconds

export default function ViewCounter({ variant = "desktop" }: ViewCounterProps) {
  const [data, setData] = useState<VisitorData>({
    monthlyCount: 0,
    month: "",
    year: new Date().getFullYear(),
    onlineCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [visitorId, setVisitorId] = useState<string>("");

  // Function to update online status
  const updateOnlineStatus = useCallback(
    async (isOnline: boolean) => {
      if (!visitorId) return;

      try {
        const now = new Date();
        const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
        const lastVisitMonth = Cookies.get(MONTHLY_VISIT_KEY);
        const isNewVisit = !lastVisitMonth || lastVisitMonth !== currentMonth;

        const response = await fetch("/api/visitors/realtime", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Visitor-ID": visitorId,
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

          // Update monthly visit cookie if it's a new visit
          if (isNewVisit) {
            Cookies.set(MONTHLY_VISIT_KEY, currentMonth, {
              // Set cookie to expire at the end of the month
              expires: new Date(now.getFullYear(), now.getMonth() + 1, 0),
              sameSite: "Strict",
              path: "/",
            });
          }
        }
      } catch (error) {
        console.error("Error updating status:", error);
      }
    },
    [visitorId],
  );

  // Initial setup
  useEffect(() => {
    const setupVisitor = () => {
      // Get or create visitor ID (persists for 1 year)
      let id = Cookies.get(VISITOR_ID_KEY);
      if (!id) {
        id = uuidv4();
        Cookies.set(VISITOR_ID_KEY, id, {
          expires: 365,
          sameSite: "Strict",
          path: "/",
        });
      }
      setVisitorId(id);
    };

    setupVisitor();
  }, []);

  // Handle visibility change and cleanup
  useEffect(() => {
    if (!visitorId) return;

    let heartbeatInterval: NodeJS.Timeout | null = null;

    // Function to handle visibility change
    const handleVisibilityChange = () => {
      const isVisible = document.visibilityState === "visible";
      updateOnlineStatus(isVisible);

      // Clear existing heartbeat
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
        heartbeatInterval = null;
      }

      // Set up new heartbeat if online
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

    // Initial online status based on visibility
    const isInitiallyVisible = document.visibilityState === "visible";
    updateOnlineStatus(isInitiallyVisible);

    if (isInitiallyVisible) {
      heartbeatInterval = setInterval(() => {
        updateOnlineStatus(true);
      }, ONLINE_HEARTBEAT_INTERVAL);
    }

    // Add visibility change listener
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Handle tab/window close
    window.addEventListener("beforeunload", () => {
      updateOnlineStatus(false);
    });

    // Cleanup
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
      }
      updateOnlineStatus(false);
      channel.unbind_all();
      pusherClient.unsubscribe("visitors-channel");
    };
  }, [visitorId, updateOnlineStatus]);

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
