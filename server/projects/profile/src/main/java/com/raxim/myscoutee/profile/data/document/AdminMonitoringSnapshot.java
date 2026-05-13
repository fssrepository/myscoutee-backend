package com.raxim.myscoutee.profile.data.document;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "adminMonitoring")
public class AdminMonitoringSnapshot {
    @Id
    private String id;

    @Indexed(name = "admin_monitoring_key", unique = true)
    private String monitoringKey;

    private String generatedAtIso;
    private String source;
    private String health;
    private String lastTelemetryStreamId;
    private Map<String, Long> counters = new LinkedHashMap<>();
    private Map<String, Long> categoryCounters = new LinkedHashMap<>();
    private Map<String, Long> nodeCounters = new LinkedHashMap<>();
    private Map<String, Long> alertCounters = new LinkedHashMap<>();

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getMonitoringKey() { return monitoringKey; }
    public void setMonitoringKey(String monitoringKey) { this.monitoringKey = monitoringKey; }
    public String getGeneratedAtIso() { return generatedAtIso; }
    public void setGeneratedAtIso(String generatedAtIso) { this.generatedAtIso = generatedAtIso; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    public String getHealth() { return health; }
    public void setHealth(String health) { this.health = health; }
    public String getLastTelemetryStreamId() { return lastTelemetryStreamId; }
    public void setLastTelemetryStreamId(String lastTelemetryStreamId) { this.lastTelemetryStreamId = lastTelemetryStreamId; }
    public Map<String, Long> getCounters() { return counters; }
    public void setCounters(Map<String, Long> counters) { this.counters = copy(counters); }
    public Map<String, Long> getCategoryCounters() { return categoryCounters; }
    public void setCategoryCounters(Map<String, Long> categoryCounters) { this.categoryCounters = copy(categoryCounters); }
    public Map<String, Long> getNodeCounters() { return nodeCounters; }
    public void setNodeCounters(Map<String, Long> nodeCounters) { this.nodeCounters = copy(nodeCounters); }
    public Map<String, Long> getAlertCounters() { return alertCounters; }
    public void setAlertCounters(Map<String, Long> alertCounters) { this.alertCounters = copy(alertCounters); }

    private Map<String, Long> copy(Map<String, Long> source) {
        return source == null ? new LinkedHashMap<>() : new LinkedHashMap<>(source);
    }
}
