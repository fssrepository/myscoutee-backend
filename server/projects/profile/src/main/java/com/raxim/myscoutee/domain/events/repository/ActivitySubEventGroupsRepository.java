package com.raxim.myscoutee.domain.events.repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.domain.events.document.ActivitySubEventGroup;

public interface ActivitySubEventGroupsRepository extends MongoRepository<ActivitySubEventGroup, String> {
    Optional<ActivitySubEventGroup> findByRecordId(String recordId);

    List<ActivitySubEventGroup> findByOwnerIdInAndStatusNot(Collection<String> ownerIds, String status);

    List<ActivitySubEventGroup> findByOwnerIdAndStatusNot(String ownerId, String status);

    Optional<ActivitySubEventGroup> findByOwnerIdAndGroupId(String ownerId, String groupId);
}
