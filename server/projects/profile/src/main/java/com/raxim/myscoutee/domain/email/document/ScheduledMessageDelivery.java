package com.raxim.myscoutee.domain.email.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "scheduledMessageDeliveries")
@CompoundIndexes({
        @CompoundIndex(name = "scheduled_message_delivery_run_user", def = "{'runId': 1, 'userId': 1}"),
        @CompoundIndex(name = "scheduled_message_delivery_rule_created", def = "{'ruleKey': 1, 'createdDate': -1}")
})
public class ScheduledMessageDelivery {
    @Id
    private String id;

    private String runId;
    private String ruleKey;
    private String userId;
    private String recipientEmail;
    private String notificationTemplateKey;
    private String emailTemplateKey;
    private String channel;
    private String status;
    private String detail;
    private String createdDate;
    private String createdUser;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRunId() {
        return runId;
    }

    public void setRunId(String runId) {
        this.runId = runId;
    }

    public String getRuleKey() {
        return ruleKey;
    }

    public void setRuleKey(String ruleKey) {
        this.ruleKey = ruleKey;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getRecipientEmail() {
        return recipientEmail;
    }

    public void setRecipientEmail(String recipientEmail) {
        this.recipientEmail = recipientEmail;
    }

    public String getNotificationTemplateKey() {
        return notificationTemplateKey;
    }

    public void setNotificationTemplateKey(String notificationTemplateKey) {
        this.notificationTemplateKey = notificationTemplateKey;
    }

    public String getEmailTemplateKey() {
        return emailTemplateKey;
    }

    public void setEmailTemplateKey(String emailTemplateKey) {
        this.emailTemplateKey = emailTemplateKey;
    }

    public String getChannel() {
        return channel;
    }

    public void setChannel(String channel) {
        this.channel = channel;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDetail() {
        return detail;
    }

    public void setDetail(String detail) {
        this.detail = detail;
    }

    public String getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(String createdDate) {
        this.createdDate = createdDate;
    }

    public String getCreatedUser() {
        return createdUser;
    }

    public void setCreatedUser(String createdUser) {
        this.createdUser = createdUser;
    }
}
