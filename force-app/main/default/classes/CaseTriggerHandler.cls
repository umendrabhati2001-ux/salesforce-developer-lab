/**
 * @description Enterprise Trigger Handler for Case object.
 *              Implements logic routing for insert and update events.
 */
public with sharing class CaseTriggerHandler {
  public static void handleBeforeInsert(List<Case> newCases) {
    ComplaintService.applySlaTargets(newCases);
  }

  public static void handleBeforeUpdate(
    List<Case> newCases,
    Map<Id, Case> oldCases
  ) {
    List<Case> categoryChangedCases = new List<Case>();

    for (Case c : newCases) {
      Case oldCase = oldCases.get(c.Id);
      // Check if user changed the complaint category
      if (c.Complaint_Category__c != oldCase.Complaint_Category__c) {
        // Reset SLA hours to null if user did not manually override it, allowing recalculation
        if (c.Resolution_SLA_Hours__c == oldCase.Resolution_SLA_Hours__c) {
          c.Resolution_SLA_Hours__c = null;
        }
        categoryChangedCases.add(c);
      }
    }

    if (!categoryChangedCases.isEmpty()) {
      ComplaintService.applySlaTargets(categoryChangedCases);
    }
  }
}
