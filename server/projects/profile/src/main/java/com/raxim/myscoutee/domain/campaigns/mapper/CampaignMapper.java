package com.raxim.myscoutee.domain.campaigns.mapper;

import com.raxim.myscoutee.domain.campaigns.document.Campaign;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.campaigns.dto.CampaignDtos.Item;

public final class CampaignMapper {
    private CampaignMapper() {}
    public static Item toDto(Campaign c, Users owner, Users viewer) {
        return toDto(c, owner, viewer, 0d);
    }
    public static Item toDto(Campaign c, Users owner, Users viewer, double viewerRating) {
        return toDto(c, owner, viewer, viewerRating, null);
    }
    public static Item toDto(Campaign c, Users owner, Users viewer, double viewerRating,
            com.raxim.myscoutee.domain.affinity.document.UserRate.RatingSnapshot snapshot) {
        return new Item(c.id(), c.workspaceGroupId(), c.ownerUserId(), owner.getName(),
                owner.getImages() == null || owner.getImages().isEmpty() ? null : owner.getImages().getFirst(),
                owner.getCity(), distance(owner, viewer), c.title(), c.description(), c.kind(), c.category(),
                c.imageUrls(), c.attachments() == null ? java.util.List.of() : c.attachments(), c.status(), c.createdAtIso(), c.updatedAtIso(), c.version(), viewerRating, snapshot);
    }
    public static Double distance(Users owner, Users viewer) {
        var a = owner.getLocationCoordinates(); var b = viewer.getLocationCoordinates();
        if (a == null || b == null || a.latitude() == null || a.longitude() == null || b.latitude() == null || b.longitude() == null) return null;
        double h = Math.pow(Math.sin(Math.toRadians(b.latitude() - a.latitude()) / 2), 2)
            + Math.cos(Math.toRadians(a.latitude())) * Math.cos(Math.toRadians(b.latitude()))
            * Math.pow(Math.sin(Math.toRadians(b.longitude() - a.longitude()) / 2), 2);
        return Math.round(12742 * Math.asin(Math.sqrt(Math.min(1, h))) * 10.0) / 10.0;
    }
}
