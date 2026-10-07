package com.raxim.myscoutee.domain.notifications.service;

import com.raxim.myscoutee.domain.platform.api.JobGroupContext;
import java.time.Instant;
import com.raxim.myscoutee.domain.email.api.EmailProcessCatalog;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicReference;

import jakarta.annotation.PreDestroy;
import org.springframework.stereotype.Service;

import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.domain.notifications.document.NotificationRuleConfig;
import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminParamFieldDto;
import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminParamOptionDto;
import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminNotificationCenterStateDto;
import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminNotificationChannelsDto;
import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminNotificationMessageDto;
import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminNotificationRuleDto;
import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminScheduledTaskResultDto;
import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminNotificationRuleRunRequestDto;
import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminNotificationRuleRunResultDto;
import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminNotificationRuleSaveRequestDto;
import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminNotificationRunHistoryEntryDto;
import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminNotificationScheduleSlotDto;
import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminNotificationRunStateDto;
import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminNotificationTemplateOptionDto;
import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminNotificationTimingDto;
import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminUserDto;
import com.raxim.myscoutee.domain.content.api.AdministrativeAccess;
import com.raxim.myscoutee.domain.administration.api.OperationalTelemetry;
import com.raxim.myscoutee.domain.events.api.RandomGroupAssignment;

@Service
public class AdminNotificationService implements com.raxim.myscoutee.domain.notifications.api.NotificationAdministration {
    @org.springframework.beans.factory.annotation.Autowired
    private com.raxim.myscoutee.domain.payments.api.ExchangeRateRefresh exchangeRateJob;
    private static final long MIN_EXPECTED_RANDOM_RUN_MILLIS = 1_000L;
    private static final long MAX_EXPECTED_RANDOM_RUN_MILLIS = 60_000L;
    private static final long DEFAULT_EXPECTED_RANDOM_RUN_MILLIS = 5_000L;
    private static final String PROCESS_FILTER_ALL = "all";
    private static final String PROCESS_FILTER_ACTIVE = "active";
    private static final String PROCESS_FILTER_SUSPENDED = "suspended";
    private static final String PROCESS_FILTER_RUNNING = "running";
    private static final String PROCESS_FILTER_FAILED = "failed";
    private static final String PROCESS_STATUS_RUNNING = "running";
    private static final String PROCESS_STATUS_SUSPENDED = "suspended";
    private static final String PROCESS_STATUS_FAILED = "failed";
    private static final String PROCESS_STATUS_READY = "ready";
    private static final Set<String> PROCESS_PROBLEM_STATUSES = Set.of("failed", "error", "missed", "skipped");

    private final NotificationRuleRegistryService notificationRuleRegistryService;
    private final EmailProcessCatalog emailCatalog;
    private final RandomGroupAssignment eventScheduler;
    private final AdministrativeAccess adminModerationService;
    private final OperationalTelemetry adminTelemetryService;
    private final AtomicInteger expectedRandomRunMillis = new AtomicInteger((int) DEFAULT_EXPECTED_RANDOM_RUN_MILLIS);
    private final ExecutorService runExecutor = Executors.newFixedThreadPool(2, runnable -> {
        Thread thread = new Thread(runnable, "admin-notification-runner");
        thread.setDaemon(true);
        return thread;
    });
    private final ScheduledExecutorService progressHeartbeatExecutor = Executors.newSingleThreadScheduledExecutor(runnable -> {
        Thread thread = new Thread(runnable, "admin-notification-progress");
        thread.setDaemon(true);
        return thread;
    });

    public AdminNotificationService(
            NotificationRuleRegistryService notificationRuleRegistryService,
            EmailProcessCatalog emailCatalog,
            RandomGroupAssignment eventScheduler,
            AdministrativeAccess adminModerationService,
            OperationalTelemetry adminTelemetryService) {
        this.notificationRuleRegistryService = notificationRuleRegistryService;
        this.emailCatalog = emailCatalog;
        this.eventScheduler = eventScheduler;
        this.adminModerationService = adminModerationService;
        this.adminTelemetryService = adminTelemetryService;
    }

    @PreDestroy
    public void shutdown() {
        runExecutor.shutdownNow();
        progressHeartbeatExecutor.shutdownNow();
    }

    public AdminNotificationCenterStateDto state(String adminUserId, String filter) {
        String groupId = adminModerationService.baseGroupId(adminUserId);
        return JobGroupContext.call(groupId, () -> stateInGroup(adminUserId, filter));
    }

    private AdminNotificationCenterStateDto stateInGroup(String adminUserId, String filter) {
        adminModerationService.resolveAdminActor(adminUserId);
        return toState(notificationRuleRegistryService.rules(), filter);
    }

    public AdminNotificationRuleDto ruleState(String ruleKey, String adminUserId) {
        String groupId = adminModerationService.baseGroupId(adminUserId);
        return JobGroupContext.call(groupId, () -> ruleStateInGroup(ruleKey, adminUserId));
    }

    private AdminNotificationRuleDto ruleStateInGroup(String ruleKey, String adminUserId) {
        adminModerationService.resolveAdminActor(adminUserId);
        NotificationRuleConfig rule = notificationRuleRegistryService.findRule(ruleKey).orElse(null);
        return rule == null ? null : toDto(rule);
    }

    public AdminNotificationCenterStateDto save(AdminNotificationRuleSaveRequestDto request, String filter) {
        String groupId = adminModerationService.baseGroupId(request == null ? null : request.adminUserId());
        return JobGroupContext.call(groupId, () -> saveInGroup(request, filter));
    }

    private AdminNotificationCenterStateDto saveInGroup(AdminNotificationRuleSaveRequestDto request, String filter) {
        AdminUserDto admin = adminModerationService.resolveAdminActor(request == null ? null : request.adminUserId());
        List<NotificationRuleConfig> documents = request == null || request.rules() == null
                ? List.of()
                : request.rules().stream().map(this::toDocument).toList();
        AdminNotificationCenterStateDto state = toState(
                notificationRuleRegistryService.saveRules(documents, admin.id()),
                filter);
        adminTelemetryService.record("jobs.config.saved", "jobs", "", admin.id(), documents.size());
        return state;
    }

    public AdminNotificationRuleRunResultDto run(String ruleKey, AdminNotificationRuleRunRequestDto request) {
        String groupId = adminModerationService.baseGroupId(request == null ? null : request.adminUserId());
        return JobGroupContext.call(groupId, () -> runInGroup(ruleKey, request));
    }

    private AdminNotificationRuleRunResultDto runInGroup(String ruleKey, AdminNotificationRuleRunRequestDto request) {
        String normalizedRuleKey = safeText(ruleKey);
        String requestedAdminUserId = safeText(request == null ? null : request.adminUserId());
        RandomRunProgress progress = NotificationRuleRegistryService.RULE_EVENT_RANDOM_GROUPS.equals(normalizedRuleKey)
                ? startRandomRunProgress(normalizedRuleKey, requestedAdminUserId)
                : null;
        NotificationRuleConfig rule = null;
        try {
            AdminUserDto admin = adminModerationService.resolveAdminActor(requestedAdminUserId);
            if (progress != null) {
                progress.setAdminUserId(admin.id());
            }
            rule = notificationRuleRegistryService.findRule(normalizedRuleKey).orElse(null);
            if (progress != null) {
                progress.adoptRule(rule);
            }
            if (rule == null) {
                if (progress != null) {
                    progress.close();
                }
                return new AdminNotificationRuleRunResultDto(normalizedRuleKey, normalizedRuleKey, 0, "skipped",
                        "Rule was not found.", Instant.now().toString());
            }
            if (!Boolean.TRUE.equals(rule.getManualRunEnabled())) {
                if (progress != null) {
                    progress.close();
                }
                return new AdminNotificationRuleRunResultDto(
                        normalizedRuleKey,
                        safeText(rule.getLabel()),
                        0,
                        "skipped",
                        "This scheduled process does not support manual execution.",
                        Instant.now().toString());
            }
            if (!Boolean.TRUE.equals(rule.getEnabled())) {
                if (progress != null) {
                    progress.close();
                }
                return new AdminNotificationRuleRunResultDto(
                        normalizedRuleKey,
                        safeText(rule.getLabel()),
                        0,
                        "skipped",
                        "This scheduled process is suspended.",
                        Instant.now().toString());
            }
            NotificationRuleConfig startedRule = progress == null
                    ? notificationRuleRegistryService.beginRun(normalizedRuleKey, "Manual start requested.", admin.id())
                    : notificationRuleRegistryService.beginRun(normalizedRuleKey, "Manual start requested.", admin.id(), progress.startedAt());
            if (startedRule == null) {
                if (progress != null) {
                    progress.close();
                }
                return new AdminNotificationRuleRunResultDto(
                        normalizedRuleKey,
                        safeText(rule.getLabel()),
                        0,
                        "skipped",
                        "This scheduled process is already running.",
                        Instant.now().toString());
            }
            if (progress != null) {
                progress.adoptRule(startedRule);
            }
            switch (normalizedRuleKey) {
                case com.raxim.myscoutee.domain.payments.api.ExchangeRateRefresh.KEY -> {
                    MongoSessionMode sessionMode = MongoSessionModeContext.currentMode();
                    String jobGroupId = JobGroupContext.groupId();
                    Instant started = Instant.parse(startedAtIso(startedRule));
                    runExecutor.submit(() -> runWithMongoSessionMode(sessionMode, () -> JobGroupContext.run(jobGroupId, () -> exchangeRateJob.run(admin.id(), started))));
                    return new AdminNotificationRuleRunResultDto(normalizedRuleKey, safeText(rule.getLabel()), 0,
                            "running", "Exchange-rate refresh started.", started.toString());
                }
                case NotificationRuleRegistryService.RULE_EVENT_RANDOM_GROUPS -> {
                    RandomRunProgress runProgress = progress;
                    MongoSessionMode sessionMode = MongoSessionModeContext.currentMode();
                    String jobGroupId = JobGroupContext.groupId();
                    runExecutor.submit(() -> runWithMongoSessionMode(
                            sessionMode,
                            () -> JobGroupContext.run(jobGroupId, () -> runRandomEventGroups(normalizedRuleKey, admin.id(), startedRule, runProgress))));
                    String startedAtIso = startedAtIso(startedRule);
                    return new AdminNotificationRuleRunResultDto(
                            normalizedRuleKey,
                            safeText(rule.getLabel()),
                            0,
                            "running",
                            "Manual matched room assignment started.",
                            startedAtIso);
                }
                default -> {
                    NotificationRuleConfig updated = notificationRuleRegistryService.recordRun(
                            normalizedRuleKey,
                            0,
                            "skipped",
                            "This rule is action driven and has no manual worker.",
                            admin.id());
                    String ranAtIso = updated == null || updated.getRunState() == null
                            ? Instant.now().toString()
                            : updated.getRunState().getLastRunAtIso();
                    return new AdminNotificationRuleRunResultDto(
                            normalizedRuleKey,
                            safeText(rule.getLabel()),
                            0,
                            "skipped",
                            "This rule is action driven and has no manual worker.",
                            ranAtIso);
                }
            }
        } catch (Exception exception) {
            if (progress != null) {
                progress.close();
            }
            NotificationRuleConfig updated = notificationRuleRegistryService.recordRun(
                    normalizedRuleKey,
                    0,
                    "failed",
                    safeText(exception.getMessage()),
                    requestedAdminUserId,
                    progress == null ? null : progress.startedAt());
            String ranAtIso = updated == null || updated.getRunState() == null
                    ? Instant.now().toString()
                    : updated.getRunState().getLastRunAtIso();
            return new AdminNotificationRuleRunResultDto(
                    normalizedRuleKey,
                    safeText(rule == null ? normalizedRuleKey : rule.getLabel()),
                    0,
                    "failed",
                    safeText(exception.getMessage()),
                    ranAtIso);
        }
    }

    private void runRandomEventGroups(
            String ruleKey,
            String adminUserId,
            NotificationRuleConfig startedRule,
            RandomRunProgress progress) {
        int claimedPendingCount = notificationRuleRegistryService.claimPendingCount(ruleKey);
        try {
            if (progress != null) {
                progress.setAdminUserId(adminUserId);
                progress.adoptRule(notificationRuleRegistryService.findRule(ruleKey).orElse(startedRule));
                progress.raiseTo(1, "Loading published events for matched rooms.");
            }
            var assignment = eventScheduler.assignRandomGroups(planProgress -> {
                if (progress != null) {
                    progress.raiseTo(planProgress.progressPercent(), planProgress.detail());
                }
            });
            int affectedUsers = assignment.affectedUsers();
            String detail = "Generated " + assignment.plans() + " random group plan(s) for " + affectedUsers + " user(s).";
            if (progress != null) {
                progress.close();
            }
            notificationRuleRegistryService.recordRun(
                    ruleKey,
                    affectedUsers,
                    "completed",
                    detail,
                    adminUserId,
                    progress == null ? null : progress.startedAt());
        } catch (Exception exception) {
            notificationRuleRegistryService.restoreClaimedPendingCount(
                    ruleKey,
                    claimedPendingCount,
                    NotificationRuleRegistryService.PENDING_COUNT_UNIT_USERS);
            if (progress != null) {
                progress.close();
            }
            notificationRuleRegistryService.recordRun(
                    ruleKey,
                    0,
                    "failed",
                    safeText(exception.getMessage()),
                    adminUserId,
                    progress == null ? null : progress.startedAt());
        } finally {
            if (progress != null) {
                progress.close();
            }
        }
    }

    private void runWithMongoSessionMode(MongoSessionMode sessionMode, Runnable runnable) {
        MongoSessionMode previousMode = MongoSessionModeContext.currentMode();
        try {
            MongoSessionModeContext.set(sessionMode);
            runnable.run();
        } finally {
            MongoSessionModeContext.set(previousMode);
        }
    }

    private RandomRunProgress startRandomRunProgress(String ruleKey, String adminUserId) {
        return new RandomRunProgress(ruleKey, adminUserId);
    }

    private void recordRandomRunMillis(long elapsedMillis) {
        if (elapsedMillis <= 0L) {
            return;
        }
        int observedMillis = (int) clampExpectedRandomRunMillis(Math.round(elapsedMillis * 1.25d));
        expectedRandomRunMillis.updateAndGet(current -> observedMillis > current
                ? observedMillis
                : (int) clampExpectedRandomRunMillis(Math.round((current * 0.8d) + (observedMillis * 0.2d))));
    }

    private long clampExpectedRandomRunMillis(long value) {
        return Math.max(MIN_EXPECTED_RANDOM_RUN_MILLIS, Math.min(MAX_EXPECTED_RANDOM_RUN_MILLIS, value));
    }

    private class RandomRunProgress implements AutoCloseable {
        private final String ruleKey;
        private final Instant startedAt = Instant.now();
        private final NotificationRuleConfig.RunState runtimeState = new NotificationRuleConfig.RunState();
        private final long expectedMillis = clampExpectedRandomRunMillis(expectedRandomRunMillis.get());
        private final AtomicInteger latestPercent = new AtomicInteger(0);
        private final AtomicReference<String> latestDetail = new AtomicReference<>("Manual matched room assignment started.");
        private volatile String adminUserId;
        private volatile List<NotificationRuleConfig.RunHistoryEntry> runtimeHistory = List.of();
        private boolean closed;
        private final ScheduledFuture<?> heartbeat;

        RandomRunProgress(String ruleKey, String adminUserId) {
            this.ruleKey = safeText(ruleKey);
            this.adminUserId = safeText(adminUserId);
            runtimeState.setCurrentStatus("running");
            runtimeState.setProgressPercent(0);
            runtimeState.setProgressDetail(latestDetail.get());
            runtimeState.setStartedAtIso(startedAt.toString());
            runtimeState.setFinishedAtIso("");
            runtimeState.setDurationMillis(0L);
            String jobGroupId = JobGroupContext.groupId();
            heartbeat = progressHeartbeatExecutor.scheduleAtFixedRate(() -> JobGroupContext.run(jobGroupId, this::tick), 0, 100, TimeUnit.MILLISECONDS);
        }

        Instant startedAt() {
            return startedAt;
        }

        void setAdminUserId(String adminUserId) {
            this.adminUserId = safeText(adminUserId);
        }

        void adoptRule(NotificationRuleConfig rule) {
            if (rule == null) {
                return;
            }
            runtimeHistory = rule.getRunHistory() == null ? List.of() : List.copyOf(rule.getRunHistory());
            NotificationRuleConfig.RunState source = rule.getRunState();
            if (source == null) {
                return;
            }
            synchronized (runtimeState) {
                runtimeState.setLastRunAtIso(source.getLastRunAtIso());
                runtimeState.setLastRunStatus(source.getLastRunStatus());
                runtimeState.setLastRunDetail(source.getLastRunDetail());
                runtimeState.setLastRunCount(source.getLastRunCount());
                runtimeState.setLastRunUser(source.getLastRunUser());
                runtimeState.setPendingCount(source.getPendingCount());
                runtimeState.setPendingCountUnit(source.getPendingCountUnit());
                runtimeState.setPendingCountUpdatedAtIso(source.getPendingCountUpdatedAtIso());
                runtimeState.setCurrentStatus("running");
                runtimeState.setStartedAtIso(startedAt.toString());
                runtimeState.setFinishedAtIso("");
                runtimeState.setProgressPercent(latestPercent.get());
                runtimeState.setProgressDetail(latestDetail.get());
            }
        }

        void raiseTo(int progressPercent, String detail) {
            latestPercent.updateAndGet(current -> Math.max(current, Math.max(0, Math.min(99, progressPercent))));
            String safeDetail = safeText(detail);
            if (!safeDetail.isEmpty()) {
                latestDetail.set(safeDetail);
            }
        }

        private synchronized void tick() {
            if (closed) {
                return;
            }
            try {
                latestPercent.updateAndGet(current -> Math.max(current, timedProgressPercent()));
                long elapsedSeconds = Math.max(0L, java.time.Duration.between(startedAt, Instant.now()).toSeconds());
                publishInMemoryRunProgress(
                        ruleKey,
                        adminUserId,
                        runtimeState,
                        runtimeHistory,
                        latestPercent.get(),
                        latestDetail.get() + " Running for " + elapsedSeconds + "s.",
                        startedAt);
            } catch (Exception ignored) {
                // Keep the progress heartbeat alive; the worker records the final run status.
            }
        }

        private int timedProgressPercent() {
            long elapsedMillis = Math.max(0L, java.time.Duration.between(startedAt, Instant.now()).toMillis());
            if (elapsedMillis <= 0L) {
                return latestPercent.get();
            }
            return Math.max(0, Math.min(96, (int) Math.ceil((96d * elapsedMillis) / Math.max(1L, expectedMillis))));
        }

        @Override
        public synchronized void close() {
            if (closed) {
                return;
            }
            closed = true;
            heartbeat.cancel(false);
            recordRandomRunMillis(java.time.Duration.between(startedAt, Instant.now()).toMillis());
        }
    }

    private void publishInMemoryRunProgress(
            String ruleKey,
            String adminUserId,
            NotificationRuleConfig.RunState runtimeState,
            List<NotificationRuleConfig.RunHistoryEntry> runtimeHistory,
            int progressPercent,
            String detail,
            Instant startedAt) {
        synchronized (runtimeState) {
            long elapsedMillis = Math.max(0L, java.time.Duration.between(startedAt, Instant.now()).toMillis());
            runtimeState.setCurrentStatus("running");
            runtimeState.setProgressPercent(Math.max(0, Math.min(99, progressPercent)));
            runtimeState.setProgressDetail(safeText(detail).isEmpty() ? "Scheduled process is running." : safeText(detail));
            runtimeState.setStartedAtIso(safeText(runtimeState.getStartedAtIso()).isEmpty()
                    ? startedAt.toString()
                    : runtimeState.getStartedAtIso());
            runtimeState.setFinishedAtIso("");
            runtimeState.setDurationMillis(elapsedMillis);
            notificationRuleRegistryService.broadcastRunProgress(ruleKey, runtimeState, runtimeHistory, adminUserId);
        }
    }

    private String startedAtIso(NotificationRuleConfig startedRule) {
        String startedAtIso = safeText(startedRule == null || startedRule.getRunState() == null
                ? null
                : startedRule.getRunState().getStartedAtIso());
        return startedAtIso.isEmpty() ? Instant.now().toString() : startedAtIso;
    }

    private AdminNotificationCenterStateDto toState(List<NotificationRuleConfig> rules, String filter) {
        List<NotificationRuleConfig> allRules = rules == null ? List.of() : rules;
        return new AdminNotificationCenterStateDto(
                filteredProcessRules(allRules, normalizeProcessFilter(filter)).stream().map(this::toDto).toList(),
                emailCatalog.enabledTemplates(JobGroupContext.groupId()).stream()
                        .map(this::toTemplateOption)
                        .toList(),
                processFilterCounts(allRules),
                Instant.now().toString());
    }

    private Map<String, Long> processFilterCounts(List<NotificationRuleConfig> rules) {
        List<NotificationRuleConfig> processRules = scheduledProcessRules(rules);
        Map<String, Long> counts = new LinkedHashMap<>();
        counts.put(PROCESS_FILTER_ALL, (long) processRules.size());
        counts.put(PROCESS_FILTER_ACTIVE, processRules.stream()
                .filter(rule -> Boolean.TRUE.equals(rule.getEnabled()))
                .filter(rule -> !PROCESS_STATUS_FAILED.equals(processStatusKind(rule)))
                .count());
        counts.put(PROCESS_FILTER_SUSPENDED, processRules.stream()
                .filter(rule -> PROCESS_STATUS_SUSPENDED.equals(processStatusKind(rule)))
                .count());
        counts.put(PROCESS_FILTER_RUNNING, processRules.stream()
                .filter(rule -> PROCESS_STATUS_RUNNING.equals(processStatusKind(rule)))
                .count());
        counts.put(PROCESS_FILTER_FAILED, processRules.stream()
                .filter(rule -> PROCESS_STATUS_FAILED.equals(processStatusKind(rule)))
                .count());
        return counts;
    }

    private List<NotificationRuleConfig> filteredProcessRules(
            List<NotificationRuleConfig> rules,
            String filter) {
        if (PROCESS_FILTER_ALL.equals(filter)) {
            return rules;
        }
        return scheduledProcessRules(rules).stream()
                .filter(rule -> matchesProcessFilter(rule, filter))
                .toList();
    }

    private List<NotificationRuleConfig> scheduledProcessRules(List<NotificationRuleConfig> rules) {
        return (rules == null ? List.<NotificationRuleConfig>of() : rules).stream()
                .filter(rule -> rule != null && "scheduled_process".equals(safeText(rule.getTriggerKind())))
                .toList();
    }

    private boolean matchesProcessFilter(NotificationRuleConfig rule, String filter) {
        String status = processStatusKind(rule);
        return switch (filter) {
            case PROCESS_FILTER_ACTIVE -> Boolean.TRUE.equals(rule.getEnabled())
                    && !PROCESS_STATUS_FAILED.equals(status);
            case PROCESS_FILTER_SUSPENDED -> PROCESS_STATUS_SUSPENDED.equals(status);
            case PROCESS_FILTER_RUNNING -> PROCESS_STATUS_RUNNING.equals(status);
            case PROCESS_FILTER_FAILED -> PROCESS_STATUS_FAILED.equals(status);
            default -> true;
        };
    }

    private String processStatusKind(NotificationRuleConfig rule) {
        NotificationRuleConfig.RunState runState = rule == null ? null : rule.getRunState();
        String currentStatus = safeText(runState == null ? null : runState.getCurrentStatus()).toLowerCase();
        if (PROCESS_STATUS_RUNNING.equals(currentStatus)) {
            return PROCESS_STATUS_RUNNING;
        }
        String lastStatus = safeText(runState == null ? null : runState.getLastRunStatus()).toLowerCase();
        if (lastStatus.isEmpty()) {
            lastStatus = currentStatus;
        }
        if (PROCESS_PROBLEM_STATUSES.contains(lastStatus)) {
            return PROCESS_STATUS_FAILED;
        }
        if (!Boolean.TRUE.equals(rule == null ? null : rule.getEnabled())
                || PROCESS_STATUS_SUSPENDED.equals(currentStatus)) {
            return PROCESS_STATUS_SUSPENDED;
        }
        return PROCESS_STATUS_READY;
    }

    private String normalizeProcessFilter(String filter) {
        return switch (safeText(filter).toLowerCase()) {
            case PROCESS_FILTER_ACTIVE,
                    PROCESS_FILTER_SUSPENDED,
                    PROCESS_FILTER_RUNNING,
                    PROCESS_FILTER_FAILED -> safeText(filter).toLowerCase();
            default -> PROCESS_FILTER_ALL;
        };
    }

    private AdminNotificationRuleDto toDto(NotificationRuleConfig rule) {
        NotificationRuleConfig.DeliveryChannels channels = rule.getChannels() == null
                ? new NotificationRuleConfig.DeliveryChannels()
                : rule.getChannels();
        NotificationRuleConfig.Timing timing = rule.getTiming() == null
                ? new NotificationRuleConfig.Timing()
                : rule.getTiming();
        NotificationRuleConfig.MessageTemplate message = rule.getMessage() == null
                ? new NotificationRuleConfig.MessageTemplate()
                : rule.getMessage();
        NotificationRuleConfig.RunState runState = rule.getRunState() == null
                ? new NotificationRuleConfig.RunState()
                : rule.getRunState();
        return new AdminNotificationRuleDto(
                rule.getId(),
                rule.getRuleKey(),
                rule.getLabel(),
                rule.getCategory(),
                rule.getDescription(),
                rule.getActionKey(),
                rule.getTriggerKind(),
                rule.getEnabled(),
                rule.getManualRunEnabled(),
                adminManageable(rule),
                rule.getPriority(),
                new AdminNotificationChannelsDto(
                        channels.getPushEnabled(),
                        channels.getEmailEnabled(),
                        channels.getInAppEnabled(),
                        channels.getSupportChatEnabled()),
                new AdminNotificationTimingDto(
                        timing.getMode(),
                        timing.getDelayMinutes(),
                        timing.getIntervalMinutes(),
                        timing.getIntervalSeconds(),
                        timing.getIntervalAmount(),
                        timing.getIntervalUnit(),
                        timing.getMonth(),
                        timing.getDayOfMonth(),
                        timing.getTime(),
                        timing.getTimezone(),
                        timing.getCronExpression()),
                rule.getScheduleSlots() == null ? List.of() : rule.getScheduleSlots().stream()
                        .map(this::toScheduleSlotDto)
                        .toList(),
                rule.getParameters() == null ? List.of() : rule.getParameters().stream()
                        .map(this::toParameterDto)
                        .toList(),
                new AdminNotificationMessageDto(
                        message.getPushTitle(),
                        message.getPushBody(),
                        message.getEmailTemplateKey(),
                        message.getEmailSubject(),
                        message.getEmailBody(),
                        message.getCtaPath()),
                new AdminNotificationRunStateDto(
                        runState.getCurrentStatus(),
                        runState.getProgressPercent(),
                        runState.getProgressDetail(),
                        runState.getStartedAtIso(),
                        runState.getFinishedAtIso(),
                        runState.getDurationMillis(),
                        runState.getLastRunAtIso(),
                        notificationRuleRegistryService.nextScheduledRunAtIso(rule, Instant.now()),
                        runState.getLastRunStatus(),
                        runState.getLastRunDetail(),
                        runState.getLastRunCount(),
                        runState.getLastRunUser(),
                        Math.max(0, runState.getPendingCount() == null ? 0 : runState.getPendingCount()),
                        runState.getPendingCountUnit(),
                        runState.getPendingCountUpdatedAtIso()),
                rule.getRunHistory() == null ? List.of() : rule.getRunHistory().stream()
                        .map(this::toRunHistoryEntry)
                        .toList(),
                NotificationRuleRegistryService.RULE_SCHEDULED_MESSAGES.equals(rule.getRuleKey())
                        ? scheduledTaskResults() : List.of(),
                rule.getUpdatedDate(),
                rule.getUpdatedUser());
    }

    private List<AdminScheduledTaskResultDto> scheduledTaskResults() {
        return emailCatalog.recentTaskResults(JobGroupContext.groupId()).stream()
                .map(task -> new AdminScheduledTaskResultDto(
                        task.key(),
                        task.ranAtIso(),
                        task.status(),
                        task.detail(),
                        task.count(),
                        task.nextRunAtIso()))
                .toList();
    }

    private NotificationRuleConfig toDocument(AdminNotificationRuleDto dto) {
        NotificationRuleConfig rule = new NotificationRuleConfig();
        if (dto == null) {
            return rule;
        }
        rule.setId(dto.id());
        rule.setRuleKey(dto.ruleKey());
        rule.setLabel(dto.label());
        rule.setCategory(dto.category());
        rule.setDescription(dto.description());
        rule.setActionKey(dto.actionKey());
        rule.setTriggerKind(dto.triggerKind());
        rule.setEnabled(dto.enabled());
        rule.setManualRunEnabled(dto.manualRunEnabled());
        rule.setAdminManageable(dto.adminManageable());
        rule.setPriority(dto.priority());
        AdminNotificationChannelsDto sourceChannels = dto.channels();
        NotificationRuleConfig.DeliveryChannels channels = new NotificationRuleConfig.DeliveryChannels();
        channels.setPushEnabled(sourceChannels == null ? null : sourceChannels.pushEnabled());
        channels.setEmailEnabled(sourceChannels == null ? null : sourceChannels.emailEnabled());
        channels.setInAppEnabled(sourceChannels == null ? null : sourceChannels.inAppEnabled());
        channels.setSupportChatEnabled(sourceChannels == null ? null : sourceChannels.supportChatEnabled());
        rule.setChannels(channels);
        AdminNotificationTimingDto sourceTiming = dto.timing();
        NotificationRuleConfig.Timing timing = new NotificationRuleConfig.Timing();
        timing.setMode(sourceTiming == null ? null : sourceTiming.mode());
        timing.setDelayMinutes(sourceTiming == null ? null : sourceTiming.delayMinutes());
        timing.setIntervalMinutes(sourceTiming == null ? null : sourceTiming.intervalMinutes());
        timing.setIntervalSeconds(sourceTiming == null ? null : sourceTiming.intervalSeconds());
        timing.setIntervalAmount(sourceTiming == null ? null : sourceTiming.intervalAmount());
        timing.setIntervalUnit(sourceTiming == null ? null : sourceTiming.intervalUnit());
        timing.setMonth(sourceTiming == null ? null : sourceTiming.month());
        timing.setDayOfMonth(sourceTiming == null ? null : sourceTiming.dayOfMonth());
        timing.setTime(sourceTiming == null ? null : sourceTiming.time());
        timing.setTimezone(sourceTiming == null ? null : sourceTiming.timezone());
        timing.setCronExpression(sourceTiming == null ? null : sourceTiming.cronExpression());
        rule.setTiming(timing);
        rule.setScheduleSlots(dto.scheduleSlots() == null ? List.of() : dto.scheduleSlots().stream()
                .map(this::toScheduleSlotDocument)
                .toList());
        rule.setParameters(dto.parameters() == null ? List.of() : dto.parameters().stream()
                .map(this::toParameterDocument)
                .toList());
        AdminNotificationMessageDto sourceMessage = dto.message();
        NotificationRuleConfig.MessageTemplate message = new NotificationRuleConfig.MessageTemplate();
        message.setPushTitle(sourceMessage == null ? null : sourceMessage.pushTitle());
        message.setPushBody(sourceMessage == null ? null : sourceMessage.pushBody());
        message.setEmailTemplateKey(sourceMessage == null ? null : sourceMessage.emailTemplateKey());
        message.setEmailSubject(sourceMessage == null ? null : sourceMessage.emailSubject());
        message.setEmailBody(sourceMessage == null ? null : sourceMessage.emailBody());
        message.setCtaPath(sourceMessage == null ? null : sourceMessage.ctaPath());
        rule.setMessage(message);
        return rule;
    }

    private AdminNotificationTemplateOptionDto toTemplateOption(EmailProcessCatalog.TemplateOption template) {
        return new AdminNotificationTemplateOptionDto(
                template.key(),
                template.name(),
                template.category(),
                template.description());
    }

    private AdminNotificationScheduleSlotDto toScheduleSlotDto(NotificationRuleConfig.ScheduleSlot slot) {
        return new AdminNotificationScheduleSlotDto(
                slot.getId(),
                slot.getFrequency(),
                slot.getDate(),
                slot.getDayOfWeek(),
                slot.getTime(),
                slot.getTimezone(),
                slot.getCronExpression(),
                slot.getActionKey(),
                slot.getEnabled());
    }

    private NotificationRuleConfig.ScheduleSlot toScheduleSlotDocument(AdminNotificationScheduleSlotDto dto) {
        NotificationRuleConfig.ScheduleSlot slot = new NotificationRuleConfig.ScheduleSlot();
        if (dto == null) {
            return slot;
        }
        slot.setId(dto.id());
        slot.setFrequency(dto.frequency());
        slot.setDate(dto.date());
        slot.setDayOfWeek(dto.dayOfWeek());
        slot.setTime(dto.time());
        slot.setTimezone(dto.timezone());
        slot.setCronExpression(dto.cronExpression());
        slot.setActionKey(dto.actionKey());
        slot.setEnabled(dto.enabled());
        return slot;
    }

    private AdminParamFieldDto toParameterDto(NotificationRuleConfig.ParameterField field) {
        return new AdminParamFieldDto(
                field.getKey(),
                field.getLabel(),
                field.getLabelKey(),
                field.getGroup(),
                field.getGroupKey(),
                field.getValueType(),
                field.getNumberValue(),
                field.getTextValue(),
                field.getUnit(),
                field.getOptions() == null ? List.of() : field.getOptions().stream()
                        .map(option -> new AdminParamOptionDto(option.getValue(), option.getLabel(), option.getLabelKey()))
                        .toList(),
                field.getStrategy(),
                field.getStrategyKey(),
                field.getReadOnly());
    }

    private NotificationRuleConfig.ParameterField toParameterDocument(AdminParamFieldDto dto) {
        NotificationRuleConfig.ParameterField field = new NotificationRuleConfig.ParameterField();
        if (dto == null) {
            return field;
        }
        field.setKey(dto.key());
        field.setLabel(dto.label());
        field.setLabelKey(dto.labelKey());
        field.setGroup(dto.group());
        field.setGroupKey(dto.groupKey());
        field.setValueType(dto.valueType());
        field.setNumberValue(dto.numberValue());
        field.setTextValue(dto.textValue());
        field.setUnit(dto.unit());
        field.setOptions(dto.options() == null ? List.of() : dto.options().stream()
                .map(option -> {
                    NotificationRuleConfig.ParameterOption documentOption = new NotificationRuleConfig.ParameterOption();
                    documentOption.setValue(option.value());
                    documentOption.setLabel(option.label());
                    documentOption.setLabelKey(option.labelKey());
                    return documentOption;
                })
                .toList());
        field.setStrategy(dto.strategy());
        field.setStrategyKey(dto.strategyKey());
        field.setReadOnly(dto.readOnly());
        return field;
    }

    private AdminNotificationRunHistoryEntryDto toRunHistoryEntry(NotificationRuleConfig.RunHistoryEntry entry) {
        return new AdminNotificationRunHistoryEntryDto(
                entry.getId(),
                entry.getTrigger(),
                entry.getRunnerUser(),
                entry.getStartedAtIso(),
                entry.getFinishedAtIso(),
                entry.getDurationMillis(),
                entry.getProcessedCount(),
                entry.getStatus(),
                entry.getDetail());
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }

    private Boolean adminManageable(NotificationRuleConfig rule) {
        if (rule != null && rule.getAdminManageable() != null) {
            return Boolean.TRUE.equals(rule.getAdminManageable());
        }
        return NotificationRuleRegistryService.RULE_EVENT_RANDOM_GROUPS.equals(safeText(rule == null ? null : rule.getRuleKey()));
    }
}
