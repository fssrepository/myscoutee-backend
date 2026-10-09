package com.raxim.myscoutee.domain.events.api;

import java.util.List;
import com.raxim.myscoutee.domain.events.api.EventOwnership.Event;
import com.raxim.myscoutee.domain.events.api.EventOwnership.SubEvent;

/** Stored event reads, without mutation or job-scope capabilities. */
public interface EventOwnershipReads {
    java.util.Optional<? extends Event> findByOwnerUserIdAndSourceId(String owner, String source);
    boolean ownedExists(String owner, String source);
    List<? extends Event> findStoredFamilyBySourceId(String source);

    java.util.Optional<? extends Event> findById(String id);
    java.util.List<? extends Event> findBySourceIdIn(java.util.Collection<String> ids);
    java.util.List<? extends Event> findByCreatorUserId(String id);
    java.util.List<? extends Event> findAll();
    List<? extends Event> findBySourceId(String sourceId);
    Event findByIdOrSourceId(String id);
    List<? extends Event> chatNavigationEvents(java.util.Collection<String> eventIds);
    default com.raxim.myscoutee.common.dto.SharedDtos.SubEventItemDto presentSubEvent(SubEvent value) {
        return value == null ? null : value.presentation();
    }
    List<? extends Event> findDirectOwnerEvents(String userId);
    List<? extends Event> findAdminVisibleEvents(String userId);
    List<? extends Event> findAcceptedMembershipEvents(String userId);
    List<? extends Event> findActiveInvitationEvents(String userId);
    List<? extends Event> findPendingRequestEvents(String userId);
    List<? extends Event> findByOwnerUserId(String userId);
    List<? extends Event> findByAdminsContaining(String userId);
    List<? extends Event> findHomeGameMemberProjections();
    List<? extends Event> activeOriginalEventsByCreators(java.util.Collection<String> creators);
    List<? extends Event> storedEventsBySources(java.util.Collection<String> sources);
}
