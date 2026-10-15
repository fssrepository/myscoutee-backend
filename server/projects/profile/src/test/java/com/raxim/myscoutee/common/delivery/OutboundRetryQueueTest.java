package com.raxim.myscoutee.common.delivery;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import java.time.*;
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.*;
import java.util.function.Consumer;
import com.mongodb.client.*;
import org.junit.jupiter.api.*;
import org.springframework.data.mongodb.core.MongoTemplate;
import de.flapdoodle.embed.mongo.distribution.Version;
import de.flapdoodle.embed.mongo.transitions.Mongod;

@Tag("embedded")
class OutboundRetryQueueTest {
    static AutoCloseable mongod;
    static MongoClient client;
    MongoTemplate mongo;
    MutableClock clock;
    List<OutboundRetryTask> reports;
    @BeforeAll static void start() {
        var running = Mongod.instance().start(Version.Main.V6_0);
        mongod = running;
        var address = running.current().getServerAddress();
        client = MongoClients.create("mongodb://" + address.getHost() + ":" + address.getPort());
    }
    @AfterAll static void stop() throws Exception { client.close(); mongod.close(); }
    @BeforeEach void setup() {
        mongo = new MongoTemplate(client, "retry_test"); mongo.getDb().drop();
        clock = new MutableClock(Instant.parse("2026-10-15T12:00:00Z"));
        reports = new ArrayList<>();
    }
    OutboundRetryQueue queue(Consumer<OutboundRetryTask> send) {
        return new OutboundRetryQueue(mongo, "ownerRetries", "send", RetryPolicy.DEFAULT, send, reports::add, clock);
    }
    void failed(OutboundRetryQueue queue) {
        queue.failed("id", Map.of("revision", 5L), List.of(), new IllegalStateException("private secret must not persist"), clock.instant());
    }
    OutboundRetryTask stored() { return mongo.findById("id", OutboundRetryTask.class, "ownerRetries"); }

    @Test void failureIsDurableAndDoesNotSendOrRetryInTheProducer() {
        var send = mock(Consumer.class); var queue = queue(send); failed(queue);
        verifyNoInteractions(send);
        assertEquals(1, stored().attemptCount());
        assertEquals(clock.instant().plusSeconds(60), stored().nextAttemptAt());
        assertEquals("IllegalStateException", stored().lastError());
        assertNull(queue.claim(clock.instant()));
    }
    @Test void duplicateFailureNeverResetsClaimPayloadOrBudget() {
        var queue = queue(task -> {}); failed(queue); clock.advance(60);
        var claimed = queue.claim(clock.instant());
        queue.failed("id", Map.of("revision", 999L), List.of(), new IllegalArgumentException(), clock.instant());
        assertEquals(2, stored().attemptCount()); assertEquals(claimed.claim(), stored().claim());
        assertEquals(5L, ((Number) stored().request().get("revision")).longValue());
    }
    @Test void thirdAttemptCanSucceedAndNoFourthCallIsPossible() {
        AtomicInteger calls = new AtomicInteger();
        var queue = queue(task -> { if (calls.incrementAndGet() == 1) throw new IllegalStateException(); });
        failed(queue); clock.advance(60); queue.execute(queue.claim(clock.instant()));
        assertEquals("retry", stored().status());
        assertEquals(clock.instant().plusSeconds(120), stored().nextAttemptAt());
        clock.advance(119); assertNull(queue.claim(clock.instant()));
        clock.advance(1); queue.execute(queue.claim(clock.instant()));
        assertEquals("completed", stored().status()); assertEquals(3, stored().attemptCount());
        assertNull(queue.claim(clock.instant().plusSeconds(86400))); assertEquals(2, calls.get());
        assertEquals(List.of("retry", "completed"), reports.stream().map(OutboundRetryTask::status).toList());
    }
    @Test void thirdFailureIsTerminalEvenAfterRestartAndDuplicateProducerReport() {
        var queue = queue(task -> { throw new IllegalStateException(); }); failed(queue);
        clock.advance(60); queue.execute(queue.claim(clock.instant()));
        clock.advance(120); queue.execute(queue.claim(clock.instant()));
        var restarted = queue(task -> fail("Fourth call")); failed(restarted);
        assertEquals("failed", stored().status()); assertEquals(3, stored().attemptCount());
        assertNull(restarted.claim(clock.instant().plusSeconds(86400))); assertNull(restarted.nextDue());
    }
    @Test void crashOnLastAttemptDoesNotCreateAnotherAllowance() {
        var queue = queue(task -> { throw new IllegalStateException(); }); failed(queue);
        clock.advance(60); queue.execute(queue.claim(clock.instant()));
        clock.advance(120); assertEquals(3, queue.claim(clock.instant()).attemptCount());
        clock.advance(121);
        assertNull(queue(task -> fail("Fourth call after crash")).claim(clock.instant()));
        assertEquals("failed", stored().status()); assertEquals("OutcomeUnknown", stored().lastError());
    }
    @Test void initialClaimProtectsAgainstTwoProducersAndRecoversAStoppedProducer() {
        var queue = queue(task -> {});
        assertTrue(queue.startOriginal("id", Map.of("revision", 5L), List.of(), clock.instant()));
        assertFalse(queue.startOriginal("id", Map.of("revision", 5L), List.of(), clock.instant()));
        assertNull(queue.claim(clock.instant()));
        clock.advance(121); var retry = queue.claim(clock.instant());
        assertEquals(2, retry.attemptCount()); queue.execute(retry);
        assertEquals("completed", stored().status());
    }
    @Test void originalFailureHandsOffAndOriginalSuccessDoesNotEnterRetry() {
        var queue = queue(task -> {});
        queue.startOriginal("id", Map.of("revision", 5L), List.of(), clock.instant()); failed(queue);
        assertEquals("retry", stored().status()); assertNull(stored().claim());
        queue.startOriginal("success", Map.of(), List.of(), clock.instant()); queue.originalSucceeded("success", clock.instant());
        assertEquals("completed", mongo.findById("success", OutboundRetryTask.class, "ownerRetries").status());
    }
    @Test void atomicClaimsPreventConcurrentWorkersFromSendingTheSameAttempt() throws Exception {
        var queue = queue(task -> {}); failed(queue); clock.advance(60);
        try (var workers = Executors.newFixedThreadPool(8)) {
            var futures = new ArrayList<Future<OutboundRetryTask>>();
            for (int i=0;i<16;i++) futures.add(workers.submit(() -> queue.claim(clock.instant())));
            int claimed=0; for (var future:futures) if(future.get()!=null) claimed++;
            assertEquals(1, claimed); assertEquals(2, stored().attemptCount());
        }
    }
    @Test void staleWorkerCannotOverwriteAReplacementClaim() {
        var queue = queue(task -> {}); failed(queue); clock.advance(60);
        var old = queue.claim(clock.instant()); clock.advance(121);
        var replacement = queue.claim(clock.instant()); queue.execute(replacement); queue.execute(old);
        assertEquals(3, stored().attemptCount()); assertEquals("completed", stored().status());
        assertEquals(1, reports.size());
    }
    @Test void separateOwnerCollectionsNeverConsumeOneAnothersWork() {
        var queue = queue(task -> {}); failed(queue); clock.advance(60);
        var other = new OutboundRetryQueue(mongo, "otherOwnerRetries", "send", RetryPolicy.DEFAULT,
                task -> fail("Foreign collection"), reports::add, clock);
        assertNull(other.claim(clock.instant())); assertNotNull(queue.claim(clock.instant()));
    }
    @Test void lostHttpResponseReplaysTheSameAdminRevisionWithoutDuplicateEffects() {
        var admin = new com.raxim.myscoutee.domain.administration.service.AdminTelemetryService(null, null,
                new com.raxim.myscoutee.domain.administration.config.AdminStatsProperties(), null);
        org.springframework.test.util.ReflectionTestUtils.setField(admin, "mongo", mongo);
        var signal = new com.raxim.myscoutee.domain.administration.api.OperationalTelemetry.ProjectionSignal("affinity",
                Map.of(com.raxim.myscoutee.domain.administration.api.OperationalTelemetry.ProjectionInput.DERIVED, 5L));
        admin.signalProjectionInputs(signal); // Peer committed; original caller did not receive its HTTP response.
        var queue = queue(task -> admin.signalProjectionInputs(signal)); failed(queue);
        clock.advance(60); queue.execute(queue.claim(clock.instant()));
        assertEquals("completed", stored().status());
        var saved = mongo.getCollection("adminWorkerSignals").find().first();
        assertEquals(5L, ((Number)saved.get("derivedRevision")).longValue());
        assertEquals(1, mongo.getCollection("adminWorkerSignals").countDocuments());
    }

    @Test void retryJobReceiptIsIdempotentAndCannotOverwriteANewerRun() {
        var jobs = new com.raxim.myscoutee.domain.notifications.service.NotificationRuleRegistryService(null,
                mock(com.raxim.myscoutee.domain.notifications.service.AdminNotificationSocketSessionRegistry.class), mongo, null);
        var rule = new org.bson.Document("_id", "job").append("ruleKey", "test-job").append("baseGroupId", null)
                .append("runState", new org.bson.Document("startedAtIso", clock.instant().toString()).append("currentStatus", "failed"))
                .append("runHistory", List.of());
        mongo.getCollection("notificationRuleConfigs").insertOne(rule);
        var outcome = new com.raxim.myscoutee.domain.notifications.api.NotificationJobs.RetryOutcome(
                "test-job", clock.instant(), 3, "completed", "Succeeded on attempt 3/3");
        jobs.recordRetryOutcome(outcome); jobs.recordRetryOutcome(outcome);
        var saved = mongo.getCollection("notificationRuleConfigs").find().first();
        assertEquals(1, saved.getList("runHistory", org.bson.Document.class).size());
        assertEquals("completed", saved.get("runState", org.bson.Document.class).getString("currentStatus"));
        mongo.getCollection("notificationRuleConfigs").updateOne(new org.bson.Document("_id", "job"),
                new org.bson.Document("$set", new org.bson.Document("runState.startedAtIso", clock.instant().plusSeconds(3600).toString())
                        .append("runState.currentStatus", "running")));
        jobs.recordRetryOutcome(outcome);
        saved = mongo.getCollection("notificationRuleConfigs").find().first();
        assertEquals("running", saved.get("runState", org.bson.Document.class).getString("currentStatus"));
    }

    @Test void permanentFailureStopsWithoutSchedulingAnotherCall() {
        var queue = queue(task -> { throw new OutboundRetryQueue.PermanentFailure("rejected"); });
        failed(queue); clock.advance(60); queue.execute(queue.claim(clock.instant()));
        assertEquals("failed", stored().status()); assertEquals(2, stored().attemptCount()); assertNull(queue.nextDue());
    }
    @Test void localBackpressureDoesNotSpendARemoteAttempt() {
        var queue = queue(task -> { throw new OutboundRetryQueue.Deferred(); });
        failed(queue); clock.advance(60); queue.execute(queue.claim(clock.instant()));
        assertEquals(1, stored().attemptCount()); assertEquals("retry", stored().status());
        assertEquals(clock.instant().plusSeconds(1), stored().nextAttemptAt()); assertTrue(reports.isEmpty());
    }
    @Test void failedStatusReportingRetriesTheReceiptWithoutResendingTheOperation() {
        AtomicInteger sends = new AtomicInteger(), reporting = new AtomicInteger();
        var queue = new OutboundRetryQueue(mongo, "ownerRetries", "send", RetryPolicy.DEFAULT,
                task -> sends.incrementAndGet(), task -> { if (reporting.incrementAndGet() < 3) throw new IllegalStateException(); }, clock);
        failed(queue); clock.advance(60); queue.execute(queue.claim(clock.instant()));
        assertEquals("completed", stored().status()); assertEquals(1, stored().reportAttempts());
        clock.advance(60); queue.execute(queue.claimReport(clock.instant()));
        clock.advance(120); queue.execute(queue.claimReport(clock.instant()));
        assertEquals(1, sends.get()); assertEquals(3, reporting.get()); assertNull(queue.nextDue());
        assertNull(queue.claimReport(clock.instant().plusSeconds(86400))); assertNull(stored().lastReportError());
    }
    @Test void reportFailureAlsoHasAFiniteBudgetAndPreservesSuccessfulDelivery() {
        AtomicInteger sends = new AtomicInteger();
        var queue = new OutboundRetryQueue(mongo, "ownerRetries", "send", RetryPolicy.DEFAULT,
                task -> sends.incrementAndGet(), task -> { throw new IllegalStateException(); }, clock);
        failed(queue); clock.advance(60); queue.execute(queue.claim(clock.instant()));
        clock.advance(60); queue.execute(queue.claimReport(clock.instant()));
        clock.advance(120); queue.execute(queue.claimReport(clock.instant()));
        assertEquals("completed", stored().status()); assertEquals(3, stored().reportAttempts());
        assertEquals("IllegalStateException", stored().lastReportError()); assertNull(queue.nextDue()); assertEquals(1, sends.get());
    }
    @Test void legacyFailureAdoptionPreservesAlreadySpentAttempts() {
        var queue = queue(task -> { throw new IllegalStateException(); });
        queue.failed("id", Map.of(), List.of(), new IllegalStateException(), clock.instant(), 2);
        assertEquals(2, stored().attemptCount()); clock.advance(120);
        queue.execute(queue.claim(clock.instant()));
        assertEquals(3, stored().attemptCount()); assertEquals("failed", stored().status());
    }

    static final class MutableClock extends Clock {
        private Instant now; MutableClock(Instant now) {this.now=now;}
        void advance(long seconds) {now=now.plusSeconds(seconds);}
        public ZoneId getZone(){return ZoneOffset.UTC;}
        public Clock withZone(ZoneId zone){return this;}
        public Instant instant(){return now;}
    }
}
