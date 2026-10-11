package com.raxim.myscoutee.domain.accounts.api;
public interface ActivityCounters {
    int applyFeedbackReceipt(FeedbackCounterChanges.Change change);
    void refreshFeedCountersForUser(String userId);
    void refreshEventCountersForSourceIds(java.util.Collection<String> sourceIds);
    void refreshAssetCountersForUser(String userId);
    void refreshEventCountersForUsers(java.util.Collection<String> ids);
    default void refreshEventCountersForDocuments(java.util.Collection<? extends com.raxim.myscoutee.domain.events.api.EventOwnership.Event> events) {
        refreshEventCountersForSourceIds(events == null ? java.util.List.of() : events.stream()
                .map(event -> event == null || event.getSourceId() == null ? "" : event.getSourceId().trim())
                .filter(org.springframework.util.StringUtils::hasText).toList());
    }
    void applyActiveEventMembershipDeltas(java.util.Collection<String> added, java.util.Collection<String> removed);
    com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserEventCountersDto readStoredEventCounters(String userId);
    void expireFollowingCounters(java.time.Instant now);
    int syncFeedbackEligibilityForSourceIds(java.util.Collection<String> ids, java.time.Instant now);
    default void applyFeedbackStateTransition(com.raxim.myscoutee.domain.events.api.EventOwnership.Event event, String userId, boolean wasSubmitted, boolean wasRemoved, boolean isSubmitted, boolean isRemoved) {
        applyFeedbackTransition(com.raxim.myscoutee.domain.accounts.dto.FeedbackOwnersDto.from(event), userId, wasSubmitted, wasRemoved, isSubmitted, isRemoved);
    }
    void applyFeedbackTransition(com.raxim.myscoutee.domain.accounts.dto.FeedbackOwnersDto owners, String userId, boolean wasSubmitted, boolean wasRemoved, boolean isSubmitted, boolean isRemoved);

}
