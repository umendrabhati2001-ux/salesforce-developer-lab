# Salesforce Developer Interview Mastery — Job-Ready Q&A Bank

---

## 🎯 Question 01: Why should you never write logic directly inside an Apex Trigger? Why use the Trigger Handler Pattern?

### 💡 Conceptual Understanding (Hindi / Hinglish Concept)

Triggers ke andar business logic, SOQL aur DML likhna ek bahut bada anti-pattern (bad practice) mana jata hai. Real companies me hum hamesha **"One Trigger Per Object"** aur **"Trigger Handler Pattern"** follow karte hain. Iske 4 solid reasons hain:

1. **Execution Order Guarantee Nahi Hoti:** Agar ek object par 2 triggers hon, toh Salesforce ye guarantee nahi karta ki pehle kaunsa chalega. Ek hi trigger rakhne se flow hamesha hamare control me hota hai.
2. **Code Reusability & SoC (Separation of Concerns):** Trigger ke andar likha code sirf trigger ke fire hone par chal sakta hai. Usse LWC, Batch Apex, ya kisi doosri class se direct call nahi kiya ja sakta. Handler/Service class bana kar code reusable ho jata hai.
3. **Recursion Control (Infinite Loops se Bachav):** Agar after update trigger me record update ho, toh trigger dubara chal padta hai (infinite recursion). Handler me static variable rakh kar hum loop ko block kar dete hain.
4. **Unit Testing:** Trigger ko alag se test nahi kiya ja sakta, uske liye DML karni padti hai. Handler aur Service classes ko cleanly unit test kiya ja sakta hai.

---

### 🎙️ The "Hire-Me" English Answer (Exact Words to Speak in Interview)

> _"In Salesforce architecture, putting business logic directly inside a trigger is considered an anti-pattern. We always adhere to the **One Trigger Per Object** and **Trigger Handler Pattern** for four primary reasons:_
>
> 1. _First, **Execution Order**: Salesforce does not guarantee the order of execution when multiple triggers exist on the same object. Having a single trigger that delegates to a handler ensures complete control over the execution lifecycle._
> 2. _Second, **Separation of Concerns and Reusability**: Logic written inside a trigger cannot be invoked from other components like Batch Apex, Queueable jobs, or LWC controllers. Moving logic to a Service and Handler layer allows clean reusability._
> 3. _Third, **Recursion Prevention**: Triggers can easily fall into infinite update loops. A Handler allows us to use static flags or `Set<Id>` collections to prevent recursive execution._
> 4. _Fourth, **Testability**: It allows us to unit test individual business methods without always relying on heavy database DML operations._
>
> _For example, in our Customer Complaint Management System, our `CaseTrigger` only contains routing logic, delegating immediately to `CaseTriggerHandler`, which then calls `ComplaintService` to calculate category SLAs."_

---

## 🎯 Question 02: What is the difference between `with sharing`, `without sharing`, and `inherited sharing`?

### 🎙️ The "Hire-Me" English Answer

> _"Apex generally runs in **System Mode**, meaning it ignores user permissions and Organization-Wide Defaults (OWD) unless explicitly instructed._
>
> - _`with sharing` enforces the current user's **record-level sharing rules, OWD, and role hierarchy**. If the user doesn't have access to an Account, queries will return zero rows for that record. However, Field-Level Security (FLS) is still not enforced automatically unless using `WITH USER_MODE` or `Security.stripInaccessible()`._
> - _`without sharing` executes in **System Mode**, bypassing sharing rules and granting access to all records regardless of user ownership._
> - _`inherited sharing` dynamically inherits the sharing model of the calling class. If called by a `with sharing` class, it runs as `with sharing`. It is the recommended best practice for reusable utility classes and LWC controllers to prevent security vulnerabilities."_

---

## 🎯 Question 03: Why does Salesforce have Governor Limits, and how do you handle them?

### 🎙️ The "Hire-Me" English Answer

> _"Salesforce runs on a **multitenant cloud architecture**, meaning multiple customers (tenants) share the same underlying hardware, database, and CPU infrastructure. To prevent one tenant's poorly written code or runaway infinite loops from monopolizing shared server resources, Salesforce enforces strict, runtime **Governor Limits**._
>
> _The two most critical limits are **100 SOQL queries** and **150 DML statements** per synchronous transaction._
>
> _We handle this through **Bulkification**:_
>
> 1. _Never place SOQL queries or DML statements inside `for` loops._
> 2. _Collect IDs in a `Set<Id>` and issue a single SOQL query._
> 3. _Use `Map<Id, sObject>` for $O(1)$ in-memory lookups instead of nested loops._
> 4. _Collect records in a `List<sObject>` and execute a single bulk DML statement."_

---

## 🎯 Question 04: Why is `!list.isEmpty()` preferred over `list.size() > 0` in Apex?

### 🎙️ The "Hire-Me" English Answer

> _"In Apex best practices, **`!list.isEmpty()`** is preferred over `list.size() > 0` for two key reasons:_
>
> 1. _First, **Performance**: `.isEmpty()` checks the internal memory pointer in $O(1)$ constant time without calculating total size, whereas `.size()` must count elements._
> 2. _Second, **Readability & Semantic Intent**: `.isEmpty()` expresses the intent of checking collection emptiness cleanly._
>    _Additionally, both methods will throw a `NullPointerException` if the list itself is null, so defensive code often checks: `if (myList != null && !myList.isEmpty())`."_

---

## 🎯 Question 05: What is `System.ListException: List index out of bounds` and how do you prevent it?

### 🎙️ The "Hire-Me" English Answer

> _"A `List index out of bounds` exception occurs at runtime when code attempts to access an element at an index position that does not exist in the list (for example, calling `myList.get(5)` on a list that only contains 3 elements, where valid indexes are 0, 1, and 2)._
> _We prevent this by:_
>
> 1. _Using standard **For-Each loops** (`for (String item : myList)`) instead of manual index manipulation._
> 2. _When index access is necessary, always wrapping it in boundary validation: `if (index >= 0 && index < myList.size())`."_

---

## 🎯 Question 06: How do `List` and `Set` differ in Apex, and how do you deduplicate a List?

### 🎙️ The "Hire-Me" English Answer

> _"In Apex collections:_
>
> 1. _A **List** is an **ordered**, index-based collection that allows duplicate elements. It is primarily used for holding records for bulk DML operations._
> 2. _A **Set** is an **unordered** collection that guarantees **strictly unique elements**. It does not support indexing (e.g., no `.get(0)`), but provides lightning-fast $O(1)$ constant-time membership lookups via `.contains()`._
>
> _To deduplicate any List in one line of code, we pass it into a Set constructor or call `addAll()`:_
>
> ```apex
> Set<String> uniqueSet = new Set<String>(myDuplicateList);
> List<String> cleanList = new List<String>(uniqueSet);
> ```
>
> _In SOQL optimization, we always accumulate foreign key IDs into a `Set<Id>` before executing `WHERE Id IN :mySet`."_

---

## 🎯 Question 07: Why is `Map<Id, sObject>` considered the most important data structure in Salesforce bulkification?

### 🎙️ The "Hire-Me" English Answer

> _"In enterprise Salesforce development, `Map<Id, sObject>` is the cornerstone of bulkification because it completely **eliminates nested loops** and allows $O(1)$ constant-time record lookups._
>
> _For instance, when processing a batch of child `Case` records that need data from their parent `Account`:_
>
> 1. _Instead of iterating over accounts inside the cases loop (which yields an unacceptable $O(N^2)$ CPU complexity), we query accounts directly into a Map:_
>    ```apex
>    Map<Id, Account> accMap = new Map<Id, Account>([SELECT Id, Name FROM Account WHERE Id IN :accIds]);
>    ```
> 2. _Inside the `Case` loop, we retrieve the exact parent account instantaneously in $O(1)$ time:_
>    ```apex
>    Account parentAcc = accMap.get(c.AccountId);
>    ```
>
> _This guarantees our transaction never breaches the **10,000 ms CPU timeout** limit even when handling thousands of records."_

---

## 🎯 Question 08: What is the Safe Navigation Operator (`?.`) and how does it prevent NullPointerExceptions?

### 🎙️ The "Hire-Me" English Answer

> _"The **Safe Navigation Operator (`?.`)** in Apex short-circuits evaluation if the expression on the left evaluates to `null`, safely returning `null` rather than throwing a catastrophic `System.NullPointerException`._
>
> _In legacy Apex, checking nested relationships required tedious, multi-level null guards:_
>
> ```apex
> String accName = (c != null && c.Account != null) ? c.Account.Name : null;
> ```
>
> _With the safe navigation operator, we write clean, defensive, production-grade code:_
>
> ```apex
> String accName = c?.Account?.Name;
> ```
>
> _If either `c` or `c.Account` is null, `accName` simply receives `null` safely."_

---

## 🎯 Question 09: What is a SOQL For-Loop, and why is it essential for Heap Size management?

### 🎙️ The "Hire-Me" English Answer

> _"A **SOQL For-Loop** iterates over query results in automatic **200-record batch chunks** rather than loading the entire query result set into memory all at once:_
>
> ```apex
> for (List<Case> caseChunk : [SELECT Id, Subject FROM Case]) {
>     // Process chunk of up to 200 records
> }
> ```
>
> _If an ordinary query returns 50,000 records into a single `List<sObject>`, it will quickly exhaust the **6 MB Apex Heap Size limit**, causing a fatal runtime exception. The SOQL For-Loop releases memory after each chunk is processed, enabling safe processing of large data volumes without hitting heap limits."_

---

## 🎯 Question 10: Can an Inner Class in Apex contain `static` variables or methods?

### 🎙️ The "Hire-Me" English Answer

> _"No. In Apex language specifications, **`static` variables and methods can only be defined on top-level classes** (standalone `.cls` files). Inner classes cannot contain static variables, static methods, or static initializers._
>
> _If an inner class requires a shared variable, it must be declared at the outer enclosing class level or accessed through an instance reference._
> _This is also why defining a class inside Anonymous Apex produces the error `static can only be used on fields of a top level type`, because anonymous blocks are executed within an internal runner method, making any nested class definition an inner class."_

---

## 🎯 Question 11: What are the fundamental differences between SQL and SOQL?

### 🎙️ The "Hire-Me" English Answer

> _"While SOQL resembles standard SQL syntax, it differs fundamentally due to Salesforce's multitenant cloud architecture:_
>
> 1. _No `SELECT *`: SOQL strictly forbids wildcard column selections to optimize database I/O and heap memory. Every queried field must be explicitly declared._
> 2. _No arbitrary `JOIN` operations: SOQL does not support joining unrelated tables. Traversal is strictly relationship-driven (Parent-to-Child via subqueries or Child-to-Parent via dot-notation)._
> 3. _Read-Only: SOQL is solely a data query language. Data modifications are executed separately through Apex DML statements (`insert`, `update`, `delete`)._
> 4. _Built-in Date Literals: SOQL provides out-of-the-box relative date ranges (e.g., `TODAY`, `YESTERDAY`, `THIS_QUARTER`, `LAST_N_DAYS:30`) which eliminate complex date-math calculations."_

---

## 🎯 Question 12: What are the limits and syntax rules for relationship queries in SOQL?

### 🎙️ The "Hire-Me" English Answer

> _"In Salesforce SOQL relationship queries:_
>
> 1. _For **Child-to-Parent** (Upwards Traversal):_
>    - _Syntax: We use **Dot Notation** (e.g., `Contact.Account.Name` or for custom objects `Complaint_Action_Item__c.Case__r.Subject`)._
>    - _Limit: You can traverse **up to 5 levels up**._
> 2. _For **Parent-to-Child** (Downwards Traversal):_
>    - _Syntax: We use **Subqueries** referencing the Child Relationship Name (e.g., `(SELECT LastName FROM Contacts)` or for custom objects `(SELECT Id FROM Complaint_Action_Items__r)`)._
>    - _Limit: You can only query **1 level down** (nested subqueries inside a subquery are strictly disallowed)._
> 3. _Field vs Relationship Reference (`__c` vs `__r`):_
>    - _`__c` references the custom foreign key field value (the 18-character ID)._
>    - _`__r` references the related object pointer to traverse into its fields."_

---

## 🎯 Question 13: How do `WHERE` and `HAVING` differ in SOQL, and what object type do aggregates return in Apex?

### 🎙️ The "Hire-Me" English Answer

> _"In SOQL aggregation queries:_
>
> 1. _`WHERE` filters **individual rows before aggregation** happens. It cannot contain aggregate functions._
> 2. _`HAVING` filters the **summarized groups after aggregation** is performed (for example: `HAVING COUNT(Id) > 5`)._
>
> _In Apex, aggregate queries do not return typed sObject lists (like `List<Case>`). Instead, they strictly return a **`List<AggregateResult>`**._
> _To extract data from an `AggregateResult` object, dot-notation is invalid; we must use the `.get()` method and cast to the expected data type:_
>
> ````apex
> for (AggregateResult ar : [SELECT Priority, COUNT(Id) total FROM Case GROUP BY Priority]) {
>     String priority = (String) ar.get('Priority');
>     Integer total = (Integer) ar.get('total');
> }
> ```"*
> ````

---

## 🎯 Question 14: Regular DML Statement vs Database Methods (`Database.insert`): What is the core difference?

### 🎙️ The "Hire-Me" English Answer

> _"The fundamental difference lies in **transaction atomicity and error handling**:_
>
> 1. _A **Regular DML Statement** (e.g., `insert cases;`) is strictly **All-or-None**. If a single record in a 200-record batch fails (e.g., due to a validation rule), the entire transaction rolls back and an unhandled `DmlException` is thrown._
> 2. _A **Database Method** (e.g., `Database.insert(cases, false);`) accepts an optional boolean `allOrNone` parameter. Setting it to `false` enables **partial processing**: valid records commit to the database, while failed records generate error objects within a returned `Database.SaveResult[]` array without crashing execution._
>
> _In enterprise integrations, we use `Database.insert(list, false)` to log failed rows to an error monitoring object while ensuring valid business data is not held hostage by a single bad record."_

---

## 🎯 Question 15: How does `upsert` match records, and why are External IDs critical?

### 🎙️ The "Hire-Me" English Answer

> _"The `upsert` statement conditionally inserts or updates records based on matching criteria:_
>
> 1. _If an `Id` is populated on the sObject, it executes an `update`._
> 2. _If a field designated as an **External ID** is provided (e.g., `upsert caseList External_Ticket_Id__c;`), it searches the database for that foreign identifier: matching records are updated, while new identifiers trigger an `insert`._
>    _This is essential in third-party integrations to prevent duplicate record creation during external syncs."_

---

## 🎯 Question 16: How do you implement Database Savepoints and Rollbacks in Apex?

### 🎙️ The "Hire-Me" English Answer

> _"We use **`Database.setSavepoint()`** and **`Database.rollback(sp)`** to manage fine-grained transaction control:_
>
> ```apex
> Savepoint sp = Database.setSavepoint();
> try {
>     insert parentAccount;
>     insert childCases;
> } catch (DmlException ex) {
>     Database.rollback(sp);
>     System.debug('Error encountered; transaction rolled back to original checkpoint: ' + ex.getMessage());
> }
> ```
>
> _If an error occurs midway through a multi-step transaction, rolling back to the savepoint restores the database to its pristine state before any DML was executed, preventing orphaned or corrupt records."_

---

## 🎯 Question 17: What is the lifecycle of `delete` and `undelete` with the Recycle Bin?

### 🎙️ The "Hire-Me" English Answer

> _"When a record is deleted using `delete myRecord;`, Salesforce performs a **Soft Delete**: the record's `IsDeleted` field is set to `true`, and it moves to the **Recycle Bin** for 15 days._
> _To query deleted records in SOQL, the `ALL ROWS` clause is mandatory:_
>
> ```apex
> Case c = [SELECT Id, IsDeleted FROM Case WHERE Id = :caseId ALL ROWS];
> ```
>
> _Calling `undelete c;` restores the record and its cascade relationships back to an active state (`IsDeleted = false`) without data loss."_
