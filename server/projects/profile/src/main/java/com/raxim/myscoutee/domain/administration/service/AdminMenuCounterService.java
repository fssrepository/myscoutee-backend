package com.raxim.myscoutee.domain.administration.service;

import com.raxim.myscoutee.domain.platform.api.JobGroupContext;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import com.raxim.myscoutee.domain.notifications.api.NotificationCatalog;
import java.util.Locale;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.raxim.myscoutee.domain.administration.document.AdminMonitoringSnapshot;

import com.raxim.myscoutee.domain.administration.repository.AdminMonitoringRepository;
import com.raxim.myscoutee.domain.affinity.api.RecomputeQueue;

@Service
public class AdminMenuCounterService implements com.raxim.myscoutee.domain.administration.api.AdministratorClassification, com.raxim.myscoutee.domain.administration.api.AdministrativeQueues {

    private final NotificationCatalog notificationCatalog;
    private final RecomputeQueue recomputeQueue;
    private final AdminMonitoringRepository monitoringRepository;

    private record AdminAlertCounters(int jobs, int metrics, AdminQueueCounters queues) {}
    private record AdminQueueCounters(
            long failedRules,
            long recomputePending,
            long recomputeRunning,
            long recomputeFailed,
            long outboxPending,
            long outboxRunning,
            long outboxFailed,
            long outboxSent) {}

    public AdminMenuCounterService(
            NotificationCatalog notificationCatalog,
            RecomputeQueue recomputeQueue,
            AdminMonitoringRepository monitoringRepository) {
        this.notificationCatalog = notificationCatalog;
        this.recomputeQueue = recomputeQueue;
        this.monitoringRepository = monitoringRepository;

    }

    @Override public Counts counters(boolean refreshSnapshot) {
        var counters = currentCounters(refreshSnapshot);
        if (refreshSnapshot) refreshMonitoringQueueSnapshot(counters.queues());
        return new Counts(counters.jobs(), counters.metrics());
    }

    private AdminAlertCounters currentCounters(boolean strict) {
        long failedRules = failedJobs(strict);
        long recomputePending = countAffinityTasks("pending", strict);
        long recomputeRunning = countAffinityTasks("running", strict);
        long recomputeFailed = countAffinityTasks("failed", strict);
        long outboxPending = countOutbox("pending", strict);
        long outboxRunning = countOutbox("running", strict);
        long outboxFailed = countOutbox("failed", strict);
        long outboxSent = countOutbox("sent", strict);
        long failedMetrics = recomputeFailed + outboxFailed + telemetryFailureEvents(strict);
        return new AdminAlertCounters(
                toInt(failedRules),
                toInt(failedMetrics),
                new AdminQueueCounters(
                        failedRules,
                        recomputePending,
                        recomputeRunning,
                        recomputeFailed,
                        outboxPending,
                        outboxRunning,
                        outboxFailed,
                        outboxSent));
    }

    private long failedJobs(boolean strict) {
        try {
            return notificationCatalog.failedJobs(JobGroupContext.groupId());
        } catch (RuntimeException error) {
            if (strict) throw error;
            return 0L;
        }
    }

    private void refreshMonitoringQueueSnapshot(AdminQueueCounters queues) {
        if (queues == null) {
            return;
        }
        AdminMonitoringSnapshot snapshot = monitoringRepository.ensureSnapshot(JobGroupContext.groupId());
        Map<String, Long> nodeCounters = safeMap(snapshot.getNodeCounters());
        nodeCounters.put("queues.rules.failed", queues.failedRules());
        nodeCounters.put("queues.recompute.pending", queues.recomputePending());
        nodeCounters.put("queues.recompute.running", queues.recomputeRunning());
        nodeCounters.put("queues.recompute.failed", queues.recomputeFailed());
        nodeCounters.put("queues.outbox.pending", queues.outboxPending());
        nodeCounters.put("queues.outbox.running", queues.outboxRunning());
        nodeCounters.put("queues.outbox.failed", queues.outboxFailed());
        nodeCounters.put("queues.outbox.sent", queues.outboxSent());
        if (nodeCounters.equals(snapshot.getNodeCounters())) return;
        snapshot.setNodeCounters(nodeCounters);
        snapshot.setGeneratedAtIso(Instant.now().toString());
        monitoringRepository.save(snapshot);
    }

    private long telemetryFailureEvents(boolean strict) {
        try {
            return monitoringRepository.findByMonitoringKey(JobGroupContext.groupId() == null ? "global" : JobGroupContext.groupId())
                    .map(AdminMonitoringSnapshot::getCounters)
                    .map(this::safeMap)
                    .map(counters -> counters.entrySet().stream()
                            .filter(entry -> isFailedStatus(entry.getKey()))
                            .mapToLong(entry -> count(entry.getValue()))
                            .sum())
                    .orElse(0L);
        } catch (RuntimeException error) {
            if (strict) throw error;
            return 0L;
        }
    }

    private long countOutbox(String status, boolean strict) {
        try {
            return notificationCatalog.countOutbox(JobGroupContext.groupId(), status);
        } catch (RuntimeException error) {
            if (strict) throw error;
            return 0L;
        }
    }

    private long countAffinityTasks(String status, boolean strict) {
        try {
            return recomputeQueue.count(JobGroupContext.groupId(), status);
        } catch (RuntimeException error) {
            if (strict) throw error;
            return 0L;
        }
    }

    private boolean isFailedStatus(String value) {
        String normalized = safeText(value).toLowerCase(Locale.ROOT);
        return normalized.contains("failed")
                || normalized.contains("error")
                || normalized.contains("missed")
                || normalized.contains("timeout");
    }

    private Map<String, Long> safeMap(Map<String, Long> source) {
        return source == null ? new LinkedHashMap<>() : new LinkedHashMap<>(source);
    }

    private int count(Number value) {
        if (value == null) {
            return 0;
        }
        return Math.max(0, value.intValue());
    }

    private int toInt(long value) {
        return Math.toIntExact(Math.min(Integer.MAX_VALUE, Math.max(0L, value)));
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }
}
