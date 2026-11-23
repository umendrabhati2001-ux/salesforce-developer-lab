/**
 * @description Queueable Apex worker executing asynchronous HTTP POST callouts to Slack Webhooks.
 *              Implements Database.AllowsCallouts to adhere to Salesforce governor limits.
 * @author Umendra Bhati (Salesforce Developer & Architect)
 */
public with sharing class SlackAlertQueueable implements Queueable, Database.AllowsCallouts {
    private final String payload;

    public SlackAlertQueueable(String payload) {
        this.payload = payload;
    }

    public void execute(QueueableContext context) {
        if (String.isNotBlank(payload)) {
            SlackAlertService.sendSlackNotification(payload);
        }
    }
}
