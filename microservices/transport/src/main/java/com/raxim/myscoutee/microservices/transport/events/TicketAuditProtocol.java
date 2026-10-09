package com.raxim.myscoutee.microservices.transport.events;

import com.raxim.myscoutee.domain.events.api.TicketAudit;

public final class TicketAuditProtocol {
    public static final String REPLAY = "/_internal/v1/events/ticket-audit/replay";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
    private TicketAuditProtocol() {}
    public static String[] paths() { return new String[]{REPLAY}; }
    public record Error(String code) {}
    public record Scope(Boolean active, String groupId) {
        public static Scope current() { return new Scope(com.raxim.myscoutee.domain.platform.api.JobGroupContext.isActive(), com.raxim.myscoutee.domain.platform.api.JobGroupContext.groupId()); }
    }
    private static boolean text(String value, int limit) { return value == null || value.length() <= limit; }
    private static boolean scope(Scope value) { return value != null && value.active() != null && text(value.groupId(), 512) && (value.active() || value.groupId() == null); }
    private static boolean ids(java.util.Collection<String> values) { return values != null && values.size() <= 4096 && values.stream().allMatch(value -> text(value, 512)); }
    public record Receipt(Boolean completed) {}
    public record Replay(Scope scope, com.raxim.myscoutee.domain.events.dto.ParticipationTicketDto ticket, String eventSourceId, String actor, java.time.Instant at) {}
    public static boolean valid(Replay value) { return value != null && scope(value.scope()) && text(value.eventSourceId(), 512) && text(value.actor(), 512); }
}
