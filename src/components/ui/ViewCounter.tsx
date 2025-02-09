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
  const [connectionStatus, setConnectionStatus] = useState<ConnectionState>("connecting");
  const [idleTimer, setIdleTimer] = useState<NodeJS.Timeout | null>(null);
  const IDLE_TIMEOUT = 60000; // 1 minute of inactivity

  const getBrowserId = () => {
    const storedId = localStorage.getItem('browser_id');
    if (storedId) return storedId;

    const newId = Math.random().toString(36).substring(7);
    localStorage.setItem('browser_id', newId);
    return newId;
  };

  const resetIdleTimer = () => {
    if (idleTimer) clearTimeout(idleTimer);
    if (connectionStatus === "idle") {
      setConnectionStatus("connected");
      updateVisitorStatus("POST");
    }

    const timer = setTimeout(() => {
      if (document.visibilityState === "visible") {
        setConnectionStatus("idle");
        updateVisitorStatus("POST");
      }
    }, IDLE_TIMEOUT);

    setIdleTimer(timer);
  };

  const updateVisitorStatus = async (method: "POST" | "DELETE") => {
    try {
      const browserId = getBrowserId();
      const response = await fetch("/api/visitors/realtime", {
        method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: connectionStatus,
          browserId
        }),
      });
      
      if (!response.ok) throw new Error("Failed to update visitor status");

      if (method === "POST") {
        setLoading(false);
      }
    } catch (error) {
      console.error("Error updating visitor status:", error);
      setConnectionStatus("disconnected");
    }
  };

  useEffect(() => {
    // Check if another tab of this browser is already connected
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'tab_active' && e.newValue) {
        const currentTab = sessionStorage.getItem('tab_id');
        if (currentTab !== e.newValue) {
          // Another tab is active, don't count this one
          setConnectionStatus("disconnected");
          updateVisitorStatus("DELETE");
        }
      }
    };

    // Generate unique tab ID
    const tabId = Math.random().toString(36).substring(7);
    sessionStorage.setItem('tab_id', tabId);

    // Set this tab as active
    if (document.visibilityState === "visible") {
      localStorage.setItem('tab_active', tabId);
    }

    const channel = pusherClient.subscribe("visitors-channel");
    let heartbeatInterval: NodeJS.Timeout;

    const startHeartbeat = () => {
      updateVisitorStatus("POST");
      heartbeatInterval = setInterval(() => {
        updateVisitorStatus("POST");
      }, 20000);
    };

    const stopHeartbeat = () => {
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
      }
      updateVisitorStatus("DELETE");
    };

    channel.bind("visitor-update", (newData: ViewCounterData) => {
      setData(newData);
      setLoading(false);
    });

    pusherClient.connection.bind("connected", () => {
      if (document.visibilityState === "visible") {
        setConnectionStatus("connected");
        startHeartbeat();
      }
    });

    pusherClient.connection.bind("connecting", () => {
      setConnectionStatus("connecting");
    });

    pusherClient.connection.bind("disconnected", () => {
      setConnectionStatus("disconnected");
      stopHeartbeat();
    });

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        localStorage.setItem('tab_active', tabId);
        setConnectionStatus("connected");
        startHeartbeat();
        resetIdleTimer();
      } else {
        setConnectionStatus("idle");
        stopHeartbeat();
        if (idleTimer) clearTimeout(idleTimer);
      }
    };

    const handleUserActivity = () => {
      if (document.visibilityState === "visible") {
        resetIdleTimer();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("mousemove", handleUserActivity);
    document.addEventListener("keypress", handleUserActivity);
    document.addEventListener("click", handleUserActivity);
    document.addEventListener("scroll", handleUserActivity);

    window.addEventListener("beforeunload", () => {
      localStorage.removeItem('tab_active');
      stopHeartbeat();
    });

    if (document.visibilityState === "visible") {
      startHeartbeat();
      resetIdleTimer();
    }
    
    setMounted(true);

    return () => {
      stopHeartbeat();
      if (idleTimer) clearTimeout(idleTimer);
      localStorage.removeItem('tab_active');
      channel.unbind("visitor-update");
      pusherClient.unsubscribe("visitors-channel");
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("mousemove", handleUserActivity);
      document.removeEventListener("keypress", handleUserActivity);
      document.removeEventListener("click", handleUserActivity);
      document.removeEventListener("scroll", handleUserActivity);
      window.removeEventListener("beforeunload", () => {
        stopHeartbeat();
      });
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
              className={`h-1.5 w-1.5 rounded-full ${
                connectionStatus === "connected"
                  ? "animate-pulse bg-green-500"
                  : connectionStatus === "connecting"
                    ? "animate-pulse bg-yellow-500"
                    : "bg-red-500"
              }`}
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
