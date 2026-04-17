// src/layouts/DashboardLayout.jsx
import React from "react";
import { Link, Outlet } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen flex bg-[#071028] text-gray-200">
      <Sidebar />
      <div className="flex-1 p-6 lg:p-10">
        {/* optional header */}
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <p className="text-sm text-gray-400 mt-1">Overview & quick access</p>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-3 py-2 bg-[#0b1220] border border-gray-700 rounded-md text-sm hover:bg-[#0f1724]">
              Invite Friends
            </button>

            <Link to='/dashboard/profile'>
            <div className="w-10 h-10 rounded-full bg-[#111827] flex items-center justify-center">
              👤
            </div>
            </Link>
          </div>
        </header>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
