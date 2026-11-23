/**
 * @description Queueable Apex implementation for asynchronous Stripe refunds triggered from Case disputes.
 * Enforces Database.AllowsCallouts and decouples trigger transactions from external HTTP latency.
 * @author Umendra Bhati (Salesforce Developer Lab)
 */
public with sharing class CaseRefundQueueable implements Queueable, Database.AllowsCallouts {
    private List<Id> caseIds;
    private String refundReason;

    public CaseRefundQueueable(List<Id> caseIds, String refundReason) {
        this.caseIds = caseIds;
        this.refundReason = refundReason;
    }

    public void execute(QueueableContext context) {
        if (caseIds == null || caseIds.isEmpty()) {
            return;
        }

        // SOQL Query for cases eligible for automated refund settlement (0 SOQL inside loops)
        List<Case> casesToRefund = [
            SELECT Id, CaseNumber, Status, Subject, Description
            FROM Case
            WHERE Id IN :caseIds
            WITH SECURITY_ENFORCED
            LIMIT 50
        ];

        List<Case> casesToUpdate = new List<Case>();

        for (Case c : casesToRefund) {
            // Simulated Stripe charge reference linked to Case Complaint
            String mockChargeId = 'ch_case_' + c.CaseNumber;
            Integer refundAmountCents = 15000; // $150.00 dispute settlement

            StripeService.StripeRefundResult refundResult = StripeService.processCaseRefund(
                mockChargeId,
                refundAmountCents,
                this.refundReason != null ? this.refundReason : 'Settlement for Case ' + c.CaseNumber
            );

            if (refundResult.isSuccess) {
                c.Status = 'Closed';
                c.Description = (c.Description != null ? c.Description : '') +
                    '\n[AUTO-REFUND]: Stripe Transaction ' + refundResult.refundId +
                    ' processed successfully for $' + refundResult.amountRefunded;
                casesToUpdate.add(c);
            }
        }

        // Bulk DML outside loop (0 DML inside loops)
        if (!casesToUpdate.isEmpty()) {
            update casesToUpdate;
        }
    }
}
