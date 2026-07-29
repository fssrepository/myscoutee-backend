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
import java.util.function.Supplier;

import org.bson.Document;
import org.junit.jupiter.api.AfterAll;
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

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.ReplaceOptions;
import com.raxim.myscoutee.Main;
import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.profile.data.document.Chat;
import com.raxim.myscoutee.profile.data.document.ChatMessage;
import com.raxim.myscoutee.profile.data.document.AffinityConfig;
import com.raxim.myscoutee.profile.data.document.AffinityRecomputeTask;
import com.raxim.myscoutee.profile.data.document.NotificationOutboxItem;
import com.raxim.myscoutee.profile.data.document.Users;

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
        classes = {Main.class, BackendAdminParamsRealtimeE2ETest.E2eInfrastructure.class},
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
        properties = {
                "config.firebase-enabled=false",
                "config.dev-user=",
                "admin.stats.enabled=false",
                "assets.source-refresh.enabled=false",
                "media.enabled=false",
                "payment.enablePay=false",
                "events.scheduler.enabled=false",
                "events.scheduler.check-delay-ms=600000",
                "events.waitlist.inviter-check-delay-ms=600000",
                "scheduled-messages.task-poll-delay-ms=600000",
                "chat.stream.poll-delay-ms=600000",
                "notifications.outbox.worker-check-delay-ms=600000",
                "notifications.outbox.wakeup-poll-delay-ms=600000",
                "email.promotions.scheduler-poll-delay-ms=600000",
                "email.promotions.delivery-delay-ms=600000",
                "affinity.recompute.worker-tick-ms=600000",
                "users.deleted-account-purge-delay-ms=600000",
                "spring.main.allow-bean-definition-overriding=true",
                "logging.level.org.springframework.data.mongodb.core.MongoTemplate=WARN"
        })
class BackendAdminParamsRealtimeE2ETest {
    private static final String DB_SUFFIX = UUID.randomUUID().toString().replace("-", "");
    private static final String REAL_DB = "ms_admin_params_realtime_real_" + DB_SUFFIX;
    private static final String DEMO_DB = "ms_admin_params_realtime_demo_" + DB_SUFFIX;
    private static final String ADMIN_ID = userId(1);
    private static final String SENDER_ID = userId(2);
    private static final String RECIPIENT_ID = userId(3);
    private static final String HIGH_THRESHOLD_CHAT_ID = "e2e-admin-params-direct-chat";
    private static final String LOW_THRESHOLD_CHAT_ID = "e2e-admin-params-multicast-chat";
    private static final String REALTIME_CHAT_ID = "e2e-admin-params-realtime-chat";
    private static final Instant BASE_TIME = Instant.parse("2026-07-10T12:00:00Z");

    private static TransitionWalker.ReachedState<RunningMongodProcess> embeddedMongo;
    private static String mongoBaseUri;

    @LocalServerPort
    private int port;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private MongoTemplate mongoTemplate;

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
    void seedBackend() {
        withReal(() -> {
            clearE2eCollections();
            seedPlatformConfig();
            seedUsers();
            seedChat(HIGH_THRESHOLD_CHAT_ID, notificationRecipients());
            seedChat(LOW_THRESHOLD_CHAT_ID, notificationRecipients());
            seedChat(REALTIME_CHAT_ID, List.of(RECIPIENT_ID));
        });
    }

    @Test
    void adminNotificationParamsDriveOutboxGroupingAndRecomputeTasksThroughHttp() {
        JsonNode initialState = getJson("/admin/params?adminUserId=" + ADMIN_ID);
        assertThat(paramNumber(initialState, "notifications", "notifications.multicastThreshold")).isEqualTo(3d);

        JsonNode raisedState = postJson("/admin/params", saveThresholdPayload(10, "Raise multicast threshold for e2e."));
        assertThat(paramNumber(raisedState, "notifications", "notifications.multicastThreshold")).isEqualTo(10d);
        assertThat(activeConfig().getVersion()).isEqualTo(2);
        assertThat(activeConfig().getNotifications().getMulticastThreshold()).isEqualTo(10);

        AffinityRecomputeTask configTask = configRecomputeTask();
        assertThat(configTask.getTargetType()).isEqualTo(AffinityRecomputeTaskServiceConstants.CONFIG);
        assertThat(configTask.getTargetId()).isEqualTo("default");
        assertThat(configTask.getReasons()).contains(AffinityRecomputeTaskServiceConstants.CONFIG_CHANGED);
        assertThat(configTask.getUpdatedUser()).isEqualTo(ADMIN_ID);

        NotificationOutboxItem adminNotice = findAdminParamNotice(2);
        assertThat(adminNotice.getRecipientUserIds()).containsExactly(ADMIN_ID);
        assertThat(adminNotice.getPayload()).containsEntry("sectionKey", "notifications")
                .containsEntry("version", "2")
                .containsEntry("recomputeScope", "config");

        postJson("/activities/chats/" + HIGH_THRESHOLD_CHAT_ID + "/messages?userId=" + SENDER_ID,
                Map.of("text", "High threshold should keep this direct"));
        NotificationOutboxItem directChatNotification = findChatNotification(HIGH_THRESHOLD_CHAT_ID);
        assertThat(directChatNotification.getRecipientUserIds())
                .containsExactlyInAnyOrderElementsOf(notificationRecipients());
        assertThat(directChatNotification.getDeliveryStrategy()).isEqualTo("direct");

        JsonNode revertedState = postJson("/admin/params/notifications/revert",
                Map.of("adminUserId", ADMIN_ID, "version", 1));
        assertThat(paramNumber(revertedState, "notifications", "notifications.multicastThreshold")).isEqualTo(3d);
        assertThat(activeConfig().getVersion()).isEqualTo(3);
        assertThat(activeConfig().getNotifications().getMulticastThreshold()).isEqualTo(3);

        JsonNode history = getJson("/admin/params/notifications/history");
        assertThat(historyVersions(history)).containsExactly(3, 2, 1);
        assertThat(history.path("versions").path(0).path("active").asBoolean()).isTrue();

        postJson("/activities/chats/" + LOW_THRESHOLD_CHAT_ID + "/messages?userId=" + SENDER_ID,
                Map.of("text", "Default threshold should group this multicast"));
        NotificationOutboxItem multicastChatNotification = findChatNotification(LOW_THRESHOLD_CHAT_ID);
        assertThat(multicastChatNotification.getRecipientUserIds())
                .containsExactlyInAnyOrderElementsOf(notificationRecipients());
        assertThat(multicastChatNotification.getDeliveryStrategy()).isEqualTo("multicast");
    }

    @Test
    void chatMessageRetrievalPublishesStructuredRealtimeCountersAndReadReceiptThroughHttp() {
        JsonNode initial = postJson("/auth/me/realtime/long-poll", Map.of("userId", RECIPIENT_ID, "cursor", ""));
        String initialCursor = initial.path("cursor").asString();
        assertThat(initial.path("userId").asString()).isEqualTo(RECIPIENT_ID);
        assertThat(initial.path("counters").path("chats").asInt()).isZero();
        assertThat(initial.path("counters").path("chat").path("all").asInt()).isZero();
        assertThat(initialCursor).isNotBlank();

        JsonNode posted = postJson("/activities/chats/" + REALTIME_CHAT_ID + "/messages?userId=" + SENDER_ID,
                Map.of("text", "Realtime counter should rise"));
        String messageId = posted.path("id").asString();
        assertThat(messageId).isNotBlank();

        JsonNode afterMessage = postJson("/auth/me/realtime/long-poll",
                Map.of("userId", RECIPIENT_ID, "cursor", initialCursor));
        assertThat(afterMessage.path("counters").path("chats").asInt()).isEqualTo(1);
        assertThat(afterMessage.path("counters").path("chat").path("all").asInt()).isEqualTo(1);
        String unreadCursor = afterMessage.path("cursor").asString();
        assertThat(unreadCursor).isNotEqualTo(initialCursor);
        assertThat(findChat(RECIPIENT_ID, REALTIME_CHAT_ID).getUnread()).isEqualTo(1);

        JsonNode messages = getJson("/activities/chats/" + REALTIME_CHAT_ID + "/messages?userId=" + RECIPIENT_ID);
        assertThat(messages.path("items")).hasSize(1);
        assertThat(messages.path("read").path("userId").asString()).isEqualTo(RECIPIENT_ID);
        assertThat(messages.path("read").path("messageIds")).hasSize(1);
        assertThat(messages.path("read").path("messageIds").get(0).asString()).isEqualTo(messageId);
        assertThat(messages.path("read").path("unread").asInt()).isZero();
        assertThat(findChat(RECIPIENT_ID, REALTIME_CHAT_ID).getUnread()).isZero();

        JsonNode afterRead = postJson("/auth/me/realtime/long-poll",
                Map.of("userId", RECIPIENT_ID, "cursor", unreadCursor));
        assertThat(afterRead.path("counters").path("chats").asInt()).isZero();
        assertThat(afterRead.path("counters").path("chat").path("all").asInt()).isZero();
        assertThat(afterRead.path("counters").path("notifications").asInt()).isEqualTo(1);
        assertThat(afterRead.path("cursor").asString()).isNotEqualTo(unreadCursor);
    }

    private void clearE2eCollections() {
        mongoTemplate.remove(new Query(), Users.class);
        mongoTemplate.remove(new Query(), Chat.class);
        mongoTemplate.remove(new Query(), ChatMessage.class);
        mongoTemplate.remove(new Query(), AffinityConfig.class);
        mongoTemplate.remove(new Query(), AffinityRecomputeTask.class);
        mongoTemplate.remove(new Query(), NotificationOutboxItem.class);
    }

    private void seedPlatformConfig() {
        AffinityConfig config = AffinityConfig.defaults();
        config.setId("affinity-config-e2e-admin-params");
        config.setKey("default");
        config.setActive(true);
        config.setVersion(1);
        config.setChangedDate(BASE_TIME.toString());
        config.setChangedUser("e2e");
        config.setChangedSection("seed");
        config.setChangeSummary("Initial parameter seed.");
        config.getNotifications().setFirebaseWindowStartHour(0);
        config.getNotifications().setFirebaseWindowEndHour(24);
        config.getNotifications().setMulticastThreshold(3);
        config.getNotifications().setTopicThreshold(250);
        config.getJobs().setConfigChangedDebounceSeconds(0);
        mongoTemplate.save(config);
    }

    private void seedUsers() {
        List<Users> users = new ArrayList<>();
        for (int index = 1; index <= 50; index += 1) {
            String id = userId(index);
            Users user = user(id, "Admin Params User " + String.format("%02d", index));
            if (ADMIN_ID.equals(id)) {
                user.setEmail("e2e-admin-params-admin@example.test");
                user.setHostTier("Admin");
                user.setStatusText("Admin workspace");
            }
            users.add(user);
        }
        mongoTemplate.insert(users, Users.class);
    }

    private Users user(String userId, String name) {
        Users user = new Users();
        user.setMongoId(userId);
        user.setSyncKey("e2e-admin-params-user-" + userId + "-" + UUID.randomUUID());
        user.setId(userId);
        user.setEmail(userId + "@example.test");
        user.setName(name);
        user.setInitials("AP");
        user.setAge(29);
        user.setCity("Bratislava");
        user.setGender("woman");
        user.setStatus("A");
        user.setProfileStatus("public");
        user.setCompletion(100);
        user.setLocationCoordinates(new Users.LocationCoordinatesRecord(48.1486d, 17.1077d));
        user.setImages(List.of("https://example.test/avatar/" + userId + ".png"));
        user.setActivities(new Users.UserActivitiesRecord(
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                new Users.UserChatCountersRecord(0, 0, 0, 0, 0, 0),
                new Users.UserEventCountersRecord(0, 0, 0, 0, 0, 0, 0),
                new Users.UserAssetCountersRecord(0, 0, 0, 0),
                new Users.UserEventFeedbackCountersRecord(0, 0, 0, 0),
                0, 0));
        return user;
    }

    private void seedChat(String chatId, List<String> memberIds) {
        Chat chat = new Chat();
        chat.setMongoId(chatId + ":" + SENDER_ID);
        chat.setChatId(chatId);
        chat.setOwnerUserId(SENDER_ID);
        chat.setTitle("Admin Params E2E " + chatId);
        chat.setAvatar("/assets/logo/heart.webp");
        chat.setMemberIds(memberIds);
        chat.setUnread(0);
        chat.setDateIso(BASE_TIME.toString());
        chat.setChannelType("group");
        chat.setMessages(new ArrayList<>());
        mongoTemplate.save(chat);
    }

    private Map<String, Object> saveThresholdPayload(int threshold, String summary) {
        return Map.of(
                "adminUserId", ADMIN_ID,
                "sectionKey", "notifications",
                "summary", summary,
                "fields", List.of(Map.of(
                        "key", "notifications.multicastThreshold",
                        "label", "Multicast threshold",
                        "group", "Delivery",
                        "valueType", "number",
                        "numberValue", threshold,
                        "unit", "")));
    }

    private double paramNumber(JsonNode state, String sectionKey, String fieldKey) {
        for (JsonNode section : state.path("sections")) {
            if (!sectionKey.equals(section.path("key").asString())) {
                continue;
            }
            for (JsonNode field : section.path("fields")) {
                if (fieldKey.equals(field.path("key").asString())) {
                    return field.path("numberValue").asDouble();
                }
            }
        }
        throw new AssertionError("Missing param field " + sectionKey + "/" + fieldKey + " in " + state);
    }

    private List<Integer> historyVersions(JsonNode history) {
        List<Integer> versions = new ArrayList<>();
        for (JsonNode version : history.path("versions")) {
            versions.add(version.path("version").asInt());
        }
        return versions;
    }

    private AffinityConfig activeConfig() {
        AffinityConfig config = fromReal(() -> mongoTemplate.findOne(
                Query.query(Criteria.where("active").is(true)),
                AffinityConfig.class));
        assertThat(config).isNotNull();
        return config;
    }

    private AffinityRecomputeTask configRecomputeTask() {
        await().atMost(Duration.ofSeconds(5)).pollInterval(Duration.ofMillis(100)).untilAsserted(() ->
                assertThat(fromReal(() -> mongoTemplate.findOne(
                        Query.query(Criteria.where("taskKey").is("CONFIG:default")),
                        AffinityRecomputeTask.class))).isNotNull());
        return fromReal(() -> mongoTemplate.findOne(
                Query.query(Criteria.where("taskKey").is("CONFIG:default")),
                AffinityRecomputeTask.class));
    }

    private NotificationOutboxItem findAdminParamNotice(int version) {
        NotificationOutboxItem item = fromReal(() -> mongoTemplate.findOne(
                Query.query(Criteria.where("notificationType").is("admin-params-changed")
                        .and("payload.version").is(String.valueOf(version))),
                NotificationOutboxItem.class));
        assertThat(item).as("admin param notice v%s", version).isNotNull();
        return item;
    }

    private NotificationOutboxItem findChatNotification(String chatId) {
        NotificationOutboxItem item = fromReal(() -> mongoTemplate.findOne(
                Query.query(Criteria.where("entityId").is(chatId)
                        .and("notificationType").is("chat-message")),
                NotificationOutboxItem.class));
        assertThat(item).as("chat notification %s", chatId).isNotNull();
        return item;
    }

    private Chat findChat(String ownerUserId, String chatId) {
        Chat chat = fromReal(() -> mongoTemplate.findOne(
                Query.query(Criteria.where("ownerUserId").is(ownerUserId)
                        .and("id").is(chatId)),
                Chat.class));
        assertThat(chat).as("chat %s/%s", ownerUserId, chatId).isNotNull();
        return chat;
    }

    private JsonNode getJson(String path) {
        HttpResponse<String> response = send(HttpRequest.newBuilder(uri(path))
                .header("Accept", "application/json")
                .GET()
                .build());
        assertOk(path, response.statusCode(), response.body());
        return parse(response.body());
    }

    private JsonNode postJson(String path, Object body) {
        HttpResponse<String> response = post(path, body);
        return parse(response.body());
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

    private static List<String> notificationRecipients() {
        return List.of(userId(3), userId(4), userId(5), userId(6));
    }

    private static String userId(int index) {
        return "e2e-admin-params-u" + String.format("%02d", index);
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
            Document document = new Document("_id", "country-hu-e2e-admin-params")
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

    @TestConfiguration(proxyBeanMethods = false)
    static class E2eInfrastructure {
        @Bean
        @Primary
        StringRedisTemplate stringRedisTemplate() {
            return mock(StringRedisTemplate.class, RETURNS_DEEP_STUBS);
        }
    }

    private static final class AffinityRecomputeTaskServiceConstants {
        static final String CONFIG = "CONFIG";
        static final String CONFIG_CHANGED = "AFFINITY_CONFIG_CHANGED";

        private AffinityRecomputeTaskServiceConstants() {
        }
    }
}
