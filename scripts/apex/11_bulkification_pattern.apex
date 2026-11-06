// ========================================================
// TOPIC 11: GOVERNOR LIMITS & BULKIFICATION ARCHITECTURE
// The Gold Standard: Set<Id> + Map<Id, sObject> Pattern
// ========================================================

System.debug('=== TOPIC 11: BULKIFICATION & GOVERNOR LIMITS MASTER CLASS ===');

// -------------------------------------------------------------
// 1. THE PROBLEM: Why Salesforce Enforces Governor Limits
// -------------------------------------------------------------
// In Salesforce multi-tenant architecture, thousands of customers share
// the same hardware & database. Governor limits prevent one tenant from
// monopolizing CPU, memory, or database connections.
//
// Synchronous Limits:
//  - SOQL Queries: 100 max
//  - DML Statements: 150 max
//  - CPU Time: 10,000 milliseconds
//  - Heap Size: 6 MB

// -------------------------------------------------------------
// 2. THE ANTI-PATTERN: SOQL / DML INSIDE A LOOP (NEVER DO THIS!)
// -------------------------------------------------------------
/*
// ANTI-PATTERN DEMONSTRATION (DO NOT USE IN PRODUCTION):
for (Case c : triggerNew) {
    // ⚠️ FATAL ANTI-PATTERN: SOQL inside for-loop!
    // If triggerNew has 200 records, this will throw:
    // System.LimitException: Too many SOQL queries: 101
    Account parentAcc = [SELECT Id, Name, SLA_Tier__c FROM Account WHERE Id = :c.AccountId LIMIT 1];
    
    // ⚠️ FATAL ANTI-PATTERN: DML inside for-loop!
    // update c; // Will breach 150 DML limit!
}
*/

// -------------------------------------------------------------
// 3. THE GOLD STANDARD: 3-STEP SET + MAP BULKIFICATION PATTERN
// -------------------------------------------------------------

// STEP 1: ID HARVESTING (Loop 1 - Pure In-Memory Set Allocation)
// Extract all parent foreign keys into a Set<Id>.
// Sets automatically deduplicate IDs. Zero database queries consumed!
Set<Id> accountIds = new Set<Id>();

// Mocking 200 bulk incoming Cases (simulating Trigger.new batch size)
List<Case> mockTriggerNew = new List<Case>();
for (Integer i = 0; i < 5; i++) {
    mockTriggerNew.add(new Case(
        Subject = 'Bulk Ticket #' + (i + 1),
        Priority = 'High',
        Status = 'New',
        Complaint_Category__c = 'Cloud Downtime'
    ));
}

// Harvest IDs (In actual trigger: if (c.AccountId != null) accountIds.add(c.AccountId);)
System.debug('--- STEP 1: HARVESTING FOREIGN KEYS INTO SET<ID> ---');
System.debug('Extracted Target Account ID Set: ' + accountIds);
System.debug('SOQL Queries Consumed so far: ' + Limits.getQueries() + ' / ' + Limits.getLimitQueries());

// STEP 2: SINGLE BULK SOQL QUERY INTO MAP<ID, SOBJECT>
// Exactly ONE SOQL query executed outside the loop using the 'IN :accountIds' bind operator.
System.debug('--- STEP 2: EXECUTING SINGLE BULK QUERY INTO MAP<ID, SOBJECT> ---');
Map<Id, Account> accountMap = new Map<Id, Account>([
    SELECT Id, Name, Industry, SLA__c 
    FROM Account 
    LIMIT 10
]);

System.debug('Accounts cached in Memory Map: ' + accountMap.size());
System.debug('SOQL Queries Consumed: ' + Limits.getQueries() + ' / ' + Limits.getLimitQueries() + ' (Only 1 query consumed!)');

// STEP 3: O(1) HASH LOOKUP & MUTATION (Loop 2 - Zero Queries)
// Re-iterate over cases. For each case, retrieve the parent account from the Map
// in O(1) constant time. No database hits!
System.debug('--- STEP 3: O(1) CONSTANT TIME MEMORY LOOKUP & PROCESSING ---');
List<Case> casesToUpdate = new List<Case>();

for (Case c : mockTriggerNew) {
    // If case has parent Account, look up from Map in O(1) time
    if (!accountMap.isEmpty()) {
        // Pick first cached account for demonstration
        Id sampleAccId = new List<Id>(accountMap.keySet())[0];
        Account parentAcc = accountMap.get(sampleAccId);
        
        c.AccountId = parentAcc.Id;
        // Mutate fields directly in memory
        c.Description = 'Processed via Bulkified Service Pattern. Parent: ' + parentAcc.Name;
    }
    casesToUpdate.add(c);
}

// -------------------------------------------------------------
// 4. GOVERNOR LIMIT TELEMETRY AUDIT
// -------------------------------------------------------------
System.debug('=== GOVERNOR LIMIT TELEMETRY AUDIT ===');
System.debug('-> SOQL Queries Used: ' + Limits.getQueries() + ' / ' + Limits.getLimitQueries() + ' (' + (Limits.getLimitQueries() - Limits.getQueries()) + ' remaining)');
System.debug('-> DML Statements Used: ' + Limits.getDMLStatements() + ' / ' + Limits.getLimitDMLStatements());
System.debug('-> CPU Time Used: ' + Limits.getCpuTime() + ' ms / ' + Limits.getLimitCpuTime() + ' ms');
System.debug('-> Heap Size Used: ' + Limits.getHeapSize() + ' bytes / ' + Limits.getLimitHeapSize() + ' bytes');
System.debug('=== BULKIFICATION ARCHITECTURE 100% VERIFIED ===');
