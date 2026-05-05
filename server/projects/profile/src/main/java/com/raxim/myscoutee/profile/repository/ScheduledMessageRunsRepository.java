package com.raxim.myscoutee.profile.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.ScheduledMessageRun;

public interface ScheduledMessageRunsRepository extends MongoRepository<ScheduledMessageRun, String> {
    Optional<ScheduledMessageRun> findByRunId(String runId);

    List<ScheduledMessageRun> findByRuleKeyOrderByStartedAtIsoDesc(String ruleKey);
}
