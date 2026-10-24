package com.raxim.myscoutee.microservices.transport.payments;

import static com.raxim.myscoutee.microservices.transport.common.ProtocolFields.text;
import static com.raxim.myscoutee.microservices.transport.common.ProtocolFields.ids;

import com.raxim.myscoutee.domain.payments.api.ServiceSlotPricing;

public final class ServiceSlotPricingProtocol {
    public static final String QUOTE = "/_internal/v1/payments/service-slot-pricing/quote";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
    private ServiceSlotPricingProtocol() {}
    public static String[] paths() { return new String[]{QUOTE}; }
    public record Error(String code) {}
    public record Scope(Boolean active, String groupId) {
        public static Scope current() { return new Scope(com.raxim.myscoutee.domain.platform.api.JobGroupContext.isActive(), com.raxim.myscoutee.domain.platform.api.JobGroupContext.groupId()); }
    }
    private static boolean scope(Scope value) { return value != null && value.active() != null && text(value.groupId(), 512) && (value.active() || value.groupId() == null); }
    public record Query(Scope scope, com.raxim.myscoutee.common.dto.SharedDtos.PricingConfigDto pricing, String templateId, String startAtIso, Integer occupied) {}
    public record Result(Boolean resolved, com.raxim.myscoutee.domain.payments.dto.ServiceSlotQuoteDto value) {}
    public static boolean valid(Query q) { return q != null && scope(q.scope()) && text(q.templateId(),512) && text(q.startAtIso(),128) && q.occupied() != null; }
}
