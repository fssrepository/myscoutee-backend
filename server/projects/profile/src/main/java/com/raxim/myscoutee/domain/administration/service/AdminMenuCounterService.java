package com.raxim.myscoutee.domain.administration.service;

import com.raxim.myscoutee.domain.affinity.service.AffinityRecomputeTaskService;
import com.raxim.myscoutee.domain.platform.service.JobGroupContext;

import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import com.raxim.myscoutee.domain.notifications.api.NotificationCatalog;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.domain.administration.document.AdminMonitoringSnapshot;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.administration.repository.AdminMonitoringRepository;
import com.raxim.myscoutee.domain.affinity.repository.AffinityRecomputeTasksRepository;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;

@Service
public class AdminMenuCounterService {
    private static final List<String> DEMO_ADMIN_IDS = List.of("admin-demo-ava", "admin-demo-noel");

    private final NotificationCatalog notificationCatalog;
    private final AffinityRecomputeTasksRepository affinityRecomputeTasksRepository;
    private final AdminMonitoringRepository monitoringRepository;
    private final UsersRepository usersRepository;

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
            AffinityRecomputeTasksRepository affinityRecomputeTasksRepository,
            AdminMonitoringRepository monitoringRepository,
            UsersRepository usersRepository) {
        this.notificationCatalog = notificationCatalog;
        this.affinityRecomputeTasksRepository = affinityRecomputeTasksRepository;
        this.monitoringRepository = monitoringRepository;
        this.usersRepository = usersRepository;
    }

    public void refreshAdminMenuCounters() {
        Map<String, AdminAlertCounters> scoped = new LinkedHashMap<>();
        for (Users admin : adminUsers()) {
            if (JobGroupContext.isActive() && !java.util.Objects.equals(JobGroupContext.groupId(), admin.getWorkspaceGroupId())) continue;
            Users.UserActivitiesRecord before = admin.getActivities();
            String groupId = admin.getWorkspaceGroupId();
            String key = groupId == null ? "global" : groupId;
            Users updated = applyCounters(admin, scoped.computeIfAbsent(key, ignored -> JobGroupContext.call(groupId, () -> {
                var counters = currentCounters();
                refreshMonitoringQueueSnapshot(counters.queues());
                return counters;
            })));
            if (!activitiesEqual(before, updated.getActivities())) {
                usersRepository.save(updated);
            }
        }
    }

    public Users syncAdminUserCounters(Users user) {
        if (!isAdminUser(user)) {
            return user;
        }
        Users.UserActivitiesRecord before = user.getActivities();
        Users updated = applyCounters(user, JobGroupContext.call(user.getWorkspaceGroupId(), this::currentCounters));
        if (activitiesEqual(before, updated.getActivities())) {
            return user;
        }
        return usersRepository.save(updated);
    }

    public boolean isAdminUser(Users user) {
        if (user == null) {
            return false;
        }
        return "admin".equalsIgnoreCase(safeText(user.getHostTier()))
                || "admin workspace".equalsIgnoreCase(safeText(user.getStatusText()))
                || DEMO_ADMIN_IDS.contains(safeText(user.getUserId()));
    }

    private List<Users> adminUsers() {
        Map<String, Users> byId = new LinkedHashMap<>();
        for (Users user : usersRepository.findByHostTier("Admin")) {
            if (user != null && StringUtils.hasText(safeText(user.getUserId()))) {
                byId.put(safeText(user.getUserId()), user);
            }
        }
        for (Users user : usersRepository.findByUserIdIn(DEMO_ADMIN_IDS)) {
            if (user != null && StringUtils.hasText(safeText(user.getUserId()))) {
                byId.put(safeText(user.getUserId()), user);
            }
        }
        return new ArrayList<>(byId.values());
    }

    private Users applyCounters(Users user, AdminAlertCounters counters) {
        if (user == null) {
            return user;
        }
        Users.UserActivitiesRecord existing = user.getActivities();
        Users.UserActivitiesRecord next = new Users.UserActivitiesRecord(
                count(existing == null ? null : existing.game()),
                count(existing == null ? null : existing.chats()),
                count(existing == null ? null : existing.invitations()),
                count(existing == null ? null : existing.events()),
                count(existing == null ? null : existing.hosting()),
                count(existing == null ? null : existing.cars()),
                count(existing == null ? null : existing.accommodation()),
                count(existing == null ? null : existing.supplies()),
                count(existing == null ? null : existing.tickets()),
                count(existing == null ? null : existing.contacts()),
                count(existing == null ? null : existing.feedback()),
                existing == null ? null : existing.chat(),
                existing == null ? null : existing.event(),
                existing == null ? null : existing.asset(),
                existing == null ? null : existing.eventFeedback(),
                counters.jobs(),
                counters.metrics(),
                count(existing == null ? null : existing.notifications()),
                count(existing == null ? null : existing.serviceFeedbackPending()));
        if (activitiesEqual(existing, next)) {
            return user;
        }
        user.setActivities(next);
        return user;
    }

    private AdminAlertCounters currentCounters() {
        long failedRules = failedJobs();
        long recomputePending = countAffinityTasks(AffinityRecomputeTaskService.STATUS_PENDING);
        long recomputeRunning = countAffinityTasks(AffinityRecomputeTaskService.STATUS_RUNNING);
        long recomputeFailed = countAffinityTasks(AffinityRecomputeTaskService.STATUS_FAILED);
        long outboxPending = countOutbox("pending");
        long outboxRunning = countOutbox("running");
        long outboxFailed = countOutbox("failed");
        long outboxSent = countOutbox("sent");
        long failedMetrics = recomputeFailed + outboxFailed + telemetryFailureEvents();
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

    private long failedJobs() {
        try {
            return notificationCatalog.failedJobs(JobGroupContext.groupId());
        } catch (Exception ignored) {
            return 0L;
        }
    }

    private void refreshMonitoringQueueSnapshot(AdminQueueCounters queues) {
        if (queues == null) {
            return;
        }
        try {
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
            snapshot.setNodeCounters(nodeCounters);
            snapshot.setGeneratedAtIso(Instant.now().toString());
            monitoringRepository.save(snapshot);
        } catch (Exception ignored) {
        }
    }

    private long telemetryFailureEvents() {
        try {
            return monitoringRepository.findByMonitoringKey(JobGroupContext.groupId() == null ? "global" : JobGroupContext.groupId())
                    .map(AdminMonitoringSnapshot::getCounters)
                    .map(this::safeMap)
                    .map(counters -> counters.entrySet().stream()
                            .filter(entry -> isFailedStatus(entry.getKey()))
                            .mapToLong(entry -> count(entry.getValue()))
                            .sum())
                    .orElse(0L);
        } catch (Exception ignored) {
            return 0L;
        }
    }

    private long countOutbox(String status) {
        try {
            return notificationCatalog.countOutbox(JobGroupContext.groupId(), status);
        } catch (Exception ignored) {
            return 0L;
        }
    }

    private long countAffinityTasks(String status) {
        try {
            return affinityRecomputeTasksRepository.countByBaseGroupIdAndStatus(JobGroupContext.groupId(), status);
        } catch (Exception ignored) {
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

    private boolean activitiesEqual(Users.UserActivitiesRecord first, Users.UserActivitiesRecord second) {
        if (first == second) {
            return true;
        }
        if (first == null || second == null) {
            return false;
        }
        return Objects.equals(count(first.game()), count(second.game()))
                && Objects.equals(count(first.chats()), count(second.chats()))
                && Objects.equals(first.chat(), second.chat())
                && Objects.equals(count(first.invitations()), count(second.invitations()))
                && Objects.equals(count(first.events()), count(second.events()))
                && Objects.equals(count(first.hosting()), count(second.hosting()))
                && Objects.equals(count(first.cars()), count(second.cars()))
                && Objects.equals(count(first.accommodation()), count(second.accommodation()))
                && Objects.equals(count(first.supplies()), count(second.supplies()))
                && Objects.equals(count(first.tickets()), count(second.tickets()))
                && Objects.equals(count(first.contacts()), count(second.contacts()))
                && Objects.equals(count(first.feedback()), count(second.feedback()))
                && Objects.equals(count(first.adminJobs()), count(second.adminJobs()))
                && Objects.equals(count(first.adminMetrics()), count(second.adminMetrics()))
                && Objects.equals(count(first.notifications()), count(second.notifications()));
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
