# Salesforce Developer Mastery — Master AI Mentor Notes & Knowledge Vault

> **File Purpose:**  
> This file is the complete, official record of all pair-programming lectures, line-by-line code breakdowns, real-world bug fixes, and interview answers taught by the Senior Developer Mentor to the student (**Umendra Bhati**).  
> **Note for Future AI Assistants:**
>
> - Use natural **Hinglish (Roman English letters, NO Devanagari script)** for intuitive conceptual explanations.
> - Use formal **Professional English** for interview answers and technical architecture notes.
> - Ensure the student writes 100% of the code in VS Code.
> - Keep this file synchronized continuously after every topic.

---

## 📑 Table of Contents

1. [Student Profile, Environment & Capstone Architecture](#1-student-profile-environment--capstone-architecture)
2. [Phase 1 & 2: Real-World Admin, Metadata & Live Debugging Case Studies](#2-phase-1--2-real-world-admin-metadata--live-debugging-case-studies)
3. [Phase 5: Flow Automation Engine](#3-phase-5-flow-automation-engine)
4. [Phase 7 & 8: Enterprise Apex Service & Trigger Handler Architecture](#4-phase-7--8-enterprise-apex-service--trigger-handler-architecture)
5. [Taxonomy: The 7 Types of Apex Classes in Salesforce](#5-taxonomy-the-7-types-of-apex-classes-in-salesforce)
6. [Phase A: Core Apex Programming Lessons (Topics 01 to 06)](#6-phase-a-core-apex-programming-lessons-topics-01-to-06)
7. [Phase B: SOQL Database Queries & DML Mastery (Topics 07 to 10)](#7-phase-b-soql-database-queries--dml-mastery-topics-07-to-10)
8. [Master Interview Question & Word-for-Word Answer Bank](#8-master-interview-question--word-for-word-answer-bank)
9. [Remaining Roadmap (Topics 11 to 30)](#9-remaining-roadmap-topics-11-to-30)

---

## 1. Student Profile, Environment & Capstone Architecture

- **Developer:** Umendra Bhati (BCA Graduate, Aspiring Salesforce Developer)
- **Local Machine:** Ubuntu Linux with VS Code, Git, and Salesforce CLI
- **Repository:** `~/Desktop/salesforce/personal/salesforce-developer-lab`
- **Connected Org:** `personal-dev` (Default target set globally via `sf config set target-org=personal-dev --global`)
- **Capstone Application:** **Customer Complaint & Support Management System**
  - **Fictional Enterprise Client:** _NexGen Cloud Solutions_ (B2B Cloud Infrastructure & Hardware Provider)
  - **Core Business Problem:** Enterprise clients purchase high-performance routers and cloud servers. When systems go down, complaints must be logged, assigned target SLAs, investigated with action items, and validated before closure.

---

## 2. Phase 1 & 2: Real-World Admin, Metadata & Live Debugging Case Studies

### A. The Core Data Model (Account -> Contact -> Case -> Action Item)

- **`Account` (`001...`):** Represents client companies (e.g., `Acme Logistics Global`).
- **`Contact` (`003...`):** Represents client personnel (e.g., `Marcus Vance`, Director of IT).
- **`Case` (`500...`):** Standard object representing customer complaints.
- **`Complaint_Action_Item__c` (`a00...`):** Custom child object in a **Master-Detail Relationship** with `Case`. Holds investigation tasks.

---

### B. Live Debugging Case Studies Solved in Chat

#### Case Study 1: Terminal Table Word-Wrapping & Case-Sensitive IDs

- **Problem:** When querying `Acme Logistics Global`, the terminal table was narrow and wrapped the 18-character ID into 2-character rows (`00`, `1Q`, `y0`...). When copying, an extra zero was accidentally added (`001Qy000002...` instead of `001Qy00002...`), causing error `id value of incorrect type`.
- **Hinglish Explanation:** Salesforce ki IDs strictly case-sensitive hoti hain (small 'o' vs capital 'O'). Terminal table jab narrow hoti hai toh ID toot jati hai.
- **Senior Dev Fix:** Always run queries with the `--json` flag (`sf data query ... --json`) to get a clean, unwrapped JSON string.

#### Case Study 2: Missing `__c` on Custom Fields

- **Problem:** Running CLI command `sf data create record ... Status='Completed'` failed with: `No such column 'Status' on sobject of type Complaint_Action_Item__c`.
- **Hinglish Explanation:** Standard objects par fields `Status` hoti hain, lekin custom objects par custom fields ke aage hamesha `__c` lagana compulsory hota hai!
- **Senior Dev Fix:** Changed `Status='Completed'` to `Status__c='Completed'`.

#### Case Study 3: Master-Detail Security Cascade in Permission Sets

- **Problem:** Deploying `Complaint_Management_Admin.permissionset-meta.xml` failed with:  
  `Permission Read Complaint_Action_Item__c depends on permission(s): Read Case`  
  `Permission View All Complaint_Action_Item__c depends on permission(s): View All Case`.
- **Hinglish Explanation:** Master-Detail relationship me child object ki security `ControlledByParent` hoti hai. Salesforce ka strict rule hai ki jab tak user ke paas Parent (`Case`) ka Read/View All access nahi hoga, tab tak wo child ko access nahi kar sakta.
- **Senior Dev Fix:** Permission Set me `Case` object ke explicit CRUD permissions add kiye aur child se `viewAllRecords` aur `modifyAllRecords` ko clean standard access (`false`) par sync kiya.

#### Case Study 4: Universally Required Fields Prohibit FLS

- **Problem:** Permission Set deployment failed with: `You cannot deploy to a required field: Complaint_Action_Item__c.Action_Title__c`.
- **Hinglish Explanation:** Jab kisi custom field ko schema level par `<required>true</required>` banaya jata hai, toh wo database me har user ke liye automatically visible aur editable hoti hai. Isliye Permission Set ya Profile me uske liye alag se `<fieldPermissions>` likhna metadata rule ke mutabiq illegal hai!
- **Senior Dev Fix:** Removed the `<fieldPermissions>` block for `Action_Title__c`.

#### Case Study 5: Validation Rule Negative & Positive Testing

- **Validation Rule:** `Require_RCA_On_High_Priority_Close`
  - Formula: `AND(IsClosed, ISPICKVAL(Priority, "High"), ISBLANK(Root_Cause_Summary__c))`
- **Negative Test (Expected Failure):** Attempted to update Case to `Status = 'Closed'` without entering an RCA. Salesforce blocked it with: `Error: High Priority customer complaints require a Root Cause Summary before closing the case.`
- **Positive Test (Success):** Added `Root_Cause_Summary__c = 'Capacitor failure on primary power supply caused voltage drop.'` and updated status to `Closed`. Record saved successfully!

---

## 3. Phase 5: Flow Automation Engine

- **Metadata File:** `force-app/main/default/flows/Case_On_High_Priority_Create_Action_Item.flow-meta.xml`
- **Trigger:** Record-Triggered Flow on `Case` (`RecordAfterSave`, `CreateAndUpdate`).
- **Condition:** `Priority == 'High'` and `Status != 'Closed'`.
- **Automated Action:** Flow automatically creates a `Complaint_Action_Item__c` record:
  - `Action_Title__c` = `"Urgent: Initial RCA and Hardware Diagnostics Assessment"`
  - `Status__c` = `"In Progress"`
  - `Due_Date__c` = `$Flow.CurrentDate + 1` (Tomorrow)
  - `Case__c` = `{!$Record.Id}`
- **Verified via CLI:** Created a high-priority ticket via CLI; verified via SOQL that the Flow automatically generated the child action item and updated the Case roll-up summary to `Total_Action_Items__c = 1`.

---

## 4. Phase 7 & 8: Enterprise Apex Service & Trigger Handler Architecture

### A. The One-Trigger-Per-Object Architecture

1. **`CaseTrigger.trigger`:** Single lightweight trigger containing zero business logic. Only delegates events to `CaseTriggerHandler`.
2. **`CaseTriggerHandler.cls`:** Orchestrates execution, checks recursion, and calls domain services.
3. **`ComplaintService.cls`:** Business logic engine with dynamic SLA calculation:
   - _Cloud Downtime_ $\rightarrow$ 2 Hours
   - _Hardware Failure_ $\rightarrow$ 4 Hours
   - _Network Latency_ $\rightarrow$ 8 Hours
   - _Software Bug_ $\rightarrow$ 12 Hours
   - _Billing Dispute_ $\rightarrow$ 24 Hours

### B. Live Bug Fix: Trigger Category Recalculation

- **Bug:** Test class `testSlaAssignmentOnCategoryUpdate` failed with: `Expected: 4, Actual: 24`.
- **Root Cause:** When updating a Case that already had an SLA of 24 hours, `applySlaTargets` checked `if (c.Resolution_SLA_Hours__c == null)`. Since it was already 24, the field wasn't null, so the new category SLA (4 hours) was ignored.
- **Fix:** In `CaseTriggerHandler.handleBeforeUpdate`, added logic: if `Complaint_Category__c` changed and the SLA wasn't manually overridden, reset `c.Resolution_SLA_Hours__c = null` so the service recalculates the new SLA.
- **Bulk Testing:** `ComplaintServiceTest.cls` bulk test inserted 200 cases in a single transaction, executing in `3457ms` with **100% test pass rate and 100% trigger handler coverage**!

---

## 5. Taxonomy: The 7 Types of Apex Classes in Salesforce

In enterprise software engineering, developers separate classes into 7 distinct roles:

```text
1. Service / Domain Class   --> Holds pure business calculations (e.g., ComplaintService.cls).
2. Trigger Handler Class    --> Orchestrates before/after trigger events (e.g., CaseTriggerHandler.cls).
3. UI Controller Class      --> Connects LWC / Visualforce to backend using @AuraEnabled.
4. Asynchronous Class       --> Heavy background computing: Database.Batchable (millions of rows), Queueable.
5. Test Class               --> Quality gatekeeper annotated with @isTest (75% coverage requirement).
6. Wrapper / DTO Class      --> Custom container combining data from multiple objects into one UI packet.
7. REST Resource Class      --> Custom web API endpoints annotated with @RestResource for external apps.
```

---

## 6. Phase A: Core Apex Programming Lessons (Topics 01 to 06)

---

### 📌 Topic 01: Apex Syntax, Primitive Types & Debug Logs

#### 💬 Hinglish Mentor Explanation:

- Apex strongly-typed cloud language hai (har variable ka type batana compulsory hai).
- Case-insensitive hai (`Account`, `account`, `ACCOUNT` same hai).
- Single quotes `'...'` me strings aate hain, double quotes invalid hain.
- `sObject` Apex ka first-class native type hai (`new Account()`).
- Console me `USER_DEBUG` line me output dikhta hai aur `CUMULATIVE_LIMIT_USAGE` me governor limits ka scorecard.

#### 🌐 English Technical Explanation:

- Apex is a strongly-typed, cloud-compiled language executing within multitenant runtime boundaries.
- Native primitives: `String`, `Integer`, `Decimal`, `Boolean`, `Date`, `DateTime`, `Id`, and native `sObject` types.
- Governor limits tracking: Every anonymous execution prints `CUMULATIVE_LIMIT_USAGE` monitoring heap, CPU, SOQL, and DML.

#### 💻 Verified Code (`scripts/apex/01_apex_basics.apex`):

```apex
String developerName = 'Umendra Bhati';
Date today = Date.today();

Account techCompany = new Account();
techCompany.Name = 'NexGen Cloud Systems';
techCompany.Industry = 'Technology';

System.debug('--- HELLO FROM VS CODE ---');
System.debug('Developer: ' + developerName);
System.debug('Date: ' + today);
System.debug('Company: ' + techCompany.Name + ' (' + techCompany.Industry + ')');
```

---

### 📌 Topic 02: Collections — `List<T>` in Depth

#### 💬 Hinglish Mentor Explanation:

- List ek ordered array hai jo `0` index se start hoti hai aur duplicates allow karti hai.
- Agar `new List<String>()` nahi karoge toh variable `null` rahega aur `.add()` karte hi `NullPointerException` aayega.
- List me `list.size() > 0` ke bajaye hamesha `!list.isEmpty()` use karo kyunki `.isEmpty()` $O(1)$ fast check hota hai.

#### 🌐 English Technical Explanation:

- An ordered collection supporting duplicates and 0-based indexing.
- Essential methods: `.add()`, `.get(index)`, `.size()`, `.sort()`, `.isEmpty()`.
- Accessing an invalid index throws `System.ListException: List index out of bounds`.

#### 💻 Verified Code (`scripts/apex/02_list_mastery.apex`):

```apex
List<String> complaintPriorities = new List<String>();
complaintPriorities.add('High');
complaintPriorities.add('Critical');
complaintPriorities.add('Low');
complaintPriorities.add('Medium');
complaintPriorities.add('High'); // Duplicates allowed

System.debug('Total Elements in List: ' + complaintPriorities.size());
System.debug('Element at index 1: ' + complaintPriorities.get(1));

complaintPriorities.sort();
System.debug('Sorted List: ' + complaintPriorities);

if (!complaintPriorities.isEmpty()) {
    for (String priority : complaintPriorities) {
        System.debug('Priority Value: ' + priority);
    }
}
```

---

### 📌 Topic 03: Collections — `Set<T>` in Depth

#### 💬 Hinglish Mentor Explanation:

- Set ek unordered container hai jisme sirf **UNIQUE** items hote hain (duplicates automatic ignore hote hain).
- Isme index `0, 1` nahi hota, data For-Each loop se nikalta hai.
- `.contains()` method 5,000 items me se bhi $O(1)$ constant time (0.001 ms) me check karta hai.
- Ek line me list ke saare duplicates hatane ka tarika: `new Set<String>(duplicateList)`.
- _Gotcha:_ `Set<String>` case-sensitive hota hai, lekin `Set<Id>` case-insensitive hota hai!

#### 🌐 English Technical Explanation:

- An unordered collection of strictly unique elements.
- Provides $O(1)$ constant-time membership lookups via `.contains()`.
- Critical for SOQL bulkification: accumulating parent record IDs before querying `WHERE Id IN :mySet`.

#### 💻 Verified Code (`scripts/apex/03_set_mastery.apex`):

```apex
Set<String> complaintCategories = new Set<String>();
complaintCategories.add('Hardware Failure');
complaintCategories.add('Cloud Downtime');
complaintCategories.add('Network Latency');
complaintCategories.add('Hardware Failure'); // Automatically ignored!

System.debug('Total Unique Categories: ' + complaintCategories.size());
System.debug('Set Contents: ' + complaintCategories);

if (complaintCategories.contains('Cloud Downtime')) {
    System.debug('Critical Alert: Cloud Downtime is present in the set!');
}

List<String> duplicateLogs = new List<String>{'Error 404', 'Error 500', 'Error 404', 'Error 500'};
Set<String> uniqueLogs = new Set<String>();
uniqueLogs.addAll(duplicateLogs); // One-line deduplication

System.debug('Raw List Size with duplicates: ' + duplicateLogs.size());
System.debug('Clean Set Size without duplicates: ' + uniqueLogs.size());

for (String cat : complaintCategories) {
    System.debug('Category: ' + cat);
}
```

---

### 📌 Topic 04: Collections — `Map<Key, Value>` in Depth (The Developer King)

#### 💬 Hinglish Mentor Explanation:

- Map ek phone directory jaisa Key-Value pair hota hai (Keys unique hoti hain, Values duplicate ho sakti hain).
- Agar 200 Cases ke parent Accounts nikaalne ke liye loop ke andar loop chalayein, toh $200 \times 200 = 40,000$ iterations chalte hain (CPU timeout crash!).
- Map bana kar `accountMap.get(caseObj.AccountId)` se $O(1)$ instant lookup hota hai — zero CPU waste!
- SOQL Map constructor: `Map<Id, Account> accMap = new Map<Id, Account>([SELECT Id, Name FROM Account]);` automatically ID ko Key bana deta hai.

#### 🌐 English Technical Explanation:

- Key-Value collection where keys are strictly unique (`.keySet()` returns `Set<Key>`) and values can duplicate (`.values()` returns `List<Value>`).
- Primary bulkification mechanism to eliminate nested loops, reducing algorithmic complexity from $O(N^2)$ to $O(N)$.

#### 💻 Verified Code (`scripts/apex/04_map_mastery.apex`):

```apex
Map<String, Integer> categorySlaMap = new Map<String, Integer>();
categorySlaMap.put('Cloud Downtime', 2);
categorySlaMap.put('Hardware Failure', 4);
categorySlaMap.put('Network Latency', 8);
categorySlaMap.put('Software Bug', 12);

String incomingIssue = 'Cloud Downtime';
Integer targetSla = categorySlaMap.get(incomingIssue);
System.debug('Target SLA for [' + incomingIssue + ']: ' + targetSla + ' Hours');

String unknownIssue = 'Cyber Attack';
if (categorySlaMap.containsKey(unknownIssue)) {
    System.debug('SLA: ' + categorySlaMap.get(unknownIssue));
} else {
    System.debug('Issue [' + unknownIssue + '] not found in map! Falling back to 24hr default.');
}

System.debug('Total Keys in Map: ' + categorySlaMap.size());
System.debug('All Unique Keys (Set): ' + categorySlaMap.keySet());
System.debug('All Values (List): ' + categorySlaMap.values());

for (String category : categorySlaMap.keySet()) {
    Integer hours = categorySlaMap.get(category);
    System.debug('Category: ' + category + ' ===> Resolution Time: ' + hours + ' Hours');
}
```

---

### 📌 Topic 05: Control Flow, Decision Logic & Modern Operators

#### 💬 Hinglish Mentor Explanation:

- Ternary operator (`?:`): 5 line ka if-else ek line me assignment karta hai.
- Modern `switch on ... when`: Lambi `if-else if` chains ko clean karta hai aur comma se multiple values match karta hai.
- Safe Navigation Operator (`?.`): Agar koi parent record null hai, toh code crash hone ke bajaye chupchap `null` return karta hai, zero `NullPointerException`!
- SOQL For-Loop (`for (List<Case> chunk : [SELECT ...])`): 10,000 records ek sath memory me lane par 6 MB Heap Limit break ho sakti hai. Yeh data ko 200-200 ke chunks me stream karta hai.

#### 🌐 English Technical Explanation:

- Ternary syntax: `(condition) ? valueIfTrue : valueIfFalse`.
- Modern `switch on ... when` provides concise pattern matching with `when else` fallbacks.
- Safe navigation (`?.`) short-circuits null pointers.
- SOQL batch chunking streams records in 200-record chunks to prevent 6 MB heap size crashes.

#### 💻 Verified Code (`scripts/apex/05_control_flow.apex`):

```apex
String priority = 'Critical';
String dispatchTeam = (priority == 'Critical') ? 'Tier-3 Emergency Engineers' : 'Tier-1 General Support';
System.debug('Dispatch Assignment: ' + dispatchTeam);

String ticketCategory = 'Hardware Failure';
Integer slaTargetHours;

switch on ticketCategory {
    when 'Cloud Downtime' {
        slaTargetHours = 2;
    }
    when 'Hardware Failure' {
        slaTargetHours = 4;
    }
    when 'Network Latency', 'Software Bug' {
        slaTargetHours = 8;
    }
    when else {
        slaTargetHours = 24;
    }
}
System.debug('Category [' + ticketCategory + '] calculated SLA: ' + slaTargetHours + ' Hours');

Case orphanCase = new Case(Subject = 'Router Defect');
String parentAccountName = orphanCase?.AccountId;
System.debug('Safe Lookup Parent Account ID: ' + parentAccountName);

Integer totalProcessed = 0;
for (List<Case> caseBatch : [SELECT Id, Subject, Status FROM Case LIMIT 10]) {
    System.debug('Fetched Batch Chunk of size: ' + caseBatch.size());
    for (Case c : caseBatch) {
        totalProcessed++;
        System.debug('Processing Ticket #' + totalProcessed + ': ' + c.Subject);
    }
}
System.debug('Total Tickets Processed Safely: ' + totalProcessed);
```

---

### 📌 Topic 06: Object-Oriented Apex (OOPs) in Depth

#### 💬 Hinglish Mentor Explanation:

- 4 Pillars: Encapsulation (private fields), Inheritance (`virtual` keyword mandatory in Apex), Polymorphism (overloading/overriding), Abstraction (interfaces).
- **The Live Compiler Quirk:** Anonymous Apex me class banate waqt error aayi: `static can only be used on fields of a top level type`.
- _Why?_ Anonymous Apex background me ek runner method me chalta hai jisse class Inner Class ban jati hai. Apex me `static` members sirf aur sirf top-level standalone `.cls` files me allow hote hain!

#### 🌐 English Technical Explanation:

- Encapsulation hides state via private variables and public getters/methods.
- By default, all Apex classes are `final`. Classes and methods must explicitly be declared `virtual` or `abstract` to support inheritance.
- Static members can only be declared on top-level classes; inner classes cannot contain static variables or methods.

#### 💻 Verified Code (`scripts/apex/06_oops_mastery.apex`):

```apex
public class ComplaintTracker {
    public Integer totalComplaintsLogged = 0;
    private String ticketNumber;
    private String clientName;
    private String priority;
    private Integer slaHours;

    public ComplaintTracker(String clientName, String priority) {
        totalComplaintsLogged++;
        this.ticketNumber = 'TICK-' + totalComplaintsLogged;
        this.clientName = clientName;
        this.priority = priority;
        this.slaHours = calculateSla(priority);
    }

    public Integer calculateSla(String priority) {
        if (priority == 'Critical') return 2;
        if (priority == 'High') return 4;
        return 24;
    }

    public Integer calculateSla(String priority, Boolean isVipClient) {
        Integer baseSla = calculateSla(priority);
        return isVipClient ? (baseSla / 2) : baseSla;
    }

    public void printTicketDetails() {
        System.debug('Ticket [' + this.ticketNumber + '] | Client: ' + this.clientName +
                     ' | Priority: ' + this.priority + ' | Target SLA: ' + this.slaHours + ' Hours');
    }
}

ComplaintTracker ticket1 = new ComplaintTracker('Acme Logistics Global', 'Critical');
ticket1.printTicketDetails();

ComplaintTracker ticket2 = new ComplaintTracker('Standard Bank Corp', 'High');
ticket2.printTicketDetails();

Integer vipSla = ticket2.calculateSla('Critical', true);
System.debug('VIP Express SLA calculation test: ' + vipSla + ' Hour(s)');
System.debug('Ticket 2 Object Created Successfully!');
```

---

## 7. Phase B: SOQL Database Queries & DML Mastery (Topics 07 to 10)

---

### 📌 Topic 07: SOQL Fundamentals

#### 💬 Hinglish Mentor Explanation:

- SOQL me `SELECT *` strictly banned hai taaki multitenant server memory waste na ho.
- SOQL sirf data read karta hai, DML alag hoti hai.
- Relative Date Literals: `TODAY`, `YESTERDAY`, `LAST_N_DAYS:30` out-of-the-box milte hain.

#### 🌐 English Technical Explanation:

- Prohibits wildcards (`*`) to preserve multitenant memory and database I/O.
- Built-in relative date literals eliminate complex date calculations.

#### 💻 Verified Query (`scripts/soql/07_soql_basics.soql`):

```sql
SELECT
    CaseNumber,
    Subject,
    Status,
    Priority,
    Complaint_Category__c,
    Resolution_SLA_Hours__c,
    CreatedDate
FROM Case
WHERE Priority IN ('High', 'Critical')
  AND Status != 'Closed'
ORDER BY CreatedDate DESC
LIMIT 5
```

---

### 📌 Topic 08: SOQL Relationship Queries (Parent-Child)

#### 💬 Hinglish Mentor Explanation:

- **Child-to-Parent (Upwards ⬆️):** Dot notation use karte hain (`Case.Account.Name`). Custom me `__c` ID hold karta hai aur **`__r`** pointer hota hai (`Complaint_Action_Item__c.Case__r.Subject`). **Limit: 5 levels up.**
- **Parent-to-Child (Downwards ⬇️):** Parent ke andar Subquery lagate hain (`(SELECT LastName FROM Contacts)`). Custom child me **`__r`** lagta hai (`(SELECT Action_Title__c FROM Complaint_Action_Items__r)`). **Limit: Strictly 1 level down.**

#### 🌐 English Technical Explanation:

- Child-to-Parent traverses up to 5 levels via dot notation.
- Parent-to-Child queries use subqueries referencing the child relationship name and can only traverse 1 level down.

#### 💻 Verified Query (`scripts/soql/08_soql_relationships.soql`):

```sql
SELECT
    Name,
    Industry,
    (SELECT FirstName, LastName, Email, Title FROM Contacts),
    (SELECT CaseNumber, Subject, Priority, Status, SLA_Breach_Status__c FROM Cases)
FROM Account
WHERE Name = 'Acme Logistics Global'
```

---

### 📌 Topic 09: SOQL Aggregates & Grouping

#### 💬 Hinglish Mentor Explanation:

- Aggregates metrics nikaalte hain: `COUNT()`, `SUM()`, `AVG()`, `MIN()`, `MAX()`.
- **`WHERE` vs `HAVING` (Interview Alert):** `WHERE` grouping hone se pehle individual rows filter karta hai. `HAVING` grouping ke baad summary results filter karta hai (`HAVING COUNT(Id) > 1`).
- **Apex Return Type:** Aggregate queries `List<AggregateResult>` return karti hain, jisme se data `(Type) ar.get('alias')` se nikaala jata hai.

#### 🌐 English Technical Explanation:

- Summarizes data across groups. `WHERE` filters rows prior to aggregation; `HAVING` filters aggregate metrics after grouping.
- Apex aggregate queries return `List<AggregateResult>`, accessed via `.get('alias')`.

#### 💻 Verified Query (`scripts/soql/09_soql_aggregates.soql`):

```sql
SELECT
    Priority,
    COUNT(Id) totalCases,
    AVG(Resolution_SLA_Hours__c) avgSlaHours,
    MAX(Resolution_SLA_Hours__c) maxSlaHours
FROM Case
GROUP BY Priority
```

---

### 📌 Topic 10: DML Operations, Partial Processing, Savepoints & Undelete

#### 💬 Hinglish Mentor Explanation:

- **DML Statement vs Database Methods:**
  - Standard DML statement (`insert list;`): Yeh **Atomic (All-or-None)** hota hai. Agar list me 200 records hain aur 1 record validation rule ya trigger se fail hua, toh pure ke pure 200 records rollback ho jaate hain aur transaction unhandled `DmlException` phenk kar crash ho jaati hai!
  - `Database.insert(list, false)`: Yeh **Partial Processing** (`allOrNone = false`) allow karta hai. 199 valid records database me safely commit ho jaate hain, aur jo 1 record fail hua uska error humein `Database.SaveResult[]` array ke andar mil jata hai bina application crash huye.
- **SaveResult Inspection:**
  - `sr.isSuccess()`: Boolean batata hai record save hua ya nahi.
  - `sr.getId()`: Agar success hai toh naya Salesforce 18-char ID deta hai.
  - `sr.getErrors()`: Agar fail hua toh `Database.Error` list deta hai jisme se `err.getStatusCode()`, `err.getMessage()`, aur `err.getFields()` nikaal kar exact validation error pakad sakte hain.
- **Transaction Rollback (`Database.setSavepoint()` & `Database.rollback()`):**
  - Jab hum multi-step business process karte hain (jaise Account create kiya, fir Case, fir Action Items), agar last step me koi crash ho, toh `Savepoint sp = Database.setSavepoint();` aur `Database.rollback(sp);` call karke poore database ko exact pehle jaisa restore kar dete hain taaki corrupt ya aadha data na bache.
- **Recycle Bin Lifecycle (`delete` aur `undelete`):**
  - `delete record;`: Record ko hard-delete nahi karta, balki soft-delete karke **Salesforce Recycle Bin** me 15 din ke liye bhej deta hai (`IsDeleted = true`). SOQL me ise dekhne ke liye `ALL ROWS` lagana padta hai (`SELECT Id, IsDeleted FROM Case WHERE Id = :caseId ALL ROWS`).
  - `undelete record;`: Bina kisi data ya relationship loss ke record ko Recycle Bin se wapas active state me le aata hai!

#### 🌐 English Technical Explanation:

- **Atomic DML vs Partial Success:** Standard DML statements (`insert`, `update`, `delete`, `upsert`, `undelete`) are atomic: if one record fails validation or trigger checks, the entire transaction rolls back and throws a fatal `DmlException`. The `Database` class methods (`Database.insert(records, false)`) accept a Boolean `allOrNone` parameter. Setting it to `false` allows valid records to commit while returning failures inside an array of `Database.SaveResult` objects.
- **SaveResult Error Diagnostics:** Each `SaveResult` provides `.isSuccess()`, `.getId()`, and `.getErrors()` returning `Database.Error` instances detailing `.getStatusCode()`, `.getMessage()`, and target `.getFields()`.
- **Database Savepoints & Rollbacks:** `Database.setSavepoint()` checkpoints the transaction state. If subsequent operations fail in a `try-catch` block, `Database.rollback(savepoint)` reverses all intermediate DML while keeping execution flow intact.
- **Soft Delete & Undelete (Recycle Bin):** The `delete` operation sets `IsDeleted = true` and routes records to the Recycle Bin. Querying them requires the `ALL ROWS` SOQL clause. `undelete` restores deleted records and rebuilds their child relationships without data loss.

#### 💻 Verified Implementation (`scripts/apex/10_dml_mastery.apex`):

```apex
// ========================================================
// TOPIC 10: DML OPERATIONS & PARTIAL PROCESSING
// ========================================================

// 1. Prepare Bulk Records for DML (One valid, One intentionally invalid)
List<Case> testCases = new List<Case>();

// Record A: Valid High-Priority Case
testCases.add(
  new Case(
    Subject = 'Bulk DML Valid Ticket',
    Status = 'New',
    Priority = 'High',
    Origin = 'Web',
    Complaint_Category__c = 'Cloud Downtime'
  )
);

// Record B: Intentionally Invalid (Violating Validation Rule: High Priority + Closed + No RCA)
testCases.add(
  new Case(
    Subject = 'Bulk DML Invalid Ticket (Should Fail)',
    Status = 'Closed',
    Priority = 'High',
    Origin = 'Web' // Missing Root_Cause_Summary__c -> Triggers validation rule!
  )
);

// 2. Execute Partial Success DML (allOrNone = false)
System.debug('--- EXECUTING DATABASE.INSERT WITH ALL_OR_NONE = FALSE ---');
Database.SaveResult[] saveResults = Database.insert(testCases, false);

// 3. Inspecting the SaveResult Array
for (Integer i = 0; i < saveResults.size(); i++) {
  Database.SaveResult sr = saveResults[i];
  if (sr.isSuccess()) {
    System.debug(
      'SUCCESS: Record [' + i + '] inserted successfully with ID: ' + sr.getId()
    );
  } else {
    System.debug('FAILED: Record [' + i + '] failed as expected!');
    for (Database.Error err : sr.getErrors()) {
      System.debug('   -> Error Status Code: ' + err.getStatusCode());
      System.debug('   -> Validation Message: ' + err.getMessage());
      System.debug('   -> Target Fields: ' + err.getFields());
    }
  }
}
```

#### 🛡️ Senior Dev Gotchas:

1. **150 DML Statements Limit:** A transaction can execute at most 150 DML operations, with a total cap of 10,000 records processed across all operations. Placing `insert` or `update` inside any `for` loop is an immediate production blocker.
2. **Savepoints Do Not Reset Governor Limits:** Rolling back a transaction with `Database.rollback(sp)` resets the database records, but it does **NOT** reset governor limit counters (SOQL, DML, and CPU time consumed remain consumed).
3. **Savepoints Across Async Boundaries:** Savepoint variables cannot be serialized or passed into asynchronous jobs (`@future`, Queueable, or Batchable).

---

## 8. Master Interview Question & Word-for-Word Answer Bank

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

## 9. Remaining Roadmap (Topics 11 to 30)

| Topic #      | Phase                     | Topic Name                                   | Practical Deliverable                                                  | Status                   |
| :----------- | :------------------------ | :------------------------------------------- | :--------------------------------------------------------------------- | :----------------------- |
| **Topic 10** | **Phase B Finale**        | DML Operations & Database Methods            | `scripts/apex/10_dml_mastery.apex` (Partial success & SaveResult)      | **COMPLETED & VERIFIED** |
| **Topic 11** | **Phase C: Triggers**     | Governor Limits & Bulkification Architecture | The Gold-Standard Set + Map Bulk Pattern                               | **NEXT TARGET**          |
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
