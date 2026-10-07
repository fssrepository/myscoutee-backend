package com.raxim.myscoutee.domain.content.dto;
import java.util.Map;
import com.raxim.myscoutee.domain.media.dto.MediaDtos.ImageDetailsDto;
import static com.raxim.myscoutee.domain.media.dto.MediaDtos.normalizeImageDetails;

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
            String updatedByUserId,
            Map<String, ImageDetailsDto> imageDetails,
            String workspaceGroupId) {
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
            String submittedAtIso,
            Map<String, ImageDetailsDto> imageDetails) {
    }

    public record IdeaPostAdminActionRequestDto(String actorUserId) {
    }
}
