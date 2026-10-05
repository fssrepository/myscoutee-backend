package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.data.mongodb.core.MongoTemplate;

import com.raxim.myscoutee.common.config.properties.AffinityRecomputeProperties;
import com.raxim.myscoutee.profile.data.document.AffinityRecomputeTask;

import static org.mockito.Mockito.mock;

class AffinityRecomputeWorkerServiceTest {
    @Test
    void scheduledTickWithoutASeededRegistryDoesNotRunAnImplicitJob() {
        AffinityRecomputeTaskService taskService = mock(AffinityRecomputeTaskService.class);
        AffinityMaintenanceService affinityMaintenanceService = mock(AffinityMaintenanceService.class);
        ModelStatusPropagationService modelStatusPropagationService = mock(ModelStatusPropagationService.class);
        MongoTemplate mongoTemplate = mock(MongoTemplate.class);
        AffinityRecomputeProperties properties = new AffinityRecomputeProperties();
        properties.setDueTaskLimit(10);

        AffinityRecomputeWorkerService worker = new AffinityRecomputeWorkerService(
                taskService,
                affinityMaintenanceService,
                modelStatusPropagationService,
                properties,
                mongoTemplate,
                new AffinityRecomputeMetricsService());

        worker.runDueTasks();
        worker.runDueTasks();

        verify(taskService, org.mockito.Mockito.never()).findPendingDueTasks(any(), org.mockito.ArgumentMatchers.anyInt());
        org.mockito.Mockito.verifyNoInteractions(affinityMaintenanceService);
    }

    @Test
    void userTargetRefreshesUserThenEmitsCollapsedEventAndAssetTasks() {
        AffinityRecomputeTaskService taskService = mock(AffinityRecomputeTaskService.class);
        AffinityMaintenanceService affinityMaintenanceService = mock(AffinityMaintenanceService.class);
        ModelStatusPropagationService modelStatusPropagationService = mock(ModelStatusPropagationService.class);
        MongoTemplate mongoTemplate = mock(MongoTemplate.class);
        AffinityRecomputeProperties properties = new AffinityRecomputeProperties();
        properties.setDueTaskLimit(10);
        properties.setLeaseDuration(Duration.ofMinutes(1));

        Instant now = Instant.parse("2026-05-09T10:00:00Z");
        AffinityRecomputeTask task = task("task-id", "USER:u1", "USER", "u1", now);
        when(taskService.findPendingDueTasks(now, 10)).thenReturn(List.of(task));
        when(mongoTemplate.findAndModify(any(), any(), any(), eq(AffinityRecomputeTask.class))).thenReturn(task);
        when(modelStatusPropagationService.applyForUser("u1"))
                .thenReturn(ModelStatusPropagationService.ModelStatusPropagationOutcome.empty());
        when(affinityMaintenanceService.resolveUserAffinityDependents("u1"))
                .thenReturn(new AffinityMaintenanceService.UserAffinityDependents(List.of("event-1"), List.of("asset-1")));
        when(taskService.debounceForTarget(AffinityRecomputeTaskService.TARGET_EVENT)).thenReturn(Duration.ofMinutes(3));
        when(taskService.debounceForTarget(AffinityRecomputeTaskService.TARGET_ASSET)).thenReturn(Duration.ofMinutes(3));
        when(taskService.findByTaskKey("USER:u1")).thenReturn(Optional.of(task));
        when(taskService.save(any(AffinityRecomputeTask.class))).thenAnswer(invocation -> invocation.getArgument(0));

        AffinityRecomputeWorkerService worker = new AffinityRecomputeWorkerService(
                taskService,
                affinityMaintenanceService,
                modelStatusPropagationService,
                properties,
                mongoTemplate,
                new AffinityRecomputeMetricsService());

        int processed = worker.processDueTasks(now);

        assertThat(processed).isEqualTo(1);
        verify(affinityMaintenanceService).refreshUserAffinityAndRates("u1");
        verify(taskService).enqueue(
                AffinityRecomputeTaskService.TARGET_EVENT,
                "event-1",
                AffinityRecomputeTaskService.REASON_USER_CHANGED,
                Duration.ofMinutes(3),
                "u1");
        verify(taskService).enqueue(
                AffinityRecomputeTaskService.TARGET_ASSET,
                "asset-1",
                AffinityRecomputeTaskService.REASON_USER_CHANGED,
                Duration.ofMinutes(3),
                "u1");
        assertThat(task.getStatus()).isEqualTo(AffinityRecomputeTaskService.STATUS_DONE);
    }

    @Test
    void eventTargetsAreRecomputedAsOneBatch() {
        AffinityRecomputeTaskService taskService = mock(AffinityRecomputeTaskService.class);
        AffinityMaintenanceService affinityMaintenanceService = mock(AffinityMaintenanceService.class);
        ModelStatusPropagationService modelStatusPropagationService = mock(ModelStatusPropagationService.class);
        MongoTemplate mongoTemplate = mock(MongoTemplate.class);
        AffinityRecomputeProperties properties = new AffinityRecomputeProperties();
        properties.setDueTaskLimit(10);
        properties.setLeaseDuration(Duration.ofMinutes(1));

        Instant now = Instant.parse("2026-05-09T10:00:00Z");
        AffinityRecomputeTask first = task("task-event-1", "EVENT:event-1", "EVENT", "event-1", now);
        AffinityRecomputeTask second = task("task-event-2", "EVENT:event-2", "EVENT", "event-2", now);
        when(taskService.findPendingDueTasks(now, 10)).thenReturn(List.of(first, second));
        when(mongoTemplate.findAndModify(any(), any(), any(), eq(AffinityRecomputeTask.class)))
                .thenReturn(first)
                .thenReturn(second);
        when(affinityMaintenanceService.refreshEventAffinitiesForSourceIds(List.of("event-1", "event-2")))
                .thenReturn(AffinityMaintenanceService.RecomputeOutcome.empty());
        when(taskService.findByTaskKey("EVENT:event-1")).thenReturn(Optional.of(first));
        when(taskService.findByTaskKey("EVENT:event-2")).thenReturn(Optional.of(second));
        when(taskService.save(any(AffinityRecomputeTask.class))).thenAnswer(invocation -> invocation.getArgument(0));

        AffinityRecomputeWorkerService worker = new AffinityRecomputeWorkerService(
                taskService,
                affinityMaintenanceService,
                modelStatusPropagationService,
                properties,
                mongoTemplate,
                new AffinityRecomputeMetricsService());

        int processed = worker.processDueTasks(now);

        assertThat(processed).isEqualTo(2);
        verify(affinityMaintenanceService).refreshEventAffinitiesForSourceIds(List.of("event-1", "event-2"));
        assertThat(first.getStatus()).isEqualTo(AffinityRecomputeTaskService.STATUS_DONE);
        assertThat(second.getStatus()).isEqualTo(AffinityRecomputeTaskService.STATUS_DONE);
    }

    @Test
    void conflictedEventTargetsAreRequeuedAfterBatch() {
        AffinityRecomputeTaskService taskService = mock(AffinityRecomputeTaskService.class);
        AffinityMaintenanceService affinityMaintenanceService = mock(AffinityMaintenanceService.class);
        ModelStatusPropagationService modelStatusPropagationService = mock(ModelStatusPropagationService.class);
        MongoTemplate mongoTemplate = mock(MongoTemplate.class);
        AffinityRecomputeProperties properties = new AffinityRecomputeProperties();
        properties.setDueTaskLimit(10);
        properties.setLeaseDuration(Duration.ofMinutes(1));

        Instant now = Instant.parse("2026-05-09T10:00:00Z");
        AffinityRecomputeTask task = task("task-event-1", "EVENT:event-1", "EVENT", "event-1", now);
        when(taskService.findPendingDueTasks(now, 10)).thenReturn(List.of(task));
        when(mongoTemplate.findAndModify(any(), any(), any(), eq(AffinityRecomputeTask.class))).thenReturn(task);
        when(affinityMaintenanceService.refreshEventAffinitiesForSourceIds(List.of("event-1")))
                .thenReturn(new AffinityMaintenanceService.RecomputeOutcome(List.of(), List.of("event-1")));
        when(taskService.debounceForTarget(AffinityRecomputeTaskService.TARGET_EVENT)).thenReturn(Duration.ofMinutes(3));
        when(taskService.findByTaskKey("EVENT:event-1")).thenReturn(Optional.of(task));
        when(taskService.save(any(AffinityRecomputeTask.class))).thenAnswer(invocation -> invocation.getArgument(0));

        AffinityRecomputeWorkerService worker = new AffinityRecomputeWorkerService(
                taskService,
                affinityMaintenanceService,
                modelStatusPropagationService,
                properties,
                mongoTemplate,
                new AffinityRecomputeMetricsService());

        int processed = worker.processDueTasks(now);

        assertThat(processed).isEqualTo(1);
        verify(taskService).enqueue(
                eq(AffinityRecomputeTaskService.TARGET_EVENT),
                eq("event-1"),
                eq(AffinityRecomputeTaskService.REASON_EVENT_CHANGED),
                eq(Duration.ofMinutes(3)),
                any(String.class));
        assertThat(task.getStatus()).isEqualTo(AffinityRecomputeTaskService.STATUS_DONE);
    }

    private AffinityRecomputeTask task(String id, String taskKey, String targetType, String targetId, Instant now) {
        AffinityRecomputeTask task = new AffinityRecomputeTask();
        task.setId(id);
        task.setTaskKey(taskKey);
        task.setTargetType(targetType);
        task.setTargetId(targetId);
        task.setStatus(AffinityRecomputeTaskService.STATUS_PENDING);
        task.setAvailableAtIso(now.toString());
        task.setReasons(List.of(AffinityRecomputeTaskService.REASON_USER_CHANGED));
        task.setAttemptCount(0);
        return task;
    }
}
