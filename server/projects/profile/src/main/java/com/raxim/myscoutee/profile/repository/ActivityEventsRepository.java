package com.raxim.myscoutee.profile.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.ActivityEvent;

public interface ActivityEventsRepository extends MongoRepository<ActivityEvent, String> {
    Optional<ActivityEvent> findBySyncKey(String syncKey);

    Optional<ActivityEvent> findByOwnerUserIdAndTypeAndSourceId(String ownerUserId, String type, String sourceId);

    List<ActivityEvent> findByOwnerUserId(String ownerUserId);

    List<ActivityEvent> findBySourceId(String sourceId);

    List<ActivityEvent> findByAutoInviterTrue();
}
