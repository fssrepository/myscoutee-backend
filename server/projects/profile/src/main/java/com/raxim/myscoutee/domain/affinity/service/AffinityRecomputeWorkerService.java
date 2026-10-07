package com.raxim.myscoutee.domain.affinity.service;

import com.raxim.myscoutee.domain.platform.api.JobGroupContext;
import com.raxim.myscoutee.domain.platform.api.ModelStatusChanges;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicBoolean;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.domain.affinity.config.AffinityRecomputeProperties;
import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.common.config.mongo.ScheduledMongoSessionRunner;
import com.raxim.myscoutee.domain.affinity.document.AffinityRecomputeTask;
import com.raxim.myscoutee.domain.notifications.api.NotificationJobs;

@Service
public class AffinityRecomputeWorkerService {
    private static final Logger LOGGER = LoggerFactory.getLogger(AffinityRecomputeWorkerService.class);
    private static final long DEFAULT_WORKER_POLL_DELAY_MS = 60_000L;

    private final String workerId = "affinity-worker-" + UUID.randomUUID();
    private final AffinityRecomputeTaskService taskService;
    private final AffinityMaintenanceService affinityMaintenanceService;
    private final ModelStatusChanges modelStatusPropagationService;
    private final AffinityRecomputeProperties properties;
    private final MongoTemplate mongoTemplate;
    private final AffinityRecomputeMetricsService metricsService;
    private ScheduledMongoSessionRunner scheduledMongoSessionRunner;
    private final java.util.concurrent.ConcurrentHashMap<String, AtomicBoolean> processing = new java.util.concurrent.ConcurrentHashMap<>();
    private volatile long lastScheduledRunMs = 0L;
    private volatile long cachedWorkerPollDelayMs = DEFAULT_WORKER_POLL_DELAY_MS;

    public AffinityRecomputeWorkerService(
            AffinityRecomputeTaskService taskService,
            AffinityMaintenanceService affinityMaintenanceService,
            ModelStatusChanges modelStatusPropagationService,
            AffinityRecomputeProperties properties,
            MongoTemplate mongoTemplate,
            AffinityRecomputeMetricsService metricsService) {
        this.taskService = taskService;
        this.affinityMaintenanceService = affinityMaintenanceService;
        this.modelStatusPropagationService = modelStatusPropagationService;
        this.properties = properties;
        this.mongoTemplate = mongoTemplate;
        this.metricsService = metricsService;
    }

    @org.springframework.beans.factory.annotation.Autowired(required = false)
    void setScheduledMongoSessionRunner(ScheduledMongoSessionRunner scheduledMongoSessionRunner) {
        this.scheduledMongoSessionRunner = scheduledMongoSessionRunner;
    }

    @Scheduled(fixedDelayString = "${affinity.recompute.worker-tick-ms:1000}")
    public void runDueTasks() {
        if (scheduledMongoSessionRunner == null) {
            runDueTasksForCurrentDatabase();
            return;
        }
        scheduledMongoSessionRunner.runAcrossConfiguredDatabases(this::runDueTasksForCurrentDatabase);
    }

    private void runDueTasksForCurrentDatabase() {
        var registry = taskService.notificationRuleRegistry();
        if (registry != null) registry.forEachGroup(NotificationJobs.RULE_AFFINITY_RECOMPUTE, this::runDueTasksForCurrentDatabaseInGroup);
    }

    private void runDueTasksForCurrentDatabaseInGroup() {
        if (!properties.isEnabled()
                || (properties.isChangeStreamEnabled()
                        && !properties.isChangeStreamFallbackPollEnabled()
                        && MongoSessionModeContext.currentMode() != MongoSessionMode.DEMO)) {
            return;
        }
        Instant startedAt = Instant.now();
        NotificationJobs registry = taskService.notificationRuleRegistry();
        boolean ruleConfigured = registry != null
                && registry.findRule(NotificationJobs.RULE_AFFINITY_RECOMPUTE).isPresent();
        try {
            boolean due = ruleConfigured
                    ? registry.shouldRunScheduledRule(
                            NotificationJobs.RULE_AFFINITY_RECOMPUTE,
                            startedAt)
                    : shouldRunScheduledPass();
            if (!due) {
                return;
            }
            if (ruleConfigured && registry.beginScheduledRun(
                        NotificationJobs.RULE_AFFINITY_RECOMPUTE,
                        "Scheduled affinity recompute started.",
                        "affinity-recompute",
                        startedAt) == null) {
                return;
            }
            int processedCount = processDueTasks(startedAt, "scheduled");
            if (ruleConfigured) {
                registry.recordRun(
                        NotificationJobs.RULE_AFFINITY_RECOMPUTE,
                        processedCount,
                        "completed",
                        "Processed pending affinity recompute tasks.",
                        "affinity-recompute",
                        startedAt);
            }
        } catch (RuntimeException exception) {
            if (ruleConfigured) {
                registry.recordRun(
                        NotificationJobs.RULE_AFFINITY_RECOMPUTE,
                        0,
                        "failed",
                        safeText(exception.getMessage()),
                        "affinity-recompute",
                        startedAt);
            }
            LOGGER.debug("Affinity recompute worker tick skipped after a transient failure.", exception);
        }
    }

    public int wakeDueTasks(String trigger) {
        var registry = taskService.notificationRuleRegistry();
        if (JobGroupContext.isActive()) {
            return registry == null || registry.findRule(NotificationJobs.RULE_AFFINITY_RECOMPUTE).isEmpty()
                    ? 0 : wakeDueTasksInGroup(trigger);
        }
        var total = new java.util.concurrent.atomic.AtomicInteger();
        if (registry != null) registry.forEachGroup(NotificationJobs.RULE_AFFINITY_RECOMPUTE,
                () -> total.addAndGet(wakeDueTasksInGroup(trigger)));
        return total.get();
    }

    private int wakeDueTasksInGroup(String trigger) {
        if (!properties.isEnabled()) {
            return 0;
        }
        Instant startedAt = Instant.now();
        NotificationJobs registry = taskService.notificationRuleRegistry();
        boolean ruleConfigured = registry != null
                && registry.findRule(NotificationJobs.RULE_AFFINITY_RECOMPUTE).isPresent();
        if (!ruleConfigured) return 0;
        if (!registry.findRule(NotificationJobs.RULE_AFFINITY_RECOMPUTE)
                .map(rule -> Boolean.TRUE.equals(rule.getEnabled()))
                .orElse(false)) {
            return 0;
        }
        try {
            if (ruleConfigured && registry.beginRun(
                        NotificationJobs.RULE_AFFINITY_RECOMPUTE,
                        "Affinity recompute wake-up started.",
                        "affinity-recompute",
                        startedAt) == null) {
                return 0;
            }
            int processedCount = processDueTasks(
                    startedAt,
                    StringUtils.hasText(trigger) ? trigger : "wakeup");
            if (ruleConfigured) {
                registry.recordRun(
                        NotificationJobs.RULE_AFFINITY_RECOMPUTE,
                        processedCount,
                        "completed",
                        "Processed affinity recompute wake-up tasks.",
                        "affinity-recompute",
                        startedAt);
            }
            return processedCount;
        } catch (RuntimeException exception) {
            if (ruleConfigured) {
                registry.recordRun(
                        NotificationJobs.RULE_AFFINITY_RECOMPUTE,
                        0,
                        "failed",
                        safeText(exception.getMessage()),
                        "affinity-recompute",
                        startedAt);
            }
            LOGGER.debug("Affinity recompute worker wakeup skipped after a transient failure.", exception);
            return 0;
        }
    }

    public int processDueTasks(Instant now) {
        return processDueTasks(now, "direct");
    }

    public AffinityRecomputeMetricsService.Snapshot metricsSnapshot() {
        return metricsService.snapshot();
    }

    private int processDueTasks(Instant now, String trigger) {
        AtomicBoolean running = processing.computeIfAbsent(MongoSessionModeContext.currentMode().name() + ":" + JobGroupContext.key(), ignored -> new AtomicBoolean());
        if (!running.compareAndSet(false, true)) {
            metricsService.recordWorkerBusySkip();
            return 0;
        }
        long readStartMs = System.nanoTime();
        long runtimeStartMs = readStartMs;
        int dueCount = 0;
        int leasedCount = 0;
        try {
            Instant effectiveNow = now == null ? Instant.now() : now;
            List<AffinityRecomputeTask> dueTasks = taskService.findPendingDueTasks(effectiveNow, effectiveDueTaskLimit());
            dueTasks = dueTasks == null ? List.of() : dueTasks;
            dueCount = dueTasks.size();
            long readMs = elapsedMs(readStartMs);
            List<AffinityRecomputeTask> leasedTasks = new ArrayList<>();
            for (AffinityRecomputeTask task : dueTasks) {
                AffinityRecomputeTask leased = lease(task, effectiveNow);
                if (leased == null) {
                    continue;
                }
                metricsService.recordTaskLeased(leased, effectiveNow);
                leasedTasks.add(leased);
            }
            leasedCount = leasedTasks.size();
            if (leasedTasks.isEmpty()) {
                metricsService.recordWorkerPass(trigger, dueCount, 0, readMs, elapsedMs(runtimeStartMs));
                return 0;
            }

            Map<String, List<AffinityRecomputeTask>> tasksByTargetType = new LinkedHashMap<>();
            for (AffinityRecomputeTask task : leasedTasks) {
                tasksByTargetType.computeIfAbsent(safeText(task.getTargetType()), ignored -> new ArrayList<>()).add(task);
            }
            for (Map.Entry<String, List<AffinityRecomputeTask>> entry : tasksByTargetType.entrySet()) {
                processLeasedTaskBatch(entry.getKey(), entry.getValue());
            }
            metricsService.recordWorkerPass(trigger, dueCount, leasedCount, readMs, elapsedMs(runtimeStartMs));
            return leasedCount;
        } finally {
            running.set(false);
        }
    }

    private long elapsedMs(long startNs) {
        return Math.max(0L, (System.nanoTime() - startNs) / 1_000_000L);
    }

    private AffinityRecomputeTask lease(AffinityRecomputeTask task, Instant now) {
        if (task == null || !StringUtils.hasText(task.getId())) {
            return null;
        }
        Instant leaseUntil = now.plus(effectiveLeaseDuration());
        Query query = new Query(Criteria.where("_id").is(task.getId())
                .and("baseGroupId").is(JobGroupContext.groupId())
                .and("status").is(AffinityRecomputeTaskService.STATUS_PENDING)
                .and("availableAtIso").lte(now.toString()));
        Update update = new Update()
                .set("status", AffinityRecomputeTaskService.STATUS_RUNNING)
                .set("leaseUntilIso", leaseUntil.toString())
                .set("workerId", workerId)
                .set("updatedDate", now.toString())
                .set("updatedUser", workerId)
                .inc("attemptCount", 1);
        return mongoTemplate.findAndModify(
                query,
                update,
                FindAndModifyOptions.options().returnNew(true),
                AffinityRecomputeTask.class);
    }

    private void processLeasedTask(AffinityRecomputeTask task) {
        try {
            processTarget(task);
            finish(task);
        } catch (RuntimeException exception) {
            fail(task, exception);
        }
    }

    private void processLeasedTaskBatch(String targetType, List<AffinityRecomputeTask> tasks) {
        if (tasks == null || tasks.isEmpty()) {
            return;
        }
        try {
            if (AffinityRecomputeTaskService.TARGET_EVENT.equals(targetType)) {
                AffinityMaintenanceService.RecomputeOutcome outcome =
                        affinityMaintenanceService.refreshEventAffinitiesForSourceIds(targetIds(tasks));
                requeueConflictedTargets(
                        AffinityRecomputeTaskService.TARGET_EVENT,
                        outcome,
                        AffinityRecomputeTaskService.REASON_EVENT_CHANGED);
                tasks.forEach(this::finish);
                return;
            }
            if (AffinityRecomputeTaskService.TARGET_ASSET.equals(targetType)) {
                AffinityMaintenanceService.RecomputeOutcome outcome =
                        affinityMaintenanceService.refreshAssetAffinitiesForAssetIds(targetIds(tasks));
                requeueConflictedTargets(
                        AffinityRecomputeTaskService.TARGET_ASSET,
                        outcome,
                        AffinityRecomputeTaskService.REASON_ASSET_CHANGED);
                tasks.forEach(this::finish);
                return;
            }
            if (AffinityRecomputeTaskService.TARGET_CONFIG.equals(targetType)) {
                AffinityMaintenanceService.StoredAffinityRecomputeOutcome outcome =
                        affinityMaintenanceService.refreshAllStoredAffinities();
                requeueConflictedTargets(
                        AffinityRecomputeTaskService.TARGET_EVENT,
                        outcome == null ? null : outcome.events(),
                        AffinityRecomputeTaskService.REASON_CONFIG_CHANGED);
                requeueConflictedTargets(
                        AffinityRecomputeTaskService.TARGET_ASSET,
                        outcome == null ? null : outcome.assets(),
                        AffinityRecomputeTaskService.REASON_CONFIG_CHANGED);
                tasks.forEach(this::finish);
                return;
            }
            for (AffinityRecomputeTask task : tasks) {
                processLeasedTask(task);
            }
        } catch (RuntimeException exception) {
            for (AffinityRecomputeTask task : tasks) {
                fail(task, exception);
            }
        }
    }

    private List<String> targetIds(List<AffinityRecomputeTask> tasks) {
        return tasks == null
                ? List.of()
                : tasks.stream()
                        .map(AffinityRecomputeTask::getTargetId)
                        .map(this::safeText)
                        .filter(StringUtils::hasText)
                        .distinct()
                        .toList();
    }

    private void processTarget(AffinityRecomputeTask task) {
        String targetType = safeText(task == null ? null : task.getTargetType());
        String targetId = safeText(task == null ? null : task.getTargetId());
        if (!StringUtils.hasText(targetId)) {
            return;
        }
        switch (targetType) {
            case AffinityRecomputeTaskService.TARGET_USER -> processUserTarget(targetId);
            case AffinityRecomputeTaskService.TARGET_EVENT -> requeueConflictedTargets(
                    AffinityRecomputeTaskService.TARGET_EVENT,
                    affinityMaintenanceService.refreshEventAffinitiesForSourceId(targetId),
                    AffinityRecomputeTaskService.REASON_EVENT_CHANGED);
            case AffinityRecomputeTaskService.TARGET_ASSET -> requeueConflictedTargets(
                    AffinityRecomputeTaskService.TARGET_ASSET,
                    affinityMaintenanceService.refreshAssetAffinityForAssetId(targetId),
                    AffinityRecomputeTaskService.REASON_ASSET_CHANGED);
            case AffinityRecomputeTaskService.TARGET_CONFIG -> {
                AffinityMaintenanceService.StoredAffinityRecomputeOutcome outcome =
                        affinityMaintenanceService.refreshAllStoredAffinities();
                requeueConflictedTargets(
                        AffinityRecomputeTaskService.TARGET_EVENT,
                        outcome == null ? null : outcome.events(),
                        AffinityRecomputeTaskService.REASON_CONFIG_CHANGED);
                requeueConflictedTargets(
                        AffinityRecomputeTaskService.TARGET_ASSET,
                        outcome == null ? null : outcome.assets(),
                        AffinityRecomputeTaskService.REASON_CONFIG_CHANGED);
            }
            default -> {
            }
        }
    }

    private void processUserTarget(String userId) {
        ModelStatusChanges.Outcome statusOutcome =
                modelStatusPropagationService.applyForUser(userId);
        if (statusOutcome.hasConflicts()) {
            taskService.enqueue(
                    AffinityRecomputeTaskService.TARGET_USER,
                    userId,
                    AffinityRecomputeTaskService.REASON_ADMIN_STATUS_CHANGED,
                    taskService.debounceForTarget(AffinityRecomputeTaskService.TARGET_USER),
                    workerId);
        }
        affinityMaintenanceService.refreshUserAffinityAndRates(userId);
        AffinityMaintenanceService.UserAffinityDependents dependents =
                affinityMaintenanceService.resolveUserAffinityDependents(userId);
        for (String eventSourceId : mergeIds(statusOutcome.eventSourceIds(), dependents.eventSourceIds())) {
            taskService.enqueue(
                    AffinityRecomputeTaskService.TARGET_EVENT,
                    eventSourceId,
                    AffinityRecomputeTaskService.REASON_USER_CHANGED,
                    taskService.debounceForTarget(AffinityRecomputeTaskService.TARGET_EVENT),
                    userId);
        }
        for (String assetId : mergeIds(statusOutcome.assetIds(), dependents.assetIds())) {
            taskService.enqueue(
                    AffinityRecomputeTaskService.TARGET_ASSET,
                    assetId,
                    AffinityRecomputeTaskService.REASON_USER_CHANGED,
                    taskService.debounceForTarget(AffinityRecomputeTaskService.TARGET_ASSET),
                    userId);
        }
    }

    private List<String> mergeIds(List<String> first, List<String> second) {
        List<String> result = new ArrayList<>();
        for (String value : first == null ? List.<String>of() : first) {
            String normalized = safeText(value);
            if (StringUtils.hasText(normalized) && !result.contains(normalized)) {
                result.add(normalized);
            }
        }
        for (String value : second == null ? List.<String>of() : second) {
            String normalized = safeText(value);
            if (StringUtils.hasText(normalized) && !result.contains(normalized)) {
                result.add(normalized);
            }
        }
        return result;
    }

    private void requeueConflictedTargets(
            String targetType,
            AffinityMaintenanceService.RecomputeOutcome outcome,
            String reason) {
        if (outcome == null || !outcome.hasConflicts()) {
            return;
        }
        Duration debounce = taskService.debounceForTarget(targetType);
        for (String targetId : outcome.conflictedTargetIds()) {
            taskService.enqueue(targetType, targetId, reason, debounce, workerId);
        }
    }

    private void finish(AffinityRecomputeTask task) {
        AffinityRecomputeTask latest = taskService.findByTaskKey(task.getTaskKey()).orElse(task);
        String nowIso = Instant.now().toString();
        boolean pendingCounterTracked = Boolean.TRUE.equals(latest.getPendingCounterTracked());
        boolean rerunRequested = Boolean.TRUE.equals(latest.getRerunRequested());
        if (rerunRequested) {
            latest.setStatus(AffinityRecomputeTaskService.STATUS_PENDING);
            latest.setAvailableAtIso(Instant.now().plus(taskService.debounceForTarget(latest.getTargetType())).toString());
            latest.setRerunRequested(false);
            latest.setLeaseUntilIso(null);
            latest.setWorkerId(null);
            latest.setCompletedAtIso(null);
        } else {
            latest.setStatus(AffinityRecomputeTaskService.STATUS_DONE);
            latest.setPendingCounterTracked(false);
            latest.setLeaseUntilIso(null);
            latest.setWorkerId(null);
            latest.setCompletedAtIso(nowIso);
        }
        latest.setUpdatedDate(nowIso);
        latest.setUpdatedUser(workerId);
        taskService.save(latest);
        if (!rerunRequested && pendingCounterTracked) {
            taskService.recordPendingWorkCompleted();
        }
    }

    private void fail(AffinityRecomputeTask task, RuntimeException exception) {
        AffinityRecomputeTask latest = taskService.findByTaskKey(task.getTaskKey()).orElse(task);
        String nowIso = Instant.now().toString();
        boolean pendingCounterTracked = Boolean.TRUE.equals(latest.getPendingCounterTracked());
        latest.setStatus(AffinityRecomputeTaskService.STATUS_FAILED);
        latest.setPendingCounterTracked(false);
        latest.setLeaseUntilIso(null);
        latest.setWorkerId(null);
        latest.setLastError(truncate(exception == null ? null : exception.getMessage(), 1000));
        latest.setUpdatedDate(nowIso);
        latest.setUpdatedUser(workerId);
        taskService.save(latest);
        if (pendingCounterTracked) {
            taskService.recordPendingWorkCompleted();
        }
    }

    private Duration effectiveLeaseDuration() {
        Duration lease = taskService.leaseDuration();
        if (lease == null) {
            lease = properties.getLeaseDuration();
        }
        return lease == null || lease.isNegative() || lease.isZero() ? Duration.ofMinutes(10) : lease;
    }

    private int effectiveDueTaskLimit() {
        int limit = taskService.dueTaskLimit();
        return limit > 0 ? limit : Math.max(1, properties.getDueTaskLimit());
    }

    private boolean shouldRunScheduledPass() {
        long nowMs = System.currentTimeMillis();
        long previousRunMs = lastScheduledRunMs;
        long pollDelayMs = cachedWorkerPollDelayMs;
        if (previousRunMs > 0L && nowMs - previousRunMs < pollDelayMs) {
            return false;
        }
        pollDelayMs = Math.max(100L, taskService.workerPollDelayMs(DEFAULT_WORKER_POLL_DELAY_MS));
        cachedWorkerPollDelayMs = pollDelayMs;
        if (previousRunMs > 0L && nowMs - previousRunMs < pollDelayMs) {
            return false;
        }
        lastScheduledRunMs = nowMs;
        return true;
    }

    private String truncate(String value, int maxLength) {
        String text = safeText(value);
        if (text.length() <= maxLength) {
            return text;
        }
        return text.substring(0, Math.max(0, maxLength));
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }
}
