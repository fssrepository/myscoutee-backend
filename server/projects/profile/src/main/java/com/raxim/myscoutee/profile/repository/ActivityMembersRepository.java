package com.raxim.myscoutee.profile.repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.raxim.myscoutee.profile.data.document.ActivityMember;

public interface ActivityMembersRepository extends MongoRepository<ActivityMember, String> {
    Optional<ActivityMember> findBySyncKey(String syncKey);

    Optional<ActivityMember> findByOwnerTypeAndOwnerIdAndUserId(String ownerType, String ownerId, String userId);

    List<ActivityMember> findByOwnerTypeAndOwnerId(String ownerType, String ownerId);

    List<ActivityMember> findByOwnerTypeAndOwnerIdAndStatus(String ownerType, String ownerId, String status);

    Page<ActivityMember> findByOwnerTypeAndOwnerIdAndStatusAndUserIdIn(
            String ownerType,
            String ownerId,
            String status,
            Collection<String> userIds,
            Pageable pageable);

    List<ActivityMember> findByOwnerTypeAndUserId(String ownerType, String userId);

    List<ActivityMember> findByOwnerTypeAndOwnerIdIn(String ownerType, Collection<String> ownerIds);

    @Query("{ 'userId': { $in: ?0 }, 'status': { $ne: ?1 }, '$or': [ { 'ownerType': ?2, 'ownerId': ?3 }, { 'ownerId': { '$regex': ?4 } } ] }")
    List<ActivityMember> findInvolvementRecordsByUserIdsAndOwnerScope(
            Collection<String> userIds,
            String deletedStatus,
            String ownerType,
            String ownerId,
            String ownerIdPrefixRegex);

    @Query("{ 'ownerType': ?0, 'ownerId': { $in: ?1 }, 'userId': ?2, 'status': ?3 }")
    List<ActivityMember> findAcceptedByOwnerTypeOwnerIdInAndUserId(
            String ownerType,
            Collection<String> ownerIds,
            String userId,
            String status);

    List<ActivityMember> findByOwnerTypeAndStatusAndRequestKind(String ownerType, String status, String requestKind);
}
