package com.raxim.myscoutee.microservices.transport.events;

import com.raxim.myscoutee.domain.events.api.MingleEncounters;

public final class MingleEncountersProtocol {
    public static final String FIND = "/_internal/v1/events/mingle-encounters/find";
    public static final String ROUNDS = "/_internal/v1/events/mingle-encounters/rounds";
    public static final String COMPLETED = "/_internal/v1/events/mingle-encounters/completed";
    public static final String PENDING = "/_internal/v1/events/mingle-encounters/pending";
    public static final String ACK = "/_internal/v1/events/mingle-encounters/ack";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
    private MingleEncountersProtocol() {}
    public static String[] paths() { return new String[]{FIND, ROUNDS, COMPLETED, PENDING, ACK}; }
    public record Error(String code) {}
    public record Scope(Boolean active, String groupId) {
        public static Scope current() { return new Scope(com.raxim.myscoutee.domain.platform.api.JobGroupContext.isActive(), com.raxim.myscoutee.domain.platform.api.JobGroupContext.groupId()); }
    }
    private static boolean text(String value, int limit) { return value == null || value.length() <= limit; }
    private static boolean scope(Scope value) { return value != null && value.active() != null && text(value.groupId(), 512) && (value.active() || value.groupId() == null); }
    private static boolean ids(java.util.Collection<String> values) { return values != null && values.size() <= 4096 && values.stream().allMatch(value -> text(value, 512)); }
    public record Receipt(Boolean completed) {}
    public record Query(Scope scope, String eventId) {}
    public record Batch(Scope scope, java.util.Collection<String> eventIds) {}
    public record Ack(Scope scope, com.raxim.myscoutee.domain.events.dto.MingleEncounterDtos.SessionDto session) {}
    public record Result(Boolean resolved, com.raxim.myscoutee.domain.events.dto.MingleEncounterDtos.SessionDto value) {}
    public record Decision(Boolean value) {}
    public static boolean valid(Query q) { return q!=null && scope(q.scope()) && text(q.eventId(),512); }
    public static boolean valid(Batch q) { return q!=null && scope(q.scope()) && ids(q.eventIds()); }
    public static boolean valid(Ack q) { return q!=null && scope(q.scope()) && q.session()!=null && q.session().id()!=null && q.session().revision()!=null && text(q.session().id(),512) && text(q.session().eventId(),512); }
}
