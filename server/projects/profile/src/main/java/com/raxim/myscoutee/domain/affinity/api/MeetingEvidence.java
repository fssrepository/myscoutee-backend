package com.raxim.myscoutee.domain.affinity.api;
public interface MeetingEvidence {
    void record(java.util.List<Meeting> meetings);
    record Meeting(String left, String right, String eventId, String eventName, java.time.Instant occurredAt) {}
}
