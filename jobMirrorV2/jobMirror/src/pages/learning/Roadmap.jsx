// src/pages/learning/Roadmap.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

/**
 * Roadmap Page
 * - Shows a grid of learning tracks
 * - On select, shows a detailed roadmap with milestones and resources
 * - Tracks user progress per-track in localStorage
 * - Export / import progress JSON
 */

/* ---------- Roadmap data (expandable) ---------- */
/* Add or edit tracks here. Each track contains ordered milestones with
   title, estTime (approx minutes/hours), description and resources array.
*/
const ROADMAPS = {
  frontend: {
    id: "frontend",
    title: "Frontend (React + Modern Web)",
    summary:
      "HTML/CSS/JS fundamentals → React → State mgmt → Performance → Testing → Advanced topics",
    milestones: [
      {
        id: "html-css-js",
        title: "Core: HTML, CSS & JavaScript",
        estMinutes: 600,
        desc: "Semantic HTML, CSS layout (Flexbox, Grid), modern JavaScript (ES6+), DOM, async patterns.",
        resources: [
          { title: "MDN Web Docs", url: "https://developer.mozilla.org" },
          {
            title: "You Don't Know JS (book)",
            url: "https://github.com/getify/You-Dont-Know-JS",
          },
          {
            title: "Flexbox & Grid guide",
            url: "https://css-tricks.com/snippets/css/complete-guide-grid/",
          },
        ],
      },
      {
        id: "react-core",
        title: "React Fundamentals",
        estMinutes: 400,
        desc: "JSX, components, props, hooks, lifecycle, composition patterns.",
        resources: [
          {
            title: "Official React Docs",
            url: "https://reactjs.org/docs/getting-started.html",
          },
          {
            title: "Build real apps (tutorials)",
            url: "https://reactjs.org/tutorial/tutorial.html",
          },
        ],
      },
      {
        id: "state-routing",
        title: "State Management & Routing",
        estMinutes: 300,
        desc: "React Router, Context API, Redux or Zustand for complex apps.",
        resources: [
          { title: "React Router", url: "https://reactrouter.com" },
          { title: "Redux docs", url: "https://redux.js.org" },
        ],
      },
      {
        id: "testing",
        title: "Testing & Tooling",
        estMinutes: 200,
        desc: "Jest, React Testing Library, unit & integration tests, E2E basics (Playwright/Cypress).",
        resources: [
          {
            title: "React Testing Library",
            url: "https://testing-library.com/docs/react-testing-library/intro",
          },
          { title: "Playwright", url: "https://playwright.dev" },
        ],
      },
      {
        id: "perf-accessibility",
        title: "Performance & Accessibility",
        estMinutes: 240,
        desc: "Lighthouse, code-splitting, lazy loading, ARIA, keyboard navigation.",
        resources: [
          { title: "Web.dev - Performance", url: "https://web.dev/fast/" },
          {
            title: "a11y guide",
            url: "https://www.w3.org/WAI/standards-guidelines/wcag/",
          },
        ],
      },
    ],
  },

  backend: {
    id: "backend",
    title: "Backend (APIs & Systems)",
    summary:
      "HTTP, REST & GraphQL → Databases → Authentication → Scalability → Observability",
    milestones: [
      {
        id: "http-rest",
        title: "HTTP, REST, APIs",
        estMinutes: 300,
        desc: "HTTP methods, status codes, designing RESTful endpoints, GraphQL basics.",
        resources: [
          { title: "REST Best Practices", url: "https://restfulapi.net" },
          { title: "GraphQL.org", url: "https://graphql.org" },
        ],
      },
      {
        id: "databases",
        title: "Databases (SQL & NoSQL)",
        estMinutes: 360,
        desc: "Relational modelling, indexing, transactions; NoSQL patterns for scale.",
        resources: [
          { title: "Postgres docs", url: "https://www.postgresql.org/docs/" },
          { title: "MongoDB basics", url: "https://www.mongodb.com" },
        ],
      },
      {
        id: "auth",
        title: "Authentication & Security",
        estMinutes: 240,
        desc: "JWT, OAuth2 basics, secure password storage, common vulnerabilities.",
        resources: [
          {
            title: "OWASP Top 10",
            url: "https://owasp.org/www-project-top-ten/",
          },
        ],
      },
      {
        id: "scaling",
        title: "Scalability & Architecture",
        estMinutes: 360,
        desc: "Caching, load balancing, queues, CQRS, eventual consistency patterns.",
        resources: [
          {
            title: "System Design primer",
            url: "https://github.com/donnemartin/system-design-primer",
          },
        ],
      },
      {
        id: "observability",
        title: "Monitoring & Observability",
        estMinutes: 180,
        desc: "Logs, metrics, tracing (OpenTelemetry) and alerting practices.",
        resources: [
          { title: "Prometheus docs", url: "https://prometheus.io/docs/" },
          { title: "OpenTelemetry", url: "https://opentelemetry.io" },
        ],
      },
    ],
  },

  dsa: {
    id: "dsa",
    title: "Data Structures & Algorithms",
    summary:
      "Arrays → Linked lists → Trees → Graphs → Sorting → Dynamic Programming → Problem-solving practice",
    milestones: [
      {
        id: "basics",
        title: "Basic DS: Arrays, Strings, Linked Lists",
        estMinutes: 240,
        desc: "Understand operations and common patterns.",
        resources: [
          {
            title: "GeeksforGeeks - DS",
            url: "https://www.geeksforgeeks.org/data-structures/",
          },
        ],
      },
      {
        id: "trees-graphs",
        title: "Trees & Graphs",
        estMinutes: 360,
        desc: "Traversal, BFS/DFS, shortest paths, tree algorithms.",
        resources: [
          {
            title: "Graph algorithms",
            url: "https://cp-algorithms.com/graph/",
          },
        ],
      },
      {
        id: "dp",
        title: "Dynamic Programming",
        estMinutes: 300,
        desc: "Memoization, tabulation, classical DP problems.",
        resources: [
          {
            title: "DP patterns",
            url: "https://leetcode.com/discuss/general-discussion/458695/Dynamic-Programming-Patterns",
          },
        ],
      },
      {
        id: "practice",
        title: "Practice & Mock Interviews",
        estMinutes: 600,
        desc: "Timed problem solving, track progress on platforms, interview strategies.",
        resources: [
          { title: "LeetCode", url: "https://leetcode.com" },
          { title: "InterviewBit", url: "https://www.interviewbit.com" },
        ],
      },
    ],
  },

  ml: {
    id: "ml",
    title: "Machine Learning & AI",
    summary: "Math → ML basics → Deep Learning → Deployment → Ethics",
    milestones: [
      {
        id: "math",
        title: "Math foundations",
        estMinutes: 400,
        desc: "Linear algebra, probability, statistics, optimization basics.",
        resources: [
          {
            title: "3Blue1Brown Essence of linear algebra",
            url: "https://www.3blue1brown.com",
          },
        ],
      },
      {
        id: "ml-basics",
        title: "Classical ML",
        estMinutes: 300,
        desc: "Regression, classification, feature engineering.",
        resources: [
          {
            title: "Andrew Ng (Coursera)",
            url: "https://www.coursera.org/learn/machine-learning",
          },
        ],
      },
      {
        id: "deep",
        title: "Deep Learning",
        estMinutes: 400,
        desc: "Neural networks, CNNs, RNNs, transformers basics.",
        resources: [
          {
            title: "Deep Learning Book",
            url: "https://www.deeplearningbook.org",
          },
        ],
      },
      {
        id: "deploy",
        title: "Deployment & MLOps",
        estMinutes: 240,
        desc: "Model serving, monitoring and pipelines.",
        resources: [
          {
            title: "TensorFlow Serving",
            url: "https://www.tensorflow.org/tfx/guide/serving",
          },
        ],
      },
    ],
  },

  devops: {
    id: "devops",
    title: "DevOps & Cloud",
    summary: "Linux → CI/CD → Containers → Infra as Code → Observability",
    milestones: [
      {
        id: "linux",
        title: "Linux & Networking",
        estMinutes: 200,
        desc: "Shell, networking basics, process management.",
        resources: [
          { title: "Linux Journey", url: "https://linuxjourney.com" },
        ],
      },
      {
        id: "ci",
        title: "CI/CD pipelines",
        estMinutes: 240,
        desc: "Automated builds, tests, deployment.",
        resources: [
          { title: "GitHub Actions", url: "https://docs.github.com/actions" },
        ],
      },
      {
        id: "containers",
        title: "Containers & Orchestration",
        estMinutes: 300,
        desc: "Docker, Kubernetes basics.",
        resources: [
          { title: "Kubernetes docs", url: "https://kubernetes.io/docs/home/" },
        ],
      },
      {
        id: "iac",
        title: "Infra as Code",
        estMinutes: 180,
        desc: "Terraform, cloud provisioning.",
        resources: [
          { title: "Terraform docs", url: "https://www.terraform.io/docs" },
        ],
      },
    ],
  },

  security: {
    id: "security",
    title: "Security & Cryptography",
    summary: "Web security basics → crypto primitives → threat modeling",
    milestones: [
      {
        id: "websec",
        title: "Web Security Basics",
        estMinutes: 240,
        desc: "XSS, CSRF, authentication issues.",
        resources: [{ title: "OWASP", url: "https://owasp.org" }],
      },
      {
        id: "crypto",
        title: "Cryptography basics",
        estMinutes: 300,
        desc: "Hashing, symmetric/asymmetric, TLS basics.",
        resources: [
          { title: "Crypto primers", url: "https://crypto.stanford.edu" },
        ],
      },
    ],
  },

  web3: {
    id: "web3",
    title: "Web3 & Blockchain",
    summary:
      "Blockchain fundamentals → Smart contracts → Security → DeFi basics",
    milestones: [
      {
        id: "fund",
        title: "Blockchain fundamentals",
        estMinutes: 240,
        desc: "Consensus, blocks, transactions.",
        resources: [{ title: "Ethereum docs", url: "https://ethereum.org" }],
      },
      {
        id: "smart",
        title: "Smart contracts (Solidity)",
        estMinutes: 300,
        desc: "Writing, testing, and auditing contracts.",
        resources: [
          { title: "Solidity docs", url: "https://docs.soliditylang.org" },
        ],
      },
    ],
  },

  mobile: {
    id: "mobile",
    title: "Mobile Development",
    summary:
      "Native vs cross-platform → Android/iOS basics → React Native / Flutter",
    milestones: [
      {
        id: "native",
        title: "Platform basics",
        estMinutes: 300,
        desc: "Android / iOS fundamentals.",
        resources: [
          { title: "Android dev", url: "https://developer.android.com" },
        ],
      },
      {
        id: "rn",
        title: "React Native / Flutter",
        estMinutes: 300,
        desc: "Cross-platform app development.",
        resources: [{ title: "React Native", url: "https://reactnative.dev" }],
      },
    ],
  },
};

/* ---------- Helpers ---------- */
const TRACK_LIST = Object.values(ROADMAPS).map((t) => ({
  id: t.id,
  title: t.title,
  summary: t.summary,
}));

const STORAGE_KEY = "jobmirror:roadmap:progress";

/* ---------- Styles small helper (keeps markup concise) ---------- */
const Badge = ({ children }) => (
  <span className="px-2 py-1 bg-white/5 rounded-full text-xs text-gray-200">
    {children}
  </span>
);

/* ---------- Main Component ---------- */
export default function Roadmap() {
  const navigate = useNavigate();
  const [selectedTrackId, setSelectedTrackId] = useState(null);
  const [progress, setProgress] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  // persist progress whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {}
  }, [progress]);

  const selectedTrack = useMemo(
    () => ROADMAPS[selectedTrackId] ?? null,
    [selectedTrackId]
  );

  // mark milestone toggle
  function toggleMilestone(trackId, milestoneId) {
    setProgress((p) => {
      const track = p[trackId] || { completed: [] };
      const set = new Set(track.completed);
      if (set.has(milestoneId)) set.delete(milestoneId);
      else set.add(milestoneId);
      return { ...p, [trackId]: { completed: Array.from(set) } };
    });
  }

  function clearProgressForTrack(trackId) {
    setProgress((p) => {
      const clone = { ...p };
      delete clone[trackId];
      return clone;
    });
  }

  function exportProgress() {
    const blob = new Blob([JSON.stringify(progress, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `jobmirror-roadmap-progress.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function importProgress(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        setProgress(data);
        alert("Progress imported.");
      } catch (err) {
        alert("Invalid file.");
      }
      e.target.value = "";
    };
    reader.readAsText(file);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Roadmaps</h2>
        <p className="text-sm text-gray-400">
          Pick a learning track and follow the recommended milestones. Your
          progress is saved locally.
        </p>
      </div>

      {/* Top controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            setSelectedTrackId(null);
            navigate("/dashboard/learning");
          }}
          className="px-3 py-2 rounded-md border border-gray-700 text-gray-200"
        >
          Back
        </button>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={exportProgress}
            className="px-3 py-2 rounded-md bg-white/5 text-white border border-gray-700"
          >
            Export Progress
          </button>

          <label className="px-3 py-2 rounded-md bg-white/5 text-white border border-gray-700 cursor-pointer">
            Import
            <input
              type="file"
              accept="application/json"
              onChange={importProgress}
              className="hidden"
            />
          </label>

          <button
            onClick={() => {
              localStorage.removeItem(STORAGE_KEY);
              setProgress({});
            }}
            className="px-3 py-2 rounded-md border border-red-600 text-red-400"
          >
            Reset All
          </button>
        </div>
      </div>

      {/* If no track selected: show grid of tracks */}
      {!selectedTrack && (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TRACK_LIST.map((t) => (
            <div
              key={t.id}
              className="bg-[#0b1220] border border-gray-800 rounded-xl p-6 hover:scale-[1.02] transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {t.title}
                  </h3>
                  <p className="text-sm text-gray-300 mt-2">{t.summary}</p>

                  <div className="mt-3 flex items-center gap-2">
                    <Badge>{ROADMAPS[t.id].milestones.length} milestones</Badge>
                    <Badge>
                      {Math.ceil(
                        ROADMAPS[t.id].milestones.reduce(
                          (s, m) => s + (m.estMinutes || 0),
                          0
                        ) / 60
                      )}{" "}
                      hrs est
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <button
                    onClick={() => setSelectedTrackId(t.id)}
                    className="px-3 py-2 rounded-md bg-blue-600 text-white"
                  >
                    Open
                  </button>
                  <div className="text-xs text-gray-400 mt-3">
                    {progress[t.id]?.completed?.length || 0}/
                    {ROADMAPS[t.id].milestones.length} done
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Selected track view */}
      {selectedTrack && (
        <section className="space-y-4">
          <div className="bg-[#071226] p-6 rounded-xl border border-gray-800">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white">
                  {selectedTrack.title}
                </h3>
                <p className="text-sm text-gray-300 mt-2">
                  {selectedTrack.summary}
                </p>
                <div className="mt-3 text-xs text-gray-400">
                  {selectedTrack.milestones.length} milestones • estimated{" "}
                  {Math.ceil(
                    selectedTrack.milestones.reduce(
                      (s, m) => s + (m.estMinutes || 0),
                      0
                    ) / 60
                  )}{" "}
                  hours
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={() => setSelectedTrackId(null)}
                  className="px-3 py-2 rounded-md border border-gray-700 text-gray-200"
                >
                  Back to tracks
                </button>
                <button
                  onClick={() => clearProgressForTrack(selectedTrack.id)}
                  className="px-3 py-2 rounded-md bg-white/5 text-white"
                >
                  Clear progress
                </button>
              </div>
            </div>
          </div>

          {/* Milestones list */}
          <div className="grid gap-4">
            {selectedTrack.milestones.map((m, idx) => {
              const doneSet = new Set(
                progress[selectedTrack.id]?.completed || []
              );
              const done = doneSet.has(m.id);
              return (
                <div
                  key={m.id}
                  className={`bg-[#0b1220] p-4 rounded-xl border ${
                    done ? "border-green-600" : "border-gray-800"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="text-lg font-semibold text-white">
                          {idx + 1}. {m.title}
                        </div>
                        <div className="text-xs text-gray-400">
                          {m.estMinutes / 60 >= 1
                            ? `${Math.round(m.estMinutes / 60)} hr`
                            : `${m.estMinutes} min`}
                        </div>
                      </div>
                      <div className="text-sm text-gray-300 mt-2">{m.desc}</div>

                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {m.resources.map((r, i) => (
                          <a
                            key={i}
                            href={r.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm text-blue-300 underline"
                          >
                            {r.title}
                          </a>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => toggleMilestone(selectedTrack.id, m.id)}
                        className={`px-3 py-2 rounded-md ${
                          done
                            ? "bg-green-600 text-white"
                            : "bg-white/5 text-white border border-gray-700"
                        }`}
                      >
                        {done ? "Done ✓" : "Mark done"}
                      </button>

                      <div className="text-xs text-gray-400">
                        {done ? "Completed" : "Not done"}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* quick actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                // mark all as complete
                const all = selectedTrack.milestones.map((m) => m.id);
                setProgress((p) => ({
                  ...p,
                  [selectedTrack.id]: { completed: all },
                }));
              }}
              className="px-3 py-2 rounded-md bg-blue-600 text-white"
            >
              Mark all done
            </button>

            <button
              onClick={() => {
                // mark none
                clearProgressForTrack(selectedTrack.id);
              }}
              className="px-3 py-2 rounded-md bg-white/5 text-white border border-gray-700"
            >
              Clear
            </button>

            <button
              onClick={() => exportTrackAsJson(selectedTrack)}
              className="px-3 py-2 rounded-md bg-white/5 text-white border border-gray-700"
            >
              Export track JSON
            </button>

            <div className="ml-auto text-sm text-gray-400">
              {progress[selectedTrack.id]?.completed?.length || 0} /{" "}
              {selectedTrack.milestones.length} completed
            </div>
          </div>
        </section>
      )}
    </div>
  );

  /* helper defined below so we can use selectedTrack in handler above */
  function exportTrackAsJson(track) {
    const payload = {
      trackId: track.id,
      title: track.title,
      milestones: track.milestones,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${track.id}-roadmap.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }
}
