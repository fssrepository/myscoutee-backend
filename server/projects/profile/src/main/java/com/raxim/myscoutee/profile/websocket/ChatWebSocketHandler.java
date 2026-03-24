package com.raxim.myscoutee.profile.websocket;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.raxim.myscoutee.common.config.firebase.dto.FirebasePrincipal;
import com.raxim.myscoutee.profile.data.document.mongo.Profile;
import com.raxim.myscoutee.profile.data.dto.chat.ChatSocketRequestDto;
import com.raxim.myscoutee.profile.service.ActivitiesChatService;
import com.raxim.myscoutee.profile.service.ChatWebSocketSessionRegistry;

@Component
public class ChatWebSocketHandler extends TextWebSocketHandler {
    private final ObjectMapper objectMapper;
    private final ActivitiesChatService activitiesChatService;
    private final ChatWebSocketSessionRegistry sessionRegistry;

    public ChatWebSocketHandler(ObjectMapper objectMapper,
            ActivitiesChatService activitiesChatService,
            ChatWebSocketSessionRegistry sessionRegistry) {
        this.objectMapper = objectMapper;
        this.activitiesChatService = activitiesChatService;
        this.sessionRegistry = sessionRegistry;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String chatId = resolveChatId(session);
        FirebasePrincipal principal = resolvePrincipal(session);
        Profile actorProfile = resolveActorProfile(session, principal);
        if (!StringUtils.hasText(chatId) || actorProfile == null || actorProfile.getId() == null) {
            session.close(CloseStatus.NOT_ACCEPTABLE);
            return;
        }
        sessionRegistry.register(chatId, actorProfile.getId().toString(), session);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        FirebasePrincipal principal = resolvePrincipal(session);
        String chatId = resolveChatId(session);
        Profile actorProfile = resolveActorProfile(session, principal);
        if (!StringUtils.hasText(chatId) || actorProfile == null) {
            return;
        }
        ChatSocketRequestDto request = objectMapper.readValue(message.getPayload(), ChatSocketRequestDto.class);
        if (!StringUtils.hasText(request.text())) {
            return;
        }
        activitiesChatService.sendChatMessage(
                chatId,
                actorProfile,
                request.text());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        sessionRegistry.unregister(session);
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        sessionRegistry.unregister(session);
        if (session.isOpen()) {
            session.close(CloseStatus.SERVER_ERROR);
        }
    }

    private String resolveChatId(WebSocketSession session) {
        Object value = session.getAttributes().get(ChatHandshakeInterceptor.CHAT_ID_ATTRIBUTE);
        return value instanceof String chatId ? chatId : null;
    }

    private String resolveRequestedUserId(WebSocketSession session) {
        Object value = session.getAttributes().get(ChatHandshakeInterceptor.USER_ID_ATTRIBUTE);
        return value instanceof String userId ? userId : null;
    }

    private FirebasePrincipal resolvePrincipal(WebSocketSession session) {
        if (!(session.getPrincipal() instanceof org.springframework.security.core.Authentication authentication)) {
            return null;
        }
        Object principal = authentication.getPrincipal();
        return principal instanceof FirebasePrincipal firebasePrincipal ? firebasePrincipal : null;
    }

    private Profile resolveActorProfile(WebSocketSession session, FirebasePrincipal principal) {
        if (principal == null) {
            return null;
        }
        return activitiesChatService.resolveActorProfile(principal.getUser().getProfile(), resolveRequestedUserId(session));
    }
}
