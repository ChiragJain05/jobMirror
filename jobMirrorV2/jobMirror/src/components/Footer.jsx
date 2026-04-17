export default function Footer() {
  return (
    <footer className="bg-[#0a0f1e] border-t border-gray-800 text-gray-400 text-sm py-6 text-center">
      © {new Date().getFullYear()} 
      <span className="text-gray-200 font-medium"> JobMirror</span> — All rights reserved.
    </footer>
  );
}
