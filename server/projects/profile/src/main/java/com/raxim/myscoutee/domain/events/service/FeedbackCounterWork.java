package com.raxim.myscoutee.domain.events.service;

import java.util.*;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.*;
import com.raxim.myscoutee.common.config.mongo.ScheduledMongoSessionRunner;
import com.raxim.myscoutee.domain.accounts.api.ActivityCounters;
import com.raxim.myscoutee.domain.accounts.api.FeedbackCounterChanges.*;
import com.raxim.myscoutee.domain.accounts.dto.FeedbackOwnersDto;
import com.raxim.myscoutee.domain.events.document.EventFeedbackState;
import com.raxim.myscoutee.domain.events.repository.EventFeedbackStatesRepository;

/** The feedback state and its counter command are one atomic owner write.
 * A state cannot advance again until its earlier counter command is acknowledged. */
@Service
public class FeedbackCounterWork {
    private final EventFeedbackStatesRepository states;
    private final MongoTemplate mongo;
    private final org.springframework.beans.factory.ObjectProvider<ActivityCounters> counters;
    private final ScheduledMongoSessionRunner databases;
    public FeedbackCounterWork(EventFeedbackStatesRepository states, MongoTemplate mongo,
            org.springframework.beans.factory.ObjectProvider<ActivityCounters> counters, ScheduledMongoSessionRunner databases) {
        this.states = states; this.mongo = mongo; this.counters = counters; this.databases = databases;
    }
    @jakarta.annotation.PostConstruct
    public void initialize() {
        databases.runAcrossConfiguredDatabases(() -> {
            // Owner-local, idempotent schema migration before this worker accepts writes.
            mongo.updateMulti(Query.query(Criteria.where("version").exists(false)), new Update().set("version", 0L), EventFeedbackState.class);
            mongo.indexOps(EventFeedbackState.class).ensureIndex(new org.springframework.data.mongodb.core.index.Index()
                    .on("counterChangeId", org.springframework.data.domain.Sort.Direction.ASC).sparse());
        });
    }
    public void prepare(EventFeedbackState state, Map<String, FeedbackBucketDelta> deltas) {
        if (deltas.isEmpty()) return;
        if (state.getCounterChange() != null) throw new IllegalStateException("Previous feedback counters are pending");
        state.setCounterChange(new Change(UUID.randomUUID().toString().replace("-", ""), Map.copyOf(deltas)));
    }
    public void prepareTransition(EventFeedbackState state, FeedbackOwnersDto owners,
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
    public EventFeedbackState finish(EventFeedbackState state) {
        if (state == null || state.getCounterChange() == null) return state;
        counters.getObject().applyFeedbackReceipt(state.getCounterChange());
        acknowledge(state.getCounterChange());
        state.setCounterChange(null);
        state.setVersion(state.getVersion() + 1L);
        return state;
    }
    public void acknowledge(Change change) {
        mongo.updateFirst(Query.query(Criteria.where("counterChangeId").is(change.id())),
                new Update().unset("counterChange").unset("counterChangeId").inc("version", 1L), EventFeedbackState.class);
    }
    @Scheduled(fixedDelayString = "${events.feedback-counter-recovery-delay-ms:10000}", initialDelayString = "${events.feedback-counter-recovery-delay-ms:10000}")
    public void recover() {
        databases.runAcrossConfiguredDatabases(() -> {
            for (var state : mongo.find(Query.query(Criteria.where("counterChangeId").exists(true)).limit(20), EventFeedbackState.class)) {
                try { finish(state); }
                catch (RuntimeException pending) {
                    org.slf4j.LoggerFactory.getLogger(FeedbackCounterWork.class).warn("Feedback counter command remains pending ({})", pending.getClass().getSimpleName());
                }
            }
        });
    }
}
