# Salesforce Developer Mastery — Visual Lab & Architecture Portal

An interactive, motion-rich command center and architecture visualizer built with **Next.js 15**, **Tailwind CSS**, and **Framer Motion** for Salesforce DX developers.

---

## ⚡ Quick Start

From the root project directory or inside `/visual-lab`:

```bash
cd visual-lab
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

To run a production build:
```bash
cd visual-lab
npm run build
npm start
```

---

## 🛡️ SFDX Safety Guarantee

All Salesforce DX project files (`force-app/`, `scripts/`, `config/`, `.vscode/`, `sfdx-project.json`) are **100% untouched and preserved**. The visual lab operates exclusively inside `/visual-lab`, sourcing and visualizing data directly from `INDEX.md`, `MENTOR_NOTES.md`, `INTERVIEW_PREP.md`, and the real Apex/SOQL scripts.

---

## 🚀 Key Modules Built

1. **3D Facet-Glass Hero**:
   - Deep cyber-Salesforce palette (`#030712`, `#00F0FF`, `#0176D3`).
   - 3D floating glass facets with spring physics and mouse parallax.
   - Live metrics: 10 Topics Completed, Active Resume Target: Topic 11 (Bulkification & Governor Limits), 1 Capstone Live, 100% SFDX file isolation.

2. **Chronological Roadmap & Progress Hub**:
   - Full serial syllabus from Topic 01 to Topic 25+ across 7 architectural phases.
   - Topics 01–10 marked as completed with verified checkmarks, key architectural takeaways, and bilingual mentor notes.
   - Active resume milestone pulse card on **Topic 11: Governor Limits & Bulkification Architecture**.
   - Upcoming Phase C (Triggers), Phase D (Async Apex), Phase E (Testing), Phase F (LWC & Jest), Phase G (Integrations).

3. **Production Apex & SOQL Code Arena**:
   - Syntax-highlighted viewers for all Apex practice scripts (`01_apex_basics.apex` to `10_dml_mastery.apex`), SOQL queries, and Capstone architecture files (`CaseTrigger.trigger`, `CaseTriggerHandler.cls`, `ComplaintService.cls`).
   - Line numbers, one-click copy with animated feedback, and instant search filter.

4. **Live Interactive Architecture & Motion Visualizers**:
   - **Trigger Flow Simulator**: Multi-node pipeline (`CaseTrigger` ➔ `CaseTriggerHandler` ➔ `ComplaintService` ➔ `Case SLA & Action Item`) with category selection, energy beam animations, and live timestamped execution log.
   - **Apex Memory Visualizer**: Interactive memory representations of `List<T>`, `Set<T>`, and `Map<Key, Value>` with dynamic duplicate rejection and O(1) constant lookup.
   - **Governor Limit Gauge**: Interactive transaction batch slider (1 to 200 records) demonstrating how bulkification keeps SOQL & DML at 1 statement vs unbulkified code crashing into governor limits (`System.LimitException: Too many SOQL queries: 101`).

5. **Spotlight Interview Flashcards**:
   - 17 curated technical interview questions from `INTERVIEW_PREP.md`.
   - Mouse-tracking radial spotlight cards with click-to-reveal answers.
   - Dual-mode answer display: **Hire-Me English** (exact phrasing for interviews) and **Hinglish Concept** (conceptual clarity).
   - Category filtering, difficulty levels, and interactive mastery progress tracker.
