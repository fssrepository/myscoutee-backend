package com.raxim.myscoutee.microservices.transport.events;

import com.raxim.myscoutee.domain.events.dto.EventVersionDto;

public final class EventDerivedUpdatesProtocol {
    public static final String AFFINITY = "/_internal/v1/events/projections/affinity";
    public static final String STATUS = "/_internal/v1/events/projections/status";
    public static final String FEEDBACK = "/_internal/v1/events/projections/feedback";
    public static final int MAX_REQUEST_BYTES = 16384, MAX_RESPONSE_BYTES = 16384;
    private EventDerivedUpdatesProtocol() {}
    public static String[] paths() { return new String[]{AFFINITY, STATUS, FEEDBACK}; }
    public record AffinityCommand(EventVersionDto version, Double affinity, Double boost) {}
    public record StatusCommand(EventVersionDto version, String status, String previousStatus) {}
    public record Result(Boolean matched) {}
    public record Error(String code) {}
    private static boolean text(String value) { return value == null || value.length() <= 512; }
    private static boolean version(EventVersionDto value) { return value == null || text(value.id()) && text(value.updatedDate()); }
    public static boolean valid(AffinityCommand value) {
        return value != null && version(value.version()) && value.affinity() != null && value.boost() != null
                && Double.isFinite(value.affinity()) && Double.isFinite(value.boost());
    }
    public static boolean valid(StatusCommand value) {
        return value != null && version(value.version()) && text(value.status()) && text(value.previousStatus());
    }
    public record FeedbackCommand(java.util.Collection<String> sourceIds, Boolean projected) {}
    public static boolean valid(FeedbackCommand q) {
        return q != null && q.projected() != null && q.sourceIds() != null && q.sourceIds().size() <= 1000
            && q.sourceIds().stream().allMatch(id -> id != null && text(id));
    }
}
