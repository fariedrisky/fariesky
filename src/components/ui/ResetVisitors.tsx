// components/ResetVisitors.tsx
"use client";

import React, { useState } from "react";

const ResetVisitors = () => {
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!confirm("Are you sure you want to reset all visitor data?")) return;

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
        // No need to reload the page as Pusher will update the UI
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
        className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-lg transition-all duration-200 hover:bg-gray-50 disabled:opacity-50"
      >
        {loading ? "Resetting..." : "Reset Visitor Data"}
      </button>
    </div>
  );
};

export default ResetVisitors;
