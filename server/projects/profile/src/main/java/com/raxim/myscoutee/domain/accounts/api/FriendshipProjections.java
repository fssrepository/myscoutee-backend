package com.raxim.myscoutee.domain.accounts.api;

import java.util.List;

/** Affinity supplies established mutual meeting facts; accounts owns the pair projection. */
public interface FriendshipProjections {
    void projectMeetings(List<Meeting> meetings);
    record Meeting(String left, String right, @com.fasterxml.jackson.annotation.JsonProperty(required = true) long projectedAtMs, String eventId, String eventName) {}
}
