"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ExternalLink,
  Linkedin,
  Briefcase,
  Sparkles,
  Download,
  Mail
} from "lucide-react";
import { ContactModal } from "@/components/ContactModal";
import { playClickSound } from "@/lib/sound";

export const StudioNavHeader: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"contract" | "buyCode">("contract");

  const openContractModal = () => {
    playClickSound();
    setModalMode("contract");
    setModalOpen(true);
  };

  const openBuyCodeModal = () => {
    playClickSound();
    setModalMode("buyCode");
    setModalOpen(true);
  };

  return (
    <>
      {/* Top Dedicated Studio Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#060913]/90 backdrop-blur-md border-b border-cyan-500/20 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            onClick={playClickSound}
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
            onClick={playClickSound}
            className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.2)] cursor-pointer active:scale-95"
            title="Download 1-Page Technical Architecture Blueprint (PDF)"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Blueprint (PDF)</span>
            <span className="sm:hidden">PDF</span>
          </a>

          {/* Interactive Hire for Contract Button */}
          <button
            onClick={openContractModal}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-[0_0_20px_rgba(16,185,129,0.35)] cursor-pointer active:scale-95"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Hire for Contract</span>
          </button>

          {/* Interactive Buy Code Button */}
          <button
            onClick={openBuyCodeModal}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-[0_0_18px_rgba(0,240,255,0.35)] cursor-pointer active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>Buy Code ($149)</span>
          </button>

          <a
            href="https://www.linkedin.com/in/umendra-bhati-5243aa36a/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={playClickSound}
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
            <button
              onClick={openContractModal}
              className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold transition-all flex items-center gap-1 active:scale-95 shadow-sm cursor-pointer"
            >
              <Mail className="w-3 h-3" />
              <span>Email Umendra</span>
            </button>
            <a
              href="https://www.linkedin.com/in/umendra-bhati-5243aa36a/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={playClickSound}
              className="px-2.5 py-1 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 text-[11px] font-bold transition-all flex items-center gap-1 active:scale-95 shadow-sm cursor-pointer"
            >
              <span>LinkedIn Message ↗</span>
            </a>
          </div>
        </div>
      </div>

      {/* Connected Contact Modal */}
      <ContactModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={modalMode}
      />
    </>
  );
};
