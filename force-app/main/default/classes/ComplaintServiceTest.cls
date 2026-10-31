/**
 * @description Comprehensive test suite covering ComplaintService and CaseTrigger.
 *              Includes unit tests, negative assertions, and 200-record bulk tests.
 */
@isTest
private class ComplaintServiceTest {
  @TestSetup
  static void setupTestData() {
    Account testAcc = new Account(
      Name = 'Test Enterprise Client',
      Industry = 'Technology'
    );
    insert testAcc;

    Contact testContact = new Contact(
      FirstName = 'Elena',
      LastName = 'Rostova',
      Email = 'elena.rostova@testenterprise.com',
      AccountId = testAcc.Id
    );
    insert testContact;
  }

  @isTest
  static void testSlaAssignmentOnInsert() {
    Account acc = [
      SELECT Id
      FROM Account
      WHERE Name = 'Test Enterprise Client'
      LIMIT 1
    ];

    Test.startTest();
    Case c = new Case(
      AccountId = acc.Id,
      Subject = 'Cloud Database Outage',
      Status = 'New',
      Priority = 'High',
      Origin = 'Web',
      Complaint_Category__c = 'Cloud Downtime'
    );
    insert c;
    Test.stopTest();

    Case insertedCase = [
      SELECT Id, Resolution_SLA_Hours__c
      FROM Case
      WHERE Id = :c.Id
    ];
    // Cloud Downtime should map automatically to 2 hours
    Assert.areEqual(
      2,
      insertedCase.Resolution_SLA_Hours__c,
      'Cloud Downtime SLA should be 2 hours'
    );
  }

  @isTest
  static void testSlaAssignmentOnCategoryUpdate() {
    Account acc = [
      SELECT Id
      FROM Account
      WHERE Name = 'Test Enterprise Client'
      LIMIT 1
    ];

    Case c = new Case(
      AccountId = acc.Id,
      Subject = 'General Query',
      Status = 'New',
      Priority = 'Medium',
      Origin = 'Phone',
      Complaint_Category__c = 'Billing Dispute'
    );
    insert c;

    Test.startTest();
    c.Complaint_Category__c = 'Hardware Failure';
    update c;
    Test.stopTest();

    Case updatedCase = [
      SELECT Id, Resolution_SLA_Hours__c
      FROM Case
      WHERE Id = :c.Id
    ];
    // Hardware Failure should recalculate to 4 hours
    Assert.areEqual(
      4,
      updatedCase.Resolution_SLA_Hours__c,
      'Hardware Failure SLA should be 4 hours'
    );
  }

  @isTest
  static void testGetComplaintsByAccount() {
    Account acc = [
      SELECT Id
      FROM Account
      WHERE Name = 'Test Enterprise Client'
      LIMIT 1
    ];

    Case c = new Case(
      AccountId = acc.Id,
      Subject = 'Network Drop',
      Status = 'New',
      Priority = 'Low',
      Origin = 'Web',
      Complaint_Category__c = 'Network Latency'
    );
    insert c;

    Test.startTest();
    List<Case> results = ComplaintService.getComplaintsByAccount(acc.Id);
    Test.stopTest();

    Assert.areEqual(
      1,
      results.size(),
      'Should return 1 complaint for the account'
    );
    Assert.areEqual('Network Drop', results[0].Subject);
  }

  @isTest
  static void testGetComplaintsByAccountNullCheck() {
    Boolean exceptionCaught = false;
    Test.startTest();
    try {
      ComplaintService.getComplaintsByAccount(null);
    } catch (ComplaintService.ComplaintException e) {
      exceptionCaught = true;
    }
    Test.stopTest();

    Assert.isTrue(
      exceptionCaught,
      'ComplaintException should be thrown for null AccountId'
    );
  }

  @isTest
  static void testApplySlaTargetsNullAndDefault() {
    Test.startTest();
    // Null list guard
    ComplaintService.applySlaTargets(null);
    ComplaintService.applySlaTargets(new List<Case>());

    // Fallback default SLA
    Case fallbackCase = new Case(Subject = 'Uncategorized ticket');
    ComplaintService.applySlaTargets(new List<Case>{ fallbackCase });
    Test.stopTest();

    Assert.areEqual(
      24,
      fallbackCase.Resolution_SLA_Hours__c,
      'Uncategorized cases should receive default 24hr SLA'
    );
  }

  @isTest
  static void testBulkCaseInsertGovernorLimits() {
    Account acc = [
      SELECT Id
      FROM Account
      WHERE Name = 'Test Enterprise Client'
      LIMIT 1
    ];
    List<Case> bulkCases = new List<Case>();

    for (Integer i = 0; i < 200; i++) {
      bulkCases.add(
        new Case(
          AccountId = acc.Id,
          Subject = 'Bulk Outage Ticket #' + i,
          Status = 'New',
          Priority = 'High',
          Origin = 'Web',
          Complaint_Category__c = 'Cloud Downtime'
        )
      );
    }

    Test.startTest();
    insert bulkCases;
    Test.stopTest();

    List<Case> insertedCases = [
      SELECT Id, Resolution_SLA_Hours__c
      FROM Case
      WHERE AccountId = :acc.Id
    ];
    Assert.areEqual(
      200,
      insertedCases.size(),
      'All 200 bulk cases should be inserted without Governor Limit exceptions'
    );
    for (Case c : insertedCases) {
      Assert.areEqual(
        2,
        c.Resolution_SLA_Hours__c,
        'Every bulk case must have SLA applied'
      );
    }
  }
}
