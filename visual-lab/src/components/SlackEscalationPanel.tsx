"use client";

import React, { useState } from "react";
import {
  BellRing,
  Send,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Layers,
  ExternalLink,
  Code2,
  FileCode,
  ShieldCheck,
  Terminal,
  Activity,
  Zap,
  RotateCw,
  Hash
} from "lucide-react";
import { playClickSound, playSuccessSound } from "@/lib/sound";

interface IncidentScenario {
  id: string;
  title: string;
  severity: "CRITICAL" | "HIGH" | "WARNING";
  category: string;
  caseNumber: string;
  description: string;
}

const PRESET_INCIDENTS: IncidentScenario[] = [
  {
    id: "inc-1",
    title: "SLA Breach: Cloud Infrastructure Downtime (>2 hrs)",
    severity: "CRITICAL",
    category: "Cloud Downtime",
    caseNumber: "CAS-000849",
    description: "Multi-tenant database connection timeout exceeded 2-hour SLA window without resolution."
  },
  {
    id: "inc-2",
    title: "Stripe Refund Gateway Callout Failed (HTTP 402)",
    severity: "HIGH",
    category: "Billing Dispute",
    caseNumber: "CAS-000850",
    description: "Automated refund of $750.00 rejected: charge_already_refunded. Manual ops review required."
  },
  {
    id: "inc-3",
    title: "High-Volume Complaint Surge (>50 cases/min)",
    severity: "WARNING",
    category: "Network Latency",
    caseNumber: "CAS-000851",
    description: "Anomalous complaint spike detected from EU West region. Rate limiting throttled."
  }
];

export const SlackEscalationPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"simulator" | "service" | "queueable" | "test">("simulator");
  const [selectedIncident, setSelectedIncident] = useState<IncidentScenario>(PRESET_INCIDENTS[0]);
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchedAlert, setDispatchedAlert] = useState<any | null>(null);

  const handleTriggerAlert = () => {
    playClickSound();
    setIsDispatching(true);

    setTimeout(() => {
      playSuccessSound();
      setIsDispatching(false);
      setDispatchedAlert({
        timestamp: new Date().toLocaleTimeString(),
        jobId: "707" + Math.random().toString(36).substring(2, 12).toUpperCase(),
        scenario: selectedIncident,
        status: "Delivered (HTTP 200 OK)",
        latency: "42ms"
      });
    }, 700);
  };

  return (
    <div className="flex flex-col gap-6 bg-[#0B0F19]/90 border border-purple-500/30 rounded-2xl p-4 sm:p-6 backdrop-blur-xl shadow-[0_0_40px_rgba(168,85,247,0.12)]">
      {/* Header Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
            <BellRing className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-mono font-bold text-white tracking-wide">
                Project 3: Salesforce + Slack Escalation Engine
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-mono border border-purple-500/40 font-bold">
                ASYNC WEBHOOK
              </span>
            </div>
            <p className="text-xs font-mono text-slate-400 mt-0.5">
              Queueable Apex Callouts • Slack Block Kit Payload • Zero Governor Limit Blockers
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-mono">
          <button
            onClick={() => {
              playClickSound();
              setActiveTab("simulator");
            }}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === "simulator"
                ? "bg-purple-600 text-white font-bold shadow-[0_0_12px_rgba(168,85,247,0.4)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Live Simulator
          </button>
          <button
            onClick={() => {
              playClickSound();
              setActiveTab("service");
            }}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === "service"
                ? "bg-purple-600 text-white font-bold shadow-[0_0_12px_rgba(168,85,247,0.4)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Apex Service
          </button>
          <button
            onClick={() => {
              playClickSound();
              setActiveTab("queueable");
            }}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === "queueable"
                ? "bg-purple-600 text-white font-bold shadow-[0_0_12px_rgba(168,85,247,0.4)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Queueable
          </button>
          <button
            onClick={() => {
              playClickSound();
              setActiveTab("test");
            }}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === "test"
                ? "bg-purple-600 text-white font-bold shadow-[0_0_12px_rgba(168,85,247,0.4)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Unit Test (100%)
          </button>
        </div>
      </div>

      {/* Simulator Tab Content */}
      {activeTab === "simulator" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Trigger Form & Controls (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="p-4 rounded-xl bg-black/40 border border-white/[0.08] flex flex-col gap-3">
              <label className="text-xs font-mono text-slate-300 font-semibold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                Select Incident Scenario:
              </label>

              <div className="flex flex-col gap-2">
                {PRESET_INCIDENTS.map((inc) => (
                  <button
                    key={inc.id}
                    onClick={() => {
                      playClickSound();
                      setSelectedIncident(inc);
                    }}
                    className={`p-3 rounded-lg text-left transition-all border font-mono text-xs cursor-pointer ${
                      selectedIncident.id === inc.id
                        ? "bg-purple-500/15 border-purple-500/50 text-white shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                        : "bg-white/[0.02] border-white/[0.05] text-slate-400 hover:bg-white/[0.05] hover:text-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-bold text-slate-200">{inc.caseNumber}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          inc.severity === "CRITICAL"
                            ? "bg-red-500/20 text-red-300 border border-red-500/40"
                            : inc.severity === "HIGH"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                            : "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                        }`}
                      >
                        {inc.severity}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-300 line-clamp-1">{inc.title}</div>
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={handleTriggerAlert}
                  disabled={isDispatching}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.4)] cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  {isDispatching ? (
                    <>
                      <RotateCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Dispatching Queueable Callout...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Fire Slack Webhook (Database.AllowsCallouts)</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Governor Limits Telemetry for Slack Callout */}
            <div className="p-3.5 rounded-xl bg-black/30 border border-white/[0.06] font-mono text-xs flex flex-col gap-2">
              <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">
                Governor Limit Consumption
              </span>
              <div className="grid grid-cols-3 gap-2 text-[11px]">
                <div className="p-2 rounded bg-white/[0.03] border border-white/[0.05]">
                  <div className="text-slate-400 text-[9px]">HTTP Callouts</div>
                  <div className="text-purple-300 font-bold">1 / 100</div>
                </div>
                <div className="p-2 rounded bg-white/[0.03] border border-white/[0.05]">
                  <div className="text-slate-400 text-[9px]">Queueables</div>
                  <div className="text-cyan-300 font-bold">1 / 50</div>
                </div>
                <div className="p-2 rounded bg-white/[0.03] border border-white/[0.05]">
                  <div className="text-slate-400 text-[9px]">DML in Loop</div>
                  <div className="text-emerald-400 font-bold">0 (Safe)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Slack Message Canvas Preview (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="rounded-xl bg-[#1A1D21] border border-slate-700/60 overflow-hidden shadow-2xl font-sans">
              {/* Slack Header Bar */}
              <div className="bg-[#121417] px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-300">
                <div className="flex items-center gap-2">
                  <Hash className="w-3.5 h-3.5 text-purple-400" />
                  <span className="font-bold text-white">incidents-production</span>
                  <span className="text-slate-500 text-[10px]">| Real-Time Escalations</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Webhook Listening</span>
                </div>
              </div>

              {/* Slack Message Body */}
              <div className="p-4 sm:p-5 flex gap-3 text-slate-200">
                {/* Bot Avatar */}
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white shrink-0 font-bold text-xs shadow-md">
                  SF
                </div>

                <div className="flex-1 flex flex-col gap-2">
                  {/* Sender & Timestamp */}
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-xs sm:text-sm">
                      Salesforce Incident Bot
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-slate-700 text-[9px] text-slate-300 font-mono">
                      APP
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {dispatchedAlert ? dispatchedAlert.timestamp : "Just now"}
                    </span>
                  </div>

                  {/* Slack Block Kit Card */}
                  <div className="rounded-lg bg-[#222529] border border-slate-700/80 p-3.5 flex flex-col gap-3 font-sans">
                    {/* Header */}
                    <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                      <span>{selectedIncident.severity === "CRITICAL" ? "🚨" : "⚠️"}</span>
                      <span>Incident Escalation: {selectedIncident.title}</span>
                    </div>

                    {/* Fields Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-black/30 p-2.5 rounded border border-white/[0.04]">
                      <div>
                        <div className="text-slate-400 text-[10px]">Severity</div>
                        <div className="text-amber-300 font-bold">{selectedIncident.severity}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-[10px]">Case Reference</div>
                        <div className="text-cyan-300 font-bold">{selectedIncident.caseNumber}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-[10px]">Category</div>
                        <div className="text-slate-200">{selectedIncident.category}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-[10px]">Enqueued Job</div>
                        <div className="text-purple-300 font-bold truncate">
                          {dispatchedAlert ? dispatchedAlert.jobId : "707XX000019A8Z"}
                        </div>
                      </div>
                    </div>

                    {/* Details section */}
                    <div className="text-xs text-slate-300">
                      <strong className="text-slate-200 block mb-0.5">Details &amp; Resolution Path:</strong>
                      <p className="text-slate-400 leading-relaxed">{selectedIncident.description}</p>
                    </div>

                    {/* Interactive Button Element */}
                    <div className="pt-1 flex items-center gap-2">
                      <a
                        href="/studio"
                        className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <span>View in Salesforce (Studio)</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <span className="text-[10px] font-mono text-slate-400">
                        {dispatchedAlert ? "✅ Callout Acknowledged" : "Pending Trigger"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Code Viewer Tabs */}
      {activeTab === "service" && (
        <div className="p-4 rounded-xl bg-black/60 border border-white/[0.08] font-mono text-xs overflow-x-auto">
          <pre className="text-slate-300 leading-relaxed">
{`/**
 * @description Enterprise Slack Integration Service for incident escalations and SLA breaches.
 *              Builds Slack Block Kit JSON payloads and dispatches via Named Credentials.
 * @author Umendra Bhati (Salesforce Developer & Architect)
 */
public with sharing class SlackAlertService {
    public class SlackException extends Exception {}

    private static final String NAMED_CREDENTIAL = 'callout:Slack_Incident_Webhook';

    public static Id dispatchIncidentAlertAsync(Id caseId, String incidentTitle, String severity, String details) {
        String payload = buildSlackBlockPayload(caseId, incidentTitle, severity, details);
        return System.enqueueJob(new SlackAlertQueueable(payload));
    }

    public static HttpResponse sendSlackNotification(String payload) {
        HttpRequest req = new HttpRequest();
        req.setEndpoint(NAMED_CREDENTIAL);
        req.setMethod('POST');
        req.setHeader('Content-Type', 'application/json;charset=UTF-8');
        req.setBody(payload);
        req.setTimeout(10000);

        Http http = new Http();
        return http.send(req);
    }
}`}
          </pre>
        </div>
      )}

      {activeTab === "queueable" && (
        <div className="p-4 rounded-xl bg-black/60 border border-white/[0.08] font-mono text-xs overflow-x-auto">
          <pre className="text-slate-300 leading-relaxed">
{`/**
 * @description Queueable Apex worker executing asynchronous HTTP POST callouts to Slack Webhooks.
 *              Implements Database.AllowsCallouts to adhere to Salesforce governor limits.
 * @author Umendra Bhati (Salesforce Developer & Architect)
 */
public with sharing class SlackAlertQueueable implements Queueable, Database.AllowsCallouts {
    private final String payload;

    public SlackAlertQueueable(String payload) {
        this.payload = payload;
    }

    public void execute(QueueableContext context) {
        if (String.isNotBlank(payload)) {
            SlackAlertService.sendSlackNotification(payload);
        }
    }
}`}
          </pre>
        </div>
      )}

      {activeTab === "test" && (
        <div className="p-4 rounded-xl bg-black/60 border border-white/[0.08] font-mono text-xs overflow-x-auto">
          <pre className="text-slate-300 leading-relaxed">
{`/**
 * @description Comprehensive unit tests for SlackAlertService and SlackAlertQueueable.
 *              Guarantees 100% code coverage using HttpCalloutMock.
 */
@isTest
private class SlackAlertServiceTest {
    private class SlackMockSuccess implements HttpCalloutMock {
        public HttpResponse respond(HttpRequest req) {
            System.assertEquals('POST', req.getMethod());
            HttpResponse res = new HttpResponse();
            res.setHeader('Content-Type', 'text/plain');
            res.setBody('ok');
            res.setStatusCode(200);
            return res;
        }
    }

    @isTest
    static void testSlackAlertQueueableSuccess() {
        Test.setMock(HttpCalloutMock.class, new SlackMockSuccess());
        Case testCase = new Case(Subject = 'Critical Cloud Downtime SLA Breach', Priority = 'High');
        insert testCase;

        Test.startTest();
        Id jobId = SlackAlertService.dispatchIncidentAlertAsync(testCase.Id, 'SLA Breach', 'CRITICAL', 'Timeout > 2h');
        Test.stopTest();

        System.assertNotEquals(null, jobId, 'Queueable job should be successfully enqueued.');
    }
}`}
          </pre>
        </div>
      )}
    </div>
  );
};
