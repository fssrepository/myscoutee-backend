package com.raxim.myscoutee.domain.platform.api;
import java.time.Duration;
public interface SchedulingPolicy extends NotificationPolicy {
    int notificationWindowStartHour(int fallback);
    int notificationWindowEndHour(int fallback);
    int notificationMaxWorkers(int fallback);
    int notificationMaxRetries(int fallback);
    Duration notificationInitialBackoff(Duration fallback);
    int notificationCollapseWindowSeconds(int fallback);
    int notificationTopicThreshold(int fallback);
    int notificationMulticastThreshold(int fallback);
    long jobWorkerPollDelayMs(long fallback);
    int jobBatchSize(int fallback);
    Duration jobLeaseDuration(Duration fallback);
    long eventSchedulerPollDelayMs(long fallback);
    long autoInviterCadenceMs(long fallback);
    long notificationOutboxPollDelayMs(long fallback);
    int accountPurgeWindowDays(int fallback);
    Duration userChangedDebounce(Duration fallback);
    Duration eventChangedDebounce(Duration fallback);
    Duration eventMembersChangedDebounce(Duration fallback);
    Duration assetChangedDebounce(Duration fallback);
    Duration assetRequestsChangedDebounce(Duration fallback);
    Duration configChangedDebounce(Duration fallback);
}
