package com.raxim.myscoutee.microservices.transport.access;

import com.raxim.myscoutee.domain.access.api.AccessGrantEffect;

/** Explicit native policy queries; no policy implementation or document crosses the boundary. */
public final class AccessPermissionsProtocol {
    public static final String ROOT = "/_internal/v1/access/permissions";
    public static final String AUDIENCE = "access:permissions";
    public static final int MAX_REQUEST_BYTES = 65536, MAX_RESPONSE_BYTES = 16384;
    private AccessPermissionsProtocol() {}
    public record Decision(Boolean allowed) {}
    public record ActorResult(Boolean resolved, String userId) {}
    public record Error(String code) {}
    private static boolean id(String value) { return value == null || value.length() <= 512; }
    public static final String CAN = ROOT + "/can";
    public record CanQuery(String policyKey, String actorUserId, String subjectUserId, String resourceId) {}
    public static boolean valid(CanQuery query) { return query != null && id(query.policyKey()) && id(query.actorUserId()) && id(query.subjectUserId()) && id(query.resourceId()); }
    public static final String RESOLVE_CHAT_ACTOR_USER_ID = ROOT + "/resolve-chat-actor-user-id";
    public record ResolveChatActorUserIdQuery(String chatId, String profileId) {}
    public static boolean valid(ResolveChatActorUserIdQuery query) { return query != null && id(query.chatId()) && id(query.profileId()); }
    public static final String CAN_CURRENT_ACTOR_ASSIGN_EVENT_RESOURCE_SCOPE = ROOT + "/can-current-actor-assign-event-resource-scope";
    public record CanCurrentActorAssignEventResourceScopeQuery(String eventId, String subEventId, String assetOwnerUserId) {}
    public static boolean valid(CanCurrentActorAssignEventResourceScopeQuery query) { return query != null && id(query.eventId()) && id(query.subEventId()) && id(query.assetOwnerUserId()); }
    public static final String CAN_ASSIGN_EVENT_RESOURCES_FOR_SUBJECT = ROOT + "/can-assign-event-resources-for-subject";
    public record CanAssignEventResourcesForSubjectQuery(String eventId, String userId) {}
    public static boolean valid(CanAssignEventResourcesForSubjectQuery query) { return query != null && id(query.eventId()) && id(query.userId()); }
    public static final String CAN_RECEIVE_EVENT_ASSET_MANAGER_ROLE = ROOT + "/can-receive-event-asset-manager-role";
    public record CanReceiveEventAssetManagerRoleQuery(String eventId, String userId) {}
    public static boolean valid(CanReceiveEventAssetManagerRoleQuery query) { return query != null && id(query.eventId()) && id(query.userId()); }
    public static final String CAN_CURRENT_ACTOR_CREATE_ASSET = ROOT + "/can-current-actor-create-asset";
    public record CanCurrentActorCreateAssetQuery(String ownerUserId, String assetId) {}
    public static boolean valid(CanCurrentActorCreateAssetQuery query) { return query != null && id(query.ownerUserId()) && id(query.assetId()); }
    public static final String CAN_CURRENT_ACTOR_REPLACE_ASSETS = ROOT + "/can-current-actor-replace-assets";
    public record CanCurrentActorReplaceAssetsQuery(String ownerUserId) {}
    public static boolean valid(CanCurrentActorReplaceAssetsQuery query) { return query != null && id(query.ownerUserId()); }
    public static final String CAN_CURRENT_ACTOR_EDIT_ASSET = ROOT + "/can-current-actor-edit-asset";
    public record CanCurrentActorEditAssetQuery(String ownerUserId, String assetId) {}
    public static boolean valid(CanCurrentActorEditAssetQuery query) { return query != null && id(query.ownerUserId()) && id(query.assetId()); }
    public static final String CAN_CURRENT_ACTOR_DELETE_ASSET = ROOT + "/can-current-actor-delete-asset";
    public record CanCurrentActorDeleteAssetQuery(String ownerUserId, String assetId) {}
    public static boolean valid(CanCurrentActorDeleteAssetQuery query) { return query != null && id(query.ownerUserId()) && id(query.assetId()); }
    public static final String CAN_CURRENT_ACTOR_RESTORE_ASSET = ROOT + "/can-current-actor-restore-asset";
    public record CanCurrentActorRestoreAssetQuery(String ownerUserId, String assetId) {}
    public static boolean valid(CanCurrentActorRestoreAssetQuery query) { return query != null && id(query.ownerUserId()) && id(query.assetId()); }
    public static final String CAN_CURRENT_ACTOR_TAKE_OVER_ASSET = ROOT + "/can-current-actor-take-over-asset";
    public record CanCurrentActorTakeOverAssetQuery(String actorUserId, String assetId) {}
    public static boolean valid(CanCurrentActorTakeOverAssetQuery query) { return query != null && id(query.actorUserId()) && id(query.assetId()); }
    public static final String CAN_CURRENT_ACTOR_PROMOTE_ASSET_MANAGER = ROOT + "/can-current-actor-promote-asset-manager";
    public record CanCurrentActorPromoteAssetManagerQuery(String actorUserId, String assetId) {}
    public static boolean valid(CanCurrentActorPromoteAssetManagerQuery query) { return query != null && id(query.actorUserId()) && id(query.assetId()); }
    public static final String CAN_CURRENT_ACTOR_CREATE_EVENT = ROOT + "/can-current-actor-create-event";
    public record CanCurrentActorCreateEventQuery(String ownerUserId, String eventId) {}
    public static boolean valid(CanCurrentActorCreateEventQuery query) { return query != null && id(query.ownerUserId()) && id(query.eventId()); }
    public static final String CAN_CURRENT_ACTOR_EDIT_EVENT = ROOT + "/can-current-actor-edit-event";
    public record CanCurrentActorEditEventQuery(String eventId) {}
    public static boolean valid(CanCurrentActorEditEventQuery query) { return query != null && id(query.eventId()); }
    public static final String CAN_CURRENT_ACTOR_PUBLISH_EVENT = ROOT + "/can-current-actor-publish-event";
    public record CanCurrentActorPublishEventQuery(String eventId) {}
    public static boolean valid(CanCurrentActorPublishEventQuery query) { return query != null && id(query.eventId()); }
    public static final String CAN_CURRENT_ACTOR_UNPUBLISH_EVENT = ROOT + "/can-current-actor-unpublish-event";
    public record CanCurrentActorUnpublishEventQuery(String eventId) {}
    public static boolean valid(CanCurrentActorUnpublishEventQuery query) { return query != null && id(query.eventId()); }
    public static final String CAN_CURRENT_ACTOR_DELETE_EVENT = ROOT + "/can-current-actor-delete-event";
    public record CanCurrentActorDeleteEventQuery(String eventId) {}
    public static boolean valid(CanCurrentActorDeleteEventQuery query) { return query != null && id(query.eventId()); }
    public static final String CAN_CURRENT_ACTOR_RESTORE_EVENT = ROOT + "/can-current-actor-restore-event";
    public record CanCurrentActorRestoreEventQuery(String eventId) {}
    public static boolean valid(CanCurrentActorRestoreEventQuery query) { return query != null && id(query.eventId()); }
    public static final String CAN_CURRENT_ACTOR_TAKE_OVER_EVENT = ROOT + "/can-current-actor-take-over-event";
    public record CanCurrentActorTakeOverEventQuery(String eventId) {}
    public static boolean valid(CanCurrentActorTakeOverEventQuery query) { return query != null && id(query.eventId()); }
    public static final String CAN_CURRENT_ACTOR_JOIN_EVENT = ROOT + "/can-current-actor-join-event";
    public record CanCurrentActorJoinEventQuery(String userId, String eventId) {}
    public static boolean valid(CanCurrentActorJoinEventQuery query) { return query != null && id(query.userId()) && id(query.eventId()); }
    public static final String CAN_CURRENT_ACTOR_APPLY_EVENT_STAGE_ACTION = ROOT + "/can-current-actor-apply-event-stage-action";
    public record CanCurrentActorApplyEventStageActionQuery(String eventId) {}
    public static boolean valid(CanCurrentActorApplyEventStageActionQuery query) { return query != null && id(query.eventId()); }
    public static final String CAN_CURRENT_ACTOR_REQUEST_ASSET_BORROW = ROOT + "/can-current-actor-request-asset-borrow";
    public record CanCurrentActorRequestAssetBorrowQuery(String requesterUserId, String eventId) {}
    public static boolean valid(CanCurrentActorRequestAssetBorrowQuery query) { return query != null && id(query.requesterUserId()) && id(query.eventId()); }
    public static final String CAN_CURRENT_ACTOR_APPROVE_ASSET_BORROW = ROOT + "/can-current-actor-approve-asset-borrow";
    public record CanCurrentActorApproveAssetBorrowQuery(String requesterUserId, String assetId) {}
    public static boolean valid(CanCurrentActorApproveAssetBorrowQuery query) { return query != null && id(query.requesterUserId()) && id(query.assetId()); }
    public static final String CAN_CURRENT_ACTOR_REJECT_ASSET_BORROW = ROOT + "/can-current-actor-reject-asset-borrow";
    public record CanCurrentActorRejectAssetBorrowQuery(String requesterUserId, String assetId) {}
    public static boolean valid(CanCurrentActorRejectAssetBorrowQuery query) { return query != null && id(query.requesterUserId()) && id(query.assetId()); }
    public static final String CAN_CURRENT_ACTOR_CANCEL_ASSET_BORROW = ROOT + "/can-current-actor-cancel-asset-borrow";
    public record CanCurrentActorCancelAssetBorrowQuery(String requesterUserId, String assetId) {}
    public static boolean valid(CanCurrentActorCancelAssetBorrowQuery query) { return query != null && id(query.requesterUserId()) && id(query.assetId()); }
    public static final String CAN_CURRENT_ACTOR_SUBMIT_LEADERBOARD_ENTRY = ROOT + "/can-current-actor-submit-leaderboard-entry";
    public record CanCurrentActorSubmitLeaderboardEntryQuery(String actorUserId, String eventId) {}
    public static boolean valid(CanCurrentActorSubmitLeaderboardEntryQuery query) { return query != null && id(query.actorUserId()) && id(query.eventId()); }
    public static final String CAN_CURRENT_ACTOR_SUBMIT_EVENT_FEEDBACK = ROOT + "/can-current-actor-submit-event-feedback";
    public record CanCurrentActorSubmitEventFeedbackQuery(String userId, String eventId) {}
    public static boolean valid(CanCurrentActorSubmitEventFeedbackQuery query) { return query != null && id(query.userId()) && id(query.eventId()); }
    public static final String CAN_CURRENT_ACTOR_SAVE_EVENT_FEEDBACK_NOTE = ROOT + "/can-current-actor-save-event-feedback-note";
    public record CanCurrentActorSaveEventFeedbackNoteQuery(String userId, String eventId) {}
    public static boolean valid(CanCurrentActorSaveEventFeedbackNoteQuery query) { return query != null && id(query.userId()) && id(query.eventId()); }
    public static final String CAN_CURRENT_ACTOR_REMOVE_EVENT_FEEDBACK = ROOT + "/can-current-actor-remove-event-feedback";
    public record CanCurrentActorRemoveEventFeedbackQuery(String userId, String eventId) {}
    public static boolean valid(CanCurrentActorRemoveEventFeedbackQuery query) { return query != null && id(query.userId()) && id(query.eventId()); }
    public static final String CAN_CURRENT_ACTOR_RESTORE_EVENT_FEEDBACK = ROOT + "/can-current-actor-restore-event-feedback";
    public record CanCurrentActorRestoreEventFeedbackQuery(String userId, String eventId) {}
    public static boolean valid(CanCurrentActorRestoreEventFeedbackQuery query) { return query != null && id(query.userId()) && id(query.eventId()); }
    public static final String CAN_CURRENT_ACTOR_CREATE_CHAT_MESSAGE = ROOT + "/can-current-actor-create-chat-message";
    public record CanCurrentActorCreateChatMessageQuery(String userId, String chatId) {}
    public static boolean valid(CanCurrentActorCreateChatMessageQuery query) { return query != null && id(query.userId()) && id(query.chatId()); }
    public static final String CAN_CURRENT_ACTOR_EDIT_CHAT_MESSAGE = ROOT + "/can-current-actor-edit-chat-message";
    public record CanCurrentActorEditChatMessageQuery(String userId, String chatId) {}
    public static boolean valid(CanCurrentActorEditChatMessageQuery query) { return query != null && id(query.userId()) && id(query.chatId()); }
    public static final String CAN_CURRENT_ACTOR_DELETE_CHAT_MESSAGE = ROOT + "/can-current-actor-delete-chat-message";
    public record CanCurrentActorDeleteChatMessageQuery(String userId, String chatId) {}
    public static boolean valid(CanCurrentActorDeleteChatMessageQuery query) { return query != null && id(query.userId()) && id(query.chatId()); }
    public static final String CAN_CURRENT_ACTOR_PIN_CHAT_MESSAGE = ROOT + "/can-current-actor-pin-chat-message";
    public record CanCurrentActorPinChatMessageQuery(String userId, String chatId) {}
    public static boolean valid(CanCurrentActorPinChatMessageQuery query) { return query != null && id(query.userId()) && id(query.chatId()); }
    public static final String CAN_CURRENT_ACTOR_MANAGE_CHAT_REACTION = ROOT + "/can-current-actor-manage-chat-reaction";
    public record CanCurrentActorManageChatReactionQuery(String userId, String chatId) {}
    public static boolean valid(CanCurrentActorManageChatReactionQuery query) { return query != null && id(query.userId()) && id(query.chatId()); }
    public static final String CAN_CURRENT_ACTOR_ADD_CHAT_ATTACHMENT = ROOT + "/can-current-actor-add-chat-attachment";
    public record CanCurrentActorAddChatAttachmentQuery(String userId, String chatId) {}
    public static boolean valid(CanCurrentActorAddChatAttachmentQuery query) { return query != null && id(query.userId()) && id(query.chatId()); }
    public static final String CAN_CURRENT_ACTOR_MANAGE_SUPPORT_CHAT = ROOT + "/can-current-actor-manage-support-chat";
    public record CanCurrentActorManageSupportChatQuery(String userId, String chatId) {}
    public static boolean valid(CanCurrentActorManageSupportChatQuery query) { return query != null && id(query.userId()) && id(query.chatId()); }
    public static final String CAN_CURRENT_ACTOR_EDIT_PROFILE = ROOT + "/can-current-actor-edit-profile";
    public record CanCurrentActorEditProfileQuery(String userId) {}
    public static boolean valid(CanCurrentActorEditProfileQuery query) { return query != null && id(query.userId()); }
    public static final String CAN_CURRENT_ACTOR_DELETE_PROFILE = ROOT + "/can-current-actor-delete-profile";
    public record CanCurrentActorDeleteProfileQuery(String userId) {}
    public static boolean valid(CanCurrentActorDeleteProfileQuery query) { return query != null && id(query.userId()); }
    public static final String CAN_CURRENT_ACTOR_UPLOAD_MEDIA = ROOT + "/can-current-actor-upload-media";
    public record CanCurrentActorUploadMediaQuery(String ownerUserId) {}
    public static boolean valid(CanCurrentActorUploadMediaQuery query) { return query != null && id(query.ownerUserId()); }
    public static final String CAN_CURRENT_ACTOR_IMPORT_MEDIA = ROOT + "/can-current-actor-import-media";
    public record CanCurrentActorImportMediaQuery(String ownerUserId) {}
    public static boolean valid(CanCurrentActorImportMediaQuery query) { return query != null && id(query.ownerUserId()); }
    public static final String CAN_CURRENT_ACTOR_SUBMIT_PRIVACY_CONSENT = ROOT + "/can-current-actor-submit-privacy-consent";
    public record CanCurrentActorSubmitPrivacyConsentQuery(String userId) {}
    public static boolean valid(CanCurrentActorSubmitPrivacyConsentQuery query) { return query != null && id(query.userId()); }
    public static final String CAN_MANAGE_EVENT_MEMBERS = ROOT + "/can-manage-event-members";
    public record CanManageEventMembersQuery(String eventId, String actorUserId) {}
    public static boolean valid(CanManageEventMembersQuery query) { return query != null && id(query.eventId()) && id(query.actorUserId()); }
    public static final String CAN_CURRENT_ACTOR_VIEW_EVENT_MEMBERS = ROOT + "/can-current-actor-view-event-members";
    public record CanCurrentActorViewEventMembersQuery(String eventId) {}
    public static boolean valid(CanCurrentActorViewEventMembersQuery query) { return query != null && id(query.eventId()); }
    public static final String CAN_ACCEPT_EVENT_MEMBER = ROOT + "/can-accept-event-member";
    public record CanAcceptEventMemberQuery(String eventId, String actorUserId, String targetUserId) {}
    public static boolean valid(CanAcceptEventMemberQuery query) { return query != null && id(query.eventId()) && id(query.actorUserId()) && id(query.targetUserId()); }
    public static final String CAN_REMOVE_EVENT_MEMBER = ROOT + "/can-remove-event-member";
    public record CanRemoveEventMemberQuery(String eventId, String actorUserId, String targetUserId) {}
    public static boolean valid(CanRemoveEventMemberQuery query) { return query != null && id(query.eventId()) && id(query.actorUserId()) && id(query.targetUserId()); }
    public static final String CAN_DISQUALIFY_EVENT_MEMBER = ROOT + "/can-disqualify-event-member";
    public record CanDisqualifyEventMemberQuery(String eventId, String actorUserId, String targetUserId) {}
    public static boolean valid(CanDisqualifyEventMemberQuery query) { return query != null && id(query.eventId()) && id(query.actorUserId()) && id(query.targetUserId()); }
    public static final String CAN_REINSTATE_EVENT_MEMBER = ROOT + "/can-reinstate-event-member";
    public record CanReinstateEventMemberQuery(String eventId, String actorUserId, String targetUserId) {}
    public static boolean valid(CanReinstateEventMemberQuery query) { return query != null && id(query.eventId()) && id(query.actorUserId()) && id(query.targetUserId()); }
    public static final String CAN_INVITE_EVENT_MEMBERS = ROOT + "/can-invite-event-members";
    public record CanInviteEventMembersQuery(String eventId, String actorUserId) {}
    public static boolean valid(CanInviteEventMembersQuery query) { return query != null && id(query.eventId()) && id(query.actorUserId()); }
    public static final String CAN_CURRENT_ACTOR_MANAGE_EVENT_RESOURCE_SCOPE = ROOT + "/can-current-actor-manage-event-resource-scope";
    public record CanCurrentActorManageEventResourceScopeQuery(String eventId) {}
    public static boolean valid(CanCurrentActorManageEventResourceScopeQuery query) { return query != null && id(query.eventId()); }
    public static final String CAN_CLEANUP_EVENT_RESOURCE_ASSIGNMENTS = ROOT + "/can-cleanup-event-resource-assignments";
    public record CanCleanupEventResourceAssignmentsQuery(String eventId, String actorUserId) {}
    public static boolean valid(CanCleanupEventResourceAssignmentsQuery query) { return query != null && id(query.eventId()) && id(query.actorUserId()); }
    public static final String HAS_ACCEPTED_PARTICIPATION = ROOT + "/has-accepted-participation";
    public record HasAcceptedParticipationQuery(String ownerType, String ownerId, String userId) {}
    public static boolean valid(HasAcceptedParticipationQuery query) { return query != null && id(query.ownerType()) && id(query.ownerId()) && id(query.userId()); }
    public static final String HAS_MEMBER_STATUS = ROOT + "/has-member-status";
    public record HasMemberStatusQuery(String ownerType, String ownerId, String userId, String status) {}
    public static boolean valid(HasMemberStatusQuery query) { return query != null && id(query.ownerType()) && id(query.ownerId()) && id(query.userId()) && id(query.status()); }
    public static final String CAN_MANAGE_MEMBERS = ROOT + "/can-manage-members";
    public record CanManageMembersQuery(String ownerType, String ownerId, String actorUserId) {}
    public static boolean valid(CanManageMembersQuery query) { return query != null && id(query.ownerType()) && id(query.ownerId()) && id(query.actorUserId()); }
    public static final String IS_PROTECTED_MEMBER = ROOT + "/is-protected-member";
    public record IsProtectedMemberQuery(String ownerType, String ownerId, String userId) {}
    public static boolean valid(IsProtectedMemberQuery query) { return query != null && id(query.ownerType()) && id(query.ownerId()) && id(query.userId()); }
    public static final String CAN_MANAGE_EVENT = ROOT + "/can-manage-event";
    public record CanManageEventQuery(String eventId, String actorUserId) {}
    public static boolean valid(CanManageEventQuery query) { return query != null && id(query.eventId()) && id(query.actorUserId()); }
    public static final String CAN_TAKE_OVER_EVENT = ROOT + "/can-take-over-event";
    public record CanTakeOverEventQuery(String eventId, String actorUserId) {}
    public static boolean valid(CanTakeOverEventQuery query) { return query != null && id(query.eventId()) && id(query.actorUserId()); }
    public static final String CAN_MANAGE_ASSET = ROOT + "/can-manage-asset";
    public record CanManageAssetQuery(String assetId, String actorUserId) {}
    public static boolean valid(CanManageAssetQuery query) { return query != null && id(query.assetId()) && id(query.actorUserId()); }
    public static final String CAN_TAKE_OVER_ASSET = ROOT + "/can-take-over-asset";
    public record CanTakeOverAssetQuery(String assetId, String actorUserId) {}
    public static boolean valid(CanTakeOverAssetQuery query) { return query != null && id(query.assetId()) && id(query.actorUserId()); }
    public static final String CAN_ACCESS_CHAT = ROOT + "/can-access-chat";
    public record CanAccessChatQuery(String chatId, String actorUserId) {}
    public static boolean valid(CanAccessChatQuery query) { return query != null && id(query.chatId()) && id(query.actorUserId()); }
    public static final String CAN_MANAGE_SUPPORT_CHAT = ROOT + "/can-manage-support-chat";
    public record CanManageSupportChatQuery(String chatId, String actorUserId) {}
    public static boolean valid(CanManageSupportChatQuery query) { return query != null && id(query.chatId()) && id(query.actorUserId()); }
    public static final String HAS_EXPLICIT_GRANT = ROOT + "/has-explicit-grant";
    public record HasExplicitGrantQuery(String subjectUserId, String permission, String resourceType, String resourceId, AccessGrantEffect expectedEffect) {}
    public static boolean valid(HasExplicitGrantQuery query) { return query != null && id(query.subjectUserId()) && id(query.permission()) && id(query.resourceType()) && id(query.resourceId()); }
    public static final String REQUIRES_AUTHENTICATED_ACTOR = ROOT + "/requires-authenticated-actor";
    public record RequiresAuthenticatedActorQuery() {}
    public static boolean valid(RequiresAuthenticatedActorQuery query) { return query != null; }
    public static String[] paths() { return new String[] {CAN, RESOLVE_CHAT_ACTOR_USER_ID, CAN_CURRENT_ACTOR_ASSIGN_EVENT_RESOURCE_SCOPE, CAN_ASSIGN_EVENT_RESOURCES_FOR_SUBJECT, CAN_RECEIVE_EVENT_ASSET_MANAGER_ROLE, CAN_CURRENT_ACTOR_CREATE_ASSET, CAN_CURRENT_ACTOR_REPLACE_ASSETS, CAN_CURRENT_ACTOR_EDIT_ASSET, CAN_CURRENT_ACTOR_DELETE_ASSET, CAN_CURRENT_ACTOR_RESTORE_ASSET, CAN_CURRENT_ACTOR_TAKE_OVER_ASSET, CAN_CURRENT_ACTOR_PROMOTE_ASSET_MANAGER, CAN_CURRENT_ACTOR_CREATE_EVENT, CAN_CURRENT_ACTOR_EDIT_EVENT, CAN_CURRENT_ACTOR_PUBLISH_EVENT, CAN_CURRENT_ACTOR_UNPUBLISH_EVENT, CAN_CURRENT_ACTOR_DELETE_EVENT, CAN_CURRENT_ACTOR_RESTORE_EVENT, CAN_CURRENT_ACTOR_TAKE_OVER_EVENT, CAN_CURRENT_ACTOR_JOIN_EVENT, CAN_CURRENT_ACTOR_APPLY_EVENT_STAGE_ACTION, CAN_CURRENT_ACTOR_REQUEST_ASSET_BORROW, CAN_CURRENT_ACTOR_APPROVE_ASSET_BORROW, CAN_CURRENT_ACTOR_REJECT_ASSET_BORROW, CAN_CURRENT_ACTOR_CANCEL_ASSET_BORROW, CAN_CURRENT_ACTOR_SUBMIT_LEADERBOARD_ENTRY, CAN_CURRENT_ACTOR_SUBMIT_EVENT_FEEDBACK, CAN_CURRENT_ACTOR_SAVE_EVENT_FEEDBACK_NOTE, CAN_CURRENT_ACTOR_REMOVE_EVENT_FEEDBACK, CAN_CURRENT_ACTOR_RESTORE_EVENT_FEEDBACK, CAN_CURRENT_ACTOR_CREATE_CHAT_MESSAGE, CAN_CURRENT_ACTOR_EDIT_CHAT_MESSAGE, CAN_CURRENT_ACTOR_DELETE_CHAT_MESSAGE, CAN_CURRENT_ACTOR_PIN_CHAT_MESSAGE, CAN_CURRENT_ACTOR_MANAGE_CHAT_REACTION, CAN_CURRENT_ACTOR_ADD_CHAT_ATTACHMENT, CAN_CURRENT_ACTOR_MANAGE_SUPPORT_CHAT, CAN_CURRENT_ACTOR_EDIT_PROFILE, CAN_CURRENT_ACTOR_DELETE_PROFILE, CAN_CURRENT_ACTOR_UPLOAD_MEDIA, CAN_CURRENT_ACTOR_IMPORT_MEDIA, CAN_CURRENT_ACTOR_SUBMIT_PRIVACY_CONSENT, CAN_MANAGE_EVENT_MEMBERS, CAN_CURRENT_ACTOR_VIEW_EVENT_MEMBERS, CAN_ACCEPT_EVENT_MEMBER, CAN_REMOVE_EVENT_MEMBER, CAN_DISQUALIFY_EVENT_MEMBER, CAN_REINSTATE_EVENT_MEMBER, CAN_INVITE_EVENT_MEMBERS, CAN_CURRENT_ACTOR_MANAGE_EVENT_RESOURCE_SCOPE, CAN_CLEANUP_EVENT_RESOURCE_ASSIGNMENTS, HAS_ACCEPTED_PARTICIPATION, HAS_MEMBER_STATUS, CAN_MANAGE_MEMBERS, IS_PROTECTED_MEMBER, CAN_MANAGE_EVENT, CAN_TAKE_OVER_EVENT, CAN_MANAGE_ASSET, CAN_TAKE_OVER_ASSET, CAN_ACCESS_CHAT, CAN_MANAGE_SUPPORT_CHAT, HAS_EXPLICIT_GRANT, REQUIRES_AUTHENTICATED_ACTOR}; }
}
