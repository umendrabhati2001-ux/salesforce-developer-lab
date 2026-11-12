"use client";

import React from "react";
import { motion, useScroll, useSpring } from "framer-motion";

export const ScrollProgressHud: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] pointer-events-none">
      {/* Ultra-thin glowing Awwwards scroll progress bar */}
      <motion.div
        style={{ scaleX, transformOrigin: "0% 50%" }}
        className="h-[2.5px] w-full bg-gradient-to-r from-[#0176D3] via-[#00F0FF] to-[#A855F7] shadow-[0_0_12px_rgba(0,240,255,0.8)]"
      />
    </div>
  );
};
