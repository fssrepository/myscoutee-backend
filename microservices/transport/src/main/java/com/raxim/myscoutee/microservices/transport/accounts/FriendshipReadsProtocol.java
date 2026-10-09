package com.raxim.myscoutee.microservices.transport.accounts;

public final class FriendshipReadsProtocol {
    public static final String PAIR = "/_internal/v1/accounts/friendships/pair", ADJACENCY = "/_internal/v1/accounts/friendships/adjacency";
    public static final int MAX_REQUEST_BYTES = 16384, MAX_RESPONSE_BYTES = 2 * 1024 * 1024;
    private FriendshipReadsProtocol() {}
    public static String[] paths() { return new String[]{PAIR, ADJACENCY}; }
    public record PairQuery(String first, String second) {}
    public record ViewerQuery(String viewer) {}
    public record Decision(Boolean friends) {}
    public record Error(String code) {}
    private static boolean id(String value) { return value == null || value.length() <= 512; }
    public static boolean valid(PairQuery q) { return q != null && id(q.first()) && id(q.second()); }
    public static boolean valid(ViewerQuery q) { return q != null && id(q.viewer()); }
}
