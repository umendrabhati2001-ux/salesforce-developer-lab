// ========================================================
// TOPIC 10: DML OPERATIONS & PARTIAL PROCESSING
// ========================================================

// 1. Prepare Bulk Records for DML (One valid, One intentionally invalid)
List<Case> testCases = new List<Case>();

// Record A: Valid High-Priority Case
testCases.add(
  new Case(
    Subject = 'Bulk DML Valid Ticket',
    Status = 'New',
    Priority = 'High',
    Origin = 'Web',
    Complaint_Category__c = 'Cloud Downtime'
  )
);

// Record B: Intentionally Invalid (Violating Validation Rule: High Priority + Closed + No RCA)
testCases.add(
  new Case(
    Subject = 'Bulk DML Invalid Ticket (Should Fail)',
    Status = 'Closed',
    Priority = 'High',
    Origin = 'Web' // Missing Root_Cause_Summary__c -> Triggers validation rule!
  )
);

// 2. Execute Partial Success DML (allOrNone = false)
System.debug('--- EXECUTING DATABASE.INSERT WITH ALL_OR_NONE = FALSE ---');
Database.SaveResult[] saveResults = Database.insert(testCases, false);

// 3. Inspecting the SaveResult Array
for (Integer i = 0; i < saveResults.size(); i++) {
  Database.SaveResult sr = saveResults[i];
  if (sr.isSuccess()) {
    System.debug(
      'SUCCESS: Record [' + i + '] inserted successfully with ID: ' + sr.getId()
    );
  } else {
    System.debug('FAILED: Record [' + i + '] failed as expected!');
    for (Database.Error err : sr.getErrors()) {
      System.debug('   -> Error Status Code: ' + err.getStatusCode());
      System.debug('   -> Validation Message: ' + err.getMessage());
      System.debug('   -> Target Fields: ' + err.getFields());
    }
  }
}
