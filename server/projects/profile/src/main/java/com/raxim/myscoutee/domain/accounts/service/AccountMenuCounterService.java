package com.raxim.myscoutee.domain.accounts.service;

import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.query.*;
import com.raxim.myscoutee.domain.accounts.api.MenuCounterUpdates;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.accounts.dto.DiscoveryProfileDto;

/** Same atomic increment pattern as chat/group counters, with an owner revision
 * so a lost reply or durable-work replay cannot apply a delta twice. */
@Service
public class AccountMenuCounterService implements MenuCounterUpdates {
    private final MongoTemplate mongo;
    public AccountMenuCounterService(MongoTemplate mongo) { this.mongo = mongo; }

    @Override public Snapshot apply(Change change) {
        if (change == null || !change.valid()) throw new IllegalArgumentException("Invalid menu counter change");
        String receipt = "menuCounterVersions." + change.sourceKey();
        Criteria identity = Criteria.where("userId").is(change.userId()).and("workspaceGroupId").is(change.workspaceGroupId());
        Criteria previous = change.revision() == 1 ? Criteria.where(receipt).exists(false)
                : Criteria.where(receipt).is(change.revision() - 1);
        Update update = new Update().set(receipt, change.revision());
        change.deltas().forEach((key, delta) -> update.inc("menuCounters." + key, delta));
        UpdateDefinition counterUpdate = update;
        if (change.deltas().containsKey("feedback")) {
            var pipeline = org.springframework.data.mongodb.core.aggregation.AggregationUpdate.update();
            pipeline.set(receipt).toValue(change.revision());
            change.deltas().forEach((key, delta) -> pipeline.set("menuCounters." + key).toValue(
                    (org.springframework.data.mongodb.core.aggregation.AggregationExpression) context ->
                            new org.bson.Document("$add", java.util.List.of(
                                    new org.bson.Document("$ifNull", java.util.List.of("$menuCounters." + key, 0)), delta))));
            pipeline.set("activities.feedback").toValue(
                    (org.springframework.data.mongodb.core.aggregation.AggregationExpression) context ->
                            new org.bson.Document("$add", java.util.List.of(
                                    new org.bson.Document("$ifNull", java.util.List.of("$activities.feedbackCounts.pending", 0)),
                                    new org.bson.Document("$ifNull", java.util.List.of("$activities.feedbackCounts.ownEvents", 0)),
                                    new org.bson.Document("$ifNull", java.util.List.of("$menuCounters.feedback", 0)))));
            counterUpdate = pipeline;
        }
        Users saved = mongo.findAndModify(Query.query(new Criteria().andOperator(identity, previous)), counterUpdate,
                FindAndModifyOptions.options().returnNew(true), Users.class);
        if (saved == null) {
            saved = mongo.findOne(Query.query(identity), Users.class);
            if (saved == null || saved.getMenuCounterVersions().getOrDefault(change.sourceKey(), 0L) < change.revision())
                throw new IllegalStateException("Menu counter owner or preceding revision is missing");
        }
        return new Snapshot(DiscoveryProfileDto.from(saved), Map.copyOf(saved.getMenuCounters()));
    }
}
