"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Layers,
  Database,
  Zap,
  ArrowRight,
  GitBranch,
  Terminal,
  Linkedin,
  Sparkles,
} from "lucide-react";
import { ThreeDSalesforceLogo } from "./ThreeDSalesforceLogo";
import { DeveloperBadgeCard } from "./DeveloperBadgeCard";
import { playClickSound } from "@/lib/sound";

export const HeroSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Smooth mouse parallax motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring physics for 3D tilt
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), {
    damping: 24,
    stiffness: 150,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), {
    damping: 24,
    stiffness: 150,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section
      id="hero"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative pt-32 pb-20 md:pt-36 md:pb-24 border-b border-cyan-500/20 bg-[#030712] cyber-grid overflow-hidden"
    >
      {/* Radiant High-Tech Ambient Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[550px] bg-gradient-to-tr from-[#0176D3]/25 via-[#00F0FF]/20 to-purple-600/20 blur-[150px] pointer-events-none -z-10 rounded-full" />
      <div className="absolute top-10 right-10 w-80 h-80 bg-cyan-500/10 blur-[100px] pointer-events-none -z-10 rounded-full" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-purple-600/10 blur-[100px] pointer-events-none -z-10 rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Developer & Salesforce DX Announcement Pill */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/40 text-xs shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
            </span>
            <span className="font-semibold text-cyan-300">Salesforce DX Command Center:</span>
            <span className="text-slate-300 font-mono">11 Topics Verified Hands-On</span>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400 flex items-center gap-1 font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              Source Isolated 100%
            </span>
          </div>

          {/* Compact Open to Work Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold">Umendra Bhati</span>
            <span className="text-slate-500">&bull;</span>
            <span>#OPENTOWORK</span>
            <span className="text-slate-500">&bull;</span>
            <span className="text-slate-300">Cloud Solutions</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Hero Text & Status Badges */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Radiant Tech Headline */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
                Architectural Mastery <br />
                <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
                  Salesforce Interactive Lab
                </span>
              </h1>
              <p className="text-sm sm:text-lg text-slate-300 max-w-2xl pt-1 leading-relaxed">
                Step inside an engineering-grade interactive visual portal loaded with real workspace 
                code: verified Apex collections, relationship SOQL queries, partial-success DML engines, 
                and the Enterprise Customer Complaint Management Capstone.
              </p>
            </div>

            {/* Quick Stats Grid with Cyber Colors */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 py-2">
              <motion.div
                whileHover={{ y: -3, borderColor: "#00F0FF" }}
                className="p-3 sm:p-3.5 rounded-xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 transition-all shadow-sm"
              >
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[11px] sm:text-xs font-mono uppercase">Completed</span>
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-white font-mono">
                  11 <span className="text-xs text-slate-500 font-normal">/ 25+</span>
                </div>
                <div className="text-[10px] sm:text-[11px] text-emerald-400 font-medium mt-0.5 truncate">
                  Phases A, B &amp; C1 Done
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -3, borderColor: "#00F0FF" }}
                className="p-3 sm:p-3.5 rounded-xl bg-gradient-to-b from-cyan-950/50 to-slate-950 border border-cyan-500/50 transition-all shadow-[0_0_15px_rgba(0,240,255,0.2)]"
              >
                <div className="flex items-center justify-between text-cyan-400 mb-1">
                  <span className="text-[11px] sm:text-xs font-mono uppercase">Active Focus</span>
                  <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400 animate-pulse" />
                </div>
                <div className="text-lg sm:text-xl font-black text-cyan-200 font-mono truncate">
                  Topic 12
                </div>
                <div className="text-[10px] sm:text-[11px] text-cyan-300 font-medium truncate mt-0.5">
                  Apex Triggers
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -3, borderColor: "#0176D3" }}
                className="p-3 sm:p-3.5 rounded-xl bg-gradient-to-b from-blue-950/40 to-slate-950 border border-blue-500/30 transition-all"
              >
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[11px] sm:text-xs font-mono uppercase">Capstone</span>
                  <GitBranch className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-400" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-white font-mono">Live</div>
                <div className="text-[10px] sm:text-[11px] text-sky-400 font-medium truncate mt-0.5">
                  Complaint Service
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -3, borderColor: "#10B981" }}
                className="p-3 sm:p-3.5 rounded-xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 transition-all"
              >
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[11px] sm:text-xs font-mono uppercase">SFDX Files</span>
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">100%</div>
                <div className="text-[10px] sm:text-[11px] text-slate-400 font-medium mt-0.5 truncate">
                  Safe &amp; Untouched
                </div>
              </motion.div>
            </div>

            {/* High-Tech Action Buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 pt-2">
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="#visualizers"
                onClick={playClickSound}
                className="px-5 sm:px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-[#0176D3] text-slate-950 font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:brightness-110 transition-all flex items-center justify-center gap-2 group"
              >
                <Cpu className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                Launch Simulators
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="#apex-cli"
                onClick={playClickSound}
                className="px-5 sm:px-6 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 font-mono text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.15)]"
              >
                <Terminal className="w-4 h-4 text-cyan-400" />
                Apex Anonymous REPL
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={playClickSound}
                className="px-4 py-3 rounded-xl bg-[#0A66C2]/20 hover:bg-[#0A66C2]/30 border border-[#0A66C2]/50 text-white text-xs sm:text-sm font-mono flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                Umendra Bhati
              </motion.a>
            </div>

          </div>

          {/* Right Column: 3D Salesforce Logo & Architect Card Showcase */}
          <div className="lg:col-span-5 flex flex-col items-center gap-6 perspective-1000">
            
            {/* 3D Salesforce Cloud Logo with Circuit Network */}
            <motion.div
              style={{
                rotateX: rotateX,
                rotateY: rotateY,
                transformStyle: "preserve-3d",
              }}
              className="w-full flex justify-center py-2"
            >
              <ThreeDSalesforceLogo size="lg" showCircuits={true} interactive={true} />
            </motion.div>

            {/* Umendra Bhati Profile Badge Card */}
            <div className="w-full max-w-[420px]">
              <DeveloperBadgeCard />
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
