package com.raxim.myscoutee.microservices.transport.affinity;

import java.util.List;
import com.raxim.myscoutee.domain.affinity.api.MeetingEvidence.Meeting;

public final class MeetingEvidenceProtocol {
    public static final String PATH = "/_internal/v1/affinity/meeting-evidence";
    public static final int MAX_ITEMS = 512, MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 16384;
    private MeetingEvidenceProtocol() {}
    public static String[] paths() { return new String[]{PATH}; }
    public record Command(List<Meeting> meetings) {}
    public static boolean valid(Command command) {
        return command != null && command.meetings() != null && command.meetings().size() <= MAX_ITEMS
                && command.meetings().stream().allMatch(MeetingEvidenceProtocol::meeting);
    }
    private static boolean meeting(Meeting value) {
        return value != null && value.left() != null && !value.left().isBlank() && value.left().length() <= 512
                && value.right() != null && !value.right().isBlank() && value.right().length() <= 512
                && value.left().compareTo(value.right()) < 0
                && value.eventId() != null && value.eventId().length() <= 512 && value.occurredAt() != null
                && (value.eventName() == null || value.eventName().length() <= 4096);
    }
}
