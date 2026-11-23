import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { VisualizersSection } from "@/components/VisualizersSection";
import { EnterpriseCostCalculator } from "@/components/EnterpriseCostCalculator";
import { CommandPalette } from "@/components/CommandPalette";
import { ArrowLeft, ExternalLink, Linkedin, ShieldCheck, Sparkles, Terminal, Award, Briefcase } from "lucide-react";

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

      {/* Top Dedicated Studio Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#060913]/90 backdrop-blur-md border-b border-cyan-500/20 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-mono text-slate-300 hover:text-white transition-all cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform text-cyan-400" />
            <span>Back to Portfolio</span>
          </Link>

          <div className="h-4 w-px bg-white/10 hidden sm:block" />

          <div className="flex items-center gap-2.5">
            <div className="relative w-7 h-7 rounded-lg overflow-hidden border border-cyan-500/40 p-0.5 bg-slate-900 shrink-0">
              <Image
                src="/salesforce.svg"
                alt="Salesforce"
                width={28}
                height={28}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-white tracking-wide">
                  Apex &amp; SOQL Runtime Studio
                </span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[10px] font-mono text-cyan-300 font-bold hidden md:inline-flex">
                  FULLSCREEN IDE
                </span>
              </div>
              <p className="text-[10px] font-mono text-slate-400 hidden sm:block">
                Multi-Tenant Architecture Simulator • Umendra Bhati
              </p>
            </div>
          </div>
        </div>

        {/* Right Actions: Conversion CTAs & Developer Profile */}
        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href="mailto:umendrabhati2001@gmail.com?subject=Salesforce%20Contract%20Engagement%20-%20Umendra%20Bhati&body=Hi%20Umendra%2C%0A%0AWe%20reviewed%20your%20Salesforce%20Developer%20Lab%20and%20would%20like%20to%20discuss%20a%20remote%20contract%20%2F%20consulting%20engagement.%0A%0ABest%20regards"
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-[0_0_20px_rgba(16,185,129,0.35)] cursor-pointer active:scale-95"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Hire for Contract</span>
          </a>

          <a
            href="mailto:umendrabhati2001@gmail.com?subject=Inquiry%3A%20Commercial%20Source%20Code%20License%20(%24149)&body=Hi%20Umendra%2C%0A%0AI%20would%20like%20to%20purchase%20the%20commercial%20source%20code%20license%20for%20the%20Salesforce%20Developer%20Lab%20(%24149).%0A%0APlease%20provide%20payment%20and%20repository%20access%20details.%0A%0ABest%20regards"
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-[0_0_18px_rgba(0,240,255,0.35)] cursor-pointer active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>Buy Code ($149)</span>
          </a>

          <a
            href="https://www.linkedin.com/in/umendra-bhati-5243aa36a/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-[#0A66C2] hover:bg-[#004182] text-white text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(10,102,194,0.3)] cursor-pointer"
          >
            <Linkedin className="w-3.5 h-3.5 fill-current" />
            <span>Umendra Bhati</span>
            <ExternalLink className="w-3 h-3 opacity-80" />
          </a>
        </div>
      </header>

      {/* Main Studio Workspace */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <VisualizersSection initialTab="soql" standalone={true} />
        <EnterpriseCostCalculator />
      </div>

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
