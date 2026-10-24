package com.raxim.myscoutee.microservices.transport.events;

import static com.raxim.myscoutee.microservices.transport.common.ProtocolFields.text;
import static com.raxim.myscoutee.microservices.transport.common.ProtocolFields.ids;

import com.raxim.myscoutee.domain.events.api.CheckoutMemberships;

public final class CheckoutMembershipsProtocol {
    public static final String CANCELLATIONS = "/_internal/v1/events/checkout-memberships/cancellations";
    public static final String EXPIRE = "/_internal/v1/events/checkout-memberships/expire";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
    private CheckoutMembershipsProtocol() {}
    public static String[] paths() { return new String[]{EXPIRE, CANCELLATIONS}; }
    public record Error(String code) {}
    public record Scope(Boolean active, String groupId) {
        public static Scope current() { return new Scope(com.raxim.myscoutee.domain.platform.api.JobGroupContext.isActive(), com.raxim.myscoutee.domain.platform.api.JobGroupContext.groupId()); }
    }
    private static boolean scope(Scope value) { return value != null && value.active() != null && text(value.groupId(), 512) && (value.active() || value.groupId() == null); }
    public record CancellationWakeup(Scope scope) {}
    public static boolean valid(CancellationWakeup value) { return value != null && scope(value.scope()) && value.scope().active(); }
    public record Receipt(Boolean completed) {}
    public record Expire(Scope scope, String userId, String eventId, String nowIso) {}
    public static boolean valid(Expire q) { return q != null && scope(q.scope()) && text(q.userId(), 512) && text(q.eventId(), 512) && text(q.nowIso(), 128); }
}
