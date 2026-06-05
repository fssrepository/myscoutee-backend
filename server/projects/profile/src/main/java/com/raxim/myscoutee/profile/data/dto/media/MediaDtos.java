package com.raxim.myscoutee.profile.data.dto.media;

public final class MediaDtos {
    private MediaDtos() {
    }

    public record MediaImageUploadResponseDto(
            Boolean uploaded,
            String imageUrl,
            String url) {
    }

    public record MediaImageImportRequestDto(
            String ownerId,
            String entityId,
            String imageUrl) {
    }

    public record MediaUploadResponseDto(
            Boolean uploaded,
            String url) {
    }
}
