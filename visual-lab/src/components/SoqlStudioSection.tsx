"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Database, Play, Copy, Check, Sparkles, Filter, Code2, Layers, CheckSquare, Square } from "lucide-react";
import { sound } from "@/lib/sound";

export const SoqlStudioSection: React.FC = () => {
  const [selectedParent, setSelectedParent] = useState<"Account" | "Case">("Account");
  const [includeContacts, setIncludeContacts] = useState(true);
  const [includeCases, setIncludeCases] = useState(true);
  const [filterClause, setFilterClause] = useState("WHERE Industry = 'Technology'");
  const [limitCount, setLimitCount] = useState(5);
  const [executing, setExecuting] = useState(false);
  const [showJsonResult, setShowJsonResult] = useState(true);
  const [copiedQuery, setCopiedQuery] = useState(false);

  // Dynamic SOQL query construction
  const generatedQuery =
    selectedParent === "Account"
      ? `SELECT Id, Name, Industry, AnnualRevenue${
          includeContacts ? ",\n    (SELECT Id, FirstName, LastName, Email FROM Contacts)" : ""
        }${
          includeCases ? ",\n    (SELECT Id, CaseNumber, Priority, Status FROM Cases)" : ""
        }\nFROM Account\n${filterClause ? filterClause + "\n" : ""}ORDER BY CreatedDate DESC\nLIMIT ${limitCount}`
      : `SELECT Id, CaseNumber, Subject, Priority, Status, Complaint_Category__c,\n    Account.Id, Account.Name, Account.Industry\nFROM Case\n${filterClause ? filterClause + "\n" : ""}ORDER BY CreatedDate DESC\nLIMIT ${limitCount}`;

  // Mock JSON responses matching actual Apex return format
  const mockAccountResult = [
    {
      attributes: { type: "Account", url: "/services/data/v61.0/sobjects/Account/0015g00000XyZ1AA" },
      Id: "0015g00000XyZ1AA",
      Name: "NexGen Cloud Systems",
      Industry: "Technology",
      AnnualRevenue: 45000000,
      ...(includeContacts && {
        Contacts: {
          totalSize: 2,
          done: true,
          records: [
            { Id: "0035g00000AbC1AA", FirstName: "Sarah", LastName: "Connor", Email: "sconnor@nexgen.io" },
            { Id: "0035g00000AbC2AA", FirstName: "Alex", LastName: "Chen", Email: "achen@nexgen.io" },
          ],
        },
      }),
      ...(includeCases && {
        Cases: {
          totalSize: 2,
          done: true,
          records: [
            { Id: "5005g00000CaS1AA", CaseNumber: "00001024", Priority: "Critical", Status: "New" },
            { Id: "5005g00000CaS2AA", CaseNumber: "00001025", Priority: "High", Status: "In Progress" },
          ],
        },
      }),
    },
    {
      attributes: { type: "Account", url: "/services/data/v61.0/sobjects/Account/0015g00000XyZ2AA" },
      Id: "0015g00000XyZ2AA",
      Name: "Acme Logistics Global",
      Industry: "Logistics",
      AnnualRevenue: 120000000,
      ...(includeContacts && {
        Contacts: {
          totalSize: 1,
          done: true,
          records: [
            { Id: "0035g00000AbC3AA", FirstName: "Elena", LastName: "Rostova", Email: "elena@acmelogistics.com" },
          ],
        },
      }),
      ...(includeCases && {
        Cases: {
          totalSize: 1,
          done: true,
          records: [
            { Id: "5005g00000CaS3AA", CaseNumber: "00001026", Priority: "High", Status: "Closed" },
          ],
        },
      }),
    },
  ];

  const mockCaseResult = [
    {
      attributes: { type: "Case", url: "/services/data/v61.0/sobjects/Case/5005g00000CaS1AA" },
      Id: "5005g00000CaS1AA",
      CaseNumber: "00001024",
      Subject: "Cloud API Downtime on Primary Region",
      Priority: "Critical",
      Status: "New",
      Complaint_Category__c: "Cloud Downtime",
      Account: {
        attributes: { type: "Account", url: "/services/data/v61.0/sobjects/Account/0015g00000XyZ1AA" },
        Id: "0015g00000XyZ1AA",
        Name: "NexGen Cloud Systems",
        Industry: "Technology",
      },
    },
    {
      attributes: { type: "Case", url: "/services/data/v61.0/sobjects/Case/5005g00000CaS2AA" },
      Id: "5005g00000CaS2AA",
      CaseNumber: "00001025",
      Subject: "Database Latency Spike above 800ms",
      Priority: "High",
      Status: "In Progress",
      Complaint_Category__c: "Network Latency",
      Account: {
        attributes: { type: "Account", url: "/services/data/v61.0/sobjects/Account/0015g00000XyZ2AA" },
        Id: "0015g00000XyZ2AA",
        Name: "Acme Logistics Global",
        Industry: "Logistics",
      },
    },
  ];

  const runMockQuery = () => {
    sound.playClick();
    setExecuting(true);
    setTimeout(() => {
      setExecuting(false);
      setShowJsonResult(true);
      sound.playSuccess();
    }, 450);
  };

  const copyQueryToClipboard = () => {
    navigator.clipboard.writeText(generatedQuery);
    setCopiedQuery(true);
    setTimeout(() => setCopiedQuery(false), 2000);
  };

  return (
    <section id="soql-studio" className="py-24 border-b border-[#222222] bg-[#080808]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#171717] border border-[#2B2B2B] text-xs font-mono text-[#CCCCCC] mb-3">
              <Database className="w-3.5 h-3.5 text-[#AAAAAA]" />
              Interactive Query Workbench
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              SOQL Studio & Relationship Explorer
            </h2>
            <p className="text-[#888888] text-sm sm:text-base mt-2 max-w-2xl">
              Construct dynamic parent-to-child subqueries and child-to-parent dot notation queries. 
              Simulate database execution and inspect the exact Apex sObject JSON payload.
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex items-center gap-2">
            <span className="text-xs font-mono px-3 py-1 rounded-lg bg-[#141414] border border-[#262626] text-emerald-400">
              1 SOQL Governor Limit Query Consumed
            </span>
          </div>
        </div>

        {/* Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Query Configurator */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Object Selection */}
            <div className="p-5 rounded-2xl bg-[#121212] border border-[#262626] space-y-4">
              <div className="text-xs font-mono uppercase tracking-wider text-white font-bold flex items-center gap-2">
                <Layers className="w-4 h-4 text-white" />
                1. Target Primary sObject
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    sound.playClick();
                    setSelectedParent("Account");
                  }}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    selectedParent === "Account"
                      ? "bg-gradient-to-r from-[#222222] to-[#161616] border-white text-white shadow-md"
                      : "bg-[#0E0E0E] border-[#222222] text-[#888888] hover:text-white"
                  }`}
                >
                  <div className="text-xs font-bold font-mono">Account</div>
                  <div className="text-[10px] text-[#666666] mt-0.5">Parent Object (Subqueries)</div>
                </button>
                <button
                  onClick={() => {
                    sound.playClick();
                    setSelectedParent("Case");
                  }}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    selectedParent === "Case"
                      ? "bg-gradient-to-r from-[#222222] to-[#161616] border-white text-white shadow-md"
                      : "bg-[#0E0E0E] border-[#222222] text-[#888888] hover:text-white"
                  }`}
                >
                  <div className="text-xs font-bold font-mono">Case</div>
                  <div className="text-[10px] text-[#666666] mt-0.5">Child Object (Dot Notation)</div>
                </button>
              </div>

              {/* Relationship Toggles */}
              {selectedParent === "Account" && (
                <div className="pt-3 border-t border-[#1F1F1F] space-y-2">
                  <div className="text-xs font-mono text-[#888888]">Include Child Subqueries (1 Level Down):</div>
                  <div className="space-y-1.5">
                    <button
                      onClick={() => setIncludeContacts((prev) => !prev)}
                      className="w-full p-2.5 rounded-lg bg-[#0E0E0E] border border-[#202020] text-xs font-mono flex items-center justify-between text-left text-white"
                    >
                      <span className="flex items-center gap-2">
                        {includeContacts ? (
                          <CheckSquare className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Square className="w-4 h-4 text-[#555555]" />
                        )}
                        (SELECT Id, LastName FROM Contacts)
                      </span>
                      <span className="text-[10px] text-[#666666]">Contacts</span>
                    </button>

                    <button
                      onClick={() => setIncludeCases((prev) => !prev)}
                      className="w-full p-2.5 rounded-lg bg-[#0E0E0E] border border-[#202020] text-xs font-mono flex items-center justify-between text-left text-white"
                    >
                      <span className="flex items-center gap-2">
                        {includeCases ? (
                          <CheckSquare className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Square className="w-4 h-4 text-[#555555]" />
                        )}
                        (SELECT Id, Priority, Status FROM Cases)
                      </span>
                      <span className="text-[10px] text-[#666666]">Cases</span>
                    </button>
                  </div>
                </div>
              )}

              {selectedParent === "Case" && (
                <div className="pt-3 border-t border-[#1F1F1F]">
                  <div className="text-xs font-mono text-[#888888] mb-1.5">Child-to-Parent Traversal:</div>
                  <div className="p-2.5 rounded-lg bg-[#0E0E0E] border border-[#202020] text-xs font-mono text-emerald-400">
                    Account.Id, Account.Name, Account.Industry (Up to 5 Levels)
                  </div>
                </div>
              )}

              {/* Filters */}
              <div className="pt-3 border-t border-[#1F1F1F] space-y-2">
                <div className="text-xs font-mono text-[#888888]">Filter & Limit:</div>
                <input
                  type="text"
                  value={filterClause}
                  onChange={(e) => setFilterClause(e.target.value)}
                  placeholder="WHERE clause..."
                  className="w-full bg-[#0E0E0E] border border-[#202020] text-white font-mono text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-[#555555]"
                />
              </div>

              {/* Execute Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={runMockQuery}
                disabled={executing}
                className="w-full py-2.5 rounded-xl bg-white text-black font-mono text-xs font-bold hover:bg-[#E5E5E5] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                <Play className={`w-3.5 h-3.5 ${executing ? "animate-spin" : ""}`} />
                {executing ? "Querying Database..." : "Execute SOQL Query"}
              </motion.button>
            </div>

          </div>

          {/* Right Column: Generated SOQL & Mock Apex JSON Response */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* SOQL Syntax Window */}
            <div className="rounded-2xl border border-[#262626] bg-[#0D0D0D] p-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#222222] pb-3 mb-3 text-xs font-mono">
                <span className="text-white font-bold flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-white" />
                  Generated SOQL Query
                </span>
                <button
                  onClick={copyQueryToClipboard}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1C1C1C] hover:bg-[#282828] text-[#CCCCCC] transition-colors"
                >
                  {copiedQuery ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy SOQL</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-[#080808] border border-[#1E1E1E] text-xs font-mono text-[#D4D4D4] leading-relaxed overflow-x-auto">
                <code>{generatedQuery}</code>
              </pre>
            </div>

            {/* Mock JSON Response Window */}
            <div className="rounded-2xl border border-[#262626] bg-[#0D0D0D] p-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#222222] pb-3 mb-3 text-xs font-mono">
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  Apex sObject Result Payload (Mock Execution)
                </span>
                <span className="text-[10px] text-[#666666]">
                  Response: 14ms &bull; 2 Records
                </span>
              </div>

              <pre className="p-4 rounded-xl bg-[#080808] border border-[#1E1E1E] text-xs font-mono text-[#888888] leading-relaxed overflow-x-auto max-h-[300px]">
                <code className="text-[#CCCCCC]">
                  {JSON.stringify(selectedParent === "Account" ? mockAccountResult : mockCaseResult, null, 2)}
                </code>
              </pre>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
