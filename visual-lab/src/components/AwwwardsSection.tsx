"use client";

import React from "react";
import { motion } from "framer-motion";

interface AwwwardsSectionProps {
  children: React.ReactNode;
  delay?: number;
}

export const AwwwardsSection: React.FC<AwwwardsSectionProps> = ({
  children,
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.06 }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.22, 1, 0.36, 1], // Awwwards signature Expo-Out smooth easing
      }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
};
