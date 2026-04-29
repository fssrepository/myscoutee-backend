package com.raxim.myscoutee.profile.data.dto.share;

public final class ShareTokenDtos {
    private ShareTokenDtos() {
    }

    public record ShareTokenCreateRequestDto(
            String kind,
            String entityId,
            String assetType,
            String ownerUserId) {
    }

    public record ShareTokenCreateResponseDto(String token) {
    }

    public record ShareTokenResolvedItemDto(
            String kind,
            String entityId,
            String assetType,
            String ownerUserId,
            String title,
            String subtitle,
            String description,
            String imageUrl,
            String url) {
    }
}
