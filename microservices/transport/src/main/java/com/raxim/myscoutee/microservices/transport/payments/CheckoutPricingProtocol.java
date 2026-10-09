package com.raxim.myscoutee.microservices.transport.payments;

import com.raxim.myscoutee.domain.payments.api.CheckoutPricing;

public final class CheckoutPricingProtocol {
    public static final String VIP = "/_internal/v1/payments/checkout-pricing/vip";
    public static final String REPRICE = "/_internal/v1/payments/checkout-pricing/reprice";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
    private CheckoutPricingProtocol() {}
    public static String[] paths() { return new String[]{VIP, REPRICE}; }
    public record Error(String code) {}
    public record Scope(Boolean active, String groupId) {
        public static Scope current() { return new Scope(com.raxim.myscoutee.domain.platform.api.JobGroupContext.isActive(), com.raxim.myscoutee.domain.platform.api.JobGroupContext.groupId()); }
    }
    private static boolean text(String value, int limit) { return value == null || value.length() <= limit; }
    private static boolean scope(Scope value) { return value != null && value.active() != null && text(value.groupId(), 512) && (value.active() || value.groupId() == null); }
    private static boolean ids(java.util.Collection<String> values) { return values != null && values.size() <= 4096 && values.stream().allMatch(value -> text(value, 512)); }
    public record Vip(Scope scope, String sourceId, String userId) {}
    public record Reprice(Scope scope, com.raxim.myscoutee.domain.events.dto.EventsDtos.EventCheckoutRequestDto request) {}
    public record Offer(Boolean resolved, com.raxim.myscoutee.common.dto.SharedDtos.PricingConfigDto value) {}
    public record Result(Boolean resolved, com.raxim.myscoutee.domain.events.dto.EventsDtos.EventCheckoutRequestDto value) {}
    public static boolean valid(Vip q) { return q != null && scope(q.scope()) && text(q.sourceId(),512) && text(q.userId(),512); }
    public static boolean valid(Reprice q) { return q != null && scope(q.scope()); }
}
