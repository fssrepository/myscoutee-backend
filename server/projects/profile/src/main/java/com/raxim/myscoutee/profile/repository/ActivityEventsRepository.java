package com.raxim.myscoutee.profile.repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.raxim.myscoutee.profile.data.document.ActivityEvent;

public interface ActivityEventsRepository extends MongoRepository<ActivityEvent, String> {
    Optional<ActivityEvent> findBySyncKey(String syncKey);

    Optional<ActivityEvent> findByOwnerUserIdAndTypeAndSourceId(String ownerUserId, String type, String sourceId);

    List<ActivityEvent> findByOwnerUserId(String ownerUserId);

    List<ActivityEvent> findByOwnerUserIdAndSourceId(String ownerUserId, String sourceId);

    List<ActivityEvent> findBySourceId(String sourceId);

    List<ActivityEvent> findBySourceIdIn(Collection<String> sourceIds);

    List<ActivityEvent> findByCreatorUserId(String creatorUserId);

    List<ActivityEvent> findByAdminsContaining(String adminUserId);

    @Query("{ 'type': ?0, 'status': 'active', 'generated': { $ne: true }, 'published': { $ne: false }, 'sourceId': { $exists: true, $ne: '' } }")
    List<ActivityEvent> findCanonicalExploreCandidates(String type);

    boolean existsByOwnerUserIdAndSourceId(String ownerUserId, String sourceId);

    List<ActivityEvent> findByAutoInviterTrue();
}
