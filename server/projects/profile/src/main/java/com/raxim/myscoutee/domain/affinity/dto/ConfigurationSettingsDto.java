package com.raxim.myscoutee.domain.affinity.dto;

import com.raxim.myscoutee.domain.affinity.api.ConfigurationCatalog;

/** Explicit settings contract; excludes affinity weights, persistence IDs and audit metadata. */
public record ConfigurationSettingsDto(String key, NotificationSettingsDto notifications, JobSettingsDto jobs)
        implements ConfigurationCatalog.Settings {
    @Override public String getKey() { return key; }
    @Override public NotificationSettingsDto getNotifications() { return notifications; }
    @Override public JobSettingsDto getJobs() { return jobs; }
    public static ConfigurationSettingsDto from(ConfigurationCatalog.Settings value) {
        return value == null ? null : new ConfigurationSettingsDto(value.getKey(),
                NotificationSettingsDto.from(value.getNotifications()), JobSettingsDto.from(value.getJobs()));
    }
    public record NotificationSettingsDto(
            Integer firebaseWindowStartHour,
            Integer firebaseWindowEndHour,
            Integer maxWorkers,
            Integer maxRetries,
            Integer initialBackoffSeconds,
            Integer collapseWindowSeconds,
            Integer multicastThreshold,
            Integer topicThreshold) implements ConfigurationCatalog.NotificationParameters {
        @Override public Integer getFirebaseWindowStartHour() { return firebaseWindowStartHour; }
        @Override public Integer getFirebaseWindowEndHour() { return firebaseWindowEndHour; }
        @Override public Integer getMaxWorkers() { return maxWorkers; }
        @Override public Integer getMaxRetries() { return maxRetries; }
        @Override public Integer getInitialBackoffSeconds() { return initialBackoffSeconds; }
        @Override public Integer getCollapseWindowSeconds() { return collapseWindowSeconds; }
        @Override public Integer getMulticastThreshold() { return multicastThreshold; }
        @Override public Integer getTopicThreshold() { return topicThreshold; }
        static NotificationSettingsDto from(ConfigurationCatalog.NotificationParameters value) {
            return value == null ? null : new NotificationSettingsDto(value.getFirebaseWindowStartHour(), value.getFirebaseWindowEndHour(), value.getMaxWorkers(), value.getMaxRetries(), value.getInitialBackoffSeconds(), value.getCollapseWindowSeconds(), value.getMulticastThreshold(), value.getTopicThreshold());
        }
    }
    public record JobSettingsDto(
            Integer userChangedDebounceSeconds,
            Integer eventChangedDebounceSeconds,
            Integer eventMembersChangedDebounceSeconds,
            Integer assetChangedDebounceSeconds,
            Integer assetRequestsChangedDebounceSeconds,
            Integer configChangedDebounceSeconds,
            Integer workerPollDelayMs,
            Integer batchSize,
            Integer leaseDurationSeconds,
            Integer eventSchedulerPollDelayMs,
            Integer autoInviterCadenceMs,
            Integer notificationOutboxPollDelayMs,
            Integer accountPurgeWindowDays) implements ConfigurationCatalog.JobParameters {
        @Override public Integer getUserChangedDebounceSeconds() { return userChangedDebounceSeconds; }
        @Override public Integer getEventChangedDebounceSeconds() { return eventChangedDebounceSeconds; }
        @Override public Integer getEventMembersChangedDebounceSeconds() { return eventMembersChangedDebounceSeconds; }
        @Override public Integer getAssetChangedDebounceSeconds() { return assetChangedDebounceSeconds; }
        @Override public Integer getAssetRequestsChangedDebounceSeconds() { return assetRequestsChangedDebounceSeconds; }
        @Override public Integer getConfigChangedDebounceSeconds() { return configChangedDebounceSeconds; }
        @Override public Integer getWorkerPollDelayMs() { return workerPollDelayMs; }
        @Override public Integer getBatchSize() { return batchSize; }
        @Override public Integer getLeaseDurationSeconds() { return leaseDurationSeconds; }
        @Override public Integer getEventSchedulerPollDelayMs() { return eventSchedulerPollDelayMs; }
        @Override public Integer getAutoInviterCadenceMs() { return autoInviterCadenceMs; }
        @Override public Integer getNotificationOutboxPollDelayMs() { return notificationOutboxPollDelayMs; }
        @Override public Integer getAccountPurgeWindowDays() { return accountPurgeWindowDays; }
        static JobSettingsDto from(ConfigurationCatalog.JobParameters value) {
            return value == null ? null : new JobSettingsDto(value.getUserChangedDebounceSeconds(), value.getEventChangedDebounceSeconds(), value.getEventMembersChangedDebounceSeconds(), value.getAssetChangedDebounceSeconds(), value.getAssetRequestsChangedDebounceSeconds(), value.getConfigChangedDebounceSeconds(), value.getWorkerPollDelayMs(), value.getBatchSize(), value.getLeaseDurationSeconds(), value.getEventSchedulerPollDelayMs(), value.getAutoInviterCadenceMs(), value.getNotificationOutboxPollDelayMs(), value.getAccountPurgeWindowDays());
        }
    }
}
