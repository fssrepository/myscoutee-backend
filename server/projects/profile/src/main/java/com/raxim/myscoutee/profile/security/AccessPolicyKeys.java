package com.raxim.myscoutee.profile.security;

public final class AccessPolicyKeys {
    private AccessPolicyKeys() {
    }

    // 1. User may create or sync a new event.
    public static final String EVENT_CREATE = "event.create";

    // 2. Owner/admin/manager may edit event details.
    public static final String EVENT_EDIT = "event.edit";

    // 3. Owner/admin may publish event.
    public static final String EVENT_PUBLISH = "event.publish";

    // 4. Owner/admin may unpublish event.
    public static final String EVENT_UNPUBLISH = "event.unpublish";

    // 5. Owner/admin may trash or delete event.
    public static final String EVENT_DELETE = "event.delete";

    // 6. Owner/admin may restore event.
    public static final String EVENT_RESTORE = "event.restore";

    // 7. Admin/eligible manager may take over event control.
    public static final String EVENT_TAKEOVER = "event.takeover";

    // 8. User may request to join event.
    public static final String EVENT_JOIN = "event.join";

    // 9. User/member/manager may perform event stage action.
    public static final String EVENT_STAGE_ACTION = "event.stage.action";

    // 10. User may view event member list or summaries.
    public static final String EVENT_MEMBER_VIEW = "event.member.view";

    // 11. Owner/admin may replace event member list.
    public static final String EVENT_MEMBER_MANAGE = "event.member.manage";

    // 12. Owner/admin may accept pending member.
    public static final String EVENT_MEMBER_ACCEPT = "event.member.accept";

    // 13. Owner/admin may remove member.
    public static final String EVENT_MEMBER_REMOVE = "event.member.remove";

    // 14. Owner/admin may disqualify member.
    public static final String EVENT_MEMBER_DISQUALIFY = "event.member.disqualify";

    // 15. Owner/admin may reinstate member.
    public static final String EVENT_MEMBER_REINSTATE = "event.member.reinstate";

    // 16. Owner/admin/manager or any accepted participant may invite users.
    public static final String EVENT_MEMBER_INVITE = "event.member.invite";

    // 17. Actor may submit an event resource assignment for their own asset-owner row.
    public static final String RESOURCE_ASSIGN_SUBMIT = "resource.assign.submit";

    // 18. Subject user may receive/keep resources assigned to an event.
    public static final String RESOURCE_ASSIGN_SUBJECT = "resource.assign.subject";

    // 19. Owner/admin/manager may assign resources for another participant.
    public static final String RESOURCE_ASSIGN_MANAGE = "resource.assign.manage";

    // 20. System/admin may remove resources when event members are removed.
    public static final String RESOURCE_ASSIGN_CLEANUP = "resource.assign.cleanup";

    // 21. User may create/upsert own asset.
    public static final String ASSET_CREATE = "asset.create";

    // 22. User may replace/sync own asset list.
    public static final String ASSET_REPLACE = "asset.replace";

    // 23. Owner/manager may edit asset.
    public static final String ASSET_EDIT = "asset.edit";

    // 24. Owner may trash asset.
    public static final String ASSET_DELETE = "asset.delete";

    // 25. Owner may restore asset.
    public static final String ASSET_RESTORE = "asset.restore";

    // 26. Accepted manager may take over under-review asset.
    public static final String ASSET_TAKEOVER = "asset.takeover";

    // 27. Target user may receive asset manager role for an event-linked asset request.
    public static final String ASSET_MANAGER_PROMOTE_TARGET = "asset.manager.promote.target";

    // 28. Actor may promote another user to asset manager.
    public static final String ASSET_MANAGER_PROMOTE_ACTOR = "asset.manager.promote.actor";

    // 29. Event participant may request/borrow asset for event.
    public static final String ASSET_BORROW_REQUEST = "asset.borrow.request";

    // 30. Owner/manager may approve borrow request.
    public static final String ASSET_BORROW_APPROVE = "asset.borrow.approve";

    // 31. Owner/manager may reject borrow request.
    public static final String ASSET_BORROW_REJECT = "asset.borrow.reject";

    // 32. Requester or owner/manager may cancel request.
    public static final String ASSET_BORROW_CANCEL = "asset.borrow.cancel";

    // 34. Chat participant may post message.
    public static final String CHAT_MESSAGE_CREATE = "chat.message.create";

    // 35. Author/admin/moderator may edit message.
    public static final String CHAT_MESSAGE_EDIT = "chat.message.edit";

    // 36. Author/admin/moderator may delete message.
    public static final String CHAT_MESSAGE_DELETE = "chat.message.delete";

    // 37. Admin/moderator may pin message.
    public static final String CHAT_MESSAGE_PIN = "chat.message.pin";

    // 38. Participant may add/remove own reaction.
    public static final String CHAT_REACTION_MANAGE = "chat.reaction.manage";

    // 39. Participant may attach media.
    public static final String CHAT_ATTACHMENT_ADD = "chat.attachment.add";

    // 40. Admin/support may create or update support case.
    public static final String CHAT_SUPPORT_MANAGE = "chat.support.manage";

    // 41. Accepted participant may submit feedback.
    public static final String EVENT_FEEDBACK_SUBMIT = "event.feedback.submit";

    // 42. Owner/admin may add feedback note.
    public static final String EVENT_FEEDBACK_NOTE = "event.feedback.note";

    // 43. Owner/admin may remove feedback.
    public static final String EVENT_FEEDBACK_REMOVE = "event.feedback.remove";

    // 44. Owner/admin may restore feedback.
    public static final String EVENT_FEEDBACK_RESTORE = "event.feedback.restore";

    // 45. Participant/system may submit leaderboard entry.
    public static final String EVENT_LEADERBOARD_ENTRY_SUBMIT = "event.leaderboard.entry.submit";

    // 46. User may edit own profile.
    public static final String USER_PROFILE_EDIT = "user.profile.edit";

    // 47. User may delete own account.
    public static final String USER_PROFILE_DELETE = "user.profile.delete";

    // 48. User may upload own media.
    public static final String USER_MEDIA_UPLOAD = "user.media.upload";

    // 49. User may import media for own object.
    public static final String USER_MEDIA_IMPORT = "user.media.import";

    // 50. User may submit own privacy consent.
    public static final String PRIVACY_CONSENT_SUBMIT = "privacy.consent.submit";
}
