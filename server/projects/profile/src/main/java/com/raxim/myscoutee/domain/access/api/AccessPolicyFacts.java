package com.raxim.myscoutee.domain.access.api;

/** Facts shared by authorization and its policy-data adapter. */
public interface AccessPolicyFacts {
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
}
