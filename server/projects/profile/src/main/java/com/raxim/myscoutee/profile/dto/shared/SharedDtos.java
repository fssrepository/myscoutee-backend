package com.raxim.myscoutee.profile.dto.shared;

import java.util.List;
import java.util.Map;

public final class SharedDtos {
    private SharedDtos() {
    }

    public record LocationCoordinatesDto(
            Double latitude,
            Double longitude) {
    }

    public record SubEventGroupItemDto(
            String id,
            String name,
            Integer capacityMin,
            Integer capacityMax,
            String source) {
    }

    public record SubEventFormItemDto(
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
            Integer suppliesCapacityMax) {
    }

    public record EventSlotTemplateDto(
            String id,
            String startAt,
            String endAt) {
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
            Boolean invitedByActiveUser,
            String metAtIso,
            String actionAtIso,
            String metWhere,
            Double relevance,
            String avatarUrl) {
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
            String addedByUserId,
            List<String> routes) {
    }

    public record SubEventSupplyContributionEntryDto(
            String id,
            String userId,
            Integer quantity,
            String addedAtIso) {
    }

    public record ActivitySubEventResourceStateDto(
            String ownerId,
            String subEventId,
            String assetOwnerUserId,
            Map<String, List<String>> assetAssignmentIds,
            Map<String, Map<String, SubEventAssignedAssetSettingsDto>> assetSettingsByType,
            Map<String, List<SubEventSupplyContributionEntryDto>> supplyContributionEntriesByAssetId) {
    }

    public record AssetMemberRequestDto(
            String id,
            String userId,
            String name,
            String initials,
            String gender,
            String status,
            String note) {
    }

    public record AssetCardDto(
            String id,
            String type,
            String title,
            String subtitle,
            String city,
            Integer capacityTotal,
            String details,
            String imageUrl,
            String sourceLink,
            List<String> routes,
            List<AssetMemberRequestDto> requests) {
    }
}
