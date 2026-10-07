package com.raxim.myscoutee.domain.email.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.domain.email.document.ScheduledMessageTask;

public interface ScheduledMessageTasksRepository extends MongoRepository<ScheduledMessageTask, String> {
    Optional<ScheduledMessageTask> findByTaskKey(String taskKey);

    List<ScheduledMessageTask> findTop12ByLastRunAtIsoNotNullOrderByLastRunAtIsoDesc();
    List<ScheduledMessageTask> findTop12ByBaseGroupIdAndLastRunAtIsoNotNullOrderByLastRunAtIsoDesc(String baseGroupId);

    List<ScheduledMessageTask> findByEventIdAndActionKey(String eventId, String actionKey);
}
