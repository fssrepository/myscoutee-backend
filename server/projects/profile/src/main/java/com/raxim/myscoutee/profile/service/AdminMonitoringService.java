package com.raxim.myscoutee.profile.service;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.profile.data.document.AdminMonitoringSnapshot;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminMonitoringCategoryDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminMonitoringEdgeDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminMonitoringMetricDetailRowDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminMonitoringMetricDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminMonitoringNodeDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminMonitoringStateDto;
import com.raxim.myscoutee.profile.repository.AdminMonitoringRepository;

@Service
public class AdminMonitoringService {
    private static final String HEALTH_OK = "ok";
    private static final String HEALTH_WATCH = "watch";
    private static final String HEALTH_ALERT = "alert";

    private final AdminMonitoringRepository monitoringRepository;
    private final AdminModerationService adminModerationService;

    public AdminMonitoringService(
            AdminMonitoringRepository monitoringRepository,
            AdminModerationService adminModerationService) {
        this.monitoringRepository = monitoringRepository;
        this.adminModerationService = adminModerationService;
    }

    public AdminMonitoringStateDto state(String adminUserId) {
        adminModerationService.resolveAdminActor(adminUserId);
        return toDto(monitoringRepository.globalSnapshotOrDefault());
    }

    public Optional<String> lastTelemetryStreamId() {
        return monitoringRepository.findGlobalSnapshot()
                .map(AdminMonitoringSnapshot::getLastTelemetryStreamId)
                .map(this::safeText)
                .filter(StringUtils::hasText);
    }

    public void applyTelemetryEvents(List<AdminTelemetryEvent> events, String lastStreamId) {
        if ((events == null || events.isEmpty()) && !StringUtils.hasText(safeText(lastStreamId))) {
            return;
        }
        AdminMonitoringSnapshot snapshot = monitoringRepository.ensureGlobalSnapshot();
        Map<String, Long> counters = safeMap(snapshot.getCounters());
        Map<String, Long> categoryCounters = safeMap(snapshot.getCategoryCounters());
        Map<String, Long> nodeCounters = safeMap(snapshot.getNodeCounters());
        Map<String, Long> alertCounters = safeMap(snapshot.getAlertCounters());

        for (AdminTelemetryEvent event : events == null ? List.<AdminTelemetryEvent>of() : events) {
            if (event == null) {
                continue;
            }
            String eventKey = normalizeKey(event.eventKey());
            if (!StringUtils.hasText(eventKey)) {
                continue;
            }
            long amount = Math.max(1L, event.amount() == null ? 1L : event.amount());
            String category = categoryFor(eventKey, normalizeKey(event.domain()));
            String node = nodeFor(category, eventKey);
            increment(counters, eventKey, amount);
            increment(categoryCounters, category, amount);
            increment(nodeCounters, category + "." + node, amount);
            if (isAttentionEvent(eventKey)) {
                increment(alertCounters, category, amount);
            }
        }

        snapshot.setCounters(counters);
        snapshot.setCategoryCounters(categoryCounters);
        snapshot.setNodeCounters(nodeCounters);
        snapshot.setAlertCounters(alertCounters);
        snapshot.setGeneratedAtIso(Instant.now().toString());
        snapshot.setSource("http");
        snapshot.setHealth(overallHealth(alertCounters));
        if (StringUtils.hasText(safeText(lastStreamId))) {
            snapshot.setLastTelemetryStreamId(safeText(lastStreamId));
        }
        monitoringRepository.save(snapshot);
    }

    private AdminMonitoringStateDto toDto(AdminMonitoringSnapshot snapshot) {
        Map<String, Long> counters = safeMap(snapshot.getCounters());
        Map<String, Long> categoryCounters = safeMap(snapshot.getCategoryCounters());
        Map<String, Long> nodeCounters = safeMap(snapshot.getNodeCounters());
        Map<String, Long> alertCounters = safeMap(snapshot.getAlertCounters());
        long recomputePending = nodeCounters.getOrDefault("queues.recompute.pending", 0L);
        long recomputeRunning = nodeCounters.getOrDefault("queues.recompute.running", 0L);
        long recomputeFailed = nodeCounters.getOrDefault("queues.recompute.failed", 0L);
        long outboxPending = nodeCounters.getOrDefault("queues.outbox.pending", 0L);
        long outboxRunning = nodeCounters.getOrDefault("queues.outbox.running", 0L);
        long outboxFailed = nodeCounters.getOrDefault("queues.outbox.failed", 0L);
        long outboxSent = nodeCounters.getOrDefault("queues.outbox.sent", 0L);

        List<AdminMonitoringCategoryDto> categories = List.of(
                usersCategory(counters, categoryCounters, nodeCounters, alertCounters),
                eventsCategory(counters, categoryCounters, nodeCounters, alertCounters, recomputePending, outboxPending),
                membersCategory(counters, categoryCounters, nodeCounters, alertCounters, outboxPending),
                assetsCategory(counters, categoryCounters, nodeCounters, alertCounters, recomputePending, outboxPending),
                matchingCategory(counters, categoryCounters, nodeCounters, recomputePending, recomputeRunning, recomputeFailed),
                chatCategory(counters, categoryCounters, nodeCounters, alertCounters, outboxPending),
                notificationsCategory(counters, categoryCounters, nodeCounters, outboxPending, outboxRunning, outboxFailed, outboxSent),
                jobsCategory(counters, categoryCounters, nodeCounters, alertCounters)
        );
        return new AdminMonitoringStateDto(
                firstNonBlank(snapshot.getGeneratedAtIso(), Instant.now().toString()),
                firstNonBlank(snapshot.getSource(), "http"),
                overallHealth(categories),
                categories);
    }

    private AdminMonitoringCategoryDto usersCategory(
            Map<String, Long> counters,
            Map<String, Long> categoryCounters,
            Map<String, Long> nodeCounters,
            Map<String, Long> alertCounters) {
        long profileWrites = sum(counters, "profile.registered", "profile.updated", "profile.deleted", "admin.user.blocked", "admin.user.unblocked");
        long deleted = counters.getOrDefault("profile.deleted", 0L);
        long statusPropagationSignals = sum(counters, "profile.deleted", "admin.user.blocked", "admin.user.unblocked");
        return category(
                "users",
                "admin.monitoring.category.users",
                "admin.monitoring.category.users.summary",
                "person",
                "blue",
                health(alertCounters.getOrDefault("users", 0L), statusPropagationSignals),
                Math.max(categoryCounters.getOrDefault("users", 0L), profileWrites),
                List.of(
                        node("users.ui", "admin.monitoring.node.profile.ui", "person", "source", "blue", List.of(
                                metric("profile-writes", "admin.monitoring.metric.profile.writes", profileWrites, "blue", HEALTH_OK))),
                        node("users.model", "admin.monitoring.node.profile.model", "badge", "writeModel", "green", List.of(
                                metric("registered", "admin.monitoring.metric.registered", counters.getOrDefault("profile.registered", 0L), "green", HEALTH_OK),
                                metric("deleted", "admin.monitoring.metric.deleted", deleted, "red", deleted > 0 ? HEALTH_WATCH : HEALTH_OK))),
                        node("users.status", "admin.monitoring.node.status.propagation", "rule", "worker", "gold", List.of(
                                metric("status-propagation-signals", "admin.monitoring.metric.status.propagation.signals", statusPropagationSignals, "gold", statusPropagationSignals > 0 ? HEALTH_WATCH : HEALTH_OK))),
                        node("users.purge", "admin.monitoring.node.account.purge", "delete_sweep", "storage", "slate", List.of(
                                metric("purge-signals", "admin.monitoring.metric.purge.signals", nodeCounters.getOrDefault("users.writes", 0L), "slate", HEALTH_OK)))
                ),
                edges(
                        edge("users.ui", "users.model", "admin.monitoring.edge.write.path", "blue", profileWrites),
                        edge("users.model", "users.status", "admin.monitoring.edge.status.propagation", "gold", statusPropagationSignals),
                        edge("users.status", "users.purge", "admin.monitoring.edge.gdpr.window", "slate", deleted)));
    }

    private AdminMonitoringCategoryDto eventsCategory(
            Map<String, Long> counters,
            Map<String, Long> categoryCounters,
            Map<String, Long> nodeCounters,
            Map<String, Long> alertCounters,
            long recomputePending,
            long outboxPending) {
        return category(
                "events",
                "admin.monitoring.category.events",
                "admin.monitoring.category.events.summary",
                "event_available",
                "green",
                health(alertCounters.getOrDefault("events", 0L), recomputePending + outboxPending),
                categoryCounters.getOrDefault("events", 0L),
                List.of(
                        node("events.ui", "admin.monitoring.node.event.ui", "edit_calendar", "source", "blue", List.of(
                                metric("event-writes", "admin.monitoring.metric.event.writes", sum(counters, "event.created", "event.updated", "event.status.changed"), "blue", HEALTH_OK,
                                        rows(row("created", "admin.monitoring.metric.created", counters.getOrDefault("event.created", 0L), "green"),
                                                row("updated", "admin.monitoring.metric.updated", counters.getOrDefault("event.updated", 0L), "blue"))))),
                        node("events.model", "admin.monitoring.node.event.model", "storage", "writeModel", "green", List.of(
                                metric("event-model", "admin.monitoring.metric.persisted.events", nodeCounters.getOrDefault("events.lifecycle", 0L), "green", HEALTH_OK))),
                        node("events.recompute", "admin.monitoring.node.recompute.queue", "sync_alt", "queue", "gold", List.of(
                                metric("recompute-pending", "admin.monitoring.metric.recompute.pending", recomputePending, "gold", pendingHealth(recomputePending)))),
                        node("events.outbox", "admin.monitoring.node.notification.outbox", "outbox", "outbox", "purple", List.of(
                                metric("outbox-pending", "admin.monitoring.metric.outbox.pending", outboxPending, "purple", pendingHealth(outboxPending))))
                ),
                edges(
                        edge("events.ui", "events.model", "admin.monitoring.edge.write.path", "blue", sum(counters, "event.created", "event.updated")),
                        edge("events.model", "events.recompute", "admin.monitoring.edge.recompute", "gold", recomputePending),
                        edge("events.recompute", "events.outbox", "admin.monitoring.edge.visible.changes", "purple", outboxPending)));
    }

    private AdminMonitoringCategoryDto membersCategory(
            Map<String, Long> counters,
            Map<String, Long> categoryCounters,
            Map<String, Long> nodeCounters,
            Map<String, Long> alertCounters,
            long outboxPending) {
        long memberChanges = sum(counters, "event.members.changed", "event.member.joined", "event.member.invited");
        return category(
                "members",
                "admin.monitoring.category.members",
                "admin.monitoring.category.members.summary",
                "groups",
                "blue",
                health(alertCounters.getOrDefault("events", 0L), outboxPending),
                Math.max(categoryCounters.getOrDefault("events", 0L), memberChanges),
                List.of(
                        node("members.ui", "admin.monitoring.node.member.ui", "group_add", "source", "blue", List.of(
                                metric("member-changes", "admin.monitoring.metric.member.changes", memberChanges, "blue", HEALTH_OK))),
                        node("members.model", "admin.monitoring.node.member.model", "fact_check", "writeModel", "green", List.of(
                                metric("accepted-members", "admin.monitoring.metric.accepted.members", nodeCounters.getOrDefault("events.members", 0L), "green", HEALTH_OK))),
                        node("members.inviter", "admin.monitoring.node.auto.inviter", "person_add", "worker", "gold", List.of(
                                metric("invites", "admin.monitoring.metric.invites", counters.getOrDefault("event.member.invited", 0L), "gold", HEALTH_OK))),
                        node("members.outbox", "admin.monitoring.node.notification.outbox", "outbox", "outbox", "purple", List.of(
                                metric("pending-notifications", "admin.monitoring.metric.outbox.pending", outboxPending, "purple", pendingHealth(outboxPending))))
                ),
                edges(
                        edge("members.ui", "members.model", "admin.monitoring.edge.membership.write", "blue", memberChanges),
                        edge("members.model", "members.inviter", "admin.monitoring.edge.capacity.gate", "gold", counters.getOrDefault("event.member.invited", 0L)),
                        edge("members.inviter", "members.outbox", "admin.monitoring.edge.invite.delivery", "purple", outboxPending)));
    }

    private AdminMonitoringCategoryDto assetsCategory(
            Map<String, Long> counters,
            Map<String, Long> categoryCounters,
            Map<String, Long> nodeCounters,
            Map<String, Long> alertCounters,
            long recomputePending,
            long outboxPending) {
        long writes = sum(counters, "asset.created", "asset.updated", "asset.requests.changed");
        return category(
                "assets",
                "admin.monitoring.category.assets",
                "admin.monitoring.category.assets.summary",
                "inventory_2",
                "gold",
                health(alertCounters.getOrDefault("assets", 0L), recomputePending + outboxPending),
                Math.max(categoryCounters.getOrDefault("assets", 0L), writes),
                List.of(
                        node("assets.ui", "admin.monitoring.node.asset.ui", "inventory_2", "source", "gold", List.of(
                                metric("asset-writes", "admin.monitoring.metric.asset.writes", writes, "gold", HEALTH_OK))),
                        node("assets.model", "admin.monitoring.node.asset.model", "storage", "writeModel", "green", List.of(
                                metric("requests", "admin.monitoring.metric.asset.requests", counters.getOrDefault("asset.requests.changed", 0L), "green", HEALTH_OK))),
                        node("assets.recompute", "admin.monitoring.node.recompute.queue", "sync_alt", "queue", "blue", List.of(
                                metric("recompute-pending", "admin.monitoring.metric.recompute.pending", recomputePending, "blue", pendingHealth(recomputePending)))),
                        node("assets.outbox", "admin.monitoring.node.notification.outbox", "outbox", "outbox", "purple", List.of(
                                metric("borrower-updates", "admin.monitoring.metric.borrower.updates", outboxPending, "purple", pendingHealth(outboxPending))))
                ),
                edges(
                        edge("assets.ui", "assets.model", "admin.monitoring.edge.write.path", "gold", writes),
                        edge("assets.model", "assets.recompute", "admin.monitoring.edge.recompute", "blue", recomputePending),
                        edge("assets.recompute", "assets.outbox", "admin.monitoring.edge.availability.delivery", "purple", outboxPending)));
    }

    private AdminMonitoringCategoryDto matchingCategory(
            Map<String, Long> counters,
            Map<String, Long> categoryCounters,
            Map<String, Long> nodeCounters,
            long recomputePending,
            long recomputeRunning,
            long recomputeFailed) {
        long rates = counters.getOrDefault("rates.synced", 0L);
        return category(
                "matching",
                "admin.monitoring.category.matching",
                "admin.monitoring.category.matching.summary",
                "hub",
                "purple",
                recomputeFailed > 0 ? HEALTH_ALERT : pendingHealth(recomputePending),
                Math.max(categoryCounters.getOrDefault("matching", 0L), rates),
                List.of(
                        node("matching.rates", "admin.monitoring.node.rates", "star", "source", "purple", List.of(
                                metric("rates-synced", "admin.monitoring.metric.rates.synced", rates, "purple", HEALTH_OK))),
                        node("matching.queue", "admin.monitoring.node.recompute.queue", "pending_actions", "queue", "gold", List.of(
                                metric("recompute-pending", "admin.monitoring.metric.recompute.pending", recomputePending, "gold", pendingHealth(recomputePending)),
                                metric("recompute-running", "admin.monitoring.metric.recompute.running", recomputeRunning, "blue", HEALTH_OK),
                                metric("recompute-failed", "admin.monitoring.metric.recompute.failed", recomputeFailed, "red", recomputeFailed > 0 ? HEALTH_ALERT : HEALTH_OK))),
                        node("matching.worker", "admin.monitoring.node.affinity.worker", "ssid_chart", "worker", "blue", List.of(
                                metric("affinity-updates", "admin.monitoring.metric.affinity.updates", nodeCounters.getOrDefault("matching.rates", 0L), "blue", HEALTH_OK))),
                        node("matching.read", "admin.monitoring.node.discovery.read.model", "travel_explore", "readModel", "green", List.of(
                                metric("visible-scores", "admin.monitoring.metric.visible.scores", rates, "green", HEALTH_OK)))
                ),
                edges(
                        edge("matching.rates", "matching.queue", "admin.monitoring.edge.recompute", "gold", rates),
                        edge("matching.queue", "matching.worker", "admin.monitoring.edge.worker.pickup", "blue", recomputeRunning),
                        edge("matching.worker", "matching.read", "admin.monitoring.edge.read.model", "green", rates)));
    }

    private AdminMonitoringCategoryDto chatCategory(
            Map<String, Long> counters,
            Map<String, Long> categoryCounters,
            Map<String, Long> nodeCounters,
            Map<String, Long> alertCounters,
            long outboxPending) {
        long messages = counters.getOrDefault("chat.message.sent", 0L);
        return category(
                "chat",
                "admin.monitoring.category.chat",
                "admin.monitoring.category.chat.summary",
                "forum",
                "blue",
                health(alertCounters.getOrDefault("chat", 0L), outboxPending),
                Math.max(categoryCounters.getOrDefault("chat", 0L), messages),
                List.of(
                        node("chat.ui", "admin.monitoring.node.chat.ui", "chat", "source", "blue", List.of(
                                metric("messages", "admin.monitoring.metric.messages", messages, "blue", HEALTH_OK))),
                        node("chat.stream", "admin.monitoring.node.chat.stream", "stream", "writeModel", "green", List.of(
                                metric("stream-events", "admin.monitoring.metric.stream.events", nodeCounters.getOrDefault("chat.messages", 0L), "green", HEALTH_OK))),
                        node("chat.attachments", "admin.monitoring.node.attachment.lifecycle", "attachment", "storage", "gold", List.of(
                                metric("attachment-checks", "admin.monitoring.metric.attachment.checks", counters.getOrDefault("chat.attachment.checked", 0L), "gold", HEALTH_OK))),
                        node("chat.outbox", "admin.monitoring.node.notification.outbox", "outbox", "outbox", "purple", List.of(
                                metric("push-pending", "admin.monitoring.metric.outbox.pending", outboxPending, "purple", pendingHealth(outboxPending))))
                ),
                edges(
                        edge("chat.ui", "chat.stream", "admin.monitoring.edge.write.path", "blue", messages),
                        edge("chat.stream", "chat.attachments", "admin.monitoring.edge.attachment.lifecycle", "gold", counters.getOrDefault("chat.attachment.checked", 0L)),
                        edge("chat.stream", "chat.outbox", "admin.monitoring.edge.push.intent", "purple", outboxPending)));
    }

    private AdminMonitoringCategoryDto notificationsCategory(
            Map<String, Long> counters,
            Map<String, Long> categoryCounters,
            Map<String, Long> nodeCounters,
            long outboxPending,
            long outboxRunning,
            long outboxFailed,
            long outboxSent) {
        return category(
                "notifications",
                "admin.monitoring.category.notifications",
                "admin.monitoring.category.notifications.summary",
                "notifications_active",
                "red",
                outboxFailed > 0 ? HEALTH_ALERT : pendingHealth(outboxPending),
                Math.max(categoryCounters.getOrDefault("notifications", 0L), outboxPending + outboxRunning + outboxFailed),
                List.of(
                        node("notifications.intent", "admin.monitoring.node.notification.intent", "edit_notifications", "source", "blue", List.of(
                                metric("intents", "admin.monitoring.metric.notification.intents", nodeCounters.getOrDefault("notifications.outbox", 0L), "blue", HEALTH_OK))),
                        node("notifications.outbox", "admin.monitoring.node.notification.outbox", "outbox", "outbox", "purple", List.of(
                                metric("outbox-pending", "admin.monitoring.metric.outbox.pending", outboxPending, "purple", pendingHealth(outboxPending)),
                                metric("outbox-running", "admin.monitoring.metric.outbox.running", outboxRunning, "blue", HEALTH_OK),
                                metric("outbox-failed", "admin.monitoring.metric.outbox.failed", outboxFailed, "red", outboxFailed > 0 ? HEALTH_ALERT : HEALTH_OK))),
                        node("notifications.firebase", "admin.monitoring.node.firebase", "cloud_upload", "external", "gold", List.of(
                                metric("sent", "admin.monitoring.metric.outbox.sent", outboxSent, "green", HEALTH_OK))),
                        node("notifications.tokens", "admin.monitoring.node.device.tokens", "phonelink_ring", "storage", "green", List.of(
                                metric("token-cleanup", "admin.monitoring.metric.token.cleanup", counters.getOrDefault("notification.tokens.removed", 0L), "green", HEALTH_OK)))
                ),
                edges(
                        edge("notifications.intent", "notifications.outbox", "admin.monitoring.edge.outbox.persist", "purple", outboxPending),
                        edge("notifications.outbox", "notifications.firebase", "admin.monitoring.edge.firebase.batch", "gold", outboxRunning + outboxSent),
                        edge("notifications.firebase", "notifications.tokens", "admin.monitoring.edge.token.cleanup", "green", counters.getOrDefault("notification.tokens.removed", 0L))));
    }

    private AdminMonitoringCategoryDto jobsCategory(
            Map<String, Long> counters,
            Map<String, Long> categoryCounters,
            Map<String, Long> nodeCounters,
            Map<String, Long> alertCounters) {
        long adminChanges = sum(counters, "admin.params.changed", "admin.notification.rule.changed", "admin.user.blocked", "admin.user.unblocked");
        return category(
                "jobs",
                "admin.monitoring.category.jobs",
                "admin.monitoring.category.jobs.summary",
                "pending_actions",
                "slate",
                health(alertCounters.getOrDefault("jobs", 0L), 0L),
                Math.max(categoryCounters.getOrDefault("jobs", 0L), adminChanges),
                List.of(
                        node("jobs.admin", "admin.monitoring.node.admin.ui", "admin_panel_settings", "source", "slate", List.of(
                                metric("admin-changes", "admin.monitoring.metric.admin.changes", adminChanges, "slate", HEALTH_OK))),
                        node("jobs.config", "admin.monitoring.node.job.config", "tune", "writeModel", "blue", List.of(
                                metric("config-changes", "admin.monitoring.metric.config.changes", counters.getOrDefault("admin.params.changed", 0L), "blue", HEALTH_OK))),
                        node("jobs.scheduler", "admin.monitoring.node.scheduler", "schedule", "worker", "gold", List.of(
                                metric("scheduled-triggers", "admin.monitoring.metric.scheduled.triggers", nodeCounters.getOrDefault("jobs.scheduler", 0L), "gold", HEALTH_OK))),
                        node("jobs.audit", "admin.monitoring.node.audit.trail", "history", "storage", "green", List.of(
                                metric("audit-events", "admin.monitoring.metric.audit.events", adminChanges, "green", HEALTH_OK)))
                ),
                edges(
                        edge("jobs.admin", "jobs.config", "admin.monitoring.edge.config.write", "blue", adminChanges),
                        edge("jobs.config", "jobs.scheduler", "admin.monitoring.edge.worker.pickup", "gold", nodeCounters.getOrDefault("jobs.scheduler", 0L)),
                        edge("jobs.scheduler", "jobs.audit", "admin.monitoring.edge.audit", "green", adminChanges)));
    }

    private AdminMonitoringCategoryDto category(
            String key,
            String labelKey,
            String summaryKey,
            String icon,
            String tone,
            String health,
            long total,
            List<AdminMonitoringNodeDto> nodes,
            List<AdminMonitoringEdgeDto> edges) {
        return new AdminMonitoringCategoryDto(key, labelKey, summaryKey, icon, tone, health, Math.max(0L, total), nodes, edges);
    }

    private AdminMonitoringNodeDto node(
            String id,
            String labelKey,
            String icon,
            String kind,
            String tone,
            List<AdminMonitoringMetricDto> metrics) {
        return new AdminMonitoringNodeDto(id, labelKey, icon, kind, tone, metrics);
    }

    private AdminMonitoringMetricDto metric(String key, String labelKey, long value, String tone, String status) {
        return metric(key, labelKey, value, tone, status, List.of(row("value", labelKey, value, tone)));
    }

    private AdminMonitoringMetricDto metric(
            String key,
            String labelKey,
            long value,
            String tone,
            String status,
            List<AdminMonitoringMetricDetailRowDto> detailRows) {
        long normalizedValue = Math.max(0L, value);
        return new AdminMonitoringMetricDto(
                key,
                labelKey,
                normalizedValue,
                compact(normalizedValue),
                tone,
                status,
                detailRows);
    }

    private List<AdminMonitoringMetricDetailRowDto> rows(AdminMonitoringMetricDetailRowDto... rows) {
        return List.of(rows);
    }

    private AdminMonitoringMetricDetailRowDto row(String key, String labelKey, long value, String tone) {
        return new AdminMonitoringMetricDetailRowDto(key, labelKey, compact(Math.max(0L, value)), tone);
    }

    private List<AdminMonitoringEdgeDto> edges(AdminMonitoringEdgeDto... edges) {
        return List.of(edges);
    }

    private AdminMonitoringEdgeDto edge(String from, String to, String labelKey, String tone, long volume) {
        return new AdminMonitoringEdgeDto(from, to, labelKey, tone, Math.max(0L, volume));
    }

    private String categoryFor(String eventKey, String domain) {
        if (eventKey.startsWith("event.") || "events".equals(domain)) {
            return "events";
        }
        if (eventKey.startsWith("asset.") || "assets".equals(domain)) {
            return "assets";
        }
        if (eventKey.startsWith("rates.") || "matching".equals(domain)) {
            return "matching";
        }
        if (eventKey.startsWith("chat.") || "chats".equals(domain)) {
            return "chat";
        }
        if (eventKey.startsWith("notification.") || "notifications".equals(domain)) {
            return "notifications";
        }
        if (eventKey.startsWith("profile.") || "profiles".equals(domain) || eventKey.startsWith("admin.user.")) {
            return "users";
        }
        if (eventKey.startsWith("admin.") || eventKey.startsWith("job.") || "jobs".equals(domain)) {
            return "jobs";
        }
        return StringUtils.hasText(domain) ? domain : "system";
    }

    private String nodeFor(String category, String eventKey) {
        if ("events".equals(category) && (eventKey.contains("member") || eventKey.contains("invite"))) {
            return "members";
        }
        if ("events".equals(category)) {
            return "lifecycle";
        }
        if ("assets".equals(category) && eventKey.contains("request")) {
            return "requests";
        }
        if ("matching".equals(category)) {
            return "rates";
        }
        if ("chat".equals(category)) {
            return eventKey.contains("attachment") ? "attachments" : "messages";
        }
        if ("notifications".equals(category)) {
            return "outbox";
        }
        if ("jobs".equals(category)) {
            return "scheduler";
        }
        return "writes";
    }

    private String overallHealth(List<AdminMonitoringCategoryDto> categories) {
        if (categories.stream().anyMatch(category -> HEALTH_ALERT.equals(category.health()))) {
            return HEALTH_ALERT;
        }
        if (categories.stream().anyMatch(category -> HEALTH_WATCH.equals(category.health()))) {
            return HEALTH_WATCH;
        }
        return HEALTH_OK;
    }

    private String overallHealth(Map<String, Long> alertCounters) {
        return alertCounters.values().stream().anyMatch(value -> value != null && value.longValue() > 0L)
                ? HEALTH_WATCH
                : HEALTH_OK;
    }

    private String health(long alerts, long backlog) {
        if (alerts > 0L) {
            return HEALTH_ALERT;
        }
        if (backlog > 0L) {
            return HEALTH_WATCH;
        }
        return HEALTH_OK;
    }

    private String pendingHealth(long value) {
        return value > 0L ? HEALTH_WATCH : HEALTH_OK;
    }

    private boolean isAttentionEvent(String eventKey) {
        return eventKey.contains("failed")
                || eventKey.contains("blocked")
                || eventKey.contains("deleted")
                || eventKey.contains("purge")
                || eventKey.contains("reported");
    }

    private Map<String, Long> safeMap(Map<String, Long> source) {
        return source == null ? new LinkedHashMap<>() : new LinkedHashMap<>(source);
    }

    private long sum(Map<String, Long> source, String... keys) {
        long total = 0L;
        for (String key : keys) {
            total += source.getOrDefault(key, 0L);
        }
        return total;
    }

    private void increment(Map<String, Long> target, String key, long amount) {
        if (!StringUtils.hasText(key)) {
            return;
        }
        target.put(key, Math.max(0L, target.getOrDefault(key, 0L)) + Math.max(0L, amount));
    }

    private String normalizeKey(String value) {
        return safeText(value).toLowerCase();
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }

    private String firstNonBlank(String first, String fallback) {
        return StringUtils.hasText(safeText(first)) ? safeText(first) : fallback;
    }

    private String compact(long value) {
        if (value >= 1_000_000L) {
            return (value / 100_000L) / 10.0 + "M";
        }
        if (value >= 10_000L) {
            return (value / 1_000L) + "k";
        }
        if (value >= 1_000L) {
            return (value / 100L) / 10.0 + "k";
        }
        return Long.toString(value);
    }
}
