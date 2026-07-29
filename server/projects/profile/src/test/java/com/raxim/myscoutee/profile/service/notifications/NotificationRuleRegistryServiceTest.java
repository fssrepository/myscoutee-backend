package com.raxim.myscoutee.profile.service.notifications;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.bson.Document;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import com.raxim.myscoutee.profile.data.document.NotificationRuleConfig;
import com.raxim.myscoutee.profile.repository.NotificationRuleConfigsRepository;

class NotificationRuleRegistryServiceTest {
    @Test
    void nonManualWorkersAreRecordedAsScheduledRegardlessOfTheirRunnerId() {
        assertThat(runHistoryTrigger(
                NotificationRuleRegistryService.RULE_AFFINITY_RECOMPUTE,
                false,
                "affinity-recompute"))
                .isEqualTo("scheduled");
    }

    @Test
    void randomGraphDistinguishesScheduledAndAdminRuns() {
        assertThat(runHistoryTrigger(
                NotificationRuleRegistryService.RULE_EVENT_RANDOM_GROUPS,
                true,
                "scheduler"))
                .isEqualTo("scheduled");
        assertThat(runHistoryTrigger(
                NotificationRuleRegistryService.RULE_EVENT_RANDOM_GROUPS,
                true,
                "admin-user"))
                .isEqualTo("manual");
    }

    private String runHistoryTrigger(
            String ruleKey,
            boolean manualRunEnabled,
            String actorUserId) {
        NotificationRuleConfigsRepository repository =
                mock(NotificationRuleConfigsRepository.class);
        AdminNotificationSocketSessionRegistry socketRegistry =
                mock(AdminNotificationSocketSessionRegistry.class);
        MongoTemplate mongoTemplate = mock(MongoTemplate.class);
        NotificationRuleConfig rule = new NotificationRuleConfig();
        rule.setRuleKey(ruleKey);
        rule.setManualRunEnabled(manualRunEnabled);
        when(repository.findByRuleKey(ruleKey)).thenReturn(Optional.of(rule));
        when(mongoTemplate.findAndModify(
                any(Query.class),
                any(Update.class),
                any(FindAndModifyOptions.class),
                eq(NotificationRuleConfig.class)))
                .thenReturn(rule);
        NotificationRuleRegistryService service =
                new NotificationRuleRegistryService(
                        repository,
                        socketRegistry,
                        mongoTemplate);

        service.recordRun(
                ruleKey,
                1,
                "completed",
                "test",
                actorUserId,
                Instant.parse("2026-07-29T10:00:00Z"));

        ArgumentCaptor<Update> updateCaptor = ArgumentCaptor.forClass(Update.class);
        verify(mongoTemplate).findAndModify(
                any(Query.class),
                updateCaptor.capture(),
                any(FindAndModifyOptions.class),
                eq(NotificationRuleConfig.class));
        Document push = updateCaptor.getValue().getUpdateObject().get(
                "$push",
                Document.class);
        Document history = push.get("runHistory", Document.class);
        List<?> entries = history.getList("$each", Object.class);
        Object entry = entries.get(0);
        if (entry instanceof Document document) {
            return document.getString("trigger");
        }
        return ((NotificationRuleConfig.RunHistoryEntry) entry).getTrigger();
    }
}
