package com.raxim.myscoutee.profile.service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.profile.data.document.AdminMonitoringSnapshot;
import com.raxim.myscoutee.profile.data.document.NotificationOutboxItem;
import com.raxim.myscoutee.profile.data.document.NotificationRuleConfig;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.repository.AdminMonitoringRepository;
import com.raxim.myscoutee.profile.repository.AffinityRecomputeTasksRepository;
import com.raxim.myscoutee.profile.repository.NotificationOutboxRepository;
import com.raxim.myscoutee.profile.repository.NotificationRuleConfigsRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;

@Service
public class AdminMenuCounterService {
    private static final List<String> DEMO_ADMIN_IDS = List.of("admin-demo-ava", "admin-demo-noel");

    private final NotificationRuleConfigsRepository notificationRuleConfigsRepository;
    private final NotificationOutboxRepository notificationOutboxRepository;
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
            NotificationRuleConfigsRepository notificationRuleConfigsRepository,
            NotificationOutboxRepository notificationOutboxRepository,
            AffinityRecomputeTasksRepository affinityRecomputeTasksRepository,
            AdminMonitoringRepository monitoringRepository,
            UsersRepository usersRepository) {
        this.notificationRuleConfigsRepository = notificationRuleConfigsRepository;
        this.notificationOutboxRepository = notificationOutboxRepository;
        this.affinityRecomputeTasksRepository = affinityRecomputeTasksRepository;
        this.monitoringRepository = monitoringRepository;
        this.usersRepository = usersRepository;
    }

    public void refreshAdminMenuCounters() {
        AdminAlertCounters counters = currentCounters();
        refreshMonitoringQueueSnapshot(counters.queues());
        for (Users admin : adminUsers()) {
            Users.UserActivitiesRecord before = admin.getActivities();
            Users updated = applyCounters(admin, counters);
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
        Users updated = applyCounters(user, currentCounters());
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
                count(existing == null ? null : existing.chat()),
                count(existing == null ? null : existing.invitations()),
                count(existing == null ? null : existing.events()),
                count(existing == null ? null : existing.hosting()),
                count(existing == null ? null : existing.cars()),
                count(existing == null ? null : existing.accommodation()),
                count(existing == null ? null : existing.supplies()),
                count(existing == null ? null : existing.tickets()),
                count(existing == null ? null : existing.contacts()),
                count(existing == null ? null : existing.feedback()),
                counters.jobs(),
                counters.metrics());
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
        long outboxPending = countOutbox(NotificationOutboxItem.STATUS_PENDING);
        long outboxRunning = countOutbox(NotificationOutboxItem.STATUS_RUNNING);
        long outboxFailed = countOutbox(NotificationOutboxItem.STATUS_FAILED);
        long outboxSent = countOutbox(NotificationOutboxItem.STATUS_SENT);
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
            return notificationRuleConfigsRepository.findAll().stream()
                    .filter(this::isFailedRule)
                    .count();
        } catch (Exception ignored) {
            return 0L;
        }
    }

    private boolean isFailedRule(NotificationRuleConfig rule) {
        if (rule == null || rule.getRunState() == null) {
            return false;
        }
        return isFailedStatus(rule.getRunState().getCurrentStatus())
                || isFailedStatus(rule.getRunState().getLastRunStatus());
    }

    private void refreshMonitoringQueueSnapshot(AdminQueueCounters queues) {
        if (queues == null) {
            return;
        }
        try {
            AdminMonitoringSnapshot snapshot = monitoringRepository.ensureGlobalSnapshot();
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
            return monitoringRepository.findGlobalSnapshot()
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
            return notificationOutboxRepository.countByStatus(status);
        } catch (Exception ignored) {
            return 0L;
        }
    }

    private long countAffinityTasks(String status) {
        try {
            return affinityRecomputeTasksRepository.countByStatus(status);
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
                && Objects.equals(count(first.chat()), count(second.chat()))
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
                && Objects.equals(count(first.adminMetrics()), count(second.adminMetrics()));
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
