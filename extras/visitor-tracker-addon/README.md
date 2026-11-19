# Visitor Tracker & Telegram Alert Add-on (Archived / Standalone)

This folder contains the optional real-time visitor telemetry and alert module for **Salesforce Developer Lab**. It is kept separate and is not bundled with the active production site.

---

### Contents:
1. `api/track/route.ts` — Serverless Next.js API endpoint that parses visitor IP, country, city, source, and device, and forwards instant markdown alerts to Telegram and Webhook.
2. `VisitorTracker.tsx` — Client-side React hook component that fires on initial page session.

---

### How to Re-enable in the Future (Optional):
1. Copy `api/track/route.ts` back into `visual-lab/src/app/api/track/route.ts`.
2. Copy `VisitorTracker.tsx` back into `visual-lab/src/components/VisitorTracker.tsx`.
3. Import `<VisitorTracker />` inside `visual-lab/src/app/layout.tsx`.
4. Add `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` to Vercel Environment Variables.
