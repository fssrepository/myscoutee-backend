package com.raxim.myscoutee.microservices.transport.events;

public final class EventMediaVisibilityProtocol {
    public static final String PATH = "/_internal/v1/events/media-visibility";
    public static final String MEMBERSHIP_PATH = "/_internal/v1/events/media-membership";
    public static final int MAX_RESPONSE_BYTES = 2 * 1024 * 1024;
    private EventMediaVisibilityProtocol() {}
    public record Error(String code) {}
}
