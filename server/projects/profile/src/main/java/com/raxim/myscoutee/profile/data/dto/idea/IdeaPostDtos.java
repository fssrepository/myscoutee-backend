package com.raxim.myscoutee.profile.data.dto.idea;

import java.util.List;

public final class IdeaPostDtos {
    private IdeaPostDtos() {
    }

    public record IdeaPostDto(
            String id,
            String title,
            String excerpt,
            String contentHtml,
            String imageUrl,
            List<String> imageUrls,
            Boolean featured,
            Boolean published,
            String submittedAtIso,
            String createdAtIso,
            String createdByUserId,
            String updatedAtIso,
            String updatedByUserId) {
    }

    public record IdeaPostSaveRequestDto(
            String actorUserId,
            String id,
            String title,
            String excerpt,
            String contentHtml,
            String imageUrl,
            List<String> imageUrls,
            Boolean featured,
            Boolean published,
            String submittedAtIso) {
    }

    public record IdeaPostAdminActionRequestDto(String actorUserId) {
    }
}
