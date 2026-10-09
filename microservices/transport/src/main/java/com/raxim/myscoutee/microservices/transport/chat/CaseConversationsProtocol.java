package com.raxim.myscoutee.microservices.transport.chat;

import com.raxim.myscoutee.domain.chat.api.CaseConversations;

public final class CaseConversationsProtocol {
    public static final String SYNC = "/_internal/v1/chat/case-conversations/sync";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
    private CaseConversationsProtocol() {}
    public static String[] paths() { return new String[]{SYNC}; }
    public record Error(String code) {}
    public record Scope(Boolean active, String groupId) {
        public static Scope current() { return new Scope(com.raxim.myscoutee.domain.platform.api.JobGroupContext.isActive(), com.raxim.myscoutee.domain.platform.api.JobGroupContext.groupId()); }
    }
    private static boolean text(String value, int limit) { return value == null || value.length() <= limit; }
    private static boolean scope(Scope value) { return value != null && value.active() != null && text(value.groupId(), 512) && (value.active() || value.groupId() == null); }
    private static boolean ids(java.util.Collection<String> values) { return values != null && values.size() <= 4096 && values.stream().allMatch(value -> text(value, 512)); }
    public record Receipt(Boolean completed) {}
    public record Command(Scope scope, com.raxim.myscoutee.domain.community.dto.CaseConversation conversation) {}
    public static boolean valid(Command q) { return q != null && scope(q.scope()); }
}
