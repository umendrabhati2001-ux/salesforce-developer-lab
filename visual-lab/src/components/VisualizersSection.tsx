"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { sound } from "@/lib/sound";
import {
  Play,
  RotateCcw,
  Cpu,
  Layers,
  Database,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Zap,
  Code2,
  Check,
  Sparkles,
} from "lucide-react";

export const VisualizersSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"trigger" | "memory" | "governor" | "bulktracer">("trigger");

  // -------------------------------------------------------------
  // SIMULATOR 1: TRIGGER FLOW SIMULATOR STATE
  // -------------------------------------------------------------
  const [selectedCategory, setSelectedCategory] = useState<string>("Cloud Downtime");
  const [simulating, setSimulating] = useState<boolean>(false);
  const [activeNodeIndex, setActiveNodeIndex] = useState<number>(-1);
  const [executionLogs, setExecutionLogs] = useState<string[]>([
    "Ready. Click 'Run Trigger Flow' to simulate CaseTrigger execution.",
  ]);

  const categorySlaMap: Record<string, { hours: number; priority: string; action: string }> = {
    "Cloud Downtime": { hours: 2, priority: "Critical", action: "Deploy SWAT Infrastructure Team" },
    "Hardware Failure": { hours: 4, priority: "High", action: "Dispatch Field Engineering" },
    "Network Latency": { hours: 8, priority: "High", action: "Reroute Traffic & Run Diagnostics" },
    "Software Bug": { hours: 12, priority: "Medium", action: "Assign Jira Defect to QA Lead" },
    "Billing Dispute": { hours: 24, priority: "Low", action: "Forward to Accounts Receivable" },
  };

  const runTriggerSimulation = () => {
    if (simulating) return;
    sound.playClick();
    setSimulating(true);
    setActiveNodeIndex(0);
    setExecutionLogs([
      `[T+0ms] Incoming DML Event: Case insert/update detected.`,
      `[T+4ms] CaseTrigger firing in 'before insert' context...`,
    ]);

    setTimeout(() => {
      sound.playClick();
      setActiveNodeIndex(1);
      setExecutionLogs((prev) => [
        ...prev,
        `[T+12ms] CaseTrigger delegating to CaseTriggerHandler.handleBeforeInsert(Trigger.new)`,
        `[T+15ms] Filtered 1 modified case without unnecessary SOQL overhead.`,
      ]);
    }, 550);

    setTimeout(() => {
      sound.playClick();
      setActiveNodeIndex(2);
      const target = categorySlaMap[selectedCategory];
      setExecutionLogs((prev) => [
        ...prev,
        `[T+22ms] ComplaintService.applySlaTargets invoked with 1 record.`,
        `[T+26ms] Category '${selectedCategory}' resolved via CATEGORY_SLA_MAP. Target SLA = ${target.hours} Hours.`,
      ]);
    }, 1100);

    setTimeout(() => {
      setActiveNodeIndex(3);
      const target = categorySlaMap[selectedCategory];
      setExecutionLogs((prev) => [
        ...prev,
        `[T+34ms] Record mutated in-memory: c.Resolution_SLA_Hours__c = ${target.hours}. Priority: ${target.priority}`,
        `[T+38ms] Auto Action Item queued: '${target.action}'`,
        `[T+42ms] Transaction complete! Zero SOQL / Zero DML consumed in Before context. 100% Governor Limit Safe.`,
      ]);
      setSimulating(false);
      sound.playSuccess();
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 },
          colors: ["#FFFFFF", "#CCCCCC", "#10b981", "#f59e0b"],
        });
      } catch {
        // Fallback
      }
    }, 1650);
  };

  // -------------------------------------------------------------
  // SIMULATOR 2: APEX MEMORY VISUALIZER STATE
  // -------------------------------------------------------------
  const [listItems, setListItems] = useState<string[]>(["High", "Critical", "Low"]);
  const [setItems, setSetItems] = useState<string[]>(["Cloud Downtime", "Hardware Failure"]);
  const [mapItems, setMapItems] = useState<Record<string, number>>({
    "Cloud Downtime": 2,
    "Hardware Failure": 4,
  });
  const [inputVal, setInputVal] = useState<string>("");
  const [memoryMessage, setMemoryMessage] = useState<string>("");

  const addToList = () => {
    if (!inputVal.trim()) return;
    sound.playClick();
    setListItems((prev) => [...prev, inputVal.trim()]);
    setMemoryMessage(`List: Added "${inputVal.trim()}". Duplicates are permitted. O(1) insertion.`);
    setInputVal("");
  };

  const addToSet = () => {
    if (!inputVal.trim()) return;
    const val = inputVal.trim();
    if (setItems.includes(val)) {
      sound.playWarning();
      setMemoryMessage(`Set REJECTED duplicate "${val}"! Sets only hold strictly unique keys.`);
    } else {
      sound.playSuccess();
      setSetItems((prev) => [...prev, val]);
      setMemoryMessage(`Set: Added "${val}". Unordered unique storage with O(1) membership lookup.`);
    }
    setInputVal("");
  };

  const addToMap = () => {
    if (!inputVal.trim()) return;
    sound.playClick();
    const key = inputVal.trim();
    const sla = Math.floor(Math.random() * 20) + 2;
    setMapItems((prev) => ({ ...prev, [key]: sla }));
    setMemoryMessage(`Map: put("${key}", ${sla} hrs). Instant O(1) hash table lookup.`);
    setInputVal("");
  };

  // -------------------------------------------------------------
  // SIMULATOR 3: GOVERNOR LIMIT GAUGE STATE
  // -------------------------------------------------------------
  const [batchCount, setBatchCount] = useState<number>(100);
  const [isBulkified, setIsBulkified] = useState<boolean>(true);

  const maxSoql = 100;
  const maxDml = 150;

  const currentSoql = isBulkified ? 1 : batchCount;
  const currentDml = isBulkified ? 1 : batchCount;
  const currentCpu = isBulkified ? Math.round(15 + batchCount * 0.1) : Math.round(batchCount * 95);
  const currentHeap = Math.round(120 + batchCount * 1.5);

  const soqlBreached = currentSoql > maxSoql;
  const dmlBreached = currentDml > maxDml;
  const cpuBreached = currentCpu > 10000;

  // -------------------------------------------------------------
  // SIMULATOR 4: TOPIC 11 BULK PATTERN TRACER STATE
  // -------------------------------------------------------------
  const [bulkStep, setBulkStep] = useState<number>(1);

  const bulkSteps = [
    {
      step: 1,
      title: "Step 1: ID Harvest (Loop 1)",
      code: `Set<Id> accountIds = new Set<Id>();\nfor (Case c : triggerNew) {\n    if (c.AccountId != null) {\n        accountIds.add(c.AccountId);\n    }\n}`,
      explanation: "Collect foreign key IDs in a Set<Id>. Automatic deduplication, zero SOQL queries executed.",
      limits: "0 SOQL / 0 DML consumed",
      badge: "In-Memory Set Allocation",
    },
    {
      step: 2,
      title: "Step 2: Single Bulk SOQL into Map",
      code: `Map<Id, Account> accMap = new Map<Id, Account>([\n    SELECT Id, Name, SLA_Tier__c \n    FROM Account \n    WHERE Id IN :accountIds\n]);`,
      explanation: "Query all related Accounts in exactly ONE database call using WHERE Id IN :accountIds.",
      limits: "1 SOQL Query / 0 DML consumed",
      badge: "Map<Id, sObject> O(1) Hash Table",
    },
    {
      step: 3,
      title: "Step 3: Instant O(1) In-Memory Lookup (Loop 2)",
      code: `List<Case> casesToUpdate = new List<Case>();\nfor (Case c : triggerNew) {\n    Account parentAcc = accMap.get(c.AccountId); // O(1) Instant!\n    if (parentAcc != null) {\n        c.Priority = parentAcc.SLA_Tier__c == 'Gold' ? 'High' : 'Normal';\n        casesToUpdate.add(c);\n    }\n}`,
      explanation: "No nested loops! accMap.get() retrieves each parent account in O(1) time. Total time complexity is O(N).",
      limits: "0 SOQL / 0 DML consumed in loop",
      badge: "O(1) Map Lookup",
    },
    {
      step: 4,
      title: "Step 4: Single Bulk DML Execution",
      code: `if (!casesToUpdate.isEmpty()) {\n    Database.update(casesToUpdate, false); // All records committed together\n}`,
      explanation: "All 200 records committed in a single DML statement with partial failure protection (allOrNone = false).",
      limits: "1 DML Statement / 100% Limit Safe",
      badge: "Atomic Bulk Commit",
    },
  ];

  return (
    <section id="visualizers" className="py-24 border-b border-[#222222] bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-xs font-mono text-cyan-300 mb-3 shadow-[0_0_15px_rgba(0,240,255,0.15)]">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>Interactive Architectural Lab</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Motion Simulators &amp;{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
                Memory Engines
              </span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              Experience the actual runtime behavior of Salesforce Apex triggers, multitenant governor 
              limits, and memory collection data structures in real time.
            </p>
          </div>

          {/* Tab Navigation with mobile horizontal scroll */}
          <div className="w-full lg:w-auto overflow-x-auto scrollbar-none pb-1 lg:pb-0">
            <div className="flex items-center bg-slate-950 p-1 rounded-2xl border border-slate-800 gap-1 min-w-max">
              <button
                onClick={() => {
                  sound.playClick();
                  setActiveTab("trigger");
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 ${
                  activeTab === "trigger"
                    ? "bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(0,240,255,0.35)]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                1. Trigger Flow
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setActiveTab("memory");
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 ${
                  activeTab === "memory"
                    ? "bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(0,240,255,0.35)]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                2. Memory Hub
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setActiveTab("governor");
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 ${
                  activeTab === "governor"
                    ? "bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(0,240,255,0.35)]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                3. Limits Gauge
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setActiveTab("bulktracer");
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 ${
                  activeTab === "bulktracer"
                    ? "bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(0,240,255,0.35)]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                4. Topic 11 Tracer
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: TRIGGER FLOW SIMULATOR WITH MOTION PULSES */}
        {/* ========================================================= */}
        {activeTab === "trigger" && (
          <div className="space-y-6">
            
            {/* Control Bar */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-[#161616] to-[#0E0E0E] border border-[#262626] flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-[#888888]">Select Complaint Payload:</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    sound.playClick();
                    setSelectedCategory(e.target.value);
                  }}
                  className="bg-[#121212] border border-[#2E2E2E] text-white font-mono text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-[#555555]"
                >
                  {Object.keys(categorySlaMap).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat} (SLA: {categorySlaMap[cat].hours} hrs)
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={runTriggerSimulation}
                  disabled={simulating}
                  className="px-5 py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-[#E5E5E5] transition-all flex items-center gap-2 disabled:opacity-50 shadow-md"
                >
                  <Play className={`w-3.5 h-3.5 ${simulating ? "animate-spin" : ""}`} />
                  {simulating ? "Executing Trigger..." : "Run Trigger Flow"}
                </motion.button>
              </div>
            </div>

            {/* Pipeline Visualizer Nodes with Motion */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
              {[
                {
                  step: 1,
                  title: "CaseTrigger.trigger",
                  subtitle: "Event: before insert",
                  desc: "One Trigger per Object. Dispatches without holding logic.",
                },
                {
                  step: 2,
                  title: "CaseTriggerHandler.cls",
                  subtitle: "Context Routing",
                  desc: "Filters mutated cases and isolates Trigger.oldMap checks.",
                },
                {
                  step: 3,
                  title: "ComplaintService.cls",
                  subtitle: "Service Layer Logic",
                  desc: "Applies CATEGORY_SLA_MAP in O(1) hash time.",
                },
                {
                  step: 4,
                  title: "sObject Mutation / State",
                  subtitle: "Resolution SLA Applied",
                  desc: `Target SLA = ${categorySlaMap[selectedCategory].hours} hrs. Zero DML consumed.`,
                },
              ].map((node, nIdx) => {
                const isCurrent = activeNodeIndex === nIdx;
                const isPassed = activeNodeIndex > nIdx;

                return (
                  <motion.div
                    key={nIdx}
                    animate={
                      isCurrent
                        ? { scale: [1, 1.03, 1], borderColor: "#888888" }
                        : { scale: 1 }
                    }
                    transition={{ duration: 0.3 }}
                    className={`p-5 rounded-2xl border transition-all relative ${
                      isCurrent
                        ? "bg-gradient-to-b from-[#262626] to-[#141414] border-white shadow-xl ring-1 ring-white/20"
                        : isPassed
                        ? "bg-[#141414] border-[#2E4230]"
                        : "bg-[#0E0E0E] border-[#202020] text-[#777777]"
                    }`}
                  >
                    {nIdx < 3 && (
                      <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-20">
                        <ArrowRight
                          className={`w-5 h-5 ${
                            isPassed || isCurrent ? "text-white animate-pulse" : "text-[#333333]"
                          }`}
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[11px] font-mono mb-2">
                      <span className="text-white font-bold">Node 0{node.step}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                          isPassed
                            ? "bg-[#17281A] text-emerald-400 font-bold"
                            : isCurrent
                            ? "bg-white text-black font-bold animate-pulse"
                            : "bg-[#1A1A1A] text-[#666666]"
                        }`}
                      >
                        {isPassed ? "PROCESSED" : isCurrent ? "EXECUTING" : "IDLE"}
                      </span>
                    </div>

                    <div className="font-mono text-sm font-bold text-white truncate">
                      {node.title}
                    </div>
                    <div className="text-xs text-[#AAAAAA] font-mono mt-0.5">
                      {node.subtitle}
                    </div>
                    <div className="text-xs text-[#777777] mt-2 leading-relaxed">
                      {node.desc}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Live Terminal Execution Logs in Nero style */}
            <div className="rounded-2xl border border-[#222222] bg-[#070707] p-4 font-mono text-xs shadow-xl">
              <div className="flex items-center justify-between border-b border-[#1E1E1E] pb-2 mb-3 text-[#777777]">
                <span className="flex items-center gap-2 text-white">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Real-time Execution & Profiler Log
                </span>
                <span className="text-[10px] text-[#555555]">Apex Profiler v61.0</span>
              </div>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {executionLogs.map((log, lIdx) => (
                  <div
                    key={lIdx}
                    className={
                      log.includes("complete") || log.includes("resolved")
                        ? "text-emerald-400"
                        : log.includes("delegating")
                        ? "text-white"
                        : "text-[#999999]"
                    }
                  >
                    {log}
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: APEX MEMORY VISUALIZER */}
        {/* ========================================================= */}
        {activeTab === "memory" && (
          <div className="space-y-6">
            
            {/* Input Bar */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-[#161616] to-[#0E0E0E] border border-[#262626] flex flex-wrap items-center gap-3">
              <div className="text-xs font-mono text-[#888888]">Input Value:</div>
              <input
                type="text"
                placeholder="e.g. Cloud Downtime, Critical, Security Alert"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addToList();
                }}
                className="bg-[#121212] border border-[#2E2E2E] text-white font-mono text-xs rounded-xl px-3.5 py-2 w-64 focus:outline-none focus:border-[#555555]"
              />
              <button
                onClick={addToList}
                className="px-3.5 py-2 rounded-xl bg-[#1E1E1E] hover:bg-[#2A2A2A] text-white border border-[#333333] text-xs font-mono font-bold transition-colors"
              >
                + Push to List&lt;T&gt;
              </button>
              <button
                onClick={addToSet}
                className="px-3.5 py-2 rounded-xl bg-[#1E1E1E] hover:bg-[#2A2A2A] text-emerald-400 border border-[#333333] text-xs font-mono font-bold transition-colors"
              >
                + Insert into Set&lt;T&gt;
              </button>
              <button
                onClick={addToMap}
                className="px-3.5 py-2 rounded-xl bg-[#1E1E1E] hover:bg-[#2A2A2A] text-[#D4D4D4] border border-[#333333] text-xs font-mono font-bold transition-colors"
              >
                + Map.put(Key, SLA)
              </button>
            </div>

            {memoryMessage && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-[#161616] border border-[#333333] text-white text-xs font-mono flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
                {memoryMessage}
              </motion.div>
            )}

            {/* Visual Storage Cards with Motion */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card 1: List<T> */}
              <div className="p-5 rounded-2xl bg-gradient-to-b from-[#141414] to-[#0A0A0A] border border-[#262626] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#222222] mb-3">
                    <div className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-white" />
                      List&lt;String&gt; (Ordered)
                    </div>
                    <span className="text-[11px] font-mono text-[#888888]">
                      size(): {listItems.length}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#777777] mb-3">
                    Zero-indexed. Permits duplicates. Iterated via for-each or index.
                  </p>
                  <div className="space-y-1.5 max-h-56 overflow-y-auto">
                    {listItems.map((item, idx) => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        key={idx}
                        className="p-2 rounded-lg bg-[#0E0E0E] border border-[#1E1E1E] font-mono text-xs flex items-center justify-between"
                      >
                        <span className="text-[#555555] text-[10px]">[{idx}]</span>
                        <span className="text-white">{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-[#1E1E1E] text-[10px] font-mono text-[#666666]">
                  Lookup: O(1) by index | Search: O(N)
                </div>
              </div>

              {/* Card 2: Set<T> */}
              <div className="p-5 rounded-2xl bg-gradient-to-b from-[#141414] to-[#0A0A0A] border border-[#262626] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#222222] mb-3">
                    <div className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      Set&lt;String&gt; (Unique)
                    </div>
                    <span className="text-[11px] font-mono text-emerald-400">
                      size(): {setItems.length}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#777777] mb-3">
                    Unordered. Strictly unique. Duplicates automatically rejected.
                  </p>
                  <div className="space-y-1.5 max-h-56 overflow-y-auto">
                    {setItems.map((item, idx) => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        key={idx}
                        className="p-2 rounded-lg bg-[#0E0E0E] border border-[#243526] font-mono text-xs flex items-center justify-between"
                      >
                        <span className="text-emerald-400 text-[10px]">HASH KEY</span>
                        <span className="text-[#E0E0E0]">{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-[#1E1E1E] text-[10px] font-mono text-emerald-400">
                  Membership .contains(): O(1) Instant
                </div>
              </div>

              {/* Card 3: Map<Key, Value> */}
              <div className="p-5 rounded-2xl bg-gradient-to-b from-[#141414] to-[#0A0A0A] border border-[#262626] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#222222] mb-3">
                    <div className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#CCCCCC]" />
                      Map&lt;String, Integer&gt;
                    </div>
                    <span className="text-[11px] font-mono text-[#CCCCCC]">
                      keys: {Object.keys(mapItems).length}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#777777] mb-3">
                    Key-Value pairs. Eliminates nested loops. Gold standard of triggers.
                  </p>
                  <div className="space-y-1.5 max-h-56 overflow-y-auto">
                    {Object.entries(mapItems).map(([key, val], idx) => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        key={idx}
                        className="p-2 rounded-lg bg-[#0E0E0E] border border-[#1E1E1E] font-mono text-xs flex items-center justify-between"
                      >
                        <span className="text-[#CCCCCC] font-semibold">{key}</span>
                        <span className="text-white font-bold">{val} hrs</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-[#1E1E1E] text-[10px] font-mono text-[#AAAAAA]">
                  Key Lookup .get(): O(1) Instant
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: GOVERNOR LIMIT GAUGE WITH MOTION METERS */}
        {/* ========================================================= */}
        {activeTab === "governor" && (
          <div className="space-y-6">
            
            <div className="p-6 rounded-2xl bg-gradient-to-b from-[#161616] to-[#0E0E0E] border border-[#262626] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-[#AAAAAA] font-bold">
                    Interactive Batch Transaction Controller
                  </div>
                  <h3 className="text-lg font-bold text-white mt-0.5">
                    Records in Current Transaction Batch: <span className="font-mono text-white">{batchCount}</span>
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      sound.playSuccess();
                      setIsBulkified(true);
                    }}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
                      isBulkified
                        ? "bg-white text-black"
                        : "bg-[#1E1E1E] text-[#888888] hover:text-white"
                    }`}
                  >
                    ✓ Bulkified Pattern (Set + Map)
                  </button>
                  <button
                    onClick={() => {
                      sound.playWarning();
                      setIsBulkified(false);
                    }}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
                      !isBulkified
                        ? "bg-[#331111] text-rose-300 border border-rose-500/40"
                        : "bg-[#1E1E1E] text-[#888888] hover:text-white"
                    }`}
                  >
                    ⚠ Anti-Pattern (SOQL in Loop)
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <input
                  type="range"
                  min="1"
                  max="200"
                  value={batchCount}
                  onChange={(e) => setBatchCount(parseInt(e.target.value))}
                  className="w-full h-2 bg-[#1C1C1C] rounded-lg appearance-none cursor-pointer accent-white"
                />
                <div className="flex justify-between text-[11px] font-mono text-[#666666] mt-1">
                  <span>1 Record</span>
                  <span>100 Records (SOQL Threshold)</span>
                  <span>200 Records (Standard Trigger Batch)</span>
                </div>
              </div>

              {soqlBreached || dmlBreached ? (
                <div className="p-3.5 rounded-xl bg-[#201010] border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 animate-bounce" />
                  <div>
                    <span className="font-bold">CRITICAL EXCEPTION: System.LimitException: Too many SOQL queries: 101</span>
                    <p className="text-[11px] text-rose-400/90 mt-0.5">
                      The transaction crashed and rolled back! A SOQL query was placed inside a for-loop. Switch to &ldquo;Bulkified Pattern&rdquo; to fix.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-[#101C12] border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <div>
                    <span className="font-bold">Governor Limits 100% Safe: Zero SOQL or DML inside loops.</span>
                    <p className="text-[11px] text-emerald-400/90 mt-0.5">
                      Batch of {batchCount} records processes in a single bulk query and single bulk DML statement.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="p-4 rounded-xl bg-[#141414] border border-[#242424]">
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-[#888888]">SOQL Queries</span>
                  <span className={soqlBreached ? "text-rose-400 font-bold" : "text-white"}>
                    {currentSoql} / 100
                  </span>
                </div>
                <div className="w-full bg-[#1C1C1C] h-2 rounded-full overflow-hidden">
                  <motion.div
                    animate={{ width: `${Math.min((currentSoql / maxSoql) * 100, 100)}%` }}
                    transition={{ duration: 0.3 }}
                    className={`h-full rounded-full ${soqlBreached ? "bg-rose-500" : "bg-white"}`}
                  />
                </div>
                <div className="text-[10px] text-[#666666] font-mono mt-2">
                  Limit: 100 queries
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#141414] border border-[#242424]">
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-[#888888]">DML Statements</span>
                  <span className={dmlBreached ? "text-rose-400 font-bold" : "text-white"}>
                    {currentDml} / 150
                  </span>
                </div>
                <div className="w-full bg-[#1C1C1C] h-2 rounded-full overflow-hidden">
                  <motion.div
                    animate={{ width: `${Math.min((currentDml / maxDml) * 100, 100)}%` }}
                    transition={{ duration: 0.3 }}
                    className={`h-full rounded-full ${dmlBreached ? "bg-rose-500" : "bg-white"}`}
                  />
                </div>
                <div className="text-[10px] text-[#666666] font-mono mt-2">
                  Limit: 150 statements
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#141414] border border-[#242424]">
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-[#888888]">CPU Time</span>
                  <span className={cpuBreached ? "text-rose-400 font-bold" : "text-white"}>
                    {currentCpu} ms / 10,000 ms
                  </span>
                </div>
                <div className="w-full bg-[#1C1C1C] h-2 rounded-full overflow-hidden">
                  <motion.div
                    animate={{ width: `${Math.min((currentCpu / 10000) * 100, 100)}%` }}
                    transition={{ duration: 0.3 }}
                    className={`h-full rounded-full ${cpuBreached ? "bg-rose-500" : "bg-white"}`}
                  />
                </div>
                <div className="text-[10px] text-[#666666] font-mono mt-2">
                  Limit: 10,000 ms
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#141414] border border-[#242424]">
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-[#888888]">Heap Size</span>
                  <span className="text-white">
                    {currentHeap} KB / 6,000 KB
                  </span>
                </div>
                <div className="w-full bg-[#1C1C1C] h-2 rounded-full overflow-hidden">
                  <motion.div
                    animate={{ width: `${Math.min((currentHeap / 6000) * 100, 100)}%` }}
                    transition={{ duration: 0.3 }}
                    className="h-full rounded-full bg-white"
                  />
                </div>
                <div className="text-[10px] text-[#666666] font-mono mt-2">
                  Limit: 6 MB
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: TOPIC 11 BULK PATTERN TRACER */}
        {/* ========================================================= */}
        {activeTab === "bulktracer" && (
          <div className="space-y-6">
            
            <div className="p-5 rounded-2xl bg-gradient-to-r from-[#1A1A1A] to-[#101010] border border-[#333333] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-mono text-white font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Active Milestone 11 Interactive Execution Tracer
                </div>
                <h3 className="text-lg font-bold text-white mt-1">
                  The Gold Standard: Set&lt;Id&gt; + Map&lt;Id, sObject&gt; Bulk Architecture
                </h3>
                <p className="text-xs text-[#888888] mt-1 max-w-2xl">
                  Step through the 4 phases that allow a 200-record Salesforce trigger batch to run with 
                  exactly 1 SOQL query and 1 DML statement, avoiding CPU timeouts and limit exceptions.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {[1, 2, 3, 4].map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      sound.playClick();
                      setBulkStep(s);
                    }}
                    className={`w-9 h-9 rounded-xl font-mono text-xs font-bold transition-colors ${
                      bulkStep === s
                        ? "bg-white text-black"
                        : "bg-[#1C1C1C] text-[#888888] hover:text-white"
                    }`}
                  >
                    0{s}
                  </button>
                ))}
              </div>
            </div>

            {(() => {
              const current = bulkSteps[bulkStep - 1];
              return (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left: Code Box */}
                  <div className="lg:col-span-7 rounded-2xl border border-[#262626] bg-[#0A0A0A] p-5 shadow-2xl">
                    <div className="flex items-center justify-between border-b border-[#222222] pb-3 mb-4 text-xs font-mono">
                      <span className="text-white font-bold">{current.title}</span>
                      <span className="px-2 py-0.5 rounded bg-[#1C1C1C] text-[#CCCCCC] text-[10px]">
                        {current.badge}
                      </span>
                    </div>

                    <pre className="font-mono text-xs text-[#E0E0E0] leading-relaxed overflow-x-auto p-4 rounded-xl bg-[#121212] border border-[#222222]">
                      <code>{current.code}</code>
                    </pre>

                    <div className="mt-4 flex items-center justify-between text-xs font-mono text-[#888888] pt-3 border-t border-[#222222]">
                      <span>Governor Limit Cost:</span>
                      <span className="text-emerald-400 font-bold">{current.limits}</span>
                    </div>
                  </div>

                  {/* Right: Explanation */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="p-5 rounded-2xl bg-[#121212] border border-[#242424]">
                      <div className="text-xs font-mono uppercase tracking-wider text-white font-bold mb-2">
                        Phase Breakdown
                      </div>
                      <p className="text-xs text-[#AAAAAA] leading-relaxed">
                        {current.explanation}
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-[#121212] border border-[#242424]">
                      <div className="text-xs font-mono uppercase tracking-wider text-white font-bold mb-2 flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        Cumulative Limit Scorecard
                      </div>
                      <div className="space-y-2 text-xs font-mono">
                        <div className="flex justify-between text-[#888888]">
                          <span>Total SOQL:</span>
                          <span className="text-white font-bold">{bulkStep >= 2 ? "1 / 100" : "0 / 100"}</span>
                        </div>
                        <div className="flex justify-between text-[#888888]">
                          <span>Total DML:</span>
                          <span className="text-white font-bold">{bulkStep >= 4 ? "1 / 150" : "0 / 150"}</span>
                        </div>
                        <div className="flex justify-between text-[#888888]">
                          <span>Time Complexity:</span>
                          <span className="text-emerald-400 font-bold">O(N) Linear (Zero O(N²) Nested Loops)</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {bulkStep < 4 ? (
                        <motion.button
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => {
                            sound.playClick();
                            setBulkStep((prev) => prev + 1);
                          }}
                          className="w-full py-2.5 rounded-xl bg-white hover:bg-[#E5E5E5] text-black font-mono text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-md"
                        >
                          Next Step (0{bulkStep + 1})
                          <ArrowRight className="w-3.5 h-3.5" />
                        </motion.button>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => {
                            sound.playSuccess();
                            setBulkStep(1);
                            confetti({ particleCount: 30, spread: 50 });
                          }}
                          className="w-full py-2.5 rounded-xl bg-[#222222] hover:bg-[#2C2C2C] text-white font-mono text-xs font-bold transition-colors flex items-center justify-center gap-2"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          Replay Tracer From Step 1
                        </motion.button>
                      )}
                    </div>
                  </div>

                </div>
              );
            })()}

          </div>
        )}

      </div>
    </section>
  );
};
