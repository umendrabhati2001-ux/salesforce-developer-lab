// ========================================================
// TOPIC 03: SET IN DEPTH (UNIQUENESS & MEMBERSHIP)
// ========================================================

// 1. Declare and Initialize Set
Set<String> complaintCategories = new Set<String>();

// 2. Add elements with intentional duplicates
complaintCategories.add('Hardware Failure');
complaintCategories.add('Cloud Downtime');
complaintCategories.add('Network Latency');
complaintCategories.add('Hardware Failure'); // Duplicate will be ignored!

System.debug('Total Unique Categories: ' + complaintCategories.size());
System.debug('Set Contents: ' + complaintCategories);

// 3. Fast Membership Check (.contains)
if (complaintCategories.contains('Cloud Downtime')) {
    System.debug('Critical Alert: Cloud Downtime is present in the set!');
}

// 4. Converting a Duplicate List into a Clean Set
List<String> duplicateLogs = new List<String>{'Error 404', 'Error 500', 'Error 404', 'Error 500'};
Set<String> uniqueLogs = new Set<String>();
uniqueLogs.addAll(duplicateLogs); // Automatically strips duplicates

System.debug('Raw List Size with duplicates: ' + duplicateLogs.size());
System.debug('Clean Set Size without duplicates: ' + uniqueLogs.size());

// 5. Iterating through Set (Notice: No index used!)
System.debug('--- UNIQUE CATEGORIES LOOP ---');
for (String cat : complaintCategories) {
    System.debug('Category: ' + cat);
}
