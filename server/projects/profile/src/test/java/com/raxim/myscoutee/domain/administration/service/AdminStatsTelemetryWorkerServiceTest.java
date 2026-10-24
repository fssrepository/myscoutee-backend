package com.raxim.myscoutee.domain.administration.service;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Set;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicBoolean;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.data.redis.connection.stream.MapRecord;
import org.springframework.data.redis.connection.stream.StreamOffset;
import org.springframework.data.redis.connection.stream.StreamReadOptions;
import org.springframework.data.redis.core.StreamOperations;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.test.util.ReflectionTestUtils;

import com.raxim.myscoutee.common.config.mongo.*;
import com.raxim.myscoutee.common.redis.RedisStreamRetentionService;
import com.raxim.myscoutee.domain.accounts.api.AdminCounterRefresh;
import com.raxim.myscoutee.domain.administration.config.AdminStatsProperties;
import com.raxim.myscoutee.domain.notifications.api.NotificationJobs;
import tools.jackson.databind.ObjectMapper;

@Tag("standard")
class AdminStatsTelemetryWorkerServiceTest {
    final AdminStatsService stats = mock(AdminStatsService.class);
    final AdminMonitoringService monitoring = mock(AdminMonitoringService.class);
    final AdminCounterRefresh counters = mock(AdminCounterRefresh.class);
    final NotificationJobs jobs = mock(NotificationJobs.class, CALLS_REAL_METHODS);
    final MongoChangeStreamService changes = mock(MongoChangeStreamService.class);
    final AtomicBoolean admitted = new AtomicBoolean(true);
    final StringRedisTemplate redis = mock(StringRedisTemplate.class);
    @SuppressWarnings("unchecked")
    final StreamOperations<String, Object, Object> streams = mock(StreamOperations.class);
    AdminStatsTelemetryWorkerService worker;
    Runnable derivedChanged;
    Runnable queuesChanged;

    @BeforeEach
    @SuppressWarnings("unchecked")
    void setup() {
        MongoSessionModeContext.set(MongoSessionMode.REAL);
        when(redis.opsForStream()).thenReturn(streams);
        when(streams.read(any(StreamReadOptions.class), any(StreamOffset.class))).thenReturn(List.of());
        when(stats.lastTelemetryStreamId()).thenReturn(Optional.empty());
        when(jobs.configuredGroupIds(anySet())).thenReturn(java.util.Collections.singletonList(null));
        when(jobs.beginScheduledRun(eq("admin-telemetry"), anyString(), anyString(), any()))
                .thenAnswer(call -> admitted.get() ? mock(NotificationJobs.Configuration.class) : null);
        worker = new AdminStatsTelemetryWorkerService(redis, new ObjectMapper(), stats, monitoring,
                counters, new AdminStatsProperties(), mock(RedisStreamRetentionService.class), null, null);
        ReflectionTestUtils.setField(worker, "groupRules", jobs);
        ReflectionTestUtils.setField(worker, "groupDatabases", new ScheduledMongoSessionRunner("same", "same"));
        ReflectionTestUtils.setField(worker, "clock", Clock.fixed(Instant.parse("2026-10-09T12:00:00Z"), ZoneOffset.UTC));
        worker.watchInputs(changes);
        var invalidation = ArgumentCaptor.forClass(Runnable.class);
        verify(changes).watch(eq("admin-stat-inputs"), anySet(), anySet(), any(), any(), invalidation.capture());
        derivedChanged = invalidation.getValue();
        verify(changes).watch(eq("admin-queue-inputs"), anySet(), anySet(), any(), any(), invalidation.capture());
        queuesChanged = invalidation.getValue();
    }

    @AfterEach void clearMode() { worker.stopReader(); MongoSessionModeContext.set(MongoSessionMode.REAL); }

    @Test void watchesOnlyAdministrationSignalsAndCoLocatedAccounts() {
        var collections = ArgumentCaptor.forClass(Set.class);
        verify(changes, times(3)).watch(anyString(), collections.capture(), anySet(), any(), any(), any());
        org.assertj.core.api.Assertions.assertThat(collections.getAllValues())
                .containsExactly(Set.of("users"), Set.of("adminWorkerSignals"), Set.of("adminWorkerSignals"));
    }

    @Test void unchangedEmptyPassDoesNotClaimWriteOrRecalculate() {
        worker.drainTelemetryWindow();
        clearInvocations(stats, monitoring, counters, jobs, streams);
        worker.drainTelemetryWindow();
        worker.drainTelemetryWindow();
        verifyNoInteractions(stats, monitoring, counters, streams);
        verify(jobs, never()).beginScheduledRun(anyString(), anyString(), anyString(), any());
    }

    @Test void pendingBatchDoesNotAdvanceCursorOrReadAgainWhileAdminSuspendsProcessing() {
        worker.drainTelemetryWindow();
        var record = MapRecord.create("admin:telemetry", java.util.Map.<Object, Object>of("payload", "{}"))
                .withId(org.springframework.data.redis.connection.stream.RecordId.of("10-0"));
        when(streams.read(any(StreamReadOptions.class), any(StreamOffset.class))).thenReturn(List.of(record));
        worker.readStreamBatch();
        clearInvocations(streams, stats, monitoring);
        admitted.set(false);
        worker.drainTelemetryWindow();
        worker.readStreamBatch();
        worker.readStreamBatch();
        verifyNoInteractions(streams, stats, monitoring);
        admitted.set(true);
        worker.drainTelemetryWindow();
        verify(stats).applyTelemetryEvents(anyList(), eq("10-0"), eq(false));
        when(streams.read(any(StreamReadOptions.class), any(StreamOffset.class))).thenReturn(List.of());
        worker.readStreamBatch();
        var offset = ArgumentCaptor.forClass(StreamOffset.class);
        var options = ArgumentCaptor.forClass(StreamReadOptions.class);
        verify(streams).read(options.capture(), offset.capture());
        org.assertj.core.api.Assertions.assertThat(offset.getValue().getOffset()).isEqualTo(org.springframework.data.redis.connection.stream.ReadOffset.from("10-0"));
        org.assertj.core.api.Assertions.assertThat(options.getValue().isBlocking()).isTrue();
    }

    @Test void blockedReaderDoesNotBlockSchedulerAndShutdownInterruptsIt() throws Exception {
        worker.drainTelemetryWindow();
        var reading = new java.util.concurrent.CountDownLatch(1);
        var stopped = new java.util.concurrent.CountDownLatch(1);
        when(streams.read(any(StreamReadOptions.class), any(StreamOffset.class))).thenAnswer(call -> {
            reading.countDown();
            try { new java.util.concurrent.CountDownLatch(1).await(); }
            finally { stopped.countDown(); }
            return List.of();
        });
        worker.startReader();
        org.assertj.core.api.Assertions.assertThat(reading.await(3, java.util.concurrent.TimeUnit.SECONDS)).isTrue();
        org.junit.jupiter.api.Assertions.assertTimeoutPreemptively(java.time.Duration.ofSeconds(2), worker::drainTelemetryWindow);
        worker.stopReader();
        org.assertj.core.api.Assertions.assertThat(stopped.await(3, java.util.concurrent.TimeUnit.SECONDS)).isTrue();
    }

    @Test void suspendedStreamDoesNotHoldBackOtherGroupsAndReadsAreMultiplexed() {
        when(jobs.configuredGroupIds(anySet())).thenReturn(java.util.Arrays.asList(null, "work"));
        worker.drainTelemetryWindow();
        var first = MapRecord.create("admin:telemetry", java.util.Map.<Object, Object>of("payload", "{}"))
                .withId(org.springframework.data.redis.connection.stream.RecordId.of("10-0"));
        var second = MapRecord.create("admin:telemetry:REAL:work", java.util.Map.<Object, Object>of("payload", "{}"))
                .withId(org.springframework.data.redis.connection.stream.RecordId.of("20-0"));
        when(streams.read(any(StreamReadOptions.class), any(StreamOffset[].class))).thenReturn(List.of(first, second));
        worker.readStreamBatch();
        when(jobs.beginScheduledRun(eq("admin-telemetry"), anyString(), anyString(), any()))
                .thenAnswer(call -> com.raxim.myscoutee.domain.platform.api.JobGroupContext.groupId() == null
                        ? null : mock(NotificationJobs.Configuration.class));
        clearInvocations(stats, streams);
        worker.drainTelemetryWindow();
        verify(stats, never()).applyTelemetryEvents(anyList(), eq("10-0"), anyBoolean());
        verify(stats).applyTelemetryEvents(anyList(), eq("20-0"), eq(false));
        when(streams.read(any(StreamReadOptions.class), any(StreamOffset[].class))).thenReturn(List.of());
        worker.readStreamBatch();
        var offset = ArgumentCaptor.forClass(StreamOffset.class);
        verify(streams).read(any(StreamReadOptions.class), offset.capture());
        org.assertj.core.api.Assertions.assertThat(offset.getValue().getKey()).isEqualTo("admin:telemetry:REAL:work");
    }

    @Test void batchAlreadyCommittedByAnotherInstanceIsNotAppliedAgain() {
        worker.drainTelemetryWindow();
        var record = MapRecord.create("admin:telemetry", java.util.Map.<Object, Object>of("payload", "{}"))
                .withId(org.springframework.data.redis.connection.stream.RecordId.of("10-0"));
        when(streams.read(any(StreamReadOptions.class), any(StreamOffset.class))).thenReturn(List.of(record));
        worker.readStreamBatch();
        when(stats.lastTelemetryStreamId()).thenReturn(Optional.of("20-0"));
        when(monitoring.lastTelemetryStreamId()).thenReturn(Optional.of("20-0"));
        clearInvocations(stats, monitoring, streams);
        worker.drainTelemetryWindow();
        verify(stats, never()).applyTelemetryEvents(anyList(), anyString(), anyBoolean());
        verify(monitoring, never()).applyTelemetryEvents(anyList(), anyString());
        when(streams.read(any(StreamReadOptions.class), any(StreamOffset.class))).thenReturn(List.of());
        worker.readStreamBatch();
        var offset = ArgumentCaptor.forClass(StreamOffset.class);
        verify(streams).read(any(StreamReadOptions.class), offset.capture());
        org.assertj.core.api.Assertions.assertThat(offset.getValue().getOffset()).isEqualTo(org.springframework.data.redis.connection.stream.ReadOffset.from("20-0"));
    }

    @Test void partialCommitRetriesOnlyUncommittedProjectionAndRestartUsesEarlierCursor() {
        when(stats.lastTelemetryStreamId()).thenReturn(Optional.of("10-0"));
        when(monitoring.lastTelemetryStreamId()).thenReturn(Optional.of("0-0"));
        worker.drainTelemetryWindow();
        var record = MapRecord.create("admin:telemetry", java.util.Map.<Object, Object>of("payload", "{}"))
                .withId(org.springframework.data.redis.connection.stream.RecordId.of("10-0"));
        when(streams.read(any(StreamReadOptions.class), any(StreamOffset.class))).thenReturn(List.of(record));
        worker.readStreamBatch();
        var offset = ArgumentCaptor.forClass(StreamOffset.class);
        verify(streams).read(any(StreamReadOptions.class), offset.capture());
        org.assertj.core.api.Assertions.assertThat(offset.getValue().getOffset()).isEqualTo(org.springframework.data.redis.connection.stream.ReadOffset.from("0-0"));
        clearInvocations(stats, monitoring);
        worker.drainTelemetryWindow();
        verify(stats, never()).applyTelemetryEvents(anyList(), anyString(), anyBoolean());
        verify(monitoring).applyTelemetryEvents(anyList(), eq("10-0"));
    }

    @Test void removedGroupsStopBeingRead() {
        worker.drainTelemetryWindow();
        when(jobs.configuredGroupIds(anySet())).thenReturn(List.of());
        worker.drainTelemetryWindow();
        clearInvocations(streams);
        worker.readStreamBatch();
        verifyNoInteractions(streams);
    }

    @Test void sourceChangesWaitForAdminAdmissionAndSurviveChangesDuringRefresh() {
        worker.drainTelemetryWindow();
        clearInvocations(stats);
        derivedChanged.run();
        admitted.set(false);
        worker.drainTelemetryWindow();
        verifyNoInteractions(stats);
        admitted.set(true);
        doAnswer(call -> { derivedChanged.run(); return null; }).doNothing().when(stats).refreshGraphScienceSnapshot();
        worker.drainTelemetryWindow();
        worker.drainTelemetryWindow();
        worker.drainTelemetryWindow();
        verify(stats, times(2)).refreshGraphScienceSnapshot();
    }

    @Test void queueMutationDoesNotRecalculateGraphAndDayBoundaryDoes() {
        worker.drainTelemetryWindow();
        clearInvocations(stats, counters);
        queuesChanged.run();
        worker.drainTelemetryWindow();
        verifyNoInteractions(stats);
        verify(counters).refreshAdminMenuCounters();
        ReflectionTestUtils.setField(worker, "clock", Clock.fixed(Instant.parse("2026-10-10T00:00:00Z"), ZoneOffset.UTC));
        worker.drainTelemetryWindow();
        verify(stats).refreshGraphScienceSnapshot();
    }

    @Test void failedRefreshIsRetriedAndRecordedAsFailure() {
        doThrow(new IllegalStateException("projection unavailable")).doNothing().when(stats).refreshGraphScienceSnapshot();
        worker.drainTelemetryWindow();
        worker.drainTelemetryWindow();
        worker.drainTelemetryWindow();
        verify(stats, times(2)).refreshGraphScienceSnapshot();
        verify(jobs).recordRun(eq("admin-telemetry"), eq(0), eq("failed"), anyString(), anyString(), any());
    }

    @Test void newTelemetryUpdatesCountersWithoutRepeatingUnchangedGraph() {
        worker.drainTelemetryWindow();
        clearInvocations(stats, monitoring);
        MapRecord<String, Object, Object> record = MapRecord.create("admin:telemetry", java.util.Map.<Object, Object>of(
                "payload", "{\"eventKey\":\"jobs.run.completed\",\"domain\":\"jobs\",\"amount\":1}")).withId(org.springframework.data.redis.connection.stream.RecordId.of("10-0"));
        when(streams.read(any(StreamReadOptions.class), any(StreamOffset.class))).thenReturn(List.of(record), List.of());
        worker.readStreamBatch();
        admitted.set(false);
        worker.drainTelemetryWindow();
        verifyNoInteractions(stats, monitoring);
        when(streams.read(any(StreamReadOptions.class), any(StreamOffset.class))).thenReturn(List.of(record), List.of());
        admitted.set(true);
        worker.drainTelemetryWindow();
        worker.drainTelemetryWindow();
        verify(stats).applyTelemetryEvents(argThat(events -> events.size() == 1), eq("10-0"), eq(false));
        verify(stats, never()).refreshGraphScienceSnapshot();
        verify(monitoring).applyTelemetryEvents(anyList(), eq("10-0"));
    }

    @Test void counterFailureAfterTelemetryCommitStillRetriesOnEmptyStream() {
        worker.drainTelemetryWindow();
        clearInvocations(stats, counters);
        MapRecord<String, Object, Object> record = MapRecord.create("admin:telemetry", java.util.Map.<Object, Object>of(
                "payload", "{}")).withId(org.springframework.data.redis.connection.stream.RecordId.of("10-0"));
        when(streams.read(any(StreamReadOptions.class), any(StreamOffset.class))).thenReturn(List.of(record), List.of());
        worker.readStreamBatch();
        doThrow(new IllegalStateException("counter unavailable")).doNothing().when(counters).refreshAdminMenuCounters();
        worker.drainTelemetryWindow();
        worker.drainTelemetryWindow();
        worker.drainTelemetryWindow();
        verify(counters, times(2)).refreshAdminMenuCounters();
        verify(stats, never()).refreshGraphScienceSnapshot();
    }

    @Test void disconnectAndReconnectReconcileEvenWithoutAnObservedMutation() {
        worker.drainTelemetryWindow();
        clearInvocations(stats);
        var disconnect = ArgumentCaptor.forClass(Runnable.class);
        verify(changes).watch(eq("admin-stat-inputs"), anySet(), anySet(), any(), disconnect.capture(), any());
        disconnect.getValue().run();
        worker.drainTelemetryWindow();
        derivedChanged.run(); // transport invokes invalidation again after subscribe-before-reconcile
        worker.drainTelemetryWindow();
        verify(stats, times(2)).refreshGraphScienceSnapshot();
    }

    @Test void demoChangesDoNotInvalidateRealProjection() {
        ReflectionTestUtils.setField(worker, "groupDatabases", new ScheduledMongoSessionRunner("real", "demo"));
        worker.drainTelemetryWindow(); // both databases
        clearInvocations(stats);
        MongoSessionModeContext.set(MongoSessionMode.DEMO);
        derivedChanged.run();
        MongoSessionModeContext.set(MongoSessionMode.REAL);
        worker.drainTelemetryWindow();
        verify(stats, times(1)).refreshGraphScienceSnapshot();
    }
}
