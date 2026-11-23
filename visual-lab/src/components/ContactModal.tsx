"use client";

import React, { useState } from "react";
import {
  Mail,
  Copy,
  Check,
  ExternalLink,
  Linkedin,
  Briefcase,
  Sparkles,
  X,
  Send
} from "lucide-react";
import { playClickSound, playSuccessSound } from "@/lib/sound";

export interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: "contract" | "buyCode";
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  mode = "contract"
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const email = "umendrabhati2001@gmail.com";
  const subject =
    mode === "buyCode"
      ? "Inquiry: Commercial Source Code License ($149)"
      : "Contract Engagement Inquiry - Salesforce DX";
  const body =
    mode === "buyCode"
      ? "Hi Umendra,\n\nI would like to purchase the commercial source code license for the Salesforce Developer Lab ($149).\n\nPlease provide payment and repository access details.\n\nBest regards"
      : "Hi Umendra,\n\nWe reviewed your Salesforce Developer Lab & Studio and would like to discuss a remote contract engagement.\n\nWeekly Hours: 15–30 hrs\nTarget Start: Immediate\nRate Range: $35–$60/hr\n\nBest regards";

  const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    email
  )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;

  const handleCopyEmail = () => {
    playSuccessSound();
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md rounded-2xl bg-[#0B0F19] border border-cyan-500/40 p-6 shadow-[0_0_50px_rgba(0,240,255,0.25)] flex flex-col gap-5 text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            playClickSound();
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 text-cyan-300">
            {mode === "buyCode" ? (
              <Sparkles className="w-6 h-6 fill-current" />
            ) : (
              <Briefcase className="w-6 h-6 text-emerald-400" />
            )}
          </div>
          <div>
            <h3 className="text-base font-mono font-bold text-white">
              {mode === "buyCode" ? "Purchase Source Code ($149)" : "Hire Umendra Bhati"}
            </h3>
            <p className="text-xs font-mono text-slate-400">
              {mode === "buyCode"
                ? "Full Monorepo + Commercial License"
                : "Available for Remote Contract ($35–$60/hr)"}
            </p>
          </div>
        </div>

        {/* Quick Email Copy Box */}
        <div className="p-3.5 rounded-xl bg-black/50 border border-white/[0.08] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="text-xs font-mono text-slate-200 truncate select-all">
              {email}
            </span>
          </div>
          <button
            onClick={handleCopyEmail}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              copied
                ? "bg-emerald-500 text-slate-950 font-bold"
                : "bg-white/[0.08] hover:bg-white/[0.15] text-cyan-300 border border-cyan-500/30"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Direct Action Channels */}
        <div className="flex flex-col gap-2.5">
          {/* Option 1: Open in Web Gmail (100% Reliable across all browsers) */}
          <a
            href={gmailWebUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={playClickSound}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-mono font-bold transition-all flex items-center justify-between shadow-lg cursor-pointer active:scale-98"
          >
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>Compose in Web Gmail</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>

          {/* Option 2: LinkedIn Direct Message */}
          <a
            href="https://www.linkedin.com/in/umendra-bhati-5243aa36a/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={playClickSound}
            className="w-full py-2.5 px-4 rounded-xl bg-[#0A66C2] hover:bg-[#004182] text-white text-xs font-mono font-bold transition-all flex items-center justify-between shadow-md cursor-pointer active:scale-98"
          >
            <div className="flex items-center gap-2">
              <Linkedin className="w-4 h-4 fill-current" />
              <span>Direct Message on LinkedIn</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>

          {/* Option 3: Default Native Mail Client (mailto) */}
          <a
            href={mailtoUrl}
            onClick={playClickSound}
            className="w-full py-2 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 text-xs font-mono transition-all flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Send className="w-3.5 h-3.5 text-slate-400" />
              <span>Open in Default System Mail App</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">mailto:</span>
          </a>
        </div>

        {/* Guaranteed Response Time Note */}
        <div className="text-center text-[11px] font-mono text-slate-400 border-t border-white/[0.06] pt-3">
          ⚡ Direct access • Response typically within <strong className="text-cyan-300">2–4 hours</strong>
        </div>
      </div>
    </div>
  );
};
