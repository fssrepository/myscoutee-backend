package com.raxim.myscoutee.domain.affinity.service;

import com.raxim.myscoutee.domain.platform.api.JobGroupContext;

import java.time.Duration;
import java.time.Instant;
import java.time.format.DateTimeParseException;
import java.util.concurrent.atomic.LongAdder;

import org.springframework.stereotype.Service;

import com.raxim.myscoutee.domain.affinity.document.AffinityRecomputeTask;

@Service
public class AffinityRecomputeMetricsService implements com.raxim.myscoutee.domain.affinity.api.RecomputeMetrics {
    private static final class Counters {
        final LongAdder scheduledPasses = new LongAdder();
        final LongAdder wakeupPasses = new LongAdder();
        final LongAdder emptyPasses = new LongAdder();
        final LongAdder busySkips = new LongAdder();
        final LongAdder taskReadCount = new LongAdder();
        final LongAdder taskReadDurationMs = new LongAdder();
        final LongAdder tasksDue = new LongAdder();
        final LongAdder tasksLeased = new LongAdder();
        final LongAdder taskDueToRunningCount = new LongAdder();
        final LongAdder taskDueToRunningMs = new LongAdder();
        final LongAdder taskEnqueueToRunningCount = new LongAdder();
        final LongAdder taskEnqueueToRunningMs = new LongAdder();
        final LongAdder recomputeRuntimeCount = new LongAdder();
        final LongAdder recomputeRuntimeMs = new LongAdder();
        final LongAdder changeStreamEvents = new LongAdder();
        final LongAdder changeStreamIgnoredEvents = new LongAdder();
        final LongAdder changeStreamImmediateWakeups = new LongAdder();
        final LongAdder changeStreamTimerWakeups = new LongAdder();
        final LongAdder changeStreamFutureTimers = new LongAdder();
        final LongAdder changeStreamErrors = new LongAdder();
    }
    private final java.util.concurrent.ConcurrentMap<String, Counters> counters = new java.util.concurrent.ConcurrentHashMap<>();
    private Counters current() {
        return counters.computeIfAbsent(com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext.currentMode().name()
                + ":" + JobGroupContext.key(), ignored -> new Counters());
    }

    public void recordWorkerBusySkip() {
        current().busySkips.increment();
    }

    public void recordWorkerPass(String trigger, int dueCount, int leasedCount, long readMs, long runtimeMs) {
        if ("scheduled".equals(trigger)) {
            current().scheduledPasses.increment();
        } else {
            current().wakeupPasses.increment();
        }
        if (leasedCount <= 0) {
            current().emptyPasses.increment();
        }
        current().taskReadCount.increment();
        current().taskReadDurationMs.add(Math.max(0L, readMs));
        current().tasksDue.add(Math.max(0, dueCount));
        current().tasksLeased.add(Math.max(0, leasedCount));
        current().recomputeRuntimeCount.increment();
        current().recomputeRuntimeMs.add(Math.max(0L, runtimeMs));
    }

    public void recordTaskLeased(AffinityRecomputeTask task, Instant runningAt) {
        Instant now = runningAt == null ? Instant.now() : runningAt;
        Instant availableAt = parseInstant(task == null ? null : task.getAvailableAtIso());
        if (availableAt != null) {
            current().taskDueToRunningCount.increment();
            current().taskDueToRunningMs.add(Math.max(0L, Duration.between(availableAt, now).toMillis()));
        }
        Instant queuedAt = parseInstant(firstNonBlank(
                task == null ? null : task.getUpdatedDate(),
                task == null ? null : task.getCreatedDate()));
        if (queuedAt != null) {
            current().taskEnqueueToRunningCount.increment();
            current().taskEnqueueToRunningMs.add(Math.max(0L, Duration.between(queuedAt, now).toMillis()));
        }
    }

    public void recordChangeStreamEvent(boolean useful) {
        current().changeStreamEvents.increment();
        if (!useful) {
            current().changeStreamIgnoredEvents.increment();
        }
    }

    public void recordChangeStreamImmediateWakeup() {
        current().changeStreamImmediateWakeups.increment();
    }

    public void recordChangeStreamFutureTimer() {
        current().changeStreamFutureTimers.increment();
    }

    public void recordChangeStreamTimerWakeup() {
        current().changeStreamTimerWakeups.increment();
    }

    public void recordChangeStreamError() {
        current().changeStreamErrors.increment();
    }

    public Snapshot snapshot() {
        long dueToRunningCount = current().taskDueToRunningCount.sum();
        long enqueueToRunningCount = current().taskEnqueueToRunningCount.sum();
        long runtimeCount = current().recomputeRuntimeCount.sum();
        long readCount = current().taskReadCount.sum();
        return new Snapshot(
                current().scheduledPasses.sum(),
                current().wakeupPasses.sum(),
                current().emptyPasses.sum(),
                current().busySkips.sum(),
                readCount,
                readCount == 0L ? 0L : current().taskReadDurationMs.sum() / readCount,
                current().tasksDue.sum(),
                current().tasksLeased.sum(),
                dueToRunningCount,
                dueToRunningCount == 0L ? 0L : current().taskDueToRunningMs.sum() / dueToRunningCount,
                enqueueToRunningCount,
                enqueueToRunningCount == 0L ? 0L : current().taskEnqueueToRunningMs.sum() / enqueueToRunningCount,
                runtimeCount,
                runtimeCount == 0L ? 0L : current().recomputeRuntimeMs.sum() / runtimeCount,
                current().changeStreamEvents.sum(),
                current().changeStreamIgnoredEvents.sum(),
                current().changeStreamImmediateWakeups.sum(),
                current().changeStreamTimerWakeups.sum(),
                current().changeStreamFutureTimers.sum(),
                current().changeStreamErrors.sum());
    }

    private Instant parseInstant(String value) {
        String text = safeText(value);
        if (text.isEmpty()) {
            return null;
        }
        try {
            return Instant.parse(text);
        } catch (DateTimeParseException ignored) {
            return null;
        }
    }

    private String firstNonBlank(String first, String second) {
        String left = safeText(first);
        return left.isEmpty() ? safeText(second) : left;
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }

}
