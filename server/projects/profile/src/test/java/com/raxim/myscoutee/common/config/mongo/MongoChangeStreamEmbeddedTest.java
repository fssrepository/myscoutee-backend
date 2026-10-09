package com.raxim.myscoutee.common.config.mongo;

import static org.assertj.core.api.Assertions.assertThat;
import java.util.List;
import java.util.Set;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.TimeUnit;
import org.bson.Document;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.SimpleMongoClientDatabaseFactory;
import com.mongodb.client.MongoClients;
import de.flapdoodle.embed.mongo.commands.MongodArguments;
import de.flapdoodle.embed.mongo.config.Storage;
import de.flapdoodle.embed.mongo.distribution.Version;
import de.flapdoodle.embed.mongo.transitions.Mongod;
import de.flapdoodle.reverse.transitions.Start;

@Tag("embedded")
class MongoChangeStreamEmbeddedTest {
    record Seen(MongoSessionMode mode, List<String> pending) {}
    @Test void realReplicaStreamReconcilesExistingWorkAndRoutesNewChangesWithoutEmptyPolling() throws Exception {
        var arguments = MongodArguments.defaults().withUseNoJournal(false).withReplication(Storage.of("stream-fixture", 16));
        try (var mongod = Mongod.instance().withMongodArguments(Start.to(MongodArguments.class).initializedWith(arguments))
                .start(Version.Main.V6_0)) {
            var address = mongod.current().getServerAddress();
            String host = address.getHost() + ":" + address.getPort();
            try (var client = MongoClients.create("mongodb://" + host + "/?directConnection=true")) {
                var admin = client.getDatabase("admin");
                admin.runCommand(new Document("replSetInitiate", new Document("_id", "stream-fixture")
                        .append("members", List.of(new Document("_id", 0).append("host", host)))));
                long until = System.nanoTime() + TimeUnit.SECONDS.toNanos(15);
                while (!Boolean.TRUE.equals(admin.runCommand(new Document("hello", 1)).getBoolean("isWritablePrimary"))) {
                    if (System.nanoTime() > until) throw new AssertionError("Fixture primary was not elected");
                    Thread.sleep(25);
                }
                var real = client.getDatabase("stream_real").getCollection("tasks");
                var demo = client.getDatabase("stream_demo").getCollection("tasks");
                real.insertOne(new Document("_id", "before-start").append("pending", true));
                demo.insertOne(new Document("_id", "demo-before-start").append("pending", true));
                var mongo = new MongoTemplate(new SessionRoutingMongoDatabaseFactory(
                        new SimpleMongoClientDatabaseFactory(client, "stream_real"),
                        new SimpleMongoClientDatabaseFactory(client, "stream_demo")));
                var changes = new MongoChangeStreamService(mongo, new ScheduledMongoSessionRunner("stream_real", "stream_demo"));
                MongoSessionModeContext.set(MongoSessionMode.REAL);
                var repositories = new org.springframework.data.mongodb.repository.support.MongoRepositoryFactory(mongo);
                var rules = repositories.getRepository(com.raxim.myscoutee.domain.notifications.repository.NotificationRuleConfigsRepository.class);
                var rule = new com.raxim.myscoutee.domain.notifications.document.NotificationRuleConfig();
                rule.setRuleKey("external-rule"); rule.setEnabled(false); rule.setTriggerKind("scheduled_process");
                var timing = new com.raxim.myscoutee.domain.notifications.document.NotificationRuleConfig.Timing();
                timing.setMode("interval"); timing.setTime("00:00"); timing.setTimezone("UTC");
                timing.setIntervalAmount(1); timing.setIntervalUnit("minutes"); rule.setTiming(timing); rules.save(rule);
                var registry = new com.raxim.myscoutee.domain.notifications.service.NotificationRuleRegistryService(rules,
                        org.mockito.Mockito.mock(com.raxim.myscoutee.domain.notifications.service.AdminNotificationSocketSessionRegistry.class),
                        mongo, org.mockito.Mockito.mock(com.raxim.myscoutee.domain.administration.api.OperationalTelemetry.class));
                org.springframework.test.util.ReflectionTestUtils.invokeMethod(registry, "watchScheduling", changes,
                        new ScheduledMongoSessionRunner("stream_real", "stream_demo"));
                assertThat(registry.shouldRunScheduledRule("external-rule", java.time.Instant.now())).isFalse();
                var seen = new LinkedBlockingQueue<Seen>();
                changes.watch("fixture", Set.of("tasks"), Set.of("pending"), () -> {
                    var ids = mongo.getCollection("tasks").find(new Document("pending", true))
                            .map(row -> row.getString("_id")).into(new java.util.ArrayList<String>());
                    seen.add(new Seen(MongoSessionModeContext.currentMode(), ids)); return null;
                });
                try {
                    changes.start();
                    assertThat(List.of(seen.poll(5, TimeUnit.SECONDS), seen.poll(5, TimeUnit.SECONDS)))
                            .containsExactlyInAnyOrder(new Seen(MongoSessionMode.REAL, List.of("before-start")),
                                    new Seen(MongoSessionMode.DEMO, List.of("demo-before-start")));
                    assertThat(seen.poll(200, TimeUnit.MILLISECONDS)).isNull();
                    real.updateOne(new Document("_id", "before-start"), new Document("$set", new Document("unrelated", 1)));
                    assertThat(seen.poll(200, TimeUnit.MILLISECONDS)).isNull();
                    real.updateOne(new Document("_id", "before-start"), new Document("$set", new Document("pending", false)));
                    assertThat(seen.poll(5, TimeUnit.SECONDS)).isEqualTo(new Seen(MongoSessionMode.REAL, List.of()));
                    demo.updateOne(new Document("_id", "demo-before-start"), new Document("$set", new Document("pending", false)));
                    assertThat(seen.poll(5, TimeUnit.SECONDS)).isEqualTo(new Seen(MongoSessionMode.DEMO, List.of()));
                    assertThat(seen.poll(200, TimeUnit.MILLISECONDS)).isNull();
                    // Bypass the owner service: another replica/admin writer must still invalidate this cache.
                    var rawRules = client.getDatabase("stream_real").getCollection("notificationRuleConfigs");
                    rawRules.updateOne(new Document("ruleKey", "external-rule"), new Document("$set", new Document("enabled", true)));
                    await(() -> registry.shouldRunScheduledRule("external-rule", java.time.Instant.now()));
                    rawRules.deleteOne(new Document("ruleKey", "external-rule"));
                    await(() -> !registry.shouldRunScheduledRule("external-rule", java.time.Instant.now()));
                    // Force a real cursor loss; driver resume or service reconciliation must retain the next write.
                    var operations = admin.aggregate(List.of(new Document("$currentOp", new Document("allUsers", true)),
                            new Document("$match", new Document("command.getMore", new Document("$exists", true))
                                    .append("command.$db", "stream_real")))).into(new java.util.ArrayList<Document>());
                    assertThat(operations).hasSize(1);
                    long cursorId = ((Number) operations.getFirst().get("command", Document.class).get("getMore")).longValue();
                    client.getDatabase("stream_real").runCommand(new Document("killCursors", "$cmd.aggregate")
                            .append("cursors", List.of(cursorId)));
                    real.insertOne(new Document("_id", "after-cursor-loss").append("pending", true));
                    assertThat(seen.poll(10, TimeUnit.SECONDS))
                            .isEqualTo(new Seen(MongoSessionMode.REAL, List.of("after-cursor-loss")));
                } finally { changes.stop(); MongoSessionModeContext.clear(); }
            }
        }
    }
    private void await(java.util.function.BooleanSupplier condition) throws Exception {
        long deadline = System.nanoTime() + TimeUnit.SECONDS.toNanos(10);
        while (!condition.getAsBoolean()) {
            if (System.nanoTime() >= deadline) throw new AssertionError("External change did not refresh the cache");
            Thread.sleep(20);
        }
    }

}
