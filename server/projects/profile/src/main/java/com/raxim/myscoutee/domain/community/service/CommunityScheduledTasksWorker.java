package com.raxim.myscoutee.domain.community.service;

import java.time.Instant;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import com.raxim.myscoutee.common.config.mongo.ScheduledMongoSessionRunner;
import com.raxim.myscoutee.domain.notifications.service.NotificationRuleRegistryService;

@Service
public class CommunityScheduledTasksWorker {
    private final CommunityScheduledTasksService tasks;
    private final ScheduledMongoSessionRunner databases;
    private final NotificationRuleRegistryService rules;
    public CommunityScheduledTasksWorker(CommunityScheduledTasksService tasks, ScheduledMongoSessionRunner databases, NotificationRuleRegistryService rules) {
        this.tasks = tasks; this.databases = databases; this.rules = rules;
    }
    @Scheduled(fixedDelayString="${community.tasks.check-delay-ms:60000}")
    public void tick() {
        databases.runAcrossConfiguredDatabases(() -> rules.forEachGroup(CommunityScheduledTasksService.RULE, () -> {
            var now = Instant.now(); String rule = CommunityScheduledTasksService.RULE;
            if (!rules.shouldRunScheduledRule(rule, now) || rules.beginScheduledRun(rule, "Creating scheduled cases.", rule, now) == null) return;
            try { rules.recordRun(rule, tasks.createDue(now), "completed", "Scheduled cases processed.", rule, now); }
            catch (RuntimeException failure) { rules.recordRun(rule, 0, "failed", failure.getMessage(), rule, now); throw failure; }
        }));
    }
}
