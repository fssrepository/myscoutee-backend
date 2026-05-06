package com.raxim.myscoutee.profile.websocket;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.raxim.myscoutee.common.config.firebase.dto.FirebasePrincipal;
import com.raxim.myscoutee.common.config.properties.ConfigProperties;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminUserDto;
import com.raxim.myscoutee.profile.service.AdminModerationService;
import com.raxim.myscoutee.profile.service.notifications.AdminNotificationSocketSessionRegistry;

@Component
public class AdminNotificationWebSocketHandler extends TextWebSocketHandler {
    private final AdminNotificationSocketSessionRegistry sessionRegistry;
    private final AdminModerationService adminModerationService;
    private final ConfigProperties configProperties;

    public AdminNotificationWebSocketHandler(
            AdminNotificationSocketSessionRegistry sessionRegistry,
            AdminModerationService adminModerationService,
            ConfigProperties configProperties) {
        this.sessionRegistry = sessionRegistry;
        this.adminModerationService = adminModerationService;
        this.configProperties = configProperties;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        if (!hasAdminAccess(session)) {
            session.close(CloseStatus.NOT_ACCEPTABLE);
            return;
        }
        sessionRegistry.register(session);
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

    private boolean hasAdminAccess(WebSocketSession session) {
        FirebasePrincipal principal = resolvePrincipal(session);
        if (principal != null) {
            return true;
        }
        if (configProperties.isFirebaseEnabled()) {
            return false;
        }
        String adminUserId = resolveQueryValue(session, "adminUserId");
        if (!StringUtils.hasText(adminUserId)) {
            return false;
        }
        try {
            AdminUserDto admin = adminModerationService.resolveAdminActor(adminUserId);
            return admin != null && StringUtils.hasText(admin.id());
        } catch (Exception exception) {
            return false;
        }
    }

    private FirebasePrincipal resolvePrincipal(WebSocketSession session) {
        if (!(session.getPrincipal() instanceof org.springframework.security.core.Authentication authentication)) {
            return null;
        }
        Object principal = authentication.getPrincipal();
        return principal instanceof FirebasePrincipal firebasePrincipal ? firebasePrincipal : null;
    }

    private String resolveQueryValue(WebSocketSession session, String key) {
        String query = session.getUri() == null ? "" : session.getUri().getRawQuery();
        if (!StringUtils.hasText(query)) {
            return "";
        }
        String prefix = key + "=";
        for (String part : query.split("&")) {
            if (part.startsWith(prefix)) {
                return part.substring(prefix.length()).trim();
            }
        }
        return "";
    }
}
