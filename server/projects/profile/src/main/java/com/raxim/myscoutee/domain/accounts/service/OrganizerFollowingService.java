package com.raxim.myscoutee.domain.accounts.service;

import com.raxim.myscoutee.domain.platform.service.JobGroupContext;
import com.raxim.myscoutee.domain.accounts.service.AccountJobQueries;

import java.time.Instant;
import java.util.*;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.raxim.myscoutee.domain.events.api.EventOwnership.Event;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.accounts.document.Users.FollowingRecord;
import com.raxim.myscoutee.domain.accounts.api.Friendships;

/** Following is independent of event watch subscriptions and avatar activity totals.
 * Reads return the stored state. Event mutations and the existing expiry worker own updates. */
@Service
public class OrganizerFollowingService implements com.raxim.myscoutee.domain.accounts.api.FollowingEvents {
    @org.springframework.beans.factory.annotation.Autowired private com.raxim.myscoutee.domain.events.api.EventOwnership eventOwnership;
    @org.springframework.beans.factory.annotation.Autowired private com.raxim.myscoutee.domain.accounts.service.AccountJobQueries jobGroupScope;

    private final MongoTemplate mongo;
    private final Friendships friendships;
    public OrganizerFollowingService(MongoTemplate mongo, Friendships friendships) {
        this.mongo = mongo;
        this.friendships = friendships;
    }

    public static FollowingRecord state(Users user) {
        return user == null || user.getFollowing() == null
                ? new FollowingRecord(List.of(), 0, null) : user.getFollowing();
    }

    public FollowingChangeResult change(String userId, String organizerId, boolean followed) {
        if (organizerId == null || organizerId.isBlank() || userId.equals(organizerId))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid organizer.");
        if (followed && !mongo.exists(Query.query(Criteria.where("userId").is(organizerId)
                .and("profileStatus").nin("deleted", "blocked", "inactive", "onboarding")), Users.class))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Organizer not found.");
        return update(userId, organizerId, followed);
    }

    private FollowingChangeResult update(String userId, String organizerId, boolean followed) {
        // Compare-and-set avoids overwriting a concurrent follow/unfollow or event update.
        for (int attempt = 0; attempt < 5; attempt++) {
            Users user = mongo.findOne(Query.query(Criteria.where("userId").is(userId)), Users.class);
            if (user == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found.");
            var ids = new LinkedHashSet<>(state(user).organizerIds());
            if (organizerId != null) {
                if (followed) ids.add(organizerId); else ids.remove(organizerId);
            }
            FollowingRecord next = calculate(userId, ids, Instant.now());
            var result = mongo.updateFirst(Query.query(Criteria.where("userId").is(userId)
                    .and("following").is(user.getFollowing())), new Update().set("following", next), Users.class);
            if (result.getMatchedCount() > 0) {
                int previousCount = state(user).eventCount() == null ? 0 : state(user).eventCount();
                return new FollowingChangeResult(next.organizerIds(), next.eventCount(), next.nextExpiryAtIso(),
                        next.eventCount() - previousCount);
            }
        }
        throw new ResponseStatusException(HttpStatus.CONFLICT, "Following changed concurrently. Retry the action.");
    }

    FollowingRecord calculate(String viewer, Set<String> organizers, Instant now) {
        if (organizers.isEmpty()) return new FollowingRecord(List.of(), 0, null);
        List<? extends Event> events = eventOwnership.activeOriginalEventsByCreators(organizers);
        Set<String> friends = friendships.friendIds(viewer);
        Set<String> sources = new HashSet<>();
        Instant nextExpiry = null;
        for (Event event : events) {
            if (!eligible(event, viewer, friends, now)) continue;
            sources.add(event.getSourceId());
            Instant end = boundary(event);
            if (end != null && (nextExpiry == null || end.isBefore(nextExpiry))) nextExpiry = end;
        }
        return new FollowingRecord(List.copyOf(organizers), sources.size(), nextExpiry == null ? null : nextExpiry.toString());
    }

    public static boolean eligible(Event event, String viewer, Set<String> friends, Instant now) {
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

    private static Instant boundary(Event event) {
        String value = event.getEndAtIso();
        if (value == null || value.isBlank()) value = event.getStartAtIso();
        try { return Instant.parse(value); } catch (RuntimeException ignored) { return null; }
    }

    public void refreshForSources(Collection<String> sourceIds) {
        if (sourceIds == null || sourceIds.isEmpty()) return;
        Set<String> organizers = new HashSet<>();
        eventOwnership.storedEventsBySources(sourceIds)
                .forEach(event -> organizers.add(event.getCreatorUserId()));
        refreshForOrganizers(organizers);
    }

    public void refreshForOrganizers(Collection<String> organizers) {
        if (organizers.isEmpty()) return;
        for (Users user : mongo.find(Query.query(Criteria.where("following.organizerIds").in(organizers)), Users.class))
            update(user.getUserId(), null, false);
    }

    public void refreshForViewers(Collection<String> userIds) {
        if (userIds.isEmpty()) return;
        for (Users user : mongo.find(Query.query(Criteria.where("userId").in(userIds)
                .and("following.organizerIds.0").exists(true)), Users.class)) update(user.getUserId(), null, false);
    }

    public void expire(Instant now) {
        Query query = Query.query(Criteria.where("following.nextExpiryAtIso").ne(null).lte(now.toString())).limit(200);
        if (JobGroupContext.isActive()) query.addCriteria(jobGroupScope.workspaceCriteria("workspaceGroupId"));
        for (Users user : mongo.find(query, Users.class)) update(user.getUserId(), null, false);
    }

    public List<FollowedMember> members(Users viewer) {
        var ids = state(viewer).organizerIds();
        if (ids.isEmpty()) return List.of();
        return mongo.find(Query.query(Criteria.where("userId").in(ids)), Users.class).stream()
                .sorted(Comparator.comparing(Users::getName, Comparator.nullsLast(String::compareToIgnoreCase)))
                .map(user -> new FollowedMember(user.getUserId(), user.getUserId(), user.getName(),
                        user.getInitials(), user.getGender(), user.getCity(), (user.getImages() == null || user.getImages().isEmpty() ? null : user.getImages().get(0)), "Member", "accepted"))
                .toList();
    }
    public record FollowingChangeResult(List<String> organizerIds, int eventCount,
            String nextExpiryAtIso, int eventCountDelta) {}

    public record FollowedMember(String id, String userId, String name, String initials,
            String gender, String city, String avatarUrl, String role, String status) {}
    @Override public java.util.List<String> organizerIds(com.raxim.myscoutee.domain.accounts.api.WorkspaceProfile profile) { return state((Users) profile).organizerIds(); }
    public boolean eligibleEvent(Event event, String viewer, Set<String> friends, Instant now) { return eligible(event, viewer, friends, now); }
}
