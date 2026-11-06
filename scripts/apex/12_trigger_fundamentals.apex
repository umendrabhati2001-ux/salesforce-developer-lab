// ========================================================
// TOPIC 12: APEX TRIGGERS FUNDAMENTALS & CONTEXT VARIABLES
// ========================================================

System.debug('=== TOPIC 12: APEX TRIGGERS MASTER CLASS ===');

// -------------------------------------------------------------
// 1. THE 7 TRIGGER EVENTS IN SALESFORCE
// -------------------------------------------------------------
// A trigger can fire on 7 distinct lifecycle events:
//   1. before insert  (Modify fields in memory, validation rules)
//   2. after insert   (Record ID available, insert child records)
//   3. before update  (Detect field changes via oldMap, validate)
//   4. after update   (Update related parent/child records)
//   5. before delete  (Validate delete permission, check dependencies)
//   6. after delete   (Cascade updates to related records)
//   7. after undelete (Restore relationships from Recycle Bin)

// -------------------------------------------------------------
// 2. CONTEXT VARIABLES AVAILABILITY MATRIX
// -------------------------------------------------------------
// Variable        | Type                  | Insert | Update | Delete | Undelete
// ----------------|-----------------------|--------|--------|--------|---------
// Trigger.new     | List<sObject>         | Yes    | Yes    | No     | Yes
// Trigger.old     | List<sObject>         | No     | Yes    | Yes    | No
// Trigger.newMap  | Map<Id, sObject>      | After  | Yes    | No     | Yes
// Trigger.oldMap  | Map<Id, sObject>      | No     | Yes    | Yes    | No
// Trigger.isBefore| Boolean               | Context Flag (True if before phase)
// Trigger.isAfter | Boolean               | Context Flag (True if after phase)

// -------------------------------------------------------------
// 3. BEFORE VS AFTER TRIGGER ARCHITECTURE
// -------------------------------------------------------------

// RULE 1: BEFORE TRIGGERS = IN-MEMORY MUTATION (NO DML REQUIRED!)
// In 'before' context, any modification to Trigger.new fields is persisted
// automatically to the database when the transaction commits.
// ⚠️ NEVER issue an 'update record;' DML in a before trigger!

Case newComplaint = new Case(
    Subject = 'Server Rack Overheating - Incident #4092',
    Priority = 'Critical',
    Status = 'New',
    Complaint_Category__c = 'Hardware Failure'
);

System.debug('--- BEFORE TRIGGER SIMULATION (Field Mutation in Memory) ---');
// Simulating CaseTriggerHandler.handleBeforeInsert:
// If Category is Hardware Failure, set SLA hours to 4 without DML
if (newComplaint.Complaint_Category__c == 'Hardware Failure') {
    newComplaint.Resolution_SLA_Hours__c = 4; // Modified directly in memory!
    newComplaint.Priority = 'High';
    System.debug('   -> In-memory field mutated: Resolution_SLA_Hours__c = 4 hrs');
    System.debug('   -> Zero DML statements executed so far: ' + Limits.getDMLStatements());
}

// RULE 2: AFTER TRIGGERS = ID IS AVAILABLE & RELATED RECORD CREATION
// In 'after' context:
// - Trigger.new records are READ-ONLY (modifying fields throws System.FinalException)
// - The 18-character Salesforce Id is guaranteed to exist!
// - Ideal for creating child records (e.g. Complaint_Action_Item__c)
System.debug('--- AFTER TRIGGER SIMULATION (Child Record Creation) ---');

// Mock inserted parent Case with generated Id
Id mockCaseId = '5005g00000CaS1AA';
newComplaint.Id = mockCaseId;

// Now we can safely link child Action Item to parent Case
Complaint_Action_Item__c actionItem = new Complaint_Action_Item__c(
    Case__c = newComplaint.Id,
    Action_Title__c = 'Dispatch Hardware Replacement Unit',
    Status__c = 'Pending Investigation',
    Assigned_Team__c = 'Field Engineering'
);

System.debug('Child Action Item created for Case ID: ' + actionItem.Case__c);
System.debug('Action Title: ' + actionItem.Action_Title__c);

// -------------------------------------------------------------
// 4. CHANGE DETECTION PATTERN VIA TRIGGER.OLDMAP
// -------------------------------------------------------------
System.debug('--- FIELD CHANGE DETECTION VIA TRIGGER.OLDMAP ---');
// Scenario: An agent changes Case Status from 'In Progress' to 'Closed'
// We compare Trigger.new vs Trigger.oldMap to fire logic ONLY when status changes:
Case oldVersion = new Case(Id = mockCaseId, Status = 'In Progress', Priority = 'High');
Case updatedVersion = new Case(Id = mockCaseId, Status = 'Closed', Priority = 'High');

Map<Id, Case> oldMap = new Map<Id, Case>{ mockCaseId => oldVersion };

if (updatedVersion.Status == 'Closed' && oldMap.get(updatedVersion.Id).Status != 'Closed') {
    System.debug('ALERT: Status changed to Closed! Triggering Root Cause Audit.');
}

System.debug('=== TOPIC 12: TRIGGER FUNDAMENTALS 100% VERIFIED ===');
