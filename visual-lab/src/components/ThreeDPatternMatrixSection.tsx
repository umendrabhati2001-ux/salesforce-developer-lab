"use client";

import { playChimeSound, playClickSound } from "@/lib/sound";
import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  Boxes,
  ChevronRight,
  Cpu,
  Maximize2,
  Minimize2,
  Radio,
  ShieldCheck,
  Terminal,
  Zap
} from "lucide-react";
import React, { useState } from "react";

interface TowerLayer {
  id: string;
  level: number;
  name: string;
  shortName: string;
  category: string;
  badge: string;
  accent: string;
  borderColor: string;
  glowRgba: string;
  summary: string;
  telemetryLog: string;
  governorStatus: string;
  artifacts: string[];
}

const towerLayers: TowerLayer[] = [
  {
    id: "layer-6",
    level: 6,
    name: "UI / Lightning Web Components (LWC)",
    shortName: "UI & LWC",
    category: "Client Presentation",
    badge: "Layer 06",
    accent: "from-sky-400 via-cyan-400 to-blue-500",
    borderColor: "border-sky-400",
    glowRgba: "rgba(56, 189, 248, 0.4)",
    summary:
      "Reactive presentation tier. Lightning Web Components leverage Lightning Data Service (LDS) client cache and wire adapters to eliminate redundant server calls.",
    telemetryLog: "POST /services/apexrest/CaseAPI -> User dispatches Critical SLA Case from LWC",
    governorStatus: "Client Cache Active: 0 Apex Limits consumed",
    artifacts: ["caseComplaintDashboard.js", "@wire(getRecord)", "lightning/messageService", "Screen Flow"],
  },
  {
    id: "layer-5",
    level: 5,
    name: "Async Queue Reactor & Platform Events",
    shortName: "Async Reactor",
    category: "Background Execution",
    badge: "Layer 05",
    accent: "from-purple-400 via-violet-500 to-indigo-600",
    borderColor: "border-purple-400",
    glowRgba: "rgba(168, 85, 247, 0.4)",
    summary:
      "Decoupled asynchronous processing mesh. Automatically enqueues Queueable Apex jobs and publishes Platform Events for long-running SLA webhooks and integration dispatches.",
    telemetryLog: "Queueable Enqueued: System.enqueueJob(new ComplaintSlaJob()) [Id: 7075g0000XyZ1]",
    governorStatus: "Async Limits Pool: 200 SOQL / 60,000ms CPU Available",
    artifacts: ["Queueable SlaNotificationJob", "Complaint_Event__e", "EventBus.publish()", "Batch Apex 200-Chunk"],
  },
  {
    id: "layer-4",
    level: 4,
    name: "Trigger & Apex Runtime Engine",
    shortName: "Apex Runtime",
    category: "Execution Controller",
    badge: "Layer 04",
    accent: "from-cyan-400 via-blue-500 to-[#0176D3]",
    borderColor: "border-cyan-400",
    glowRgba: "rgba(0, 240, 255, 0.45)",
    summary:
      "One Trigger Per Object routing through CaseTriggerHandler. Domain logic executed in ComplaintService.applySlaTargets() with strict recursion guards.",
    telemetryLog: "CaseTrigger.trigger -> CaseTriggerHandler.handleBeforeInsert() -> ComplaintService SLA applied",
    governorStatus: "0 DML executed: Field values mutated directly in memory on Trigger.new",
    artifacts: ["CaseTrigger.trigger", "CaseTriggerHandler.cls", "ComplaintService.cls", "RecursionGuard.cls"],
  },
  {
    id: "layer-3",
    level: 3,
    name: "Governor Limits Enforcement Shield",
    category: "Multitenant Watchdog",
    shortName: "Governor Shield",
    badge: "Layer 03",
    accent: "from-amber-400 via-orange-500 to-rose-500",
    borderColor: "border-amber-400",
    glowRgba: "rgba(245, 158, 11, 0.4)",
    summary:
      "Hard multitenant resource boundary enforced by Salesforce kernel. Monitors cumulative execution counters (100 SOQL queries, 150 DML, 10,000ms CPU, 6MB Heap).",
    telemetryLog: "Governor Audit: SOQL: 1/100 | DML: 1/150 | CPU: 38ms/10,000ms | Heap: 48KB/6MB [SAFE]",
    governorStatus: "100% Limit Safe: Bulkified iteration prevents 101 query limit exception",
    artifacts: ["Limits.getQueries()", "Limits.getDMLStatements()", "Limits.getCpuTime()", "100 SOQL Guard"],
  },
  {
    id: "layer-2",
    level: 2,
    name: "Metadata Cache & In-Memory Hash Map",
    shortName: "Metadata & Hash",
    category: "Memory Architecture",
    badge: "Layer 02",
    accent: "from-emerald-400 via-teal-500 to-green-600",
    borderColor: "border-emerald-400",
    glowRgba: "rgba(16, 185, 129, 0.4)",
    summary:
      "Apex Collections gold standard. Collects foreign keys into Set<Id> and indexes parent records into Map<Id, Account> for instant O(1) hash table lookup.",
    telemetryLog: "Set<Id> accountIds populated (1 query) -> Map<Id, Account> populated for O(1) hash lookup",
    governorStatus: "Algorithm: O(N) Linear Time complexity - zero nested loops",
    artifacts: ["Set<Id> accountIds", "Map<Id, Account>", "Schema describe cache", "O(1) Hash Table"],
  },
  {
    id: "layer-1",
    level: 1,
    name: "Database Storage & Custom Index Tier",
    shortName: "Database Storage",
    category: "Universal Data Tier",
    badge: "Layer 01",
    accent: "from-blue-600 via-indigo-700 to-slate-900",
    borderColor: "border-blue-500",
    glowRgba: "rgba(59, 130, 246, 0.35)",
    summary:
      "Force.com multitenant database engine. Automatically utilizes custom indexes for CaseNumber, AccountId, and External IDs to achieve sub-millisecond query selectivity.",
    telemetryLog: "DB COMMIT SUCCESS: Case [Id: 5005g00000CaS1AA] persisted with SLA Turnaround: 4.0 Hours",
    governorStatus: "Transaction committed to persistent storage with database savepoint guarantee",
    artifacts: ["Case sObject Table", "Account Parent", "Complaint_Action_Item__c", "Custom B-Tree Indexes"],
  },
];

export const ThreeDPatternMatrixSection: React.FC = () => {
  const [exploded, setExploded] = useState<boolean>(true);
  const [activeLayerId, setActiveLayerId] = useState<string>("layer-4");
  const [simulating, setSimulating] = useState<boolean>(false);
  const [currentPacketLevel, setCurrentPacketLevel] = useState<number | null>(null);
  const [telemetryLogs, setTelemetryLogs] = useState<string[]>([
    "[SYSTEM READY] 3D Exploded Architecture Tower initialized.",
    "[IDLE] Awaiting 'Insert Case' transaction trigger.",
  ]);

  const activeLayer = towerLayers.find((l) => l.id === activeLayerId) || towerLayers[2];

  const handleSimulateCase = () => {
    if (simulating) return;
    playClickSound();
    setSimulating(true);
    setTelemetryLogs(["[TRIGGERED] Case record created: { Priority: 'Critical', Category: 'Cloud Downtime' }"]);

    // Sequence levels from 6 down to 1
    const levels = [6, 5, 4, 3, 2, 1];

    levels.forEach((lvl, idx) => {
      setTimeout(() => {
        setCurrentPacketLevel(lvl);
        const layer = towerLayers.find((l) => l.level === lvl);
        if (layer) {
          setActiveLayerId(layer.id);
          setTelemetryLogs((prev) => [
            ...prev,
            `[T-${(levels.length - idx) * 120}ms] [L-0${lvl}] ${layer.telemetryLog}`,
          ]);
        }
        playClickSound();

        // Final step completion
        if (idx === levels.length - 1) {
          setTimeout(() => {
            setCurrentPacketLevel(null);
            setSimulating(false);
            playChimeSound();
            setTelemetryLogs((prev) => [
              ...prev,
              "🎉 [TRANSACTION COMMITTED] All 6 architectural tiers validated with zero Governor Limit violations!",
            ]);
            try {
              confetti({
                particleCount: 50,
                spread: 70,
                origin: { y: 0.75 },
                colors: ["#00F0FF", "#0176D3", "#10B981", "#A855F7"],
              });
            } catch {
              // Confetti fallback
            }
          }, 600);
        }
      }, idx * 700);
    });
  };

  return (
    <section
      id="pattern-matrix"
      className="py-24 border-b border-cyan-500/20 bg-[#030712] relative overflow-hidden"
    >
      {/* Background High-Tech Cyber Atmosphere */}
      <div className="absolute top-1/4 left-1/4 -translate-y-1/2 w-[700px] h-[500px] bg-cyan-500/10 blur-[150px] pointer-events-none -z-10 rounded-full" />
      <div className="absolute bottom-10 right-1/4 w-[650px] h-[500px] bg-blue-600/10 blur-[150px] pointer-events-none -z-10 rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-xs font-mono text-cyan-300 mb-3 shadow-[0_0_15px_rgba(0,240,255,0.15)]">
              <Boxes className="w-3.5 h-3.5 text-cyan-400" />
              <span>Interactive 3D Holographic Model &bull; Option 1</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              3D Exploded{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
                Architecture Tower
              </span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              Explore the full Salesforce Enterprise Stack in an interactive 3D exploded isometric model.
              Toggle the 3D exploded view to inspect decoupled architectural tiers, or fire a live Case transaction to trace the execution packet.
            </p>
          </div>

          {/* Action Buttons Toolbar */}
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 w-full sm:w-auto">
            {/* Exploded View Toggle Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                playClickSound();
                setExploded((prev) => !prev);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold border transition-all flex items-center justify-center gap-2 shadow-sm ${
                exploded
                  ? "bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.25)]"
                  : "bg-slate-900 text-slate-300 border-slate-700 hover:border-cyan-400"
              }`}
            >
              {exploded ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Exploded View: EXPANDED</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Exploded View: COLLAPSED</span>
                </>
              )}
            </motion.button>

            {/* Packet Trace Simulation Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSimulateCase}
              disabled={simulating}
              className={`px-5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 shadow-lg ${
                simulating
                  ? "bg-cyan-500 text-slate-950 shadow-[0_0_25px_rgba(0,240,255,0.45)] animate-pulse cursor-not-allowed"
                  : "bg-gradient-to-r from-cyan-400 via-blue-500 to-[#0176D3] text-slate-950 hover:brightness-110 shadow-[0_0_20px_rgba(0,240,255,0.3)]"
              }`}
            >
              <Zap className="w-4 h-4 text-slate-950" />
              <span>{simulating ? `Tracing Level 0${currentPacketLevel}...` : "Insert Case (Packet Trace)"}</span>
            </motion.button>
          </div>
        </div>

        {/* 3D Tower Canvas & Inspector Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: True 3D Isometric Exploded Slabs Showcase */}
          <div className="lg:col-span-7 rounded-3xl bg-slate-950/80 border border-cyan-500/25 p-4 sm:p-8 backdrop-blur-xl relative overflow-hidden flex flex-col items-center">

            {/* Top Bar Indicators */}
            <div className="w-full flex items-center justify-between pb-4 border-b border-slate-800 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-cyan-300">
                <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                3D Spatial Canvas (6 Isometric Tiers)
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                Perspective: 45&deg; Isometric
              </span>
            </div>

            {/* 3D Tower Slabs Container */}
            <div className="w-full py-8 flex flex-col items-center relative min-h-[520px] justify-center">

              {/* Neon Vertical Conduit Line connecting layers */}
              <div className="absolute top-8 bottom-8 w-1 bg-gradient-to-b from-cyan-400 via-blue-500 to-indigo-700 opacity-60 rounded-full shadow-[0_0_15px_#00F0FF] pointer-events-none" />

              {/* Animated Glowing Packet traveling down during simulation */}
              <AnimatePresence>
                {simulating && currentPacketLevel !== null && (
                  <motion.div
                    layoutId="active-case-packet"
                    className="absolute z-40 w-7 h-7 rounded-full bg-cyan-300 border-2 border-white shadow-[0_0_25px_#00F0FF] flex items-center justify-center animate-ping pointer-events-none"
                    style={{
                      top: `${((6 - currentPacketLevel) / 5) * 80 + 10}%`,
                    }}
                  />
                )}
              </AnimatePresence>

              {/* 6 Isometric Slabs Stack */}
              <div className="w-full max-w-lg space-y-4 relative z-20">
                {towerLayers.map((layer) => {
                  const isSelected = activeLayerId === layer.id;
                  const isHitByPacket = currentPacketLevel === layer.level;

                  return (
                    <motion.div
                      key={layer.id}
                      layout
                      whileHover={{ scale: 1.02, x: 8 }}
                      onClick={() => {
                        playClickSound();
                        setActiveLayerId(layer.id);
                      }}
                      style={{
                        marginTop: exploded ? "16px" : "4px",
                        marginBottom: exploded ? "16px" : "4px",
                      }}
                      className={`relative rounded-2xl border p-4 cursor-pointer transition-all duration-300 backdrop-blur-xl ${
                        isHitByPacket
                          ? "bg-cyan-500/30 border-cyan-300 shadow-[0_0_35px_#00F0FF] ring-2 ring-cyan-400"
                          : isSelected
                          ? `bg-slate-900/95 ${layer.borderColor} shadow-[0_0_25px_rgba(0,240,255,0.3)] ring-1 ring-cyan-400/50`
                          : "bg-slate-900/60 border-slate-800/80 hover:border-slate-700"
                      }`}
                    >
                      {/* Left Glowing Micro-Pill Indicator */}
                      {(isSelected || isHitByPacket) && (
                        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-2 h-8 rounded-full bg-cyan-400 shadow-[0_0_12px_#00F0FF]" />
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {/* Level Badge */}
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-black text-xs border ${
                              isHitByPacket
                                ? "bg-white text-slate-950 border-cyan-400 shadow-[0_0_15px_#00F0FF]"
                                : isSelected
                                ? "bg-gradient-to-tr from-cyan-500 to-[#0176D3] text-white border-cyan-300 shadow-neon-cyan"
                                : "bg-slate-950 text-slate-400 border-slate-800"
                            }`}
                          >
                            0{layer.level}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-white text-sm">
                                {layer.name}
                              </h4>
                            </div>
                            <span className="text-[11px] font-mono text-cyan-400">
                              {layer.category}
                            </span>
                          </div>
                        </div>

                        {/* Right Tag */}
                        <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-[10px] font-mono text-slate-300 font-bold">
                          {layer.badge}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

            </div>

            {/* Bottom Status Row */}
            <div className="w-full pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                Live Subsystem: <span className="text-cyan-300 font-bold">{activeLayer.name}</span>
              </span>
              <span className="text-emerald-400 font-semibold">100% Multitenant Safe</span>
            </div>
          </div>

          {/* Right Column: Deep Layer Telemetry & Live Execution Stream */}
          <div className="lg:col-span-5 space-y-5">

            {/* Active Tier Subsystem Specs Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeLayer.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="rounded-3xl bg-gradient-to-b from-slate-900/95 via-slate-950/95 to-[#040A14] border border-cyan-500/35 p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden"
              >
                {/* Background Ambient Corner Glow */}
                <div className="absolute top-0 right-0 w-44 h-44 bg-cyan-500/15 rounded-full blur-2xl pointer-events-none" />

                {/* Header Tag */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                  <span className="px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/40 text-xs font-mono text-cyan-300 font-bold">
                    LAYER 0{activeLayer.level} &bull; {activeLayer.category}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Tier Inspection
                  </span>
                </div>

                {/* Layer Headline */}
                <h3 className="text-lg sm:text-xl font-black text-white tracking-tight mb-2">
                  {activeLayer.name}
                </h3>

                {/* Layer Description */}
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-5">
                  {activeLayer.summary}
                </p>

                {/* Governor Limits Impact Pill */}
                <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/35 mb-5">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-300 font-bold mb-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    Governor Limits &amp; Safety Rating
                  </div>
                  <div className="text-xs font-mono text-slate-200">
                    {activeLayer.governorStatus}
                  </div>
                </div>

                {/* Artifacts & Code Reference Chips */}
                <div>
                  <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                    Associated Apex Code &amp; Schema Artifacts
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeLayer.artifacts.map((art, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 flex items-center gap-1.5"
                      >
                        <ChevronRight className="w-3 h-3 text-cyan-400 shrink-0" />
                        <span className="truncate">{art}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Live Packet Telemetry & Execution Log Terminal */}
            <div className="rounded-3xl bg-slate-950 border border-cyan-500/30 p-5 shadow-xl font-mono">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs">
                <div className="flex items-center gap-2 text-cyan-300 font-bold">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <span>Transaction Telemetry Stream</span>
                </div>
                <span className="flex items-center gap-1.5 text-[10px] text-slate-400">
                  <span className={`w-2 h-2 rounded-full ${simulating ? "bg-cyan-400 animate-ping" : "bg-emerald-400"}`} />
                  {simulating ? "BUS TRACING" : "STANDBY"}
                </span>
              </div>

              {/* Log Stream Box */}
              <div className="space-y-1.5 max-h-44 overflow-y-auto text-xs text-slate-300 scrollbar-thin pr-1">
                {telemetryLogs.map((log, idx) => (
                  <div
                    key={idx}
                    className={`leading-relaxed ${
                      log.startsWith("🎉")
                        ? "text-emerald-400 font-bold"
                        : log.startsWith("[TRIGGERED]")
                        ? "text-cyan-300 font-bold"
                        : "text-slate-400"
                    }`}
                  >
                    {log}
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
