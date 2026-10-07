package com.raxim.myscoutee.e2e;

import org.springframework.data.mongodb.core.MongoTemplate;

import com.raxim.myscoutee.domain.notifications.document.NotificationRuleConfig;

/** Explicit job instances for the global, isolated fixtures used by these tests. */
final class E2eScheduledJobTestSupport {
    private E2eScheduledJobTestSupport() {}

    static void enable(MongoTemplate mongo, String... ruleKeys) {
        for (String key : ruleKeys) {
            NotificationRuleConfig rule = new NotificationRuleConfig();
            rule.setId("e2e-job-" + key);
            rule.setSyncKey("e2e-job-" + key);
            rule.setRuleKey(key);
            rule.setEnabled(true);
            rule.setTriggerKind("scheduled_process");
            rule.getTiming().setMode("interval");
            rule.getTiming().setIntervalAmount(1);
            rule.getTiming().setIntervalUnit("seconds");
            rule.getTiming().setTimezone("UTC");
            mongo.save(rule);
        }
    }
}
