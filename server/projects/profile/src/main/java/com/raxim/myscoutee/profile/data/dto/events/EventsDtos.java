package com.raxim.myscoutee.profile.data.dto.events;

import java.util.List;
import java.util.Map;

import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.EventSlotOccurrenceDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.EventSlotTemplateDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.LocationCoordinatesDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.PricingConfigDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.SubEventFormItemDto;

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
            String cursor) {
    }

    public record EventsExploreQueryDto(
            String userId,
            String order,
            String view,
            Boolean friendsOnly,
            Boolean openSpotsOnly,
            String topic,
            Integer limit,
            String cursor) {
    }

    public record EventActionRequestDto(
            String userId,
            String type,
            String sourceId,
            String slotSourceId,
            List<String> optionalSubEventIds,
            List<EventCheckoutAssetSelectionDto> assetSelections,
            List<String> acceptedPolicyIds,
            String paymentSessionId,
            Boolean bookingConfirmed) {
    }

    public record EventFeedbackAnswerSubmitDto(
            String cardId,
            String kind,
            String targetUserId,
            String targetRole,
            String primaryValue,
            String secondaryValue,
            List<String> personalityTraitIds,
            List<String> tags,
            String submittedAtIso) {
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

    public record EventFeedbackSubmitRequestDto(
            String userId,
            String eventId,
            List<EventFeedbackAnswerSubmitDto> answers) {
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

    public record EventRecordDto(
            String id,
            String userId,
            String type,
            String status,
            String avatar,
            String title,
            String subtitle,
            String timeframe,
            String inviter,
            Integer unread,
            Integer activity,
            Boolean isAdmin,
            Boolean isInvitation,
            Boolean isHosting,
            Boolean isTrashed,
            Boolean published,
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
            Boolean autoInviter,
            String frequency,
            Boolean ticketing,
            PricingConfigDto pricing,
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
            List<String> topics,
            List<SubEventFormItemDto> subEvents,
            String subEventsDisplayMode,
            Double rating,
            Double relevance,
            Double affinity) {
    }

    public record EventsExplorePageDto(
            List<EventRecordDto> records,
            Integer total,
            String nextCursor) {
    }

    public record ActivitiesEventSyncPayloadDto(
            String syncKey,
            String id,
            String target,
            String title,
            String shortDescription,
            String timeframe,
            Integer activity,
            Boolean isAdmin,
            String startAt,
            String endAt,
            Double distanceKm,
            String imageUrl,
            Integer acceptedMembers,
            Integer pendingMembers,
            Integer capacityTotal,
            Integer capacityMin,
            Integer capacityMax,
            Integer capacityTotalActual,
            Boolean autoInviter,
            String frequency,
            Boolean ticketing,
            PricingConfigDto pricing,
            Boolean slotsEnabled,
            List<EventSlotTemplateDto> slotTemplates,
            String parentEventId,
            String slotTemplateId,
            Boolean generated,
            String eventType,
            EventSlotOccurrenceDto nextSlot,
            String visibility,
            String blindMode,
            Boolean published,
            String creatorUserId,
            String creatorName,
            String creatorInitials,
            String creatorGender,
            String creatorCity,
            String location,
            LocationCoordinatesDto locationCoordinates,
            String sourceLink,
            List<String> acceptedMemberUserIds,
            List<String> pendingMemberUserIds,
            List<String> topics,
            List<SubEventFormItemDto> subEvents,
            String subEventsDisplayMode,
            String paymentSessionId) {
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
            String currency) {
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
