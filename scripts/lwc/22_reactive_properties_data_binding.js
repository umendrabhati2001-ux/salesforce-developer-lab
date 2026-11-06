// ============================================================================
// TOPIC 22: REACTIVE PROPERTIES, @api, @track & COMPUTED GETTERS IN LWC
// ============================================================================
// Senior Salesforce Developer Guide: Mastering LWC reactivity mechanics,
// understanding Spring '20 reactivity changes, deep object mutations, and
// component public contracts.
// ============================================================================

/**
 * ----------------------------------------------------------------------------
 * 1. THE EVOLUTION OF LWC REACTIVITY
 * ----------------------------------------------------------------------------
 * | Era                  | Primitive Fields (String, Boolean) | Objects & Arrays (Deep mutation)     |
 * |----------------------|------------------------------------|--------------------------------------|
 * | Pre-Spring '20       | Required @track decorator          | Required @track decorator            |
 * | Modern LWC (Present) | Reactive by default (NO @track)    | Requires @track OR reference spread  |
 */

import { LightningElement, api, track } from 'lwc';

export default class ComplaintReactiveMasteryDemo extends LightningElement {

    // ------------------------------------------------------------------------
    // 2. THE @api DECORATOR (PUBLIC COMPONENT CONTRACT)
    // ------------------------------------------------------------------------
    /**
     * Rules for @api:
     * 1. Exposes properties to parent components or Lightning App Builder.
     * 2. Special Context Properties:
     *    - `@api recordId`: Automatically injected on record detail pages (18-char Case ID).
     *    - `@api objectApiName`: Automatically injected (e.g. 'Case').
     * 3. IMMUTABILITY RULE: A child component must NEVER reassign an `@api` property directly!
     *    Public properties are read-only to the component that declares them.
     */
    @api recordId;
    @api objectApiName;
    @api enableAutoEscalation = false;

    // ------------------------------------------------------------------------
    // 3. PRIMITIVE REACTIVITY (NO @track NEEDED)
    // ------------------------------------------------------------------------
    // Changing these primitives triggers an automatic, seamless DOM re-render
    searchKeyword = '';
    caseCount = 0;
    isInvestigationActive = false;

    // ------------------------------------------------------------------------
    // 4. COMPLEX OBJECT REACTIVITY & @track
    // ------------------------------------------------------------------------
    /**
     * If an object or array's INTERNAL properties mutate in-place, the JavaScript
     * object reference remains the same. Modern LWC will not detect this unless:
     * Option A: You use the `@track` decorator.
     * Option B: You reassign the object using the Object Spread operator ({...obj}).
     */

    // Option A: Using @track for deep property mutation
    @track activeComplaint = {
        caseNumber: '0001092',
        customerName: 'Acme Logistics',
        severity: 'High',
        slaHoursRemaining: 4
    };

    // Option B: Array mutation using Spread (Industry Best Practice)
    timelineEvents = ['Complaint Created', 'Hardware Diagnostic Dispatched'];

    // ------------------------------------------------------------------------
    // 5. EVENT HANDLERS & TWO-WAY DATA BINDING
    // ------------------------------------------------------------------------
    handleKeywordChange(event) {
        // Two-way binding: update state from input element
        this.searchKeyword = event.target.value;
    }

    handleEscalateSeverity() {
        // Deep mutation with @track:
        this.activeComplaint.severity = 'Critical';
        this.activeComplaint.slaHoursRemaining = 1;
        console.log('⚡ Active complaint mutated directly via @track.');
    }

    handleAddTimelineEvent() {
        // Spread pattern (Creates brand new reference — works with or without @track!)
        this.timelineEvents = [...this.timelineEvents, 'SLA Breach Flagged: ' + new Date().toLocaleTimeString()];
    }

    // ------------------------------------------------------------------------
    // 6. COMPUTED GETTERS (PERFORMANCE OPTIMIZED STATE)
    // ------------------------------------------------------------------------
    /**
     * Best Practice: Never write complex boolean logic or ternary operators
     * inside HTML templates. Encapsulate logic in Getters.
     * Getters are automatically cached and only re-calculate when their
     * underlying reactive dependencies change.
     */

    get isCriticalSla() {
        return this.activeComplaint.severity === 'Critical' || this.activeComplaint.slaHoursRemaining <= 2;
    }

    get slaAlertBadgeClass() {
        return this.isCriticalSla
            ? 'slds-badge slds-theme_error animate-pulse'
            : 'slds-badge slds-theme_success';
    }

    get formattedSummary() {
        return `Case #${this.activeComplaint.caseNumber} (${this.activeComplaint.customerName}) — SLA: ${this.activeComplaint.slaHoursRemaining}h remaining`;
    }

    get hasTimelineEvents() {
        return this.timelineEvents && this.timelineEvents.length > 0;
    }
}
