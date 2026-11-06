// ============================================================================
// TOPIC 17: APEX UNIT TESTING FUNDAMENTALS & MODERN ASSERTIONS
// ============================================================================
// Senior Salesforce Developer Guide: Writing rock-solid unit tests using
// modern Winter '23 `Assert` methods, isolated test data, and governor limit
// resetting with `Test.startTest()` / `Test.stopTest()`.
// ============================================================================

System.debug('========================================================');
System.debug('=== TOPIC 17: APEX UNIT TESTING FUNDAMENTALS ===');
System.debug('========================================================\n');

// ----------------------------------------------------------------------------
// 1. CORE TESTING ANNOTATIONS & DATA ISOLATION (seeAllData=false)
// ----------------------------------------------------------------------------
// In modern Salesforce (API 24.0+), all tests run with `seeAllData=false` by default.
// This means tests CANNOT see existing production accounts, contacts, or cases.
// Tests must create their own mock data in memory/database.
// This guarantees that tests behave identically in Developer Scratch Orgs,
// UAT Sandboxes, and Production.

System.debug('--- 1. TESTING ANNOTATION RULES ---');
System.debug('@isTest: Marks classes and methods as test code. Consumes 0 MB of Org code storage.');
System.debug('@TestVisible: Exposes `private` or `protected` methods/variables to test classes.');
System.debug('seeAllData=false: Standard isolation rule. Prevents tests from relying on org data.\n');

// ----------------------------------------------------------------------------
// 2. THE POWER OF Test.startTest() & Test.stopTest()
// ----------------------------------------------------------------------------
// Why every test method needs startTest and stopTest:
// 1. LIMIT RESET: It provides a BRAND NEW, SEPARATE set of Governor Limits.
//    Any SOQL/DML executed during test data setup does NOT subtract from the code being tested!
// 2. ASYNC EXECUTION: Any `@future`, `Queueable`, or `Batch` job enqueued inside
//    the block is FORCED to execute synchronously before `Test.stopTest()` finishes!

System.debug('--- 2. GOVERNOR LIMIT RESET LIFECYCLE ---');
System.debug('Phase 1 (Setup): Create Accounts/Cases (Consumes initial governor limits)');
System.debug('Phase 2 (Test.startTest()): Salesforce RESETS all governor limits to ZERO!');
System.debug('Phase 3 (Execute): Call target Apex Service method under test');
System.debug('Phase 4 (Test.stopTest()): Forces asynchronous jobs to complete immediately');
System.debug('Phase 5 (Assert): Query and verify output using modern Assert class\n');

// ----------------------------------------------------------------------------
// 3. SERVICE CLASS UNDER TEST (MOCK BUSINESS LOGIC)
// ----------------------------------------------------------------------------
public class ComplaintDiscountService {
    
    // Calculates customer loyalty discount based on account age and open complaints
    public static Decimal calculateCompensationDiscount(Decimal contractValue, Integer openComplaints) {
        if (contractValue == null || contractValue <= 0) {
            return 0.0;
        }
        
        // Critical complaints trigger compensation credit
        if (openComplaints >= 3) {
            return contractValue * 0.20; // 20% SLA breach compensation
        } else if (openComplaints >= 1) {
            return contractValue * 0.10; // 10% courtesy credit
        }
        
        return 0.0;
    }
}

// ----------------------------------------------------------------------------
// 4. UNIT TEST CLASS SIMULATION (MODERN ASSERT CLASS)
// ----------------------------------------------------------------------------
// Winter '23 introduced the dedicated `Assert` class, replacing deprecated `System.assert()`.
// Assert methods are cleaner, type-safe, and accept self-documenting failure messages.

System.debug('--- 3. EXECUTING TEST METHODS & ASSERTIONS ---');

// Test Case A: Positive Test Scenario (3 open complaints => 20% discount)
Decimal testContract = 50000.00;
Integer testComplaints = 3;

Test.startTest();
Decimal calculatedDiscount = ComplaintDiscountService.calculateCompensationDiscount(testContract, testComplaints);
Test.stopTest();

// Modern Assertions:
// Assert.areEqual(expected, actual, failureMessage)
Assert.areEqual(10000.00, calculatedDiscount, 'Calculated discount should be exactly 20% ($10,000)');
Assert.isTrue(calculatedDiscount > 0, 'Discount must be positive when complaints exist');
System.debug('✅ Test Case A PASSED: Expected $10,000, Actual: $' + calculatedDiscount);

// Test Case B: Boundary / Edge Test Scenario (0 complaints => 0 discount)
Test.startTest();
Decimal zeroDiscount = ComplaintDiscountService.calculateCompensationDiscount(testContract, 0);
Test.stopTest();

Assert.areEqual(0.0, zeroDiscount, 'No discount should be awarded for accounts with zero complaints');
System.debug('✅ Test Case B PASSED: Expected $0, Actual: $' + zeroDiscount);

// Test Case C: Negative / Defensive Null Input Scenario
Test.startTest();
Decimal nullDiscount = ComplaintDiscountService.calculateCompensationDiscount(null, 5);
Test.stopTest();

Assert.areEqual(0.0, nullDiscount, 'Null contract value must safely return 0.0 without NullPointerException');
System.debug('✅ Test Case C PASSED: Defensive null check verified safely.\n');

// ----------------------------------------------------------------------------
// 5. THE DEPLOYMENT GATE: 75% VS 85%+ QUALITY
// ----------------------------------------------------------------------------
System.debug('--- 4. PRODUCTION DEPLOYMENT RULES ---');
System.debug('1. Salesforce enforces a strict minimum of 75% aggregate code coverage for Production.');
System.debug('2. 100% of Apex Triggers must have at least 1% coverage (cannot deploy untested triggers).');
System.debug('3. All test methods must PASS in target Org with ZERO unhandled exceptions.');
System.debug('4. Enterprise Standard: Aim for 85%+ coverage with meaningful functional Assertions.\n');

System.debug('========================================================');
System.debug('=== TOPIC 17 COMPLETE: APEX UNIT TESTING MASTERED   ===');
System.debug('========================================================');
