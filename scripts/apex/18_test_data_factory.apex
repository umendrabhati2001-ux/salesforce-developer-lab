// ============================================================================
// TOPIC 18: @TestSetup & ENTERPRISE TEST DATA FACTORY PATTERN
// ============================================================================
// Senior Salesforce Developer Guide: Eliminating code duplication, reducing test
// run times by up to 60%, and isolating test data creation using @TestSetup
// and centralized TestDataFactory classes.
// ============================================================================

System.debug('========================================================');
System.debug('=== TOPIC 18: @TestSetup & TEST DATA FACTORY PATTERN ===');
System.debug('========================================================\n');

// ----------------------------------------------------------------------------
// 1. THE PROBLEM: AD-HOC TEST DATA VS CENTRALIZED FACTORY
// ----------------------------------------------------------------------------
// Anti-Pattern: Hardcoding `new Account(Name='Test')` inside 50 test classes.
// When an Admin adds a new Required Field or Validation Rule, all 50 test classes
// break simultaneously.
//
// Enterprise Solution: `TestDataFactory`
// - Single source of truth for mock data generation.
// - Supports `doInsert` boolean flag so callers can modify fields before DML.
// - Parameterized for bulk creation (1 to 200+ records).

System.debug('--- 1. ENTERPRISE TEST DATA FACTORY IMPLEMENTATION ---');

public class TestDataFactory {
    
    // 1. Account Factory Method
    public static Account createAccount(String companyName, Boolean doInsert) {
        Account acc = new Account(
            Name = companyName,
            Industry = 'Technology',
            AnnualRevenue = 5000000.00
        );
        if (doInsert) {
            insert acc;
        }
        return acc;
    }

    // 2. Bulk Contact Factory Method
    public static List<Contact> createContacts(Id parentAccountId, Integer recordCount, Boolean doInsert) {
        List<Contact> contactList = new List<Contact>();
        for (Integer i = 1; i <= recordCount; i++) {
            contactList.add(new Contact(
                AccountId = parentAccountId,
                FirstName = 'TestUser',
                LastName = 'Engineer_' + i,
                Email = 'test.engineer.' + i + '@nexgencloud.fake',
                Title = 'Cloud Support Specialist'
            ));
        }
        if (doInsert && !contactList.isEmpty()) {
            insert contactList;
        }
        return contactList;
    }

    // 3. Bulk Customer Complaint (Case) Factory Method
    public static List<Case> createCases(Id parentAccountId, Integer recordCount, String priorityLevel, Boolean doInsert) {
        List<Case> caseList = new List<Case>();
        for (Integer i = 1; i <= recordCount; i++) {
            caseList.add(new Case(
                AccountId = parentAccountId,
                Subject = 'NexGen Router Latency Batch #' + i,
                Status = 'New',
                Priority = priorityLevel,
                Origin = 'Web'
            ));
        }
        if (doInsert && !caseList.isEmpty()) {
            insert caseList;
        }
        return caseList;
    }
}

System.debug('✅ TestDataFactory compiled with modular Account, Contact, and Case builders.\n');

// ----------------------------------------------------------------------------
// 2. THE @TestSetup LIFECYCLE & STATE ISOLATION
// ----------------------------------------------------------------------------
// In an Apex test class:
// @TestSetup static void makeData() {
//     // Executed ONCE for the entire test class!
//     Account acc = TestDataFactory.createAccount('NexGen Global Infra', true);
//     TestDataFactory.createCases(acc.Id, 5, 'High', true);
// }
//
// How State Isolation Works:
// Test Method 1: Updates Case #1 status to 'Closed'.
// Test Method 2: Queries Case #1 -> Status is STILL 'New'!
// Salesforce rolls back database mutations between individual test methods
// back to the initial @TestSetup snapshot.

System.debug('--- 2. @TestSetup LIFECYCLE SIMULATION ---');
System.debug('Step 1: @TestSetup executes ONCE and commits records to temporary test DB.');
System.debug('Step 2: Test Method 1 reads records, mutates them, runs assertions.');
System.debug('Step 3: Salesforce automatically rolls back Method 1 changes.');
System.debug('Step 4: Test Method 2 starts with the exact pristine @TestSetup state.');
System.debug('Result: 50% to 70% faster test execution across large test suites!\n');

// ----------------------------------------------------------------------------
// 3. FACTORY USAGE DEMO (SYNCHRONOUS VERIFICATION)
// ----------------------------------------------------------------------------
System.debug('--- 3. TEST DATA FACTORY EXECUTION VERIFICATION ---');

// Generate 1 Account in memory
Account clientAcc = TestDataFactory.createAccount('Acme Logistics Corp', false);
clientAcc.BillingCity = 'Jaipur';
clientAcc.BillingCountry = 'India';
System.debug('>> Generated Account: ' + clientAcc.Name + ' (City: ' + clientAcc.BillingCity + ')');

// Generate 3 Mock Cases for the Account
List<Case> sampleCases = TestDataFactory.createCases(null, 3, 'Critical', false);
for (Integer i = 0; i < sampleCases.size(); i++) {
    System.debug('   Mock Case ' + (i + 1) + ': ' + sampleCases[i].Subject + ' [Priority: ' + sampleCases[i].Priority + ']');
}

System.debug('\n========================================================');
System.debug('=== TOPIC 18 COMPLETE: TEST DATA FACTORY MASTERED   ===');
System.debug('========================================================');
