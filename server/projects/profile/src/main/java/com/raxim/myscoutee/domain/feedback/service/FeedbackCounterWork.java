package com.raxim.myscoutee.domain.feedback.service;

import java.util.*;
import org.springframework.stereotype.Service;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.*;
import com.raxim.myscoutee.common.config.mongo.ScheduledMongoSessionRunner;
import com.raxim.myscoutee.domain.accounts.api.ActivityCounters;
import com.raxim.myscoutee.domain.accounts.api.FeedbackCounterChanges.*;
import com.raxim.myscoutee.domain.accounts.dto.FeedbackOwnersDto;
import com.raxim.myscoutee.domain.feedback.document.FeedbackState;
import com.raxim.myscoutee.domain.feedback.repository.FeedbackStatesRepository;

/** The feedback state and its counter command are one atomic owner write.
 * A state cannot advance again until its earlier counter command is acknowledged. */
@Service
public class FeedbackCounterWork {
    private final FeedbackStatesRepository states;
    private final MongoTemplate mongo;
    private final org.springframework.beans.factory.ObjectProvider<ActivityCounters> counters;
    private final ScheduledMongoSessionRunner databases;
    public FeedbackCounterWork(FeedbackStatesRepository states, MongoTemplate mongo,
            org.springframework.beans.factory.ObjectProvider<ActivityCounters> counters, ScheduledMongoSessionRunner databases) {
        this.states = states; this.mongo = mongo; this.counters = counters; this.databases = databases;
    }
    @jakarta.annotation.PostConstruct
    public void initialize() {
        databases.runAcrossConfiguredDatabases(() -> {
            // Owner-local, idempotent schema migration before this worker accepts writes.
            mongo.updateMulti(Query.query(Criteria.where("version").exists(false)), new Update().set("version", 0L), FeedbackState.class);
            mongo.indexOps(FeedbackState.class).ensureIndex(new org.springframework.data.mongodb.core.index.Index()
                    .on("counterChangeId", org.springframework.data.domain.Sort.Direction.ASC).sparse());
        });
    }
    public void prepare(FeedbackState state, Map<String, FeedbackBucketDelta> deltas) {
        if (deltas.isEmpty()) return;
        if (state.getCounterChange() != null) throw new IllegalStateException("Previous feedback counters are pending");
        state.setCounterChange(new Change(UUID.randomUUID().toString().replace("-", ""), Map.copyOf(deltas)));
    }
    public void prepareTransition(FeedbackState state, FeedbackOwnersDto owners,
            boolean wasSubmitted, boolean wasRemoved, boolean submitted, boolean removed) {
        Map<String, FeedbackBucketDelta> deltas = new LinkedHashMap<>();
        String before = bucket(wasSubmitted, wasRemoved), after = bucket(submitted, removed);
        if (!before.equals(after)) {
            deltas.put(state.getViewerUserId(), FeedbackBucketDelta.forBucket(before, -1)
                    .plus(FeedbackBucketDelta.forBucket(after, 1)));
        }
        if ((wasSubmitted && !wasRemoved) != (submitted && !removed)) {
            Set<String> users = new LinkedHashSet<>();
            if (owners != null) {
                users.add(owners.ownerUserId()); users.add(owners.creatorUserId());
                if (owners.admins() != null) users.addAll(owners.admins());
            }
            users.removeIf(id -> id == null || id.isBlank());
            for (String id : users) deltas.merge(id, FeedbackBucketDelta.forBucket("own-events", submitted && !removed ? 1 : -1), FeedbackBucketDelta::plus);
        }
        prepare(state, deltas);
    }
    private String bucket(boolean submitted, boolean removed) { return removed ? "removed" : submitted ? "feedbacked" : "pending"; }
    public FeedbackState finish(FeedbackState state) {
        if (state == null || state.getCounterChange() == null) return state;
        counters.getObject().applyFeedbackReceipt(state.getCounterChange());
        acknowledge(state.getCounterChange());
        state.setCounterChange(null);
        state.setVersion(state.getVersion() + 1L);
        return state;
    }
    public void acknowledge(Change change) {
        mongo.updateFirst(Query.query(Criteria.where("counterChangeId").is(change.id())),
                new Update().unset("counterChange").unset("counterChangeId").inc("version", 1L), FeedbackState.class);
    }
    @org.springframework.beans.factory.annotation.Autowired
    void watchPendingWork(com.raxim.myscoutee.common.config.mongo.MongoChangeStreamService changes,
            @org.springframework.beans.factory.annotation.Value("${events.feedback-counter-recovery-delay-ms:10000}") long retryMs) {
        changes.watch("FeedbackCounterWork", java.util.Set.of("feedbackStates"), java.util.Set.of("counterChangeId"), () -> {
            recoverInCurrentDatabase();
            return mongo.exists(Query.query(Criteria.where("counterChangeId").exists(true)), FeedbackState.class)
                    ? java.time.Instant.now().plusMillis(Math.max(1, retryMs)) : null;
        });
    }

    public void recover() {
        databases.runAcrossConfiguredDatabases(this::recoverInCurrentDatabase);
    }

    private void recoverInCurrentDatabase() {
        for (var state : mongo.find(Query.query(Criteria.where("counterChangeId").exists(true)).limit(20), FeedbackState.class)) {
                try { finish(state); }
                catch (RuntimeException pending) {
                    org.slf4j.LoggerFactory.getLogger(FeedbackCounterWork.class).warn("Feedback counter command remains pending ({})", pending.getClass().getSimpleName());
                }
            }
    }
}
