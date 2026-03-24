package com.raxim.myscoutee.profile.service;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.raxim.myscoutee.profile.data.dto.chat.ActivitiesChatMessageDto;
import com.raxim.myscoutee.profile.data.dto.chat.ChatStreamEvent;

@Service
public class ChatWebSocketSessionRegistry {
    private final ObjectMapper objectMapper;
    private final Map<String, Map<String, SessionRef>> sessionsByChatId = new ConcurrentHashMap<>();

    public ChatWebSocketSessionRegistry(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public void register(String chatId, String profileId, WebSocketSession session) {
        if (chatId == null || chatId.isBlank() || profileId == null || profileId.isBlank()) {
            return;
        }
        sessionsByChatId.computeIfAbsent(chatId, key -> new ConcurrentHashMap<>())
                .put(session.getId(), new SessionRef(session, profileId));
    }

    public void unregister(WebSocketSession session) {
        for (Map.Entry<String, Map<String, SessionRef>> entry : sessionsByChatId.entrySet()) {
            entry.getValue().remove(session.getId());
            if (entry.getValue().isEmpty()) {
                sessionsByChatId.remove(entry.getKey());
            }
        }
    }

    public void broadcast(ChatStreamEvent event) {
        Map<String, SessionRef> sessions = sessionsByChatId.get(event.chatId());
        if (sessions == null || sessions.isEmpty()) {
            return;
        }
        for (SessionRef sessionRef : sessions.values()) {
            WebSocketSession session = sessionRef.session();
            if (!session.isOpen()) {
                unregister(session);
                continue;
            }
            ActivitiesChatMessageDto message = event.toMessage(sessionRef.profileId());
            try {
                session.sendMessage(new TextMessage(objectMapper.writeValueAsString(message)));
            } catch (JsonProcessingException e) {
                throw new IllegalStateException("Failed to serialize chat websocket message.", e);
            } catch (IOException e) {
                unregister(session);
            }
        }
    }

    private record SessionRef(WebSocketSession session, String profileId) {
    }
}
