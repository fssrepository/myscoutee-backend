package com.raxim.myscoutee.profile.websocket;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.raxim.myscoutee.common.config.firebase.dto.FirebasePrincipal;
import com.raxim.myscoutee.common.config.properties.ConfigProperties;
import com.raxim.myscoutee.profile.data.document.mongo.Users;
import com.raxim.myscoutee.profile.dto.activities.ActivityChatsDtos.ChatSocketRequestDto;
import com.raxim.myscoutee.profile.service.ActivitiesChatService;
import com.raxim.myscoutee.profile.service.ChatWebSocketSessionRegistry;

@Component
public class ChatWebSocketHandler extends TextWebSocketHandler {
    private final ObjectMapper objectMapper;
    private final ActivitiesChatService activitiesChatService;
    private final ChatWebSocketSessionRegistry sessionRegistry;
    private final ConfigProperties configProperties;

    public ChatWebSocketHandler(
            ObjectMapper objectMapper,
            ActivitiesChatService activitiesChatService,
            ChatWebSocketSessionRegistry sessionRegistry,
            ConfigProperties configProperties) {
        this.objectMapper = objectMapper;
        this.activitiesChatService = activitiesChatService;
        this.sessionRegistry = sessionRegistry;
        this.configProperties = configProperties;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String chatId = resolveChatId(session);
        String userId = resolveViewerUserId(session);
        if (!StringUtils.hasText(chatId) || !StringUtils.hasText(userId) || !activitiesChatService.hasChatAccess(chatId, userId)) {
            session.close(CloseStatus.NOT_ACCEPTABLE);
            return;
        }
        sessionRegistry.register(chatId, userId, session);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String chatId = resolveChatId(session);
        String userId = resolveViewerUserId(session);
        if (!StringUtils.hasText(chatId) || !StringUtils.hasText(userId)) {
            return;
        }
        ChatSocketRequestDto request = objectMapper.readValue(message.getPayload(), ChatSocketRequestDto.class);
        if (request == null) {
            return;
        }
        String type = request.type() == null ? "message" : request.type().trim();
        if ("typing".equalsIgnoreCase(type)) {
            activitiesChatService.sendTypingSignal(chatId, userId, request.typing());
            return;
        }
        if ("read".equalsIgnoreCase(type)) {
            activitiesChatService.markMessagesRead(chatId, userId, request.messageIds());
            return;
        }
        if (!type.isEmpty() && !"message".equalsIgnoreCase(type)) {
            return;
        }
        if (!StringUtils.hasText(request.text())) {
            return;
        }
        activitiesChatService.sendMessage(chatId, userId, request.text());
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

    private String resolveViewerUserId(WebSocketSession session) {
        FirebasePrincipal principal = resolvePrincipal(session);
        if (principal != null) {
            Users user = principal.getUser();
            String principalUserId = user != null && StringUtils.hasText(user.getId())
                    ? user.getId().trim()
                    : (principal.getUserId() == null ? "" : principal.getUserId().trim());
            if (StringUtils.hasText(principalUserId)) {
                return principalUserId;
            }
        }
        if (configProperties.isFirebaseEnabled()) {
            return null;
        }
        return resolveRequestedUserId(session);
    }

    private FirebasePrincipal resolvePrincipal(WebSocketSession session) {
        if (!(session.getPrincipal() instanceof org.springframework.security.core.Authentication authentication)) {
            return null;
        }
        Object principal = authentication.getPrincipal();
        return principal instanceof FirebasePrincipal firebasePrincipal ? firebasePrincipal : null;
    }
}
