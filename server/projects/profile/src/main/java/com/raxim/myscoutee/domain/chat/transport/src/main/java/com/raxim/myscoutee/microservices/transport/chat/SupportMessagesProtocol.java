package com.raxim.myscoutee.microservices.transport.chat;

import static com.raxim.myscoutee.microservices.transport.common.ProtocolFields.text;
import static com.raxim.myscoutee.microservices.transport.common.ProtocolFields.ids;

import com.raxim.myscoutee.domain.chat.api.SupportMessages;

public final class SupportMessagesProtocol {
    public static final String SEND = "/_internal/v1/chat/support-messages/send";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
    private SupportMessagesProtocol() {}
    public static String[] paths() { return new String[]{SEND}; }
    public record Error(String code) {}
    public record Scope(Boolean active, String groupId) {
        public static Scope current() { return new Scope(com.raxim.myscoutee.domain.platform.api.JobGroupContext.isActive(), com.raxim.myscoutee.domain.platform.api.JobGroupContext.groupId()); }
    }
    private static boolean scope(Scope value) { return value != null && value.active() != null && text(value.groupId(), 512) && (value.active() || value.groupId() == null); }
    public record Send(Scope scope, String targetUserId, String adminUserId, String adminName, String adminInitials, String text, String supportStatus, String stableMessageId) {}
    public record Result(Boolean resolved, com.raxim.myscoutee.domain.chat.dto.ChatDtos.ChatMessageDto value) {}
    public static boolean valid(Send q) { return q != null && scope(q.scope()) && text(q.targetUserId(),512) && text(q.adminUserId(),512) && text(q.adminName(),512) && text(q.adminInitials(),128) && text(q.text(),65536) && text(q.supportStatus(),128) && text(q.stableMessageId(),512); }
}
