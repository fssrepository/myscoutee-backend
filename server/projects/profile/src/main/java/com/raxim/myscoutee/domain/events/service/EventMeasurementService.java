package com.raxim.myscoutee.domain.events.service;
import java.time.Instant;
import java.util.*;
import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import com.raxim.myscoutee.common.measurement.*;
import com.raxim.myscoutee.domain.events.api.EventMeasurement;
@org.springframework.stereotype.Service
public class EventMeasurementService implements EventMeasurement {
    public static final String ACTION_RATE = "rate";
    public static final String ACTION_JOIN = "join";
    public static final String ACTION_MESSAGE = "message";
    public static final String ACTION_HOST = "host";
    public static final String ACTION_BOOK = "book";
    public static final String ACTION_VERIFIED_ATTENDANCE =
            "verified-attendance";

    private final MongoTemplate mongo;
    public EventMeasurementService(MongoTemplate mongo) { this.mongo = mongo; }
    public EvidenceCursor joins(Instant startInclusive, Instant endExclusive) {
        String start = startInclusive.toString(), end = endExclusive.toString();
        List<Document> pipeline = new ArrayList<>();
        pipeline.addAll(List.of(
                match(new Document("ownerType", "event")
                        .append("status", "accepted")
                        .append("actionAtIso", range(start, end))),
                project(
                        "$userId",
                        ACTION_JOIN,
                        "$actionAtIso",
                source("event:", "$ownerId", ":", new Document("$toString", "$_id")))));
        pipeline.add(new Document("$sort", new Document("userId", 1).append("occurredAt", 1).append("actionType", 1).append("sourceId", 1)));
        return new MongoEvidenceCursor(mongo.getCollection("activityMembers").aggregate(pipeline).allowDiskUse(true).batchSize(1_000).iterator());
    }
    public EvidenceCursor hosts(Instant startInclusive, Instant endExclusive) {
        String start = startInclusive.toString(), end = endExclusive.toString();
        List<Document> pipeline = new ArrayList<>();
        pipeline.addAll(List.of(
                match(new Document("status", "A")
                        .append("generated", new Document("$ne", true))
                        .append("creatorUserId",
                                new Document("$exists", true).append("$ne", ""))
                        .append("createdDate", range(start, end))),
                project(
                        "$creatorUserId",
                        ACTION_HOST,
                        "$createdDate",
                        source(
                                "event:",
                                new Document(
                                        "$ifNull",
                                        List.of(
                                                "$sourceId",
                                                new Document(
                                                        "$toString",
                                                        "$_id")))))));
        pipeline.add(new Document("$sort", new Document("userId", 1).append("occurredAt", 1).append("actionType", 1).append("sourceId", 1)));
        return new MongoEvidenceCursor(mongo.getCollection("events").aggregate(pipeline).allowDiskUse(true).batchSize(1_000).iterator());
    }
    public EvidenceCursor attendance(Instant startInclusive, Instant endExclusive) {
        String start = startInclusive.toString(), end = endExclusive.toString();
        List<Document> pipeline = new ArrayList<>();
        pipeline.addAll(List.of(
                match(new Document("removed", new Document("$ne", true))
                        .append("submittedAtIso", range(start, end))),
                new Document("$lookup", new Document("from", "activityMembers")
                        .append("let", new Document("eventId", "$eventId")
                                .append("userId", "$viewerUserId"))
                        .append("pipeline", List.of(
                                new Document("$match", new Document(
                                        "$expr",
                                        new Document("$and", List.of(
                                                new Document(
                                                        "$eq",
                                                        List.of(
                                                                "$ownerType",
                                                                "event")),
                                                new Document(
                                                        "$eq",
                                                        List.of(
                                                                "$ownerId",
                                                                "$$eventId")),
                                                new Document(
                                                        "$eq",
                                                        List.of(
                                                                "$userId",
                                                                "$$userId")),
                                                new Document(
                                                        "$eq",
                                                        List.of(
                                                                "$status",
                                                                "accepted")))))),
                                new Document("$limit", 1)))
                        .append("as", "acceptedMembership")),
                match(new Document(
                        "acceptedMembership.0",
                        new Document("$exists", true))),
                project(
                        "$viewerUserId",
                        ACTION_VERIFIED_ATTENDANCE,
                        "$submittedAtIso",
                        source("attendance:", "$eventId"))));
        pipeline.add(new Document("$sort", new Document("userId", 1).append("occurredAt", 1).append("actionType", 1).append("sourceId", 1)));
        return new MongoEvidenceCursor(mongo.getCollection("eventFeedbackStates").aggregate(pipeline).allowDiskUse(true).batchSize(1_000).iterator());
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
