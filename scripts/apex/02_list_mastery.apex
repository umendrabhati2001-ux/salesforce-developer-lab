// ========================================================
// TOPIC 02: LIST IN DEPTH (METHODS & ITERATION)
// ========================================================

// 1. Declare and Initialize List of Strings
List<String> complaintPriorities = new List<String>();

// 2. Add elements (Notice: List allows duplicates!)
complaintPriorities.add('High');
complaintPriorities.add('Critical');
complaintPriorities.add('Low');
complaintPriorities.add('Medium');
complaintPriorities.add('High'); // Duplicate element

// 3. Essential List Methods
System.debug('Total Elements in List: ' + complaintPriorities.size());
System.debug('Element at index 1: ' + complaintPriorities.get(1));

// 4. Sorting the List (Alphabetical order: Critical, High, High, Low, Medium)
complaintPriorities.sort();
System.debug('Sorted List: ' + complaintPriorities);

// 5. Professional Check: Null/Empty Check before Looping (Best Practice!)
if (!complaintPriorities.isEmpty()) {
    System.debug('--- FOR-EACH LOOP ITERATION ---');
    for (String priority : complaintPriorities) {
        System.debug('Priority Value: ' + priority);
    }
}
