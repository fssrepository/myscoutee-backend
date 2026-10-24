package com.raxim.myscoutee.domain.events.service;

import com.raxim.myscoutee.domain.affinity.service.UserRatesService;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anySet;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import org.bson.Document;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.ArgumentCaptor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.model.BulkWriteOptions;
import com.mongodb.client.model.UpdateOneModel;
import com.mongodb.client.model.WriteModel;
import com.raxim.myscoutee.domain.events.document.ActivityEvent;
import com.raxim.myscoutee.domain.events.document.ActivityMingleRound;
import com.raxim.myscoutee.domain.events.document.ActivityMember;
import com.raxim.myscoutee.domain.events.repository.ActivityMembersRepository;

@org.junit.jupiter.api.Tag("standard")
class EventFriendshipProjectionServiceTest {
    private final MongoTemplate mongo = mock(MongoTemplate.class);
    private final ActivityMembersRepository members = mock(ActivityMembersRepository.class);
    private final MongoCollection<Document> collection = mock(MongoCollection.class);
    private final MongoCollection<Document> rateCollection = mock(MongoCollection.class);
    private final UserRatesService rates = mock(UserRatesService.class);
    private final EventFriendshipProjectionService service = new EventFriendshipProjectionService(mongo, members, rates, null, null);
    @org.junit.jupiter.api.BeforeEach void wireMeetingEvidence() {
        org.springframework.test.util.ReflectionTestUtils.setField(service, "meetingEvidence", new com.raxim.myscoutee.domain.affinity.service.MeetingEvidenceService(mongo));
    }
    private final Instant now = Instant.parse("2026-09-14T12:00:00Z");

    @ParameterizedTest
    @ValueSource(strings = {"Casual", "Tournament"})
    void completedEventBatchesParticipantsAndWritesEachEligibleMetPairOnceBeforeCompletion(String mode) {
        ActivityEvent event = event();
        event.setMode(mode);
        when(mongo.find(any(Query.class), eq(ActivityEvent.class))).thenReturn(List.of(event));
        when(members.findByOwnerTypeAndOwnerIdIn("event", Set.of("event-1")))
                .thenReturn(List.of(member("a", "accepted", false), member("b", "accepted", false),
                        member("a", "accepted", false), member("pending", "pending", false),
                        member("organizer", "accepted", true)));
        when(mongo.getCollection("userRates")).thenReturn(rateCollection);
        List<WriteModel<Document>> written = new ArrayList<>();
        when(rateCollection.bulkWrite(anyList(), any(BulkWriteOptions.class))).thenAnswer(invocation -> {
            written.addAll(invocation.getArgument(0));
            return null;
        });
        assertThat(service.projectCompletedEvents(now, 20)).isEqualTo(1);
        assertThat(written).hasSize(1);
        UpdateOneModel<Document> pair = (UpdateOneModel<Document>) written.get(0);
        assertThat(pair.getOptions().isUpsert()).isTrue();
        Document inserted = ((Document) pair.getUpdate()).get("$setOnInsert", Document.class);
        assertThat(inserted.getString("ownerUserId")).isEqualTo("a");
        assertThat(inserted.getString("relatedUserId")).isEqualTo("b");
        assertThat(((Document) pair.getUpdate()).get("$set", Document.class).getBoolean("met")).isTrue();
        var order = inOrder(rateCollection, rates, mongo);
        order.verify(rateCollection).bulkWrite(anyList(), any(BulkWriteOptions.class));
        order.verify(rates).projectRecordedMeetings(anySet());
        order.verify(mongo).updateMulti(any(Query.class), any(Update.class), eq(ActivityEvent.class));
        verify(mongo, never()).getCollection("userFriendships");
        verify(members).findByOwnerTypeAndOwnerIdIn("event", Set.of("event-1"));
    }

    @Test
    void failedPairWriteLeavesEventPendingForRetry() {
        when(mongo.find(any(Query.class), eq(ActivityEvent.class))).thenReturn(List.of(event()));
        when(members.findByOwnerTypeAndOwnerIdIn("event", Set.of("event-1")))
                .thenReturn(List.of(member("a", "accepted", false), member("b", "accepted", false)));
        when(mongo.getCollection("userRates")).thenReturn(rateCollection);
        when(rateCollection.bulkWrite(anyList(), any(BulkWriteOptions.class))).thenThrow(new IllegalStateException("write failed"));
        assertThatThrownBy(() -> service.projectCompletedEvents(now, 20)).isInstanceOf(IllegalStateException.class);
        verify(mongo, never()).updateMulti(any(Query.class), any(Update.class), eq(ActivityEvent.class));
    }

    @Test
    void failedMeetingProjectionsLeaveTheEventPendingForRetry() {
        when(mongo.find(any(Query.class), eq(ActivityEvent.class))).thenReturn(List.of(event()));
        when(members.findByOwnerTypeAndOwnerIdIn("event", Set.of("event-1")))
                .thenReturn(List.of(member("a", "accepted", false), member("b", "accepted", false)));
        when(mongo.getCollection("userRates")).thenReturn(rateCollection);
        doThrow(new IllegalStateException("projection failed")).when(rates).projectRecordedMeetings(Set.of("a", "b"));
        assertThatThrownBy(() -> service.projectCompletedEvents(now, 20)).isInstanceOf(IllegalStateException.class);
        verify(mongo, never()).updateMulti(any(Query.class), any(Update.class), eq(ActivityEvent.class));
    }

    @Test
    void completedMingleProjectsOnlyActualTablePairsAsEmptyMetRates() {
        ActivityEvent event = event();
        event.setMode("Mingle");
        event.setFriendshipsProjected(true);
        ActivityMingleRound round = new ActivityMingleRound();
        round.setEventId("event-1");
        round.setRoundNumber(1);
        round.setStatus("COMPLETED");
        round.setId("round-2");
        round.setCompletedAtIso(now.minusSeconds(10).toString());
        round.setTables(List.of(
                new ActivityMingleRound.TableAssignment(1, List.of("c", "a", "b")),
                new ActivityMingleRound.TableAssignment(2, List.of("a", "d"))));
        when(mongo.find(any(Query.class), eq(ActivityEvent.class))).thenReturn(List.of(event));
        when(mongo.find(any(Query.class), eq(ActivityMingleRound.class))).thenReturn(List.of(round));
        when(mongo.getCollection("userRates")).thenReturn(rateCollection);
        List<WriteModel<Document>> rateWrites = new ArrayList<>();
        when(rateCollection.bulkWrite(anyList(), any(BulkWriteOptions.class))).thenAnswer(invocation -> {
            rateWrites.addAll(invocation.getArgument(0));
            return null;
        });

        assertThat(service.projectCompletedMingleRounds(now, 20)).isEqualTo(1);
        assertThat(rateWrites).hasSize(4);
        UpdateOneModel<Document> firstRate = (UpdateOneModel<Document>) rateWrites.get(0);
        Document inserted = ((Document) firstRate.getUpdate()).get("$setOnInsert", Document.class);
        Document meeting = ((Document) firstRate.getUpdate()).get("$set", Document.class);
        assertThat(inserted.getString("mode")).isEqualTo("single");
        assertThat(meeting.getBoolean("met")).isTrue();
        assertThat(meeting.getString("metEventId")).isEqualTo("event-1");
        assertThat(inserted.getInteger("scoreGiven")).isZero();
        assertThat(inserted.getInteger("scoreReceived")).isZero();
        assertThat(inserted.getString("ownerUserId")).isEqualTo("a");
        assertThat(inserted.getString("relatedUserId")).isEqualTo("b");
        assertThat(rateWrites.stream().map(write -> ((UpdateOneModel<Document>) write).getFilter().toBsonDocument().toJson()))
                .noneMatch(filter -> filter.contains("not-seated"));
        var order = inOrder(rateCollection, rates, mongo);
        order.verify(rateCollection).bulkWrite(anyList(), any(BulkWriteOptions.class));
        order.verify(rates).projectRecordedMeetings(anySet());
        order.verify(mongo).updateFirst(any(Query.class), any(Update.class), eq(ActivityMingleRound.class));
        verifyNoInteractions(members);
        verify(mongo, never()).getCollection("userFriendships");
    }

    @Test
    void eligibilityIsBoundedAndRequiresEndedPublishedActiveEventsNotYetProjected() {
        when(mongo.find(any(Query.class), eq(ActivityEvent.class))).thenReturn(List.of());
        assertThat(service.projectCompletedEvents(now, 20)).isZero();
        ArgumentCaptor<Query> query = ArgumentCaptor.forClass(Query.class);
        verify(mongo).find(query.capture(), eq(ActivityEvent.class));
        assertThat(query.getValue().getLimit()).isEqualTo(20);
        assertThat(query.getValue().getQueryObject().toJson()).contains("friendshipsProjected", "endAtIso", "status", "published", now.toString());
        verifyNoInteractions(members, collection, rateCollection, rates);
    }

    private ActivityEvent event() {
        ActivityEvent event = new ActivityEvent();
        event.setSourceId("event-1");
        event.setTitle("Coffee");
        event.setEndAtIso(now.minusSeconds(60).toString());
        return event;
    }

    private ActivityMember member(String id, String status, boolean organizerOnly) {
        ActivityMember member = new ActivityMember();
        member.setOwnerId("event-1");
        member.setUserId(id);
        member.setStatus(status);
        member.setOrganizerOnly(organizerOnly);
        return member;
    }
}
