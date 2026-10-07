package com.raxim.myscoutee.domain.email.document;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "emailCampaignRules")
public class EmailCampaignRule {
    @Id
    private String id;
    private String baseGroupId;
    public String getBaseGroupId() { return baseGroupId; }
    public void setBaseGroupId(String value) { baseGroupId = value; }

    @Indexed(name = "email_campaign_rule_sync_key", unique = true, sparse = true)
    private String syncKey;

    private String ruleKey;

    private String name;
    private String description;
    private String templateKey;
    private String notificationTemplateKey;
    private String triggerType;
    private Boolean enabled;
    private Boolean suspended;
    private String scheduleType;
    private String cronExpression;
    private String timezone;
    private String oneTimeAtIso;
    private String audienceScope;
    private String eventId;
    private Boolean running;
    private String lastRunAtIso;
    private String nextRunAtIso;
    private String lastRunStatus;
    private String lastRunDetail;
    private Integer lastRunCount;
    private Integer priority;
    private Integer cooldownHours;
    private Integer maxDeliveriesPerUser;
    private Integer minProfileCompletion;
    private Integer maxProfileCompletion;
    private Integer minEventCount;
    private Integer maxEventCount;
    private Integer minHostingCount;
    private Integer maxHostingCount;
    private Integer minInactiveDays;
    private Integer maxInactiveDays;
    private Boolean requirePublicProfile;
    private Boolean requireMissingRegisteredDevice;
    private List<String> countryCodes = new ArrayList<>();
    private String ctaPath;
    private Map<String, String> templateVariables = new LinkedHashMap<>();
    private String createdDate;
    private String createdUser;
    private String updatedDate;
    private String updatedUser;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSyncKey() {
        return syncKey;
    }

    public void setSyncKey(String syncKey) {
        this.syncKey = syncKey;
    }

    public String getRuleKey() {
        return ruleKey;
    }

    public void setRuleKey(String ruleKey) {
        this.ruleKey = ruleKey;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getTemplateKey() {
        return templateKey;
    }

    public void setTemplateKey(String templateKey) {
        this.templateKey = templateKey;
    }

    public String getNotificationTemplateKey() {
        return notificationTemplateKey;
    }

    public void setNotificationTemplateKey(String notificationTemplateKey) {
        this.notificationTemplateKey = notificationTemplateKey;
    }

    public String getTriggerType() {
        return triggerType;
    }

    public void setTriggerType(String triggerType) {
        this.triggerType = triggerType;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public Boolean getSuspended() {
        return suspended;
    }

    public void setSuspended(Boolean suspended) {
        this.suspended = suspended;
    }

    public String getScheduleType() {
        return scheduleType;
    }

    public void setScheduleType(String scheduleType) {
        this.scheduleType = scheduleType;
    }

    public String getCronExpression() {
        return cronExpression;
    }

    public void setCronExpression(String cronExpression) {
        this.cronExpression = cronExpression;
    }

    public String getTimezone() {
        return timezone;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }

    public String getOneTimeAtIso() {
        return oneTimeAtIso;
    }

    public void setOneTimeAtIso(String oneTimeAtIso) {
        this.oneTimeAtIso = oneTimeAtIso;
    }

    public String getAudienceScope() {
        return audienceScope;
    }

    public void setAudienceScope(String audienceScope) {
        this.audienceScope = audienceScope;
    }

    public String getEventId() {
        return eventId;
    }

    public void setEventId(String eventId) {
        this.eventId = eventId;
    }

    public Boolean getRunning() {
        return running;
    }

    public void setRunning(Boolean running) {
        this.running = running;
    }

    public String getLastRunAtIso() {
        return lastRunAtIso;
    }

    public void setLastRunAtIso(String lastRunAtIso) {
        this.lastRunAtIso = lastRunAtIso;
    }

    public String getNextRunAtIso() {
        return nextRunAtIso;
    }

    public void setNextRunAtIso(String nextRunAtIso) {
        this.nextRunAtIso = nextRunAtIso;
    }

    public String getLastRunStatus() {
        return lastRunStatus;
    }

    public void setLastRunStatus(String lastRunStatus) {
        this.lastRunStatus = lastRunStatus;
    }

    public String getLastRunDetail() {
        return lastRunDetail;
    }

    public void setLastRunDetail(String lastRunDetail) {
        this.lastRunDetail = lastRunDetail;
    }

    public Integer getLastRunCount() {
        return lastRunCount;
    }

    public void setLastRunCount(Integer lastRunCount) {
        this.lastRunCount = lastRunCount;
    }

    public Integer getPriority() {
        return priority;
    }

    public void setPriority(Integer priority) {
        this.priority = priority;
    }

    public Integer getCooldownHours() {
        return cooldownHours;
    }

    public void setCooldownHours(Integer cooldownHours) {
        this.cooldownHours = cooldownHours;
    }

    public Integer getMaxDeliveriesPerUser() {
        return maxDeliveriesPerUser;
    }

    public void setMaxDeliveriesPerUser(Integer maxDeliveriesPerUser) {
        this.maxDeliveriesPerUser = maxDeliveriesPerUser;
    }

    public Integer getMinProfileCompletion() {
        return minProfileCompletion;
    }

    public void setMinProfileCompletion(Integer minProfileCompletion) {
        this.minProfileCompletion = minProfileCompletion;
    }

    public Integer getMaxProfileCompletion() {
        return maxProfileCompletion;
    }

    public void setMaxProfileCompletion(Integer maxProfileCompletion) {
        this.maxProfileCompletion = maxProfileCompletion;
    }

    public Integer getMinEventCount() {
        return minEventCount;
    }

    public void setMinEventCount(Integer minEventCount) {
        this.minEventCount = minEventCount;
    }

    public Integer getMaxEventCount() {
        return maxEventCount;
    }

    public void setMaxEventCount(Integer maxEventCount) {
        this.maxEventCount = maxEventCount;
    }

    public Integer getMinHostingCount() {
        return minHostingCount;
    }

    public void setMinHostingCount(Integer minHostingCount) {
        this.minHostingCount = minHostingCount;
    }

    public Integer getMaxHostingCount() {
        return maxHostingCount;
    }

    public void setMaxHostingCount(Integer maxHostingCount) {
        this.maxHostingCount = maxHostingCount;
    }

    public Integer getMinInactiveDays() {
        return minInactiveDays;
    }

    public void setMinInactiveDays(Integer minInactiveDays) {
        this.minInactiveDays = minInactiveDays;
    }

    public Integer getMaxInactiveDays() {
        return maxInactiveDays;
    }

    public void setMaxInactiveDays(Integer maxInactiveDays) {
        this.maxInactiveDays = maxInactiveDays;
    }

    public Boolean getRequirePublicProfile() {
        return requirePublicProfile;
    }

    public void setRequirePublicProfile(Boolean requirePublicProfile) {
        this.requirePublicProfile = requirePublicProfile;
    }

    public Boolean getRequireMissingRegisteredDevice() {
        return requireMissingRegisteredDevice;
    }

    public void setRequireMissingRegisteredDevice(Boolean requireMissingRegisteredDevice) {
        this.requireMissingRegisteredDevice = requireMissingRegisteredDevice;
    }

    public List<String> getCountryCodes() {
        return countryCodes;
    }

    public void setCountryCodes(List<String> countryCodes) {
        this.countryCodes = countryCodes == null ? new ArrayList<>() : new ArrayList<>(countryCodes);
    }

    public String getCtaPath() {
        return ctaPath;
    }

    public void setCtaPath(String ctaPath) {
        this.ctaPath = ctaPath;
    }

    public Map<String, String> getTemplateVariables() {
        return templateVariables;
    }

    public void setTemplateVariables(Map<String, String> templateVariables) {
        this.templateVariables = templateVariables == null ? new LinkedHashMap<>() : new LinkedHashMap<>(templateVariables);
    }

    public String getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(String createdDate) {
        this.createdDate = createdDate;
    }

    public String getCreatedUser() {
        return createdUser;
    }

    public void setCreatedUser(String createdUser) {
        this.createdUser = createdUser;
    }

    public String getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(String updatedDate) {
        this.updatedDate = updatedDate;
    }

    public String getUpdatedUser() {
        return updatedUser;
    }

    public void setUpdatedUser(String updatedUser) {
        this.updatedUser = updatedUser;
    }
}
