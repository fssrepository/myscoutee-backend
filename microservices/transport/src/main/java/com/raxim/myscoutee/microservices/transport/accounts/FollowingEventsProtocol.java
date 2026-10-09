package com.raxim.myscoutee.microservices.transport.accounts;

import java.util.Collection;

public final class FollowingEventsProtocol {
    public static final String ORGANIZERS = "/_internal/v1/accounts/following/organizers";
    public static final String REFRESH = "/_internal/v1/accounts/following/refresh-viewers";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 2 * 1024 * 1024;
    private FollowingEventsProtocol() {}
    public static String[] paths() { return new String[]{ORGANIZERS, REFRESH}; }
    public record ProfileQuery(String profileId) {}
    public record RefreshCommand(Collection<String> ids) {}
    public record Receipt(Boolean completed) {}
    public record Error(String code) {}
    private static boolean id(String value) { return value == null || value.length() <= 512; }
    public static boolean valid(ProfileQuery q) { return q != null && id(q.profileId()); }
    public static boolean valid(RefreshCommand q) { return q != null && q.ids() != null && q.ids().size() <= 4096 && q.ids().stream().allMatch(FollowingEventsProtocol::id); }
}
