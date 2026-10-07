package com.raxim.myscoutee.domain.access.api;

import org.springframework.security.core.Authentication;
import com.raxim.myscoutee.common.dto.SharedDtos.ActivitySubEventResourceStateDto;

public interface AccessPermissions extends ConsentAuthorization {
    boolean can(String policyKey, String actorUserId, String subjectUserId, String resourceId);
    String resolveChatActorUserId(String chatId, String profileId);
    boolean canSubmitEventResourceAssignment(Authentication authentication, ActivitySubEventResourceStateDto request);
    boolean canCurrentActorAssignEventResources(ActivitySubEventResourceStateDto request);
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
    boolean canCurrentActorSubmitEventFeedback(String userId, String eventId);
    boolean canCurrentActorSaveEventFeedbackNote(String userId, String eventId);
    boolean canCurrentActorRemoveEventFeedback(String userId, String eventId);
    boolean canCurrentActorRestoreEventFeedback(String userId, String eventId);
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
    boolean canCurrentActorManageEventResourceAssignment(ActivitySubEventResourceStateDto request);
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
    String resolveActorUserId(Authentication authentication);
    boolean hasExplicitGrant(
            String subjectUserId,
            String permission,
            String resourceType,
            String resourceId,
            AccessGrantEffect expectedEffect);
    boolean requiresAuthenticatedActor();
}
