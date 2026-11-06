// ============================================================================
// TOPIC 20: CODE COVERAGE & PRODUCTION DEPLOYMENT GATES
// ============================================================================
// Senior Salesforce Developer Guide: Demystifying the 75% deployment rule,
// test levels (RunSpecifiedTests vs RunLocalTests), calculating executable lines,
// and automating CI/CD release readiness.
// ============================================================================

System.debug('========================================================');
System.debug('=== TOPIC 20: CODE COVERAGE & DEPLOYMENT GATES ===');
System.debug('========================================================\n');

// ----------------------------------------------------------------------------
// 1. THE 4 GOLDEN RULES OF PRODUCTION DEPLOYMENT
// ----------------------------------------------------------------------------
// Salesforce enforces strict automated validation before any code enters Production:
// 1. 75% AGGREGATE COVERAGE: The entire Org's Apex classes combined must have >= 75%.
// 2. TRIGGER COVERAGE: 100% of Apex Triggers must have at least 1% coverage.
// 3. ZERO FAILURES: Every executed unit test must pass (0 unhandled exceptions).
// 4. ENTERPRISE BENCHMARK: Aim for 85%+ coverage with functional assertions.

System.debug('--- 1. WHAT COUNTS AS AN EXECUTABLE LINE? ---');
System.debug('DOES NOT COUNT:');
System.debug(' - Comments (// or /* */)');
System.debug(' - Class/Interface headers (public class MyClass {)');
System.debug(' - Curly braces alone on a line ({ or })');
System.debug(' - System.debug() statements (compiler ignores in coverage math)');
System.debug(' - Variable declarations without assignment (Integer x;)');
System.debug('');
System.debug('DOES COUNT (EXECUTABLE):');
System.debug(' - DML statements, SOQL queries, if/else branches, method calls, returns.\n');

// ----------------------------------------------------------------------------
// 2. THE 4 DEPLOYMENT TEST LEVELS (sf project deploy start --test-level ...)
// ----------------------------------------------------------------------------
System.debug('--- 2. SALESFORCE DEPLOYMENT TEST LEVELS ---');
System.debug('1. NoTestRun:');
System.debug('   - Allowed ONLY in Developer Scratch Orgs and Sandboxes.');
System.debug('   - FORBIDDEN in Production deployments.');
System.debug('');
System.debug('2. RunSpecifiedTests:');
System.debug('   - Executes ONLY the specific test classes passed via `--tests`.');
System.debug('   - Best Practice: Fast deployments for bug fixes (runs in 2 mins instead of 2 hours).');
System.debug('   - Each deployed class must hit >= 75% individually.');
System.debug('');
System.debug('3. RunLocalTests:');
System.debug('   - Executes all tests in your Org EXCEPT installed AppExchange Managed Packages.');
System.debug('   - Default mandatory test level for enterprise Production deployments.');
System.debug('');
System.debug('4. RunAllTestsInOrg:');
System.debug('   - Executes ALL tests including managed packages (Slowest, high risk of external failures).\n');

// ----------------------------------------------------------------------------
// 3. CODE COVERAGE CALCULATOR (SIMULATION MODEL)
// ----------------------------------------------------------------------------
public class CodeCoverageCalculator {
    
    public class CoverageResult {
        public String className;
        public Integer totalLines;
        public Integer linesExecuted;
        public Integer linesMissed;
        public Decimal percentage;
        public Boolean isProductionReady;
    }

    public static CoverageResult evaluateClass(String className, Integer executed, Integer missed) {
        CoverageResult result = new CoverageResult();
        result.className = className;
        result.linesExecuted = executed;
        result.linesMissed = missed;
        result.totalLines = executed + missed;
        
        if (result.totalLines > 0) {
            result.percentage = (Decimal.valueOf(executed) / Decimal.valueOf(result.totalLines)) * 100;
            result.percentage = result.percentage.setScale(2);
        } else {
            result.percentage = 100.00;
        }

        result.isProductionReady = (result.percentage >= 75.00);
        return result;
    }
}

System.debug('--- 3. EVALUATING CAPSTONE ARTIFACT COVERAGE ---');

CoverageResult r1 = CodeCoverageCalculator.evaluateClass('ComplaintService', 85, 5);
CoverageResult r2 = CodeCoverageCalculator.evaluateClass('CaseTriggerHandler', 42, 3);
CoverageResult r3 = CodeCoverageCalculator.evaluateClass('CaseSlaAuditBatch', 35, 12);

List<CoverageResult> results = new List<CoverageResult>{ r1, r2, r3 };

for (CoverageResult r : results) {
    String badge = r.isProductionReady ? '✅ READY' : '❌ BLOCKED';
    System.debug(badge + ' | ' + r.className + ': ' + r.percentage + '% (' + r.linesExecuted + '/' + r.totalLines + ' lines)');
}

// ----------------------------------------------------------------------------
// 4. SALESFORCE CLI CHEAT SHEET FOR DEPLOYMENTS
// ----------------------------------------------------------------------------
System.debug('\n--- 4. ESSENTIAL CLI COMMANDS ---');
System.debug('Run tests locally:');
System.debug('  sf apex run test --code-coverage --result-format human --target-org personal-dev');
System.debug('');
System.debug('Deploy with RunSpecifiedTests (Gold Standard):');
System.debug('  sf project deploy start --manifest manifest/package.xml --test-level RunSpecifiedTests --tests CaseTriggerHandlerTest,ComplaintServiceTest');
System.debug('');
System.debug('Check deployment status:');
System.debug('  sf project deploy report\n');

System.debug('========================================================');
System.debug('=== PHASE E COMPLETE: 100% TESTING & DEPLOYMENT DONE ===');
System.debug('========================================================');
