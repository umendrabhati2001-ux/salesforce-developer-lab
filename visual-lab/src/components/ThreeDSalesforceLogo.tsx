"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface ThreeDSalesforceLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showCircuits?: boolean;
  interactive?: boolean;
}

export const ThreeDSalesforceLogo: React.FC<ThreeDSalesforceLogoProps> = ({
  size = "lg",
  showCircuits = true,
  interactive = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for smooth 3D tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [16, -16]), {
    damping: 20,
    stiffness: 140,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-18, 18]), {
    damping: 20,
    stiffness: 140,
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

  const sizeClasses = {
    sm: "w-28 h-24",
    md: "w-60 h-44",
    lg: "w-80 h-60 sm:w-96 sm:h-72",
    xl: "w-full max-w-[460px] h-80",
  }[size];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`relative flex flex-col items-center justify-center perspective-1000 ${sizeClasses}`}
    >
      {/* 3D Tilting Container */}
      <motion.div
        style={{
          rotateX: interactive ? rotateX : 0,
          rotateY: interactive ? rotateY : 0,
          transformStyle: "preserve-3d",
        }}
        animate={{
          y: [0, -6, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 4.5,
          ease: "easeInOut",
        }}
        className="relative w-full h-full flex flex-col items-center justify-center"
      >
        {/* Top Header Floating Pill: Umendra Bhati • #OPENTOWORK */}
        {showCircuits && (
          <motion.div
            style={{ transform: "translateZ(45px)" }}
            className="mb-3 px-3.5 py-1 rounded-full bg-slate-900/90 border border-emerald-500/40 text-[11px] font-mono text-slate-200 shadow-[0_0_15px_rgba(16,185,129,0.25)] flex items-center gap-2 select-none"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-white">Umendra Bhati</span>
            <span className="text-slate-500">&bull;</span>
            <span className="text-emerald-400 font-bold">#OPENTOWORK</span>
            <span className="text-slate-500">&bull;</span>
            <span className="text-cyan-300">Cloud Solutions</span>
          </motion.div>
        )}

        {/* Ambient Multi-layer Radial Glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#0176D3]/35 via-[#00F0FF]/25 to-[#9333EA]/20 blur-3xl -z-10 animate-pulse pointer-events-none" />

        {/* Orbit Rings (Cyber Ecosystem) with SVG connector lines */}
        {showCircuits && (
          <div
            style={{ transform: "translateZ(-15px)" }}
            className="absolute inset-2 sm:inset-0 rounded-[40%] border border-cyan-500/25 pointer-events-none"
          >
            <div className="absolute top-2 left-10 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#00F0FF] animate-ping" />
            <div className="absolute bottom-6 right-6 w-2.5 h-2.5 rounded-full bg-purple-400 shadow-[0_0_12px_#A855F7]" />
            <div className="absolute top-1/2 left-2 w-1.5 h-1.5 rounded-full bg-cyan-400/80" />
            <div className="absolute top-1/3 right-2 w-1.5 h-1.5 rounded-full bg-pink-400/80" />
          </div>
        )}

        {/* Central Official Salesforce Logo inside 3D Elevation */}
        <div
          style={{ transform: "translateZ(35px)" }}
          className="relative w-56 h-36 sm:w-64 sm:h-44 flex items-center justify-center p-2"
        >
          {/* Neon Aura Behind Logo */}
          <div className="absolute inset-4 bg-gradient-to-tr from-[#0176D3]/50 to-[#00A1E0]/30 rounded-full blur-xl pointer-events-none" />

          {/* Official Salesforce Vector SVG */}
          <div className="relative w-full h-full flex items-center justify-center filter drop-shadow-[0_15px_30px_rgba(1,118,211,0.55)]">
            <img
              src="/salesforce.svg"
              alt="Official Salesforce Cloud Ecosystem"
              className="w-full h-full object-contain select-none pointer-events-none"
            />
          </div>
        </div>

        {/* 3D Floating Trailhead & SFDX Dev Micro-badges with Connector Lines */}
        {showCircuits && (
          <>
            {/* Top Right Trailhead Badge */}
            <motion.div
              style={{ transform: "translateZ(55px)" }}
              className="absolute top-12 right-0 sm:right-4 px-2.5 py-1 rounded-full bg-slate-900/90 border border-purple-500/50 text-[10px] font-mono text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.35)] flex items-center gap-1.5 select-none"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              TRAILHEAD
            </motion.div>

            {/* Bottom Left SFDX DEV Badge */}
            <motion.div
              style={{ transform: "translateZ(55px)" }}
              className="absolute bottom-6 left-0 sm:left-4 px-2.5 py-1 rounded-full bg-slate-900/90 border border-cyan-500/50 text-[10px] font-mono text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.35)] flex items-center gap-1.5 select-none"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              SFDX DEV
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
};
