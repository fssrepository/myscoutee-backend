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
    private final UserRatesService userRatesService;

    public EventFriendshipProjectionService(MongoTemplate mongo, ActivityMembersRepository members,
            UserRatesService userRatesService) {
        this.mongo = mongo;
        this.members = members;
        this.userRatesService = userRatesService;
    }

    public int projectCompletedEvents(Instant now, int batchSize) {
        int projectedRounds = projectCompletedMingleRounds(now, batchSize);
        Query due = Query.query(new Criteria().andOperator(
                Criteria.where("mode").ne(MINGLE_MODE),
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
        if (events.isEmpty()) return projectedRounds;
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
            LinkedHashSet<UserPair> pairs = allPairs(userIds);
            List<WriteModel<Document>> metWrites = new ArrayList<>();
            for (UserPair pair : pairs) {
                metWrites.add(metWrite(pair.left(), pair.right(), event, endedAt));
                if (metWrites.size() == 500) flush("userRates", metWrites);
            }
            flush("userRates", metWrites);
            LinkedHashSet<String> metParticipantIds = new LinkedHashSet<>();
            for (UserPair pair : pairs) {
                metParticipantIds.add(pair.left());
                metParticipantIds.add(pair.right());
            }
            // Meeting evidence can arrive after ratings. Apply the same friendship
            // gate and write-side projections as a rating arriving after a meeting.
            userRatesService.projectRecordedMeetings(metParticipantIds);
            // Publish completion only after every pair is durable. Pair upserts are atomic and
            // idempotent; an interrupted event retries without duplicate edges or changed dates.
            mongo.updateMulti(Query.query(Criteria.where("sourceId").is(event.getSourceId())
                            .and("endAtIso").is(event.getEndAtIso())),
                    new Update().set("friendshipsProjected", true), ActivityEvent.class);
        }
        return events.size() + projectedRounds;
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

    int projectCompletedMingleRounds(Instant now, int batchSize) {
        Query due = Query.query(Criteria.where("status").is(MINGLE_ROUND_COMPLETED)
                .and("meetingsProjected").ne(true).and("completedAtIso").lte(now.toString()));
        due.with(Sort.by("completedAtIso", "eventId", "roundNumber")).limit(batchSize);
        List<ActivityMingleRound> rounds = mongo.find(due, ActivityMingleRound.class);
        if (rounds.isEmpty()) return 0;
        List<String> eventIds = rounds.stream().map(ActivityMingleRound::getEventId).distinct().toList();
        Map<String, ActivityEvent> events = new LinkedHashMap<>();
        for (ActivityEvent event : mongo.find(Query.query(Criteria.where("sourceId").in(eventIds)
                .and("mode").is(MINGLE_MODE)), ActivityEvent.class)) {
            if (event.getSourceId() != null) events.putIfAbsent(event.getSourceId(), event);
        }
        int projected = 0;
        for (ActivityMingleRound round : rounds) {
            ActivityEvent event = events.get(round.getEventId());
            if (event == null) continue;
            LinkedHashSet<UserPair> pairs = new LinkedHashSet<>();
            for (ActivityMingleRound.TableAssignment table : round.getTables()) {
                pairs.addAll(allPairs(table.memberUserIds().stream().filter(StringUtils::hasText)
                        .map(String::trim).distinct().sorted().toList()));
            }
            Instant completedAt = Instant.parse(round.getCompletedAtIso());
            List<WriteModel<Document>> writes = new ArrayList<>();
            LinkedHashSet<String> participantIds = new LinkedHashSet<>();
            for (UserPair pair : pairs) {
                writes.add(metWrite(pair.left(), pair.right(), event, completedAt));
                participantIds.add(pair.left());
                participantIds.add(pair.right());
                if (writes.size() == 500) flush("userRates", writes);
            }
            flush("userRates", writes);
            userRatesService.projectRecordedMeetings(participantIds);
            mongo.updateFirst(Query.query(Criteria.where("_id").is(round.getId())
                            .and("completedAtIso").is(round.getCompletedAtIso())),
                    new Update().set("meetingsProjected", true), ActivityMingleRound.class);
            projected++;
        }
        return projected;
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
