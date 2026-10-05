package com.raxim.myscoutee.profile.service;

import java.time.Instant;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.common.config.mongo.ScheduledMongoSessionRunner;
import com.raxim.myscoutee.profile.data.document.NotificationRuleConfig;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminAffinityGraphMetaDto;
import com.raxim.myscoutee.profile.service.notifications.NotificationRuleRegistryService;

@Service
public class AdminAffinityGraphLayoutWorkerService {
    private static final Logger LOGGER = LoggerFactory.getLogger(AdminAffinityGraphLayoutWorkerService.class);
    private static final String WORKER_ID = "affinity-graph-layout";

    private final AdminAffinityGraphService adminAffinityGraphService;
    private final NotificationRuleRegistryService notificationRuleRegistryService;
    private ScheduledMongoSessionRunner scheduledMongoSessionRunner;

    public AdminAffinityGraphLayoutWorkerService(
            AdminAffinityGraphService adminAffinityGraphService,
            NotificationRuleRegistryService notificationRuleRegistryService) {
        this.adminAffinityGraphService = adminAffinityGraphService;
        this.notificationRuleRegistryService = notificationRuleRegistryService;
    }

    @org.springframework.beans.factory.annotation.Autowired(required = false)
    void setScheduledMongoSessionRunner(ScheduledMongoSessionRunner scheduledMongoSessionRunner) {
        this.scheduledMongoSessionRunner = scheduledMongoSessionRunner;
    }

    @Scheduled(fixedDelayString = "${admin.affinity-graph.layout-worker-check-delay-ms:5000}")
    public void rebuildDueLayout() {
        if (scheduledMongoSessionRunner == null) {
            rebuildDueLayoutForCurrentDatabase();
            return;
        }
        scheduledMongoSessionRunner.runAcrossConfiguredDatabases(this::rebuildDueLayoutForCurrentDatabase);
    }

    private void rebuildDueLayoutForCurrentDatabase() {
        var registry = notificationRuleRegistryService;
        if (registry != null) registry.forEachGroup(NotificationRuleRegistryService.RULE_AFFINITY_GRAPH_LAYOUT, this::rebuildDueLayoutForCurrentDatabaseInGroup);
    }

    private void rebuildDueLayoutForCurrentDatabaseInGroup() {
        Optional<NotificationRuleConfig> configuredRule = notificationRuleRegistryService.findRule(
                NotificationRuleRegistryService.RULE_AFFINITY_GRAPH_LAYOUT);
        if (configuredRule.isEmpty()) {
            return;
        }

        Instant startedAt = Instant.now();
        if (!notificationRuleRegistryService.shouldRunScheduledRule(
                NotificationRuleRegistryService.RULE_AFFINITY_GRAPH_LAYOUT,
                startedAt)) {
            return;
        }
        if (notificationRuleRegistryService.beginScheduledRun(
                    NotificationRuleRegistryService.RULE_AFFINITY_GRAPH_LAYOUT,
                    "Scheduled affinity graph layout rebuild started.",
                    WORKER_ID,
                    startedAt) == null) {
            return;
        }

        try {
            AdminAffinityGraphMetaDto result = adminAffinityGraphService.rebuildMaterializedLayout();
            int linkCount = count(result == null ? null : result.linkCount());
            int memberCount = count(result == null ? null : result.memberCount());
            notificationRuleRegistryService.recordRun(
                    NotificationRuleRegistryService.RULE_AFFINITY_GRAPH_LAYOUT,
                    linkCount,
                    "completed",
                    "Materialized affinity graph layout with " + memberCount + " members and " + linkCount + " links.",
                    WORKER_ID,
                    startedAt);
        } catch (RuntimeException exception) {
            notificationRuleRegistryService.recordRun(
                    NotificationRuleRegistryService.RULE_AFFINITY_GRAPH_LAYOUT,
                    0,
                    "failed",
                    failureDetail(exception),
                    WORKER_ID,
                    startedAt);
            LOGGER.warn("Scheduled affinity graph layout rebuild failed.", exception);
        }
    }

    private String failureDetail(RuntimeException exception) {
        if (exception == null) {
            return "Affinity graph layout rebuild failed.";
        }
        String message = exception.getMessage();
        return StringUtils.hasText(message) ? message.trim() : exception.getClass().getSimpleName();
    }

    private int count(Integer value) {
        return Math.max(0, value == null ? 0 : value);
    }
}
