package com.raxim.myscoutee.common.config.mongo;

import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.*;

import java.time.Instant;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.repository.support.MongoRepositoryFactory;
import org.springframework.test.util.ReflectionTestUtils;
import com.mongodb.client.MongoClients;
import de.flapdoodle.embed.mongo.distribution.Version;
import de.flapdoodle.embed.mongo.transitions.Mongod;
import com.raxim.myscoutee.domain.affinity.config.AffinityRecomputeProperties;
import com.raxim.myscoutee.domain.affinity.document.AffinityRecomputeTask;
import com.raxim.myscoutee.domain.affinity.service.*;
import com.raxim.myscoutee.domain.events.document.ActivityMingleSession;
import com.raxim.myscoutee.domain.events.repository.ActivityMingleSessionsRepository;
import com.raxim.myscoutee.domain.events.service.ActivitiesMingleWorkerService;
import com.raxim.myscoutee.domain.notifications.api.NotificationJobs;
import org.springframework.beans.factory.ObjectProvider;

@Tag("embedded")
class IdleScheduledWorkersTest {
    @Test
    void onlyDueAffinityTasksAndTimedMingleSessionsEnterWorkspaceScheduling() {
        try (var mongod = Mongod.instance().start(Version.Main.V6_0)) {
            var address = mongod.current().getServerAddress();
            try (var client = MongoClients.create("mongodb://" + address.getHost() + ":" + address.getPort())) {
                var mongo = new MongoTemplate(client, "idle_workers");
                var jobs = mock(NotificationJobs.class);
                var properties = new AffinityRecomputeProperties();
                properties.setEnabled(true);
                properties.setChangeStreamEnabled(false);
                // Keep the existing optional registry provider boundary; no alternate scheduler.
                var taskOwner = new AffinityRecomputeTaskService(null, properties, mongo, null);
                var provider = mock(ObjectProvider.class);
                when(provider.getIfAvailable()).thenReturn(jobs);
                ReflectionTestUtils.setField(taskOwner, "notificationRuleRegistryServiceProvider", provider);
                var affinity = new AffinityRecomputeWorkerService(taskOwner, null, null, properties, mongo,
                        new AffinityRecomputeMetricsService());
                var sessions = new MongoRepositoryFactory(mongo).getRepository(ActivityMingleSessionsRepository.class);
                var mingle = new ActivitiesMingleWorkerService(sessions, null, null, null, null);
                ReflectionTestUtils.setField(mingle, "groupRules", jobs);
                ReflectionTestUtils.setField(mingle, "groupDatabases", new ScheduledMongoSessionRunner("same", "same"));

                affinity.runDueTasks();
                mingle.advanceDueSessions();
                verifyNoInteractions(jobs);

                var task = new AffinityRecomputeTask();
                task.setStatus("pending"); task.setAvailableAtIso(Instant.now().plusSeconds(3600).toString());
                mongo.save(task);
                var session = new ActivityMingleSession(); session.setEventId("event");
                session.setStatus("ROUND");
                session.setPhaseEndsAtIso(Instant.now().plusSeconds(3600).toString()); mongo.save(session);
                affinity.runDueTasks(); mingle.advanceDueSessions(); verifyNoInteractions(jobs);

                task.setAvailableAtIso(Instant.now().minusSeconds(60).toString()); mongo.save(task);
                affinity.runDueTasks();
                verify(jobs).forEachGroup(eq(NotificationJobs.RULE_AFFINITY_RECOMPUTE), any(Runnable.class));
                clearInvocations(jobs);
                task.setStatus("done"); mongo.save(task); affinity.runDueTasks(); verifyNoInteractions(jobs);

                session.setPhaseEndsAtIso(Instant.now().minusSeconds(60).toString()); mongo.save(session);
                mingle.advanceDueSessions();
                verify(jobs).runScheduledGroups(eq("event-mingle-advance"), any(Runnable.class));
                clearInvocations(jobs);
                session.setStatus("completed"); mongo.save(session); mingle.advanceDueSessions(); verifyNoInteractions(jobs);

                task.setStatus("pending"); mongo.save(task); properties.setEnabled(false);
                affinity.runDueTasks(); verifyNoInteractions(jobs);
            }
        } finally {
            MongoSessionModeContext.clear();
        }
    }
}
