"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ExternalLink,
  MapPin,
  CheckCircle2,
  Briefcase,
  Sparkles,
  Linkedin,
  ShieldCheck,
  Send,
  Code2,
} from "lucide-react";
import { playClickSound } from "@/lib/sound";

export const DeveloperBadgeCard: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    playClickSound();
    navigator.clipboard.writeText("https://www.linkedin.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (compact) {
    return (
      <a
        href="https://www.linkedin.com"
        target="_blank"
        rel="noopener noreferrer"
        onClick={playClickSound}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-emerald-500/40 text-xs shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all group"
      >
        <div className="relative">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 p-[1.5px] flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-[10px] font-bold text-white">
              UB
            </div>
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-slate-950 animate-pulse" />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-[11px] font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1">
            Umendra Bhati
            <span className="text-[9px] text-emerald-400 font-mono font-semibold">#OPENTOWORK</span>
          </span>
          <span className="text-[9px] text-slate-400 font-mono">SFDX Admin & Developer</span>
        </div>
        <Linkedin className="w-3.5 h-3.5 text-[#0A66C2] ml-1 group-hover:scale-110 transition-transform" />
      </a>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="relative rounded-2xl bg-gradient-to-b from-slate-900/95 via-slate-950/95 to-[#050B14] border border-cyan-500/30 p-5 shadow-2xl backdrop-blur-xl overflow-hidden group hover:border-cyan-400/60 transition-all"
    >
      {/* Background ambient neon pulse */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-cyan-500/15 via-blue-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />

      {/* Top Banner Tag */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono text-emerald-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-bold">#OPENTOWORK</span>
          <span className="text-slate-500">&bull;</span>
          <span className="text-slate-300">Jaipur &amp; Remote</span>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>Verified Architect</span>
        </div>
      </div>

      {/* Main Profile Info Row */}
      <div className="flex items-start gap-4">
        {/* Avatar with #OPENTOWORK Ring */}
        <div className="relative shrink-0">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-400 via-cyan-400 to-[#0176D3] p-[2.5px] shadow-[0_0_20px_rgba(16,185,129,0.35)]">
            <div className="w-full h-full rounded-full bg-[#0a1628] flex items-center justify-center font-black text-lg text-white font-mono">
              UB
            </div>
          </div>
          {/* Open to Work Badge Ring */}
          <div className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full bg-emerald-500 text-[8px] font-bold text-slate-950 font-mono tracking-tighter shadow-md">
            ACTIVE
          </div>
        </div>

        {/* Text Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-1.5">
              Umendra Bhati
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">He/Him</span>
          </div>

          <p className="text-xs font-semibold text-cyan-300 mt-0.5">
            Salesforce Admin &amp; Developer &bull; Cloud Solutions
          </p>

          <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] text-slate-400 font-mono">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-red-400" />
              Rajasthan, India
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1 text-slate-300">
              <Briefcase className="w-3 h-3 text-cyan-400" />
              Remote &bull; On-Site &bull; Hybrid
            </span>
          </div>
        </div>
      </div>

      {/* Focus & Mastery Pills */}
      <div className="mt-4 pt-3 border-t border-slate-800/80">
        <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          Technical Specialization &amp; Hands-On Lab
        </div>
        <div className="flex flex-wrap gap-1.5">
          {[
            "Apex Trigger Architecture",
            "Governor Limits Bulkification",
            "Relationship SOQL",
            "Partial-Success DML",
            "Complaint Service Capstone",
          ].map((skill, idx) => (
            <span
              key={idx}
              className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-950/80 border border-cyan-500/20 text-slate-300"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Action Buttons: LinkedIn + Connect */}
      <div className="mt-4 pt-3 flex items-center gap-2.5">
        <motion.a
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          href="https://www.linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          onClick={playClickSound}
          className="flex-1 py-2 px-3 rounded-xl bg-[#0A66C2] hover:bg-[#004182] text-white text-xs font-bold font-mono transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(10,102,194,0.3)]"
        >
          <Linkedin className="w-3.5 h-3.5" />
          Connect on LinkedIn
          <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
        </motion.a>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCopyLink}
          className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-mono transition-colors flex items-center gap-1.5"
          title="Copy Profile Link"
        >
          {copied ? (
            <span className="text-emerald-400 font-bold">Copied!</span>
          ) : (
            <>
              <Code2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Share</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};
