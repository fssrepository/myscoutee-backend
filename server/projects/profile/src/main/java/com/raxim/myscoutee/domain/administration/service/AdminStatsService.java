package com.raxim.myscoutee.domain.administration.service;

import com.raxim.myscoutee.domain.administration.api.AdminTelemetryEvent;

import com.raxim.myscoutee.domain.affinity.api.GraphScience;
import com.raxim.myscoutee.domain.content.api.AdministrativeAccess;
import com.raxim.myscoutee.domain.platform.api.JobGroupContext;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.domain.administration.document.AdminStatsSnapshot;

import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminStatsBreakdownItemDto;
import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminStatsDashboardDto;
import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminStatsGraphDto;
import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminStatsGraphTimelinePointDto;
import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminStatsMetricDto;
import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminStatsSegmentDto;
import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminStatsTimelinePointDto;
import com.raxim.myscoutee.domain.administration.repository.AdminStatsRepository;
import com.raxim.myscoutee.domain.accounts.api.ProfileStatistics;

@Service
public class AdminStatsService {
    private static final int TIMELINE_DAYS = 14;
    private static final int STORED_DAILY_DAYS = 45;
    private static final Set<String> ACTIVE_PROFILE_STATUSES = Set.of("public", "friends only", "host only");

    private final AdminStatsRepository adminStatsRepository;
    private final ProfileStatistics profileStatistics;
    private final AdministrativeAccess adminModerationService;
    private final GraphScience adminGraphScienceService;

    public AdminStatsService(
            AdminStatsRepository adminStatsRepository,
            ProfileStatistics profileStatistics,
            AdministrativeAccess adminModerationService,
            GraphScience adminGraphScienceService) {
        this.adminStatsRepository = adminStatsRepository;
        this.profileStatistics = profileStatistics;
        this.adminModerationService = adminModerationService;
        this.adminGraphScienceService = adminGraphScienceService;
    }

    public AdminStatsDashboardDto dashboard(String adminUserId) {
        String groupId = adminModerationService.baseGroupId(adminUserId);
        return toDto(groupId == null ? adminStatsRepository.globalSnapshotOrDefault() : adminStatsRepository.snapshotOrDefault(groupId));
    }

    public Optional<String> lastTelemetryStreamId() {
        return adminStatsRepository.findByStatsKey(JobGroupContext.groupId() == null ? "global" : JobGroupContext.groupId())
                .map(AdminStatsSnapshot::getLastTelemetryStreamId)
                .map(this::safeText)
                .filter(StringUtils::hasText);
    }

    public void applyTelemetryEvents(List<AdminTelemetryEvent> events, String lastStreamId) {
        applyTelemetryEvents(events, lastStreamId, true);
    }

    public void applyTelemetryEvents(List<AdminTelemetryEvent> events, String lastStreamId, boolean refreshDerived) {
        if ((events == null || events.isEmpty()) && !StringUtils.hasText(safeText(lastStreamId))) return;
        List<AdminTelemetryEvent> batch = events == null ? List.of() : events;
        var scoped = adminModerationService.baseProfileEvents(batch);
        if (JobGroupContext.isActive()) {
            String key = JobGroupContext.groupId() == null ? "global" : JobGroupContext.groupId();
            applyTelemetryEvents(scoped.getOrDefault(key, List.of()), lastStreamId, adminStatsRepository.ensureSnapshot(JobGroupContext.groupId()), refreshDerived);
            return;
        }
        for (var entry : scoped.entrySet()) {
            if (!"global".equals(entry.getKey())) applyTelemetryEvents(entry.getValue(), lastStreamId, adminStatsRepository.ensureSnapshot(entry.getKey()), refreshDerived);
        }
        applyTelemetryEvents(scoped.getOrDefault("global", List.of()), lastStreamId, adminStatsRepository.ensureGlobalSnapshot(), refreshDerived);
    }

    private void applyTelemetryEvents(List<AdminTelemetryEvent> events, String lastStreamId, AdminStatsSnapshot snapshot, boolean refreshDerived) {
        Map<String, Long> counters = new LinkedHashMap<>(safeMap(snapshot.getCounters()));
        Map<String, Long> attention = new LinkedHashMap<>(safeMap(snapshot.getAttention()));
        Map<String, Long> topCities = new LinkedHashMap<>(safeMap(snapshot.getTopCities()));
        Map<String, Long> topTopics = new LinkedHashMap<>(safeMap(snapshot.getTopTopics()));
        Map<String, Long> eventTypes = new LinkedHashMap<>(safeMap(snapshot.getEventTypes()));
        Map<String, Map<String, Long>> dailyActivity = copyNestedLongMap(snapshot.getDailyActivity());
        Map<String, Map<String, String>> dailyActiveUsers = copyNestedStringMap(snapshot.getDailyActiveUsers());
        Map<String, String> activeUsers = new LinkedHashMap<>(safeStringMap(snapshot.getActiveUsers()));
        Map<String, String> userFirstSeen = new LinkedHashMap<>(safeStringMap(snapshot.getUserFirstSeen()));
        Map<String, Long> userActivityCounts = new LinkedHashMap<>(safeMap(snapshot.getUserActivityCounts()));
        Map<String, Long> departedUserDurationsDays = new LinkedHashMap<>(safeMap(snapshot.getDepartedUserDurationsDays()));
        Map<String, Long> profileFillRates = new LinkedHashMap<>(safeMap(snapshot.getProfileFillRates()));
        Map<String, String> knownEvents = new LinkedHashMap<>(safeStringMap(snapshot.getKnownEvents()));
        Map<String, String> activeEvents = new LinkedHashMap<>(safeStringMap(snapshot.getActiveEvents()));
        Map<String, String> knownAssets = new LinkedHashMap<>(safeStringMap(snapshot.getKnownAssets()));
        Map<String, String> activeAssets = new LinkedHashMap<>(safeStringMap(snapshot.getActiveAssets()));

        for (AdminTelemetryEvent event : events == null ? List.<AdminTelemetryEvent>of() : events) {
            if (event == null || !StringUtils.hasText(safeText(event.eventKey()))) {
                continue;
            }
            long amount = Math.max(1L, event.amount() == null ? 1L : event.amount());
            String eventKey = normalizeKey(event.eventKey());
            String domain = normalizeKey(event.domain());
            String actorUserId = safeText(event.actorUserId());
            String entityId = safeText(event.entityId());
            String occurredAtIso = firstNonBlank(event.occurredAtIso(), Instant.now().toString());
            String dayKey = dayKey(occurredAtIso);
            Map<String, Long> day = dailyActivity.computeIfAbsent(dayKey, ignored -> new LinkedHashMap<>());
            increment(counters, eventKey, amount);
            if (StringUtils.hasText(actorUserId)) {
                userFirstSeen.putIfAbsent(actorUserId, occurredAtIso);
                activeUsers.put(actorUserId, occurredAtIso);
                increment(userActivityCounts, actorUserId, amount);
                dailyActiveUsers
                        .computeIfAbsent(dayKey, ignored -> new LinkedHashMap<>())
                        .put(actorUserId, occurredAtIso);
            }
            if ("profile.registered".equals(eventKey)) {
                String registeredUserId = firstNonBlank(entityId, actorUserId);
                if (StringUtils.hasText(registeredUserId)) {
                    userFirstSeen.putIfAbsent(registeredUserId, occurredAtIso);
                }
            }
            if ("profile.deleted".equals(eventKey)) {
                String departedUserId = firstNonBlank(entityId, actorUserId);
                if (StringUtils.hasText(departedUserId)) {
                    String firstSeenAt = firstNonBlank(firstNonBlank(userFirstSeen.get(departedUserId), activeUsers.get(departedUserId)), occurredAtIso);
                    departedUserDurationsDays.put(departedUserId, daysBetween(firstSeenAt, occurredAtIso));
                    activeUsers.remove(departedUserId);
                }
            }
            Long profileFillPercent = tagLong(event.tags(), "profileFillPercent");
            if ("profiles".equals(domain) && StringUtils.hasText(entityId) && profileFillPercent != null) {
                profileFillRates.put(entityId, Math.max(0L, Math.min(100L, profileFillPercent.longValue())));
            }
            applyEntityActivity(knownEvents, activeEvents, "events", domain, entityId, eventKey, occurredAtIso);
            applyEntityActivity(knownAssets, activeAssets, "assets", domain, entityId, eventKey, occurredAtIso);
            applyDailyActivity(day, eventKey, domain, amount);
            if (isAttentionEvent(eventKey)) {
                increment(attention, eventKey, amount);
            }
            String city = safeText(event.tags() == null ? null : event.tags().get("city"));
            if (StringUtils.hasText(city)) {
                increment(topCities, city, amount);
            }
            String topic = safeText(event.tags() == null ? null : event.tags().get("topic"));
            if (StringUtils.hasText(topic)) {
                increment(topTopics, topic, amount);
            }
            String eventType = safeText(event.tags() == null ? null : event.tags().get("eventType"));
            if ("events".equals(domain) && StringUtils.hasText(eventType)) {
                increment(eventTypes, eventType, amount);
            }
        }
        trimDailyMaps(dailyActivity, dailyActiveUsers);

        int healthScore = calculateHealthScore(counters, attention);
        snapshot.setCounters(counters);
        snapshot.setAttention(attention);
        snapshot.setTopCities(topCities);
        snapshot.setTopTopics(topTopics);
        snapshot.setEventTypes(eventTypes);
        snapshot.setDailyActivity(dailyActivity);
        snapshot.setDailyActiveUsers(dailyActiveUsers);
        snapshot.setActiveUsers(activeUsers);
        snapshot.setUserFirstSeen(userFirstSeen);
        snapshot.setUserActivityCounts(userActivityCounts);
        snapshot.setDepartedUserDurationsDays(departedUserDurationsDays);
        snapshot.setProfileFillRates(profileFillRates);
        snapshot.setKnownEvents(knownEvents);
        snapshot.setActiveEvents(activeEvents);
        snapshot.setKnownAssets(knownAssets);
        snapshot.setActiveAssets(activeAssets);
        snapshot.setHealthScore(healthScore);
        snapshot.setHealthLabelKey(healthScore >= 80 ? "stats.health.good" : healthScore >= 60 ? "stats.health.watch" : "stats.health.risk");
        snapshot.setHealthSummaryKey("stats.health.summary");
        snapshot.setGeneratedAtIso(Instant.now().toString());
        snapshot.setSource("http");
        if (StringUtils.hasText(safeText(lastStreamId))) {
            snapshot.setLastTelemetryStreamId(safeText(lastStreamId));
        }
        if (refreshDerived) {
            refreshGraph(snapshot);
            refreshProfileCounts(snapshot);
        }
        adminStatsRepository.save(snapshot);
    }

    public void refreshGraphScienceSnapshot() {
        for (String key : JobGroupContext.isActive() ? List.of(JobGroupContext.groupId() == null ? "global" : JobGroupContext.groupId())
                : List.of("global", com.raxim.myscoutee.domain.groups.api.BaseGroups.WORK_BASE_ID, com.raxim.myscoutee.domain.groups.api.BaseGroups.COMMUNITY_BASE_ID)) {
            AdminStatsSnapshot snapshot = "global".equals(key) ? adminStatsRepository.ensureGlobalSnapshot() : adminStatsRepository.ensureSnapshot(key);
            refreshGraph(snapshot);
            refreshProfileCounts(snapshot);
            snapshot.setGeneratedAtIso(Instant.now().toString());
            adminStatsRepository.save(snapshot);
        }
    }

    private AdminStatsDashboardDto toDto(AdminStatsSnapshot snapshot) {
        Map<String, Long> counters = safeMap(snapshot.getCounters());
        Map<String, Long> attention = safeMap(snapshot.getAttention());
        Map<String, Map<String, Long>> dailyActivity = copyNestedLongMap(snapshot.getDailyActivity());
        Map<String, Map<String, String>> dailyActiveUsers = copyNestedStringMap(snapshot.getDailyActiveUsers());
        Map<String, String> activeUsers = safeStringMap(snapshot.getActiveUsers());
        Map<String, Long> userActivityCounts = safeMap(snapshot.getUserActivityCounts());
        Map<String, Long> departedUserDurationsDays = safeMap(snapshot.getDepartedUserDurationsDays());
        Map<String, Long> profileFillRates = safeMap(snapshot.getProfileFillRates());
        Map<String, String> knownEvents = safeStringMap(snapshot.getKnownEvents());
        Map<String, String> activeEvents = safeStringMap(snapshot.getActiveEvents());
        Map<String, String> knownAssets = safeStringMap(snapshot.getKnownAssets());
        Map<String, String> activeAssets = safeStringMap(snapshot.getActiveAssets());
        Map<String, Long> profileStatusCounts = safeMap(snapshot.getProfileStatusCounts());
        Map<String, Long> profileVisibilityCounts = safeMap(snapshot.getProfileVisibilityCounts());
        Set<String> activeProfileUserIds = safeStringMap(snapshot.getActiveProfileUsers()).keySet();
        long triedUsers = activeUsers.size();
        long activeProfileCount = activeProfileCount(profileVisibilityCounts);
        long onboardingProfiles = profileStatusCounts.getOrDefault("onboarding", 0L);
        long inactiveProfiles = profileStatusCounts.getOrDefault("inactive", 0L);
        long knownProfiles = Math.max(1L, profileStatusCounts.values().stream()
                .filter(Objects::nonNull)
                .mapToLong(Long::longValue)
                .sum());
        long activeUsers7d = countSeenSince(activeUsers, 7, activeProfileUserIds);
        long activeUsers30d = countSeenSince(activeUsers, 30, activeProfileUserIds);
        long returningUsers = userActivityCounts.entrySet().stream()
                .filter(entry -> activeProfileUserIds.contains(entry.getKey()))
                .map(Map.Entry::getValue)
                .filter(value -> value != null && value.longValue() > 1L)
                .count();
        long newRegistrations = counters.getOrDefault("profile.registered", 0L);
        long departedUsers = Math.max(departedUserDurationsDays.size(), counters.getOrDefault("profile.deleted", 0L));
        long medianDaysBeforeDelete = median(departedUserDurationsDays.values().stream()
                .filter(Objects::nonNull)
                .mapToLong(Long::longValue)
                .boxed()
                .toList());
        long averageProfileFill = average(profileFillRates);
        long activeEventCount = activeEvents.size();
        long eventCount = Math.max(activeEventCount, knownEvents.size());
        long activeAssetCount = activeAssets.size();
        long assetCount = Math.max(activeAssetCount, knownAssets.size());
        long matchingOps = sum(counters, "rates.synced");
        long eventInteractions = sum(counters, "event.members.changed", "event.member.joined", "event.member.invited", "event.feedback.submitted");
        long assetInteractions = sum(counters, "asset.requests.changed");
        long communicationOps = sum(counters, "chat.message.sent", "admin.user.warned");
        long moderationOps = sum(counters, "feedback.submitted", "report.submitted", "admin.user.blocked", "admin.user.unblocked");

        List<AdminStatsMetricDto> kpis = List.of(
                metric(
                        "active-profiles",
                        "stats.kpi.active.profiles",
                        activeProfileCount,
                        "groups",
                        "green",
                        pct(activeProfileCount, knownProfiles),
                        null,
                        profileVisibilityCaption(profileVisibilityCounts)),
                metric("onboarding-users", "stats.kpi.onboarding.users", onboardingProfiles, "how_to_reg", "gold", pct(onboardingProfiles, knownProfiles)),
                metric("inactive-profiles", "stats.kpi.inactive.profiles", inactiveProfiles, "visibility_off", "slate", pct(inactiveProfiles, knownProfiles)),
                metric("active-users", "stats.kpi.active.users", activeUsers7d, "person", "blue", pct(activeUsers7d, Math.max(1L, triedUsers))),
                metric("returning-users", "stats.kpi.returning.users", returningUsers, "repeat", "purple", pct(returningUsers, Math.max(1L, triedUsers))),
                metric("departed-users", "stats.kpi.departed.users", departedUsers, "person_remove", "slate", pct(departedUsers, Math.max(1L, triedUsers + departedUsers))),
                metric("active-events", "stats.kpi.active.events", activeEventCount, "event_available", "green", pct(activeEventCount, 40)),
                metric("active-assets", "stats.kpi.active.assets", activeAssetCount, "inventory_2", "gold", pct(activeAssetCount, 40)),
                metric("moderation-pressure", "stats.kpi.moderation.pressure", moderationOps, "shield", attention.isEmpty() ? "slate" : "red", pct(moderationOps, 80))
        );

        List<AdminStatsSegmentDto> segments = List.of(
                segment("community", "stats.segment.community", "person", triedUsers, List.of(
                        item("profile.registered", "stats.event.profile.registered", newRegistrations, Math.max(1L, triedUsers), "person_add", "green"),
                        item("profile.active", "stats.event.profile.active", activeProfileCount, knownProfiles, "groups", "green"),
                        item("profile.onboarding", "stats.event.profile.onboarding", onboardingProfiles, knownProfiles, "how_to_reg", "gold"),
                        item("profile.inactive", "stats.event.profile.inactive", inactiveProfiles, knownProfiles, "visibility_off", "slate"),
                        item("active-users-7d", "stats.event.active.users.7d", activeUsers7d, triedUsers, "person", "blue"),
                        item("active-users-30d", "stats.event.active.users.30d", activeUsers30d, triedUsers, "calendar_month", "green"),
                        item("returning-users", "stats.event.returning.users", returningUsers, triedUsers, "repeat", "purple"),
                        item("profile.deleted", "stats.event.profile.deleted", departedUsers, Math.max(1L, triedUsers + departedUsers), "person_remove", "slate"),
                        item("deleted-median-days", "stats.event.deleted.median.days", medianDaysBeforeDelete, Math.max(1L, medianDaysBeforeDelete), "timer", "gold"),
                        item("profile-fill-average", "stats.event.profile.fill.average", averageProfileFill, 100L, "fact_check", "gold"),
                        item("tried-users", "stats.event.tried.users", triedUsers, triedUsers, "group", "slate")
                )),
                segment("matching", "stats.segment.matching", "hub", matchingOps, List.of(
                        item("rates.synced", "stats.event.rates.synced", counters.getOrDefault("rates.synced", 0L), matchingOps, "star", "gold")
                )),
                segment("activities", "stats.segment.activities", "event_available", eventCount + assetCount + eventInteractions + assetInteractions, List.of(
                        item("active-events", "stats.event.active.events", activeEventCount, eventCount + assetCount + eventInteractions + assetInteractions, "event_available", "green"),
                        item("all-events", "stats.event.all.events", eventCount, eventCount + assetCount + eventInteractions + assetInteractions, "event", "blue"),
                        item("active-assets", "stats.event.active.assets", activeAssetCount, eventCount + assetCount + eventInteractions + assetInteractions, "inventory_2", "gold"),
                        item("all-assets", "stats.event.all.assets", assetCount, eventCount + assetCount + eventInteractions + assetInteractions, "category", "purple"),
                        item("event.members.changed", "stats.event.event.members.changed", eventInteractions, eventInteractions + assetInteractions, "groups", "green"),
                        item("asset.requests.changed", "stats.event.asset.requests.changed", counters.getOrDefault("asset.requests.changed", 0L), eventInteractions + assetInteractions, "handshake", "gold")
                )),
                segment("communication", "stats.segment.communication", "chat", communicationOps, List.of(
                        item("chat.message.sent", "stats.event.chat.message.sent", counters.getOrDefault("chat.message.sent", 0L), communicationOps, "forum", "blue"),
                        item("admin.user.warned", "stats.event.admin.user.warned", counters.getOrDefault("admin.user.warned", 0L), communicationOps, "warning", "gold")
                )),
                segment("moderation", "stats.segment.moderation", "shield", moderationOps, List.of(
                        item("report.submitted", "stats.event.report.submitted", counters.getOrDefault("report.submitted", 0L), moderationOps, "report", "red"),
                        item("feedback.submitted", "stats.event.feedback.submitted", counters.getOrDefault("feedback.submitted", 0L), moderationOps, "feedback", "purple"),
                        item("admin.user.blocked", "stats.event.admin.user.blocked", counters.getOrDefault("admin.user.blocked", 0L), moderationOps, "block", "red"),
                        item("admin.user.unblocked", "stats.event.admin.user.unblocked", counters.getOrDefault("admin.user.unblocked", 0L), moderationOps, "lock_open", "green")
                ))
        );

        return new AdminStatsDashboardDto(
                firstNonBlank(snapshot.getGeneratedAtIso(), Instant.now().toString()),
                firstNonBlank(snapshot.getSource(), "http"),
                snapshot.getHealthScore() == null ? 100 : snapshot.getHealthScore(),
                firstNonBlank(snapshot.getHealthLabelKey(), "stats.health.good"),
                firstNonBlank(snapshot.getHealthSummaryKey(), "stats.health.summary"),
                kpis,
                segments,
                List.of(),
                topItems(snapshot.getTopCities(), "", "location_on", "blue", 6),
                topItems(snapshot.getTopTopics(), "", "local_offer", "purple", 6),
                timelineItems(dailyActivity, dailyActiveUsers),
                topItems(snapshot.getEventTypes(), "", "category", "green", 6),
                activityMixItems(segments),
                graphDto(snapshot));
    }

    private AdminStatsGraphDto graphDto(AdminStatsSnapshot snapshot) {
        Map<String, Long> graphMetrics = safeMap(snapshot.getGraphMetrics());
        Map<String, Long> graphSignals = safeMap(snapshot.getGraphSignals());
        long graphHealth = Math.max(0L, Math.min(100L, snapshot.getGraphHealthScore() == null ? 0L : snapshot.getGraphHealthScore().longValue()));
        long users = graphMetrics.getOrDefault("users", 0L);
        long edges = graphMetrics.getOrDefault("edges", 0L);
        long avgDegreeTenths = graphMetrics.getOrDefault("avg-degree-tenths", 0L);
        long communities = graphMetrics.getOrDefault("communities", 0L);
        long bridgeUsers = graphMetrics.getOrDefault("bridge-users", 0L);
        long networkQuality = graphMetrics.getOrDefault("network-quality", 0L);
        long clusterQuality = graphMetrics.getOrDefault("cluster-quality", 0L);
        long femaleToMaleAvgTenths = graphMetrics.getOrDefault("female-to-male-avg-tenths", 0L);
        long maleToFemaleAvgTenths = graphMetrics.getOrDefault("male-to-female-avg-tenths", 0L);
        List<AdminStatsMetricDto> metrics = List.of(
                graphMetric("graph-health", "stats.graph.metric.health", graphHealth, Long.toString(graphHealth), "monitoring", "green", graphHealth),
                graphMetric("graph-users", "stats.graph.metric.users", users, formatCount(users), "person", "blue", pct(users, Math.max(1L, users))),
                graphMetric("graph-edges", "stats.graph.metric.edges", edges, formatCount(edges), "share", "purple", pct(edges, Math.max(1L, users * 3L))),
                graphMetric("graph-avg-degree", "stats.graph.metric.avg.degree", avgDegreeTenths, String.format(Locale.US, "%.1f", avgDegreeTenths / 10d), "hub", "gold", pct(avgDegreeTenths, 50)),
                graphMetric("graph-communities", "stats.graph.metric.communities", communities, formatCount(communities), "bubble_chart", "green", pct(communities, Math.max(1L, users / 4L))),
                graphMetric("graph-bridges", "stats.graph.metric.bridges", bridgeUsers, formatCount(bridgeUsers), "conversion_path", "red", pct(bridgeUsers, Math.max(1L, users / 8L))),
                graphMetric("graph-network-quality", "stats.graph.metric.network.quality", networkQuality, networkQuality + "%", "ssid_chart", "blue", networkQuality),
                graphMetric("graph-cluster-quality", "stats.graph.metric.cluster.quality", clusterQuality, clusterQuality + "%", "bubble_chart", "green", clusterQuality),
                graphMetric("gender-female-to-male", "stats.graph.metric.gender.female.to.male", femaleToMaleAvgTenths, formatTenths(femaleToMaleAvgTenths), "female", "purple", pct(femaleToMaleAvgTenths, 100)),
                graphMetric("gender-male-to-female", "stats.graph.metric.gender.male.to.female", maleToFemaleAvgTenths, formatTenths(maleToFemaleAvgTenths), "male", "gold", pct(maleToFemaleAvgTenths, 100))
        );
        return new AdminStatsGraphDto(
                (int) graphHealth,
                firstNonBlank(snapshot.getGraphHealthLabelKey(), "stats.graph.health.cold"),
                firstNonBlank(snapshot.getGraphInsightKey(), "stats.graph.insight.cold"),
                metrics,
                topItems(snapshot.getGraphBridgeUsers(), "", "conversion_path", "red", 8),
                topItems(snapshot.getGraphCommunities(), "", "bubble_chart", "green", 8),
                graphSignals(graphSignals),
                graphTimelineItems(snapshot.getDailyGraphActivity()));
    }

    private AdminStatsMetricDto graphMetric(String key, String labelKey, long value, String valueLabel, String icon, String tone, long percent) {
        return new AdminStatsMetricDto(key, labelKey, value, valueLabel, null, null, icon, tone, (int) Math.max(0L, Math.min(100L, percent)));
    }

    private List<AdminStatsBreakdownItemDto> graphSignals(Map<String, Long> signals) {
        if (signals == null || signals.isEmpty()) {
            return List.of();
        }
        return List.of(
                item("reachability-2-hop", "stats.graph.signal.reachability", signals.getOrDefault("reachability-2-hop", 0L), 100L, "travel_explore", "blue"),
                item("weak-tie-ratio", "stats.graph.signal.weak.ties", signals.getOrDefault("weak-tie-ratio", 0L), 100L, "lan", "purple"),
                item("clustering", "stats.graph.signal.clustering", signals.getOrDefault("clustering", 0L), 100L, "bubble_chart", "green"),
                item("recurring-edge-ratio", "stats.graph.signal.recurring", signals.getOrDefault("recurring-edge-ratio", 0L), 100L, "repeat", "gold"),
                item("bridge-coverage", "stats.graph.signal.bridge.coverage", signals.getOrDefault("bridge-coverage", 0L), 100L, "conversion_path", "red"),
                item("largest-community", "stats.graph.signal.largest.community", signals.getOrDefault("largest-community", 0L), 100L, "groups", "slate"),
                item("network-quality", "stats.graph.signal.network.quality", signals.getOrDefault("network-quality", 0L), 100L, "ssid_chart", "blue"),
                item("cluster-quality", "stats.graph.signal.cluster.quality", signals.getOrDefault("cluster-quality", 0L), 100L, "bubble_chart", "green")
        );
    }

    private List<AdminStatsGraphTimelinePointDto> graphTimelineItems(Map<String, Map<String, Long>> dailyGraphActivity) {
        Map<String, Map<String, Long>> valuesByDay = copyNestedLongMap(dailyGraphActivity);
        LocalDate today = LocalDate.now(ZoneOffset.UTC);
        return java.util.stream.IntStream.rangeClosed(0, TIMELINE_DAYS - 1)
                .mapToObj(index -> today.minusDays(TIMELINE_DAYS - 1L - index))
                .map(day -> {
                    String key = day.format(DateTimeFormatter.ISO_LOCAL_DATE);
                    Map<String, Long> values = valuesByDay.getOrDefault(key, Map.of());
                    return new AdminStatsGraphTimelinePointDto(
                            key,
                            day.format(DateTimeFormatter.ofPattern("MMM d", Locale.US)),
                            values.getOrDefault("activeEdges", 0L),
                            values.getOrDefault("newEdges", 0L),
                            values.getOrDefault("recurringEdges", 0L),
                            values.getOrDefault("weakTies", 0L),
                            values.getOrDefault("bridgeUsers", 0L),
                            values.getOrDefault("communities", 0L),
                            values.getOrDefault("networkQuality", 0L),
                            values.getOrDefault("clusterQuality", 0L));
                })
                .toList();
    }

    private void applyDailyActivity(Map<String, Long> day, String eventKey, String domain, long amount) {
        if ("profile.registered".equals(eventKey)) {
            increment(day, "registrations", amount);
        }
        if ("rates.synced".equals(eventKey)) {
            increment(day, "ratings", amount);
        }
        if ("events".equals(domain)) {
            increment(day, "events", amount);
        }
        if ("assets".equals(domain)) {
            increment(day, "assets", amount);
        }
        if ("chat.message.sent".equals(eventKey)) {
            increment(day, "messages", amount);
        }
        if (isAttentionEvent(eventKey)) {
            increment(day, "moderation", amount);
        }
    }

    private void applyEntityActivity(
            Map<String, String> knownEntities,
            Map<String, String> activeEntities,
            String expectedDomain,
            String domain,
            String entityId,
            String eventKey,
            String occurredAtIso) {
        if (!expectedDomain.equals(domain) || !StringUtils.hasText(entityId)) {
            return;
        }
        if (eventKey.contains("deleted") || eventKey.contains("blocked") || eventKey.contains("inactive")) {
            activeEntities.remove(entityId);
            return;
        }
        knownEntities.put(entityId, occurredAtIso);
        activeEntities.put(entityId, occurredAtIso);
    }

    private List<AdminStatsTimelinePointDto> timelineItems(
            Map<String, Map<String, Long>> dailyActivity,
            Map<String, Map<String, String>> dailyActiveUsers) {
        LocalDate today = LocalDate.now(ZoneOffset.UTC);
        return java.util.stream.IntStream.rangeClosed(0, TIMELINE_DAYS - 1)
                .mapToObj(index -> today.minusDays(TIMELINE_DAYS - 1L - index))
                .map(day -> {
                    String key = day.format(DateTimeFormatter.ISO_LOCAL_DATE);
                    Map<String, Long> values = dailyActivity.getOrDefault(key, Map.of());
                    long activeUserCount = dailyActiveUsers.getOrDefault(key, Map.of()).size();
                    return new AdminStatsTimelinePointDto(
                            key,
                            day.format(DateTimeFormatter.ofPattern("MMM d", Locale.US)),
                            values.getOrDefault("registrations", 0L),
                            activeUserCount,
                            values.getOrDefault("ratings", 0L),
                            values.getOrDefault("events", 0L),
                            values.getOrDefault("assets", 0L),
                            values.getOrDefault("messages", 0L),
                            values.getOrDefault("moderation", 0L));
                })
                .toList();
    }

    private AdminStatsMetricDto metric(String key, String labelKey, long value, String icon, String tone, int percent) {
        return metric(key, labelKey, value, icon, tone, percent, null, null);
    }

    private AdminStatsMetricDto metric(
            String key,
            String labelKey,
            long value,
            String icon,
            String tone,
            int percent,
            String captionKey,
            String caption) {
        return new AdminStatsMetricDto(key, labelKey, value, formatCount(value), captionKey, caption, icon, tone, percent);
    }

    private AdminStatsSegmentDto segment(String key, String labelKey, String icon, long total, List<AdminStatsBreakdownItemDto> items) {
        return new AdminStatsSegmentDto(
                key,
                labelKey,
                icon,
                total,
                pct(total, 120),
                "stats.segment.summary",
                null,
                items);
    }

    private AdminStatsBreakdownItemDto item(String key, String labelKey, long value, long total, String icon, String tone) {
        return new AdminStatsBreakdownItemDto(key, labelKey, null, value, Math.max(1L, total), icon, tone);
    }

    private List<AdminStatsBreakdownItemDto> topItems(Map<String, Long> values, String labelPrefix, String icon, String tone, int limit) {
        if (values == null || values.isEmpty()) {
            return List.of();
        }
        long total = values.values().stream().mapToLong(Long::longValue).sum();
        return values.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue(Comparator.reverseOrder()).thenComparing(Map.Entry::getKey))
                .limit(Math.max(1, limit))
                .map(entry -> new AdminStatsBreakdownItemDto(
                        normalizeKey(entry.getKey()),
                        StringUtils.hasText(labelPrefix) ? labelPrefix + normalizeKey(entry.getKey()) : "",
                        StringUtils.hasText(labelPrefix) ? null : entry.getKey(),
                        entry.getValue(),
                        Math.max(1L, total),
                        icon,
                        tone))
                .toList();
    }

    private List<AdminStatsBreakdownItemDto> activityMixItems(List<AdminStatsSegmentDto> segments) {
        if (segments == null || segments.isEmpty()) {
            return List.of();
        }
        long total = segments.stream()
                .map(AdminStatsSegmentDto::total)
                .filter(Objects::nonNull)
                .mapToLong(Long::longValue)
                .sum();
        return segments.stream()
                .map(segment -> new AdminStatsBreakdownItemDto(
                        normalizeKey(segment.key()),
                        segment.labelKey(),
                        null,
                        Math.max(0L, segment.total() == null ? 0L : segment.total()),
                        Math.max(1L, total),
                        segment.icon(),
                        toneForSegment(segment.key())))
                .toList();
    }

    private String toneForSegment(String key) {
        return switch (normalizeKey(key)) {
            case "community" -> "blue";
            case "matching" -> "purple";
            case "activities" -> "green";
            case "communication" -> "gold";
            case "moderation" -> "red";
            default -> "slate";
        };
    }

    private long countSeenSince(Map<String, String> lastSeenById, int days) {
        return countSeenSince(lastSeenById, days, null);
    }

    private long countSeenSince(Map<String, String> lastSeenById, int days, Set<String> allowedUserIds) {
        if (lastSeenById == null || lastSeenById.isEmpty()) {
            return 0L;
        }
        Instant threshold = Instant.now().minusSeconds(Math.max(1, days) * 24L * 60L * 60L);
        return lastSeenById.entrySet().stream()
                .filter(entry -> allowedUserIds == null || allowedUserIds.contains(entry.getKey()))
                .map(Map.Entry::getValue)
                .map(this::parseInstant)
                .filter(Objects::nonNull)
                .filter(value -> !value.isBefore(threshold))
                .count();
    }

    private void refreshGraph(AdminStatsSnapshot snapshot) {
        var result = adminGraphScienceService.refresh(snapshot.getStatsKey(), snapshot.getDailyGraphActivity());
        snapshot.setGraphHealthScore(result.healthScore());
        snapshot.setGraphHealthLabelKey(result.healthLabelKey());
        snapshot.setGraphInsightKey(result.insightKey());
        snapshot.setGraphMetrics(result.metrics());
        snapshot.setGraphBridgeUsers(result.bridgeUsers());
        snapshot.setGraphCommunities(result.communities());
        snapshot.setGraphSignals(result.signals());
        snapshot.setDailyGraphActivity(result.dailyGraphActivity());
    }

    private void refreshProfileCounts(AdminStatsSnapshot snapshot) {
        var counts = profileStatistics.counts(snapshot.getStatsKey());
        snapshot.setProfileStatusCounts(counts.statusCounts());
        snapshot.setProfileVisibilityCounts(counts.visibilityCounts());
        snapshot.setActiveProfileUsers(counts.activeProfileUsers());
        snapshot.setActiveProfileGenders(counts.activeGenders());
    }

    private long activeProfileCount(Map<String, Long> profileVisibilityCounts) {
        if (profileVisibilityCounts == null || profileVisibilityCounts.isEmpty()) {
            return 0L;
        }
        return ACTIVE_PROFILE_STATUSES.stream()
                .mapToLong(status -> profileVisibilityCounts.getOrDefault(status, 0L))
                .sum();
    }

    private String profileVisibilityCaption(Map<String, Long> profileVisibilityCounts) {
        Map<String, Long> counts = profileVisibilityCounts == null ? Map.of() : profileVisibilityCounts;
        return String.format(
                Locale.US,
                "Public %d · Friends %d · Host %d",
                counts.getOrDefault("public", 0L),
                counts.getOrDefault("friends only", 0L),
                counts.getOrDefault("host only", 0L));
    }

    private void trimDailyMaps(
            Map<String, Map<String, Long>> dailyActivity,
            Map<String, Map<String, String>> dailyActiveUsers) {
        LocalDate minDay = LocalDate.now(ZoneOffset.UTC).minusDays(STORED_DAILY_DAYS);
        dailyActivity.keySet().removeIf(key -> isBeforeDay(key, minDay));
        dailyActiveUsers.keySet().removeIf(key -> isBeforeDay(key, minDay));
    }

    private boolean isBeforeDay(String key, LocalDate minDay) {
        try {
            return LocalDate.parse(safeText(key), DateTimeFormatter.ISO_LOCAL_DATE).isBefore(minDay);
        } catch (RuntimeException ignored) {
            return false;
        }
    }

    private String dayKey(String occurredAtIso) {
        Instant instant = parseInstant(occurredAtIso);
        return (instant == null ? Instant.now() : instant)
                .atZone(ZoneOffset.UTC)
                .toLocalDate()
                .format(DateTimeFormatter.ISO_LOCAL_DATE);
    }

    private boolean isAttentionEvent(String eventKey) {
        return eventKey.startsWith("admin.user.block")
                || eventKey.startsWith("report.")
                || eventKey.startsWith("feedback.")
                || eventKey.endsWith(".failed");
    }

    private int calculateHealthScore(Map<String, Long> counters, Map<String, Long> attention) {
        long positive = sum(counters, "profile.registered", "rates.synced", "event.synced", "event.members.changed", "asset.saved", "chat.message.sent");
        long risk = attention.values().stream().mapToLong(Long::longValue).sum();
        int score = 92 + (int) Math.min(8, positive / 25) - (int) Math.min(55, risk * 5);
        return Math.max(35, Math.min(100, score));
    }

    private void increment(Map<String, Long> values, String key, long amount) {
        if (!StringUtils.hasText(key)) {
            return;
        }
        values.put(key, values.getOrDefault(key, 0L) + Math.max(1L, amount));
    }

    private long sum(Map<String, Long> values, String... keys) {
        long total = 0L;
        for (String key : keys) {
            total += values.getOrDefault(key, 0L);
        }
        return total;
    }

    private long average(Map<String, Long> values) {
        if (values == null || values.isEmpty()) {
            return 0L;
        }
        return Math.round(values.values().stream()
                .filter(Objects::nonNull)
                .mapToLong(Long::longValue)
                .average()
                .orElse(0d));
    }

    private long median(List<Long> values) {
        if (values == null || values.isEmpty()) {
            return 0L;
        }
        List<Long> sorted = new ArrayList<>(values.stream()
                .filter(Objects::nonNull)
                .sorted()
                .toList());
        if (sorted.isEmpty()) {
            return 0L;
        }
        int middle = sorted.size() / 2;
        if (sorted.size() % 2 == 1) {
            return sorted.get(middle);
        }
        return Math.round((sorted.get(middle - 1) + sorted.get(middle)) / 2d);
    }

    private long daysBetween(String startIso, String endIso) {
        Instant start = parseInstant(startIso);
        Instant end = parseInstant(endIso);
        if (start == null || end == null || end.isBefore(start)) {
            return 0L;
        }
        return Math.max(0L, ChronoUnit.DAYS.between(start, end));
    }

    private Long tagLong(Map<String, String> tags, String key) {
        if (tags == null || !StringUtils.hasText(key)) {
            return null;
        }
        String value = safeText(tags.get(key));
        if (!StringUtils.hasText(value)) {
            return null;
        }
        try {
            return Long.parseLong(value);
        } catch (NumberFormatException ignored) {
            return null;
        }
    }

    private int pct(long value, long max) {
        return (int) Math.max(0, Math.min(100, Math.round((double) value * 100d / Math.max(1L, max))));
    }

    private String formatCount(long value) {
        if (value >= 1_000_000L) {
            return String.format(Locale.US, "%.1fM", value / 1_000_000d);
        }
        if (value >= 1_000L) {
            return String.format(Locale.US, "%.1fk", value / 1_000d);
        }
        return Long.toString(value);
    }

    private String formatTenths(long value) {
        return value <= 0L ? "n/a" : String.format(Locale.US, "%.1f", value / 10d);
    }

    private Map<String, Long> safeMap(Map<String, Long> values) {
        return values == null ? Map.of() : values;
    }

    private Map<String, String> safeStringMap(Map<String, String> values) {
        return values == null ? Map.of() : values;
    }

    private Map<String, Map<String, Long>> copyNestedLongMap(Map<String, Map<String, Long>> values) {
        Map<String, Map<String, Long>> copy = new LinkedHashMap<>();
        if (values == null) {
            return copy;
        }
        values.forEach((key, value) -> copy.put(key, value == null ? new LinkedHashMap<>() : new LinkedHashMap<>(value)));
        return copy;
    }

    private Map<String, Map<String, String>> copyNestedStringMap(Map<String, Map<String, String>> values) {
        Map<String, Map<String, String>> copy = new LinkedHashMap<>();
        if (values == null) {
            return copy;
        }
        values.forEach((key, value) -> copy.put(key, value == null ? new LinkedHashMap<>() : new LinkedHashMap<>(value)));
        return copy;
    }

    private String normalizeKey(String value) {
        return safeText(value).toLowerCase(Locale.ROOT).replace(' ', '-').replace('_', '-');
    }

    private String firstNonBlank(String value, String fallback) {
        String normalized = safeText(value);
        return StringUtils.hasText(normalized) ? normalized : fallback;
    }

    private Instant parseInstant(String value) {
        try {
            return Instant.parse(safeText(value));
        } catch (RuntimeException ignored) {
            return null;
        }
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }
}
