package com.raxim.myscoutee.microservices.transport.events;

public final class EventWatchDirectoryProtocol {
    public static final String PATH = "/_internal/v1/events/watch-directory";
    public static final int MAX_REQUEST_BYTES = 16384;
    private EventWatchDirectoryProtocol() {}
    public record Query(String userId) {}
    public record Error(String code) {}
    public static boolean valid(Query value) { return value != null && (value.userId() == null || value.userId().length() <= 512); }
}
