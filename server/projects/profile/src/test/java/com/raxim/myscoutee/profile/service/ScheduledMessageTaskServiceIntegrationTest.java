package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.awaitility.Awaitility.await;

import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.bson.types.ObjectId;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.SimpleMongoClientDatabaseFactory;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;

import com.raxim.myscoutee.common.config.properties.AffinityRecomputeProperties;
import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.AffinityRecomputeTask;
import com.raxim.myscoutee.profile.data.document.ScheduledMessageDelivery;
import com.raxim.myscoutee.profile.data.document.ScheduledMessageRun;
import com.raxim.myscoutee.profile.data.document.ScheduledMessageTask;
import com.raxim.myscoutee.profile.data.document.UserSessionAction;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.data.document.SubEventItem;
import com.raxim.myscoutee.profile.repository.AffinityRecomputeTasksRepository;
import com.raxim.myscoutee.profile.repository.ScheduledMessageDeliveriesRepository;
import com.raxim.myscoutee.profile.repository.ScheduledMessageTasksRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;
import com.raxim.myscoutee.profile.service.email.ScheduledMessageAuditService;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;

import de.flapdoodle.embed.mongo.commands.ServerAddress;
import de.flapdoodle.embed.mongo.distribution.Version;
import de.flapdoodle.embed.mongo.transitions.Mongod;
import de.flapdoodle.embed.mongo.transitions.RunningMongodProcess;
import de.flapdoodle.reverse.TransitionWalker;

@SpringJUnitConfig(ScheduledMessageTaskServiceIntegrationTest.Config.class)
@TestPropertySource(properties = {
        "scheduled-messages.task-poll-delay-ms=5000",
        "scheduled-messages.worker-lookahead-ms=15000"
})
class ScheduledMessageTaskServiceIntegrationTest {
    @Autowired
    private MongoTemplate mongoTemplate;
    @Autowired
    private UsersRepository usersRepository;
    @Autowired
    private ScheduledMessageTasksRepository scheduledMessageTasksRepository;
    @Autowired
    private ScheduledMessageDeliveriesRepository scheduledMessageDeliveriesRepository;
    @Autowired
    private ScheduledMessageTaskService scheduledMessageTaskService;

    @BeforeEach
    void cleanMongo() {
        mongoTemplate.dropCollection(Users.class);
        mongoTemplate.dropCollection(ScheduledMessageTask.class);
        mongoTemplate.dropCollection(ScheduledMessageRun.class);
        mongoTemplate.dropCollection(ScheduledMessageDelivery.class);
        mongoTemplate.dropCollection(UserSessionAction.class);
        mongoTemplate.dropCollection(AffinityRecomputeTask.class);
    }

    @Test
    void activityRefreshUpdatesControllerStateBeforeOriginalWorkerCanInactivate() throws Exception {
        usersRepository.save(activeUser("user-refresh"));
        String taskKey = userInactivityTaskKey("user-refresh");
        Instant originalDueAt = Instant.now().plusSeconds(8);
        ScheduledMessageTask task = scheduledMessageTasksRepository.save(inactivityTask(
                taskKey,
                "user-refresh",
                originalDueAt));

        scheduledMessageTaskService.acceptTaskMetadata(task);
        Thread.sleep(Duration.ofSeconds(6).toMillis());

        scheduledMessageTaskService.touchUserActivity("user-refresh");
        Thread.sleep(Duration.ofSeconds(5).toMillis());

        Users user = usersRepository.findByUserId("user-refresh").orElseThrow();
        ScheduledMessageTask refreshedTask = scheduledMessageTasksRepository.findByTaskKey(taskKey).orElseThrow();

        assertThat(user.getStatus()).isEqualTo("A");
        assertThat(user.getProfileStatus()).isEqualTo("public");
        assertThat(Instant.parse(refreshedTask.getDueAtIso())).isAfter(originalDueAt.plus(20, ChronoUnit.DAYS));
        assertThat(scheduledMessageDeliveriesRepository.findAll())
                .extracting(ScheduledMessageDelivery::getStatus)
                .doesNotContain("completed");
    }

    @Test
    void dueControllerWorkerInactivatesProfileWhenThereWasNoActivityRefresh() {
        usersRepository.save(activeUser("user-due"));
        ScheduledMessageTask task = scheduledMessageTasksRepository.save(inactivityTask(
                userInactivityTaskKey("user-due"),
                "user-due",
                Instant.now().plusSeconds(8)));

        scheduledMessageTaskService.acceptTaskMetadata(task);

        await().atMost(Duration.ofSeconds(12)).pollInterval(Duration.ofMillis(250)).untilAsserted(() -> {
            Users user = usersRepository.findByUserId("user-due").orElseThrow();
            assertThat(user.getStatus()).isEqualTo("I");
            assertThat(user.getProfileStatus()).isEqualTo("inactive");
            assertThat(scheduledMessageTasksRepository
                            .findByTaskKey(task.getTaskKey())
                            .orElseThrow()
                            .getLastRunStatus())
                    .isEqualTo("completed");
            assertThat(scheduledMessageDeliveriesRepository.findAll())
                    .extracting(ScheduledMessageDelivery::getStatus)
                    .contains("completed");
        });
    }

    @Test
    void pollReconciliationCancelsSuspendedWorkerBeforeDueTime() throws Exception {
        usersRepository.save(activeUser("user-suspend"));
        ScheduledMessageTask task = scheduledMessageTasksRepository.save(inactivityTask(
                userInactivityTaskKey("user-suspend"),
                "user-suspend",
                Instant.now().plusSeconds(13)));

        scheduledMessageTaskService.runDueTasks();
        Thread.sleep(Duration.ofSeconds(8).toMillis());

        ScheduledMessageTask suspended = scheduledMessageTasksRepository.findByTaskKey(task.getTaskKey()).orElseThrow();
        suspended.setSuspended(Boolean.TRUE);
        suspended.setUpdatedDate(Instant.now().toString());
        suspended.setUpdatedUser("junit");
        scheduledMessageTasksRepository.save(suspended);

        scheduledMessageTaskService.runDueTasks();
        Thread.sleep(Duration.ofSeconds(7).toMillis());

        Users user = usersRepository.findByUserId("user-suspend").orElseThrow();
        ScheduledMessageTask retainedTask = scheduledMessageTasksRepository.findByTaskKey(task.getTaskKey()).orElseThrow();

        assertThat(user.getStatus()).isEqualTo("A");
        assertThat(user.getProfileStatus()).isEqualTo("public");
        assertThat(retainedTask.getSuspended()).isTrue();
        assertThat(retainedTask.getLastRunStatus()).isNull();
        assertThat(scheduledMessageDeliveriesRepository.findAll()).isEmpty();
    }

    @Test
    void eventUnpublishSuspendsStageReminderAndCancelsControllerWorker() throws Exception {
        ActivityEvent event = publishedStageEvent("event-stage-reminder", Instant.now().plusSeconds(13));

        scheduledMessageTaskService.scheduleEventStageReminders(event, "admin-user");
        Thread.sleep(Duration.ofSeconds(8).toMillis());

        scheduledMessageTaskService.suspendEventStageReminders("event-stage-reminder", "admin-user");
        Thread.sleep(Duration.ofSeconds(7).toMillis());

        ScheduledMessageTask task = scheduledMessageTasksRepository
                .findByTaskKey("event-stage-reminder:event-stage-reminder:stage-one")
                .orElseThrow();
        assertThat(task.getSuspended()).isTrue();
        assertThat(task.getLastRunStatus()).isNull();
        assertThat(scheduledMessageDeliveriesRepository.findAll()).isEmpty();
    }

    @Test
    void eventRepublishUnsuspendsExistingStageReminderTask() {
        ActivityEvent event = publishedStageEvent("event-stage-republish", Instant.now().plusSeconds(60));
        String taskKey = "event-stage-reminder:event-stage-republish:stage-one";

        scheduledMessageTaskService.scheduleEventStageReminders(event, "admin-user");
        scheduledMessageTaskService.suspendEventStageReminders("event-stage-republish", "admin-user");

        ScheduledMessageTask suspended = scheduledMessageTasksRepository.findByTaskKey(taskKey).orElseThrow();
        assertThat(suspended.getSuspended()).isTrue();

        scheduledMessageTaskService.scheduleEventStageReminders(event, "admin-user");

        ScheduledMessageTask republished = scheduledMessageTasksRepository.findByTaskKey(taskKey).orElseThrow();
        assertThat(republished.getSuspended()).isFalse();
        assertThat(republished.getStatus()).isEqualTo("scheduled");
    }

    @Test
    void completedStageReminderIsNotRescheduledForTheSameOccurrence() {
        Instant stageStartAt = Instant.now().plusSeconds(60);
        ActivityEvent event = publishedStageEvent("event-stage-completed", stageStartAt);
        String taskKey = "event-stage-reminder:event-stage-completed:stage-one";

        scheduledMessageTaskService.scheduleEventStageReminders(event, "admin-user");
        ScheduledMessageTask completed = scheduledMessageTasksRepository.findByTaskKey(taskKey).orElseThrow();
        completed.setStatus("completed");
        completed.setLastRunStatus("completed");
        completed.setLastRunCount(1);
        completed.setLastRunAtIso(Instant.now().toString());
        scheduledMessageTasksRepository.save(completed);

        scheduledMessageTaskService.scheduleEventStageReminders(event, "admin-user");

        ScheduledMessageTask retained = scheduledMessageTasksRepository.findByTaskKey(taskKey).orElseThrow();
        assertThat(retained.getStatus()).isEqualTo("completed");
        assertThat(retained.getLastRunStatus()).isEqualTo("completed");
        assertThat(retained.getLastRunCount()).isEqualTo(1);
        assertThat(retained.getPayload()).containsEntry("stageStartAtIso", stageStartAt.toString());
    }

    @Test
    void tournamentStageUsesLifecycleNotificationsInsteadOfGenericStartSoonReminder() {
        Instant stageStartAt = Instant.now().plus(150, ChronoUnit.MINUTES);
        ActivityEvent event = publishedStageEvent("tournament-stage-no-reminder", stageStartAt.minus(120, ChronoUnit.MINUTES));
        event.setSubEvents(List.of(stage(
                "stage-one",
                "Final",
                stageStartAt,
                1,
                2,
                "Score",
                1)));

        assertThat(scheduledMessageTaskService.scheduleEventStageReminders(event, "admin-user")).isEmpty();
        assertThat(scheduledMessageTasksRepository.findByEventIdAndActionKey(
                "tournament-stage-no-reminder",
                ScheduledMessageTaskService.ACTION_EVENT_STAGE_REMINDER)).isEmpty();
    }

    private Users activeUser(String userId) {
        Users user = new Users();
        user.setMongoId(new ObjectId().toHexString());
        user.setSyncKey(UUID.randomUUID().toString());
        user.setId(userId);
        user.setName("Test User");
        user.setEmail(userId + "@example.com");
        user.setStatus("A");
        user.setProfileStatus("public");
        return user;
    }

    private ScheduledMessageTask inactivityTask(String taskKey, String userId, Instant dueAt) {
        ScheduledMessageTask task = new ScheduledMessageTask();
        task.setId(new ObjectId().toHexString());
        task.setSyncKey(UUID.randomUUID().toString());
        task.setTaskKey(taskKey);
        task.setActionKey(ScheduledMessageTaskService.ACTION_INACTIVATE_PROFILE_AFTER_INACTIVITY);
        task.setUserId(userId);
        task.setDueAtIso(dueAt.toString());
        task.setStatus("scheduled");
        task.setSuspended(Boolean.FALSE);
        task.setPayload(Map.of("inactiveDays", "30"));
        task.setCreatedDate(Instant.now().toString());
        task.setCreatedUser("junit");
        task.setUpdatedDate(Instant.now().toString());
        task.setUpdatedUser("junit");
        return task;
    }

    private ActivityEvent publishedStageEvent(String sourceId, Instant reminderDueAt) {
        Instant stageStartAt = reminderDueAt.plus(120, ChronoUnit.MINUTES);
        ActivityEvent event = new ActivityEvent();
        event.setId(new ObjectId().toHexString());
        event.setSyncKey(UUID.randomUUID().toString());
        event.setSourceId(sourceId);
        event.setStatus("hosting");
        event.setTitle("Tournament Night");
        event.setStartAtIso(stageStartAt.toString());
        event.setStatus("A");
        event.setSubEvents(List.of(stage("stage-one", "Stage One", stageStartAt)));
        return event;
    }

    private SubEventItem stage(String id, String name, Instant startAt) {
        return stage(id, name, startAt, null, null, "", null);
    }

    private SubEventItem stage(
            String id,
            String name,
            Instant startAt,
            Integer groupCapacityMin,
            Integer groupCapacityMax,
            String leaderboardType,
            Integer advancePerGroup) {
        return new SubEventItem(
                id,
                name,
                "",
                startAt.toString(),
                startAt.plusSeconds(3600).toString(),
                "",
                "",
                groupCapacityMin,
                groupCapacityMax,
                leaderboardType,
                advancePerGroup,
                Boolean.FALSE,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null);
    }

    private String userInactivityTaskKey(String userId) {
        return "user-profile-inactive-30d:" + userId;
    }

    @Configuration(proxyBeanMethods = false)
    @EnableScheduling
    @EnableMongoRepositories(basePackages = "com.raxim.myscoutee.profile.repository")
    @Import({
            ScheduledMessageTaskService.class,
            ScheduledMessageAuditService.class
    })
    static class Config {
        @Bean(destroyMethod = "close")
        TransitionWalker.ReachedState<RunningMongodProcess> embeddedMongo() {
            return Mongod.instance().start(Version.Main.V6_0);
        }

        @Bean(destroyMethod = "close")
        MongoClient mongoClient(TransitionWalker.ReachedState<RunningMongodProcess> embeddedMongo) {
            ServerAddress serverAddress = embeddedMongo.current().getServerAddress();
            return MongoClients.create("mongodb://" + serverAddress.getHost() + ":" + serverAddress.getPort());
        }

        @Bean
        MongoTemplate mongoTemplate(MongoClient mongoClient) {
            return new MongoTemplate(new SimpleMongoClientDatabaseFactory(
                    mongoClient,
                    "scheduled-message-task-test"));
        }

        @Bean
        AffinityRecomputeTaskService affinityRecomputeTaskService(
                AffinityRecomputeTasksRepository tasksRepository,
                MongoTemplate mongoTemplate) {
            return new AffinityRecomputeTaskService(
                    tasksRepository,
                    new AffinityRecomputeProperties(),
                    mongoTemplate);
        }
    }
}
