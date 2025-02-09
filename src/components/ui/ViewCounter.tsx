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
}

export default function ViewCounter({ variant }: ViewCounterProps) {
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<ViewCounterData>({
    count: 0,
    monthlyCount: 0,
    month: "",
    year: new Date().getFullYear(),
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        const response = await fetch("/api/visitors", {
          // Tambahkan cache: 'no-store' untuk memastikan data selalu fresh
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch visitors data");
        }

        const visitorData = await response.json();
        setData(visitorData);
      } catch (error) {
        console.error("Error fetching visitors:", error);
      } finally {
        setLoading(false);
      }
    };

    // Panggil fetchVisitors saat komponen mount
    fetchVisitors();

    // Set interval untuk memperbarui data setiap 5 menit
    const intervalId = setInterval(fetchVisitors, 5 * 60 * 1000);

    setMounted(true);

    // Cleanup interval saat komponen unmount
    return () => clearInterval(intervalId);
  }, []);

  // Jangan render apa-apa sampai komponen mount
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
        </div>
      </div>
    </div>
  );
}
