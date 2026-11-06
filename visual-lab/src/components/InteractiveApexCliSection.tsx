"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Terminal, Play, RotateCcw, Copy, Check, Sparkles, Cpu, Layers, ShieldCheck, Zap } from "lucide-react";
import { sound } from "@/lib/sound";

interface CodePreset {
  id: string;
  name: string;
  desc: string;
  code: string;
  logOutput: string[];
  metrics: { soql: number; dml: number; cpuMs: number; heapKb: number };
}

const presets: CodePreset[] = [
  {
    id: "preset-bulk-dml",
    name: "Partial Bulk DML Engine",
    desc: "Executes Database.insert with allOrNone=false and inspects SaveResult[]",
    code: `List<Case> testCases = new List<Case>();
testCases.add(new Case(Subject = 'Valid SLA Case', Priority = 'High', Complaint_Category__c = 'Cloud Downtime'));
testCases.add(new Case(Subject = 'Invalid Ticket', Status = 'Closed', Priority = 'High')); // Fails RCA Validation

Database.SaveResult[] srList = Database.insert(testCases, false);
for (Integer i = 0; i < srList.size(); i++) {
    if (srList[i].isSuccess()) {
        System.debug('RECORD [' + i + '] COMMITTED ID: ' + srList[i].getId());
    } else {
        System.debug('RECORD [' + i + '] FAILED: ' + srList[i].getErrors()[0].getMessage());
    }
}`,
    logOutput: [
      "[09:42:15.012] USER_DEBUG|[3]|DEBUG|Executing Database.insert(2 records, allOrNone=false)...",
      "[09:42:15.028] DML_BEGIN|[3]|Op:Insert|Type:Case|Rows:2",
      "[09:42:15.045] VALIDATION_RULE|[Row 2]|Rule:Require_RCA_On_High_Priority_Close|RESULT:FAILED",
      "[09:42:15.052] DML_END|[3]|Success:1|Failed:1",
      "[09:42:15.060] USER_DEBUG|[6]|DEBUG|RECORD [0] COMMITTED ID: 5005g00000CaS1AA",
      "[09:42:15.068] USER_DEBUG|[8]|DEBUG|RECORD [1] FAILED: High-priority closed complaints require a Root Cause Summary.",
      "[09:42:15.074] CUMULATIVE_LIMIT_USAGE|SOQL: 0/100 | DML: 1/150 | CPU: 38ms | Heap: 142KB",
    ],
    metrics: { soql: 0, dml: 1, cpuMs: 38, heapKb: 142 },
  },
  {
    id: "preset-trigger-sla",
    name: "ComplaintService SLA Engine",
    desc: "Evaluates CATEGORY_SLA_MAP hash lookup in O(1) time",
    code: `List<Case> incoming = new List<Case>{
    new Case(Subject = 'Server Outage', Complaint_Category__c = 'Cloud Downtime'),
    new Case(Subject = 'Router Defect', Complaint_Category__c = 'Hardware Failure')
};

ComplaintService.applySlaTargets(incoming);
for (Case c : incoming) {
    System.debug(c.Complaint_Category__c + ' ==> Resolution SLA: ' + c.Resolution_SLA_Hours__c + ' Hours');
}`,
    logOutput: [
      "[09:43:02.104] CODE_UNIT_STARTED|[EXTERNAL]|ComplaintService.applySlaTargets(2 records)",
      "[09:43:02.112] MAP_LOOKUP|Key:'Cloud Downtime'|HashResult:2 Hours (O(1) Instant)",
      "[09:43:02.118] MAP_LOOKUP|Key:'Hardware Failure'|HashResult:4 Hours (O(1) Instant)",
      "[09:43:02.125] USER_DEBUG|[8]|DEBUG|Cloud Downtime ==> Resolution SLA: 2 Hours",
      "[09:43:02.131] USER_DEBUG|[8]|DEBUG|Hardware Failure ==> Resolution SLA: 4 Hours",
      "[09:43:02.138] CUMULATIVE_LIMIT_USAGE|SOQL: 0/100 | DML: 0/150 | CPU: 18ms | Heap: 98KB",
    ],
    metrics: { soql: 0, dml: 0, cpuMs: 18, heapKb: 98 },
  },
  {
    id: "preset-map-lookup",
    name: "Set + Map 200-Batch Benchmark",
    desc: "Simulates 200 records matched without nested loops in 24 milliseconds",
    code: `Set<Id> accIds = new Set<Id>();
Map<Id, Account> accMap = new Map<Id, Account>();
// Single Bulk SOQL
for (Account a : [SELECT Id, Name FROM Account LIMIT 200]) {
    accMap.put(a.Id, a);
}

System.debug('Total In-Memory Map Keys Allocated: ' + accMap.size());
System.debug('Query Cost: Exactly 1 SOQL statement for 200 accounts.');`,
    logOutput: [
      "[09:44:10.002] SOQL_EXECUTE_BEGIN|[4]|Aggregations:0|SELECT Id, Name FROM Account LIMIT 200",
      "[09:44:10.021] SOQL_EXECUTE_END|[4]|Rows:200",
      "[09:44:10.034] USER_DEBUG|[7]|DEBUG|Total In-Memory Map Keys Allocated: 200",
      "[09:44:10.040] USER_DEBUG|[8]|DEBUG|Query Cost: Exactly 1 SOQL statement for 200 accounts.",
      "[09:44:10.048] CUMULATIVE_LIMIT_USAGE|SOQL: 1/100 | DML: 0/150 | CPU: 24ms | Heap: 312KB",
    ],
    metrics: { soql: 1, dml: 0, cpuMs: 24, heapKb: 312 },
  },
];

export const InteractiveApexCliSection: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<CodePreset>(presets[0]);
  const [codeBuffer, setCodeBuffer] = useState<string>(presets[0].code);
  const [running, setRunning] = useState<boolean>(false);
  const [activeLogs, setActiveLogs] = useState<string[]>(presets[0].logOutput);
  const [telemetry, setTelemetry] = useState(presets[0].metrics);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleSelectPreset = (preset: CodePreset) => {
    sound.playClick();
    setSelectedPreset(preset);
    setCodeBuffer(preset.code);
    setActiveLogs(preset.logOutput);
    setTelemetry(preset.metrics);
  };

  const handleRunApex = () => {
    sound.playClick();
    setRunning(true);
    setActiveLogs([
      `[T+0ms] SFDX CLI Handshake: sf apex run --target-org developer-scratch-org`,
      `[T+5ms] Compiling Apex anonymous buffer in runtime container...`,
      `[T+15ms] Execution started with transaction isolation...`,
    ]);

    setTimeout(() => {
      setActiveLogs(selectedPreset.logOutput);
      setRunning(false);
      sound.playSuccess();
    }, 650);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(codeBuffer);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <section id="apex-cli" className="py-24 border-b border-cyan-500/20 bg-[#030712] relative overflow-hidden">
      {/* Background Cyber Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-[#0176D3]/15 via-[#00F0FF]/10 to-indigo-600/10 blur-[130px] pointer-events-none -z-10 rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono text-cyan-300 mb-3 shadow-neon-cyan">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              Live Interactive REPL & CLI Engine
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Apex Anonymous Execution Studio
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl">
              Write, edit, and execute real Apex code in a simulated Salesforce runtime container. 
              Inspect real debug log streams, log-level timestamps, and live Governor Limit telemetry.
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex items-center gap-2">
            <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-900 border border-cyan-500/40 text-cyan-300 shadow-neon-cyan flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              SFDX CLI Connected (v2.85.0)
            </span>
          </div>
        </div>

        {/* Preset Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {presets.map((preset) => {
            const isSelected = preset.id === selectedPreset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`p-3.5 rounded-xl text-left border transition-all ${
                  isSelected
                    ? "bg-gradient-to-r from-cyan-950/70 via-slate-900 to-blue-950/60 border-cyan-400 shadow-neon-cyan text-white ring-1 ring-cyan-400/50"
                    : "bg-slate-900/60 hover:bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <span className={isSelected ? "text-cyan-300 font-bold" : "text-slate-400"}>
                    {preset.name}
                  </span>
                  <Zap className={`w-3.5 h-3.5 ${isSelected ? "text-cyan-400" : "text-slate-600"}`} />
                </div>
                <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                  {preset.desc}
                </div>
              </button>
            );
          })}
        </div>

        {/* 2-Column Terminal Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Code Editor Console */}
          <div className="lg:col-span-6 rounded-2xl border border-cyan-500/30 bg-[#060b18] shadow-2xl overflow-hidden flex flex-col justify-between">
            <div>
              {/* Terminal Window Header */}
              <div className="p-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-xs font-mono text-cyan-300 font-semibold flex items-center gap-1.5 ml-2">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    sf apex run --anonymous
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 border border-slate-700 transition-all"
                  >
                    {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCode ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              </div>

              {/* Code Textarea Buffer */}
              <div className="p-4 font-mono text-xs">
                <textarea
                  value={codeBuffer}
                  onChange={(e) => setCodeBuffer(e.target.value)}
                  rows={13}
                  className="w-full bg-transparent text-cyan-100 font-mono text-xs leading-relaxed focus:outline-none resize-none selection:bg-cyan-500/40"
                  spellCheck={false}
                />
              </div>
            </div>

            {/* Run Button Footer */}
            <div className="p-3.5 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400">
                Shift + Enter or click Execute
              </span>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRunApex}
                disabled={running}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-[#0176D3] text-slate-950 font-bold font-mono text-xs shadow-neon-cyan hover:brightness-110 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <Play className={`w-3.5 h-3.5 ${running ? "animate-spin" : ""}`} />
                {running ? "Executing..." : "Execute Apex Code"}
              </motion.button>
            </div>
          </div>

          {/* Right Column: Real-time Debug Logs & Live Telemetry HUD */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Telemetry HUD Cards */}
            <div className="grid grid-cols-4 gap-2.5">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-cyan-500/20 text-center">
                <div className="text-[10px] font-mono text-slate-400">SOQL USED</div>
                <div className="text-lg font-black text-cyan-300 font-mono mt-0.5">{telemetry.soql} / 100</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-blue-500/20 text-center">
                <div className="text-[10px] font-mono text-slate-400">DML STATEMENTS</div>
                <div className="text-lg font-black text-sky-300 font-mono mt-0.5">{telemetry.dml} / 150</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-amber-500/20 text-center">
                <div className="text-[10px] font-mono text-slate-400">CPU TIME</div>
                <div className="text-lg font-black text-amber-300 font-mono mt-0.5">{telemetry.cpuMs} ms</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-emerald-500/20 text-center">
                <div className="text-[10px] font-mono text-slate-400">HEAP USAGE</div>
                <div className="text-lg font-black text-emerald-400 font-mono mt-0.5">{telemetry.heapKb} KB</div>
              </div>
            </div>

            {/* Live Terminal Log Stream */}
            <div className="rounded-2xl border border-cyan-500/30 bg-[#02050f] p-4 shadow-2xl font-mono text-xs">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800 text-slate-400">
                <span className="flex items-center gap-2 text-cyan-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  Salesforce Runtime Log Stream (v61.0)
                </span>
                <span className="text-[10px] text-slate-500">USER_DEBUG Filtered</span>
              </div>

              <div className="space-y-1.5 max-h-[340px] overflow-y-auto pr-1">
                {activeLogs.map((log, lIdx) => (
                  <div
                    key={lIdx}
                    className={`leading-relaxed text-[11px] ${
                      log.includes("COMMITTED") || log.includes("Success:1")
                        ? "text-emerald-400 font-semibold"
                        : log.includes("FAILED") || log.includes("Validation")
                        ? "text-rose-400 font-semibold"
                        : log.includes("MAP_LOOKUP") || log.includes("SOQL_EXECUTE")
                        ? "text-cyan-300"
                        : log.includes("CUMULATIVE")
                        ? "text-amber-300 font-bold pt-2 border-t border-slate-800/80"
                        : "text-slate-300"
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
