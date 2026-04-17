import React from "react";

const items = [
  { id: 1, text: "Completed mock interview: Binary Tree Traversal", time: "2h ago" },
  { id: 2, text: "Scored 85% on coding challenge", time: "1d ago" },
  { id: 3, text: "Uploaded new resume", time: "3d ago" },
];

export default function ActivityList({ data = items }) {
  return (
    <ul className="space-y-3 text-sm">
      {data.map((it) => (
        <li key={it.id} className="flex items-start gap-3">
          <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
          <div>
            <div className="text-gray-200">{it.text}</div>
            <div className="text-xs text-gray-500 mt-1">{it.time}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}
