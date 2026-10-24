package com.raxim.myscoutee.microservices.transport.events;

public final class EventMeasurementProtocol {
    private EventMeasurementProtocol() {}
    public static final String JOINS = "/_internal/v1/events/event-measurement/joins";
    public static final String HOSTS = "/_internal/v1/events/event-measurement/hosts";
    public static final String ATTENDANCE = "/_internal/v1/events/event-measurement/attendance";
    public static String[] paths() { return new String[]{JOINS, HOSTS, ATTENDANCE}; }
}
