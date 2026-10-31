// ========================================================
// TOPIC 05: CONTROL FLOW, SWITCH-WHEN & SAFE OPERATORS
// ========================================================

// 1. Ternary Operator (? :)
String priority = 'Critical';
String dispatchTeam = (priority == 'Critical') ? 'Tier-3 Emergency Engineers' : 'Tier-1 General Support';
System.debug('Dispatch Assignment: ' + dispatchTeam);

// 2. Modern Switch-When Statement
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
        slaTargetHours = 24; // Default fallback
    }
}
System.debug('Category [' + ticketCategory + '] calculated SLA: ' + slaTargetHours + ' Hours');

// 3. Safe Navigation Operator (?.)
Case orphanCase = new Case(Subject = 'Router Defect'); // Account is NOT linked (null)

// Traditional way would throw NullPointerException on orphanCase.Account.Name
// Modern Safe Navigation safely returns null without crashing!
String parentAccountName = orphanCase?.AccountId;
System.debug('Safe Lookup Parent Account ID: ' + parentAccountName);

// 4. SOQL For-Loop (Heap Protection Pattern)
System.debug('--- SOQL BATCH CHUNKING (200 records at a time) ---');
Integer totalProcessed = 0;

for (List<Case> caseBatch : [SELECT Id, Subject, Status FROM Case LIMIT 10]) {
    System.debug('Fetched Batch Chunk of size: ' + caseBatch.size());
    for (Case c : caseBatch) {
        totalProcessed++;
        System.debug('Processing Ticket #' + totalProcessed + ': ' + c.Subject);
    }
}
System.debug('Total Tickets Processed Safely: ' + totalProcessed);
