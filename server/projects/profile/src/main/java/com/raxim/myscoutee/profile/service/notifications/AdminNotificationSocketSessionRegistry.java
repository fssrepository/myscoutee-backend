package com.raxim.myscoutee.profile.service.notifications;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import com.raxim.myscoutee.profile.data.document.NotificationRuleConfig;

import tools.jackson.databind.ObjectMapper;

@Component
public class AdminNotificationSocketSessionRegistry {
    private static final Logger LOGGER = LoggerFactory.getLogger(AdminNotificationSocketSessionRegistry.class);

    private final ObjectMapper objectMapper;
    private final Set<WebSocketSession> sessions = ConcurrentHashMap.newKeySet();

    public AdminNotificationSocketSessionRegistry(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public void register(WebSocketSession session) {
        if (session != null && session.isOpen()) {
            sessions.add(session);
        }
    }

    public void unregister(WebSocketSession session) {
        sessions.remove(session);
    }

    public void broadcastRuleRuntime(NotificationRuleConfig rule) {
        if (rule == null || sessions.isEmpty()) {
            return;
        }
        Map<String, Object> payload = Map.of(
                "type", "rule-runtime",
                "ruleKey", safeText(rule.getRuleKey()),
                "runState", rule.getRunState(),
                "runHistory", rule.getRunHistory(),
                "updatedDate", safeText(rule.getUpdatedDate()),
                "updatedUser", safeText(rule.getUpdatedUser()));
        broadcast(payload);
    }

    private void broadcast(Object payload) {
        String encoded;
        try {
            encoded = objectMapper.writeValueAsString(payload);
        } catch (Exception exception) {
            LOGGER.warn("Unable to encode admin notification socket event.", exception);
            return;
        }
        TextMessage message = new TextMessage(encoded);
        for (WebSocketSession session : Set.copyOf(sessions)) {
            if (session == null || !session.isOpen()) {
                sessions.remove(session);
                continue;
            }
            try {
                session.sendMessage(message);
            } catch (Exception exception) {
                sessions.remove(session);
                LOGGER.warn("Unable to send admin notification socket event to session {}.", session.getId(), exception);
            }
        }
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }
}
