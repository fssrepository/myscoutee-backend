package com.raxim.myscoutee.profile.security;

public interface AccessPolicyData {
    boolean hasAcceptedParticipation(String ownerType, String ownerId, String userId);

    boolean hasExplicitGrant(
            String subjectUserId,
            String permission,
            String resourceType,
            String resourceId,
            AccessGrantEffect expectedEffect);
}
