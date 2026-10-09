package com.raxim.myscoutee.microservices.transport.payments;

import com.raxim.myscoutee.domain.payments.dto.AffiliateRegistration;

public final class AffiliateRegistrationsProtocol {
    public static final String RESOLVE = "/_internal/v1/payments/affiliate-registrations/resolve";
    public static final String RECORD = "/_internal/v1/payments/affiliate-registrations/record";
    public static final int MAX_REQUEST_BYTES = 8192;
    private AffiliateRegistrationsProtocol() {}
    public record Query(String code, String userId) {}
    public record Resolution(AffiliateRegistration registration) {}
    public record Command(AffiliateRegistration registration) {}
    public record Receipt(Boolean completed) {}
    public record Error(String code) {}
    public static String[] paths() { return new String[]{RESOLVE, RECORD}; }
    public static boolean bounded(String value) { return value == null || value.length() <= 512; }
    public static boolean valid(AffiliateRegistration value) {
        return value == null || value.userId() != null && !value.userId().isBlank()
                && bounded(value.userId()) && bounded(value.referrerUserId())
                && bounded(value.code()) && bounded(value.registeredAtIso());
    }
}
