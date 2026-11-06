"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { GitBranch, Database, Layers, ArrowRight, ShieldCheck, Zap, Info, ChevronRight, Check } from "lucide-react";
import { sound } from "@/lib/sound";

interface SchemaNode {
  id: string;
  label: string;
  apiName: string;
  type: "Standard sObject" | "Custom sObject";
  description: string;
  fields: { name: string; type: string; desc: string }[];
  relationships: { target: string; type: string; field: string }[];
  validationRules?: string[];
  triggers?: string[];
}

const schemaNodes: SchemaNode[] = [
  {
    id: "account",
    label: "Account",
    apiName: "Account",
    type: "Standard sObject",
    description: "Enterprise client or customer holding multiple support complaints and SLA contracts.",
    fields: [
      { name: "Id", type: "Id (18-char)", desc: "Primary Key" },
      { name: "Name", type: "String(255)", desc: "Company or Organization Name" },
      { name: "Industry", type: "Picklist", desc: "Technology, Logistics, Banking" },
      { name: "AnnualRevenue", type: "Currency(18,0)", desc: "Client Annual Revenue" },
    ],
    relationships: [
      { target: "Case", type: "1-to-Many (Parent)", field: "Account.Cases" },
      { target: "Contact", type: "1-to-Many (Parent)", field: "Account.Contacts" },
    ],
  },
  {
    id: "case",
    label: "Case (Complaint Management)",
    apiName: "Case",
    type: "Standard sObject",
    description: "Core Customer Complaint ticket. Contains custom SLA tracking, category classification, and trigger routing.",
    fields: [
      { name: "CaseNumber", type: "AutoNumber", desc: "Auto-generated Ticket Number" },
      { name: "Subject", type: "String(255)", desc: "Summary of Complaint" },
      { name: "Priority", type: "Picklist", desc: "Critical, High, Medium, Low" },
      { name: "Status", type: "Picklist", desc: "New, In Progress, Closed" },
      { name: "Complaint_Category__c", type: "Picklist (Custom)", desc: "Cloud Downtime, Hardware Failure, etc." },
      { name: "Resolution_SLA_Hours__c", type: "Number(4,0) (Custom)", desc: "Calculated SLA turnaround in hours" },
      { name: "SLA_Breach_Status__c", type: "Formula(Text) (Custom)", desc: "Safe, Warning, Breached SLA flag" },
      { name: "Total_Action_Items__c", type: "Roll-up Summary(COUNT)", desc: "Count of child action items" },
      { name: "Root_Cause_Summary__c", type: "LongTextArea(32000)", desc: "Mandatory root cause upon closing ticket" },
    ],
    relationships: [
      { target: "Account", type: "Child-to-Parent (Lookup)", field: "Case.AccountId" },
      { target: "Complaint_Action_Item__c", type: "Parent-to-Child (1-to-Many)", field: "Case.Complaint_Action_Items__r" },
    ],
    validationRules: ["Require_RCA_On_High_Priority_Close"],
    triggers: ["CaseTrigger.trigger (before insert, before update)"],
  },
  {
    id: "action_item",
    label: "Complaint Action Item",
    apiName: "Complaint_Action_Item__c",
    type: "Custom sObject",
    description: "Concrete engineering remediation tasks auto-queued by ComplaintService or technicians.",
    fields: [
      { name: "Name", type: "AutoNumber", desc: "ACT-00001" },
      { name: "Action_Title__c", type: "Text(150)", desc: "Remediation step summary" },
      { name: "Case__c", type: "Lookup(Case)", desc: "Parent Case Relationship" },
      { name: "Status__c", type: "Picklist", desc: "Pending, In Progress, Completed" },
      { name: "Due_Date__c", type: "Date", desc: "Mandatory completion deadline" },
    ],
    relationships: [
      { target: "Case", type: "Child-to-Parent (Lookup)", field: "Complaint_Action_Item__c.Case__c" },
    ],
  },
];

export const SchemaExplorerSection: React.FC = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>("case");

  const activeNode = schemaNodes.find((n) => n.id === selectedNodeId) || schemaNodes[1];

  return (
    <section id="schema-graph" className="py-24 border-b border-cyan-500/20 bg-[#060b18] relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[400px] bg-gradient-to-br from-indigo-600/10 via-cyan-500/10 to-blue-600/10 blur-[130px] pointer-events-none -z-10 rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono text-cyan-300 mb-3 shadow-neon-cyan">
              <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
              Interactive Entity Relationship (ER) Graph
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Capstone Schema & Data Model Visualizer
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl">
              Inspect the live data model of our Customer Complaint Management System. 
              Explore field types, parent-child relationships, validation rules, and trigger hooks.
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex items-center gap-2">
            <span className="text-xs font-mono px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-cyan-300">
              Metadata Source: force-app/main/default/objects
            </span>
          </div>
        </div>

        {/* Visual Node Diagram Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 relative">
          {schemaNodes.map((node, idx) => {
            const isSelected = node.id === activeNode.id;
            return (
              <motion.div
                key={node.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => {
                  sound.playClick();
                  setSelectedNodeId(node.id);
                }}
                className={`p-5 rounded-2xl border transition-all cursor-pointer relative ${
                  isSelected
                    ? "bg-gradient-to-b from-cyan-950/80 via-slate-900 to-blue-950/60 border-cyan-400 shadow-neon-cyan ring-1 ring-cyan-400/40"
                    : "bg-slate-900/60 hover:bg-slate-900 border-slate-800 hover:border-cyan-500/30"
                }`}
              >
                {/* Arrow Connector between nodes */}
                {idx < 2 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-20">
                    <ArrowRight className="w-5 h-5 text-cyan-400 animate-pulse" />
                  </div>
                )}

                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className={isSelected ? "text-cyan-300 font-bold" : "text-slate-400"}>
                    Node 0{idx + 1}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] ${
                    node.type.includes("Custom") ? "bg-purple-950/50 text-purple-300 border border-purple-500/30" : "bg-blue-950/50 text-blue-300 border border-blue-500/30"
                  }`}>
                    {node.type}
                  </span>
                </div>

                <div className="text-base font-bold text-white truncate">
                  {node.label}
                </div>
                <div className="text-xs font-mono text-cyan-400 mt-0.5 truncate">
                  {node.apiName}
                </div>
                <div className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {node.description}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Detailed Node Inspector Panel */}
        <div className="rounded-2xl border border-cyan-500/30 bg-[#080e1e] p-6 shadow-2xl">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 mb-6 gap-3">
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-xl font-bold text-white font-mono">{activeNode.apiName}</h3>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
                  {activeNode.type}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{activeNode.description}</p>
            </div>

            {activeNode.triggers && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 font-mono text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Protected by {activeNode.triggers[0].split(" ")[0]}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Fields Table */}
            <div className="lg:col-span-8 space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-400" />
                Fields & Attributes ({activeNode.fields.length} Inspectable)
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 overflow-hidden">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/60">
                      <th className="p-3">Field API Name</th>
                      <th className="p-3">Data Type</th>
                      <th className="p-3">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {activeNode.fields.map((f, fIdx) => (
                      <tr key={fIdx} className="hover:bg-slate-900/40">
                        <td className="p-3 text-cyan-300 font-semibold">{f.name}</td>
                        <td className="p-3 text-slate-400 text-[11px]">{f.type}</td>
                        <td className="p-3 text-slate-300 text-[11px]">{f.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Relationships & Validation Rules */}
            <div className="lg:col-span-4 space-y-4">
              
              {/* Relationships Box */}
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
                <div className="text-xs font-mono uppercase tracking-wider text-sky-400 font-bold flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-sky-400" />
                  Relationships & Cardinality
                </div>
                <div className="space-y-2 pt-1">
                  {activeNode.relationships.map((rel, rIdx) => (
                    <div key={rIdx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs">
                      <div className="text-white font-semibold flex items-center justify-between">
                        <span>{rel.target}</span>
                        <span className="text-[10px] text-cyan-400">{rel.type}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{rel.field}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Validation Rules Box */}
              {activeNode.validationRules && (
                <div className="p-4 rounded-xl bg-slate-900/70 border border-amber-500/20 space-y-2">
                  <div className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-400" />
                    Custom Validation Rules
                  </div>
                  {activeNode.validationRules.map((vr, vrIdx) => (
                    <div key={vrIdx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-amber-300">
                      {vr}
                    </div>
                  ))}
                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
