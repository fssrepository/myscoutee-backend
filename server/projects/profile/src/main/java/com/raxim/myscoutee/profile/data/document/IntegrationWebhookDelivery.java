package com.raxim.myscoutee.profile.data.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "integrationWebhookDeliveries")
@CompoundIndexes({
        @CompoundIndex(
                name = "integration_webhook_delivery_due",
                def = "{'status': 1, 'nextAttemptAtIso': 1, 'createdAtIso': 1}"),
        @CompoundIndex(
                name = "integration_webhook_delivery_subscription",
                def = "{'subscriptionId': 1, 'createdAtIso': -1}")
})
public class IntegrationWebhookDelivery {
    @Id
    private String id;
    private String subscriptionId;
    private String ownerUserId;
    private String eventType;
    private String resourceType;
    private String resourceExternalId;
    private String payloadJson;
    private String status;
    private Integer attemptCount;
    private String nextAttemptAtIso;
    private String lastError;
    private String createdAtIso;
    private String sentAtIso;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getSubscriptionId() { return subscriptionId; }
    public void setSubscriptionId(String subscriptionId) { this.subscriptionId = subscriptionId; }
    public String getOwnerUserId() { return ownerUserId; }
    public void setOwnerUserId(String ownerUserId) { this.ownerUserId = ownerUserId; }
    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }
    public String getResourceType() { return resourceType; }
    public void setResourceType(String resourceType) { this.resourceType = resourceType; }
    public String getResourceExternalId() { return resourceExternalId; }
    public void setResourceExternalId(String resourceExternalId) { this.resourceExternalId = resourceExternalId; }
    public String getPayloadJson() { return payloadJson; }
    public void setPayloadJson(String payloadJson) { this.payloadJson = payloadJson; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Integer getAttemptCount() { return attemptCount; }
    public void setAttemptCount(Integer attemptCount) { this.attemptCount = attemptCount; }
    public String getNextAttemptAtIso() { return nextAttemptAtIso; }
    public void setNextAttemptAtIso(String nextAttemptAtIso) { this.nextAttemptAtIso = nextAttemptAtIso; }
    public String getLastError() { return lastError; }
    public void setLastError(String lastError) { this.lastError = lastError; }
    public String getCreatedAtIso() { return createdAtIso; }
    public void setCreatedAtIso(String createdAtIso) { this.createdAtIso = createdAtIso; }
    public String getSentAtIso() { return sentAtIso; }
    public void setSentAtIso(String sentAtIso) { this.sentAtIso = sentAtIso; }
}
