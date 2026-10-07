package com.raxim.myscoutee.domain.campaigns.mapper;

import com.raxim.myscoutee.domain.campaigns.document.Campaign;
import com.raxim.myscoutee.domain.accounts.api.WorkspaceProfile;
import com.raxim.myscoutee.domain.campaigns.dto.CampaignDtos.Item;

public final class CampaignMapper {
    private CampaignMapper() {}
    public static Item toDto(Campaign c, WorkspaceProfile owner, WorkspaceProfile viewer) {
        return toDto(c, owner, viewer, 0d);
    }
    public static Item toDto(Campaign c, WorkspaceProfile owner, WorkspaceProfile viewer, double viewerRating) {
        return toDto(c, owner, viewer, viewerRating, null);
    }
    public static Item toDto(Campaign c, WorkspaceProfile owner, WorkspaceProfile viewer, double viewerRating,
            com.raxim.myscoutee.domain.affinity.api.CampaignRatings.RatingSnapshot snapshot) {
        return new Item(c.id(), c.workspaceGroupId(), c.ownerUserId(), owner.getName(),
                owner.getImages() == null || owner.getImages().isEmpty() ? null : owner.getImages().getFirst(),
                owner.getCity(), com.raxim.myscoutee.domain.accounts.api.ProfileDistances.distance(owner, viewer), c.title(), c.description(), c.kind(), c.category(),
                c.imageUrls(), c.attachments() == null ? java.util.List.of() : c.attachments(), c.status(), c.createdAtIso(), c.updatedAtIso(), c.version(), viewerRating, snapshot);
    }
}
