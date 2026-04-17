import React from "react";

/**
 * Simple stat card
 * Props:
 *  - title: string
 *  - value: string|number
 *  - delta: string (optional)
 */
export default function StatCard({ title, value, delta }) {
  return (
    <div className="bg-[#0b1220] p-5 rounded-xl border border-gray-800 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-gray-400">{title}</div>
          <div className="text-2xl font-semibold mt-2">{value}</div>
        </div>
        <div className={`text-sm font-medium ${delta && delta.startsWith("-") ? "text-red-400" : "text-green-400"}`}>
          {delta ?? "—"}
        </div>
      </div>
      <div className="mt-3 text-xs text-gray-500">Last 30 days</div>
    </div>
  );
}
