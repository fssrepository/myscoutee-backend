package com.raxim.myscoutee.domain.affinity.service;


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

import com.raxim.myscoutee.domain.affinity.config.AffinityRecomputeProperties;
import com.raxim.myscoutee.domain.affinity.document.AffinityRecomputeTask;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.affinity.repository.AffinityRecomputeTasksRepository;
import com.raxim.myscoutee.domain.notifications.service.NotificationRuleRegistryService;

import static org.mockito.Mockito.mock;

@org.junit.jupiter.api.Tag("standard")
class AffinityRecomputeTaskServiceTest {
    @Test
    void initializesIndexesInBothDatabasesAndRestoresCallerMode() {
        MongoTemplate mongo = mock(MongoTemplate.class);
        var indexes = mock(org.springframework.data.mongodb.core.index.IndexOperations.class);
        var seen = new java.util.EnumMap<com.raxim.myscoutee.common.config.mongo.MongoSessionMode, java.util.Set<String>>(
                com.raxim.myscoutee.common.config.mongo.MongoSessionMode.class);
        when(mongo.indexOps(AffinityRecomputeTask.class)).thenReturn(indexes);
        when(indexes.createIndex(any())).thenAnswer(call -> {
            var definition = (org.springframework.data.mongodb.core.index.IndexDefinition) call.getArgument(0);
            String name = definition.getIndexOptions().getString("name");
            seen.computeIfAbsent(com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext.currentMode(),
                    ignored -> new java.util.HashSet<>()).add(name);
            return name;
        });
        var service = new AffinityRecomputeTaskService(mock(AffinityRecomputeTasksRepository.class),
                new AffinityRecomputeProperties(), mongo);
        org.springframework.test.util.ReflectionTestUtils.setField(service, "databases",
                new com.raxim.myscoutee.common.config.mongo.ScheduledMongoSessionRunner("real", "demo"));
        var previous = com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext.currentMode();
        service.ensureIndexes();
        assertThat(com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext.currentMode()).isEqualTo(previous);
        assertThat(seen).hasSize(2);
        for (var names : seen.values()) {
            assertThat(names).containsExactlyInAnyOrder("affinity_recompute_task_key",
                    "affinity_recompute_task_status_available", "affinity_recompute_task_target_status",
                    "affinity_recompute_group_status_available");
        }
    }

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
        org.springframework.test.util.ReflectionTestUtils.setField(service, "accountProjections", new com.raxim.myscoutee.domain.accounts.service.AccountAffinityProjectionService(
            (MongoTemplate) org.springframework.test.util.ReflectionTestUtils.getField(service, "mongoTemplate"), org.mockito.Mockito.mock(com.raxim.myscoutee.domain.accounts.repository.UsersRepository.class)));
        org.springframework.test.util.ReflectionTestUtils.setField(service, "jobGroupScope",
            com.raxim.myscoutee.domain.groups.service.GroupTestSupport.jobScope(mock(org.springframework.data.mongodb.core.MongoTemplate.class)));

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
        ObjectProvider<com.raxim.myscoutee.domain.notifications.api.NotificationJobs> provider = mock(ObjectProvider.class);
        when(provider.getIfAvailable()).thenReturn(registry);
        AffinityRecomputeTaskService service = new AffinityRecomputeTaskService(
                repository,
                properties,
                mock(MongoTemplate.class));
        org.springframework.test.util.ReflectionTestUtils.setField(service, "accountProjections", new com.raxim.myscoutee.domain.accounts.service.AccountAffinityProjectionService(
            (MongoTemplate) org.springframework.test.util.ReflectionTestUtils.getField(service, "mongoTemplate"), org.mockito.Mockito.mock(com.raxim.myscoutee.domain.accounts.repository.UsersRepository.class)));
        org.springframework.test.util.ReflectionTestUtils.setField(service, "jobGroupScope",
            com.raxim.myscoutee.domain.groups.service.GroupTestSupport.jobScope(mock(org.springframework.data.mongodb.core.MongoTemplate.class)));
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
        ObjectProvider<com.raxim.myscoutee.domain.notifications.api.NotificationJobs> provider = mock(ObjectProvider.class);
        when(provider.getIfAvailable()).thenReturn(registry);
        MongoTemplate mongoTemplate = mock(MongoTemplate.class);
        when(mongoTemplate.exists(any(Query.class), eq(Users.class))).thenReturn(true);
        AffinityRecomputeTaskService service = new AffinityRecomputeTaskService(
                repository,
                properties,
                mongoTemplate);
        org.springframework.test.util.ReflectionTestUtils.setField(service, "accountProjections", new com.raxim.myscoutee.domain.accounts.service.AccountAffinityProjectionService(
            (MongoTemplate) org.springframework.test.util.ReflectionTestUtils.getField(service, "mongoTemplate"), org.mockito.Mockito.mock(com.raxim.myscoutee.domain.accounts.repository.UsersRepository.class)));
        org.springframework.test.util.ReflectionTestUtils.setField(service, "jobGroupScope",
            com.raxim.myscoutee.domain.groups.service.GroupTestSupport.jobScope(mock(org.springframework.data.mongodb.core.MongoTemplate.class)));
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
        ObjectProvider<com.raxim.myscoutee.domain.notifications.api.NotificationJobs> provider = mock(ObjectProvider.class);
        when(provider.getIfAvailable()).thenReturn(registry);
        MongoTemplate mongoTemplate = mock(MongoTemplate.class);
        when(mongoTemplate.exists(any(Query.class), eq(Users.class))).thenReturn(false);
        AffinityRecomputeTaskService service = new AffinityRecomputeTaskService(
                repository,
                properties,
                mongoTemplate);
        org.springframework.test.util.ReflectionTestUtils.setField(service, "accountProjections", new com.raxim.myscoutee.domain.accounts.service.AccountAffinityProjectionService(
            (MongoTemplate) org.springframework.test.util.ReflectionTestUtils.getField(service, "mongoTemplate"), org.mockito.Mockito.mock(com.raxim.myscoutee.domain.accounts.repository.UsersRepository.class)));
        org.springframework.test.util.ReflectionTestUtils.setField(service, "jobGroupScope",
            com.raxim.myscoutee.domain.groups.service.GroupTestSupport.jobScope(mock(org.springframework.data.mongodb.core.MongoTemplate.class)));
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
