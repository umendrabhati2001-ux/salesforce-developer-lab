"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  Zap,
  ArrowRight,
  BookOpen,
  FileCode2,
  ChevronDown,
  Sparkles,
  Layers,
  Filter,
} from "lucide-react";
import { curriculumTopics, phases } from "@/data/curriculumData";

export const RoadmapSection: React.FC = () => {
  const [selectedPhase, setSelectedPhase] = useState<string>("all");
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>("topic-11");

  const filteredTopics = curriculumTopics.filter((topic) => {
    if (selectedPhase === "all") return true;
    if (selectedPhase === "completed") return topic.status === "completed";
    if (selectedPhase === "active") return topic.status === "active";
    if (selectedPhase === "upcoming") return topic.status === "upcoming";
    return topic.phase.toLowerCase().includes(selectedPhase.toLowerCase());
  });

  const toggleExpand = (id: string) => {
    setExpandedTopicId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="roadmap" className="py-24 border-b border-cyan-500/20 bg-[#030712] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-xs font-mono text-cyan-300 mb-3 shadow-[0_0_15px_rgba(0,240,255,0.15)]">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Progress Hub &amp; Execution Tracker</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Curriculum Roadmap <span className="text-cyan-400 font-mono text-xl sm:text-2xl">(01 to 25+)</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              10 topics completed and verified hands-on. Resume your journey right at Topic 11 — 
              the cornerstone of multitenant Governor Limits &amp; Bulkification Architecture.
            </p>
          </div>

          {/* Phase completion indicator */}
          <div className="flex items-center gap-3">
            <div className="p-4 rounded-2xl bg-gradient-to-b from-slate-900/95 to-slate-950 border border-cyan-500/30 text-left sm:text-right w-full sm:w-auto">
              <div className="text-xs text-slate-400 font-mono">Phase A &amp; B Completion</div>
              <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">10 / 10 Verified (100%)</div>
            </div>
          </div>
        </div>

        {/* Phase Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5 mb-8">
          {phases.map((ph) => {
            const isPhActive = ph.status === "active";
            const isPhComplete = ph.status === "completed";
            return (
              <div
                key={ph.id}
                className={`p-3 rounded-2xl border transition-all ${
                  isPhActive
                    ? "bg-gradient-to-b from-cyan-950/40 to-slate-950 border-cyan-500/50 shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                    : isPhComplete
                    ? "bg-slate-900/80 border-slate-800"
                    : "bg-slate-950/60 border-slate-900 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                  <span className={isPhActive ? "text-cyan-300 font-bold" : isPhComplete ? "text-emerald-400" : "text-slate-500"}>
                    {ph.phaseCode}
                  </span>
                  {isPhComplete && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  {isPhActive && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />}
                </div>
                <div className="text-xs font-semibold text-white truncate">
                  {ph.title.split("(")[0]}
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-1">
                  {ph.completionPercentage}% Complete
                </div>
              </div>
            );
          })}
        </div>

        {/* Filter Toolbar with smooth mobile scroll */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2 mb-8 border-b border-slate-800">
          <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5 mr-2 shrink-0">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            Filter:
          </div>
          {[
            { id: "all", label: "All Milestones" },
            { id: "completed", label: "Completed (Topics 01-10)" },
            { id: "active", label: "Active Resume Target (Topic 11)" },
            { id: "Phase C", label: "Phase C (Triggers)" },
            { id: "Phase D", label: "Phase D (Async Apex)" },
            { id: "Phase E", label: "Phase E (Testing)" },
            { id: "Phase F", label: "Phase F (LWC)" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedPhase(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all whitespace-nowrap shrink-0 ${
                selectedPhase === tab.id
                  ? "bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(0,240,255,0.35)]"
                  : "bg-slate-900/90 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Timeline Grid with Motion */}
        <div className="space-y-3">
          {filteredTopics.map((topic, index) => {
            const isExpanded = expandedTopicId === topic.id;
            const isCompleted = topic.status === "completed";
            const isActive = topic.status === "active";

            return (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.02 }}
                className={`rounded-xl border transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-[#1E1E1E] via-[#141414] to-[#121212] border-[#555555] shadow-lg ring-1 ring-white/10"
                    : isCompleted
                    ? "bg-gradient-to-b from-[#141414] to-[#0E0E0E] hover:border-[#383838] border-[#222222]"
                    : "bg-[#0D0D0D] border-[#1C1C1C] opacity-75"
                }`}
              >
                {/* Milestone Bar Item */}
                <div
                  onClick={() => toggleExpand(topic.id)}
                  className="p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    {/* Status Icon Indicator */}
                    <div className="flex-shrink-0">
                      {isActive ? (
                        <div className="w-10 h-10 rounded-lg bg-[#2B2518] border border-amber-500/50 flex items-center justify-center relative">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping absolute" />
                          <Zap className="w-5 h-5 text-amber-400 relative z-10" />
                        </div>
                      ) : isCompleted ? (
                        <div className="w-10 h-10 rounded-lg bg-[#152317] border border-emerald-500/30 flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-[#141414] border border-[#242424] flex items-center justify-center">
                          <Clock className="w-4 h-4 text-[#666666]" />
                        </div>
                      )}
                    </div>

                    {/* Topic Details */}
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#888888]">
                          Topic {topic.topicNumber.toString().padStart(2, "0")}
                        </span>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#1C1C1C] text-[#AAAAAA]">
                          {topic.phase}
                        </span>
                        {isActive && (
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-400 text-black uppercase tracking-wider animate-pulse">
                            Active Milestone to Resume
                          </span>
                        )}
                        {topic.badge && !isActive && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#162618] text-emerald-400 border border-[#244227]">
                            {topic.badge}
                          </span>
                        )}
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                        {topic.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#888888] mt-0.5">
                        {topic.description}
                      </p>
                    </div>
                  </div>

                  {/* Right side interactive button & arrow */}
                  <div className="flex items-center gap-3">
                    {isActive && (
                      <a
                        href="#visualizers"
                        onClick={(e) => e.stopPropagation()}
                        className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-black font-bold text-xs hover:bg-[#E5E5E5] transition-colors"
                      >
                        Launch Visualizer
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <button
                      aria-label="Expand details"
                      className="p-1.5 rounded-lg text-[#888888] hover:text-white hover:bg-[#1F1F1F] transition-colors"
                    >
                      <ChevronDown
                        className={`w-5 h-5 transition-transform duration-200 ${
                          isExpanded ? "rotate-180 text-white" : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Collapsible Content with Framer Motion AnimatePresence */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden border-t border-[#222222] bg-[#0A0A0A] p-5 rounded-b-xl"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        
                        {/* Bullets */}
                        <div className="lg:col-span-7 space-y-3">
                          <div className="text-xs font-mono uppercase tracking-wider text-white font-bold flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-[#888888]" />
                            Core Concepts & Verified Syllabus
                          </div>
                          <ul className="space-y-1.5">
                            {topic.bullets.map((bullet, bIdx) => (
                              <li key={bIdx} className="text-xs text-[#CCCCCC] flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-white mt-1.5 flex-shrink-0" />
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>

                          {topic.practiceFile && (
                            <div className="mt-3 pt-3 border-t border-[#1F1F1F] flex items-center gap-2 text-xs font-mono text-[#888888]">
                              <FileCode2 className="w-4 h-4 text-white" />
                              <span>Practice File:</span>
                              <code className="text-white bg-[#141414] px-2 py-0.5 rounded border border-[#262626]">
                                {topic.practiceFile}
                              </code>
                            </div>
                          )}
                        </div>

                        {/* Takeaways & Bilingual notes */}
                        <div className="lg:col-span-5 space-y-3">
                          <div className="p-3.5 rounded-xl bg-[#141414] border border-[#262626]">
                            <div className="text-xs font-mono text-amber-300 font-semibold mb-1 flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5" />
                              Architectural Key Takeaway
                            </div>
                            <p className="text-xs text-[#CCCCCC] leading-relaxed">
                              {topic.keyTakeaway}
                            </p>
                          </div>

                          <div className="p-3.5 rounded-xl bg-[#141414] border border-[#262626]">
                            <div className="text-xs font-mono text-[#AAAAAA] font-semibold mb-1">
                              Mentor Hinglish Breakdown
                            </div>
                            <p className="text-xs text-[#888888] italic leading-relaxed">
                              &ldquo;{topic.hinglishSummary}&rdquo;
                            </p>
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
