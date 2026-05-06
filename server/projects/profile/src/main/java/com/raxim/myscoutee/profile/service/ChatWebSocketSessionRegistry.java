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

import tools.jackson.databind.ObjectMapper;

@Service
public class ChatWebSocketSessionRegistry {
    private static final Logger LOGGER = LoggerFactory.getLogger(ChatWebSocketSessionRegistry.class);

    private final ObjectMapper objectMapper;
    private final Map<String, Map<String, SessionRef>> sessionsByChatId = new ConcurrentHashMap<>();
    private final Map<String, String> lastPayloadBySessionId = new ConcurrentHashMap<>();

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
        lastPayloadBySessionId.remove(session.getId());
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
                String previousPayload = lastPayloadBySessionId.put(session.getId(), payload);
                if (payload.equals(previousPayload)) {
                    continue;
                }
                session.sendMessage(new TextMessage(payload));
            } catch (IOException exception) {
                unregister(session);
            } catch (Exception exception) {
                LOGGER.warn("Unable to send websocket chat event to session {}.", session.getId(), exception);
                unregister(session);
            }
        }
    }

    private record SessionRef(WebSocketSession session, String userId) {
    }
}
