// src/pages/dashboard/DashboardHome.jsx
import React from "react";
import StatCard from "../../components/dashboard/StatCard";
import RecentInterviews from "../../components/dashboard/RecentInterviews.jsx";
import ActivityList from "../../components/dashboard/ActivityList";
import PerformanceChart from "../../components/dashboard/PerformanceChart";
import { Link } from "react-router-dom";


/* example mock stats */
const stats = [
  { title: "Mocks Completed", value: 12, delta: "+20%" },
  { title: "Avg. Score", value: "78%", delta: "+5%" },
  { title: "Challenges Solved", value: 46, delta: "+8%" },
  { title: "Invitations", value: 3, delta: "—" },
];

export default function DashboardHome() {
  return (
    <div className="space-y-8">
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0b1220] p-6 rounded-xl border border-gray-800">
            <h3 className="text-lg font-semibold mb-3">Performance overview</h3>
            <div className="rounded-lg border border-gray-800 bg-[#071226] p-4">
              <PerformanceChart />
            </div>
          </div>

          <div className="bg-[#0b1220] p-6 rounded-xl border border-gray-800">
            <h3 className="text-lg font-semibold mb-3">
              Latest interview results
            </h3>
            <RecentInterviews />
          </div>
        </div>

        <aside className="space-y-6">
          <div className="bg-[#0b1220] p-6 rounded-xl border border-gray-800">
            <h4 className="text-lg font-semibold mb-2">Quick actions</h4>
            <div className="flex flex-col gap-3 mt-3">
              <Link to="/dashboard/interviews ">
                <button className="w-full text-left px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium">
                  Start a mock interview
                </button>
              </Link>
              <Link to='/dashboard/learning'>
                <button className="w-full text-left px-4 py-2 rounded-md bg-[#111827] border border-gray-700 text-gray-200">
                  Review coding submissions
                </button>
              </Link>
            </div>
          </div>

          <div className="bg-[#0b1220] p-6 rounded-xl border border-gray-800">
            <h4 className="text-lg font-semibold mb-2">Recent activity</h4>
            <ActivityList />
          </div>
        </aside>
      </section>
    </div>
  );
}
