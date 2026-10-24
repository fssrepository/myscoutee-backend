package com.raxim.myscoutee.microservices.transport.accounts;

import static com.raxim.myscoutee.microservices.transport.common.ProtocolFields.text;
import static com.raxim.myscoutee.microservices.transport.common.ProtocolFields.ids;

import com.raxim.myscoutee.domain.accounts.api.DiscoveryProfiles;

public final class DiscoveryProfilesProtocol {
    public static final String SINGLE = "/_internal/v1/accounts/discovery-profiles/single";
    public static final String BATCH = "/_internal/v1/accounts/discovery-profiles/batch";
    public static final String WORKSPACE = "/_internal/v1/accounts/discovery-profiles/workspace";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
    private DiscoveryProfilesProtocol() {}
    public static String[] paths() { return new String[]{SINGLE, BATCH, WORKSPACE}; }
    public record Error(String code) {}
    public record Scope(Boolean active, String groupId) {
        public static Scope current() { return new Scope(com.raxim.myscoutee.domain.platform.api.JobGroupContext.isActive(), com.raxim.myscoutee.domain.platform.api.JobGroupContext.groupId()); }
    }
    private static boolean scope(Scope value) { return value != null && value.active() != null && text(value.groupId(), 512) && (value.active() || value.groupId() == null); }
    public record Single(Scope scope, String id) {}
    public record Batch(Scope scope, java.util.Collection<String> ids) {}
    public record Workspace(Scope scope, String groupId, java.util.Collection<String> accounts) {}
    public record Result(Boolean resolved, com.raxim.myscoutee.domain.accounts.dto.DiscoveryProfileDto value) {}
    public static boolean valid(Single q) { return q != null && scope(q.scope()) && text(q.id(), 512); }
    public static boolean valid(Batch q) { return q != null && scope(q.scope()) && ids(q.ids()); }
    public static boolean valid(Workspace q) { return q != null && scope(q.scope()) && text(q.groupId(), 512) && ids(q.accounts()); }
}
