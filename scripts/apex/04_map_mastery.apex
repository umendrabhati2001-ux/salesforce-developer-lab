// ========================================================
// TOPIC 04: MAP IN DEPTH (KEY-VALUE & FAST LOOKUP)
// ========================================================

// 1. Declare and Initialize Map
Map<String, Integer> categorySlaMap = new Map<String, Integer>();

// 2. Add Key-Value Pairs (.put)
categorySlaMap.put('Cloud Downtime', 2);
categorySlaMap.put('Hardware Failure', 4);
categorySlaMap.put('Network Latency', 8);
categorySlaMap.put('Software Bug', 12);

// 3. Fast O(1) Lookup (.get)
String incomingIssue = 'Cloud Downtime';
Integer targetSla = categorySlaMap.get(incomingIssue);
System.debug('Target SLA for [' + incomingIssue + ']: ' + targetSla + ' Hours');

// 4. Defensive Check (.containsKey)
String unknownIssue = 'Cyber Attack';
if (categorySlaMap.containsKey(unknownIssue)) {
    System.debug('SLA: ' + categorySlaMap.get(unknownIssue));
} else {
    System.debug('Issue [' + unknownIssue + '] not found in map! Falling back to 24hr default.');
}

// 5. Inspecting Keys (.keySet) and Values (.values)
System.debug('Total Keys in Map: ' + categorySlaMap.size());
System.debug('All Unique Keys (Set): ' + categorySlaMap.keySet());
System.debug('All Values (List): ' + categorySlaMap.values());

// 6. Iterating through Map via keySet()
System.debug('--- ITERATING THROUGH MAP ---');
for (String category : categorySlaMap.keySet()) {
    Integer hours = categorySlaMap.get(category);
    System.debug('Category: ' + category + ' ===> Resolution Time: ' + hours + ' Hours');
}
