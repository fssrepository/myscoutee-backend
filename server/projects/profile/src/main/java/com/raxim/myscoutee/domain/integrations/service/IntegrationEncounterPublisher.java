package com.raxim.myscoutee.domain.integrations.service;


import java.util.LinkedHashMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import com.raxim.myscoutee.domain.events.api.EventOwnership.Event;
import com.raxim.myscoutee.domain.events.api.MingleEncounters;
import com.raxim.myscoutee.domain.events.api.MingleEncounters.Session;
import com.raxim.myscoutee.domain.events.api.EventOwnershipReads;

/** The completed session is the durable source; publication is marked only after outbox insertion. */
@Service
public class IntegrationEncounterPublisher {
    private final com.raxim.myscoutee.domain.notifications.api.NotificationJobs groupRules;
    private final com.raxim.myscoutee.common.config.mongo.ScheduledMongoSessionRunner groupDatabases;

    private static final Logger LOG = LoggerFactory.getLogger(IntegrationEncounterPublisher.class);
    private final MingleEncounters encounters;
    private final EventOwnershipReads events;
    private final IntegrationEventQueryService queries;
    private final IntegrationWebhookService webhooks;

    public IntegrationEncounterPublisher(MingleEncounters encounters, EventOwnershipReads events,
            IntegrationEventQueryService queries, IntegrationWebhookService webhooks,
            com.raxim.myscoutee.domain.notifications.api.NotificationJobs groupRules,
            com.raxim.myscoutee.common.config.mongo.ScheduledMongoSessionRunner groupDatabases) {
        this.groupRules = groupRules;
        this.groupDatabases = groupDatabases;

        this.encounters = encounters; this.events = events; this.queries = queries; this.webhooks = webhooks;
    }

    public void publishPending() {
        groupDatabases.runAcrossConfiguredDatabases(() -> groupRules.forEachGroup("integration-encounters", () -> {
            publishPendingForCurrentGroup();
        }));
    }

    public void publishPendingForCurrentGroup() {
        var pending = encounters.pendingPublication();
        if (!pending.isEmpty()) {
            groupRules.runScheduledGroup("integration-encounters", () -> publishPendingInGroup(pending));
        }
    }

    private void publishPendingInGroup(java.util.List<? extends Session> pending) {
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
