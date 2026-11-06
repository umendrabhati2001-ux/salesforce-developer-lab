"use client";

import React from "react";
import { ShieldCheck, Linkedin, ExternalLink, Sparkles, Heart } from "lucide-react";
import { SalesforceLogo } from "./SalesforceLogo";
import { ParticleSalesforceFooter } from "./ParticleSalesforceFooter";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#020611] border-t border-cyan-500/20 pt-16 pb-6 text-slate-400 text-xs font-mono relative overflow-hidden">
      {/* Background radial ambient lights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-32 bg-cyan-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-48 bg-[#0176D3]/15 blur-[120px] pointer-events-none" />

      {/* Cyber Grid Dot Pattern (United Carriers Inspiration) */}
      <div className="absolute inset-0 bg-[radial-gradient(#00F0FF_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.07] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Info & Links Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-12 border-b border-slate-900/80">
          
          {/* Brand & Safety with Official 3D Salesforce Logo */}
          <div className="flex items-center gap-3">
            <SalesforceLogo size="sm" />
            <div>
              <div className="font-extrabold text-white text-sm tracking-tight flex items-center gap-2">
                Salesforce Developer Lab
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[10px] text-cyan-300 font-mono">
                  v2.0
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400 mt-0.5 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5" />
                SFDX Source Isolated &bull; force-app/ 100% Untouched
              </div>
            </div>
          </div>

          {/* Quick Jump Links */}
          <div className="flex flex-wrap items-center justify-center gap-5 text-slate-400 text-xs">
            <a href="#hero" className="hover:text-cyan-300 transition-colors">
              Overview
            </a>
            <a href="#roadmap" className="hover:text-cyan-300 transition-colors">
              Roadmap (17/25+)
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
              Flashcards
            </a>
          </div>

          {/* Umendra Bhati LinkedIn Button */}
          <div className="flex items-center gap-3">
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-emerald-500/40 text-white hover:text-cyan-300 text-xs font-mono transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.2)] group"
            >
              <Linkedin className="w-3.5 h-3.5 text-[#0A66C2] group-hover:scale-110 transition-transform" />
              <span>Umendra Bhati</span>
              <span className="text-[10px] text-emerald-400 font-bold">#OPENTOWORK</span>
              <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-cyan-300" />
            </a>
          </div>

        </div>

        {/* Subline Credits */}
        <div className="py-6 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-500 border-b border-slate-900/60">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-slate-300 font-mono">Live Interactive Developer Hub</span>
            <span className="text-slate-700">&bull;</span>
            <span>Jaipur &amp; Remote</span>
          </div>

          <div className="flex items-center gap-3">
            <span>Enterprise B2B Architecture</span>
            <span className="text-slate-700">&bull;</span>
            <span className="text-cyan-400">NexGen Cloud Solutions Capstone</span>
          </div>
        </div>

      </div>

      {/* ===================================================================== */}
      {/* UNITED CARRIERS STYLE: INTERACTIVE PARTICLE SALESFORCE CANVAS        */}
      {/* Hovering cursor scatters particles; moving away springs them back     */}
      {/* ===================================================================== */}
      <div className="relative w-full pt-6 pb-2 overflow-hidden">
        
        {/* Ambient Backlight */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-gradient-to-t from-[#0176D3]/20 via-[#00F0FF]/15 to-transparent blur-3xl pointer-events-none" />

        {/* Physics-Based Particle Salesforce Wordmark */}
        <ParticleSalesforceFooter />

        {/* Bottommost Copyright Bar */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 mt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-slate-600 font-mono">
          <span>&copy; {new Date().getFullYear()} Umendra Bhati. All rights reserved.</span>
          <span className="text-slate-500">
            Powered by Next.js 15 &bull; Tailwind CSS &bull; Salesforce DX &bull; HTML5 Canvas Physics
          </span>
        </div>

      </div>

    </footer>
  );
};
