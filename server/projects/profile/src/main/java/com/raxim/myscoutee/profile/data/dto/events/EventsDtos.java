package com.raxim.myscoutee.profile.data.dto.events;

import java.util.List;
import java.util.Map;

import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.EventSlotOccurrenceDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.EventSlotTemplateDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.LocationCoordinatesDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.PolicyItemDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.PricingConfigDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.SubEventDefinitionDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.SubEventFormItemDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.SubEventGroupItemDto;

public final class EventsDtos {
    private EventsDtos() {
    }

    public record EventsFilterRequestDto(
            String userId,
            String filter,
            String hostingPublicationFilter,
            String secondaryFilter,
            String sort,
            String view,
            Integer limit,
            String cursor,
            String anchorDate,
            String rangeStart,
            String rangeEnd) {
    }

    public record EventsExploreQueryDto(
            String userId,
            String order,
            String view,
            Boolean friendsOnly,
            Boolean openSpotsOnly,
            String topic,
            Integer limit,
            String cursor,
            List<String> excludedSourceIds) {
    }

    public record EventActionRequestDto(
            String userId,
            String sourceId,
            String slotSourceId,
            List<String> optionalSubEventIds,
            List<EventCheckoutAssetSelectionDto> assetSelections,
            List<String> acceptedPolicyIds,
            String paymentSessionId,
            Boolean bookingConfirmed,
            String pendingReason) {
    }

    public record EventParticipationActionResultDto(
            String sourceId,
            String slotSourceId,
            String action,
            String membershipStatus,
            String pendingReason,
            Integer acceptedMembers,
            Integer pendingMembers,
            Integer capacityTotal,
            Boolean full,
            String paymentSessionId) {
    }

    public record EventStageActionRequestDto(
            String userId,
            String sourceId,
            String subEventId,
            Integer subEventIndex,
            String action,
            String reason) {
    }

    public record EventStageActionResultDto(
            String sourceId,
            String subEventId,
            Integer subEventIndex,
            String action,
            String stageStatus,
            String stageStatusReason,
            String stageStatusUpdatedAt,
            String stageFinalizedAt,
            String stageFinalizedByUserId,
            Boolean autoInviter) {
    }

    public record EventFeedbackAnswerDto(
            String cardId,
            String eventId,
            String kind,
            String targetUserId,
            String targetRole,
            String primaryValue,
            String secondaryValue,
            List<String> personalityTraitIds,
            List<String> tags,
            String submittedAtIso) {
    }

    public record EventFeedbackStateDto(
            String eventId,
            Boolean removed,
            String submittedAtIso,
            String removedAtIso,
            String organizerNote,
            Map<String, EventFeedbackAnswerDto> answersByCardId) {
    }

    public record EventFeedbackReceivedEntryDto(
            String viewerUserId,
            String viewerName,
            String viewerInitials,
            String viewerGender,
            String viewerImageUrl,
            String eventId,
            String submittedAtIso,
            String updatedAtIso,
            String organizerNote,
            List<EventFeedbackAnswerDto> answers) {
    }

    public record EventFeedbackReceivedEventDto(
            String eventId,
            List<EventFeedbackReceivedEntryDto> entries) {
    }

    public record EventFeedbackNoteRequestDto(
            String userId,
            String eventId,
            String text) {
    }

    public record EventFeedbackToggleRequestDto(
            String userId,
            String eventId) {
    }

    public record EventFeedbackPageQueryDto(
            String userId,
            String filter,
            Integer page,
            Integer pageSize) {
    }

    public record EventFeedbackQueryDto(
            String userId,
            String eventId) {
    }

    public record EventFeedbackPageCountsDto(
            Integer ownEvents,
            Integer pending,
            Integer feedbacked,
            Integer removed) {
    }

    public record EventFeedbackPageStateSnapshotDto(
            Map<String, Boolean> submittedCardsById,
            Map<String, EventFeedbackAnswerDto> submittedAnswersByCardId,
            Map<String, String> submittedEventsById,
            Map<String, Boolean> removedEventsById,
            Map<String, String> removedEventDatesById,
            Map<String, String> organizerNotesByEventId) {
    }

    public record EventFeedbackDto(
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

    public record EventFeedbackCardDto(
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
            List<String> selectedTraitIds) {
    }

    public record EventFeedbackPageResultDto(
            List<EventFeedbackDto> items,
            Integer total,
            List<EventFeedbackDto> allItems,
            List<EventFeedbackDto> organizerItems,
            List<EventFeedbackReceivedEventDto> receivedEvents,
            EventFeedbackPageStateSnapshotDto state,
            EventFeedbackPageCountsDto counts) {
    }

    public record EventFeedbackDetailDto(
            String eventId,
            String title,
            String submittedAtIso,
            List<EventFeedbackCardDto> cards) {
    }

    public record EventDto(
            String id,
            String userId,
            String status,
            List<String> adminIds,
            String title,
            String subtitle,
            String timeframe,
            String inviter,
            Integer activity,
            String creatorUserId,
            String creatorName,
            String creatorInitials,
            String creatorCity,
            String visibility,
            String startAtIso,
            String endAtIso,
            Double distanceKm,
            String imageUrl,
            String location,
            Integer capacityMin,
            Integer capacityMax,
            Integer capacityTotal,
            String eventType,
            Integer acceptedMembers,
            Integer pendingMembers,
            List<String> acceptedMemberUserIds,
            List<String> pendingMemberUserIds,
            List<String> invitedMemberUserIds,
            List<String> pendingRequestMemberUserIds,
            String pendingReason,
            Double boost) {
    }

    public record EventsExplorePageDto(
            List<EventDto> records,
            Integer total,
            String nextCursor) {
    }

    public record EventListPageDto(
            List<EventDto> records,
            Integer total,
            String nextCursor,
            List<EventDto> items) {
        public EventListPageDto(List<EventDto> records, Integer total, String nextCursor) {
            this(records, total, nextCursor, List.of());
        }
    }

    public record EventDetailDto(
            String syncKey,
            String id,
            String userId,
            String type,
            String status,
            String statusBeforeSuppression,
            List<String> adminIds,
            String avatar,
            String title,
            String subtitle,
            String timeframe,
            String inviter,
            Integer unread,
            Integer activity,
            String trashedAtIso,
            String creatorUserId,
            String creatorName,
            String creatorInitials,
            String creatorGender,
            String creatorCity,
            String visibility,
            String blindMode,
            String startAtIso,
            String endAtIso,
            Double distanceKm,
            String imageUrl,
            String sourceLink,
            String location,
            LocationCoordinatesDto locationCoordinates,
            Integer capacityMin,
            Integer capacityMax,
            Integer capacityTotal,
            Integer capacityTotalActual,
            Boolean autoInviter,
            String frequency,
            Boolean ticketing,
            PricingConfigDto pricing,
            Boolean policiesEnabled,
            List<PolicyItemDto> policies,
            Boolean slotsEnabled,
            List<EventSlotTemplateDto> slotTemplates,
            String parentEventId,
            String slotTemplateId,
            Boolean generated,
            String eventType,
            EventSlotOccurrenceDto nextSlot,
            List<EventSlotOccurrenceDto> upcomingSlots,
            Integer acceptedMembers,
            Integer pendingMembers,
            List<String> acceptedMemberUserIds,
            List<String> pendingMemberUserIds,
            List<String> invitedMemberUserIds,
            List<String> pendingRequestMemberUserIds,
            String pendingReason,
            List<String> topics,
            Boolean subEventsEnabled,
            List<SubEventDefinitionDto> subEventDefinitions,
            List<SubEventFormItemDto> subEvents,
            String mode,
            Double rating,
            Double boost,
            Double affinity,
            String paymentSessionId) {
    }

    public record EventSubEventsQueryDto(
            String userId,
            String eventId,
            String order,
            String view,
            String anchorDate,
            String rangeStart,
            String rangeEnd) {
    }

    public record EventSubEventRuntimeDto(
            String id,
            String name,
            String description,
            String startAt,
            String endAt,
            String location,
            String createdByUserId,
            List<SubEventGroupItemDto> groups,
            Integer tournamentGroupCount,
            Integer tournamentGroupCapacityMin,
            Integer tournamentGroupCapacityMax,
            String tournamentLeaderboardType,
            Integer tournamentAdvancePerGroup,
            Boolean optional,
            PricingConfigDto pricing,
            Integer capacityMin,
            Integer capacityMax,
            Integer membersAccepted,
            Integer membersPending,
            Integer carsPending,
            Integer accommodationPending,
            Integer suppliesPending,
            Integer carsAccepted,
            Integer accommodationAccepted,
            Integer suppliesAccepted,
            Integer carsCapacityMin,
            Integer carsCapacityMax,
            Integer accommodationCapacityMin,
            Integer accommodationCapacityMax,
            Integer suppliesCapacityMin,
            Integer suppliesCapacityMax,
            Integer slotStartOffsetMinutes,
            Integer slotDurationMinutes,
            String stageStatus,
            String stageStatusReason,
            String stageStatusUpdatedAt,
            String stageFinalizedAt,
            String stageFinalizedByUserId,
            String runtimeId,
            String parentEventId,
            String slotSourceId,
            String slotTemplateId,
            String slotTitle,
            String slotTimeframe) {
    }

    public record EventSubEventsResultDto(
            EventDetailDto event,
            List<EventSubEventRuntimeDto> items) {
    }

    public record EventCheckoutRequestDto(
            String userId,
            String sourceId,
            String slotSourceId,
            List<String> optionalSubEventIds,
            List<EventCheckoutAssetSelectionDto> assetSelections,
            List<String> acceptedPolicyIds,
            List<EventCheckoutLineItemDto> lineItems,
            Double totalAmount,
            String currency,
            String pendingReason) {
    }

    public record EventCheckoutAssetSelectionDto(
            String subEventId,
            String resourceType) {
    }

    public record EventCheckoutLineItemDto(
            String id,
            String kind,
            String label,
            String detail,
            Double amount,
            String currency) {
    }

    public record EventCheckoutSessionDto(
            String id,
            String provider,
            String mode,
            String status,
            Double amount,
            String currency,
            String paymentUrl) {
    }
}
