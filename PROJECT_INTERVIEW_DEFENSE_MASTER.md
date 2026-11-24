# 🛡️ PROJECT INTERVIEW DEFENSE MASTER: THE ARCHITECT BIBLE
**Project Title**: Enterprise Salesforce FinTech Payment Dispute & Automated Escalation Engine  
**Developer & Architect**: Umendra Bhati  
**Production Studio Reference**: `https://salesforce-developer-lab.vercel.app/studio`  
**Target Rates**: $40 – $55/hr | Remote Global

---

# 📑 TABLE OF CONTENTS
1. [The 45-Second Spoken Project Pitch (Start Here)](#1-the-45-second-spoken-project-pitch)
2. [Complete System Inventory (Classes, Triggers & Components)](#2-complete-system-inventory)
3. [The End-to-End Data Flow (Step-by-Step)](#3-the-end-to-end-data-flow)
4. [Top 15 Technical Questions & Word-by-Word Defense](#4-top-15-technical-questions--defense)
5. [Behavioral & System Design Questions](#5-behavioral--system-design-questions)
6. [Live Screen-Share Demo Script (What to click & what to say)](#6-live-screen-share-demo-script)
7. [The "Emergency Lifeline" (What if you get stuck?)](#7-the-emergency-lifeline)

---

# 1. THE 45-SECOND SPOKEN PROJECT PITCH
*(Jab interviewer pooche: "Umendra, can you walk me through your recent project?")*

### 🎙️ Word-by-Word English Script:
> "I recently architected an enterprise-grade FinTech dispute and refund automation engine connecting Salesforce with Stripe and Slack.
> 
> In standard setups, when payment failures or disputes occur in Stripe, manual reconciliation creates delays and breaches customer SLAs. 
> 
> To solve this, I built a real-time, event-driven pipeline:
> 1. Stripe sends real-time webhooks into our custom Apex REST endpoint where we cryptographically verify the HMAC SHA-256 digital signature to eliminate spoofing.
> 2. To strictly comply with multi-tenant Governor Limits, we decouple heavy execution by offloading payment refunds and database updates to an asynchronous Queueable Apex mesh with retry mechanisms.
> 3. If an incident or critical SLA breach occurs, our system automatically formats dynamic Slack Block Kit payloads and posts real-time alerts to the engineering incident channel via Named Credentials.
> 4. I also deployed a full-stack Next.js interactive runtime simulator on Vercel so stakeholders can test payloads and verify governor limit metrics live."

### 🧠 Desi Hindi Meaning (Dimaag mein yeh sochna hai):
Stripe se payment ya dispute ka webhook aata hai ➔ Hum cryptographic signature check karke fake requests rokte hain ➔ Salesforce ke Governor Limits bachaane ke liye trigger mein callout nahi karte, Queueable background worker ko de dete hain ➔ Agar payment fail ho toh Slack channel par automatic alert card chala jata hai ➔ Aur isko live dikhaane ke liye Next.js ka live studio bhi deploy kiya hai!

---

# 2. COMPLETE SYSTEM INVENTORY
*(Interviewer pooche: "What Apex classes did you write and what are their responsibilities?")*

| Component Name | Type | Architectural Responsibility |
| :--- | :--- | :--- |
| `StripeWebhookResource.cls` | `@RestResource` Custom REST API | Inbound Webhook Listener. Listens on `/api/stripe/webhook/*`, parses JSON payload, verifies `Stripe-Signature` via HMAC SHA-256. |
| `StripeService.cls` | Domain Integration Service | Outbound HTTP REST Client. Prepares HTTP callouts to Stripe REST API for Payment Intents, Chargebacks, and Refunds. |
| `CaseRefundQueueable.cls` | `Queueable, Database.AllowsCallouts` | Asynchronous Worker. Decouples Case trigger from Stripe API callout, ensuring Governor Limit compliance. |
| `SlackAlertService.cls` | Escalation Service | Constructs dynamic Slack Block Kit JSON layouts and dispatches callouts via Named Credentials. |
| `SlackAlertQueueable.cls` | `Queueable, Database.AllowsCallouts` | Asynchronous Slack Worker. Prevents database trigger lockups when broadcasting incident alerts. |
| `CaseTrigger.trigger` | Apex Trigger | Lean Trigger. Contains ZERO business logic; delegates events immediately to handler. |
| `CaseTriggerHandler.cls` | Trigger Handler Pattern | Orchestrates `before insert`, `after insert`, and `after update` contexts. |
| `ComplaintService.cls` | Domain Service | Business logic tier. Computes customer tier (Gold/Silver/Standard), SLA target hours, and determines escalation threshold. |
| `StripeServiceTest.cls` | Unit Test Class | 100% test coverage using `HttpCalloutMock` (simulates HTTP 200 Success and HTTP 402 Card Declined). |
| `SlackAlertServiceTest.cls`| Unit Test Class | Mock callout suite testing Block Kit layout serialization and HTTP 500 error handling. |

---

# 3. THE END-TO-END DATA FLOW
*(Interviewer pooche: "Trace a transaction from start to finish")*

```
[ Customer Card Payment Event ]
               │
               ▼
   [ External Gateway: Stripe ]
               │  (Webhook POST + Stripe-Signature Header)
               ▼
[ Salesforce REST API: StripeWebhookResource.cls ]
               │  (Crypto.generateMac HMAC SHA-256 Verification)
               ├──► Invalid Signature? ──► Return HTTP 401 Unauthorized (Drop Request)
               │
               ▼ (Valid Signature)
[ Idempotency Check: Stripe_Event_ID__c ]
               │  (Check if already processed)
               ├──► Already Exists? ────► Return HTTP 200 OK (Skip duplicate)
               │
               ▼ (Fresh Event)
[ Asynchronous Handover: System.enqueueJob ]
               │
               ▼
[ Queueable Apex Mesh: CaseRefundQueueable.cls ]
               │  (Database.AllowsCallouts)
               ├──► Updates Salesforce Case Record (Status = Processing)
               ├──► Executes Outbound Callout to Stripe Refund API
               │
               ▼ (On Failure or High Priority SLA Breach)
[ Incident Escalation: SlackAlertQueueable.cls ]
               │
               ▼
[ Slack Channel: #incident-alerts ] ──► (Interactive Block Kit Card Posted)
```

---

# 4. TOP 15 TECHNICAL QUESTIONS & DEFENSE

### Q1: "Why did you choose Queueable Apex instead of @future?"
* **English Answer**:  
  "While `@future` allows asynchronous callouts, it has three critical limitations: it only accepts primitive data types, returns void (meaning it cannot be tracked via an AsyncApexJob ID), and cannot chain jobs.  
  We chose **Queueable Apex** because it allows passing complex sObjects and custom typed objects, returns a Job ID for system monitoring, and supports sequential job chaining (`System.enqueueJob`)."
* **Desi Logic**: `@future` purana ho gaya hai, usme sirf string/int jata hai aur job ID track nahi hoti. `Queueable` modern hai, usme poora object pass hota hai aur job chain ki ja sakti hai.

---

### Q2: "How do you verify the authenticity of a Stripe Webhook in Apex?"
* **English Answer**:  
  "We never trust unverified webhook payloads. In `StripeWebhookResource`, we inspect the `Stripe-Signature` request header, which contains a timestamp (`t=`) and hash (`v1=`).  
  We concatenate the timestamp with the raw payload string, and compute an HMAC SHA-256 hash using Salesforce's `Crypto.generateMac('HmacSHA256', rawPayload, signingSecret)`.  
  If our computed signature matches the incoming `v1` signature, we process the event. Otherwise, we immediately return an `HTTP 401 Unauthorized`."
* **Desi Logic**: Stripe ek digital seal bhejta hai. Hum Salesforce ke `Crypto` tool se wahi seal calculate karke compare karte hain. Match hui toh andar aane do, warna 401 dekar bhaga do.

---

### Q3: "What is Idempotency, and why is it critical in payment webhooks?"
* **English Answer**:  
  "Idempotency means that making multiple identical requests has the same effect as making a single request.  
  Payment providers like Stripe implement automated retry policies if network latency delays the HTTP 200 response. Without idempotency, a customer could receive multiple refunds for the same dispute.  
  We enforce idempotency by storing Stripe's unique `event_id` in a unique, indexed custom field (`Stripe_Event_ID__c`). Before executing refund logic, we perform a SOQL check: if the event ID already exists, we return HTTP 200 immediately and skip re-execution."
* **Desi Logic**: Network slow hone par Stripe ek hi request 2 baar bhej sakta hai. Agar hum check nahi karenge toh customer ke account mein 2 baar refund chala jayega! Isliye hum unique event ID check karte hain.

---

### Q4: "How do you prevent 'System.CalloutException: You have uncommitted work pending'?"
* **English Answer**:  
  "Salesforce prohibits executing an HTTP callout after a DML statement has been executed within the same transaction context.  
  In our architecture, we prevent this by strictly separating the database trigger from the callout. The trigger merely validates the record and enqueues our `CaseRefundQueueable` or `SlackAlertQueueable` job. The Queueable worker runs in an independent asynchronous context with `Database.AllowsCallouts`, allowing it to perform callouts cleanly before committing status changes."
* **Desi Logic**: Salesforce ka rule hai ki database mein save karne ke baad direct API callout nahi kar sakte. Hum trigger mein sirf Queueable job daal kar khatam kar dete hain, aur Queueable alag thread mein bina kisi error ke callout karta hai.

---

### Q5: "How do you securely store API keys and Webhook secrets?"
* **English Answer**:  
  "We enforce zero hardcoded credentials in Apex.  
  For outbound integrations like Slack and Stripe, we use Salesforce **Named Credentials** and **External Credentials**. Named Credentials handle endpoint URLs and encrypted authentication headers seamlessly, removing credentials from debug logs. For webhook signing secrets, we store them in **Protected Custom Metadata Types**, which are accessible only to our Apex code and hidden from package inspection."
* **Desi Logic**: Code mein password likhna sabse badi galti hai. Hum Salesforce ki tijori—Named Credentials aur Custom Metadata use karte hain.

---

### Q6: "What happens if Stripe or Slack API is temporarily down (HTTP 500 or Timeout)?"
* **English Answer**:  
  "Our Queueable workers implement a structured resilience pattern with exponential backoff.  
  If an HTTP 5xx or `System.CalloutException` occurs, we log the failure to an `Integration_Incident__c` record with the status code and payload. If the retry count is under our threshold (e.g., 3 attempts), the worker enqueues a delayed retry job (`System.enqueueJob`). If max retries are exceeded, it escalates the Case priority to 'Critical' for manual triage."
* **Desi Logic**: Agar Stripe so raha hai, toh code crash nahi hota. Hum error log karte hain, 2 second rukte hain, dubara koshish karte hain, aur max fail hone par Case ko Critical mark kar dete hain.

---

### Q7: "How do you unit-test HTTP Callouts in Apex?"
* **English Answer**:  
  "Salesforce blocks real network HTTP calls during test executions. We implement the `HttpCalloutMock` interface.  
  In `StripeServiceTest` and `SlackAlertServiceTest`, we create mock responder classes implementing `respond(HTTPRequest req)`. We simulate multiple scenarios:  
  1. **Positive scenario**: Returning HTTP 200 with payment intent status `succeeded`.  
  2. **Negative scenario**: Returning HTTP 402 with error `card_declined`.  
  This achieves 100% test code coverage and ensures robust error handling under all conditions."
* **Desi Logic**: Testing ke waqt live internet use nahi kar sakte, isliye hum `HttpCalloutMock` se fake response banate hain aur success aur error dono test karte hain.

---

### Q8: "How does your Complaint Service prioritize customer SLAs?"
* **English Answer**:  
  "In `ComplaintService.cls`, we implement a tiered SLA matrix. Based on the Account's rating (Gold, Silver, Standard), the service automatically calculates the `Target_Resolution_Date__c`. For Gold partners, SLA is 4 hours; for Standard, it's 24 hours. If an SLA is breached or Stripe payment fails, the service invokes the Slack escalation queueable."
* **Desi Logic**: VIP Gold customer ko 4 ghante mein response milna chahiye, normal ko 24 ghante mein. Code customer ke level ke hisaab se automatic time set karta hai.

---

### Q9: "Why did you build the Next.js Live Studio instead of a standard portfolio?"
* **English Answer**:  
  "Most Salesforce portfolios consist of static resumes or Trailhead badges. I wanted to give enterprise clients an interactive runtime environment.  
  The Next.js lab connects to our architecture specification, allowing architects to simulate inbound Stripe webhooks, visualize HMAC verification results, view real-time Slack Block Kit layouts, and monitor Governor Limit headroom live in their browser."
* **Desi Logic**: Screenshots sab dikhaate hain. Humne live simulator bana kar dikhaya taaki client khud button daba kar dekhe ki system actual mein kaam karta hai.

---

### Q10: "How do you handle bulkification when 200 Cases are inserted simultaneously?"
* **English Answer**:  
  "Our trigger handler processes all records in bulk collections (`List<Case>` and `Set<Id>`). We execute zero SOQL queries or DML operations inside `for` loops.  
  For Queueable execution, Salesforce limits enqueueing up to 50 jobs per synchronous transaction. When bulk ingestion occurs, we bundle the records into batch payloads and pass the entire list to a single Queueable worker rather than enqueueing one job per record."
* **Desi Logic**: Loop ke andar SOQL/DML kabhi nahi lagate. Ek-ek karke 200 job nahi bhejte, 200 records ko ek hi packet mein daal kar ek Queueable worker ko thama dete hain.

---

### Q11: "What are Named Credentials and why are they superior to Remote Site Settings?"
* **English Answer**:  
  "Remote Site Settings only whitelist an endpoint domain for callouts, but require handling authentication tokens manually in Apex code.  
  **Named Credentials** specify both the callout endpoint URL and the required authentication parameters in one definition. Salesforce automatically manages the auth headers (OAuth, API keys, Basic Auth), encrypts credentials, and allows referring to the endpoint via `callout:My_Named_Credential`."
* **Desi Logic**: Remote Site Settings sirf darwaza kholta hai par chabi code me rakhni padti hai. Named Credentials darwaza bhi kholta hai aur chabi bhi apne andar surakshit rakhta hai.

---

### Q12: "Can you chain Queueable jobs indefinitely?"
* **English Answer**:  
  "In Developer Edition and Scratch Orgs, Salesforce imposes a limit on job chaining, but in Production orgs, there is no depth limit for chaining jobs from an asynchronous context. However, each chained job must be enqueued individually (`System.enqueueJob(new NextWorker())`) from the `execute` method of the current job."
* **Desi Logic**: Ek Queueable worker apna kaam khatam karke agle Queueable worker ko start kar sakta hai. Isko job chaining kehte hain.

---

### Q13: "What is Slack Block Kit and why use it over plain text messages?"
* **English Answer**:  
  "Slack Block Kit is a UI framework for building interactive, rich messages in Slack.  
  Instead of sending unformatted strings, Block Kit allows structuring alerts with visual hierarchy: Header blocks, Section blocks with markdown key-value pairs (Case Number, Amount, Customer Tier), Dividers, and Action buttons (such as 'Approve Refund' or 'Open Case in Salesforce'). This allows support engineers to take immediate action directly from Slack."
* **Desi Logic**: Plain text boring lagta hai. Block Kit se message ek sundar app card jaisa dikhta hai jisme button bhi hote hain.

---

### Q14: "How do you monitor asynchronous jobs in production?"
* **English Answer**:  
  "When `System.enqueueJob` is called, it returns a 15-character `AsyncApexJob` ID.  
  We can query the status of this job in real time using SOQL:  
  `SELECT Id, Status, NumberOfErrors, ExtendedStatus FROM AsyncApexJob WHERE Id = :jobId`.  
  Additionally, Salesforce provides the Apex Jobs page in Setup for visual monitoring."
* **Desi Logic**: Har background worker ka ek token number (Job ID) hota hai. Hum SOQL query se check kar sakte hain ki worker ka status 'Completed' hai ya 'Failed'.

---

### Q15: "What is your testing strategy for this enterprise integration?"
* **English Answer**:  
  "We adopt a Test Data Factory pattern where test records (Accounts, Cases, Contacts) are generated programmatically without relying on `SeeAllData=true`.  
  We test both boundary conditions and negative paths using mock classes: valid webhooks, corrupted signatures, expired payment intents, and external timeouts. All our test classes achieve over 90% coverage with strict assertions (`System.assertEquals`)."
* **Desi Logic**: Hum real database ka data use nahi karte, test ke andar fresh fake data banate hain, har tareeqe ki error condition test karte hain, aur 90%+ code coverage maintain karte hain.

---

# 5. BEHAVIORAL & SYSTEM DESIGN QUESTIONS

### "What was the biggest technical challenge you faced on this project?"
* **Answer**:  
  "The biggest challenge was handling high-volume webhook bursts without hitting Salesforce Governor Limits. Initially, processing webhook payloads synchronously in the REST resource risked hitting the 10-second CPU time limit and DML row limits.  
  I solved this by redesigning the architecture into an asynchronous decoupled mesh: the REST resource only verifies the HMAC signature and writes an immutable staging log, immediately returning HTTP 200 to Stripe within 150 milliseconds. The actual refund and case logic is then picked up by our Queueable worker. This eliminated all timeout bottlenecks."

---

### "If this system had to scale to 500,000 transactions per day, what would you change?"
* **Answer**:  
  "At 500k transactions per day, Queueable execution limits (50 enqueues per transaction) would need to evolve.  
  I would transition the ingestion tier to **Salesforce Platform Events** and **Pub/Sub API**. Inbound webhooks would publish high-throughput Platform Events (which support millions of events daily). A subscriber trigger or headless worker would then process events in optimized batches of 2,000 records, maximizing throughput without exceeding multi-tenant thresholds."

---

# 6. LIVE SCREEN-SHARE DEMO SCRIPT
*(Jab client bole: "Umendra, show me your screen and walk me through your live lab")*

### Step 1: Open the Live Studio
* Go to: `https://salesforce-developer-lab.vercel.app/studio`
* **What to say**: *"Here is our live runtime studio. It simulates our complete 4-tier Salesforce architecture in real time."*

### Step 2: Click on "Stripe FinTech Gateway"
* Click **"Test Webhook"** or **"Simulate Refund"**
* **What to say**: *"Notice here how the payload is serialized. When Stripe fires the event, Salesforce checks the HMAC SHA-256 signature against our signing secret. If valid, the Queueable worker executes the async refund callout."*

### Step 3: Click on "Slack Incident Escalation"
* Click **"Simulate Case Escalation"**
* **What to say**: *"When a high-priority SLA breach occurs, our SlackAlertService builds this exact Slack Block Kit JSON and posts it to the engineering channel via Named Credentials. The support team gets instant visibility."*

### Step 4: Show the Blueprint PDF
* Open: `https://salesforce-developer-lab.vercel.app/salesforce-architecture-blueprint.pdf`
* **What to say**: *"This is our complete architectural blueprint detailing the Presentation Layer, Business Domain, Asynchronous Mesh, and External Gateways."*

---

# 7. THE EMERGENCY LIFELINE
*(Agar client koi aisi cheez pooch le jo aapko bilkul na aati ho, toh ghabraaye bina yeh bolna hai)*:

> **"That is an excellent point. In our current architecture, our core focus was on cryptographic webhook security and asynchronous queueable resilience. I haven't implemented that specific pattern in this version, but based on Salesforce architectural standards, I would review the official documentation and have a working prototype ready in a scratch org within an hour."**

*(Is line ko sunkar client samajhta hai ki banda honest hai, confident hai, aur problem solver hai!)*
