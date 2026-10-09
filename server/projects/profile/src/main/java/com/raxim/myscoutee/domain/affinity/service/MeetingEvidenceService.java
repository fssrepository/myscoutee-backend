package com.raxim.myscoutee.domain.affinity.service;
import java.time.Instant;
import java.util.*;
import org.bson.Document;
import com.mongodb.client.model.*;
import org.springframework.data.mongodb.core.MongoTemplate;
import com.raxim.myscoutee.domain.affinity.api.MeetingEvidence;
@org.springframework.stereotype.Service
public class MeetingEvidenceService implements MeetingEvidence {
    private static final String SYSTEM_USER = "event-friendship-projection";
    private final MongoTemplate mongo;
    public MeetingEvidenceService(MongoTemplate mongo) { this.mongo = mongo; }
    public void record(List<Meeting> meetings) {
        if (meetings.isEmpty()) return;
        var writes = meetings.stream().map(this::metWrite).toList();
        mongo.getCollection("userRates").bulkWrite(writes, new BulkWriteOptions().ordered(false));
    }
    private WriteModel<Document> metWrite(Meeting meeting) {
        String left = meeting.left(), right = meeting.right();
        Instant endedAt = meeting.occurredAt();
        String syncKey = metSyncKey(meeting.eventId(), left, right);
        String happenedAt = endedAt.toString();
        Document identity = new Document("_id", syncKey)
                .append("syncKey", syncKey)
                .append("mode", "single")
                .append("createdDate", happenedAt)
                .append("createdUser", SYSTEM_USER)
                .append("ownerUserId", left)
                .append("relatedUserId", right)
                .append("scoreGiven", 0)
                .append("scoreReceived", 0)
                .append("mutuallyRated", false);
        Document update = new Document("updatedDate", happenedAt)
                .append("updatedUser", SYSTEM_USER)
                .append("met", true)
                .append("metEventId", meeting.eventId())
                .append("eventName", meeting.eventName() == null ? "" : meeting.eventName());
        Document pairFilter = new Document("mode", "single").append("$or", List.of(
                new Document("ownerUserId", left).append("relatedUserId", right),
                new Document("ownerUserId", right).append("relatedUserId", left),
                new Document("syncKey", syncKey)));
        return new UpdateOneModel<>(pairFilter,
                new Document("$set", update).append("$setOnInsert", identity),
                new UpdateOptions().upsert(true));
    }

    private String metSyncKey(String eventId, String left, String right) {
        return "event-met:" + eventId.length() + ":" + eventId
                + ":" + left.length() + ":" + left
                + ":" + right;
    }

}
