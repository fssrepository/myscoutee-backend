package com.raxim.myscoutee.domain.affinity.service;

import com.raxim.myscoutee.domain.platform.api.JobGroupContext;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

import java.time.Duration;
import java.time.Instant;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import org.junit.jupiter.api.Test;
import org.springframework.data.mongodb.core.MongoTemplate;

import com.raxim.myscoutee.domain.affinity.config.AffinityRecomputeProperties;
import com.raxim.myscoutee.domain.affinity.document.AffinityRecomputeTask;

@org.junit.jupiter.api.Tag("standard")
class AffinityRecomputeChangeStreamServiceTest {
    @Test
    void duePendingTaskTriggersImmediateWorkerWakeup() throws Exception {
        AffinityRecomputeMetricsService metrics = new AffinityRecomputeMetricsService();
        AffinityRecomputeWorkerService worker = mock(AffinityRecomputeWorkerService.class);
        CountDownLatch wakeup = new CountDownLatch(1);
        doAnswer(invocation -> {
            wakeup.countDown();
            return 0;
        }).when(worker).wakeDueTasks("change-stream");

        AffinityRecomputeChangeStreamService service = service(worker, metrics, Duration.ZERO);
        try {
            service.handleTaskChange(task(AffinityRecomputeTaskService.STATUS_PENDING, Instant.now().minusSeconds(1)));

            assertThat(wakeup.await(1, TimeUnit.SECONDS)).isTrue();
            verify(worker).wakeDueTasks("change-stream");
            assertThat(metrics.snapshot().changeStreamImmediateWakeups()).isEqualTo(1);
        } finally {
            service.stop();
        }
    }

    @Test
    void futurePendingTaskUsesTimerInsteadOfImmediateWakeup() throws Exception {
        AffinityRecomputeMetricsService metrics = new AffinityRecomputeMetricsService();
        AffinityRecomputeWorkerService worker = mock(AffinityRecomputeWorkerService.class);
        CountDownLatch wakeup = new CountDownLatch(1);
        doAnswer(invocation -> {
            wakeup.countDown();
            return 0;
        }).when(worker).wakeDueTasks("change-stream-timer");

        AffinityRecomputeChangeStreamService service = service(worker, metrics, Duration.ZERO);
        try {
            service.handleTaskChange(task(AffinityRecomputeTaskService.STATUS_PENDING, Instant.now().plusMillis(150)));

            assertThat(wakeup.await(50, TimeUnit.MILLISECONDS)).isFalse();
            assertThat(wakeup.await(1, TimeUnit.SECONDS)).isTrue();
            verify(worker).wakeDueTasks("change-stream-timer");
            assertThat(metrics.snapshot().changeStreamFutureTimers()).isEqualTo(1);
            assertThat(metrics.snapshot().changeStreamTimerWakeups()).isEqualTo(1);
        } finally {
            service.stop();
        }
    }

    @Test
    void completedTaskChangeIsIgnored() throws Exception {
        AffinityRecomputeMetricsService metrics = new AffinityRecomputeMetricsService();
        AffinityRecomputeWorkerService worker = mock(AffinityRecomputeWorkerService.class);
        AffinityRecomputeChangeStreamService service = service(worker, metrics, Duration.ZERO);
        try {
            service.handleTaskChange(task(AffinityRecomputeTaskService.STATUS_DONE, Instant.now()));

            Thread.sleep(50L);
            verify(worker, never()).wakeDueTasks("change-stream");
            verify(worker, never()).wakeDueTasks("change-stream-timer");
            assertThat(metrics.snapshot().changeStreamIgnoredEvents()).isEqualTo(1);
        } finally {
            service.stop();
        }
    }

    @Test
    void dueTaskWakeupsAreCoalesced() throws Exception {
        AffinityRecomputeMetricsService metrics = new AffinityRecomputeMetricsService();
        AffinityRecomputeWorkerService worker = mock(AffinityRecomputeWorkerService.class);
        AtomicInteger wakeups = new AtomicInteger();
        CountDownLatch firstWakeup = new CountDownLatch(1);
        doAnswer(invocation -> {
            wakeups.incrementAndGet();
            firstWakeup.countDown();
            return 0;
        }).when(worker).wakeDueTasks("change-stream");

        AffinityRecomputeChangeStreamService service = service(worker, metrics, Duration.ofMillis(75));
        try {
            service.handleTaskChange(task(AffinityRecomputeTaskService.STATUS_PENDING, Instant.now()));
            service.handleTaskChange(task(AffinityRecomputeTaskService.STATUS_PENDING, Instant.now()));

            assertThat(firstWakeup.await(1, TimeUnit.SECONDS)).isTrue();
            Thread.sleep(150L);
            assertThat(wakeups.get()).isEqualTo(1);
            assertThat(metrics.snapshot().changeStreamEvents()).isEqualTo(2);
            assertThat(metrics.snapshot().changeStreamImmediateWakeups()).isEqualTo(1);
        } finally {
            service.stop();
        }
    }

    @Test
    void workWakeupKeepsGroupAndMetricsAcrossExecutorBoundary() throws Exception {
        var metrics = new AffinityRecomputeMetricsService();
        var worker = mock(AffinityRecomputeWorkerService.class);
        var wakeup = new CountDownLatch(1);
        var scope = new java.util.concurrent.atomic.AtomicReference<String>();
        doAnswer(invocation -> { scope.set(JobGroupContext.groupId()); wakeup.countDown(); return 0; })
                .when(worker).wakeDueTasks("change-stream");
        var service = service(worker, metrics, Duration.ZERO);
        try {
            var task = task(AffinityRecomputeTaskService.STATUS_PENDING, Instant.now());
            task.setBaseGroupId("myscoutee-work");
            service.handleTaskChange(task);
            assertThat(wakeup.await(1, TimeUnit.SECONDS)).isTrue();
            assertThat(scope.get()).isEqualTo("myscoutee-work");
            assertThat(metrics.snapshot().changeStreamImmediateWakeups()).isZero();
            assertThat(JobGroupContext.call("myscoutee-work", () -> metrics.snapshot().changeStreamImmediateWakeups())).isEqualTo(1);
            assertThat(JobGroupContext.groupId()).isNull();
        } finally { service.stop(); }
    }

    @Test
    void startupAndReconnectRecoverPersistedWorkWithDatabaseAndGroupScope() throws Exception {
        var mongo = mock(MongoTemplate.class);
        var worker = mock(AffinityRecomputeWorkerService.class);
        var properties = new AffinityRecomputeProperties();
        properties.setChangeStreamWakeupCoalesce(Duration.ZERO);
        var service = new AffinityRecomputeChangeStreamService(mongo, worker, properties, new AffinityRecomputeMetricsService(), null);
        var pending = task(AffinityRecomputeTaskService.STATUS_PENDING, Instant.now().minusSeconds(1));
        pending.setBaseGroupId("reconnect-workspace");
        org.mockito.Mockito.when(mongo.stream(org.mockito.ArgumentMatchers.any(), org.mockito.ArgumentMatchers.eq(AffinityRecomputeTask.class)))
                .thenAnswer(ignored -> java.util.stream.Stream.of(pending));
        var observed = new java.util.concurrent.LinkedBlockingQueue<String>();
        doAnswer(ignored -> { observed.add(com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext.currentMode()
                    + ":" + JobGroupContext.groupId()); return 0; }).when(worker).wakeDueTasks("change-stream");
        var previous = com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext.currentMode();
        try {
            com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext.set(com.raxim.myscoutee.common.config.mongo.MongoSessionMode.DEMO);
            service.restorePendingWakeups();
            assertThat(observed.poll(1, TimeUnit.SECONDS)).isEqualTo("DEMO:reconnect-workspace");
            service.restorePendingWakeups();
            assertThat(observed.poll(1, TimeUnit.SECONDS)).isEqualTo("DEMO:reconnect-workspace");
            verify(mongo, org.mockito.Mockito.times(2)).stream(org.mockito.ArgumentMatchers.any(), org.mockito.ArgumentMatchers.eq(AffinityRecomputeTask.class));
        } finally {
            service.stop();
            com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext.set(previous);
        }
    }

    @Test
    void failedAdmissionRetriesQueuedWorkButAnEmptyQueueDoesNotKeepPolling() throws Exception {
        var mongo = mock(MongoTemplate.class);
        var worker = mock(AffinityRecomputeWorkerService.class);
        var properties = new AffinityRecomputeProperties();
        properties.setChangeStreamWakeupCoalesce(Duration.ZERO);
        properties.setChangeStreamReconnectDelay(Duration.ofMillis(20));
        var service = new AffinityRecomputeChangeStreamService(mongo, worker, properties, new AffinityRecomputeMetricsService(), null);
        var pending = task(AffinityRecomputeTaskService.STATUS_PENDING, Instant.now().minusSeconds(1));
        org.mockito.Mockito.when(mongo.findOne(org.mockito.ArgumentMatchers.any(), org.mockito.ArgumentMatchers.eq(AffinityRecomputeTask.class)))
                .thenReturn(pending, (AffinityRecomputeTask) null);
        var completed = new CountDownLatch(2);
        doAnswer(ignored -> {
            completed.countDown();
            if (completed.getCount() == 1) throw new IllegalStateException("temporary admission failure");
            return 1;
        }).when(worker).wakeDueTasks(org.mockito.ArgumentMatchers.anyString());
        try {
            service.handleTaskChange(pending);
            assertThat(completed.await(1, TimeUnit.SECONDS)).isTrue();
            Thread.sleep(100);
            verify(worker, org.mockito.Mockito.times(2)).wakeDueTasks(org.mockito.ArgumentMatchers.anyString());
            verify(mongo, org.mockito.Mockito.times(2)).findOne(org.mockito.ArgumentMatchers.any(), org.mockito.ArgumentMatchers.eq(AffinityRecomputeTask.class));
        } finally { service.stop(); }
    }

    private AffinityRecomputeChangeStreamService service(
            AffinityRecomputeWorkerService worker,
            AffinityRecomputeMetricsService metrics,
            Duration coalesce) {
        AffinityRecomputeProperties properties = new AffinityRecomputeProperties();
        properties.setChangeStreamWakeupCoalesce(coalesce);
        return new AffinityRecomputeChangeStreamService(
                mock(MongoTemplate.class),
                worker,
                properties,
                metrics, null);
    }

    private AffinityRecomputeTask task(String status, Instant availableAt) {
        AffinityRecomputeTask task = new AffinityRecomputeTask();
        task.setStatus(status);
        task.setAvailableAtIso(availableAt.toString());
        return task;
    }
}
