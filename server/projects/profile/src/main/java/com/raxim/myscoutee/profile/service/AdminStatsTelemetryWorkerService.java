package com.raxim.myscoutee.profile.service;

import java.util.ArrayList;
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
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.common.config.properties.AdminStatsProperties;

import tools.jackson.databind.ObjectMapper;

@Service
public class AdminStatsTelemetryWorkerService {
    private static final Logger LOGGER = LoggerFactory.getLogger(AdminStatsTelemetryWorkerService.class);

    private final StringRedisTemplate stringRedisTemplate;
    private final ObjectMapper objectMapper;
    private final AdminStatsService adminStatsService;
    private final AdminMonitoringService adminMonitoringService;
    private final AdminMenuCounterService adminMenuCounterService;
    private final AdminStatsProperties properties;
    private final RedisStreamRetentionService redisStreamRetentionService;

    private String lastSeenId = "";
    private boolean streamUnavailableLogged;

    public AdminStatsTelemetryWorkerService(
            StringRedisTemplate stringRedisTemplate,
            ObjectMapper objectMapper,
            AdminStatsService adminStatsService,
            AdminMonitoringService adminMonitoringService,
            AdminMenuCounterService adminMenuCounterService,
            AdminStatsProperties properties,
            RedisStreamRetentionService redisStreamRetentionService) {
        this.stringRedisTemplate = stringRedisTemplate;
        this.objectMapper = objectMapper;
        this.adminStatsService = adminStatsService;
        this.adminMonitoringService = adminMonitoringService;
        this.adminMenuCounterService = adminMenuCounterService;
        this.properties = properties;
        this.redisStreamRetentionService = redisStreamRetentionService;
    }

    @Scheduled(fixedDelayString = "${admin.stats.telemetry-window-ms:60000}")
    public void drainTelemetryWindow() {
        if (!properties.isEnabled()) {
            return;
        }
        try {
            String offset = StringUtils.hasText(lastSeenId)
                    ? lastSeenId
                    : adminStatsService.lastTelemetryStreamId().orElse("0-0");
            List<MapRecord<String, Object, Object>> records = readRecords(offset);
            if (streamUnavailableLogged) {
                LOGGER.info("Admin stats telemetry stream worker reconnected.");
                streamUnavailableLogged = false;
            }
            if (records == null || records.isEmpty()) {
                adminStatsService.refreshGraphScienceSnapshot();
                adminMenuCounterService.refreshAdminMenuCounters();
                return;
            }

            List<AdminTelemetryEvent> events = new ArrayList<>();
            List<String> recordIds = new ArrayList<>();
            String latestId = offset;
            for (MapRecord<String, Object, Object> record : records) {
                latestId = record.getId().getValue();
                recordIds.add(record.getId().getValue());
                Object payload = record.getValue().get("payload");
                if (!(payload instanceof String jsonPayload) || jsonPayload.isBlank()) {
                    continue;
                }
                try {
                    AdminTelemetryEvent event = objectMapper.readValue(jsonPayload, AdminTelemetryEvent.class);
                    if (event != null) {
                        events.add(event);
                    }
                } catch (Exception ignored) {
                    // Keep draining malformed telemetry records.
                }
            }
            lastSeenId = latestId;
            adminStatsService.applyTelemetryEvents(events, latestId);
            adminMonitoringService.applyTelemetryEvents(events, latestId);
            adminMenuCounterService.refreshAdminMenuCounters();
            redisStreamRetentionService.deleteRecords(stringRedisTemplate, properties.getStreamKey(), recordIds);
        } catch (Exception exception) {
            if (!streamUnavailableLogged) {
                LOGGER.warn("Admin stats telemetry worker paused because Redis is unavailable.", exception);
                streamUnavailableLogged = true;
            }
        }
    }

    @SuppressWarnings("unchecked")
    private List<MapRecord<String, Object, Object>> readRecords(String offset) {
        return stringRedisTemplate.opsForStream().read(
                StreamReadOptions.empty().count(Math.max(1, properties.getMaxBatchSize())),
                StreamOffset.create(properties.getStreamKey(), ReadOffset.from(offset)));
    }
}
