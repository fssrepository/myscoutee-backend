package com.raxim.myscoutee.profile.service;

import java.time.Instant;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.profile.data.document.ScheduledMessageTask;
import com.raxim.myscoutee.profile.data.document.UserSessionAction;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.repository.ScheduledMessageTasksRepository;
import com.raxim.myscoutee.profile.repository.UserSessionActionsRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;
import com.raxim.myscoutee.profile.service.email.ScheduledMessageAuditService;

@Service
public class ScheduledMessageTaskService {
    public static final String ACTION_INACTIVATE_PROFILE_AFTER_INACTIVITY = "user.profile.inactivate-after-inactivity";

    private static final Logger LOGGER = LoggerFactory.getLogger(ScheduledMessageTaskService.class);
    private static final String STATUS_SCHEDULED = "scheduled";
    private static final String STATUS_RUNNING = "running";
    private static final String STATUS_COMPLETED = "completed";
    private static final String STATUS_FAILED = "failed";
    private static final String STATUS_SKIPPED = "skipped";
    private static final String UPDATED_BY = "scheduled-message-task";
    private static final int DEFAULT_INACTIVE_DAYS = 30;
    private static final int MAX_DUE_TASKS = 50;

    private final MongoTemplate mongoTemplate;
    private final ScheduledMessageTasksRepository scheduledMessageTasksRepository;
    private final UsersRepository usersRepository;
    private final UserSessionActionsRepository userSessionActionsRepository;
    private final ScheduledMessageAuditService scheduledMessageAuditService;

    public ScheduledMessageTaskService(
            MongoTemplate mongoTemplate,
            ScheduledMessageTasksRepository scheduledMessageTasksRepository,
            UsersRepository usersRepository,
            UserSessionActionsRepository userSessionActionsRepository,
            ScheduledMessageAuditService scheduledMessageAuditService) {
        this.mongoTemplate = mongoTemplate;
        this.scheduledMessageTasksRepository = scheduledMessageTasksRepository;
        this.usersRepository = usersRepository;
        this.userSessionActionsRepository = userSessionActionsRepository;
        this.scheduledMessageAuditService = scheduledMessageAuditService;
    }

    @Scheduled(fixedDelayString = "${scheduled-messages.task-poll-delay-ms:60000}")
    public void runDueTasks() {
        String nowIso = Instant.now().toString();
        Query query = Query.query(Criteria
                .where("status").is(STATUS_SCHEDULED)
                .and("suspended").ne(Boolean.TRUE)
                .and("dueAtIso").lte(nowIso))
                .with(Sort.by(Sort.Direction.ASC, "dueAtIso"))
                .limit(MAX_DUE_TASKS);
        List<ScheduledMessageTask> dueTasks = mongoTemplate.find(query, ScheduledMessageTask.class);
        for (ScheduledMessageTask task : dueTasks) {
            runTask(task);
        }
    }

    public void touchUserActivity(String userId) {
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(normalizedUserId)) {
            return;
        }
        Users user = usersRepository.findByUserId(normalizedUserId).orElse(null);
        if (user == null || isDeleted(user)) {
            return;
        }
        scheduleUserInactivation(normalizedUserId, Instant.now().plus(DEFAULT_INACTIVE_DAYS, ChronoUnit.DAYS));
    }

    public ScheduledMessageTask scheduleUserInactivation(String userId, Instant dueAt) {
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(normalizedUserId)) {
            return null;
        }
        String nowIso = Instant.now().toString();
        String taskKey = userInactivityTaskKey(normalizedUserId);
        ScheduledMessageTask task = scheduledMessageTasksRepository.findByTaskKey(taskKey).orElseGet(ScheduledMessageTask::new);
        if (!StringUtils.hasText(task.getId())) {
            task.setId(new ObjectId().toHexString());
        }
        if (!StringUtils.hasText(task.getSyncKey())) {
            task.setSyncKey(UUID.randomUUID().toString());
        }
        if (!StringUtils.hasText(task.getCreatedDate())) {
            task.setCreatedDate(nowIso);
            task.setCreatedUser(UPDATED_BY);
        }
        task.setTaskKey(taskKey);
        task.setActionKey(ACTION_INACTIVATE_PROFILE_AFTER_INACTIVITY);
        task.setUserId(normalizedUserId);
        task.setDueAtIso((dueAt == null ? Instant.now().plus(DEFAULT_INACTIVE_DAYS, ChronoUnit.DAYS) : dueAt).toString());
        task.setStatus(STATUS_SCHEDULED);
        task.setSuspended(Boolean.FALSE);
        task.setPayload(Map.of("inactiveDays", String.valueOf(DEFAULT_INACTIVE_DAYS)));
        task.setUpdatedDate(nowIso);
        task.setUpdatedUser(UPDATED_BY);
        return scheduledMessageTasksRepository.save(task);
    }

    private void runTask(ScheduledMessageTask dueTask) {
        String taskKey = safeText(dueTask == null ? null : dueTask.getTaskKey());
        if (!StringUtils.hasText(taskKey)) {
            return;
        }
        ScheduledMessageTask task = scheduledMessageTasksRepository.findByTaskKey(taskKey).orElse(null);
        if (task == null || Boolean.TRUE.equals(task.getSuspended()) || !STATUS_SCHEDULED.equals(safeText(task.getStatus()))) {
            return;
        }
        String nowIso = Instant.now().toString();
        task.setStatus(STATUS_RUNNING);
        task.setLastRunAtIso(nowIso);
        task.setUpdatedDate(nowIso);
        task.setUpdatedUser(UPDATED_BY);
        task = scheduledMessageTasksRepository.save(task);

        String runId = scheduledMessageAuditService.beginRun(task);
        try {
            TaskResult result = switch (safeText(task.getActionKey())) {
                case ACTION_INACTIVATE_PROFILE_AFTER_INACTIVITY -> inactivateProfileAfterInactivity(task, runId);
                default -> new TaskResult(STATUS_FAILED, 0, "Unknown scheduled action.");
            };
            finishTask(task, result.status(), result.count(), result.detail());
            scheduledMessageAuditService.finishRun(
                    runId,
                    result.count(),
                    0,
                    0,
                    STATUS_FAILED.equals(result.status()) ? 1 : 0,
                    result.status(),
                    result.detail());
        } catch (Exception exception) {
            LOGGER.warn("Scheduled task {} failed.", taskKey, exception);
            String detail = safeText(exception.getMessage());
            finishTask(task, STATUS_FAILED, 0, detail);
            scheduledMessageAuditService.finishRun(runId, 0, 0, 0, 1, STATUS_FAILED, detail);
        }
    }

    private TaskResult inactivateProfileAfterInactivity(ScheduledMessageTask task, String runId) {
        String userId = normalizeId(task.getUserId());
        Users user = StringUtils.hasText(userId) ? usersRepository.findByUserId(userId).orElse(null) : null;
        if (user == null || isDeleted(user)) {
            return new TaskResult(STATUS_SKIPPED, 0, "User not found or deleted.");
        }

        int inactiveDays = inactiveDays(task);
        Instant now = Instant.now();
        Instant threshold = now.minus(inactiveDays, ChronoUnit.DAYS);
        Instant lastActivity = latestActivityAt(user);
        if (lastActivity != null && lastActivity.isAfter(threshold)) {
            Instant nextDueAt = lastActivity.plus(inactiveDays, ChronoUnit.DAYS);
            reschedule(task, nextDueAt, "User active; rescheduled.");
            scheduledMessageAuditService.recordDelivery(runId, task, user, "action", "rescheduled", "User active; rescheduled.");
            return new TaskResult(STATUS_SCHEDULED, 0, "User active; rescheduled.");
        }

        if ("inactive".equals(safeText(user.getProfileStatus())) || "I".equals(safeText(user.getStatus()))) {
            scheduledMessageAuditService.recordDelivery(runId, task, user, "action", STATUS_SKIPPED, "Profile already inactive.");
            return new TaskResult(STATUS_SKIPPED, 0, "Profile already inactive.");
        }

        user.setStatus("I");
        user.setProfileStatus("inactive");
        usersRepository.save(user);
        scheduledMessageAuditService.recordDelivery(runId, task, user, "action", STATUS_COMPLETED, "Profile set to inactive.");
        return new TaskResult(STATUS_COMPLETED, 1, "Profile set to inactive.");
    }

    private void reschedule(ScheduledMessageTask task, Instant nextDueAt, String detail) {
        String nowIso = Instant.now().toString();
        task.setStatus(STATUS_SCHEDULED);
        task.setDueAtIso((nextDueAt == null ? Instant.now().plus(DEFAULT_INACTIVE_DAYS, ChronoUnit.DAYS) : nextDueAt).toString());
        task.setLastRunStatus(STATUS_SCHEDULED);
        task.setLastRunDetail(safeText(detail));
        task.setLastRunCount(0);
        task.setUpdatedDate(nowIso);
        task.setUpdatedUser(UPDATED_BY);
        scheduledMessageTasksRepository.save(task);
    }

    private void finishTask(ScheduledMessageTask task, String status, int count, String detail) {
        String nowIso = Instant.now().toString();
        task.setStatus(safeText(status));
        task.setLastRunAtIso(nowIso);
        task.setLastRunStatus(safeText(status));
        task.setLastRunDetail(safeText(detail));
        task.setLastRunCount(Math.max(0, count));
        task.setUpdatedDate(nowIso);
        task.setUpdatedUser(UPDATED_BY);
        scheduledMessageTasksRepository.save(task);
    }

    private Instant latestActivityAt(Users user) {
        String userId = normalizeId(user == null ? null : user.getId());
        Instant latest = null;
        for (Users.UserDeviceRecord device : user == null || user.getDevices() == null ? List.<Users.UserDeviceRecord>of() : user.getDevices()) {
            latest = max(latest, parseInstant(device == null ? null : device.getLastSeenAtIso()));
            latest = max(latest, parseInstant(device == null ? null : device.getLastRegisteredAtIso()));
        }
        if (StringUtils.hasText(userId)) {
            latest = max(latest, userSessionActionsRepository.findByUserIdOrderByCreatedDateDesc(userId).stream()
                    .map(UserSessionAction::getCreatedDate)
                    .map(this::parseInstant)
                    .filter(item -> item != null)
                    .max(Comparator.naturalOrder())
                    .orElse(null));
        }
        return latest;
    }

    private int inactiveDays(ScheduledMessageTask task) {
        Map<String, String> payload = task == null ? null : task.getPayload();
        String value = payload == null ? "" : firstNonBlank(payload.get("inactiveDays"), payload.get("inactive_days"));
        try {
            return Math.max(1, Integer.parseInt(safeText(value)));
        } catch (NumberFormatException exception) {
            return DEFAULT_INACTIVE_DAYS;
        }
    }

    private boolean isDeleted(Users user) {
        return user == null || "D".equals(safeText(user.getStatus())) || "deleted".equals(safeText(user.getProfileStatus()));
    }

    private Instant max(Instant left, Instant right) {
        if (left == null) {
            return right;
        }
        if (right == null) {
            return left;
        }
        return left.isAfter(right) ? left : right;
    }

    private Instant parseInstant(String value) {
        String normalized = safeText(value);
        if (!StringUtils.hasText(normalized)) {
            return null;
        }
        try {
            return Instant.parse(normalized);
        } catch (DateTimeParseException exception) {
            return null;
        }
    }

    private String userInactivityTaskKey(String userId) {
        return "user-profile-inactive-30d:" + normalizeId(userId);
    }

    private String firstNonBlank(String first, String second) {
        return StringUtils.hasText(safeText(first)) ? safeText(first) : safeText(second);
    }

    private String normalizeId(String value) {
        return safeText(value);
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }

    private record TaskResult(String status, int count, String detail) {
    }
}
