package com.raxim.myscoutee.common.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

import com.raxim.myscoutee.common.config.properties.ConfigProperties;
import com.raxim.myscoutee.profile.websocket.ChatHandshakeInterceptor;
import com.raxim.myscoutee.profile.websocket.ChatWebSocketHandler;
import com.raxim.myscoutee.profile.websocket.AdminNotificationWebSocketHandler;

@Configuration
@EnableWebSocket
public class ChatWebSocketConfig implements WebSocketConfigurer {
    private final ChatWebSocketHandler chatWebSocketHandler;
    private final AdminNotificationWebSocketHandler adminNotificationWebSocketHandler;
    private final ChatHandshakeInterceptor chatHandshakeInterceptor;
    private final ConfigProperties configProperties;

    public ChatWebSocketConfig(
            ChatWebSocketHandler chatWebSocketHandler,
            AdminNotificationWebSocketHandler adminNotificationWebSocketHandler,
            ChatHandshakeInterceptor chatHandshakeInterceptor,
            ConfigProperties configProperties) {
        this.chatWebSocketHandler = chatWebSocketHandler;
        this.adminNotificationWebSocketHandler = adminNotificationWebSocketHandler;
        this.chatHandshakeInterceptor = chatHandshakeInterceptor;
        this.configProperties = configProperties;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(chatWebSocketHandler, "/activities/chats/ws")
                .addInterceptors(chatHandshakeInterceptor)
                .setAllowedOriginPatterns(allowedOriginPatterns());
        registry.addHandler(chatWebSocketHandler, "/api/activities/chats/ws")
                .addInterceptors(chatHandshakeInterceptor)
                .setAllowedOriginPatterns(allowedOriginPatterns());
        registry.addHandler(adminNotificationWebSocketHandler, "/admin/notifications/ws")
                .addInterceptors(chatHandshakeInterceptor)
                .setAllowedOriginPatterns(allowedOriginPatterns());
        registry.addHandler(adminNotificationWebSocketHandler, "/api/admin/notifications/ws")
                .addInterceptors(chatHandshakeInterceptor)
                .setAllowedOriginPatterns(allowedOriginPatterns());
    }

    private String[] allowedOriginPatterns() {
        return configProperties.getWebsocketAllowedOriginPatternList().toArray(String[]::new);
    }
}
