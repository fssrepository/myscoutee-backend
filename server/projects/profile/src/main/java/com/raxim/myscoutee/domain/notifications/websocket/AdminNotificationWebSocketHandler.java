package com.raxim.myscoutee.domain.notifications.websocket;

import com.raxim.myscoutee.domain.chat.api.ChatSessionAttributes;

import org.springframework.stereotype.Component;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.util.StringUtils;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.raxim.myscoutee.domain.accounts.api.AuthenticatedActor;
import com.raxim.myscoutee.domain.platform.api.AuthenticationMode;
import com.raxim.myscoutee.domain.administration.api.AdministrativeActors;
import com.raxim.myscoutee.domain.notifications.service.AdminNotificationSocketSessionRegistry;

@Component
public class AdminNotificationWebSocketHandler extends TextWebSocketHandler {
    private final AdminNotificationSocketSessionRegistry sessionRegistry;
    private final AdministrativeActors adminModerationService;
    private final AuthenticationMode configProperties;

    public AdminNotificationWebSocketHandler(
            AdminNotificationSocketSessionRegistry sessionRegistry,
            AdministrativeActors adminModerationService,
            AuthenticationMode configProperties) {
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
        AuthenticatedActor principal = resolvePrincipal(session);
        if (configProperties.isFirebaseEnabled() && (principal == null || principal.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority).noneMatch("A"::equals))) return false;
        var previousMode = com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext.currentMode();
        var previousSecurity = org.springframework.security.core.context.SecurityContextHolder.getContext();
        var security = org.springframework.security.core.context.SecurityContextHolder.createEmptyContext();
        if (session.getPrincipal() instanceof org.springframework.security.core.Authentication authentication) {
            security.setAuthentication(authentication);
        }
        Object sessionKind = session.getAttributes().get(ChatSessionAttributes.SESSION_KIND);
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

    private AuthenticatedActor resolvePrincipal(WebSocketSession session) {
        if (!(session.getPrincipal() instanceof org.springframework.security.core.Authentication authentication)) {
            return null;
        }
        Object principal = authentication.getPrincipal();
        return principal instanceof AuthenticatedActor firebasePrincipal ? firebasePrincipal : null;
    }

    private String resolveQueryValue(WebSocketSession session, String key) {
        var uri = session.getUri();
        String query = uri == null ? "" : uri.getRawQuery();
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
