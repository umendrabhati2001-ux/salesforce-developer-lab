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

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [18, -18]), {
    damping: 20,
    stiffness: 140,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-20, 20]), {
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
    sm: "w-24 h-16",
    md: "w-44 h-28",
    lg: "w-72 h-48",
    xl: "w-96 h-64",
  }[size];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`relative flex items-center justify-center perspective-1000 ${sizeClasses}`}
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
        className="relative w-full h-full flex items-center justify-center"
      >
        {/* Background Multi-layer Radial Glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#0176D3]/40 via-[#00F0FF]/30 to-[#9333EA]/30 blur-2xl -z-10 animate-pulse pointer-events-none" />

        {/* Outer Orbit Rings (Cyber Ecosystem) */}
        {showCircuits && (
          <div
            style={{ transform: "translateZ(-20px)" }}
            className="absolute inset-[-20%] rounded-full border border-cyan-500/20 pointer-events-none"
          >
            <div className="absolute top-0 left-1/4 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#00F0FF] animate-ping" />
            <div className="absolute bottom-1/4 right-0 w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_10px_#A855F7]" />
          </div>
        )}

        {/* Multi-layered 3D Salesforce Cloud SVG */}
        <div
          style={{ transform: "translateZ(30px)" }}
          className="relative w-full h-full flex items-center justify-center filter drop-shadow-[0_15px_30px_rgba(0,240,255,0.35)]"
        >
          <svg
            viewBox="0 0 200 135"
            className="w-full h-full overflow-visible"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Outer Neon Glowing Stroke Gradient */}
              <linearGradient id="cloudBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00F0FF" />
                <stop offset="35%" stopColor="#0176D3" />
                <stop offset="70%" stopColor="#9333EA" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>

              {/* Radiant 3D Salesforce Blue Body Gradient */}
              <linearGradient id="cloudBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00F0FF" />
                <stop offset="25%" stopColor="#00A1E0" />
                <stop offset="65%" stopColor="#0176D3" />
                <stop offset="100%" stopColor="#083E7D" />
              </linearGradient>

              {/* Gloss Highlight Gradient */}
              <linearGradient id="cloudGloss" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
                <stop offset="40%" stopColor="rgba(0,240,255,0.15)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0)" />
              </linearGradient>

              {/* Neon Glow Filter */}
              <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Circuit traces connecting to the cloud */}
            {showCircuits && (
              <g opacity="0.6">
                <line x1="10" y1="90" x2="45" y2="90" stroke="#00F0FF" strokeWidth="1.5" strokeDasharray="3 3" />
                <circle cx="10" cy="90" r="2.5" fill="#00F0FF" />

                <line x1="160" y1="35" x2="195" y2="35" stroke="#9333EA" strokeWidth="1.5" strokeDasharray="3 3" />
                <circle cx="195" cy="35" r="2.5" fill="#9333EA" />

                <line x1="170" y1="105" x2="195" y2="120" stroke="#0176D3" strokeWidth="1.5" />
                <circle cx="195" cy="120" r="2" fill="#0176D3" />
              </g>
            )}

            {/* Cloud Shadow Layer */}
            <path
              d="M 68 32 A 38 38 0 0 1 134 32 A 28 28 0 0 1 168 62 A 25 25 0 0 1 155 108 L 48 108 A 28 28 0 0 1 32 64 A 36 36 0 0 1 68 32 Z"
              fill="#011627"
              transform="translate(0, 7)"
              opacity="0.8"
            />

            {/* Cloud Body Layer */}
            <path
              d="M 68 32 A 38 38 0 0 1 134 32 A 28 28 0 0 1 168 62 A 25 25 0 0 1 155 108 L 48 108 A 28 28 0 0 1 32 64 A 36 36 0 0 1 68 32 Z"
              fill="url(#cloudBodyGrad)"
              stroke="url(#cloudBorderGrad)"
              strokeWidth="3.5"
              filter="url(#neonGlow)"
            />

            {/* Glass Gloss Upper Highlight */}
            <path
              d="M 68 34 A 36 36 0 0 1 132 34 A 26 26 0 0 1 164 62 C 150 68 115 72 75 70 C 45 68 35 62 34 62 A 34 34 0 0 1 68 34 Z"
              fill="url(#cloudGloss)"
            />

            {/* Internal Circuit Tracks */}
            <g opacity="0.4" stroke="#00F0FF" strokeWidth="1" fill="none">
              <path d="M 60 75 H 90 L 100 85 H 135" />
              <circle cx="60" cy="75" r="1.5" fill="#00F0FF" />
              <circle cx="135" cy="85" r="1.5" fill="#00F0FF" />
            </g>

            {/* Salesforce Typography */}
            <text
              x="100"
              y="74"
              textAnchor="middle"
              fill="#FFFFFF"
              fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
              fontSize="19"
              fontWeight="900"
              fontStyle="italic"
              letterSpacing="-0.6px"
              style={{
                filter: "drop-shadow(0 2px 4px rgba(0,20,50,0.6))",
              }}
            >
              salesforce
            </text>

            {/* Small subtle tech subline */}
            <text
              x="100"
              y="92"
              textAnchor="middle"
              fill="#00F0FF"
              fontFamily="ui-monospace, monospace"
              fontSize="7.5"
              fontWeight="600"
              letterSpacing="1.5px"
              opacity="0.85"
            >
              CLOUD ECOSYSTEM
            </text>
          </svg>
        </div>

        {/* 3D Floating Trailhead & Dev Micro-badges */}
        {showCircuits && (
          <>
            <motion.div
              style={{ transform: "translateZ(55px)" }}
              className="absolute -top-3 -right-2 px-2 py-0.5 rounded-full bg-slate-900/90 border border-purple-500/50 text-[10px] font-mono text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.4)] flex items-center gap-1"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              TRAILHEAD
            </motion.div>

            <motion.div
              style={{ transform: "translateZ(50px)" }}
              className="absolute -bottom-2 -left-2 px-2 py-0.5 rounded-full bg-slate-900/90 border border-cyan-500/50 text-[10px] font-mono text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.4)] flex items-center gap-1"
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
