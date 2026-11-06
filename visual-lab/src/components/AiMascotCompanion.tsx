"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  X,
  Volume2,
  VolumeX,
  Minimize2,
  Award,
  Zap,
} from "lucide-react";
import { playClickSound, playChimeSound } from "@/lib/sound";
import confetti from "canvas-confetti";

interface AstroQuote {
  mood: "happy" | "mentor" | "warning" | "proud";
  text: string;
  hinglish: string;
  badge: string;
}

const astroQuotes: AstroQuote[] = [
  {
    mood: "happy",
    text: "Hi Trailblazer! Main hoon Astro, aapka official Salesforce Developer Buddy! 🐻☁️",
    hinglish: "Mujhpar click karo to Apex architecture ke hidden secrets batata hoon!",
    badge: "Salesforce Mascot",
  },
  {
    mood: "warning",
    text: "Never write SOQL queries inside FOR loops! Always bulkify with Set<Id> and Map<Id, sObject>.",
    hinglish: "101 SOQL hua to Governor Limits crash kar dega!",
    badge: "Governor Limits",
  },
  {
    mood: "mentor",
    text: "One Trigger Per Object rule is sacred! CaseTrigger should only delegate to CaseTriggerHandler.",
    hinglish: "ComplaintService me saara SLA business logic isolated rakha hai.",
    badge: "Architecture Pattern",
  },
  {
    mood: "proud",
    text: "Umendra Bhati's SFDX Lab is 100% source-protected and production grade!",
    hinglish: "Apex collections, partial-success DML aur capstone service sab verified hain.",
    badge: "Verified Architect",
  },
  {
    mood: "mentor",
    text: "Use 'with sharing' to enforce Org-Wide Defaults (OWD) and Role Hierarchy record security.",
    hinglish: "User mode vs System mode ka concept interviews me zarur puchte hain!",
    badge: "Security & Sharing",
  },
];

export const AiMascotCompanion: React.FC = () => {
  const [minimized, setMinimized] = useState<boolean>(false);
  const [quoteIndex, setQuoteIndex] = useState<number>(0);
  const [bubbleOpen, setBubbleOpen] = useState<boolean>(true);
  const [scrollDir, setScrollDir] = useState<"up" | "down" | "idle">("idle");
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isWaving, setIsWaving] = useState<boolean>(false);

  const lastY = useRef<number>(0);
  const scrollTimer = useRef<NodeJS.Timeout | null>(null);

  // Track scroll direction for Astro's reactions
  useEffect(() => {
    const onScroll = () => {
      const curr = window.scrollY;
      if (curr > lastY.current + 6) {
        setScrollDir("down");
      } else if (curr < lastY.current - 6) {
        setScrollDir("up");
        setIsWaving(true);
      }
      lastY.current = curr;

      if (scrollTimer.current) clearTimeout(scrollTimer.current);
      scrollTimer.current = setTimeout(() => {
        setScrollDir("idle");
        setIsWaving(false);
      }, 400);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (scrollTimer.current) clearTimeout(scrollTimer.current);
    };
  }, []);

  const handleAstroClick = () => {
    if (soundEnabled) playChimeSound();
    setQuoteIndex((prev) => (prev + 1) % astroQuotes.length);
    setBubbleOpen(true);
    setIsWaving(true);
    setTimeout(() => setIsWaving(false), 1200);

    try {
      confetti({
        particleCount: 25,
        spread: 50,
        origin: { x: 0.9, y: 0.85 },
        colors: ["#00F0FF", "#0176D3", "#10B981", "#FFB800"],
      });
    } catch {
      // Fallback
    }
  };

  const currentQuote = astroQuotes[quoteIndex];

  return (
    <aside
      aria-label="Salesforce Astro AI Companion"
      className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end pointer-events-auto select-none"
    >
      {/* Astro Thought / Speech Bubble */}
      <AnimatePresence>
        {bubbleOpen && !minimized && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
            className="mb-2 max-w-[calc(100vw-2rem)] sm:max-w-xs rounded-2xl bg-slate-900/95 border border-cyan-400/40 p-3 sm:p-4 shadow-[0_0_30px_rgba(0,240,255,0.25)] backdrop-blur-xl relative text-left"
          >
            {/* Close button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                playClickSound();
                setBubbleOpen(false);
              }}
              className="absolute top-2.5 right-2.5 p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Close Bubble"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {/* Bubble Header with Salesforce Astro Badge */}
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold flex items-center gap-1 border border-cyan-500/30">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                Astro &bull; {currentQuote.badge}
              </span>
            </div>

            {/* Main Speech Text */}
            <p className="text-xs text-white font-medium leading-relaxed">
              {currentQuote.text}
            </p>

            {/* Hinglish Subtitle Note */}
            <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-cyan-300 italic font-mono">
              &ldquo;{currentQuote.hinglish}&rdquo;
            </div>

            {/* Tap prompt */}
            <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span className="text-slate-500">Tap Astro for next tip</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAstroClick();
                }}
                className="text-cyan-400 hover:text-white font-bold flex items-center gap-1 underline decoration-cyan-500/50"
              >
                Next &rarr;
              </button>
            </div>

            {/* Speech bubble pointer arrow */}
            <div className="absolute -bottom-2 right-9 w-4 h-4 bg-slate-900 border-r border-b border-cyan-400/40 transform rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Astro Mascot Container */}
      <div className="relative flex items-center gap-2">
        
        {/* Quick controls (Mute & Minimize) */}
        {!minimized && (
          <motion.div
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-1.5 mr-1"
          >
            <button
              onClick={() => {
                playClickSound();
                setSoundEnabled((prev) => !prev);
              }}
              className="p-1.5 rounded-lg bg-slate-900/90 border border-slate-700/80 text-slate-400 hover:text-cyan-300 shadow-md transition-colors"
              title={soundEnabled ? "Mute Mascot" : "Unmute Mascot"}
            >
              {soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
              ) : (
                <VolumeX className="w-3.5 h-3.5" />
              )}
            </button>

            <button
              onClick={() => {
                playClickSound();
                setMinimized(true);
              }}
              className="p-1.5 rounded-lg bg-slate-900/90 border border-slate-700/80 text-slate-400 hover:text-cyan-300 shadow-md transition-colors"
              title="Minimize Astro"
            >
              <Minimize2 className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}

        {/* Mascot Body */}
        {minimized ? (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              playClickSound();
              setMinimized(false);
              setBubbleOpen(true);
            }}
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#0176D3] via-[#00F0FF] to-purple-600 p-[2px] shadow-[0_0_20px_rgba(0,240,255,0.4)] flex items-center justify-center group"
          >
            <div className="w-full h-full rounded-full bg-[#030914] flex items-center justify-center relative">
              <span className="text-lg">🐻</span>
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-400 border-2 border-slate-950" />
            </div>
          </motion.button>
        ) : (
          <motion.div
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            onClick={handleAstroClick}
            animate={{
              y: scrollDir === "down" ? 7 : scrollDir === "up" ? -8 : [0, -6, 0],
              rotate: isWaving ? [0, -5, 5, -5, 0] : scrollDir === "down" ? 3 : scrollDir === "up" ? -3 : 0,
            }}
            transition={{
              y: { repeat: scrollDir === "idle" ? Infinity : 0, duration: 3.2, ease: "easeInOut" },
              rotate: { duration: 0.4 },
            }}
            className="w-20 h-24 sm:w-24 sm:h-28 relative cursor-pointer filter drop-shadow-[0_12px_25px_rgba(0,240,255,0.35)] group"
          >
            {/* Ambient Aura under Astro */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-4 bg-gradient-to-t from-cyan-400/60 to-transparent blur-md rounded-full animate-pulse" />

            {/* Official Salesforce ASTRO Mascot Vector Illustration */}
            <svg
              viewBox="0 0 120 135"
              className="w-full h-full overflow-visible"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Astro Bear Fur Gradient (Warm Chestnut Brown) */}
                <linearGradient id="astroFurGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#A0522D" />
                  <stop offset="40%" stopColor="#8B4513" />
                  <stop offset="100%" stopColor="#5C2D0C" />
                </linearGradient>

                {/* Astro Face Skin Tone */}
                <linearGradient id="astroSkinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FFE4C4" />
                  <stop offset="100%" stopColor="#F5DEB3" />
                </linearGradient>

                {/* Salesforce Blue Suit Gradient */}
                <linearGradient id="astroSuitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00F0FF" />
                  <stop offset="25%" stopColor="#00A1E0" />
                  <stop offset="70%" stopColor="#0176D3" />
                  <stop offset="100%" stopColor="#0B4C8C" />
                </linearGradient>

                {/* Ear Inner Pink */}
                <linearGradient id="astroEarPink" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FFA07A" />
                  <stop offset="100%" stopColor="#CD5C5C" />
                </linearGradient>
              </defs>

              {/* Astro's Cute Round Bear Ears */}
              {/* Left Ear */}
              <circle cx="34" cy="28" r="14" fill="url(#astroFurGrad)" stroke="#00F0FF" strokeWidth="1.5" />
              <circle cx="34" cy="28" r="8" fill="url(#astroEarPink)" />

              {/* Right Ear */}
              <circle cx="86" cy="28" r="14" fill="url(#astroFurGrad)" stroke="#00F0FF" strokeWidth="1.5" />
              <circle cx="86" cy="28" r="8" fill="url(#astroEarPink)" />

              {/* Astro's Fluffy Head/Hood */}
              <ellipse
                cx="60"
                cy="52"
                rx="38"
                ry="34"
                fill="url(#astroFurGrad)"
                stroke="#00F0FF"
                strokeWidth="2"
                style={{
                  filter: "drop-shadow(0 4px 10px rgba(0,240,255,0.3))",
                }}
              />

              {/* Astro's Face (Cheeks & Chin) */}
              <ellipse cx="60" cy="56" rx="27" ry="22" fill="url(#astroSkinGrad)" />

              {/* Cute Pink Blush Cheeks */}
              <circle cx="43" cy="62" r="4.5" fill="#FF8C69" opacity="0.6" />
              <circle cx="77" cy="62" r="4.5" fill="#FF8C69" opacity="0.6" />

              {/* Big Expressive Cartoon Eyes */}
              {/* Left Eye */}
              <ellipse cx="49" cy="53" rx="4" ry="5.5" fill="#2B170B" />
              <circle cx="50.5" cy="51.5" r="1.8" fill="#FFFFFF" />

              {/* Right Eye */}
              <ellipse cx="71" cy="53" rx="4" ry="5.5" fill="#2B170B" />
              <circle cx="72.5" cy="51.5" r="1.8" fill="#FFFFFF" />

              {/* Cute Bear Nose */}
              <ellipse cx="60" cy="59" rx="3.5" ry="2.5" fill="#3D1C06" />

              {/* Happy Smile */}
              <path
                d="M 54 63 Q 60 68 66 63"
                stroke="#3D1C06"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />

              {/* Astro's Salesforce Blue Space Suit / Hoodie */}
              <path
                d="M 32 82 C 32 74, 88 74, 88 82 L 94 116 C 94 122, 26 122, 26 116 Z"
                fill="url(#astroSuitGrad)"
                stroke="#00F0FF"
                strokeWidth="2"
              />

              {/* Salesforce Official Cloud Emblem on Chest */}
              <g transform="translate(42, 88) scale(0.24)">
                {/* Cloud Silhouette */}
                <path
                  d="M 52 25 C 60 13, 84 11, 96 23 C 106 15, 126 19, 134 33 C 146 37, 154 51, 150 65 C 156 75, 150 91, 136 95 L 34 95 C 20 95, 10 83, 14 69 C 8 55, 16 39, 30 35 C 34 23, 44 19, 52 25 Z"
                  fill="#FFFFFF"
                  style={{
                    filter: "drop-shadow(0 2px 6px rgba(0,240,255,0.7))",
                  }}
                />
              </g>

              {/* Astro's Waving Left Hand/Paw */}
              <motion.g
                animate={
                  isWaving
                    ? { rotate: [-15, 25, -15] }
                    : { rotate: [0, 8, 0] }
                }
                transition={{
                  repeat: Infinity,
                  duration: isWaving ? 0.4 : 2,
                  ease: "easeInOut",
                }}
                style={{ originX: "28px", originY: "86px" }}
              >
                <ellipse cx="22" cy="94" rx="7" ry="6" fill="url(#astroFurGrad)" stroke="#00F0FF" strokeWidth="1.5" />
                <circle cx="20" cy="93" r="2.5" fill="url(#astroEarPink)" />
              </motion.g>

              {/* Right Hand/Paw */}
              <ellipse cx="98" cy="94" rx="7" ry="6" fill="url(#astroFurGrad)" stroke="#00F0FF" strokeWidth="1.5" />
              <circle cx="100" cy="93" r="2.5" fill="url(#astroEarPink)" />

              {/* Little Astronaut Boots */}
              <rect x="38" y="117" width="16" height="8" rx="4" fill="#011627" stroke="#00F0FF" strokeWidth="1" />
              <rect x="66" y="117" width="16" height="8" rx="4" fill="#011627" stroke="#00F0FF" strokeWidth="1" />
            </svg>

            {/* Hover Tooltip Pill */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-cyan-400 to-[#0176D3] text-slate-950 font-mono text-[9px] font-black px-2 py-0.5 rounded-full shadow-[0_0_10px_#00F0FF] whitespace-nowrap">
              HI, I&apos;M ASTRO! 🐻☁️
            </div>
          </motion.div>
        )}
      </div>
    </aside>
  );
};
