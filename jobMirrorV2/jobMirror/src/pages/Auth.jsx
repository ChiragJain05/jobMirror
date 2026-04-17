import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/auth-flip.css";

import loginIllustration from "../assets/login-illustration.png";
import signupIllustration from "../assets/signup-illustration.png";

const USERS_KEY = "jobmirror:users";
const SESSION_KEY = "jobmirror:session";

/* ---------- Small icons ---------- */
const IconGoogle = ({ className = "icon" }) => (
  <svg
    className={className}
    width="18"
    height="18"
    viewBox="0 0 256 262"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <path
      fill="#4285F4"
      d="M255.6 133.4c0-8.7-.8-17-2.5-25H130v47.6h70c-3 16-11.3 29.6-24 38.8v32h38.6c22.6-20.8 35-51.4 35-93.4z"
    />
    <path
      fill="#34A853"
      d="M130 261c33.6 0 61.9-11.2 82.6-30.4l-38.6-32c-10.8 7.3-24.8 12-44 12-33.8 0-62.5-22.8-72.8-53.4H18.8v33.6C39.8 231.3 81.6 261 130 261z"
    />
    <path
      fill="#FBBC05"
      d="M57.2 157.2c-4-12-6.3-24.8-6.3-38s2.2-26 6.3-38V48.6H18.8C6.8 75.4 0 103.2 0 130s6.8 54.6 18.8 81.4l38.4-54.2z"
    />
    <path
      fill="#EA4335"
      d="M130 51.6c18.2 0 34.6 6.3 47.6 18.6l35.6-35.6C191.6 13 162.8 0 130 0 81.6 0 39.8 29.7 18.8 75.4l38.4 33.2C67.5 74.4 96.2 51.6 130 51.6z"
    />
  </svg>
);

const IconGithub = ({ className = "icon" }) => (
  <svg
    className={className}
    width="18"
    height="18"
    viewBox="0 0 24 24"
    aria-hidden
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="currentColor"
      d="M12 .297a12 12 0 00-3.793 23.4c.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.4-1.35-1.77-1.35-1.77-1.1-.75.08-.74.08-.74 1.22.09 1.86 1.25 1.86 1.25 1.08 1.84 2.83 1.31 3.52 1 .11-.78.42-1.31.76-1.61-2.66-.3-5.46-1.34-5.46-5.96 0-1.32.47-2.4 1.25-3.25-.12-.31-.54-1.56.12-3.25 0 0 1.02-.33 3.34 1.24a11.6 11.6 0 016.08 0c2.32-1.57 3.34-1.24 3.34-1.24.66 1.69.24 2.94.12 3.25.78.85 1.25 1.93 1.25 3.25 0 4.63-2.8 5.66-5.47 5.95.43.37.82 1.1.82 2.22v3.29c0 .32.22.69.83.57A12 12 0 0012 .297"
    />
  </svg>
);

/* ---------- Helpers for localStorage users/session ---------- */
function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
function saveSession(email) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ email, at: Date.now() }));
}
function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}
function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/* Simple encoding for demo only — replace with secure hashing on real backend */
function encodePassword(plain) {
  try {
    return btoa(plain); // demo only
  } catch {
    return plain;
  }
}
function verifyPassword(storedEncoded, plain) {
  try {
    return storedEncoded === btoa(plain);
  } catch {
    return storedEncoded === plain;
  }
}

/* ---------- Main component ---------- */
export default function Auth() {
  const location = useLocation();
  const navigate = useNavigate();

  const deriveModeFromPath = (path) =>
    path && path.includes("signup") ? "signup" : "login";
  const [mode, setMode] = useState(() => deriveModeFromPath(location.pathname));
  const [animating, setAnimating] = useState(false);
  const containerRef = useRef(null);

  // form state (controlled)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [remember, setRemember] = useState(true);

  // UI state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [message, setMessage] = useState(null);

  // redirect if already logged in
  useEffect(() => {
    const s = getSession();
    if (s?.email) {
      // user already signed in — redirect
      navigate("/dashboard", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const target = deriveModeFromPath(location.pathname);
    if (target === mode) return;
    setAnimating(true);
    setMode(target);
    const t = setTimeout(() => setAnimating(false), 520);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const goTo = (target) => {
    const path = target === "signup" ? "/signup" : "/login";
    if (location.pathname === path) return;
    navigate(path);
  };

  const isSignup = mode === "signup";

  function pushMessage(text, kind = "info", ttl = 3000) {
    setMessage({ text, kind });
    setTimeout(() => setMessage(null), ttl);
  }

  /* ---------- Validation ---------- */
  function validateSignup() {
    const errs = [];
    if (!name.trim()) errs.push("Full name is required.");
    if (!email.trim()) errs.push("Email is required.");
    // simple email check
    if (email && !/^\S+@\S+\.\S+$/.test(email))
      errs.push("Invalid email format.");
    if (!password || password.length < 6)
      errs.push("Password must be at least 6 characters.");
    if (password !== confirmPassword) errs.push("Passwords do not match.");
    return errs;
  }
  function validateLogin() {
    const errs = [];
    if (!email.trim()) errs.push("Email is required.");
    if (!password) errs.push("Password is required.");
    return errs;
  }

  /* ---------- Handlers ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setMessage(null);

    if (isSignup) {
      const errs = validateSignup();
      if (errs.length) {
        setErrors(errs);
        return;
      }

      setLoading(true);
      try {
        // load users
        const users = loadUsers();
        const key = email.toLowerCase();
        if (users[key]) {
          setErrors(["An account with this email already exists."]);
          setLoading(false);
          return;
        }

        // create user
        const encoded = encodePassword(password);
        const user = {
          name: name.trim(),
          email: key,
          password: encoded,
          createdAt: new Date().toISOString(),
        };
        users[key] = user;
        saveUsers(users);

        // start session
        saveSession(key);
        pushMessage("Account created. Redirecting to dashboard…", "success");
        setTimeout(() => navigate("/dashboard", { replace: true }), 900);
      } catch (err) {
        setErrors([String(err)]);
      } finally {
        setLoading(false);
      }
    } else {
      // login
      const errs = validateLogin();
      if (errs.length) {
        setErrors(errs);
        return;
      }

      setLoading(true);
      try {
        const users = loadUsers();
        const key = email.toLowerCase();
        const user = users[key];
        if (!user) {
          setErrors(["No account found for that email."]);
          setLoading(false);
          return;
        }
        if (!verifyPassword(user.password, password)) {
          setErrors(["Incorrect password."]);
          setLoading(false);
          return;
        }

        // login success
        if (remember) {
          saveSession(key);
        } else {
          // still save session for demo; you can change to sessionStorage if you want ephemeral
          saveSession(key);
        }
        pushMessage("Signed in — redirecting…", "success");
        setTimeout(() => navigate("/dashboard", { replace: true }), 700);
      } catch (err) {
        setErrors([String(err)]);
      } finally {
        setLoading(false);
      }
    }
  };

  /* Social stubs: create a demo user and sign in */
  const handleSocial = (provider) => {
    // create a synthetic user for the provider
    const seedEmail = `demo+${provider}@jobmirror.local`;
    const users = loadUsers();
    if (!users[seedEmail]) {
      users[seedEmail] = {
        name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} Demo`,
        email: seedEmail,
        password: encodePassword("social-login"),
        createdAt: new Date().toISOString(),
      };
      saveUsers(users);
    }
    saveSession(seedEmail);
    pushMessage(`Signed in with ${provider}`, "success");
    setTimeout(() => navigate("/dashboard", { replace: true }), 600);
  };

  /* Sign out helper for debugging/testing */
  // not exposed in UI here, but useful during dev:
  // clearSession(); // call in console if needed

  /* Small helpers to pre-fill demo credentials (optional) */
  const fillDemo = (type = "login") => {
    if (type === "login") {
      setEmail("demo+google@jobmirror.local");
      setPassword("social-login");
    } else {
      setName("Demo User");
      setEmail(`user${Date.now() % 1000}@example.com`);
      setPassword("password123");
      setConfirmPassword("password123");
    }
  };

  /* ---------- Render ---------- */
  return (
    <div className="auth-shell">
      <div
        ref={containerRef}
        className={`auth-card ${isSignup ? "mode-signup" : "mode-login"} ${
          animating ? "animating" : ""
        }`}
      >
        {/* IMAGE PANEL */}
        <div className="panel panel-image" aria-hidden={false}>
          <img
            src={isSignup ? signupIllustration : loginIllustration}
            alt=""
            className="panel-image-img"
            draggable={false}
          />

          <div className="panel-overlay">
            <div className="overlay-box">
              <h3 className="overlay-title text-yellow-200">
                {isSignup ? "Welcome to JobMirror" : "Welcome back"}
              </h3>
              <p className="overlay-desc text-blue-100 font-bold">
                {isSignup
                  ? "Create your account and start practicing mock interviews with confidence."
                  : "Sign in to continue practicing, track progress, and access your dashboard."}
              </p>

              <button
                className="link-toggle text-white"
                onClick={() => goTo(isSignup ? "login" : "signup")}
                aria-pressed={isSignup}
              >
                {isSignup
                  ? "Already registered? Log in"
                  : "New to JobMirror? Sign up"}
              </button>
            </div>
          </div>
        </div>

        {/* FORM PANEL */}
        <div className="panel panel-form" aria-hidden={false}>
          <div className="form-inner">
            <h2 className="form-title">
              {isSignup ? "Create Account" : "Sign In"}
            </h2>

            {/* notification */}
            {message && (
              <div
                className={`notif ${
                  message.kind === "success" ? "notif-success" : "notif-info"
                }`}
              >
                {message.text}
              </div>
            )}

            {/* errors */}
            {errors.length > 0 && (
              <div className="errors">
                {errors.map((err, i) => (
                  <div key={i} className="text-sm text-red-400">
                    {err}
                  </div>
                ))}
              </div>
            )}

            <div className="social-row">
              {/* <button
                type="button"
                className="social-btn"
                onClick={() => handleSocial("google")}
              >
                <IconGoogle /> <span>Continue with Google</span>
              </button>
              <button
                type="button"
                className="social-btn"
                onClick={() => handleSocial("github")}
              >
                <IconGithub /> <span>Continue with GitHub</span>
              </button> */}
            </div>

            {/* <div className="divider">or</div> */}

            <form
              onSubmit={handleSubmit}
              className="core-form"
              aria-hidden={false}
            >
              {isSignup && (
                <label className="field">
                  <span className="label">Full name</span>
                  <input
                    required
                    type="text"
                    className="input"
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </label>
              )}

              <label className="field">
                <span className="label">Email</span>
                <input
                  required
                  type="email"
                  className="input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>

              <label className="field">
                <span className="label">Password</span>
                <input
                  required
                  minLength={6}
                  type="password"
                  className="input"
                  placeholder={isSignup ? "Create a password" : "••••••••"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>

              {isSignup && (
                <label className="field">
                  <span className="label">Confirm password</span>
                  <input
                    required
                    minLength={6}
                    type="password"
                    className="input"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </label>
              )}

              <div className="form-row">
                {!isSignup && (
                  <>
                    <label className="checkbox">
                      <input
                        type="checkbox"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                      />{" "}
                      Remember me
                    </label>
                    <a className="small-link" href="/forgot">
                      Forgot?
                    </a>
                  </>
                )}
              </div>

              <button type="submit" className="primary-btn" disabled={loading}>
                {loading
                  ? isSignup
                    ? "Creating…"
                    : "Signing in…"
                  : isSignup
                  ? "Create account"
                  : "Sign In"}
              </button>
            </form>

            <div className="foot-link">
              {isSignup ? (
                <>
                  <span>Already registered?</span>
                  <button onClick={() => goTo("login")} className="small-link">
                    Log in
                  </button>
                </>
              ) : (
                <>
                  <span>New to JobMirror?</span>
                  <button onClick={() => goTo("signup")} className="small-link">
                    Sign up now
                  </button>
                </>
              )}
            </div>

            {/* dev helpers (hidden behind data attribute if needed) */}
            <div style={{ marginTop: 12 }}>
              {/* <button
                onClick={() => fillDemo(isSignup ? "signup" : "login")}
                className="small-link"
                style={{ marginRight: 8 }}
              >
                Fill demo
              </button>
              <button
                onClick={() => {
                  localStorage.clear();
                  pushMessage("Cleared localStorage", "info");
                }}
                className="small-link"
              >
                Clear storage
              </button> */}
            </div>
          </div>
        </div>
      </div>

      {/* tiny inline styles for notif/errors so you don't need to touch CSS immediately */}
      <style>{`
        .notif { padding: 8px 12px; border-radius: 8px; margin-bottom: 8px; font-size: 0.95rem; }
        .notif-success { background: rgba(6, 95, 70, 0.12); color: #8ee0b2; border: 1px solid rgba(10,200,130,0.08); }
        .notif-info { background: rgba(10, 20, 40, 0.06); color: #cbd5e1; }
        .errors { margin-bottom: 8px; }
      `}</style>
    </div>
  );
}

