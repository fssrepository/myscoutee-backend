package com.raxim.myscoutee.microservices.transport.events;

public final class EventJobScopesProtocol {
    public static final String PATH = "/_internal/v1/events/job-scope";
    public static final int MAX_RESPONSE_BYTES = 8192;
    private EventJobScopesProtocol() {}
    public record Error(String code) {}
    public static String[] paths() { return new String[]{PATH}; }
}
