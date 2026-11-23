"use client";

import React, { useState } from "react";
import { Calculator, ShieldCheck, DollarSign, Zap, TrendingDown, ArrowRight, AlertTriangle, CheckCircle2 } from "lucide-react";

export const EnterpriseCostCalculator: React.FC = () => {
  const [caseVolume, setCaseVolume] = useState<number>(25000);
  const [outagesPerQuarter, setOutagesPerQuarter] = useState<number>(6);
  const [hourlyDevRate, setHourlyDevRate] = useState<number>(125);

  // Business metrics:
  // Average engineer debugging & patch hours per governor-limit outage: ~12 hours
  // Business downtime/lost rep productivity per incident: ~$1,800
  const avgResolutionHours = 12;
  const productivityLossPerIncident = 1800;

  const annualOutages = outagesPerQuarter * 4;
  const annualDevFixCost = annualOutages * avgResolutionHours * hourlyDevRate;
  const annualDowntimeLoss = annualOutages * productivityLossPerIncident;
  const totalAnnualCost = annualDevFixCost + annualDowntimeLoss;

  // With Umendra's architecture (0 SOQL in loops, 100% unit tests, recursive prevention):
  const protectedCost = 0;
  const netSavings = totalAnnualCost;

  return (
    <section className="mt-12 mb-8 p-6 sm:p-8 rounded-2xl bg-[#070d1e] border border-cyan-500/20 shadow-[0_0_50px_rgba(2,132,199,0.1)] relative overflow-hidden">
      {/* Background Neon Grid / Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-6 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold flex items-center gap-1.5">
              <Calculator className="w-3.5 h-3.5" />
              <span>ENTERPRISE ROI CALCULATOR</span>
            </span>
            <span className="text-slate-400 text-xs font-mono hidden sm:inline">• Live Multi-Tenant Cost Analysis</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">
            Calculate Technical Debt &amp; Governor Limit Downtime Cost
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl font-sans">
            Estimate how much un-bulkified triggers (SOQL in loops) cost your organization in debugging hours, emergency hotfixes, and lost sales rep productivity.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Zero-SOQL Architecture: 100% Safe</span>
        </div>
      </div>

      {/* Main Grid: Inputs vs Real-time Output */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Slider 1: Monthly Transaction Volume */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/[0.06]">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-mono text-slate-300 font-semibold flex items-center gap-2">
                <span>Monthly Transaction Volume (Cases / Leads)</span>
              </label>
              <span className="text-sm font-mono font-bold text-cyan-400">
                {caseVolume.toLocaleString()} records/mo
              </span>
            </div>
            <input
              type="range"
              min={5000}
              max={250000}
              step={5000}
              value={caseVolume}
              onChange={(e) => setCaseVolume(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1.5">
              <span>5k (Startup)</span>
              <span>100k (Mid-Market)</span>
              <span>250k+ (High Volume)</span>
            </div>
          </div>

          {/* Slider 2: Estimated Limit Incidents / Quarter */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/[0.06]">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-mono text-slate-300 font-semibold flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Governor Limit Exceptions &amp; Lockups (Per Quarter)</span>
              </label>
              <span className="text-sm font-mono font-bold text-amber-400">
                {outagesPerQuarter} incidents / qtr
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={25}
              step={1}
              value={outagesPerQuarter}
              onChange={(e) => setOutagesPerQuarter(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1.5">
              <span>1 (Rare)</span>
              <span>12 (Monthly)</span>
              <span>25 (Critical Tech Debt)</span>
            </div>
          </div>

          {/* Slider 3: External Consultant / Debugging Hourly Rate */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/[0.06]">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-mono text-slate-300 font-semibold flex items-center gap-2">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span>Blended Engineering / Consultant Hourly Rate</span>
              </label>
              <span className="text-sm font-mono font-bold text-emerald-400">
                ${hourlyDevRate} / hour
              </span>
            </div>
            <input
              type="range"
              min={75}
              max={250}
              step={5}
              value={hourlyDevRate}
              onChange={(e) => setHourlyDevRate(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1.5">
              <span>$75/hr (Contractor)</span>
              <span>$150/hr (Senior Dev)</span>
              <span>$250/hr (Elite Partner)</span>
            </div>
          </div>
        </div>

        {/* Right Output Dashboard (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-white/[0.1] shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
              <span>Estimated Annual Loss</span>
              <span className="text-red-400 font-semibold flex items-center gap-1">
                <TrendingDown className="w-3.5 h-3.5" />
                Unoptimized Code
              </span>
            </div>

            <div className="text-3xl sm:text-4xl font-mono font-extrabold text-red-400 tracking-tight">
              ${totalAnnualCost.toLocaleString()}
              <span className="text-xs font-normal text-slate-400 ml-1">/ year</span>
            </div>

            <div className="mt-4 pt-4 border-t border-white/[0.08] space-y-2 text-xs font-mono text-slate-400">
              <div className="flex justify-between">
                <span>Emergency Hotfix Engineering:</span>
                <span className="text-slate-200">${annualDevFixCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Lost Rep Productivity &amp; Delays:</span>
                <span className="text-slate-200">${annualDowntimeLoss.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <div className="flex items-center gap-2 text-emerald-300 text-xs font-mono font-bold mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>With Umendra&apos;s Architecture:</span>
              </div>
              <p className="text-[11px] text-slate-300 font-sans">
                Bulkified service layer (`CaseTrigger` &rarr; `ComplaintService`) prevents 100% of recursive loops.
              </p>
              <div className="mt-2 text-xl font-mono font-bold text-emerald-400">
                Net Savings: ${netSavings.toLocaleString()} / yr
              </div>
            </div>
          </div>

          <div className="mt-6">
            <a
              href="mailto:umendrabhati2001@gmail.com?subject=Salesforce%20Architecture%20Audit%20Request%20-%20Umendra%20Bhati&body=Hi%20Umendra,%0A%0AWe%20calculated%20our%20Salesforce%20technical%20debt%20on%20your%20Live%20Studio%20calculator.%20We%20would%20like%20to%20hire%20you%20for%20a%20code%20audit/refactoring%20contract.%0A%0ABest%20regards"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all cursor-pointer active:scale-98"
            >
              <span>Eliminate Tech Debt — Hire Umendra</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <p className="text-center text-[10px] font-mono text-slate-500 mt-2">
              Available for Remote Contracts • Immediate Sprint Onboarding
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
