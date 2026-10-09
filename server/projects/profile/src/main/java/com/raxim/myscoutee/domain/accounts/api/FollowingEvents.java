package com.raxim.myscoutee.domain.accounts.api;

import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.Set;
import com.raxim.myscoutee.domain.events.api.OrganizerEventReads.Event;

/** Stored follows stay with accounts; the canonical event filter is a pure shared rule. */
public interface FollowingEvents {
    void refreshForViewers(Collection<String> ids);
    List<String> organizerIds(String profileId);
    default boolean eligibleEvent(Event event, String viewer, Set<String> friends, Instant now) {
        return isEligible(event, viewer, friends, now);
    }
    static boolean isEligible(Event event, String viewer, Set<String> friends, Instant now) {
        if (event == null || !"A".equals(event.getStatus()) || !Boolean.TRUE.equals(event.getPublished())
                || Boolean.TRUE.equals(event.getGenerated()) || Boolean.TRUE.equals(event.getIsTrashed())
                || "tournament-room".equalsIgnoreCase(event.getEventType())
                || (event.getParentEventId() != null && !event.getParentEventId().isBlank())
                || event.getSourceId() == null || event.getSourceId().isBlank()
                || viewer.equals(event.getCreatorUserId()) || "Invitation only".equals(event.getVisibility())
                || ("Friends only".equals(event.getVisibility()) && !friends.contains(event.getCreatorUserId()))) return false;
        Instant end = boundary(event);
        return end != null && end.isAfter(now);
    }

    static Instant boundary(Event event) {
        String value = event.getEndAtIso();
        if (value == null || value.isBlank()) value = event.getStartAtIso();
        try { return Instant.parse(value); } catch (RuntimeException ignored) { return null; }
    }

}
