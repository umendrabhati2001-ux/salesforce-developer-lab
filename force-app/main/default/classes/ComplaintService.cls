/**
 * @description Enterprise Service layer handling business logic for Customer Complaints and Support Cases.
 *              Follows strict bulkification rules with zero SOQL/DML in loops.
 */
public with sharing class ComplaintService {
  public class ComplaintException extends Exception {
  }

  // SLA Target mapping by Complaint Category in hours
  private static final Map<String, Integer> CATEGORY_SLA_MAP = new Map<String, Integer>{
    'Cloud Downtime' => 2,
    'Hardware Failure' => 4,
    'Network Latency' => 8,
    'Software Bug' => 12,
    'Billing Dispute' => 24
  };

  /**
   * @description Applies target SLA hours automatically based on the complaint category.
   *              Invoked in before-insert or before-update trigger context.
   * @param cases List of Case records from Trigger.new
   */
  public static void applySlaTargets(List<Case> cases) {
    if (cases == null || cases.isEmpty()) {
      return;
    }

    for (Case c : cases) {
      if (
        c.Complaint_Category__c != null &&
        CATEGORY_SLA_MAP.containsKey(c.Complaint_Category__c)
      ) {
        // Only override if SLA hours is not manually customized
        if (c.Resolution_SLA_Hours__c == null) {
          c.Resolution_SLA_Hours__c = CATEGORY_SLA_MAP.get(
            c.Complaint_Category__c
          );
        }
      } else if (c.Resolution_SLA_Hours__c == null) {
        // Default SLA fallback
        c.Resolution_SLA_Hours__c = 24;
      }
    }
  }

  /**
   * @description Fetches all complaints and associated action items for an Account.
   *              Prepared for Aura/LWC consumption in Phase 9.
   * @param accountId Salesforce Id of the Account
   * @return List of Case records with child action items
   */
  @AuraEnabled(cacheable=true)
  public static List<Case> getComplaintsByAccount(Id accountId) {
    if (accountId == null) {
      throw new ComplaintException('Account ID cannot be null.');
    }

    return [
      SELECT
        Id,
        CaseNumber,
        Subject,
        Status,
        Priority,
        Complaint_Category__c,
        Resolution_SLA_Hours__c,
        SLA_Breach_Status__c,
        Total_Action_Items__c,
        CreatedDate,
        (
          SELECT Id, Action_Title__c, Status__c, Due_Date__c
          FROM Complaint_Action_Items__r
          ORDER BY CreatedDate ASC
        )
      FROM Case
      WHERE AccountId = :accountId
      ORDER BY CreatedDate DESC
      LIMIT 100
    ];
  }
}
