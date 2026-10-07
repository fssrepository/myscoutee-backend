package com.raxim.myscoutee.domain.accounts.service;
import java.util.*;
import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.BasicQuery;
import com.raxim.myscoutee.domain.accounts.api.MeasurementEligibility;
@org.springframework.stereotype.Service
public class MeasurementEligibilityService implements MeasurementEligibility {
    private final MongoTemplate mongo;
    public MeasurementEligibilityService(MongoTemplate mongo) { this.mongo = mongo; }
    public Set<String> eligible(Collection<String> userIds) {
        if (userIds.isEmpty()) return Set.of();
        Document eligible = new Document(
                        "networkMeasurementExcluded",
                        new Document("$ne", true))
                .append(
                        "status",
                        new Document("$nin", List.of("D", "B", "I")))
                .append(
                        "profileStatus",
                        new Document(
                                "$nin",
                                List.of(
                                        "deleted",
                                        "blocked",
                                        "inactive")))
                .append(
                        "hostTier",
                        new Document(
                                "$not",
                                new Document(
                                        "$regex",
                                        "^admin$")
                                        .append("$options", "i")))
                .append(
                        "statusText",
                        new Document(
                                "$not",
                                new Document(
                                        "$regex",
                                        "^admin workspace$")
                                        .append("$options", "i")));
        eligible.append("userId", new Document("$in", userIds));
        var result = new HashSet<String>();
        for (var row : mongo.find(new BasicQuery(eligible, new Document("userId", 1)), Document.class, "users")) {
            if (row.getString("userId") != null) result.add(row.getString("userId"));
        }
        return result;
    }
}
