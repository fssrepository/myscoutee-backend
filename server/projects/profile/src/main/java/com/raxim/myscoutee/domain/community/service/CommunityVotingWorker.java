package com.raxim.myscoutee.domain.community.service;

import java.time.Instant;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import com.raxim.myscoutee.common.config.mongo.ScheduledMongoSessionRunner;
import com.raxim.myscoutee.domain.notifications.service.NotificationRuleRegistryService;

@Service
public class CommunityVotingWorker {
    private final CommunityAnnouncementsService announcements;
    private final ScheduledMongoSessionRunner databases;
    private final NotificationRuleRegistryService rules;
    public CommunityVotingWorker(CommunityAnnouncementsService announcements, ScheduledMongoSessionRunner databases, NotificationRuleRegistryService rules) {
        this.announcements = announcements; this.databases = databases; this.rules = rules;
    }
    @Scheduled(fixedDelayString="${community.voting.check-delay-ms:60000}")
    public void tick() {
        databases.runAcrossConfiguredDatabases(() -> rules.forEachGroup(CommunityAnnouncementsService.CLOSE_RULE, () -> {
            var now = Instant.now(); String rule = CommunityAnnouncementsService.CLOSE_RULE;
            if (!rules.shouldRunScheduledRule(rule, now) || rules.beginScheduledRun(rule, "Closing community votes.", rule, now) == null) return;
            try { rules.recordRun(rule, announcements.closeDue(now), "completed", "Community votes processed.", rule, now); }
            catch (RuntimeException failure) { rules.recordRun(rule, 0, "failed", failure.getMessage(), rule, now); throw failure; }
        }));
    }
}
