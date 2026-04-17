// src/pages/Learning.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Learning() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Learning</h2>
        <p className="text-sm text-gray-400">
          Roadmaps, quizzes and micro-lessons to level up.
        </p>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Link
          to="/learning/roadmap"
          className="group block p-6 rounded-xl bg-[#0b1220] border border-gray-800 hover:scale-[1.02] transition"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Roadmap</h3>
              <p className="text-sm text-gray-300 mt-2 max-w-md">
                Guided learning paths for frontend, backend, systems, and
                interviews — curated milestones, resources and exercises.
              </p>
            </div>
            <div className="text-blue-400 ml-4 text-2xl">→</div>
          </div>
        </Link>

        <Link
          to="/learning/quiz"
          className="group block p-6 rounded-xl bg-[#0b1220] border border-gray-800 hover:scale-[1.02] transition"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Quiz</h3>
              <p className="text-sm text-gray-300 mt-2 max-w-md">
                Quick technical quizzes (Computer Science) to practice under
                timed conditions.
              </p>
            </div>
            <div className="text-blue-400 ml-4 text-2xl">→</div>
          </div>
        </Link>
      </section>
    </div>
  );
}
