package com.raxim.myscoutee.profile.data.dto.assets;

import java.util.List;

import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.AssetMemberRequestDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.PolicyItemDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.PricingConfigDto;

public final class AssetsDtos {
    private AssetsDtos() {
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
            List<String> menuActions) {
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
            List<String> menuActions) {
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
                    type != null && type.equals("Accommodation") && routes != null && !routes.isEmpty()
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
                    menuActions);
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
            String creatorInitials) {
    }

    public record AssetTicketsPageDto(
            List<AssetTicketDto> items,
            Integer total) {
    }
}
