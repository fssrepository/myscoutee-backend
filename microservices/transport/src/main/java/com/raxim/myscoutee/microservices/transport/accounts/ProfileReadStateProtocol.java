package com.raxim.myscoutee.microservices.transport.accounts;

import java.util.Collection;

public final class ProfileReadStateProtocol {
    public static final String COUNTERS = "/_internal/v1/accounts/profile-read-state/counters";
    public static final String EVICT = "/_internal/v1/accounts/profile-read-state/evict";
    public static final String AUDIENCE = "accounts:profile-read-state";
    public static final int MAX_REQUEST_BYTES = 2097152;
    private ProfileReadStateProtocol() {}
    public static String[] paths() { return new String[]{COUNTERS, EVICT}; }
    public record CounterQuery(String userId) {}
    public record Eviction(Collection<String> userIds) {}
    public record Receipt(Boolean accepted) {}
    public record Error(String code) {}
    public static boolean valid(CounterQuery query) { return query != null && id(query.userId()); }
    public static boolean valid(Eviction query) {
        return query != null && (query.userIds() == null || (query.userIds().size() <= 512 && query.userIds().stream().allMatch(ProfileReadStateProtocol::id)));
    }
    private static boolean id(String value) { return value == null || value.length() <= 512; }
}
