package com.raxim.myscoutee.domain.administration.service;

import com.raxim.myscoutee.domain.accounts.api.AdminCounterRefresh;

import com.raxim.myscoutee.domain.administration.api.AdminTelemetryEvent;

import com.raxim.myscoutee.common.redis.RedisStreamRetentionService;
import com.raxim.myscoutee.domain.platform.api.JobGroupContext;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.time.Clock;
import java.time.Duration;
import java.util.concurrent.Executors;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Future;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import java.time.LocalDate;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

import com.raxim.myscoutee.common.config.mongo.MongoChangeStreamService;
import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.connection.stream.MapRecord;
import org.springframework.data.redis.connection.stream.ReadOffset;
import org.springframework.data.redis.connection.stream.StreamOffset;
import org.springframework.data.redis.connection.stream.StreamReadOptions;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.raxim.myscoutee.domain.administration.config.AdminStatsProperties;

import tools.jackson.databind.ObjectMapper;

@Service
public class AdminStatsTelemetryWorkerService {
    @org.springframework.beans.factory.annotation.Autowired
    private com.raxim.myscoutee.domain.notifications.api.NotificationJobs groupRules;
    @org.springframework.beans.factory.annotation.Autowired
    private com.raxim.myscoutee.common.config.mongo.ScheduledMongoSessionRunner groupDatabases;
    private static final Logger LOGGER = LoggerFactory.getLogger(AdminStatsTelemetryWorkerService.class);

    private final StringRedisTemplate stringRedisTemplate;
    private final ObjectMapper objectMapper;
    private final AdminStatsService adminStatsService;
    private final AdminMonitoringService adminMonitoringService;
    private final AdminCounterRefresh adminMenuCounterService;
    private final AdminStatsProperties properties;
    private final RedisStreamRetentionService redisStreamRetentionService;

    private final java.util.Map<String, String> cursors = new java.util.concurrent.ConcurrentHashMap<>();
    private boolean processingFailureLogged;
    private final Object streamMonitor = new Object();
    // One uncommitted batch per stream; disabled or delayed groups cannot grow memory indefinitely.
    private final Map<String, List<MapRecord<String, Object, Object>>> pending = new java.util.HashMap<>();
    private final ExecutorService readerExecutor = Executors.newSingleThreadExecutor(task -> {
        Thread thread = new Thread(task, "admin-telemetry-stream");
        thread.setDaemon(true);
        return thread;
    });
    private volatile boolean running;
    private Future<?> readerTask;
    private final Map<MongoSessionMode, AtomicLong> derivedRevisions = new ConcurrentHashMap<>();
    private final Map<MongoSessionMode, AtomicLong> queueRevisions = new ConcurrentHashMap<>();
    private final Map<String, ProjectionVersion> projected = new ConcurrentHashMap<>();
    private Clock clock = Clock.systemUTC();

    private record ProjectionVersion(long derived, long queues, LocalDate day) {}

    @org.springframework.beans.factory.annotation.Autowired
    void watchInputs(MongoChangeStreamService changes) {
        changes.watch("admin-stat-inputs", Set.of("users", "userAffinityEdges", "userRates", "activityMembers"),
                Set.of(), () -> null, this::invalidateDerived, this::invalidateDerived);
        changes.watch("admin-queue-inputs", Set.of("affinityRecomputeTasks", "notificationOutbox"),
                Set.of(), () -> null, this::invalidateQueues, this::invalidateQueues);
        // Failure counts depend on the last terminal result. A claim only sets running;
        // watching that would make this worker invalidate itself on every successful run.
        changes.watch("admin-job-results", Set.of("notificationRuleConfigs"),
                Set.of("baseGroupId", "ruleKey", "runState.lastRunStatus"), () -> null,
                this::invalidateQueues, this::invalidateQueues);
    }

    private MongoSessionMode databaseMode() {
        return groupDatabases.hasDistinctDemoDatabase() ? MongoSessionModeContext.currentMode() : MongoSessionMode.REAL;
    }

    private void invalidateDerived() {
        derivedRevisions.computeIfAbsent(databaseMode(), ignored -> new AtomicLong()).incrementAndGet();
    }

    private void invalidateQueues() {
        queueRevisions.computeIfAbsent(databaseMode(), ignored -> new AtomicLong()).incrementAndGet();
    }

    public AdminStatsTelemetryWorkerService(
            StringRedisTemplate stringRedisTemplate,
            ObjectMapper objectMapper,
            AdminStatsService adminStatsService,
            AdminMonitoringService adminMonitoringService,
            AdminCounterRefresh adminMenuCounterService,
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

    @PostConstruct
    void startReader() {
        if (!properties.isEnabled()) return;
        running = true;
        readerTask = readerExecutor.submit(this::readLoop);
    }

    @PreDestroy
    void stopReader() {
        running = false;
        synchronized (streamMonitor) { streamMonitor.notifyAll(); }
        if (readerTask != null) readerTask.cancel(true);
        readerExecutor.shutdownNow();
    }

    private void readLoop() {
        boolean unavailable = false;
        while (running && !Thread.currentThread().isInterrupted()) {
            try {
                synchronized (streamMonitor) {
                    while (running && readableOffsets().length == 0) streamMonitor.wait();
                }
                if (!running) return;
                readStreamBatch();
                if (unavailable) LOGGER.info("Admin telemetry Redis reader reconnected.");
                unavailable = false;
            } catch (InterruptedException interrupted) {
                Thread.currentThread().interrupt();
            } catch (RuntimeException error) {
                if (!running || Thread.currentThread().isInterrupted()) return;
                if (!unavailable) LOGGER.warn("Admin telemetry Redis reader unavailable; retrying in five seconds.", error);
                unavailable = true;
                try { Thread.sleep(5000); }
                catch (InterruptedException interrupted) { Thread.currentThread().interrupt(); }
            }
        }
    }

    @Scheduled(fixedDelayString = "${admin.stats.telemetry-window-ms:60000}")
    public void drainTelemetryWindow() {
        if (!properties.isEnabled()) return;
        Set<String> activeStreams = new java.util.HashSet<>();
        groupDatabases.runAcrossConfiguredDatabases(() -> groupRules.forEachGroup("admin-telemetry", () -> {
            activeStreams.add(AdminTelemetryService.streamKey(properties, JobGroupContext.groupId()));
            drainGroup();
        }));
        // Only prune after a successful inventory pass; an unavailable owner is not an empty catalog.
        synchronized (streamMonitor) {
            cursors.keySet().retainAll(activeStreams);
            pending.keySet().retainAll(activeStreams);
            projected.keySet().retainAll(activeStreams);
            streamMonitor.notifyAll();
        }
    }

    private void drainGroup() {
        if (!properties.isEnabled()) return;
        String streamKey = AdminTelemetryService.streamKey(properties, JobGroupContext.groupId());
        try {
            // Capture before reading: a concurrent source mutation remains dirty for the next pass.
            var mode = databaseMode();
            long derived = derivedRevisions.computeIfAbsent(mode, ignored -> new AtomicLong()).get();
            long queues = queueRevisions.computeIfAbsent(mode, ignored -> new AtomicLong()).get();
            LocalDate day = LocalDate.now(clock);
            ProjectionVersion previous = projected.get(streamKey);
            boolean refreshDerived = previous == null || previous.derived() != derived || !day.equals(previous.day());
            boolean refreshQueues = previous == null || previous.queues() != queues;
            cursors.computeIfAbsent(streamKey, ignored -> earlier(adminStatsService.lastTelemetryStreamId().orElse("0-0"),
                    adminMonitoringService.lastTelemetryStreamId().orElse("0-0")));
            List<MapRecord<String, Object, Object>> records;
            synchronized (streamMonitor) {
                records = pending.getOrDefault(streamKey, List.of());
                streamMonitor.notifyAll();
            }
            boolean hasRecords = records != null && !records.isEmpty();
            if (!hasRecords && !refreshDerived && !refreshQueues) return;

            // Keep the admin's enabled/timing settings and the existing atomic claim authoritative.
            // No claim/history write is needed for an unchanged empty stream.
            groupRules.runScheduledGroup("admin-telemetry", () -> {
                if (hasRecords) {
                    applyRecords(streamKey, records, refreshDerived);
                } else if (refreshDerived) {
                    adminStatsService.refreshGraphScienceSnapshot();
                }
                if (hasRecords || refreshQueues || refreshDerived) adminMenuCounterService.refreshAdminMenuCounters();
                projected.put(streamKey, new ProjectionVersion(derived, queues, day));
                if (processingFailureLogged) LOGGER.info("Admin stats telemetry processing resumed.");
                processingFailureLogged = false;
            });
        } catch (RuntimeException exception) {
            // A counter write can fail after the telemetry cursor was committed.
            // Retain reconciliation even when the next Redis read is empty.
            invalidateQueues();
            if (!processingFailureLogged) {
                LOGGER.warn("Admin stats telemetry pass failed; pending work will be retried.", exception);
                processingFailureLogged = true;
            }
        }
    }

    private void applyRecords(String streamKey, List<MapRecord<String, Object, Object>> records,
            boolean refreshDerived) {
        List<AdminTelemetryEvent> statsEvents = new ArrayList<>();
        List<AdminTelemetryEvent> monitoringEvents = new ArrayList<>();
        List<String> recordIds = new ArrayList<>();
        // A prefetched batch may already be committed by another instance, or only
        // one projection may have committed before a failure. Resume each owner separately.
        String statsCommitted = adminStatsService.lastTelemetryStreamId().orElse("0-0");
        String monitoringCommitted = adminMonitoringService.lastTelemetryStreamId().orElse("0-0");
        String statsLatest = statsCommitted;
        String monitoringLatest = monitoringCommitted;
        for (MapRecord<String, Object, Object> record : records) {
            String recordId = record.getId().getValue();
            recordIds.add(recordId);
            boolean forStats = after(recordId, statsCommitted);
            boolean forMonitoring = after(recordId, monitoringCommitted);
            if (forStats) statsLatest = recordId;
            if (forMonitoring) monitoringLatest = recordId;
            if (!forStats && !forMonitoring) continue;
            Object payload = record.getValue().get("payload");
            if (!(payload instanceof String jsonPayload) || jsonPayload.isBlank()) continue;
            try {
                AdminTelemetryEvent event = objectMapper.readValue(jsonPayload, AdminTelemetryEvent.class);
                if (event != null) {
                    if (forStats) statsEvents.add(event);
                    if (forMonitoring) monitoringEvents.add(event);
                }
            } catch (Exception ignored) {
                // Keep draining malformed telemetry records.
            }
        }
        if (after(statsLatest, statsCommitted)) {
            adminStatsService.applyTelemetryEvents(statsEvents, statsLatest, refreshDerived);
        } else if (refreshDerived) {
            adminStatsService.refreshGraphScienceSnapshot();
        }
        if (after(monitoringLatest, monitoringCommitted)) {
            adminMonitoringService.applyTelemetryEvents(monitoringEvents, monitoringLatest);
        }
        String latestId = earlier(statsLatest, monitoringLatest);
        synchronized (streamMonitor) {
            cursors.put(streamKey, latestId);
            pending.remove(streamKey);
            streamMonitor.notifyAll();
        }
        redisStreamRetentionService.deleteRecords(stringRedisTemplate, streamKey, recordIds);
    }

    private static String earlier(String first, String second) {
        return after(first, second) ? second : first;
    }

    private static boolean after(String candidate, String committed) {
        String[] left = candidate.split("-", 2);
        String[] right = committed.split("-", 2);
        int milliseconds = Long.compareUnsigned(Long.parseUnsignedLong(left[0]), Long.parseUnsignedLong(right[0]));
        return milliseconds > 0 || milliseconds == 0
                && Long.compareUnsigned(Long.parseUnsignedLong(left[1]), Long.parseUnsignedLong(right[1])) > 0;
    }

    /** Spring/Lettuce uses a dedicated connection for the blocking command, as in ChatStreamConsumer. */
    void readStreamBatch() {
        StreamOffset<String>[] offsets;
        synchronized (streamMonitor) { offsets = readableOffsets(); }
        if (offsets.length == 0) return;
        List<MapRecord<String, Object, Object>> records = stringRedisTemplate.opsForStream().read(
                StreamReadOptions.empty().count(Math.max(1, properties.getMaxBatchSize())).block(Duration.ofSeconds(30)),
                offsets);
        if (records == null || records.isEmpty()) return;
        Map<String, List<MapRecord<String, Object, Object>>> batches = new java.util.LinkedHashMap<>();
        for (var record : records) batches.computeIfAbsent(record.getStream(), ignored -> new ArrayList<>()).add(record);
        synchronized (streamMonitor) {
            for (var batch : batches.entrySet()) {
                // Ignore an in-flight result for a group removed while the read was blocked.
                if (cursors.containsKey(batch.getKey())) pending.putIfAbsent(batch.getKey(), List.copyOf(batch.getValue()));
            }
        }
    }

    @SuppressWarnings("unchecked")
    private StreamOffset<String>[] readableOffsets() {
        return cursors.entrySet().stream().filter(entry -> !pending.containsKey(entry.getKey()))
                .map(entry -> StreamOffset.create(entry.getKey(), ReadOffset.from(entry.getValue())))
                .toArray(StreamOffset[]::new);
    }
}
