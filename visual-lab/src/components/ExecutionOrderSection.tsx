"use client";

import React, { useState } from "react";
import { GitCommit, AlertCircle, CheckCircle, ShieldCheck, Layers, ChevronRight } from "lucide-react";

interface ExecutionStep {
  stepNumber: number;
  phase: string;
  title: string;
  description: string;
  developerRule: string;
  isTrigger: boolean;
  canChangeFieldsWithoutDml: boolean;
}

const executionSteps: ExecutionStep[] = [
  {
    stepNumber: 1,
    phase: "Initialization",
    title: "Original Record Loaded & System Validations",
    description: "Salesforce loads the original record from the database or initializes an empty record for insert. System-defined validations run (required fields, field formats, maximum lengths).",
    developerRule: "Do not rely on custom logic here; standard required field checks and layout rules execute first.",
    isTrigger: false,
    canChangeFieldsWithoutDml: false,
  },
  {
    stepNumber: 2,
    phase: "Before Triggers",
    title: "Before Insert / Before Update Triggers Fire",
    description: "All before triggers execute. In our Capstone, CaseTrigger delegates to CaseTriggerHandler.handleBeforeInsert and ComplaintService.applySlaTargets.",
    developerRule: "Best Practice: Modify fields directly in memory on Trigger.new without issuing any DML statement! No record Id exists yet on insert.",
    isTrigger: true,
    canChangeFieldsWithoutDml: true,
  },
  {
    stepNumber: 3,
    phase: "Validation",
    title: "Custom Validation Rules Evaluated",
    description: "Custom validation rules execute (e.g. Require_RCA_On_High_Priority_Close). If rule criteria evaluate to true, transaction aborts.",
    developerRule: "Before trigger field modifications are inspected here. If your trigger set invalid data, validation rules will fail.",
    isTrigger: false,
    canChangeFieldsWithoutDml: false,
  },
  {
    stepNumber: 4,
    phase: "Database Persistence (Preliminary)",
    title: "Record Saved to Database (Not Committed)",
    description: "Salesforce generates record IDs for inserts. The record is written to the database buffer, but the transaction is NOT yet committed to disk.",
    developerRule: "From this point onward, Trigger.new records have a valid 18-character Salesforce Id.",
    isTrigger: false,
    canChangeFieldsWithoutDml: false,
  },
  {
    stepNumber: 5,
    phase: "After Triggers",
    title: "After Insert / After Update Triggers Fire",
    description: "All after triggers execute. Since record IDs are now generated, you can create child records or update related parent records.",
    developerRule: "Trigger.new is READ-ONLY in After triggers! You cannot mutate fields directly; you must issue an explicit update DML.",
    isTrigger: true,
    canChangeFieldsWithoutDml: false,
  },
  {
    stepNumber: 6,
    phase: "Automation",
    title: "Assignment Rules Executed",
    description: "Case and Lead assignment rules evaluate and reassign ownership.",
    developerRule: "If ownership changes, sharing rules and access recalculate accordingly.",
    isTrigger: false,
    canChangeFieldsWithoutDml: false,
  },
  {
    stepNumber: 7,
    phase: "Automation",
    title: "Auto-Response Rules",
    description: "Email auto-response rules fire for incoming Cases and Leads based on origin and criteria.",
    developerRule: "Outbound emails do not hit synchronous callout limits but count toward daily email limits.",
    isTrigger: false,
    canChangeFieldsWithoutDml: false,
  },
  {
    stepNumber: 8,
    phase: "Automation",
    title: "Workflow Rules & Record-Triggered Flows (Before & After)",
    description: "Record-Triggered Flows and legacy Workflow Rules execute field updates. If a field update occurs, Before & After triggers may RE-FIRE!",
    developerRule: "Watch out for recursion! When workflow field updates execute, Before and After update triggers fire one additional time.",
    isTrigger: false,
    canChangeFieldsWithoutDml: false,
  },
  {
    stepNumber: 9,
    phase: "Processes",
    title: "Processes & Escalation Rules",
    description: "Case escalation rules evaluate SLA breaches (e.g. SLA_Breach_Status__c in our Complaint app).",
    developerRule: "Escalations can trigger notifications or change queue queues if SLA hours are breached.",
    isTrigger: false,
    canChangeFieldsWithoutDml: false,
  },
  {
    stepNumber: 10,
    phase: "Calculations",
    title: "Roll-Up Summary Field Recalculations",
    description: "Roll-up summary fields on master records recalculate based on child DML (e.g., Total_Action_Items__c on Case).",
    developerRule: "Master record triggers fire again if the roll-up summary value changed!",
    isTrigger: false,
    canChangeFieldsWithoutDml: false,
  },
  {
    stepNumber: 11,
    phase: "Criteria",
    title: "Criteria-Based Sharing Rules Evaluated",
    description: "Sharing rules evaluate record attributes to grant public read/write access to groups and roles.",
    developerRule: "Apex 'with sharing' will reflect these access rules immediately in subsequent queries.",
    isTrigger: false,
    canChangeFieldsWithoutDml: false,
  },
  {
    stepNumber: 12,
    phase: "Commit",
    title: "Database Commit & Post-Commit Actions",
    description: "Transaction commits permanently to the Salesforce multi-tenant database. Post-commit logic executes (sending emails, enqueuing async jobs).",
    developerRule: "Once committed, changes cannot be rolled back via Database.rollback. The transaction is atomic.",
    isTrigger: false,
    canChangeFieldsWithoutDml: false,
  },
];

export const ExecutionOrderSection: React.FC = () => {
  const [selectedStep, setSelectedStep] = useState<number>(2); // Default to Before Triggers

  const activeStep = executionSteps.find((s) => s.stepNumber === selectedStep) || executionSteps[1];

  return (
    <section id="execution-order" className="py-24 border-b border-[#222222] bg-[#080808]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#171717] border border-[#2B2B2B] text-xs font-mono text-[#CCCCCC] mb-3">
              <GitCommit className="w-3.5 h-3.5 text-[#AAAAAA]" />
              Architectural Standard
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Salesforce 12-Step Order of Execution
            </h2>
            <p className="text-[#888888] text-sm sm:text-base mt-2 max-w-2xl">
              Understand exactly when triggers fire, when fields can be mutated in memory, 
              and how validation rules, flows, and roll-ups interact during a transaction.
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex items-center gap-2">
            <span className="text-xs font-mono px-3 py-1 rounded-lg bg-[#141414] border border-[#262626] text-white">
              #1 Senior Developer Interview Topic
            </span>
          </div>
        </div>

        {/* 2-Column Interactive Stepper Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: 12-Step Stepper List */}
          <div className="lg:col-span-5 space-y-1.5 max-h-[640px] overflow-y-auto pr-1">
            {executionSteps.map((step) => {
              const isSelected = step.stepNumber === selectedStep;
              return (
                <button
                  key={step.stepNumber}
                  onClick={() => setSelectedStep(step.stepNumber)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                    isSelected
                      ? "bg-gradient-to-r from-[#222222] to-[#141414] border-[#444444] text-white"
                      : "bg-[#101010] hover:bg-[#161616] border-[#202020] text-[#888888]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${
                        isSelected
                          ? "bg-white text-black"
                          : step.isTrigger
                          ? "bg-[#1E1E1E] text-white border border-[#333333]"
                          : "bg-[#141414] text-[#666666]"
                      }`}
                    >
                      {step.stepNumber.toString().padStart(2, "0")}
                    </span>
                    <div>
                      <div className={`text-xs font-bold truncate ${isSelected ? "text-white" : "text-[#CCCCCC]"}`}>
                        {step.title}
                      </div>
                      <div className="text-[10px] text-[#666666] font-mono mt-0.5">
                        {step.phase}
                      </div>
                    </div>
                  </div>

                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      isSelected ? "text-white translate-x-0.5" : "text-[#444444]"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Right Column: Detailed Step Breakdown in Nero Card */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-6 rounded-2xl bg-gradient-to-b from-[#161616] via-[#101010] to-[#0A0A0A] border border-[#262626] shadow-2xl">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#222222] mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl font-mono font-black text-white">
                    Step {activeStep.stepNumber.toString().padStart(2, "0")}
                  </span>
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-[#1C1C1C] text-[#CCCCCC]">
                    {activeStep.phase}
                  </span>
                  {activeStep.isTrigger && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1F2B20] text-emerald-400 border border-[#2C4A2E] font-bold">
                      APEX TRIGGER EVENT
                    </span>
                  )}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-white mb-3">
                {activeStep.title}
              </h3>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#CCCCCC] leading-relaxed mb-5">
                {activeStep.description}
              </p>

              {/* Core Developer Rule Callout */}
              <div className="p-4 rounded-xl bg-[#141414] border border-[#242424] space-y-2 mb-4">
                <div className="text-xs font-mono uppercase tracking-wider text-white font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Golden Architectural Rule
                </div>
                <p className="text-xs text-[#AAAAAA] leading-relaxed">
                  {activeStep.developerRule}
                </p>
              </div>

              {/* Context variables badge check */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#202020]">
                <div className="p-3 rounded-xl bg-[#0E0E0E] border border-[#1E1E1E]">
                  <div className="text-[11px] font-mono text-[#777777] mb-1">In-Memory Mutation</div>
                  <div className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                    {activeStep.canChangeFieldsWithoutDml ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Allowed (Trigger.new is mutable)</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3.5 h-3.5 text-[#666666]" />
                        <span>Read-Only or DML Required</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#0E0E0E] border border-[#1E1E1E]">
                  <div className="text-[11px] font-mono text-[#777777] mb-1">Record ID Availability</div>
                  <div className="text-xs font-mono font-bold text-white">
                    {activeStep.stepNumber >= 4 ? (
                      <span className="text-emerald-400">Record Id Generated</span>
                    ) : (
                      <span className="text-[#888888]">Null on Insert</span>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
