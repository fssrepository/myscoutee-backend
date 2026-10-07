package com.raxim.myscoutee.domain.events.repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.raxim.myscoutee.domain.events.document.ActivitySubEventStageRuntime;

public interface ActivitySubEventStageRuntimeRepository extends MongoRepository<ActivitySubEventStageRuntime, String> {
    Optional<ActivitySubEventStageRuntime> findByRecordId(String recordId);

    List<ActivitySubEventStageRuntime> findByOwnerIdIn(Collection<String> ownerIds);

    List<ActivitySubEventStageRuntime> findByOwnerIdInAndStatusNot(Collection<String> ownerIds, String status);

    Optional<ActivitySubEventStageRuntime> findByOwnerIdAndSubEventId(String ownerId, String subEventId);

    @Query("{ 'ownerId': { '$regex': ?0 }, 'subEventId': ?1, 'status': { '$ne': ?2 } }")
    List<ActivitySubEventStageRuntime> findByOwnerPatternAndSubEventIdAndStatusNot(
            String ownerIdPattern,
            String subEventId,
            String status);

    @Query("{ 'ownerId': { '$regex': ?0 }, 'status': { '$ne': ?1 } }")
    List<ActivitySubEventStageRuntime> findByOwnerPatternAndStatusNot(
            String ownerIdPattern,
            String status);
}
