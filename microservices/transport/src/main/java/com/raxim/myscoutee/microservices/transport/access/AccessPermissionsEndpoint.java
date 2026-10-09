package com.raxim.myscoutee.microservices.transport.access;

import java.util.Collections;
import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.access.api.AccessPermissions;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import com.raxim.myscoutee.microservices.transport.security.ActorDelegation;
import com.raxim.myscoutee.microservices.transport.security.DelegatedActorContext;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import tools.jackson.databind.DeserializationFeature;
import tools.jackson.databind.ObjectMapper;

@RestController
public final class AccessPermissionsEndpoint {
    private final AccessPermissions owner;
    private final ObjectMapper mapper;
    private final ActorDelegation.Verifier verifier;
    public AccessPermissionsEndpoint(AccessPermissions owner, ObjectMapper mapper, ActorDelegation.Verifier verifier) {
        this.owner = owner; this.mapper = mapper; this.verifier = verifier;
    }
    @PostMapping(value = AccessPermissionsProtocol.CAN, produces = "application/json")
    public ResponseEntity<?> can(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccessPermissionsProtocol.CAN, AccessPermissionsProtocol.CanQuery.class,
                AccessPermissionsProtocol::valid, query -> new AccessPermissionsProtocol.Decision(owner.can(query.policyKey(), query.actorUserId(), query.subjectUserId(), query.resourceId())));
    }
    @PostMapping(value = AccessPermissionsProtocol.RESOLVE_CHAT_ACTOR_USER_ID, produces = "application/json")
    public ResponseEntity<?> resolveChatActorUserId(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccessPermissionsProtocol.RESOLVE_CHAT_ACTOR_USER_ID, AccessPermissionsProtocol.ResolveChatActorUserIdQuery.class,
                AccessPermissionsProtocol::valid, query -> new AccessPermissionsProtocol.ActorResult(true, owner.resolveChatActorUserId(query.chatId(), query.profileId())));
    }
    @PostMapping(value = AccessPermissionsProtocol.CAN_CURRENT_ACTOR_ASSIGN_EVENT_RESOURCE_SCOPE, produces = "application/json")
    public ResponseEntity<?> canCurrentActorAssignEventResourceScope(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccessPermissionsProtocol.CAN_CURRENT_ACTOR_ASSIGN_EVENT_RESOURCE_SCOPE, AccessPermissionsProtocol.CanCurrentActorAssignEventResourceScopeQuery.class,
                AccessPermissionsProtocol::valid, query -> new AccessPermissionsProtocol.Decision(owner.canCurrentActorAssignEventResourceScope(query.eventId(), query.subEventId(), query.assetOwnerUserId())));
    }
    @PostMapping(value = AccessPermissionsProtocol.CAN_ASSIGN_EVENT_RESOURCES_FOR_SUBJECT, produces = "application/json")
    public ResponseEntity<?> canAssignEventResourcesForSubject(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccessPermissionsProtocol.CAN_ASSIGN_EVENT_RESOURCES_FOR_SUBJECT, AccessPermissionsProtocol.CanAssignEventResourcesForSubjectQuery.class,
                AccessPermissionsProtocol::valid, query -> new AccessPermissionsProtocol.Decision(owner.canAssignEventResourcesForSubject(query.eventId(), query.userId())));
    }
    @PostMapping(value = AccessPermissionsProtocol.CAN_RECEIVE_EVENT_ASSET_MANAGER_ROLE, produces = "application/json")
    public ResponseEntity<?> canReceiveEventAssetManagerRole(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccessPermissionsProtocol.CAN_RECEIVE_EVENT_ASSET_MANAGER_ROLE, AccessPermissionsProtocol.CanReceiveEventAssetManagerRoleQuery.class,
                AccessPermissionsProtocol::valid, query -> new AccessPermissionsProtocol.Decision(owner.canReceiveEventAssetManagerRole(query.eventId(), query.userId())));
    }
    @PostMapping(value = AccessPermissionsProtocol.CAN_CURRENT_ACTOR_CREATE_ASSET, produces = "application/json")
    public ResponseEntity<?> canCurrentActorCreateAsset(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccessPermissionsProtocol.CAN_CURRENT_ACTOR_CREATE_ASSET, AccessPermissionsProtocol.CanCurrentActorCreateAssetQuery.class,
                AccessPermissionsProtocol::valid, query -> new AccessPermissionsProtocol.Decision(owner.canCurrentActorCreateAsset(query.ownerUserId(), query.assetId())));
    }
    @PostMapping(value = AccessPermissionsProtocol.CAN_CURRENT_ACTOR_REPLACE_ASSETS, produces = "application/json")
    public ResponseEntity<?> canCurrentActorReplaceAssets(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccessPermissionsProtocol.CAN_CURRENT_ACTOR_REPLACE_ASSETS, AccessPermissionsProtocol.CanCurrentActorReplaceAssetsQuery.class,
                AccessPermissionsProtocol::valid, query -> new AccessPermissionsProtocol.Decision(owner.canCurrentActorReplaceAssets(query.ownerUserId())));
    }
    @PostMapping(value = AccessPermissionsProtocol.CAN_CURRENT_ACTOR_EDIT_ASSET, produces = "application/json")
    public ResponseEntity<?> canCurrentActorEditAsset(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccessPermissionsProtocol.CAN_CURRENT_ACTOR_EDIT_ASSET, AccessPermissionsProtocol.CanCurrentActorEditAssetQuery.class,
                AccessPermissionsProtocol::valid, query -> new AccessPermissionsProtocol.Decision(owner.canCurrentActorEditAsset(query.ownerUserId(), query.assetId())));
    }
    @PostMapping(value = AccessPermissionsProtocol.CAN_CURRENT_ACTOR_DELETE_ASSET, produces = "application/json")
    public ResponseEntity<?> canCurrentActorDeleteAsset(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccessPermissionsProtocol.CAN_CURRENT_ACTOR_DELETE_ASSET, AccessPermissionsProtocol.CanCurrentActorDeleteAssetQuery.class,
                AccessPermissionsProtocol::valid, query -> new AccessPermissionsProtocol.Decision(owner.canCurrentActorDeleteAsset(query.ownerUserId(), query.assetId())));
    }
    @PostMapping(value = AccessPermissionsProtocol.CAN_CURRENT_ACTOR_RESTORE_ASSET, produces = "application/json")
    public ResponseEntity<?> canCurrentActorRestoreAsset(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccessPermissionsProtocol.CAN_CURRENT_ACTOR_RESTORE_ASSET, AccessPermissionsProtocol.CanCurrentActorRestoreAssetQuery.class,
                AccessPermissionsProtocol::valid, query -> new AccessPermissionsProtocol.Decision(owner.canCurrentActorRestoreAsset(query.ownerUserId(), query.assetId())));
    }
    @PostMapping(value = AccessPermissionsProtocol.CAN_CURRENT_ACTOR_TAKE_OVER_ASSET, produces = "application/json")
    public ResponseEntity<?> canCurrentActorTakeOverAsset(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccessPermissionsProtocol.CAN_CURRENT_ACTOR_TAKE_OVER_ASSET, AccessPermissionsProtocol.CanCurrentActorTakeOverAssetQuery.class,
                AccessPermissionsProtocol::valid, query -> new AccessPermissionsProtocol.Decision(owner.canCurrentActorTakeOverAsset(query.actorUserId(), query.assetId())));
    }
    @PostMapping(value = AccessPermissionsProtocol.CAN_CURRENT_ACTOR_PROMOTE_ASSET_MANAGER, produces = "application/json")
    public ResponseEntity<?> canCurrentActorPromoteAssetManager(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccessPermissionsProtocol.CAN_CURRENT_ACTOR_PROMOTE_ASSET_MANAGER, AccessPermissionsProtocol.CanCurrentActorPromoteAssetManagerQuery.class,
                AccessPermissionsProtocol::valid, query -> new AccessPermissionsProtocol.Decision(owner.canCurrentActorPromoteAssetManager(query.actorUserId(), query.assetId())));
    }
    @PostMapping(value = AccessPermissionsProtocol.CAN_CURRENT_ACTOR_CREATE_EVENT, produces = "application/json")
    public ResponseEntity<?> canCurrentActorCreateEvent(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccessPermissionsProtocol.CAN_CURRENT_ACTOR_CREATE_EVENT, AccessPermissionsProtocol.CanCurrentActorCreateEventQuery.class,
                AccessPermissionsProtocol::valid, query -> new AccessPermissionsProtocol.Decision(owner.canCurrentActorCreateEvent(query.ownerUserId(), query.eventId())));
    }
    @PostMapping(value = AccessPermissionsProtocol.CAN_CURRENT_ACTOR_EDIT_EVENT, produces = "application/json")
    public ResponseEntity<?> canCurrentActorEditEvent(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccessPermissionsProtocol.CAN_CURRENT_ACTOR_EDIT_EVENT, AccessPermissionsProtocol.CanCurrentActorEditEventQuery.class,
                AccessPermissionsProtocol::valid, query -> new AccessPermissionsProtocol.Decision(owner.canCurrentActorEditEvent(query.eventId())));
    }
    @PostMapping(value = AccessPermissionsProtocol.CAN_CURRENT_ACTOR_PUBLISH_EVENT, produces = "application/json")
    public ResponseEntity<?> canCurrentActorPublishEvent(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccessPermissionsProtocol.CAN_CURRENT_ACTOR_PUBLISH_EVENT, AccessPermissionsProtocol.CanCurrentActorPublishEventQuery.class,
                AccessPermissionsProtocol::valid, query -> new AccessPermissionsProtocol.Decision(owner.canCurrentActorPublishEvent(query.eventId())));
    }
    @PostMapping(value = AccessPermissionsProtocol.CAN_CURRENT_ACTOR_UNPUBLISH_EVENT, produces = "application/json")
    public ResponseEntity<?> canCurrentActorUnpublishEvent(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccessPermissionsProtocol.CAN_CURRENT_ACTOR_UNPUBLISH_EVENT, AccessPermissionsProtocol.CanCurrentActorUnpublishEventQuery.class,
                AccessPermissionsProtocol::valid, query -> new AccessPermissionsProtocol.Decision(owner.canCurrentActorUnpublishEvent(query.eventId())));
    }
    @PostMapping(value = AccessPermissionsProtocol.CAN_CURRENT_ACTOR_DELETE_EVENT, produces = "application/json")
    public ResponseEntity<?> canCurrentActorDeleteEvent(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccessPermissionsProtocol.CAN_CURRENT_ACTOR_DELETE_EVENT, AccessPermissionsProtocol.CanCurrentActorDeleteEventQuery.class,
                AccessPermissionsProtocol::valid, query -> new AccessPermissionsProtocol.Decision(owner.canCurrentActorDeleteEvent(query.eventId())));
    }
    @PostMapping(value = AccessPermissionsProtocol.CAN_CURRENT_ACTOR_RESTORE_EVENT, produces = "application/json")
    public ResponseEntity<?> canCurrentActorRestoreEvent(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccessPermissionsProtocol.CAN_CURRENT_ACTOR_RESTORE_EVENT, AccessPermissionsProtocol.CanCurrentActorRestoreEventQuery.class,
                AccessPermissionsProtocol::valid, query -> new AccessPermissionsProtocol.Decision(owner.canCurrentActorRestoreEvent(query.eventId())));
    }
    @PostMapping(value = AccessPermissionsProtocol.CAN_CURRENT_ACTOR_TAKE_OVER_EVENT, produces = "application/json")
    public ResponseEntity<?> canCurrentActorTakeOverEvent(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccessPermissionsProtocol.CAN_CURRENT_ACTOR_TAKE_OVER_EVENT, AccessPermissionsProtocol.CanCurrentActorTakeOverEventQuery.class,
                AccessPermissionsProtocol::valid, query -> new AccessPermissionsProtocol.Decision(owner.canCurrentActorTakeOverEvent(query.eventId())));
    }
    @PostMapping(value = AccessPermissionsProtocol.CAN_CURRENT_ACTOR_JOIN_EVENT, produces = "application/json")
    public ResponseEntity<?> canCurrentActorJoinEvent(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccessPermissionsProtocol.CAN_CURRENT_ACTOR_JOIN_EVENT, AccessPermissionsProtocol.CanCurrentActorJoinEventQuery.class,
                AccessPermissionsProtocol::valid, query -> new AccessPermissionsProtocol.Decision(owner.canCurrentActorJoinEvent(query.userId(), query.eventId())));
    }
    @PostMapping(value = AccessPermissionsProtocol.CAN_CURRENT_ACTOR_APPLY_EVENT_STAGE_ACTION, produces = "application/json")
    public ResponseEntity<?> canCurrentActorApplyEventStageAction(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccessPermissionsProtocol.CAN_CURRENT_ACTOR_APPLY_EVENT_STAGE_ACTION, AccessPermissionsProtocol.CanCurrentActorApplyEventStageActionQuery.class,
                AccessPermissionsProtocol::valid, query -> new AccessPermissionsProtocol.Decision(owner.canCurrentActorApplyEventStageAction(query.eventId())));
    }
    @PostMapping(value = AccessPermissionsProtocol.CAN_CURRENT_ACTOR_REQUEST_ASSET_BORROW, produces = "application/json")
    public ResponseEntity<?> canCurrentActorRequestAssetBorrow(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccessPermissionsProtocol.CAN_CURRENT_ACTOR_REQUEST_ASSET_BORROW, AccessPermissionsProtocol.CanCurrentActorRequestAssetBorrowQuery.class,
                AccessPermissionsProtocol::valid, query -> new AccessPermissionsProtocol.Decision(owner.canCurrentActorRequestAssetBorrow(query.requesterUserId(), query.eventId())));
    }
    @PostMapping(value = AccessPermissionsProtocol.CAN_CURRENT_ACTOR_APPROVE_ASSET_BORROW, produces = "application/json")
    public ResponseEntity<?> canCurrentActorApproveAssetBorrow(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccessPermissionsProtocol.CAN_CURRENT_ACTOR_APPROVE_ASSET_BORROW, AccessPermissionsProtocol.CanCurrentActorApproveAssetBorrowQuery.class,
                AccessPermissionsProtocol::valid, query -> new AccessPermissionsProtocol.Decision(owner.canCurrentActorApproveAssetBorrow(query.requesterUserId(), query.assetId())));
    }
    @PostMapping(value = AccessPermissionsProtocol.CAN_CURRENT_ACTOR_REJECT_ASSET_BORROW, produces = "application/json")
    public ResponseEntity<?> canCurrentActorRejectAssetBorrow(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccessPermissionsProtocol.CAN_CURRENT_ACTOR_REJECT_ASSET_BORROW, AccessPermissionsProtocol.CanCurrentActorRejectAssetBorrowQuery.class,
                AccessPermissionsProtocol::valid, query -> new AccessPermissionsProtocol.Decision(owner.canCurrentActorRejectAssetBorrow(query.requesterUserId(), query.assetId())));
    }
    @PostMapping(value = AccessPermissionsProtocol.CAN_CURRENT_ACTOR_CANCEL_ASSET_BORROW, produces = "application/json")
    public ResponseEntity<?> canCurrentActorCancelAssetBorrow(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccessPermissionsProtocol.CAN_CURRENT_ACTOR_CANCEL_ASSET_BORROW, AccessPermissionsProtocol.CanCurrentActorCancelAssetBorrowQuery.class,
                AccessPermissionsProtocol::valid, query -> new AccessPermissionsProtocol.Decision(owner.canCurrentActorCancelAssetBorrow(query.requesterUserId(), query.assetId())));
    }
    @PostMapping(value = AccessPermissionsProtocol.CAN_CURRENT_ACTOR_SUBMIT_LEADERBOARD_ENTRY, produces = "application/json")
    public ResponseEntity<?> canCurrentActorSubmitLeaderboardEntry(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccessPermissionsProtocol.CAN_CURRENT_ACTOR_SUBMIT_LEADERBOARD_ENTRY, AccessPermissionsProtocol.CanCurrentActorSubmitLeaderboardEntryQuery.class,
                AccessPermissionsProtocol::valid, query -> new AccessPermissionsProtocol.Decision(owner.canCurrentActorSubmitLeaderboardEntry(query.actorUserId(), query.eventId())));
    }
    @PostMapping(value = AccessPermissionsProtocol.CAN_CURRENT_ACTOR_SUBMIT_EVENT_FEEDBACK, produces = "application/json")
    public ResponseEntity<?> canCurrentActorSubmitEventFeedback(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccessPermissionsProtocol.CAN_CURRENT_ACTOR_SUBMIT_EVENT_FEEDBACK, AccessPermissionsProtocol.CanCurrentActorSubmitEventFeedbackQuery.class,
                AccessPermissionsProtocol::valid, query -> new AccessPermissionsProtocol.Decision(owner.canCurrentActorSubmitEventFeedback(query.userId(), query.eventId())));
    }
    @PostMapping(value = AccessPermissionsProtocol.CAN_CURRENT_ACTOR_SAVE_EVENT_FEEDBACK_NOTE, produces = "application/json")
    public ResponseEntity<?> canCurrentActorSaveEventFeedbackNote(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccessPermissionsProtocol.CAN_CURRENT_ACTOR_SAVE_EVENT_FEEDBACK_NOTE, AccessPermissionsProtocol.CanCurrentActorSaveEventFeedbackNoteQuery.class,
                AccessPermissionsProtocol::valid, query -> new AccessPermissionsProtocol.Decision(owner.canCurrentActorSaveEventFeedbackNote(query.userId(), query.eventId())));
    }
    @PostMapping(value = AccessPermissionsProtocol.CAN_CURRENT_ACTOR_REMOVE_EVENT_FEEDBACK, produces = "application/json")
    public ResponseEntity<?> canCurrentActorRemoveEventFeedback(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccessPermissionsProtocol.CAN_CURRENT_ACTOR_REMOVE_EVENT_FEEDBACK, AccessPermissionsProtocol.CanCurrentActorRemoveEventFeedbackQuery.class,
                AccessPermissionsProtocol::valid, query -> new AccessPermissionsProtocol.Decision(owner.canCurrentActorRemoveEventFeedback(query.userId(), query.eventId())));
    }
    @PostMapping(value = AccessPermissionsProtocol.CAN_CURRENT_ACTOR_RESTORE_EVENT_FEEDBACK, produces = "application/json")
    public ResponseEntity<?> canCurrentActorRestoreEventFeedback(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccessPermissionsProtocol.CAN_CURRENT_ACTOR_RESTORE_EVENT_FEEDBACK, AccessPermissionsProtocol.CanCurrentActorRestoreEventFeedbackQuery.class,
                AccessPermissionsProtocol::valid, query -> new AccessPermissionsProtocol.Decision(owner.canCurrentActorRestoreEventFeedback(query.userId(), query.eventId())));
    }
    @PostMapping(value = AccessPermissionsProtocol.CAN_CURRENT_ACTOR_CREATE_CHAT_MESSAGE, produces = "application/json")
    public ResponseEntity<?> canCurrentActorCreateChatMessage(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccessPermissionsProtocol.CAN_CURRENT_ACTOR_CREATE_CHAT_MESSAGE, AccessPermissionsProtocol.CanCurrentActorCreateChatMessageQuery.class,
                AccessPermissionsProtocol::valid, query -> new AccessPermissionsProtocol.Decision(owner.canCurrentActorCreateChatMessage(query.userId(), query.chatId())));
    }
    @PostMapping(value = AccessPermissionsProtocol.CAN_CURRENT_ACTOR_EDIT_CHAT_MESSAGE, produces = "application/json")
    public ResponseEntity<?> canCurrentActorEditChatMessage(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccessPermissionsProtocol.CAN_CURRENT_ACTOR_EDIT_CHAT_MESSAGE, AccessPermissionsProtocol.CanCurrentActorEditChatMessageQuery.class,
                AccessPermissionsProtocol::valid, query -> new AccessPermissionsProtocol.Decision(owner.canCurrentActorEditChatMessage(query.userId(), query.chatId())));
    }
    @PostMapping(value = AccessPermissionsProtocol.CAN_CURRENT_ACTOR_DELETE_CHAT_MESSAGE, produces = "application/json")
    public ResponseEntity<?> canCurrentActorDeleteChatMessage(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccessPermissionsProtocol.CAN_CURRENT_ACTOR_DELETE_CHAT_MESSAGE, AccessPermissionsProtocol.CanCurrentActorDeleteChatMessageQuery.class,
                AccessPermissionsProtocol::valid, query -> new AccessPermissionsProtocol.Decision(owner.canCurrentActorDeleteChatMessage(query.userId(), query.chatId())));
    }
    @PostMapping(value = AccessPermissionsProtocol.CAN_CURRENT_ACTOR_PIN_CHAT_MESSAGE, produces = "application/json")
    public ResponseEntity<?> canCurrentActorPinChatMessage(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccessPermissionsProtocol.CAN_CURRENT_ACTOR_PIN_CHAT_MESSAGE, AccessPermissionsProtocol.CanCurrentActorPinChatMessageQuery.class,
                AccessPermissionsProtocol::valid, query -> new AccessPermissionsProtocol.Decision(owner.canCurrentActorPinChatMessage(query.userId(), query.chatId())));
    }
    @PostMapping(value = AccessPermissionsProtocol.CAN_CURRENT_ACTOR_MANAGE_CHAT_REACTION, produces = "application/json")
    public ResponseEntity<?> canCurrentActorManageChatReaction(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccessPermissionsProtocol.CAN_CURRENT_ACTOR_MANAGE_CHAT_REACTION, AccessPermissionsProtocol.CanCurrentActorManageChatReactionQuery.class,
                AccessPermissionsProtocol::valid, query -> new AccessPermissionsProtocol.Decision(owner.canCurrentActorManageChatReaction(query.userId(), query.chatId())));
    }
    @PostMapping(value = AccessPermissionsProtocol.CAN_CURRENT_ACTOR_ADD_CHAT_ATTACHMENT, produces = "application/json")
    public ResponseEntity<?> canCurrentActorAddChatAttachment(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccessPermissionsProtocol.CAN_CURRENT_ACTOR_ADD_CHAT_ATTACHMENT, AccessPermissionsProtocol.CanCurrentActorAddChatAttachmentQuery.class,
                AccessPermissionsProtocol::valid, query -> new AccessPermissionsProtocol.Decision(owner.canCurrentActorAddChatAttachment(query.userId(), query.chatId())));
    }
    @PostMapping(value = AccessPermissionsProtocol.CAN_CURRENT_ACTOR_MANAGE_SUPPORT_CHAT, produces = "application/json")
    public ResponseEntity<?> canCurrentActorManageSupportChat(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccessPermissionsProtocol.CAN_CURRENT_ACTOR_MANAGE_SUPPORT_CHAT, AccessPermissionsProtocol.CanCurrentActorManageSupportChatQuery.class,
                AccessPermissionsProtocol::valid, query -> new AccessPermissionsProtocol.Decision(owner.canCurrentActorManageSupportChat(query.userId(), query.chatId())));
    }
    @PostMapping(value = AccessPermissionsProtocol.CAN_CURRENT_ACTOR_EDIT_PROFILE, produces = "application/json")
    public ResponseEntity<?> canCurrentActorEditProfile(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccessPermissionsProtocol.CAN_CURRENT_ACTOR_EDIT_PROFILE, AccessPermissionsProtocol.CanCurrentActorEditProfileQuery.class,
                AccessPermissionsProtocol::valid, query -> new AccessPermissionsProtocol.Decision(owner.canCurrentActorEditProfile(query.userId())));
    }
    @PostMapping(value = AccessPermissionsProtocol.CAN_CURRENT_ACTOR_DELETE_PROFILE, produces = "application/json")
    public ResponseEntity<?> canCurrentActorDeleteProfile(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccessPermissionsProtocol.CAN_CURRENT_ACTOR_DELETE_PROFILE, AccessPermissionsProtocol.CanCurrentActorDeleteProfileQuery.class,
                AccessPermissionsProtocol::valid, query -> new AccessPermissionsProtocol.Decision(owner.canCurrentActorDeleteProfile(query.userId())));
    }
    @PostMapping(value = AccessPermissionsProtocol.CAN_CURRENT_ACTOR_UPLOAD_MEDIA, produces = "application/json")
    public ResponseEntity<?> canCurrentActorUploadMedia(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccessPermissionsProtocol.CAN_CURRENT_ACTOR_UPLOAD_MEDIA, AccessPermissionsProtocol.CanCurrentActorUploadMediaQuery.class,
                AccessPermissionsProtocol::valid, query -> new AccessPermissionsProtocol.Decision(owner.canCurrentActorUploadMedia(query.ownerUserId())));
    }
    @PostMapping(value = AccessPermissionsProtocol.CAN_CURRENT_ACTOR_IMPORT_MEDIA, produces = "application/json")
    public ResponseEntity<?> canCurrentActorImportMedia(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccessPermissionsProtocol.CAN_CURRENT_ACTOR_IMPORT_MEDIA, AccessPermissionsProtocol.CanCurrentActorImportMediaQuery.class,
                AccessPermissionsProtocol::valid, query -> new AccessPermissionsProtocol.Decision(owner.canCurrentActorImportMedia(query.ownerUserId())));
    }
    @PostMapping(value = AccessPermissionsProtocol.CAN_CURRENT_ACTOR_SUBMIT_PRIVACY_CONSENT, produces = "application/json")
    public ResponseEntity<?> canCurrentActorSubmitPrivacyConsent(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccessPermissionsProtocol.CAN_CURRENT_ACTOR_SUBMIT_PRIVACY_CONSENT, AccessPermissionsProtocol.CanCurrentActorSubmitPrivacyConsentQuery.class,
                AccessPermissionsProtocol::valid, query -> new AccessPermissionsProtocol.Decision(owner.canCurrentActorSubmitPrivacyConsent(query.userId())));
    }
    @PostMapping(value = AccessPermissionsProtocol.CAN_MANAGE_EVENT_MEMBERS, produces = "application/json")
    public ResponseEntity<?> canManageEventMembers(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccessPermissionsProtocol.CAN_MANAGE_EVENT_MEMBERS, AccessPermissionsProtocol.CanManageEventMembersQuery.class,
                AccessPermissionsProtocol::valid, query -> new AccessPermissionsProtocol.Decision(owner.canManageEventMembers(query.eventId(), query.actorUserId())));
    }
    @PostMapping(value = AccessPermissionsProtocol.CAN_CURRENT_ACTOR_VIEW_EVENT_MEMBERS, produces = "application/json")
    public ResponseEntity<?> canCurrentActorViewEventMembers(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccessPermissionsProtocol.CAN_CURRENT_ACTOR_VIEW_EVENT_MEMBERS, AccessPermissionsProtocol.CanCurrentActorViewEventMembersQuery.class,
                AccessPermissionsProtocol::valid, query -> new AccessPermissionsProtocol.Decision(owner.canCurrentActorViewEventMembers(query.eventId())));
    }
    @PostMapping(value = AccessPermissionsProtocol.CAN_ACCEPT_EVENT_MEMBER, produces = "application/json")
    public ResponseEntity<?> canAcceptEventMember(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccessPermissionsProtocol.CAN_ACCEPT_EVENT_MEMBER, AccessPermissionsProtocol.CanAcceptEventMemberQuery.class,
                AccessPermissionsProtocol::valid, query -> new AccessPermissionsProtocol.Decision(owner.canAcceptEventMember(query.eventId(), query.actorUserId(), query.targetUserId())));
    }
    @PostMapping(value = AccessPermissionsProtocol.CAN_REMOVE_EVENT_MEMBER, produces = "application/json")
    public ResponseEntity<?> canRemoveEventMember(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccessPermissionsProtocol.CAN_REMOVE_EVENT_MEMBER, AccessPermissionsProtocol.CanRemoveEventMemberQuery.class,
                AccessPermissionsProtocol::valid, query -> new AccessPermissionsProtocol.Decision(owner.canRemoveEventMember(query.eventId(), query.actorUserId(), query.targetUserId())));
    }
    @PostMapping(value = AccessPermissionsProtocol.CAN_DISQUALIFY_EVENT_MEMBER, produces = "application/json")
    public ResponseEntity<?> canDisqualifyEventMember(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccessPermissionsProtocol.CAN_DISQUALIFY_EVENT_MEMBER, AccessPermissionsProtocol.CanDisqualifyEventMemberQuery.class,
                AccessPermissionsProtocol::valid, query -> new AccessPermissionsProtocol.Decision(owner.canDisqualifyEventMember(query.eventId(), query.actorUserId(), query.targetUserId())));
    }
    @PostMapping(value = AccessPermissionsProtocol.CAN_REINSTATE_EVENT_MEMBER, produces = "application/json")
    public ResponseEntity<?> canReinstateEventMember(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccessPermissionsProtocol.CAN_REINSTATE_EVENT_MEMBER, AccessPermissionsProtocol.CanReinstateEventMemberQuery.class,
                AccessPermissionsProtocol::valid, query -> new AccessPermissionsProtocol.Decision(owner.canReinstateEventMember(query.eventId(), query.actorUserId(), query.targetUserId())));
    }
    @PostMapping(value = AccessPermissionsProtocol.CAN_INVITE_EVENT_MEMBERS, produces = "application/json")
    public ResponseEntity<?> canInviteEventMembers(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccessPermissionsProtocol.CAN_INVITE_EVENT_MEMBERS, AccessPermissionsProtocol.CanInviteEventMembersQuery.class,
                AccessPermissionsProtocol::valid, query -> new AccessPermissionsProtocol.Decision(owner.canInviteEventMembers(query.eventId(), query.actorUserId())));
    }
    @PostMapping(value = AccessPermissionsProtocol.CAN_CURRENT_ACTOR_MANAGE_EVENT_RESOURCE_SCOPE, produces = "application/json")
    public ResponseEntity<?> canCurrentActorManageEventResourceScope(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccessPermissionsProtocol.CAN_CURRENT_ACTOR_MANAGE_EVENT_RESOURCE_SCOPE, AccessPermissionsProtocol.CanCurrentActorManageEventResourceScopeQuery.class,
                AccessPermissionsProtocol::valid, query -> new AccessPermissionsProtocol.Decision(owner.canCurrentActorManageEventResourceScope(query.eventId())));
    }
    @PostMapping(value = AccessPermissionsProtocol.CAN_CLEANUP_EVENT_RESOURCE_ASSIGNMENTS, produces = "application/json")
    public ResponseEntity<?> canCleanupEventResourceAssignments(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccessPermissionsProtocol.CAN_CLEANUP_EVENT_RESOURCE_ASSIGNMENTS, AccessPermissionsProtocol.CanCleanupEventResourceAssignmentsQuery.class,
                AccessPermissionsProtocol::valid, query -> new AccessPermissionsProtocol.Decision(owner.canCleanupEventResourceAssignments(query.eventId(), query.actorUserId())));
    }
    @PostMapping(value = AccessPermissionsProtocol.HAS_ACCEPTED_PARTICIPATION, produces = "application/json")
    public ResponseEntity<?> hasAcceptedParticipation(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccessPermissionsProtocol.HAS_ACCEPTED_PARTICIPATION, AccessPermissionsProtocol.HasAcceptedParticipationQuery.class,
                AccessPermissionsProtocol::valid, query -> new AccessPermissionsProtocol.Decision(owner.hasAcceptedParticipation(query.ownerType(), query.ownerId(), query.userId())));
    }
    @PostMapping(value = AccessPermissionsProtocol.HAS_MEMBER_STATUS, produces = "application/json")
    public ResponseEntity<?> hasMemberStatus(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccessPermissionsProtocol.HAS_MEMBER_STATUS, AccessPermissionsProtocol.HasMemberStatusQuery.class,
                AccessPermissionsProtocol::valid, query -> new AccessPermissionsProtocol.Decision(owner.hasMemberStatus(query.ownerType(), query.ownerId(), query.userId(), query.status())));
    }
    @PostMapping(value = AccessPermissionsProtocol.CAN_MANAGE_MEMBERS, produces = "application/json")
    public ResponseEntity<?> canManageMembers(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccessPermissionsProtocol.CAN_MANAGE_MEMBERS, AccessPermissionsProtocol.CanManageMembersQuery.class,
                AccessPermissionsProtocol::valid, query -> new AccessPermissionsProtocol.Decision(owner.canManageMembers(query.ownerType(), query.ownerId(), query.actorUserId())));
    }
    @PostMapping(value = AccessPermissionsProtocol.IS_PROTECTED_MEMBER, produces = "application/json")
    public ResponseEntity<?> isProtectedMember(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccessPermissionsProtocol.IS_PROTECTED_MEMBER, AccessPermissionsProtocol.IsProtectedMemberQuery.class,
                AccessPermissionsProtocol::valid, query -> new AccessPermissionsProtocol.Decision(owner.isProtectedMember(query.ownerType(), query.ownerId(), query.userId())));
    }
    @PostMapping(value = AccessPermissionsProtocol.CAN_MANAGE_EVENT, produces = "application/json")
    public ResponseEntity<?> canManageEvent(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccessPermissionsProtocol.CAN_MANAGE_EVENT, AccessPermissionsProtocol.CanManageEventQuery.class,
                AccessPermissionsProtocol::valid, query -> new AccessPermissionsProtocol.Decision(owner.canManageEvent(query.eventId(), query.actorUserId())));
    }
    @PostMapping(value = AccessPermissionsProtocol.CAN_TAKE_OVER_EVENT, produces = "application/json")
    public ResponseEntity<?> canTakeOverEvent(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccessPermissionsProtocol.CAN_TAKE_OVER_EVENT, AccessPermissionsProtocol.CanTakeOverEventQuery.class,
                AccessPermissionsProtocol::valid, query -> new AccessPermissionsProtocol.Decision(owner.canTakeOverEvent(query.eventId(), query.actorUserId())));
    }
    @PostMapping(value = AccessPermissionsProtocol.CAN_MANAGE_ASSET, produces = "application/json")
    public ResponseEntity<?> canManageAsset(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccessPermissionsProtocol.CAN_MANAGE_ASSET, AccessPermissionsProtocol.CanManageAssetQuery.class,
                AccessPermissionsProtocol::valid, query -> new AccessPermissionsProtocol.Decision(owner.canManageAsset(query.assetId(), query.actorUserId())));
    }
    @PostMapping(value = AccessPermissionsProtocol.CAN_TAKE_OVER_ASSET, produces = "application/json")
    public ResponseEntity<?> canTakeOverAsset(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccessPermissionsProtocol.CAN_TAKE_OVER_ASSET, AccessPermissionsProtocol.CanTakeOverAssetQuery.class,
                AccessPermissionsProtocol::valid, query -> new AccessPermissionsProtocol.Decision(owner.canTakeOverAsset(query.assetId(), query.actorUserId())));
    }
    @PostMapping(value = AccessPermissionsProtocol.CAN_ACCESS_CHAT, produces = "application/json")
    public ResponseEntity<?> canAccessChat(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccessPermissionsProtocol.CAN_ACCESS_CHAT, AccessPermissionsProtocol.CanAccessChatQuery.class,
                AccessPermissionsProtocol::valid, query -> new AccessPermissionsProtocol.Decision(owner.canAccessChat(query.chatId(), query.actorUserId())));
    }
    @PostMapping(value = AccessPermissionsProtocol.CAN_MANAGE_SUPPORT_CHAT, produces = "application/json")
    public ResponseEntity<?> canManageSupportChat(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccessPermissionsProtocol.CAN_MANAGE_SUPPORT_CHAT, AccessPermissionsProtocol.CanManageSupportChatQuery.class,
                AccessPermissionsProtocol::valid, query -> new AccessPermissionsProtocol.Decision(owner.canManageSupportChat(query.chatId(), query.actorUserId())));
    }
    @PostMapping(value = AccessPermissionsProtocol.HAS_EXPLICIT_GRANT, produces = "application/json")
    public ResponseEntity<?> hasExplicitGrant(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccessPermissionsProtocol.HAS_EXPLICIT_GRANT, AccessPermissionsProtocol.HasExplicitGrantQuery.class,
                AccessPermissionsProtocol::valid, query -> new AccessPermissionsProtocol.Decision(owner.hasExplicitGrant(query.subjectUserId(), query.permission(), query.resourceType(), query.resourceId(), query.expectedEffect())));
    }
    @PostMapping(value = AccessPermissionsProtocol.REQUIRES_AUTHENTICATED_ACTOR, produces = "application/json")
    public ResponseEntity<?> requiresAuthenticatedActor(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccessPermissionsProtocol.REQUIRES_AUTHENTICATED_ACTOR, AccessPermissionsProtocol.RequiresAuthenticatedActorQuery.class,
                AccessPermissionsProtocol::valid, query -> new AccessPermissionsProtocol.Decision(owner.requiresAuthenticatedActor()));
    }
    private <T> ResponseEntity<?> read(HttpServletRequest request, String path, Class<T> type,
            Predicate<T> valid, Function<T, Object> action) throws java.io.IOException {
        try {
            var proofs = Collections.list(request.getHeaders(ActorDelegation.HEADER));
            if (proofs.size() > 1) throw new AccessDeniedException("Ambiguous actor proof");
            byte[] bytes = ReadQueryBodies.readBytes(request, AccessPermissionsProtocol.MAX_REQUEST_BYTES);
            var principal = proofs.isEmpty() ? null : verifier.verifyPrincipal(proofs.getFirst(),
                    AccessPermissionsProtocol.AUDIENCE, "POST", path, bytes);
            T query;
            try {
                query = mapper.readerFor(type).with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                        .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).readValue(bytes);
            } catch (RuntimeException invalid) { throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST"); }
            if (!valid.test(query)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            // A service capability is never the application's current actor.
            try (var ignored = principal == null ? DelegatedActorContext.withoutActor() : DelegatedActorContext.open(principal)) {
                return response(200, action.apply(query));
            }
        } catch (AccessDeniedException denied) { return response(403, new AccessPermissionsProtocol.Error("INVALID_DELEGATION")); }
        catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new AccessPermissionsProtocol.Error(invalid.code())); }
        catch (ResponseStatusException rejected) {
            int status = rejected.getStatusCode().value();
            return response(status >= 400 && status < 500 ? status : 503, new AccessPermissionsProtocol.Error("OWNER_REJECTED"));
        }
        catch (RuntimeException unavailable) { return response(503, new AccessPermissionsProtocol.Error("ACCESS_PERMISSIONS_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) {
        return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body);
    }
}
