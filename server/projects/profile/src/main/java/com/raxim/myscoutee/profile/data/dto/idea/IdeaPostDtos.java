package com.raxim.myscoutee.profile.data.dto.idea;

import java.util.List;

public final class IdeaPostDtos {
    private IdeaPostDtos() {
    }

    public record IdeaPostDto(
            String id,
            String contentKey,
            String lang,
            String languageLabel,
            String title,
            String excerpt,
            String contentHtml,
            String imageUrl,
            List<String> imageUrls,
            Boolean featured,
            Boolean published,
            Boolean trashed,
            String trashedAtIso,
            String trashedByUserId,
            String submittedAtIso,
            String createdAtIso,
            String createdByUserId,
            String updatedAtIso,
            String updatedByUserId) {
    }

    public record IdeaPostAdminCountsDto(
            Integer all,
            Integer featured,
            Integer published,
            Integer drafts,
            Integer trashed) {
    }

    public record IdeaPostAdminPageDto(
            List<IdeaPostDto> records,
            Integer total,
            String nextCursor,
            IdeaPostAdminCountsDto counts) {
    }

    public record IdeaPostPublicPageDto(
            List<IdeaPostDto> records,
            Integer total,
            String nextCursor) {
    }

    public record IdeaPostSaveRequestDto(
            String actorUserId,
            String id,
            String contentKey,
            String lang,
            String title,
            String excerpt,
            String contentHtml,
            String imageUrl,
            List<String> imageUrls,
            List<String> removedImageUrls,
            Boolean featured,
            Boolean published,
            String submittedAtIso) {
    }

    public record IdeaPostAdminActionRequestDto(String actorUserId) {
    }
}
