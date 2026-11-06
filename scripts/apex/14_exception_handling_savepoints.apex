// ============================================================================
// TOPIC 14: EXCEPTION HANDLING & TRANSACTION CONTROL (SAVEPOINTS & ROLLBACKS)
// ============================================================================
// Senior Salesforce Developer Guide: Defensive error handling, custom domain
// exceptions, atomic transactions, and rollback strategies.
// ============================================================================

System.debug('========================================================');
System.debug('=== TOPIC 14: EXCEPTION HANDLING & TRANSACTION CONTROL ===');
System.debug('========================================================\n');

// ----------------------------------------------------------------------------
// 1. CUSTOM EXCEPTION DEFINITION
// ----------------------------------------------------------------------------
// Custom exceptions must extend the standard virtual `Exception` class.
// Best practice: Name custom exceptions with business domain context.
public class ComplaintValidationException extends Exception {}
public class SlaBreachException extends Exception {}

// ----------------------------------------------------------------------------
// 2. STANDARD TRY - CATCH - FINALLY LIFECYCLE
// ----------------------------------------------------------------------------
System.debug('--- 1. STANDARD EXCEPTION HANDLING & FINALLY BLOCK ---');

Boolean finallyExecuted = false;

try {
    System.debug('>> Initiating risky operation (Null check & Array bounds)...');
    List<String> caseNumbers = new List<String>();
    
    // Simulating defensive condition check
    if (caseNumbers.isEmpty()) {
        throw new ComplaintValidationException('Complaint batch is empty! Transaction aborted.');
    }
    
    // Unreachable code in this branch
    String firstCase = caseNumbers[0];
} catch (ComplaintValidationException cve) {
    System.debug('🛡️ CAUGHT CUSTOM EXCEPTION: ' + cve.getMessage());
    System.debug('   Exception Type: ' + cve.getTypeName());
    System.debug('   Stack Trace: ' + cve.getStackTraceString());
} catch (Exception e) {
    // Generic fallback handler for unexpected runtime exceptions
    System.debug('⚠️ GENERIC EXCEPTION CAUGHT: ' + e.getMessage());
} finally {
    // The finally block ALWAYS executes regardless of whether an exception was thrown
    finallyExecuted = true;
    System.debug('🔒 FINALLY BLOCK EXECUTED: Cleanup and telemetry completed.');
}

System.assert(finallyExecuted, 'Finally block must always run.');

// ----------------------------------------------------------------------------
// 3. DATABASE SAVEPOINTS & ATOMIC TRANSACTION ROLLBACKS
// ----------------------------------------------------------------------------
// In enterprise workflows, you often need to insert parent records and child
// records together. If child creation fails, you must ROLL BACK the parent record
// to prevent orphaned "dirty" data in production!
System.debug('\n--- 2. DATABASE SAVEPOINTS & TRANSACTION ROLLBACK ---');

// STEP 1: Set the transaction Savepoint BEFORE modifying data
Savepoint sp = Database.setSavepoint();
System.debug('📍 Database Savepoint established.');

try {
    // Simulating parent record creation
    Account mockAcc = new Account(Name = 'Enterprise Telecom Corp');
    System.debug('>> Step A: Staging parent Account in-memory: ' + mockAcc.Name);
    
    // Simulating child validation failure
    Integer simulatedErrorCode = 500;
    if (simulatedErrorCode == 500) {
        throw new SlaBreachException('Child SLA Action Item creation failed validation rules!');
    }
    
    System.debug('>> Step B: All child records successfully processed.');

} catch (SlaBreachException ex) {
    System.debug('❌ TRANSACTION FAILURE: ' + ex.getMessage());
    
    // STEP 2: Roll back entire transaction to pre-DML savepoint!
    Database.rollback(sp);
    System.debug('⏪ DATABASE ROLLED BACK: All intermediate changes reverted to clean state.');
    
    // STEP 3: Verify Governor Limits state after rollback
    System.debug('   DML Statements consumed: ' + Limits.getDMLStatements() + ' / ' + Limits.getLimitDMLStatements());
}

// ----------------------------------------------------------------------------
// 4. THE FATAL UNCATCHABLE EXCEPTION RULE (INTERVIEW GOLD ⭐)
// ----------------------------------------------------------------------------
// CRITICAL ARCHITECTURAL FACT:
// Not all exceptions in Salesforce can be caught with try/catch!
//
// 1. `System.LimitException`:
//    - Exceeding 101 SOQL queries, 151 DML statements, 10,000ms CPU timeout,
//      or 6MB heap size triggers a FATAL LimitException.
//    - `try { ... } catch (LimitException le) { ... }` will NEVER catch it!
//    - The transaction is immediately killed and rolled back by the kernel.
//
// 2. `System.AssertException`:
//    - Unhandled assertions in unit tests terminate test execution immediately.
//
// 3. Savepoint & Callout Conflict:
//    - You CANNOT make HTTP callouts after setting a Database.Savepoint!
//    - Attempting a callout after `setSavepoint()` throws:
//      `System.CalloutException: You have uncommitted work pending`.
// ----------------------------------------------------------------------------
System.debug('\n--- 3. INTERVIEW ARCHITECTURAL SUMMARY ---');
System.debug('• Custom Exceptions: Extend Exception, throw when business invariants break.');
System.debug('• Savepoints: Protect data integrity across multi-step transactions.');
System.debug('• LimitException: Strictly uncatchable. Prevent via Bulkification!');

System.debug('\n========================================================');
System.debug('=== TOPIC 14: EXCEPTION & TRANSACTION CONTROL DONE ===');
System.debug('========================================================');
