"use client";

import React from "react";
import { Cloud } from "lucide-react";
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
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14",
    xl: "w-20 h-20",
  };

  const iconSizeMap = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-7 h-7",
    xl: "w-10 h-10",
  };

  const currentSize = sizeMap[size] || sizeMap.md;
  const currentIconSize = iconSizeMap[size] || iconSizeMap.md;

  return (
    <motion.div
      whileHover={animated ? { scale: 1.05 } : undefined}
      transition={{ duration: 0.2 }}
      className={`relative flex items-center justify-center rounded-xl bg-gradient-to-tr from-[#0176D3] via-[#00F0FF] to-indigo-500 p-[1px] shadow-[0_0_15px_rgba(0,240,255,0.25)] shrink-0 ${currentSize} ${className}`}
    >
      <div className="w-full h-full bg-[#030712] rounded-[11px] flex items-center justify-center transition-colors group-hover:bg-slate-900">
        <Cloud className={`${currentIconSize} text-cyan-400 group-hover:text-white transition-colors`} />
      </div>
    </motion.div>
  );
};
