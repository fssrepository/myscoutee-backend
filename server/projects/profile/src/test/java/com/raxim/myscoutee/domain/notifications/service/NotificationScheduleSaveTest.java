package com.raxim.myscoutee.domain.notifications.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import java.time.Instant;
import java.util.List;
import java.util.function.Supplier;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.repository.support.MongoRepositoryFactory;
import com.mongodb.client.MongoClients;
import de.flapdoodle.embed.mongo.distribution.Version;
import de.flapdoodle.embed.mongo.transitions.Mongod;
import com.raxim.myscoutee.common.config.mongo.*;
import com.raxim.myscoutee.domain.administration.api.OperationalTelemetry;
import com.raxim.myscoutee.domain.notifications.document.NotificationRuleConfig;
import com.raxim.myscoutee.domain.notifications.repository.NotificationRuleConfigsRepository;
import com.raxim.myscoutee.domain.platform.api.JobGroupContext;

@Tag("embedded")
class NotificationScheduleSaveTest {
    @Test @SuppressWarnings("unchecked")
    void adminSaveChangesEnabledStateAndTimingBeforeReturningWithoutWaitingForStreamDelivery() {
        try (var mongod = Mongod.instance().start(Version.Main.V6_0)) {
            var address = mongod.current().getServerAddress();
            try (var client = MongoClients.create("mongodb://" + address.getHost() + ":" + address.getPort())) {
                var mongo = new MongoTemplate(client, "admin-schedule-fixture");
                var repository = new MongoRepositoryFactory(mongo).getRepository(NotificationRuleConfigsRepository.class);
                var initial = rule(false, 60); initial.setBaseGroupId("workspace");
                var state = new NotificationRuleConfig.RunState(); state.setLastRunAtIso("2026-10-09T00:00:00Z");
                initial.setRunState(state); repository.save(initial);
                var registry = new NotificationRuleRegistryService(repository,
                        mock(AdminNotificationSocketSessionRegistry.class), mongo, mock(OperationalTelemetry.class));
                var changes = mock(MongoChangeStreamService.class);
                registry.watchScheduling(changes, new ScheduledMongoSessionRunner("same", "same"));
                var callback = ArgumentCaptor.forClass(Supplier.class);
                verify(changes).watch(eq("job-schedules"), any(), any(), callback.capture(), any(), any());
                callback.getValue().get(); // Initial snapshot only; no simulated stream update after admin saves.
                Instant now = Instant.parse("2026-10-09T00:30:00Z");
                JobGroupContext.run("workspace", () -> {
                    assertThat(registry.shouldRunScheduledRule("fixture-rule", now)).isFalse();
                    registry.saveRules(List.of(rule(true, 60)), "admin");
                    assertThat(registry.shouldRunScheduledRule("fixture-rule", now)).isFalse();
                    registry.saveRules(List.of(rule(true, 1)), "admin");
                    assertThat(registry.shouldRunScheduledRule("fixture-rule", now)).isTrue();
                    registry.saveRules(List.of(rule(false, 1)), "admin");
                    assertThat(registry.shouldRunScheduledRule("fixture-rule", now)).isFalse();
                    assertThat(repository.findByBaseGroupIdAndRuleKey("workspace", "fixture-rule").orElseThrow().getEnabled()).isFalse();
                });
            }
        } finally { MongoSessionModeContext.clear(); }
    }
    private NotificationRuleConfig rule(boolean enabled, int minutes) {
        var rule = new NotificationRuleConfig(); rule.setRuleKey("fixture-rule");
        rule.setTriggerKind("scheduled_process"); rule.setEnabled(enabled);
        var timing = new NotificationRuleConfig.Timing(); timing.setMode("interval");
        timing.setTime("00:00"); timing.setTimezone("UTC"); timing.setIntervalAmount(minutes); timing.setIntervalUnit("minutes");
        rule.setTiming(timing); return rule;
    }
}
