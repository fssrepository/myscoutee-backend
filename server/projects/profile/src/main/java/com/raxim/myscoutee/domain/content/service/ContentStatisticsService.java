package com.raxim.myscoutee.domain.content.service;
import java.util.*;
import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.query.*;
@org.springframework.stereotype.Service
public class ContentStatisticsService implements com.raxim.myscoutee.domain.content.api.ContentStatistics {
    private final MongoTemplate mongoTemplate;
    public ContentStatisticsService(MongoTemplate mongo) { mongoTemplate = mongo; }
    public long unresolvedReports() { return unresolved("userReports"); }
    public long unresolvedFeedback() { return unresolved("userFeedback"); }
    private long unresolved(String collection) { return mongoTemplate.count(Query.query(Criteria.where("resolvedAtIso").in(null, "")), collection); }
    public Map<String, Long> feedCounts(String userId) {
            Map<String, Long> counts = new LinkedHashMap<>();
            for (String status : List.of("accepted", "under-review", "rejected", "blocked")) counts.put(status, 0L);
            var rows = mongoTemplate.aggregate(Aggregation.newAggregation(
                    Aggregation.match(Criteria.where("creatorUserId").is(userId).and("deleted").ne(true)),
                    Aggregation.group("moderationStatus").count().as("count")), "photoFeedPosts", Document.class);
            for (Document row : rows) if (counts.containsKey(row.getString("_id")))
                counts.put(row.getString("_id"), ((Number) row.get("count")).longValue());
        return counts;
    }
}
