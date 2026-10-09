package com.raxim.myscoutee.domain.events.service;

import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import com.raxim.myscoutee.common.config.mongo.ScheduledMongoSessionRunner;
import com.raxim.myscoutee.domain.events.document.ActivityEvent;
import com.raxim.myscoutee.domain.accounts.api.ActivityCounters;
import com.raxim.myscoutee.domain.platform.api.JobGroupContext;

/** Retain affected users with the materialized event. Reuse the canonical
 * write-side counter refresh; a lost reply must not replay an increment. */
@Service
public class EventMembershipCounterWork {
    private final MongoTemplate mongo;
    private final ActivityCounters counters;
    private final ScheduledMongoSessionRunner databases;
    public EventMembershipCounterWork(MongoTemplate mongo, ActivityCounters counters, ScheduledMongoSessionRunner databases) {
        this.mongo = mongo; this.counters = counters; this.databases = databases;
    }
    public static void prepare(ActivityEvent event, Collection<String> affected) {
        var users = new LinkedHashSet<String>(event.getMembershipCounterUsers());
        users.addAll(affected);
        event.setMembershipCounterUsers(List.copyOf(users));
        event.setMembershipCounterWork(UUID.randomUUID().toString());
    }
    public void deliver(ActivityEvent event) {
        if (event == null || event.getMembershipCounterWork() == null) return;
        try {
            JobGroupContext.run(event.getWorkspaceGroupId(), () -> counters.refreshEventCountersForUsers(event.getMembershipCounterUsers()));
            mongo.updateFirst(Query.query(Criteria.where("_id").is(event.getId())
                            .and("membershipCounterWork").is(event.getMembershipCounterWork())),
                    new Update().unset("membershipCounterWork").unset("membershipCounterUsers"), ActivityEvent.class);
        } catch (RuntimeException pending) {
            org.slf4j.LoggerFactory.getLogger(EventMembershipCounterWork.class).warn(
                    "Materialized event counter propagation remains pending ({})", pending.getClass().getSimpleName());
        }
    }
    @jakarta.annotation.PostConstruct
    public void ensureIndex() {
        databases.runAcrossConfiguredDatabases(() -> mongo.indexOps(ActivityEvent.class).ensureIndex(
                new org.springframework.data.mongodb.core.index.Index().on("membershipCounterWork",
                        org.springframework.data.domain.Sort.Direction.ASC).sparse()));
    }
    @org.springframework.beans.factory.annotation.Autowired
    void watchPendingWork(com.raxim.myscoutee.common.config.mongo.MongoChangeStreamService changes,
            @org.springframework.beans.factory.annotation.Value("${events.membership-counter-recovery-delay-ms:10000}") long retryMs) {
        changes.watch("EventMembershipCounterWork", java.util.Set.of("events"), java.util.Set.of("membershipCounterWork"), () -> {
            recoverInCurrentDatabase();
            return mongo.exists(Query.query(Criteria.where("membershipCounterWork").exists(true).ne(null)), ActivityEvent.class)
                    ? java.time.Instant.now().plusMillis(Math.max(1, retryMs)) : null;
        });
    }

    public void recover() {
        databases.runAcrossConfiguredDatabases(this::recoverInCurrentDatabase);
    }

    private void recoverInCurrentDatabase() {
        mongo.find(Query.query(Criteria.where("membershipCounterWork")
                .exists(true).ne(null)).limit(20), ActivityEvent.class).forEach(this::deliver);
    }
}
