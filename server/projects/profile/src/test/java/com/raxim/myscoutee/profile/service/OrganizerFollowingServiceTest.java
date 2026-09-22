package com.raxim.myscoutee.profile.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import java.time.Instant;
import java.util.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import com.mongodb.client.result.UpdateResult;
import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.security.FriendshipFacts;

class OrganizerFollowingServiceTest {
    private static final Instant NOW = Instant.parse("2026-09-22T12:00:00Z");
    private ActivityEvent event(String id) {
        ActivityEvent e = new ActivityEvent(); e.setSourceId(id); e.setStatus("A");
        e.setCreatorUserId("organizer"); e.setVisibility("Public");
        e.setStartAtIso("2026-09-22T11:00:00Z"); e.setEndAtIso("2026-09-22T13:00:00Z"); return e;
    }
    @Test void countsRunningAndFutureEventsUntilTheirEnd() {
        assertTrue(OrganizerFollowingService.eligible(event("e"), "viewer", Set.of(), NOW));
        ActivityEvent e = event("e"); e.setStartAtIso("2026-09-23T11:00:00Z"); e.setEndAtIso("2026-09-23T13:00:00Z");
        assertTrue(OrganizerFollowingService.eligible(e, "viewer", Set.of(), NOW));
        e.setEndAtIso(NOW.toString()); assertFalse(OrganizerFollowingService.eligible(e, "viewer", Set.of(), NOW));
    }
    @ParameterizedTest @ValueSource(strings={"DR","T","D","I","B","UR"})
    void excludesUnpublishedAndSuppressedEvents(String status) {
        ActivityEvent e = event("e"); e.setStatus(status);
        assertFalse(OrganizerFollowingService.eligible(e, "viewer", Set.of(), NOW));
    }
    @Test void preservesVisibilityAndRootEventBoundary() {
        ActivityEvent e = event("e"); e.setVisibility("Invitation only");
        assertFalse(OrganizerFollowingService.eligible(e, "viewer", Set.of("organizer"), NOW));
        e.setVisibility("Friends only");
        assertFalse(OrganizerFollowingService.eligible(e, "viewer", Set.of(), NOW));
        assertTrue(OrganizerFollowingService.eligible(e, "viewer", Set.of("organizer"), NOW));
        e.setGenerated(true); assertFalse(OrganizerFollowingService.eligible(e, "viewer", Set.of("organizer"), NOW));
        e.setGenerated(false); e.setParentEventId("parent");
        assertFalse(OrganizerFollowingService.eligible(e, "viewer", Set.of("organizer"), NOW));
    }
    @Test void deduplicatesOwnerCopiesAndStoresNextExpiryOnWrite() {
        MongoTemplate mongo = mock(MongoTemplate.class); FriendshipFacts friends = mock(FriendshipFacts.class);
        when(friends.friendIds("viewer")).thenReturn(Set.of());
        when(mongo.find(any(Query.class), eq(ActivityEvent.class))).thenReturn(List.of(event("one"), event("one"), event("two")));
        var result = new OrganizerFollowingService(mongo, friends).calculate("viewer", Set.of("organizer"), NOW);
        assertEquals(2, result.eventCount()); assertEquals("2026-09-22T13:00:00Z", result.nextExpiryAtIso());
        verify(mongo, times(1)).find(any(Query.class), eq(ActivityEvent.class));
    }
    @Test void repeatedUnfollowDoesNotChangeOtherOrganizersOrAvatarCounters() {
        MongoTemplate mongo = mock(MongoTemplate.class); FriendshipFacts friends = mock(FriendshipFacts.class);
        Users user = new Users(); user.setUserId("viewer");
        user.setFollowing(new Users.FollowingRecord(List.of("other"), 0, null));
        when(mongo.findOne(any(Query.class), eq(Users.class))).thenReturn(user);
        when(mongo.find(any(Query.class), eq(ActivityEvent.class))).thenReturn(List.of());
        when(friends.friendIds("viewer")).thenReturn(Set.of());
        when(mongo.updateFirst(any(Query.class), any(Update.class), eq(Users.class)))
                .thenReturn(UpdateResult.acknowledged(1, 1L, null));
        var result = new OrganizerFollowingService(mongo, friends).change("viewer", "organizer", false);
        assertEquals(List.of("other"), result.organizerIds());
        verify(mongo).updateFirst(any(Query.class), argThat((Update update) ->
                update.getUpdateObject().get("$set", org.bson.Document.class).keySet().equals(Set.of("following"))), eq(Users.class));
    }
    @Test void committedFollowReturnsPositiveDeltaAndRetryReturnsZero() {
        MongoTemplate mongo = mock(MongoTemplate.class); FriendshipFacts friends = mock(FriendshipFacts.class);
        Users user = new Users(); user.setUserId("viewer");
        when(mongo.exists(any(Query.class), eq(Users.class))).thenReturn(true);
        when(mongo.findOne(any(Query.class), eq(Users.class))).thenReturn(user);
        ActivityEvent one = event("one"), two = event("two");
        one.setEndAtIso("2099-09-22T13:00:00Z"); two.setEndAtIso("2099-09-22T13:00:00Z");
        when(mongo.find(any(Query.class), eq(ActivityEvent.class))).thenReturn(List.of(one, two));
        when(friends.friendIds("viewer")).thenReturn(Set.of());
        when(mongo.updateFirst(any(Query.class), any(Update.class), eq(Users.class)))
                .thenReturn(UpdateResult.acknowledged(1, 1L, null));
        var service = new OrganizerFollowingService(mongo, friends);
        var result = service.change("viewer", "organizer", true);
        assertEquals(2, result.eventCountDelta()); assertEquals(2, result.eventCount());
        user.setFollowing(new Users.FollowingRecord(result.organizerIds(), result.eventCount(), result.nextExpiryAtIso()));
        assertEquals(0, service.change("viewer", "organizer", true).eventCountDelta());
    }
    @Test void committedUnfollowReturnsNegativeDeltaAndPersistsTheAbsoluteState() {
        MongoTemplate mongo = mock(MongoTemplate.class); FriendshipFacts friends = mock(FriendshipFacts.class);
        Users user = new Users(); user.setUserId("viewer");
        user.setFollowing(new Users.FollowingRecord(List.of("organizer"), 3, "2099-09-22T13:00:00Z"));
        when(mongo.findOne(any(Query.class), eq(Users.class))).thenReturn(user);
        when(mongo.updateFirst(any(Query.class), any(Update.class), eq(Users.class)))
                .thenReturn(UpdateResult.acknowledged(1, 1L, null));
        var result = new OrganizerFollowingService(mongo, friends).change("viewer", "organizer", false);
        assertEquals(-3, result.eventCountDelta()); assertEquals(0, result.eventCount());
        verify(mongo).updateFirst(any(Query.class), argThat((Update update) ->
                new Users.FollowingRecord(List.of(), 0, null).equals(
                    update.getUpdateObject().get("$set", org.bson.Document.class).get("following"))), eq(Users.class));
    }

}
