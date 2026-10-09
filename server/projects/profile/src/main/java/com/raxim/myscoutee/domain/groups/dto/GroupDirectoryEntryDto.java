package com.raxim.myscoutee.domain.groups.dto;

import java.util.List;
import com.raxim.myscoutee.domain.groups.api.GroupView;

/** Exact existing group directory view, including owner-computed lifecycle facts. */
public record GroupDirectoryEntryDto(
        String id,
        String ownerUserId,
        String name,
        String description,
        String imageUrl,
        String category,
        String visibility,
        boolean hideMembers,
        GroupPolicy policy,
        String createdAtIso,
        String updatedAtIso,
        Long version,
        String moderationStatus,
        Long moderationVersion,
        Long moderationPending,
        Long moderationQueueRevision,
        Long pendingMembers,
        String lifecycleStatus,
        String ownerReleasedAtIso,
        List<String> takeoverCandidates,
        String groupType,
        String effectiveType,
        boolean priorityEnabled,
        String baseId,
        boolean deleted,
        boolean awaitingOwner,
        long pendingModerationCount,
        long pendingMemberCount,
        boolean moderationVisible) implements GroupView {
    public static GroupDirectoryEntryDto from(GroupView group) {
        return new GroupDirectoryEntryDto(
                group.id(),
                group.ownerUserId(),
                group.name(),
                group.description(),
                group.imageUrl(),
                group.category(),
                group.visibility(),
                group.hideMembers(),
                group.policy(),
                group.createdAtIso(),
                group.updatedAtIso(),
                group.version(),
                group.moderationStatus(),
                group.moderationVersion(),
                group.moderationPending(),
                group.moderationQueueRevision(),
                group.pendingMembers(),
                group.lifecycleStatus(),
                group.ownerReleasedAtIso(),
                group.takeoverCandidates(),
                group.groupType(),
                group.effectiveType(),
                group.priorityEnabled(),
                group.baseId(),
                group.deleted(),
                group.awaitingOwner(),
                group.pendingModerationCount(),
                group.pendingMemberCount(),
                group.moderationVisible());
    }
}
