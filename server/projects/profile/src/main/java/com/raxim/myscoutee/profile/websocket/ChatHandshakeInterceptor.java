package com.raxim.myscoutee.profile.websocket;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;
import org.springframework.web.util.UriComponentsBuilder;

@Component
public class ChatHandshakeInterceptor implements HandshakeInterceptor {
    public static final String CHAT_ID_ATTRIBUTE = "chatId";
    public static final String USER_ID_ATTRIBUTE = "userId";

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
            WebSocketHandler wsHandler, Map<String, Object> attributes) {
        var queryParams = UriComponentsBuilder.fromUri(request.getURI()).build().getQueryParams();
        String chatId = queryParams.getFirst("chatId");
        if (!StringUtils.hasText(chatId)) {
            response.setStatusCode(HttpStatus.BAD_REQUEST);
            return false;
        }
        attributes.put(CHAT_ID_ATTRIBUTE, chatId.trim());
        String userId = queryParams.getFirst("userId");
        if (StringUtils.hasText(userId)) {
            attributes.put(USER_ID_ATTRIBUTE, userId.trim());
        }
        return true;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
            WebSocketHandler wsHandler, Exception exception) {
        // no-op
    }
}
