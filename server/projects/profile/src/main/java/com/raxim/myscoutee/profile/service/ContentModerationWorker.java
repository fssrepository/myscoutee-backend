package com.raxim.myscoutee.profile.service;

import java.time.Instant;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import com.raxim.myscoutee.common.config.mongo.ScheduledMongoSessionRunner;
import com.raxim.myscoutee.profile.service.notifications.NotificationRuleRegistryService;

@Service
public class ContentModerationWorker {
    public static final String RULE = "content-auto-approve";
    private final ContentModerationService moderation;
    private final NotificationRuleRegistryService rules;
    private final ScheduledMongoSessionRunner databases;
    public ContentModerationWorker(ContentModerationService moderation, NotificationRuleRegistryService rules, ScheduledMongoSessionRunner databases) {
        this.moderation = moderation; this.rules = rules; this.databases = databases;
    }
    @Scheduled(fixedDelayString="${moderation.worker-check-delay-ms:60000}")
    public void tick() { databases.runAcrossConfiguredDatabases(this::run); }
    private void run() {
        // Finish committed decisions even when automatic approval has been suspended.
        moderation.drainPending();
        var now = Instant.now();
        if (!rules.shouldRunScheduledRule(RULE, now) || rules.beginScheduledRun(RULE, "Content approval started.", RULE, now) == null) return;
        try { rules.recordRun(RULE, moderation.approveDue(), "completed", "Content approval completed.", RULE, now); }
        catch (RuntimeException error) { rules.recordRun(RULE, 0, "failed", error.getMessage(), RULE, now); throw error; }
    }
}
