// components/ResetVisitors.tsx
"use client";

import { useState } from "react";

export default function ResetVisitors() {
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!confirm("Are you sure you want to reset all visitor data?")) return;

    setLoading(true);
    try {
      const res = await fetch("/api/visitors/reset", {
        method: "POST",
      });
      const data = await res.json();

      if (data.success) {
        alert("Visitor data has been reset successfully");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error resetting data:", error);
      alert("Failed to reset visitor data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleReset}
      disabled={loading}
      className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 disabled:opacity-50"
    >
      {loading ? "Resetting..." : "Reset Visitor Data"}
    </button>
  );
}
