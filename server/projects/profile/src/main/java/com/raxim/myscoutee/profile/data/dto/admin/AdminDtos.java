package com.raxim.myscoutee.profile.data.dto.admin;

import java.util.List;

public final class AdminDtos {
    private AdminDtos() {}

    public record AdminUserDto(
            String id,
            String name,
            String initials,
            String email,
            String headline,
            String about,
            List<String> images) {}
    public record AdminActionRequestDto(String adminUserId, String message) {}
    public record AdminNotificationCenterStateDto(
            List<AdminNotificationRuleDto> rules,
            List<AdminNotificationTemplateOptionDto> emailTemplates,
            String updatedDate) {}
    public record AdminNotificationRuleSaveRequestDto(
            String adminUserId,
            List<AdminNotificationRuleDto> rules) {}
    public record AdminNotificationRuleRunRequestDto(String adminUserId) {}
    public record AdminNotificationRuleRunResultDto(
            String ruleKey,
            String label,
            Integer affectedCount,
            String status,
            String detail,
            String ranAtIso) {}
    public record AdminNotificationRuleDto(
            String id,
            String ruleKey,
            String label,
            String category,
            String description,
            String actionKey,
            String triggerKind,
            Boolean enabled,
            Boolean manualRunEnabled,
            Boolean adminManageable,
            Integer priority,
            AdminNotificationChannelsDto channels,
            AdminNotificationTimingDto timing,
            List<AdminNotificationScheduleSlotDto> scheduleSlots,
            AdminNotificationMessageDto message,
            AdminNotificationRunStateDto runState,
            List<AdminNotificationRunHistoryEntryDto> runHistory,
            String updatedDate,
            String updatedUser) {}
    public record AdminNotificationChannelsDto(
            Boolean pushEnabled,
            Boolean emailEnabled,
            Boolean inAppEnabled,
            Boolean supportChatEnabled) {}
    public record AdminNotificationTimingDto(
            String mode,
            Integer delayMinutes,
            Integer intervalMinutes,
            Integer month,
            Integer dayOfMonth,
            String time,
            String timezone,
            String cronExpression) {}
    public record AdminNotificationScheduleSlotDto(
            String id,
            String frequency,
            String date,
            Integer dayOfWeek,
            String time,
            String timezone,
            String cronExpression,
            String actionKey,
            Boolean enabled) {}
    public record AdminNotificationMessageDto(
            String pushTitle,
            String pushBody,
            String emailTemplateKey,
            String emailSubject,
            String emailBody,
            String ctaPath) {}
    public record AdminNotificationRunStateDto(
            String currentStatus,
            Integer progressPercent,
            String progressDetail,
            String startedAtIso,
            String finishedAtIso,
            Long durationMillis,
            String lastRunAtIso,
            String lastRunStatus,
            String lastRunDetail,
            Integer lastRunCount,
            String lastRunUser) {}
    public record AdminNotificationRunHistoryEntryDto(
            String id,
            String trigger,
            String runnerUser,
            String startedAtIso,
            String finishedAtIso,
            Long durationMillis,
            Integer processedCount,
            String status,
            String detail) {}
    public record AdminNotificationTemplateOptionDto(
            String templateKey,
            String name,
            String category,
            String description) {}
    public record AdminChatMessageDto(
            String id,
            String sender,
            String senderUserId,
            String senderInitials,
            String senderGender,
            String text,
            String time,
            String sentAtIso) {}
    public record AdminDashboardDto(
            AdminUserDto activeAdmin,
            List<AdminReportedUserDto> reportedUsers,
            List<AdminReportedUserDto> blockedUsers,
            List<AdminFeedbackDto> feedback) {}
    public record AdminReportedUserDto(
            String userId,
            String name,
            String initials,
            String gender,
            String city,
            String imageUrl,
            String profileStatus,
            Integer reportCount,
            String lastReportedAtIso,
            Boolean hasSupportChat,
            Integer supportChatUnread,
            List<AdminReportDto> reports) {}
    public record AdminReportDto(
            String id,
            String reporterUserId,
            String reporterName,
            String reporterImageUrl,
            String targetUserId,
            String handle,
            String reason,
            String details,
            String eventId,
            String eventTitle,
            String eventStartAtIso,
            String memberEntryId,
            String sourceType,
            String sourceId,
            String sourceText,
            String chatId,
            String messageId,
            String assetId,
            String assetType,
            String chatTitle,
            List<AdminChatMessageDto> chatMessages,
            String createdDate) {}
    public record AdminFeedbackDto(
            String id,
            String userId,
            String userName,
            String userImageUrl,
            String category,
            String subject,
            String details,
            String createdDate) {}
}
