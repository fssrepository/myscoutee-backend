package com.raxim.myscoutee.microservices.transport.payments;

import com.raxim.myscoutee.domain.payments.api.PaymentRefunds;

public final class PaymentRefundsProtocol {
    public static final String CHANGED_TERMS = "/_internal/v1/payments/payment-refunds/changed-terms";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
    public static final String AUDIENCE = "payments:payment-refunds";
    private PaymentRefundsProtocol() {}
    public static String[] paths() { return new String[]{CHANGED_TERMS}; }
    public record Error(String code) {}
    public record Scope(Boolean active, String groupId) {
        public static Scope current() { return new Scope(com.raxim.myscoutee.domain.platform.api.JobGroupContext.isActive(), com.raxim.myscoutee.domain.platform.api.JobGroupContext.groupId()); }
    }
    private static boolean text(String value, int limit) { return value == null || value.length() <= limit; }
    private static boolean scope(Scope value) { return value != null && value.active() != null && text(value.groupId(), 512) && (value.active() || value.groupId() == null); }
    private static boolean ids(java.util.Collection<String> values) { return values != null && values.size() <= 4096 && values.stream().allMatch(value -> text(value, 512)); }
    public record Request(Scope scope, String paymentId, String actorUserId) {}
    public record Result(Boolean resolved, com.raxim.myscoutee.domain.payments.dto.PaymentDtos.PaymentHistoryMutationDto value) {}
    public static boolean valid(Request q) { return q != null && scope(q.scope()) && q.paymentId() != null && q.actorUserId() != null && text(q.paymentId(),512) && text(q.actorUserId(),512); }
}
