package com.raxim.myscoutee.domain.events.service;

import com.raxim.myscoutee.domain.affinity.api.Ratings;
import com.raxim.myscoutee.domain.platform.service.JobGroupContext;
import com.raxim.myscoutee.domain.events.service.EventJobQueries;

import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import com.raxim.myscoutee.domain.events.document.ActivityEvent;
import com.raxim.myscoutee.domain.events.document.ActivityMingleRound;
import com.raxim.myscoutee.domain.events.document.ActivityMember;
import com.raxim.myscoutee.domain.events.repository.ActivityMembersRepository;

/** Write-side projection owned by the existing expiry job; never called by card reads. */
@Service
public class EventFriendshipProjectionService {
    @org.springframework.beans.factory.annotation.Autowired
    private com.raxim.myscoutee.domain.events.service.EventJobQueries jobGroupScope;

    private static final String MINGLE_MODE = "Mingle";
    private static final String MINGLE_ROUND_COMPLETED = "COMPLETED";
    private static final String SYSTEM_USER = "event-friendship-projection";

    private final MongoTemplate mongo;
    private final ActivityMembersRepository members;
    private final Ratings userRatesService;

    public EventFriendshipProjectionService(MongoTemplate mongo, ActivityMembersRepository members,
            Ratings userRatesService) {
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
        if (JobGroupContext.isActive()) due.addCriteria(jobGroupScope.workspaceCriteria("workspaceGroupId"));
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
            List<com.raxim.myscoutee.domain.affinity.api.MeetingEvidence.Meeting> metWrites = new ArrayList<>();
            for (UserPair pair : pairs) {
                metWrites.add(new com.raxim.myscoutee.domain.affinity.api.MeetingEvidence.Meeting(pair.left(), pair.right(), event.getSourceId(), event.getTitle(), endedAt));
                if (metWrites.size() == 500) flush(metWrites);
            }
            flush(metWrites);
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
        List<ActivityMingleRound> rounds = JobGroupContext.isActive()
                ? jobGroupScope.findEventOwned(due, ActivityMingleRound.class, "eventId")
                : mongo.find(due, ActivityMingleRound.class);
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
            List<com.raxim.myscoutee.domain.affinity.api.MeetingEvidence.Meeting> writes = new ArrayList<>();
            LinkedHashSet<String> participantIds = new LinkedHashSet<>();
            for (UserPair pair : pairs) {
                writes.add(new com.raxim.myscoutee.domain.affinity.api.MeetingEvidence.Meeting(pair.left(), pair.right(), event.getSourceId(), event.getTitle(), completedAt));
                participantIds.add(pair.left());
                participantIds.add(pair.right());
                if (writes.size() == 500) flush(writes);
            }
            flush(writes);
            userRatesService.projectRecordedMeetings(participantIds);
            mongo.updateFirst(Query.query(Criteria.where("_id").is(round.getId())
                            .and("completedAtIso").is(round.getCompletedAtIso())),
                    new Update().set("meetingsProjected", true), ActivityMingleRound.class);
            projected++;
        }
        return projected;
    }

    private record UserPair(String left, String right) {}
    @org.springframework.beans.factory.annotation.Autowired private com.raxim.myscoutee.domain.affinity.api.MeetingEvidence meetingEvidence;
    private void flush(List<com.raxim.myscoutee.domain.affinity.api.MeetingEvidence.Meeting> meetings) {
        if (meetings.isEmpty()) return;
        meetingEvidence.record(meetings);
        meetings.clear();
    }
}
