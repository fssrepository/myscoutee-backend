package com.raxim.myscoutee.domain.feedback.service;

import java.time.Instant;
import java.util.*;
import org.bson.Document;
import org.springframework.stereotype.Service;
import org.springframework.data.mongodb.core.MongoTemplate;
import com.raxim.myscoutee.common.measurement.*;
import com.raxim.myscoutee.domain.events.api.MemberDirectory;
import com.raxim.myscoutee.domain.feedback.api.FeedbackMeasurement;

/** Feedback owns submission evidence; Events supplies membership through its API. */
@Service
public class FeedbackMeasurementService implements FeedbackMeasurement {
    private final MongoTemplate mongo;
    private final MemberDirectory members;
    public FeedbackMeasurementService(MongoTemplate mongo, MemberDirectory members) {
        this.mongo = mongo; this.members = members;
    }
    public EvidenceCursor attendance(Instant startInclusive, Instant endExclusive) {
        var pipeline = List.of(
            new Document("$match", new Document("removed", new Document("$ne", true))
                .append("submittedAtIso", new Document("$gte", startInclusive.toString()).append("$lt", endExclusive.toString()))),
            new Document("$project", new Document("_id", 0).append("eventId", 1)
                .append("userId", "$viewerUserId").append("occurredAt", "$submittedAtIso")
                .append("sourceId", new Document("$concat", List.of("attendance:", "$eventId")))),
            new Document("$sort", new Document("userId", 1).append("occurredAt", 1).append("sourceId", 1)));
        var cursor = mongo.getCollection("feedbackStates").aggregate(pipeline).allowDiskUse(true).batchSize(1000).iterator();
        return new EvidenceCursor() {
            private Iterator<MeasurementEvidence> accepted = Collections.emptyIterator();
            private boolean closed;
            public boolean hasNext() {
                try {
                    while (!closed && !accepted.hasNext() && cursor.hasNext()) {
                        var batch = new ArrayList<Document>(1000);
                        while (batch.size() < 1000 && cursor.hasNext()) batch.add(cursor.next());
                        var ids = batch.stream().map(row -> row.getString("eventId")).filter(Objects::nonNull).distinct().toList();
                        var membership = new HashSet<List<String>>();
                        if (!ids.isEmpty()) for (var member : members.findByOwnerTypeAndOwnerIdIn("event", ids)) {
                            if ("accepted".equals(member.getStatus()) && member.getOwnerId() != null && member.getUserId() != null)
                                membership.add(List.of(member.getOwnerId(), member.getUserId()));
                        }
                        accepted = batch.stream().filter(row -> row.getString("eventId") != null && row.getString("userId") != null
                            && membership.contains(List.of(row.getString("eventId"), row.getString("userId"))))
                            .map(row -> new MeasurementEvidence(row.getString("userId"), "verified-attendance",
                                row.getString("occurredAt"), row.getString("sourceId"))).iterator();
                    }
                    if (!accepted.hasNext()) close();
                    return accepted.hasNext();
                } catch (RuntimeException failure) { close(); throw failure; }
            }
            public MeasurementEvidence next() { if (!hasNext()) throw new NoSuchElementException(); return accepted.next(); }
            public void close() { if (!closed) { closed = true; cursor.close(); } }
        };
    }
}
