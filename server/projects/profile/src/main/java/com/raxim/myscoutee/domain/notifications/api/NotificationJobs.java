package com.raxim.myscoutee.domain.notifications.api;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.Set;

/** Local scheduler orchestration. A future remote scheduler needs transport for group execution. */
public interface NotificationJobs {
    String RULE_EVENT_RANDOM_GROUPS = "event-random-groups";
    String RULE_EVENT_AUTO_INVITER = "event-auto-inviter";
    String RULE_EVENT_TOURNAMENT_REVIEW = "event-tournament-review";
    String RULE_EVENT_COUNTER_EXPIRY = "event-counter-expiry";
    String RULE_EVENT_CHECKOUT_BASKET_PURGE = "event-checkout-basket-purge";
    String RULE_NOTIFICATION_OUTBOX = "notification-outbox";
    String RULE_PAYMENT_METHOD_EXPIRY = "payment-method-expiry";
    String RULE_AFFINITY_RECOMPUTE = "affinity-recompute";
    String RULE_AFFINITY_GRAPH_LAYOUT = "affinity-graph-layout";
    String RULE_SCHEDULED_MESSAGES = "scheduled-messages";
    String RULE_ACCOUNT_PURGE = "account-purge";
    String PENDING_COUNT_UNIT_USERS = "admin.jobs.table.users";

    void forEachGroup(String ruleKey, Runnable action);
    void forEachGroup(Set<String> ruleKeys, Runnable action);
    void runScheduledGroups(String ruleKey, Runnable process);
    Optional<? extends Configuration> findRule(String ruleKey);
    boolean shouldRunScheduledRule(String ruleKey, Instant now);
    boolean hasEnabledScheduledEventRule();
    Configuration beginRun(String ruleKey, String detail, String actorUserId);
    Configuration beginRun(String ruleKey, String detail, String actorUserId, Instant startedAt);
    Configuration beginScheduledRun(String ruleKey, String detail, String actorUserId, Instant startedAt);
    Configuration beginQueuedRun(String ruleKey, String detail, String actorUserId, Instant startedAt);
    Configuration recordRun(String ruleKey, int count, String status, String detail, String actorUserId);
    Configuration recordRun(String ruleKey, int count, String status, String detail, String actorUserId, Instant startedAt);
    Configuration adjustPendingCount(String ruleKey, int delta, String unit);
    int claimPendingCount(String ruleKey);
    void restoreClaimedPendingCount(String ruleKey, int claimedCount, String unit);

    interface Configuration {
        Boolean getEnabled();
        List<? extends Parameter> getParameters();
    }
    interface Parameter {
        String getKey();
        String getTextValue();
    }
}
