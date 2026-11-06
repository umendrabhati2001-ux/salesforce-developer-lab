"use client";

import React from "react";
import { ShieldCheck, Linkedin, ExternalLink, Sparkles, Heart } from "lucide-react";
import { SalesforceLogo } from "./SalesforceLogo";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#020611] border-t border-cyan-500/20 py-12 text-slate-400 text-xs font-mono relative overflow-hidden">
      {/* Subtle bottom glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-cyan-500/10 blur-[90px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Brand & Safety with Official 3D Salesforce Logo */}
          <div className="flex items-center gap-3">
            <SalesforceLogo size="sm" />
            <div>
              <div className="font-extrabold text-white text-sm">
                Salesforce Developer Lab &bull; Visual Lab
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400 mt-0.5 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5" />
                SFDX Source Isolated &amp; 100% Safe (force-app/ untouched)
              </div>
            </div>
          </div>

          {/* Quick Jump Links */}
          <div className="flex flex-wrap items-center justify-center gap-5 text-slate-400">
            <a href="#hero" className="hover:text-cyan-300 transition-colors">
              Overview
            </a>
            <a href="#roadmap" className="hover:text-cyan-300 transition-colors">
              Roadmap (11/25+)
            </a>
            <a href="#visualizers" className="hover:text-cyan-300 transition-colors">
              Simulators
            </a>
            <a href="#pattern-matrix" className="hover:text-cyan-300 transition-colors">
              3D Architecture Cube
            </a>
            <a href="#code-arena" className="hover:text-cyan-300 transition-colors">
              Code Arena
            </a>
            <a href="#interview-prep" className="hover:text-cyan-300 transition-colors">
              Spotlight Flashcards
            </a>
          </div>

          {/* Umendra Bhati LinkedIn Button */}
          <div className="flex items-center gap-3">
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/30 text-white hover:text-cyan-300 text-xs font-mono transition-all flex items-center gap-2 shadow-[0_0_12px_rgba(0,240,255,0.15)] group"
            >
              <Linkedin className="w-3.5 h-3.5 text-[#0A66C2] group-hover:scale-110 transition-transform" />
              <span>Umendra Bhati</span>
              <span className="text-[10px] text-emerald-400 font-bold">#OPENTOWORK</span>
              <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-cyan-300" />
            </a>
          </div>

        </div>

        {/* Footer Subline */}
        <div className="mt-8 pt-8 border-t border-slate-900 text-center text-slate-500 flex flex-wrap items-center justify-center gap-3 text-[11px]">
          <span>Built for Salesforce DX Developers &amp; Architects</span>
          <span>&bull;</span>
          <span className="text-cyan-400">Electric Cyan &bull; Salesforce Blue &bull; Cyber Dark</span>
          <span>&bull;</span>
          <span className="flex items-center gap-1 text-slate-400">
            Engineered by <span className="text-white font-semibold">Umendra Bhati</span> (Rajasthan, India)
          </span>
        </div>
      </div>
    </footer>
  );
};
