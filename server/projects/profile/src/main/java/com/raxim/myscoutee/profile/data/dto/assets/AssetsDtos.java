package com.raxim.myscoutee.profile.data.dto.assets;

import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonInclude;

import com.raxim.myscoutee.profile.data.AssetCatalog;
import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.UserPaymentTotalsDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.AssetMemberRequestDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.PolicyItemDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.PricingConfigDto;

public final class AssetsDtos {
    private AssetsDtos() {
    }

    public record AssetRequestMetricsDto(
            Integer allItems,
            Integer activeItems,
            Integer assignedItems,
            Integer borrowedItems,
            Integer pendingItems) {
    }

    public record AssetMemberStatusChangeRequestDto(
            String assetId,
            String eventId,
            String subEventId,
            String actorUserId,
            String action,
            AssetMemberRequestDto request,
            String paymentSessionId,
            String previousManagerUserId) {
        public AssetMemberStatusChangeRequestDto(
                String assetId,
                String eventId,
                String subEventId,
                String actorUserId,
                String action,
                AssetMemberRequestDto request) {
            this(assetId, eventId, subEventId, actorUserId, action, request, null, null);
        }
    }

    public record AssetMemberStatusChangeDto(
            String assetId,
            String eventId,
            String subEventId,
            String userId,
            String previousStatus,
            String status,
            Integer acceptedMemberDelta,
            Integer pendingMemberDelta,
            UserPaymentTotalsDto paymentTotals) {
    }

    public record AssetDto(
            String id,
            String type,
            String title,
            String subtitle,
            String category,
            String city,
            Integer capacityTotal,
            Integer quantity,
            String description,
            String imageUrl,
            String sourceLink,
            String locationLabel,
            String priceLabel,
            Boolean policiesEnabled,
            Integer policyCount,
            String visibility,
            String status,
            String ownerUserId,
            String ownerName,
            List<AssetMemberRequestDto> requests,
            AssetRequestMetricsDto metrics,
            List<String> menuActions,
            String ownerReleasedAtIso,
            String ownerAvatarUrl) {
        public AssetDto(
                String id,
                String type,
                String title,
                String subtitle,
                String category,
                String city,
                Integer capacityTotal,
                Integer quantity,
                String description,
                String imageUrl,
                String sourceLink,
                String locationLabel,
                String priceLabel,
                Boolean policiesEnabled,
                Integer policyCount,
                String visibility,
                String status,
                String ownerUserId,
                String ownerName,
                List<AssetMemberRequestDto> requests,
                AssetRequestMetricsDto metrics,
                List<String> menuActions) {
            this(
                    id, type, title, subtitle, category, city, capacityTotal, quantity,
                    description, imageUrl, sourceLink, locationLabel, priceLabel,
                    policiesEnabled, policyCount, visibility, status, ownerUserId, ownerName,
                    requests, metrics, menuActions, null, null);
        }

        public AssetDto(
                String id,
                String type,
                String title,
                String subtitle,
                String category,
                String city,
                Integer capacityTotal,
                Integer quantity,
                String description,
                String imageUrl,
                String sourceLink,
                String locationLabel,
                String priceLabel,
                Boolean policiesEnabled,
                Integer policyCount,
                String visibility,
                String status,
                String ownerUserId,
                String ownerName,
                List<AssetMemberRequestDto> requests,
                List<String> menuActions) {
            this(
                    id,
                    type,
                    title,
                    subtitle,
                    category,
                    city,
                    capacityTotal,
                    quantity,
                    description,
                    imageUrl,
                    sourceLink,
                    locationLabel,
                    priceLabel,
                    policiesEnabled,
                    policyCount,
                    visibility,
                    status,
                    ownerUserId,
                    ownerName,
                    requests,
                    null,
                    menuActions,
                    null,
                    null);
        }
    }

    public record AssetExplorePageDto(
            List<AssetDto> items,
            Integer total,
            String nextCursor,
            Map<String, String> checkoutResultStates) {
        public AssetExplorePageDto(
                List<AssetDto> items,
                Integer total,
                String nextCursor) {
            this(items, total, nextCursor, Map.of());
        }
    }

    public record AssetBorrowWindowDto(
            String eventId,
            String subEventId,
            String startAtIso,
            String endAtIso) {
    }

    public record AssetDetailDto(
            String id,
            String type,
            String title,
            String subtitle,
            String category,
            String city,
            Integer capacityTotal,
            Integer quantity,
            String details,
            String imageUrl,
            String sourceLink,
            List<String> routes,
            Boolean policiesEnabled,
            List<PolicyItemDto> policies,
            PricingConfigDto pricing,
            String visibility,
            String status,
            String ownerUserId,
            String ownerName,
            List<AssetMemberRequestDto> requests,
            AssetRequestMetricsDto metrics,
            List<String> menuActions,
            String ownerReleasedAtIso,
            AssetBorrowWindowDto borrowWindow,
            String ownerAvatarUrl) {
        public AssetDetailDto(
                String id,
                String type,
                String title,
                String subtitle,
                String category,
                String city,
                Integer capacityTotal,
                Integer quantity,
                String details,
                String imageUrl,
                String sourceLink,
                List<String> routes,
                Boolean policiesEnabled,
                List<PolicyItemDto> policies,
                PricingConfigDto pricing,
                String visibility,
                String status,
                String ownerUserId,
                String ownerName,
                List<AssetMemberRequestDto> requests,
                AssetRequestMetricsDto metrics,
                List<String> menuActions,
                String ownerReleasedAtIso) {
            this(
                    id, type, title, subtitle, category, city, capacityTotal, quantity,
                    details, imageUrl, sourceLink, routes, policiesEnabled, policies, pricing,
                    visibility, status, ownerUserId, ownerName, requests, metrics, menuActions,
                    ownerReleasedAtIso, null, null);
        }

        public AssetDetailDto(
                String id,
                String type,
                String title,
                String subtitle,
                String category,
                String city,
                Integer capacityTotal,
                Integer quantity,
                String details,
                String imageUrl,
                String sourceLink,
                List<String> routes,
                Boolean policiesEnabled,
                List<PolicyItemDto> policies,
                PricingConfigDto pricing,
                String visibility,
                String status,
                String ownerUserId,
                String ownerName,
                List<AssetMemberRequestDto> requests,
                AssetRequestMetricsDto metrics,
                List<String> menuActions) {
            this(
                    id, type, title, subtitle, category, city, capacityTotal, quantity,
                    details, imageUrl, sourceLink, routes, policiesEnabled, policies, pricing,
                    visibility, status, ownerUserId, ownerName, requests, metrics, menuActions, null, null, null);
        }

        public AssetDetailDto(
                String id,
                String type,
                String title,
                String subtitle,
                String category,
                String city,
                Integer capacityTotal,
                Integer quantity,
                String details,
                String imageUrl,
                String sourceLink,
                List<String> routes,
                Boolean policiesEnabled,
                List<PolicyItemDto> policies,
                PricingConfigDto pricing,
                String visibility,
                String status,
                String ownerUserId,
                String ownerName,
                List<AssetMemberRequestDto> requests,
                List<String> menuActions) {
            this(
                    id,
                    type,
                    title,
                    subtitle,
                    category,
                    city,
                    capacityTotal,
                    quantity,
                    details,
                    imageUrl,
                    sourceLink,
                    routes,
                    policiesEnabled,
                    policies,
                    pricing,
                    visibility,
                    status,
                    ownerUserId,
                    ownerName,
                    requests,
                    null,
                    menuActions,
                    null,
                    null,
                    null);
        }

        public AssetDto toAssetDto() {
            return new AssetDto(
                    id,
                    type,
                    title,
                    subtitle,
                    category,
                    city,
                    capacityTotal,
                    quantity,
                    details,
                    imageUrl,
                    sourceLink,
                    type != null && type.equals(AssetCatalog.TYPE_ACCOMMODATION) && routes != null && !routes.isEmpty()
                            ? routes.get(0)
                            : city,
                    null,
                    Boolean.TRUE.equals(policiesEnabled),
                    Boolean.TRUE.equals(policiesEnabled) && policies != null ? policies.size() : 0,
                    visibility,
                    status,
                    ownerUserId,
                    ownerName,
                    requests,
                    metrics,
                    menuActions,
                    ownerReleasedAtIso,
                    ownerAvatarUrl);
        }
    }

    public record AssetUpsertRequestDto(
            String userId,
            AssetDetailDto asset) {
    }

    public record AssetReplaceRequestDto(
            String userId,
            List<AssetDto> assets) {
    }

    public record AssetDeleteRequestDto(
            String userId,
            String assetId) {
    }

    public record AssetMakeManagerRequestDto(
            String userId,
            String assetId,
            String targetUserId) {
    }

    public record AssetTicketDto(
            String id,
            String holderUserId,
            String scanCode,
            String usedAtIso,
            String type,
            String status,
            String title,
            String subtitle,
            String detail,
            String dateIso,
            Integer distanceMetersExact,
            Boolean isAdmin,
            String startAt,
            String endAt,
            String imageUrl,
            String visibility,
            String avatarInitials,
            String creatorInitials,
            String revision) {
    }

    public record AssetTicketValidationRequestDto(
            String code,
            String userId) {
    }

    public record AssetTicketScanPayloadDto(
            String code,
            String holderUserId,
            String holderName,
            String holderInitials,
            String holderAvatarUrl,
            Integer holderAge,
            String holderCity,
            String holderRole,
            String eventId,
            String eventTitle,
            String eventSubtitle,
            String eventTimeframe,
            String eventDateLabel,
            String issuedAtIso,
            String usedAtIso) {
    }

    @JsonInclude(JsonInclude.Include.ALWAYS)
    public record AssetTicketValidationDto(
            Boolean valid,
            String reason,
            AssetTicketScanPayloadDto ticket) {
    }

    public record AssetTicketsPageDto(
            List<AssetTicketDto> items,
            Integer total) {
    }

    public record AssetTicketSyncKnownItemDto(
            String id,
            String revision) {
    }

    public record AssetTicketSyncBoundaryDto(
            String id,
            String dateIso) {
    }

    public record AssetTicketSyncRequestDto(
            String userId,
            String order,
            Integer limit,
            List<AssetTicketSyncKnownItemDto> knownItems,
            AssetTicketSyncBoundaryDto loadedTail) {
    }

    public record AssetTicketSyncResponseDto(
            List<AssetTicketDto> upserts,
            List<String> removedIds,
            Integer total) {
    }

    public record AssetOccupancyStatDto(
            String id,
            String assetId,
            String ownerUserId,
            String dateIso,
            String startAtIso,
            String endAtIso,
            Integer occupied,
            Integer capacity,
            Integer pendingCount,
            Integer pendingQuantity,
            Integer itemCount) {
    }

    public record AssetOccupancyRowDto(
            String id,
            String assetId,
            String ownerUserId,
            String userId,
            String dateIso,
            String startAtIso,
            String endAtIso,
            String title,
            String subtitle,
            String detail,
            String scheduleLabel,
            String avatarInitials,
            String avatarUrl,
            String gender,
            String status,
            String requestKind,
            Integer quantity,
            Integer occupied,
            Integer capacity,
            Integer remaining,
            Integer pendingCount,
            Integer pendingQuantity,
            String eventId,
            String eventTitle,
            String subEventId,
            String subEventTitle,
            String subEventStartAtIso,
            String subEventEndAtIso,
            List<String> menuActions) {
    }

    public record AssetOccupancyStatsPageDto(
            List<AssetOccupancyStatDto> items,
            Integer total,
            String nextCursor) {
    }

    public record AssetOccupancyPageDto(
            List<AssetOccupancyRowDto> items,
            Integer total,
            String nextCursor) {
    }
}
