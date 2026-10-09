package com.raxim.myscoutee.microservices.transport.events;

import java.util.Collection;

public final class OrganizerEventReadsProtocol {
    public static final String CREATORS = "/_internal/v1/events/organizer-events/creators";
    public static final String SOURCES = "/_internal/v1/events/organizer-events/sources";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024;
    public static final int MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
    private OrganizerEventReadsProtocol() {}
    public static String[] paths() { return new String[] {CREATORS, SOURCES}; }
    public record Query(Collection<String> ids) {}
    public record Error(String code) {}
    public static boolean valid(Query query) {
        return query != null && query.ids() != null && query.ids().size() <= 4096
                && query.ids().stream().allMatch(id -> id == null || id.length() <= 512);
    }
}
