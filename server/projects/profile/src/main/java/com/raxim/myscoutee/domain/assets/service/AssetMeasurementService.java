package com.raxim.myscoutee.domain.assets.service;
import static com.raxim.myscoutee.common.measurement.MongoEvidenceCursor.*;
import java.time.Instant;
import java.util.*;
import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import com.raxim.myscoutee.common.measurement.*;
import com.raxim.myscoutee.domain.assets.api.AssetMeasurement;
@org.springframework.stereotype.Service
public class AssetMeasurementService implements AssetMeasurement {
    public static final String ACTION_RATE = "rate";
    public static final String ACTION_JOIN = "join";
    public static final String ACTION_MESSAGE = "message";
    public static final String ACTION_HOST = "host";
    public static final String ACTION_BOOK = "book";
    public static final String ACTION_VERIFIED_ATTENDANCE =
            "verified-attendance";

    private final MongoTemplate mongo;
    public AssetMeasurementService(MongoTemplate mongo) { this.mongo = mongo; }
    public EvidenceCursor bookings(Instant startInclusive, Instant endExclusive) {
        String start = startInclusive.toString(), end = endExclusive.toString();
        List<Document> pipeline = new ArrayList<>();
        pipeline.addAll(List.of(
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
                                new Document("$toString", "$_id")))));
        pipeline.add(new Document("$sort", new Document("userId", 1).append("occurredAt", 1).append("actionType", 1).append("sourceId", 1)));
        return new MongoEvidenceCursor(mongo.getCollection("assetRequests").aggregate(pipeline).allowDiskUse(true).batchSize(1_000).iterator());
    }










}
