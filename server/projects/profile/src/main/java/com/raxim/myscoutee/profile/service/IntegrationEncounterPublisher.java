package com.raxim.myscoutee.profile.service;

import java.util.LinkedHashMap;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.ActivityMingleSession;
import com.raxim.myscoutee.profile.repository.ActivityEventsRepository;

/** The completed session is the durable source; publication is marked only after outbox insertion. */
@Service
public class IntegrationEncounterPublisher {
    private static final Logger LOG = LoggerFactory.getLogger(IntegrationEncounterPublisher.class);
    private final MongoTemplate mongo;
    private final ActivityEventsRepository events;
    private final IntegrationEventQueryService queries;
    private final IntegrationWebhookService webhooks;

    public IntegrationEncounterPublisher(MongoTemplate mongo, ActivityEventsRepository events,
            IntegrationEventQueryService queries, IntegrationWebhookService webhooks) {
        this.mongo = mongo; this.events = events; this.queries = queries; this.webhooks = webhooks;
    }

    @Scheduled(fixedDelayString = "${integration.encounters.publish-interval-ms:5000}")
    public void publishPending() {
        List<ActivityMingleSession> pending = mongo.find(Query.query(Criteria.where("status").is("COMPLETED")
                .and("encountersPublished").is(false)).with(Sort.by("updatedAtIso")).limit(20), ActivityMingleSession.class);
        if (pending.isEmpty()) return;
        var eventIds = pending.stream().map(ActivityMingleSession::getEventId).distinct().toList();
        var canonical = new LinkedHashMap<String, ActivityEvent>();
        for (ActivityEvent event : events.findBySourceIdIn(eventIds)) {
            if (Boolean.TRUE.equals(event.getIsAdmin())) canonical.putIfAbsent(event.getSourceId(), event);
        }
        for (ActivityMingleSession session : pending) {
            try {
                ActivityEvent event = canonical.get(session.getEventId());
                if (event != null) {
                    webhooks.enqueueEncounters(event.getOwnerUserId(), () -> queries.completedEncounters(event.getOwnerUserId(), session.getEventId()));
                }
                mongo.updateFirst(Query.query(Criteria.where("_id").is(session.getId()).and("status").is("COMPLETED")
                        .and("revision").is(session.getRevision())), new Update().set("encountersPublished", true), ActivityMingleSession.class);
            } catch (RuntimeException failure) {
                LOG.warn("Mingle encounter publication remains pending for {}", session.getEventId(), failure);
            }
        }
    }
}
