export interface CodeSnippetItem {
  id: string;
  category: "Apex Practice" | "SOQL Queries" | "Capstone Architecture";
  title: string;
  filename: string;
  language: "apex" | "soql";
  description: string;
  takeaway: string;
  code: string;
  tags: string[];
}

export const codeSnippets: CodeSnippetItem[] = [
  {
    id: "apex-01",
    category: "Apex Practice",
    title: "Topic 01: Apex Basics & sObject Creation",
    filename: "scripts/apex/01_apex_basics.apex",
    language: "apex",
    description: "Primitive data types, in-memory sObject instantiation, and CLI debug logging.",
    takeaway: "In-memory sObjects don't hit database governor limits until you execute a DML insert.",
    tags: ["Basics", "Data Types", "sObject", "Logging"],
    code: `String developerName = 'Umendra Bhati';
Date today = Date.today();

Account techCompany = new Account();
techCompany.Name = 'NexGen Cloud Systems';
techCompany.Industry = 'Technology';

System.debug('--- HELLO FROM VS CODE ---');
System.debug('Developer: ' + developerName);
System.debug('Date: ' + today);
System.debug('Company: ' + techCompany.Name + ' (' + techCompany.Industry + ')');`,
  },
  {
    id: "apex-02",
    category: "Apex Practice",
    title: "Topic 02: List<T> Mastery & Safety",
    filename: "scripts/apex/02_list_mastery.apex",
    language: "apex",
    description: "Ordered zero-based collections, duplicates, defensive empty checks, and iteration.",
    takeaway: "Always check !list.isEmpty() before looping to avoid NullPointerExceptions and ensure O(1) checks.",
    tags: ["Collections", "List", "Sorting", "For-Each"],
    code: `// 1. Declare and Initialize List of Strings
List<String> complaintPriorities = new List<String>();

// 2. Add elements (Notice: List allows duplicates!)
complaintPriorities.add('High');
complaintPriorities.add('Critical');
complaintPriorities.add('Low');
complaintPriorities.add('Medium');
complaintPriorities.add('High'); // Duplicate element

// 3. Essential List Methods
System.debug('Total Elements in List: ' + complaintPriorities.size());
System.debug('Element at index 1: ' + complaintPriorities.get(1));

// 4. Sorting the List (Alphabetical order)
complaintPriorities.sort();
System.debug('Sorted List: ' + complaintPriorities);

// 5. Professional Check: Null/Empty Check before Looping (Best Practice!)
if (!complaintPriorities.isEmpty()) {
    System.debug('--- FOR-EACH LOOP ITERATION ---');
    for (String priority : complaintPriorities) {
        System.debug('Priority Value: ' + priority);
    }
}`,
  },
  {
    id: "apex-03",
    category: "Apex Practice",
    title: "Topic 03: Set<T> Uniqueness & Fast Membership",
    filename: "scripts/apex/03_set_mastery.apex",
    language: "apex",
    description: "Unordered unique elements, automatic duplicate rejection, and O(1) membership checking.",
    takeaway: "Sets provide O(1) constant time membership lookup (.contains) and automatic deduplication.",
    tags: ["Collections", "Set", "Deduplication", "O(1)"],
    code: `// 1. Declare and Initialize Set
Set<String> complaintCategories = new Set<String>();

// 2. Add elements with intentional duplicates
complaintCategories.add('Hardware Failure');
complaintCategories.add('Cloud Downtime');
complaintCategories.add('Network Latency');
complaintCategories.add('Hardware Failure'); // Duplicate will be ignored!

System.debug('Total Unique Categories: ' + complaintCategories.size());
System.debug('Set Contents: ' + complaintCategories);

// 3. Fast Membership Check (.contains)
if (complaintCategories.contains('Cloud Downtime')) {
    System.debug('Critical Alert: Cloud Downtime is present in the set!');
}

// 4. Converting a Duplicate List into a Clean Set
List<String> duplicateLogs = new List<String>{'Error 404', 'Error 500', 'Error 404', 'Error 500'};
Set<String> uniqueLogs = new Set<String>();
uniqueLogs.addAll(duplicateLogs); // Automatically strips duplicates

System.debug('Raw List Size with duplicates: ' + duplicateLogs.size());
System.debug('Clean Set Size without duplicates: ' + uniqueLogs.size());`,
  },
  {
    id: "apex-04",
    category: "Apex Practice",
    title: "Topic 04: Map<Key, Value> (The Developer King)",
    filename: "scripts/apex/04_map_mastery.apex",
    language: "apex",
    description: "Key-Value pairs, fast O(1) hash map lookup, and replacing nested O(N²) loops.",
    takeaway: "Map is the backbone of trigger bulkification. Look up parent/related records in O(1) time.",
    tags: ["Collections", "Map", "Key-Value", "Optimization"],
    code: `// 1. Declare and Initialize Map
Map<String, Integer> categorySlaMap = new Map<String, Integer>();

// 2. Add Key-Value Pairs (.put)
categorySlaMap.put('Cloud Downtime', 2);
categorySlaMap.put('Hardware Failure', 4);
categorySlaMap.put('Network Latency', 8);
categorySlaMap.put('Software Bug', 12);

// 3. Fast O(1) Lookup (.get)
String incomingIssue = 'Cloud Downtime';
Integer targetSla = categorySlaMap.get(incomingIssue);
System.debug('Target SLA for [' + incomingIssue + ']: ' + targetSla + ' Hours');

// 4. Defensive Check (.containsKey)
String unknownIssue = 'Cyber Attack';
if (categorySlaMap.containsKey(unknownIssue)) {
    System.debug('SLA: ' + categorySlaMap.get(unknownIssue));
} else {
    System.debug('Issue [' + unknownIssue + '] not found in map! Falling back to 24hr default.');
}

// 5. Inspecting Keys (.keySet) and Values (.values)
System.debug('Total Keys in Map: ' + categorySlaMap.size());
System.debug('All Unique Keys (Set): ' + categorySlaMap.keySet());
System.debug('All Values (List): ' + categorySlaMap.values());`,
  },
  {
    id: "apex-05",
    category: "Apex Practice",
    title: "Topic 05: Control Flow, Switch & Safe Navigation",
    filename: "scripts/apex/05_control_flow.apex",
    language: "apex",
    description: "Pattern matching switch statements, ternary expressions, safe navigation (?.) and chunking.",
    takeaway: "Use ?. to safely access relationships on nullable parents without throwing NullPointerException.",
    tags: ["Switch-When", "Safe-Navigation", "Control-Flow"],
    code: `// 1. Modern Switch-When Statement
String priority = 'Critical';
String teamToNotify;

switch on priority {
    when 'Critical' {
        teamToNotify = 'Incident Response SWAT Team';
    }
    when 'High' {
        teamToNotify = 'Tier 2 Support Lead';
    }
    when 'Medium', 'Low' {
        teamToNotify = 'General Helpdesk Queue';
    }
    when else {
        teamToNotify = 'Default Triage Queue';
    }
}
System.debug('Assigned Dispatch Team: ' + teamToNotify);

// 2. Safe Navigation Operator (?.)
Case orphanCase = new Case(Subject = 'Printer Jam'); // AccountId is null!
String parentAccountName = orphanCase?.AccountId;
System.debug('Safe Lookup Parent Account ID: ' + parentAccountName);

// 3. SOQL For-Loop (Heap Protection Pattern - 200 records per chunk)
for (List<Case> caseBatch : [SELECT Id, Subject, Status FROM Case LIMIT 10]) {
    System.debug('Fetched Batch Chunk of size: ' + caseBatch.size());
}`,
  },
  {
    id: "apex-06",
    category: "Apex Practice",
    title: "Topic 06: Object-Oriented Apex (OOPs)",
    filename: "scripts/apex/06_oops_mastery.apex",
    language: "apex",
    description: "Encapsulation, constructors, state tracking, and method overloading (polymorphism).",
    takeaway: "Constructors guarantee valid initial object state; private fields prevent outside corruption.",
    tags: ["OOPs", "Classes", "Encapsulation", "Polymorphism"],
    code: `public class ComplaintTracker {
    public Integer totalComplaintsLogged = 0;
    private String ticketNumber;
    private String clientName;
    private String priority;
    private Integer slaHours;

    // Constructor: Auto-increments and calculates SLA
    public ComplaintTracker(String clientName, String priority) {
        totalComplaintsLogged++;
        this.ticketNumber = 'TICK-' + totalComplaintsLogged;
        this.clientName = clientName;
        this.priority = priority;
        this.slaHours = calculateSla(priority);
    }

    // Overloaded Method 1: Standard SLA calculation
    public Integer calculateSla(String priority) {
        if (priority == 'Critical') return 2;
        if (priority == 'High') return 4;
        return 24; // Default
    }

    // Overloaded Method 2: Polymorphism for VIP clients
    public Integer calculateSla(String priority, Boolean isVipClient) {
        Integer baseSla = calculateSla(priority);
        return isVipClient ? (baseSla / 2) : baseSla;
    }

    public void printTicketDetails() {
        System.debug('Ticket [' + this.ticketNumber + '] | Client: ' + this.clientName +
                     ' | Priority: ' + this.priority + ' | Target SLA: ' + this.slaHours + ' Hours');
    }
}

// Execution
ComplaintTracker ticket1 = new ComplaintTracker('Acme Logistics Global', 'Critical');
ticket1.printTicketDetails();`,
  },
  {
    id: "apex-10",
    category: "Apex Practice",
    title: "Topic 10: DML Mastery & Partial Success Handling",
    filename: "scripts/apex/10_dml_mastery.apex",
    language: "apex",
    description: "Database.insert with allOrNone=false, SaveResult error inspection, and rollback protection.",
    takeaway: "Always use Database.insert(list, false) when non-fatal record errors shouldn't crash batch jobs.",
    tags: ["DML", "Database Methods", "SaveResult", "Error Handling"],
    code: `// 1. Prepare Bulk Records (One valid, One violating validation rule)
List<Case> testCases = new List<Case>();

// Record A: Valid High-Priority Case
testCases.add(new Case(
    Subject = 'Bulk DML Valid Ticket',
    Status = 'New',
    Priority = 'High',
    Origin = 'Web',
    Complaint_Category__c = 'Cloud Downtime'
));

// Record B: Intentionally Invalid (High Priority + Closed + No RCA)
testCases.add(new Case(
    Subject = 'Bulk DML Invalid Ticket (Should Fail)',
    Status = 'Closed',
    Priority = 'High',
    Origin = 'Web' // Missing Root_Cause_Summary__c
));

// 2. Execute Partial Success DML (allOrNone = false)
System.debug('--- EXECUTING DATABASE.INSERT WITH ALL_OR_NONE = FALSE ---');
Database.SaveResult[] saveResults = Database.insert(testCases, false);

// 3. Inspecting the SaveResult Array
for (Integer i = 0; i < saveResults.size(); i++) {
    Database.SaveResult sr = saveResults[i];
    if (sr.isSuccess()) {
        System.debug('SUCCESS: Record [' + i + '] inserted ID: ' + sr.getId());
    } else {
        System.debug('FAILED: Record [' + i + '] failed as expected!');
        for (Database.Error err : sr.getErrors()) {
            System.debug('   -> StatusCode: ' + err.getStatusCode() + ' | Msg: ' + err.getMessage());
        }
    }
}`,
  },
  {
    id: "apex-11",
    category: "Apex Practice",
    title: "Topic 11: Bulkification & Governor Limits Architecture",
    filename: "scripts/apex/11_bulkification_pattern.apex",
    language: "apex",
    description: "The Gold Standard Set<Id> + Map<Id, sObject> bulk pattern eliminating SOQL in loops.",
    takeaway: "Always harvest foreign keys into Set<Id>, issue a single bulk SOQL outside the loop into a Map, and access records in O(1) time.",
    tags: ["Bulkification", "Governor Limits", "Set<Id>", "Map<Id, sObject>", "Limits Class"],
    code: `// STEP 1: ID HARVESTING (Zero SOQL consumed)
Set<Id> accountIds = new Set<Id>();
for (Case c : triggerNew) {
    if (c.AccountId != null) {
        accountIds.add(c.AccountId);
    }
}

// STEP 2: SINGLE BULK SOQL QUERY INTO MAP<ID, SOBJECT> (1 Query consumed)
Map<Id, Account> accountMap = new Map<Id, Account>([
    SELECT Id, Name, Industry, SLA__c 
    FROM Account 
    WHERE Id IN :accountIds
]);

// STEP 3: O(1) CONSTANT TIME MEMORY LOOKUP & MUTATION (Zero Queries)
for (Case c : triggerNew) {
    if (c.AccountId != null && accountMap.containsKey(c.AccountId)) {
        Account parentAcc = accountMap.get(c.AccountId);
        c.Description = 'Verified Parent: ' + parentAcc.Name;
    }
}

// GOVERNOR LIMIT TELEMETRY AUDIT
System.debug('SOQL Consumed: ' + Limits.getQueries() + ' / ' + Limits.getLimitQueries());
System.debug('DML Consumed: ' + Limits.getDMLStatements() + ' / ' + Limits.getLimitDMLStatements());`,
  },
  {
    id: "soql-07",
    category: "SOQL Queries",
    title: "Topic 07: SOQL Fundamentals & Date Filtering",
    filename: "scripts/soql/07_soql_basics.soql",
    language: "soql",
    description: "Querying Case fields, multi-value IN clauses, and descending date ordering.",
    takeaway: "SOQL does not support SELECT *; specify each field explicitly to minimize query heap size.",
    tags: ["SOQL", "Filters", "Date Literals", "Limits"],
    code: `SELECT
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
LIMIT 5`,
  },
  {
    id: "soql-08",
    category: "SOQL Queries",
    title: "Topic 08: SOQL Relationships (Subqueries)",
    filename: "scripts/soql/08_soql_relationships.soql",
    language: "soql",
    description: "Parent-to-child subqueries retrieving nested Contacts and Cases from Account.",
    takeaway: "Subqueries let you retrieve related children in a single SOQL query, saving governor limits.",
    tags: ["SOQL", "Parent-to-Child", "Subquery", "Relationships"],
    code: `SELECT
    Name,
    Industry,
    (SELECT FirstName, LastName, Email, Title FROM Contacts),
    (SELECT CaseNumber, Subject, Priority, Status, SLA_Breach_Status__c FROM Cases)
FROM Account
WHERE Name = 'Acme Logistics Global'`,
  },
  {
    id: "soql-09",
    category: "SOQL Queries",
    title: "Topic 09: SOQL Aggregates & Grouping",
    filename: "scripts/soql/09_soql_aggregates.soql",
    language: "soql",
    description: "COUNT, AVG, MAX grouping by Priority without pulling thousands of rows into memory.",
    takeaway: "Database engine aggregation performs mathematical rollups in microseconds without heap impact.",
    tags: ["SOQL", "Aggregates", "GROUP BY", "AVG"],
    code: `SELECT
    Priority,
    COUNT(Id) totalCases,
    AVG(Resolution_SLA_Hours__c) avgSlaHours,
    MAX(Resolution_SLA_Hours__c) maxSlaHours
FROM Case
GROUP BY Priority`,
  },
  {
    id: "capstone-trigger",
    category: "Capstone Architecture",
    title: "Capstone Trigger: CaseTrigger (One Trigger Per Object)",
    filename: "force-app/main/default/triggers/CaseTrigger.trigger",
    language: "apex",
    description: "Single Trigger per object architecture routing before insert and before update to handler.",
    takeaway: "Keep triggers logic-free. Triggers should only inspect execution context and dispatch to handlers.",
    tags: ["Trigger", "One-Trigger-Per-Object", "Routing", "Architecture"],
    code: `/**
 * @description Single Trigger per Object architecture for Case.
 *              Delegates all execution directly to CaseTriggerHandler.
 */
trigger CaseTrigger on Case(before insert, before update) {
  if (Trigger.isBefore) {
    if (Trigger.isInsert) {
      CaseTriggerHandler.handleBeforeInsert(Trigger.new);
    } else if (Trigger.isUpdate) {
      CaseTriggerHandler.handleBeforeUpdate(Trigger.new, Trigger.oldMap);
    }
  }
}`,
  },
  {
    id: "capstone-handler",
    category: "Capstone Architecture",
    title: "Capstone Handler: CaseTriggerHandler",
    filename: "force-app/main/default/classes/CaseTriggerHandler.cls",
    language: "apex",
    description: "Dispatches events, detects field mutations (e.g. Complaint_Category__c change), and calls Service.",
    takeaway: "Trigger handlers filter which records actually changed before invoking heavy business logic.",
    tags: ["Handler", "Change Detection", "Trigger.oldMap"],
    code: `/**
 * @description Enterprise Trigger Handler for Case object.
 *              Implements logic routing for insert and update events.
 */
public with sharing class CaseTriggerHandler {
  public static void handleBeforeInsert(List<Case> newCases) {
    ComplaintService.applySlaTargets(newCases);
  }

  public static void handleBeforeUpdate(
    List<Case> newCases,
    Map<Id, Case> oldCases
  ) {
    List<Case> categoryChangedCases = new List<Case>();

    for (Case c : newCases) {
      Case oldCase = oldCases.get(c.Id);
      // Check if user changed the complaint category
      if (c.Complaint_Category__c != oldCase.Complaint_Category__c) {
        // Reset SLA hours to null if user did not manually override it, allowing recalculation
        if (c.Resolution_SLA_Hours__c == oldCase.Resolution_SLA_Hours__c) {
          c.Resolution_SLA_Hours__c = null;
        }
        categoryChangedCases.add(c);
      }
    }

    if (!categoryChangedCases.isEmpty()) {
      ComplaintService.applySlaTargets(categoryChangedCases);
    }
  }
}`,
  },
  {
    id: "capstone-service",
    category: "Capstone Architecture",
    title: "Capstone Service: ComplaintService",
    filename: "force-app/main/default/classes/ComplaintService.cls",
    language: "apex",
    description: "Category SLA target mapping, bulk case calculations, and AuraEnabled query for LWC.",
    takeaway: "Service classes are reusable across Triggers, Batch Apex, and LWC @wire methods.",
    tags: ["Service Layer", "SLA Engine", "Bulkification", "AuraEnabled"],
    code: `/**
 * @description Enterprise Service layer handling business logic for Customer Complaints and Support Cases.
 *              Follows strict bulkification rules with zero SOQL/DML in loops.
 */
public with sharing class ComplaintService {
  public class ComplaintException extends Exception {}

  // SLA Target mapping by Complaint Category in hours
  private static final Map<String, Integer> CATEGORY_SLA_MAP = new Map<String, Integer>{
    'Cloud Downtime' => 2,
    'Hardware Failure' => 4,
    'Network Latency' => 8,
    'Software Bug' => 12,
    'Billing Dispute' => 24
  };

  /**
   * @description Applies target SLA hours automatically based on the complaint category.
   *              Invoked in before-insert or before-update trigger context.
   * @param cases List of Case records from Trigger.new
   */
  public static void applySlaTargets(List<Case> cases) {
    if (cases == null || cases.isEmpty()) {
      return;
    }

    for (Case c : cases) {
      if (
        c.Complaint_Category__c != null &&
        CATEGORY_SLA_MAP.containsKey(c.Complaint_Category__c)
      ) {
        // Only override if SLA hours is not manually customized
        if (c.Resolution_SLA_Hours__c == null) {
          c.Resolution_SLA_Hours__c = CATEGORY_SLA_MAP.get(
            c.Complaint_Category__c
          );
        }
      } else if (c.Resolution_SLA_Hours__c == null) {
        // Default SLA fallback
        c.Resolution_SLA_Hours__c = 24;
      }
    }
  }

  /**
   * @description Fetches all complaints and associated action items for an Account.
   *              Prepared for Aura/LWC consumption in Phase 9.
   * @param accountId Salesforce Id of the Account
   * @return List of Case records with child action items
   */
  @AuraEnabled(cacheable=true)
  public static List<Case> getComplaintsByAccount(Id accountId) {
    if (accountId == null) {
      throw new ComplaintException('Account ID cannot be null.');
    }

    return [
      SELECT
        Id,
        CaseNumber,
        Subject,
        Status,
        Priority,
        Complaint_Category__c,
        Resolution_SLA_Hours__c,
        SLA_Breach_Status__c,
        Total_Action_Items__c,
        CreatedDate,
        (
          SELECT Id, Action_Title__c, Status__c, Due_Date__c
          FROM Complaint_Action_Items__r
          ORDER BY CreatedDate ASC
        )
      FROM Case
      WHERE AccountId = :accountId
      ORDER BY CreatedDate DESC
      LIMIT 100
    ];
  }
}`,
  },
];
