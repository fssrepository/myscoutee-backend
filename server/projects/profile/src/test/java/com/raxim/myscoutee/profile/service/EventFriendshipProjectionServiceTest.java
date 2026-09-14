package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import org.bson.Document;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.model.BulkWriteOptions;
import com.mongodb.client.model.UpdateOneModel;
import com.mongodb.client.model.WriteModel;
import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.ActivityMember;
import com.raxim.myscoutee.profile.repository.ActivityMembersRepository;

class EventFriendshipProjectionServiceTest {
    private final MongoTemplate mongo = mock(MongoTemplate.class);
    private final ActivityMembersRepository members = mock(ActivityMembersRepository.class);
    private final MongoCollection<Document> collection = mock(MongoCollection.class);
    private final EventFriendshipProjectionService service = new EventFriendshipProjectionService(mongo, members);
    private final Instant now = Instant.parse("2026-09-14T12:00:00Z");

    @Test
    void completedEventBatchesParticipantsAndWritesEachEligiblePairOnceBeforeCompletion() {
        ActivityEvent event = event();
        when(mongo.find(any(Query.class), eq(ActivityEvent.class))).thenReturn(List.of(event));
        when(members.findByOwnerTypeAndOwnerIdIn("event", Set.of("event-1")))
                .thenReturn(List.of(member("a", "accepted", false), member("b", "accepted", false),
                        member("a", "accepted", false), member("pending", "pending", false),
                        member("organizer", "accepted", true)));
        when(mongo.getCollection("userFriendships")).thenReturn(collection);
        List<WriteModel<Document>> written = new ArrayList<>();
        when(collection.bulkWrite(anyList(), any(BulkWriteOptions.class))).thenAnswer(invocation -> {
            written.addAll(invocation.getArgument(0));
            return null;
        });
        assertThat(service.projectCompletedEvents(now, 20)).isEqualTo(1);
        assertThat(written).hasSize(1);
        UpdateOneModel<Document> pair = (UpdateOneModel<Document>) written.get(0);
        assertThat(pair.getFilter()).isEqualTo(new Document("_id", "1:ab"));
        assertThat(pair.getOptions().isUpsert()).isTrue();
        assertThat(pair.getUpdatePipeline()).hasSize(1);
        var order = inOrder(collection, mongo);
        order.verify(collection).bulkWrite(anyList(), any(BulkWriteOptions.class));
        order.verify(mongo).updateMulti(any(Query.class), any(Update.class), eq(ActivityEvent.class));
        verify(members).findByOwnerTypeAndOwnerIdIn("event", Set.of("event-1"));
    }

    @Test
    void failedPairWriteLeavesEventPendingForRetry() {
        when(mongo.find(any(Query.class), eq(ActivityEvent.class))).thenReturn(List.of(event()));
        when(members.findByOwnerTypeAndOwnerIdIn("event", Set.of("event-1")))
                .thenReturn(List.of(member("a", "accepted", false), member("b", "accepted", false)));
        when(mongo.getCollection("userFriendships")).thenReturn(collection);
        when(collection.bulkWrite(anyList(), any(BulkWriteOptions.class))).thenThrow(new IllegalStateException("write failed"));
        assertThatThrownBy(() -> service.projectCompletedEvents(now, 20)).isInstanceOf(IllegalStateException.class);
        verify(mongo, never()).updateMulti(any(Query.class), any(Update.class), eq(ActivityEvent.class));
    }

    @Test
    void eligibilityIsBoundedAndRequiresEndedPublishedActiveEventsNotYetProjected() {
        when(mongo.find(any(Query.class), eq(ActivityEvent.class))).thenReturn(List.of());
        assertThat(service.projectCompletedEvents(now, 20)).isZero();
        ArgumentCaptor<Query> query = ArgumentCaptor.forClass(Query.class);
        verify(mongo).find(query.capture(), eq(ActivityEvent.class));
        assertThat(query.getValue().getLimit()).isEqualTo(20);
        assertThat(query.getValue().getQueryObject().toJson()).contains("friendshipsProjected", "endAtIso", "status", "published", now.toString());
        verifyNoInteractions(members, collection);
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
