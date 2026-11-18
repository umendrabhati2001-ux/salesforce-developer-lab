// ============================================================================
// TOPIC 23: COMPONENT COMMUNICATION IN LIGHTNING WEB COMPONENTS (LWC)
// ============================================================================
// Senior Salesforce Developer Guide: Parent-Child (@api methods & properties),
// Child-to-Parent (CustomEvent dispatching & bubbling), and Sibling-to-Sibling
// messaging using Lightning Message Service (LMS).
// ============================================================================

import { LightningElement, api, wire } from 'lwc';
import { publish, subscribe, unsubscribe, MessageContext } from 'lightning/messageService';
import COMPLAINT_CHANNEL from '@salesforce/messageChannel/ComplaintChannel__c';

/**
 * ----------------------------------------------------------------------------
 * 1. COMMUNICATION PATTERNS MATRIX
 * ----------------------------------------------------------------------------
 * | Pattern             | Mechanism                     | Direction               | Scope               |
 * |---------------------|-------------------------------|-------------------------|---------------------|
 * | Parent to Child     | `@api` Properties & Methods   | Downward                | Direct Hierarchy    |
 * | Child to Parent     | `CustomEvent` & `dispatchEvent`| Upward                  | Direct or Bubbled   |
 * | Sibling to Sibling  | Lightning Message Service(LMS)| Any (Decoupled Pub/Sub) | Cross-DOM / Across Pages |
 */

export default class ComplaintCommunicationController extends LightningElement {

    // ------------------------------------------------------------------------
    // 2. PARENT-TO-CHILD: EXPOSING PUBLIC METHODS VIA @api
    // ------------------------------------------------------------------------
    /**
     * Public methods can be invoked by the parent component using:
     * this.template.querySelector('c-child-component').refreshCaseData();
     */
    @api
    refreshCaseData(silent = false) {
        if (!silent) {
            console.log('[LWC Parent->Child] Refresh invoked by parent controller.');
        }
        return { status: 'SUCCESS', timestamp: Date.now() };
    }

    // ------------------------------------------------------------------------
    // 3. CHILD-TO-PARENT: CUSTOM EVENT DISPATCHING
    // ------------------------------------------------------------------------
    /**
     * Dispatch an event when a complaint SLA breaches or an action occurs.
     * Rules for CustomEvent:
     * - Event name must NOT contain uppercase letters or spaces.
     * - `detail` payload holds the data sent to the parent.
     * - `bubbles: true, composed: true` allows crossing the Shadow DOM boundary.
     */
    handleEscalationRequest(event) {
        const payload = {
            caseId: '500xx000001234AAA',
            urgency: 'CRITICAL',
            reason: 'SLA timer elapsed beyond 2 hours threshold'
        };

        const escalationEvent = new CustomEvent('escalatecomplaint', {
            detail: payload,
            bubbles: true,
            composed: true // Allows event to bubble past the shadow root boundary
        });

        this.dispatchEvent(escalationEvent);
        console.log('[LWC Child->Parent] Dispatched escalatecomplaint event with payload:', payload);
    }

    // ------------------------------------------------------------------------
    // 4. SIBLING-TO-SIBLING: LIGHTNING MESSAGE SERVICE (LMS)
    // ------------------------------------------------------------------------
    @wire(MessageContext)
    messageContext;

    subscription = null;

    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    disconnectedCallback() {
        this.unsubscribeToMessageChannel();
    }

    subscribeToMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                COMPLAINT_CHANNEL,
                (message) => this.handleIncomingLmsMessage(message)
            );
        }
    }

    unsubscribeToMessageChannel() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }

    handleIncomingLmsMessage(message) {
        console.log('[LWC LMS Message Received]', message);
    }

    publishBroadcast(statusUpdate) {
        const message = {
            recordId: '500xx000001234AAA',
            newStatus: statusUpdate,
            source: 'ComplaintCommunicationController'
        };
        publish(this.messageContext, COMPLAINT_CHANNEL, message);
        console.log('[LWC LMS Message Published]', message);
    }
}
