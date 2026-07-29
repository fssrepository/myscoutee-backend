package com.raxim.myscoutee.profile.service;

import java.time.Instant;
import java.time.Duration;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.common.config.properties.ConfigProperties;
import com.raxim.myscoutee.common.config.properties.EmailProperties;
import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.common.config.mongo.ScheduledMongoSessionRunner;
import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.EmailOutboxItem;
import com.raxim.myscoutee.profile.data.document.EmailTemplate;
import com.raxim.myscoutee.profile.data.document.NotificationTemplate;
import com.raxim.myscoutee.profile.data.document.ScheduledMessageTask;
import com.raxim.myscoutee.profile.data.document.UserSessionAction;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.data.document.SubEventItem;
import com.raxim.myscoutee.profile.repository.EmailOutboxRepository;
import com.raxim.myscoutee.profile.repository.EmailTemplatesRepository;
import com.raxim.myscoutee.profile.repository.NotificationTemplatesRepository;
import com.raxim.myscoutee.profile.repository.ScheduledMessageTasksRepository;
import com.raxim.myscoutee.profile.repository.UserSessionActionsRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;
import com.raxim.myscoutee.profile.service.email.EmailOutboxStatus;
import com.raxim.myscoutee.profile.service.email.EmailProviderGateway;
import com.raxim.myscoutee.profile.service.email.EmailTemplateRenderer;
import com.raxim.myscoutee.profile.service.email.ScheduledMessageAuditService;
import com.raxim.myscoutee.profile.service.email.ScheduledNotificationDeliveryService;
import com.raxim.myscoutee.profile.service.notifications.NotificationRuleRegistryService;

import jakarta.annotation.PreDestroy;

@Service
public class ScheduledMessageTaskService {
    public static final String ACTION_INACTIVATE_PROFILE_AFTER_INACTIVITY = "user.profile.inactivate-after-inactivity";
    public static final String ACTION_EVENT_STAGE_REMINDER = "event.stage.reminder";
    public static final String ACTION_EVENT_DEFINITION_CHANGED = "event.definition.changed";

    private static final Logger LOGGER = LoggerFactory.getLogger(ScheduledMessageTaskService.class);
    private static final String STATUS_SCHEDULED = "scheduled";
    private static final String STATUS_RUNNING = "running";
    private static final String STATUS_COMPLETED = "completed";
    private static final String STATUS_FAILED = "failed";
    private static final String STATUS_SKIPPED = "skipped";
    private static final String UPDATED_BY = "scheduled-message-task";
    private static final int DEFAULT_INACTIVE_DAYS = 30;
    private static final int MAX_DUE_TASKS = 50;
    private static final long DEFAULT_WORKER_LOOKAHEAD_MS = 60000L;
    private static final int STAGE_REMINDER_LEAD_MINUTES = 120;
    private static final String STAGE_REMINDER_NOTIFICATION_TEMPLATE_KEY = "event-stage-reminder-v1";
    private static final String STAGE_REMINDER_EMAIL_TEMPLATE_KEY = "event-stage-reminder-v1";
    private static final String EVENT_DEFINITION_CHANGED_NOTIFICATION_TEMPLATE_KEY = "event-definition-changed-v1";
    private static final String EVENT_DEFINITION_CHANGED_EMAIL_TEMPLATE_KEY = "event-definition-changed-v1";
    private static final String OWNER_TYPE_EVENT = "event";

    private final MongoTemplate mongoTemplate;
    private final ScheduledMessageTasksRepository scheduledMessageTasksRepository;
    private final UsersRepository usersRepository;
    private final UserSessionActionsRepository userSessionActionsRepository;
    private final ScheduledMessageAuditService scheduledMessageAuditService;
    private final EmailOutboxRepository emailOutboxRepository;
    private final EmailTemplatesRepository emailTemplatesRepository;
    private final NotificationTemplatesRepository notificationTemplatesRepository;
    private final ObjectProvider<ActivitiesMembersService> activitiesMembersServiceProvider;
    private final ObjectProvider<ScheduledNotificationDeliveryService> scheduledNotificationDeliveryServiceProvider;
    private final ObjectProvider<EmailTemplateRenderer> emailTemplateRendererProvider;
    private final ObjectProvider<EmailProviderGateway> emailProviderGatewayProvider;
    private final ObjectProvider<EmailProperties> emailPropertiesProvider;
    private final ObjectProvider<ConfigProperties> configPropertiesProvider;
    private final AffinityRecomputeTaskService affinityRecomputeTaskService;
    private ObjectProvider<NotificationRuleRegistryService> notificationRuleRegistryServiceProvider;
    private ScheduledMongoSessionRunner scheduledMongoSessionRunner;
    private final ScheduledExecutorService taskExecutor = Executors.newSingleThreadScheduledExecutor(runnable -> {
        Thread thread = new Thread(runnable, "scheduled-message-task-controller");
        thread.setDaemon(true);
        return thread;
    });
    private final Map<String, ScheduledMessageTask> scheduledTaskState = new ConcurrentHashMap<>();
    private final Map<String, ScheduledFuture<?>> scheduledWorkers = new ConcurrentHashMap<>();
    private final Map<String, String> scheduledWorkerDueAt = new ConcurrentHashMap<>();

    @Value("${scheduled-messages.worker-lookahead-ms:60000}")
    private long workerLookaheadMs;

    public ScheduledMessageTaskService(
            MongoTemplate mongoTemplate,
            ScheduledMessageTasksRepository scheduledMessageTasksRepository,
            UsersRepository usersRepository,
            UserSessionActionsRepository userSessionActionsRepository,
            ScheduledMessageAuditService scheduledMessageAuditService,
            EmailOutboxRepository emailOutboxRepository,
            EmailTemplatesRepository emailTemplatesRepository,
            NotificationTemplatesRepository notificationTemplatesRepository,
            ObjectProvider<ActivitiesMembersService> activitiesMembersServiceProvider,
            ObjectProvider<ScheduledNotificationDeliveryService> scheduledNotificationDeliveryServiceProvider,
            ObjectProvider<EmailTemplateRenderer> emailTemplateRendererProvider,
            ObjectProvider<EmailProviderGateway> emailProviderGatewayProvider,
            ObjectProvider<EmailProperties> emailPropertiesProvider,
            ObjectProvider<ConfigProperties> configPropertiesProvider,
            AffinityRecomputeTaskService affinityRecomputeTaskService) {
        this.mongoTemplate = mongoTemplate;
        this.scheduledMessageTasksRepository = scheduledMessageTasksRepository;
        this.usersRepository = usersRepository;
        this.userSessionActionsRepository = userSessionActionsRepository;
        this.scheduledMessageAuditService = scheduledMessageAuditService;
        this.emailOutboxRepository = emailOutboxRepository;
        this.emailTemplatesRepository = emailTemplatesRepository;
        this.notificationTemplatesRepository = notificationTemplatesRepository;
        this.activitiesMembersServiceProvider = activitiesMembersServiceProvider;
        this.scheduledNotificationDeliveryServiceProvider = scheduledNotificationDeliveryServiceProvider;
        this.emailTemplateRendererProvider = emailTemplateRendererProvider;
        this.emailProviderGatewayProvider = emailProviderGatewayProvider;
        this.emailPropertiesProvider = emailPropertiesProvider;
        this.configPropertiesProvider = configPropertiesProvider;
        this.affinityRecomputeTaskService = affinityRecomputeTaskService;
    }

    @org.springframework.beans.factory.annotation.Autowired(required = false)
    void setNotificationRuleRegistryServiceProvider(
            ObjectProvider<NotificationRuleRegistryService> notificationRuleRegistryServiceProvider) {
        this.notificationRuleRegistryServiceProvider = notificationRuleRegistryServiceProvider;
    }

    @org.springframework.beans.factory.annotation.Autowired(required = false)
    void setScheduledMongoSessionRunner(ScheduledMongoSessionRunner scheduledMongoSessionRunner) {
        this.scheduledMongoSessionRunner = scheduledMongoSessionRunner;
    }

    @PreDestroy
    public void shutdown() {
        scheduledWorkers.values().forEach(worker -> worker.cancel(false));
        scheduledTaskState.clear();
        scheduledWorkers.clear();
        scheduledWorkerDueAt.clear();
        taskExecutor.shutdownNow();
    }

    @Scheduled(fixedDelayString = "${scheduled-messages.task-poll-delay-ms:1800000}")
    public void runDueTasks() {
        if (scheduledMongoSessionRunner == null) {
            runDueTasksForCurrentDatabase();
            return;
        }
        scheduledMongoSessionRunner.runAcrossConfiguredDatabases(this::runDueTasksForCurrentDatabase);
    }

    private void runDueTasksForCurrentDatabase() {
        Instant startedAt = Instant.now();
        NotificationRuleRegistryService registry = notificationRuleRegistry();
        boolean ruleConfigured = registry != null
                && registry.findRule(NotificationRuleRegistryService.RULE_SCHEDULED_MESSAGES).isPresent();
        if (ruleConfigured && !registry.shouldRunScheduledRule(
                NotificationRuleRegistryService.RULE_SCHEDULED_MESSAGES,
                startedAt)) {
            return;
        }
        if (ruleConfigured) {
            registry.beginRun(
                    NotificationRuleRegistryService.RULE_SCHEDULED_MESSAGES,
                    "Scheduled message task poll started.",
                    UPDATED_BY,
                    startedAt);
        }
        try {
            reconcileLocalWorkersFromDb();
            Instant horizon = startedAt.plusMillis(workerLookaheadMs());
            Query query = Query.query(Criteria
                    .where("status").is(STATUS_SCHEDULED)
                    .and("suspended").ne(Boolean.TRUE)
                    .and("dueAtIso").lte(horizon.toString()))
                    .with(Sort.by(Sort.Direction.ASC, "dueAtIso"))
                    .limit(MAX_DUE_TASKS);
            List<ScheduledMessageTask> dueTasks = mongoTemplate.find(query, ScheduledMessageTask.class);
            for (ScheduledMessageTask task : dueTasks) {
                scheduleLocalWorker(task);
            }
            if (ruleConfigured) {
                registry.recordRun(
                        NotificationRuleRegistryService.RULE_SCHEDULED_MESSAGES,
                        dueTasks.size(),
                        "completed",
                        "Scheduled due message tasks for local execution.",
                        UPDATED_BY,
                        startedAt);
            }
        } catch (RuntimeException exception) {
            if (ruleConfigured) {
                registry.recordRun(
                        NotificationRuleRegistryService.RULE_SCHEDULED_MESSAGES,
                        0,
                        "failed",
                        safeText(exception.getMessage()),
                        UPDATED_BY,
                        startedAt);
            }
            throw exception;
        }
    }

    private void reconcileLocalWorkersFromDb() {
        String modePrefix = localWorkerPrefix();
        for (String workerKey : List.copyOf(scheduledTaskState.keySet())) {
            if (!workerKey.startsWith(modePrefix)) {
                continue;
            }
            String taskKey = workerKey.substring(modePrefix.length());
            ScheduledMessageTask latest = scheduledMessageTasksRepository.findByTaskKey(safeText(taskKey)).orElse(null);
            if (latest == null || !isRunnableTask(latest)) {
                cancelLocalWorker(taskKey);
                scheduledTaskState.remove(workerKey);
                continue;
            }
            scheduleLocalWorker(latest);
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
        ScheduledMessageTask saved = saveRunnableTask(task);
        scheduleLocalWorker(saved);
        return saved;
    }

    public List<ScheduledMessageTask> scheduleEventStageReminders(ActivityEvent event, String actorUserId) {
        String eventId = normalizeId(event == null ? null : event.getSourceId());
        if (!StringUtils.hasText(eventId)) {
            eventId = normalizeId(event == null ? null : event.getId());
        }
        if (!StringUtils.hasText(eventId)) {
            return List.of();
        }
        if (event == null || Boolean.FALSE.equals(event.getPublished()) || Boolean.TRUE.equals(event.getIsTrashed())) {
            return suspendEventStageReminders(eventId, actorUserId);
        }

        Instant now = Instant.now();
        String nowIso = now.toString();
        String updatedBy = updatedBy(actorUserId);
        List<ScheduledMessageTask> savedTasks = new ArrayList<>();
        Set<String> activeTaskKeys = new LinkedHashSet<>();
        int index = 0;
        for (SubEventItem subEvent : safeSubEvents(event)) {
            String subEventId = stageReminderSubEventId(subEvent, index);
            Instant stageStartAt = resolveStageStartAt(event, subEvent);
            index++;
            if (!StringUtils.hasText(subEventId) || stageStartAt == null || !stageStartAt.isAfter(now)) {
                continue;
            }

            Instant dueAt = stageStartAt.minus(STAGE_REMINDER_LEAD_MINUTES, ChronoUnit.MINUTES);
            if (dueAt.isBefore(now)) {
                dueAt = now;
            }
            String taskKey = eventStageReminderTaskKey(eventId, subEventId);
            activeTaskKeys.add(taskKey);

            ScheduledMessageTask task = scheduledMessageTasksRepository.findByTaskKey(taskKey).orElseGet(ScheduledMessageTask::new);
            if (!StringUtils.hasText(task.getId())) {
                task.setId(new ObjectId().toHexString());
            }
            if (!StringUtils.hasText(task.getSyncKey())) {
                task.setSyncKey(UUID.randomUUID().toString());
            }
            if (!StringUtils.hasText(task.getCreatedDate())) {
                task.setCreatedDate(nowIso);
                task.setCreatedUser(updatedBy);
            }
            task.setTaskKey(taskKey);
            task.setActionKey(ACTION_EVENT_STAGE_REMINDER);
            task.setEventId(eventId);
            task.setSubEventId(subEventId);
            task.setNotificationTemplateKey(STAGE_REMINDER_NOTIFICATION_TEMPLATE_KEY);
            task.setEmailTemplateKey(STAGE_REMINDER_EMAIL_TEMPLATE_KEY);
            task.setDueAtIso(dueAt.toString());
            task.setStatus(STATUS_SCHEDULED);
            task.setSuspended(Boolean.FALSE);
            task.setPayload(stageReminderPayload(event, subEvent, stageStartAt));
            task.setUpdatedDate(nowIso);
            task.setUpdatedUser(updatedBy);

            ScheduledMessageTask saved = saveRunnableTask(task);
            scheduleLocalWorker(saved);
            savedTasks.add(saved);
        }

        for (ScheduledMessageTask existing : scheduledMessageTasksRepository.findByEventIdAndActionKey(eventId, ACTION_EVENT_STAGE_REMINDER)) {
            if (activeTaskKeys.contains(safeText(existing.getTaskKey()))) {
                continue;
            }
            savedTasks.add(suspendTask(existing, updatedBy, nowIso));
        }
        return savedTasks;
    }

    public List<ScheduledMessageTask> suspendEventStageReminders(String eventId, String actorUserId) {
        String normalizedEventId = normalizeId(eventId);
        if (!StringUtils.hasText(normalizedEventId)) {
            return List.of();
        }
        String nowIso = Instant.now().toString();
        String updatedBy = updatedBy(actorUserId);
        List<ScheduledMessageTask> savedTasks = new ArrayList<>();
        for (ScheduledMessageTask task : scheduledMessageTasksRepository.findByEventIdAndActionKey(normalizedEventId, ACTION_EVENT_STAGE_REMINDER)) {
            savedTasks.add(suspendTask(task, updatedBy, nowIso));
        }
        return savedTasks;
    }

    public ScheduledMessageTask scheduleEventDefinitionChanged(
            String eventId,
            String eventTitle,
            Collection<String> audienceUserIds,
            Collection<String> reasons,
            String actorUserId) {
        String normalizedEventId = normalizeId(eventId);
        if (!StringUtils.hasText(normalizedEventId)) {
            return null;
        }
        LinkedHashSet<String> normalizedAudience = normalizeIds(audienceUserIds);
        if (normalizedAudience.isEmpty()) {
            return null;
        }
        String nowIso = Instant.now().toString();
        String updatedBy = updatedBy(actorUserId);
        String taskKey = eventDefinitionChangedTaskKey(normalizedEventId);
        ScheduledMessageTask task = scheduledMessageTasksRepository.findByTaskKey(taskKey).orElseGet(ScheduledMessageTask::new);
        if (!StringUtils.hasText(task.getId())) {
            task.setId(new ObjectId().toHexString());
        }
        if (!StringUtils.hasText(task.getSyncKey())) {
            task.setSyncKey(UUID.randomUUID().toString());
        }
        if (!StringUtils.hasText(task.getCreatedDate())) {
            task.setCreatedDate(nowIso);
            task.setCreatedUser(updatedBy);
        }
        task.setTaskKey(taskKey);
        task.setActionKey(ACTION_EVENT_DEFINITION_CHANGED);
        task.setEventId(normalizedEventId);
        task.setNotificationTemplateKey(EVENT_DEFINITION_CHANGED_NOTIFICATION_TEMPLATE_KEY);
        task.setEmailTemplateKey(EVENT_DEFINITION_CHANGED_EMAIL_TEMPLATE_KEY);
        task.setDueAtIso(nowIso);
        task.setStatus(STATUS_SCHEDULED);
        task.setSuspended(Boolean.FALSE);
        task.setPayload(eventDefinitionChangedPayload(eventTitle, normalizedAudience, reasons));
        task.setUpdatedDate(nowIso);
        task.setUpdatedUser(updatedBy);
        ScheduledMessageTask saved = saveRunnableTask(task);
        scheduleLocalWorker(saved);
        return saved;
    }

    public void acceptTaskMetadata(ScheduledMessageTask task) {
        scheduleLocalWorker(task);
    }

    private void scheduleLocalWorker(ScheduledMessageTask task) {
        String taskKey = safeText(task == null ? null : task.getTaskKey());
        if (task == null || !StringUtils.hasText(taskKey)) {
            return;
        }
        String workerKey = localWorkerKey(taskKey);
        Instant dueAt = parseInstant(task.getDueAtIso());
        if (!isRunnableTask(task) || dueAt == null) {
            cancelLocalWorker(taskKey);
            scheduledTaskState.remove(workerKey);
            return;
        }
        scheduledTaskState.put(workerKey, copyTask(task));
        Instant now = Instant.now();
        long delayMs = Math.max(0L, Duration.between(now, dueAt).toMillis());
        if (delayMs > workerLookaheadMs()) {
            cancelLocalWorker(taskKey);
            return;
        }

        String dueAtIso = dueAt.toString();
        ScheduledFuture<?> current = scheduledWorkers.get(workerKey);
        if (current != null && !current.isDone() && dueAtIso.equals(scheduledWorkerDueAt.get(workerKey))) {
            return;
        }
        cancelLocalWorker(taskKey);
        MongoSessionMode sessionMode = MongoSessionModeContext.currentMode();
        ScheduledFuture<?> worker = taskExecutor.schedule(
                () -> withMongoSessionMode(sessionMode, () -> runLocalWorker(taskKey, dueAtIso)),
                delayMs,
                TimeUnit.MILLISECONDS);
        scheduledWorkers.put(workerKey, worker);
        scheduledWorkerDueAt.put(workerKey, dueAtIso);
    }

    private void cancelLocalWorker(String taskKey) {
        String workerKey = localWorkerKey(taskKey);
        ScheduledFuture<?> current = scheduledWorkers.remove(workerKey);
        scheduledWorkerDueAt.remove(workerKey);
        if (current != null) {
            current.cancel(false);
        }
    }

    private String localWorkerKey(String taskKey) {
        return localWorkerPrefix() + safeText(taskKey);
    }

    private String localWorkerPrefix() {
        return MongoSessionModeContext.currentMode().name() + ":";
    }

    private void withMongoSessionMode(MongoSessionMode sessionMode, Runnable action) {
        MongoSessionMode previousMode = MongoSessionModeContext.currentMode();
        try {
            MongoSessionModeContext.set(sessionMode);
            action.run();
        } finally {
            MongoSessionModeContext.set(previousMode);
        }
    }

    private void runLocalWorker(String taskKey, String expectedDueAtIso) {
        String workerKey = localWorkerKey(taskKey);
        scheduledWorkers.remove(workerKey);
        scheduledWorkerDueAt.remove(workerKey);
        ScheduledMessageTask latest = scheduledTaskState.get(workerKey);
        if (!isRunnableTask(latest)) {
            return;
        }
        Instant dueAt = parseInstant(latest.getDueAtIso());
        if (dueAt == null) {
            return;
        }
        if (!dueAt.toString().equals(safeText(expectedDueAtIso)) || dueAt.isAfter(Instant.now())) {
            scheduleLocalWorker(latest);
            return;
        }
        runTask(latest);
    }

    private void runTask(ScheduledMessageTask dueTask) {
        String taskKey = safeText(dueTask == null ? null : dueTask.getTaskKey());
        if (!StringUtils.hasText(taskKey)) {
            return;
        }
        NotificationRuleRegistryService registry = notificationRuleRegistry();
        if (registry != null
                && registry.findRule(NotificationRuleRegistryService.RULE_SCHEDULED_MESSAGES).isPresent()
                && !registry.findRule(NotificationRuleRegistryService.RULE_SCHEDULED_MESSAGES)
                        .map(rule -> Boolean.TRUE.equals(rule.getEnabled()))
                        .orElse(false)) {
            return;
        }
        ScheduledMessageTask task = copyTask(dueTask);
        if (!isRunnableTask(task)) {
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
                case ACTION_EVENT_STAGE_REMINDER -> markStageReminderDue(task, runId);
                case ACTION_EVENT_DEFINITION_CHANGED -> notifyEventDefinitionChanged(task, runId);
                default -> new TaskResult(STATUS_FAILED, 0, "Unknown scheduled action.");
            };
            finishTask(task, result.status(), result.count(), result.detail());
            if (!STATUS_SCHEDULED.equals(result.status())) {
                scheduledTaskState.remove(localWorkerKey(taskKey));
                cancelLocalWorker(taskKey);
            }
            scheduledMessageAuditService.finishRun(
                    runId,
                    result.count(),
                    result.notificationCount(),
                    result.emailQueuedCount(),
                    result.failedCount() > 0 ? result.failedCount() : (STATUS_FAILED.equals(result.status()) ? 1 : 0),
                    result.status(),
                    result.detail());
        } catch (Exception exception) {
            LOGGER.warn("Scheduled task {} failed.", taskKey, exception);
            String detail = safeText(exception.getMessage());
            finishTask(task, STATUS_FAILED, 0, detail);
            scheduledTaskState.remove(localWorkerKey(taskKey));
            cancelLocalWorker(taskKey);
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
        affinityRecomputeTaskService.enqueueAdminStatusChanged(userId);
        scheduledMessageAuditService.recordDelivery(runId, task, user, "action", STATUS_COMPLETED, "Profile set to inactive.");
        return new TaskResult(STATUS_COMPLETED, 1, "Profile set to inactive.");
    }

    private TaskResult markStageReminderDue(ScheduledMessageTask task, String runId) {
        if (task == null) {
            return new TaskResult(STATUS_SKIPPED, 0, "No stage reminder task available.");
        }
        String eventId = normalizeId(task.getEventId());
        ActivitiesMembersService activitiesMembersService = activitiesMembersServiceProvider.getIfAvailable();
        if (!StringUtils.hasText(eventId) || activitiesMembersService == null) {
            return new TaskResult(STATUS_SKIPPED, 0, "No event audience available.");
        }

        ActivitiesMembersService.OwnerMembersSnapshot snapshot =
                activitiesMembersService.queryOwnerSnapshot(OWNER_TYPE_EVENT, eventId);
        Set<String> userIds = new LinkedHashSet<>(snapshot == null ? List.of() : snapshot.acceptedMemberUserIds());
        userIds.removeIf(userId -> !StringUtils.hasText(safeText(userId)));
        if (userIds.isEmpty()) {
            return new TaskResult(STATUS_COMPLETED, 0, "Stage reminder had no accepted members.");
        }

        NotificationTemplate notificationTemplate = resolveNotificationTemplate(task);
        EmailTemplate emailTemplate = resolveEmailTemplate(task);
        ScheduledNotificationDeliveryService notificationDeliveryService =
                scheduledNotificationDeliveryServiceProvider.getIfAvailable();
        EmailTemplateRenderer emailTemplateRenderer = emailTemplateRendererProvider.getIfAvailable();
        List<EmailOutboxItem> outboxItems = new ArrayList<>();
        int notificationCount = 0;
        int emailQueuedCount = 0;
        int failedCount = 0;
        int affectedCount = 0;
        String nowIso = Instant.now().toString();

        for (Users user : usersRepository.findByUserIdIn(userIds)) {
            if (user == null || isDeleted(user)) {
                continue;
            }
            Map<String, String> variables = stageReminderVariables(task, user);
            boolean notificationAccepted = notificationTemplate != null
                    && notificationDeliveryService != null
                    && notificationDeliveryService.send(user, notificationTemplate, variables, safeText(task.getTaskKey()));
            if (notificationAccepted) {
                notificationCount += 1;
                scheduledMessageAuditService.recordDelivery(
                        runId,
                        task,
                        user,
                        "notification",
                        "sent",
                        "Notification accepted.");
            }
            if (notificationAccepted && firebaseEnabled()) {
                affectedCount += 1;
                continue;
            }
            if (!emailEnabled() || emailTemplate == null || emailTemplateRenderer == null || !StringUtils.hasText(safeText(user.getEmail()))) {
                if (notificationAccepted) {
                    affectedCount += 1;
                    continue;
                }
                failedCount += 1;
                scheduledMessageAuditService.recordDelivery(runId, task, user, "none", STATUS_SKIPPED, "No enabled delivery channel.");
                continue;
            }

            EmailOutboxItem outboxItem = buildTemplateOutboxItem(task, user, emailTemplate, emailTemplateRenderer, variables, nowIso);
            if (outboxItem == null) {
                if (notificationAccepted) {
                    affectedCount += 1;
                }
                failedCount += 1;
                scheduledMessageAuditService.recordDelivery(runId, task, user, "email", STATUS_FAILED, "Email template rendered empty content.");
                continue;
            }
            outboxItems.add(outboxItem);
            emailQueuedCount += 1;
            affectedCount += 1;
            scheduledMessageAuditService.recordDelivery(runId, task, user, "email", "queued", "Email fallback queued.");
        }
        if (!outboxItems.isEmpty()) {
            emailOutboxRepository.saveAll(outboxItems);
        }

        return new TaskResult(
                STATUS_COMPLETED,
                affectedCount,
                notificationCount,
                emailQueuedCount,
                failedCount,
                "Stage reminder delivered: notifications " + notificationCount
                        + ", emails queued " + emailQueuedCount
                        + ", skipped " + failedCount + ".");
    }

    private TaskResult notifyEventDefinitionChanged(ScheduledMessageTask task, String runId) {
        if (task == null) {
            return new TaskResult(STATUS_SKIPPED, 0, "No event change task available.");
        }
        Set<String> userIds = eventDefinitionChangedAudienceUserIds(task);
        if (userIds.isEmpty()) {
            return new TaskResult(STATUS_COMPLETED, 0, "Event change notification had no audience.");
        }

        NotificationTemplate notificationTemplate = resolveNotificationTemplate(task);
        EmailTemplate emailTemplate = resolveEmailTemplate(task);
        ScheduledNotificationDeliveryService notificationDeliveryService =
                scheduledNotificationDeliveryServiceProvider.getIfAvailable();
        EmailTemplateRenderer emailTemplateRenderer = emailTemplateRendererProvider.getIfAvailable();
        List<EmailOutboxItem> outboxItems = new ArrayList<>();
        int notificationCount = 0;
        int emailQueuedCount = 0;
        int failedCount = 0;
        int affectedCount = 0;
        String nowIso = Instant.now().toString();

        for (Users user : usersRepository.findByUserIdIn(userIds)) {
            if (user == null || isDeleted(user)) {
                continue;
            }
            Map<String, String> variables = eventDefinitionChangedVariables(task, user);
            boolean notificationAccepted = notificationTemplate != null
                    && notificationDeliveryService != null
                    && notificationDeliveryService.send(user, notificationTemplate, variables, safeText(task.getTaskKey()));
            if (notificationAccepted) {
                notificationCount += 1;
                scheduledMessageAuditService.recordDelivery(
                        runId,
                        task,
                        user,
                        "notification",
                        "sent",
                        "Notification accepted.");
            }
            if (notificationAccepted && firebaseEnabled()) {
                affectedCount += 1;
                continue;
            }
            if (!emailEnabled() || emailTemplate == null || emailTemplateRenderer == null || !StringUtils.hasText(safeText(user.getEmail()))) {
                if (notificationAccepted) {
                    affectedCount += 1;
                    continue;
                }
                failedCount += 1;
                scheduledMessageAuditService.recordDelivery(runId, task, user, "none", STATUS_SKIPPED, "No enabled delivery channel.");
                continue;
            }

            EmailOutboxItem outboxItem = buildTemplateOutboxItem(task, user, emailTemplate, emailTemplateRenderer, variables, nowIso);
            if (outboxItem == null) {
                if (notificationAccepted) {
                    affectedCount += 1;
                }
                failedCount += 1;
                scheduledMessageAuditService.recordDelivery(runId, task, user, "email", STATUS_FAILED, "Email template rendered empty content.");
                continue;
            }
            outboxItems.add(outboxItem);
            emailQueuedCount += 1;
            affectedCount += 1;
            scheduledMessageAuditService.recordDelivery(runId, task, user, "email", "queued", "Email fallback queued.");
        }
        if (!outboxItems.isEmpty()) {
            emailOutboxRepository.saveAll(outboxItems);
        }

        return new TaskResult(
                STATUS_COMPLETED,
                affectedCount,
                notificationCount,
                emailQueuedCount,
                failedCount,
                "Event change delivered: notifications " + notificationCount
                        + ", emails queued " + emailQueuedCount
                        + ", skipped " + failedCount + ".");
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
        ScheduledMessageTask saved = scheduledMessageTasksRepository.save(task);
        scheduleLocalWorker(saved);
    }

    private void finishTask(ScheduledMessageTask task, String status, int count, String detail) {
        String nowIso = Instant.now().toString();
        boolean pendingCounterTracked = Boolean.TRUE.equals(task.getPendingCounterTracked());
        boolean remainsScheduled = STATUS_SCHEDULED.equals(safeText(status));
        task.setStatus(safeText(status));
        task.setPendingCounterTracked(remainsScheduled && pendingCounterTracked);
        task.setLastRunAtIso(nowIso);
        task.setLastRunStatus(safeText(status));
        task.setLastRunDetail(safeText(detail));
        task.setLastRunCount(Math.max(0, count));
        task.setUpdatedDate(nowIso);
        task.setUpdatedUser(UPDATED_BY);
        ScheduledMessageTask saved = scheduledMessageTasksRepository.save(task);
        if (remainsScheduled) {
            scheduleLocalWorker(saved);
        } else if (pendingCounterTracked) {
            adjustPendingCount(-1);
        }
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

    private boolean isRunnableTask(ScheduledMessageTask task) {
        return task != null
                && !Boolean.TRUE.equals(task.getSuspended())
                && STATUS_SCHEDULED.equals(safeText(task.getStatus()))
                && StringUtils.hasText(safeText(task.getTaskKey()));
    }

    private long workerLookaheadMs() {
        return workerLookaheadMs > 0L ? workerLookaheadMs : DEFAULT_WORKER_LOOKAHEAD_MS;
    }

    private ScheduledMessageTask copyTask(ScheduledMessageTask source) {
        ScheduledMessageTask copy = new ScheduledMessageTask();
        if (source == null) {
            return copy;
        }
        copy.setId(source.getId());
        copy.setSyncKey(source.getSyncKey());
        copy.setTaskKey(source.getTaskKey());
        copy.setActionKey(source.getActionKey());
        copy.setUserId(source.getUserId());
        copy.setEventId(source.getEventId());
        copy.setSubEventId(source.getSubEventId());
        copy.setNotificationTemplateKey(source.getNotificationTemplateKey());
        copy.setEmailTemplateKey(source.getEmailTemplateKey());
        copy.setDueAtIso(source.getDueAtIso());
        copy.setStatus(source.getStatus());
        copy.setSuspended(source.getSuspended());
        copy.setPendingCounterTracked(source.getPendingCounterTracked());
        copy.setLastRunAtIso(source.getLastRunAtIso());
        copy.setLastRunStatus(source.getLastRunStatus());
        copy.setLastRunDetail(source.getLastRunDetail());
        copy.setLastRunCount(source.getLastRunCount());
        copy.setPayload(source.getPayload());
        copy.setCreatedDate(source.getCreatedDate());
        copy.setCreatedUser(source.getCreatedUser());
        copy.setUpdatedDate(source.getUpdatedDate());
        copy.setUpdatedUser(source.getUpdatedUser());
        return copy;
    }

    private ScheduledMessageTask suspendTask(ScheduledMessageTask task, String updatedBy, String nowIso) {
        if (task == null) {
            return null;
        }
        boolean pendingCounterTracked = Boolean.TRUE.equals(task.getPendingCounterTracked());
        task.setSuspended(Boolean.TRUE);
        task.setPendingCounterTracked(false);
        task.setUpdatedDate(nowIso);
        task.setUpdatedUser(StringUtils.hasText(safeText(updatedBy)) ? safeText(updatedBy) : UPDATED_BY);
        ScheduledMessageTask saved = scheduledMessageTasksRepository.save(task);
        if (pendingCounterTracked) {
            adjustPendingCount(-1);
        }
        scheduleLocalWorker(saved);
        return saved;
    }

    private ScheduledMessageTask saveRunnableTask(ScheduledMessageTask task) {
        boolean newlyTracked = !Boolean.TRUE.equals(task.getPendingCounterTracked());
        task.setPendingCounterTracked(true);
        ScheduledMessageTask saved = scheduledMessageTasksRepository.save(task);
        if (newlyTracked) {
            adjustPendingCount(1);
        }
        return saved;
    }

    private void adjustPendingCount(int delta) {
        NotificationRuleRegistryService registry = notificationRuleRegistry();
        if (registry == null || delta == 0) {
            return;
        }
        registry.adjustPendingCount(
                NotificationRuleRegistryService.RULE_SCHEDULED_MESSAGES,
                delta,
                "admin.jobs.rule.scheduled.messages");
    }

    private NotificationRuleRegistryService notificationRuleRegistry() {
        return notificationRuleRegistryServiceProvider == null
                ? null
                : notificationRuleRegistryServiceProvider.getIfAvailable();
    }

    private List<SubEventItem> safeSubEvents(ActivityEvent event) {
        if (event == null || event.getSubEvents() == null) {
            return List.of();
        }
        return event.getSubEvents();
    }

    private String stageReminderSubEventId(SubEventItem subEvent, int index) {
        String id = normalizeId(subEvent == null ? null : subEvent.id());
        if (StringUtils.hasText(id)) {
            return id;
        }
        String name = normalizeId(subEvent == null ? null : subEvent.name());
        if (StringUtils.hasText(name)) {
            String slug = name.toLowerCase().replaceAll("[^a-z0-9_-]+", "-").replaceAll("^-+|-+$", "");
            if (StringUtils.hasText(slug)) {
                return slug;
            }
        }
        return "stage-" + Math.max(0, index + 1);
    }

    private Instant resolveStageStartAt(ActivityEvent event, SubEventItem subEvent) {
        Instant subEventStartAt = parseInstant(subEvent == null ? null : subEvent.startAt());
        if (subEventStartAt != null) {
            return subEventStartAt;
        }
        Instant eventStartAt = parseInstant(event == null ? null : event.getStartAtIso());
        Integer offsetMinutes = subEvent == null ? null : subEvent.slotStartOffsetMinutes();
        if (eventStartAt != null && offsetMinutes != null) {
            return eventStartAt.plus(Math.max(0, offsetMinutes), ChronoUnit.MINUTES);
        }
        return eventStartAt;
    }

    private Map<String, String> stageReminderPayload(ActivityEvent event, SubEventItem subEvent, Instant stageStartAt) {
        Map<String, String> payload = new LinkedHashMap<>();
        putPayload(payload, "eventTitle", event == null ? null : event.getTitle());
        putPayload(payload, "stageName", subEvent == null ? null : subEvent.name());
        putPayload(payload, "stageStartAtIso", stageStartAt == null ? null : stageStartAt.toString());
        putPayload(payload, "leadMinutes", String.valueOf(STAGE_REMINDER_LEAD_MINUTES));
        return payload;
    }

    private Map<String, String> eventDefinitionChangedPayload(
            String eventTitle,
            Collection<String> audienceUserIds,
            Collection<String> reasons) {
        Map<String, String> payload = new LinkedHashMap<>();
        putPayload(payload, "eventTitle", eventTitle);
        putPayload(payload, "audienceUserIds", String.join(",", normalizeIds(audienceUserIds)));
        putPayload(payload, "changeReasons", String.join(",", normalizeStrings(reasons)));
        return payload;
    }

    private void putPayload(Map<String, String> payload, String key, String value) {
        String normalized = safeText(value);
        if (payload != null && StringUtils.hasText(key) && StringUtils.hasText(normalized)) {
            payload.put(key, normalized);
        }
    }

    private NotificationTemplate resolveNotificationTemplate(ScheduledMessageTask task) {
        String templateKey = safeText(task == null ? null : task.getNotificationTemplateKey());
        if (!StringUtils.hasText(templateKey)) {
            return null;
        }
        return notificationTemplatesRepository.findByTemplateKey(templateKey)
                .filter(template -> Boolean.TRUE.equals(template.getEnabled()))
                .orElse(null);
    }

    private EmailTemplate resolveEmailTemplate(ScheduledMessageTask task) {
        String templateKey = safeText(task == null ? null : task.getEmailTemplateKey());
        if (!StringUtils.hasText(templateKey)) {
            return null;
        }
        return emailTemplatesRepository.findByTemplateKey(templateKey)
                .filter(template -> Boolean.TRUE.equals(template.getEnabled()))
                .orElse(null);
    }

    private Map<String, String> stageReminderVariables(ScheduledMessageTask task, Users user) {
        Map<String, String> payload = task == null ? Map.of() : task.getPayload();
        Map<String, String> variables = new LinkedHashMap<>();
        putPayload(variables, "user_name", user == null ? null : user.getName());
        putPayload(variables, "user_first_name", firstName(user == null ? null : user.getName()));
        putPayload(variables, "event_title", payload == null ? null : payload.get("eventTitle"));
        putPayload(variables, "stage_name", payload == null ? null : payload.get("stageName"));
        putPayload(variables, "stage_start_at", payload == null ? null : payload.get("stageStartAtIso"));
        putPayload(variables, "lead_minutes", payload == null ? null : payload.get("leadMinutes"));
        putPayload(variables, "cta_label", "Open event");
        putPayload(variables, "cta_url", baseUrl() + "/game");
        return variables;
    }

    private Map<String, String> eventDefinitionChangedVariables(ScheduledMessageTask task, Users user) {
        Map<String, String> payload = task == null ? Map.of() : task.getPayload();
        Map<String, String> variables = new LinkedHashMap<>();
        putPayload(variables, "user_name", user == null ? null : user.getName());
        putPayload(variables, "user_first_name", firstName(user == null ? null : user.getName()));
        putPayload(variables, "event_title", payload == null ? null : payload.get("eventTitle"));
        putPayload(variables, "change_summary", eventDefinitionChangeSummary(payload == null ? null : payload.get("changeReasons")));
        putPayload(variables, "cta_label", "Open event");
        putPayload(variables, "cta_url", baseUrl() + "/game");
        return variables;
    }

    private EmailOutboxItem buildTemplateOutboxItem(
            ScheduledMessageTask task,
            Users user,
            EmailTemplate template,
            EmailTemplateRenderer renderer,
            Map<String, String> variables,
            String nowIso) {
        String subject = renderer.renderSubject(template.getSubjectTemplate(), variables).trim();
        String htmlBody = renderer.renderHtml(template.getHtmlTemplate(), variables);
        String textBody = renderer.renderText(template.getTextTemplate(), variables);
        if (!StringUtils.hasText(subject) || (!StringUtils.hasText(htmlBody) && !StringUtils.hasText(textBody))) {
            return null;
        }
        EmailOutboxItem item = new EmailOutboxItem();
        item.setId(new ObjectId().toHexString());
        item.setSyncKey(UUID.randomUUID().toString());
        item.setUserId(safeText(user == null ? null : user.getId()));
        item.setRecipientEmail(safeText(user == null ? null : user.getEmail()));
        item.setRecipientName(safeText(user == null ? null : user.getName()));
        item.setTemplateKey(safeText(template.getTemplateKey()));
        item.setRuleKey(safeText(task == null ? null : task.getTaskKey()));
        item.setCategory("event");
        item.setProvider(currentEmailProviderKey());
        item.setStatus(EmailOutboxStatus.PENDING);
        item.setSubject(subject);
        item.setHtmlBody(htmlBody);
        item.setTextBody(textBody);
        item.setTemplateVariables(variables);
        item.setScheduledAt(nowIso);
        item.setAttemptCount(0);
        item.setCreatedDate(nowIso);
        item.setCreatedUser(UPDATED_BY);
        item.setUpdatedDate(nowIso);
        item.setUpdatedUser(UPDATED_BY);
        return item;
    }

    private boolean firebaseEnabled() {
        ConfigProperties configProperties = configPropertiesProvider.getIfAvailable();
        return configProperties != null && configProperties.isFirebaseEnabled();
    }

    private boolean emailEnabled() {
        EmailProperties emailProperties = emailPropertiesProvider.getIfAvailable();
        return emailProperties != null && emailProperties.isEnabled();
    }

    private String currentEmailProviderKey() {
        EmailProviderGateway emailProviderGateway = emailProviderGatewayProvider.getIfAvailable();
        return emailProviderGateway == null ? "noop" : emailProviderGateway.currentProviderKey();
    }

    private String baseUrl() {
        EmailProperties emailProperties = emailPropertiesProvider.getIfAvailable();
        String baseUrl = safeText(emailProperties == null ? null : emailProperties.getBaseUrl()).replaceAll("/+$", "");
        return StringUtils.hasText(baseUrl) ? baseUrl : "http://localhost:4200";
    }

    private String firstName(String name) {
        String normalized = safeText(name);
        if (!StringUtils.hasText(normalized)) {
            return "";
        }
        int index = normalized.indexOf(' ');
        return index <= 0 ? normalized : normalized.substring(0, index);
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

    private String eventStageReminderTaskKey(String eventId, String subEventId) {
        return "event-stage-reminder:" + normalizeId(eventId) + ":" + normalizeId(subEventId);
    }

    private String eventDefinitionChangedTaskKey(String eventId) {
        return "event-definition-changed:" + normalizeId(eventId);
    }

    private Set<String> eventDefinitionChangedAudienceUserIds(ScheduledMessageTask task) {
        Map<String, String> payload = task == null ? Map.of() : task.getPayload();
        LinkedHashSet<String> userIds = normalizeCsv(payload == null ? null : payload.get("audienceUserIds"));
        if (!userIds.isEmpty()) {
            return userIds;
        }
        String eventId = normalizeId(task == null ? null : task.getEventId());
        ActivitiesMembersService activitiesMembersService = activitiesMembersServiceProvider.getIfAvailable();
        if (!StringUtils.hasText(eventId) || activitiesMembersService == null) {
            return Set.of();
        }
        ActivitiesMembersService.OwnerMembersSnapshot snapshot =
                activitiesMembersService.queryOwnerSnapshot(OWNER_TYPE_EVENT, eventId);
        LinkedHashSet<String> fallback = new LinkedHashSet<>();
        if (snapshot != null) {
            fallback.addAll(snapshot.acceptedMemberUserIds());
            fallback.addAll(snapshot.pendingMemberUserIds());
            fallback.addAll(snapshot.invitedMemberUserIds());
            fallback.addAll(snapshot.pendingRequestMemberUserIds());
        }
        fallback.removeIf(userId -> !StringUtils.hasText(safeText(userId)));
        return fallback;
    }

    private String eventDefinitionChangeSummary(String value) {
        LinkedHashSet<String> reasons = normalizeCsv(value);
        if (reasons.isEmpty()) {
            return "The event details changed.";
        }
        if (reasons.contains("deleted")) {
            return "The event was deleted.";
        }
        if (reasons.contains("unpublished")) {
            return "The event was unpublished.";
        }
        if (reasons.contains("schedule")) {
            return "The event schedule changed.";
        }
        if (reasons.contains("sub-events")) {
            return "The sub-event setup changed.";
        }
        return "The event details changed.";
    }

    private LinkedHashSet<String> normalizeIds(Collection<String> values) {
        return normalizeStrings(values).stream()
                .collect(LinkedHashSet::new, Set::add, Set::addAll);
    }

    private List<String> normalizeStrings(Collection<String> values) {
        return values == null
                ? List.of()
                : values.stream()
                        .map(this::safeText)
                        .filter(StringUtils::hasText)
                        .distinct()
                        .toList();
    }

    private LinkedHashSet<String> normalizeCsv(String value) {
        LinkedHashSet<String> result = new LinkedHashSet<>();
        String normalized = safeText(value);
        if (!StringUtils.hasText(normalized)) {
            return result;
        }
        for (String token : normalized.split(",")) {
            String item = safeText(token);
            if (StringUtils.hasText(item)) {
                result.add(item);
            }
        }
        return result;
    }

    private String firstNonBlank(String first, String second) {
        return StringUtils.hasText(safeText(first)) ? safeText(first) : safeText(second);
    }

    private String normalizeId(String value) {
        return safeText(value);
    }

    private String updatedBy(String actorUserId) {
        String normalized = normalizeId(actorUserId);
        return StringUtils.hasText(normalized) ? normalized : UPDATED_BY;
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }

    private record TaskResult(
            String status,
            int count,
            int notificationCount,
            int emailQueuedCount,
            int failedCount,
            String detail) {
        private TaskResult(String status, int count, String detail) {
            this(status, count, 0, 0, 0, detail);
        }
    }
}
