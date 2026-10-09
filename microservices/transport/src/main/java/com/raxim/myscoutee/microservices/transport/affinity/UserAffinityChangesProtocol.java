package com.raxim.myscoutee.microservices.transport.affinity;

import com.raxim.myscoutee.domain.affinity.dto.RecomputeTaskDto;

public final class UserAffinityChangesProtocol {
    private static final String ROOT = "/_internal/v1/affinity/user-affinity-changes/";
    public static final String PROFILE = ROOT + "profile", STATUS = ROOT + "status";
    public static final String EVENT = ROOT + "event", EVENT_MEMBERS = ROOT + "event-members",
            ASSET = ROOT + "asset", ASSET_REQUESTS = ROOT + "asset-requests", CONFIG = ROOT + "config";
    public static String[] allPaths() { return new String[]{PROFILE, STATUS, EVENT, EVENT_MEMBERS, ASSET, ASSET_REQUESTS, CONFIG}; }
    public record Change(Boolean active, String groupId, String targetId, String actorUserId) {
        public static Change current(String targetId, String actorUserId) {
            return new Change(com.raxim.myscoutee.domain.platform.api.JobGroupContext.isActive(),
                    com.raxim.myscoutee.domain.platform.api.JobGroupContext.groupId(), targetId, actorUserId);
        }
    }
    public static boolean valid(Change value) { return value != null && value.active() != null
            && text(value.groupId()) && text(value.targetId()) && text(value.actorUserId()) && (value.active() || value.groupId() == null); }
    private static boolean text(String value) { return value == null || value.length() <= 512; }
    public static final int MAX_REQUEST_BYTES = 4096;
    private UserAffinityChangesProtocol() {}
    public static String[] paths() { return new String[]{PROFILE, STATUS}; }
    public record Signal(String userId) {}
    public record Receipt(Boolean completed, RecomputeTaskDto task) {}
    public record Error(String code) {}
}
