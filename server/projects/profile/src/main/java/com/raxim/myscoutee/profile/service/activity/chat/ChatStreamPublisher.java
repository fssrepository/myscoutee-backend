package com.raxim.myscoutee.profile.service.activity.chat;

import java.util.Map;

import org.springframework.data.redis.connection.stream.RecordId;
import org.springframework.data.redis.connection.stream.StreamRecords;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.raxim.myscoutee.profile.data.dto.chat.ChatStreamEvent;

@Service
public class ChatStreamPublisher {
    public static final String STREAM_KEY = "activities:chat:messages";

    private final StringRedisTemplate stringRedisTemplate;
    private final ObjectMapper objectMapper;

    public ChatStreamPublisher(StringRedisTemplate stringRedisTemplate, ObjectMapper objectMapper) {
        this.stringRedisTemplate = stringRedisTemplate;
        this.objectMapper = objectMapper;
    }

    public RecordId publish(ChatStreamEvent event) {
        try {
            return stringRedisTemplate.opsForStream().add(
                    StreamRecords.mapBacked(Map.of("payload", objectMapper.writeValueAsString(event)))
                            .withStreamKey(STREAM_KEY));
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Failed to serialize chat stream event.", e);
        }
    }
}
