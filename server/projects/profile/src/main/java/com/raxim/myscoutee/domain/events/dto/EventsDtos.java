package com.raxim.myscoutee.domain.events.dto;
import java.util.Map;
import com.raxim.myscoutee.domain.media.dto.MediaDtos.ImageDetailsDto;
import static com.raxim.myscoutee.domain.media.dto.MediaDtos.normalizeImageDetails;

import java.util.List;
import java.util.Map;

import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserEventCountersDto;
import com.raxim.myscoutee.common.dto.SharedDtos.EventSlotOccurrenceDto;
import com.raxim.myscoutee.common.dto.SharedDtos.EventSlotTemplateDto;
import com.raxim.myscoutee.common.dto.SharedDtos.ActivityMemberEntryDto;
import com.raxim.myscoutee.common.dto.SharedDtos.LocationCoordinatesDto;
import com.raxim.myscoutee.common.dto.SharedDtos.MingleConfigurationDto;
import com.raxim.myscoutee.common.dto.SharedDtos.PolicyItemDto;
import com.raxim.myscoutee.common.dto.SharedDtos.PricingConfigDto;
import com.raxim.myscoutee.common.dto.SharedDtos.PricingCancellationPolicyDto;
import com.raxim.myscoutee.domain.payments.dto.PaymentDtos.PaymentRefundPreviewDto;
import com.raxim.myscoutee.common.dto.SharedDtos.PricingPromoCodeDto;
import com.raxim.myscoutee.common.dto.SharedDtos.SubEventDefinitionDto;
import com.raxim.myscoutee.common.dto.SharedDtos.SubEventItemDto;
import com.raxim.myscoutee.common.dto.SharedDtos.SubEventGroupItemDto;
import com.raxim.myscoutee.common.dto.SharedDtos.TournamentCurrentStageDto;

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
            String rangeEnd,
            String campaignId) {
        public EventsFilterRequestDto(String userId, String filter, String hostingPublicationFilter, String secondaryFilter, String sort, String view, Integer limit, String cursor, String anchorDate, String rangeStart, String rangeEnd) {
            this(userId, filter, hostingPublicationFilter, secondaryFilter, sort, view, limit, cursor, anchorDate, rangeStart, rangeEnd, null);
        }

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
            List<String> excludedSourceIds,
            String mode,
            Boolean followedOnly) {
        public EventsExploreQueryDto(String userId, String order, String view, Boolean friendsOnly,
                Boolean openSpotsOnly, String topic, Integer limit, String cursor,
                List<String> excludedSourceIds, String mode) {
            this(userId, order, view, friendsOnly, openSpotsOnly, topic, limit, cursor, excludedSourceIds, mode, false);
        }
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
            String paymentSessionId,
            Boolean changed,
            String reason,
            UserActivityCounterDeltaDto counterDelta,
            String paymentStatus,
            String paymentUrl) {
        public EventParticipationActionResultDto(
                String sourceId,
                String slotSourceId,
                String action,
                String membershipStatus,
                String pendingReason,
                Integer acceptedMembers,
                Integer pendingMembers,
                Integer capacityTotal,
                Boolean full,
                String paymentSessionId,
                Boolean changed,
                String reason,
                UserActivityCounterDeltaDto counterDelta) {
            this(
                    sourceId,
                    slotSourceId,
                    action,
                    membershipStatus,
                    pendingReason,
                    acceptedMembers,
                    pendingMembers,
                    capacityTotal,
                    full,
                    paymentSessionId,
                    changed,
                    reason,
                    counterDelta,
                    null,
                    null);
        }

        public EventParticipationActionResultDto(
                String sourceId,
                String slotSourceId,
                String action,
                String membershipStatus,
                String pendingReason,
                Integer acceptedMembers,
                Integer pendingMembers,
                Integer capacityTotal,
                Boolean full,
                String paymentSessionId,
                Boolean changed,
                String reason) {
            this(
                    sourceId,
                    slotSourceId,
                    action,
                    membershipStatus,
                    pendingReason,
                    acceptedMembers,
                    pendingMembers,
                    capacityTotal,
                    full,
                    paymentSessionId,
                    changed,
                    reason,
                    null,
                    null,
                    null);
        }
    }

    public record UserActivityCounterDeltaDto(
            Integer game,
            Integer chats,
            Integer invitations,
            Integer events,
            Integer hosting,
            Integer cars,
            Integer accommodation,
            Integer supplies,
            Integer tickets,
            Integer contacts,
            Integer feedback,
            UserChatCounterDeltaDto chat,
            UserEventCounterDeltaDto event,
            UserAssetCounterDeltaDto asset,
            UserFeedbackCounterDeltaDto feedbackCounts,
            Integer adminJobs,
            Integer adminMetrics,
            Integer notifications) {
    }

    public record UserChatCounterDeltaDto(
            Integer all,
            Integer event,
            Integer subEvent,
            Integer group,
            Integer service,
            Integer appSupport) {
    }

    public record UserEventCounterDeltaDto(
            Integer all,
            Integer active,
            Integer pending,
            Integer invitations,
            Integer hosting,
            Integer drafts,
            Integer trash,
            Integer watchlist) {
        public UserEventCounterDeltaDto(
                Integer all,
                Integer active,
                Integer pending,
                Integer invitations,
                Integer hosting,
                Integer drafts,
                Integer trash) {
            this(all, active, pending, invitations, hosting, drafts, trash, null);
        }
    }

    public record EventWatchActionResultDto(
            String sourceId,
            Boolean watched,
            Boolean changed,
            UserEventCountersDto eventCounters) {
    }

    public record UserAssetCounterDeltaDto(
            Integer cars,
            Integer accommodation,
            Integer supplies,
            Integer tickets) {
    }

    public record UserFeedbackCounterDeltaDto(
            Integer ownEvents,
            Integer pending,
            Integer feedbacked,
            Integer removed) {
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
            Integer stageResultRevision,
            Boolean autoInviter) {
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
            String creatorAvatarUrl,
            String creatorCity,
            String organizerUserId,
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
            TournamentCurrentStageDto currentStage,
            Boolean ticketing,
            PricingConfigDto pricing,
            Boolean policiesEnabled,
            List<PolicyItemDto> policies,
            Boolean slotsEnabled,
            List<EventSlotTemplateDto> slotTemplates,
            EventSlotOccurrenceDto nextSlot,
            List<EventSlotOccurrenceDto> upcomingSlots,
            Boolean subEventsEnabled,
            List<SubEventDefinitionDto> subEventDefinitions,
            List<SubEventItemDto> subEvents,
            Integer acceptedMembers,
            Integer pendingMembers,
            List<String> acceptedMemberUserIds,
            List<String> pendingMemberUserIds,
            List<String> invitedMemberUserIds,
            List<String> pendingRequestMemberUserIds,
            String pendingReason,
            String currentUserMembershipStatus,
            Boolean approvalRequired,
            String checkoutResultState,
            Double boost,
            Boolean watched,
            String sourceLink,
            String moderationStatus,
            Integer paymentDeadlineHours,
            Boolean paymentDeadlineEnabled,
            Boolean cancelled,
            Boolean cancellationRefundsPending,
            Boolean canCancelForFullRefund,
            String campaignId) {
        public EventDto(String id, String userId, String status, List<String> adminIds, String title, String subtitle, String timeframe, String inviter, Integer activity, String creatorUserId, String creatorName, String creatorInitials, String creatorAvatarUrl, String creatorCity, String organizerUserId, String visibility, String startAtIso, String endAtIso, Double distanceKm, String imageUrl, String location, Integer capacityMin, Integer capacityMax, Integer capacityTotal, Boolean full, String eventType, String mode, TournamentCurrentStageDto currentStage, Boolean ticketing, PricingConfigDto pricing, Boolean policiesEnabled, List<PolicyItemDto> policies, Boolean slotsEnabled, List<EventSlotTemplateDto> slotTemplates, EventSlotOccurrenceDto nextSlot, List<EventSlotOccurrenceDto> upcomingSlots, Boolean subEventsEnabled, List<SubEventDefinitionDto> subEventDefinitions, List<SubEventItemDto> subEvents, Integer acceptedMembers, Integer pendingMembers, List<String> acceptedMemberUserIds, List<String> pendingMemberUserIds, List<String> invitedMemberUserIds, List<String> pendingRequestMemberUserIds, String pendingReason, String currentUserMembershipStatus, Boolean approvalRequired, String checkoutResultState, Double boost, Boolean watched, String sourceLink, String moderationStatus, Integer paymentDeadlineHours, Boolean paymentDeadlineEnabled, Boolean cancelled, Boolean cancellationRefundsPending, Boolean canCancelForFullRefund) {
            this(id, userId, status, adminIds, title, subtitle, timeframe, inviter, activity, creatorUserId, creatorName, creatorInitials, creatorAvatarUrl, creatorCity, organizerUserId, visibility, startAtIso, endAtIso, distanceKm, imageUrl, location, capacityMin, capacityMax, capacityTotal, full, eventType, mode, currentStage, ticketing, pricing, policiesEnabled, policies, slotsEnabled, slotTemplates, nextSlot, upcomingSlots, subEventsEnabled, subEventDefinitions, subEvents, acceptedMembers, pendingMembers, acceptedMemberUserIds, pendingMemberUserIds, invitedMemberUserIds, pendingRequestMemberUserIds, pendingReason, currentUserMembershipStatus, approvalRequired, checkoutResultState, boost, watched, sourceLink, moderationStatus, paymentDeadlineHours, paymentDeadlineEnabled, cancelled, cancellationRefundsPending, canCancelForFullRefund, null);
        }

    }

    public record EventsExplorePageDto(
            List<EventDto> records,
            Integer total,
            String nextCursor,
            Map<String, List<Long>> sortKeys) {
        public EventsExplorePageDto(List<EventDto> records, Integer total, String nextCursor) {
            this(records, total, nextCursor, Map.of());
        }
    }

    public record EventListPageDto(
            List<EventDto> records,
            Integer total,
            String nextCursor,
            List<EventDto> items,
            UserEventCountersDto eventCounters) {
        public EventListPageDto(List<EventDto> records, Integer total, String nextCursor) {
            this(records, total, nextCursor, List.of(), null);
        }

        public EventListPageDto(List<EventDto> records, Integer total, String nextCursor, List<EventDto> items) {
            this(records, total, nextCursor, items, null);
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
            MingleConfigurationDto mingleConfiguration,
            TournamentCurrentStageDto currentStage,
            Double rating,
            Double boost,
            Double affinity,
            String paymentSessionId,
            List<String> imageUrls,
            Map<String, ImageDetailsDto> imageDetails,
            Integer paymentDeadlineHours,
            Boolean paymentDeadlineEnabled,
            String campaignId) {
        public EventDetailDto(String syncKey, String id, String userId, String type, String status, String statusBeforeSuppression, List<String> adminIds, String avatar, String title, String subtitle, String timeframe, String inviter, Integer unread, Integer activity, String trashedAtIso, String creatorUserId, String creatorName, String creatorInitials, String creatorGender, String creatorCity, String visibility, String blindMode, String startAtIso, String endAtIso, Double distanceKm, String imageUrl, String sourceLink, String location, LocationCoordinatesDto locationCoordinates, Integer capacityMin, Integer capacityMax, Integer capacityTotal, Integer capacityTotalActual, Boolean full, Boolean autoInviter, String frequency, Boolean ticketing, Boolean approvalRequired, PricingConfigDto pricing, Boolean policiesEnabled, List<PolicyItemDto> policies, Boolean slotsEnabled, List<EventSlotTemplateDto> slotTemplates, String parentEventId, String slotTemplateId, Boolean generated, String eventType, EventSlotOccurrenceDto nextSlot, List<EventSlotOccurrenceDto> upcomingSlots, Integer acceptedMembers, Integer pendingMembers, List<String> acceptedMemberUserIds, List<String> pendingMemberUserIds, List<String> invitedMemberUserIds, List<String> pendingRequestMemberUserIds, String pendingReason, List<String> topics, Boolean subEventsEnabled, List<SubEventDefinitionDto> subEventDefinitions, List<SubEventItemDto> subEvents, String mode, MingleConfigurationDto mingleConfiguration, TournamentCurrentStageDto currentStage, Double rating, Double boost, Double affinity, String paymentSessionId, List<String> imageUrls, Map<String, ImageDetailsDto> imageDetails, Integer paymentDeadlineHours, Boolean paymentDeadlineEnabled) {
            this(syncKey, id, userId, type, status, statusBeforeSuppression, adminIds, avatar, title, subtitle, timeframe, inviter, unread, activity, trashedAtIso, creatorUserId, creatorName, creatorInitials, creatorGender, creatorCity, visibility, blindMode, startAtIso, endAtIso, distanceKm, imageUrl, sourceLink, location, locationCoordinates, capacityMin, capacityMax, capacityTotal, capacityTotalActual, full, autoInviter, frequency, ticketing, approvalRequired, pricing, policiesEnabled, policies, slotsEnabled, slotTemplates, parentEventId, slotTemplateId, generated, eventType, nextSlot, upcomingSlots, acceptedMembers, pendingMembers, acceptedMemberUserIds, pendingMemberUserIds, invitedMemberUserIds, pendingRequestMemberUserIds, pendingReason, topics, subEventsEnabled, subEventDefinitions, subEvents, mode, mingleConfiguration, currentStage, rating, boost, affinity, paymentSessionId, imageUrls, imageDetails, paymentDeadlineHours, paymentDeadlineEnabled, null);
        }

    }

    public record EventInvitationContextDto(
            EventDetailDto record,
            List<ActivityMemberEntryDto> members,
            EventCheckoutBasketDto checkoutBasket,
            PricingConfigDto vipPricingOffer) {
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
            String cursor,
            Integer calendarCellLimit,
            String calendarTimeZone) {
        public EventSubEventsQueryDto(String userId, String eventId, String order, String view, String anchorDate,
                String rangeStart, String rangeEnd, Boolean participantOnly, Integer page, Integer pageSize, String cursor) {
            this(userId, eventId, order, view, anchorDate, rangeStart, rangeEnd, participantOnly, page, pageSize, cursor, null, null);
        }
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
            List<SubEventItemDto> subEventItems,
            TournamentCurrentStageDto currentStage) {
        public EventSubEventsSlotDto(String id, String parentEventId, String slotSourceId, String slotTemplateId,
                String title, String timeframe, String startAt, String endAt, List<SubEventItemDto> subEventItems) {
            this(id, parentEventId, slotSourceId, slotTemplateId, title, timeframe, startAt, endAt, subEventItems, null);
        }
    }

    public record EventSubEventsResultDto(
            String mode,
            List<EventSubEventsSlotDto> slots,
            Integer total,
            String nextCursor,
            boolean canAccessResources,
            List<EventSubEventsCalendarCellDto> calendarCells) {
        public EventSubEventsResultDto(String mode, List<EventSubEventsSlotDto> slots, Integer total, String nextCursor, boolean canAccessResources) {
            this(mode, slots, total, nextCursor, canAccessResources, List.of());
        }
        public EventSubEventsResultDto(String mode, List<EventSubEventsSlotDto> slots) {
            this(mode, slots, slots == null ? 0 : slots.size(), null, false);
        }
    }

    public record EventSubEventsCalendarCellDto(String startAt, String endAt, int count) {}

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
            List<String> appliedPromoCodes,
            String paymentMethodId) {
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
                String pendingReason,
                List<String> appliedPromoCodes) {
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
                    appliedPromoCodes,
                    null);
        }

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
                    null,
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
            EventCheckoutRequestDto checkoutRequest) {
        public EventCheckoutStateChangeRequestDto(
                String userId,
                String sourceId,
                String slotSourceId,
                String checkoutState,
                String resultState,
                String pendingReason,
                String checkoutSessionId) {
            this(userId, sourceId, slotSourceId, checkoutState, resultState, pendingReason, checkoutSessionId, null);
        }

        public EventCheckoutStateChangeRequestDto(
                String userId,
                String sourceId,
                String checkoutState,
                String resultState,
                String pendingReason,
                String checkoutSessionId) {
            this(userId, sourceId, null, checkoutState, resultState, pendingReason, checkoutSessionId, null);
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
            String createdAtIso,
            String bookingStartAtIso,
            String bookingEndAtIso,
            PricingCancellationPolicyDto cancellationPolicy,
            PaymentRefundPreviewDto refundPreview) {
    }
}
