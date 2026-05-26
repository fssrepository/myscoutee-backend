package com.raxim.myscoutee.profile.service;

import java.time.Duration;
import java.time.Instant;
import java.time.format.DateTimeParseException;
import java.util.concurrent.atomic.LongAdder;

import org.springframework.stereotype.Service;

import com.raxim.myscoutee.profile.data.document.AffinityRecomputeTask;

@Service
public class AffinityRecomputeMetricsService {
    private final LongAdder scheduledPasses = new LongAdder();
    private final LongAdder wakeupPasses = new LongAdder();
    private final LongAdder emptyPasses = new LongAdder();
    private final LongAdder busySkips = new LongAdder();
    private final LongAdder taskReadCount = new LongAdder();
    private final LongAdder taskReadDurationMs = new LongAdder();
    private final LongAdder tasksDue = new LongAdder();
    private final LongAdder tasksLeased = new LongAdder();
    private final LongAdder taskDueToRunningCount = new LongAdder();
    private final LongAdder taskDueToRunningMs = new LongAdder();
    private final LongAdder taskEnqueueToRunningCount = new LongAdder();
    private final LongAdder taskEnqueueToRunningMs = new LongAdder();
    private final LongAdder recomputeRuntimeCount = new LongAdder();
    private final LongAdder recomputeRuntimeMs = new LongAdder();
    private final LongAdder changeStreamEvents = new LongAdder();
    private final LongAdder changeStreamIgnoredEvents = new LongAdder();
    private final LongAdder changeStreamImmediateWakeups = new LongAdder();
    private final LongAdder changeStreamTimerWakeups = new LongAdder();
    private final LongAdder changeStreamFutureTimers = new LongAdder();
    private final LongAdder changeStreamErrors = new LongAdder();

    public void recordWorkerBusySkip() {
        busySkips.increment();
    }

    public void recordWorkerPass(String trigger, int dueCount, int leasedCount, long readMs, long runtimeMs) {
        if ("scheduled".equals(trigger)) {
            scheduledPasses.increment();
        } else {
            wakeupPasses.increment();
        }
        if (leasedCount <= 0) {
            emptyPasses.increment();
        }
        taskReadCount.increment();
        taskReadDurationMs.add(Math.max(0L, readMs));
        tasksDue.add(Math.max(0, dueCount));
        tasksLeased.add(Math.max(0, leasedCount));
        recomputeRuntimeCount.increment();
        recomputeRuntimeMs.add(Math.max(0L, runtimeMs));
    }

    public void recordTaskLeased(AffinityRecomputeTask task, Instant runningAt) {
        Instant now = runningAt == null ? Instant.now() : runningAt;
        Instant availableAt = parseInstant(task == null ? null : task.getAvailableAtIso());
        if (availableAt != null) {
            taskDueToRunningCount.increment();
            taskDueToRunningMs.add(Math.max(0L, Duration.between(availableAt, now).toMillis()));
        }
        Instant queuedAt = parseInstant(firstNonBlank(
                task == null ? null : task.getUpdatedDate(),
                task == null ? null : task.getCreatedDate()));
        if (queuedAt != null) {
            taskEnqueueToRunningCount.increment();
            taskEnqueueToRunningMs.add(Math.max(0L, Duration.between(queuedAt, now).toMillis()));
        }
    }

    public void recordChangeStreamEvent(boolean useful) {
        changeStreamEvents.increment();
        if (!useful) {
            changeStreamIgnoredEvents.increment();
        }
    }

    public void recordChangeStreamImmediateWakeup() {
        changeStreamImmediateWakeups.increment();
    }

    public void recordChangeStreamFutureTimer() {
        changeStreamFutureTimers.increment();
    }

    public void recordChangeStreamTimerWakeup() {
        changeStreamTimerWakeups.increment();
    }

    public void recordChangeStreamError() {
        changeStreamErrors.increment();
    }

    public Snapshot snapshot() {
        long dueToRunningCount = taskDueToRunningCount.sum();
        long enqueueToRunningCount = taskEnqueueToRunningCount.sum();
        long runtimeCount = recomputeRuntimeCount.sum();
        long readCount = taskReadCount.sum();
        return new Snapshot(
                scheduledPasses.sum(),
                wakeupPasses.sum(),
                emptyPasses.sum(),
                busySkips.sum(),
                readCount,
                readCount == 0L ? 0L : taskReadDurationMs.sum() / readCount,
                tasksDue.sum(),
                tasksLeased.sum(),
                dueToRunningCount,
                dueToRunningCount == 0L ? 0L : taskDueToRunningMs.sum() / dueToRunningCount,
                enqueueToRunningCount,
                enqueueToRunningCount == 0L ? 0L : taskEnqueueToRunningMs.sum() / enqueueToRunningCount,
                runtimeCount,
                runtimeCount == 0L ? 0L : recomputeRuntimeMs.sum() / runtimeCount,
                changeStreamEvents.sum(),
                changeStreamIgnoredEvents.sum(),
                changeStreamImmediateWakeups.sum(),
                changeStreamTimerWakeups.sum(),
                changeStreamFutureTimers.sum(),
                changeStreamErrors.sum());
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

    public record Snapshot(
            long scheduledPasses,
            long wakeupPasses,
            long emptyPasses,
            long busySkips,
            long taskReadCount,
            long avgTaskReadMs,
            long tasksDue,
            long tasksLeased,
            long dueToRunningSamples,
            long avgDueToRunningMs,
            long enqueueToRunningSamples,
            long avgEnqueueToRunningMs,
            long recomputeRuntimeSamples,
            long avgRecomputeRuntimeMs,
            long changeStreamEvents,
            long changeStreamIgnoredEvents,
            long changeStreamImmediateWakeups,
            long changeStreamTimerWakeups,
            long changeStreamFutureTimers,
            long changeStreamErrors) {}
}
