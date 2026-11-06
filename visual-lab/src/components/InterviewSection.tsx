"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Sparkles,
  Eye,
  EyeOff,
  CheckCircle2,
  Filter,
  Volume2,
  Search,
  Copy,
  Check,
  Zap,
  HelpCircle,
  Lightbulb,
  Award,
} from "lucide-react";
import confetti from "canvas-confetti";
import { interviewQuestions, InterviewQuestionItem } from "@/data/interviewQuestions";
import { playClickSound, playChimeSound } from "@/lib/sound";

// Category color configuration
const CATEGORY_THEMES: Record<
  string,
  {
    border: string;
    glow: string;
    badge: string;
    text: string;
    dot: string;
  }
> = {
  "Triggers & Architecture": {
    border: "border-cyan-500/40 hover:border-cyan-400",
    glow: "shadow-[0_0_30px_rgba(0,240,255,0.18)]",
    badge: "bg-cyan-500/15 border-cyan-500/40 text-cyan-300",
    text: "text-cyan-400",
    dot: "bg-cyan-400",
  },
  "Apex Core & Collections": {
    border: "border-emerald-500/40 hover:border-emerald-400",
    glow: "shadow-[0_0_30px_rgba(16,185,129,0.18)]",
    badge: "bg-emerald-500/15 border-emerald-500/40 text-emerald-300",
    text: "text-emerald-400",
    dot: "bg-emerald-400",
  },
  "SOQL & Database": {
    border: "border-purple-500/40 hover:border-purple-400",
    glow: "shadow-[0_0_30px_rgba(168,85,247,0.18)]",
    badge: "bg-purple-500/15 border-purple-500/40 text-purple-300",
    text: "text-purple-400",
    dot: "bg-purple-400",
  },
  "Security & Limits": {
    border: "border-amber-500/40 hover:border-amber-400",
    glow: "shadow-[0_0_30px_rgba(245,158,11,0.18)]",
    badge: "bg-amber-500/15 border-amber-500/40 text-amber-300",
    text: "text-amber-400",
    dot: "bg-amber-400",
  },
};

const CyberFlashcard: React.FC<{
  item: InterviewQuestionItem;
  isRevealed: boolean;
  isMastered: boolean;
  answerMode: "english" | "hinglish";
  onToggleReveal: () => void;
  onToggleMastered: () => void;
}> = ({
  item,
  isRevealed,
  isMastered,
  answerMode,
  onToggleReveal,
  onToggleMastered,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const theme =
    CATEGORY_THEMES[item.category] || CATEGORY_THEMES["Triggers & Architecture"];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleCopyAnswer = (e: React.MouseEvent) => {
    e.stopPropagation();
    playClickSound();
    const textToCopy =
      answerMode === "english" ? item.hireMeEnglish : item.hinglishConcept;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMasteredClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isMastered) {
      playChimeSound();
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#00F0FF", "#0176D3", "#10B981", "#A855F7"],
      });
    } else {
      playClickSound();
    }
    onToggleMastered();
  };

  return (
    <motion.div
      layout
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative rounded-2xl border backdrop-blur-xl transition-all duration-300 p-6 overflow-hidden flex flex-col justify-between ${
        isMastered
          ? "bg-gradient-to-b from-slate-900/95 via-[#062015]/90 to-slate-950/95 border-emerald-500/50 shadow-[0_0_25px_rgba(16,185,129,0.2)]"
          : `bg-gradient-to-b from-slate-900/90 via-slate-950/90 to-[#030914] ${theme.border} hover:${theme.glow}`
      }`}
    >
      {/* Dynamic Radial Spotlight Glow */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(0, 240, 255, 0.08), transparent 75%)`,
        }}
      />

      <div>
        {/* Header & Badges Row */}
        <div className="flex items-center justify-between mb-4 relative z-10 gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {/* Question Number Badge */}
            <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-mono font-black text-cyan-300 shadow-sm">
              Q{item.questionNumber.toString().padStart(2, "0")}
            </span>

            {/* Category Pill */}
            <span
              className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono font-semibold flex items-center gap-1.5 ${theme.badge}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${theme.dot} animate-pulse`} />
              {item.category}
            </span>

            {/* Difficulty Badge */}
            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-800/80 text-slate-300 border border-slate-700/60">
              {item.difficulty}
            </span>
          </div>

          {/* Mastered Toggle Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleMasteredClick}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all shadow-sm ${
              isMastered
                ? "bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                : "bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700"
            }`}
          >
            <CheckCircle2 className={`w-3.5 h-3.5 ${isMastered ? "text-slate-950" : "text-emerald-400"}`} />
            {isMastered ? "Mastered" : "Mark Mastered"}
          </motion.button>
        </div>

        {/* Question Text */}
        <h3 className="text-base sm:text-lg font-bold text-white mb-3.5 leading-snug tracking-tight relative z-10">
          {item.question}
        </h3>

        {/* Technical Keywords Pills */}
        <div className="flex flex-wrap gap-1.5 mb-5 relative z-10">
          {item.keyKeywords.map((kw, kwIdx) => (
            <span
              key={kwIdx}
              className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-950/80 text-slate-300 border border-slate-800 flex items-center gap-1"
            >
              <span className="text-cyan-400">#</span>
              {kw}
            </span>
          ))}
        </div>
      </div>

      {/* Action: Reveal Toggle Button */}
      <div className="pt-2 relative z-10">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            playClickSound();
            onToggleReveal();
          }}
          className={`w-full py-2.5 px-4 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 ${
            isRevealed
              ? "bg-slate-800/90 text-slate-300 hover:bg-slate-700 border border-slate-700"
              : "bg-gradient-to-r from-cyan-500 via-blue-600 to-[#0176D3] text-white shadow-[0_0_20px_rgba(0,240,255,0.25)] hover:brightness-110"
          }`}
        >
          {isRevealed ? (
            <>
              <EyeOff className="w-3.5 h-3.5" />
              <span>Hide Answer</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5" />
              <span>
                Reveal Answer ({answerMode === "english" ? "Hire-Me English" : "Hinglish Concept"})
              </span>
            </>
          )}
        </motion.button>
      </div>

      {/* Expanded Answer Body with Framer Motion AnimatePresence */}
      <AnimatePresence>
        {isRevealed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden mt-4 pt-4 border-t border-slate-800 space-y-3 relative z-10"
          >
            {answerMode === "english" ? (
              <div className="p-4 rounded-xl bg-slate-950/90 border border-cyan-500/30 text-white relative group">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-cyan-300 font-bold flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                    Exact Words To Speak in Interview (&ldquo;Hire-Me&rdquo; English)
                  </div>
                  <button
                    onClick={handleCopyAnswer}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 border border-slate-800 transition-colors"
                    title="Copy Answer"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <blockquote className="text-xs sm:text-sm leading-relaxed text-slate-200 pl-3 border-l-2 border-cyan-400 italic">
                  &ldquo;{item.hireMeEnglish}&rdquo;
                </blockquote>

                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span className="text-cyan-400 flex items-center gap-1 font-semibold">
                    <Lightbulb className="w-3 h-3 text-cyan-400" />
                    Architectural Impact:
                  </span>
                  <span className="text-slate-300">Clean SoC &bull; Zero Recurrence &bull; Scale-Ready</span>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-950/90 border border-amber-500/30 text-white relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-amber-300 font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Conceptual Deep Dive (Hinglish Concept)
                  </div>
                  <button
                    onClick={handleCopyAnswer}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-300 border border-slate-800 transition-colors"
                    title="Copy Concept"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <div className="text-xs sm:text-sm leading-relaxed text-slate-200 pl-3 border-l-2 border-amber-400">
                  {item.hinglishConcept}
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                  <span className="text-amber-400 font-semibold">Core Takeaway:</span>
                  <span className="text-slate-300">Remember real-world context for high recall during technical grilling</span>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const InterviewSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [answerMode, setAnswerMode] = useState<"english" | "hinglish">("english");
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set(["q-01", "q-03"]));
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set(["q-01", "q-02", "q-04"]));

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleMastered = (id: string) => {
    setMasteredIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const categories = [
    "All",
    "Triggers & Architecture",
    "Apex Core & Collections",
    "SOQL & Database",
    "Security & Limits",
  ];

  const filteredQuestions = interviewQuestions.filter((item) => {
    const matchesCat =
      selectedCategory === "All" || item.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      query === "" ||
      item.question.toLowerCase().includes(query) ||
      item.keyKeywords.some((k) => k.toLowerCase().includes(query)) ||
      item.hireMeEnglish.toLowerCase().includes(query);
    return matchesCat && matchesSearch;
  });

  const masteryPercent = Math.round(
    (masteredIds.size / interviewQuestions.length) * 100
  );

  return (
    <section
      id="interview-prep"
      className="py-24 border-b border-cyan-500/20 bg-[#030712] relative overflow-hidden"
    >
      {/* Background Radial Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-cyan-500/10 via-blue-600/10 to-purple-600/10 blur-[130px] pointer-events-none -z-10 rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-xs font-mono text-cyan-300 mb-3 shadow-[0_0_15px_rgba(0,240,255,0.15)]">
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span>Job-Ready Interview Q&amp;A Bank &bull; Curated from INTERVIEW_PREP.md</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Spotlight Interview{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
                Flashcards
              </span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              17 battle-tested architectural questions. Toggle between executive English interview delivery 
              and intuitive Hinglish concept breakdowns with one-click audio feedback.
            </p>
          </div>

          {/* Mastery Progress Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-slate-900/95 to-slate-950 border border-cyan-500/30 shadow-lg min-w-[240px]">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                Flashcard Mastery
              </span>
              <span className="text-cyan-300 font-bold">{masteryPercent}%</span>
            </div>
            
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${masteryPercent}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400 h-full rounded-full"
              />
            </div>

            <div className="mt-2 flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">Completed:</span>
              <span className="text-white font-bold">
                {masteredIds.size} / {interviewQuestions.length} Questions
              </span>
            </div>
          </div>
        </div>

        {/* Filter, Search & Mode Switcher Toolbar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8 bg-slate-900/80 p-4 rounded-2xl border border-cyan-500/25 backdrop-blur-md">
          
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5 text-cyan-400" />
              Category:
            </span>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    playClickSound();
                    setSelectedCategory(cat);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
                    isSelected
                      ? "bg-gradient-to-r from-cyan-500 to-[#0176D3] text-white font-bold shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                      : "bg-slate-800/90 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700/60"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search Box & Dual Mode Switcher */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search flashcards..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 w-full sm:w-auto justify-center">
              <button
                onClick={() => {
                  playClickSound();
                  setAnswerMode("english");
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  answerMode === "english"
                    ? "bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(0,240,255,0.35)]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Hire-Me English
              </button>
              <button
                onClick={() => {
                  playClickSound();
                  setAnswerMode("hinglish");
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  answerMode === "hinglish"
                    ? "bg-amber-400 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.35)]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Hinglish Concept
              </button>
            </div>
          </div>

        </div>

        {/* Results Counter if searching */}
        {searchQuery && (
          <div className="text-xs font-mono text-cyan-400 mb-4 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            Found {filteredQuestions.length} flashcards matching &ldquo;{searchQuery}&rdquo;
          </div>
        )}

        {/* Flashcard 3D Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredQuestions.map((item) => (
            <CyberFlashcard
              key={item.id}
              item={item}
              isRevealed={revealedIds.has(item.id)}
              isMastered={masteredIds.has(item.id)}
              answerMode={answerMode}
              onToggleReveal={() => toggleReveal(item.id)}
              onToggleMastered={() => toggleMastered(item.id)}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
