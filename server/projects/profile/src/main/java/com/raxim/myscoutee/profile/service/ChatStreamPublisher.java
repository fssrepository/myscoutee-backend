package com.raxim.myscoutee.profile.service;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.connection.stream.StreamRecords;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class ChatStreamPublisher {
    public static final String STREAM_KEY = "activities:chat:messages";

    private static final Logger LOGGER = LoggerFactory.getLogger(ChatStreamPublisher.class);

    private final StringRedisTemplate stringRedisTemplate;
    private final ObjectMapper objectMapper;

    public ChatStreamPublisher(StringRedisTemplate stringRedisTemplate, ObjectMapper objectMapper) {
        this.stringRedisTemplate = stringRedisTemplate;
        this.objectMapper = objectMapper;
    }

    public boolean publish(ChatStreamEvent event) {
        if (event == null) {
            return false;
        }
        try {
            stringRedisTemplate.opsForStream().add(
                    StreamRecords.mapBacked(Map.of("payload", objectMapper.writeValueAsString(event)))
                            .withStreamKey(STREAM_KEY));
            return true;
        } catch (Exception exception) {
            LOGGER.warn("Unable to publish chat stream event for chat {}.", event.chatId(), exception);
            return false;
        }
    }
}
