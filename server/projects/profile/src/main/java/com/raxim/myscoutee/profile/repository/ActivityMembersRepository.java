package com.raxim.myscoutee.profile.repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.ActivityMember;

public interface ActivityMembersRepository extends MongoRepository<ActivityMember, String> {
    Optional<ActivityMember> findBySyncKey(String syncKey);

    Optional<ActivityMember> findByOwnerTypeAndOwnerIdAndUserId(String ownerType, String ownerId, String userId);

    List<ActivityMember> findByOwnerTypeAndOwnerId(String ownerType, String ownerId);

    List<ActivityMember> findByOwnerTypeAndUserId(String ownerType, String userId);

    List<ActivityMember> findByOwnerTypeAndOwnerIdIn(String ownerType, Collection<String> ownerIds);
}
