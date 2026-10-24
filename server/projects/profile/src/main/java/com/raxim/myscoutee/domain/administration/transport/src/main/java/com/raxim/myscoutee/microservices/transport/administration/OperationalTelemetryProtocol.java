package com.raxim.myscoutee.microservices.transport.administration;

import static com.raxim.myscoutee.microservices.transport.common.ProtocolFields.text;

import com.raxim.myscoutee.domain.platform.api.JobGroupContext;

public final class OperationalTelemetryProtocol {
    public static final String PATH = "/_internal/v1/administration/operational-telemetry";
    public static final String SIGNAL = PATH + "/projection-inputs";
    public static final int MAX_REQUEST_BYTES = 65536, MAX_RESPONSE_BYTES = 2 * 1024 * 1024;
    private OperationalTelemetryProtocol() {}
    public static String[] paths() { return new String[]{PATH, SIGNAL}; }
    public record Signal(com.raxim.myscoutee.domain.administration.api.OperationalTelemetry.ProjectionSignal signal) {}
    public static boolean valid(Signal value) {
        if (value == null || value.signal() == null) return false;
        var signal = value.signal();
        return signal.producer() != null && java.util.Set.of("affinity", "events", "notifications").contains(signal.producer())
                && signal.revisions() != null && !signal.revisions().isEmpty()
                && signal.revisions().entrySet().stream().allMatch(e -> e.getKey() != null && e.getValue() != null && e.getValue() > 0);
    }
    public record Scope(Boolean active, String groupId) {
        public static Scope current() { return new Scope(JobGroupContext.isActive(), JobGroupContext.groupId()); }
    }
    public record Error(String code) {}
    private static boolean scope(Scope value) { return value != null && value.active() != null && text(value.groupId(), 512) && (value.active() || value.groupId() == null); }
    public record Command(Scope scope, String eventKey, String domain, String entityId, String actorUserId, Long amount, java.util.Map<String, String> tags) {}
    public record Receipt(Boolean handled) {}
    public static boolean valid(Command value) {
        return value != null && scope(value.scope()) && text(value.eventKey(), 512) && text(value.domain(), 512)
                && text(value.entityId(), 512) && text(value.actorUserId(), 512) && value.amount() != null
                && (value.tags() == null || value.tags().size() <= 128 && value.tags().entrySet().stream()
                        .allMatch(entry -> text(entry.getKey(), 512) && text(entry.getValue(), 8192)));
    }
}
