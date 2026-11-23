/**
 * @description Enterprise Slack Integration Service for incident escalations and SLA breaches.
 *              Builds Slack Block Kit JSON payloads and dispatches via Named Credentials.
 * @author Umendra Bhati (Salesforce Developer & Architect)
 */
public with sharing class SlackAlertService {
    public class SlackException extends Exception {}

    private static final String NAMED_CREDENTIAL = 'callout:Slack_Incident_Webhook';

    /**
     * @description Sends a Slack Incident Alert asynchronously using Queueable Apex.
     *              Prevents Governor Limit callout bottlenecks during trigger execution.
     * @param caseId Salesforce Case ID
     * @param incidentTitle Title of the incident
     * @param severity Priority / Severity (CRITICAL, HIGH, WARNING)
     * @param details Additional context or error message
     * @return Id of the enqueued AsyncApexJob
     */
    public static Id dispatchIncidentAlertAsync(Id caseId, String incidentTitle, String severity, String details) {
        String payload = buildSlackBlockPayload(caseId, incidentTitle, severity, details);
        return System.enqueueJob(new SlackAlertQueueable(payload));
    }

    /**
     * @description Direct HTTP callout method executing the POST to Slack Webhook.
     * @param payload JSON formatted Slack Block Kit string
     * @return HttpResponse from Slack API
     */
    public static HttpResponse sendSlackNotification(String payload) {
        HttpRequest req = new HttpRequest();
        req.setEndpoint(NAMED_CREDENTIAL);
        req.setMethod('POST');
        req.setHeader('Content-Type', 'application/json;charset=UTF-8');
        req.setBody(payload);
        req.setTimeout(10000);

        Http http = new Http();
        HttpResponse res;

        try {
            res = http.send(req);
            if (res.getStatusCode() >= 400) {
                System.debug(LoggingLevel.ERROR, 'Slack Webhook Error: ' + res.getStatusCode() + ' - ' + res.getBody());
            }
        } catch (Exception ex) {
            System.debug(LoggingLevel.ERROR, 'Slack Callout Exception: ' + ex.getMessage());
            throw new SlackException('Failed to deliver Slack Incident alert: ' + ex.getMessage());
        }

        return res;
    }

    /**
     * @description Constructs Slack Block Kit JSON format with visual badges, fields, and action buttons.
     */
    public static String buildSlackBlockPayload(Id caseId, String incidentTitle, String severity, String details) {
        String emoji = severity == 'CRITICAL' ? '🚨' : (severity == 'HIGH' ? '⚠️' : 'ℹ️');
        String caseIdStr = caseId != null ? String.valueOf(caseId) : 'N/A';
        String safeDetails = details != null ? details.replace('"', '\\"').replace('\n', ' ') : 'No details provided';
        String safeTitle = incidentTitle != null ? incidentTitle.replace('"', '\\"') : 'Incident Alert';

        String jsonPayload = '{' +
            '"text": "' + emoji + ' [' + severity + '] ' + safeTitle + '",' +
            '"blocks": [' +
                '{' +
                    '"type": "header",' +
                    '"text": {' +
                        '"type": "plain_text",' +
                        '"text": "' + emoji + ' Incident Escalation: ' + safeTitle + '",' +
                        '"emoji": true' +
                    '}' +
                '},' +
                '{' +
                    '"type": "section",' +
                    '"fields": [' +
                        '{"type": "mrkdwn", "text": "*Severity:*\\n`' + severity + '`"},' +
                        '{"type": "mrkdwn", "text": "*Case Reference:*\\n`' + caseIdStr + '`"},' +
                        '{"type": "mrkdwn", "text": "*Timestamp:*\\n<!date^' + (DateTime.now().getTime() / 1000) + '^{date_num} {time_secs}|' + String.valueOf(DateTime.now()) + '>"},' +
                        '{"type": "mrkdwn", "text": "*Environment:*\\nProduction (Zero-SOQL)"}' +
                    ']' +
                '},' +
                '{' +
                    '"type": "section",' +
                    '"text": {' +
                        '"type": "mrkdwn",' +
                        '"text": "*Details & Resolution Path:*\\n' + safeDetails + '"' +
                    '}' +
                '},' +
                '{' +
                    '"type": "actions",' +
                    '"elements": [' +
                        '{' +
                            '"type": "button",' +
                            '"text": {"type": "plain_text", "text": "View in Salesforce", "emoji": true},' +
                            '"style": "primary",' +
                            '"url": "https://salesforce-developer-lab.vercel.app/studio"' +
                        '}' +
                    ']' +
                '}' +
            ']' +
        '}';

        return jsonPayload;
    }
}
