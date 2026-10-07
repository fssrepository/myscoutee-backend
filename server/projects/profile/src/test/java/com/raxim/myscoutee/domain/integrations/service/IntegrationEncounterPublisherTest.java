package com.raxim.myscoutee.domain.integrations.service;

import com.raxim.myscoutee.domain.platform.service.JobGroupScopeService;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import com.raxim.myscoutee.domain.events.document.ActivityEvent;
import com.raxim.myscoutee.domain.events.document.ActivityMingleSession;
import com.raxim.myscoutee.domain.events.repository.ActivityEventsRepository;

@ExtendWith(MockitoExtension.class)
@org.junit.jupiter.api.Tag("standard")
class IntegrationEncounterPublisherTest {
    @Mock MongoTemplate mongo;
    @Mock JobGroupScopeService jobGroupScope;
    @Mock ActivityEventsRepository events;
    @Mock IntegrationEventQueryService queries;
    @Mock IntegrationWebhookService webhooks;
    IntegrationEncounterPublisher publisher;

    @org.junit.jupiter.api.BeforeEach
    void wireScope() {
        publisher = new IntegrationEncounterPublisher(
            new com.raxim.myscoutee.domain.events.service.MingleEncounterService(null, null, mongo, jobGroupScope),
            new com.raxim.myscoutee.domain.events.service.EventOwnershipService(events), queries, webhooks);
    }

    @Test
    void retriesFailedPublicationBeforeMarkingTheSameCompletedRevision() {
        var session = session();
        var event = new ActivityEvent();
        event.setSourceId("event");
        event.setOwnerUserId("owner");
        event.setCreatorUserId("owner");
        when(jobGroupScope.findEventOwned(any(Query.class), eq(ActivityMingleSession.class), eq("eventId"))).thenReturn(List.of(session));
        when(events.findBySourceIdIn(List.of("event"))).thenReturn(List.of(event));
        doThrow(new IllegalStateException("outbox temporarily unavailable"))
                .doNothing().when(webhooks).enqueueEncounters(eq("owner"), any());

        org.springframework.test.util.ReflectionTestUtils.invokeMethod(publisher, "publishPendingInGroup");
        verify(mongo, never()).updateFirst(any(Query.class), any(Update.class), eq(ActivityMingleSession.class));

        org.springframework.test.util.ReflectionTestUtils.invokeMethod(publisher, "publishPendingInGroup");
        var query = ArgumentCaptor.forClass(Query.class);
        var update = ArgumentCaptor.forClass(Update.class);
        verify(mongo).updateFirst(query.capture(), update.capture(), eq(ActivityMingleSession.class));
        assertThat(query.getValue().getQueryObject()).containsEntry("_id", "session")
                .containsEntry("status", "COMPLETED").containsEntry("revision", 8);
        assertThat(update.getValue().getUpdateObject().get("$set", org.bson.Document.class))
                .containsEntry("encountersPublished", true);
    }

    @Test
    void retiresDeletedEventsWithoutPublishingAnInaccessibleResult() {
        when(jobGroupScope.findEventOwned(any(Query.class), eq(ActivityMingleSession.class), eq("eventId"))).thenReturn(List.of(session()));
        when(events.findBySourceIdIn(List.of("event"))).thenReturn(List.of());

        org.springframework.test.util.ReflectionTestUtils.invokeMethod(publisher, "publishPendingInGroup");

        verify(webhooks, never()).enqueueEncounters(any(), any());
        verify(mongo).updateFirst(any(Query.class), any(Update.class), eq(ActivityMingleSession.class));
    }

    private ActivityMingleSession session() {
        var session = new ActivityMingleSession();
        session.setId("session");
        session.setEventId("event");
        session.setStatus("COMPLETED");
        session.setRevision(8);
        return session;
    }
}
