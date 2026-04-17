export default function Signup() {
  return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center text-gray-200 px-6">
      <div className="w-full max-w-md bg-[#111827] p-8 rounded-xl shadow-xl border border-gray-700">
        <h2 className="text-3xl font-bold mb-6 text-blue-400">Create an Account</h2>

        <div className="space-y-4">
          <input 
            placeholder="Email" 
            className="w-full px-4 py-3 bg-[#0d1424] rounded-lg border border-gray-700 text-gray-200 focus:border-blue-500 outline-none"
          />
          <input 
            type="password"
            placeholder="Password" 
            className="w-full px-4 py-3 bg-[#0d1424] rounded-lg border border-gray-700 text-gray-200 focus:border-blue-500 outline-none"
          />
        </div>

        <button className="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition">
          Sign Up
        </button>
      </div>
    </div>
  );
}
