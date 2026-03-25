package com.raxim.myscoutee.profile.dto.assets;

import java.util.List;

import com.raxim.myscoutee.profile.dto.shared.SharedDtos.AssetCardDto;

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
}
