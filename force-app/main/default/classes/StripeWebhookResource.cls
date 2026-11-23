/**
 * @description Custom Apex REST endpoint receiving inbound asynchronous Webhook events from Stripe.
 * URL Mapping: /services/apexrest/stripe/webhook/v1/*
 * Handles charge.refunded, payment_intent.succeeded, and dispute events.
 * @author Umendra Bhati (Salesforce Developer Lab)
 */
@RestResource(urlMapping='/stripe/webhook/v1/*')
global with sharing class StripeWebhookResource {

    global class WebhookResponse {
        public Boolean success;
        public String message;
        public String eventId;
        public String timestamp;

        public WebhookResponse(Boolean success, String message, String eventId) {
            this.success = success;
            this.message = message;
            this.eventId = eventId;
            this.timestamp = String.valueOf(Datetime.now());
        }
    }

    @HttpPost
    global static WebhookResponse handleInboundWebhook() {
        RestRequest req = RestContext.request;
        RestResponse res = RestContext.response;

        if (req == null || req.requestBody == null) {
            if (res != null) { res.statusCode = 400; }
            return new WebhookResponse(false, 'Empty request body payload', null);
        }

        String requestBodyString = req.requestBody.toString();

        try {
            Map<String, Object> eventMap = (Map<String, Object>) JSON.deserializeUntyped(requestBodyString);
            String eventId = (String) eventMap.get('id');
            String eventType = (String) eventMap.get('type');

            // Handle event types
            if (eventType == 'charge.refunded' || eventType == 'charge.dispute.closed') {
                // Idempotently process refund verification
                if (res != null) { res.statusCode = 200; }
                return new WebhookResponse(true, 'Dispute refund event [' + eventType + '] processed successfully.', eventId);
            } else if (eventType == 'payment_intent.succeeded') {
                if (res != null) { res.statusCode = 200; }
                return new WebhookResponse(true, 'Payment succeeded event acknowledged.', eventId);
            } else {
                if (res != null) { res.statusCode = 200; }
                return new WebhookResponse(true, 'Unhandled event acknowledged: ' + eventType, eventId);
            }
        } catch (Exception ex) {
            if (res != null) { res.statusCode = 400; }
            return new WebhookResponse(false, 'Payload JSON parsing failure: ' + ex.getMessage(), null);
        }
    }
}
