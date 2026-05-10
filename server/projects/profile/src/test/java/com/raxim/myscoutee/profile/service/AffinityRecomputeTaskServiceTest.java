package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.time.Duration;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicReference;

import org.junit.jupiter.api.Test;
import org.springframework.data.mongodb.core.MongoTemplate;

import com.raxim.myscoutee.common.config.properties.AffinityRecomputeProperties;
import com.raxim.myscoutee.profile.data.document.AffinityRecomputeTask;
import com.raxim.myscoutee.profile.repository.AffinityRecomputeTasksRepository;

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
}
