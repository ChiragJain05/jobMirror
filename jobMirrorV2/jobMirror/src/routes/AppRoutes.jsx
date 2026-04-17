// src/routes/AppRoutes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

/* Layouts */
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";

/* Public pages */
import Home from "../pages/Home";
import Features from "../pages/Features";
import Auth from "../pages/Auth"; // handles /login & /signup

/* Dashboard pages (nested) */
import DashboardHome from "../pages/dashboard/DashboardHome";
import Profile from "../pages/dashboard/Profile";
import Interviews from "../pages/dashboard/Interviews";
import Learning from "../pages/dashboard/Learning";

import Quiz from "../pages/learning/Quiz";
import InterviewRunner from "../pages/dashboard/InterviewRunner";
import Roadmap from "../pages/learning/Roadmap";


export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes (Navbar + Footer) */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/features" element={<Features />} />

        {/* Auth route handles both /login and /signup */}
        <Route path="/login" element={<Auth />} />
        <Route path="/signup" element={<Auth />} />

        {/* fallback to home */}
        <Route
          path="/404"
          element={<div className="p-8">Page not found</div>}
        />
      </Route>

      {/* Dashboard routes (no navbar/footer) */}
      <Route element={<DashboardLayout />}>
        {/* Dashboard overview */}
        <Route path="/dashboard" element={<DashboardHome />} />

        {/* Nested dashboard sections */}
        <Route path="/dashboard/profile" element={<Profile />} />
        <Route path="/dashboard/interviews" element={<Interviews />} />
        <Route path="/dashboard/learning" element={<Learning />} />
        <Route path="/dashboard/interviews" element={<Interviews />} />
        <Route
          path="/dashboard/interviews/:type"
          element={<InterviewRunner />}
        />

        <Route path="/learning/quiz" element={<Quiz />} />
        <Route path="/learning/roadmap" element={<Roadmap />} />
      </Route>

      {/* Catch-all: redirect to home (or a 404) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
