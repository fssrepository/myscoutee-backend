package com.raxim.myscoutee.domain.integrations.repository;

import org.bson.Document;
import org.springframework.stereotype.Repository;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.*;
import org.springframework.data.domain.Sort;
import com.raxim.myscoutee.domain.administration.document.AdminStatsSnapshot;

@Repository
public class AdminClientRepository {
    private final MongoTemplate mongo;
    public AdminClientRepository(MongoTemplate mongo) { this.mongo = mongo; }
    public AdminStatsSnapshot stats() {
        Query query = Query.query(Criteria.where("statsKey").is("global"));
        query.fields().include("generatedAtIso", "activeProfileGenders", "dailyActivity");
        return mongo.findOne(query, AdminStatsSnapshot.class);
    }
    public long unresolvedReports() { return unresolved("userReports"); }
    public long unresolvedFeedback() { return unresolved("userFeedback"); }
    private long unresolved(String collection) {
        return mongo.count(Query.query(Criteria.where("resolvedAtIso").in(null, "")), collection);
    }
    public String unreadVersion(String owner) {
        Query query = Query.query(Criteria.where("ownerUserId").is(owner).and("unread").gt(0).and("lastSenderId").ne(owner))
                .with(Sort.by(Sort.Direction.DESC, "dateIso")).limit(1);
        query.fields().include("dateIso");
        Document row = mongo.findOne(query, Document.class, "chats");
        return row == null ? "" : row.getString("dateIso");
    }
}
