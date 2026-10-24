package com.raxim.myscoutee.microservices.transport.events;

import static com.raxim.myscoutee.microservices.transport.common.ProtocolFields.text;
import static com.raxim.myscoutee.microservices.transport.common.ProtocolFields.ids;

import com.raxim.myscoutee.domain.events.api.EventResourceDirectory;

public final class EventResourceDirectoryProtocol {
    public static final String RESOURCES = "/_internal/v1/events/event-resource-directory/resources";
    public static final String STAGES = "/_internal/v1/events/event-resource-directory/stages";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
    private EventResourceDirectoryProtocol() {}
    public static String[] paths() { return new String[]{RESOURCES, STAGES}; }
    public record Error(String code) {}
    public record Scope(Boolean active, String groupId) {
        public static Scope current() { return new Scope(com.raxim.myscoutee.domain.platform.api.JobGroupContext.isActive(), com.raxim.myscoutee.domain.platform.api.JobGroupContext.groupId()); }
    }
    private static boolean scope(Scope value) { return value != null && value.active() != null && text(value.groupId(), 512) && (value.active() || value.groupId() == null); }
    public record Resources(Scope scope, java.util.Collection<String> owners, java.util.Collection<String> assetOwners, String status) {}
    public record Stages(Scope scope, java.util.Collection<String> owners, String status) {}
    public static boolean valid(Resources value) { return value != null && scope(value.scope()) && ids(value.owners()) && ids(value.assetOwners()) && text(value.status(), 64); }
    public static boolean valid(Stages value) { return value != null && scope(value.scope()) && ids(value.owners()) && text(value.status(), 64); }
}
