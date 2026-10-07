package com.raxim.myscoutee.domain.events.api;

import java.util.List;

public interface EventMediaVisibility {
    Event event(List<String> urls);
    Membership acceptedCommunityMember(String communityId, String accountId);
    record Event(String creatorUserId, String organizerUserId, String moderationStatus, String visibility, String status,
            List<?> admins, List<?> acceptedMemberUserIds, List<?> invitedMemberUserIds, List<?> pendingRequestMemberUserIds) {}
    record Membership(String role) {}
}
