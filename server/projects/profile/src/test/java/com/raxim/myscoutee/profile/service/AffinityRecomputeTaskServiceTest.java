package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Duration;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicReference;

import org.junit.jupiter.api.Test;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.beans.factory.ObjectProvider;

import com.raxim.myscoutee.common.config.properties.AffinityRecomputeProperties;
import com.raxim.myscoutee.profile.data.document.AffinityRecomputeTask;
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
    void repeatedEventChangeSignalsAffectedJobsEvenWhileAffinityTaskIsAlreadyPending() {
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
        service.enqueueEventMembersChanged("event-1", "u2");

        verify(registry).adjustPendingCount(
                NotificationRuleRegistryService.RULE_AFFINITY_RECOMPUTE,
                1,
                "admin.jobs.rule.affinity.recompute");
        verify(registry, times(2)).adjustPendingCount(
                NotificationRuleRegistryService.RULE_EVENT_RANDOM_GROUPS,
                1,
                "admin.jobs.table.affected");
        verify(registry, times(2)).adjustPendingCount(
                NotificationRuleRegistryService.RULE_EVENT_AUTO_INVITER,
                1,
                "admin.jobs.table.affected");
        verify(registry, times(2)).adjustPendingCount(
                NotificationRuleRegistryService.RULE_EVENT_TOURNAMENT_REVIEW,
                1,
                "admin.jobs.table.affected");
        verify(registry, times(2)).adjustPendingCount(
                NotificationRuleRegistryService.RULE_EVENT_COUNTER_EXPIRY,
                1,
                "admin.jobs.table.affected");
    }
}
