package com.raxim.myscoutee.profile.service;

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
import com.raxim.myscoutee.common.config.properties.AffinityRecomputeProperties;
import com.raxim.myscoutee.profile.data.document.AffinityRecomputeTask;

@Service
public class AffinityRecomputeChangeStreamService {
    private static final Logger LOGGER = LoggerFactory.getLogger(AffinityRecomputeChangeStreamService.class);
    private static final String TRIGGER_STREAM = "change-stream";
    private static final String TRIGGER_TIMER = "change-stream-timer";

    private final MongoTemplate mongoTemplate;
    private final AffinityRecomputeWorkerService workerService;
    private final AffinityRecomputeProperties properties;
    private final AffinityRecomputeMetricsService metricsService;
    private final ExecutorService streamExecutor = Executors.newSingleThreadExecutor(runnable -> {
        Thread thread = new Thread(runnable, "affinity-recompute-change-stream");
        thread.setDaemon(true);
        return thread;
    });
    private final ScheduledExecutorService wakeupExecutor = Executors.newSingleThreadScheduledExecutor(runnable -> {
        Thread thread = new Thread(runnable, "affinity-recompute-wakeup");
        thread.setDaemon(true);
        return thread;
    });
    private final Object wakeupLock = new Object();
    private final NavigableSet<Instant> futureWakeups = new TreeSet<>();

    private volatile boolean running;
    private volatile Future<?> streamTask;
    private ScheduledFuture<?> immediateWakeup;
    private ScheduledFuture<?> futureWakeup;
    private Instant futureWakeupAt;

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
        streamTask = streamExecutor.submit(this::consumeLoop);
    }

    @PreDestroy
    void stop() {
        running = false;
        Future<?> task = streamTask;
        if (task != null) {
            task.cancel(true);
        }
        synchronized (wakeupLock) {
            if (immediateWakeup != null) {
                immediateWakeup.cancel(false);
            }
            if (futureWakeup != null) {
                futureWakeup.cancel(false);
            }
            futureWakeups.clear();
        }
        streamExecutor.shutdownNow();
        wakeupExecutor.shutdownNow();
    }

    void handleTaskChange(AffinityRecomputeTask task) {
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
                .watch()
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
        task.setStatus(fullDocument.getString("status"));
        task.setAvailableAtIso(fullDocument.getString("availableAtIso"));
        handleTaskChange(task);
    }

    private void scheduleImmediateWakeup() {
        synchronized (wakeupLock) {
            if (immediateWakeup != null && !immediateWakeup.isDone()) {
                return;
            }
            long delayMs = Math.max(0L, safeDuration(properties.getChangeStreamWakeupCoalesce()).toMillis());
            immediateWakeup = wakeupExecutor.schedule(() -> {
                synchronized (wakeupLock) {
                    immediateWakeup = null;
                }
                metricsService.recordChangeStreamImmediateWakeup();
                workerService.wakeDueTasks(TRIGGER_STREAM);
            }, delayMs, TimeUnit.MILLISECONDS);
        }
    }

    private void scheduleFutureWakeup(Instant availableAt) {
        synchronized (wakeupLock) {
            futureWakeups.add(availableAt);
            metricsService.recordChangeStreamFutureTimer();
            scheduleNextFutureWakeupLocked();
        }
    }

    private void scheduleNextFutureWakeupLocked() {
        Instant next = futureWakeups.isEmpty() ? null : futureWakeups.first();
        if (next == null) {
            futureWakeupAt = null;
            return;
        }
        if (futureWakeup != null && !futureWakeup.isDone() && next.equals(futureWakeupAt)) {
            return;
        }
        if (futureWakeup != null) {
            futureWakeup.cancel(false);
        }
        futureWakeupAt = next;
        Instant now = Instant.now();
        long delayMs = Math.max(0L, Duration.between(now, next).toMillis());
        if (next.isAfter(now)) {
            delayMs += 1L;
        }
        futureWakeup = wakeupExecutor.schedule(this::runFutureWakeup, delayMs, TimeUnit.MILLISECONDS);
    }

    private void runFutureWakeup() {
        synchronized (wakeupLock) {
            Instant dueBoundary = Instant.now().plusMillis(1L);
            while (!futureWakeups.isEmpty() && !futureWakeups.first().isAfter(dueBoundary)) {
                futureWakeups.pollFirst();
            }
            futureWakeup = null;
            futureWakeupAt = null;
        }
        metricsService.recordChangeStreamTimerWakeup();
        workerService.wakeDueTasks(TRIGGER_TIMER);
        synchronized (wakeupLock) {
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
