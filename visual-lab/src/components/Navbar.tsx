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
} from "lucide-react";
import { SalesforceLogo } from "./SalesforceLogo";
import { DeveloperBadgeCard } from "./DeveloperBadgeCard";
import { playClickSound } from "@/lib/sound";
import { motion, AnimatePresence } from "framer-motion";

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    { label: "Roadmap", href: "#roadmap", badge: "11/25+", icon: Award },
    { label: "Simulators", href: "#visualizers", icon: Cpu },
    { label: "3D Tower", href: "#pattern-matrix", icon: Boxes },
    { label: "Code Arena", href: "#code-arena", icon: Terminal },
    { label: "Flashcards", href: "#interview-prep", icon: BookOpen },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#030712]/95 backdrop-blur-md border-b border-cyan-500/25 py-2.5 sm:py-3 shadow-lg shadow-cyan-950/20"
          : "bg-transparent py-3 sm:py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo & Brand with Authentic 3D Salesforce Cloud Logo */}
          <a
            href="#hero"
            onClick={playClickSound}
            className="flex items-center gap-2.5 sm:gap-3.5 group min-w-0"
          >
            <SalesforceLogo size="sm" className="sm:hidden" />
            <SalesforceLogo size="md" className="hidden sm:inline-flex" />
            
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-extrabold text-xs sm:text-base tracking-tight bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:to-white transition-colors">
                  Salesforce Developer Lab
                </span>
                <span className="text-[9px] sm:text-[10px] font-mono px-1.5 sm:px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-semibold shadow-[0_0_10px_rgba(0,240,255,0.2)] shrink-0">
                  Visual Lab
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 font-mono hidden sm:flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Umendra Bhati &bull; 100% SFDX Source Safe</span>
              </p>
            </div>
          </a>

          {/* Desktop Navigation links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/80 p-1.5 rounded-xl border border-cyan-500/20 backdrop-blur-md">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={playClickSound}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-cyan-300 hover:bg-slate-800/80 transition-colors flex items-center gap-1.5"
                >
                  {Icon && <Icon className="w-3.5 h-3.5 text-cyan-400" />}
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-500/30 font-mono font-bold">
                      {link.badge}
                    </span>
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right Action: Developer Badge & Mobile Hamburger Button */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Developer Profile Badge */}
            <div className="hidden xs:block sm:block">
              <DeveloperBadgeCard compact={true} />
            </div>

            {/* Launch CTA on Desktop */}
            <a
              href="#visualizers"
              onClick={playClickSound}
              className="hidden md:flex px-3.5 py-2 rounded-xl text-xs font-bold font-mono bg-gradient-to-r from-cyan-400 via-blue-500 to-[#0176D3] text-slate-950 hover:brightness-110 shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5" />
              Simulators
            </a>

            {/* Mobile Hamburger Menu Toggle Button */}
            <button
              onClick={() => {
                playClickSound();
                setMobileMenuOpen((prev) => !prev);
              }}
              className="lg:hidden p-2 rounded-xl bg-slate-900/90 border border-cyan-500/30 text-cyan-300 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Sliding Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden bg-slate-950/98 border-b border-cyan-500/30 backdrop-blur-2xl overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-3">
              
              {/* Mobile Developer Profile Pill */}
              <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
                <DeveloperBadgeCard compact={true} />
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  SFDX Safe
                </span>
              </div>

              {/* Navigation Links Grid */}
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
                      className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 text-slate-200 hover:text-cyan-300 font-mono text-xs flex items-center justify-between transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        {Icon && <Icon className="w-4 h-4 text-cyan-400" />}
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

              {/* Mobile Direct Action Button */}
              <div className="pt-2 flex items-center gap-2">
                <a
                  href="#visualizers"
                  onClick={() => {
                    playClickSound();
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl text-center text-xs font-mono font-bold bg-gradient-to-r from-cyan-400 to-[#0176D3] text-slate-950 shadow-[0_0_15px_rgba(0,240,255,0.3)] flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-4 h-4" />
                  Launch All Simulators
                </a>

                <a
                  href="https://www.linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-[#0A66C2] text-white text-xs font-mono font-bold flex items-center gap-1"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
