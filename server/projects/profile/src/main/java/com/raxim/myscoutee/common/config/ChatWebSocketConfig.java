package com.raxim.myscoutee.common.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

import java.util.Arrays;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.util.StringUtils;
import com.raxim.myscoutee.domain.chat.websocket.ChatHandshakeInterceptor;
import com.raxim.myscoutee.domain.chat.websocket.ChatWebSocketHandler;
import com.raxim.myscoutee.domain.notifications.websocket.AdminNotificationWebSocketHandler;

@Configuration
@EnableWebSocket
public class ChatWebSocketConfig implements WebSocketConfigurer {
    private final ChatWebSocketHandler chatWebSocketHandler;
    private final AdminNotificationWebSocketHandler adminNotificationWebSocketHandler;
    private final ChatHandshakeInterceptor chatHandshakeInterceptor;
    private final String[] allowedOrigins;

    public ChatWebSocketConfig(
            ChatWebSocketHandler chatWebSocketHandler,
            AdminNotificationWebSocketHandler adminNotificationWebSocketHandler,
            ChatHandshakeInterceptor chatHandshakeInterceptor,
            @Value("${config.websocket-allowed-origin-patterns:http://localhost,http://localhost:4200,https://localhost,https://localhost:4200}")
            String allowedOriginPatterns) {
        this.chatWebSocketHandler = chatWebSocketHandler;
        this.adminNotificationWebSocketHandler = adminNotificationWebSocketHandler;
        this.chatHandshakeInterceptor = chatHandshakeInterceptor;
        this.allowedOrigins = Arrays.stream(allowedOriginPatterns.split("[,;]"))
                .map(String::trim).filter(StringUtils::hasText).distinct().toArray(String[]::new);
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(chatWebSocketHandler, "/activities/chats/ws")
                .addInterceptors(chatHandshakeInterceptor)
                .setAllowedOriginPatterns(allowedOriginPatterns());
        registry.addHandler(adminNotificationWebSocketHandler, "/admin/notifications/ws")
                .addInterceptors(chatHandshakeInterceptor)
                .setAllowedOriginPatterns(allowedOriginPatterns());
    }

    private String[] allowedOriginPatterns() {
        return allowedOrigins;
    }
}
