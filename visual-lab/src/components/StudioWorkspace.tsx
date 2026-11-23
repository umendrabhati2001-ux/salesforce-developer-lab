"use client";

import React, { useState } from "react";
import {
  Columns2,
  Maximize2,
  ExternalLink,
  Layers,
  CreditCard,
  Cpu,
  Calculator,
  Terminal,
  Sparkles
} from "lucide-react";
import { VisualizersSection } from "@/components/VisualizersSection";
import { StripeIntegrationPanel } from "@/components/StripeIntegrationPanel";
import { EnterpriseCostCalculator } from "@/components/EnterpriseCostCalculator";
import { playClickSound } from "@/lib/sound";

export type StudioViewMode = "split" | "proj1" | "proj2" | "calculator";

export const StudioWorkspace: React.FC = () => {
  const [viewMode, setViewMode] = useState<StudioViewMode>("split");

  const popOutWindow = () => {
    playClickSound();
    if (typeof window !== "undefined") {
      window.open(
        "/studio",
        "_blank",
        "width=1050,height=850,menubar=no,toolbar=no,location=no,status=no"
      );
    }
  };

  return (
    <div className="flex-1 w-full max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
      {/* Studio Workspace Multi-View Toolbar */}
      <div className="p-3 sm:p-4 rounded-2xl bg-[#060913]/90 border border-cyan-500/20 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 shadow-[0_0_30px_rgba(2,132,199,0.1)]">
        {/* Left: View Mode Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-mono">
          <button
            onClick={() => {
              playClickSound();
              setViewMode("split");
            }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === "split"
                ? "bg-gradient-to-r from-cyan-400 to-[#0176D3] text-slate-950 font-bold shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                : "text-slate-300 hover:text-white hover:bg-white/[0.05]"
            }`}
          >
            <Columns2 className="w-3.5 h-3.5" />
            <span>Dual Split View (Connected)</span>
            <span className="hidden sm:inline-block px-1.5 py-0.2 rounded bg-black/20 text-[9px]">
              RECOMMENDED
            </span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              setViewMode("proj1");
            }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === "proj1"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold"
                : "text-slate-400 hover:text-white hover:bg-white/[0.05]"
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>Project 1: Case &amp; SOQL</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              setViewMode("proj2");
            }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === "proj2"
                ? "bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold"
                : "text-slate-400 hover:text-white hover:bg-white/[0.05]"
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 text-blue-400" />
            <span>Project 2: Stripe REST</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              setViewMode("calculator");
            }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === "calculator"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold"
                : "text-slate-400 hover:text-white hover:bg-white/[0.05]"
            }`}
          >
            <Calculator className="w-3.5 h-3.5 text-emerald-400" />
            <span>Enterprise ROI</span>
          </button>
        </div>

        {/* Right: Pop-Out Side Window & Live Status */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Multi-Tenant Architecture Active</span>
          </div>

          <button
            onClick={popOutWindow}
            className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] hover:border-cyan-500/40 text-xs font-mono text-cyan-300 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-sm"
            title="Open side-by-side floating IDE window"
          >
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
            <span>Pop-Out Side Window ↗</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Render */}
      {viewMode === "split" && (
        <div className="flex flex-col gap-8">
          {/* Dual Split Screen Grid: Project 1 (Left) + Project 2 (Right) */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            {/* Left Pane: Project 1 (Case Complaint Architecture & SOQL Studio) */}
            <div className="xl:col-span-7 flex flex-col gap-4">
              <div className="flex items-center justify-between px-2 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-2 text-cyan-300 font-bold">
                  <span className="px-2 py-0.5 rounded bg-cyan-500/20 border border-cyan-500/30 text-[10px]">PANE 1</span>
                  Complaint &amp; SOQL Runtime Engine
                </span>
                <span className="text-[11px] text-slate-500 hidden sm:inline">0 SOQL in Loops • Bulkified</span>
              </div>
              <VisualizersSection initialTab="soql" standalone={true} />
            </div>

            {/* Right Pane: Project 2 (Stripe Payment & Webhook REST Gateway) */}
            <div className="xl:col-span-5 flex flex-col gap-4">
              <div className="flex items-center justify-between px-2 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-2 text-blue-300 font-bold">
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 border border-blue-500/30 text-[10px]">PANE 2</span>
                  Stripe Payment &amp; Refund REST Gateway
                </span>
                <span className="text-[11px] text-slate-500 hidden sm:inline">Queueable Callout • Inbound Webhook</span>
              </div>
              <StripeIntegrationPanel />
            </div>
          </div>

          {/* Connected ROI Calculator */}
          <EnterpriseCostCalculator />
        </div>
      )}

      {viewMode === "proj1" && (
        <div className="flex flex-col gap-6">
          <VisualizersSection initialTab="soql" standalone={true} />
        </div>
      )}

      {viewMode === "proj2" && (
        <div className="flex flex-col gap-6">
          <StripeIntegrationPanel />
        </div>
      )}

      {viewMode === "calculator" && (
        <div className="flex flex-col gap-6">
          <EnterpriseCostCalculator />
        </div>
      )}
    </div>
  );
};
