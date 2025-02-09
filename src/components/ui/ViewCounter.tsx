"use client";

import React, { useEffect, useState } from "react";
import { Eye } from "lucide-react";

interface ViewCounterProps {
  variant?: "mobile" | "tablet" | "desktop";
}

export default function ViewCounter({ variant }: ViewCounterProps) {
  const [mounted, setMounted] = useState(false);
  const [views, setViews] = useState(0);
  const [currentMonth, setCurrentMonth] = useState("");

  useEffect(() => {
    setMounted(true);

    const now = new Date();
    const month = now.toLocaleString("default", { month: "short" });
    const year = now.getFullYear();
    const monthKey = `${year}-${now.getMonth() + 1}`;

    setCurrentMonth(`${month} ${year}`);

    const storedData = localStorage.getItem("monthlyPageViews");
    const viewsData = storedData ? JSON.parse(storedData) : {};
    const today = now.toISOString().split("T")[0];

    if (!viewsData[monthKey]) {
      viewsData[monthKey] = {
        count: 1,
        lastVisit: today,
      };
      setViews(1);
    } else if (viewsData[monthKey].lastVisit !== today) {
      viewsData[monthKey] = {
        count: viewsData[monthKey].count + 1,
        lastVisit: today,
      };
      setViews(viewsData[monthKey].count);
    } else {
      setViews(viewsData[monthKey].count);
    }

    localStorage.setItem("monthlyPageViews", JSON.stringify(viewsData));
  }, []);

  if (!mounted) return null;

  return (
    <div
      className={`fixed z-50 transition-all duration-300 ease-in-out ${variant === "mobile" ? "bottom-3 right-3" : "bottom-4 right-4"} `}
    >
      <div
        className={`border border-neutral-200/50 bg-white/90 shadow-lg backdrop-blur-sm transition-all duration-300 ease-in-out hover:bg-white ${
          variant === "mobile"
            ? "rounded-lg px-2.5 py-1.5"
            : "rounded-full px-4 py-2"
        } `}
      >
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-1.5 text-neutral-600 ${variant === "mobile" ? "text-xs" : "text-sm"} `}
          >
            <Eye
              size={variant === "mobile" ? 14 : 16}
              className="text-neutral-500"
            />
            <span className="font-medium">{views.toLocaleString()}</span>
          </div>
          <div
            className={`border-l border-neutral-200 pl-2 text-neutral-400 ${variant === "mobile" ? "text-[10px]" : "text-xs"} `}
          >
            {currentMonth}
          </div>
        </div>
      </div>
    </div>
  );
}
