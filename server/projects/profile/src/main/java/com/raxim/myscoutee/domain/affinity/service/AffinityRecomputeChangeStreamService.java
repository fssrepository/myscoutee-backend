package com.raxim.myscoutee.domain.affinity.service;

import com.raxim.myscoutee.domain.platform.api.JobGroupContext;

import java.time.Duration;
import java.time.Instant;
import java.time.format.DateTimeParseException;
import java.util.NavigableSet;
import java.util.TreeSet;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;

import org.bson.Document;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.model.changestream.ChangeStreamDocument;
import com.mongodb.client.model.changestream.FullDocument;
import com.raxim.myscoutee.domain.affinity.config.AffinityRecomputeProperties;
import com.raxim.myscoutee.domain.affinity.document.AffinityRecomputeTask;

@Service
public class AffinityRecomputeChangeStreamService {
    @org.springframework.beans.factory.annotation.Autowired
    private com.raxim.myscoutee.domain.notifications.api.NotificationJobs groupRules;
    @org.springframework.beans.factory.annotation.Autowired
    private com.raxim.myscoutee.common.config.mongo.ScheduledMongoSessionRunner groupDatabases;
    private static final Logger LOGGER = LoggerFactory.getLogger(AffinityRecomputeChangeStreamService.class);
    private static final String TRIGGER_STREAM = "change-stream";
    private static final String TRIGGER_TIMER = "change-stream-timer";

    private final MongoTemplate mongoTemplate;
    private final AffinityRecomputeWorkerService workerService;
    private final AffinityRecomputeProperties properties;
    private final AffinityRecomputeMetricsService metricsService;
    private final ExecutorService streamExecutor = Executors.newCachedThreadPool(runnable -> {
        Thread thread = new Thread(runnable, "affinity-recompute-change-stream");
        thread.setDaemon(true);
        return thread;
    });
    private final ScheduledExecutorService wakeupExecutor = Executors.newSingleThreadScheduledExecutor(runnable -> {
        Thread thread = new Thread(runnable, "affinity-recompute-wakeup");
        thread.setDaemon(true);
        return thread;
    });
    private static final class Wakeups {
        final Object lock = new Object();
        final NavigableSet<Instant> future = new TreeSet<>();
        ScheduledFuture<?> immediate;
        ScheduledFuture<?> timer;
        Instant timerAt;
    }
    private final java.util.Map<String, Wakeups> wakeups = new java.util.concurrent.ConcurrentHashMap<>();
    private final java.util.List<Future<?>> streamTasks = new java.util.concurrent.CopyOnWriteArrayList<>();
    private volatile boolean running;
    private Wakeups currentWakeups() {
        return wakeups.computeIfAbsent(com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext.currentMode().name()
                + ":" + JobGroupContext.key(), ignored -> new Wakeups());
    }
    private Runnable scoped(Runnable action) {
        String groupId = JobGroupContext.groupId();
        var mode = com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext.currentMode();
        return () -> {
            var previous = com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext.currentMode();
            try {
                com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext.set(mode);
                JobGroupContext.run(groupId, action);
            } finally { com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext.set(previous); }
        };
    }

    public AffinityRecomputeChangeStreamService(
            MongoTemplate mongoTemplate,
            AffinityRecomputeWorkerService workerService,
            AffinityRecomputeProperties properties,
            AffinityRecomputeMetricsService metricsService) {
        this.mongoTemplate = mongoTemplate;
        this.workerService = workerService;
        this.properties = properties;
        this.metricsService = metricsService;
    }

    @PostConstruct
    void start() {
        if (!properties.isEnabled() || !properties.isChangeStreamEnabled()) {
            return;
        }
        running = true;
        groupDatabases.runAcrossConfiguredDatabases(() -> groupRules.forEachGroup("affinity-recompute",
                () -> streamTasks.add(streamExecutor.submit(scoped(this::consumeLoop)))));
    }

    @PreDestroy
    void stop() {
        running = false;
        streamTasks.forEach(task -> task.cancel(true));
        for (Wakeups state : wakeups.values()) {
            synchronized (state.lock) {
                if (state.immediate != null) state.immediate.cancel(false);
                if (state.timer != null) state.timer.cancel(false);
                state.future.clear();
            }
        }
        streamExecutor.shutdownNow();
        wakeupExecutor.shutdownNow();
    }

    void handleTaskChange(AffinityRecomputeTask task) {
        JobGroupContext.run(task == null ? JobGroupContext.groupId() : task.getBaseGroupId(), () -> handleGroupTaskChange(task));
    }

    private void handleGroupTaskChange(AffinityRecomputeTask task) {
        if (task == null || !AffinityRecomputeTaskService.STATUS_PENDING.equals(safeText(task.getStatus()))) {
            metricsService.recordChangeStreamEvent(false);
            return;
        }
        Instant availableAt = parseInstant(task.getAvailableAtIso());
        if (availableAt == null || !availableAt.isAfter(Instant.now())) {
            metricsService.recordChangeStreamEvent(true);
            scheduleImmediateWakeup();
            return;
        }
        metricsService.recordChangeStreamEvent(true);
        scheduleFutureWakeup(availableAt);
    }

    private void consumeLoop() {
        while (running && !Thread.currentThread().isInterrupted()) {
            try {
                consumeChanges();
            } catch (RuntimeException exception) {
                metricsService.recordChangeStreamError();
                LOGGER.warn("Affinity recompute change stream paused; fallback polling remains active.", exception);
                pauseBeforeReconnect();
            }
        }
    }

    private void consumeChanges() {
        MongoCollection<Document> collection = mongoTemplate.getCollection(
                mongoTemplate.getCollectionName(AffinityRecomputeTask.class));
        try (MongoCursor<ChangeStreamDocument<Document>> cursor = collection
                .watch(java.util.List.of(com.mongodb.client.model.Aggregates.match(
                        com.mongodb.client.model.Filters.eq("fullDocument.baseGroupId", JobGroupContext.groupId()))))
                .fullDocument(FullDocument.UPDATE_LOOKUP)
                .iterator()) {
            while (running && !Thread.currentThread().isInterrupted() && cursor.hasNext()) {
                handleChangeDocument(cursor.next());
            }
        }
    }

    private void handleChangeDocument(ChangeStreamDocument<Document> change) {
        Document fullDocument = change == null ? null : change.getFullDocument();
        if (fullDocument == null) {
            metricsService.recordChangeStreamEvent(false);
            return;
        }
        AffinityRecomputeTask task = new AffinityRecomputeTask();
        task.setBaseGroupId(fullDocument.getString("baseGroupId"));
        task.setStatus(fullDocument.getString("status"));
        task.setAvailableAtIso(fullDocument.getString("availableAtIso"));
        handleTaskChange(task);
    }

    private void scheduleImmediateWakeup() {
        synchronized (currentWakeups().lock) {
            if (currentWakeups().immediate != null && !currentWakeups().immediate.isDone()) {
                return;
            }
            long delayMs = Math.max(0L, safeDuration(properties.getChangeStreamWakeupCoalesce()).toMillis());
            currentWakeups().immediate = wakeupExecutor.schedule(scoped(() -> {
                synchronized (currentWakeups().lock) {
                    currentWakeups().immediate = null;
                }
                metricsService.recordChangeStreamImmediateWakeup();
                workerService.wakeDueTasks(TRIGGER_STREAM);
            }), delayMs, TimeUnit.MILLISECONDS);
        }
    }

    private void scheduleFutureWakeup(Instant availableAt) {
        synchronized (currentWakeups().lock) {
            currentWakeups().future.add(availableAt);
            metricsService.recordChangeStreamFutureTimer();
            scheduleNextFutureWakeupLocked();
        }
    }

    private void scheduleNextFutureWakeupLocked() {
        Instant next = currentWakeups().future.isEmpty() ? null : currentWakeups().future.first();
        if (next == null) {
            currentWakeups().timerAt = null;
            return;
        }
        if (currentWakeups().timer != null && !currentWakeups().timer.isDone() && next.equals(currentWakeups().timerAt)) {
            return;
        }
        if (currentWakeups().timer != null) {
            currentWakeups().timer.cancel(false);
        }
        currentWakeups().timerAt = next;
        Instant now = Instant.now();
        long delayMs = Math.max(0L, Duration.between(now, next).toMillis());
        if (next.isAfter(now)) {
            delayMs += 1L;
        }
        currentWakeups().timer = wakeupExecutor.schedule(scoped(this::runFutureWakeup), delayMs, TimeUnit.MILLISECONDS);
    }

    private void runFutureWakeup() {
        synchronized (currentWakeups().lock) {
            Instant dueBoundary = Instant.now().plusMillis(1L);
            while (!currentWakeups().future.isEmpty() && !currentWakeups().future.first().isAfter(dueBoundary)) {
                currentWakeups().future.pollFirst();
            }
            currentWakeups().timer = null;
            currentWakeups().timerAt = null;
        }
        metricsService.recordChangeStreamTimerWakeup();
        workerService.wakeDueTasks(TRIGGER_TIMER);
        synchronized (currentWakeups().lock) {
            scheduleNextFutureWakeupLocked();
        }
    }

    private void pauseBeforeReconnect() {
        try {
            Thread.sleep(Math.max(100L, safeDuration(properties.getChangeStreamReconnectDelay()).toMillis()));
        } catch (InterruptedException interruptedException) {
            Thread.currentThread().interrupt();
        }
    }

    private Duration safeDuration(Duration duration) {
        return duration == null || duration.isNegative() ? Duration.ZERO : duration;
    }

    private Instant parseInstant(String value) {
        String text = safeText(value);
        if (!StringUtils.hasText(text)) {
            return null;
        }
        try {
            return Instant.parse(text);
        } catch (DateTimeParseException ignored) {
            return null;
        }
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }
}
