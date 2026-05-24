package com.raxim.myscoutee.profile.websocket;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import tools.jackson.databind.ObjectMapper;
import com.raxim.myscoutee.common.config.firebase.dto.FirebasePrincipal;
import com.raxim.myscoutee.common.config.mongo.DemoSessionRequestSupport;
import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.common.config.properties.ConfigProperties;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.data.dto.activities.ActivityChatsDtos.ChatMessageDto;
import com.raxim.myscoutee.profile.data.dto.activities.ActivityChatsDtos.ChatSocketRequestDto;
import com.raxim.myscoutee.profile.data.dto.activities.ActivityChatsDtos.ChatSocketEventDto;
import com.raxim.myscoutee.profile.service.ActivitiesChatService;
import com.raxim.myscoutee.profile.service.ChatWebSocketSessionRegistry;

@Component
public class ChatWebSocketHandler extends TextWebSocketHandler {
    private static final Logger LOGGER = LoggerFactory.getLogger(ChatWebSocketHandler.class);

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
        runWithSessionMode(session, () -> {
            String chatId = resolveChatId(session);
            String userId = resolveViewerUserId(session);
            if (!StringUtils.hasText(chatId) || !StringUtils.hasText(userId) || !activitiesChatService.hasChatAccess(chatId, userId)) {
                session.close(CloseStatus.NOT_ACCEPTABLE);
                return;
            }
            sessionRegistry.register(chatId, userId, session);
        });
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String chatId = resolveChatId(session);
        String userId = resolveViewerUserId(session);
        if (!StringUtils.hasText(chatId) || !StringUtils.hasText(userId)) {
            return;
        }
        ChatSocketRequestDto request;
        try {
            request = objectMapper.readValue(message.getPayload(), ChatSocketRequestDto.class);
        } catch (Exception exception) {
            sendSocketError(session, chatId, null, null, "Invalid chat request.");
            return;
        }
        if (request == null) {
            return;
        }
        String type = request.type() == null ? "message" : request.type().trim();
        try {
            runWithSessionMode(session, () -> {
                if ("typing".equalsIgnoreCase(type)) {
                    activitiesChatService.sendTypingSignal(chatId, userId, request.typing());
                    return;
                }
                if ("read".equalsIgnoreCase(type)) {
                    activitiesChatService.markMessagesRead(chatId, userId, request.messageIds());
                    return;
                }
                if ("edit".equalsIgnoreCase(type)) {
                    ChatMessageDto saved = activitiesChatService.editMessage(chatId, userId, request.messageId(), request.text());
                    sessionRegistry.sendAck(session, chatId, saved);
                    return;
                }
                if ("delete".equalsIgnoreCase(type)) {
                    ChatMessageDto saved = activitiesChatService.deleteMessage(chatId, userId, request.messageId());
                    sessionRegistry.sendAck(session, chatId, saved);
                    return;
                }
                if ("pin".equalsIgnoreCase(type)) {
                    ChatMessageDto saved = activitiesChatService.pinMessage(chatId, userId, request.messageId(), request.pinned());
                    sessionRegistry.sendAck(session, chatId, saved);
                    return;
                }
                if ("reaction".equalsIgnoreCase(type)) {
                    ChatMessageDto saved = activitiesChatService.reactToMessage(chatId, userId, request.messageId(), request.emoji());
                    sessionRegistry.sendAck(session, chatId, saved);
                    return;
                }
                if ("attachments".equalsIgnoreCase(type)) {
                    ChatMessageDto saved = activitiesChatService.updateMessageAttachments(chatId, userId, request.messageId(), request.attachments());
                    sessionRegistry.sendAck(session, chatId, saved);
                    return;
                }
                if (!type.isEmpty() && !"message".equalsIgnoreCase(type)) {
                    return;
                }
                if (!StringUtils.hasText(request.text()) && (request.attachments() == null || request.attachments().isEmpty())) {
                    return;
                }
                ChatMessageDto saved = activitiesChatService.sendMessage(chatId, userId, request.text(), request.clientId(), request.replyTo(), request.attachments());
                sessionRegistry.sendAck(session, chatId, saved);
            });
        } catch (Exception exception) {
            LOGGER.warn("Unable to store websocket chat update. chatId={}, userId={}, type={}, messageId={}, clientId={}",
                    chatId, userId, type, request.messageId(), request.clientId(), exception);
            sendSocketError(session, chatId, request.messageId(), request.clientId(), socketErrorMessage(exception));
        }
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

    private MongoSessionMode resolveSessionMode(WebSocketSession session) {
        Object value = session.getAttributes().get(ChatHandshakeInterceptor.SESSION_KIND_ATTRIBUTE);
        return value instanceof String sessionKind && DemoSessionRequestSupport.isDemoSessionKind(sessionKind)
                ? MongoSessionMode.DEMO
                : MongoSessionMode.REAL;
    }

    private void runWithSessionMode(WebSocketSession session, SocketOperation operation) throws Exception {
        MongoSessionMode previousMode = MongoSessionModeContext.currentMode();
        MongoSessionModeContext.set(resolveSessionMode(session));
        try {
            operation.run();
        } finally {
            MongoSessionModeContext.set(previousMode);
        }
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
        if (configProperties.isFirebaseEnabled() && resolveSessionMode(session) != MongoSessionMode.DEMO) {
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

    private void sendSocketError(
            WebSocketSession session,
            String chatId,
            String messageId,
            String clientId,
            String error) {
        if (session == null || !session.isOpen()) {
            return;
        }
        try {
            session.sendMessage(new TextMessage(objectMapper.writeValueAsString(new ChatSocketEventDto(
                    "error",
                    chatId,
                    null,
                    null,
                    null,
                    messageId,
                    clientId,
                    error))));
        } catch (Exception ignored) {
            // The client still has its optimistic timeout if the error frame cannot be sent.
        }
    }

    private String socketErrorMessage(Exception exception) {
        if (exception instanceof ResponseStatusException responseStatusException) {
            String reason = responseStatusException.getReason();
            if (StringUtils.hasText(reason)) {
                return reason.trim();
            }
        }
        String message = exception == null ? "" : exception.getMessage();
        return StringUtils.hasText(message) ? message.trim() : "Unable to store chat update.";
    }

    @FunctionalInterface
    private interface SocketOperation {
        void run() throws Exception;
    }
}
