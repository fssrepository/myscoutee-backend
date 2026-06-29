package com.raxim.myscoutee.profile.repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.ActivitySubEventStageRuntime;

public interface ActivitySubEventStageRuntimeRepository extends MongoRepository<ActivitySubEventStageRuntime, String> {
    Optional<ActivitySubEventStageRuntime> findByRecordId(String recordId);

    List<ActivitySubEventStageRuntime> findByOwnerIdIn(Collection<String> ownerIds);

    Optional<ActivitySubEventStageRuntime> findByOwnerIdAndSubEventId(String ownerId, String subEventId);
}
