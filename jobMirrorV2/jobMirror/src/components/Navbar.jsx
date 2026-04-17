// src/components/Navbar.jsx
import { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";

const SESSION_KEY = "jobmirror:session";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const navigate = useNavigate();

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === SESSION_KEY) {
        try {
          setSession(e.newValue ? JSON.parse(e.newValue) : null);
        } catch {
          setSession(null);
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // helper to sign out
  const handleSignOut = () => {
    try {
      localStorage.removeItem(SESSION_KEY);
      setSession(null);
      setOpen(false);
      navigate("/", { replace: true });
    } catch {
      setSession(null);
      setOpen(false);
      navigate("/", { replace: true });
    }
  };

  // small helper to get user's initials for avatar fallback
  const getInitials = (nameOrEmail) => {
    if (!nameOrEmail) return "U";
    // if session stores name, use that; otherwise use email
    const value =
      typeof nameOrEmail === "string" && nameOrEmail.includes("@")
        ? nameOrEmail.split("@")[0]
        : nameOrEmail;
    const parts = String(value)
      .split(/[^A-Za-z0-9]+/)
      .filter(Boolean);
    if (parts.length === 0) return String(value).charAt(0).toUpperCase();
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  };

  const navItem = (to, label) => (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `block px-3 py-2 rounded-md text-sm font-medium transition ${
          isActive
            ? "text-blue-300 bg-white/5"
            : "text-gray-200 hover:text-blue-300"
        }`
      }
      onClick={() => setOpen(false)}
    >
      {label}
    </NavLink>
  );

  return (
    <nav
      className="
        fixed top-0 left-0 w-full z-40
        bg-white/10 backdrop-blur-xl
        border-b border-white/20
        shadow-[0_6px_30px_rgba(0,0,0,0.35)]
      "
    >
      {/* centered inner container so desktop content stays in max-width */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* left: logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className="text-2xl font-bold tracking-tight text-white"
            >
              Job<span className="text-blue-400">Mirror</span>
            </Link>
          </div>

          {/* desktop links */}
          <div className="hidden md:flex md:items-center md:gap-6">
            {navItem("/", "Home")}
            {navItem("/features", "Features")}

            {/* Show Sign Up only when NOT signed in */}
            {!session ? (
              <Link
                to="/signup"
                className="ml-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white shadow-md text-sm font-semibold"
                onClick={() => setOpen(false)}
              >
                Sign Up
              </Link>
            ) : (
              <button
                onClick={handleSignOut}
                className="ml-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white shadow-md text-sm font-semibold"
                aria-label="Sign out"
              >
                Log out
              </button>
            )}

            {/* Profile / Dashboard */}
            <Link
              to="/dashboard"
              className="ml-3 w-10 h-10 bg-blue-400/60 hover:bg-blue-500 border border-white/10 flex items-center justify-center rounded-full"
              onClick={() => setOpen(false)}
              aria-label="Open dashboard"
            >
              {session?.email ? (
                <span className="text-sm font-semibold">
                  {getInitials(session.name ?? session.email)}
                </span>
              ) : (
                <span className="text-lg">👤</span>
              )}
            </Link>
          </div>

          {/* mobile hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setOpen((s) => !s)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="p-2 rounded-md bg-white/6 text-white hover:bg-white/12 transition"
            >
              <span className="sr-only">Toggle menu</span>
              {open ? (
                // close icon
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                // hamburger icon
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile panel — sits inside the centered container for proper padding on small screens */}
        <div
          id="mobile-menu"
          className={`md:hidden transition-all duration-200 ease-in-out overflow-hidden ${
            open ? "pb-6" : "max-h-0"
          }`}
          aria-hidden={!open}
        >
          {/* make the mobile menu visually separated but still glassy */}
          <div
            className={`mt-2 bg-white/6 backdrop-blur-lg border border-white/10 rounded-lg p-4`}
          >
            <div className="flex flex-col gap-1">
              {navItem("/", "Home")}
              {navItem("/features", "Features")}
            </div>

            <div className="mt-4 border-t border-white/6 pt-4 space-y-3">
              {!session ? (
                <Link
                  to="/signup"
                  className="block w-full px-4 py-2 bg-blue-600 rounded-lg text-center text-white font-semibold"
                  onClick={() => setOpen(false)}
                >
                  Sign Up
                </Link>
              ) : (
                <button
                  onClick={() => {
                    handleSignOut();
                  }}
                  className="block w-full px-4 py-2 bg-red-600 rounded-lg text-center text-white font-semibold"
                >
                  Log out
                </button>
              )}

              <Link
                to="/dashboard"
                className="block w-full px-4 py-2 rounded-lg bg-transparent border border-white/8 text-white text-center"
                onClick={() => setOpen(false)}
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
