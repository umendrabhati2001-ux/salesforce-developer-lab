"use client";

import React from "react";
import { motion } from "framer-motion";

interface SalesforceLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
  withGlow?: boolean;
}

export const SalesforceLogo: React.FC<SalesforceLogoProps> = ({
  className = "",
  size = "md",
  animated = true,
  withGlow = true,
}) => {
  const sizeMap = {
    sm: "w-9 h-6",
    md: "w-12 h-8",
    lg: "w-20 h-14",
    xl: "w-32 h-22",
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <motion.div
      whileHover={animated ? { scale: 1.08, rotate: [0, -2, 2, 0] } : undefined}
      transition={{ duration: 0.3 }}
      className={`relative inline-flex items-center justify-center shrink-0 ${currentSize} ${className}`}
    >
      {/* Dynamic Ambient Neon Glow */}
      {withGlow && (
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0176D3] via-[#00F0FF] to-[#8B5CF6] rounded-full blur-md opacity-70 group-hover:opacity-100 transition-opacity pointer-events-none -z-10 animate-pulse" />
      )}

      {/* High-Fidelity 3D Salesforce Cloud SVG */}
      <svg
        viewBox="0 0 160 110"
        className="w-full h-full overflow-visible drop-shadow-[0_4px_12px_rgba(0,240,255,0.35)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Main 3D Salesforce Blue Gradient */}
          <linearGradient id="sfCloudGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00F0FF" />
            <stop offset="25%" stopColor="#00A1E0" />
            <stop offset="65%" stopColor="#0176D3" />
            <stop offset="100%" stopColor="#073B7A" />
          </linearGradient>

          {/* Neon Cyber Rim Stroke */}
          <linearGradient id="sfRimStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E0F7FF" />
            <stop offset="30%" stopColor="#00F0FF" />
            <stop offset="70%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#818CF8" />
          </linearGradient>

          {/* Upper Glass Specular Highlight */}
          <linearGradient id="sfGlossHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.65" />
            <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          {/* Deep Drop Shadow Filter */}
          <filter id="sfDropFilter" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="3" stdDeviation="3.5" floodColor="#001833" floodOpacity="0.8" />
          </filter>
        </defs>

        {/* Outer Shadow Buffer for 3D Depth */}
        <path
          d="M 52 25 
             C 60 13, 84 11, 96 23 
             C 106 15, 126 19, 134 33 
             C 146 37, 154 51, 150 65 
             C 156 75, 150 91, 136 95 
             L 34 95 
             C 20 95, 10 83, 14 69 
             C 8 55, 16 39, 30 35 
             C 34 23, 44 19, 52 25 Z"
          fill="#021020"
          transform="translate(0, 3)"
          opacity="0.8"
        />

        {/* Primary 3D Cloud Body */}
        <path
          d="M 52 25 
             C 60 13, 84 11, 96 23 
             C 106 15, 126 19, 134 33 
             C 146 37, 154 51, 150 65 
             C 156 75, 150 91, 136 95 
             L 34 95 
             C 20 95, 10 83, 14 69 
             C 8 55, 16 39, 30 35 
             C 34 23, 44 19, 52 25 Z"
          fill="url(#sfCloudGrad)"
          stroke="url(#sfRimStroke)"
          strokeWidth="3"
          filter="url(#sfDropFilter)"
        />

        {/* Glass Reflection Arc (Top 3D Shine) */}
        <path
          d="M 52 27 
             C 60 15, 82 13, 94 25 
             C 104 17, 122 21, 130 35 
             C 120 41, 90 45, 50 43 
             C 34 41, 24 37, 28 35 
             C 32 25, 44 21, 52 27 Z"
          fill="url(#sfGlossHighlight)"
        />

        {/* Subtle Cyber Internal Circuit Track */}
        <path
          d="M 38 68 H 54 L 62 76 H 88"
          stroke="#FFFFFF"
          strokeWidth="1.2"
          strokeOpacity="0.4"
          strokeDasharray="2 3"
        />
        <circle cx="88" cy="76" r="2" fill="#FFFFFF" fillOpacity="0.7" />

        {/* Iconic White Salesforce Italic Wordmark Typography */}
        <text
          x="82"
          y="68"
          textAnchor="middle"
          fill="#FFFFFF"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontSize="22"
          fontWeight="900"
          fontStyle="italic"
          letterSpacing="-0.8px"
          style={{
            filter: "drop-shadow(0 1.5px 3px rgba(0,20,50,0.6))",
          }}
        >
          salesforce
        </text>
      </svg>
    </motion.div>
  );
};
