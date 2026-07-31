package com.raxim.myscoutee.profile.repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.raxim.myscoutee.profile.data.document.ActivityEvent;

public interface ActivityEventsRepository extends MongoRepository<ActivityEvent, String> {
    Optional<ActivityEvent> findBySyncKey(String syncKey);

    Optional<ActivityEvent> findByOwnerUserIdAndSourceId(String ownerUserId, String sourceId);

    List<ActivityEvent> findByOwnerUserId(String ownerUserId);

    List<ActivityEvent> findByOwnerUserIdOrderByStartAtIsoAsc(String ownerUserId);

    List<ActivityEvent> findBySourceId(String sourceId);

    List<ActivityEvent> findBySourceIdIn(Collection<String> sourceIds);

    @Query("{ 'parentEventId': { $in: ?0 } }")
    List<ActivityEvent> findByParentEventIdIn(Collection<String> parentEventIds);

    @Query("{ 'creatorUserId': ?0, 'generated': { $ne: true } }")
    List<ActivityEvent> findByCreatorUserId(String creatorUserId);

    @Query("{ 'admins': ?0, 'generated': { $ne: true } }")
    List<ActivityEvent> findByAdminsContaining(String adminUserId);

    @Query("{ 'admins': ?0, 'generated': { $ne: true }, 'sourceId': { $exists: true, $ne: '' } }")
    List<ActivityEvent> findAdminVisibleEvents(String userId);

    @Query("{ 'ownerUserId': ?0, 'generated': { $ne: true }, 'sourceId': { $exists: true, $ne: '' } }")
    List<ActivityEvent> findDirectOwnerEvents(String userId);

    @Query("{ 'acceptedMemberUserIds': ?0, 'generated': { $ne: true }, 'sourceId': { $exists: true, $ne: '' } }")
    List<ActivityEvent> findAcceptedMembershipEvents(String userId);

    @Query("{ 'invitedMemberUserIds': ?0, 'status': 'A', 'generated': { $ne: true }, 'sourceId': { $exists: true, $ne: '' } }")
    List<ActivityEvent> findActiveInvitationEvents(String userId);

    @Query("{ 'pendingRequestMemberUserIds': ?0, 'generated': { $ne: true }, 'sourceId': { $exists: true, $ne: '' } }")
    List<ActivityEvent> findPendingRequestEvents(String userId);

    @Query("{ 'status': 'A', 'generated': { $ne: true }, 'sourceId': { $exists: true, $ne: '' } }")
    List<ActivityEvent> findCanonicalExploreCandidates();

    @Query(
            value = "{ 'acceptedMemberUserIds.0': { $exists: true } }",
            fields = "{ 'sourceId': 1, 'title': 1, 'startAtIso': 1, 'endAtIso': 1,"
                    + " 'createdDate': 1, 'updatedDate': 1, 'acceptedMemberUserIds': 1 }")
    List<ActivityEvent> findHomeGameMemberProjections();

    boolean existsByOwnerUserIdAndSourceId(String ownerUserId, String sourceId);

    List<ActivityEvent> findByAutoInviterTrue();

}
