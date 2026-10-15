package com.raxim.myscoutee.microservices.transport.access;

import java.net.URI;
import java.time.Duration;
import java.util.Map;
import com.raxim.myscoutee.domain.access.api.AccessPermissions;
import com.raxim.myscoutee.domain.access.api.AccessGrantEffect;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import com.raxim.myscoutee.microservices.transport.security.ActorDelegation;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.security.core.context.SecurityContextHolder;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

public final class RemoteAccessPermissions extends RemoteReadTransport implements AccessPermissions {
    private final ObjectMapper mapper;
    private final ActorDelegation.Signer signer;
    public RemoteAccessPermissions(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics, ActorDelegation.Signer signer) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper; this.signer = signer;
    }
    @Override public boolean can(String policyKey, String actorUserId, String subjectUserId, String resourceId) {
        var query = new AccessPermissionsProtocol.CanQuery(policyKey, actorUserId, subjectUserId, resourceId);
        return read(AccessPermissionsProtocol.CAN, query, AccessPermissionsProtocol.valid(query),
                new TypeReference<AccessPermissionsProtocol.Decision>() {}, value -> value.allowed() != null).allowed();
    }
    @Override public String resolveChatActorUserId(String chatId, String profileId) {
        var query = new AccessPermissionsProtocol.ResolveChatActorUserIdQuery(chatId, profileId);
        return read(AccessPermissionsProtocol.RESOLVE_CHAT_ACTOR_USER_ID, query, AccessPermissionsProtocol.valid(query),
                new TypeReference<AccessPermissionsProtocol.ActorResult>() {}, value -> Boolean.TRUE.equals(value.resolved()) && (value.userId() == null || value.userId().length() <= 512)).userId();
    }
    @Override public boolean canCurrentActorAssignEventResourceScope(String eventId, String subEventId, String assetOwnerUserId) {
        var query = new AccessPermissionsProtocol.CanCurrentActorAssignEventResourceScopeQuery(eventId, subEventId, assetOwnerUserId);
        return read(AccessPermissionsProtocol.CAN_CURRENT_ACTOR_ASSIGN_EVENT_RESOURCE_SCOPE, query, AccessPermissionsProtocol.valid(query),
                new TypeReference<AccessPermissionsProtocol.Decision>() {}, value -> value.allowed() != null).allowed();
    }
    @Override public boolean canAssignEventResourcesForSubject(String eventId, String userId) {
        var query = new AccessPermissionsProtocol.CanAssignEventResourcesForSubjectQuery(eventId, userId);
        return read(AccessPermissionsProtocol.CAN_ASSIGN_EVENT_RESOURCES_FOR_SUBJECT, query, AccessPermissionsProtocol.valid(query),
                new TypeReference<AccessPermissionsProtocol.Decision>() {}, value -> value.allowed() != null).allowed();
    }
    @Override public boolean canReceiveEventAssetManagerRole(String eventId, String userId) {
        var query = new AccessPermissionsProtocol.CanReceiveEventAssetManagerRoleQuery(eventId, userId);
        return read(AccessPermissionsProtocol.CAN_RECEIVE_EVENT_ASSET_MANAGER_ROLE, query, AccessPermissionsProtocol.valid(query),
                new TypeReference<AccessPermissionsProtocol.Decision>() {}, value -> value.allowed() != null).allowed();
    }
    @Override public boolean canCurrentActorCreateAsset(String ownerUserId, String assetId) {
        var query = new AccessPermissionsProtocol.CanCurrentActorCreateAssetQuery(ownerUserId, assetId);
        return read(AccessPermissionsProtocol.CAN_CURRENT_ACTOR_CREATE_ASSET, query, AccessPermissionsProtocol.valid(query),
                new TypeReference<AccessPermissionsProtocol.Decision>() {}, value -> value.allowed() != null).allowed();
    }
    @Override public boolean canCurrentActorReplaceAssets(String ownerUserId) {
        var query = new AccessPermissionsProtocol.CanCurrentActorReplaceAssetsQuery(ownerUserId);
        return read(AccessPermissionsProtocol.CAN_CURRENT_ACTOR_REPLACE_ASSETS, query, AccessPermissionsProtocol.valid(query),
                new TypeReference<AccessPermissionsProtocol.Decision>() {}, value -> value.allowed() != null).allowed();
    }
    @Override public boolean canCurrentActorEditAsset(String ownerUserId, String assetId) {
        var query = new AccessPermissionsProtocol.CanCurrentActorEditAssetQuery(ownerUserId, assetId);
        return read(AccessPermissionsProtocol.CAN_CURRENT_ACTOR_EDIT_ASSET, query, AccessPermissionsProtocol.valid(query),
                new TypeReference<AccessPermissionsProtocol.Decision>() {}, value -> value.allowed() != null).allowed();
    }
    @Override public boolean canCurrentActorDeleteAsset(String ownerUserId, String assetId) {
        var query = new AccessPermissionsProtocol.CanCurrentActorDeleteAssetQuery(ownerUserId, assetId);
        return read(AccessPermissionsProtocol.CAN_CURRENT_ACTOR_DELETE_ASSET, query, AccessPermissionsProtocol.valid(query),
                new TypeReference<AccessPermissionsProtocol.Decision>() {}, value -> value.allowed() != null).allowed();
    }
    @Override public boolean canCurrentActorRestoreAsset(String ownerUserId, String assetId) {
        var query = new AccessPermissionsProtocol.CanCurrentActorRestoreAssetQuery(ownerUserId, assetId);
        return read(AccessPermissionsProtocol.CAN_CURRENT_ACTOR_RESTORE_ASSET, query, AccessPermissionsProtocol.valid(query),
                new TypeReference<AccessPermissionsProtocol.Decision>() {}, value -> value.allowed() != null).allowed();
    }
    @Override public boolean canCurrentActorTakeOverAsset(String actorUserId, String assetId) {
        var query = new AccessPermissionsProtocol.CanCurrentActorTakeOverAssetQuery(actorUserId, assetId);
        return read(AccessPermissionsProtocol.CAN_CURRENT_ACTOR_TAKE_OVER_ASSET, query, AccessPermissionsProtocol.valid(query),
                new TypeReference<AccessPermissionsProtocol.Decision>() {}, value -> value.allowed() != null).allowed();
    }
    @Override public boolean canCurrentActorPromoteAssetManager(String actorUserId, String assetId) {
        var query = new AccessPermissionsProtocol.CanCurrentActorPromoteAssetManagerQuery(actorUserId, assetId);
        return read(AccessPermissionsProtocol.CAN_CURRENT_ACTOR_PROMOTE_ASSET_MANAGER, query, AccessPermissionsProtocol.valid(query),
                new TypeReference<AccessPermissionsProtocol.Decision>() {}, value -> value.allowed() != null).allowed();
    }
    @Override public boolean canCurrentActorCreateEvent(String ownerUserId, String eventId) {
        var query = new AccessPermissionsProtocol.CanCurrentActorCreateEventQuery(ownerUserId, eventId);
        return read(AccessPermissionsProtocol.CAN_CURRENT_ACTOR_CREATE_EVENT, query, AccessPermissionsProtocol.valid(query),
                new TypeReference<AccessPermissionsProtocol.Decision>() {}, value -> value.allowed() != null).allowed();
    }
    @Override public boolean canCurrentActorEditEvent(String eventId) {
        var query = new AccessPermissionsProtocol.CanCurrentActorEditEventQuery(eventId);
        return read(AccessPermissionsProtocol.CAN_CURRENT_ACTOR_EDIT_EVENT, query, AccessPermissionsProtocol.valid(query),
                new TypeReference<AccessPermissionsProtocol.Decision>() {}, value -> value.allowed() != null).allowed();
    }
    @Override public boolean canCurrentActorPublishEvent(String eventId) {
        var query = new AccessPermissionsProtocol.CanCurrentActorPublishEventQuery(eventId);
        return read(AccessPermissionsProtocol.CAN_CURRENT_ACTOR_PUBLISH_EVENT, query, AccessPermissionsProtocol.valid(query),
                new TypeReference<AccessPermissionsProtocol.Decision>() {}, value -> value.allowed() != null).allowed();
    }
    @Override public boolean canCurrentActorUnpublishEvent(String eventId) {
        var query = new AccessPermissionsProtocol.CanCurrentActorUnpublishEventQuery(eventId);
        return read(AccessPermissionsProtocol.CAN_CURRENT_ACTOR_UNPUBLISH_EVENT, query, AccessPermissionsProtocol.valid(query),
                new TypeReference<AccessPermissionsProtocol.Decision>() {}, value -> value.allowed() != null).allowed();
    }
    @Override public boolean canCurrentActorDeleteEvent(String eventId) {
        var query = new AccessPermissionsProtocol.CanCurrentActorDeleteEventQuery(eventId);
        return read(AccessPermissionsProtocol.CAN_CURRENT_ACTOR_DELETE_EVENT, query, AccessPermissionsProtocol.valid(query),
                new TypeReference<AccessPermissionsProtocol.Decision>() {}, value -> value.allowed() != null).allowed();
    }
    @Override public boolean canCurrentActorRestoreEvent(String eventId) {
        var query = new AccessPermissionsProtocol.CanCurrentActorRestoreEventQuery(eventId);
        return read(AccessPermissionsProtocol.CAN_CURRENT_ACTOR_RESTORE_EVENT, query, AccessPermissionsProtocol.valid(query),
                new TypeReference<AccessPermissionsProtocol.Decision>() {}, value -> value.allowed() != null).allowed();
    }
    @Override public boolean canCurrentActorTakeOverEvent(String eventId) {
        var query = new AccessPermissionsProtocol.CanCurrentActorTakeOverEventQuery(eventId);
        return read(AccessPermissionsProtocol.CAN_CURRENT_ACTOR_TAKE_OVER_EVENT, query, AccessPermissionsProtocol.valid(query),
                new TypeReference<AccessPermissionsProtocol.Decision>() {}, value -> value.allowed() != null).allowed();
    }
    @Override public boolean canCurrentActorJoinEvent(String userId, String eventId) {
        var query = new AccessPermissionsProtocol.CanCurrentActorJoinEventQuery(userId, eventId);
        return read(AccessPermissionsProtocol.CAN_CURRENT_ACTOR_JOIN_EVENT, query, AccessPermissionsProtocol.valid(query),
                new TypeReference<AccessPermissionsProtocol.Decision>() {}, value -> value.allowed() != null).allowed();
    }
    @Override public boolean canCurrentActorApplyEventStageAction(String eventId) {
        var query = new AccessPermissionsProtocol.CanCurrentActorApplyEventStageActionQuery(eventId);
        return read(AccessPermissionsProtocol.CAN_CURRENT_ACTOR_APPLY_EVENT_STAGE_ACTION, query, AccessPermissionsProtocol.valid(query),
                new TypeReference<AccessPermissionsProtocol.Decision>() {}, value -> value.allowed() != null).allowed();
    }
    @Override public boolean canCurrentActorRequestAssetBorrow(String requesterUserId, String eventId) {
        var query = new AccessPermissionsProtocol.CanCurrentActorRequestAssetBorrowQuery(requesterUserId, eventId);
        return read(AccessPermissionsProtocol.CAN_CURRENT_ACTOR_REQUEST_ASSET_BORROW, query, AccessPermissionsProtocol.valid(query),
                new TypeReference<AccessPermissionsProtocol.Decision>() {}, value -> value.allowed() != null).allowed();
    }
    @Override public boolean canCurrentActorApproveAssetBorrow(String requesterUserId, String assetId) {
        var query = new AccessPermissionsProtocol.CanCurrentActorApproveAssetBorrowQuery(requesterUserId, assetId);
        return read(AccessPermissionsProtocol.CAN_CURRENT_ACTOR_APPROVE_ASSET_BORROW, query, AccessPermissionsProtocol.valid(query),
                new TypeReference<AccessPermissionsProtocol.Decision>() {}, value -> value.allowed() != null).allowed();
    }
    @Override public boolean canCurrentActorRejectAssetBorrow(String requesterUserId, String assetId) {
        var query = new AccessPermissionsProtocol.CanCurrentActorRejectAssetBorrowQuery(requesterUserId, assetId);
        return read(AccessPermissionsProtocol.CAN_CURRENT_ACTOR_REJECT_ASSET_BORROW, query, AccessPermissionsProtocol.valid(query),
                new TypeReference<AccessPermissionsProtocol.Decision>() {}, value -> value.allowed() != null).allowed();
    }
    @Override public boolean canCurrentActorCancelAssetBorrow(String requesterUserId, String assetId) {
        var query = new AccessPermissionsProtocol.CanCurrentActorCancelAssetBorrowQuery(requesterUserId, assetId);
        return read(AccessPermissionsProtocol.CAN_CURRENT_ACTOR_CANCEL_ASSET_BORROW, query, AccessPermissionsProtocol.valid(query),
                new TypeReference<AccessPermissionsProtocol.Decision>() {}, value -> value.allowed() != null).allowed();
    }
    @Override public boolean canCurrentActorSubmitLeaderboardEntry(String actorUserId, String eventId) {
        var query = new AccessPermissionsProtocol.CanCurrentActorSubmitLeaderboardEntryQuery(actorUserId, eventId);
        return read(AccessPermissionsProtocol.CAN_CURRENT_ACTOR_SUBMIT_LEADERBOARD_ENTRY, query, AccessPermissionsProtocol.valid(query),
                new TypeReference<AccessPermissionsProtocol.Decision>() {}, value -> value.allowed() != null).allowed();
    }
    @Override public boolean canCurrentActorSubmitFeedback(String userId, String eventId) {
        var query = new AccessPermissionsProtocol.CanCurrentActorSubmitFeedbackQuery(userId, eventId);
        return read(AccessPermissionsProtocol.CAN_CURRENT_ACTOR_SUBMIT_FEEDBACK, query, AccessPermissionsProtocol.valid(query),
                new TypeReference<AccessPermissionsProtocol.Decision>() {}, value -> value.allowed() != null).allowed();
    }
    @Override public boolean canCurrentActorSaveFeedbackNote(String userId, String eventId) {
        var query = new AccessPermissionsProtocol.CanCurrentActorSaveFeedbackNoteQuery(userId, eventId);
        return read(AccessPermissionsProtocol.CAN_CURRENT_ACTOR_SAVE_FEEDBACK_NOTE, query, AccessPermissionsProtocol.valid(query),
                new TypeReference<AccessPermissionsProtocol.Decision>() {}, value -> value.allowed() != null).allowed();
    }
    @Override public boolean canCurrentActorRemoveFeedback(String userId, String eventId) {
        var query = new AccessPermissionsProtocol.CanCurrentActorRemoveFeedbackQuery(userId, eventId);
        return read(AccessPermissionsProtocol.CAN_CURRENT_ACTOR_REMOVE_FEEDBACK, query, AccessPermissionsProtocol.valid(query),
                new TypeReference<AccessPermissionsProtocol.Decision>() {}, value -> value.allowed() != null).allowed();
    }
    @Override public boolean canCurrentActorRestoreFeedback(String userId, String eventId) {
        var query = new AccessPermissionsProtocol.CanCurrentActorRestoreFeedbackQuery(userId, eventId);
        return read(AccessPermissionsProtocol.CAN_CURRENT_ACTOR_RESTORE_FEEDBACK, query, AccessPermissionsProtocol.valid(query),
                new TypeReference<AccessPermissionsProtocol.Decision>() {}, value -> value.allowed() != null).allowed();
    }
    @Override public boolean canCurrentActorCreateChatMessage(String userId, String chatId) {
        var query = new AccessPermissionsProtocol.CanCurrentActorCreateChatMessageQuery(userId, chatId);
        return read(AccessPermissionsProtocol.CAN_CURRENT_ACTOR_CREATE_CHAT_MESSAGE, query, AccessPermissionsProtocol.valid(query),
                new TypeReference<AccessPermissionsProtocol.Decision>() {}, value -> value.allowed() != null).allowed();
    }
    @Override public boolean canCurrentActorEditChatMessage(String userId, String chatId) {
        var query = new AccessPermissionsProtocol.CanCurrentActorEditChatMessageQuery(userId, chatId);
        return read(AccessPermissionsProtocol.CAN_CURRENT_ACTOR_EDIT_CHAT_MESSAGE, query, AccessPermissionsProtocol.valid(query),
                new TypeReference<AccessPermissionsProtocol.Decision>() {}, value -> value.allowed() != null).allowed();
    }
    @Override public boolean canCurrentActorDeleteChatMessage(String userId, String chatId) {
        var query = new AccessPermissionsProtocol.CanCurrentActorDeleteChatMessageQuery(userId, chatId);
        return read(AccessPermissionsProtocol.CAN_CURRENT_ACTOR_DELETE_CHAT_MESSAGE, query, AccessPermissionsProtocol.valid(query),
                new TypeReference<AccessPermissionsProtocol.Decision>() {}, value -> value.allowed() != null).allowed();
    }
    @Override public boolean canCurrentActorPinChatMessage(String userId, String chatId) {
        var query = new AccessPermissionsProtocol.CanCurrentActorPinChatMessageQuery(userId, chatId);
        return read(AccessPermissionsProtocol.CAN_CURRENT_ACTOR_PIN_CHAT_MESSAGE, query, AccessPermissionsProtocol.valid(query),
                new TypeReference<AccessPermissionsProtocol.Decision>() {}, value -> value.allowed() != null).allowed();
    }
    @Override public boolean canCurrentActorManageChatReaction(String userId, String chatId) {
        var query = new AccessPermissionsProtocol.CanCurrentActorManageChatReactionQuery(userId, chatId);
        return read(AccessPermissionsProtocol.CAN_CURRENT_ACTOR_MANAGE_CHAT_REACTION, query, AccessPermissionsProtocol.valid(query),
                new TypeReference<AccessPermissionsProtocol.Decision>() {}, value -> value.allowed() != null).allowed();
    }
    @Override public boolean canCurrentActorAddChatAttachment(String userId, String chatId) {
        var query = new AccessPermissionsProtocol.CanCurrentActorAddChatAttachmentQuery(userId, chatId);
        return read(AccessPermissionsProtocol.CAN_CURRENT_ACTOR_ADD_CHAT_ATTACHMENT, query, AccessPermissionsProtocol.valid(query),
                new TypeReference<AccessPermissionsProtocol.Decision>() {}, value -> value.allowed() != null).allowed();
    }
    @Override public boolean canCurrentActorManageSupportChat(String userId, String chatId) {
        var query = new AccessPermissionsProtocol.CanCurrentActorManageSupportChatQuery(userId, chatId);
        return read(AccessPermissionsProtocol.CAN_CURRENT_ACTOR_MANAGE_SUPPORT_CHAT, query, AccessPermissionsProtocol.valid(query),
                new TypeReference<AccessPermissionsProtocol.Decision>() {}, value -> value.allowed() != null).allowed();
    }
    @Override public boolean canCurrentActorEditProfile(String userId) {
        var query = new AccessPermissionsProtocol.CanCurrentActorEditProfileQuery(userId);
        return read(AccessPermissionsProtocol.CAN_CURRENT_ACTOR_EDIT_PROFILE, query, AccessPermissionsProtocol.valid(query),
                new TypeReference<AccessPermissionsProtocol.Decision>() {}, value -> value.allowed() != null).allowed();
    }
    @Override public boolean canCurrentActorDeleteProfile(String userId) {
        var query = new AccessPermissionsProtocol.CanCurrentActorDeleteProfileQuery(userId);
        return read(AccessPermissionsProtocol.CAN_CURRENT_ACTOR_DELETE_PROFILE, query, AccessPermissionsProtocol.valid(query),
                new TypeReference<AccessPermissionsProtocol.Decision>() {}, value -> value.allowed() != null).allowed();
    }
    @Override public boolean canCurrentActorUploadMedia(String ownerUserId) {
        var query = new AccessPermissionsProtocol.CanCurrentActorUploadMediaQuery(ownerUserId);
        return read(AccessPermissionsProtocol.CAN_CURRENT_ACTOR_UPLOAD_MEDIA, query, AccessPermissionsProtocol.valid(query),
                new TypeReference<AccessPermissionsProtocol.Decision>() {}, value -> value.allowed() != null).allowed();
    }
    @Override public boolean canCurrentActorImportMedia(String ownerUserId) {
        var query = new AccessPermissionsProtocol.CanCurrentActorImportMediaQuery(ownerUserId);
        return read(AccessPermissionsProtocol.CAN_CURRENT_ACTOR_IMPORT_MEDIA, query, AccessPermissionsProtocol.valid(query),
                new TypeReference<AccessPermissionsProtocol.Decision>() {}, value -> value.allowed() != null).allowed();
    }
    @Override public boolean canCurrentActorSubmitPrivacyConsent(String userId) {
        var query = new AccessPermissionsProtocol.CanCurrentActorSubmitPrivacyConsentQuery(userId);
        return read(AccessPermissionsProtocol.CAN_CURRENT_ACTOR_SUBMIT_PRIVACY_CONSENT, query, AccessPermissionsProtocol.valid(query),
                new TypeReference<AccessPermissionsProtocol.Decision>() {}, value -> value.allowed() != null).allowed();
    }
    @Override public boolean canManageEventMembers(String eventId, String actorUserId) {
        var query = new AccessPermissionsProtocol.CanManageEventMembersQuery(eventId, actorUserId);
        return read(AccessPermissionsProtocol.CAN_MANAGE_EVENT_MEMBERS, query, AccessPermissionsProtocol.valid(query),
                new TypeReference<AccessPermissionsProtocol.Decision>() {}, value -> value.allowed() != null).allowed();
    }
    @Override public boolean canCurrentActorViewEventMembers(String eventId) {
        var query = new AccessPermissionsProtocol.CanCurrentActorViewEventMembersQuery(eventId);
        return read(AccessPermissionsProtocol.CAN_CURRENT_ACTOR_VIEW_EVENT_MEMBERS, query, AccessPermissionsProtocol.valid(query),
                new TypeReference<AccessPermissionsProtocol.Decision>() {}, value -> value.allowed() != null).allowed();
    }
    @Override public boolean canAcceptEventMember(String eventId, String actorUserId, String targetUserId) {
        var query = new AccessPermissionsProtocol.CanAcceptEventMemberQuery(eventId, actorUserId, targetUserId);
        return read(AccessPermissionsProtocol.CAN_ACCEPT_EVENT_MEMBER, query, AccessPermissionsProtocol.valid(query),
                new TypeReference<AccessPermissionsProtocol.Decision>() {}, value -> value.allowed() != null).allowed();
    }
    @Override public boolean canRemoveEventMember(String eventId, String actorUserId, String targetUserId) {
        var query = new AccessPermissionsProtocol.CanRemoveEventMemberQuery(eventId, actorUserId, targetUserId);
        return read(AccessPermissionsProtocol.CAN_REMOVE_EVENT_MEMBER, query, AccessPermissionsProtocol.valid(query),
                new TypeReference<AccessPermissionsProtocol.Decision>() {}, value -> value.allowed() != null).allowed();
    }
    @Override public boolean canDisqualifyEventMember(String eventId, String actorUserId, String targetUserId) {
        var query = new AccessPermissionsProtocol.CanDisqualifyEventMemberQuery(eventId, actorUserId, targetUserId);
        return read(AccessPermissionsProtocol.CAN_DISQUALIFY_EVENT_MEMBER, query, AccessPermissionsProtocol.valid(query),
                new TypeReference<AccessPermissionsProtocol.Decision>() {}, value -> value.allowed() != null).allowed();
    }
    @Override public boolean canReinstateEventMember(String eventId, String actorUserId, String targetUserId) {
        var query = new AccessPermissionsProtocol.CanReinstateEventMemberQuery(eventId, actorUserId, targetUserId);
        return read(AccessPermissionsProtocol.CAN_REINSTATE_EVENT_MEMBER, query, AccessPermissionsProtocol.valid(query),
                new TypeReference<AccessPermissionsProtocol.Decision>() {}, value -> value.allowed() != null).allowed();
    }
    @Override public boolean canInviteEventMembers(String eventId, String actorUserId) {
        var query = new AccessPermissionsProtocol.CanInviteEventMembersQuery(eventId, actorUserId);
        return read(AccessPermissionsProtocol.CAN_INVITE_EVENT_MEMBERS, query, AccessPermissionsProtocol.valid(query),
                new TypeReference<AccessPermissionsProtocol.Decision>() {}, value -> value.allowed() != null).allowed();
    }
    @Override public boolean canCurrentActorManageEventResourceScope(String eventId) {
        var query = new AccessPermissionsProtocol.CanCurrentActorManageEventResourceScopeQuery(eventId);
        return read(AccessPermissionsProtocol.CAN_CURRENT_ACTOR_MANAGE_EVENT_RESOURCE_SCOPE, query, AccessPermissionsProtocol.valid(query),
                new TypeReference<AccessPermissionsProtocol.Decision>() {}, value -> value.allowed() != null).allowed();
    }
    @Override public boolean canCleanupEventResourceAssignments(String eventId, String actorUserId) {
        var query = new AccessPermissionsProtocol.CanCleanupEventResourceAssignmentsQuery(eventId, actorUserId);
        return read(AccessPermissionsProtocol.CAN_CLEANUP_EVENT_RESOURCE_ASSIGNMENTS, query, AccessPermissionsProtocol.valid(query),
                new TypeReference<AccessPermissionsProtocol.Decision>() {}, value -> value.allowed() != null).allowed();
    }
    @Override public boolean hasAcceptedParticipation(String ownerType, String ownerId, String userId) {
        var query = new AccessPermissionsProtocol.HasAcceptedParticipationQuery(ownerType, ownerId, userId);
        return read(AccessPermissionsProtocol.HAS_ACCEPTED_PARTICIPATION, query, AccessPermissionsProtocol.valid(query),
                new TypeReference<AccessPermissionsProtocol.Decision>() {}, value -> value.allowed() != null).allowed();
    }
    @Override public boolean hasMemberStatus(String ownerType, String ownerId, String userId, String status) {
        var query = new AccessPermissionsProtocol.HasMemberStatusQuery(ownerType, ownerId, userId, status);
        return read(AccessPermissionsProtocol.HAS_MEMBER_STATUS, query, AccessPermissionsProtocol.valid(query),
                new TypeReference<AccessPermissionsProtocol.Decision>() {}, value -> value.allowed() != null).allowed();
    }
    @Override public boolean canManageMembers(String ownerType, String ownerId, String actorUserId) {
        var query = new AccessPermissionsProtocol.CanManageMembersQuery(ownerType, ownerId, actorUserId);
        return read(AccessPermissionsProtocol.CAN_MANAGE_MEMBERS, query, AccessPermissionsProtocol.valid(query),
                new TypeReference<AccessPermissionsProtocol.Decision>() {}, value -> value.allowed() != null).allowed();
    }
    @Override public boolean isProtectedMember(String ownerType, String ownerId, String userId) {
        var query = new AccessPermissionsProtocol.IsProtectedMemberQuery(ownerType, ownerId, userId);
        return read(AccessPermissionsProtocol.IS_PROTECTED_MEMBER, query, AccessPermissionsProtocol.valid(query),
                new TypeReference<AccessPermissionsProtocol.Decision>() {}, value -> value.allowed() != null).allowed();
    }
    @Override public boolean canManageEvent(String eventId, String actorUserId) {
        var query = new AccessPermissionsProtocol.CanManageEventQuery(eventId, actorUserId);
        return read(AccessPermissionsProtocol.CAN_MANAGE_EVENT, query, AccessPermissionsProtocol.valid(query),
                new TypeReference<AccessPermissionsProtocol.Decision>() {}, value -> value.allowed() != null).allowed();
    }
    @Override public boolean canTakeOverEvent(String eventId, String actorUserId) {
        var query = new AccessPermissionsProtocol.CanTakeOverEventQuery(eventId, actorUserId);
        return read(AccessPermissionsProtocol.CAN_TAKE_OVER_EVENT, query, AccessPermissionsProtocol.valid(query),
                new TypeReference<AccessPermissionsProtocol.Decision>() {}, value -> value.allowed() != null).allowed();
    }
    @Override public boolean canManageAsset(String assetId, String actorUserId) {
        var query = new AccessPermissionsProtocol.CanManageAssetQuery(assetId, actorUserId);
        return read(AccessPermissionsProtocol.CAN_MANAGE_ASSET, query, AccessPermissionsProtocol.valid(query),
                new TypeReference<AccessPermissionsProtocol.Decision>() {}, value -> value.allowed() != null).allowed();
    }
    @Override public boolean canTakeOverAsset(String assetId, String actorUserId) {
        var query = new AccessPermissionsProtocol.CanTakeOverAssetQuery(assetId, actorUserId);
        return read(AccessPermissionsProtocol.CAN_TAKE_OVER_ASSET, query, AccessPermissionsProtocol.valid(query),
                new TypeReference<AccessPermissionsProtocol.Decision>() {}, value -> value.allowed() != null).allowed();
    }
    @Override public boolean canAccessChat(String chatId, String actorUserId) {
        var query = new AccessPermissionsProtocol.CanAccessChatQuery(chatId, actorUserId);
        return read(AccessPermissionsProtocol.CAN_ACCESS_CHAT, query, AccessPermissionsProtocol.valid(query),
                new TypeReference<AccessPermissionsProtocol.Decision>() {}, value -> value.allowed() != null).allowed();
    }
    @Override public boolean canManageSupportChat(String chatId, String actorUserId) {
        var query = new AccessPermissionsProtocol.CanManageSupportChatQuery(chatId, actorUserId);
        return read(AccessPermissionsProtocol.CAN_MANAGE_SUPPORT_CHAT, query, AccessPermissionsProtocol.valid(query),
                new TypeReference<AccessPermissionsProtocol.Decision>() {}, value -> value.allowed() != null).allowed();
    }
    @Override public boolean hasExplicitGrant(String subjectUserId, String permission, String resourceType, String resourceId, AccessGrantEffect expectedEffect) {
        var query = new AccessPermissionsProtocol.HasExplicitGrantQuery(subjectUserId, permission, resourceType, resourceId, expectedEffect);
        return read(AccessPermissionsProtocol.HAS_EXPLICIT_GRANT, query, AccessPermissionsProtocol.valid(query),
                new TypeReference<AccessPermissionsProtocol.Decision>() {}, value -> value.allowed() != null).allowed();
    }
    @Override public boolean requiresAuthenticatedActor() {
        var query = new AccessPermissionsProtocol.RequiresAuthenticatedActorQuery();
        return read(AccessPermissionsProtocol.REQUIRES_AUTHENTICATED_ACTOR, query, AccessPermissionsProtocol.valid(query),
                new TypeReference<AccessPermissionsProtocol.Decision>() {}, value -> value.allowed() != null).allowed();
    }
    private <T> T read(String path, Object query, boolean valid, TypeReference<T> type, java.util.function.Predicate<T> resultValid) {
        if (!valid) throw new IllegalArgumentException("Invalid access-permission query");
        byte[] bytes = mapper.writeValueAsBytes(query);
        if (bytes.length > AccessPermissionsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Request exceeds limit");
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        Map<String, String> headers = Map.of();
        // Media cookies are validated by the public authorization owner, but confer
        // no account authority. Query the existing explicit-identity read policy;
        // do not promote this credential into an account delegation.
        boolean mediaRead = AccessPermissionsProtocol.CAN.equals(path)
                && query instanceof AccessPermissionsProtocol.CanQuery decision
                && "media.read".equals(decision.policyKey())
                && authentication != null && authentication.isAuthenticated()
                && authentication.getPrincipal() instanceof String mediaUser
                && mediaUser.equals(decision.actorUserId()) && mediaUser.equals(decision.subjectUserId())
                && authentication.getAuthorities().size() == 1
                && authentication.getAuthorities().iterator().next().getAuthority().equals("MEDIA");
        if (!mediaRead && authentication != null && authentication.isAuthenticated()
                && !(authentication instanceof org.springframework.security.authentication.AnonymousAuthenticationToken)
                && !(authentication instanceof com.raxim.myscoutee.microservices.transport.common.InternalReadCredentialFilter.ServiceAuthentication)) {
            headers = Map.of(ActorDelegation.HEADER, signer.issueForCurrent(AccessPermissionsProtocol.AUDIENCE, "POST", path, bytes));
        }
        try {
            return exchangeAuthorized(path, bytes, type, "access-permissions." + path.substring(path.lastIndexOf('/') + 1),
                    AccessPermissionsProtocol.MAX_RESPONSE_BYTES, resultValid, headers);
        } catch (RemoteReadException rejected) {
            if (rejected.status() == 403 && "INVALID_DELEGATION".equals(rejected.remoteCode()))
                throw new org.springframework.security.access.AccessDeniedException("Invalid actor delegation");
            if (rejected.status() >= 400 && rejected.status() < 500 && "OWNER_REJECTED".equals(rejected.remoteCode()))
                throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatusCode.valueOf(rejected.status()));
            throw rejected;
        }
    }
}
