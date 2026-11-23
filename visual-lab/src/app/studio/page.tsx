import type { Metadata } from "next";
import { StudioWorkspace } from "@/components/StudioWorkspace";
import { CommandPalette } from "@/components/CommandPalette";
import { StudioNavHeader } from "@/components/StudioNavHeader";
import { Terminal } from "lucide-react";

export const metadata: Metadata = {
  title: "Live Apex & SOQL Studio | Umendra Bhati",
  description:
    "Full-screen enterprise Salesforce Apex runtime simulator, Governor Limits HUD, and crash-proof SOQL Query Studio by Umendra Bhati.",
  openGraph: {
    title: "Live Apex & SOQL Studio | Umendra Bhati",
    description:
      "Full-screen enterprise Salesforce Apex runtime simulator, Governor Limits HUD, and crash-proof SOQL Query Studio by Umendra Bhati.",
    url: "https://salesforce-developer-lab.vercel.app/studio",
    siteName: "Salesforce Developer Lab",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Live Apex & SOQL Studio - Umendra Bhati",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Live Apex & SOQL Studio | Umendra Bhati",
    description: "Full-screen enterprise Salesforce Apex runtime simulator and crash-proof SOQL Studio by Umendra Bhati.",
    images: ["/og-image.png"],
  },
};

export default function StudioPage() {
  return (
    <main className="min-h-screen bg-[#030712] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-300 relative">
      <CommandPalette />

      {/* Top Dedicated Studio Navigation Bar & Availability Banner */}
      <StudioNavHeader />

      {/* Main Studio Workspace with Side-by-Side Dual Pane */}
      <StudioWorkspace />

      {/* Studio Footer */}
      <footer className="border-t border-white/[0.08] bg-[#02050E] py-4 px-4 text-center text-xs font-mono text-slate-500 flex flex-wrap items-center justify-between gap-2 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2 text-slate-400 text-[11px]">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span>Interactive Runtime Studio • Single-Tenant Sandbox Simulation</span>
        </div>
        <div className="text-[11px] text-slate-500">
          Engineered by <span className="text-cyan-300 font-bold">Umendra Bhati</span> • Cloud Solutions &amp; Salesforce Architecture
        </div>
      </footer>
    </main>
  );
}
