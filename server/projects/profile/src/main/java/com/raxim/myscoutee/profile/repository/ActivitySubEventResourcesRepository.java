package com.raxim.myscoutee.profile.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.ActivitySubEventResource;

public interface ActivitySubEventResourcesRepository extends MongoRepository<ActivitySubEventResource, String> {
    Optional<ActivitySubEventResource> findBySyncKey(String syncKey);

    Optional<ActivitySubEventResource> findByRecordId(String recordId);

    List<ActivitySubEventResource> findByOwnerId(String ownerId);

    Optional<ActivitySubEventResource> findByOwnerIdAndSubEventIdAndAssetOwnerUserId(
            String ownerId,
            String subEventId,
            String assetOwnerUserId);
}
