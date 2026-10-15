package com.raxim.myscoutee.common.delivery;

import java.time.Instant;
import java.util.List;
import java.util.Set;
import java.util.concurrent.*;
import java.util.function.Consumer;
import jakarta.annotation.PreDestroy;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;
import com.raxim.myscoutee.common.config.mongo.MongoChangeStreamService;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.domain.notifications.api.NotificationJobs;
import com.raxim.myscoutee.domain.platform.api.JobGroupContext;

/** One bounded retry pool per application process, independent of the business schedulers. */
@Component
public class OutboundRetryWorker implements AutoCloseable {
    private final MongoTemplate mongo;
    private final MongoChangeStreamService changes;
    private final org.springframework.beans.factory.ObjectProvider<NotificationJobs> jobs;
    private final Semaphore slots;
    private final ExecutorService executor;
    private final RetryPolicy policy;

    public OutboundRetryWorker(MongoTemplate mongo, MongoChangeStreamService changes,
            org.springframework.beans.factory.ObjectProvider<NotificationJobs> jobs,
            @Value("${outbound.retry.max-workers:10}") int workers,
            @Value("${outbound.retry.initial-delay-ms:60000}") long delayMillis) {
        this.mongo = mongo; this.changes = changes; this.jobs = jobs;
        if (workers < 1 || workers > 10) throw new IllegalArgumentException("Retry workers must be between 1 and 10");
        slots = new Semaphore(workers);
        executor = Executors.newThreadPerTaskExecutor(Thread.ofVirtual().name("outbound-retry-", 0).factory());
        policy = new RetryPolicy(3, java.time.Duration.ofMillis(delayMillis));
    }

    public OutboundRetryQueue register(String collection, String operation, Consumer<OutboundRetryTask> send) {
        return register(collection, operation, send, task -> {});
    }
    public OutboundRetryQueue register(String collection, String operation, Consumer<OutboundRetryTask> send,
            Consumer<OutboundRetryTask> outcome) {
        var queue = new OutboundRetryQueue(mongo, collection, operation, policy, task -> {
            if (task.jobs() != null && !task.jobs().isEmpty() && task.jobs().stream().noneMatch(job -> JobGroupContext.call(job.groupId(),
                    () -> jobs.getObject().findRule(job.ruleKey()).map(rule -> Boolean.TRUE.equals(rule.getEnabled())).orElse(false))))
                throw new OutboundRetryQueue.Deferred(java.time.Duration.ofMinutes(1));
            send.accept(task);
        }, task -> { outcome.accept(task); report(task); });
        changes.watch("outbound-retry-" + collection, Set.of(collection),
                Set.of("status", "nextAttemptAt", "reportAt"), () -> drain(queue));
        return queue;
    }

    private Instant drain(OutboundRetryQueue queue) {
        queue.ensureIndexes();
        // Reserve capacity before claiming: an executor backlog must not consume attempts.
        while (slots.tryAcquire()) {
            OutboundRetryTask task;
            try { task = queue.claim(Instant.now()); if (task == null) task = queue.claimReport(Instant.now()); }
            catch (RuntimeException failure) { slots.release(); throw failure; }
            if (task == null) { slots.release(); break; }
            var claimed = task;
            var mode = MongoSessionModeContext.currentMode();
            try {
                executor.execute(() -> {
                    var previous = MongoSessionModeContext.currentMode();
                    try { MongoSessionModeContext.set(mode); queue.execute(claimed); }
                    finally { MongoSessionModeContext.set(previous); slots.release(); }
                });
            } catch (RejectedExecutionException stopping) {
                slots.release();
                // The durable claim is recovered after its lease; shutdown cannot reset its attempt budget.
                break;
            }
        }
        Instant due = queue.nextDue();
        if (due == null) return null;
        Instant capacityCheck = Instant.now().plusSeconds(1);
        return due.isAfter(capacityCheck) ? due : capacityCheck;
    }

    private void report(OutboundRetryTask task) {
        if (task.jobs() == null || task.jobs().isEmpty()) return;
        String detail = "External delivery " + task.status() + "; attempt " + task.attemptCount() + "/3.";
        for (var job : task.jobs()) if (job.startedAtIso() != null) JobGroupContext.run(job.groupId(), () -> jobs.getObject().recordRetryOutcome(new NotificationJobs.RetryOutcome(
                job.ruleKey(), Instant.parse(job.startedAtIso()), task.attemptCount(), task.status(), detail)));
    }

    @Override @PreDestroy public void close() { executor.shutdownNow(); }
}
