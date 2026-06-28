package com.raxim.myscoutee.profile.data.dto.assets;

import java.util.List;

import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventDto;
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
            String locationLabel,
            String priceLabel,
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
                    type != null && type.equals("Accommodation") && routes != null && !routes.isEmpty()
                            ? routes.get(0)
                            : city,
                    null,
                    policies == null ? 0 : policies.size(),
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

    public record AssetSourceRefreshRequestDto(
            String userId,
            String assetId,
            String type,
            String sourceLink) {
        public AssetSourceRefreshRequestDto(String userId, String type, String sourceLink) {
            this(userId, null, type, sourceLink);
        }
    }

    public record AssetSourceRefreshResponseDto(
            Boolean enabled,
            Boolean supported,
            String normalizedUrl,
            String title,
            String subtitle,
            String details,
            String imageUrl) {
    }

    public record AssetTicketsPageDto(
            List<EventDto> records,
            Integer total) {
    }
}
