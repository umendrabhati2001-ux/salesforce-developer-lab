"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Zap,
  Terminal,
  BookOpen,
  Cpu,
  Boxes,
  ShieldCheck,
  Linkedin,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  DollarSign,
  ArrowRight,
  Code2,
  FileCode,
  Layers,
  Award,
  X,
  Command,
} from "lucide-react";
import { playClickSound } from "@/lib/sound";

interface CommandItem {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  category: "Selling & License" | "Simulators" | "Curriculum" | "Developer";
  action: () => void;
  badge?: string;
  badgeColor?: string;
}

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Global Keyboard Shortcuts (⌘K, Ctrl+K, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        playClickSound();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        if (showLicenseModal) {
          setShowLicenseModal(false);
        } else if (isOpen) {
          setIsOpen(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showLicenseModal, isOpen]);

  // Listen for custom trigger event from Navbar button
  useEffect(() => {
    const handleOpenCommandPalette = () => {
      playClickSound();
      setIsOpen(true);
    };
    window.addEventListener("open-command-palette", handleOpenCommandPalette);
    return () => window.removeEventListener("open-command-palette", handleOpenCommandPalette);
  }, []);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIdx(0);
    } else {
      setSearch("");
    }
  }, [isOpen]);

  const handleCopyUrl = () => {
    playClickSound();
    navigator.clipboard.writeText("https://visual-jab30.vercel.app");
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const jumpTo = (selector: string) => {
    setIsOpen(false);
    playClickSound();
    const el = document.querySelector(selector);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Command items list
  const commands: CommandItem[] = [
    {
      id: "buy-source-code",
      title: "💎 Buy Full Source Code & Commercial License ($199 / $499)",
      subtitle: "Instant ownership transfer • 100% SFDX safe scripts • Next.js 15 UI Kit",
      icon: DollarSign,
      category: "Selling & License",
      badge: "Commercial",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      action: () => {
        setIsOpen(false);
        setShowLicenseModal(true);
      },
    },
    {
      id: "sim-fullscreen-studio",
      title: "Launch Fullscreen Runtime Studio (/studio)",
      subtitle: "Dedicated standalone IDE with Live SOQL Query Studio & Apex Simulators",
      icon: Zap,
      category: "Simulators",
      badge: "Standalone IDE",
      badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
      action: () => {
        setIsOpen(false);
        window.location.href = "/studio";
      },
    },
    {
      id: "sim-governor-limits",
      title: "Apex Governor Limits Live Simulator",
      subtitle: "SOQL, DML & Heap Usage real-time limiter with warning breaches",
      icon: Cpu,
      category: "Simulators",
      badge: "Interactive",
      badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
      action: () => jumpTo("#visualizers"),
    },
    {
      id: "sim-3d-tower",
      title: "3D Salesforce Architecture Tower",
      subtitle: "Three.js multi-tenant spatial visualization & 3D mesh orbit",
      icon: Boxes,
      category: "Simulators",
      badge: "3D WebGL",
      badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      action: () => jumpTo("#pattern-matrix"),
    },
    {
      id: "sim-apex-cli",
      title: "Interactive Apex Anonymous REPL Terminal",
      subtitle: "Simulated Salesforce CLI engine with execution feedback",
      icon: Terminal,
      category: "Simulators",
      action: () => jumpTo("#apex-cli"),
    },
    {
      id: "sim-execution-order",
      title: "Order of Execution Lifecycle Map",
      subtitle: "Step-by-step trigger lifecycle visualizer (Before -> Validation -> After)",
      icon: Layers,
      category: "Simulators",
      action: () => jumpTo("#execution-order"),
    },
    {
      id: "sim-flashcards",
      title: "Interview Prep 3D Flashcards",
      subtitle: "Interactive cards for Salesforce Admin & Developer interview mastery",
      icon: BookOpen,
      category: "Simulators",
      badge: "3D Flip",
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
      action: () => jumpTo("#interview-prep"),
    },
    {
      id: "curr-roadmap",
      title: "Curriculum Roadmap (17/25+ Completed)",
      subtitle: "Track Phase A through Phase F DX source code progression",
      icon: Award,
      category: "Curriculum",
      action: () => jumpTo("#roadmap"),
    },
    {
      id: "curr-code-arena",
      title: "Code Arena (Apex & LWC Repositories)",
      subtitle: "Syntax-highlighted verified scripts with one-click copy",
      icon: FileCode,
      category: "Curriculum",
      action: () => jumpTo("#code-arena"),
    },
    {
      id: "dev-linkedin",
      title: "Connect with Umendra Bhati on LinkedIn",
      subtitle: "Salesforce Admin & Developer • Jaipur, Rajasthan • #OPENTOWORK",
      icon: Linkedin,
      category: "Developer",
      badge: "#OPENTOWORK",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      action: () => {
        window.open("https://www.linkedin.com/in/umendra-bhati-5243aa36a/", "_blank");
        setIsOpen(false);
      },
    },
    {
      id: "dev-copy-url",
      title: copiedUrl ? "Copied to Clipboard!" : "Copy Live Website URL",
      subtitle: "https://visual-jab30.vercel.app",
      icon: copiedUrl ? Check : Copy,
      category: "Developer",
      action: handleCopyUrl,
    },
    {
      id: "dev-sfdx-safety",
      title: "Verify SFDX Source Code Isolation",
      subtitle: "Guaranteed 100% untouched force-app/ & DX configuration files",
      icon: ShieldCheck,
      category: "Developer",
      action: () => jumpTo("#hero"),
    },
  ];

  // Filter commands by search query
  const filteredCommands = commands.filter(
    (cmd) =>
      cmd.title.toLowerCase().includes(search.toLowerCase()) ||
      cmd.subtitle.toLowerCase().includes(search.toLowerCase()) ||
      cmd.category.toLowerCase().includes(search.toLowerCase())
  );

  // Keyboard navigation inside list
  const handleListKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIdx((prev) => (prev + 1) % (filteredCommands.length || 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIdx((prev) => (prev - 1 + filteredCommands.length) % (filteredCommands.length || 1));
    } else if (e.key === "Enter" && filteredCommands[selectedIdx]) {
      e.preventDefault();
      filteredCommands[selectedIdx].action();
    }
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. RAYCAST FLOATING COMMAND PALETTE MODAL                                 */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[99999] flex items-start justify-center pt-16 sm:pt-24 px-4 sm:px-6">
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* Raycast Palette Floating Window */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: "spring", stiffness: 450, damping: 30 }}
              onKeyDown={handleListKeyDown}
              className="relative w-full max-w-2xl rounded-2xl bg-[#090d1c]/95 border border-white/[0.12] backdrop-blur-2xl shadow-[0_25px_70px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.18)] overflow-hidden flex flex-col z-10"
            >
              {/* Search Bar Input */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.08] relative">
                <Search className="w-5 h-5 text-cyan-400 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setSelectedIdx(0);
                  }}
                  placeholder="Type a command or search topics, simulators, source code..."
                  className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-500 font-mono focus:outline-none"
                />
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/[0.06] text-slate-400 border border-white/[0.08]">
                    ESC
                  </span>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Command Results List */}
              <div
                ref={listRef}
                className="max-h-[380px] sm:max-h-[420px] overflow-y-auto p-2 space-y-1 divide-y divide-white/[0.04]"
              >
                {filteredCommands.length === 0 ? (
                  <div className="py-12 text-center text-slate-500 font-mono text-xs">
                    No matching commands found for &quot;{search}&quot;
                  </div>
                ) : (
                  filteredCommands.map((cmd, idx) => {
                    const Icon = cmd.icon;
                    const isSelected = idx === selectedIdx;

                    return (
                      <div
                        key={cmd.id}
                        onClick={() => {
                          playClickSound();
                          cmd.action();
                        }}
                        onMouseEnter={() => setSelectedIdx(idx)}
                        className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                          isSelected
                            ? "bg-gradient-to-r from-cyan-500/20 via-blue-500/15 to-transparent border border-cyan-500/30 shadow-[0_0_15px_rgba(0,240,255,0.15)]"
                            : "hover:bg-white/[0.04] border border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`p-2 rounded-lg shrink-0 transition-colors ${
                              isSelected
                                ? "bg-cyan-500/25 text-cyan-300"
                                : "bg-white/[0.06] text-slate-400 group-hover:text-cyan-300"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-xs sm:text-sm font-semibold truncate ${
                                  isSelected ? "text-white" : "text-slate-200"
                                }`}
                              >
                                {cmd.title}
                              </span>
                              {cmd.badge && (
                                <span
                                  className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full border shrink-0 ${
                                    cmd.badgeColor || "bg-white/10 text-white border-white/20"
                                  }`}
                                >
                                  {cmd.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400 truncate mt-0.5">
                              {cmd.subtitle}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 ml-2">
                          <span className="hidden sm:inline-block text-[10px] font-mono text-slate-500">
                            {cmd.category}
                          </span>
                          <ArrowRight
                            className={`w-3.5 h-3.5 transition-transform ${
                              isSelected
                                ? "text-cyan-400 translate-x-1"
                                : "text-slate-600 opacity-0 group-hover:opacity-100"
                            }`}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Raycast Bottom Hotkey Legend */}
              <div className="px-4 py-2.5 bg-black/40 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 py-0.5 rounded bg-white/[0.06] text-slate-400">↑↓</kbd> Navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 py-0.5 rounded bg-white/[0.06] text-slate-400">↵</kbd> Select
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-cyan-400/80">
                  <Sparkles className="w-3 h-3" />
                  <span>Raycast ⌘K Hub</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 2. COMMERCIAL SOURCE CODE & LICENSE PURCHASE MODAL                        */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showLicenseModal && (
          <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLicenseModal(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", stiffness: 450, damping: 30 }}
              className="relative w-full max-w-xl rounded-3xl bg-[#090d1c]/95 border border-cyan-500/30 backdrop-blur-2xl shadow-[0_30px_90px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.2)] overflow-hidden z-10 p-6 sm:p-8 space-y-6"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Commercial License Transfer</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Salesforce Developer Lab &bull; Source Code
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Complete Next.js 15 + Three.js frontend, verified SFDX Apex/LWC DX scripts & documentation.
                  </p>
                </div>
                <button
                  onClick={() => setShowLicenseModal(false)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Pricing Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Single Developer License */}
                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-cyan-500/40 transition-colors flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold text-slate-400 uppercase">
                      Single Project
                    </span>
                    <div className="text-3xl font-black text-white font-mono mt-1 mb-2">
                      $199
                      <span className="text-xs text-slate-500 font-normal"> / one-time</span>
                    </div>
                    <ul className="text-xs text-slate-300 space-y-2 font-mono">
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-cyan-400" />
                        Full Frontend Source Code
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-cyan-400" />
                        All 3D & Particle Simulators
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-cyan-400" />
                        Next.js 15 + Tailwind UI Kit
                      </li>
                    </ul>
                  </div>
                  <a
                    href="https://www.linkedin.com/in/umendra-bhati-5243aa36a/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={playClickSound}
                    className="mt-5 w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold text-center transition-colors block border border-white/15"
                  >
                    Acquire Single License
                  </a>
                </div>

                {/* Commercial / SaaS Extended License */}
                <div className="p-5 rounded-2xl bg-gradient-to-b from-cyan-950/40 to-[#090d1c] border border-cyan-500/50 shadow-[0_0_25px_rgba(0,240,255,0.2)] flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-cyan-400 text-slate-950 text-[9px] font-mono font-bold">
                    RECOMMENDED
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold text-cyan-300 uppercase">
                      Extended Agency / SaaS
                    </span>
                    <div className="text-3xl font-black text-cyan-100 font-mono mt-1 mb-2">
                      $499
                      <span className="text-xs text-slate-500 font-normal"> / full rights</span>
                    </div>
                    <ul className="text-xs text-slate-300 space-y-2 font-mono">
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        Full Commercial Resale Rights
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        All 25+ SFDX Apex & LWC Files
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        100% SFDX Source Isolation Safe
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        Direct Developer Consultation
                      </li>
                    </ul>
                  </div>
                  <a
                    href="https://www.linkedin.com/in/umendra-bhati-5243aa36a/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={playClickSound}
                    className="mt-5 w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-[#0176D3] text-slate-950 font-mono text-xs font-black text-center shadow-[0_0_15px_rgba(0,240,255,0.4)] hover:brightness-110 transition-all block"
                  >
                    Acquire Extended ($499)
                  </a>
                </div>
              </div>

              {/* Footer Safety Note */}
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/[0.06] flex items-center justify-between text-xs text-slate-400 font-mono">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Author: Umendra Bhati (Rajasthan, India)</span>
                </div>
                <span className="text-emerald-400 font-semibold">Immediate Git Transfer</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
