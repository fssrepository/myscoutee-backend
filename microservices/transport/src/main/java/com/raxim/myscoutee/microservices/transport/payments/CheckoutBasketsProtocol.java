package com.raxim.myscoutee.microservices.transport.payments;

import com.raxim.myscoutee.domain.payments.api.CheckoutBaskets;

public final class CheckoutBasketsProtocol {
    public static final String BASKET = "/_internal/v1/payments/checkout-baskets/basket";
    public static final String CARDS = "/_internal/v1/payments/checkout-baskets/cards";
    public static final String SLOTS = "/_internal/v1/payments/checkout-baskets/slots";
    public static final String OPTIONAL = "/_internal/v1/payments/checkout-baskets/optional";
    public static final String SAVE = "/_internal/v1/payments/checkout-baskets/save";
    public static final String UPDATE = "/_internal/v1/payments/checkout-baskets/update";
    public static final String RETIRE = "/_internal/v1/payments/checkout-baskets/retire";
    public static final String FINALIZE = "/_internal/v1/payments/checkout-baskets/finalize";
    public static final String EXPIRED = "/_internal/v1/payments/checkout-baskets/expired";
    public static final String PURGE = "/_internal/v1/payments/checkout-baskets/purge";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
    private CheckoutBasketsProtocol() {}
    public static String[] paths() { return new String[]{BASKET, CARDS, SLOTS, OPTIONAL, SAVE, UPDATE, RETIRE, FINALIZE, EXPIRED, PURGE}; }
    public record Error(String code) {}
    public record Scope(Boolean active, String groupId) {
        public static Scope current() { return new Scope(com.raxim.myscoutee.domain.platform.api.JobGroupContext.isActive(), com.raxim.myscoutee.domain.platform.api.JobGroupContext.groupId()); }
    }
    private static boolean text(String value, int limit) { return value == null || value.length() <= limit; }
    private static boolean scope(Scope value) { return value != null && value.active() != null && text(value.groupId(), 512) && (value.active() || value.groupId() == null); }
    private static boolean ids(java.util.Collection<String> values) { return values != null && values.size() <= 4096 && values.stream().allMatch(value -> text(value, 512)); }
    public record Receipt(Boolean completed) {}
    public record UserEvent(Scope scope, String userId, String sourceId) {}
    public record UserEvents(Scope scope, String userId, java.util.Collection<String> sourceIds) {}
    public record Source(Scope scope, String sourceId) {}
    public record Save(Scope scope, com.raxim.myscoutee.domain.events.dto.EventsDtos.EventCheckoutRequestDto request) {}
    public record Update(Scope scope, com.raxim.myscoutee.domain.events.dto.EventsDtos.EventCheckoutStateChangeRequestDto request) {}
    public record Retire(Scope scope, String sourceId, java.util.Collection<String> participantIds) {}
    public record Expired(Scope scope, String userId, String sourceId, String requestAtIso) {}
    public record Purge(Scope scope, java.time.Instant now) {}
    public record Result(Boolean resolved, com.raxim.myscoutee.domain.events.dto.EventsDtos.EventCheckoutBasketDto value) {}
    public record Decision(Boolean value) {}
    public record Count(Integer value) {}
    public static boolean valid(UserEvent q) { return q != null && scope(q.scope()) && text(q.userId(),512) && text(q.sourceId(),512); }
    public static boolean valid(UserEvents q) { return q != null && scope(q.scope()) && text(q.userId(),512) && ids(q.sourceIds()); }
    public static boolean valid(Source q) { return q != null && scope(q.scope()) && text(q.sourceId(),512); }
    public static boolean valid(Save q) { return q != null && scope(q.scope()); }
    public static boolean valid(Update q) { return q != null && scope(q.scope()); }
    public static boolean valid(Retire q) { return q != null && scope(q.scope()) && text(q.sourceId(),512) && ids(q.participantIds()); }
    public static boolean valid(Expired q) { return q != null && scope(q.scope()) && text(q.userId(),512) && text(q.sourceId(),512) && text(q.requestAtIso(),128); }
    public static boolean valid(Purge q) { return q != null && scope(q.scope()) && q.now() != null; }
}
