// ============================================================================
// TOPIC 25: WIRE SERVICE (@wire) WITH APEX & IMPERATIVE APEX CALLS
// ============================================================================
// Senior Salesforce Developer Guide: Connecting LWC directly to Apex backend
// controllers (@AuraEnabled(cacheable=true)), wire provision functions vs
// wire properties, refreshApex() cache busting, and Imperative execution.
// ============================================================================

import { LightningElement, api, wire, track } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

// Apex Controller Methods
import getActiveComplaints from '@salesforce/apex/ComplaintService.getActiveComplaints';
import bulkEscalateCases from '@salesforce/apex/ComplaintService.bulkEscalateCases';

export default class ComplaintWireApexMastery extends LightningElement {
    @api accountId;
    @track complaints = [];
    @track errors;
    isLoading = false;

    // Wired result container for cache invalidation via refreshApex()
    wiredComplaintsResult;

    // ------------------------------------------------------------------------
    // 1. REACTIVE WIRE SERVICE WITH APEX
    // ------------------------------------------------------------------------
    /**
     * Rules for @AuraEnabled with @wire:
     * 1. Apex method MUST have `(cacheable=true)`
     * 2. Cannot execute DML inside cacheable Apex methods
     * 3. Prefix reactive parameters with `$` ('$accountId')
     */
    @wire(getActiveComplaints, { accountId: '$accountId' })
    wiredComplaints(result) {
        this.wiredComplaintsResult = result;
        const { data, error } = result;

        if (data) {
            this.complaints = data.map((record) => ({
                ...record,
                isCritical: record.Priority === 'Critical',
                formattedSla: `${record.SLA_Hours__c || 24} hrs`
            }));
            this.errors = undefined;
        } else if (error) {
            this.errors = error;
            this.complaints = [];
            console.error('[Apex Wire Error]', error);
        }
    }

    // ------------------------------------------------------------------------
    // 2. REFRESHING CACHED APEX DATA: refreshApex()
    // ------------------------------------------------------------------------
    async handleManualRefresh() {
        this.isLoading = true;
        try {
            await refreshApex(this.wiredComplaintsResult);
            this.showToast('Updated', 'Complaints list synchronized with server', 'info');
        } catch (error) {
            this.showToast('Refresh Failed', error.body?.message, 'error');
        } finally {
            this.isLoading = false;
        }
    }

    // ------------------------------------------------------------------------
    // 3. IMPERATIVE APEX EXECUTION (WHEN DML IS REQUIRED)
    // ------------------------------------------------------------------------
    /**
     * Imperative Apex is used when:
     * - Executing on a user action (e.g. button click)
     * - Performing DML (insert, update, delete)
     * - Method is NOT cacheable
     */
    async handleBulkEscalate() {
        this.isLoading = true;
        const caseIds = this.complaints.map((c) => c.Id);

        try {
            const escalatedCount = await bulkEscalateCases({ caseIds });
            this.showToast('Success', `Escalated ${escalatedCount} cases successfully!`, 'success');
            // Bust the cache to reflect escalated status
            await refreshApex(this.wiredComplaintsResult);
        } catch (error) {
            this.showToast('Escalation Error', error.body?.message || 'Server error', 'error');
        } finally {
            this.isLoading = false;
        }
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}
