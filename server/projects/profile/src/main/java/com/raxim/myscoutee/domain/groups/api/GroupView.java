package com.raxim.myscoutee.domain.groups.api;

import java.util.List;
import com.raxim.myscoutee.domain.groups.dto.GroupPolicy;
public interface GroupView {
    String id(); String ownerUserId(); String name(); String description();
    String imageUrl(); String category(); String visibility(); boolean hideMembers();
    GroupPolicy policy(); String createdAtIso(); String updatedAtIso(); Long version();
    String moderationStatus(); Long moderationVersion(); Long moderationPending();
    Long moderationQueueRevision(); Long pendingMembers(); String lifecycleStatus();
    String ownerReleasedAtIso(); List<String> takeoverCandidates(); String groupType();
    String effectiveType(); boolean priorityEnabled(); String baseId(); boolean deleted();
    boolean awaitingOwner(); long pendingModerationCount(); long pendingMemberCount(); boolean moderationVisible();

}
