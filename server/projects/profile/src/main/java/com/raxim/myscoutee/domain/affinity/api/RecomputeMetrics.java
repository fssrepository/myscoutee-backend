package com.raxim.myscoutee.domain.affinity.api;

public interface RecomputeMetrics {
    Snapshot snapshot();
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
