package com.raxim.myscoutee.profile.data.dto.media;

public final class MediaDtos {
    private MediaDtos() {
    }

    public record MediaImageUploadResponseDto(
            Boolean uploaded,
            String imageUrl,
            String url) {
    }
}
