package com.raxim.myscoutee.microservices.transport.payments;

import static com.raxim.myscoutee.microservices.transport.common.ProtocolFields.text;
import static com.raxim.myscoutee.microservices.transport.common.ProtocolFields.ids;

import com.raxim.myscoutee.domain.payments.api.EventPaymentCancellations;

public final class EventPaymentCancellationsProtocol {
    public static final String ELIGIBLE = "/_internal/v1/payments/event-payment-cancellations/eligible";
    public static final String PENDING = "/_internal/v1/payments/event-payment-cancellations/pending";
    public static final String EVENT_PENDING = "/_internal/v1/payments/event-payment-cancellations/event-pending";
    public static final String QUEUE = "/_internal/v1/payments/event-payment-cancellations/queue";
    public static final String ACKNOWLEDGE = "/_internal/v1/payments/event-payment-cancellations/acknowledge";
    public static final String GRANT = "/_internal/v1/payments/event-payment-cancellations/grant";
    public static final String HAS_PENDING = "/_internal/v1/payments/event-payment-cancellations/has-pending";
    public static final String PARTICIPANTS = "/_internal/v1/payments/event-payment-cancellations/participants";
    public static final String ELIGIBLE_USERS = "/_internal/v1/payments/event-payment-cancellations/eligible-users";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
    private EventPaymentCancellationsProtocol() {}
    public static String[] paths() { return new String[]{ELIGIBLE, PENDING, EVENT_PENDING, QUEUE, ACKNOWLEDGE, GRANT, HAS_PENDING, PARTICIPANTS, ELIGIBLE_USERS}; }
    public record Error(String code) {}
    public record Scope(Boolean active, String groupId) {
        public static Scope current() { return new Scope(com.raxim.myscoutee.domain.platform.api.JobGroupContext.isActive(), com.raxim.myscoutee.domain.platform.api.JobGroupContext.groupId()); }
    }
    private static boolean scope(Scope value) { return value != null && value.active() != null && text(value.groupId(), 512) && (value.active() || value.groupId() == null); }
    public record Receipt(Boolean completed) {}
    public record Query(Scope scope, String sourceId, String userId) {}
    public record Queue(Scope scope, String sourceId, java.util.Collection<String> userIds, String actorUserId) {}
    public record Empty(Scope scope) {}
    public record Acknowledge(Scope scope, String paymentId) {}
    public record Grant(Scope scope, String sourceId, String stamp) {}
    public record Decision(Boolean value) {}
    public static boolean valid(Query q) { return q != null && scope(q.scope()) && text(q.sourceId(),512) && text(q.userId(),512); }
    public static boolean valid(Queue q) { return q != null && scope(q.scope()) && text(q.sourceId(),512) && text(q.actorUserId(),512) && ids(q.userIds()); }
    public static boolean valid(Empty q) { return q != null && scope(q.scope()); }
    public static boolean valid(Acknowledge q) { return q != null && scope(q.scope()) && text(q.paymentId(),512); }
    public static boolean valid(Grant q) { return q != null && scope(q.scope()) && text(q.sourceId(),512) && text(q.stamp(),128); }
}
