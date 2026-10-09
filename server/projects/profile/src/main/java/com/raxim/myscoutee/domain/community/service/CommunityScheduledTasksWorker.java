package com.raxim.myscoutee.domain.community.service;

import java.time.Instant;
import org.springframework.stereotype.Service;
import com.raxim.myscoutee.common.config.mongo.ScheduledMongoSessionRunner;
import com.raxim.myscoutee.domain.notifications.api.NotificationJobs;

@Service
public class CommunityScheduledTasksWorker {
    private final CommunityScheduledTasksService tasks;
    private final ScheduledMongoSessionRunner databases;
    private final NotificationJobs rules;
    public CommunityScheduledTasksWorker(CommunityScheduledTasksService tasks, ScheduledMongoSessionRunner databases, NotificationJobs rules) {
        this.tasks = tasks; this.databases = databases; this.rules = rules;
    }
    public void tick() {
        databases.runAcrossConfiguredDatabases(this::runInCurrentDatabase);
    }
    @org.springframework.beans.factory.annotation.Autowired
    void watchTasks(com.raxim.myscoutee.common.config.mongo.MongoChangeStreamService changes) {
        changes.watch("community-scheduled-cases", java.util.Set.of("communityScheduledTasks"),
                java.util.Set.of("baseGroupId", "enabled", "deleted", "nextDueAtIso"), () -> {
                    if (tasks.nextScheduledWakeup() == null) return null;
                    runInCurrentDatabase();
                    return tasks.nextScheduledWakeup();
                });
    }
    private void runInCurrentDatabase() {
        rules.forEachGroup(CommunityScheduledTasksService.RULE, () -> {
            var now = Instant.now(); String rule = CommunityScheduledTasksService.RULE;
            if (!rules.shouldRunScheduledRule(rule, now) || rules.beginScheduledRun(rule, "Creating scheduled cases.", rule, now) == null) return;
            try { rules.recordRun(rule, tasks.createDue(now), "completed", "Scheduled cases processed.", rule, now); }
            catch (RuntimeException failure) { rules.recordRun(rule, 0, "failed", failure.getMessage(), rule, now); throw failure; }
        });
    }
}
