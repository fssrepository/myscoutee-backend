package com.raxim.myscoutee.common.config.mongo;

import java.util.EnumMap;
import java.util.Map;
import java.util.Set;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.*;
import com.raxim.myscoutee.domain.administration.api.OperationalTelemetry;
import com.raxim.myscoutee.domain.administration.api.OperationalTelemetry.ProjectionInput;

/** Owner-local revision intent and delivery receipts, following the counter-work recovery pattern. */
public final class AdminProjectionSignalOutbox {
    public interface State {
        Long derivedRevision(); Long queuesRevision();
        Long deliveredDerivedRevision(); Long deliveredQueuesRevision();
    }
    private final MongoTemplate mongo;
    private final MongoChangeStreamService changes;
    private final ScheduledMongoSessionRunner databases;
    private final OperationalTelemetry admin;
    private final com.raxim.myscoutee.domain.notifications.api.NotificationJobs jobs;
    private final com.raxim.myscoutee.common.delivery.OutboundRetryQueue retries;
    private final String producer;
    private final Class<? extends State> type;
    public AdminProjectionSignalOutbox(MongoTemplate mongo, MongoChangeStreamService changes,
            ScheduledMongoSessionRunner databases, OperationalTelemetry admin, String producer, Class<? extends State> type,
            com.raxim.myscoutee.domain.notifications.api.NotificationJobs jobs,
            com.raxim.myscoutee.common.delivery.OutboundRetryWorker retryWorker) {
        this.mongo = mongo; this.changes = changes; this.databases = databases;
        this.admin = admin; this.producer = producer; this.type = type; this.jobs = jobs;
        retries = retryWorker.register(mongo.getCollectionName(type) + "Retries", "admin-projection-signal", task -> {
            var revisions = new EnumMap<ProjectionInput, Long>(ProjectionInput.class);
            task.request().forEach((input, revision) -> revisions.put(ProjectionInput.valueOf(input), ((Number) revision).longValue()));
            deliver(revisions);
        });
    }
    private Query identity() { return Query.query(Criteria.where("_id").is("inputs")); }
    public void watch(String name, Set<String> collections, Set<String> fields, ProjectionInput input) {
        // The stream worker persists intent locally; no HTTP call runs in the business action.
        // Startup/reconnect reconciles missed changes through this same path.
        changes.watch(name, collections, fields, () -> {
            mongo.upsert(identity(), new Update().inc(input == ProjectionInput.DERIVED ? "derivedRevision" : "queuesRevision", 1L), type);
            return null;
        });
    }
    private static long value(Long number) { return number == null ? 0 : number; }
    public void flush() {
        databases.runAcrossConfiguredDatabases(() -> {
            State state = mongo.findOne(identity(), type);
            if (state == null) return;
            Map<ProjectionInput, Long> revisions = new EnumMap<>(ProjectionInput.class);
            if (value(state.derivedRevision()) > value(state.deliveredDerivedRevision())) revisions.put(ProjectionInput.DERIVED, state.derivedRevision());
            if (value(state.queuesRevision()) > value(state.deliveredQueuesRevision())) revisions.put(ProjectionInput.QUEUES, state.queuesRevision());
            if (revisions.isEmpty()) return;
            Map<String, Object> payload = new java.util.TreeMap<>();
            revisions.forEach((input, revision) -> payload.put(input.name(), revision));
            // Stable persisted receipt/counter identity; never a password, signature or integrity proof.
            @SuppressWarnings("java:S4790")
            String id = org.springframework.util.DigestUtils.md5DigestAsHex((producer + payload).getBytes(java.nio.charset.StandardCharsets.UTF_8));
            if (retries.contains(id)) return; // The scheduled job never replays the retry worker's task.
            String rule = producer + "-admin-signals";
            var runs = new java.util.ArrayList<com.raxim.myscoutee.common.delivery.OutboundRetryTask.JobRun>();
            java.time.Instant started = java.time.Instant.now();
            jobs.forEachGroup(rule, () -> {
                if (jobs.beginScheduledRun(rule, "Statistics delivery started.", rule, started) != null)
                    runs.add(new com.raxim.myscoutee.common.delivery.OutboundRetryTask.JobRun(rule,
                            com.raxim.myscoutee.domain.platform.api.JobGroupContext.groupId(), started.toString()));
            });
            if (runs.isEmpty()) return;
            RuntimeException failure = null;
            if (!retries.startOriginal(id, payload, runs, started)) {
                for (var run : runs) com.raxim.myscoutee.domain.platform.api.JobGroupContext.run(run.groupId(), () ->
                        jobs.recordRun(rule, 0, "completed", "Statistics delivery already owned by another run.", rule, started));
                return;
            }
            try { deliver(revisions); retries.originalSucceeded(id, java.time.Instant.now()); }
            catch (RuntimeException error) {
                failure = error;
                retries.failed(id, payload, runs, error, java.time.Instant.now());
            }
            boolean success = failure == null;
            for (var run : runs) com.raxim.myscoutee.domain.platform.api.JobGroupContext.run(run.groupId(), () ->
                    jobs.recordRun(rule, success ? 1 : 0, success ? "completed" : "failed",
                            success ? "Statistics delivered." : "Delivery failed; retry worker owns subsequent attempts.", rule, started));
        });
    }
    private void deliver(Map<ProjectionInput, Long> revisions) {
        admin.signalProjectionInputs(new OperationalTelemetry.ProjectionSignal(producer, Map.copyOf(revisions)));
        // Only the acknowledged snapshot advances; concurrent changes remain pending.
        Update receipt = new Update();
        revisions.forEach((input, revision) -> receipt.max(input == ProjectionInput.DERIVED ? "deliveredDerivedRevision" : "deliveredQueuesRevision", revision));
        mongo.updateFirst(identity(), receipt, type);
    }
}
