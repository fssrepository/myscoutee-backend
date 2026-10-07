package com.raxim.myscoutee.domain.chat.service;

import com.raxim.myscoutee.domain.groups.api.BaseGroups;

import java.io.IOException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.domain.community.api.CaseParticipants;
import com.raxim.myscoutee.domain.accounts.api.ProfileDirectory;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

import jakarta.annotation.PreDestroy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import com.raxim.myscoutee.domain.chat.dto.ChatDtos.ChatSocketEventDto;
import com.raxim.myscoutee.domain.chat.dto.ChatDtos.ChatMessageDto;

import tools.jackson.databind.ObjectMapper;

@Service
public class ChatWebSocketSessionRegistry implements com.raxim.myscoutee.domain.chat.api.ChatPresence {
    private static final Logger LOGGER = LoggerFactory.getLogger(ChatWebSocketSessionRegistry.class);

    private final ObjectMapper objectMapper;
    private final CaseParticipants cases;
    private final ProfileDirectory users;
    private final Map<String, Map<String, SessionRef>> sessionsByChatId = new ConcurrentHashMap<>();
    private final Map<String, Object> sendLocksBySessionId = new ConcurrentHashMap<>();
    private final ExecutorService broadcastExecutor = Executors.newVirtualThreadPerTaskExecutor();

    public ChatWebSocketSessionRegistry(ObjectMapper objectMapper, CaseParticipants cases, ProfileDirectory users) {
        this.objectMapper = objectMapper; this.cases = cases; this.users = users;
    }

    @PreDestroy
    void shutdownBroadcastExecutor() {
        broadcastExecutor.shutdownNow();
    }

    public void register(String chatId, String userId, WebSocketSession session) {
        if (!StringUtils.hasText(chatId) || !StringUtils.hasText(userId) || session == null) {
            return;
        }
        sessionsByChatId.computeIfAbsent(chatId.trim(), key -> new ConcurrentHashMap<>())
                .put(session.getId(), new SessionRef(session, userId.trim(), MongoSessionModeContext.currentMode()));
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

    public Set<String> chatIds() { return Set.copyOf(sessionsByChatId.keySet()); }

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

    public List<SessionRef> chatSessions(String chatId) {
        var sessions = sessionsByChatId.get(chatId);
        return sessions == null ? List.of() : List.copyOf(sessions.values());
    }

    public void sendEvent(WebSocketSession session, Object event) throws IOException {
        sendPayload(session, objectMapper.writeValueAsString(event));
    }

    public void broadcast(ChatStreamEvent event) {
        if (event == null || !StringUtils.hasText(event.chatId())) {
            return;
        }
        Map<String, SessionRef> sessions = sessionsByChatId.get(event.chatId().trim());
        if (sessions == null || sessions.isEmpty()) {
            return;
        }
        List<SessionRef> sessionRefs = List.copyOf(sessions.values());
        Map<String, String> payloadCache = new LinkedHashMap<>();
        List<Future<?>> futures = new ArrayList<>(sessionRefs.size());
        Map<MongoSessionMode, Set<String>> caseMembers = new LinkedHashMap<>();
        for (SessionRef sessionRef : sessionRefs) {
            if (event.chatId().startsWith("c-case-")) {
                Set<String> allowed = caseMembers.computeIfAbsent(sessionRef.mode(), mode -> caseMembers(event.chatId(), mode));
                if (!allowed.contains(sessionRef.userId())) {
                    unregister(sessionRef.session());
                    try { sessionRef.session().close(org.springframework.web.socket.CloseStatus.NOT_ACCEPTABLE); }
                    catch (IOException ignored) { }
                    continue;
                }
            }
            futures.add(broadcastExecutor.submit(() -> broadcastToSession(event, sessionRef, payloadCache)));
        }
        for (Future<?> future : futures) {
            try {
                future.get();
            } catch (InterruptedException exception) {
                Thread.currentThread().interrupt();
                return;
            } catch (Exception ignored) {
                // Individual sends unregister failed sessions inside broadcastToSession.
            }
        }
    }

    private Set<String> caseMembers(String chatId, MongoSessionMode mode) {
        MongoSessionMode previous = MongoSessionModeContext.currentMode();
        try {
            MongoSessionModeContext.set(mode);
            var serviceCase = cases.conversation(chatId.substring("c-case-".length())).orElse(null);
            if (serviceCase == null || !BaseGroups.COMMUNITY_BASE_ID.equals(serviceCase.baseGroupId())) return Set.of();
            return users.findByWorkspaceGroupIdAndAccountUserIdIn(BaseGroups.COMMUNITY_BASE_ID, serviceCase.activeParticipantAccountIds())
                    .stream().map(u -> u.getUserId()).collect(java.util.stream.Collectors.toSet());
        } finally { MongoSessionModeContext.set(previous); }
    }

    private void broadcastToSession(ChatStreamEvent event, SessionRef sessionRef, Map<String, String> payloadCache) {
        if (event == null || sessionRef == null) {
            return;
        }
        WebSocketSession session = sessionRef.session();
        if (!session.isOpen()) {
            unregister(session);
            return;
        }
        try {
            String payload = payloadFor(event, sessionRef.userId(), payloadCache);
            sendPayload(session, payload);
        } catch (IOException exception) {
            unregister(session);
        } catch (Exception exception) {
            LOGGER.warn("Unable to send websocket chat event to session {}.", session.getId(), exception);
            unregister(session);
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

    private String payloadFor(ChatStreamEvent event, String userId, Map<String, String> payloadCache) throws IOException {
        String cacheKey = payloadCacheKey(event, userId);
        synchronized (payloadCache) {
            String payload = payloadCache.get(cacheKey);
            if (payload == null) {
                ChatSocketEventDto socketEvent = event.toSocketEvent(userId);
                payload = objectMapper.writeValueAsString(socketEvent);
                payloadCache.put(cacheKey, payload);
            }
            return payload;
        }
    }

    private String payloadCacheKey(ChatStreamEvent event, String userId) {
        if (event == null) {
            return "";
        }
        ChatStreamEvent current = Objects.requireNonNull(event);
        String type = normalize(current.type());
        if ("message".equals(type)) {
            return Objects.equals(normalize(current.senderId()), normalize(userId)) ? "message:mine" : "message:other";
        }
        return type;
    }

    private String normalize(String value) {
        return StringUtils.hasText(value) ? value.trim() : "";
    }

    public record SessionRef(WebSocketSession session, String userId, MongoSessionMode mode) {
    }
}
