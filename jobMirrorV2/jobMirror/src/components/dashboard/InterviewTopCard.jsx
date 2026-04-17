// src/components/dashboard/InterviewTopCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * Interactive top card that navigates to a route when clicked.
 * Props:
 *  - title: string
 *  - desc: string
 *  - route: string (e.g. "/dashboard/interviews/technical")
 */
export default function InterviewTopCard({
  title,
  desc,
  route = "/dashboard/interviews/technical",
}) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(route)}
      className={`
        group relative w-full text-left p-5 rounded-xl
        bg-[#0b1220] border border-gray-800
        hover:scale-[1.02] transition-transform duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600
      `}
      aria-label={`${title} — open`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm text-gray-400">Category</div>
          <h3 className="mt-1 text-lg font-semibold text-gray-100">{title}</h3>
          <p className="mt-2 text-sm text-gray-400 max-w-xl">{desc}</p>
        </div>

        {/* right arrow: slides in on hover */}
        <div className="flex items-center">
          <span
            className="translate-x-0 group-hover:translate-x-2 transition-transform duration-200 text-blue-400"
            aria-hidden
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              className="opacity-90"
            >
              <path
                d="M5 12h14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 5l7 7-7 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </div>
    </button>
  );
}
