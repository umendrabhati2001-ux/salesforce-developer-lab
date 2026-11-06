"use client";

import React, { useState } from "react";
import { BookOpen, Table, Layers, ArrowUpRight, Check, Copy } from "lucide-react";

export const CheatSheetSection: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const limitsComparison = [
    {
      metric: "Total SOQL Queries",
      sync: "100",
      async: "200",
      boost: "2x Boost",
      notes: "Queries in loops exhaust limits immediately.",
    },
    {
      metric: "Total DML Statements",
      sync: "150",
      async: "150",
      boost: "Same",
      notes: "Single bulk list insert/update counts as 1 DML.",
    },
    {
      metric: "Total Records Retrieved (SOQL)",
      sync: "50,000",
      async: "50,000",
      boost: "Same",
      notes: "Use SOQL for-loops or Batch Apex for >50k records.",
    },
    {
      metric: "Maximum CPU Time",
      sync: "10,000 ms (10s)",
      async: "60,000 ms (60s)",
      boost: "6x Boost",
      notes: "Database and SOQL time do not count toward CPU.",
    },
    {
      metric: "Maximum Heap Size",
      sync: "6 MB",
      async: "12 MB",
      boost: "2x Boost",
      notes: "Heap stores all in-memory variables and sObjects.",
    },
    {
      metric: "Web Service Callouts",
      sync: "100",
      async: "100",
      boost: "Same",
      notes: "Callouts must run in @future(callout=true) or Queueable.",
    },
  ];

  const handleCopyText = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <section id="cheatsheet" className="py-24 border-b border-[#222222] bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#171717] border border-[#2B2B2B] text-xs font-mono text-[#CCCCCC] mb-3">
              <Table className="w-3.5 h-3.5 text-[#AAAAAA]" />
              Quick Reference Architecture Matrix
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Governor Limits & Relationship Matrix
            </h2>
            <p className="text-[#888888] text-sm sm:text-base mt-2 max-w-2xl">
              Essential architectural reference comparing Synchronous vs Asynchronous transactions 
              and SOQL relationship traversal rules.
            </p>
          </div>
        </div>

        {/* Matrix Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Limits Table */}
          <div className="lg:col-span-7 rounded-2xl border border-[#262626] bg-[#101010] p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#222222] mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Synchronous vs Asynchronous Limits</span>
              </h3>
              <span className="text-xs font-mono text-[#888888]">
                Salesforce Multi-tenant Spec
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-[#222222] text-[#888888]">
                    <th className="pb-3 font-semibold">Governor Limit Metric</th>
                    <th className="pb-3 font-semibold text-white">Sync</th>
                    <th className="pb-3 font-semibold text-emerald-400">Async</th>
                    <th className="pb-3 font-semibold text-right">Advantage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1C1C1C]">
                  {limitsComparison.map((row, idx) => (
                    <tr key={idx} className="hover:bg-[#141414] transition-colors">
                      <td className="py-3 text-white font-medium">
                        {row.metric}
                        <div className="text-[10px] text-[#666666] font-normal mt-0.5">
                          {row.notes}
                        </div>
                      </td>
                      <td className="py-3 text-[#CCCCCC]">{row.sync}</td>
                      <td className="py-3 text-emerald-400 font-bold">{row.async}</td>
                      <td className="py-3 text-right">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#1C1C1C] text-white border border-[#2B2B2B]">
                          {row.boost}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column: SOQL Relationship Rules Cards */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Rule 1: Child-to-Parent */}
            <div className="p-5 rounded-2xl bg-[#121212] border border-[#242424]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                  Child-to-Parent Queries (Dot Notation)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1C1C1C] text-white">
                  Up to 5 Levels
                </span>
              </div>
              <p className="text-xs text-[#AAAAAA] leading-relaxed mb-3">
                Traverse upward from child to parent object using dot notation. For custom relationships, replace <code className="text-white">__c</code> with <code className="text-white">__r</code>.
              </p>
              <div className="p-3 rounded-xl bg-[#0A0A0A] border border-[#1E1E1E] font-mono text-xs flex items-center justify-between">
                <code className="text-[#CCCCCC] text-[11px]">
                  Contact.Account.Parent.Owner.Name
                </code>
                <button
                  onClick={() => handleCopyText("SELECT Id, Contact.Account.Parent.Owner.Name FROM Contact", 1)}
                  className="text-[#666666] hover:text-white transition-colors"
                >
                  {copiedIndex === 1 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Rule 2: Parent-to-Child */}
            <div className="p-5 rounded-2xl bg-[#121212] border border-[#242424]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                  Parent-to-Child Queries (Subqueries)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1C1C1C] text-white">
                  1 Level Down
                </span>
              </div>
              <p className="text-xs text-[#AAAAAA] leading-relaxed mb-3">
                Query child records inside a parent query using subquery syntax. Custom child relationships use the plural Child Relationship Name with <code className="text-white">__r</code>.
              </p>
              <div className="p-3 rounded-xl bg-[#0A0A0A] border border-[#1E1E1E] font-mono text-xs flex items-center justify-between">
                <code className="text-[#CCCCCC] text-[11px]">
                  (SELECT LastName, Email FROM Contacts)
                </code>
                <button
                  onClick={() => handleCopyText("SELECT Name, (SELECT LastName FROM Contacts), (SELECT CaseNumber FROM Cases) FROM Account", 2)}
                  className="text-[#666666] hover:text-white transition-colors"
                >
                  {copiedIndex === 2 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Rule 3: Sharing Keywords */}
            <div className="p-5 rounded-2xl bg-[#121212] border border-[#242424]">
              <span className="text-xs font-mono uppercase tracking-wider text-white font-bold block mb-2">
                Apex Sharing Keyword Rules
              </span>
              <div className="space-y-1.5 text-xs text-[#AAAAAA]">
                <div>&bull; <strong className="text-white">with sharing:</strong> Enforces user record-level sharing & OWD.</div>
                <div>&bull; <strong className="text-white">without sharing:</strong> Executes in System Mode (bypasses sharing).</div>
                <div>&bull; <strong className="text-white">inherited sharing:</strong> Dynamically inherits caller sharing model.</div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
