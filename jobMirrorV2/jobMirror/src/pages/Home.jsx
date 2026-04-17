import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">

      {/* 🔥 Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        src="/hero.mp4"   // <-- Place your video in public/hero.mp4
      />

      {/* 🔥 Dark overlay (improves text contrast) */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* 🔥 Foreground Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen text-gray-200 px-6">
        <div className="text-center max-w-6xl">

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
            Ace Your Next Interview with
            <span className="block bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mt-2">
              AI-Powered Coaching
            </span>
          </h1>

          <p className="text-lg my-6 sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Practice with a virtual AI interviewer, get real-time feedback on your gestures,
            tone, clarity & confidence. Land your dream job.
          </p>

          <Link to="/features">
            <button className="mt-10 px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-semibold shadow-lg transition duration-200">
              Explore Features
            </button>
          </Link>

        </div>
      </div>
    </div>
  );
}
