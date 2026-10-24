package com.raxim.myscoutee.domain.integrations.service;

import com.raxim.myscoutee.domain.events.service.EventJobQueries;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.*;
import com.raxim.myscoutee.domain.notifications.api.NotificationJobs;
import com.raxim.myscoutee.common.config.mongo.ScheduledMongoSessionRunner;
import org.springframework.test.util.ReflectionTestUtils;

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
    @Mock EventJobQueries jobGroupScope;
    @Mock ActivityEventsRepository events;
    @Mock IntegrationEventQueryService queries;
    @Mock IntegrationWebhookService webhooks;
    IntegrationEncounterPublisher publisher;
    NotificationJobs jobs;

    @org.junit.jupiter.api.BeforeEach
    void wireScope() {
        publisher = new IntegrationEncounterPublisher(
            new com.raxim.myscoutee.domain.events.service.MingleEncounterService(null, null, mongo, jobGroupScope),
            new com.raxim.myscoutee.domain.events.service.EventOwnershipService(events, null), queries, webhooks, null, null);
        jobs = mock(NotificationJobs.class, CALLS_REAL_METHODS);
        when(jobs.configuredGroupIds(any())).thenReturn(java.util.Arrays.asList((String) null));
        lenient().when(jobs.beginScheduledRun(any(), any(), any(), any())).thenReturn(mock(NotificationJobs.Configuration.class));
        ReflectionTestUtils.setField(publisher, "groupRules", jobs);
        ReflectionTestUtils.setField(publisher, "groupDatabases", new ScheduledMongoSessionRunner("same", "same"));
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

        publisher.publishPending();
        verify(mongo, never()).updateFirst(any(Query.class), any(Update.class), eq(ActivityMingleSession.class));

        publisher.publishPending();
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

        publisher.publishPending();

        verify(webhooks, never()).enqueueEncounters(any(), any());
        verify(mongo).updateFirst(any(Query.class), any(Update.class), eq(ActivityMingleSession.class));
    }

    @Test
    void emptyPublicationQueueDoesNotClaimOrRecordAJob() {
        publisher.publishPending();
        verify(jobs, never()).beginScheduledRun(any(), any(), any(), any());
        verify(jobs, never()).recordRun(any(), anyInt(), any(), any(), any(), any());
        verifyNoInteractions(events, queries, webhooks);
    }

    @Test
    void rejectedScheduleDoesNotPublishOrAcknowledgePreparedWork() {
        when(jobGroupScope.findEventOwned(any(Query.class), eq(ActivityMingleSession.class), eq("eventId")))
                .thenReturn(List.of(session()));
        when(jobs.beginScheduledRun(any(), any(), any(), any())).thenReturn(null);
        publisher.publishPending();
        verifyNoInteractions(events, queries, webhooks);
        verify(mongo, never()).updateFirst(any(Query.class), any(Update.class), eq(ActivityMingleSession.class));
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
