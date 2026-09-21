package com.raxim.myscoutee.profile.service;

import java.time.Instant;
import java.util.ArrayList;
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
import com.raxim.myscoutee.profile.data.document.ActivityMingleRound;
import com.raxim.myscoutee.profile.data.document.ActivityMember;
import com.raxim.myscoutee.profile.repository.ActivityMembersRepository;

/** Write-side projection owned by the existing expiry job; never called by card reads. */
@Service
public class EventFriendshipProjectionService {
    private static final String MINGLE_MODE = "Mingle";
    private static final String MINGLE_ROUND_COMPLETED = "COMPLETED";
    private static final String SYSTEM_USER = "event-friendship-projection";

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
            boolean mingle = MINGLE_MODE.equalsIgnoreCase(event.getMode());
            LinkedHashSet<UserPair> pairs = mingle
                    ? completedMinglePairs(event.getSourceId())
                    : allPairs(userIds);
            List<WriteModel<Document>> metWrites = new ArrayList<>();
            for (UserPair pair : pairs) {
                metWrites.add(metWrite(pair.left(), pair.right(), event, endedAt));
                if (metWrites.size() == 500) flush("userRates", metWrites);
            }
            flush("userRates", metWrites);
            // Publish completion only after every pair is durable. Pair upserts are atomic and
            // idempotent; an interrupted event retries without duplicate edges or changed dates.
            mongo.updateMulti(Query.query(Criteria.where("sourceId").is(event.getSourceId())
                            .and("endAtIso").is(event.getEndAtIso())),
                    new Update().set("friendshipsProjected", true), ActivityEvent.class);
        }
        return events.size();
    }

    private LinkedHashSet<UserPair> allPairs(List<String> userIds) {
        LinkedHashSet<UserPair> pairs = new LinkedHashSet<>();
        for (int left = 0; left < userIds.size(); left++) {
            for (int right = left + 1; right < userIds.size(); right++) {
                pairs.add(new UserPair(userIds.get(left), userIds.get(right)));
            }
        }
        return pairs;
    }

    private LinkedHashSet<UserPair> completedMinglePairs(String eventId) {
        Query query = Query.query(new Criteria().andOperator(
                Criteria.where("eventId").is(eventId),
                Criteria.where("status").is(MINGLE_ROUND_COMPLETED)));
        query.with(Sort.by("roundNumber"));
        LinkedHashSet<UserPair> pairs = new LinkedHashSet<>();
        for (ActivityMingleRound round : mongo.find(query, ActivityMingleRound.class)) {
            for (ActivityMingleRound.TableAssignment table : round.getTables()) {
                List<String> tableUserIds = table == null || table.memberUserIds() == null
                        ? new ArrayList<>()
                        : table.memberUserIds().stream()
                                .filter(StringUtils::hasText)
                                .map(String::trim)
                                .distinct()
                                .sorted()
                                .toList();
                pairs.addAll(allPairs(tableUserIds));
            }
        }
        return pairs;
    }

    private void flush(String collectionName, List<WriteModel<Document>> writes) {
        if (writes.isEmpty()) return;
        mongo.getCollection(collectionName).bulkWrite(writes, new BulkWriteOptions().ordered(false));
        writes.clear();
    }

    private WriteModel<Document> metWrite(String left, String right, ActivityEvent event, Instant endedAt) {
        String syncKey = metSyncKey(event.getSourceId(), left, right);
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
        Document meeting = new Document("updatedDate", happenedAt)
                .append("updatedUser", SYSTEM_USER)
                .append("met", true)
                .append("metEventId", event.getSourceId())
                .append("eventName", event.getTitle() == null ? "" : event.getTitle());
        Document pairFilter = new Document("mode", "single").append("$or", List.of(
                new Document("ownerUserId", left).append("relatedUserId", right),
                new Document("ownerUserId", right).append("relatedUserId", left),
                new Document("syncKey", syncKey)));
        return new UpdateOneModel<>(pairFilter,
                new Document("$set", meeting).append("$setOnInsert", identity),
                new UpdateOptions().upsert(true));
    }

    private String metSyncKey(String eventId, String left, String right) {
        return "event-met:" + eventId.length() + ":" + eventId
                + ":" + left.length() + ":" + left
                + ":" + right;
    }

    private record UserPair(String left, String right) {}
}
