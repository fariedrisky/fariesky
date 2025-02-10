// components/ResetVisitors.tsx
"use client";

import React, { useState } from "react";
import { Trash2 } from "lucide-react";

const ResetVisitors = () => {
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (
      !confirm(
        "Are you sure you want to reset all visitor data? This action cannot be undone.",
      )
    )
      return;

    setLoading(true);
    try {
      const res = await fetch("/api/visitors/reset", {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Failed to reset visitor data");
      }

      const data = await res.json();

      if (data.success) {
        alert("Visitor data has been reset successfully");
      }
    } catch (error) {
      console.error("Error resetting data:", error);
      alert("Failed to reset visitor data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button
        onClick={handleReset}
        disabled={loading}
        className="flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-medium text-red-600 shadow-lg transition-all duration-200 hover:bg-red-50 disabled:opacity-50"
      >
        <Trash2 size={16} />
        {loading ? "Resetting..." : "Reset Visitors"}
      </button>
    </div>
  );
};

export default ResetVisitors;
