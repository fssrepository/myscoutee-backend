package com.raxim.myscoutee.domain.integrations.repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.domain.integrations.document.IntegrationExternalId;

public interface IntegrationExternalIdsRepository extends MongoRepository<IntegrationExternalId, String> {
    Optional<IntegrationExternalId> findByOwnerUserIdAndResourceTypeAndExternalId(
            String ownerUserId,
            String resourceType,
            String externalId);

    List<IntegrationExternalId> findByOwnerUserIdAndResourceTypeAndExternalIdIn(
            String ownerUserId,
            String resourceType,
            Collection<String> externalIds);

    List<IntegrationExternalId> findByOwnerUserIdAndResourceTypeAndInternalIdIn(
            String ownerUserId, String resourceType, Collection<String> internalIds);

    Optional<IntegrationExternalId> findByOwnerUserIdAndResourceTypeAndInternalId(
            String ownerUserId,
            String resourceType,
            String internalId);
}
