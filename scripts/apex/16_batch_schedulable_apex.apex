// ============================================================================
// TOPIC 16: BATCH APEX & SCHEDULABLE APEX (ENTERPRISE DATA PROCESSING)
// ============================================================================
// Senior Salesforce Developer Guide: Processing millions of records without
// Governor Limit exhaustion using Database.Batchable, Database.Stateful, and
// automated Cron Scheduling via System.schedule.
// ============================================================================

System.debug('========================================================');
System.debug('=== TOPIC 16: BATCH APEX & SCHEDULABLE APEX ===');
System.debug('========================================================\n');

// ----------------------------------------------------------------------------
// 1. THE 50,000 RECORD WALL & THE BATCH SOLUTION
// ----------------------------------------------------------------------------
// In standard synchronous SOQL, querying more than 50,000 records throws a fatal
// `LimitException: Too many query rows: 50001`.
// Batch Apex bypasses this restriction by using `Database.getQueryLocator()`,
// which supports streaming up to 50,000,000 (50 Million) records in memory-safe
// chunks (default 200 records per chunk).

System.debug('--- 1. BATCH APEX ARCHITECTURE PRINCIPLES ---');
System.debug('1. START method: Executes ONCE. Queries up to 50 Million records via QueryLocator.');
System.debug('2. EXECUTE method: Executes N times (once per chunk of records).');
System.debug('   - Each chunk gets its OWN FRESH GOVERNOR LIMITS (200 SOQL / 150 DML).');
System.debug('3. FINISH method: Executes ONCE after all chunks complete for emails or logging.');
System.debug('4. Database.Stateful: Preserves counter variables across chunk transactions.\n');

// ----------------------------------------------------------------------------
// 2. ENTERPRISE BATCH CLASS IMPLEMENTATION
// ----------------------------------------------------------------------------
// Simulating the Capstone Case SLA Escalation Batch
public class CaseSlaAuditBatch implements Database.Batchable<sObject>, Database.Stateful {
    
    // Instance variables with Database.Stateful persist state across all chunk executions
    public Integer totalRecordsProcessed = 0;
    public Integer totalEscalationsApplied = 0;
    public List<String> errorLog = new List<String>();

    // 1. START: Query all open high-priority customer complaints
    public Database.QueryLocator start(Database.BatchableContext bc) {
        System.debug('🚀 [BATCH START]: Initializing query locator for aging cases...');
        String query = 'SELECT Id, Status, Priority, CreatedDate ' +
                       'FROM Case ' +
                       'WHERE IsClosed = false AND Priority = \'High\'';
        
        // In unit test or anonymous execution, return query locator
        return Database.getQueryLocator(query);
    }

    // 2. EXECUTE: Process each batch chunk (default 200 records)
    public void execute(Database.BatchableContext bc, List<Case> scope) {
        System.debug('⚡ [BATCH EXECUTE]: Processing chunk of ' + scope.size() + ' records.');
        this.totalRecordsProcessed += scope.size();
        
        List<Case> casesToUpdate = new List<Case>();
        
        for (Case c : scope) {
            // Business rule: If case is open and High priority, auto-flag for SLA breach
            c.Priority = 'Critical';
            casesToUpdate.add(c);
            this.totalEscalationsApplied++;
        }
        
        // Defensive DML partial processing
        if (!casesToUpdate.isEmpty()) {
            Database.SaveResult[] results = Database.update(casesToUpdate, false);
            for (Database.SaveResult sr : results) {
                if (!sr.isSuccess()) {
                    for (Database.Error err : sr.getErrors()) {
                        this.errorLog.add('Record ' + sr.getId() + ': ' + err.getMessage());
                    }
                }
            }
        }
    }

    // 3. FINISH: Final wrap-up, notifications, or chaining downstream batches
    public void finish(Database.BatchableContext bc) {
        System.debug('🏁 [BATCH FINISH]: Processing completed across all chunks!');
        System.debug('   Total Cases Scanned: ' + this.totalRecordsProcessed);
        System.debug('   Total Escalated:     ' + this.totalEscalationsApplied);
        System.debug('   Errors Logged:       ' + this.errorLog.size());
        
        // Example: Sending notification email or chaining a summary queueable
        System.debug('📧 Audit summary dispatched to NexGen DevOps telemetry.');
    }
}

// ----------------------------------------------------------------------------
// 3. SCHEDULABLE APEX & CRON EXPRESSIONS
// ----------------------------------------------------------------------------
// Schedulable classes allow Apex to trigger automatically at recurring intervals
// (e.g. Every night at 1:00 AM).

public class CaseSlaScheduledJob implements Schedulable {
    
    public void execute(SchedulableContext sc) {
        System.debug('⏰ [CRON TRIGGERED]: Schedulable execute invoked.');
        // Best Practice: Schedulable classes should delegate heavy lifting to Batch Apex
        CaseSlaAuditBatch batchJob = new CaseSlaAuditBatch();
        Database.executeBatch(batchJob, 200); // 200 is optimal default scope size
    }
}

System.debug('--- 2. CRON SYNTAX REFERENCE ---');
System.debug('Format: Seconds Minutes Hours Day_of_Month Month Day_of_Week [Optional_Year]');
System.debug('Example: 0 0 1 * * ?  => Every day at 1:00 AM');
System.debug('Example: 0 30 23 ? * MON-FRI => Weekdays at 11:30 PM\n');

// ----------------------------------------------------------------------------
// 4. PROGRAMMATIC SCHEDULING & JOB MANAGEMENT
// ----------------------------------------------------------------------------
System.debug('--- 3. SCHEDULE REGISTRATION SIMULATION ---');
String cronExp = '0 0 1 * * ?'; // Every night at 1:00 AM
String jobName = 'NexGen_Nightly_Case_SLA_Audit';

System.debug('>> Command to schedule in Production:');
System.debug('   String jobId = System.schedule(\'' + jobName + '\', \'' + cronExp + '\', new CaseSlaScheduledJob());');

System.debug('>> Command to abort scheduled job:');
System.debug('   System.abortJob(jobId);\n');

System.debug('========================================================');
System.debug('=== TOPIC 16 COMPLETE: BATCH & CRON SCHEDULING DONE ===');
System.debug('========================================================');
