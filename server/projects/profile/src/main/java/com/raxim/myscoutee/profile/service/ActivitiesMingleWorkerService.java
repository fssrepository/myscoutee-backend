package com.raxim.myscoutee.profile.service;

import java.time.Instant;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.raxim.myscoutee.profile.data.document.ActivityMingleSession;
import com.raxim.myscoutee.profile.repository.ActivityMingleSessionsRepository;

@Service
public class ActivitiesMingleWorkerService {
    @org.springframework.beans.factory.annotation.Autowired
    private com.raxim.myscoutee.profile.service.notifications.NotificationRuleRegistryService groupRules;
    @org.springframework.beans.factory.annotation.Autowired
    private com.raxim.myscoutee.profile.service.JobGroupScopeService jobGroupScope;
    @org.springframework.beans.factory.annotation.Autowired
    private com.raxim.myscoutee.common.config.mongo.ScheduledMongoSessionRunner groupDatabases;

    private static final Logger LOGGER = LoggerFactory.getLogger(ActivitiesMingleWorkerService.class);
    private static final List<String> TIMED_STATUSES = List.of(
            ActivitiesMingleService.STATUS_ROUND,
            ActivitiesMingleService.STATUS_BREAK);

    private final ActivityMingleSessionsRepository sessionsRepository;
    private final ActivitiesMingleService mingleService;

    public ActivitiesMingleWorkerService(
            ActivityMingleSessionsRepository sessionsRepository,
            ActivitiesMingleService mingleService) {
        this.sessionsRepository = sessionsRepository;
        this.mingleService = mingleService;
    }

    @Scheduled(fixedDelayString = "${app.mingle.worker.fixed-delay-ms:5000}")
    public void advanceDueSessions() {
        groupDatabases.runAcrossConfiguredDatabases(() -> groupRules.runScheduledGroups("event-mingle-advance", this::advanceDueSessionsInGroup));
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
