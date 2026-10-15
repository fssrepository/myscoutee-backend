package com.raxim.myscoutee.domain.operator.repository;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.function.Consumer;

import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import com.mongodb.client.MongoCursor;
import com.raxim.myscoutee.domain.operator.repository.QualifiedMauEvidenceRepository.QualifiedMauActionEvidence;

/**
 * Frozen pre-segregation query oracle for the embedded compatibility test.
 * Reads the frozen qmau-v1 action vocabulary from the authoritative domain
 * collections. Mongo performs the union, eligibility filtering, and sort so
 * the JVM only retains one user's evidence at a time.
 */
final class LegacyQualifiedMauEvidence
        implements QualifiedMauEvidenceRepository {
    public static final String ACTION_RATE = "rate";
    public static final String ACTION_JOIN = "join";
    public static final String ACTION_MESSAGE = "message";
    public static final String ACTION_HOST = "host";
    public static final String ACTION_BOOK = "book";
    public static final String ACTION_VERIFIED_ATTENDANCE =
            "verified-attendance";

    private final MongoTemplate mongoTemplate;

    public LegacyQualifiedMauEvidence(
            MongoTemplate mongoTemplate) {
        this.mongoTemplate = Objects.requireNonNull(mongoTemplate);
    }

    @Override
    public void read(
            Instant startInclusive,
            Instant endExclusive,
            Consumer<QualifiedMauActionEvidence> consumer) {
        Objects.requireNonNull(startInclusive, "QMAU start must not be null.");
        Objects.requireNonNull(endExclusive, "QMAU end must not be null.");
        Objects.requireNonNull(consumer, "QMAU consumer must not be null.");
        if (!startInclusive.isBefore(endExclusive)) {
            throw new IllegalArgumentException(
                    "QMAU evidence window must be positive.");
        }

        String start = startInclusive.toString();
        String end = endExclusive.toString();
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

        pipeline.add(union("activityMembers", List.of(
                match(new Document("ownerType", "event")
                        .append("status", "accepted")
                        .append("actionAtIso", range(start, end))),
                project(
                        "$userId",
                        ACTION_JOIN,
                        "$actionAtIso",
                source("event:", "$ownerId", ":", new Document("$toString", "$_id"))))));

        pipeline.add(union("chatMessages", List.of(
                match(new Document("sentAtIso", range(start, end))
                        .append("senderAvatar.id",
                                new Document("$exists", true).append("$ne", ""))
                        .append("$or", List.of(
                                new Document(
                                        "deletedAtIso",
                                        new Document("$exists", false)),
                                new Document("deletedAtIso", null),
                                new Document("deletedAtIso", "")))),
                project(
                        "$senderAvatar.id",
                        ACTION_MESSAGE,
                        "$sentAtIso",
                        source("chat:", "$chatId", ":", "$id")))));

        pipeline.add(union("events", List.of(
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
                                                        "$_id"))))))));

        pipeline.add(union("assetRequests", List.of(
                match(new Document("status", "accepted")
                        .append("booking", new Document("$ne", null))
                        .append("userId",
                                new Document("$exists", true).append("$ne", ""))
                        .append("requestedAtIso", range(start, end))),
                project(
                        "$userId",
                        ACTION_BOOK,
                        "$requestedAtIso",
                        source(
                                "booking:",
                                new Document("$toString", "$_id"))))));

        pipeline.add(union("feedbackStates", List.of(
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
                        source("attendance:", "$eventId")))));

        /*
         * Only persisted human profiles participate. Explicit exclusions cover
         * bots/test/synthetic profiles; lifecycle and workspace checks exclude
         * deleted, blocked, inactive, and admin actors.
         */
        pipeline.add(new Document("$lookup", new Document("from", "users")
                .append("localField", "userId")
                .append("foreignField", "userId")
                .append("as", "qmauUser")));
        pipeline.add(match(new Document(
                "qmauUser.0",
                new Document("$exists", true))));
        pipeline.add(new Document(
                "$set",
                new Document(
                        "qmauUser",
                        new Document("$arrayElemAt", List.of("$qmauUser", 0)))));
        pipeline.add(match(new Document(
                        "qmauUser.networkMeasurementExcluded",
                        new Document("$ne", true))
                .append(
                        "qmauUser.status",
                        new Document("$nin", List.of("D", "B", "I")))
                .append(
                        "qmauUser.profileStatus",
                        new Document(
                                "$nin",
                                List.of(
                                        "deleted",
                                        "blocked",
                                        "inactive")))
                .append(
                        "qmauUser.hostTier",
                        new Document(
                                "$not",
                                new Document(
                                        "$regex",
                                        "^admin$")
                                        .append("$options", "i")))
                .append(
                        "qmauUser.statusText",
                        new Document(
                                "$not",
                                new Document(
                                        "$regex",
                                        "^admin workspace$")
                                        .append("$options", "i")))));
        pipeline.add(new Document(
                "$sort",
                new Document("userId", 1)
                        .append("occurredAt", 1)
                        .append("actionType", 1)
                        .append("sourceId", 1)));

        try (MongoCursor<Document> cursor = mongoTemplate
                .getCollection("userRates")
                .aggregate(pipeline)
                .allowDiskUse(true)
                .batchSize(1_000)
                .iterator()) {
            while (cursor.hasNext()) {
                Document row = cursor.next();
                String userId = text(row.get("userId"));
                String actionType = text(row.get("actionType"));
                String occurredAt = text(row.get("occurredAt"));
                String sourceId = text(row.get("sourceId"));
                if (!StringUtils.hasText(userId)
                        || !StringUtils.hasText(actionType)
                        || !StringUtils.hasText(occurredAt)
                        || !StringUtils.hasText(sourceId)) {
                    throw new IllegalStateException(
                            "Authoritative QMAU evidence contains a blank field.");
                }
                Instant parsedAt;
                try {
                    parsedAt = Instant.parse(occurredAt);
                } catch (RuntimeException exception) {
                    throw new IllegalStateException(
                            "Authoritative QMAU evidence contains a non-UTC timestamp.",
                            exception);
                }
                if (parsedAt.isBefore(startInclusive)
                        || !parsedAt.isBefore(endExclusive)) {
                    throw new IllegalStateException(
                            "Authoritative QMAU evidence escaped its completed-period window.");
                }
                consumer.accept(new QualifiedMauActionEvidence(
                        userId,
                        actionType,
                        parsedAt,
                        sourceId));
            }
        }
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

    private static Document union(
            String collection,
            List<Document> pipeline) {
        return new Document(
                "$unionWith",
                new Document("coll", collection).append("pipeline", pipeline));
    }

    private static Document source(Object... parts) {
        return new Document("$concat", List.of(parts));
    }

    private static String text(Object value) {
        return value == null ? "" : String.valueOf(value).trim();
    }
}
