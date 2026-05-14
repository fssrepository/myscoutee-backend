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
    public record AdminParamsStateDto(
            List<AdminParamsSectionDto> sections,
            String updatedDate) {}
    public record AdminParamsSectionDto(
            String key,
            String label,
            String labelKey,
            Integer version,
            String changedDate,
            String changedBy,
            String summary,
            String summaryKey,
            List<AdminParamFieldDto> fields) {}
    public record AdminParamFieldDto(
            String key,
            String label,
            String labelKey,
            String group,
            String groupKey,
            String valueType,
            Double numberValue,
            String textValue,
            String unit,
            List<AdminParamOptionDto> options,
            String strategy,
            String strategyKey,
            Boolean readOnly) {}
    public record AdminParamOptionDto(
            String value,
            String label,
            String labelKey) {}
    public record AdminParamsSaveRequestDto(
            String adminUserId,
            String sectionKey,
            List<AdminParamFieldDto> fields,
            String summary) {}
    public record AdminParamsHistoryDto(
            String sectionKey,
            String label,
            String labelKey,
            List<AdminParamsHistoryItemDto> versions) {}
    public record AdminParamsHistoryItemDto(
            String configId,
            Integer version,
            String changedDate,
            String changedBy,
            String summary,
            String summaryKey,
            Boolean active,
            List<AdminParamFieldDto> fields) {}
    public record AdminParamsRevertRequestDto(
            String adminUserId,
            Integer version) {}
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
            List<AdminParamFieldDto> parameters,
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
            Integer intervalSeconds,
            Integer intervalAmount,
            String intervalUnit,
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
    public record AdminStatsDashboardDto(
            String generatedAtIso,
            String source,
            Integer healthScore,
            String healthLabelKey,
            String healthSummaryKey,
            List<AdminStatsMetricDto> kpis,
            List<AdminStatsSegmentDto> segments,
            List<AdminStatsBreakdownItemDto> attention,
            List<AdminStatsBreakdownItemDto> topCities,
            List<AdminStatsBreakdownItemDto> topTopics,
            List<AdminStatsTimelinePointDto> timeline,
            List<AdminStatsBreakdownItemDto> eventTypes,
            List<AdminStatsBreakdownItemDto> activityMix,
            AdminStatsGraphDto graph,
            AdminStatsRevenueDto revenue) {}
    public record AdminStatsGraphDto(
            Integer healthScore,
            String healthLabelKey,
            String insightKey,
            List<AdminStatsMetricDto> metrics,
            List<AdminStatsBreakdownItemDto> bridgeUsers,
            List<AdminStatsBreakdownItemDto> communities,
            List<AdminStatsBreakdownItemDto> signals,
            List<AdminStatsGraphTimelinePointDto> timeline) {}
    public record AdminStatsGraphTimelinePointDto(
            String dateKey,
            String label,
            Long activeEdges,
            Long newEdges,
            Long recurringEdges,
            Long weakTies,
            Long bridgeUsers,
            Long communities,
            Long networkQuality,
            Long clusterQuality) {}
    public record AdminStatsRevenueDto(
            List<AdminStatsMetricDto> metrics,
            List<AdminStatsBreakdownItemDto> assetCategories,
            List<AdminStatsRevenueTimelinePointDto> timeline) {}
    public record AdminStatsRevenueTimelinePointDto(
            String dateKey,
            String label,
            Long payableEvents,
            Long payableAssets,
            Long projectedEventCents,
            Long projectedAssetCents,
            Long actualPaymentCents,
            Long payingUsers) {}
    public record AdminStatsMetricDto(
            String key,
            String labelKey,
            Long value,
            String valueLabel,
            String captionKey,
            String caption,
            String icon,
            String tone,
            Integer percent) {}
    public record AdminStatsSegmentDto(
            String key,
            String labelKey,
            String icon,
            Long total,
            Integer healthPercent,
            String summaryKey,
            String summary,
            List<AdminStatsBreakdownItemDto> items) {}
    public record AdminStatsBreakdownItemDto(
            String key,
            String labelKey,
            String label,
            Long value,
            Long total,
            String icon,
            String tone) {}
    public record AdminMonitoringStateDto(
            String generatedAtIso,
            String source,
            String health,
            List<AdminMonitoringCategoryDto> categories) {}
    public record AdminMonitoringCategoryDto(
            String key,
            String labelKey,
            String summaryKey,
            String icon,
            String tone,
            String health,
            Long total,
            List<AdminMonitoringNodeDto> nodes,
            List<AdminMonitoringEdgeDto> edges) {}
    public record AdminMonitoringNodeDto(
            String id,
            String labelKey,
            String icon,
            String kind,
            String tone,
            List<AdminMonitoringMetricDto> metrics) {}
    public record AdminMonitoringMetricDto(
            String key,
            String labelKey,
            Long value,
            String valueLabel,
            String tone,
            String status,
            List<AdminMonitoringMetricDetailRowDto> detailRows) {}
    public record AdminMonitoringMetricDetailRowDto(
            String key,
            String labelKey,
            String valueLabel,
            String tone) {}
    public record AdminMonitoringEdgeDto(
            String from,
            String to,
            String labelKey,
            String tone,
            Long volume) {}
    public record AdminStatsTimelinePointDto(
            String dateKey,
            String label,
            Long registrations,
            Long activeUsers,
            Long ratings,
            Long events,
            Long assets,
            Long messages,
            Long moderation) {}
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
