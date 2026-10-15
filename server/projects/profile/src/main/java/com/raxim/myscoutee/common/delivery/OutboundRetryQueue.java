package com.raxim.myscoutee.common.delivery;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Consumer;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

/** Owner-local storage adapter. Business code records a failure; only the worker claims retries. */
public final class OutboundRetryQueue {
    private final java.util.Set<String> indexedDatabases = java.util.concurrent.ConcurrentHashMap.newKeySet();
    private final java.time.Clock clock;
    private final MongoTemplate mongo;
    private final String collection;
    private final String operation;
    private final RetryPolicy policy;
    private final Consumer<OutboundRetryTask> send;
    private final Consumer<OutboundRetryTask> report;

    public OutboundRetryQueue(MongoTemplate mongo, String collection, String operation, RetryPolicy policy,
            Consumer<OutboundRetryTask> send, Consumer<OutboundRetryTask> report) {
        this(mongo, collection, operation, policy, send, report, java.time.Clock.systemUTC());
    }
    OutboundRetryQueue(MongoTemplate mongo, String collection, String operation, RetryPolicy policy,
            Consumer<OutboundRetryTask> send, Consumer<OutboundRetryTask> report, java.time.Clock clock) {
        this.clock = clock;
        this.mongo = mongo; this.collection = collection; this.operation = operation;
        this.policy = policy; this.send = send; this.report = report;
    }
    public static final class PermanentFailure extends RuntimeException {
        public PermanentFailure(String reason) { super(reason); }
    }
    public static final class Deferred extends RuntimeException {
        private final java.time.Duration delay;
        public Deferred() { this(java.time.Duration.ofSeconds(1)); }
        public Deferred(java.time.Duration delay) { super("Delivery deferred; no external attempt made"); this.delay = delay; }
        public java.time.Duration delay() { return delay; }
    }
    public void ensureIndexes() {
        String database = mongo.getDb().getName();
        if (!indexedDatabases.add(database)) return;
        try {
            mongo.getCollection(collection).createIndex(new org.bson.Document("operation", 1).append("status", 1).append("nextAttemptAt", 1).append("_id", 1),
                    new com.mongodb.client.model.IndexOptions().name("outbound_retry_due"));
            mongo.getCollection(collection).createIndex(new org.bson.Document("operation", 1).append("reportAt", 1).append("_id", 1),
                    new com.mongodb.client.model.IndexOptions().name("outbound_retry_report_due"));
        } catch (RuntimeException failure) { indexedDatabases.remove(database); throw failure; }
    }
    public boolean contains(String id) { return mongo.exists(Query.query(Criteria.where("_id").is(id)), collection); }

    public boolean startOriginal(String id, Map<String, Object> request, List<OutboundRetryTask.JobRun> jobs, Instant now) {
        try {
            mongo.insert(new OutboundRetryTask(id, operation, Map.copyOf(request), List.copyOf(jobs), "running", 1,
                    now.plusSeconds(120), "original", null, null, 0, null, null, null), collection);
            return true;
        } catch (org.springframework.dao.DuplicateKeyException existing) { return false; }
    }
    public void originalSucceeded(String id, Instant now) {
        mongo.updateFirst(Query.query(Criteria.where("_id").is(id).and("claim").is("original").and("status").is("running")),
                new Update().set("status", "completed").set("finishedAt", now).unset("nextAttemptAt").unset("claim"), collection);
    }

    public void failed(String id, Map<String, Object> request, List<OutboundRetryTask.JobRun> jobs, RuntimeException failure, Instant now) {
        failed(id, request, jobs, failure, now, 1);
    }
    public void failed(String id, Map<String, Object> request, List<OutboundRetryTask.JobRun> jobs, RuntimeException failure, Instant now, int attempts) {
        if (attempts < 1 || attempts > policy.maxAttempts()) throw new IllegalArgumentException("Invalid previous attempt count");
        if (id == null || id.isBlank() || request == null) throw new IllegalArgumentException("Retry identity and request required");
        // Duplicate failure reporting must preserve an in-flight or terminal task and its attempt budget.
        Instant next = failure instanceof PermanentFailure ? null : policy.nextAttempt(attempts, now);
        Update insert = new Update().setOnInsert("operation", operation).setOnInsert("request", request)
                .setOnInsert("reportAttempts", 0).setOnInsert("jobs", jobs).setOnInsert("status", next == null ? "failed" : "retry").setOnInsert("attemptCount", attempts)
                .setOnInsert("nextAttemptAt", next).setOnInsert("lastError", failure.getClass().getSimpleName());
        mongo.upsert(Query.query(Criteria.where("_id").is(id)), insert, collection);
        mongo.updateFirst(Query.query(Criteria.where("_id").is(id).and("status").is("running").and("claim").is("original")),
                new Update().set("status", next == null ? "failed" : "retry").set("nextAttemptAt", next)
                        .set("lastError", failure.getClass().getSimpleName()).unset("claim"), collection);
    }

    public OutboundRetryTask claim(Instant now) {
        // A process crash during the last call consumes that attempt, even if its outcome is unknown.
        var expired = Query.query(Criteria.where("operation").is(operation).and("status").is("running")
                .and("nextAttemptAt").lte(now).and("attemptCount").gte(policy.maxAttempts()));
        mongo.updateMulti(expired, new Update().set("status", "failed").set("lastError", "OutcomeUnknown")
                .set("finishedAt", now).set("reportAt", now).set("reportAttempts", 0).unset("nextAttemptAt").unset("claim"), collection);
        mongo.updateMulti(Query.query(Criteria.where("operation").is(operation).and("reportAt").lte(now)
                        .and("reportAttempts").gte(policy.maxAttempts()).and("reportClaim").ne(null)),
                new Update().unset("reportAt").unset("reportClaim").set("lastReportError", "OutcomeUnknown"), collection);
        var due = Query.query(Criteria.where("operation").is(operation).and("status").in("retry", "running")
                .and("nextAttemptAt").lte(now).and("attemptCount").lt(policy.maxAttempts()))
                .with(Sort.by("nextAttemptAt", "_id"));
        return mongo.findAndModify(due, new Update().set("status", "running").set("claim", UUID.randomUUID().toString())
                        .set("nextAttemptAt", now.plusSeconds(120)).inc("attemptCount", 1),
                FindAndModifyOptions.options().returnNew(true), OutboundRetryTask.class, collection);
    }

    public void execute(OutboundRetryTask task) {
        if (task.reportClaim() != null) { report(task); return; }
        RuntimeException failure = null;
        try { send.accept(task); } catch (RuntimeException error) { failure = error; }
        Instant now = clock.instant();
        boolean deferred = failure instanceof Deferred;
        Instant next = deferred ? now.plus(((Deferred) failure).delay()) : failure == null || failure instanceof PermanentFailure ? null : policy.nextAttempt(task.attemptCount(), now);
        String status = failure == null ? "completed" : next == null ? "failed" : "retry";
        var update = new Update().set("status", status).set("lastError", failure == null ? null : failure.getClass().getSimpleName())
                .set("finishedAt", now).unset("claim");
        if (deferred) update.inc("attemptCount", -1);
        else update.set("reportAt", now).set("reportAttempts", 0).unset("reportClaim");
        if (next == null) update.unset("nextAttemptAt"); else update.set("nextAttemptAt", next);
        var saved = mongo.findAndModify(Query.query(Criteria.where("_id").is(task.id()).and("claim").is(task.claim())
                        .and("status").is("running")), update, FindAndModifyOptions.options().returnNew(true), OutboundRetryTask.class, collection);
        if (saved != null && !deferred) {
            var reporting = claimReport(now, saved.id());
            if (reporting != null) report(reporting);
        }
    }

    public OutboundRetryTask claimReport(Instant now) { return claimReport(now, null); }
    private OutboundRetryTask claimReport(Instant now, String id) {
        Criteria due = Criteria.where("operation").is(operation).and("reportAt").ne(null).lte(now)
                .and("reportAttempts").lt(policy.maxAttempts());
        if (id != null) due.and("_id").is(id);
        return mongo.findAndModify(Query.query(due).with(Sort.by("reportAt", "_id")),
                new Update().set("reportClaim", UUID.randomUUID().toString()).set("reportAt", now.plusSeconds(120)).inc("reportAttempts", 1),
                FindAndModifyOptions.options().returnNew(true), OutboundRetryTask.class, collection);
    }
    private void report(OutboundRetryTask task) {
        RuntimeException failure = null;
        try { report.accept(task); } catch (RuntimeException error) { failure = error; }
        Instant next = failure == null ? null : policy.nextAttempt(task.reportAttempts(), clock.instant());
        Update result = new Update().unset("reportClaim").set("lastReportError", failure == null ? null : failure.getClass().getSimpleName());
        if (next == null) result.unset("reportAt"); else result.set("reportAt", next);
        mongo.updateFirst(Query.query(Criteria.where("_id").is(task.id()).and("reportClaim").is(task.reportClaim())), result, collection);
    }

    public Instant nextDue() {
        var delivery = mongo.findOne(Query.query(Criteria.where("operation").is(operation).and("status").in("retry", "running"))
                .with(Sort.by("nextAttemptAt", "_id")).limit(1), OutboundRetryTask.class, collection);
        var reporting = mongo.findOne(Query.query(Criteria.where("operation").is(operation).and("reportAt").ne(null))
                .with(Sort.by("reportAt", "_id")).limit(1), OutboundRetryTask.class, collection);
        Instant first = delivery == null ? null : delivery.nextAttemptAt();
        Instant second = reporting == null ? null : reporting.reportAt();
        return first == null ? second : second == null || first.isBefore(second) ? first : second;
    }
}
