"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Cloud, Sparkles, Terminal } from "lucide-react";

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

  // Smooth 3D tilt springs
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [14, -14]), {
    damping: 24,
    stiffness: 160,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-16, 16]), {
    damping: 24,
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

  const sizeClasses = {
    sm: "w-32 h-28",
    md: "w-64 h-52",
    lg: "w-full max-w-[420px] h-72 sm:h-80",
    xl: "w-full max-w-[480px] h-88",
  }[size];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`relative flex items-center justify-center perspective-1000 ${sizeClasses} select-none`}
    >
      {/* 3D Holo-Container */}
      <motion.div
        style={{
          rotateX: interactive ? rotateX : 0,
          rotateY: interactive ? rotateY : 0,
          transformStyle: "preserve-3d",
        }}
        animate={{
          y: [0, -8, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 5,
          ease: "easeInOut",
        }}
        className="relative w-full h-full flex items-center justify-center"
      >
        {/* 1. Deep Cyber Nebula Ambient Backlight */}
        <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-[#0176D3]/35 via-[#00F0FF]/25 to-[#7C3AED]/20 blur-3xl -z-10 pointer-events-none" />

        {/* 2. Concentric Orbit Rings (SVG Precision, Non-Overlapping) */}
        {showCircuits && (
          <div
            style={{ transform: "translateZ(-20px)" }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            {/* Outer Orbit Path */}
            <div className="w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] rounded-full border border-cyan-500/15 border-dashed animate-[spin_60s_linear_infinite] relative">
              <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#00F0FF]" />
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_10px_#A855F7]" />
            </div>

            {/* Inner Elliptical Cyber Ring */}
            <div className="absolute w-[260px] h-[210px] sm:w-[300px] sm:h-[240px] rounded-[48%] border border-cyan-500/25 shadow-[0_0_20px_rgba(0,240,255,0.1)] -rotate-6" />
          </div>
        )}

        {/* 3. Central 3D Elevated Official Salesforce Cloud Logo */}
        <motion.div
          style={{ transform: "translateZ(40px)" }}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative w-64 h-40 sm:w-72 sm:h-44 flex items-center justify-center cursor-pointer group"
        >
          {/* Intense Cloud Backlight Aura */}
          <div className="absolute inset-2 bg-gradient-to-r from-[#0176D3]/60 via-[#00A1E0]/50 to-[#00F0FF]/40 rounded-full blur-2xl group-hover:blur-3xl transition-all pointer-events-none opacity-80 group-hover:opacity-100" />

          {/* Official Salesforce Vector SVG */}
          <div className="relative w-full h-full flex items-center justify-center filter drop-shadow-[0_15px_35px_rgba(1,118,211,0.6)] group-hover:drop-shadow-[0_20px_45px_rgba(0,240,255,0.7)] transition-all">
            <img
              src="/salesforce.svg"
              alt="Official Salesforce Cloud Ecosystem"
              className="w-full h-full object-contain pointer-events-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
            />
          </div>
        </motion.div>

        {/* 4. Balanced Orbital Satellite Badges (Zero Overlap Guaranteed) */}
        {showCircuits && (
          <>
            {/* Top-Right Satellite: TRAILHEAD */}
            <motion.div
              style={{ transform: "translateZ(60px)" }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute top-4 sm:top-6 right-2 sm:right-6 px-3 py-1 rounded-full bg-[#080e22]/90 border border-purple-500/40 text-[10px] font-mono text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.35),inset_0_1px_0_rgba(255,255,255,0.1)] flex items-center gap-1.5 backdrop-blur-md"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_6px_#A855F7] animate-pulse" />
              <span className="font-bold tracking-wider">TRAILHEAD</span>
            </motion.div>

            {/* Bottom-Left Satellite: SFDX DEV */}
            <motion.div
              style={{ transform: "translateZ(60px)" }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute bottom-4 sm:bottom-6 left-2 sm:left-6 px-3 py-1 rounded-full bg-[#080e22]/90 border border-cyan-500/40 text-[10px] font-mono text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.35),inset_0_1px_0_rgba(255,255,255,0.1)] flex items-center gap-1.5 backdrop-blur-md"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00F0FF] animate-pulse" />
              <span className="font-bold tracking-wider">SFDX DEV</span>
            </motion.div>

            {/* Bottom-Right Satellite: APEX & LWC */}
            <motion.div
              style={{ transform: "translateZ(60px)" }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="hidden sm:flex absolute bottom-2 right-4 px-3 py-1 rounded-full bg-[#080e22]/90 border border-emerald-500/40 text-[10px] font-mono text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.35),inset_0_1px_0_rgba(255,255,255,0.1)] items-center gap-1.5 backdrop-blur-md"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10B981] animate-pulse" />
              <span className="font-bold tracking-wider">APEX &bull; LWC</span>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
};
