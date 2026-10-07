package com.raxim.myscoutee.domain.integrations.service;

import com.raxim.myscoutee.domain.platform.service.JobGroupScopeService;

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
import com.raxim.myscoutee.domain.events.document.ActivityEvent;
import com.raxim.myscoutee.domain.events.document.ActivityMingleSession;
import com.raxim.myscoutee.domain.events.repository.ActivityEventsRepository;

/** The completed session is the durable source; publication is marked only after outbox insertion. */
@Service
public class IntegrationEncounterPublisher {
    @org.springframework.beans.factory.annotation.Autowired
    private com.raxim.myscoutee.domain.notifications.service.NotificationRuleRegistryService groupRules;
    @org.springframework.beans.factory.annotation.Autowired
    private com.raxim.myscoutee.domain.platform.service.JobGroupScopeService jobGroupScope;
    @org.springframework.beans.factory.annotation.Autowired
    private com.raxim.myscoutee.common.config.mongo.ScheduledMongoSessionRunner groupDatabases;

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
        groupDatabases.runAcrossConfiguredDatabases(() -> groupRules.runScheduledGroups("integration-encounters", this::publishPendingInGroup));
    }

    private void publishPendingInGroup() {
        List<ActivityMingleSession> pending = jobGroupScope.findEventOwned(Query.query(Criteria.where("status").is("COMPLETED")
                .and("encountersPublished").is(false)).with(Sort.by("updatedAtIso")).limit(20), ActivityMingleSession.class, "eventId");
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
