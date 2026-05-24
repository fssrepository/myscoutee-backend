package com.raxim.myscoutee.profile.service;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import com.raxim.myscoutee.profile.data.dto.activities.ActivityChatsDtos.ChatSocketEventDto;
import com.raxim.myscoutee.profile.data.dto.activities.ActivityChatsDtos.ChatMessageDto;

import tools.jackson.databind.ObjectMapper;

@Service
public class ChatWebSocketSessionRegistry {
    private static final Logger LOGGER = LoggerFactory.getLogger(ChatWebSocketSessionRegistry.class);

    private final ObjectMapper objectMapper;
    private final Map<String, Map<String, SessionRef>> sessionsByChatId = new ConcurrentHashMap<>();
    private final Map<String, Object> sendLocksBySessionId = new ConcurrentHashMap<>();

    public ChatWebSocketSessionRegistry(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public void register(String chatId, String userId, WebSocketSession session) {
        if (!StringUtils.hasText(chatId) || !StringUtils.hasText(userId) || session == null) {
            return;
        }
        sessionsByChatId.computeIfAbsent(chatId.trim(), key -> new ConcurrentHashMap<>())
                .put(session.getId(), new SessionRef(session, userId.trim()));
    }

    public void unregister(WebSocketSession session) {
        if (session == null) {
            return;
        }
        for (Map.Entry<String, Map<String, SessionRef>> entry : sessionsByChatId.entrySet()) {
            entry.getValue().remove(session.getId());
            if (entry.getValue().isEmpty()) {
                sessionsByChatId.remove(entry.getKey());
            }
        }
        sendLocksBySessionId.remove(session.getId());
    }

    public boolean isUserConnected(String chatId, String userId) {
        if (!StringUtils.hasText(chatId) || !StringUtils.hasText(userId)) {
            return false;
        }
        Map<String, SessionRef> sessions = sessionsByChatId.get(chatId.trim());
        if (sessions == null || sessions.isEmpty()) {
            return false;
        }
        String normalizedUserId = userId.trim();
        for (SessionRef ref : sessions.values()) {
            if (normalizedUserId.equals(ref.userId()) && ref.session().isOpen()) {
                return true;
            }
        }
        return false;
    }

    public void broadcast(ChatStreamEvent event) {
        if (event == null || !StringUtils.hasText(event.chatId())) {
            return;
        }
        Map<String, SessionRef> sessions = sessionsByChatId.get(event.chatId().trim());
        if (sessions == null || sessions.isEmpty()) {
            return;
        }
        for (SessionRef sessionRef : sessions.values()) {
            WebSocketSession session = sessionRef.session();
            if (!session.isOpen()) {
                unregister(session);
                continue;
            }
            ChatSocketEventDto socketEvent = event.toSocketEvent(sessionRef.userId());
            try {
                String payload = objectMapper.writeValueAsString(socketEvent);
                sendPayload(session, payload);
            } catch (IOException exception) {
                unregister(session);
            } catch (Exception exception) {
                LOGGER.warn("Unable to send websocket chat event to session {}.", session.getId(), exception);
                unregister(session);
            }
        }
    }

    public void sendAck(WebSocketSession session, String chatId, ChatMessageDto message) {
        if (session == null || !session.isOpen() || message == null || !StringUtils.hasText(chatId)) {
            return;
        }
        try {
            String payload = objectMapper.writeValueAsString(new ChatSocketEventDto(
                    "ack",
                    chatId,
                    message,
                    null,
                    null,
                    message.id(),
                    message.clientId(),
                    null));
            sendPayload(session, payload);
        } catch (Exception exception) {
            LOGGER.warn("Unable to send websocket chat ack to session {}.", session.getId(), exception);
            unregister(session);
        }
    }

    private void sendPayload(WebSocketSession session, String payload) throws IOException {
        Object lock = sendLocksBySessionId.computeIfAbsent(session.getId(), key -> new Object());
        synchronized (lock) {
            if (session.isOpen()) {
                session.sendMessage(new TextMessage(payload));
            }
        }
    }

    private record SessionRef(WebSocketSession session, String userId) {
    }
}
