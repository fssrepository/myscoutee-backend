package com.raxim.myscoutee.profile.service;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.connection.stream.StreamRecords;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.common.config.properties.AdminStatsProperties;

import tools.jackson.databind.ObjectMapper;

@Service
public class AdminTelemetryService {
    private static final Logger LOGGER = LoggerFactory.getLogger(AdminTelemetryService.class);

    private final StringRedisTemplate stringRedisTemplate;
    private final ObjectMapper objectMapper;
    private final AdminStatsProperties properties;

    public AdminTelemetryService(
            StringRedisTemplate stringRedisTemplate,
            ObjectMapper objectMapper,
            AdminStatsProperties properties) {
        this.stringRedisTemplate = stringRedisTemplate;
        this.objectMapper = objectMapper;
        this.properties = properties;
    }

    public void record(String eventKey, String domain, String entityId, String actorUserId) {
        record(eventKey, domain, entityId, actorUserId, 1L, Map.of());
    }

    public void record(String eventKey, String domain, String entityId, String actorUserId, long amount) {
        record(eventKey, domain, entityId, actorUserId, amount, Map.of());
    }

    public void record(
            String eventKey,
            String domain,
            String entityId,
            String actorUserId,
            long amount,
            Map<String, String> tags) {
        if (!properties.isEnabled()) {
            return;
        }
        String normalizedEventKey = safeText(eventKey);
        if (!StringUtils.hasText(normalizedEventKey)) {
            return;
        }
        AdminTelemetryEvent event = new AdminTelemetryEvent(
                normalizedEventKey,
                safeText(domain),
                safeText(entityId),
                safeText(actorUserId),
                Math.max(1L, amount),
                Instant.now().toString(),
                normalizeTags(tags));
        try {
            stringRedisTemplate.opsForStream().add(
                    StreamRecords.mapBacked(Map.of("payload", objectMapper.writeValueAsString(event)))
                            .withStreamKey(properties.getStreamKey()));
        } catch (Exception exception) {
            LOGGER.warn("Unable to enqueue admin telemetry event {}.", normalizedEventKey, exception);
        }
    }

    private Map<String, String> normalizeTags(Map<String, String> tags) {
        if (tags == null || tags.isEmpty()) {
            return Map.of();
        }
        Map<String, String> normalized = new LinkedHashMap<>();
        for (Map.Entry<String, String> entry : tags.entrySet()) {
            String key = safeText(entry.getKey());
            String value = safeText(entry.getValue());
            if (StringUtils.hasText(key) && StringUtils.hasText(value)) {
                normalized.put(key, value);
            }
        }
        return normalized;
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }
}
