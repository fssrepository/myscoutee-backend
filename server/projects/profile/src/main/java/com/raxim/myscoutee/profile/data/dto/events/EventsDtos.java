package com.raxim.myscoutee.profile.data.dto.events;

import java.util.List;
import java.util.Map;

import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.EventSlotOccurrenceDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.EventSlotTemplateDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.ActivityMemberEntryDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.LocationCoordinatesDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.PolicyItemDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.PricingConfigDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.PricingPromoCodeDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.SubEventDefinitionDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.SubEventItemDto;
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
            String pendingReason,
            String checkoutState,
            List<EventCheckoutBasketItemDto> basketItems,
            List<EventCheckoutPricingSummaryRowDto> pricingSummaryRows,
            List<EventCheckoutLineItemDto> lineItems,
            Double totalAmount,
            String currency,
            Boolean removeMembershipOnly,
            String checkoutResultState,
            String checkoutSessionId,
            Object counterDelta,
            List<String> appliedPromoCodes) {
        public EventActionRequestDto(
                String userId,
                String sourceId,
                String slotSourceId,
                List<String> optionalSubEventIds,
                List<EventCheckoutAssetSelectionDto> assetSelections,
                List<String> acceptedPolicyIds,
                String paymentSessionId,
                Boolean bookingConfirmed,
                String pendingReason,
                String checkoutState,
                List<EventCheckoutBasketItemDto> basketItems,
                List<EventCheckoutPricingSummaryRowDto> pricingSummaryRows,
                List<EventCheckoutLineItemDto> lineItems,
                Double totalAmount,
                String currency,
                Boolean removeMembershipOnly,
                String checkoutResultState,
                String checkoutSessionId,
                Object counterDelta) {
            this(
                    userId,
                    sourceId,
                    slotSourceId,
                    optionalSubEventIds,
                    assetSelections,
                    acceptedPolicyIds,
                    paymentSessionId,
                    bookingConfirmed,
                    pendingReason,
                    checkoutState,
                    basketItems,
                    pricingSummaryRows,
                    lineItems,
                    totalAmount,
                    currency,
                    removeMembershipOnly,
                    checkoutResultState,
                    checkoutSessionId,
                    counterDelta,
                    null);
        }

        public EventActionRequestDto(
                String userId,
                String sourceId,
                String slotSourceId,
                List<String> optionalSubEventIds,
                List<EventCheckoutAssetSelectionDto> assetSelections,
                List<String> acceptedPolicyIds,
                String paymentSessionId,
                Boolean bookingConfirmed,
                String pendingReason,
                String checkoutState,
                List<EventCheckoutBasketItemDto> basketItems,
                List<EventCheckoutPricingSummaryRowDto> pricingSummaryRows,
                List<EventCheckoutLineItemDto> lineItems,
                Double totalAmount,
                String currency) {
            this(
                    userId,
                    sourceId,
                    slotSourceId,
                    optionalSubEventIds,
                    assetSelections,
                    acceptedPolicyIds,
                    paymentSessionId,
                    bookingConfirmed,
                    pendingReason,
                    checkoutState,
                    basketItems,
                    pricingSummaryRows,
                    lineItems,
                    totalAmount,
                    currency,
                    null,
                    null,
                    null,
                    null,
                    null);
        }

        public EventActionRequestDto(
                String userId,
                String sourceId,
                String slotSourceId,
                List<String> optionalSubEventIds,
                List<EventCheckoutAssetSelectionDto> assetSelections,
                List<String> acceptedPolicyIds,
                String paymentSessionId,
                Boolean bookingConfirmed,
                String pendingReason,
                String checkoutState,
                List<EventCheckoutBasketItemDto> basketItems,
                List<EventCheckoutPricingSummaryRowDto> pricingSummaryRows,
                List<EventCheckoutLineItemDto> lineItems,
                Double totalAmount,
                String currency,
                List<String> appliedPromoCodes) {
            this(
                    userId,
                    sourceId,
                    slotSourceId,
                    optionalSubEventIds,
                    assetSelections,
                    acceptedPolicyIds,
                    paymentSessionId,
                    bookingConfirmed,
                    pendingReason,
                    checkoutState,
                    basketItems,
                    pricingSummaryRows,
                    lineItems,
                    totalAmount,
                    currency,
                    null,
                    null,
                    null,
                    null,
                    appliedPromoCodes);
        }

        public EventActionRequestDto(
                String userId,
                String sourceId,
                String slotSourceId,
                List<String> optionalSubEventIds,
                List<EventCheckoutAssetSelectionDto> assetSelections,
                List<String> acceptedPolicyIds,
                String paymentSessionId,
                Boolean bookingConfirmed,
                String pendingReason) {
            this(
                    userId,
                    sourceId,
                    slotSourceId,
                    optionalSubEventIds,
                    assetSelections,
                    acceptedPolicyIds,
                    paymentSessionId,
                    bookingConfirmed,
                    pendingReason,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null);
        }
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
            String slotSourceId,
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

    public record EventFeedbackStatQueryDto(
            String userId,
            String eventId) {
    }

    public record EventFeedbackStatOptionDto(
            String key,
            Integer count) {
    }

    public record EventFeedbackStatSectionDto(
            String key,
            Integer responseCount,
            List<EventFeedbackStatOptionDto> options) {
    }

    public record EventFeedbackStatDto(
            String eventId,
            Integer totalResponses,
            List<EventFeedbackStatSectionDto> sections) {
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

    public record EventFeedbackSubmitRequestDto(
            String userId,
            EventFeedbackDetailDto feedback) {
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
            Boolean full,
            String eventType,
            String mode,
            Integer acceptedMembers,
            Integer pendingMembers,
            List<String> acceptedMemberUserIds,
            List<String> pendingMemberUserIds,
            List<String> invitedMemberUserIds,
            List<String> pendingRequestMemberUserIds,
            String pendingReason,
            Boolean approvalRequired,
            String checkoutResultState,
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
            Boolean full,
            Boolean autoInviter,
            String frequency,
            Boolean ticketing,
            Boolean approvalRequired,
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
            List<SubEventItemDto> subEvents,
            String mode,
            Double rating,
            Double boost,
            Double affinity,
            String paymentSessionId) {
    }

    public record EventInvitationContextDto(
            EventDetailDto record,
            List<ActivityMemberEntryDto> members,
            EventCheckoutBasketDto checkoutBasket) {
    }

    public record EventSubEventsQueryDto(
            String userId,
            String eventId,
            String order,
            String view,
            String anchorDate,
            String rangeStart,
            String rangeEnd,
            Boolean participantOnly,
            Integer page,
            Integer pageSize,
            String cursor) {
        public EventSubEventsQueryDto(
                String userId,
                String eventId,
                String order,
                String view,
                String anchorDate,
                String rangeStart,
                String rangeEnd,
                Boolean participantOnly) {
            this(userId, eventId, order, view, anchorDate, rangeStart, rangeEnd, participantOnly, null, null, null);
        }
    }

    public record EventSubEventsSlotDto(
            String id,
            String parentEventId,
            String slotSourceId,
            String slotTemplateId,
            String title,
            String timeframe,
            String startAt,
            String endAt,
            List<SubEventItemDto> subEventItems) {
    }

    public record EventSubEventsResultDto(
            String mode,
            List<EventSubEventsSlotDto> slots,
            Integer total,
            String nextCursor) {
        public EventSubEventsResultDto(String mode, List<EventSubEventsSlotDto> slots) {
            this(mode, slots, slots == null ? 0 : slots.size(), null);
        }
    }

    public record EventSubEventsSlotPage(
            List<EventSubEventsSlotDto> slots,
            Integer total,
            String nextCursor) {
    }

    public record EventCheckoutSlotsQueryDto(
            String userId,
            String eventId,
            String view,
            String order,
            String anchorDate,
            String rangeStart,
            String rangeEnd,
            Integer limit,
            String cursor) {
    }

    public record EventCheckoutSlotDayDto(
            String dateKey,
            Integer slotCount,
            Integer availableSlots,
            Boolean bookedByViewer,
            Double lowestAmount,
            String currency) {
    }

    public record EventCheckoutSlotDto(
            String id,
            String parentEventId,
            String slotSourceId,
            String slotTemplateId,
            String title,
            String timeframe,
            String startAtIso,
            String endAtIso,
            Integer capacityTotal,
            Integer acceptedMembers,
            Integer pendingMembers,
            Integer availableSlots,
            Boolean bookedByViewer,
            Double amount,
            String currency,
            List<EventCheckoutPricingSummaryRowDto> pricingSummaryRows) {
    }

    public record EventCheckoutOptionalSubEventDto(
            String id,
            String name,
            String description,
            String startAt,
            String endAt,
            Integer capacityTotal,
            Integer reservedCount,
            Integer availableCount,
            Double amount,
            String currency,
            List<EventCheckoutPricingSummaryRowDto> pricingSummaryRows) {
    }

    public record EventCheckoutSlotsResultDto(
            String eventId,
            String mode,
            List<EventCheckoutSlotDayDto> days,
            List<EventCheckoutSlotDto> slots,
            Integer total,
            String nextCursor,
            String currency,
            List<EventCheckoutOptionalSubEventDto> optionalSubEvents,
            EventCheckoutBasketDto checkoutBasket) {
    }

    public record EventCheckoutRequestDto(
            String userId,
            String sourceId,
            String slotSourceId,
            List<String> optionalSubEventIds,
            List<EventCheckoutAssetSelectionDto> assetSelections,
            List<String> acceptedPolicyIds,
            List<EventCheckoutBasketItemDto> basketItems,
            List<EventCheckoutPricingSummaryRowDto> pricingSummaryRows,
            String checkoutState,
            List<EventCheckoutLineItemDto> lineItems,
            Double totalAmount,
            String currency,
            String pendingReason,
            List<String> appliedPromoCodes) {
        public EventCheckoutRequestDto(
                String userId,
                String sourceId,
                String slotSourceId,
                List<String> optionalSubEventIds,
                List<EventCheckoutAssetSelectionDto> assetSelections,
                List<String> acceptedPolicyIds,
                List<EventCheckoutBasketItemDto> basketItems,
                List<EventCheckoutPricingSummaryRowDto> pricingSummaryRows,
                String checkoutState,
                List<EventCheckoutLineItemDto> lineItems,
                Double totalAmount,
                String currency,
                String pendingReason) {
            this(
                    userId,
                    sourceId,
                    slotSourceId,
                    optionalSubEventIds,
                    assetSelections,
                    acceptedPolicyIds,
                    basketItems,
                    pricingSummaryRows,
                    checkoutState,
                    lineItems,
                    totalAmount,
                    currency,
                    pendingReason,
                    null);
        }
    }

    public record EventCheckoutPromoCodeValidationRequestDto(
            String sourceId,
            String code) {
    }

    public record EventCheckoutPromoCodeValidationResultDto(
            boolean valid,
            String code,
            PricingPromoCodeDto promoCode,
            String effect,
            String message,
            String messageKey) {
        public EventCheckoutPromoCodeValidationResultDto(
                boolean valid,
                String code,
                PricingPromoCodeDto promoCode,
                String effect,
                String message) {
            this(valid, code, promoCode, effect, message, null);
        }
    }

    public record EventCheckoutStateChangeRequestDto(
            String userId,
            String sourceId,
            String slotSourceId,
            String checkoutState,
            String resultState,
            String pendingReason,
            String checkoutSessionId,
            Object counterDelta,
            EventCheckoutRequestDto checkoutRequest) {
        public EventCheckoutStateChangeRequestDto(
                String userId,
                String sourceId,
                String slotSourceId,
                String checkoutState,
                String resultState,
                String pendingReason,
                String checkoutSessionId,
                Object counterDelta) {
            this(userId, sourceId, slotSourceId, checkoutState, resultState, pendingReason, checkoutSessionId, counterDelta, null);
        }

        public EventCheckoutStateChangeRequestDto(
                String userId,
                String sourceId,
                String checkoutState,
                String resultState,
                String pendingReason,
                String checkoutSessionId) {
            this(userId, sourceId, null, checkoutState, resultState, pendingReason, checkoutSessionId, null, null);
        }
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

    public record EventCheckoutPricingSummaryRowDto(
            String key,
            String label,
            String detail,
            Double amount,
            String currency,
            Integer multiplier) {
    }

    public record EventCheckoutBasketItemDto(
            String id,
            String kind,
            String sourceId,
            String slotSourceId,
            String slotTemplateId,
            String selectedDateKey,
            String subEventId,
            String resourceType,
            String label,
            String detail,
            Double amount,
            String currency,
            Integer quantity,
            String status,
            String resultState,
            List<EventCheckoutPricingSummaryRowDto> pricingSummaryRows,
            String checkoutSessionId,
            String createdAtIso,
            String updatedAtIso,
            String expiresAtIso) {
    }

    public record EventCheckoutBasketDto(
            String userId,
            String sourceId,
            String status,
            List<EventCheckoutBasketItemDto> items,
            List<EventCheckoutPricingSummaryRowDto> pricingSummaryRows,
            List<EventCheckoutLineItemDto> lineItems,
            Double totalAmount,
            String currency,
            String slotSourceId,
            String selectedDateKey,
            String checkoutSessionId,
            String expiresAtIso,
            List<String> appliedPromoCodes) {
        public EventCheckoutBasketDto(
                String userId,
                String sourceId,
                String status,
                List<EventCheckoutBasketItemDto> items,
                List<EventCheckoutPricingSummaryRowDto> pricingSummaryRows,
                List<EventCheckoutLineItemDto> lineItems,
                Double totalAmount,
                String currency,
                String slotSourceId,
                String selectedDateKey,
                String checkoutSessionId,
                String expiresAtIso) {
            this(
                    userId,
                    sourceId,
                    status,
                    items,
                    pricingSummaryRows,
                    lineItems,
                    totalAmount,
                    currency,
                    slotSourceId,
                    selectedDateKey,
                    checkoutSessionId,
                    expiresAtIso,
                    null);
        }
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

    public record EventCheckoutPaymentAuditDto(
            String id,
            String userId,
            String sourceId,
            String checkoutSessionId,
            String provider,
            String status,
            String bookingStatus,
            String auditKind,
            Integer revisionNumber,
            Double adjustmentAmount,
            Integer bookingQuantity,
            String supersedesPaymentId,
            Double amount,
            String currency,
            List<EventCheckoutBasketItemDto> basketItems,
            List<EventCheckoutPricingSummaryRowDto> pricingSummaryRows,
            List<EventCheckoutLineItemDto> lineItems,
            String joinedAtIso,
            String createdAtIso) {
    }
}
