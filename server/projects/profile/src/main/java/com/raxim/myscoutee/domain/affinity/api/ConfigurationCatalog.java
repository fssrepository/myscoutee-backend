package com.raxim.myscoutee.domain.affinity.api;
public interface ConfigurationCatalog {
    Settings active(String key);
    Settings find(String id);
    interface Settings {
        String getKey();
        NotificationParameters getNotifications();
        JobParameters getJobs();
    }
    interface NotificationParameters {
        Integer getFirebaseWindowStartHour();
        Integer getFirebaseWindowEndHour();
        Integer getMaxWorkers();
        Integer getMaxRetries();
        Integer getInitialBackoffSeconds();
        Integer getCollapseWindowSeconds();
        Integer getMulticastThreshold();
        Integer getTopicThreshold();
    }
    interface JobParameters {
        Integer getUserChangedDebounceSeconds();
        Integer getEventChangedDebounceSeconds();
        Integer getEventMembersChangedDebounceSeconds();
        Integer getAssetChangedDebounceSeconds();
        Integer getAssetRequestsChangedDebounceSeconds();
        Integer getConfigChangedDebounceSeconds();
        Integer getWorkerPollDelayMs();
        Integer getBatchSize();
        Integer getLeaseDurationSeconds();
        Integer getEventSchedulerPollDelayMs();
        Integer getAutoInviterCadenceMs();
        Integer getNotificationOutboxPollDelayMs();
        Integer getAccountPurgeWindowDays();
    }
}
