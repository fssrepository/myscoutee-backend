package com.raxim.myscoutee.domain.administration.dto;

import java.util.List;
import java.util.Map;

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
    public record AdminActionRequestDto(String adminUserId, String message, String reportId) {}
    public record AdminReviewResolveRequestDto(String adminUserId, Boolean resolved) {}
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
            Map<String, Long> filterCounts,
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
            List<AdminScheduledTaskResultDto> taskResults,
            String updatedDate,
            String updatedUser) {}
    public record AdminScheduledTaskResultDto(
            String taskKey,
            String lastRunAtIso,
            String status,
            String detail,
            Integer affectedCount,
            String nextDueAtIso) {}
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
            String nextRunAtIso,
            String lastRunStatus,
            String lastRunDetail,
            Integer lastRunCount,
            String lastRunUser,
            Integer pendingCount,
            String pendingCountUnit,
            String pendingCountUpdatedAtIso) {}
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
            AdminStatsGraphDto graph) {}
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
    public record AdminAffinityGraphDto(
            String generatedAtIso,
            String source,
            String layoutVersion,
            List<AdminAffinityGraphNodeDto> nodes,
            List<AdminAffinityGraphEdgeDto> edges) {}
    public record AdminAffinityGraphMetaDto(
            String generatedAtIso,
            String source,
            String layoutVersion,
            Integer memberCount,
            Integer linkCount,
            Integer componentCount,
            Integer isolatedCount,
            Integer maxZoom,
            Integer tileSize,
            Integer nodeRenderBudget,
            Integer edgeRenderBudget,
            Boolean materialized) {}
    public record AdminAffinityGraphNeighborhoodDto(
            String generatedAtIso,
            String source,
            String layoutVersion,
            String centerUserId,
            Integer depth,
            List<AdminAffinityGraphNodeDto> nodes,
            List<AdminAffinityGraphEdgeDto> edges) {}
    public record AdminAffinityGraphForestsDto(
            String generatedAtIso,
            String source,
            String layoutVersion,
            Integer forestCount,
            Integer forestLevel,
            Integer maxForestLevel,
            Integer limit,
            Integer offset,
            List<AdminAffinityGraphForestDto> forests) {}
    public record AdminAffinityGraphForestDto(
            String componentId,
            String representativeUserId,
            String representativeName,
            String representativeInitials,
            String gender,
            Integer memberCount,
            Integer edgeCount,
            Double weightedDegree,
            Double x,
            Double y,
            Double z,
            Double radius) {}
    public record AdminAffinityGraphTileDto(
            String generatedAtIso,
            String source,
            String layoutVersion,
            Integer z,
            Integer x,
            Integer y,
            Integer nodeCount,
            Integer edgeCount,
            Boolean truncated,
            List<AdminAffinityGraphNodeDto> nodes,
            List<AdminAffinityGraphEdgeDto> edges) {}
    public record AdminAffinityGraphNodeDto(
            String id,
            String name,
            String initials,
            String gender,
            String city,
            Integer age,
            String headline,
            String traitLabel,
            String statusText,
            String profileStatus,
            String image,
            List<String> images,
            String componentId,
            Double x,
            Double y,
            Double z,
            Integer degree,
            Double weightedDegree,
            Double centrality) {}
    public record AdminAffinityGraphEdgeDto(
            String id,
            String source,
            String target,
            Double weight,
            Double affinityScore,
            String updatedDate) {}
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
            Map<String, Long> filterCounts,
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
            List<AdminFeedbackDto> feedback,
            AdminReviewCountsDto reviewCounts,
            Map<String, AdminReviewCountsDto> reviewCountsByScope) {
        public AdminDashboardDto(AdminUserDto activeAdmin, List<AdminReportedUserDto> reportedUsers,
                List<AdminReportedUserDto> blockedUsers, List<AdminFeedbackDto> feedback, AdminReviewCountsDto reviewCounts) {
            this(activeAdmin, reportedUsers, blockedUsers, feedback, reviewCounts, Map.of());
        }
    }
    public record AdminReviewCountsDto(
            Integer reportsUnresolved,
            Integer reportsResolved,
            Integer feedbackUnresolved,
            Integer feedbackResolved) {}
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
            String supportChatId,
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
            String createdDate,
            String warnedAtIso,
            String warnedByAdminUserId,
            String resolvedAtIso,
            String resolvedByAdminUserId) {}
    public record AdminFeedbackDto(
            String id,
            String userId,
            String userName,
            String userImageUrl,
            String category,
            String subject,
            String details,
            String createdDate,
            String resolvedAtIso,
            String resolvedByAdminUserId) {}
}
