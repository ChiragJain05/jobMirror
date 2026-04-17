import { Link } from "react-router-dom";
import SpotlightCard from "../components/ui/SpotlightCard";

export default function Features() {
  const features = [
    {
      title: "AI Mock Interviews",
      desc: "Practice with realistic AI interviewers that mimic real companies.",
      icon: "🎯",
    },
    {
      title: "Real-Time Feedback",
      desc: "Get instant insights on voice, posture, eye contact, and confidence.",
      icon: "⚡",
    },
    {
      title: "AR Interviewer",
      desc: "Experience lifelike interview sessions with a 3D virtual interviewer.",
      icon: "🧑‍💻",
    },
    {
      title: "Technical Mode",
      desc: "Solve coding or case problems using a built-in whiteboard and editor.",
      icon: "💻",
    },
    {
      title: "Performance Reports",
      desc: "Receive detailed breakdowns, recommendations, and improvement charts.",
      icon: "📊",
    },
    {
      title: "Session Recording",
      desc: "Review your past interviews and track improvement over time.",
      icon: "🎥",
    },
  ];

  const reviews = [
    {
      quote:
        "JobMirror's mock interviews felt like the real thing — the feedback helped me fix my pacing and land an on-site.",
      name: "Asha K.",
      role: "Frontend Engineer, Acme",
      rating: 5,
    },
    {
      quote:
        "The AI interviewer asked follow-ups I wasn't ready for — now I am. Love the performance reports!",
      name: "Rahul S.",
      role: "Backend Developer, ByteLabs",
      rating: 5,
    },
    {
      quote:
        "Great tool for practicing behavioral questions. The session recordings let me spot small habits I missed.",
      name: "Priya M.",
      role: "Product Manager, Nova",
      rating: 4,
    },
    {
      quote:
        "Technical mode with whiteboard + code editor is excellent. I used it to rehearse system design interviews.",
      name: "Vikram T.",
      role: "SDE II, Cloudro",
      rating: 5,
    },
    {
      quote:
        "The AR interviewer is such a cool concept — makes practice sessions feel more realistic.",
      name: "Anika R.",
      role: "UX Designer, PixelWave",
      rating: 4,
    },
  ];

  // Duplicate reviews so the marquee appears infinite/seamless
  const marqueeList = [...reviews, ...reviews];

  return (
    <div className="bg-[#0a0f1e] min-h-screen text-gray-200 px-8 py-20 space-y-24">

      {/* Header */}
      <section className="text-center max-w-3xl mx-auto">
        <h2 className="text-4xl font-bold mb-4 text-blue-400">
          Features Overview
        </h2>
        <p className="text-gray-400">A full product landing page experience.</p>
      </section>

      {/* Spotlight Card Grid */}
      <section className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        {features.map((item, index) => (
          <SpotlightCard
            key={index}
            spotlightColor="rgba(168, 85, 247, 0.35)"
            className="p-6 rounded-xl bg-[#111827] border border-gray-700 text-gray-200 transition hover:border-blue-500"
          >
            <div className="text-4xl mb-3">{item.icon}</div>
            <h3 className="text-xl font-bold text-blue-400">{item.title}</h3>
            <p className="text-gray-400 mt-2">{item.desc}</p>
          </SpotlightCard>
        ))}
      </section>

      {/* Reviews — Infinite full-width marquee */}
      {/* Reviews — Infinite full-width marquee with heading */}
<section className="w-full">
  <div className="max-w-6xl mx-auto text-center mb-6">
    <h2 className="text-3xl font-bold text-blue-400">Reviews from Users</h2>
    <p className="text-gray-400 mt-2">What our users say about JobMirror</p>
  </div>

  {/* Embedded CSS for marquee behavior */}
  <style>{`
    .jm-marquee {
      position: relative;
      width: 100%;
      overflow: hidden;
      padding: 20px 0;
    }

    .jm-marquee-track {
      display: flex;
      gap: 20px;
      align-items: stretch;
      animation: jm-marquee-scroll var(--marquee-speed, 10s) linear infinite;
      will-change: transform;
    }

    .jm-marquee:hover .jm-marquee-track,
    .jm-marquee:active .jm-marquee-track {
      animation-play-state: paused;
    }

    @keyframes jm-marquee-scroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }

    /* ensure each card is consistent size */
    .jm-review-card {
      min-width: 320px;
      max-width: 360px;
      flex: 0 0 auto;

      /* make all cards same height */
      height: 260px;
      display: flex;
      align-items: stretch;
    }

    /* responsive smaller card heights */
    @media (max-width: 640px) {
      .jm-review-card { min-width: 260px; max-width: 300px; height: 300px; }
      .jm-marquee-track { gap: 12px; }
    }
  `}</style>

  <div className="jm-marquee">
    <div className="jm-marquee-track">
      {marqueeList.map((r, idx) => (
        <div key={idx} className="jm-review-card">
          <SpotlightCard
            spotlightColor="rgba(59,130,246,0.06)"
            /* make SpotlightCard fill the container and space content evenly */
            className="p-6 rounded-xl bg-[#0f1724] border border-gray-800 text-gray-200 h-full flex flex-col justify-between"
          >
            <div className="text-gray-300 text-lg leading-relaxed mb-3">“{r.quote}”</div>

            <div className="mt-4 flex items-center justify-between">
              <div>
                <div className="font-semibold text-sm">{r.name}</div>
                <div className="text-xs text-gray-400">{r.role}</div>
              </div>
              <div className="text-sm text-yellow-400 font-bold">
                {Array.from({ length: r.rating }).map((_, i) => "★").join("")}
              </div>
            </div>
          </SpotlightCard>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* Pricing Section */}
      <section className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-blue-400 mb-4">Pricing</h2>
        <p className="text-gray-400 mb-12">Choose a plan that suits your needs.</p>

        <div className="grid md:grid-cols-3 gap-8">

          {/* Free Plan */}
          <SpotlightCard
            spotlightColor="rgba(34, 211, 238, 0.35)"
            className="p-8 rounded-xl bg-[#111827] border border-gray-700 text-gray-200 hover:border-blue-500 transition"
          >
            <h3 className="text-2xl font-bold text-blue-400 mb-2">Free</h3>
            <p className="text-gray-400 mb-6">Basics to help you get started.</p>

            <ul className="text-left space-y-2 text-gray-300">
              <li>✔ 20 Interview Questions</li>
              <li>✔ Basic Coding Practice</li>
              <li>✔ Limited AI Feedback</li>
              <li className="opacity-50">✖ Dashboard Analytics</li>
              <li className="opacity-50">✖ Unlimited Tests</li>
            </ul>

            <button className="mt-8 w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition">
              Current Plan
            </button>
          </SpotlightCard>

          {/* Personal Plan */}
          <SpotlightCard
            spotlightColor="rgba(74, 222, 128, 0.35)"
            className="p-8 rounded-xl bg-[#111827] border border-blue-600 shadow-lg shadow-blue-900/30 text-gray-200 hover:border-blue-500 transition"
          >
            <h3 className="text-2xl font-bold text-blue-400 mb-2">Personal</h3>
            <p className="text-gray-400 mb-6">Perfect for job seekers.</p>

            <ul className="text-left space-y-2 text-gray-300">
              <li>✔ Unlimited Questions</li>
              <li>✔ All Coding Challenges</li>
              <li>✔ Full AI Feedback</li>
              <li>✔ Resume Review</li>
              <li className="opacity-50">✖ Team Analytics</li>
            </ul>

            <button className="mt-8 w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition">
              Subscribe
            </button>
          </SpotlightCard>

          {/* Institution Plan */}
          <SpotlightCard
            spotlightColor="rgba(251, 146, 60, 0.35)"
            className="p-8 rounded-xl bg-[#111827] border border-gray-700 text-gray-200 hover:border-blue-500 transition"
          >
            <h3 className="text-2xl font-bold text-blue-400 mb-2">Institution</h3>
            <p className="text-gray-400 mb-6">Best for colleges & IT training centers.</p>

            <ul className="text-left space-y-2 text-gray-300">
              <li>✔ Admin Dashboard</li>
              <li>✔ Student & Batch Analytics</li>
              <li>✔ Custom Question Banks</li>
              <li>✔ Unlimited Mock Tests</li>
              <li>✔ Priority Support</li>
            </ul>

            <button className="mt-8 w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition">
              Contact Sales
            </button>
          </SpotlightCard>

        </div>
      </section>

      {/* CTA */}
      <section className="text-center">
        <Link to="/signup">
          <button className="mt-8 px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold shadow-lg transition">
            Get Started Now
          </button>
        </Link>
      </section>
    </div>
  );
}
