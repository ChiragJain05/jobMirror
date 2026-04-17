// src/pages/dashboard/Interviews.jsx
import React from "react";
import InterviewTopCard from "../../components/dashboard/InterviewTopCard";

export default function Interviews() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold">Interviews</h2>
        <p className="text-sm text-gray-400">
          Choose the type of interview you want to prepare for.
        </p>
      </div>

      {/* Top interactive cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InterviewTopCard
          title="Technical Interview"
          desc="Coding problems, DS/Algo rounds, and live code editor sessions."
          route="http://localhost:5174/"
        />

        <InterviewTopCard
          title="Behavioral Interview"
          desc="Practice HR & behavioral questions using STAR structure and get feedback."
          route="http://localhost:5174/"
        />

        <InterviewTopCard
          title="Case Interview"
          desc="Case studies and system-design scenarios — structure your approach clearly."
          route="http://localhost:5174/"
        />
      </section>
    </div>
  );
}
