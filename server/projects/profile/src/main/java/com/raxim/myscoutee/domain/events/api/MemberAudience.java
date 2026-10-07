package com.raxim.myscoutee.domain.events.api;

import java.util.List;
public interface MemberAudience {
    Audience queryNotificationAudience(String ownerType, String ownerId);
    record Audience(List<String> acceptedMemberUserIds, List<String> pendingMemberUserIds,
                    List<String> invitedMemberUserIds, List<String> pendingRequestMemberUserIds) {}
}
