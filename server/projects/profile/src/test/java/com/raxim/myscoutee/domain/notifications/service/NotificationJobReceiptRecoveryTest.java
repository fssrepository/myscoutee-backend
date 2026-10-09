package com.raxim.myscoutee.domain.notifications.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import java.time.Instant;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.repository.support.MongoRepositoryFactory;
import com.mongodb.client.MongoClients;
import de.flapdoodle.embed.mongo.distribution.Version;
import de.flapdoodle.embed.mongo.transitions.Mongod;
import com.raxim.myscoutee.domain.administration.api.OperationalTelemetry;
import com.raxim.myscoutee.domain.notifications.document.NotificationRuleConfig;
import com.raxim.myscoutee.domain.notifications.repository.NotificationRuleConfigsRepository;

@Tag("embedded")
class NotificationJobReceiptRecoveryTest {
    @Test
    void claimsRestoresAndTerminalReceiptsSurviveLostRepliesAndRejectStaleRuns() {
        try (var mongod = Mongod.instance().start(Version.Main.V6_0)) {
            var address = mongod.current().getServerAddress();
            try (var client = MongoClients.create("mongodb://" + address.getHost() + ":" + address.getPort())) {
                var mongo = new MongoTemplate(client, "job-receipts");
                var repository = new MongoRepositoryFactory(mongo).getRepository(NotificationRuleConfigsRepository.class);
                var rule = new NotificationRuleConfig();
                rule.setRuleKey("receipt-test"); rule.setEnabled(true);
                var state = new NotificationRuleConfig.RunState(); state.setPendingCount(7); rule.setRunState(state);
                repository.save(rule);
                var first = registry(repository, mongo);
                Instant run = Instant.now().minusSeconds(10);
                assertThat(first.beginRun("receipt-test", "test", "worker", run)).isNotNull();
                assertThat(first.claimPendingCount("receipt-test", run)).isEqualTo(7);
                // Simulate an accepted claim whose HTTP reply never reached its caller.
                var restarted = registry(repository, mongo);
                assertThat(restarted.claimPendingCount("receipt-test", run)).isEqualTo(7);
                restarted.adjustPendingCount("receipt-test", 3, "records");
                assertThat(restarted.claimPendingCount("receipt-test", run)).isEqualTo(7);
                restarted.restoreClaimedPendingCount("receipt-test", 0, "records", run);
                restarted.restoreClaimedPendingCount("receipt-test", 7, "records", run);
                assertThat(repository.findByRuleKey("receipt-test").orElseThrow().getRunState().getPendingCount()).isEqualTo(10);
                restarted.recordRun("receipt-test", 0, "failed", "lost reply", "worker", run);
                restarted.recordRun("receipt-test", 0, "failed", "lost reply", "worker", run);
                assertThat(repository.findByRuleKey("receipt-test").orElseThrow().getRunHistory()).hasSize(1);
                Instant next = Instant.now();
                assertThat(restarted.beginRun("receipt-test", "retry", "worker", next)).isNotNull();
                assertThat(restarted.claimPendingCount("receipt-test", next)).isEqualTo(10);
                restarted.restoreClaimedPendingCount("receipt-test", 7, "records", run);
                assertThat(restarted.recordRun("receipt-test", 7, "completed", "stale", "worker", run)).isNull();
                assertThat(repository.findByRuleKey("receipt-test").orElseThrow().getRunState().getPendingCount()).isZero();
                restarted.recordRun("receipt-test", 10, "completed", "done", "worker", next);
                restarted.recordRun("receipt-test", 10, "completed", "done", "worker", next);
                var completed = repository.findByRuleKey("receipt-test").orElseThrow();
                assertThat(completed.getRunState().getPendingClaimedCount()).isZero();
                assertThat(completed.getRunHistory()).hasSize(2);

                // A crashed worker's claim remains recoverable after the existing run lease expires.
                Instant expired = Instant.now().minusSeconds(8000);
                restarted.adjustPendingCount("receipt-test", 4, "records");
                assertThat(restarted.beginRun("receipt-test", "crash", "worker", expired)).isNotNull();
                assertThat(restarted.claimPendingCount("receipt-test", expired)).isEqualTo(4);
                Instant replacement = Instant.now().plusMillis(1);
                assertThat(restarted.beginRun("receipt-test", "replace", "worker-2", replacement)).isNotNull();
                assertThat(restarted.claimPendingCount("receipt-test", replacement)).isEqualTo(4);
                assertThat(restarted.claimPendingCount("receipt-test", expired)).isZero();
            }
        }
    }

    private NotificationRuleRegistryService registry(NotificationRuleConfigsRepository repository, MongoTemplate mongo) {
        return new NotificationRuleRegistryService(repository, mock(AdminNotificationSocketSessionRegistry.class), mongo,
                mock(OperationalTelemetry.class));
    }
}
