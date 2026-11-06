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
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <motion.div
      whileHover={animated ? { scale: 1.08, rotate: [0, -3, 3, 0] } : undefined}
      transition={{ duration: 0.3 }}
      className={`relative inline-flex items-center justify-center shrink-0 rounded-xl bg-gradient-to-br from-slate-900/90 via-[#011627] to-cyan-950/60 border border-cyan-500/40 p-1.5 shadow-[0_0_15px_rgba(0,240,255,0.25)] ${currentSize} ${className}`}
    >
      {/* Dynamic Ambient Neon Glow */}
      {withGlow && (
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0176D3]/40 via-[#00F0FF]/30 to-[#8B5CF6]/30 rounded-xl blur-sm opacity-80 group-hover:opacity-100 transition-opacity pointer-events-none -z-10 animate-pulse" />
      )}

      {/* Clean High-Contrast Glowing Salesforce Cloud */}
      <svg
        viewBox="0 0 64 48"
        className="w-full h-full overflow-visible drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M21.5 10.5C24.5 4.5 35.5 3.8 40.5 9.5C44.5 6 52.5 7.5 56 13.5C61.5 15.5 65 21.5 63 27.5C65.5 31.5 63 38.5 57 40.5L14 40.5C8 40.5 4 35.5 6 29.5C3.5 23.5 7 16.5 13 14.5C14.5 9.5 19 7.5 21.5 10.5Z"
          fill="#0176D3"
          stroke="#00F0FF"
          strokeWidth="2"
        />
        {/* Subtle Inner Glass Arc */}
        <path
          d="M21.5 12C24.5 6.5 34 5.8 39 11C43 8 49 9.5 52 14.5C46 17 34 18 20 18C16 18 13.5 16 15 15C16.5 11 19.5 9.5 21.5 12Z"
          fill="#FFFFFF"
          fillOpacity="0.4"
        />
      </svg>
    </motion.div>
  );
};
