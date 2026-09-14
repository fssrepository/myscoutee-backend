package com.raxim.myscoutee.profile.service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import org.bson.Document;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import com.mongodb.client.model.BulkWriteOptions;
import com.mongodb.client.model.UpdateOneModel;
import com.mongodb.client.model.UpdateOptions;
import com.mongodb.client.model.WriteModel;
import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.ActivityMember;
import com.raxim.myscoutee.profile.repository.ActivityMembersRepository;

/** Write-side projection owned by the existing expiry job; never called by card reads. */
@Service
public class EventFriendshipProjectionService {
    private final MongoTemplate mongo;
    private final ActivityMembersRepository members;

    public EventFriendshipProjectionService(MongoTemplate mongo, ActivityMembersRepository members) {
        this.mongo = mongo;
        this.members = members;
    }

    public int projectCompletedEvents(Instant now, int batchSize) {
        Query due = Query.query(new Criteria().andOperator(
                Criteria.where("friendshipsProjected").ne(true),
                Criteria.where("status").is(ActivityEvent.STATUS_ACTIVE),
                Criteria.where("published").ne(false),
                Criteria.where("sourceId").exists(true).nin("", null),
                Criteria.where("endAtIso").exists(true).nin("", null).lte(now.toString())));
        due.with(Sort.by("endAtIso", "sourceId")).limit(batchSize);
        Map<String, ActivityEvent> events = new LinkedHashMap<>();
        for (ActivityEvent event : mongo.find(due, ActivityEvent.class)) {
            events.putIfAbsent(event.getSourceId(), event);
        }
        if (events.isEmpty()) return 0;
        Map<String, LinkedHashSet<String>> participants = new LinkedHashMap<>();
        for (ActivityMember member : members.findByOwnerTypeAndOwnerIdIn("event", events.keySet())) {
            if ("accepted".equals(member.getStatus()) && !Boolean.TRUE.equals(member.getOrganizerOnly())
                    && StringUtils.hasText(member.getUserId())) {
                participants.computeIfAbsent(member.getOwnerId(), ignored -> new LinkedHashSet<>()).add(member.getUserId().trim());
            }
        }
        for (ActivityEvent event : events.values()) {
            Instant endedAt = Instant.parse(event.getEndAtIso());
            List<String> userIds = new ArrayList<>(participants.getOrDefault(event.getSourceId(), new LinkedHashSet<>()));
            userIds.sort(String::compareTo);
            List<WriteModel<Document>> writes = new ArrayList<>();
            for (int left = 0; left < userIds.size(); left++) {
                for (int right = left + 1; right < userIds.size(); right++) {
                    writes.add(friendshipWrite(userIds.get(left), userIds.get(right), event, endedAt));
                    if (writes.size() == 500) flush(writes);
                }
            }
            flush(writes);
            // Publish completion only after every pair is durable. Pair upserts are atomic and
            // idempotent; an interrupted event retries without duplicate edges or changed dates.
            mongo.updateMulti(Query.query(Criteria.where("sourceId").is(event.getSourceId())
                            .and("endAtIso").is(event.getEndAtIso())),
                    new Update().set("friendshipsProjected", true), ActivityEvent.class);
        }
        return events.size();
    }

    private void flush(List<WriteModel<Document>> writes) {
        if (writes.isEmpty()) return;
        mongo.getCollection("userFriendships").bulkWrite(writes, new BulkWriteOptions().ordered(false));
        writes.clear();
    }

    private WriteModel<Document> friendshipWrite(String left, String right, ActivityEvent event, Instant endedAt) {
        Date date = Date.from(endedAt);
        Object earlier = new Document("$or", List.of(
                new Document("$eq", List.of(new Document("$ifNull", List.of("$friendsSince", false)), false)),
                new Document("$lt", List.of(date, "$friendsSince"))));
        Object later = new Document("$or", List.of(
                new Document("$eq", List.of(new Document("$ifNull", List.of("$lastMetAt", false)), false)),
                new Document("$gt", List.of(date, "$lastMetAt"))));
        Document values = new Document("leftUserId", literal(left)).append("rightUserId", literal(right))
                .append("friendsSince", conditional(earlier, date, "$friendsSince"))
                .append("firstEventId", conditional(earlier, literal(event.getSourceId()), "$firstEventId"))
                .append("lastMetAt", conditional(later, date, "$lastMetAt"))
                .append("lastEventId", conditional(later, literal(event.getSourceId()), "$lastEventId"))
                .append("lastEventName", conditional(later, literal(event.getTitle() == null ? "" : event.getTitle()), "$lastEventName"));
        return new UpdateOneModel<>(new Document("_id", left.length() + ":" + left + right),
                List.of(new Document("$set", values)), new UpdateOptions().upsert(true));
    }

    private Object conditional(Object condition, Object value, String existing) {
        return new Document("$cond", List.of(condition, value, existing));
    }

    private Object literal(String value) {
        return new Document("$literal", value);
    }
}
