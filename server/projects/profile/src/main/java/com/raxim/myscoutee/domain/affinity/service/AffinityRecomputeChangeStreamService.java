package com.raxim.myscoutee.domain.affinity.service;

import com.raxim.myscoutee.domain.platform.api.JobGroupContext;

import java.time.Duration;
import java.time.Instant;
import java.time.format.DateTimeParseException;
import java.util.NavigableSet;
import java.util.TreeSet;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.domain.affinity.config.AffinityRecomputeProperties;
import com.raxim.myscoutee.domain.affinity.document.AffinityRecomputeTask;

@Service
public class AffinityRecomputeChangeStreamService {
    private static final Logger LOGGER = LoggerFactory.getLogger(AffinityRecomputeChangeStreamService.class);
    private static final String TRIGGER_STREAM = "change-stream";
    private static final String TRIGGER_TIMER = "change-stream-timer";

    private final MongoTemplate mongoTemplate;
    private final AffinityRecomputeWorkerService workerService;
    private final AffinityRecomputeProperties properties;
    private final AffinityRecomputeMetricsService metricsService;
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
    private final com.raxim.myscoutee.common.config.mongo.MongoChangeStreamService changes;
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
            AffinityRecomputeMetricsService metricsService,
            com.raxim.myscoutee.common.config.mongo.MongoChangeStreamService changes) {
        this.changes = changes;

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
        changes.watch("affinity-recompute", java.util.Set.of(mongoTemplate.getCollectionName(AffinityRecomputeTask.class)),
                java.util.Set.of("status", "availableAtIso", "baseGroupId"), () -> {
                    restorePendingWakeups();
                    return null;
                }, metricsService::recordChangeStreamError);
    }

    @PreDestroy
    void stop() {
        for (Wakeups state : wakeups.values()) {
            synchronized (state.lock) {
                if (state.immediate != null) state.immediate.cancel(false);
                if (state.timer != null) state.timer.cancel(false);
                state.future.clear();
            }
        }
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

    void restorePendingWakeups() {
        var query = org.springframework.data.mongodb.core.query.Query.query(
                org.springframework.data.mongodb.core.query.Criteria.where("status")
                        .is(AffinityRecomputeTaskService.STATUS_PENDING));
        query.fields().include("baseGroupId").include("status").include("availableAtIso");
        try (var tasks = mongoTemplate.stream(query, AffinityRecomputeTask.class)) {
            tasks.forEach(this::handleTaskChange);
        }
    }

    private void wakeWorker(String trigger) {
        try {
            workerService.wakeDueTasks(trigger);
        } catch (RuntimeException failure) {
            // Remote rule admission may fail before the worker claims a task.
            // Keep recovery attached to actual pending work, not an idle poll.
            LOGGER.warn("Affinity task wake-up failed; pending work will be retried ({}).",
                    failure.getClass().getSimpleName());
        }
        // A coalesced notification can cover more than one worker batch. Only
        // actual remaining work schedules another attempt; empty queues sleep.
        var query = org.springframework.data.mongodb.core.query.Query.query(
                org.springframework.data.mongodb.core.query.Criteria.where("baseGroupId")
                        .is(JobGroupContext.groupId()).and("status")
                        .is(AffinityRecomputeTaskService.STATUS_PENDING));
        query.with(org.springframework.data.domain.Sort.by("availableAtIso")).limit(1);
        query.fields().include("availableAtIso");
        var next = mongoTemplate.findOne(query, AffinityRecomputeTask.class);
        if (next != null) {
            Instant due = parseInstant(next.getAvailableAtIso());
            // Bounded retry also covers rejected admission or a transient worker
            // failure without a global database polling loop.
            Instant retry = Instant.now().plus(safeDuration(properties.getChangeStreamReconnectDelay()));
            scheduleFutureWakeup(due != null && due.isAfter(retry) ? due : retry);
        }
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
                wakeWorker(TRIGGER_STREAM);
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
        wakeWorker(TRIGGER_TIMER);
        synchronized (currentWakeups().lock) {
            scheduleNextFutureWakeupLocked();
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
