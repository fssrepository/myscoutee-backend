package com.raxim.myscoutee.microservices.transport.chat;

import static com.raxim.myscoutee.microservices.transport.common.ProtocolFields.text;
import static com.raxim.myscoutee.microservices.transport.common.ProtocolFields.ids;

import com.raxim.myscoutee.domain.chat.api.EventConversations;

public final class EventConversationsProtocol {
    public static final String ENSURE = "/_internal/v1/chat/event-conversations/ensure";
    public static final String PUBLISHED = "/_internal/v1/chat/event-conversations/published";
    public static final String STATUS = "/_internal/v1/chat/event-conversations/status";
    public static final String POST = "/_internal/v1/chat/event-conversations/post";
    public static final String INITIAL = "/_internal/v1/chat/event-conversations/initial";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
    private EventConversationsProtocol() {}
    public static String[] paths() { return new String[]{ENSURE, PUBLISHED, STATUS, POST, INITIAL}; }
    public record Error(String code) {}
    public record Scope(Boolean active, String groupId) {
        public static Scope current() { return new Scope(com.raxim.myscoutee.domain.platform.api.JobGroupContext.isActive(), com.raxim.myscoutee.domain.platform.api.JobGroupContext.groupId()); }
    }
    private static boolean scope(Scope value) { return value != null && value.active() != null && text(value.groupId(), 512) && (value.active() || value.groupId() == null); }
    public record Event(Scope scope, com.raxim.myscoutee.domain.events.dto.EventChatContextDto event, java.util.Collection<String> participants) {}
    public record Status(Scope scope, String eventId, String status) {}
    public record Message(Scope scope, String chatId, String text, String systemType) {}
    public record Chat(Boolean resolved, String value) {}
    public record Result(Boolean resolved, com.raxim.myscoutee.domain.chat.dto.ChatDtos.ChatMessageDto value) {}
    public record Count(Long value) {}
    public static boolean valid(Event q) { return q != null && scope(q.scope()) && (q.participants() == null || ids(q.participants())); }
    public static boolean valid(Status q) { return q != null && scope(q.scope()) && text(q.eventId(),512) && text(q.status(),128); }
    public static boolean valid(Message q) { return q != null && scope(q.scope()) && text(q.chatId(),512) && text(q.text(),65536) && text(q.systemType(),128); }
}
