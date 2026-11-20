# 🏛️ Salesforce Developer Lab (v2.0) — Buyer Setup & Deployment Guide

> **Commercial Distribution & License Package**  
> **Author & Architect:** Umendra Bhati (Remote Available)  
> **LinkedIn:** [https://www.linkedin.com/in/umendra-bhati-5243aa36a/](https://www.linkedin.com/in/umendra-bhati-5243aa36a/)  
> **Live Demo:** [https://salesforce-developer-lab.vercel.app/](https://salesforce-developer-lab.vercel.app/)

---

## 🌟 1. Product Overview

The **Salesforce Developer Lab** is an enterprise-grade interactive visual portal and learning suite designed for Salesforce Developers, Architects, Academies, and Bootcamps.

### Included In Your License:
1. **Interactive Frontend Portal (`visual-lab/`):**
   - **Next.js 15 (App Router)** & **Turbopack**
   - **Raycast-Inspired Floating Capsule Navbar** with spring hover tabs
   - **Raycast `⌘K` Interactive Command Palette** (global search & simulator jumps)
   - **Salesforce 3D Holo-Reactor** (3 interactive modes: Cloud, Apex, LWC)
   - **Cyber Laser Particle Cursor** (dual-pass neon beam & optic crosshair reticle)
   - **Live SOQL Query Studio** (real-time query execution, telemetry HUD, Table/JSON views)
   - **Three.js 3D Multi-Tenant Architecture Tower** with interactive orbit controls
   - **Apex Governor Limits Simulator** (real-time SOQL, DML, Heap calculation)
   - **Order of Execution Visualizer** (step-by-step trigger lifecycle)
   - **Interview Prep 3D Flashcards**
   - **Interactive Particle Salesforce Footer** (physics-based mouse scatter)
   - **$0/month Server Cost:** Fully static & client-side responsive!

2. **Salesforce DX Source Code (`scripts/` & `force-app/`):**
   - **Phase A to Phase E (Topics 01-20):** Apex syntax, Collections, SOQL, DML, Triggers, Handlers, Async Apex, Unit Testing, Code Coverage Gates.
   - **Phase F (Topics 21-25):** Lightning Web Components (LWC) Architecture, Reactivity (`@api`, `@track`), Component Communication (`CustomEvent`, LMS), LDS, and Wire Service with Apex.
   - **Enterprise Capstone:** "Customer Complaint Management System".
   - **100% SFDX Source Safe Isolation.**

---

## 🚀 2. Quick Start: 1-Click Deployment (Vercel)

You can deploy the entire interactive lab to Vercel in less than 2 minutes:

```bash
# 1. Clone your licensed repository
git clone https://github.com/umendrabhati2001-ux/salesforce-developer-lab.git
cd salesforce-developer-lab/visual-lab

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Deploy to Vercel (or connect via GitHub on Vercel Dashboard)
npx vercel --prod
```

---

## 💻 3. Salesforce DX Deployment (Deploy to Any Salesforce Org)

To push the verified backend scripts into your Salesforce Developer Edition or Scratch Org:

```bash
# 1. Authenticate with your Salesforce Org
sf org login web -a MyTargetOrg

# 2. Deploy source to Org
sf project deploy start --target-org MyTargetOrg

# 3. Execute any Apex script anonymously via CLI
sf apex run -f scripts/apex/11_bulkification_pattern.apex -o MyTargetOrg
```

---

## 📜 4. Commercial License Terms

- **Single Developer License ($149 - $199):**  
  Grants one developer or business the right to use, customize, and deploy the lab for internal training or personal portfolio purposes. Resale of unbundled source code is prohibited.
- **Extended / Agency SaaS License ($399 - $499):**  
  Grants unlimited commercial rights to rebrand, integrate into client enterprise applications, embed into educational bootcamps, or resell as part of a larger customer training package.

---

## 📬 Support & Inquiries
For technical questions, custom feature requests, or direct transfers:
- **Lead Developer:** Umendra Bhati
- **LinkedIn Profile:** [https://www.linkedin.com/in/umendra-bhati-5243aa36a/](https://www.linkedin.com/in/umendra-bhati-5243aa36a/)
