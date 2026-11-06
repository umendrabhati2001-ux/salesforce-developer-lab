# Salesforce Developer Mastery — Serial Index & Curriculum

Welcome to your structured, serial-wise Salesforce Developer syllabus. Every single topic is numbered sequentially. As we complete and verify each topic hands-on, we mark it as `[x] Completed`.

---

## 📌 Phase A: Core Apex Programming (Ground Zero)

- [x] **01. Apex Syntax & Data Types**
  - Primitive Types: `String`, `Integer`, `Decimal`, `Boolean`, `Date`, `DateTime`, `Id`
  - In-Memory `sObject` creation (`new Account()`)
  - `System.debug()` logging & Developer Console / CLI Log Inspection
  - Practice File: `scripts/apex/01_apex_basics.apex`
  - Status: **COMPLETED & VERIFIED**

- [x] **02. Collections: `List<T>` in Depth**
  - Ordered indexing, duplicates, `.add()`, `.get()`, `.size()`, `.sort()`, `.isEmpty()`
  - Safe navigation, defensive programming before loops
  - Practice File: `scripts/apex/02_list_mastery.apex`
  - Status: **COMPLETED & VERIFIED**

- [x] **03. Collections: `Set<T>` in Depth**
  - Unordered, strictly unique collections, `.contains()`, `.remove()`, `.addAll()`
  - Deduplication of lists, membership testing in $O(1)$ constant time
  - Practice File: `scripts/apex/03_set_mastery.apex`
  - Status: **COMPLETED & VERIFIED**

- [x] **04. Collections: `Map<Key, Value>` in Depth (The Developer King)**
  - Key-Value pairs, `.put()`, `.get()`, `.keySet()`, `.values()`, `.containsKey()`
  - Fast $O(1)$ memory lookup & eliminating nested loops
  - Practice File: `scripts/apex/04_map_mastery.apex`
  - Status: **COMPLETED & VERIFIED**

- [x] **05. Control Flow & Decision Logic**
  - `if`, `else if`, `else`, Ternary operators (`? :`)
  - Modern `switch on` / `when` statements in Apex
  - Safe null navigation (`?.`) operator & SOQL Batch Chunking
  - Practice File: `scripts/apex/05_control_flow.apex`
  - Status: **COMPLETED & VERIFIED**

- [x] **06. Object-Oriented Apex (OOPs)**
  - Classes, Objects, Constructors, Encapsulation, Method Overloading (Polymorphism)
  - Inner vs Top-Level class rules (`static` member restrictions)
  - Practice File: `scripts/apex/06_oops_mastery.apex`
  - Status: **COMPLETED & VERIFIED**

---

## 📌 Phase B: Database, SOQL & DML Operations

- [x] **07. SOQL Fundamentals**
  - `SELECT`, `FROM`, `WHERE`, `ORDER BY`, `LIMIT`, `OFFSET`
  - Logical operators (`AND`, `OR`, `IN`), Date Literals (`TODAY`, `LAST_N_DAYS:30`)
  - Differences between SQL and SOQL (No `SELECT *`, read-only)
  - Practice File: `scripts/soql/07_soql_basics.soql`
  - Status: **COMPLETED & VERIFIED**

- [x] **08. SOQL Relationship Queries**
  - Child-to-Parent Queries (Dot Notation: 5 levels up limit)
  - Parent-to-Child Queries (Subqueries: 1 level down limit)
  - Standard vs Custom Relationship naming (`__c` vs `__r`)
  - Practice File: `scripts/soql/08_soql_relationships.soql`
  - Status: **COMPLETED & VERIFIED**

- [x] **09. SOQL Aggregates & Grouping**
  - Aggregate Functions: `COUNT()`, `SUM()`, `AVG()`, `MIN()`, `MAX()`
  - `GROUP BY` and `HAVING` clauses, `AggregateResult` in Apex
  - Difference between row-filtering (`WHERE`) and aggregate-filtering (`HAVING`)
  - Practice File: `scripts/soql/09_soql_aggregates.soql`
  - Status: **COMPLETED & VERIFIED**

- [x] **10. DML Operations & Database Methods**
  - Basic DML: `insert`, `update`, `upsert`, `delete`, `undelete`
  - `Database.insert(records, false)` (Partial processing / `allOrNone = false`)
  - Inspecting `Database.SaveResult[]` for granular error capture
  - Savepoints & Rollbacks (`Database.setSavepoint()`, `Database.rollback()`)
  - Practice File: `scripts/apex/10_dml_mastery.apex`
  - Status: **COMPLETED & VERIFIED**

---

## 📌 Phase C: Architecture, Triggers & Governor Limits

- [x] **11. Governor Limits & Bulkification Architecture**
  - The 100 SOQL / 150 DML Rule
  - The Gold Standard: **Set + Map Bulk Pattern** (Zero SOQL/DML in loops)
  - CPU Timeout & Heap Size limits
  - Practice File: `scripts/apex/11_bulkification_pattern.apex`
  - Status: **COMPLETED & VERIFIED**

- [x] **12. Apex Triggers Fundamentals**
  - Trigger Events: `before insert`, `after insert`, `before update`, `after update`, `before delete`, `after delete`, `after undelete`
  - Trigger Context Variables: `Trigger.new`, `Trigger.old`, `Trigger.newMap`, `Trigger.oldMap`, `Trigger.isExecuting`
  - When to use `Before` vs `After` triggers
  - Practice File: `scripts/apex/12_trigger_fundamentals.apex`
  - Status: **COMPLETED & VERIFIED**

- [x] **13. Enterprise Trigger Handler Pattern**
  - One Trigger Per Object Rule
  - Separation of Concerns: Trigger vs Handler vs Service Layer
  - Preventing Recursion with Static Sets/Flags
  - Practice File: `scripts/apex/13_trigger_handler_pattern.apex`
  - Status: **COMPLETED & VERIFIED**

- [x] **14. Exception Handling & Transaction Control**
  - `try`, `catch`, `finally` blocks
  - Custom Exception classes (`public class MyException extends Exception {}`)
  - Database Savepoints & Rollbacks (`Database.setSavepoint()`, `Database.rollback()`)
  - Practice File: `scripts/apex/14_exception_handling_savepoints.apex`
  - Status: **COMPLETED & VERIFIED**

---

## 📌 Phase D: Asynchronous Apex (Heavy Computing)

- [x] **15. Future Methods & Queueable Apex**
  - `@future` methods (Primitive parameters only, Callouts in background)
  - `Queueable` Apex: Passing complex objects, Job ID tracking, Chaining jobs
  - System monitoring (`AsyncApexJob`)
  - Practice File: `scripts/apex/15_future_queueable_apex.apex`
  - Status: **COMPLETED & VERIFIED**

- [x] **16. Batch Apex & Schedulable Apex**
  - Processing 50,000+ to 50 Million records: `Database.Batchable` (`start`, `execute`, `finish`)
  - `Database.Stateful` for state retention across batches
  - Scheduling jobs with Cron expressions (`System.schedule()`)
  - Practice File: `scripts/apex/16_batch_schedulable_apex.apex`
  - Status: **COMPLETED & VERIFIED**

---

## 📌 Phase E: Apex Testing & Quality Assurance

- [x] **17. Apex Unit Testing Fundamentals**
  - Annotations: `@isTest`, `@TestVisible`, `seeAllData=false`
  - `Test.startTest()` & `Test.stopTest()` (Resetting governor limits)
  - Modern Assertions: `Assert.areEqual()`, `Assert.isTrue()`, `Assert.isNull()`
  - Practice File: `scripts/apex/17_unit_testing_fundamentals.apex`
  - Status: **COMPLETED & VERIFIED**

- [x] **18. `@TestSetup` & Test Data Factory**
  - Creating isolated test records efficiently
  - Building a reusable `TestDataFactory` class
  - Parameterized bulk creation with `doInsert` flags
  - Practice File: `scripts/apex/18_test_data_factory.apex`
  - Status: **COMPLETED & VERIFIED**

- [ ] **19. Positive, Negative & Bulk Unit Testing**
  - Testing happy path vs expected validation failures
  - 200-record bulk testing requirements

- [ ] **20. Code Coverage & Deployment Readiness**
  - Achieving 85%+ code coverage (Salesforce requires 75% minimum for production)
  - CLI test execution & XML report generation

---

## 📌 Phase F: Lightning Web Components (LWC)

- [ ] **21. LWC Core Architecture**
  - Web Components Standard, Shadow DOM, ES6+ JavaScript modules
  - Template syntax (`template if:true`, `template for:each`)

- [ ] **22. Reactive Properties & Data Binding**
  - `@api` (Public props / API contract)
  - `@track` vs Primitive reactivity
  - Conditional rendering & computed Getters

- [ ] **23. Component Communication**
  - Parent to Child: `@api` properties & methods
  - Child to Parent: Custom Events (`new CustomEvent('myevent')`, `this.dispatchEvent()`)
  - Sibling components: Lightning Message Service (LMS)

- [ ] **24. Lightning Data Service (LDS)**
  - Zero-code UI components: `lightning-record-form`, `lightning-record-view-form`, `lightning-record-edit-form`

- [ ] **25. Wire Service (`@wire`) with Apex**
  - Connecting LWC to Apex classes (`@AuraEnabled(cacheable=true)`)
  - Wire functions vs Wire properties

- [ ] **26. Imperative Apex & Toast Notifications**
  - Calling Apex methods imperatively on button click (`handleSave()`)
  - Displaying success/error toast alerts (`ShowToastEvent`)

---

## 📌 Phase G: Visualforce (VF) Essentials for Freshers

- [ ] **27. Visualforce Basics**
  - `<apex:page>`, Standard Controllers (`StandardController`)
  - Standard actions (`save`, `edit`, `cancel`) & Output components

- [ ] **28. Custom Controllers & Extensions**
  - Apex Custom Controller classes
  - Controller Extensions for extending standard pages

---

## 📌 Phase H: Integrations & Modern APIs

- [ ] **29. REST API Callouts**
  - `HttpRequest`, `HttpResponse`, `Http`
  - JSON Parsing & Deserialization (`JSON.deserializeUntyped()`, Typed Wrapper classes)
  - Named Credentials for secure authentication

- [ ] **30. Custom Apex REST Services**
  - Exposing Salesforce endpoints to external systems: `@RestResource(urlMapping='/complaints/*')`
  - `@HttpGet`, `@HttpPost`, `@HttpPut`
