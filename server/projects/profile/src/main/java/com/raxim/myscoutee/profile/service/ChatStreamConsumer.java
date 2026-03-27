package com.raxim.myscoutee.profile.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.connection.stream.MapRecord;
import org.springframework.data.redis.connection.stream.ReadOffset;
import org.springframework.data.redis.connection.stream.StreamOffset;
import org.springframework.data.redis.connection.stream.StreamReadOptions;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class ChatStreamConsumer {
    private static final Logger LOGGER = LoggerFactory.getLogger(ChatStreamConsumer.class);

    private final StringRedisTemplate stringRedisTemplate;
    private final ObjectMapper objectMapper;
    private final ChatWebSocketSessionRegistry sessionRegistry;

    private String lastSeenId = "0-0";
    private boolean streamUnavailableLogged;

    public ChatStreamConsumer(
            StringRedisTemplate stringRedisTemplate,
            ObjectMapper objectMapper,
            ChatWebSocketSessionRegistry sessionRegistry) {
        this.stringRedisTemplate = stringRedisTemplate;
        this.objectMapper = objectMapper;
        this.sessionRegistry = sessionRegistry;
    }

    @Scheduled(fixedDelayString = "${chat.stream.poll-delay-ms:250}")
    public void poll() {
        try {
            List<MapRecord<String, Object, Object>> records = readRecords();
            if (streamUnavailableLogged) {
                LOGGER.info("Chat Redis stream consumer reconnected.");
                streamUnavailableLogged = false;
            }
            if (records == null || records.isEmpty()) {
                return;
            }
            for (MapRecord<String, Object, Object> record : records) {
                lastSeenId = record.getId().getValue();
                Object payload = record.getValue().get("payload");
                if (!(payload instanceof String jsonPayload) || jsonPayload.isBlank()) {
                    continue;
                }
                try {
                    ChatStreamEvent event = objectMapper.readValue(jsonPayload, ChatStreamEvent.class);
                    sessionRegistry.broadcast(event);
                } catch (Exception ignored) {
                    // Ignore malformed records and keep draining the stream.
                }
            }
        } catch (Exception exception) {
            if (!streamUnavailableLogged) {
                LOGGER.warn("Chat Redis stream consumer paused because Redis is unavailable.", exception);
                streamUnavailableLogged = true;
            }
        }
    }

    @SuppressWarnings("unchecked")
    private List<MapRecord<String, Object, Object>> readRecords() {
        return stringRedisTemplate.opsForStream().read(
                StreamReadOptions.empty().count(100),
                StreamOffset.create(ChatStreamPublisher.STREAM_KEY, ReadOffset.from(lastSeenId)));
    }
}
