package com.raxim.myscoutee.profile.data.dto.assets;

import java.util.List;

import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.AssetCardDto;
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
        public AssetDto(AssetCardDto card) {
            this(
                    card == null ? null : card.id(),
                    card == null ? null : card.type(),
                    card == null ? null : card.title(),
                    card == null ? null : card.subtitle(),
                    card == null ? null : card.category(),
                    card == null ? null : card.city(),
                    card == null ? null : card.capacityTotal(),
                    card == null ? null : card.quantity(),
                    card == null ? null : card.details(),
                    card == null ? null : card.imageUrl(),
                    card == null ? null : card.sourceLink(),
                    card == null ? null : card.routes(),
                    card == null ? null : card.policies(),
                    card == null ? null : card.pricing(),
                    card == null ? null : card.visibility(),
                    card == null ? null : card.status(),
                    card == null ? null : card.ownerUserId(),
                    card == null ? null : card.ownerName(),
                    card == null ? null : card.requests(),
                    card == null ? null : card.menuActions());
        }

        public AssetCardDto toCardDto() {
            return new AssetCardDto(
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
                    policies,
                    pricing,
                    visibility,
                    status,
                    ownerUserId,
                    ownerName,
                    requests,
                    menuActions);
        }
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
        public AssetDetailDto(AssetCardDto card) {
            this(
                    card == null ? null : card.id(),
                    card == null ? null : card.type(),
                    card == null ? null : card.title(),
                    card == null ? null : card.subtitle(),
                    card == null ? null : card.category(),
                    card == null ? null : card.city(),
                    card == null ? null : card.capacityTotal(),
                    card == null ? null : card.quantity(),
                    card == null ? null : card.details(),
                    card == null ? null : card.imageUrl(),
                    card == null ? null : card.sourceLink(),
                    card == null ? null : card.routes(),
                    card == null ? null : card.policies(),
                    card == null ? null : card.pricing(),
                    card == null ? null : card.visibility(),
                    card == null ? null : card.status(),
                    card == null ? null : card.ownerUserId(),
                    card == null ? null : card.ownerName(),
                    card == null ? null : card.requests(),
                    card == null ? null : card.menuActions());
        }

        public AssetCardDto toCardDto() {
            return new AssetCardDto(
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
                    policies,
                    pricing,
                    visibility,
                    status,
                    ownerUserId,
                    ownerName,
                    requests,
                    menuActions);
        }

        public AssetDto toAssetDto() {
            return new AssetDto(toCardDto());
        }
    }

    public record AssetUpsertRequestDto(
            String userId,
            AssetDetailDto asset) {
        public AssetUpsertRequestDto(String userId, AssetCardDto asset) {
            this(userId, asset == null ? null : new AssetDetailDto(asset));
        }
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
