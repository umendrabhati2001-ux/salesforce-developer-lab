"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Terminal,
  BookOpen,
  Cpu,
  Award,
  Zap,
  Menu,
  X,
  Boxes,
  ExternalLink,
  Linkedin,
  Command,
} from "lucide-react";
import { SalesforceLogo } from "./SalesforceLogo";
import { DeveloperBadgeCard } from "./DeveloperBadgeCard";
import { playClickSound } from "@/lib/sound";
import { motion, AnimatePresence } from "framer-motion";

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navLinks = [
    { label: "Overview", href: "#hero", icon: null },
    { label: "Roadmap", href: "#roadmap", badge: "17/25+", icon: Award },
    { label: "Simulators", href: "#visualizers", icon: Cpu },
    { label: "3D Tower", href: "#pattern-matrix", icon: Boxes },
    { label: "Code Arena", href: "#code-arena", icon: Terminal },
    { label: "Flashcards", href: "#interview-prep", icon: BookOpen },
  ];

  return (
    <header className="fixed top-2.5 sm:top-4 inset-x-0 z-50 flex flex-col items-center px-3 sm:px-6 pointer-events-none">
      {/* Raycast-Inspired Floating Glass Capsule */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`pointer-events-auto w-full max-w-5xl rounded-full transition-all duration-300 ${
          scrolled
            ? "bg-[#080d1a]/85 backdrop-blur-2xl border border-white/[0.14] shadow-[0_16px_40px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.15)] py-2 px-3 sm:px-4"
            : "bg-[#0b1021]/75 backdrop-blur-xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)] py-2 sm:py-2.5 px-3.5 sm:px-4"
        } flex items-center justify-between gap-2 sm:gap-4`}
      >
        {/* Brand: Authentic 3D Salesforce Cloud Logo + Lab Title */}
        <a
          href="#hero"
          onClick={playClickSound}
          className="flex items-center gap-2 sm:gap-2.5 group shrink-0"
        >
          <SalesforceLogo size="sm" className="drop-shadow-[0_0_12px_rgba(1,118,211,0.5)]" />
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-xs sm:text-sm tracking-tight text-white group-hover:text-cyan-300 transition-colors">
              Salesforce Lab
            </span>
            <span className="hidden sm:inline-flex text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold shadow-[0_0_8px_rgba(0,240,255,0.2)]">
              v2.0
            </span>
          </div>
        </a>

        {/* Center: Raycast-Style Sliding Pill Navigation (Desktop) */}
        <nav
          onMouseLeave={() => setHoveredIdx(null)}
          className="hidden lg:flex items-center gap-0.5 bg-white/[0.04] p-1 rounded-full border border-white/[0.06] relative"
        >
          {navLinks.map((link, idx) => {
            const Icon = link.icon;
            const isHovered = hoveredIdx === idx;

            return (
              <a
                key={link.href}
                href={link.href}
                onMouseEnter={() => setHoveredIdx(idx)}
                onClick={playClickSound}
                className="relative px-3 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 z-10 select-none"
              >
                {/* Raycast Smooth Spring Active/Hover Capsule Background */}
                {isHovered && (
                  <motion.div
                    layoutId="raycastHoverPill"
                    className="absolute inset-0 bg-white/10 rounded-full border border-white/15 shadow-[0_2px_10px_rgba(0,0,0,0.3)] -z-10"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                {Icon && <Icon className="w-3.5 h-3.5 text-cyan-400/80" />}
                <span>{link.label}</span>
                {link.badge && (
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded-full border border-emerald-500/30 font-mono font-bold">
                    {link.badge}
                  </span>
                )}
              </a>
            );
          })}
        </nav>

        {/* Right Action: Developer Badge + Raycast CTA */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Developer Profile Pill */}
          <div className="hidden md:block">
            <DeveloperBadgeCard compact={true} />
          </div>

          {/* Raycast Action Pill / Command Button */}
          <a
            href="#visualizers"
            onClick={playClickSound}
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold bg-gradient-to-r from-cyan-400 via-blue-500 to-[#0176D3] text-slate-950 hover:brightness-110 shadow-[0_0_15px_rgba(0,240,255,0.35)] transition-all active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">Launch Lab</span>
            <span className="sm:hidden">Launch</span>
            <span className="hidden sm:inline-flex items-center gap-0.5 text-[9px] font-mono px-1 py-0.5 rounded bg-black/20 text-slate-950/90 font-bold ml-0.5">
              <Command className="w-2.5 h-2.5 inline" />K
            </span>
          </a>

          {/* Mobile Hamburger Menu Button */}
          <button
            onClick={() => {
              playClickSound();
              setMobileMenuOpen((prev) => !prev);
            }}
            className="lg:hidden p-1.5 rounded-full bg-white/[0.06] border border-white/10 text-cyan-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </motion.div>

      {/* Mobile Floating Drawer Card */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="pointer-events-auto w-full max-w-5xl mt-2 rounded-2xl bg-[#080d1a]/95 border border-white/10 backdrop-blur-2xl shadow-[0_16px_40px_rgba(0,0,0,0.8)] overflow-hidden p-3.5 space-y-3 lg:hidden"
          >
            {/* Mobile Developer Profile Pill */}
            <div className="pb-2.5 border-b border-white/10 flex items-center justify-between">
              <DeveloperBadgeCard compact={true} />
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                SFDX Safe
              </span>
            </div>

            {/* Navigation Grid */}
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => {
                      playClickSound();
                      setMobileMenuOpen(false);
                    }}
                    className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:border-cyan-500/40 text-slate-200 hover:text-cyan-300 font-mono text-xs flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      {Icon && <Icon className="w-3.5 h-3.5 text-cyan-400" />}
                      {link.label}
                    </span>
                    {link.badge && (
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1 py-0.5 rounded font-mono font-bold">
                        {link.badge}
                      </span>
                    )}
                  </a>
                );
              })}
            </div>

            {/* Mobile Actions */}
            <div className="pt-2 flex items-center gap-2">
              <a
                href="#visualizers"
                onClick={() => {
                  playClickSound();
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2 px-3 rounded-full text-center text-xs font-mono font-bold bg-gradient-to-r from-cyan-400 to-[#0176D3] text-slate-950 shadow-[0_0_15px_rgba(0,240,255,0.3)] flex items-center justify-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5" />
                Launch All Simulators
              </a>

              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-3 rounded-full bg-[#0A66C2] text-white text-xs font-mono font-bold flex items-center gap-1 hover:brightness-110"
              >
                <Linkedin className="w-3.5 h-3.5" />
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
