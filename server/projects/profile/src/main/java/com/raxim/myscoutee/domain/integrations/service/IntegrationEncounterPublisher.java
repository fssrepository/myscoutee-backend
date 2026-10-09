package com.raxim.myscoutee.domain.integrations.service;


import java.util.LinkedHashMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import com.raxim.myscoutee.domain.events.api.EventOwnership.Event;
import com.raxim.myscoutee.domain.events.api.MingleEncounters;
import com.raxim.myscoutee.domain.events.api.MingleEncounters.Session;
import com.raxim.myscoutee.domain.events.api.EventOwnershipReads;

/** The completed session is the durable source; publication is marked only after outbox insertion. */
@Service
public class IntegrationEncounterPublisher {
    @org.springframework.beans.factory.annotation.Autowired
    private com.raxim.myscoutee.domain.notifications.api.NotificationJobs groupRules;
    @org.springframework.beans.factory.annotation.Autowired
    private com.raxim.myscoutee.common.config.mongo.ScheduledMongoSessionRunner groupDatabases;

    private static final Logger LOG = LoggerFactory.getLogger(IntegrationEncounterPublisher.class);
    private final MingleEncounters encounters;
    private final EventOwnershipReads events;
    private final IntegrationEventQueryService queries;
    private final IntegrationWebhookService webhooks;

    public IntegrationEncounterPublisher(MingleEncounters encounters, EventOwnershipReads events,
            IntegrationEventQueryService queries, IntegrationWebhookService webhooks) {
        this.encounters = encounters; this.events = events; this.queries = queries; this.webhooks = webhooks;
    }

    @Scheduled(fixedDelayString = "${integration.encounters.publish-interval-ms:5000}")
    public void publishPending() {
        groupDatabases.runAcrossConfiguredDatabases(() -> groupRules.runScheduledGroups("integration-encounters", this::publishPendingInGroup));
    }

    private void publishPendingInGroup() {
        var pending = encounters.pendingPublication();
        if (pending.isEmpty()) return;
        var eventIds = pending.stream().map(Session::getEventId).distinct().toList();
        var canonical = new LinkedHashMap<String, Event>();
        for (Event event : events.findBySourceIdIn(eventIds)) {
            if (Boolean.TRUE.equals(event.getIsAdmin())) canonical.putIfAbsent(event.getSourceId(), event);
        }
        for (Session session : pending) {
            try {
                Event event = canonical.get(session.getEventId());
                if (event != null) {
                    webhooks.enqueueEncounters(event.getOwnerUserId(), () -> queries.completedEncounters(event.getOwnerUserId(), session.getEventId()));
                }
                encounters.acknowledgePublication(session);
            } catch (RuntimeException failure) {
                LOG.warn("Mingle encounter publication remains pending for {}", session.getEventId(), failure);
            }
        }
    }
}
