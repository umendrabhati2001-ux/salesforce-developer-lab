// ============================================================================
// TOPIC 15: ASYNCHRONOUS APEX — FUTURE METHODS & QUEUEABLE APEX
// ============================================================================
// Senior Salesforce Developer Guide: Offloading long-running calculations,
// background HTTP callouts, and multi-step job chaining to keep synchronous
// transactions lightning fast.
// ============================================================================

System.debug('========================================================');
System.debug('=== TOPIC 15: FUTURE METHODS & QUEUEABLE APEX ===');
System.debug('========================================================\n');

// ----------------------------------------------------------------------------
// 1. SYNCHRONOUS VS ASYNCHRONOUS GOVERNOR LIMITS
// ----------------------------------------------------------------------------
// Synchronous transactions block the user UI and have tighter limits.
// Asynchronous transactions run on Salesforce background worker threads with
// doubled resource ceilings.

System.debug('--- 1. GOVERNOR LIMIT COMPARISON TABLE ---');
System.debug('Metric                  | Synchronous | Asynchronous');
System.debug('------------------------+-------------+-------------');
System.debug('Total SOQL Queries      | 100         | 200         ');
System.debug('Total DML Statements    | 150         | 150         ');
System.debug('Maximum CPU Time        | 10,000 ms   | 60,000 ms (6x higher)');
System.debug('Total Heap Size         | 6 MB        | 12 MB (2x higher)\n');

// ----------------------------------------------------------------------------
// 2. THE @future METHOD PATTERN
// ----------------------------------------------------------------------------
// Rules for @future methods:
// 1. Must be `public static void` or `global static void`.
// 2. ONLY accepts primitive types (Id, String, Integer, etc.) or collections of primitives.
//    NEVER sObjects (e.g. List<Case> is illegal because sObject state in memory could
//    desync from the database by the time the worker thread picks up the job).
// 3. For external HTTP web services, annotate with `@future(callout=true)`.
// 4. Returns `void` — does NOT provide a Job ID and CANNOT be chained.

public class ComplaintFutureService {
    
    // Future method simulating background SLA alert to external Slack/PagerDuty service
    public static void sendSlaAlertAsync(Set<Id> caseIds, String alertReason) {
        System.debug('>> [Future Simulation] Queued for async worker thread.');
        System.debug('   Case IDs to notify: ' + caseIds);
        System.debug('   Alert Context: ' + alertReason);
    }
}

System.debug('--- 2. @future METHOD DEMONSTRATION ---');
Set<Id> highPriorityCases = new Set<Id>{
    '500000000000001AAA',
    '500000000000002AAA'
};
ComplaintFutureService.sendSlaAlertAsync(highPriorityCases, 'CRITICAL_SLA_BREACH_DETECTED');
System.debug('✅ Synchronous thread returned immediately without blocking the user.\n');

// ----------------------------------------------------------------------------
// 3. QUEUEABLE APEX PATTERN (SUPERIOR SUCCESSOR TO @future)
// ----------------------------------------------------------------------------
// Why Queueable is preferred in modern Salesforce Enterprise Architecture:
// 1. Accepts complex types (sObjects, nested classes, custom payloads) in constructor.
// 2. Returns an AsyncApexJob ID when enqueued via `System.enqueueJob()`.
// 3. Supports job chaining (a Queueable job can enqueue another Queueable in its execute).
// 4. Supports `Database.AllowsCallouts` for external integrations.

public class CaseInvestigationQueueable implements Queueable, Database.AllowsCallouts {
    
    private List<Id> parentCaseIds;
    private String investigatorNotes;

    // Constructor accepts complex data payloads
    public CaseInvestigationQueueable(List<Id> caseIds, String notes) {
        this.parentCaseIds = caseIds;
        this.investigatorNotes = notes;
    }

    // Required execute method from Queueable interface
    public void execute(QueueableContext context) {
        // Retrieve the unique Async Job ID provided by the runtime
        Id currentJobId = context.getJobId();
        System.debug('>> Executing Queueable Job: ' + currentJobId);
        System.debug('   Processing Case IDs: ' + this.parentCaseIds);
        System.debug('   Audit Notes: ' + this.investigatorNotes);

        // Chaining Simulation:
        // In Developer/Enterprise editions, you can enqueue 1 child job per execute method
        if (!Test.isRunningTest()) {
            System.debug('🔗 [Job Chaining]: Downstream SLA audit job can be chained here.');
        }
    }
}

System.debug('--- 3. QUEUEABLE APEX INVOCATION & JOB TRACKING ---');
List<Id> escalatedCases = new List<Id>{ '500000000000010AAA', '500000000000011AAA' };
CaseInvestigationQueueable investigationJob = new CaseInvestigationQueueable(
    escalatedCases,
    'NexGen Server Outage: Priority 1 hardware diagnostic initiated.'
);

// Enqueue job and retrieve the Job ID
System.debug('>> Enqueueing CaseInvestigationQueueable via System.enqueueJob()...');
System.debug('   Simulated Enqueued Job: AsyncApexJob ID returned (e.g. 707...)\n');

// ----------------------------------------------------------------------------
// 4. MONITORING ASYNC JOBS VIA AsyncApexJob
// ----------------------------------------------------------------------------
System.debug('--- 4. ASYNC APEX MONITORING SOQL TEMPLATE ---');
System.debug('Query to inspect status of background jobs:');
System.debug('SELECT Id, Status, JobType, NumberOfErrors, JobItemsProcessed, TotalJobItems, CreatedDate');
System.debug('FROM AsyncApexJob');
System.debug('WHERE JobType IN (\'Queueable\', \'Future\')');
System.debug('ORDER BY CreatedDate DESC LIMIT 5\n');

System.debug('========================================================');
System.debug('=== TOPIC 15 COMPLETE: ASYNC APEX PATTERNS MASTERED  ===');
System.debug('========================================================');
