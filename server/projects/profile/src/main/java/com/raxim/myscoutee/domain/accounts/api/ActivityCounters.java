package com.raxim.myscoutee.domain.accounts.api;
public interface ActivityCounters {
    boolean hasSupportCaseCounters(WorkspaceProfile profile);
    void refreshSupportCaseCountersForAdmins();
    void refreshFeedCountersForUser(String userId);
    void refreshEventCountersForSourceIds(java.util.Collection<String> sourceIds);
    void refreshAssetCountersForUser(String userId);
    void refreshEventCountersForUsers(java.util.Collection<String> ids);
    void refreshEventCountersForDocuments(java.util.Collection<? extends com.raxim.myscoutee.domain.events.api.EventOwnership.Event> events);
    void applyActiveEventMembershipDeltas(java.util.Collection<String> added, java.util.Collection<String> removed);
    com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserEventCountersDto readStoredEventCounters(String userId);
    void expireFollowingCounters(java.time.Instant now);
    int syncFeedbackEligibilityForSourceIds(java.util.Collection<String> ids, java.time.Instant now);
    void applyFeedbackStateTransition(com.raxim.myscoutee.domain.events.api.EventOwnership.Event event, String userId, boolean wasSubmitted, boolean wasRemoved, boolean isSubmitted, boolean isRemoved);

}
