package com.raxim.myscoutee.domain.feedback.dto;
import java.util.*;
public final class FeedbackDtos {
    private FeedbackDtos() {}
    public record FeedbackAnswerDto(
            String cardId,
            String eventId,
            String kind,
            String targetUserId,
            String targetRole,
            String primaryValue,
            String secondaryValue,
            String eventComment,
            List<String> personalityTraitIds,
            List<String> tags,
            String submittedAtIso) {
    }

    public record FeedbackStateDto(
            String eventId,
            Boolean removed,
            String submittedAtIso,
            String removedAtIso,
            String organizerNote,
            Map<String, FeedbackAnswerDto> answersByCardId) {
    }

    public record FeedbackReceivedEntryDto(
            String viewerUserId,
            String viewerName,
            String viewerInitials,
            String viewerGender,
            String viewerImageUrl,
            String eventId,
            String submittedAtIso,
            String updatedAtIso,
            String organizerNote,
            List<FeedbackAnswerDto> answers) {
    }

    public record FeedbackReceivedEventDto(
            String eventId,
            List<FeedbackReceivedEntryDto> entries) {
    }

    public record FeedbackNoteRequestDto(
            String userId,
            String eventId,
            String text) {
    }

    public record FeedbackToggleRequestDto(
            String userId,
            String eventId) {
    }

    public record FeedbackPageQueryDto(
            String userId,
            String filter,
            Integer page,
            Integer pageSize,
            String campaignId) {
        public FeedbackPageQueryDto(String userId, String filter, Integer page, Integer pageSize) {
            this(userId, filter, page, pageSize, null);
        }

    }

    public record FeedbackQueryDto(
            String userId,
            String eventId) {
    }

    public record FeedbackStatQueryDto(
            String userId,
            String eventId) {
    }

    public record FeedbackStatOptionDto(
            String key,
            Integer count) {
    }

    public record FeedbackStatSectionDto(
            String key,
            Integer responseCount,
            List<FeedbackStatOptionDto> options) {
    }

    public record FeedbackStatDto(
            String eventId,
            Integer totalResponses,
            List<FeedbackStatSectionDto> sections) {
    }

    public record FeedbackPageCountsDto(
            Integer ownEvents,
            Integer pending,
            Integer feedbacked,
            Integer removed) {
    }

    public record FeedbackPageStateSnapshotDto(
            Map<String, Boolean> submittedCardsById,
            Map<String, FeedbackAnswerDto> submittedAnswersByCardId,
            Map<String, String> submittedEventsById,
            Map<String, Boolean> removedEventsById,
            Map<String, String> removedEventDatesById,
            Map<String, String> organizerNotesByEventId) {
    }

    public record FeedbackDto(
            String eventId,
            String title,
            String subtitle,
            String timeframe,
            String imageUrl,
            Long startAtMs,
            Integer pendingCards,
            Integer totalCards,
            Boolean isRemoved,
            Boolean isFeedbacked,
            Long feedbackedAtMs,
            Long removedAtMs,
            Boolean isOwnEvent) {
    }

    public record FeedbackCardDto(
            String id,
            String eventId,
            String kind,
            String attendeeUserId,
            String targetUserId,
            String targetRole,
            String eventTitle,
            String eventSubtitle,
            String eventImageUrl,
            String eventTimeframe,
            String eventStartAtIso,
            String eventLabel,
            String targetName,
            Integer targetAge,
            String targetCity,
            String targetGender,
            String targetTraitLabel,
            String targetImageUrl,
            String answerPrimary,
            String answerSecondary,
            String eventComment,
            List<String> selectedTraitIds) {
    }

    public record FeedbackPageResultDto(
            List<FeedbackDto> items,
            Integer total,
            List<FeedbackDto> allItems,
            List<FeedbackDto> organizerItems,
            List<FeedbackReceivedEventDto> receivedEvents,
            FeedbackPageStateSnapshotDto state,
            FeedbackPageCountsDto counts,
            List<EvaluationItem> evaluations, Map<String,Long> evaluationCounts) {
        public FeedbackPageResultDto(List<FeedbackDto> items,Integer total,List<FeedbackDto> allItems,
                List<FeedbackDto> organizerItems,List<FeedbackReceivedEventDto> receivedEvents,
                FeedbackPageStateSnapshotDto state,FeedbackPageCountsDto counts) {
            this(items,total,allItems,organizerItems,receivedEvents,state,counts,List.of(),Map.of());
        }
    }

    public record FeedbackDetailDto(
            String eventId,
            String title,
            String submittedAtIso,
            String organizerNote,
            List<FeedbackCardDto> cards) {
    }

    public record FeedbackSubmitRequestDto(
            String userId,
            FeedbackDetailDto feedback) {
    }

    public record Evaluation(String id,String baseGroupId,String caseId,String caseTitle,String serviceId,
        String providerAccountId,String viewerAccountId,String status,Map<String,Double> criteria,Double average,
        String comment,String createdAtIso,String submittedAtIso) {}
    public record EvaluationItem(Evaluation feedback,String providerName,String reviewerName,String serviceTitle,String serviceImageUrl) {}
}
