package com.raxim.myscoutee.profile.data.dto.media;

public final class MediaDtos {
    private MediaDtos() {
    }

    public record MediaImageUploadResponseDto(
            Boolean uploaded,
            String imageUrl,
            String url,
            MediaImageSetDto imageSet,
            String originalUrl,
            String smallUrl,
            String mediumUrl,
            String largeUrl) {
        public MediaImageUploadResponseDto(Boolean uploaded, String imageUrl, String url) {
            this(uploaded, imageUrl, url, null, null, null, null, null);
        }
    }

    public record MediaImageSetDto(
            String originalUrl,
            String smallUrl,
            String mediumUrl,
            String largeUrl) {
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
