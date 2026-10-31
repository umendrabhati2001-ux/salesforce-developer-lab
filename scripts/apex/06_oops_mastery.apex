// ========================================================
// TOPIC 06: OBJECT-ORIENTED PROGRAMMING (OOPS) IN APEX
// ========================================================

public class ComplaintTracker {
    // 1. Instance Counter (Note: static is only allowed in top-level .cls files!)
    public Integer totalComplaintsLogged = 0;

    // 2. Private Variables (Encapsulation: Protected from direct outside tampering)
    private String ticketNumber;
    private String clientName;
    private String priority;
    private Integer slaHours;

    // 3. Constructor: Initializes object state when 'new' is called
    public ComplaintTracker(String clientName, String priority) {
        totalComplaintsLogged++;
        this.ticketNumber = 'TICK-' + totalComplaintsLogged;
        this.clientName = clientName;
        this.priority = priority;
        this.slaHours = calculateSla(priority); // Auto-calculate on creation
    }

    // 4. Overloaded Method 1: Standard SLA calculation
    public Integer calculateSla(String priority) {
        if (priority == 'Critical') return 2;
        if (priority == 'High') return 4;
        return 24; // Default
    }

    // 5. Overloaded Method 2: Polymorphism (Same name, different parameters for VIP clients)
    public Integer calculateSla(String priority, Boolean isVipClient) {
        Integer baseSla = calculateSla(priority);
        return isVipClient ? (baseSla / 2) : baseSla; // VIP gets 50% faster turnaround!
    }

    // 6. Public Method: Exposing formatted summary safely
    public void printTicketDetails() {
        System.debug('Ticket [' + this.ticketNumber + '] | Client: ' + this.clientName +
                     ' | Priority: ' + this.priority + ' | Target SLA: ' + this.slaHours + ' Hours');
    }
}

// ========================================================
// EXECUTION & INSTANTIATION (CREATING REAL OBJECTS)
// ========================================================

// Creating Object 1
ComplaintTracker ticket1 = new ComplaintTracker('Acme Logistics Global', 'Critical');
ticket1.printTicketDetails();

// Creating Object 2
ComplaintTracker ticket2 = new ComplaintTracker('Standard Bank Corp', 'High');
ticket2.printTicketDetails();

// Testing Polymorphic VIP SLA Method
Integer vipSla = ticket2.calculateSla('Critical', true);
System.debug('VIP Express SLA calculation test: ' + vipSla + ' Hour(s)');

// Checking Ticket Details
System.debug('Ticket 2 Object Created Successfully!');
