package com.raxim.myscoutee.profile.data.document;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "adminStats")
public class AdminStatsSnapshot {
    @Id
    private String id;

    @Indexed(name = "admin_stats_key", unique = true)
    private String statsKey;

    private String generatedAtIso;
    private String source;
    private Integer healthScore;
    private String healthLabelKey;
    private String healthSummaryKey;
    private String lastTelemetryStreamId;
    private Map<String, Long> counters = new LinkedHashMap<>();
    private Map<String, Long> attention = new LinkedHashMap<>();
    private Map<String, Long> topCities = new LinkedHashMap<>();
    private Map<String, Long> topTopics = new LinkedHashMap<>();
    private Map<String, Long> eventTypes = new LinkedHashMap<>();
    private Map<String, Long> activityMix = new LinkedHashMap<>();
    private Map<String, Map<String, Long>> dailyActivity = new LinkedHashMap<>();
    private Map<String, Map<String, String>> dailyActiveUsers = new LinkedHashMap<>();
    private Map<String, String> activeUsers = new LinkedHashMap<>();
    private Map<String, String> userFirstSeen = new LinkedHashMap<>();
    private Map<String, Long> userActivityCounts = new LinkedHashMap<>();
    private Map<String, Long> departedUserDurationsDays = new LinkedHashMap<>();
    private Map<String, Long> profileFillRates = new LinkedHashMap<>();
    private Map<String, String> knownEvents = new LinkedHashMap<>();
    private Map<String, String> activeEvents = new LinkedHashMap<>();
    private Map<String, String> knownAssets = new LinkedHashMap<>();
    private Map<String, String> activeAssets = new LinkedHashMap<>();
    private Map<String, Long> profileStatusCounts = new LinkedHashMap<>();
    private Map<String, Long> profileVisibilityCounts = new LinkedHashMap<>();
    private Map<String, String> activeProfileUsers = new LinkedHashMap<>();
    private Integer graphHealthScore;
    private String graphHealthLabelKey;
    private String graphInsightKey;
    private Map<String, Long> graphMetrics = new LinkedHashMap<>();
    private Map<String, Long> graphBridgeUsers = new LinkedHashMap<>();
    private Map<String, Long> graphCommunities = new LinkedHashMap<>();
    private Map<String, Long> graphSignals = new LinkedHashMap<>();
    private Map<String, Map<String, Long>> dailyGraphActivity = new LinkedHashMap<>();
    private Map<String, Long> revenueMetrics = new LinkedHashMap<>();
    private Map<String, Long> revenueAssetCategories = new LinkedHashMap<>();
    private Map<String, Map<String, Long>> dailyRevenueActivity = new LinkedHashMap<>();

    public static AdminStatsSnapshot createDefault(String statsKey) {
        AdminStatsSnapshot snapshot = new AdminStatsSnapshot();
        snapshot.setId(new ObjectId().toHexString());
        snapshot.setStatsKey(statsKey);
        snapshot.setGeneratedAtIso(Instant.now().toString());
        snapshot.setSource("http");
        snapshot.setHealthScore(100);
        snapshot.setHealthLabelKey("stats.health.good");
        snapshot.setHealthSummaryKey("stats.health.summary");
        snapshot.setLastTelemetryStreamId("0-0");
        return snapshot;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getStatsKey() { return statsKey; }
    public void setStatsKey(String statsKey) { this.statsKey = statsKey; }
    public String getGeneratedAtIso() { return generatedAtIso; }
    public void setGeneratedAtIso(String generatedAtIso) { this.generatedAtIso = generatedAtIso; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    public Integer getHealthScore() { return healthScore; }
    public void setHealthScore(Integer healthScore) { this.healthScore = healthScore; }
    public String getHealthLabelKey() { return healthLabelKey; }
    public void setHealthLabelKey(String healthLabelKey) { this.healthLabelKey = healthLabelKey; }
    public String getHealthSummaryKey() { return healthSummaryKey; }
    public void setHealthSummaryKey(String healthSummaryKey) { this.healthSummaryKey = healthSummaryKey; }
    public String getLastTelemetryStreamId() { return lastTelemetryStreamId; }
    public void setLastTelemetryStreamId(String lastTelemetryStreamId) { this.lastTelemetryStreamId = lastTelemetryStreamId; }
    public Map<String, Long> getCounters() { return counters; }
    public void setCounters(Map<String, Long> counters) { this.counters = counters == null ? new LinkedHashMap<>() : new LinkedHashMap<>(counters); }
    public Map<String, Long> getAttention() { return attention; }
    public void setAttention(Map<String, Long> attention) { this.attention = attention == null ? new LinkedHashMap<>() : new LinkedHashMap<>(attention); }
    public Map<String, Long> getTopCities() { return topCities; }
    public void setTopCities(Map<String, Long> topCities) { this.topCities = topCities == null ? new LinkedHashMap<>() : new LinkedHashMap<>(topCities); }
    public Map<String, Long> getTopTopics() { return topTopics; }
    public void setTopTopics(Map<String, Long> topTopics) { this.topTopics = topTopics == null ? new LinkedHashMap<>() : new LinkedHashMap<>(topTopics); }
    public Map<String, Long> getEventTypes() { return eventTypes; }
    public void setEventTypes(Map<String, Long> eventTypes) { this.eventTypes = eventTypes == null ? new LinkedHashMap<>() : new LinkedHashMap<>(eventTypes); }
    public Map<String, Long> getActivityMix() { return activityMix; }
    public void setActivityMix(Map<String, Long> activityMix) { this.activityMix = activityMix == null ? new LinkedHashMap<>() : new LinkedHashMap<>(activityMix); }
    public Map<String, Map<String, Long>> getDailyActivity() { return dailyActivity; }
    public void setDailyActivity(Map<String, Map<String, Long>> dailyActivity) {
        this.dailyActivity = new LinkedHashMap<>();
        if (dailyActivity == null) {
            return;
        }
        dailyActivity.forEach((key, value) -> this.dailyActivity.put(key, value == null ? new LinkedHashMap<>() : new LinkedHashMap<>(value)));
    }
    public Map<String, Map<String, String>> getDailyActiveUsers() { return dailyActiveUsers; }
    public void setDailyActiveUsers(Map<String, Map<String, String>> dailyActiveUsers) {
        this.dailyActiveUsers = new LinkedHashMap<>();
        if (dailyActiveUsers == null) {
            return;
        }
        dailyActiveUsers.forEach((key, value) -> this.dailyActiveUsers.put(key, value == null ? new LinkedHashMap<>() : new LinkedHashMap<>(value)));
    }
    public Map<String, String> getActiveUsers() { return activeUsers; }
    public void setActiveUsers(Map<String, String> activeUsers) { this.activeUsers = activeUsers == null ? new LinkedHashMap<>() : new LinkedHashMap<>(activeUsers); }
    public Map<String, String> getUserFirstSeen() { return userFirstSeen; }
    public void setUserFirstSeen(Map<String, String> userFirstSeen) { this.userFirstSeen = userFirstSeen == null ? new LinkedHashMap<>() : new LinkedHashMap<>(userFirstSeen); }
    public Map<String, Long> getUserActivityCounts() { return userActivityCounts; }
    public void setUserActivityCounts(Map<String, Long> userActivityCounts) { this.userActivityCounts = userActivityCounts == null ? new LinkedHashMap<>() : new LinkedHashMap<>(userActivityCounts); }
    public Map<String, Long> getDepartedUserDurationsDays() { return departedUserDurationsDays; }
    public void setDepartedUserDurationsDays(Map<String, Long> departedUserDurationsDays) { this.departedUserDurationsDays = departedUserDurationsDays == null ? new LinkedHashMap<>() : new LinkedHashMap<>(departedUserDurationsDays); }
    public Map<String, Long> getProfileFillRates() { return profileFillRates; }
    public void setProfileFillRates(Map<String, Long> profileFillRates) { this.profileFillRates = profileFillRates == null ? new LinkedHashMap<>() : new LinkedHashMap<>(profileFillRates); }
    public Map<String, String> getKnownEvents() { return knownEvents; }
    public void setKnownEvents(Map<String, String> knownEvents) { this.knownEvents = knownEvents == null ? new LinkedHashMap<>() : new LinkedHashMap<>(knownEvents); }
    public Map<String, String> getActiveEvents() { return activeEvents; }
    public void setActiveEvents(Map<String, String> activeEvents) { this.activeEvents = activeEvents == null ? new LinkedHashMap<>() : new LinkedHashMap<>(activeEvents); }
    public Map<String, String> getKnownAssets() { return knownAssets; }
    public void setKnownAssets(Map<String, String> knownAssets) { this.knownAssets = knownAssets == null ? new LinkedHashMap<>() : new LinkedHashMap<>(knownAssets); }
    public Map<String, String> getActiveAssets() { return activeAssets; }
    public void setActiveAssets(Map<String, String> activeAssets) { this.activeAssets = activeAssets == null ? new LinkedHashMap<>() : new LinkedHashMap<>(activeAssets); }
    public Map<String, Long> getProfileStatusCounts() { return profileStatusCounts; }
    public void setProfileStatusCounts(Map<String, Long> profileStatusCounts) { this.profileStatusCounts = profileStatusCounts == null ? new LinkedHashMap<>() : new LinkedHashMap<>(profileStatusCounts); }
    public Map<String, Long> getProfileVisibilityCounts() { return profileVisibilityCounts; }
    public void setProfileVisibilityCounts(Map<String, Long> profileVisibilityCounts) { this.profileVisibilityCounts = profileVisibilityCounts == null ? new LinkedHashMap<>() : new LinkedHashMap<>(profileVisibilityCounts); }
    public Map<String, String> getActiveProfileUsers() { return activeProfileUsers; }
    public void setActiveProfileUsers(Map<String, String> activeProfileUsers) { this.activeProfileUsers = activeProfileUsers == null ? new LinkedHashMap<>() : new LinkedHashMap<>(activeProfileUsers); }
    public Integer getGraphHealthScore() { return graphHealthScore; }
    public void setGraphHealthScore(Integer graphHealthScore) { this.graphHealthScore = graphHealthScore; }
    public String getGraphHealthLabelKey() { return graphHealthLabelKey; }
    public void setGraphHealthLabelKey(String graphHealthLabelKey) { this.graphHealthLabelKey = graphHealthLabelKey; }
    public String getGraphInsightKey() { return graphInsightKey; }
    public void setGraphInsightKey(String graphInsightKey) { this.graphInsightKey = graphInsightKey; }
    public Map<String, Long> getGraphMetrics() { return graphMetrics; }
    public void setGraphMetrics(Map<String, Long> graphMetrics) { this.graphMetrics = graphMetrics == null ? new LinkedHashMap<>() : new LinkedHashMap<>(graphMetrics); }
    public Map<String, Long> getGraphBridgeUsers() { return graphBridgeUsers; }
    public void setGraphBridgeUsers(Map<String, Long> graphBridgeUsers) { this.graphBridgeUsers = graphBridgeUsers == null ? new LinkedHashMap<>() : new LinkedHashMap<>(graphBridgeUsers); }
    public Map<String, Long> getGraphCommunities() { return graphCommunities; }
    public void setGraphCommunities(Map<String, Long> graphCommunities) { this.graphCommunities = graphCommunities == null ? new LinkedHashMap<>() : new LinkedHashMap<>(graphCommunities); }
    public Map<String, Long> getGraphSignals() { return graphSignals; }
    public void setGraphSignals(Map<String, Long> graphSignals) { this.graphSignals = graphSignals == null ? new LinkedHashMap<>() : new LinkedHashMap<>(graphSignals); }
    public Map<String, Map<String, Long>> getDailyGraphActivity() { return dailyGraphActivity; }
    public void setDailyGraphActivity(Map<String, Map<String, Long>> dailyGraphActivity) {
        this.dailyGraphActivity = new LinkedHashMap<>();
        if (dailyGraphActivity == null) {
            return;
        }
        dailyGraphActivity.forEach((key, value) -> this.dailyGraphActivity.put(key, value == null ? new LinkedHashMap<>() : new LinkedHashMap<>(value)));
    }
    public Map<String, Long> getRevenueMetrics() { return revenueMetrics; }
    public void setRevenueMetrics(Map<String, Long> revenueMetrics) { this.revenueMetrics = revenueMetrics == null ? new LinkedHashMap<>() : new LinkedHashMap<>(revenueMetrics); }
    public Map<String, Long> getRevenueAssetCategories() { return revenueAssetCategories; }
    public void setRevenueAssetCategories(Map<String, Long> revenueAssetCategories) { this.revenueAssetCategories = revenueAssetCategories == null ? new LinkedHashMap<>() : new LinkedHashMap<>(revenueAssetCategories); }
    public Map<String, Map<String, Long>> getDailyRevenueActivity() { return dailyRevenueActivity; }
    public void setDailyRevenueActivity(Map<String, Map<String, Long>> dailyRevenueActivity) {
        this.dailyRevenueActivity = new LinkedHashMap<>();
        if (dailyRevenueActivity == null) {
            return;
        }
        dailyRevenueActivity.forEach((key, value) -> this.dailyRevenueActivity.put(key, value == null ? new LinkedHashMap<>() : new LinkedHashMap<>(value)));
    }
}
