/**
 * @description Comprehensive Unit Tests for StripeService, CaseRefundQueueable, and StripeWebhookResource.
 * Demonstrates HttpCalloutMock, Queueable testing via Test.startTest/stopTest, and RestContext mocking.
 * Enforces 100% test coverage for enterprise deployment.
 * @author Umendra Bhati (Salesforce Developer Lab)
 */
@IsTest
private class StripeServiceTest {

    // Mock class for successful Stripe refund callout
    private class StripeSuccessMock implements HttpCalloutMock {
        public HttpResponse respond(HttpRequest req) {
            HttpResponse res = new HttpResponse();
            res.setHeader('Content-Type', 'application/json');
            res.setStatusCode(200);
            res.setBody('{"id": "re_test_999xyz", "object": "refund", "amount": 15000, "status": "succeeded", "charge": "ch_case_12345"}');
            return res;
        }
    }

    // Mock class for failed Stripe refund callout (e.g. 400 Bad Request)
    private class StripeFailureMock implements HttpCalloutMock {
        public HttpResponse respond(HttpRequest req) {
            HttpResponse res = new HttpResponse();
            res.setHeader('Content-Type', 'application/json');
            res.setStatusCode(400);
            res.setBody('{"error": {"code": "resource_missing", "message": "No such charge exists"}}');
            return res;
        }
    }

    @IsTest
    static void testProcessCaseRefund_Success() {
        Test.setMock(HttpCalloutMock.class, new StripeSuccessMock());

        Test.startTest();
        StripeService.StripeRefundResult result = StripeService.processCaseRefund('ch_case_12345', 15000, 'Customer Dispute Settlement');
        Test.stopTest();

        System.assert(result.isSuccess, 'Refund callout should succeed');
        System.assertEquals('re_test_999xyz', result.refundId, 'Refund ID should match mock');
        System.assertEquals(150.00, result.amountRefunded, 'Refund amount should equal $150.00');
        System.assertEquals('succeeded', result.status, 'Status should be succeeded');
    }

    @IsTest
    static void testProcessCaseRefund_Failure() {
        Test.setMock(HttpCalloutMock.class, new StripeFailureMock());

        Test.startTest();
        StripeService.StripeRefundResult result = StripeService.processCaseRefund('ch_case_invalid', 5000, 'Defective Item');
        Test.stopTest();

        System.assert(!result.isSuccess, 'Refund callout should register failure on HTTP 400');
        System.assert(result.errorMessage.contains('resource_missing'), 'Error message should capture API payload');
    }

    @IsTest
    static void testProcessCaseRefund_BlankChargeId() {
        Test.startTest();
        StripeService.StripeRefundResult result = StripeService.processCaseRefund('', 5000, 'Test');
        Test.stopTest();

        System.assert(!result.isSuccess, 'Should fail validation when chargeId is blank');
        System.assertEquals('Missing mandatory Stripe Charge Identifier.', result.errorMessage);
    }

    @IsTest
    static void testCaseRefundQueueable_Execution() {
        // Create test Case record
        Case testCase = new Case(
            Subject = 'Dispute on Charge #1001',
            Status = 'New',
            Description = 'Customer requested refund for delivery delay'
        );
        insert testCase;

        Test.setMock(HttpCalloutMock.class, new StripeSuccessMock());

        Test.startTest();
        System.enqueueJob(new CaseRefundQueueable(new List<Id>{ testCase.Id }, 'Executive goodwill refund'));
        Test.stopTest();

        Case updatedCase = [SELECT Id, Status, Description FROM Case WHERE Id = :testCase.Id];
        System.assertEquals('Closed', updatedCase.Status, 'Queueable should close the case after refund');
        System.assert(updatedCase.Description.contains('re_test_999xyz'), 'Case description should log transaction ID');
    }

    @IsTest
    static void testStripeWebhookResource_RefundEvent() {
        RestRequest req = new RestRequest();
        RestResponse res = new RestResponse();

        req.requestURI = '/services/apexrest/stripe/webhook/v1/';
        req.httpMethod = 'POST';
        req.requestBody = Blob.valueOf('{"id": "evt_001", "type": "charge.refunded", "data": {"object": {"id": "re_test_999xyz"}}}');

        RestContext.request = req;
        RestContext.response = res;

        Test.startTest();
        StripeWebhookResource.WebhookResponse response = StripeWebhookResource.handleInboundWebhook();
        Test.stopTest();

        System.assert(response.success, 'Webhook should process valid event');
        System.assertEquals('evt_001', response.eventId, 'Event ID should match payload');
        System.assertEquals(200, res.statusCode, 'HTTP Status should be 200');
    }

    @IsTest
    static void testStripeWebhookResource_PaymentSucceededEvent() {
        RestRequest req = new RestRequest();
        RestResponse res = new RestResponse();

        req.requestURI = '/services/apexrest/stripe/webhook/v1/';
        req.httpMethod = 'POST';
        req.requestBody = Blob.valueOf('{"id": "evt_002", "type": "payment_intent.succeeded"}');

        RestContext.request = req;
        RestContext.response = res;

        Test.startTest();
        StripeWebhookResource.WebhookResponse response = StripeWebhookResource.handleInboundWebhook();
        Test.stopTest();

        System.assert(response.success);
        System.assertEquals('evt_002', response.eventId);
    }

    @IsTest
    static void testStripeWebhookResource_EmptyPayload() {
        RestRequest req = new RestRequest();
        RestResponse res = new RestResponse();

        req.requestURI = '/services/apexrest/stripe/webhook/v1/';
        req.httpMethod = 'POST';
        req.requestBody = null;

        RestContext.request = req;
        RestContext.response = res;

        Test.startTest();
        StripeWebhookResource.WebhookResponse response = StripeWebhookResource.handleInboundWebhook();
        Test.stopTest();

        System.assert(!response.success, 'Should fail on null payload');
        System.assertEquals(400, res.statusCode);
    }
}
