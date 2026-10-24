package com.raxim.myscoutee.microservices.transport.chat;

import static com.raxim.myscoutee.microservices.transport.common.ProtocolFields.text;
import static com.raxim.myscoutee.microservices.transport.common.ProtocolFields.ids;

import com.raxim.myscoutee.domain.chat.api.CampaignConversations;

public final class CampaignConversationsProtocol {
    public static final String INTERACTIONS = "/_internal/v1/chat/campaign-conversations/interactions";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
    private CampaignConversationsProtocol() {}
    public static String[] paths() { return new String[]{INTERACTIONS}; }
    public record Error(String code) {}
    public record Scope(Boolean active, String groupId) {
        public static Scope current() { return new Scope(com.raxim.myscoutee.domain.platform.api.JobGroupContext.isActive(), com.raxim.myscoutee.domain.platform.api.JobGroupContext.groupId()); }
    }
    private static boolean scope(Scope value) { return value != null && value.active() != null && text(value.groupId(), 512) && (value.active() || value.groupId() == null); }
    public record Query(Scope scope, String actorId, String targetId) {}
    public static boolean valid(Query q) { return q != null && scope(q.scope()) && text(q.actorId(),512) && text(q.targetId(),512); }
}
