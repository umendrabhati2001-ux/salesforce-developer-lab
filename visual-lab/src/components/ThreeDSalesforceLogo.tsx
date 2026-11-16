"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { Sparkles, Shield, Cpu, Activity, Zap, Layers } from "lucide-react";
import { playClickSound } from "@/lib/sound";

interface ThreeDSalesforceLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showCircuits?: boolean;
  interactive?: boolean;
}

type CoreMode = "cloud" | "apex" | "lwc";

export const ThreeDSalesforceLogo: React.FC<ThreeDSalesforceLogoProps> = ({
  size = "lg",
  showCircuits = true,
  interactive = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<CoreMode>("cloud");
  const [isHovered, setIsHovered] = useState(false);

  // Smooth 3D tilt physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), {
    damping: 25,
    stiffness: 160,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-14, 14]), {
    damping: 25,
    stiffness: 160,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  // Mode configurations
  const modeConfig = {
    cloud: {
      name: "Cloud Core",
      color: "#0176D3",
      glow: "from-[#0176D3]/40 via-[#00F0FF]/30 to-purple-600/20",
      pillBorder: "border-cyan-500/40 text-cyan-300",
      accent: "text-cyan-400",
      metric1: { label: "Multi-Tenant", value: "Active • 99.99%" },
      metric2: { label: "Isolation", value: "100% SFDX Safe" },
    },
    apex: {
      name: "Apex Reactor",
      color: "#10B981",
      glow: "from-emerald-600/40 via-cyan-500/30 to-blue-600/20",
      pillBorder: "border-emerald-500/40 text-emerald-300",
      accent: "text-emerald-400",
      metric1: { label: "SOQL Engine", value: "100 Queries Max" },
      metric2: { label: "Heap Safety", value: "6.0 MB Guard" },
    },
    lwc: {
      name: "LWC Spatial",
      color: "#A855F7",
      glow: "from-purple-600/40 via-pink-500/30 to-cyan-500/20",
      pillBorder: "border-purple-500/40 text-purple-300",
      accent: "text-purple-400",
      metric1: { label: "Reactive Wire", value: "Shadow DOM v3" },
      metric2: { label: "Lightning Web", value: "Zero-Latency" },
    },
  }[mode];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[440px] perspective-1000 select-none py-1"
    >
      {/* Outer 3D Glassmorphic Holo-Pod Container */}
      <motion.div
        style={{
          rotateX: interactive ? rotateX : 0,
          rotateY: interactive ? rotateY : 0,
          transformStyle: "preserve-3d",
        }}
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        className="relative w-full rounded-3xl bg-[#070b18]/85 border border-white/[0.12] backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.15)] p-5 sm:p-6 overflow-hidden flex flex-col items-center"
      >
        {/* Dynamic Multi-Color Cyber Aura */}
        <div
          className={`absolute -inset-10 bg-gradient-to-tr ${modeConfig.glow} blur-3xl -z-10 opacity-70 transition-all duration-700 pointer-events-none`}
        />

        {/* Ambient Top Rim Spotlight */}
        <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />

        {/* Top Header: System Telemetry & Mode Selector Tabs */}
        <div className="w-full flex items-center justify-between gap-2 pb-4 border-b border-white/[0.08] relative z-10">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
            </span>
            <span className="text-[11px] font-mono font-bold tracking-wider text-slate-300 uppercase">
              Holo-Reactor
            </span>
          </div>

          {/* Interactive Mode Pills */}
          <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-full border border-white/[0.06]">
            {(["cloud", "apex", "lwc"] as CoreMode[]).map((m) => (
              <button
                key={m}
                onClick={() => {
                  playClickSound();
                  setMode(m);
                }}
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold transition-all ${
                  mode === m
                    ? "bg-white/15 text-white shadow-[0_0_10px_rgba(255,255,255,0.2)] border border-white/20"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.06]"
                }`}
              >
                {m.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Central 3D Floating Stage with Concentric Orbital Beams */}
        <div className="relative w-full h-52 sm:h-56 flex items-center justify-center my-2">
          {/* Holographic Projection Grid Beneath Logo */}
          <div
            style={{ transform: "translateZ(-15px)" }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            {/* Outer Slow-Spinning Dashed Compass Ring */}
            <div className="w-52 h-52 sm:w-60 sm:h-60 rounded-full border border-cyan-500/20 border-dashed animate-[spin_50s_linear_infinite] relative">
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00F0FF]" />
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_#A855F7]" />
            </div>

            {/* Inner Glowing Elevation Disc */}
            <div className="absolute w-44 h-44 sm:w-48 sm:h-48 rounded-full bg-[radial-gradient(circle,rgba(0,240,255,0.08)_0%,transparent_70%)] border border-cyan-400/20" />
          </div>

          {/* The Official Salesforce Cloud with Dynamic 3D Elevate */}
          <motion.div
            style={{ transform: "translateZ(45px)" }}
            whileHover={{ scale: 1.08 }}
            transition={{ type: "spring", stiffness: 350, damping: 22 }}
            className="relative w-56 h-36 sm:w-64 sm:h-40 flex items-center justify-center cursor-pointer group"
          >
            {/* Reactive Cloud Aura Glow */}
            <div
              className={`absolute inset-0 rounded-full bg-gradient-to-r ${modeConfig.glow} blur-2xl group-hover:blur-3xl transition-all opacity-80 group-hover:opacity-100 pointer-events-none`}
            />

            {/* Official Salesforce Vector SVG */}
            <div className="relative w-full h-full flex items-center justify-center filter drop-shadow-[0_16px_32px_rgba(1,118,211,0.6)] group-hover:drop-shadow-[0_22px_44px_rgba(0,240,255,0.8)] transition-all">
              <img
                src="/salesforce.svg"
                alt="Salesforce Core Ecosystem"
                className="w-full h-full object-contain pointer-events-none"
              />
            </div>
          </motion.div>

          {/* Floating High-Tech Orbit Micro-Badges */}
          {showCircuits && (
            <>
              {/* Top-Right Tag */}
              <motion.div
                style={{ transform: "translateZ(55px)" }}
                className="absolute top-3 right-1 sm:right-3 px-2.5 py-0.5 rounded-full bg-[#080d1e]/90 border border-purple-500/40 text-[9px] font-mono text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.3)] flex items-center gap-1.5 backdrop-blur-md"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                <span>TRAILHEAD</span>
              </motion.div>

              {/* Bottom-Left Tag */}
              <motion.div
                style={{ transform: "translateZ(55px)" }}
                className="absolute bottom-3 left-1 sm:left-3 px-2.5 py-0.5 rounded-full bg-[#080d1e]/90 border border-cyan-500/40 text-[9px] font-mono text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.3)] flex items-center gap-1.5 backdrop-blur-md"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>SFDX DEV</span>
              </motion.div>
            </>
          )}
        </div>

        {/* Bottom Live Telemetry Footer (Changes dynamically based on mode!) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="w-full grid grid-cols-2 gap-2 pt-3 border-t border-white/[0.08] relative z-10"
          >
            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex flex-col">
              <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                <Activity className="w-3 h-3 text-cyan-400" />
                {modeConfig.metric1.label}
              </span>
              <span className="text-xs font-mono font-bold text-white mt-0.5">
                {modeConfig.metric1.value}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex flex-col">
              <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                <Shield className="w-3 h-3 text-emerald-400" />
                {modeConfig.metric2.label}
              </span>
              <span className="text-xs font-mono font-bold text-emerald-300 mt-0.5">
                {modeConfig.metric2.value}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
