package com.raxim.myscoutee.microservices.transport.payments;

import static com.raxim.myscoutee.microservices.transport.common.ProtocolFields.text;
import static com.raxim.myscoutee.microservices.transport.common.ProtocolFields.ids;

import com.raxim.myscoutee.domain.payments.api.PaymentRevenue;

public final class PaymentRevenueProtocol {
    public static final String CANDIDATES = "/_internal/v1/payments/payment-revenue/candidates";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
    private PaymentRevenueProtocol() {}
    public static String[] paths() { return new String[]{CANDIDATES}; }
    public record Error(String code) {}
    public record Scope(Boolean active, String groupId) {
        public static Scope current() { return new Scope(com.raxim.myscoutee.domain.platform.api.JobGroupContext.isActive(), com.raxim.myscoutee.domain.platform.api.JobGroupContext.groupId()); }
    }
    private static boolean scope(Scope value) { return value != null && value.active() != null && text(value.groupId(), 512) && (value.active() || value.groupId() == null); }
    public record Query(Scope scope) {}
    public static boolean valid(Query q) { return q != null && scope(q.scope()); }
}
