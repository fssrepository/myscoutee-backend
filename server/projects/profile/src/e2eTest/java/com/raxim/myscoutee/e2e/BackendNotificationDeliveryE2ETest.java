package com.raxim.myscoutee.e2e;

import static org.assertj.core.api.Assertions.assertThat;
import static org.awaitility.Awaitility.await;
import static org.mockito.Mockito.RETURNS_DEEP_STUBS;
import static org.mockito.Mockito.mock;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.function.Supplier;

import org.bson.Document;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.MulticastMessage;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.ReplaceOptions;
import com.raxim.myscoutee.Main;
import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.common.config.properties.ConfigProperties;
import com.raxim.myscoutee.profile.data.document.ActivityChat;
import com.raxim.myscoutee.profile.data.document.NotificationOutboxItem;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.service.notifications.FirebaseMessagingGateway;

import de.flapdoodle.embed.mongo.commands.ServerAddress;
import de.flapdoodle.embed.mongo.distribution.Version;
import de.flapdoodle.embed.mongo.transitions.Mongod;
import de.flapdoodle.embed.mongo.transitions.RunningMongodProcess;
import de.flapdoodle.reverse.TransitionWalker;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

@Tag("e2e")
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
@SpringBootTest(
        classes = {Main.class, BackendNotificationDeliveryE2ETest.E2eInfrastructure.class},
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
        properties = {
                "config.firebase-enabled=false",
                "config.dev-user=e2e-notify-sender@example.test",
                "admin.stats.enabled=false",
                "assets.source-refresh.enabled=false",
                "media.enabled=false",
                "events.scheduler.enabled=false",
                "events.scheduler.check-delay-ms=600000",
                "events.waitlist.inviter-check-delay-ms=600000",
                "scheduled-messages.task-poll-delay-ms=600000",
                "chat.stream.poll-delay-ms=600000",
                "notifications.outbox.worker-check-delay-ms=100",
                "notifications.outbox.wakeup-poll-delay-ms=600000",
                "notifications.outbox.batch-size=50",
                "notifications.outbox.firebase-chunk-size=500",
                "email.promotions.scheduler-poll-delay-ms=600000",
                "email.promotions.delivery-delay-ms=600000",
                "affinity.recompute.worker-tick-ms=600000",
                "users.deleted-account-purge-delay-ms=600000",
                "spring.main.allow-bean-definition-overriding=true",
                "logging.level.org.springframework.data.mongodb.core.MongoTemplate=WARN"
        })
class BackendNotificationDeliveryE2ETest {
    private static final String DB_SUFFIX = UUID.randomUUID().toString().replace("-", "");
    private static final String REAL_DB = "ms_notify_real_" + DB_SUFFIX;
    private static final String DEMO_DB = "ms_notify_demo_" + DB_SUFFIX;
    private static final String SENDER_ID = "e2e-notify-sender";
    private static final String OUTSIDER_ID = "e2e-notify-outsider";
    private static final String CHAT_ID = "e2e-notify-chat";
    private static final Instant BASE_TIME = Instant.parse("2026-06-10T12:00:00Z");

    private static TransitionWalker.ReachedState<RunningMongodProcess> embeddedMongo;
    private static String mongoBaseUri;

    @LocalServerPort
    private int port;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private MongoTemplate mongoTemplate;
    @Autowired
    private ConfigProperties configProperties;
    @Autowired
    private RecordingFirebaseMessagingGateway firebaseGateway;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(5))
            .build();

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
    void seedNotificationBackend() {
        configProperties.setFirebaseEnabled(false);
        firebaseGateway.reset();
        withReal(() -> {
            clearE2eCollections();
            seedUsers();
            seedChat();
        });
    }

    @AfterEach
    void disableFirebaseWorker() {
        configProperties.setFirebaseEnabled(false);
    }

    @Test
    void chatNotificationGoesToRightRecipientsInOneFirebaseMulticast() {
        registerDevicesOverHttp();

        JsonNode postedMessage = postJson("/activities/chats/" + CHAT_ID + "/messages?userId=" + SENDER_ID,
                Map.of("text", "Backend notification e2e blast"));
        assertThat(postedMessage.path("senderId").asString()).isEqualTo(SENDER_ID);

        List<String> recipientIds = recipientUserIds();
        NotificationOutboxItem pending = awaitOutboxItem(NotificationOutboxItem.STATUS_PENDING);
        assertThat(pending.getNotificationType()).isEqualTo("chat-message");
        assertThat(pending.getEntityType()).isEqualTo("chat");
        assertThat(pending.getEntityId()).isEqualTo(CHAT_ID);
        assertThat(pending.getRecipientUserIds()).containsExactlyInAnyOrderElementsOf(recipientIds);
        assertThat(pending.getRecipientUserIds()).doesNotContain(SENDER_ID, OUTSIDER_ID);
        assertThat(pending.getDeliveryStrategy()).isEqualTo("multicast");
        assertThat(pending.getPayload()).containsEntry("chatId", CHAT_ID).containsEntry("senderId", SENDER_ID);

        configProperties.setFirebaseEnabled(true);

        await().atMost(Duration.ofSeconds(8)).pollInterval(Duration.ofMillis(150)).untilAsserted(() -> {
            NotificationOutboxItem sent = findNotification();
            assertThat(sent).isNotNull();
            assertThat(sent.getStatus()).isEqualTo(NotificationOutboxItem.STATUS_SENT);
            assertThat(sent.getTokenSuccessCount()).isEqualTo(50);
            assertThat(sent.getTokenFailureCount()).isZero();

            assertThat(firebaseGateway.multicastCalls()).hasSize(1);
            assertThat(firebaseGateway.directCallCount()).isZero();
            assertThat(firebaseGateway.topicCallCount()).isZero();
            assertThat(firebaseGateway.multicastTokens())
                    .containsExactlyInAnyOrderElementsOf(recipientIds.stream().map(this::tokenFor).toList());
            assertThat(firebaseGateway.multicastTokens())
                    .doesNotContain(tokenFor(SENDER_ID), tokenFor(OUTSIDER_ID));
        });
    }

    private NotificationOutboxItem awaitOutboxItem(String expectedStatus) {
        await().atMost(Duration.ofSeconds(5)).pollInterval(Duration.ofMillis(100)).untilAsserted(() -> {
            NotificationOutboxItem item = findNotification();
            assertThat(item).isNotNull();
            assertThat(item.getStatus()).isEqualTo(expectedStatus);
        });
        return findNotification();
    }

    private NotificationOutboxItem findNotification() {
        return fromReal(() -> mongoTemplate.findOne(
                Query.query(Criteria.where("entityId").is(CHAT_ID)
                        .and("notificationType").is("chat-message")),
                NotificationOutboxItem.class));
    }

    private void registerDevicesOverHttp() {
        List<String> allUsers = new ArrayList<>(recipientUserIds());
        allUsers.add(SENDER_ID);
        allUsers.add(OUTSIDER_ID);
        for (String userId : allUsers) {
            postOk("/activities/chats/devices?userId=" + userId, Map.of(
                    "userId", userId,
                    "deviceId", "device-" + userId,
                    "platform", "web",
                    "firebaseToken", tokenFor(userId),
                    "notificationsEnabled", true));
        }
    }

    private void clearE2eCollections() {
        mongoTemplate.remove(new Query(), Users.class);
        mongoTemplate.remove(new Query(), ActivityChat.class);
        mongoTemplate.remove(new Query(), NotificationOutboxItem.class);
    }

    private void seedUsers() {
        List<Users> users = new ArrayList<>();
        users.add(user(SENDER_ID, "Notify Sender"));
        users.add(user(OUTSIDER_ID, "Notify Outsider"));
        for (String recipientId : recipientUserIds()) {
            users.add(user(recipientId, "Notify Recipient " + recipientId.substring(recipientId.length() - 2)));
        }
        mongoTemplate.insert(users, Users.class);
    }

    private Users user(String userId, String name) {
        Users user = new Users();
        user.setMongoId(userId);
        user.setSyncKey("e2e-notification-user-" + userId + "-" + UUID.randomUUID());
        user.setId(userId);
        user.setEmail(userId + "@example.test");
        user.setName(name);
        user.setInitials("NR");
        user.setAge(29);
        user.setCity("Bratislava");
        user.setGender("woman");
        user.setStatus("A");
        user.setProfileStatus("public");
        user.setCompletion(100);
        user.setLocationCoordinates(new Users.LocationCoordinatesRecord(48.1486d, 17.1077d));
        user.setImages(List.of("https://example.test/avatar/" + userId + ".png"));
        user.setActivities(new Users.UserActivitiesRecord(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0));
        return user;
    }

    private void seedChat() {
        ActivityChat chat = new ActivityChat();
        chat.setMongoId(CHAT_ID + ":" + SENDER_ID);
        chat.setChatId(CHAT_ID);
        chat.setOwnerUserId(SENDER_ID);
        chat.setTitle("Notification E2E Crew");
        chat.setAvatar("/assets/logo/heart.webp");
        chat.setMemberIds(recipientUserIds());
        chat.setUnread(0);
        chat.setDateIso(BASE_TIME.toString());
        chat.setChannelType("group");
        mongoTemplate.insert(chat);
    }

    private JsonNode postJson(String path, Object body) {
        HttpResponse<String> response = post(path, body);
        return parse(response.body());
    }

    private void postOk(String path, Object body) {
        post(path, body);
    }

    private HttpResponse<String> post(String path, Object body) {
        String json = writeJson(body);
        HttpResponse<String> response = send(HttpRequest.newBuilder(uri(path))
                .header("Accept", "application/json")
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(json))
                .build());
        assertOk(path, response.statusCode(), response.body());
        return response;
    }

    private URI uri(String path) {
        return URI.create("http://localhost:" + port + path);
    }

    private HttpResponse<String> send(HttpRequest request) {
        try {
            return httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        } catch (Exception exception) {
            throw new AssertionError("HTTP request failed: " + request.uri(), exception);
        }
    }

    private void assertOk(String path, int status, String body) {
        assertThat(status >= 200 && status < 300)
                .as(path + " returned " + status + " body=" + body)
                .isTrue();
    }

    private String writeJson(Object value) {
        try {
            return objectMapper.writeValueAsString(value == null ? Map.of() : value);
        } catch (Exception exception) {
            throw new AssertionError("Unable to serialize request body: " + value, exception);
        }
    }

    private JsonNode parse(String body) {
        try {
            String json = body == null || body.isBlank() ? "{}" : body;
            return objectMapper.readTree(json);
        } catch (Exception exception) {
            throw new AssertionError("Unable to parse HTTP response body: " + body, exception);
        }
    }

    private List<String> recipientUserIds() {
        List<String> ids = new ArrayList<>();
        for (int index = 1; index <= 50; index += 1) {
            ids.add("e2e-notify-u" + String.format("%02d", index));
        }
        return ids;
    }

    private String tokenFor(String userId) {
        return "token-" + userId;
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
            Document jobs = new Document("workerPollDelayMs", 60000)
                    .append("batchSize", 50)
                    .append("leaseDurationSeconds", 5)
                    .append("eventSchedulerPollDelayMs", 60000)
                    .append("autoInviterCadenceMs", 60000)
                    .append("notificationOutboxPollDelayMs", 1000)
                    .append("accountPurgeWindowDays", 30);
            Document notifications = new Document("firebaseWindowStartHour", 0)
                    .append("firebaseWindowEndHour", 24)
                    .append("maxWorkers", 1)
                    .append("maxRetries", 2)
                    .append("initialBackoffSeconds", 1)
                    .append("collapseWindowSeconds", 300)
                    .append("multicastThreshold", 3)
                    .append("topicThreshold", 250);
            Document document = new Document("_id", "affinity-config-e2e-notification")
                    .append("key", "default")
                    .append("active", true)
                    .append("version", 100)
                    .append("jobs", jobs)
                    .append("notifications", notifications)
                    .append("changedDate", BASE_TIME.toString())
                    .append("changedUser", "e2e")
                    .append("changedSection", "notification-e2e")
                    .append("changeSummary", "Fast notification worker cadence for e2e.");
            client.getDatabase(databaseName)
                    .getCollection("affinityConfigs")
                    .replaceOne(
                            Filters.eq("_id", "affinity-config-e2e-notification"),
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

        @Bean
        @Primary
        RecordingFirebaseMessagingGateway recordingFirebaseMessagingGateway() {
            return new RecordingFirebaseMessagingGateway();
        }
    }

    static class RecordingFirebaseMessagingGateway implements FirebaseMessagingGateway {
        private final CopyOnWriteArrayList<List<String>> multicastCalls = new CopyOnWriteArrayList<>();
        private final CopyOnWriteArrayList<List<String>> directCalls = new CopyOnWriteArrayList<>();
        private final AtomicInteger topicCalls = new AtomicInteger();

        @Override
        public void send(Message message) throws FirebaseMessagingException {
            topicCalls.incrementAndGet();
        }

        @Override
        public FirebaseMessagingGateway.FirebaseBatchSendResult sendAll(List<Message> messages, List<String> tokens)
                throws FirebaseMessagingException {
            List<String> copiedTokens = List.copyOf(tokens == null ? List.of() : tokens);
            directCalls.add(copiedTokens);
            return FirebaseMessagingGateway.FirebaseBatchSendResult.allSuccessful(copiedTokens.size());
        }

        @Override
        public FirebaseMessagingGateway.FirebaseBatchSendResult sendMulticast(MulticastMessage message, List<String> tokens)
                throws FirebaseMessagingException {
            List<String> copiedTokens = List.copyOf(tokens == null ? List.of() : tokens);
            multicastCalls.add(copiedTokens);
            return FirebaseMessagingGateway.FirebaseBatchSendResult.allSuccessful(copiedTokens.size());
        }

        void reset() {
            multicastCalls.clear();
            directCalls.clear();
            topicCalls.set(0);
        }

        List<List<String>> multicastCalls() {
            return List.copyOf(multicastCalls);
        }

        List<String> multicastTokens() {
            return multicastCalls.stream().flatMap(List::stream).toList();
        }

        int directCallCount() {
            return directCalls.size();
        }

        int topicCallCount() {
            return topicCalls.get();
        }
    }
}
