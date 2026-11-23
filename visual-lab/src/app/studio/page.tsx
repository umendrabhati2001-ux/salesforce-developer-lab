import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { StudioWorkspace } from "@/components/StudioWorkspace";
import { CommandPalette } from "@/components/CommandPalette";
import { ArrowLeft, ExternalLink, Linkedin, ShieldCheck, Sparkles, Terminal, Award, Briefcase, Download } from "lucide-react";

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
            href="/salesforce-architecture-blueprint.pdf"
            download="Salesforce-Architecture-Blueprint-Umendra-Bhati.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.2)] cursor-pointer active:scale-95"
            title="Download 1-Page Technical Architecture Blueprint (PDF)"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Blueprint (PDF)</span>
            <span className="sm:hidden">PDF</span>
          </a>

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

      {/* High-Impact Global Contract Availability Banner */}
      <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-cyan-950/70 border-b border-emerald-500/20 px-4 py-2.5">
        <div className="max-w-[1550px] mx-auto flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2.5 text-slate-200">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="font-bold text-emerald-400">Available Immediately for Remote Contract (15–30 hrs/wk)</span>
            <span className="text-slate-500 hidden sm:inline">•</span>
            <span className="text-slate-300 hidden sm:inline">Rate: <strong className="text-white">$35 – $60/hr</strong></span>
            <span className="text-slate-500 hidden md:inline">•</span>
            <span className="text-cyan-300 hidden md:inline">Timezone Overlap: UK (GMT) &amp; US (EST)</span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="mailto:umendrabhati2001@gmail.com?subject=Contract%20Engagement%20Inquiry%20-%20Salesforce%20DX&body=Hi%20Umendra%2C%0A%0AWe%20reviewed%20your%20Salesforce%20runtime%20studio%20and%20architecture.%20We%20would%20like%20to%20discuss%20a%20remote%20contract%20engagement.%0A%0AWeekly%20Hours%3A%2015-30%20hrs%0ATarget%20Start%3A%20Immediate%0A%0ABest%20regards%2C"
              className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold transition-all flex items-center gap-1 active:scale-95 shadow-sm"
            >
              <span>Email Umendra</span>
            </a>
            <a
              href="https://www.linkedin.com/in/umendra-bhati-5243aa36a/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 text-[11px] font-bold transition-all flex items-center gap-1 active:scale-95 shadow-sm"
            >
              <span>LinkedIn Message ↗</span>
            </a>
          </div>
        </div>
      </div>

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
