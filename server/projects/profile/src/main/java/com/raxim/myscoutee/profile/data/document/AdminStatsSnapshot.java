package com.raxim.myscoutee.profile.data.document;

import java.util.LinkedHashMap;
import java.util.Map;

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
    private Map<String, Long> userActivityCounts = new LinkedHashMap<>();
    private Map<String, Long> profileFillRates = new LinkedHashMap<>();
    private Map<String, String> knownEvents = new LinkedHashMap<>();
    private Map<String, String> activeEvents = new LinkedHashMap<>();
    private Map<String, String> knownAssets = new LinkedHashMap<>();
    private Map<String, String> activeAssets = new LinkedHashMap<>();

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
    public Map<String, Long> getUserActivityCounts() { return userActivityCounts; }
    public void setUserActivityCounts(Map<String, Long> userActivityCounts) { this.userActivityCounts = userActivityCounts == null ? new LinkedHashMap<>() : new LinkedHashMap<>(userActivityCounts); }
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
}
