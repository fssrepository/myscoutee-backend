package com.raxim.myscoutee.microservices.transport.accounts;

import static com.raxim.myscoutee.microservices.transport.common.ProtocolFields.text;
import static com.raxim.myscoutee.microservices.transport.common.ProtocolFields.ids;

import com.raxim.myscoutee.domain.accounts.api.PaymentTotals;

public final class PaymentTotalsProtocol {
    public static final String INCREMENT = "/_internal/v1/accounts/payment-totals/increment";
    public static final String REVERSE = "/_internal/v1/accounts/payment-totals/reverse";
    public static final String INCREMENT_REFUNDS = "/_internal/v1/accounts/payment-totals/increment-refunds";
    public static final String DECREMENT_REFUNDS = "/_internal/v1/accounts/payment-totals/decrement-refunds";
    public static final String CURRENCY = "/_internal/v1/accounts/payment-totals/currency";
    public static final String SELECT_CURRENCY = "/_internal/v1/accounts/payment-totals/select-currency";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
    private PaymentTotalsProtocol() {}
    public static String[] paths() { return new String[]{INCREMENT, REVERSE, INCREMENT_REFUNDS, DECREMENT_REFUNDS, CURRENCY, SELECT_CURRENCY}; }
    public record Error(String code) {}
    public record Scope(Boolean active, String groupId) {
        public static Scope current() { return new Scope(com.raxim.myscoutee.domain.platform.api.JobGroupContext.isActive(), com.raxim.myscoutee.domain.platform.api.JobGroupContext.groupId()); }
    }
    private static boolean scope(Scope value) { return value != null && value.active() != null && text(value.groupId(), 512) && (value.active() || value.groupId() == null); }
    public record Delta(Scope scope, String userId, PaymentTotals.Direction direction, String currency, Double amount) {}
    public record Reversal(Scope scope, String userId, String receiptId, PaymentTotals.Direction direction, String currency, Double amount) {}
    public record User(Scope scope, String userId) {}
    public record Currency(Scope scope, String userId, String currency) {}
    public record CurrencyResult(Boolean resolved, String value) {}
    public record Receipt(Boolean completed) {}
    private static boolean id(String value) { return value != null && !value.isBlank() && text(value, 512); }
    private static boolean currency(String value) { return value != null && value.matches("[A-Z]{3}"); }
    public static boolean valid(Delta value) { return value != null && scope(value.scope()) && id(value.userId()) && value.direction() != null && currency(value.currency()) && value.amount() != null && Double.isFinite(value.amount()); }
    public static boolean valid(Reversal value) { return value != null && scope(value.scope()) && id(value.userId()) && id(value.receiptId()) && value.direction() != null && currency(value.currency()) && value.amount() != null && Double.isFinite(value.amount()) && value.amount() >= 0; }
    public static boolean valid(User value) { return value != null && scope(value.scope()) && id(value.userId()); }
    public static boolean valid(Currency value) { return value != null && scope(value.scope()) && id(value.userId()) && currency(value.currency()); }
}
