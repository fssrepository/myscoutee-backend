package com.raxim.myscoutee.e2e;

import static org.assertj.core.api.Assertions.assertThat;
import static org.awaitility.Awaitility.await;
import static org.mockito.Mockito.RETURNS_DEEP_STUBS;
import static org.mockito.Mockito.mock;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Supplier;

import org.bson.Document;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.ReplaceOptions;
import com.raxim.myscoutee.Main;
import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.domain.events.document.ActivityEvent;
import com.raxim.myscoutee.domain.events.document.ActivityMember;
import com.raxim.myscoutee.domain.affinity.document.AffinityRecomputeTask;
import com.raxim.myscoutee.domain.email.document.EmailOutboxItem;
import com.raxim.myscoutee.domain.email.document.EmailTemplate;
import com.raxim.myscoutee.domain.notifications.document.NotificationOutboxItem;
import com.raxim.myscoutee.domain.email.document.ScheduledMessageRun;
import com.raxim.myscoutee.domain.email.document.ScheduledMessageTask;
import com.raxim.myscoutee.domain.affinity.document.UserAffinityEdge;
import com.raxim.myscoutee.domain.accounts.document.UserSessionAction;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.common.dto.SharedDtos.LocationCoordinatesDto;
import com.raxim.myscoutee.domain.affinity.service.AffinityRecomputeTaskService;
import com.raxim.myscoutee.domain.email.service.ScheduledMessageTaskService;
import com.raxim.myscoutee.domain.email.service.EmailOutboxStatus;

import de.flapdoodle.embed.mongo.commands.ServerAddress;
import de.flapdoodle.embed.mongo.distribution.Version;
import de.flapdoodle.embed.mongo.transitions.Mongod;
import de.flapdoodle.embed.mongo.transitions.RunningMongodProcess;
import de.flapdoodle.reverse.TransitionWalker;

@Tag("e2e")
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
@SpringBootTest(
        classes = Main.class,
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
        properties = {
                "config.firebase-enabled=false",
                "config.member-user=member1@myscoutee.local",
                "admin.stats.enabled=false",
                "admin.stats.telemetry-window-ms=600000",
                "assets.source-refresh.enabled=false",
                "media.enabled=false",
                "events.scheduler.enabled=false",
                "events.scheduler.check-delay-ms=600000",
                "events.waitlist.inviter-check-delay-ms=600000",
                "scheduled-messages.task-poll-delay-ms=100",
                "scheduled-messages.worker-lookahead-ms=5000",
                "chat.stream.poll-delay-ms=600000",
                "notifications.outbox.worker-check-delay-ms=600000",
                "notifications.outbox.wakeup-poll-delay-ms=600000",
                "email.enabled=true",
                "email.provider=noop",
                "email.promotions.scheduler-poll-delay-ms=600000",
                "email.promotions.delivery-delay-ms=600000",
                "affinity.recompute.worker-tick-ms=100",
                "users.deleted-account-purge-delay-ms=600000",
                "spring.main.allow-bean-definition-overriding=true",
                "logging.level.org.springframework.data.mongodb.core.MongoTemplate=WARN"
        })
class BackendSchedulersE2ETest {
    private static final String DB_SUFFIX = UUID.randomUUID().toString().replace("-", "");
    private static final String REAL_DB = "myscoutee_scheduler_e2e_real_" + DB_SUFFIX;
    private static final String DEMO_DB = "myscoutee_scheduler_e2e_demo_" + DB_SUFFIX;
    private static final String STAGE_EVENT_ID = "e2e-scheduler-stage-event";
    private static final String STAGE_ID = "e2e-scheduler-stage";
    private static final String STAGE_TASK_KEY = "event-stage-reminder:" + STAGE_EVENT_ID + ":" + STAGE_ID;
    private static final String INACTIVE_USER_ID = "e2e-scheduler-inactive";
    private static final String INACTIVE_TASK_KEY = "user-profile-inactive-30d:" + INACTIVE_USER_ID;
    private static final String AFFINITY_TASK_KEY = "NOOP:e2e-scheduler-noop";
    private static final String EMAIL_TEMPLATE_KEY = "event-stage-reminder-v1";
    private static final Instant BASE_TIME = Instant.parse("2026-06-10T12:00:00Z");

    private static TransitionWalker.ReachedState<RunningMongodProcess> embeddedMongo;
    private static String mongoBaseUri;

    @Autowired
    private MongoTemplate mongoTemplate;

    @DynamicPropertySource
    static void mongoProperties(DynamicPropertyRegistry registry) {
        ensureEmbeddedMongo();
        registry.add("SPRING_MONGODB_URI", () -> mongoBaseUri + "/" + REAL_DB);
        registry.add("MONGODB_DEMO_URI", () -> mongoBaseUri + "/" + DEMO_DB);
        registry.add("spring.mongodb.database", () -> REAL_DB);
        registry.add("MONGODB_DEMO_DATABASE", () -> DEMO_DB);
    }

    @AfterAll
    static void stopEmbeddedMongo() throws Exception {
        if (embeddedMongo != null) {
            embeddedMongo.close();
        }
    }

    @BeforeEach
    void seedSchedulerBackend() {
        withReal(() -> {
            clearE2eCollections();
            seedUsers();
            seedStageReminderEventAndTemplate();
            seedDueScheduledTasks();
            seedDueAffinityWorkerTask();
            E2eScheduledJobTestSupport.enable(mongoTemplate, "scheduled-messages", "affinity-recompute");
        });
    }

    @Test
    void backendSchedulersPickUpDueWorkAndPersistSideEffects() {
        await().atMost(Duration.ofSeconds(8)).pollInterval(Duration.ofMillis(150)).untilAsserted(() -> {
            ScheduledMessageTask stageTask = findOne(
                    Query.query(Criteria.where("taskKey").is(STAGE_TASK_KEY)),
                    ScheduledMessageTask.class);
            assertThat(stageTask).isNotNull();
            assertThat(stageTask.getStatus()).isEqualTo("completed");
            assertThat(stageTask.getLastRunStatus()).isEqualTo("completed");
            assertThat(stageTask.getLastRunCount()).isEqualTo(1);

            EmailOutboxItem reminderEmail = findOne(
                    Query.query(Criteria.where("ruleKey").is(STAGE_TASK_KEY)),
                    EmailOutboxItem.class);
            assertThat(reminderEmail).isNotNull();
            assertThat(reminderEmail.getUserId()).isEqualTo("e2e-scheduler-member");
            assertThat(reminderEmail.getStatus()).isEqualTo(EmailOutboxStatus.PENDING);
            assertThat(reminderEmail.getSubject()).contains("Scheduler Stage");
        });

        await().during(Duration.ofMillis(600)).atMost(Duration.ofSeconds(3)).pollInterval(Duration.ofMillis(100)).untilAsserted(() ->
                assertThat(fromReal(() -> mongoTemplate.count(Query.query(Criteria.where("ruleKey").is(STAGE_TASK_KEY)), EmailOutboxItem.class)))
                        .as("completed scheduler task should not create duplicate reminder emails on repeated polls")
                        .isEqualTo(1));

        await().atMost(Duration.ofSeconds(8)).pollInterval(Duration.ofMillis(150)).untilAsserted(() -> {
            ScheduledMessageTask inactiveTask = findOne(
                    Query.query(Criteria.where("taskKey").is(INACTIVE_TASK_KEY)),
                    ScheduledMessageTask.class);
            assertThat(inactiveTask).isNotNull();
            assertThat(inactiveTask.getStatus()).isEqualTo("completed");
            assertThat(inactiveTask.getLastRunStatus()).isEqualTo("completed");

            Users inactiveUser = findOne(
                    Query.query(Criteria.where("_id").is(INACTIVE_USER_ID)),
                    Users.class);
            assertThat(inactiveUser).isNotNull();
            assertThat(inactiveUser.getStatus()).isEqualTo("I");
            assertThat(inactiveUser.getProfileStatus()).isEqualTo("inactive");

            AffinityRecomputeTask adminStatusTask = findOne(
                    Query.query(Criteria.where("targetId").is(INACTIVE_USER_ID)),
                    AffinityRecomputeTask.class);
            assertThat(adminStatusTask).isNotNull();
            assertThat(adminStatusTask.getReasons()).contains(AffinityRecomputeTaskService.REASON_ADMIN_STATUS_CHANGED);
        });

        await().atMost(Duration.ofSeconds(8)).pollInterval(Duration.ofMillis(150)).untilAsserted(() -> {
            AffinityRecomputeTask affinityTask = findOne(
                    Query.query(Criteria.where("taskKey").is(AFFINITY_TASK_KEY)),
                    AffinityRecomputeTask.class);
            assertThat(affinityTask).isNotNull();
            assertThat(affinityTask.getStatus()).isEqualTo(AffinityRecomputeTaskService.STATUS_DONE);
            assertThat(affinityTask.getAttemptCount()).isGreaterThanOrEqualTo(1);
            assertThat(affinityTask.getCompletedAtIso()).isNotBlank();
        });
    }

    private void clearE2eCollections() {
        mongoTemplate.remove(new Query(), Users.class);
        mongoTemplate.remove(new Query(), ActivityEvent.class);
        mongoTemplate.remove(new Query(), ActivityMember.class);
        mongoTemplate.remove(new Query(), UserAffinityEdge.class);
        mongoTemplate.remove(new Query(), ScheduledMessageTask.class);
        mongoTemplate.remove(new Query(), ScheduledMessageRun.class);
        mongoTemplate.remove(new Query(), EmailTemplate.class);
        mongoTemplate.remove(new Query(), EmailOutboxItem.class);
        mongoTemplate.remove(new Query(), NotificationOutboxItem.class);
        mongoTemplate.remove(new Query(), AffinityRecomputeTask.class);
        mongoTemplate.remove(new Query(), UserSessionAction.class);
    }

    private void seedUsers() {
        mongoTemplate.insert(List.of(
                user("e2e-scheduler-member", "Stage Member"),
                user(INACTIVE_USER_ID, "Inactive Soon")),
                Users.class);
    }

    private Users user(String userId, String name) {
        Users user = new Users();
        user.setMongoId(userId);
        user.setSyncKey("sync-" + userId + "-" + UUID.randomUUID());
        user.setId(userId);
        user.setEmail(userId + "@example.test");
        user.setName(name);
        user.setInitials("ES");
        user.setAge(29);
        user.setCity("Bratislava");
        user.setGender("woman");
        user.setStatus("A");
        user.setProfileStatus("public");
        user.setCompletion(100);
        user.setLocationCoordinates(new Users.LocationCoordinatesRecord(48.1486d, 17.1077d));
        user.setActivities(new Users.UserActivitiesRecord(
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                new Users.UserChatCountersRecord(0, 0, 0, 0, 0, 0),
                new Users.UserEventCountersRecord(0, 0, 0, 0, 0, 0, 0),
                new Users.UserAssetCountersRecord(0, 0, 0, 0),
                new Users.UserEventFeedbackCountersRecord(0, 0, 0, 0),
                0, 0));
        return user;
    }

    private void seedStageReminderEventAndTemplate() {
        ActivityEvent event = new ActivityEvent();
        event.setId(new ObjectId().toHexString());
        event.setSyncKey("scheduler-event-" + UUID.randomUUID());
        event.setSourceId(STAGE_EVENT_ID);
        event.setOwnerUserId("e2e-scheduler-member");
        event.setCreatorUserId("e2e-scheduler-member");
        event.setStatus(ActivityEvent.STATUS_ACTIVE);
        event.setTitle("Scheduler Stage Cup");
        event.setStartAtIso(BASE_TIME.plus(Duration.ofDays(3)).toString());
        event.setEndAtIso(BASE_TIME.plus(Duration.ofDays(3)).plus(Duration.ofHours(2)).toString());
        event.setLocation("Scheduler Arena");
        event.setLocationCoordinates(new LocationCoordinatesDto(48.1486d, 17.1077d));
        event.setCapacityMin(1);
        event.setCapacityMax(2);
        event.setCapacityTotal(2);
        event.setCreatedDate(BASE_TIME.toString());
        event.setCreatedUser("e2e");
        event.setUpdatedDate(BASE_TIME.toString());
        event.setUpdatedUser("e2e");
        event.normalizeLifecycleState();
        mongoTemplate.insert(event);

        ActivityMember member = new ActivityMember();
        member.setId(new ObjectId().toHexString());
        member.setSyncKey("scheduler-member-" + UUID.randomUUID());
        member.setOwnerType("event");
        member.setOwnerId(STAGE_EVENT_ID);
        member.setUserId("e2e-scheduler-member");
        member.setRole("admin");
        member.setStatus("accepted");
        member.setRequestKind("join");
        member.setCreatedDate(BASE_TIME.toString());
        member.setCreatedUser("e2e");
        member.setUpdatedDate(BASE_TIME.toString());
        member.setUpdatedUser("e2e");
        mongoTemplate.insert(member);

        EmailTemplate template = new EmailTemplate();
        template.setId(new ObjectId().toHexString());
        template.setSyncKey("scheduler-email-template-" + UUID.randomUUID());
        template.setTemplateKey(EMAIL_TEMPLATE_KEY);
        template.setName("Scheduler Stage Reminder");
        template.setCategory("event");
        template.setLocale("en");
        template.setEnabled(true);
        template.setSubjectTemplate("Reminder: {{event_title}} / {{stage_name}}");
        template.setHtmlTemplate("<p>{{user_first_name}}, {{event_title}} starts soon.</p>");
        template.setTextTemplate("{{user_first_name}}, {{event_title}} starts soon.");
        template.setCreatedDate(BASE_TIME.toString());
        template.setCreatedUser("e2e");
        template.setUpdatedDate(BASE_TIME.toString());
        template.setUpdatedUser("e2e");
        mongoTemplate.insert(template);
    }

    private void seedDueScheduledTasks() {
        Instant now = Instant.now();
        mongoTemplate.insert(scheduledTask(
                STAGE_TASK_KEY,
                ScheduledMessageTaskService.ACTION_EVENT_STAGE_REMINDER,
                null,
                STAGE_EVENT_ID,
                STAGE_ID,
                now.plusMillis(300),
                Map.of(
                        "eventTitle", "Scheduler Stage Cup",
                        "stageName", "Scheduler Stage",
                        "stageStartAtIso", now.plus(Duration.ofHours(3)).toString(),
                        "leadMinutes", "120")));
        mongoTemplate.insert(scheduledTask(
                INACTIVE_TASK_KEY,
                ScheduledMessageTaskService.ACTION_INACTIVATE_PROFILE_AFTER_INACTIVITY,
                INACTIVE_USER_ID,
                null,
                null,
                now.plusMillis(450),
                Map.of("inactiveDays", "1")));
    }

    private ScheduledMessageTask scheduledTask(
            String taskKey,
            String actionKey,
            String userId,
            String eventId,
            String subEventId,
            Instant dueAt,
            Map<String, String> payload) {
        ScheduledMessageTask task = new ScheduledMessageTask();
        task.setId(new ObjectId().toHexString());
        task.setSyncKey("scheduler-task-" + UUID.randomUUID());
        task.setTaskKey(taskKey);
        task.setActionKey(actionKey);
        task.setUserId(userId);
        task.setEventId(eventId);
        task.setSubEventId(subEventId);
        task.setNotificationTemplateKey("unused-notification-template");
        task.setEmailTemplateKey(EMAIL_TEMPLATE_KEY);
        task.setDueAtIso(dueAt.toString());
        task.setStatus("scheduled");
        task.setSuspended(Boolean.FALSE);
        task.setPayload(payload);
        task.setCreatedDate(BASE_TIME.toString());
        task.setCreatedUser("e2e");
        task.setUpdatedDate(BASE_TIME.toString());
        task.setUpdatedUser("e2e");
        return task;
    }

    private void seedDueAffinityWorkerTask() {
        AffinityRecomputeTask task = new AffinityRecomputeTask();
        task.setId(new ObjectId().toHexString());
        task.setTaskKey(AFFINITY_TASK_KEY);
        task.setTargetType("NOOP");
        task.setTargetId("e2e-scheduler-noop");
        task.setReasons(List.of("E2E_SCHEDULER_STARTED"));
        task.setStatus(AffinityRecomputeTaskService.STATUS_PENDING);
        task.setAvailableAtIso(Instant.now().toString());
        task.setAttemptCount(0);
        task.setCreatedDate(BASE_TIME.toString());
        task.setUpdatedDate(BASE_TIME.toString());
        task.setUpdatedUser("e2e");
        mongoTemplate.insert(task);
    }

    private <T> T findOne(Query query, Class<T> type) {
        return fromReal(() -> mongoTemplate.findOne(query, type));
    }

    private void withReal(Runnable action) {
        MongoSessionMode previousMode = MongoSessionModeContext.currentMode();
        try {
            MongoSessionModeContext.set(MongoSessionMode.REAL);
            action.run();
        } finally {
            MongoSessionModeContext.set(previousMode);
        }
    }

    private <T> T fromReal(Supplier<T> supplier) {
        MongoSessionMode previousMode = MongoSessionModeContext.currentMode();
        try {
            MongoSessionModeContext.set(MongoSessionMode.REAL);
            return supplier.get();
        } finally {
            MongoSessionModeContext.set(previousMode);
        }
    }

    private static void ensureEmbeddedMongo() {
        if (embeddedMongo != null) {
            return;
        }
        embeddedMongo = Mongod.instance().start(Version.Main.V6_0);
        ServerAddress serverAddress = embeddedMongo.current().getServerAddress();
        mongoBaseUri = "mongodb://" + serverAddress.getHost() + ":" + serverAddress.getPort();
        seedCountryPartition(REAL_DB);
        seedCountryPartition(DEMO_DB);
        seedFastPlatformConfig(REAL_DB);
        seedFastPlatformConfig(DEMO_DB);
    }

    private static void seedCountryPartition(String databaseName) {
        try (MongoClient client = MongoClients.create(mongoBaseUri)) {
            Document geometry = new Document("type", "MultiPolygon")
                    .append("coordinates", List.of(List.of(List.of(
                            List.of(16.0d, 45.0d),
                            List.of(23.0d, 45.0d),
                            List.of(23.0d, 49.0d),
                            List.of(16.0d, 49.0d),
                            List.of(16.0d, 45.0d)))));
            Document document = new Document("_id", "country-hu-e2e")
                    .append("partitionKey", "country:hu")
                    .append("countryCode", "HU")
                    .append("countryName", "Hungary")
                    .append("displayName", "Hungary")
                    .append("source", "e2e")
                    .append("specificity", 100)
                    .append("importedAtIso", BASE_TIME.toString())
                    .append("geometry", geometry);
            client.getDatabase(databaseName)
                    .getCollection("countryPartitions")
                    .replaceOne(
                            Filters.eq("partitionKey", "country:hu"),
                            document,
                            new ReplaceOptions().upsert(true));
        }
    }

    private static void seedFastPlatformConfig(String databaseName) {
        try (MongoClient client = MongoClients.create(mongoBaseUri)) {
            Document jobs = new Document("workerPollDelayMs", 100)
                    .append("batchSize", 50)
                    .append("leaseDurationSeconds", 5)
                    .append("eventSchedulerPollDelayMs", 1000)
                    .append("autoInviterCadenceMs", 60000)
                    .append("notificationOutboxPollDelayMs", 60000)
                    .append("accountPurgeWindowDays", 30);
            Document document = new Document("_id", "affinity-config-e2e-fast")
                    .append("key", "default")
                    .append("active", true)
                    .append("version", 99)
                    .append("jobs", jobs)
                    .append("changedDate", BASE_TIME.toString())
                    .append("changedUser", "e2e")
                    .append("changedSection", "scheduler-e2e")
                    .append("changeSummary", "Fast worker cadence for scheduler e2e.");
            client.getDatabase(databaseName)
                    .getCollection("affinityConfigs")
                    .replaceOne(
                            Filters.eq("_id", "affinity-config-e2e-fast"),
                            document,
                            new ReplaceOptions().upsert(true));
        }
    }

    @TestConfiguration(proxyBeanMethods = false)
    static class E2eInfrastructure {
        @Bean
        @Primary
        StringRedisTemplate stringRedisTemplate() {
            return mock(StringRedisTemplate.class, RETURNS_DEEP_STUBS);
        }
    }
}
