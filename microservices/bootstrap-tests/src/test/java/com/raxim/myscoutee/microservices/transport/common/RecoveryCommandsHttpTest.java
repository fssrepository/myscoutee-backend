package com.raxim.myscoutee.microservices.transport.common;

import java.net.URI;
import java.time.*;
import java.util.*;
import org.junit.jupiter.api.*;
import org.springframework.boot.SpringBootConfiguration;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.*;
import io.micrometer.core.instrument.simple.SimpleMeterRegistry;
import tools.jackson.databind.json.JsonMapper;
import com.raxim.myscoutee.common.config.mongo.*;
import com.raxim.myscoutee.domain.accounts.api.*;
import com.raxim.myscoutee.domain.chat.api.AttachmentLifecycle;
import com.raxim.myscoutee.domain.email.api.ScheduledMessages;
import com.raxim.myscoutee.domain.notifications.api.NotificationJobs;
import com.raxim.myscoutee.domain.platform.api.JobGroupContext;
import com.raxim.myscoutee.microservices.bootstrap.ServiceSecurityConfiguration;
import com.raxim.myscoutee.microservices.transport.accounts.*;
import com.raxim.myscoutee.microservices.transport.events.*;
import com.raxim.myscoutee.microservices.transport.integrations.*;
import com.raxim.myscoutee.domain.events.api.CheckoutMemberships;
import com.raxim.myscoutee.domain.integrations.api.EventChanges;
import com.raxim.myscoutee.microservices.transport.chat.*;
import com.raxim.myscoutee.microservices.transport.email.*;
import com.raxim.myscoutee.microservices.transport.notifications.*;
import com.raxim.myscoutee.microservices.transport.administration.*;
import com.raxim.myscoutee.domain.administration.api.OperationalTelemetry;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.*;

/** Wire preservation only; owner persistence/replay is exercised by embedded Mongo tests. */
class RecoveryCommandsHttpTest {
    static final String TOKEN = "test-only-recovery-command-capability-00000000000000000000";
    static ConfigurableApplicationContext server;
    static URI origin;
    static final JsonMapper mapper = new JsonMapper();
    static final SimpleMeterRegistry metrics = new SimpleMeterRegistry();
    static final Duration CONNECT = Duration.ofSeconds(1), REQUEST = Duration.ofSeconds(3);
    @BeforeAll static void start() {
        server = new SpringApplicationBuilder(Fixture.class).properties(
                "server.address=127.0.0.1", "server.port=0", "management.server.port=0",
                "myscoutee.remote.activity-counters.command-token=" + TOKEN,
                "myscoutee.remote.attachment-lifecycle.command-token=" + TOKEN,
                "myscoutee.remote.scheduled-messages.command-token=" + TOKEN,
                "myscoutee.remote.notification-jobs.command-token=" + TOKEN,
                "myscoutee.remote.operational-telemetry.command-token=" + TOKEN,
                "myscoutee.remote.event-changes.command-token=" + TOKEN,
                "myscoutee.remote.checkout-memberships.command-token=" + TOKEN,
                "spring.main.banner-mode=off", "logging.level.root=WARN").run();
        origin = URI.create("http://127.0.0.1:" + server.getEnvironment().getProperty("local.server.port"));
    }
    @AfterEach void clear() { MongoSessionModeContext.clear(); }
    @AfterAll static void stop() { if (server != null) server.close(); metrics.close(); }
    @Test void projectionSignalPreservesDatabaseModeAndPropagatesFailureForScheduledRetry() {
        var owner = server.getBean(OperationalTelemetry.class);
        var inputs = new OperationalTelemetry.ProjectionSignal("affinity", Map.of(OperationalTelemetry.ProjectionInput.DERIVED, 2L, OperationalTelemetry.ProjectionInput.QUEUES, 3L));
        doAnswer(call -> { assertEquals(MongoSessionMode.DEMO, MongoSessionModeContext.currentMode()); return null; })
                .when(owner).signalProjectionInputs(inputs);
        MongoSessionModeContext.set(MongoSessionMode.DEMO);
        try (var remote = new RemoteOperationalTelemetry(origin, TOKEN, true, CONNECT, REQUEST, mapper, metrics)) {
            remote.signalProjectionInputs(inputs);
            assertThrows(IllegalArgumentException.class, () -> remote.signalProjectionInputs(new OperationalTelemetry.ProjectionSignal("affinity", Map.of())));
            doThrow(new IllegalStateException("private storage failure")).when(owner).signalProjectionInputs(inputs);
            var failure = assertThrows(RemoteReadTransport.RemoteReadException.class, () -> remote.signalProjectionInputs(inputs));
            assertEquals(503, failure.status());
        }
        verify(owner, times(2)).signalProjectionInputs(inputs);
    }
    @Test void menuCounterWriteReturnsCountersAndOwnerInOneScopedResponse() {
        var owner = server.getBean(MenuCounterUpdates.class);
        var profile = mock(DiscoveryProfile.class);
        when(profile.getUserId()).thenReturn("user");
        when(profile.getWorkspaceGroupId()).thenReturn("workspace");
        var change = new MenuCounterUpdates.Change("user", "workspace", "campaign-id", 2,
                Map.of("campaignsDrafts", -1, "campaignsPublished", 1));
        var snapshot = new MenuCounterUpdates.Snapshot(
                com.raxim.myscoutee.domain.accounts.dto.DiscoveryProfileDto.from(profile),
                Map.of("campaignsDrafts", 0, "campaignsPublished", 1, "otherModule", 5));
        when(owner.applyAll(List.of(change))).thenAnswer(call -> {
            assertEquals(MongoSessionMode.DEMO, MongoSessionModeContext.currentMode());
            assertEquals("workspace", JobGroupContext.groupId());
            return List.of(snapshot);
        });
        MongoSessionModeContext.set(MongoSessionMode.DEMO);
        try (var remote = new RemoteActivityCounters(origin, TOKEN, true, CONNECT, REQUEST, mapper, metrics)) {
            assertEquals(snapshot, JobGroupContext.call("workspace", () -> remote.apply(change)));
            assertThrows(IllegalArgumentException.class, () -> remote.apply(new MenuCounterUpdates.Change(
                    "user", "workspace", "unsafe.key", 2, Map.of("campaignsDrafts", 1))));
        }
        verify(owner).applyAll(List.of(change));
        verifyNoMoreInteractions(owner);
        assertFalse(JobGroupContext.isActive());
    }
    @Test void feedbackReceiptRetainsIdSignedDeltasAndDatabaseWorkspaceScope() {
        var owner = server.getBean(ActivityCounters.class);
        var change = new FeedbackCounterChanges.Change("a".repeat(32), Map.of("user", new FeedbackCounterChanges.FeedbackBucketDelta(0, -1, 1, 0)));
        when(owner.applyFeedbackReceipt(change)).thenAnswer(call -> {
            assertEquals(MongoSessionMode.DEMO, MongoSessionModeContext.currentMode());
            assertEquals("workspace", JobGroupContext.groupId()); return 1;
        });
        MongoSessionModeContext.set(MongoSessionMode.DEMO);
        try (var remote = new RemoteActivityCounters(origin, TOKEN, true, CONNECT, REQUEST, mapper, metrics)) {
            assertEquals(1, JobGroupContext.call("workspace", () -> remote.applyFeedbackReceipt(change)));
        }
        verify(owner).applyFeedbackReceipt(change);
        assertEquals(MongoSessionMode.DEMO, MongoSessionModeContext.currentMode());
    }
    @Test void supportCountersUseTheirOwnOwnerAndKeepExistingHttpAndScope() {
        var support = server.getBean(com.raxim.myscoutee.domain.accounts.api.SupportCaseCounters.class);
        when(support.hasSupportCaseCounters("support-admin")).thenAnswer(call -> {
            assertEquals(MongoSessionMode.DEMO, MongoSessionModeContext.currentMode());
            assertEquals("workspace", JobGroupContext.groupId());
            return true;
        });
        doAnswer(call -> {
            assertEquals(MongoSessionMode.DEMO, MongoSessionModeContext.currentMode());
            assertEquals("workspace", JobGroupContext.groupId());
            return null;
        }).when(support).refreshSupportCaseCountersForAdmins();
        MongoSessionModeContext.set(MongoSessionMode.DEMO);
        try (var remote = new RemoteActivityCounters(origin, TOKEN, true, CONNECT, REQUEST, mapper, metrics)) {
            assertTrue(JobGroupContext.call("workspace", () -> remote.hasSupportCaseCounters("support-admin")));
            JobGroupContext.call("workspace", () -> { remote.refreshSupportCaseCountersForAdmins(); return null; });
        }
        verify(support).hasSupportCaseCounters("support-admin");
        verify(support).refreshSupportCaseCountersForAdmins();
        assertFalse(JobGroupContext.isActive());
    }

    @Test void attachmentRevisionAndAvailabilitySurviveHttp() {
        var projection = new AttachmentLifecycle.Projection("event", "event", 17, false, "trashed");
        try (var remote = new RemoteAttachmentLifecycle(origin, TOKEN, true, CONNECT, REQUEST, mapper, metrics)) {
            remote.project(projection);
        }
        verify(server.getBean(AttachmentLifecycle.class)).project(projection);
    }
    @Test void lifecycleOccurrenceIdAndAudienceSurviveHttp() {
        String id = UUID.randomUUID().toString();
        try (var remote = new RemoteScheduledMessages(origin, TOKEN, true, CONNECT, REQUEST, mapper, metrics)) {
            assertNull(remote.scheduleEventLifecycleChangedOnce(id, "event", "Title", List.of("recipient"), List.of("deleted"), "actor"));
        }
        verify(server.getBean(ScheduledMessages.class)).scheduleEventLifecycleChangedOnce(
                id, "event", "Title", List.of("recipient"), List.of("deleted"), "actor");
    }
    @Test void claimAndRestorePreserveTheAcquiredRunEvenWhenTheClaimReplyWasLost() {
        var owner = server.getBean(NotificationJobs.class);
        var started = Instant.parse("2026-10-09T00:00:00Z");
        when(owner.claimPendingCount("event-job", started)).thenReturn(7);
        try (var remote = new RemoteNotificationJobs(origin, TOKEN, true, CONNECT, REQUEST, mapper, metrics)) {
            assertEquals(7, remote.claimPendingCount("event-job", started));
            remote.restoreClaimedPendingCount("event-job", 0, "events", started);
            assertThrows(IllegalArgumentException.class, () -> remote.claimPendingCount("event-job"));
        }
        verify(owner).restoreClaimedPendingCount("event-job", 0, "events", started);
    }
    @Test void retryOutcomeRetainsOriginalRunPrecisionAndOwnerScopeWithoutInlineRetry() {
        var owner = server.getBean(NotificationJobs.class);
        var outcome = new NotificationJobs.RetryOutcome("affinity-admin-signals",
                Instant.parse("2026-10-15T08:00:00.123456789Z"), 3, "completed", "Delivered on attempt 3/3.");
        doAnswer(call -> {
            assertEquals(MongoSessionMode.DEMO, MongoSessionModeContext.currentMode());
            assertEquals("workspace", JobGroupContext.groupId());
            return null;
        }).when(owner).recordRetryOutcome(outcome);
        MongoSessionModeContext.set(MongoSessionMode.DEMO);
        try (var remote = new RemoteNotificationJobs(origin, TOKEN, true, CONNECT, REQUEST, mapper, metrics)) {
            JobGroupContext.run("workspace", () -> remote.recordRetryOutcome(outcome));
            doThrow(new IllegalStateException("owner unavailable")).when(owner).recordRetryOutcome(outcome);
            assertThrows(RemoteReadTransport.RemoteReadException.class,
                    () -> JobGroupContext.run("workspace", () -> remote.recordRetryOutcome(outcome)));
        }
        verify(owner, times(2)).recordRetryOutcome(outcome);
        assertFalse(JobGroupContext.isActive());
    }
    @Test void changeWakeupsRetainWorkspaceAndDatabaseAndRequireScope() {
        var encounters = server.getBean(EventChanges.class);
        var cancellations = server.getBean(CheckoutMemberships.class);
        org.mockito.stubbing.Answer<Void> scopeCheck = call -> {
            assertEquals(MongoSessionMode.DEMO, MongoSessionModeContext.currentMode());
            assertTrue(JobGroupContext.isActive());
            assertEquals("workspace", JobGroupContext.groupId());
            return null;
        };
        doAnswer(scopeCheck).when(encounters).publishPendingEncounters();
        doAnswer(scopeCheck).when(cancellations).finishPendingCancellations();
        MongoSessionModeContext.set(MongoSessionMode.DEMO);
        try (var remoteEvents = new RemoteEventChanges(origin, TOKEN, true, CONNECT, REQUEST, mapper, metrics);
             var remoteMemberships = new RemoteCheckoutMemberships(origin, TOKEN, true, CONNECT, REQUEST, mapper, metrics)) {
            assertThrows(IllegalArgumentException.class, remoteEvents::publishPendingEncounters);
            assertThrows(IllegalArgumentException.class, remoteMemberships::finishPendingCancellations);
            JobGroupContext.run("workspace", () -> {
                remoteEvents.publishPendingEncounters(); remoteMemberships.finishPendingCancellations();
            });
        }
        verify(encounters).publishPendingEncounters();
        verify(cancellations).finishPendingCancellations();
    }
    @SpringBootConfiguration
    @EnableAutoConfiguration(excludeName = {"org.springframework.boot.mongodb.autoconfigure.MongoAutoConfiguration",
            "org.springframework.boot.data.mongodb.autoconfigure.DataMongoAutoConfiguration",
            "org.springframework.boot.data.mongodb.autoconfigure.DataMongoRepositoriesAutoConfiguration",
            "org.springframework.boot.security.autoconfigure.UserDetailsServiceAutoConfiguration"})
    @Import({OperationalTelemetryServerConfiguration.class, ActivityCountersServerConfiguration.class, AttachmentLifecycleServerConfiguration.class,
            ScheduledMessagesServerConfiguration.class, NotificationJobsServerConfiguration.class, EventChangesServerConfiguration.class, CheckoutMembershipsServerConfiguration.class, ServiceSecurityConfiguration.class})
    static class Fixture {
        @Bean OperationalTelemetry telemetry() { return mock(OperationalTelemetry.class); }
        @Bean com.raxim.myscoutee.domain.accounts.api.SupportCaseCounters supportCounters() { return mock(com.raxim.myscoutee.domain.accounts.api.SupportCaseCounters.class); }
        @Bean ActivityCounters counters() { return mock(ActivityCounters.class); }
        @Bean MenuCounterUpdates menuCounters() { return mock(MenuCounterUpdates.class); }
        @Bean ServiceFeedbackCounters feedback() { return mock(ServiceFeedbackCounters.class); }
        @Bean FeedCounts feeds() { return mock(FeedCounts.class); }
        @Bean AttachmentLifecycle attachments() { return mock(AttachmentLifecycle.class); }
        @Bean ScheduledMessages messages() { return mock(ScheduledMessages.class); }
        @Bean EventChanges eventChanges() { return mock(EventChanges.class); }
        @Bean CheckoutMemberships checkoutMemberships() { return mock(CheckoutMemberships.class); }
        @Bean NotificationJobs jobs() { return mock(NotificationJobs.class); }
    }
}
