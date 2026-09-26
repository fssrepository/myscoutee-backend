package com.raxim.myscoutee.profile.data.document;

import java.util.List;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.PolicyItemDto;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("communityGroups")
public record CommunityGroup(
        @Id String id, @Indexed String ownerUserId, String name, String description,
        String imageUrl, String category, @Indexed String visibility,
        boolean hideMembers, Policy policy, String createdAtIso, String updatedAtIso,
        @Version Long version, String moderationStatus, Long moderationVersion,
        Long moderationPending, Long moderationQueueRevision, Long pendingMembers) {
    public CommunityGroup(String id, String ownerUserId, String name, String description, String imageUrl,
            String category, String visibility, boolean hideMembers, Policy policy, String createdAtIso,
            String updatedAtIso, Long version, String moderationStatus, Long moderationVersion,
            Long moderationPending, Long moderationQueueRevision) {
        this(id, ownerUserId, name, description, imageUrl, category, visibility, hideMembers, policy,
                createdAtIso, updatedAtIso, version, moderationStatus, moderationVersion, moderationPending, moderationQueueRevision, null);
    }
    public CommunityGroup(String id, String ownerUserId, String name, String description, String imageUrl,
            String category, String visibility, boolean hideMembers, Policy policy, String createdAtIso,
            String updatedAtIso, Long version, String moderationStatus, Long moderationVersion) {
        this(id, ownerUserId, name, description, imageUrl, category, visibility, hideMembers, policy,
                createdAtIso, updatedAtIso, version, moderationStatus, moderationVersion, null, null);
    }
    public long pendingModerationCount() { return moderationPending == null ? 0 : Math.max(0, moderationPending); }
    public long pendingMemberCount() { return pendingMembers == null ? 0 : Math.max(0, pendingMembers); }
    public boolean moderationVisible() { return moderationStatus == null || "accepted".equals(moderationStatus); }
    public record Policy(boolean workspace, boolean enabled, List<String> requiredFields,
            Boolean policiesEnabled, List<PolicyItemDto> policies) {
        public Policy(boolean workspace, boolean enabled, List<String> requiredFields) {
            this(workspace, enabled, requiredFields, false, List.of());
        }
    }
}
