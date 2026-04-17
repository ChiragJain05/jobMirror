// src/pages/dashboard/Profile.jsx
import React, { useEffect, useState } from "react";

const USERS_KEY = "jobmirror:users";
const SESSION_KEY = "jobmirror:session";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    skills: "",
    github: "",
    linkedin: "",
    resume: "",
  });

  // Load user on mount
  useEffect(() => {
    const sessionRaw = localStorage.getItem(SESSION_KEY);
    if (!sessionRaw) return;

    try {
      const session = JSON.parse(sessionRaw);
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || "{}");

      const current = users[session.email];
      if (current) {
        setUser(current);
        setForm({
          name: current.name || "",
          email: current.email,
          phone: current.phone || "",
          location: current.location || "",
          bio: current.bio || "",
          skills: current.skills || "",
          github: current.github || "",
          linkedin: current.linkedin || "",
          resume: current.resume || "",
        });
      }
    } catch (e) {
      console.error("Profile load error", e);
    }
  }, []);

  const handleSave = () => {
    if (!user) return;

    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "{}");

    users[user.email] = {
      ...users[user.email],
      ...form,
    };

    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    alert("Profile updated!");
  };

  if (!user) {
    return <div className="text-gray-300">Loading profile...</div>;
  }

  return (
    <div className="space-y-6">
      {/* TOP CARD */}
      <div className="bg-[#0b1220] p-6 rounded-xl border border-gray-800">
        <h2 className="text-xl font-semibold mb-2">Your Profile</h2>
        <p className="text-sm text-gray-400 mb-4">
          Manage your personal details and preferences.
        </p>

        {/* Avatar + Basic info */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-xl font-bold">
            {form.name
              ? form.name.charAt(0).toUpperCase()
              : user.email.charAt(0).toUpperCase()}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-200">{form.name}</h3>
            <p className="text-gray-400 text-sm">{user.email}</p>
            <p className="text-gray-500 text-xs">
              Joined: {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Profile Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <div>
            <label className="text-sm text-gray-300">Full Name</label>
            <input
              className="w-full mt-2 px-3 py-2 rounded-md bg-[#0a111a] border border-gray-800 text-gray-200"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          {/* Email (readonly) */}
          <div>
            <label className="text-sm text-gray-300">Email (readonly)</label>
            <input
              className="w-full mt-2 px-3 py-2 rounded-md bg-[#0a111a] border border-gray-800 text-gray-400 cursor-not-allowed"
              value={form.email}
              readOnly
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm text-gray-300">Phone</label>
            <input
              className="w-full mt-2 px-3 py-2 rounded-md bg-[#0a111a] border border-gray-800 text-gray-200"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>

          {/* Location */}
          <div>
            <label className="text-sm text-gray-300">Location</label>
            <input
              className="w-full mt-2 px-3 py-2 rounded-md bg-[#0a111a] border border-gray-800 text-gray-200"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </div>

          {/* GitHub */}
          <div>
            <label className="text-sm text-gray-300">GitHub URL</label>
            <input
              className="w-full mt-2 px-3 py-2 rounded-md bg-[#0a111a] border border-gray-800 text-gray-200"
              value={form.github}
              onChange={(e) => setForm({ ...form, github: e.target.value })}
              placeholder="https://github.com/username"
            />
          </div>

          {/* LinkedIn */}
          <div>
            <label className="text-sm text-gray-300">LinkedIn URL</label>
            <input
              className="w-full mt-2 px-3 py-2 rounded-md bg-[#0a111a] border border-gray-800 text-gray-200"
              value={form.linkedin}
              onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
              placeholder="https://linkedin.com/in/username"
            />
          </div>

          {/* Resume */}
          <div className="md:col-span-2">
            <label className="text-sm text-gray-300">Resume (Drive Link)</label>
            <input
              className="w-full mt-2 px-3 py-2 rounded-md bg-[#0a111a] border border-gray-800 text-gray-200"
              value={form.resume}
              onChange={(e) => setForm({ ...form, resume: e.target.value })}
              placeholder="https://drive.google.com/..."
            />
          </div>

          {/* Skills */}
          <div className="md:col-span-2">
            <label className="text-sm text-gray-300">
              Skills (comma separated)
            </label>
            <input
              className="w-full mt-2 px-3 py-2 rounded-md bg-[#0a111a] border border-gray-800 text-gray-200"
              value={form.skills}
              onChange={(e) => setForm({ ...form, skills: e.target.value })}
              placeholder="React, Node.js, Python, DSA..."
            />
          </div>

          {/* Bio */}
          <div className="md:col-span-2">
            <label className="text-sm text-gray-300">Bio</label>
            <textarea
              className="w-full mt-2 px-3 py-2 rounded-md bg-[#0a111a] border border-gray-800 text-gray-200"
              value={form.bio}
              rows={3}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder="Write a short introduction..."
            />
          </div>
        </div>

        {/* Save / Cancel */}
        <div className="mt-4 flex gap-3">
          <button
            className="px-4 py-2 bg-blue-600 rounded-md text-white"
            onClick={handleSave}
          >
            Save
          </button>
          <button
            className="px-4 py-2 bg-[#111827] rounded-md border border-gray-700 text-gray-300"
            onClick={() => window.location.reload()}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
