package com.raxim.myscoutee.profile.repository.mongo;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.mongo.ActivitySubEventResource;

public interface ActivitySubEventResourcesRepository extends MongoRepository<ActivitySubEventResource, String> {
    Optional<ActivitySubEventResource> findBySyncKey(String syncKey);

    Optional<ActivitySubEventResource> findByRecordId(String recordId);

    Optional<ActivitySubEventResource> findByOwnerIdAndSubEventIdAndAssetOwnerUserId(
            String ownerId,
            String subEventId,
            String assetOwnerUserId);
}
