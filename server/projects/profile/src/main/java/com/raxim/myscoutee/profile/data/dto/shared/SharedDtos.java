package com.raxim.myscoutee.profile.data.dto.shared;

import java.util.List;
import java.util.Map;

import org.springframework.data.mongodb.core.mapping.Field;

import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.UserDto;

public final class SharedDtos {
    private SharedDtos() {
    }

    public record LocationCoordinatesDto(
            Double latitude,
            Double longitude) {
    }

    public record DateRangeDto(
            String startAt,
            String endAt,
            String precision) {
    }

    public record PricingActionDto(
            String kind,
            Double value) {
    }

    public record PricingSlotOverrideDto(
            String id,
            String slotId,
            String label,
            String startAt,
            String endAt,
            Double price,
            String currency) {
    }

    public record PricingQuantityRuleDto(
            String id,
            Integer minQuantity,
            PricingActionDto action) {
    }

    public record PricingDemandRuleDto(
            String id,
            String operator,
            Integer capacityFilledPercent,
            PricingActionDto action,
            String appliesTo,
            List<String> slotIds) {
    }

    public record PricingTimeRuleDto(
            String id,
            String trigger,
            Integer offsetValue,
            String specificDateStart,
            String specificDateEnd,
            PricingActionDto action,
            String appliesTo,
            List<String> slotIds) {
    }

    public record PricingCancellationRuleDto(
            String id,
            String offsetUnit,
            Integer offsetValue,
            String refundKind,
            Double refundValue) {
    }

    public record PricingCancellationPolicyDto(
            Boolean enabled,
            List<PricingCancellationRuleDto> rules) {
    }

    public record PricingPromoCodeDto(
            String id,
            String code,
            PricingActionDto action) {
    }

    public record PricingAudienceSettingsDto(
            Boolean enabled,
            Double memberPrice,
            Double vipPrice,
            Integer inviteOnlyDiscountPercent,
            List<PricingPromoCodeDto> promoCodes,
            String soldOutLabel) {
    }

    public record PricingConfigDto(
            String mode,
            Double basePrice,
            String currency,
            String taxMode,
            String chargeType,
            Boolean quantityRulesEnabled,
            List<PricingQuantityRuleDto> quantityRules,
            Double minPrice,
            Double maxPrice,
            String rounding,
            Boolean demandRulesEnabled,
            List<PricingDemandRuleDto> demandRules,
            Boolean timeRulesEnabled,
            List<PricingTimeRuleDto> timeRules,
            PricingCancellationPolicyDto cancellationPolicy,
            Boolean slotPricingEnabled,
            List<PricingSlotOverrideDto> slotOverrides,
            PricingAudienceSettingsDto audience,
            Boolean enabled) {
        public PricingConfigDto(
                String mode,
                Double basePrice,
                String currency,
                String taxMode,
                String chargeType,
                Boolean quantityRulesEnabled,
                List<PricingQuantityRuleDto> quantityRules,
                Double minPrice,
                Double maxPrice,
                String rounding,
                Boolean demandRulesEnabled,
                List<PricingDemandRuleDto> demandRules,
                Boolean timeRulesEnabled,
                List<PricingTimeRuleDto> timeRules,
                PricingCancellationPolicyDto cancellationPolicy,
                Boolean slotPricingEnabled,
                List<PricingSlotOverrideDto> slotOverrides,
                PricingAudienceSettingsDto audience) {
            this(
                    mode,
                    basePrice,
                    currency,
                    taxMode,
                    chargeType,
                    quantityRulesEnabled,
                    quantityRules,
                    minPrice,
                    maxPrice,
                    rounding,
                    demandRulesEnabled,
                    demandRules,
                    timeRulesEnabled,
                    timeRules,
                    cancellationPolicy,
                    slotPricingEnabled,
                    slotOverrides,
                    audience,
                    null);
        }
    }

    public record SubEventGroupItemDto(
            @Field("id")
            String id,
            String name,
            Integer capacityMin,
            Integer capacityMax,
            String source) {
    }

    public record SubEventDefinitionDto(
            @Field("id")
            String id,
            String name,
            String description,
            String timing,
            Integer offsetMinutes,
            Integer durationMinutes,
            String location,
            Integer tournamentGroupCapacityMin,
            Integer tournamentGroupCapacityMax,
            String tournamentLeaderboardType,
            Integer tournamentAdvancePerGroup,
            Boolean optional,
            PricingConfigDto pricing,
            Integer capacityMin,
            Integer capacityMax,
            String icon) {
    }

    public record SubEventItemDto(
            @Field("id")
            String id,
            String name,
            String description,
            String startAt,
            String endAt,
            String location,
            String createdByUserId,
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
            Integer groupsCount,
            String stageStatus,
            String stageStatusReason,
            String stageStatusUpdatedAt,
            String stageFinalizedAt,
            String stageFinalizedByUserId,
            List<SubEventGroupItemDto> groups) {

        public SubEventItemDto(
                String id,
                String name,
                String description,
                String startAt,
                String endAt,
                String location,
                String createdByUserId,
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
                Integer groupsCount,
                String stageStatus,
                String stageStatusReason,
                String stageStatusUpdatedAt,
                String stageFinalizedAt,
                String stageFinalizedByUserId) {
            this(
                    id, name, description, startAt, endAt, location, createdByUserId,
                    tournamentGroupCapacityMin, tournamentGroupCapacityMax,
                    tournamentLeaderboardType, tournamentAdvancePerGroup, optional, pricing,
                    capacityMin, capacityMax, membersAccepted, membersPending,
                    carsPending, accommodationPending, suppliesPending,
                    carsAccepted, accommodationAccepted, suppliesAccepted,
                    carsCapacityMin, carsCapacityMax,
                    accommodationCapacityMin, accommodationCapacityMax,
                    suppliesCapacityMin, suppliesCapacityMax,
                    slotStartOffsetMinutes, slotDurationMinutes, groupsCount,
                    stageStatus, stageStatusReason, stageStatusUpdatedAt,
                    stageFinalizedAt, stageFinalizedByUserId, List.of());
        }

        public SubEventItemDto(
                String id,
                String name,
                String description,
                String startAt,
                String endAt,
                String location,
                String createdByUserId,
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
                Integer slotDurationMinutes) {
            this(
                    id,
                    name,
                    description,
                    startAt,
                    endAt,
                    location,
                    createdByUserId,
                    tournamentGroupCapacityMin,
                    tournamentGroupCapacityMax,
                    tournamentLeaderboardType,
                    tournamentAdvancePerGroup,
                    optional,
                    pricing,
                    capacityMin,
                    capacityMax,
                    membersAccepted,
                    membersPending,
                    carsPending,
                    accommodationPending,
                    suppliesPending,
                    carsAccepted,
                    accommodationAccepted,
                    suppliesAccepted,
                    carsCapacityMin,
                    carsCapacityMax,
                    accommodationCapacityMin,
                    accommodationCapacityMax,
                    suppliesCapacityMin,
                    suppliesCapacityMax,
                    slotStartOffsetMinutes,
                    slotDurationMinutes,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    List.of());
        }
    }

    public record EventSlotTemplateDto(
            String id,
            String startAt,
            String overrideDate,
            Boolean closed,
            List<SubEventDefinitionDto> subEventDefinitions) {
    }

    public record EventSlotOccurrenceDto(
            String id,
            String parentEventId,
            String slotTemplateId,
            String title,
            String timeframe,
            String startAtIso,
            String endAtIso,
            Integer capacityTotal,
            Integer acceptedMembers,
            Integer pendingMembers) {
    }

    public record ActivityMemberOwnerRefDto(
            String ownerType,
            String ownerId) {
    }

    public record ActivityMemberInvolvementDto(
            String id,
            String ownerType,
            String ownerId,
            String label,
            String detail,
            String status,
            String role,
            String actionAtIso) {
    }

    public record ActivityMemberEntryDto(
            String id,
            String userId,
            String name,
            String initials,
            String gender,
            String city,
            String statusText,
            String role,
            String status,
            String pendingSource,
            String requestKind,
            String invitedByUserId,
            Boolean invitedByActiveUser,
            String metAtIso,
            String actionAtIso,
            String metWhere,
            String avatarUrl,
            UserDto profile,
            List<ActivityMemberInvolvementDto> involvements) {
    }

    public record ActivityMembersSummaryDto(
            String ownerType,
            String ownerId,
            Integer acceptedMembers,
            Integer pendingMembers,
            Integer capacityTotal,
            List<String> acceptedMemberUserIds,
            List<String> pendingMemberUserIds) {
    }

    public record SubEventAssignedAssetSettingsDto(
            Integer capacityMin,
            Integer capacityMax,
            Integer quantity,
            String addedByUserId,
            Boolean routeEnabled,
            List<String> routes) {
    }

    public record SubEventSupplyContributionEntryDto(
            String id,
            String userId,
            Integer quantity,
            String addedAtIso) {
    }

    public record SubEventSupplyContributionPageDto(
            List<SubEventSupplyContributionEntryDto> items,
            Integer total,
            Integer page,
            Integer pageSize) {
    }

    public record ActivitySubEventResourceStateDto(
            String ownerId,
            String subEventId,
            String assetOwnerUserId,
            Map<String, List<String>> assetAssignmentIds,
            Map<String, Map<String, SubEventAssignedAssetSettingsDto>> assetSettingsByType,
            Map<String, List<SubEventSupplyContributionEntryDto>> supplyContributionEntriesByAssetId) {
    }

    public record ActivitySubEventStageRuntimeStateDto(
            String ownerId,
            String subEventId,
            String stageStatus,
            String stageStatusReason,
            String stageStatusUpdatedAt,
            String stageFinalizedAt,
            String stageFinalizedByUserId,
            Integer groupsCount) {
    }

    public record PolicyItemDto(
            String id,
            String title,
            String description,
            Boolean required) {
    }

    public record AssetRequestBookingDto(
            String eventId,
            String eventTitle,
            String subEventId,
            String subEventTitle,
            String slotKey,
            String slotLabel,
            String timeframe,
            String startAtIso,
            String endAtIso,
            Integer quantity,
            Double totalAmount,
            String currency,
            List<String> acceptedPolicyIds,
            String paymentSessionId,
            Boolean inventoryApplied) {
    }

    public record AssetMemberRequestDto(
            String id,
            String userId,
            String name,
            String initials,
            String gender,
            String status,
            String note,
            String requestKind,
            String requestedAtIso,
            AssetRequestBookingDto booking,
            List<String> menuActions) {
    }

}
