package com.raxim.myscoutee.profile.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.ScheduledMessageTask;

public interface ScheduledMessageTasksRepository extends MongoRepository<ScheduledMessageTask, String> {
    Optional<ScheduledMessageTask> findByTaskKey(String taskKey);
}
