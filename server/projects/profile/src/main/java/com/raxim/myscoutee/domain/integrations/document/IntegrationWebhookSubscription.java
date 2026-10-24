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
@lombok.Getter @lombok.Setter
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

    public void setEventTypes(List<String> eventTypes) {
        this.eventTypes = eventTypes == null ? new ArrayList<>() : new ArrayList<>(eventTypes);
    }
}
