package com.raxim.myscoutee.domain.accounts.api;

import java.util.Set;

public interface Friendships {
    void projectMeetings(java.util.List<Meeting> meetings);
    record Meeting(String left, String right, long projectedAtMs, String eventId, String eventName) {}

    boolean areFriends(String first, String second);
    boolean pairExists(String first, String second);
    Set<String> friendIds(String viewer);
}
