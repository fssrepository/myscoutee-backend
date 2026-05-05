package com.raxim.myscoutee.profile.service.notifications;

import java.time.Instant;
import java.util.List;

import org.springframework.stereotype.Service;

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

    public AdminNotificationCenterStateDto state(String adminUserId) {
        adminModerationService.resolveAdminActor(adminUserId);
        return toState(notificationRuleRegistryService.rules());
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
        String status = "completed";
        String detail;
        int affectedCount;
        try {
            notificationRuleRegistryService.beginRun(normalizedRuleKey, "Manual start requested.", admin.id());
            switch (normalizedRuleKey) {
                case NotificationRuleRegistryService.RULE_EVENT_RANDOM_GROUPS -> {
                    affectedCount = eventScheduler.generateRandomPlans().size();
                    detail = "Generated random event group plans.";
                }
                case NotificationRuleRegistryService.RULE_EVENT_STAGE_MATERIALIZER -> {
                    affectedCount = eventScheduler.generateScorePlans().size();
                    detail = "Materialized score and tournament stage groups.";
                }
                default -> {
                    affectedCount = 0;
                    status = "skipped";
                    detail = "This rule is action driven and has no manual worker.";
                }
            }
        } catch (Exception exception) {
            affectedCount = 0;
            status = "failed";
            detail = safeText(exception.getMessage());
        }
        NotificationRuleConfig updated = notificationRuleRegistryService.recordRun(
                normalizedRuleKey,
                affectedCount,
                status,
                detail,
                admin.id());
        String ranAtIso = updated == null || updated.getRunState() == null
                ? Instant.now().toString()
                : updated.getRunState().getLastRunAtIso();
        return new AdminNotificationRuleRunResultDto(
                normalizedRuleKey,
                safeText(rule.getLabel()),
                affectedCount,
                status,
                detail,
                ranAtIso);
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
}
