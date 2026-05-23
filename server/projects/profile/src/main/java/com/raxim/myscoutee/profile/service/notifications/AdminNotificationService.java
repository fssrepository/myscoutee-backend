package com.raxim.myscoutee.profile.service.notifications;

import java.time.Instant;
import java.util.List;
import java.util.LinkedHashSet;
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

import com.raxim.myscoutee.algo.gen.GeneratorModels.GeneratedEventPlan;
import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.profile.data.document.EmailTemplate;
import com.raxim.myscoutee.profile.data.document.NotificationRuleConfig;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminParamFieldDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminParamOptionDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminNotificationCenterStateDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminNotificationChannelsDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminNotificationMessageDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminNotificationRuleDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminNotificationRuleRunRequestDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminNotificationRuleRunResultDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminNotificationRuleSaveRequestDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminNotificationRunHistoryEntryDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminNotificationScheduleSlotDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminNotificationRunStateDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminNotificationTemplateOptionDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminNotificationTimingDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminUserDto;
import com.raxim.myscoutee.profile.repository.EmailTemplatesRepository;
import com.raxim.myscoutee.profile.service.AdminModerationService;
import com.raxim.myscoutee.profile.service.AdminTelemetryService;
import com.raxim.myscoutee.profile.service.EventScheduler;

@Service
public class AdminNotificationService {
    private static final long MIN_EXPECTED_RANDOM_RUN_MILLIS = 1_000L;
    private static final long MAX_EXPECTED_RANDOM_RUN_MILLIS = 60_000L;
    private static final long DEFAULT_EXPECTED_RANDOM_RUN_MILLIS = 5_000L;

    private final NotificationRuleRegistryService notificationRuleRegistryService;
    private final EmailTemplatesRepository emailTemplatesRepository;
    private final EventScheduler eventScheduler;
    private final AdminModerationService adminModerationService;
    private final AdminTelemetryService adminTelemetryService;
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
            EmailTemplatesRepository emailTemplatesRepository,
            EventScheduler eventScheduler,
            AdminModerationService adminModerationService,
            AdminTelemetryService adminTelemetryService) {
        this.notificationRuleRegistryService = notificationRuleRegistryService;
        this.emailTemplatesRepository = emailTemplatesRepository;
        this.eventScheduler = eventScheduler;
        this.adminModerationService = adminModerationService;
        this.adminTelemetryService = adminTelemetryService;
    }

    @PreDestroy
    public void shutdown() {
        runExecutor.shutdownNow();
        progressHeartbeatExecutor.shutdownNow();
    }

    public AdminNotificationCenterStateDto state(String adminUserId) {
        adminModerationService.resolveAdminActor(adminUserId);
        return toState(notificationRuleRegistryService.rules());
    }

    public AdminNotificationRuleDto ruleState(String ruleKey, String adminUserId) {
        adminModerationService.resolveAdminActor(adminUserId);
        NotificationRuleConfig rule = notificationRuleRegistryService.findRule(ruleKey).orElse(null);
        return rule == null ? null : toDto(rule);
    }

    public AdminNotificationCenterStateDto save(AdminNotificationRuleSaveRequestDto request) {
        AdminUserDto admin = adminModerationService.resolveAdminActor(request == null ? null : request.adminUserId());
        List<NotificationRuleConfig> documents = request == null || request.rules() == null
                ? List.of()
                : request.rules().stream().map(this::toDocument).toList();
        AdminNotificationCenterStateDto state = toState(notificationRuleRegistryService.saveRules(documents, admin.id()));
        adminTelemetryService.record("jobs.config.saved", "jobs", "", admin.id(), documents.size());
        return state;
    }

    public AdminNotificationRuleRunResultDto run(String ruleKey, AdminNotificationRuleRunRequestDto request) {
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
            NotificationRuleConfig startedRule = progress == null
                    ? notificationRuleRegistryService.beginRun(normalizedRuleKey, "Manual start requested.", admin.id())
                    : notificationRuleRegistryService.beginRun(normalizedRuleKey, "Manual start requested.", admin.id(), progress.startedAt());
            if (progress != null) {
                progress.adoptRule(startedRule);
            }
            switch (normalizedRuleKey) {
                case NotificationRuleRegistryService.RULE_EVENT_RANDOM_GROUPS -> {
                    RandomRunProgress runProgress = progress;
                    MongoSessionMode sessionMode = MongoSessionModeContext.currentMode();
                    runExecutor.submit(() -> runWithMongoSessionMode(
                            sessionMode,
                            () -> runRandomEventGroups(normalizedRuleKey, admin.id(), startedRule, runProgress)));
                    adminTelemetryService.record("jobs.run.started", "jobs", normalizedRuleKey, admin.id());
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
        try {
            if (progress != null) {
                progress.setAdminUserId(adminUserId);
                progress.adoptRule(startedRule);
                progress.raiseTo(1, "Loading published events for matched rooms.");
            }
            List<GeneratedEventPlan> plans = eventScheduler.generateRandomPlans(planProgress -> {
                if (progress != null) {
                    progress.raiseTo(planProgress.progressPercent(), planProgress.detail());
                }
            });
            int affectedUsers = affectedUsers(plans);
            String detail = "Generated " + plans.size() + " random group plan(s) for " + affectedUsers + " user(s).";
            notificationRuleRegistryService.recordRun(
                    ruleKey,
                    affectedUsers,
                    "completed",
                    detail,
                    adminUserId,
                    progress == null ? null : progress.startedAt());
            adminTelemetryService.record("jobs.run.completed", "jobs", ruleKey, adminUserId, Math.max(1, affectedUsers));
        } catch (Exception exception) {
            notificationRuleRegistryService.recordRun(
                    ruleKey,
                    0,
                    "failed",
                    safeText(exception.getMessage()),
                    adminUserId,
                    progress == null ? null : progress.startedAt());
            adminTelemetryService.record("jobs.run.failed", "jobs", ruleKey, adminUserId);
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
            heartbeat = progressHeartbeatExecutor.scheduleAtFixedRate(this::tick, 0, 100, TimeUnit.MILLISECONDS);
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

        private void tick() {
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
        public void close() {
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

    private int affectedUsers(List<GeneratedEventPlan> plans) {
        Set<String> userIds = new LinkedHashSet<>();
        for (GeneratedEventPlan plan : plans == null ? List.<GeneratedEventPlan>of() : plans) {
            if (plan == null || plan.memberUserIds() == null) {
                continue;
            }
            for (String userId : plan.memberUserIds()) {
                if (safeText(userId).length() > 0) {
                    userIds.add(safeText(userId));
                }
            }
        }
        return userIds.size();
    }

    private AdminNotificationCenterStateDto toState(List<NotificationRuleConfig> rules) {
        return new AdminNotificationCenterStateDto(
                rules.stream().map(this::toDto).toList(),
                emailTemplatesRepository.findByEnabledTrueOrderByTemplateKeyAsc().stream()
                        .map(this::toTemplateOption)
                        .toList(),
                Instant.now().toString());
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
                        runState.getLastRunStatus(),
                        runState.getLastRunDetail(),
                        runState.getLastRunCount(),
                        runState.getLastRunUser()),
                rule.getRunHistory() == null ? List.of() : rule.getRunHistory().stream()
                        .map(this::toRunHistoryEntry)
                        .toList(),
                rule.getUpdatedDate(),
                rule.getUpdatedUser());
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

    private AdminNotificationTemplateOptionDto toTemplateOption(EmailTemplate template) {
        return new AdminNotificationTemplateOptionDto(
                template.getTemplateKey(),
                template.getName(),
                template.getCategory(),
                template.getDescription());
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
