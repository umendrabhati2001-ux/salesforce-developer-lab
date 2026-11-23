"use client";

import { playClickSound, playSuccessSound } from "@/lib/sound";
import {
  Activity,
  CheckCircle2,
  CreditCard,
  FileCode2,
  Globe,
  Play,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Terminal,
  Zap
} from "lucide-react";
import React, { useState } from "react";

interface StripeSimulationState {
  caseNumber: string;
  disputeAmount: number;
  reason: string;
  isProcessing: boolean;
  step: "idle" | "callout" | "processing" | "completed" | "webhook_received";
  responsePayload: any | null;
  logs: string[];
}

export const StripeIntegrationPanel: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const [state, setState] = useState<StripeSimulationState>({
    caseNumber: "CAS-99412",
    disputeAmount: 150.0,
    reason: "Delayed Cloud Resolution & Service SLA Breach",
    isProcessing: false,
    step: "idle",
    responsePayload: null,
    logs: [
      "[SYSTEM INIT]: Connected to Salesforce Apex Runtime (API v60.0)",
      "[AUTH]: Named Credential (Stripe_API) verified with AES-256 encrypted token",
      "[GOVERNOR HUD]: Callouts: 0/100 | Queueable Jobs: 0/50 | Limits Safe"
    ]
  });

  const [activeTab, setActiveTab] = useState<"simulator" | "apex_code" | "webhook_payload" | "lwc_modal">("simulator");

  const runRefundCallout = () => {
    playClickSound();
    setState((prev) => ({
      ...prev,
      isProcessing: true,
      step: "callout",
      logs: [
        ...prev.logs,
        `[ASYNC ENQUEUE]: System.enqueueJob(new CaseRefundQueueable(['${prev.caseNumber}']))`,
        "[HTTP INITIATED]: HttpRequest to callout:Stripe_API/v1/refunds (POST)"
      ]
    }));

    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        step: "processing",
        logs: [
          ...prev.logs,
          "[TLS 1.3]: Encrypted handshake with api.stripe.com established",
          `[PAYLOAD SENT]: charge=ch_case_${prev.caseNumber}&amount=${prev.disputeAmount * 100}&reason=requested_by_customer`
        ]
      }));
    }, 700);

    setTimeout(() => {
      const refundId = "re_3O" + Math.random().toString(36).substring(2, 10).toUpperCase();
      const mockResponse = {
        id: refundId,
        object: "refund",
        amount: state.disputeAmount * 100,
        currency: "usd",
        charge: "ch_case_" + state.caseNumber,
        status: "succeeded",
        reason: "requested_by_customer",
        receipt_number: "RCP-" + Math.floor(100000 + Math.random() * 900000),
        created: Math.floor(Date.now() / 1000)
      };

      playSuccessSound();
      setState((prev) => ({
        ...prev,
        isProcessing: false,
        step: "completed",
        responsePayload: mockResponse,
        logs: [
          ...prev.logs,
          `[HTTP 200 OK]: Stripe response received in 184ms (${refundId})`,
          `[DML UPDATE]: Case ${prev.caseNumber} status updated to 'Closed - Resolved'`,
          "[GOVERNOR HUD]: Callouts: 1/100 | DML: 1/150 | SOQL: 1/100 | Zero SOQL in Loops Verified"
        ]
      }));
    }, 1500);
  };

  const triggerWebhookEvent = () => {
    playClickSound();
    setState((prev) => ({
      ...prev,
      isProcessing: true,
      step: "webhook_received",
      logs: [
        ...prev.logs,
        "[INBOUND WEBHOOK]: POST /services/apexrest/stripe/webhook/v1/",
        "[EVENT DETECTED]: charge.refunded event acknowledged by StripeWebhookResource.cls",
        "[AUDIT LOG]: Settlement ledger recorded in Salesforce BigObject / Custom Object"
      ]
    }));

    setTimeout(() => {
      playSuccessSound();
      setState((prev) => ({
        ...prev,
        isProcessing: false,
        logs: [
          ...prev.logs,
          "[WEBHOOK 200 OK]: Handshake confirmed idempotently with Stripe Webhook signing secret"
        ]
      }));
    }, 800);
  };

  const resetSimulation = () => {
    playClickSound();
    setState({
      caseNumber: "CAS-" + Math.floor(10000 + Math.random() * 90000),
      disputeAmount: 150.0,
      reason: "Delayed Cloud Resolution & Service SLA Breach",
      isProcessing: false,
      step: "idle",
      responsePayload: null,
      logs: [
        "[SYSTEM RESET]: Fresh Case Complaint dispute initialized",
        "[READY]: Awaiting Async Queueable Refund Dispatch"
      ]
    });
  };

  return (
    <div className="rounded-2xl bg-[#050814] border border-cyan-500/25 p-5 sm:p-7 shadow-[0_0_50px_rgba(2,132,199,0.12)] relative overflow-hidden flex flex-col h-full">
      {/* Background Neon Accent Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.3)]">
            <CreditCard className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono font-bold text-white tracking-wide">
                Salesforce + Stripe REST Gateway
              </span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[10px] font-mono text-cyan-300 font-bold">
                PROJECT 2
              </span>
            </div>
            <p className="text-xs font-mono text-slate-400">
              Dispute Auto-Settlement via Queueable Apex Callout &amp; Inbound Webhook
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-mono">
          <button
            onClick={() => {
              playClickSound();
              setActiveTab("simulator");
            }}
            className={`px-3 py-1 rounded-lg transition-all ${
              activeTab === "simulator"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Live Simulator
          </button>
          <button
            onClick={() => {
              playClickSound();
              setActiveTab("apex_code");
            }}
            className={`px-3 py-1 rounded-lg transition-all ${
              activeTab === "apex_code"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Apex Service
          </button>
          <button
            onClick={() => {
              playClickSound();
              setActiveTab("webhook_payload");
            }}
            className={`px-3 py-1 rounded-lg transition-all ${
              activeTab === "webhook_payload"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Webhook (@RestResource)
          </button>
          <button
            onClick={() => {
              playClickSound();
              setActiveTab("lwc_modal");
            }}
            className={`px-3 py-1 rounded-lg transition-all ${
              activeTab === "lwc_modal"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            LWC Modal (UI)
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col gap-5">
        {activeTab === "simulator" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1">
            {/* Left Column: Dispute Case Controller (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="p-4 rounded-xl bg-slate-900/70 border border-white/[0.06] flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-cyan-400" />
                    Dispute Case Origin
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
                    CONNECTED TO PROJ 1
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.04]">
                    <span className="text-[10px] text-slate-500 block">Case Number</span>
                    <span className="text-white font-bold">{state.caseNumber}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.04]">
                    <span className="text-[10px] text-slate-500 block">Disputed Settlement</span>
                    <span className="text-emerald-400 font-bold">${state.disputeAmount.toFixed(2)} USD</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.04] text-xs font-mono">
                  <span className="text-[10px] text-slate-500 block">Dispute Reason</span>
                  <span className="text-slate-300">{state.reason}</span>
                </div>

                {/* Actions */}
                <div className="pt-2 flex flex-col gap-2">
                  <button
                    disabled={state.isProcessing || state.step === "completed"}
                    onClick={runRefundCallout}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-[#0176D3] text-slate-950 font-mono font-bold text-xs shadow-[0_0_20px_rgba(0,240,255,0.35)] hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    {state.isProcessing ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Dispatching Queueable Callout...</span>
                      </>
                    ) : state.step === "completed" ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-slate-950" />
                        <span>Refund Succeeded ($150.00 Settled)</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Dispatch Stripe Refund (Apex Queueable)</span>
                      </>
                    )}
                  </button>

                  {state.step === "completed" && (
                    <button
                      onClick={triggerWebhookEvent}
                      disabled={state.isProcessing}
                      className="w-full py-2 px-3 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Simulate Stripe Inbound Webhook</span>
                    </button>
                  )}

                  <button
                    onClick={resetSimulation}
                    className="w-full py-1.5 px-3 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white text-xs font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Reset Transaction</span>
                  </button>
                </div>
              </div>

              {/* Governor Limit Safety HUD */}
              <div className="p-3.5 rounded-xl bg-emerald-500/[0.06] border border-emerald-500/25 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    Governor Limit Compliance
                  </span>
                  <span className="text-[10px] text-emerald-300/80">ASYNC QUEUEABLE SAFE</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 text-center font-mono">
                  <div className="p-1.5 rounded-lg bg-black/40 border border-white/[0.04]">
                    <span className="text-[9px] text-slate-500 block">Callouts</span>
                    <span className="text-cyan-400 text-xs font-bold">1 / 100</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-black/40 border border-white/[0.04]">
                    <span className="text-[9px] text-slate-500 block">Queueable</span>
                    <span className="text-emerald-400 text-xs font-bold">1 / 50</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-black/40 border border-white/[0.04]">
                    <span className="text-[9px] text-slate-500 block">SOQL</span>
                    <span className="text-purple-400 text-xs font-bold">1 / 100</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-black/40 border border-white/[0.04]">
                    <span className="text-[9px] text-slate-500 block">DML</span>
                    <span className="text-amber-400 text-xs font-bold">1 / 150</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Live Terminal & JSON Inspector (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              {/* Terminal Logs */}
              <div className="p-4 rounded-xl bg-[#02050E] border border-cyan-500/30 flex flex-col flex-1 shadow-inner min-h-[220px]">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-2 mb-3">
                  <span className="text-xs font-mono text-cyan-400 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5" />
                    Apex Callout &amp; Queueable Execution Log
                  </span>
                  <span className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    RUNTIME ACTIVE
                  </span>
                </div>

                <div className="flex-1 font-mono text-xs space-y-1.5 overflow-y-auto max-h-[160px] text-slate-300 pr-2">
                  {state.logs.map((log, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="text-slate-600 select-none">&gt;</span>
                      <span
                        className={
                          log.includes("[HTTP 200 OK]") || log.includes("[WEBHOOK 200 OK]")
                            ? "text-emerald-300 font-bold"
                            : log.includes("[ASYNC ENQUEUE]") || log.includes("[HTTP INITIATED]")
                            ? "text-cyan-300"
                            : log.includes("[GOVERNOR HUD]")
                            ? "text-purple-300"
                            : "text-slate-300"
                        }
                      >
                        {log}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* JSON Response Preview */}
              {state.responsePayload && (
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-emerald-500/30 text-xs font-mono">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Stripe API Response Payload (JSON)
                    </span>
                    <span className="text-[10px] text-slate-500">HTTP 200 OK</span>
                  </div>
                  <pre className="text-[11px] text-slate-300 overflow-x-auto p-2.5 rounded-lg bg-black/60 border border-white/[0.05]">
                    {JSON.stringify(state.responsePayload, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Apex Code Viewer */}
        {activeTab === "apex_code" && (
          <div className="p-4 rounded-xl bg-[#02050E] border border-cyan-500/30 font-mono text-xs flex flex-col flex-1">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-2 mb-3">
              <span className="text-cyan-300 font-bold flex items-center gap-1.5">
                <FileCode2 className="w-4 h-4 text-cyan-400" />
                force-app/main/default/classes/CaseRefundQueueable.cls
              </span>
              <span className="text-[10px] text-slate-400">Database.AllowsCallouts Enforced</span>
            </div>
            <pre className="text-[11px] text-slate-300 overflow-x-auto p-3 rounded-lg bg-black/60 leading-relaxed">
{`public with sharing class CaseRefundQueueable implements Queueable, Database.AllowsCallouts {
    private List<Id> caseIds;
    private String refundReason;

    public CaseRefundQueueable(List<Id> caseIds, String refundReason) {
        this.caseIds = caseIds;
        this.refundReason = refundReason;
    }

    public void execute(QueueableContext context) {
        // Bulk SOQL outside loop (0 SOQL in loops)
        List<Case> casesToRefund = [SELECT Id, CaseNumber, Status, Description FROM Case WHERE Id IN :caseIds];
        List<Case> casesToUpdate = new List<Case>();

        for (Case c : casesToRefund) {
            // Secure Named Credential Callout via StripeService
            StripeService.StripeRefundResult res = StripeService.processCaseRefund('ch_' + c.CaseNumber, 15000, refundReason);
            if (res.isSuccess) {
                c.Status = 'Closed';
                c.Description += '\\n[REFUND SUCCESS]: ' + res.refundId;
                casesToUpdate.add(c);
            }
        }
        // Single bulk DML outside loop (0 DML in loops)
        if (!casesToUpdate.isEmpty()) { update casesToUpdate; }
    }
}`}
            </pre>
          </div>
        )}

        {/* Tab 3: Webhook Endpoint */}
        {activeTab === "webhook_payload" && (
          <div className="p-4 rounded-xl bg-[#02050E] border border-cyan-500/30 font-mono text-xs flex flex-col flex-1">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-2 mb-3">
              <span className="text-purple-300 font-bold flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-purple-400" />
                Apex Inbound Endpoint: @RestResource(urlMapping='/stripe/webhook/v1/*')
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">200 OK IDEMPOTENT</span>
            </div>
            <pre className="text-[11px] text-slate-300 overflow-x-auto p-3 rounded-lg bg-black/60 leading-relaxed">
{`@RestResource(urlMapping='/stripe/webhook/v1/*')
global with sharing class StripeWebhookResource {
    @HttpPost
    global static WebhookResponse handleInboundWebhook() {
        RestRequest req = RestContext.request;
        String requestBodyString = req.requestBody.toString();

        Map<String, Object> eventMap = (Map<String, Object>) JSON.deserializeUntyped(requestBodyString);
        String eventType = (String) eventMap.get('type');
        String eventId = (String) eventMap.get('id');

        if (eventType == 'charge.refunded') {
            // Settle dispute ledger & update complaint audit records
            return new WebhookResponse(true, 'Refund event processed idempotently', eventId);
        }
        return new WebhookResponse(true, 'Acknowledged event: ' + eventType, eventId);
    }
}`}
            </pre>
          </div>
        )}

        {/* Tab 4: Lightning Web Component (LWC) Quick Action Modal */}
        {activeTab === "lwc_modal" && (
          <div className="flex flex-col gap-5 flex-1">
            {/* Live Interactive SLDS Modal Card */}
            <div className="p-5 rounded-2xl bg-[#081226] border border-emerald-500/30 shadow-[0_0_35px_rgba(16,185,129,0.15)] flex flex-col gap-4 font-sans">
              <div className="flex items-center justify-between border-b border-white/[0.1] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#0176D3] flex items-center justify-center p-1 text-white shadow-sm">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white font-mono">
                      stripeRefundModal.html &bull; SLDS Quick Action Panel
                    </h3>
                    <p className="text-[11px] text-slate-400 font-mono">
                      force-app/main/default/lwc/stripeRefundModal/
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono font-bold">
                  @api recordId Connected
                </span>
              </div>

              {/* SLDS Form Simulation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Target Case ID</label>
                  <input
                    type="text"
                    value={state.caseNumber}
                    disabled
                    className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-slate-400 cursor-not-allowed text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Refund Amount (USD)</label>
                  <input
                    type="text"
                    value={`$${state.disputeAmount.toFixed(2)}`}
                    readOnly
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-emerald-500/30 text-emerald-400 font-bold text-xs"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[11px] text-slate-400 block mb-1">Dispute Reason (Combobox)</label>
                  <input
                    type="text"
                    value={state.reason}
                    readOnly
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-slate-200 text-xs"
                  />
                </div>
              </div>

              {/* Action Buttons in Modal Footer */}
              <div className="pt-2 border-t border-white/[0.08] flex items-center justify-end gap-2.5">
                <button
                  onClick={() => {
                    playClickSound();
                    setActiveTab("simulator");
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 text-xs font-mono transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setActiveTab("simulator");
                    runRefundCallout();
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold font-mono text-xs shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>Execute Stripe Refund ($150.00)</span>
                </button>
              </div>
            </div>

            {/* LWC Source Code Box */}
            <div className="p-4 rounded-xl bg-[#02050E] border border-cyan-500/30 font-mono text-xs flex flex-col">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-2 mb-2 text-cyan-300 font-bold">
                <span className="flex items-center gap-1.5">
                  <FileCode2 className="w-3.5 h-3.5" />
                  stripeRefundModal.js (AuraEnabled Execution)
                </span>
                <span className="text-[10px] text-slate-500">ES6 + LWC Engine</span>
              </div>
              <pre className="text-[11px] text-slate-300 overflow-x-auto p-2.5 rounded-lg bg-black/60 leading-relaxed">
{`import { LightningElement, api, track } from 'lwc';
import processCaseRefundFromLwc from '@salesforce/apex/ComplaintService.processCaseRefundFromLwc';

export default class StripeRefundModal extends LightningElement {
    @api recordId;
    @track refundAmount = 150.00;

    async handleExecuteRefund() {
        const jobId = await processCaseRefundFromLwc({
            caseId: this.recordId,
            disputeReason: 'Cloud SLA Breach Refund'
        });
        // Dispatches ShowToastEvent & refreshes Case Record Page
    }
}`}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
