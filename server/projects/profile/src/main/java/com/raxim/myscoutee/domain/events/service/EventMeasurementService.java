package com.raxim.myscoutee.domain.events.service;
import java.time.Instant;
import java.util.*;
import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import com.raxim.myscoutee.common.measurement.*;
import com.raxim.myscoutee.domain.events.api.EventMeasurement;
@org.springframework.stereotype.Service
public class EventMeasurementService implements EventMeasurement {
    private com.raxim.myscoutee.common.config.mongo.AdminProjectionSignalOutbox adminSignals;

    @org.springframework.beans.factory.annotation.Autowired
    void watchAdminProjectionInputs(org.springframework.data.mongodb.core.MongoTemplate signalMongo,
            com.raxim.myscoutee.common.config.mongo.MongoChangeStreamService changes,
            com.raxim.myscoutee.common.config.mongo.ScheduledMongoSessionRunner databases,
            com.raxim.myscoutee.domain.administration.api.OperationalTelemetry admin,
            com.raxim.myscoutee.domain.notifications.api.NotificationJobs jobs,
            com.raxim.myscoutee.common.delivery.OutboundRetryWorker retryWorker) {
        adminSignals = new com.raxim.myscoutee.common.config.mongo.AdminProjectionSignalOutbox(signalMongo, changes, databases, admin, "events",
                com.raxim.myscoutee.domain.events.document.EventAdminSignalOutbox.class, jobs, retryWorker);
        adminSignals.watch("events-admin-derived", java.util.Set.of("activityMembers"),
                java.util.Set.of(), com.raxim.myscoutee.domain.administration.api.OperationalTelemetry.ProjectionInput.DERIVED);
    }

    @org.springframework.scheduling.annotation.Scheduled(fixedDelayString="${admin.stats.signal-push-delay-ms:3600000}", initialDelayString="${admin.stats.signal-push-delay-ms:3600000}")
    public void pushAdminProjectionSignals() { adminSignals.flush(); }

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
    @org.springframework.beans.factory.annotation.Autowired
    private com.raxim.myscoutee.domain.feedback.api.FeedbackMeasurement feedback;
    public EvidenceCursor attendance(Instant startInclusive, Instant endExclusive) {
        return feedback.attendance(startInclusive, endExclusive);
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
