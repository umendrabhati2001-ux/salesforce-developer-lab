"use client";

import React from "react";
import { motion } from "framer-motion";

const MARQUEE_ITEMS = [
  "GOVERNOR LIMITS 100/150",
  "BULKIFICATION ARCHITECTURE",
  "SET + MAP O(1) LOOKUP",
  "ENTERPRISE TRIGGER HANDLERS",
  "ASYNC QUEUEABLE & BATCH",
  "LWC SHADOW DOM",
  "UNIT TEST COVERAGE 85%+",
  "SFDX SOURCE ISOLATED",
];

export const KineticMarquee: React.FC = () => {
  return (
    <div className="relative w-full overflow-hidden border-y border-cyan-500/15 bg-[#020611]/90 py-3.5 select-none">
      {/* Side edge fade masks for Awwwards seamless look */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-[#030712] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-[#030712] to-transparent z-10" />

      {/* Seamless Infinite Kinetic Track */}
      <motion.div
        className="flex w-max items-center gap-8 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 32,
        }}
      >
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => (
          <div key={idx} className="flex items-center gap-8">
            <span className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.22em] text-slate-300/80 hover:text-cyan-300 transition-colors">
              {item}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/70 shadow-[0_0_8px_#00F0FF]" />
          </div>
        ))}
      </motion.div>
    </div>
  );
};
