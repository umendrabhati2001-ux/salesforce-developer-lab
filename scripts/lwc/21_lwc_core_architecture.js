// ============================================================================
// TOPIC 21: LIGHTNING WEB COMPONENTS (LWC) CORE ARCHITECTURE & ES6+ JAVASCRIPT
// ============================================================================
// Senior Salesforce Developer Guide: Native W3C Web Components standard,
// Shadow DOM encapsulation, modern lwc:if conditional rendering, and lifecycle hooks.
// ============================================================================

/**
 * ----------------------------------------------------------------------------
 * 1. AURA VS LIGHTNING WEB COMPONENTS (LWC) — THE PARADIGM SHIFT
 * ----------------------------------------------------------------------------
 * | Feature             | Legacy Aura Framework          | Modern LWC Framework                  |
 * |---------------------|--------------------------------|---------------------------------------|
 * | Standards           | Proprietary Salesforce engine  | W3C Web Components Standard (Native)  |
 * | Performance         | Heavy JavaScript abstraction   | Executes directly in modern browser   |
 * | DOM Encapsulation   | None (Leaky CSS, global clashing)| Shadow DOM (Scoped CSS & DOM boundary)|
 * | Language            | ES5 JavaScript + custom markup | Modern ES6+ JavaScript (async/await)  |
 * | Skill Portability   | Salesforce-only proprietary    | Standard Web Development (Vue/React)  |
 */

/**
 * ----------------------------------------------------------------------------
 * 2. LWC 4-FILE BUNDLE ANATOMY
 * ----------------------------------------------------------------------------
 * A complete LWC component (e.g. `complaintCard`) consists of:
 * 
 * 1. complaintCard.html:
 *    - HTML template containing UI elements, base components (<lightning-card>),
 *      and reactive data bindings ({property}).
 * 
 * 2. complaintCard.js:
 *    - ES6 Class extending `LightningElement`.
 *    - Manages component state, properties, handlers, and lifecycle hooks.
 * 
 * 3. complaintCard.js-meta.xml:
 *    - Metadata configuration defining component visibility and exposure targets
 *      (e.g., lightning__RecordPage, lightning__AppPage, lightning__HomePage).
 * 
 * 4. complaintCard.css (Optional):
 *    - Scoped CSS rules. Shadow DOM guarantees these styles NEVER leak into
 *      the parent container or other components.
 */

// ----------------------------------------------------------------------------
// 3. SAMPLE COMPONENT ES6 CLASS IMPLEMENTATION (Cap-stone Example)
// ----------------------------------------------------------------------------
import { LightningElement, api, track } from 'lwc';

export default class ComplaintCardArchitectureDemo extends LightningElement {
    
    // Public reactive property (Injected by parent component or Lightning Record Page)
    @api recordId;
    @api cardTitle = 'Customer Complaint Investigation';

    // Private reactive properties
    isLoading = false;
    currentStatus = 'New';
    
    // Collection for list iteration
    complaintTasks = [
        { id: 't1', title: 'Verify Router Firmware Version', isDone: true },
        { id: 't2', title: 'Capture Network Packet Trace', isDone: false },
        { id: 't3', title: 'Dispatch Field Engineer to Site', isDone: false }
    ];

    // ------------------------------------------------------------------------
    // 4. LWC LIFECYCLE HOOKS (IN ORDER OF EXECUTION)
    // ------------------------------------------------------------------------

    /**
     * 1. constructor():
     * - Fires when the component instance is created in memory.
     * - MUST call `super()` first.
     * - Access to DOM elements or public `@api` properties is NOT available yet.
     */
    constructor() {
        super();
        console.log('⚡ [Lifecycle 1 - constructor]: Component instance allocated in memory.');
    }

    /**
     * 2. connectedCallback():
     * - Fires when the component is inserted into the browser DOM.
     * - Equivalent to `init` event in Aura or `componentDidMount` in React.
     * - Ideal place for initiating data fetches, subscribing to LMS channels, or URL parsing.
     */
    connectedCallback() {
        console.log('🌐 [Lifecycle 2 - connectedCallback]: Component inserted into DOM tree.');
        console.log('   Target Case Record ID: ' + this.recordId);
    }

    /**
     * 3. renderedCallback():
     * - Fires after the component finishes rendering (and re-renders on state change).
     * - CAUTION: Do NOT mutate reactive properties here without guards, or you will
     *   trigger an infinite re-render loop!
     */
    renderedCallback() {
        console.log('🎨 [Lifecycle 3 - renderedCallback]: Template UI painted on screen.');
    }

    /**
     * 4. disconnectedCallback():
     * - Fires when the component is removed from the browser DOM.
     * - Clean up event listeners, intervals, and LMS message subscriptions here to prevent memory leaks.
     */
    disconnectedCallback() {
        console.log('🧹 [Lifecycle 4 - disconnectedCallback]: Cleanup completed.');
    }

    /**
     * 5. errorCallback(error, stack):
     * - Fires when a descendant child component throws an uncaught error.
     * - Acts as an Error Boundary to prevent the entire page from crashing.
     */
    errorCallback(error, stack) {
        console.error('🛡️ [Lifecycle 5 - errorCallback]: Caught child component failure:', error);
    }

    // ------------------------------------------------------------------------
    // 5. COMPUTED GETTERS (BEST PRACTICE FOR DYNAMIC UI LOGIC)
    // ------------------------------------------------------------------------
    // Avoid putting complex conditional expressions inside HTML templates.
    // Use Getters instead:

    get isEscalated() {
        return this.currentStatus === 'Critical' || this.currentStatus === 'Escalated';
    }

    get badgeClass() {
        return this.isEscalated 
            ? 'slds-badge slds-theme_error' 
            : 'slds-badge slds-theme_success';
    }

    get completedTasksCount() {
        return this.complaintTasks.filter(task => task.isDone).length;
    }

    // Event Handler
    handleStatusToggle() {
        this.currentStatus = (this.currentStatus === 'New') ? 'Critical' : 'New';
    }
}

/**
 * ----------------------------------------------------------------------------
 * 6. MODERN DIRECTIVE CHEAT SHEET (HTML TEMPLATE RULES)
 * ----------------------------------------------------------------------------
 * 
 * 1. Modern Conditional Rendering (Winter '23):
 *    <template lwc:if={isEscalated}>
 *        <div class="alert-box">CRITICAL SLA BREACH DETECTED</div>
 *    </template>
 *    <template lwc:elseif={isLoading}>
 *        <lightning-spinner alternative-text="Loading..."></lightning-spinner>
 *    </template>
 *    <template lwc:else>
 *        <div>Standard Investigation in Progress</div>
 *    </template>
 * 
 * 2. List Iteration:
 *    <template for:each={complaintTasks} for:item="task">
 *        <!-- KEY IS STRICTLY MANDATORY ON FIRST CHILD -->
 *        <div key={task.id} class="task-row">
 *            <span>{task.title}</span>
 *        </div>
 *    </template>
 */
