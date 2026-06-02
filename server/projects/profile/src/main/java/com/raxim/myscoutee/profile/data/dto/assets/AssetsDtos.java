package com.raxim.myscoutee.profile.data.dto.assets;

import java.util.List;

import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventRecordDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.AssetCardDto;

public final class AssetsDtos {
    private AssetsDtos() {
    }

    public record AssetUpsertRequestDto(
            String userId,
            AssetCardDto asset) {
    }

    public record AssetReplaceRequestDto(
            String userId,
            List<AssetCardDto> assets) {
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
            List<EventRecordDto> records,
            Integer total) {
    }
}
