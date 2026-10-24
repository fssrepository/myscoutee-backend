package com.raxim.myscoutee.microservices.transport.platform;

import static com.raxim.myscoutee.microservices.transport.common.ProtocolFields.text;

import com.raxim.myscoutee.domain.platform.api.JobGroupContext;

public final class ModelStatusChangesProtocol {
    public static final String PATH = "/_internal/v1/platform/model-status-changes";
    public static final int MAX_REQUEST_BYTES = 65536, MAX_RESPONSE_BYTES = 2 * 1024 * 1024;
    private ModelStatusChangesProtocol() {}
    public static String[] paths() { return new String[]{PATH}; }
    public record Scope(Boolean active, String groupId) {
        public static Scope current() { return new Scope(JobGroupContext.isActive(), JobGroupContext.groupId()); }
    }
    public record Error(String code) {}
    private static boolean scope(Scope value) { return value != null && value.active() != null && text(value.groupId(), 512) && (value.active() || value.groupId() == null); }
    public record Command(Scope scope, String userId) {}
    public static boolean valid(Command value) { return value != null && scope(value.scope()) && text(value.userId(), 512); }
}
