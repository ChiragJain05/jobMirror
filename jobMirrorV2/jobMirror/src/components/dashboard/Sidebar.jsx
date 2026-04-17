// src/components/dashboard/Sidebar.jsx
import React from "react";
import { Link, NavLink } from "react-router-dom";

const linkClass = ({ isActive }) =>
  `block py-2 px-3 rounded-lg transition flex items-center gap-3 ${
    isActive ? "bg-[#0b1220] text-blue-400 border border-blue-600" : "text-gray-300 hover:bg-[#0b1220]"
  }`;

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-[#0a0f1e] border-r border-gray-800 text-gray-200 p-6">
      
      <Link to='/'>
      <div className="text-2xl font-bold mb-8 tracking-tight">
        Job<span className="text-blue-500">Mirror</span>
      </div>
      </Link>

      <nav className="space-y-2">
        <NavLink to="/dashboard" className={linkClass} end>
          <span>📊</span>
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/dashboard/profile" className={linkClass}>
          <span>👤</span>
          <span>Profile</span>
        </NavLink>

        <NavLink to="/dashboard/interviews" className={linkClass}>
          <span>🎯</span>
          <span>Interviews</span>
        </NavLink>

        <NavLink to="/dashboard/learning" className={linkClass}>
          <span>📚</span>
          <span>Learning</span>
        </NavLink>

        <div className="mt-6 border-t border-gray-800 pt-4">
          <button className="w-full text-left py-2 px-3 rounded-lg text-sm bg-[#111827] hover:bg-[#0f1724]">Settings</button>
        </div>
      </nav>
    </aside>
  );
}
