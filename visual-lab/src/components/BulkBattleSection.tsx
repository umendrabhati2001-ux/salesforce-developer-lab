"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Swords, Play, AlertTriangle, CheckCircle2, ShieldAlert, ShieldCheck, Zap, RotateCcw, Cpu, Gauge } from "lucide-react";
import { sound } from "@/lib/sound";
import confetti from "canvas-confetti";

export const BulkBattleSection: React.FC = () => {
  const [recordCount, setRecordCount] = useState<number>(150);
  const [battleState, setBattleState] = useState<"idle" | "running" | "finished">("idle");

  const runBattle = () => {
    sound.playClick();
    setBattleState("running");

    setTimeout(() => {
      setBattleState("finished");
      if (recordCount > 100) {
        sound.playWarning();
      } else {
        sound.playSuccess();
      }
      try {
        confetti({
          particleCount: 35,
          spread: 70,
          origin: { y: 0.8 },
          colors: ["#00F0FF", "#0176D3", "#10B981"],
        });
      } catch {
        // Fallback
      }
    }, 1200);
  };

  const isCrashed = recordCount > 100;

  return (
    <section id="bulk-battle" className="py-24 border-b border-cyan-500/20 bg-[#030712] relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[500px] bg-rose-600/10 blur-[140px] pointer-events-none -z-10 rounded-full" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[500px] bg-emerald-600/10 blur-[140px] pointer-events-none -z-10 rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono text-cyan-300 mb-3 shadow-neon-cyan">
              <Swords className="w-3.5 h-3.5 text-cyan-400" />
              Topic 11 Architectural Stress Test Arena
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Anti-Pattern vs Enterprise Bulk Battle
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl">
              Witness the exact moment unbulkified code crashes into Salesforce multitenant governor limits, 
              and how the enterprise Set + Map pattern handles 200 records in 14 milliseconds.
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex items-center gap-2">
            <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-900 border border-cyan-500/30 text-cyan-300">
              Transaction Threshold: 100 SOQL Maximum
            </span>
          </div>
        </div>

        {/* Interactive Load Controller */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-cyan-500/30 shadow-2xl mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
                Batch Transaction Load Generator
              </div>
              <h3 className="text-lg font-bold text-white mt-0.5">
                Simulating Incoming Records: <span className="font-mono text-cyan-300">{recordCount} Cases</span>
              </h3>
            </div>

            {/* Quick preset buttons */}
            <div className="flex items-center gap-2">
              {[20, 50, 100, 150, 200].map((num) => (
                <button
                  key={num}
                  onClick={() => {
                    sound.playClick();
                    setRecordCount(num);
                    setBattleState("idle");
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    recordCount === num
                      ? "bg-cyan-500 text-slate-950 shadow-neon-cyan"
                      : "bg-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Range Slider */}
          <div className="pt-2">
            <input
              type="range"
              min="10"
              max="200"
              value={recordCount}
              onChange={(e) => {
                setRecordCount(parseInt(e.target.value));
                setBattleState("idle");
              }}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[11px] font-mono text-slate-500 mt-1">
              <span>10 Records (Dev Unit Test)</span>
              <span className="text-amber-400 font-bold">100 Records (SOQL Limit Cliff)</span>
              <span>200 Records (Standard Salesforce Batch)</span>
            </div>
          </div>

          {/* Run Button */}
          <div className="pt-2 flex justify-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={runBattle}
              disabled={battleState === "running"}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-[#0176D3] text-slate-950 font-bold font-mono text-sm shadow-neon-cyan hover:brightness-110 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Play className={`w-4 h-4 ${battleState === "running" ? "animate-spin" : ""}`} />
              {battleState === "running" ? "Running Parallel Stress Test..." : `Simulate Battle (${recordCount} Records)`}
            </motion.button>
          </div>
        </div>

        {/* Side-by-Side Arena */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Fighter: The Unbulkified Anti-Pattern */}
          <div className="lg:col-span-6 rounded-2xl border border-rose-500/40 bg-gradient-to-b from-[#18080c]/90 via-[#100609]/90 to-slate-950 p-6 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-3.5 border-b border-rose-500/20 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-rose-500/20 border border-rose-500/30">
                  <ShieldAlert className="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-mono">Anti-Pattern (SOQL in Loop)</h3>
                  <div className="text-[11px] text-rose-400">Junior Developer Mistake</div>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
                HIGH RISK
              </span>
            </div>

            {/* Bad Code */}
            <pre className="p-3.5 rounded-xl bg-slate-950/80 border border-rose-500/20 font-mono text-xs text-rose-200 leading-relaxed overflow-x-auto mb-4">
              <code>{`// ❌ SOQL QUERY INSIDE FOR-LOOP
for (Case c : triggerNew) {
    // 💥 Fires 1 query PER RECORD!
    Account a = [SELECT Id, Name 
                 FROM Account 
                 WHERE Id = :c.AccountId];
    c.Priority = a.Name != null ? 'High' : 'Low';
}`}</code>
            </pre>

            {/* Scorecard Metrics */}
            <div className="space-y-3 pt-2 font-mono text-xs">
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">SOQL Queries Fired:</span>
                <span className={`font-bold ${recordCount > 100 ? "text-rose-400 animate-pulse text-sm" : "text-slate-200"}`}>
                  {recordCount} / 100 Max
                </span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">Time Complexity:</span>
                <span className="text-rose-400 font-bold">O(N × Database Latency)</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">Total Roundtrips:</span>
                <span className="text-rose-300 font-semibold">{recordCount} Network Queries</span>
              </div>
            </div>

            {/* Battle Outcome Banner */}
            <div className="mt-5">
              {battleState === "finished" && (
                isCrashed ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500 text-rose-200 text-xs font-mono space-y-1 shadow-lg"
                  >
                    <div className="font-bold flex items-center gap-1.5 text-rose-400">
                      <AlertTriangle className="w-4 h-4 animate-bounce" />
                      CRITICAL EXCEPTION at Record #101:
                    </div>
                    <div>System.LimitException: Too many SOQL queries: 101</div>
                    <div className="text-[10px] text-rose-400/90 pt-1 border-t border-rose-500/30">
                      Result: Transaction rolled back. Zero records saved. Customer angry.
                    </div>
                  </motion.div>
                ) : (
                  <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs font-mono">
                    ⚠️ Passed {recordCount} records by chance, but will crash the moment batch size reaches 101!
                  </div>
                )
              )}
            </div>

          </div>

          {/* Right Fighter: The Enterprise Bulkified Pattern */}
          <div className="lg:col-span-6 rounded-2xl border border-emerald-500/40 bg-gradient-to-b from-[#06180e]/90 via-[#041009]/90 to-slate-950 p-6 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-3.5 border-b border-emerald-500/20 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-mono">Enterprise Pattern (Set + Map)</h3>
                  <div className="text-[11px] text-emerald-400">Senior Architect Standard</div>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                100% BULKIFIED
              </span>
            </div>

            {/* Good Code */}
            <pre className="p-3.5 rounded-xl bg-slate-950/80 border border-emerald-500/20 font-mono text-xs text-emerald-200 leading-relaxed overflow-x-auto mb-4">
              <code>{`// ✅ SET + MAP BULK ARCHITECTURE
Set<Id> accIds = new Set<Id>();
for (Case c : triggerNew) accIds.add(c.AccountId);

// 🚀 Exactly ONE bulk query for all 200 records!
Map<Id, Account> accMap = new Map<Id, Account>(
    [SELECT Id, Name FROM Account WHERE Id IN :accIds]
);
for (Case c : triggerNew) {
    Account a = accMap.get(c.AccountId); // O(1) Instant!
}`}</code>
            </pre>

            {/* Scorecard Metrics */}
            <div className="space-y-3 pt-2 font-mono text-xs">
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">SOQL Queries Fired:</span>
                <span className="text-emerald-400 font-bold text-sm">
                  1 / 100 Max (Constant!)
                </span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">Time Complexity:</span>
                <span className="text-emerald-400 font-bold">O(N) Linear (Zero Nested Loops)</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">Total Roundtrips:</span>
                <span className="text-cyan-300 font-semibold">1 Network Query (99% Reduction!)</span>
              </div>
            </div>

            {/* Battle Outcome Banner */}
            <div className="mt-5">
              {battleState === "finished" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500 text-emerald-200 text-xs font-mono space-y-1 shadow-lg"
                >
                  <div className="font-bold flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    100% TRANSACTION SUCCESS ({recordCount} Records):
                  </div>
                  <div>Processed in 18ms. Consumed only 1 SOQL query and 0 limit exceptions.</div>
                  <div className="text-[10px] text-emerald-400/90 pt-1 border-t border-emerald-500/30">
                    Status: Certified Enterprise Grade. Fully ready for 200-record batch triggers.
                  </div>
                </motion.div>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
