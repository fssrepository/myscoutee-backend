package com.raxim.myscoutee.domain.events.service;
import java.util.*;
import org.springframework.stereotype.Service;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.*;
import org.springframework.data.domain.Sort;
import com.raxim.myscoutee.domain.events.api.MingleEncounters;
import com.raxim.myscoutee.domain.events.document.*;
import com.raxim.myscoutee.domain.events.repository.*;
@Service
public class MingleEncounterService implements MingleEncounters {
 private final ActivityMingleSessionsRepository sessions;
 private final ActivityMingleRoundsRepository rounds;
 private final MongoTemplate mongo;
 private final com.raxim.myscoutee.domain.platform.service.JobGroupScopeService scopes;
 public MingleEncounterService(ActivityMingleSessionsRepository sessions,ActivityMingleRoundsRepository rounds,MongoTemplate mongo,com.raxim.myscoutee.domain.platform.service.JobGroupScopeService scopes) { this.sessions=sessions;this.rounds=rounds;this.mongo=mongo;this.scopes=scopes; }
 public Optional<ActivityMingleSession> findSession(String eventId) { return sessions.findByEventId(eventId); }
 public List<ActivityMingleRound> completedRounds(Collection<String> ids) { return rounds.findByEventIdInAndStatusOrderByRoundNumberAsc(ids,"COMPLETED"); }
 public boolean isCompleted(String eventId) { return mongo.exists(Query.query(Criteria.where("eventId").is(eventId).and("status").is("COMPLETED")),ActivityMingleSession.class); }
 public List<ActivityMingleSession> pendingPublication() { return scopes.findEventOwned(Query.query(Criteria.where("status").is("COMPLETED").and("encountersPublished").is(false)).with(Sort.by("updatedAtIso")).limit(20),ActivityMingleSession.class,"eventId"); }
 public void acknowledgePublication(Session session) { mongo.updateFirst(Query.query(Criteria.where("_id").is(session.getId()).and("status").is("COMPLETED").and("revision").is(session.getRevision())),new Update().set("encountersPublished",true),ActivityMingleSession.class); }
}
