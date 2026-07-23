package com.raxim.myscoutee.profile.repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.ActivitySubEventResource;

public interface ActivitySubEventResourcesRepository extends MongoRepository<ActivitySubEventResource, String> {
    Optional<ActivitySubEventResource> findBySyncKey(String syncKey);

    Optional<ActivitySubEventResource> findByRecordId(String recordId);

    List<ActivitySubEventResource> findByOwnerId(String ownerId);

    List<ActivitySubEventResource> findByOwnerIdAndStatusNot(String ownerId, String status);

    List<ActivitySubEventResource> findByOwnerIdAndSubEventIdAndStatusNot(
            String ownerId,
            String subEventId,
            String status);

    List<ActivitySubEventResource> findByOwnerIdIn(Collection<String> ownerIds);

    List<ActivitySubEventResource> findByOwnerIdInAndStatusNot(Collection<String> ownerIds, String status);

    List<ActivitySubEventResource> findByOwnerIdInAndAssetOwnerUserIdInAndStatusNot(
            Collection<String> ownerIds,
            Collection<String> assetOwnerUserIds,
            String status);

    Optional<ActivitySubEventResource> findByRecordIdAndStatusNot(String recordId, String status);

    Optional<ActivitySubEventResource> findByOwnerIdAndSubEventIdAndAssetOwnerUserId(
            String ownerId,
            String subEventId,
            String assetOwnerUserId);

    Optional<ActivitySubEventResource> findByOwnerIdAndSubEventIdAndAssetOwnerUserIdAndStatusNot(
            String ownerId,
            String subEventId,
            String assetOwnerUserId,
            String status);
}
