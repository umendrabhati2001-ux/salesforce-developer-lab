import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-6xl font-black font-mono text-white mb-2">404</h1>
      <p className="text-[#888888] text-sm mb-6 font-mono">
        Resource not found in Salesforce Developer Lab
      </p>
      <Link
        href="/"
        className="px-4 py-2 rounded-lg bg-white text-black font-mono text-xs font-bold hover:bg-[#E5E5E5] transition-colors"
      >
        Return to Portal
      </Link>
    </div>
  );
}
