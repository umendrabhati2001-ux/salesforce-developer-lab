"use client";

import React from "react";
import { motion } from "framer-motion";

interface SalesforceLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
}

export const SalesforceLogo: React.FC<SalesforceLogoProps> = ({
  className = "",
  size = "md",
  animated = true,
}) => {
  const sizeMap = {
    sm: "w-8 h-6",
    md: "w-11 h-8",
    lg: "w-16 h-12",
    xl: "w-24 h-18",
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <motion.div
      whileHover={animated ? { scale: 1.08, filter: "brightness(1.15)" } : undefined}
      transition={{ duration: 0.2 }}
      className={`relative inline-flex items-center justify-center shrink-0 ${currentSize} ${className}`}
    >
      {/* Dynamic Ambient Salesforce Blue Glow */}
      <div className="absolute inset-0 bg-[#00A1E0]/30 rounded-full blur-md opacity-75 group-hover:opacity-100 transition-opacity pointer-events-none -z-10" />

      {/* Official Salesforce Vector Cloud Emblem */}
      <svg
        viewBox="0 0 100 68"
        className="w-full h-full overflow-visible drop-shadow-[0_2px_8px_rgba(0,161,224,0.5)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="officialSfCloudGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00BAFF" />
            <stop offset="40%" stopColor="#00A1E0" />
            <stop offset="100%" stopColor="#0176D3" />
          </linearGradient>
          <linearGradient id="officialSfGleam" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Shadow Depth Base */}
        <path
          d="M 32 16
             C 37 8, 51 8, 57 15
             C 63 10, 75 12, 79 21
             C 87 23, 92 31, 89 40
             C 94 46, 91 55, 83 58
             L 21 58
             C 12 58, 6 50, 9 41
             C 4 32, 9 22, 18 20
             C 20 13, 27 10, 32 16 Z"
          fill="#021B35"
          transform="translate(0, 2)"
          opacity="0.6"
        />

        {/* Primary Authentic Cloud Body */}
        <path
          d="M 32 16
             C 37 8, 51 8, 57 15
             C 63 10, 75 12, 79 21
             C 87 23, 92 31, 89 40
             C 94 46, 91 55, 83 58
             L 21 58
             C 12 58, 6 50, 9 41
             C 4 32, 9 22, 18 20
             C 20 13, 27 10, 32 16 Z"
          fill="url(#officialSfCloudGrad)"
          stroke="#00E5FF"
          strokeWidth="1.2"
        />

        {/* Upper Specular Glass Light */}
        <path
          d="M 32 17
             C 37 9, 50 9, 56 16
             C 62 11, 73 13, 77 22
             C 70 25, 52 27, 30 26
             C 21 25, 14 23, 17 21
             C 19 15, 27 12, 32 17 Z"
          fill="url(#officialSfGleam)"
        />

        {/* Salesforce Characteristic Center Accent */}
        <path
          d="M 40 40 C 44 32, 56 32, 60 40"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeOpacity="0.85"
        />
        <circle cx="50" cy="46" r="2.2" fill="#FFFFFF" fillOpacity="0.9" />
      </svg>
    </motion.div>
  );
};
