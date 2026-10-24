package com.raxim.myscoutee.microservices.transport.accounts;

public final class LocationEligibilityProtocol {
    public static final String PATH = "/_internal/v1/accounts/location-eligibility";
    public static final int MAX_REQUEST_BYTES = 16384, MAX_RESPONSE_BYTES = 16384;
    private LocationEligibilityProtocol() {}
    public record Query(Double latitude, Double longitude) {}
    public record Error(String code) {}
    public static boolean valid(Query query) {
        return query != null && finite(query.latitude()) && finite(query.longitude());
    }
    private static boolean finite(Double value) { return value == null || Double.isFinite(value); }
}
