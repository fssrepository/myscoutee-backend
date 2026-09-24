package com.raxim.myscoutee.profile.data.document;

import java.util.List;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("communityGroups")
public record CommunityGroup(
        @Id String id, @Indexed String ownerUserId, String name, String description,
        String imageUrl, String category, @Indexed String visibility,
        boolean hideMembers, Policy policy, String createdAtIso, String updatedAtIso,
        @Version Long version, String moderationStatus, Long moderationVersion) {
    public boolean moderationVisible() { return moderationStatus == null || "accepted".equals(moderationStatus); }
    public record Policy(boolean workspace, boolean enabled, List<String> requiredFields) {}
}
