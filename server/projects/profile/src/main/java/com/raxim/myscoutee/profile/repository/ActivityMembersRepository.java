package com.raxim.myscoutee.profile.repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.raxim.myscoutee.profile.data.document.ActivityMember;

public interface ActivityMembersRepository extends MongoRepository<ActivityMember, String> {
    Optional<ActivityMember> findBySyncKey(String syncKey);

    Optional<ActivityMember> findByOwnerTypeAndOwnerIdAndUserId(String ownerType, String ownerId, String userId);

    List<ActivityMember> findByOwnerTypeAndOwnerId(String ownerType, String ownerId);

    List<ActivityMember> findByOwnerTypeAndOwnerIdAndStatus(String ownerType, String ownerId, String status);

    @Query(value = "{ 'ownerType': ?0, 'ownerId': { '$regex': ?1 }, 'status': ?2 }", count = true)
    long countByOwnerPatternAndStatus(String ownerType, String ownerIdPattern, String status);

    List<ActivityMember> findByOwnerTypeAndOwnerIdAndStatusOrderByActionAtIsoDescUserIdAsc(
            String ownerType,
            String ownerId,
            String status);

    @Aggregation(pipeline = {
            "{ '$match': { 'ownerType': ?0, 'ownerId': ?1, 'status': { '$nin': [ 'deleted', 'suppressed' ] } } }",
            "{ '$set': { '_managementPriority': { '$switch': { 'branches': ["
                    + "{ 'case': { '$eq': [ '$status', 'pending' ] }, 'then': 0 },"
                    + "{ 'case': { '$and': [ { '$eq': [ '$status', 'accepted' ] },"
                    + "{ '$in': [ '$role', [ 'Admin', 'Manager' ] ] } ] }, 'then': 1 },"
                    + "{ 'case': { '$eq': [ '$status', 'accepted' ] }, 'then': 2 },"
                    + "{ 'case': { '$eq': [ '$status', 'disqualified' ] }, 'then': 3 }"
                    + "], 'default': 4 } } } }",
            "{ '$sort': { '_managementPriority': 1, 'actionAtIso': -1, 'userId': 1 } }",
            "{ '$project': { '_managementPriority': 0 } }"
    })
    List<ActivityMember> findManagementOrderedByOwner(String ownerType, String ownerId);

    Page<ActivityMember> findByOwnerTypeAndOwnerIdAndStatusAndUserIdIn(
            String ownerType,
            String ownerId,
            String status,
            Collection<String> userIds,
            Pageable pageable);

    Page<ActivityMember> findByOwnerTypeAndOwnerIdAndStatusAndUserIdNotIn(
            String ownerType,
            String ownerId,
            String status,
            Collection<String> userIds,
            Pageable pageable);

    List<ActivityMember> findByOwnerTypeAndUserId(String ownerType, String userId);

    List<ActivityMember> findByOwnerTypeAndOwnerIdIn(String ownerType, Collection<String> ownerIds);

    @Query("{ 'userId': { $in: ?0 }, 'status': { $nin: ?1 }, '$or': [ { 'ownerType': ?2, 'ownerId': ?3 }, { 'ownerId': { '$regex': ?4 } } ] }")
    List<ActivityMember> findInvolvementRecordsByUserIdsAndOwnerScope(
            Collection<String> userIds,
            Collection<String> excludedStatuses,
            String ownerType,
            String ownerId,
            String ownerIdPrefixRegex);

    @Query("{ 'userId': ?0, '$or': ["
            + " { 'ownerType': 'event', 'ownerId': ?1 },"
            + " { 'ownerType': { $in: ?2 }, 'ownerId': { '$regex': ?3 } }"
            + " ] }")
    List<ActivityMember> findParticipationTreeForUser(
            String userId,
            String rootEventId,
            Collection<String> descendantOwnerTypes,
            String ownerIdPrefixRegex);

    @Query("{ 'ownerType': ?0, 'ownerId': { $in: ?1 }, 'userId': ?2, 'status': ?3 }")
    List<ActivityMember> findAcceptedByOwnerTypeOwnerIdInAndUserId(
            String ownerType,
            Collection<String> ownerIds,
            String userId,
            String status);

    List<ActivityMember> findByOwnerTypeAndStatusAndRequestKind(String ownerType, String status, String requestKind);

}
