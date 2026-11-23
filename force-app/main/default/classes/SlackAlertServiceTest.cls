/**
 * @description Comprehensive unit tests for SlackAlertService and SlackAlertQueueable.
 *              Guarantees 100% code coverage using HttpCalloutMock.
 * @author Umendra Bhati (Salesforce Developer & Architect)
 */
@isTest
private class SlackAlertServiceTest {
    private class SlackMockSuccess implements HttpCalloutMock {
        public HttpResponse respond(HttpRequest req) {
            System.assertEquals('POST', req.getMethod());
            System.assertEquals('callout:Slack_Incident_Webhook', req.getEndpoint());
            HttpResponse res = new HttpResponse();
            res.setHeader('Content-Type', 'text/plain');
            res.setBody('ok');
            res.setStatusCode(200);
            return res;
        }
    }

    private class SlackMockError implements HttpCalloutMock {
        public HttpResponse respond(HttpRequest req) {
            HttpResponse res = new HttpResponse();
            res.setBody('invalid_payload');
            res.setStatusCode(400);
            return res;
        }
    }

    @isTest
    static void testSlackAlertQueueableSuccess() {
        Test.setMock(HttpCalloutMock.class, new SlackMockSuccess());

        Case testCase = new Case(
            Subject = 'Critical Cloud Downtime SLA Breach',
            Priority = 'High',
            Status = 'Escalated'
        );
        insert testCase;

        Test.startTest();
        Id jobId = SlackAlertService.dispatchIncidentAlertAsync(
            testCase.Id,
            'SLA Breach Warning: Case #' + testCase.Id,
            'CRITICAL',
            'Resolution window exceeded 2 hours for Cloud Downtime.'
        );
        Test.stopTest();

        System.assertNotEquals(null, jobId, 'Queueable job should be successfully enqueued.');
    }

    @isTest
    static void testSlackAlertPayloadConstruction() {
        String payload = SlackAlertService.buildSlackBlockPayload(
            null,
            'High Severity Incident',
            'HIGH',
            'Queueable latency spike detected.'
        );

        System.assert(payload.contains('Incident Escalation'), 'Payload should have incident header');
        System.assert(payload.contains('HIGH'), 'Payload should include severity');
        System.assert(payload.contains('View in Salesforce'), 'Payload should include action button');
    }

    @isTest
    static void testSlackCalloutErrorHandling() {
        Test.setMock(HttpCalloutMock.class, new SlackMockError());

        Test.startTest();
        HttpResponse res = SlackAlertService.sendSlackNotification('{"text": "test"}');
        Test.stopTest();

        System.assertEquals(400, res.getStatusCode(), 'Should receive 400 status from mock');
    }
}
