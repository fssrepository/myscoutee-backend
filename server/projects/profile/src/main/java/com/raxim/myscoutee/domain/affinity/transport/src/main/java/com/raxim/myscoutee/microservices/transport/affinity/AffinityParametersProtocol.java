package com.raxim.myscoutee.microservices.transport.affinity;

import static com.raxim.myscoutee.microservices.transport.common.ProtocolFields.text;
import static com.raxim.myscoutee.microservices.transport.common.ProtocolFields.ids;

import com.raxim.myscoutee.domain.affinity.api.AffinityParameters;

public final class AffinityParametersProtocol {
    public static final String STATE_1 = "/_internal/v1/affinity/affinity-parameters/state_1";
    public static final String HISTORY_1 = "/_internal/v1/affinity/affinity-parameters/history_1";
    public static final String HISTORY_2 = "/_internal/v1/affinity/affinity-parameters/history_2";
    public static final String SAVE_1 = "/_internal/v1/affinity/affinity-parameters/save_1";
    public static final String REVERT_1 = "/_internal/v1/affinity/affinity-parameters/revert_1";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
    public static final String AUDIENCE = "affinity:affinity-parameters";
    public static boolean delegated(String path) { return java.util.Set.of(STATE_1, HISTORY_1, HISTORY_2, SAVE_1, REVERT_1).contains(path); }
    private AffinityParametersProtocol() {}
    public static String[] paths() { return new String[]{STATE_1, HISTORY_1, HISTORY_2, SAVE_1, REVERT_1}; }
    public record Error(String code) {}
    public record Scope(Boolean active, String groupId) {
        public static Scope current() { return new Scope(com.raxim.myscoutee.domain.platform.api.JobGroupContext.isActive(), com.raxim.myscoutee.domain.platform.api.JobGroupContext.groupId()); }
    }
    private static boolean scope(Scope value) { return value != null && value.active() != null && text(value.groupId(), 512) && (value.active() || value.groupId() == null); }
    public record Receipt(Boolean completed) {}
    public record State1(Scope scope, String adminUserId) {}
    public static boolean valid(State1 q) { return q!=null && scope(q.scope()) && text(q.adminUserId(),8192); }
    public record History1(Scope scope, String sectionKey) {}
    public static boolean valid(History1 q) { return q!=null && scope(q.scope()) && text(q.sectionKey(),8192); }
    public record History2(Scope scope, String sectionKey, String adminUserId) {}
    public static boolean valid(History2 q) { return q!=null && scope(q.scope()) && text(q.sectionKey(),8192) && text(q.adminUserId(),8192); }
    public record Save1(Scope scope, com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminParamsSaveRequestDto request) {}
    public static boolean valid(Save1 q) { return q!=null && scope(q.scope()); }
    public record Revert1(Scope scope, String sectionKey, com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminParamsRevertRequestDto request) {}
    public static boolean valid(Revert1 q) { return q!=null && scope(q.scope()) && text(q.sectionKey(),8192); }
}
