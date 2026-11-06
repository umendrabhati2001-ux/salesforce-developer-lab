// ============================================================================
// TOPIC 19: POSITIVE, NEGATIVE & 200-RECORD BULK TESTING PATTERNS
// ============================================================================
// Senior Salesforce Developer Guide: Testing beyond code coverage — verifying
// happy path calculations, enforcing defensive validation failures (negative
// testing), and proving 200-record bulk scalability without Governor Limit breaches.
// ============================================================================

System.debug('========================================================');
System.debug('=== TOPIC 19: POSITIVE, NEGATIVE & BULK TESTING ===');
System.debug('========================================================\n');

// ----------------------------------------------------------------------------
// 1. BUSINESS SERVICE UNDER TEST: SLA BREACH AUDITOR
// ----------------------------------------------------------------------------
public class ComplaintSlaAuditor {
    
    public class SlaValidationException extends Exception {}

    // Method to escalate overdue high-priority cases
    public static Integer auditAndEscalateComplaints(List<Case> cases) {
        if (cases == null || cases.isEmpty()) {
            throw new SlaValidationException('Complaint collection cannot be null or empty.');
        }

        Integer escalatedCount = 0;
        List<Case> casesToUpdate = new List<Case>();

        for (Case c : cases) {
            // Negative validation check: Closed cases cannot be escalated
            if (c.Status == 'Closed') {
                throw new SlaValidationException('Cannot escalate a closed complaint. Case ID: ' + c.Id);
            }

            if (c.Priority == 'High') {
                c.Priority = 'Critical';
                escalatedCount++;
                casesToUpdate.add(c);
            }
        }

        return escalatedCount;
    }
}

// ----------------------------------------------------------------------------
// 2. PILLAR 1: POSITIVE TESTING (HAPPY PATH)
// ----------------------------------------------------------------------------
// Verifying that expected valid inputs produce correct business results.
System.debug('--- 1. PILLAR 1: POSITIVE TESTING (HAPPY PATH) ---');

List<Case> validCases = new List<Case>{
    new Case(Subject = 'Router Latency 1', Status = 'New', Priority = 'High'),
    new Case(Subject = 'Router Latency 2', Status = 'New', Priority = 'High'),
    new Case(Subject = 'General Inquiry', Status = 'New', Priority = 'Low')
};

Test.startTest();
Integer positiveEscalated = ComplaintSlaAuditor.auditAndEscalateComplaints(validCases);
Test.stopTest();

// Modern Assertions
Assert.areEqual(2, positiveEscalated, 'Expected exactly 2 High-priority cases to be escalated to Critical');
Assert.areEqual('Critical', validCases[0].Priority, 'High priority case should be escalated to Critical');
Assert.areEqual('Low', validCases[2].Priority, 'Low priority case should remain unchanged');
System.debug('✅ Positive Test PASSED: Correctly escalated ' + positiveEscalated + ' cases.\n');

// ----------------------------------------------------------------------------
// 3. PILLAR 2: NEGATIVE TESTING (ERROR PATH & EXCEPTION ASSERTIONS)
// ----------------------------------------------------------------------------
// Verifying that illegal operations throw expected exceptions with correct messages.
System.debug('--- 2. PILLAR 2: NEGATIVE TESTING (EXPECTED FAILURES) ---');

// Test Case A: Empty collection input
Boolean emptyExceptionThrown = false;
try {
    Test.startTest();
    ComplaintSlaAuditor.auditAndEscalateComplaints(new List<Case>());
    Test.stopTest();
} catch (ComplaintSlaAuditor.SlaValidationException ex) {
    emptyExceptionThrown = true;
    Assert.isTrue(ex.getMessage().contains('cannot be null or empty'), 'Error message must specify non-empty collection');
}
Assert.isTrue(emptyExceptionThrown, 'Negative Test: Empty case list must throw SlaValidationException');
System.debug('✅ Negative Test A PASSED: Empty collection exception safely verified.');

// Test Case B: Closed Case Escalation Attempt (Illegal state transition)
Boolean closedExceptionThrown = false;
List<Case> closedCases = new List<Case>{
    new Case(Subject = 'Resolved Case', Status = 'Closed', Priority = 'High')
};

try {
    Test.startTest();
    ComplaintSlaAuditor.auditAndEscalateComplaints(closedCases);
    Test.stopTest();
} catch (ComplaintSlaAuditor.SlaValidationException ex) {
    closedExceptionThrown = true;
    Assert.isTrue(ex.getMessage().contains('Cannot escalate a closed complaint'), 'Exception message must flag closed complaint status');
}
Assert.isTrue(closedExceptionThrown, 'Negative Test: Escalating closed case must throw SlaValidationException');
System.debug('✅ Negative Test B PASSED: Closed case escalation rejected safely.\n');

// ----------------------------------------------------------------------------
// 4. PILLAR 3: 200-RECORD BULK TESTING (GOVERNOR LIMIT VALIDATION)
// ----------------------------------------------------------------------------
// Salesforce requires all triggers and Apex services to handle batches of at least
// 200 records (the maximum bulk API transaction chunk) without failing.
System.debug('--- 3. PILLAR 3: 200-RECORD BULK TESTING ---');

List<Case> bulkCases = new List<Case>();
for (Integer i = 1; i <= 200; i++) {
    bulkCases.add(new Case(
        Subject = 'Bulk Server Outage #' + i,
        Status = 'New',
        Priority = (Math.mod(i, 2) == 0) ? 'High' : 'Medium' // 100 High, 100 Medium
    ));
}

System.debug('>> Prepared ' + bulkCases.size() + ' mock cases for bulk scalability test...');

Test.startTest();
Integer bulkEscalated = ComplaintSlaAuditor.auditAndEscalateComplaints(bulkCases);
Test.stopTest();

// Assertions on bulk processing
Assert.areEqual(100, bulkEscalated, 'Bulk Test: Exactly 100 out of 200 cases should have been escalated');

// Governor Limit In-Test Assertion:
// Proves our service algorithm uses O(1) collection processing with zero wasted limits
Assert.isTrue(Limits.getQueries() <= 1, 'Bulk test must not execute queries in loops (SOQL limit check)');
Assert.isTrue(Limits.getCpuTime() < 2000, 'Bulk test CPU execution must be well under the 10,000ms threshold');
System.debug('✅ Bulk Test PASSED: Successfully processed 200 records in ' + Limits.getCpuTime() + 'ms of CPU time.\n');

System.debug('========================================================');
System.debug('=== TOPIC 19 COMPLETE: 3-PILLAR TESTING MASTERED     ===');
System.debug('========================================================');
