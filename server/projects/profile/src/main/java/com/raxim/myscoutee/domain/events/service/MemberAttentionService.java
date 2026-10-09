package com.raxim.myscoutee.domain.events.service;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import com.raxim.myscoutee.domain.events.api.MemberAttention;

@Service
public class MemberAttentionService implements MemberAttention {
    private final MongoTemplate mongo;

    public MemberAttentionService(MongoTemplate mongo) {
        this.mongo = mongo;
    }

    @Override
    public void incrementCommunityUpdates(String communityId, String userId, int delta) {
        var identity = Criteria.where("ownerType").is("community").and("ownerId").is(communityId)
                .and("userId").is(userId);
        if (delta < 0) identity.and("communityUpdates").gte(-delta);
        mongo.updateFirst(Query.query(identity), new Update().inc("communityUpdates", delta), "activityMembers");
    }
}
