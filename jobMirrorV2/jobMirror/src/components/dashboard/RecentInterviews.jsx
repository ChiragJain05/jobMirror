import React from "react";

/* example mock data */
const mock = [
  { id: 1, title: "Binary Tree Traversal", type: "Coding", score: 85, date: "Nov 8" },
  { id: 2, title: "System Design - Queue Service", type: "System Design", score: 72, date: "Nov 3" },
  { id: 3, title: "Behavioral - Team Conflict", type: "Behavioral", score: "N/A", date: "Oct 30" },
];

export default function RecentInterviews({ items = mock }) {
  return (
    <div className="divide-y divide-gray-800">
      {items.map((m) => (
        <div key={m.id} className="py-3 flex items-center justify-between">
          <div>
            <div className="font-medium">{m.title}</div>
            <div className="text-xs text-gray-500">{m.type} • {m.date}</div>
          </div>
          <div className="text-sm font-semibold">
            {typeof m.score === "number" ? <span className="text-green-400">{m.score}%</span> : <span className="text-gray-400">{m.score}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}
