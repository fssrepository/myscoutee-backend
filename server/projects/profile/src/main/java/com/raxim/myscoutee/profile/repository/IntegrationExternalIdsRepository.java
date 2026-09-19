package com.raxim.myscoutee.profile.repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.IntegrationExternalId;

public interface IntegrationExternalIdsRepository extends MongoRepository<IntegrationExternalId, String> {
    Optional<IntegrationExternalId> findByOwnerUserIdAndResourceTypeAndExternalId(
            String ownerUserId,
            String resourceType,
            String externalId);

    List<IntegrationExternalId> findByOwnerUserIdAndResourceTypeAndExternalIdIn(
            String ownerUserId,
            String resourceType,
            Collection<String> externalIds);
}
