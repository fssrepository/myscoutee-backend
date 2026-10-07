package com.raxim.myscoutee.domain.integrations.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.domain.integrations.document.IntegrationWebhookSubscription;

public interface IntegrationWebhookSubscriptionsRepository
        extends MongoRepository<IntegrationWebhookSubscription, String> {
    Optional<IntegrationWebhookSubscription> findByTokenIdAndClientId(String tokenId, String clientId);
    List<IntegrationWebhookSubscription> findByOwnerUserIdAndEnabledTrue(String ownerUserId);
    List<IntegrationWebhookSubscription> findByTokenId(String tokenId);
}
