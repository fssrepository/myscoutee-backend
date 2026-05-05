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
import com.raxim.myscoutee.profile.data.document.EmailTemplate;
import com.raxim.myscoutee.profile.data.document.NotificationRuleConfig;
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
import com.raxim.myscoutee.profile.service.EventScheduler;

@Service
public class AdminNotificationService {
    private final NotificationRuleRegistryService notificationRuleRegistryService;
    private final EmailTemplatesRepository emailTemplatesRepository;
    private final EventScheduler eventScheduler;
    private final AdminModerationService adminModerationService;
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
            AdminModerationService adminModerationService) {
        this.notificationRuleRegistryService = notificationRuleRegistryService;
        this.emailTemplatesRepository = emailTemplatesRepository;
        this.eventScheduler = eventScheduler;
        this.adminModerationService = adminModerationService;
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
        return toState(notificationRuleRegistryService.saveRules(documents, admin.id()));
    }

    public AdminNotificationRuleRunResultDto run(String ruleKey, AdminNotificationRuleRunRequestDto request) {
        AdminUserDto admin = adminModerationService.resolveAdminActor(request == null ? null : request.adminUserId());
        String normalizedRuleKey = safeText(ruleKey);
        NotificationRuleConfig rule = notificationRuleRegistryService.findRule(normalizedRuleKey).orElse(null);
        if (rule == null) {
            return new AdminNotificationRuleRunResultDto(normalizedRuleKey, normalizedRuleKey, 0, "skipped",
                    "Rule was not found.", Instant.now().toString());
        }
        try {
            NotificationRuleConfig startedRule = notificationRuleRegistryService.beginRun(normalizedRuleKey, "Manual start requested.", admin.id());
            switch (normalizedRuleKey) {
                case NotificationRuleRegistryService.RULE_EVENT_RANDOM_GROUPS -> {
                    runExecutor.submit(() -> runRandomEventGroups(normalizedRuleKey, admin.id(), startedRule));
                    return new AdminNotificationRuleRunResultDto(
                            normalizedRuleKey,
                            safeText(rule.getLabel()),
                            0,
                            "running",
                            "Manual random event grouping started.",
                            Instant.now().toString());
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
            NotificationRuleConfig updated = notificationRuleRegistryService.recordRun(
                    normalizedRuleKey,
                    0,
                    "failed",
                    safeText(exception.getMessage()),
                    admin.id());
            String ranAtIso = updated == null || updated.getRunState() == null
                    ? Instant.now().toString()
                    : updated.getRunState().getLastRunAtIso();
            return new AdminNotificationRuleRunResultDto(
                    normalizedRuleKey,
                    safeText(rule.getLabel()),
                    0,
                    "failed",
                    safeText(exception.getMessage()),
                    ranAtIso);
        }
    }

    private void runRandomEventGroups(String ruleKey, String adminUserId, NotificationRuleConfig startedRule) {
        AtomicInteger latestPercent = new AtomicInteger(0);
        AtomicReference<String> latestDetail = new AtomicReference<>("Manual random event grouping started.");
        Instant startedAt = Instant.now();
        NotificationRuleConfig.RunState runtimeState = copyRunState(startedRule == null ? null : startedRule.getRunState());
        if (safeText(runtimeState.getStartedAtIso()).isEmpty()) {
            runtimeState.setStartedAtIso(startedAt.toString());
        }
        List<NotificationRuleConfig.RunHistoryEntry> runtimeHistory = startedRule == null || startedRule.getRunHistory() == null
                ? List.of()
                : List.copyOf(startedRule.getRunHistory());
        ScheduledFuture<?> heartbeat = progressHeartbeatExecutor.scheduleAtFixedRate(() -> {
            long elapsedSeconds = Math.max(1L, java.time.Duration.between(startedAt, Instant.now()).toSeconds());
            publishInMemoryRunProgress(
                    ruleKey,
                    adminUserId,
                    runtimeState,
                    runtimeHistory,
                    latestPercent.get(),
                    latestDetail.get() + " Running for " + elapsedSeconds + "s.",
                    startedAt);
        }, 1, 1, TimeUnit.SECONDS);
        try {
            List<GeneratedEventPlan> plans = eventScheduler.generateRandomPlans(progress -> {
                latestPercent.updateAndGet(value -> Math.max(value, progress.progressPercent()));
                latestDetail.set(progress.detail());
            });
            int affectedUsers = affectedUsers(plans);
            String detail = "Generated " + plans.size() + " random group plan(s) for " + affectedUsers + " user(s).";
            notificationRuleRegistryService.recordRun(ruleKey, affectedUsers, "completed", detail, adminUserId);
        } catch (Exception exception) {
            notificationRuleRegistryService.recordRun(ruleKey, 0, "failed", safeText(exception.getMessage()), adminUserId);
        } finally {
            heartbeat.cancel(false);
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
            runtimeState.setCurrentStatus("running");
            runtimeState.setProgressPercent(Math.max(0, Math.min(99, progressPercent)));
            runtimeState.setProgressDetail(safeText(detail).isEmpty() ? "Scheduled process is running." : safeText(detail));
            runtimeState.setStartedAtIso(safeText(runtimeState.getStartedAtIso()).isEmpty()
                    ? startedAt.toString()
                    : runtimeState.getStartedAtIso());
            runtimeState.setFinishedAtIso("");
            runtimeState.setDurationMillis(0L);
            notificationRuleRegistryService.broadcastRunProgress(ruleKey, runtimeState, runtimeHistory, adminUserId);
        }
    }

    private NotificationRuleConfig.RunState copyRunState(NotificationRuleConfig.RunState source) {
        NotificationRuleConfig.RunState copy = new NotificationRuleConfig.RunState();
        if (source == null) {
            return copy;
        }
        copy.setCurrentStatus(source.getCurrentStatus());
        copy.setProgressPercent(source.getProgressPercent());
        copy.setProgressDetail(source.getProgressDetail());
        copy.setStartedAtIso(source.getStartedAtIso());
        copy.setFinishedAtIso(source.getFinishedAtIso());
        copy.setDurationMillis(source.getDurationMillis());
        copy.setLastRunAtIso(source.getLastRunAtIso());
        copy.setLastRunStatus(source.getLastRunStatus());
        copy.setLastRunDetail(source.getLastRunDetail());
        copy.setLastRunCount(source.getLastRunCount());
        copy.setLastRunUser(source.getLastRunUser());
        return copy;
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
                        timing.getMonth(),
                        timing.getDayOfMonth(),
                        timing.getTime(),
                        timing.getTimezone(),
                        timing.getCronExpression()),
                rule.getScheduleSlots() == null ? List.of() : rule.getScheduleSlots().stream()
                        .map(this::toScheduleSlotDto)
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
        timing.setMonth(sourceTiming == null ? null : sourceTiming.month());
        timing.setDayOfMonth(sourceTiming == null ? null : sourceTiming.dayOfMonth());
        timing.setTime(sourceTiming == null ? null : sourceTiming.time());
        timing.setTimezone(sourceTiming == null ? null : sourceTiming.timezone());
        timing.setCronExpression(sourceTiming == null ? null : sourceTiming.cronExpression());
        rule.setTiming(timing);
        rule.setScheduleSlots(dto.scheduleSlots() == null ? List.of() : dto.scheduleSlots().stream()
                .map(this::toScheduleSlotDocument)
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
