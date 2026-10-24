package com.raxim.myscoutee.microservices.transport.events;

import static com.raxim.myscoutee.microservices.transport.common.ProtocolFields.text;
import static com.raxim.myscoutee.microservices.transport.common.ProtocolFields.ids;

import com.raxim.myscoutee.domain.events.api.MemberAttention;

public final class MemberAttentionProtocol {
    public static final String INCREMENT = "/_internal/v1/events/member-attention/increment";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
    private MemberAttentionProtocol() {}
    public static String[] paths() { return new String[]{INCREMENT}; }
    public record Error(String code) {}
    public record Scope(Boolean active, String groupId) {
        public static Scope current() { return new Scope(com.raxim.myscoutee.domain.platform.api.JobGroupContext.isActive(), com.raxim.myscoutee.domain.platform.api.JobGroupContext.groupId()); }
    }
    private static boolean scope(Scope value) { return value != null && value.active() != null && text(value.groupId(), 512) && (value.active() || value.groupId() == null); }
    public record Command(Scope scope, String communityId, String userId, Integer delta) {}
    public record Receipt(Boolean completed) {}
    public static boolean valid(Command value) { return value != null && scope(value.scope()) && value.communityId() != null && value.userId() != null && text(value.communityId(), 512) && text(value.userId(), 512) && value.delta() != null; }
}
