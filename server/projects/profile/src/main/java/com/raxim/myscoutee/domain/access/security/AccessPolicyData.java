package com.raxim.myscoutee.domain.access.security;

public interface AccessPolicyData {
    boolean hasAcceptedParticipation(String ownerType, String ownerId, String userId);

    boolean hasMemberStatus(String ownerType, String ownerId, String userId, String status);

    boolean canManageMembers(String ownerType, String ownerId, String actorUserId);

    boolean isProtectedMember(String ownerType, String ownerId, String userId);

    boolean canManageEvent(String eventId, String actorUserId);

    boolean canTakeOverEvent(String eventId, String actorUserId);

    boolean canManageAsset(String assetId, String actorUserId);

    boolean canTakeOverAsset(String assetId, String actorUserId);

    boolean canAccessChat(String chatId, String actorUserId);

    boolean canManageSupportChat(String chatId, String actorUserId);

    boolean hasExplicitGrant(
            String subjectUserId,
            String permission,
            String resourceType,
            String resourceId,
            AccessGrantEffect expectedEffect);
}
