package com.raxim.myscoutee.profile.security;

public interface AccessPolicyData {
    boolean hasAcceptedParticipation(String ownerType, String ownerId, String userId);

    boolean hasMemberStatus(String ownerType, String ownerId, String userId, String status);

    boolean canManageMembers(String ownerType, String ownerId, String actorUserId);

    boolean isProtectedMember(String ownerType, String ownerId, String userId);

    boolean hasExplicitGrant(
            String subjectUserId,
            String permission,
            String resourceType,
            String resourceId,
            AccessGrantEffect expectedEffect);
}
