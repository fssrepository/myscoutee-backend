package com.raxim.myscoutee.domain.accounts.service;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.*;
@org.springframework.stereotype.Service
public class FeedCountsService implements com.raxim.myscoutee.domain.accounts.api.FeedCounts {
    private final MongoTemplate mongo;
    public FeedCountsService(MongoTemplate mongo) { this.mongo = mongo; }
    public com.raxim.myscoutee.domain.accounts.dto.FeedCountersRecord counters(String userId) {
        var query = Query.query(Criteria.where("userId").is(userId)); query.fields().include("feedCounters");
        var user = mongo.findOne(query, com.raxim.myscoutee.domain.accounts.document.Users.class);
        return user == null || user.getFeedCounters() == null
                ? com.raxim.myscoutee.domain.accounts.dto.FeedCountersRecord.empty() : user.getFeedCounters();
    }
}
