package com.raxim.myscoutee.profile.websocket;

import org.springframework.stereotype.Component;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.util.StringUtils;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.raxim.myscoutee.common.config.firebase.dto.FirebasePrincipal;
import com.raxim.myscoutee.common.config.properties.ConfigProperties;
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
        if (!authorizeScope(session)) {
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

    private boolean authorizeScope(WebSocketSession session) {
        FirebasePrincipal principal = resolvePrincipal(session);
        if (configProperties.isFirebaseEnabled() && (principal == null || principal.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority).noneMatch("A"::equals))) return false;
        var previousMode = com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext.currentMode();
        var previousSecurity = org.springframework.security.core.context.SecurityContextHolder.getContext();
        var security = org.springframework.security.core.context.SecurityContextHolder.createEmptyContext();
        if (session.getPrincipal() instanceof org.springframework.security.core.Authentication authentication) {
            security.setAuthentication(authentication);
        }
        Object sessionKind = session.getAttributes().get(ChatHandshakeInterceptor.SESSION_KIND_ATTRIBUTE);
        var mode = "demo".equalsIgnoreCase(String.valueOf(sessionKind))
                ? com.raxim.myscoutee.common.config.mongo.MongoSessionMode.DEMO
                : com.raxim.myscoutee.common.config.mongo.MongoSessionMode.REAL;
        try {
            org.springframework.security.core.context.SecurityContextHolder.setContext(security);
            com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext.set(mode);
            String adminId = java.net.URLDecoder.decode(resolveQueryValue(session, "adminUserId"), java.nio.charset.StandardCharsets.UTF_8);
            String groupId = adminModerationService.baseGroupId(adminId);
            if (groupId == null) session.getAttributes().remove(AdminNotificationSocketSessionRegistry.GROUP_ATTRIBUTE);
            else session.getAttributes().put(AdminNotificationSocketSessionRegistry.GROUP_ATTRIBUTE, groupId);
            session.getAttributes().put(AdminNotificationSocketSessionRegistry.DATABASE_ATTRIBUTE, mode.name());
            return true;
        } catch (RuntimeException error) {
            return false;
        } finally {
            org.springframework.security.core.context.SecurityContextHolder.setContext(previousSecurity);
            com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext.set(previousMode);
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
