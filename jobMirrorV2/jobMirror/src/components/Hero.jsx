export default function Hero() {
  return (
    <section className="px-8 py-20 text-center">
      <h1 className="text-4xl md:text-6xl font-bold leading-tight">
        Prepare for Your Next Interview With
        <span className="text-blue-600"> AI-Powered Insights</span>
      </h1>

      <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-lg">
        JobMirror helps you practice with real interview questions, mock
        sessions, coding tests, and personalized feedback — all in one place.
      </p>

      <div className="mt-8 flex flex-col md:flex-row justify-center gap-4">
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700">
          Start Practicing
        </button>
        <button className="px-6 py-3 border border-gray-400 rounded-lg hover:bg-gray-100">
          Explore Features
        </button>
      </div>
    </section>
  );
}
