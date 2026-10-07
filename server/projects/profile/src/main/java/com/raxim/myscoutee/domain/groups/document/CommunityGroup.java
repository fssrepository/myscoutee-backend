package com.raxim.myscoutee.domain.groups.document;

import java.util.List;
import com.raxim.myscoutee.common.dto.SharedDtos.PolicyItemDto;
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
        Long moderationPending, Long moderationQueueRevision, Long pendingMembers,
        String lifecycleStatus, String ownerReleasedAtIso, List<String> takeoverCandidates, String groupType) {
    public static final String WORK_BASE_ID = com.raxim.myscoutee.domain.groups.api.BaseGroups.WORK_BASE_ID;
    public static final String COMMUNITY_BASE_ID = com.raxim.myscoutee.domain.groups.api.BaseGroups.COMMUNITY_BASE_ID;
    public static final List<String> BASE_IDS = com.raxim.myscoutee.domain.groups.api.BaseGroups.BASE_IDS;
    public static boolean isBaseId(String id) { return com.raxim.myscoutee.domain.groups.api.BaseGroups.isBaseId(id); }
    public static String baseIdForType(String type) { return com.raxim.myscoutee.domain.groups.api.BaseGroups.baseIdForType(type); }
    public boolean priorityEnabled() { return !"community".equals(effectiveType()) || COMMUNITY_BASE_ID.equals(id); }
    public String baseId() { return baseIdForType(effectiveType()); }
    public CommunityGroup(String id, String ownerUserId, String name, String description,
        String imageUrl, String category, String visibility,
        boolean hideMembers, Policy policy, String createdAtIso, String updatedAtIso,
        Long version, String moderationStatus, Long moderationVersion,
        Long moderationPending, Long moderationQueueRevision, Long pendingMembers,
        String lifecycleStatus, String ownerReleasedAtIso, List<String> takeoverCandidates) {
        this(id, ownerUserId, name, description, imageUrl, category, visibility, hideMembers, policy, createdAtIso, updatedAtIso, version, moderationStatus, moderationVersion, moderationPending, moderationQueueRevision, pendingMembers, lifecycleStatus, ownerReleasedAtIso, takeoverCandidates, "dating");
    }

    public CommunityGroup(String id, String ownerUserId, String name, String description, String imageUrl,
            String category, String visibility, boolean hideMembers, Policy policy, String createdAtIso,
            String updatedAtIso, Long version, String moderationStatus, Long moderationVersion,
            Long moderationPending, Long moderationQueueRevision, Long pendingMembers) {
        this(id, ownerUserId, name, description, imageUrl, category, visibility, hideMembers, policy,
            createdAtIso, updatedAtIso, version, moderationStatus, moderationVersion, moderationPending,
            moderationQueueRevision, pendingMembers, null, null, null);
    }
    public String effectiveType() { return "work".equals(groupType) || "community".equals(groupType) ? groupType : "dating"; }
    public boolean deleted() { return "deleted".equals(lifecycleStatus); }
    public boolean awaitingOwner() { return "under-review".equals(lifecycleStatus); }
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
