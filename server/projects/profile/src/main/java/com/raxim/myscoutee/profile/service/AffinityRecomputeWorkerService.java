package com.raxim.myscoutee.profile.service;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

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

import com.raxim.myscoutee.common.config.properties.AffinityRecomputeProperties;
import com.raxim.myscoutee.profile.data.document.AffinityRecomputeTask;

@Service
public class AffinityRecomputeWorkerService {
    private static final Logger LOGGER = LoggerFactory.getLogger(AffinityRecomputeWorkerService.class);
    private static final long DEFAULT_WORKER_POLL_DELAY_MS = 60_000L;

    private final String workerId = "affinity-worker-" + UUID.randomUUID();
    private final AffinityRecomputeTaskService taskService;
    private final AffinityMaintenanceService affinityMaintenanceService;
    private final ModelStatusPropagationService modelStatusPropagationService;
    private final AffinityRecomputeProperties properties;
    private final MongoTemplate mongoTemplate;
    private volatile long lastScheduledRunMs = 0L;

    public AffinityRecomputeWorkerService(
            AffinityRecomputeTaskService taskService,
            AffinityMaintenanceService affinityMaintenanceService,
            ModelStatusPropagationService modelStatusPropagationService,
            AffinityRecomputeProperties properties,
            MongoTemplate mongoTemplate) {
        this.taskService = taskService;
        this.affinityMaintenanceService = affinityMaintenanceService;
        this.modelStatusPropagationService = modelStatusPropagationService;
        this.properties = properties;
        this.mongoTemplate = mongoTemplate;
    }

    @Scheduled(fixedDelayString = "${affinity.recompute.worker-tick-ms:1000}")
    public void runDueTasks() {
        if (!properties.isEnabled()) {
            return;
        }
        try {
            if (!shouldRunScheduledPass()) {
                return;
            }
            processDueTasks(Instant.now());
        } catch (RuntimeException exception) {
            LOGGER.debug("Affinity recompute worker tick skipped after a transient failure.", exception);
        }
    }

    public int processDueTasks(Instant now) {
        Instant effectiveNow = now == null ? Instant.now() : now;
        List<AffinityRecomputeTask> dueTasks = taskService.findPendingDueTasks(effectiveNow, effectiveDueTaskLimit());
        List<AffinityRecomputeTask> leasedTasks = new ArrayList<>();
        for (AffinityRecomputeTask task : dueTasks) {
            AffinityRecomputeTask leased = lease(task, effectiveNow);
            if (leased == null) {
                continue;
            }
            leasedTasks.add(leased);
        }
        if (leasedTasks.isEmpty()) {
            return 0;
        }

        Map<String, List<AffinityRecomputeTask>> tasksByTargetType = new LinkedHashMap<>();
        for (AffinityRecomputeTask task : leasedTasks) {
            tasksByTargetType.computeIfAbsent(safeText(task.getTargetType()), ignored -> new ArrayList<>()).add(task);
        }
        for (Map.Entry<String, List<AffinityRecomputeTask>> entry : tasksByTargetType.entrySet()) {
            processLeasedTaskBatch(entry.getKey(), entry.getValue());
        }
        return leasedTasks.size();
    }

    private AffinityRecomputeTask lease(AffinityRecomputeTask task, Instant now) {
        if (task == null || !StringUtils.hasText(task.getId())) {
            return null;
        }
        Instant leaseUntil = now.plus(effectiveLeaseDuration());
        Query query = new Query(Criteria.where("_id").is(task.getId())
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
        ModelStatusPropagationService.ModelStatusPropagationOutcome statusOutcome =
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
        if (Boolean.TRUE.equals(latest.getRerunRequested())) {
            latest.setStatus(AffinityRecomputeTaskService.STATUS_PENDING);
            latest.setAvailableAtIso(Instant.now().plus(taskService.debounceForTarget(latest.getTargetType())).toString());
            latest.setRerunRequested(false);
            latest.setLeaseUntilIso(null);
            latest.setWorkerId(null);
            latest.setCompletedAtIso(null);
        } else {
            latest.setStatus(AffinityRecomputeTaskService.STATUS_DONE);
            latest.setLeaseUntilIso(null);
            latest.setWorkerId(null);
            latest.setCompletedAtIso(nowIso);
        }
        latest.setUpdatedDate(nowIso);
        latest.setUpdatedUser(workerId);
        taskService.save(latest);
    }

    private void fail(AffinityRecomputeTask task, RuntimeException exception) {
        AffinityRecomputeTask latest = taskService.findByTaskKey(task.getTaskKey()).orElse(task);
        String nowIso = Instant.now().toString();
        latest.setStatus(AffinityRecomputeTaskService.STATUS_FAILED);
        latest.setLeaseUntilIso(null);
        latest.setWorkerId(null);
        latest.setLastError(truncate(exception == null ? null : exception.getMessage(), 1000));
        latest.setUpdatedDate(nowIso);
        latest.setUpdatedUser(workerId);
        taskService.save(latest);
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
        long pollDelayMs = Math.max(100L, taskService.workerPollDelayMs(DEFAULT_WORKER_POLL_DELAY_MS));
        long previousRunMs = lastScheduledRunMs;
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
