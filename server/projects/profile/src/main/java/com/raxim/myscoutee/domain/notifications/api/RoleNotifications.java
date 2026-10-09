package com.raxim.myscoutee.domain.notifications.api;

/** Role events accepted by the notification domain through its existing durable outbox. */
public interface RoleNotifications {
    void releaseAvailable(String version);
    void memberJoined(MemberRegistration member);
    void moderationSubmitted(String kind, String submissionId);

    record MemberRegistration(String userId, String email, boolean operator, boolean workspaceProfile) {}
}
