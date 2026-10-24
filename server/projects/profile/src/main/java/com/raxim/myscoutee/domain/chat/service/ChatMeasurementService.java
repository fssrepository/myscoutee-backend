package com.raxim.myscoutee.domain.chat.service;
import static com.raxim.myscoutee.common.measurement.MongoEvidenceCursor.*;
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










}
