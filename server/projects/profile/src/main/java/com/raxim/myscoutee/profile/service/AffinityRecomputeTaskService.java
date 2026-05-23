package com.raxim.myscoutee.profile.service;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

import jakarta.annotation.PostConstruct;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.index.Index;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.common.config.properties.AffinityRecomputeProperties;
import com.raxim.myscoutee.profile.data.document.AffinityRecomputeTask;
import com.raxim.myscoutee.profile.repository.AffinityRecomputeTasksRepository;

@Service
public class AffinityRecomputeTaskService {
    public static final String TARGET_USER = "USER";
    public static final String TARGET_EVENT = "EVENT";
    public static final String TARGET_ASSET = "ASSET";
    public static final String TARGET_CONFIG = "CONFIG";

    public static final String REASON_USER_CHANGED = "USER_CHANGED";
    public static final String REASON_EVENT_CHANGED = "EVENT_CHANGED";
    public static final String REASON_EVENT_MEMBERS_CHANGED = "EVENT_MEMBERS_CHANGED";
    public static final String REASON_ASSET_CHANGED = "ASSET_CHANGED";
    public static final String REASON_ASSET_REQUESTS_CHANGED = "ASSET_REQUESTS_CHANGED";
    public static final String REASON_ADMIN_STATUS_CHANGED = "ADMIN_STATUS_CHANGED";
    public static final String REASON_CONFIG_CHANGED = "AFFINITY_CONFIG_CHANGED";

    public static final String STATUS_PENDING = "pending";
    public static final String STATUS_RUNNING = "running";
    public static final String STATUS_DONE = "done";
    public static final String STATUS_FAILED = "failed";

    private final AffinityRecomputeTasksRepository tasksRepository;
    private final AffinityRecomputeProperties properties;
    private final MongoTemplate mongoTemplate;
    private final PlatformParametersService platformParametersService;

    @Autowired
    public AffinityRecomputeTaskService(
            AffinityRecomputeTasksRepository tasksRepository,
            AffinityRecomputeProperties properties,
            MongoTemplate mongoTemplate,
            PlatformParametersService platformParametersService) {
        this.tasksRepository = tasksRepository;
        this.properties = properties;
        this.mongoTemplate = mongoTemplate;
        this.platformParametersService = platformParametersService;
    }

    AffinityRecomputeTaskService(
            AffinityRecomputeTasksRepository tasksRepository,
            AffinityRecomputeProperties properties,
            MongoTemplate mongoTemplate) {
        this(tasksRepository, properties, mongoTemplate, null);
    }

    @PostConstruct
    void ensureIndexes() {
        mongoTemplate.indexOps(AffinityRecomputeTask.class)
                .createIndex(new Index()
                        .named("affinity_recompute_task_key")
                        .on("taskKey", Sort.Direction.ASC)
                        .unique());
        mongoTemplate.indexOps(AffinityRecomputeTask.class)
                .createIndex(new Index()
                        .named("affinity_recompute_task_status_available")
                        .on("status", Sort.Direction.ASC)
                        .on("availableAtIso", Sort.Direction.ASC));
        mongoTemplate.indexOps(AffinityRecomputeTask.class)
                .createIndex(new Index()
                        .named("affinity_recompute_task_target_status")
                        .on("targetType", Sort.Direction.ASC)
                        .on("status", Sort.Direction.ASC));
    }

    public AffinityRecomputeTask enqueueUserChanged(String userId) {
        return enqueue(TARGET_USER, userId, REASON_USER_CHANGED, userChangedDebounce(), userId);
    }

    public AffinityRecomputeTask enqueueAdminStatusChanged(String userId) {
        return enqueue(TARGET_USER, userId, REASON_ADMIN_STATUS_CHANGED, properties.getAdminStatusChangedDebounce(), userId);
    }

    public AffinityRecomputeTask enqueueEventChanged(String eventSourceId, String actorUserId) {
        return enqueue(TARGET_EVENT, eventSourceId, REASON_EVENT_CHANGED, eventChangedDebounce(), actorUserId);
    }

    public AffinityRecomputeTask enqueueEventMembersChanged(String eventSourceId, String actorUserId) {
        return enqueue(TARGET_EVENT, eventSourceId, REASON_EVENT_MEMBERS_CHANGED, eventMembersChangedDebounce(), actorUserId);
    }

    public AffinityRecomputeTask enqueueAssetChanged(String assetId, String actorUserId) {
        return enqueue(TARGET_ASSET, assetId, REASON_ASSET_CHANGED, assetChangedDebounce(), actorUserId);
    }

    public AffinityRecomputeTask enqueueAssetRequestsChanged(String assetId, String actorUserId) {
        return enqueue(TARGET_ASSET, assetId, REASON_ASSET_REQUESTS_CHANGED, assetRequestsChangedDebounce(), actorUserId);
    }

    public AffinityRecomputeTask enqueueConfigChanged(String configId, String actorUserId) {
        String targetId = StringUtils.hasText(safeText(configId)) ? safeText(configId) : "active";
        return enqueue(TARGET_CONFIG, targetId, REASON_CONFIG_CHANGED, configChangedDebounce(), actorUserId);
    }

    public AffinityRecomputeTask enqueue(
            String targetType,
            String targetId,
            String reason,
            Duration debounce,
            String actorUserId) {
        String normalizedTargetType = normalizeTargetType(targetType);
        String normalizedTargetId = normalizeId(targetId);
        if (!StringUtils.hasText(normalizedTargetType) || !StringUtils.hasText(normalizedTargetId)) {
            return null;
        }

        String taskKey = taskKey(normalizedTargetType, normalizedTargetId);
        for (int attempt = 0; attempt < 5; attempt += 1) {
            try {
                return saveMergedTask(taskKey, normalizedTargetType, normalizedTargetId, reason, debounce, actorUserId);
            } catch (DuplicateKeyException | OptimisticLockingFailureException ignored) {
                // Another writer created or updated the collapsed target task; retry against the stored document.
            }
        }
        return tasksRepository.findByTaskKey(taskKey).orElse(null);
    }

    public List<AffinityRecomputeTask> findPendingDueTasks(Instant now, int limit) {
        String dueIso = iso(now);
        int normalizedLimit = Math.max(1, limit);
        List<AffinityRecomputeTask> due = tasksRepository
                .findByStatusAndAvailableAtIsoLessThanEqualOrderByAvailableAtIsoAsc(STATUS_PENDING, dueIso);
        if (due == null || due.isEmpty()) {
            return List.of();
        }
        return due.stream().limit(normalizedLimit).toList();
    }

    public AffinityRecomputeTask save(AffinityRecomputeTask task) {
        return tasksRepository.save(task);
    }

    public Optional<AffinityRecomputeTask> findByTaskKey(String taskKey) {
        return tasksRepository.findByTaskKey(safeText(taskKey));
    }

    public String taskKey(String targetType, String targetId) {
        return normalizeTargetType(targetType) + ":" + normalizeId(targetId);
    }

    public Duration debounceForTarget(String targetType) {
        return switch (normalizeTargetType(targetType)) {
            case TARGET_USER -> userChangedDebounce();
            case TARGET_EVENT -> eventChangedDebounce();
            case TARGET_ASSET -> assetChangedDebounce();
            case TARGET_CONFIG -> configChangedDebounce();
            default -> properties.getDefaultDebounce();
        };
    }

    public int dueTaskLimit() {
        return platformParametersService == null
                ? Math.max(1, properties.getDueTaskLimit())
                : platformParametersService.jobBatchSize(Math.max(1, properties.getDueTaskLimit()));
    }

    public Duration leaseDuration() {
        Duration fallback = properties.getLeaseDuration();
        return platformParametersService == null ? fallback : platformParametersService.jobLeaseDuration(fallback);
    }

    public long workerPollDelayMs(long fallback) {
        return platformParametersService == null ? fallback : platformParametersService.jobWorkerPollDelayMs(fallback);
    }

    private Duration userChangedDebounce() {
        return platformParametersService == null
                ? properties.getUserChangedDebounce()
                : platformParametersService.userChangedDebounce(properties.getUserChangedDebounce());
    }

    private Duration eventChangedDebounce() {
        return platformParametersService == null
                ? properties.getEventChangedDebounce()
                : platformParametersService.eventChangedDebounce(properties.getEventChangedDebounce());
    }

    private Duration eventMembersChangedDebounce() {
        return platformParametersService == null
                ? properties.getEventMembersChangedDebounce()
                : platformParametersService.eventMembersChangedDebounce(properties.getEventMembersChangedDebounce());
    }

    private Duration assetChangedDebounce() {
        return platformParametersService == null
                ? properties.getAssetChangedDebounce()
                : platformParametersService.assetChangedDebounce(properties.getAssetChangedDebounce());
    }

    private Duration assetRequestsChangedDebounce() {
        return platformParametersService == null
                ? properties.getAssetRequestsChangedDebounce()
                : platformParametersService.assetRequestsChangedDebounce(properties.getAssetRequestsChangedDebounce());
    }

    private Duration configChangedDebounce() {
        return platformParametersService == null
                ? properties.getConfigChangedDebounce()
                : platformParametersService.configChangedDebounce(properties.getConfigChangedDebounce());
    }

    private AffinityRecomputeTask saveMergedTask(
            String taskKey,
            String targetType,
            String targetId,
            String reason,
            Duration debounce,
            String actorUserId) {
        AffinityRecomputeTask task = tasksRepository.findByTaskKey(taskKey).orElse(null);
        if (task == null) {
            task = new AffinityRecomputeTask();
            task.setId(new ObjectId().toHexString());
            task.setTaskKey(taskKey);
            task.setTargetType(targetType);
            task.setTargetId(targetId);
            task.setCreatedDate(iso(Instant.now()));
            task.setAttemptCount(0);
        }
        return tasksRepository.save(merge(task, reason, availableAt(debounce), actorUserId));
    }

    private AffinityRecomputeTask merge(
            AffinityRecomputeTask task,
            String reason,
            String availableAtIso,
            String actorUserId) {
        String nowIso = iso(Instant.now());
        List<String> reasons = new ArrayList<>(new LinkedHashSet<>(task.getReasons() == null ? List.of() : task.getReasons()));
        String normalizedReason = normalizeReason(reason);
        if (StringUtils.hasText(normalizedReason) && !reasons.contains(normalizedReason)) {
            reasons.add(normalizedReason);
        }
        task.setReasons(reasons);
        String previousStatus = safeText(task.getStatus());
        if (STATUS_RUNNING.equals(previousStatus)) {
            task.setRerunRequested(true);
            task.setAvailableAtIso(laterIso(task.getAvailableAtIso(), availableAtIso));
        } else {
            task.setStatus(STATUS_PENDING);
            task.setAvailableAtIso(STATUS_PENDING.equals(previousStatus)
                    ? laterIso(task.getAvailableAtIso(), availableAtIso)
                    : availableAtIso);
            task.setLeaseUntilIso(null);
            task.setWorkerId(null);
            task.setCompletedAtIso(null);
            task.setRerunRequested(false);
        }
        task.setLastError(null);
        task.setUpdatedDate(nowIso);
        task.setUpdatedUser(StringUtils.hasText(safeText(actorUserId)) ? safeText(actorUserId) : "system");
        return task;
    }

    private String availableAt(Duration debounce) {
        Duration effectiveDebounce = debounce == null ? properties.getDefaultDebounce() : debounce;
        if (effectiveDebounce.isNegative()) {
            effectiveDebounce = Duration.ZERO;
        }
        return iso(Instant.now().plus(effectiveDebounce));
    }

    private String laterIso(String left, String right) {
        String leftValue = safeText(left);
        String rightValue = safeText(right);
        if (!StringUtils.hasText(leftValue)) {
            return rightValue;
        }
        if (!StringUtils.hasText(rightValue)) {
            return leftValue;
        }
        return leftValue.compareTo(rightValue) >= 0 ? leftValue : rightValue;
    }

    private String normalizeTargetType(String value) {
        String normalized = safeText(value).toUpperCase(Locale.ROOT);
        return switch (normalized) {
            case TARGET_USER, TARGET_EVENT, TARGET_ASSET, TARGET_CONFIG -> normalized;
            default -> "";
        };
    }

    private String normalizeReason(String value) {
        return safeText(value).toUpperCase(Locale.ROOT).replace('-', '_').replace(' ', '_');
    }

    private String normalizeId(String value) {
        return safeText(value);
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }

    private String iso(Instant instant) {
        return (instant == null ? Instant.now() : instant).toString();
    }
}
