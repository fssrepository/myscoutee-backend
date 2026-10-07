package com.raxim.myscoutee.domain.integrations.document;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "integrationWebhookSubscriptions")
@CompoundIndexes({
        @CompoundIndex(
                name = "integration_webhook_token_client",
                def = "{'tokenId': 1, 'clientId': 1}",
                unique = true),
        @CompoundIndex(
                name = "integration_webhook_owner_enabled",
                def = "{'ownerUserId': 1, 'enabled': 1}")
})
public class IntegrationWebhookSubscription {
    @Id
    private String id;
    private String ownerUserId;
    private String tokenId;
    private String clientId;
    private String callbackUrl;
    private List<String> eventTypes = new ArrayList<>();
    private Boolean enabled;
    private String createdAtIso;
    private String updatedAtIso;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getOwnerUserId() { return ownerUserId; }
    public void setOwnerUserId(String ownerUserId) { this.ownerUserId = ownerUserId; }
    public String getTokenId() { return tokenId; }
    public void setTokenId(String tokenId) { this.tokenId = tokenId; }
    public String getClientId() { return clientId; }
    public void setClientId(String clientId) { this.clientId = clientId; }
    public String getCallbackUrl() { return callbackUrl; }
    public void setCallbackUrl(String callbackUrl) { this.callbackUrl = callbackUrl; }
    public List<String> getEventTypes() { return eventTypes; }
    public void setEventTypes(List<String> eventTypes) {
        this.eventTypes = eventTypes == null ? new ArrayList<>() : new ArrayList<>(eventTypes);
    }
    public Boolean getEnabled() { return enabled; }
    public void setEnabled(Boolean enabled) { this.enabled = enabled; }
    public String getCreatedAtIso() { return createdAtIso; }
    public void setCreatedAtIso(String createdAtIso) { this.createdAtIso = createdAtIso; }
    public String getUpdatedAtIso() { return updatedAtIso; }
    public void setUpdatedAtIso(String updatedAtIso) { this.updatedAtIso = updatedAtIso; }
}
