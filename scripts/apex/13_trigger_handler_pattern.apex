// ============================================================================
// TOPIC 13: ENTERPRISE TRIGGER HANDLER PATTERN & RECURSION MANAGEMENT
// ============================================================================
// Senior Salesforce Developer Guide: Designing robust, bulkified, recursion-safe
// Trigger Frameworks for mission-critical enterprise applications.
// ============================================================================

System.debug('========================================================');
System.debug('=== TOPIC 13: ENTERPRISE TRIGGER HANDLER ARCHITECTURE ===');
System.debug('========================================================\n');

// ----------------------------------------------------------------------------
// 1. WHY LOGIC IN TRIGGERS IS AN ARCHITECTURAL ANTI-PATTERN
// ----------------------------------------------------------------------------
// Writing business logic directly inside trigger bodies (.trigger files) creates
// severe architectural debt:
//   1. Unpredictable Execution Order: If multiple triggers exist on one sObject,
//      Salesforce does NOT guarantee which trigger fires first.
//   2. Zero Code Reusability: Code inside a trigger cannot be invoked from LWC,
//      Batch Apex, Queueable Apex, or REST APIs.
//   3. Untestable in Isolation: You cannot unit-test trigger logic without
//      forcing full database DML commits (violating unit testing principles).
//   4. Impossible Recursion Control: Triggers lack persistent static context
//      unless delegated to an Apex class.
//
// GOLD STANDARD RULE: ONE TRIGGER PER OBJECT + DEDICATED HANDLER CLASS!
// ----------------------------------------------------------------------------

System.debug('--- 1. ENTERPRISE TRIGGER LIFECYCLE SIMULATION ---');

// Simulated Enterprise Trigger Context Framework
public class TriggerContextDemo {

    // ------------------------------------------------------------------------
    // STATIC RECURSION CONTROL: THE SET<ID> GOLD STANDARD
    // ------------------------------------------------------------------------
    // ⚠️ JUNIOR MISTAKE: Using `public static Boolean isFirstRun = true;`
    // Why is this dangerous? In bulk transactions (e.g. 10,000 records loaded
    // via Data Loader), Salesforce splits execution into 50 chunks of 200 records.
    // If you set `isFirstRun = false` in chunk 1, chunks 2 to 50 are SKIPPED!
    //
    // ✅ SENIOR PATTERN: Track processed record IDs per event!
    private static Set<Id> processedBeforeUpdateIds = new Set<Id>();
    private static Set<Id> processedAfterUpdateIds  = new Set<Id>();
    
    // Dynamic Trigger Bypass Registry (Useful during Batch/Migration/Tests)
    private static Set<String> bypassedTriggers = new Set<String>();

    public static void bypass(String handlerName) {
        bypassedTriggers.add(handlerName.toUpperCase());
        System.debug('🛑 TRIGGER BYPASSED: ' + handlerName);
    }

    public static void clearBypass(String handlerName) {
        bypassedTriggers.remove(handlerName.toUpperCase());
        System.debug('✅ TRIGGER BYPASS REMOVED: ' + handlerName);
    }

    public static Boolean isBypassed(String handlerName) {
        return bypassedTriggers.contains(handlerName.toUpperCase());
    }

    // ------------------------------------------------------------------------
    // CONCRETE HANDLER METHOD: BEFORE INSERT
    // ------------------------------------------------------------------------
    public static void handleBeforeInsert(List<Case> newCases) {
        if (isBypassed('CASE_TRIGGER')) return;

        System.debug('>> [BEFORE INSERT]: Applying default SLA and routing rules to ' + newCases.size() + ' cases...');
        for (Case c : newCases) {
            // Direct in-memory field mutation (NO DML REQUIRED)
            if (c.Priority == null) {
                c.Priority = 'Medium';
            }
            if (c.Origin == null) {
                c.Origin = 'Web';
            }
            System.debug('   Defaulted Case: Priority=' + c.Priority + ', Origin=' + c.Origin);
        }
    }

    // ------------------------------------------------------------------------
    // CONCRETE HANDLER METHOD: BEFORE UPDATE WITH RECURSION GUARD
    // ------------------------------------------------------------------------
    public static void handleBeforeUpdate(List<Case> newCases, Map<Id, Case> oldCasesMap) {
        if (isBypassed('CASE_TRIGGER')) return;

        List<Case> casesToProcess = new List<Case>();

        for (Case c : newCases) {
            // Check recursion guard: Has this record already been processed in this transaction?
            if (c.Id != null && processedBeforeUpdateIds.contains(c.Id)) {
                System.debug('⚠️ RECURSION DETECTED & BLOCKED for Case Id: ' + c.Id);
                continue;
            }

            // Delta Check: Only process if target fields actually changed!
            Case oldCase = oldCasesMap.get(c.Id);
            Boolean statusChanged = (c.Status != oldCase.Status);
            Boolean priorityChanged = (c.Priority != oldCase.Priority);

            if (statusChanged || priorityChanged) {
                casesToProcess.add(c);
                if (c.Id != null) {
                    processedBeforeUpdateIds.add(c.Id);
                }
            }
        }

        System.debug('>> [BEFORE UPDATE]: Processing ' + casesToProcess.size() + ' eligible records (filtered from ' + newCases.size() + ')...');
        for (Case c : casesToProcess) {
            Case oldCase = oldCasesMap.get(c.Id);
            System.debug('   Case ' + c.Subject + ': Status changed [' + oldCase.Status + ' -> ' + c.Status + ']');
            if (c.Status == 'Closed') {
                c.Description = (c.Description != null ? c.Description + ' | ' : '') + 'Closed on ' + DateTime.now();
            }
        }
    }

    // ------------------------------------------------------------------------
    // CONCRETE HANDLER METHOD: AFTER INSERT (Child record generation)
    // ------------------------------------------------------------------------
    public static void handleAfterInsert(List<Case> newCases) {
        if (isBypassed('CASE_TRIGGER')) return;

        System.debug('>> [AFTER INSERT]: IDs are committed. Generating child action items...');
        // Simulating collection of child items without executing actual DML
        for (Case c : newCases) {
            System.debug('   Ready to link child Complaint_Action_Item__c to Case Id: ' + c.Id);
        }
    }
}

// ----------------------------------------------------------------------------
// 2. LIVE SIMULATION: INSERT EVENT
// ----------------------------------------------------------------------------
System.debug('\n--- 2. SIMULATING BEFORE & AFTER INSERT FLOW ---');
List<Case> testCases = new List<Case>{
    new Case(Subject = 'Network Outage in Region 1', Status = 'New'),
    new Case(Subject = 'Billing Discrepancy on Invoice #402', Status = 'New', Priority = 'High')
};

// Step 1: Run Before Insert
TriggerContextDemo.handleBeforeInsert(testCases);

// Verify in-memory defaults
System.assert(testCases[0].Priority == 'Medium', 'Case 0 Priority should default to Medium');
System.assert(testCases[1].Priority == 'High', 'Case 1 Priority should remain High');
System.debug('✅ Before Insert Assertions Passed: Fields successfully mutated in-memory.');

// ----------------------------------------------------------------------------
// 3. LIVE SIMULATION: UPDATE & RECURSION PREVENTION
// ----------------------------------------------------------------------------
System.debug('\n--- 3. SIMULATING BEFORE UPDATE & RECURSION SHIELD ---');

// Assign mock IDs for update simulation
Id mockId1 = '500000000000001AAA';
Id mockId2 = '500000000000002AAA';
testCases[0].Id = mockId1;
testCases[1].Id = mockId2;

// Create Old Map representing current database state
Map<Id, Case> oldMap = new Map<Id, Case>{
    mockId1 => new Case(Id = mockId1, Subject = 'Network Outage in Region 1', Status = 'New', Priority = 'Medium'),
    mockId2 => new Case(Id = mockId2, Subject = 'Billing Discrepancy on Invoice #402', Status = 'New', Priority = 'High')
};

// Simulate user changing Case 0 status to Closed, and Case 1 status remaining New
testCases[0].Status = 'Closed'; // Status changed!
// testCases[1] unchanged

// Pass 1: First Update
System.debug('>>> PASS 1 (User Action):');
TriggerContextDemo.handleBeforeUpdate(testCases, oldMap);

// Pass 2: Recursive Update Simulation (e.g., triggered by workflow/process builder re-evaluating)
System.debug('>>> PASS 2 (Simulated Recursive Trigger Re-entry):');
TriggerContextDemo.handleBeforeUpdate(testCases, oldMap);

// ----------------------------------------------------------------------------
// 4. LIVE SIMULATION: DYNAMIC TRIGGER BYPASS
// ----------------------------------------------------------------------------
System.debug('\n--- 4. SIMULATING DYNAMIC TRIGGER BYPASS (MIGRATION/TESTING) ---');
TriggerContextDemo.bypass('CASE_TRIGGER');

List<Case> migrationBatch = new List<Case>{
    new Case(Subject = 'Legacy Import Record 991')
};
TriggerContextDemo.handleBeforeInsert(migrationBatch);
System.debug('Verify Migration Case Priority: ' + migrationBatch[0].Priority + ' (Remains null because trigger was bypassed)');

TriggerContextDemo.clearBypass('CASE_TRIGGER');

System.debug('\n========================================================');
System.debug('=== TOPIC 13 ENTERPRISE TRIGGER HANDLER: COMPLETED ===');
System.debug('========================================================');
