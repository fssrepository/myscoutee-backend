package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Duration;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicReference;

import org.junit.jupiter.api.Test;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.beans.factory.ObjectProvider;

import com.raxim.myscoutee.common.config.properties.AffinityRecomputeProperties;
import com.raxim.myscoutee.profile.data.document.AffinityRecomputeTask;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.repository.AffinityRecomputeTasksRepository;
import com.raxim.myscoutee.profile.service.notifications.NotificationRuleRegistryService;

import static org.mockito.Mockito.mock;

class AffinityRecomputeTaskServiceTest {
    @Test
    void enqueueCollapsesDifferentReasonsForSameTargetTask() {
        AffinityRecomputeTasksRepository repository = mock(AffinityRecomputeTasksRepository.class);
        AffinityRecomputeProperties properties = new AffinityRecomputeProperties();
        properties.setEventChangedDebounce(Duration.ofMinutes(5));
        properties.setEventMembersChangedDebounce(Duration.ofMinutes(5));

        AtomicReference<AffinityRecomputeTask> stored = new AtomicReference<>();
        when(repository.findByTaskKey("EVENT:event-1")).thenAnswer(ignored -> Optional.ofNullable(stored.get()));
        when(repository.save(any(AffinityRecomputeTask.class))).thenAnswer(invocation -> {
            AffinityRecomputeTask task = invocation.getArgument(0);
            stored.set(task);
            return task;
        });

        AffinityRecomputeTaskService service = new AffinityRecomputeTaskService(
                repository,
                properties,
                mock(MongoTemplate.class));

        service.enqueueEventChanged("event-1", "u1");
        AffinityRecomputeTask merged = service.enqueueEventMembersChanged("event-1", "u2");

        assertThat(merged.getTaskKey()).isEqualTo("EVENT:event-1");
        assertThat(merged.getTargetType()).isEqualTo(AffinityRecomputeTaskService.TARGET_EVENT);
        assertThat(merged.getTargetId()).isEqualTo("event-1");
        assertThat(merged.getStatus()).isEqualTo(AffinityRecomputeTaskService.STATUS_PENDING);
        assertThat(merged.getReasons()).containsExactly(
                AffinityRecomputeTaskService.REASON_EVENT_CHANGED,
                AffinityRecomputeTaskService.REASON_EVENT_MEMBERS_CHANGED);
    }

    @Test
    void repeatedEventChangeMergesWorkerSignalWithoutIncrementingAffectedJobsAgain() {
        AffinityRecomputeTasksRepository repository = mock(AffinityRecomputeTasksRepository.class);
        AffinityRecomputeProperties properties = new AffinityRecomputeProperties();
        AtomicReference<AffinityRecomputeTask> stored = new AtomicReference<>();
        when(repository.findByTaskKey("EVENT:event-1"))
                .thenAnswer(ignored -> Optional.ofNullable(stored.get()));
        when(repository.save(any(AffinityRecomputeTask.class))).thenAnswer(invocation -> {
            AffinityRecomputeTask task = invocation.getArgument(0);
            stored.set(task);
            return task;
        });
        NotificationRuleRegistryService registry = mock(NotificationRuleRegistryService.class);
        @SuppressWarnings("unchecked")
        ObjectProvider<NotificationRuleRegistryService> provider = mock(ObjectProvider.class);
        when(provider.getIfAvailable()).thenReturn(registry);
        AffinityRecomputeTaskService service = new AffinityRecomputeTaskService(
                repository,
                properties,
                mock(MongoTemplate.class));
        service.setNotificationRuleRegistryServiceProvider(provider);

        service.enqueueEventChanged("event-1", "u1");
        AffinityRecomputeTask merged = service.enqueueEventMembersChanged("event-1", "u2");

        assertThat(merged.getReasons()).containsExactly(
                AffinityRecomputeTaskService.REASON_EVENT_CHANGED,
                AffinityRecomputeTaskService.REASON_EVENT_MEMBERS_CHANGED);
        verify(repository, times(2)).save(any(AffinityRecomputeTask.class));
        verify(registry).adjustPendingCount(
                NotificationRuleRegistryService.RULE_AFFINITY_RECOMPUTE,
                1,
                "admin.jobs.rule.affinity.recompute");
        verify(registry).adjustPendingCount(
                NotificationRuleRegistryService.RULE_EVENT_AUTO_INVITER,
                1,
                "admin.jobs.table.affected");
        verify(registry).adjustPendingCount(
                NotificationRuleRegistryService.RULE_EVENT_TOURNAMENT_REVIEW,
                1,
                "admin.jobs.table.affected");
        verify(registry).adjustPendingCount(
                NotificationRuleRegistryService.RULE_EVENT_COUNTER_EXPIRY,
                1,
                "admin.jobs.table.affected");
    }

    @Test
    void repeatedUserChangeCountsOneAffectedUserWithoutDroppingTheWorkerUpdate() {
        AffinityRecomputeTasksRepository repository = mock(AffinityRecomputeTasksRepository.class);
        AffinityRecomputeProperties properties = new AffinityRecomputeProperties();
        AtomicReference<AffinityRecomputeTask> stored = new AtomicReference<>();
        when(repository.findByTaskKey("USER:user-1"))
                .thenAnswer(ignored -> Optional.ofNullable(stored.get()));
        when(repository.save(any(AffinityRecomputeTask.class))).thenAnswer(invocation -> {
            AffinityRecomputeTask task = invocation.getArgument(0);
            stored.set(task);
            return task;
        });
        NotificationRuleRegistryService registry = mock(NotificationRuleRegistryService.class);
        @SuppressWarnings("unchecked")
        ObjectProvider<NotificationRuleRegistryService> provider = mock(ObjectProvider.class);
        when(provider.getIfAvailable()).thenReturn(registry);
        MongoTemplate mongoTemplate = mock(MongoTemplate.class);
        when(mongoTemplate.exists(any(Query.class), eq(Users.class))).thenReturn(true);
        AffinityRecomputeTaskService service = new AffinityRecomputeTaskService(
                repository,
                properties,
                mongoTemplate);
        service.setNotificationRuleRegistryServiceProvider(provider);

        service.enqueueUserChanged("user-1");
        AffinityRecomputeTask merged = service.enqueueUserChanged("user-1");

        assertThat(merged.getReasons()).containsExactly(AffinityRecomputeTaskService.REASON_USER_CHANGED);
        verify(repository, times(2)).save(any(AffinityRecomputeTask.class));
        verify(registry).adjustPendingCount(
                NotificationRuleRegistryService.RULE_AFFINITY_RECOMPUTE,
                1,
                "admin.jobs.rule.affinity.recompute");
        verify(registry).adjustPendingCount(
                NotificationRuleRegistryService.RULE_EVENT_RANDOM_GROUPS,
                1,
                NotificationRuleRegistryService.PENDING_COUNT_UNIT_USERS);
    }

    @Test
    void nonPublicUserDirtySignalDoesNotIncrementRandomRoomPendingUsers() {
        AffinityRecomputeTasksRepository repository = mock(AffinityRecomputeTasksRepository.class);
        AffinityRecomputeProperties properties = new AffinityRecomputeProperties();
        when(repository.findByTaskKey("USER:user-1")).thenReturn(Optional.empty());
        when(repository.save(any(AffinityRecomputeTask.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        NotificationRuleRegistryService registry = mock(NotificationRuleRegistryService.class);
        @SuppressWarnings("unchecked")
        ObjectProvider<NotificationRuleRegistryService> provider = mock(ObjectProvider.class);
        when(provider.getIfAvailable()).thenReturn(registry);
        MongoTemplate mongoTemplate = mock(MongoTemplate.class);
        when(mongoTemplate.exists(any(Query.class), eq(Users.class))).thenReturn(false);
        AffinityRecomputeTaskService service = new AffinityRecomputeTaskService(
                repository,
                properties,
                mongoTemplate);
        service.setNotificationRuleRegistryServiceProvider(provider);

        service.enqueueUserChanged("user-1");

        verify(registry).adjustPendingCount(
                NotificationRuleRegistryService.RULE_AFFINITY_RECOMPUTE,
                1,
                "admin.jobs.rule.affinity.recompute");
        verify(registry, never()).adjustPendingCount(
                eq(NotificationRuleRegistryService.RULE_EVENT_RANDOM_GROUPS),
                anyInt(),
                eq(NotificationRuleRegistryService.PENDING_COUNT_UNIT_USERS));
    }
}
