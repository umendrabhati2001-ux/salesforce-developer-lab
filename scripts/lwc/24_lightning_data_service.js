// ============================================================================
// TOPIC 24: LIGHTNING DATA SERVICE (LDS) IN LIGHTNING WEB COMPONENTS
// ============================================================================
// Senior Salesforce Developer Guide: Zero-Apex CRUD operations, standard form
// components (lightning-record-form, lightning-record-edit-form), and wire
// adapters (getRecord, updateRecord, deleteRecord) with Client-Side Caching.
// ============================================================================

import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue, updateRecord, deleteRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

// Standard & Custom Field Schema References
import CASE_NUMBER_FIELD from '@salesforce/schema/Case.CaseNumber';
import STATUS_FIELD from '@salesforce/schema/Case.Status';
import PRIORITY_FIELD from '@salesforce/schema/Case.Priority';
import SUBJECT_FIELD from '@salesforce/schema/Case.Subject';

const FIELDS = [CASE_NUMBER_FIELD, STATUS_FIELD, PRIORITY_FIELD, SUBJECT_FIELD];

export default class ComplaintLdsMastery extends LightningElement {
    @api recordId;

    // ------------------------------------------------------------------------
    // 1. LDS WIRE ADAPTER: getRecord
    // ------------------------------------------------------------------------
    /**
     * getRecord operates on the shared client-side LDS cache.
     * If another component on the page updates this record, getRecord automatically
     * re-wires and reflects the updated values WITHOUT a server trip!
     */
    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    complaintRecord;

    get caseNumber() {
        return getFieldValue(this.complaintRecord.data, CASE_NUMBER_FIELD);
    }

    get status() {
        return getFieldValue(this.complaintRecord.data, STATUS_FIELD);
    }

    get isEscalated() {
        return this.status === 'Escalated';
    }

    // ------------------------------------------------------------------------
    // 2. IMPERATIVE RECORD MUTATION: updateRecord
    // ------------------------------------------------------------------------
    async handleFastResolution() {
        const fields = {};
        fields['Id'] = this.recordId;
        fields[STATUS_FIELD.fieldApiName] = 'Closed - Resolved';

        const recordInput = { fields };

        try {
            await updateRecord(recordInput);
            this.showToast('Success', 'Complaint resolved successfully via LDS', 'success');
        } catch (error) {
            this.showToast('Error', error.body?.message || 'Failed to update record', 'error');
        }
    }

    // ------------------------------------------------------------------------
    // 3. RECORD DELETION: deleteRecord
    // ------------------------------------------------------------------------
    async handlePurgeRecord() {
        try {
            await deleteRecord(this.recordId);
            this.showToast('Deleted', 'Case record purged from database', 'warning');
        } catch (error) {
            this.showToast('Error', error.body?.message || 'Failed to delete record', 'error');
        }
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}
