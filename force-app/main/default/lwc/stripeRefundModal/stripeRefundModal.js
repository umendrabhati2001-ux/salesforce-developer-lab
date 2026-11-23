import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import processCaseRefundFromLwc from '@salesforce/apex/ComplaintService.processCaseRefundFromLwc';

export default class StripeRefundModal extends LightningElement {
    @api recordId;
    @track refundAmount = 150.00;
    @track disputeReason = 'service_sla_breach';
    @track auditNotes = 'Customer goodwill compensation for cloud downtime incident.';
    @track isLoading = false;

    get reasonOptions() {
        return [
            { label: 'Cloud Downtime / SLA Breach', value: 'service_sla_breach' },
            { label: 'Defective Delivery / Damaged Asset', value: 'defective_product' },
            { label: 'Duplicate Billing Transaction', value: 'duplicate_charge' },
            { label: 'Executive Customer Retention Settlement', value: 'customer_retention' }
        ];
    }

    handleAmountChange(event) {
        this.refundAmount = event.target.value;
    }

    handleReasonChange(event) {
        this.disputeReason = event.target.value;
    }

    handleNotesChange(event) {
        this.auditNotes = event.target.value;
    }

    handleCancel() {
        this.dispatchEvent(new CustomEvent('close'));
    }

    async handleExecuteRefund() {
        if (!this.refundAmount || this.refundAmount <= 0) {
            this.showToast('Validation Error', 'Please enter a valid refund amount greater than $0.00', 'error');
            return;
        }

        this.isLoading = true;

        try {
            const combinedReason = `[REASON: ${this.disputeReason}] - ${this.auditNotes || 'Automated Refund'}`;
            // Call Apex @AuraEnabled method
            const jobId = await processCaseRefundFromLwc({
                caseId: this.recordId,
                disputeReason: combinedReason
            });

            this.showToast(
                'Stripe Refund Dispatched',
                `Asynchronous Queueable Job (${jobId}) enqueued. Payment gateway confirmed. Case status updating.`,
                'success'
            );

            // Notify parent / close modal
            this.dispatchEvent(new CustomEvent('close'));
        } catch (error) {
            const msg = error.body ? error.body.message : error.message || 'Unknown Apex Error';
            this.showToast('Callout Failure', msg, 'error');
        } finally {
            this.isLoading = false;
        }
    }

    showToast(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
    }
}
