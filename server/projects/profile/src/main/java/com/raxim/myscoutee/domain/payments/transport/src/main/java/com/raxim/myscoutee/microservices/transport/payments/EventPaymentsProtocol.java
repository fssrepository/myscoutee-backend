package com.raxim.myscoutee.microservices.transport.payments;

import static com.raxim.myscoutee.microservices.transport.common.ProtocolFields.text;
import static com.raxim.myscoutee.microservices.transport.common.ProtocolFields.ids;

import com.raxim.myscoutee.domain.payments.api.EventPayments;

public final class EventPaymentsProtocol {
    public static final String PAY = "/_internal/v1/payments/event-payments/pay";
    public static final String JOIN = "/_internal/v1/payments/event-payments/join";
    public static final String COMPLETE = "/_internal/v1/payments/event-payments/complete";
    public static final String CANCEL = "/_internal/v1/payments/event-payments/cancel";
    public static final String PENDING = "/_internal/v1/payments/event-payments/pending";
    public static final String FINALIZE = "/_internal/v1/payments/event-payments/finalize";
    public static final String JOINED = "/_internal/v1/payments/event-payments/joined";
    public static final String PENDING_SOURCES = "/_internal/v1/payments/event-payments/pending-sources";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
    public static final String AUDIENCE = "payments:event-payments";
    private EventPaymentsProtocol() {}
    public static String[] paths() { return new String[]{PAY, JOIN, COMPLETE, CANCEL, PENDING, FINALIZE, JOINED, PENDING_SOURCES}; }
    public record Error(String code) {}
    public record Scope(Boolean active, String groupId) {
        public static Scope current() { return new Scope(com.raxim.myscoutee.domain.platform.api.JobGroupContext.isActive(), com.raxim.myscoutee.domain.platform.api.JobGroupContext.groupId()); }
    }
    private static boolean scope(Scope value) { return value != null && value.active() != null && text(value.groupId(), 512) && (value.active() || value.groupId() == null); }
    public record Receipt(Boolean completed) {}
    public record Pay(Scope scope, com.raxim.myscoutee.domain.events.dto.EventsDtos.EventCheckoutRequestDto request, String provider, String startedSession) {}
    public record Join(Scope scope, String session, String userId, String sourceId, String slot, String start, String end, com.raxim.myscoutee.common.dto.SharedDtos.PricingCancellationPolicyDto policy) {}
    public record Complete(Scope scope, String paymentId, String reason) {}
    public record Cancel(Scope scope, String userId, String sourceId, String start, com.raxim.myscoutee.common.dto.SharedDtos.PricingCancellationPolicyDto policy) {}
    public record UserEvent(Scope scope, String userId, String sourceId) {}
    public record UserEvents(Scope scope, String userId, java.util.Collection<String> sourceIds) {}
    public record Result(Boolean resolved, com.raxim.myscoutee.domain.events.dto.EventsDtos.EventCheckoutSessionDto value) {}
    public record Decision(Boolean value) {}
    private static boolean strings(String... values) { return java.util.Arrays.stream(values).allMatch(v -> text(v, 8192)); }
    public static boolean valid(Pay q) { return q != null && scope(q.scope()) && q.request() != null && q.request().userId() != null && strings(q.provider(),q.startedSession()); }
    public static boolean valid(Join q) { return q != null && scope(q.scope()) && strings(q.session(),q.userId(),q.sourceId(),q.slot(),q.start(),q.end()); }
    public static boolean valid(Complete q) { return q != null && scope(q.scope()) && q.paymentId() != null && !q.paymentId().isBlank() && strings(q.paymentId(),q.reason()); }
    public static boolean valid(Cancel q) { return q != null && scope(q.scope()) && strings(q.userId(),q.sourceId(),q.start()); }
    public static boolean valid(UserEvent q) { return q != null && scope(q.scope()) && strings(q.userId(),q.sourceId()); }
    public static boolean valid(UserEvents q) { return q != null && scope(q.scope()) && strings(q.userId()) && ids(q.sourceIds()); }
}
