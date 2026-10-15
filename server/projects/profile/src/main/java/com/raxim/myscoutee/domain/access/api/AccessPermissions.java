package com.raxim.myscoutee.domain.access.api;

import org.springframework.security.core.Authentication;
import com.raxim.myscoutee.common.dto.SharedDtos.ActivitySubEventResourceStateDto;

public interface AccessPermissions extends ConsentAuthorization {
    boolean can(String policyKey, String actorUserId, String subjectUserId, String resourceId);
    String resolveChatActorUserId(String chatId, String profileId);
    default boolean canSubmitEventResourceAssignment(Authentication authentication, ActivitySubEventResourceStateDto request) {
        String eventId = normalized(request == null ? null : request.authorizationEventId());
        String subEventId = normalized(request == null ? null : request.subEventId());
        String ownerId = normalized(request == null ? null : request.assetOwnerUserId());
        if (eventId == null || subEventId == null || ownerId == null) return false;
        String actorId = resolveActorUserId(authentication);
        return actorId != null && can(AccessPolicyKeys.RESOURCE_ASSIGN_SUBMIT, actorId, ownerId, eventId);
    }
    default boolean canCurrentActorAssignEventResources(ActivitySubEventResourceStateDto request) {
        return canCurrentActorAssignEventResourceScope(request == null ? null : request.authorizationEventId(),
                request == null ? null : request.subEventId(), request == null ? null : request.assetOwnerUserId());
    }
    boolean canCurrentActorAssignEventResourceScope(String eventId, String subEventId, String assetOwnerUserId);
    boolean canAssignEventResourcesForSubject(String eventId, String userId);
    boolean canReceiveEventAssetManagerRole(String eventId, String userId);
    boolean canCurrentActorCreateAsset(String ownerUserId, String assetId);
    boolean canCurrentActorReplaceAssets(String ownerUserId);
    boolean canCurrentActorEditAsset(String ownerUserId, String assetId);
    boolean canCurrentActorDeleteAsset(String ownerUserId, String assetId);
    boolean canCurrentActorRestoreAsset(String ownerUserId, String assetId);
    boolean canCurrentActorTakeOverAsset(String actorUserId, String assetId);
    boolean canCurrentActorPromoteAssetManager(String actorUserId, String assetId);
    boolean canCurrentActorCreateEvent(String ownerUserId, String eventId);
    boolean canCurrentActorEditEvent(String eventId);
    boolean canCurrentActorPublishEvent(String eventId);
    boolean canCurrentActorUnpublishEvent(String eventId);
    boolean canCurrentActorDeleteEvent(String eventId);
    boolean canCurrentActorRestoreEvent(String eventId);
    boolean canCurrentActorTakeOverEvent(String eventId);
    boolean canCurrentActorJoinEvent(String userId, String eventId);
    boolean canCurrentActorApplyEventStageAction(String eventId);
    boolean canCurrentActorRequestAssetBorrow(String requesterUserId, String eventId);
    boolean canCurrentActorApproveAssetBorrow(String requesterUserId, String assetId);
    boolean canCurrentActorRejectAssetBorrow(String requesterUserId, String assetId);
    boolean canCurrentActorCancelAssetBorrow(String requesterUserId, String assetId);
    boolean canCurrentActorSubmitLeaderboardEntry(String actorUserId, String eventId);
    boolean canCurrentActorSubmitFeedback(String userId, String eventId);
    boolean canCurrentActorSaveFeedbackNote(String userId, String eventId);
    boolean canCurrentActorRemoveFeedback(String userId, String eventId);
    boolean canCurrentActorRestoreFeedback(String userId, String eventId);
    boolean canCurrentActorCreateChatMessage(String userId, String chatId);
    boolean canCurrentActorEditChatMessage(String userId, String chatId);
    boolean canCurrentActorDeleteChatMessage(String userId, String chatId);
    boolean canCurrentActorPinChatMessage(String userId, String chatId);
    boolean canCurrentActorManageChatReaction(String userId, String chatId);
    boolean canCurrentActorAddChatAttachment(String userId, String chatId);
    boolean canCurrentActorManageSupportChat(String userId, String chatId);
    boolean canCurrentActorEditProfile(String userId);
    boolean canCurrentActorDeleteProfile(String userId);
    boolean canCurrentActorUploadMedia(String ownerUserId);
    boolean canCurrentActorImportMedia(String ownerUserId);
    boolean canCurrentActorSubmitPrivacyConsent(String userId);
    boolean canManageEventMembers(String eventId, String actorUserId);
    boolean canCurrentActorViewEventMembers(String eventId);
    boolean canAcceptEventMember(String eventId, String actorUserId, String targetUserId);
    boolean canRemoveEventMember(String eventId, String actorUserId, String targetUserId);
    boolean canDisqualifyEventMember(String eventId, String actorUserId, String targetUserId);
    boolean canReinstateEventMember(String eventId, String actorUserId, String targetUserId);
    boolean canInviteEventMembers(String eventId, String actorUserId);
    default boolean canCurrentActorManageEventResourceAssignment(ActivitySubEventResourceStateDto request) {
        return canCurrentActorManageEventResourceScope(request == null ? null : request.authorizationEventId());
    }
    boolean canCurrentActorManageEventResourceScope(String eventId);
    boolean canCleanupEventResourceAssignments(String eventId, String actorUserId);
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
    default String resolveActorUserId(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) return null;
        Object principal = authentication.getPrincipal();
        if (principal instanceof com.raxim.myscoutee.domain.accounts.api.AuthenticatedActor actor)
            return normalized(actor.getUserId());
        if (principal instanceof String value) return normalized(value);
        return normalized(authentication.getName());
    }
    private static String normalized(String value) {
        String text = value == null ? "" : value.trim();
        return org.springframework.util.StringUtils.hasText(text) ? text : null;
    }
    boolean hasExplicitGrant(
            String subjectUserId,
            String permission,
            String resourceType,
            String resourceId,
            AccessGrantEffect expectedEffect);
    boolean requiresAuthenticatedActor();
}
