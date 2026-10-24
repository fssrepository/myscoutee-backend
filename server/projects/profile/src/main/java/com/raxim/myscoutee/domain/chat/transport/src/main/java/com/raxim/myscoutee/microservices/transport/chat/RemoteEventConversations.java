package com.raxim.myscoutee.microservices.transport.chat;

import com.raxim.myscoutee.domain.chat.api.EventConversations;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Bounded scoped call to the existing owner; no automatic retries. */
public final class RemoteEventConversations extends RemoteReadTransport implements EventConversations {
    private final ObjectMapper mapper;
    public RemoteEventConversations(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public String ensureMainEventChat(com.raxim.myscoutee.domain.events.api.EventChatContext event, java.util.Collection<String> participants) {
        var command = new EventConversationsProtocol.Event(EventConversationsProtocol.Scope.current(), com.raxim.myscoutee.domain.events.dto.EventChatContextDto.from(event), participants);
        if (!EventConversationsProtocol.valid(command)) throw new IllegalArgumentException("Invalid event-conversations request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > EventConversationsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("event-conversations request exceeds byte limit");
        var result = ownerExchange(EventConversationsProtocol.ENSURE, bytes, new TypeReference<EventConversationsProtocol.Chat>() {},
                "event-conversations.ensure", EventConversationsProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.resolved()));
        return result.value();
    }
    @Override public com.raxim.myscoutee.domain.chat.api.EventConversations.PublishedMainEventChatResult ensurePublishedMainEventChat(com.raxim.myscoutee.domain.events.api.EventChatContext event, java.util.Collection<String> participants) {
        var command = new EventConversationsProtocol.Event(EventConversationsProtocol.Scope.current(), com.raxim.myscoutee.domain.events.dto.EventChatContextDto.from(event), participants);
        if (!EventConversationsProtocol.valid(command)) throw new IllegalArgumentException("Invalid event-conversations request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > EventConversationsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("event-conversations request exceeds byte limit");
        var result = ownerExchange(EventConversationsProtocol.PUBLISHED, bytes, new TypeReference<com.raxim.myscoutee.domain.chat.api.EventConversations.PublishedMainEventChatResult>() {},
                "event-conversations.published", EventConversationsProtocol.MAX_RESPONSE_BYTES, v -> v.createdOwnerUserIds() != null);
        return result;
    }
    @Override public long updateEventChatOwnerStatus(String eventId, String status) {
        var command = new EventConversationsProtocol.Status(EventConversationsProtocol.Scope.current(), eventId, status);
        if (!EventConversationsProtocol.valid(command)) throw new IllegalArgumentException("Invalid event-conversations request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > EventConversationsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("event-conversations request exceeds byte limit");
        var result = ownerExchange(EventConversationsProtocol.STATUS, bytes, new TypeReference<EventConversationsProtocol.Count>() {},
                "event-conversations.status", EventConversationsProtocol.MAX_RESPONSE_BYTES, v -> v.value() != null && v.value() >= 0);
        return result.value();
    }
    @Override public com.raxim.myscoutee.domain.chat.dto.ChatDtos.ChatMessageDto postSystemMessage(String chatId, String text, String systemType) {
        var command = new EventConversationsProtocol.Message(EventConversationsProtocol.Scope.current(), chatId, text, systemType);
        if (!EventConversationsProtocol.valid(command)) throw new IllegalArgumentException("Invalid event-conversations request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > EventConversationsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("event-conversations request exceeds byte limit");
        var result = ownerExchange(EventConversationsProtocol.POST, bytes, new TypeReference<EventConversationsProtocol.Result>() {},
                "event-conversations.post", EventConversationsProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.resolved()));
        return result.value();
    }
    @Override public com.raxim.myscoutee.domain.chat.dto.ChatDtos.ChatMessageDto ensureInitialSystemMessage(String chatId, String text, String systemType) {
        var command = new EventConversationsProtocol.Message(EventConversationsProtocol.Scope.current(), chatId, text, systemType);
        if (!EventConversationsProtocol.valid(command)) throw new IllegalArgumentException("Invalid event-conversations request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > EventConversationsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("event-conversations request exceeds byte limit");
        var result = ownerExchange(EventConversationsProtocol.INITIAL, bytes, new TypeReference<EventConversationsProtocol.Result>() {},
                "event-conversations.initial", EventConversationsProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.resolved()));
        return result.value();
    }
    private <T> T ownerExchange(String path, byte[] bytes, TypeReference<T> type, String operation, int limit,
            java.util.function.Predicate<T> valid) {
        try { return exchange(path, bytes, type, operation, limit, valid); }
        catch (RemoteReadException failure) {
            if (failure.status() >= 400 && failure.status() < 500 && "OWNER_REJECTED".equals(failure.remoteCode()))
                throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatusCode.valueOf(failure.status()));
            throw failure;
        }
    }

}
