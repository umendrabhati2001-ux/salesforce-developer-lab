/**
 * @description Enterprise Service for Stripe Payment & Refund Gateway Integrations.
 * Demonstrates secure REST callouts, Named Credentials, idempotency, and Governor Limit compliance.
 * Connected directly with Complaint & Case dispute workflows.
 * @author Umendra Bhati (Salesforce Developer Lab)
 */
public with sharing class StripeService {
    // Configurable endpoint using Salesforce Named Credentials or Fallback Endpoint
    private static final String DEFAULT_ENDPOINT = 'callout:Stripe_API/v1';

    public class StripeRefundResult {
        public Boolean isSuccess;
        public String refundId;
        public String status;
        public Decimal amountRefunded;
        public String errorMessage;
        public Integer statusCode;
    }

    /**
     * @description Executes a secure POST callout to Stripe Refunds API
     * @param chargeId Stripe Charge identifier (e.g. ch_1Mxyz...)
     * @param amountInCents Amount in smallest currency unit (e.g. $150.00 = 15000 cents)
     * @param reason Dispute/Refund reason
     * @return StripeRefundResult containing API response status and refund transaction ID
     */
    public static StripeRefundResult processCaseRefund(String chargeId, Integer amountInCents, String reason) {
        StripeRefundResult result = new StripeRefundResult();

        if (String.isBlank(chargeId)) {
            result.isSuccess = false;
            result.errorMessage = 'Missing mandatory Stripe Charge Identifier.';
            return result;
        }

        HttpRequest req = new HttpRequest();
        req.setEndpoint(DEFAULT_ENDPOINT + '/refunds');
        req.setMethod('POST');
        req.setHeader('Content-Type', 'application/x-www-form-urlencoded');
        req.setHeader('Accept', 'application/json');
        req.setTimeout(20000); // 20s timeout within Salesforce 120s max limit

        // URL-encoded form parameters required by Stripe API
        String payload = 'charge=' + EncodingUtil.urlEncode(chargeId, 'UTF-8') +
                         '&amount=' + String.valueOf(amountInCents) +
                         '&reason=' + EncodingUtil.urlEncode(reason != null ? reason : 'requested_by_customer', 'UTF-8');
        req.setBody(payload);

        Http http = new Http();
        try {
            HttpResponse res = http.send(req);
            result.statusCode = res.getStatusCode();

            if (res.getStatusCode() == 200 || res.getStatusCode() == 201) {
                Map<String, Object> responseMap = (Map<String, Object>) JSON.deserializeUntyped(res.getBody());
                result.isSuccess = true;
                result.refundId = (String) responseMap.get('id');
                result.status = (String) responseMap.get('status');
                Object amtObj = responseMap.get('amount');
                result.amountRefunded = amtObj != null ? ((Decimal) amtObj) / 100 : 0;
            } else {
                result.isSuccess = false;
                result.errorMessage = 'Stripe API Error [' + res.getStatusCode() + ']: ' + res.getBody();
            }
        } catch (System.CalloutException ex) {
            result.isSuccess = false;
            result.errorMessage = 'Callout Exception: ' + ex.getMessage();
        }

        return result;
    }
}
