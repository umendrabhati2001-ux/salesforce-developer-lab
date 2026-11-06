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
    sm: "w-10 h-7",
    md: "w-14 h-9",
    lg: "w-20 h-14",
    xl: "w-28 h-20",
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <motion.div
      whileHover={animated ? { scale: 1.06 } : undefined}
      transition={{ duration: 0.2 }}
      className={`relative inline-flex items-center justify-center shrink-0 ${currentSize} ${className}`}
    >
      {/* Official Salesforce Vector Logo from public/salesforce.svg */}
      <img
        src="/salesforce.svg"
        alt="Salesforce Official Logo"
        className="w-full h-full object-contain drop-shadow-[0_2px_10px_rgba(0,161,224,0.4)]"
      />
    </motion.div>
  );
};
