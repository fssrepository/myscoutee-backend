package com.raxim.myscoutee.domain.events.service;

import com.raxim.myscoutee.domain.events.service.EventJobQueries;

import java.time.Instant;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.stereotype.Service;

import com.raxim.myscoutee.domain.events.document.ActivityMingleSession;
import com.raxim.myscoutee.domain.events.repository.ActivityMingleSessionsRepository;

@Service
public class ActivitiesMingleWorkerService {
    private final com.raxim.myscoutee.domain.notifications.api.NotificationJobs groupRules;
    private final com.raxim.myscoutee.domain.events.service.EventJobQueries jobGroupScope;
    private final com.raxim.myscoutee.common.config.mongo.ScheduledMongoSessionRunner groupDatabases;

    private static final Logger LOGGER = LoggerFactory.getLogger(ActivitiesMingleWorkerService.class);
    private static final List<String> TIMED_STATUSES = List.of(
            ActivitiesMingleService.STATUS_ROUND,
            ActivitiesMingleService.STATUS_BREAK);

    private final ActivityMingleSessionsRepository sessionsRepository;
    private final ActivitiesMingleService mingleService;

    public ActivitiesMingleWorkerService(
            ActivityMingleSessionsRepository sessionsRepository,
            ActivitiesMingleService mingleService,
            com.raxim.myscoutee.domain.notifications.api.NotificationJobs groupRules,
            com.raxim.myscoutee.domain.events.service.EventJobQueries jobGroupScope,
            com.raxim.myscoutee.common.config.mongo.ScheduledMongoSessionRunner groupDatabases) {
        this.groupRules = groupRules;
        this.jobGroupScope = jobGroupScope;
        this.groupDatabases = groupDatabases;

        this.sessionsRepository = sessionsRepository;
        this.mingleService = mingleService;
    }

    @org.springframework.beans.factory.annotation.Autowired
    void watchPhaseDeadlines(com.raxim.myscoutee.common.config.mongo.MongoChangeStreamService changes) {
        changes.watch("mingle-phase", java.util.Set.of("activityMingleSessions"),
                java.util.Set.of("status", "phaseEndsAtIso"), () -> {
                    advanceDueSessionsInCurrentDatabase();
                    var next = sessionsRepository.findFirstByStatusInAndPhaseEndsAtIsoIsNotNullOrderByPhaseEndsAtIsoAsc(TIMED_STATUSES);
                    if (next.isEmpty()) return null;
                    Instant retry = Instant.now().plusSeconds(5);
                    Instant due = Instant.parse(next.get().getPhaseEndsAtIso());
                    return due.isAfter(retry) ? due : retry;
                });
    }

    public void advanceDueSessions() {
        groupDatabases.runAcrossConfiguredDatabases(this::advanceDueSessionsInCurrentDatabase);
    }

    private void advanceDueSessionsInCurrentDatabase() {
        if (sessionsRepository.existsByStatusInAndPhaseEndsAtIsoLessThanEqual(TIMED_STATUSES, Instant.now().toString())) {
                groupRules.runScheduledGroups("event-mingle-advance", this::advanceDueSessionsInGroup);
            }
    }

    private void advanceDueSessionsInGroup() {
        Instant now = Instant.now();
        for (ActivityMingleSession session : jobGroupScope.findEventOwned(org.springframework.data.mongodb.core.query.Query.query(
                    org.springframework.data.mongodb.core.query.Criteria.where("status").in(TIMED_STATUSES)
                        .and("phaseEndsAtIso").lte(now.toString()))
                    .with(org.springframework.data.domain.Sort.by("phaseEndsAtIso")).limit(50), ActivityMingleSession.class, "eventId")) {
            try {
                mingleService.advanceDueSession(session, now);
            } catch (OptimisticLockingFailureException ignored) {
                // Another worker or an organizer action already advanced this revision.
            } catch (RuntimeException error) {
                LOGGER.warn("Unable to advance Mingle session for event {}", session.getEventId(), error);
            }
        }
    }
}
