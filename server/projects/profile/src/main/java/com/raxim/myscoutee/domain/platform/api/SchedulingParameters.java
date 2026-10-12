package com.raxim.myscoutee.domain.platform.api;

/** Current scheduling values; the deployment supplies their existing configuration owner. */
public interface SchedulingParameters {
    Settings active(String key);
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
