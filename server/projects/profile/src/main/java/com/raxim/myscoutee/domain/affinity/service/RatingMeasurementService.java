package com.raxim.myscoutee.domain.affinity.service;
import java.time.Instant;
import java.util.*;
import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import com.raxim.myscoutee.common.measurement.*;
import com.raxim.myscoutee.domain.affinity.api.RatingMeasurement;
@org.springframework.stereotype.Service
public class RatingMeasurementService implements RatingMeasurement {
    public static final String ACTION_RATE = "rate";
    public static final String ACTION_JOIN = "join";
    public static final String ACTION_MESSAGE = "message";
    public static final String ACTION_HOST = "host";
    public static final String ACTION_BOOK = "book";
    public static final String ACTION_VERIFIED_ATTENDANCE =
            "verified-attendance";

    private final MongoTemplate mongo;
    public RatingMeasurementService(MongoTemplate mongo) { this.mongo = mongo; }
    public EvidenceCursor rates(Instant startInclusive, Instant endExclusive) {
        String start = startInclusive.toString(), end = endExclusive.toString();
        List<Document> pipeline = new ArrayList<>();
        pipeline.add(match(new Document("scoreGiven", new Document("$gt", 0))
                .append("$or", List.of(
                        rangeClause("updatedDate", start, end),
                        new Document("$and", List.of(
                                new Document("updatedDate",
                                        new Document(
                                                "$in",
                                                Arrays.asList(null, ""))),
                                rangeClause("createdDate", start, end)))))));
        pipeline.add(project(
                "$ownerUserId",
                ACTION_RATE,
                new Document("$cond", List.of(
                        new Document(
                                "$in",
                                List.of(
                                        "$updatedDate",
                                        Arrays.asList(null, ""))),
                        "$createdDate",
                        "$updatedDate")),
                new Document("$toString", "$_id")));

        pipeline.add(new Document("$sort", new Document("userId", 1).append("occurredAt", 1).append("actionType", 1).append("sourceId", 1)));
        return new MongoEvidenceCursor(mongo.getCollection("userRates").aggregate(pipeline).allowDiskUse(true).batchSize(1_000).iterator());
    }
    private static Document range(String start, String end) {
        return new Document("$gte", start).append("$lt", end);
    }

    private static Document rangeClause(
            String field,
            String start,
            String end) {
        return new Document(field, range(start, end));
    }

    private static Document match(Document criteria) {
        return new Document("$match", criteria);
    }

    private static Document project(
            Object userId,
            String actionType,
            Object occurredAt,
            Object sourceId) {
        return new Document(
                "$project",
                new Document("_id", 0)
                        .append("userId", userId)
                        .append("actionType", actionType)
                        .append("occurredAt", occurredAt)
                        .append("sourceId", sourceId));
    }

    private static Document source(Object... parts) {
        return new Document("$concat", List.of(parts));
    }

}
