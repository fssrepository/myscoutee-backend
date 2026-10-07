package com.raxim.myscoutee.domain.email.service;

import com.raxim.myscoutee.domain.administration.service.AdminTelemetryService;
import com.raxim.myscoutee.domain.affinity.service.AffinityRecomputeTaskService;
import com.raxim.myscoutee.domain.platform.api.JobGroupContext;
import com.raxim.myscoutee.domain.platform.service.JobGroupScopeService;

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

import com.raxim.myscoutee.domain.affinity.config.AffinityRecomputeProperties;
import com.raxim.myscoutee.domain.events.document.ActivityEvent;
import com.raxim.myscoutee.domain.affinity.document.AffinityRecomputeTask;
import com.raxim.myscoutee.domain.email.document.ScheduledMessageDelivery;
import com.raxim.myscoutee.domain.email.document.ScheduledMessageRun;
import com.raxim.myscoutee.domain.email.document.ScheduledMessageTask;
import com.raxim.myscoutee.domain.accounts.document.UserSessionAction;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.events.document.SubEventItem;
import com.raxim.myscoutee.domain.affinity.repository.AffinityRecomputeTasksRepository;
import com.raxim.myscoutee.domain.email.repository.ScheduledMessageDeliveriesRepository;
import com.raxim.myscoutee.domain.email.repository.ScheduledMessageTasksRepository;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;
import com.raxim.myscoutee.domain.email.service.ScheduledMessageAuditService;

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

@org.junit.jupiter.api.Tag("embedded")
class ScheduledMessageTaskServiceIntegrationTest {
    @Autowired
    private MongoTemplate mongoTemplate;
    @Autowired
    private UsersRepository profiles;
    @Autowired
    private ScheduledMessageTasksRepository scheduledMessageTasksRepository;
    @Autowired
    private ScheduledMessageDeliveriesRepository scheduledMessageDeliveriesRepository;
    @Autowired
    private ScheduledMessageTaskService scheduledMessageTaskService;

    @BeforeEach
    void cleanMongo() {
        mongoTemplate.dropCollection(com.raxim.myscoutee.domain.notifications.document.NotificationRuleConfig.class);
        var rule = new com.raxim.myscoutee.domain.notifications.document.NotificationRuleConfig();
        rule.setRuleKey("scheduled-messages"); rule.setEnabled(true); rule.setTriggerKind("scheduled_process");
        rule.setTiming(new com.raxim.myscoutee.domain.notifications.document.NotificationRuleConfig.Timing());
        rule.getTiming().setMode("interval"); rule.getTiming().setIntervalSeconds(1);
        mongoTemplate.save(rule);
        mongoTemplate.dropCollection(Users.class);
        mongoTemplate.dropCollection(ScheduledMessageTask.class);
        mongoTemplate.dropCollection(ScheduledMessageRun.class);
        mongoTemplate.dropCollection(ScheduledMessageDelivery.class);
        mongoTemplate.dropCollection(UserSessionAction.class);
        mongoTemplate.dropCollection(AffinityRecomputeTask.class);
    }

    @Test
    void groupOwnedSelectionFiltersBeforeBatchLimit() {
        var dating = activeUser("dating-owner");
        var work = activeUser("work-owner"); work.setWorkspaceGroupId("myscoutee-work");
        profiles.saveAll(List.of(dating, work));
        mongoTemplate.dropCollection(com.raxim.myscoutee.domain.payments.document.Payment.class);
        for (var owner : List.of("dating-owner", "work-owner")) {
            var payment = new com.raxim.myscoutee.domain.payments.document.Payment();
            payment.setUserId(owner); payment.setStatus("pending"); payment.setCreatedDate(owner);
            mongoTemplate.save(payment);
        }
        var scope = new JobGroupScopeService();
        var directory = new com.raxim.myscoutee.domain.groups.service.GroupDirectoryService(org.mockito.Mockito.mock(com.raxim.myscoutee.domain.groups.repository.CommunityGroupsRepository.class));
        org.springframework.test.util.ReflectionTestUtils.setField(directory, "mongo", mongoTemplate);
        org.springframework.test.util.ReflectionTestUtils.setField(scope, "groupDirectory", directory);
        var query = org.springframework.data.mongodb.core.query.Query.query(org.springframework.data.mongodb.core.query.Criteria.where("status").is("pending"))
                .with(org.springframework.data.domain.Sort.by("createdDate")).limit(1);
        var result = JobGroupContext.call("myscoutee-work", () -> com.raxim.myscoutee.domain.payments.service.PaymentTestSupport.scopedPayments(mongoTemplate, scope, query));
        assertThat(result).extracting(com.raxim.myscoutee.domain.payments.document.Payment::getUserId).containsExactly("work-owner");
        assertThat(JobGroupContext.call(null, () -> com.raxim.myscoutee.domain.payments.service.PaymentTestSupport.scopedPayments(mongoTemplate, scope, query)))
                .extracting(com.raxim.myscoutee.domain.payments.document.Payment::getUserId).containsExactly("dating-owner");
    }

    @Test
    void activityRefreshUpdatesControllerStateBeforeOriginalWorkerCanInactivate() throws Exception {
        profiles.save(activeUser("user-refresh"));
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

        Users user = profiles.findByUserId("user-refresh").orElseThrow();
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
        profiles.save(activeUser("user-due"));
        ScheduledMessageTask task = scheduledMessageTasksRepository.save(inactivityTask(
                userInactivityTaskKey("user-due"),
                "user-due",
                Instant.now().plusSeconds(8)));

        scheduledMessageTaskService.acceptTaskMetadata(task);

        await().atMost(Duration.ofSeconds(12)).pollInterval(Duration.ofMillis(250)).untilAsserted(() -> {
            Users user = profiles.findByUserId("user-due").orElseThrow();
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
        profiles.save(activeUser("user-suspend"));
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

        Users user = profiles.findByUserId("user-suspend").orElseThrow();
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
        Instant reminderDueAt = Instant.now().plusSeconds(60);
        Instant stageStartAt = reminderDueAt.plus(120, ChronoUnit.MINUTES);
        ActivityEvent event = publishedStageEvent("event-stage-completed", reminderDueAt);
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
    @EnableMongoRepositories(basePackages = "com.raxim.myscoutee.domain")
    @Import({
            ScheduledMessageTaskService.class,
            com.raxim.myscoutee.domain.accounts.service.ProfileDirectoryService.class,
            com.raxim.myscoutee.domain.accounts.service.AccountInactivityService.class,
            ScheduledMessageAuditService.class,
            com.raxim.myscoutee.domain.notifications.service.NotificationCatalogService.class,
            com.raxim.myscoutee.domain.notifications.repository.UserNotificationPageRepository.class,
            com.raxim.myscoutee.domain.events.service.MemberAttentionService.class,
            com.raxim.myscoutee.domain.groups.service.GroupDirectoryService.class,
            com.raxim.myscoutee.domain.affinity.service.ConfigurationCatalogService.class,
            com.raxim.myscoutee.domain.accounts.service.AccountAffinityProjectionService.class,
            com.raxim.myscoutee.domain.events.service.EventOwnershipService.class,
            com.raxim.myscoutee.domain.assets.service.AssetOwnershipService.class,
            JobGroupScopeService.class
    })
    static class Config {
        @Bean
        com.raxim.myscoutee.domain.community.service.ServiceFeedbackService serviceFeedback() {
            return org.mockito.Mockito.mock(com.raxim.myscoutee.domain.community.service.ServiceFeedbackService.class);
        }
        @Bean
        tools.jackson.databind.ObjectMapper objectMapper() {
            return new tools.jackson.databind.ObjectMapper();
        }

        @Bean
        com.raxim.myscoutee.domain.notifications.service.NotificationRuleRegistryService jobRegistry(
                com.raxim.myscoutee.domain.notifications.repository.NotificationRuleConfigsRepository rules, MongoTemplate mongo) {
            return new com.raxim.myscoutee.domain.notifications.service.NotificationRuleRegistryService(rules,
                    org.mockito.Mockito.mock(com.raxim.myscoutee.domain.notifications.service.AdminNotificationSocketSessionRegistry.class),
                    mongo, org.mockito.Mockito.mock(AdminTelemetryService.class));
        }

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
                    mongoTemplate, null);
        }
    }
}
