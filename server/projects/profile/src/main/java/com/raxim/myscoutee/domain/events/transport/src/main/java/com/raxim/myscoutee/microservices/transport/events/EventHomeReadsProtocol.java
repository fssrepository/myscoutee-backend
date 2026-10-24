package com.raxim.myscoutee.microservices.transport.events;

public final class EventHomeReadsProtocol {
    public static final String SOURCE="/_internal/v1/events/home-reads/source";
    public static final String HOME="/_internal/v1/events/home-reads/home";
    public static final int MAX_RESPONSE_BYTES=2*1024*1024;
    private EventHomeReadsProtocol() {}
    public record Error(String code) {}
    public static String[] paths() { return new String[]{SOURCE,HOME}; }
    static boolean validId(String id) { return id==null || id.length()<=512; }
}
