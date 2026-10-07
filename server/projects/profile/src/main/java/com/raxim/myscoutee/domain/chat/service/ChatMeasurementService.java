package com.raxim.myscoutee.domain.chat.service;
import java.time.Instant;
import java.util.*;
import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import com.raxim.myscoutee.common.measurement.*;
import com.raxim.myscoutee.domain.chat.api.ChatMeasurement;
@org.springframework.stereotype.Service
public class ChatMeasurementService implements ChatMeasurement {
    public static final String ACTION_RATE = "rate";
    public static final String ACTION_JOIN = "join";
    public static final String ACTION_MESSAGE = "message";
    public static final String ACTION_HOST = "host";
    public static final String ACTION_BOOK = "book";
    public static final String ACTION_VERIFIED_ATTENDANCE =
            "verified-attendance";

    private final MongoTemplate mongo;
    public ChatMeasurementService(MongoTemplate mongo) { this.mongo = mongo; }
    public EvidenceCursor messages(Instant startInclusive, Instant endExclusive) {
        String start = startInclusive.toString(), end = endExclusive.toString();
        List<Document> pipeline = new ArrayList<>();
        pipeline.addAll(List.of(
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
                        source("chat:", "$chatId", ":", "$id"))));
        pipeline.add(new Document("$sort", new Document("userId", 1).append("occurredAt", 1).append("actionType", 1).append("sourceId", 1)));
        return new MongoEvidenceCursor(mongo.getCollection("chatMessages").aggregate(pipeline).allowDiskUse(true).batchSize(1_000).iterator());
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
