# Salesforce Developer Mastery — Comprehensive Milestone & Knowledge Vault

> **Developer:** Junior Salesforce Admin + Developer Candidate  
> **Mentor:** Senior Salesforce Architect & Developer  
> **Capstone Project:** Customer Complaint & Support Management System (_NexGen Cloud Solutions_)  
> **Repository:** `~/Desktop/salesforce/personal/salesforce-developer-lab`  
> **Connected Org:** `personal-dev`  
> **Last Updated:** October 31, 2026

---

## 📑 Table of Contents

1. [Core Learning Philosophy & Architecture Rules](#1-core-learning-philosophy--architecture-rules)
2. [Deep Architectural Concepts: The "Kyu" & "Kaise" (Why & How)](#2-deep-architectural-concepts-the-kyu--kaise-why--how)
3. [Senior Dev Gotchas & Compiler Quirks Debugged Live](#3-senior-dev-gotchas--compiler-quirks-debugged-live)
4. [Exhaustive Interview Question Bank (All 16+ Core Questions with Exact Answers)](#4-exhaustive-interview-question-bank-all-16-core-questions-with-exact-answers)
5. [Complete Repository Metadata & Practice Code Inventory](#5-complete-repository-metadata--practice-code-inventory)
6. [Phase-by-Phase Roadmap & What Lies Ahead (Topics 10 to 30)](#6-phase-by-phase-roadmap--what-lies-ahead-topics-10-to-30)

---

## 1. Core Learning Philosophy & Architecture Rules

In enterprise software engineering, senior developers follow these non-negotiable rules:

1. **Never Assume — Always Verify:** We never claim a feature, rule, or query works until we observe verified execution evidence in logs or CLI query results.
2. **Type 100% of the Code:** True developer muscle memory comes from writing brackets, semicolons, data types, and loop constructs by hand.
3. **Understand the "Why" Before the "How":** Any developer can copy-paste syntax; an employable engineer knows the architectural tradeoffs (memory, CPU, security, limits).
4. **Persistent Documentation:** Every lesson, interview scenario, and bug fix is preserved in our version-controlled project repository (`INDEX.md`, `INTERVIEW_PREP.md`, `LEARNING_REPORT.md`).

---

## 2. Deep Architectural Concepts: The "Kyu" & "Kaise" (Why & How)

### A. Multitenant Architecture & Governor Limits

- **The "Kyu" (Why does it exist?):**  
  Salesforce does not allocate a dedicated server to each company. Imagine a luxury apartment high-rise: thousands of tenants share the same electrical wiring, water pressure, and elevators. If one tenant tries to run a massive industrial factory in their apartment, all other tenants experience water or power shortages.  
  In Salesforce, multiple companies (tenants) share the same Oracle/Postgres database cluster and JVM servers. To prevent one company's rogue infinite loop or unoptimized code from consuming 100% CPU or memory, Salesforce enforces strict, non-negotiable runtime limits.
- **The "Kaise" (How do we design for it?):**  
  We adhere strictly to **Bulkification**:
  - Max 100 SOQL queries per transaction $\rightarrow$ Collect IDs in a `Set<Id>` and run a single SOQL query outside loops.
  - Max 150 DML statements per transaction $\rightarrow$ Accumulate records in a `List<sObject>` and execute a single DML statement outside loops.
  - Max 10,000 ms CPU timeout $\rightarrow$ Use `Map<Id, sObject>` for $O(1)$ constant-time in-memory lookups instead of nested $O(N^2)$ loops.
  - Max 6 MB synchronous heap size $\rightarrow$ Use SOQL For-Loops (`for (List<sObject> batch : [SELECT ...])`) to stream records in 200-record chunks.

---

### B. Standard CRM Data Model & Prefixes

- **The 3-Character Prefixes:**  
  Every Salesforce object has a globally unique 3-character prefix:
  - `001` = `Account` (Enterprise/B2B client or B2C person)
  - `003` = `Contact` (Individual person working at an Account)
  - `500` = `Case` (Support issue, complaint ticket, inquiry)
- **15 vs 18 Character Record IDs:**
  - **15-character IDs** are case-sensitive (`001Qy00002Q0PkoIAF`).
  - **18-character IDs** append 3 checksum characters to the end. Why? Non-case-sensitive external software (like Microsoft Excel, Access, SQL Server) treats lowercase and uppercase letters as identical, which would corrupt 15-character IDs. The 18-character version makes the ID safe for any external system.

---

### C. Relationship Traversal: Child-to-Parent vs Parent-to-Child

- **Child-to-Parent (Upwards Traversal ⬆️):**
  - _Syntax:_ Dot Notation (`Case.Account.Name`, `Complaint_Action_Item__c.Case__r.Subject`).
  - _Depth Limit:_ Can traverse **up to 5 levels up** (e.g., `Contact.Account.Owner.Manager.Profile.Name`).
  - _Custom Naming Rule:_ Lookup/Master-Detail foreign key field ends with `__c` (holds the ID), but traversing into its fields requires **`__r`** (relationship pointer).
- **Parent-to-Child (Downwards Traversal ⬇️):**
  - _Syntax:_ Subqueries inside parentheses: `(SELECT Id, LastName FROM Contacts)`.
  - _Depth Limit:_ Strictly **1 level down only**. Nested subqueries inside a subquery are forbidden by the compiler.
  - _Custom Naming Rule:_ Child relationship name appends **`__r`** (e.g., `(SELECT Id, Action_Title__c FROM Complaint_Action_Items__r)`).

---

### D. Collections Taxonomy: List vs Set vs Map

- **`List<T>` (The Workhorse):**  
  Ordered, index-based, permits duplicates. Best for preparing records for bulk database operations (`insert caseList;`).
- **`Set<T>` (The Deduplicator & SOQL Optimizer):**  
  Unordered, guarantees strictly unique elements, provides $O(1)$ fast membership checking via `.contains()`. Essential for collecting parent IDs to pass into `WHERE Id IN :setOfIds`.
  > _Apex Gotcha:_ `Set<String>` is **Case-Sensitive** (`'High'` $\neq$ `'HIGH'`), but `Set<Id>` is **Case-Insensitive**!
- **`Map<Key, Value>` (The Developer King):**  
  Pairs unique keys with values. Allows instant $O(1)$ memory retrieval via `map.get(key)`. Completely eliminates nested loops in bulk processing.
  > _Apex Power Feature:_ Passing an inline SOQL query directly into a Map constructor automatically maps Record ID $\rightarrow$ Full Record:
  >
  > ```apex
  > Map<Id, Account> accMap = new Map<Id, Account>([SELECT Id, Name FROM Account]);
  > ```

---

## 3. Senior Dev Gotchas & Compiler Quirks Debugged Live

### 1. The Terminal Table Word-Wrap Issue

- **What happened:** Querying an Account ID in the terminal wrapped characters across narrow columns (`00`, `1Q`, `y0`...), causing accidental insertion of an extra zero (`001Qy000002...` instead of `001Qy00002...`).
- **Compiler Error:** `id value of incorrect type`.
- **Senior Solution:** Never rely on manual visual copying from wrapped CLI tables. Use `--json` flag to extract clean strings.

### 2. Master-Detail Security Dependencies in Permission Sets

- **What happened:** Deploying `Complaint_Management_Admin` threw: `Permission Read Complaint_Action_Item__c depends on permission(s): Read Case`.
- **Root Cause:** In Master-Detail relationships, child security is `ControlledByParent`. A user cannot hold Read or View All permissions on a child record unless they have identical permissions on the Master object.
- **Senior Solution:** Granted explicit standard CRUD permissions on `Case` in the Permission Set.

### 3. Schema-Required Fields Prohibit FLS in Metadata

- **What happened:** Deploying a Permission Set with `Action_Title__c` threw: `You cannot deploy to a required field: Complaint_Action_Item__c.Action_Title__c`.
- **Root Cause:** When `<required>true</required>` is set at the database schema level, Salesforce forces the field to be visible and editable for every user who can access the object. Declaring Field-Level Security (`fieldPermissions`) for it in a Permission Set is illegal.
- **Senior Solution:** Removed the `fieldPermissions` block for all schema-required fields.

### 4. Recalculation Bug on Case Update

- **What happened:** Unit test `testSlaAssignmentOnCategoryUpdate` failed with `Expected: 4, Actual: 24`.
- **Root Cause:** The handler had `if (c.Resolution_SLA_Hours__c == null)`. When updating a Case that already had an SLA of 24 hours, the field wasn't null, so the new category SLA wasn't applied.
- **Senior Solution:** Updated `CaseTriggerHandler` to verify if category changed and reset `Resolution_SLA_Hours__c = null` so the new category SLA recalculates.

### 5. Static Members Forbidden in Inner Classes

- **What happened:** Running an OOP class in Anonymous Apex threw: `static can only be used on fields of a top level type`.
- **Root Cause:** Anonymous Apex runs inside an internal runner method (`execute_anonymous_apex`), making all declared classes Inner Classes. In Apex, `static` members can only exist in top-level standalone `.cls` files.
- **Senior Solution:** Converted static members to instance variables in scripts.

---

## 4. Exhaustive Interview Question Bank (All 16+ Core Questions with Exact Answers)

### 🎯 Q1: Why should you never write logic directly inside an Apex Trigger? Why use the Trigger Handler Pattern?

> _"In Salesforce architecture, putting business logic directly inside a trigger is an anti-pattern. We always adhere to the **One Trigger Per Object** and **Trigger Handler Pattern** for four primary reasons:_
>
> 1. _Execution Order: When multiple triggers exist on one object, Salesforce does not guarantee execution order. A single trigger delegating to a handler ensures complete deterministic control._
> 2. _Separation of Concerns & Reusability: Logic in triggers cannot be invoked from LWC, Batch Apex, or other classes. Moving logic to Handlers/Services enables full reusability._
> 3. _Recursion Control: Handlers enable static variables/sets to prevent recursive execution loops on update._
> 4. _Testability: Handlers allow unit testing individual business methods without always performing heavy database DML._
>    _For example, in our Customer Complaint Management System, `CaseTrigger` only routes events to `CaseTriggerHandler`, which delegates to `ComplaintService` for SLA calculations."_

---

### 🎯 Q2: What is the difference between `with sharing`, `without sharing`, and `inherited sharing`?

> _"`with sharing` enforces the current user's record-level sharing rules, OWD, and role hierarchy. Queries return only records the user has access to._  
> _`without sharing` executes in System Mode, bypassing sharing rules and accessing all records regardless of ownership._  
> _`inherited sharing` dynamically inherits the sharing model of the caller. It is the architectural best practice for utility classes and LWC controllers to prevent unintended security leaks."_

---

### 🎯 Q3: Why does Salesforce have Governor Limits, and how do you handle them?

> _"Salesforce runs on a multitenant cloud architecture where shared hardware and memory are utilized across multiple organizations. To prevent runaway transactions from starving shared resources, Salesforce enforces strict limits (e.g., 100 SOQL queries, 150 DML statements)._  
> _We handle limits through **Bulkification**: never placing SOQL or DML inside loops, collecting IDs in `Set<Id>`, using `Map<Id, sObject>` for $O(1)$ lookups, and committing data in bulk `List<sObject>`."_

---

### 🎯 Q4: Why is `!list.isEmpty()` preferred over `list.size() > 0`?

> _"Performance and intent. `.isEmpty()` evaluates the memory pointer in $O(1)$ constant time without iterating through elements, whereas `.size()` must calculate the total count. Both throw `NullPointerException` if the list itself is null, so defensive code checks: `if (myList != null && !myList.isEmpty())`."_

---

### 🎯 Q5: What causes `System.ListException: List index out of bounds` and how do you prevent it?

> _"It occurs when code accesses an index position that does not exist in the collection (e.g., calling `.get(5)` on a 3-item list). We prevent this by using standard for-each loops or wrapping index access in boundary checks: `if (index >= 0 && index < myList.size())`."_

---

### 🎯 Q6: How do `List` and `Set` differ, and how do you deduplicate a List?

> _"A `List` is an ordered, index-based collection permitting duplicates (used for bulk DML). A `Set` is an unordered collection of strictly unique elements providing $O(1)$ membership lookups via `.contains()`._  
> _To deduplicate any list in one line:_
>
> ````apex
> List<String> cleanList = new List<String>(new Set<String>(duplicateList));
> ```"
> ````

---

### 🎯 Q7: Why is `Map<Id, sObject>` the cornerstone of bulkification?

> _"It eliminates nested loops. If matching 200 Cases to parent Accounts, nested loops require $200 \times 200 = 40,000$ iterations, threatening CPU timeouts. Querying Accounts directly into a Map allows instant $O(1)$ lookup via `accountMap.get(caseRecord.AccountId)` in 200 iterations total."_

---

### 🎯 Q8: What is the Safe Navigation Operator (`?.`)?

> _"It short-circuits evaluation if the expression on the left is null, safely returning null rather than throwing `System.NullPointerException`. It transforms `String name = (c != null && c.Account != null) ? c.Account.Name : null;` into `String name = c?.Account?.Name;`."_

---

### 🎯 Q9: What is a SOQL For-Loop, and why is it essential for Heap Size?

> _"It streams query results in automatic **200-record batch chunks**:_
>
> ```apex
> for (List<Case> chunk : [SELECT Id FROM Case]) { ... }
> ```
>
> _Loading 50,000 records into a single list consumes the 6 MB synchronous heap size limit. SOQL For-Loops flush memory between chunks, enabling large data volume processing without crashes."_

---

### 🎯 Q10: Can an Inner Class contain `static` variables or methods?

> _"No. In Apex, static variables, methods, and initializers are strictly permitted on top-level classes only. Inner classes cannot contain static members."_

---

### 🎯 Q11: What are the fundamental differences between SQL and SOQL?

> _"1. No `SELECT *`: Wildcards are prohibited to preserve multitenant memory. Every column must be explicitly named._  
> _2. No arbitrary `JOIN` operations: Traversal is strictly relationship-driven (Parent-to-Child via subqueries or Child-to-Parent via dot notation)._  
> _3. Read-Only: SOQL only retrieves data. Modifications use Apex DML._  
> _4. Built-in Date Literals: Provides relative date filters like `TODAY`, `YESTERDAY`, and `LAST_N_DAYS:30`."_

---

### 🎯 Q12: What are the limits and syntax rules for relationship queries in SOQL?

> _"Child-to-Parent queries use dot notation (e.g., `Contact.Account.Name` or `Custom__c.Parent__r.Name`) and can traverse **up to 5 levels up**. Parent-to-Child queries use subqueries referencing the child relationship name (e.g., `(SELECT LastName FROM Contacts)`) and can only traverse **1 level down**."_

---

### 🎯 Q13: How do `WHERE` and `HAVING` differ, and what do aggregates return in Apex?

> _"`WHERE` filters individual rows prior to aggregation. `HAVING` filters aggregated metrics after grouping._  
> _In Apex, aggregate queries return **`List<AggregateResult>`**. Field values cannot be accessed via dot notation and must be extracted using `(Type) ar.get('alias')`."_

---

### 🎯 Q14: DML Statement vs Database Methods (`Database.insert(records, false)`): What is the difference?

> _"A regular DML statement (`insert list;`) is strictly atomic (All or None). If a single record violates a validation rule, the entire batch of 200 records is rolled back and an unhandled `DmlException` is thrown._  
> _In contrast, `Database.insert(list, false)` allows **partial processing** (`allOrNone = false`). Valid records commit successfully, and failed records return descriptive error messages in a `Database.SaveResult[]` array without stopping execution."_

---

### 🎯 Q15: How does `upsert` determine whether to create or update a record?

> _"`upsert` checks whether the sObject instance has an `Id` populated or matches a custom field marked as an **External ID**. If a match exists in the database, it executes an `update`; otherwise, it executes an `insert`."_

---

### 🎯 Q16: What is SOSL and how does it differ from SOQL?

> _"SOQL queries a single sObject at a time and retrieves specific fields based on criteria. SOSL (Salesforce Object Search Language) searches text, email, and phone fields across **multiple unrelated objects simultaneously** using search indexes (e.g., `FIND 'Acme*' IN ALL FIELDS RETURNING Account(Name), Contact(LastName)`). SOSL is used when the exact object or field holding the keyword is unknown."_

---

## 5. Complete Repository Metadata & Practice Code Inventory

All practice scripts are self-contained in your local repository:

```text
salesforce-developer-lab/
├── INDEX.md                        <-- The 30-topic master serial syllabus
├── INTERVIEW_PREP.md               <-- Master Interview Q&A Bank
├── LEARNING_REPORT.md              <-- This Comprehensive Architectural Knowledge Vault
├── force-app/main/default/
│   ├── classes/
│   │   ├── ComplaintService.cls
│   │   ├── CaseTriggerHandler.cls
│   │   └── ComplaintServiceTest.cls
│   ├── triggers/
│   │   └── CaseTrigger.trigger
│   ├── flows/
│   │   └── Case_On_High_Priority_Create_Action_Item.flow-meta.xml
│   ├── objects/
│   │   ├── Case/
│   │   └── Complaint_Action_Item__c/
│   ├── permissionsets/
│   │   └── Complaint_Management_Admin.permissionset-meta.xml
│   └── tabs/
│       └── Complaint_Action_Item__c.tab-meta.xml
└── scripts/
    ├── apex/
    │   ├── 01_apex_basics.apex
    │   ├── 02_list_mastery.apex
    │   ├── 03_set_mastery.apex
    │   ├── 04_map_mastery.apex
    │   ├── 05_control_flow.apex
    │   ├── 06_oops_mastery.apex
    │   └── 10_dml_mastery.apex
    └── soql/
        ├── 07_soql_basics.soql
        ├── 08_soql_relationships.soql
        └── 09_soql_aggregates.soql
```

---

## 6. Phase-by-Phase Roadmap & What Lies Ahead (Topics 10 to 30)

| Topic #      | Phase                     | Topic Name                                   | Practical Deliverable                                                  | Status          |
| :----------- | :------------------------ | :------------------------------------------- | :--------------------------------------------------------------------- | :-------------- |
| **Topic 10** | **Phase B Finale**        | DML Operations & Database Methods            | `scripts/apex/10_dml_mastery.apex` (Partial success & SaveResult)      | **COMPLETED**   |
| **Topic 11** | **Phase C: Triggers**     | Governor Limits & Bulkification Architecture | The Gold-Standard Set + Map Bulk Pattern                               | **NEXT TARGET** |
| **Topic 12** | **Phase C: Triggers**     | Trigger Events & Context Variables           | Deep dive into `Trigger.new`, `Trigger.oldMap`, `isInsert`, `isUpdate` |
| **Topic 13** | **Phase C: Triggers**     | Enterprise Trigger Handler Architecture      | One-trigger pattern & Static Set recursion prevention                  |
| **Topic 14** | **Phase C: Triggers**     | Exception Handling & Savepoints              | Custom exceptions, `try-catch-finally`, `Database.rollback()`          |
| **Topic 15** | **Phase D: Async Apex**   | `@future` Methods & Queueable Apex           | Asynchronous callouts and job chaining                                 |
| **Topic 16** | **Phase D: Async Apex**   | Batch Apex & Schedulable Apex                | `Database.Batchable` for millions of records & cron schedules          |
| **Topic 17** | **Phase E: Testing**      | Apex Unit Testing Fundamentals               | `@isTest`, `Test.startTest()`, `Assert` assertions                     |
| **Topic 18** | **Phase E: Testing**      | `@TestSetup` & Test Data Factory             | Reusable `TestDataFactory` class                                       |
| **Topic 19** | **Phase E: Testing**      | Positive, Negative & Bulk Testing            | 200-record bulk validation & Governor limit assertion                  |
| **Topic 20** | **Phase E: Testing**      | Code Coverage & Deployment Gate              | Reaching 85%+ coverage & release readiness                             |
| **Topic 21** | **Phase F: LWC**          | LWC Architecture & ES6+ JavaScript           | Modern Web Components, Shadow DOM, HTML templates                      |
| **Topic 22** | **Phase F: LWC**          | Reactive Properties & Data Binding           | `@api` public contracts, `@track`, computed Getters                    |
| **Topic 23** | **Phase F: LWC**          | Component Communication                      | Custom Events (`dispatchEvent`) & Lightning Message Service (LMS)      |
| **Topic 24** | **Phase F: LWC**          | Lightning Data Service (LDS)                 | Zero-code `lightning-record-form` UI                                   |
| **Topic 25** | **Phase F: LWC**          | Wire Service (`@wire`) with Apex             | Connecting LWC UI to `@AuraEnabled(cacheable=true)` methods            |
| **Topic 26** | **Phase F: LWC**          | Imperative Apex & Toast Notifications        | On-click server execution & `ShowToastEvent` alerts                    |
| **Topic 27** | **Phase G: Visualforce**  | Visualforce Fundamentals                     | `<apex:page>`, standard controllers & actions                          |
| **Topic 28** | **Phase G: Visualforce**  | Custom Controllers & Extensions              | Controller extensions extending standard pages                         |
| **Topic 29** | **Phase H: Integrations** | REST API HTTP Callouts                       | `HttpRequest`, `HttpResponse`, JSON deserialization, Named Credentials |
| **Topic 30** | **Phase H: Integrations** | Custom Apex REST Web Services                | Exposing custom endpoints: `@RestResource`, `@HttpGet`, `@HttpPost`    |
