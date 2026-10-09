package com.raxim.myscoutee.domain.groups.service;
import org.springframework.stereotype.Service;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.*;
import com.raxim.myscoutee.domain.groups.api.GroupModerationProjection;
@Service
public class GroupModerationProjectionService implements GroupModerationProjection {
    private final MongoTemplate mongo;
    public GroupModerationProjectionService(MongoTemplate mongo) { this.mongo = mongo; }
    @Override public void queue(String groupId, long revision, long pendingCount) {
        mongo.updateFirst(Query.query(Criteria.where("_id").is(groupId).andOperator(new Criteria().orOperator(
                Criteria.where("moderationQueueRevision").lt(revision), Criteria.where("moderationQueueRevision").exists(false)))),
                new Update().set("moderationPending", pendingCount).set("moderationQueueRevision", revision).inc("version", 1), "communityGroups");
    }
    @Override public void resource(String groupId, long version, String status) {
        mongo.updateFirst(Query.query(Criteria.where("_id").is(groupId).andOperator(new Criteria().orOperator(
                Criteria.where("moderationVersion").lt(version), Criteria.where("moderationVersion").exists(false)))),
                new Update().set("moderationStatus", status).set("moderationVersion", version).inc("version", 1), "communityGroups");
    }
}
