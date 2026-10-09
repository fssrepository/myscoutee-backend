package com.raxim.myscoutee.microservices.transport.events;

public final class EventMembershipFactsProtocol {
    public static final String PATH = "/_internal/v1/events/membership-facts";
    public static final int MAX_RESPONSE_BYTES = 2 * 1024 * 1024;
    private EventMembershipFactsProtocol() {}
    public record Error(String code) {}
}
