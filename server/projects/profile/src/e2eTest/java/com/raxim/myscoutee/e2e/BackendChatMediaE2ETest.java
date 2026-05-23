package com.raxim.myscoutee.e2e;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.RETURNS_DEEP_STUBS;
import static org.mockito.Mockito.mock;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
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
import com.raxim.myscoutee.profile.data.document.ActivityChat;
import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.AffinityRecomputeTask;
import com.raxim.myscoutee.profile.data.document.Asset;
import com.raxim.myscoutee.profile.data.document.NotificationOutboxItem;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.LocationCoordinatesDto;

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
        classes = {Main.class, BackendChatMediaE2ETest.E2eInfrastructure.class},
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
        properties = {
                "config.firebase-enabled=false",
                "config.dev-user=e2e-chat-u01@example.test",
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
class BackendChatMediaE2ETest {
    private static final String DB_SUFFIX = UUID.randomUUID().toString().replace("-", "");
    private static final String REAL_DB = "ms_chat_media_real_" + DB_SUFFIX;
    private static final String DEMO_DB = "ms_chat_media_demo_" + DB_SUFFIX;
    private static final String SENDER_ID = userId(1);
    private static final String READER_ID = userId(2);
    private static final String SECOND_RECIPIENT_ID = userId(3);
    private static final String REPORTER_ID = userId(4);
    private static final String ADMIN_ID = userId(50);
    private static final String CHAT_ID = "e2e-chat-media-main";
    private static final String SUPPORT_CHAT_ID = "c-support-admin-e2e-chat-media";
    private static final String EVENT_ID = "e2e-chat-shared-event";
    private static final String ASSET_ID = "e2e-chat-shared-car";
    private static final Instant BASE_TIME = Instant.parse("2026-06-20T12:00:00Z");

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
    void seedChatMediaBackend() {
        withReal(() -> {
            clearE2eCollections();
            seedUsers();
            seedChat();
            seedSupportCaseChat();
            seedSharedEvent();
            seedSharedAsset();
        });
    }

    @Test
    void chatMutationsNotificationsReadsAndSharedAttachmentLifecycleWorkThroughHttp() {
        JsonNode posted = postJson("/activities/chats/" + CHAT_ID + "/messages?userId=" + SENDER_ID, Map.of(
                "text", "Sharing backend-only plans with event and asset attachments",
                "attachments", initialAttachments()));
        String messageId = posted.path("id").asString();
        assertThat(messageId).isNotBlank();
        assertThat(posted.path("senderId").asString()).isEqualTo(SENDER_ID);
        assertAttachment(posted, EVENT_ID, "available", "");
        assertAttachment(posted, ASSET_ID, "available", "");

        NotificationOutboxItem notification = findOnlyChatNotification();
        assertThat(notification.getRecipientUserIds()).containsExactlyInAnyOrderElementsOf(chatRecipientIds());
        assertThat(notification.getRecipientUserIds()).doesNotContain(SENDER_ID);
        assertThat(notification.getDeliveryStrategy()).isEqualTo("multicast");
        assertThat(notification.getPayload()).containsEntry("chatId", CHAT_ID).containsEntry("senderId", SENDER_ID);

        JsonNode readerMessages = getJson("/activities/chats/" + CHAT_ID + "/messages?userId=" + READER_ID);
        JsonNode readerMessage = messageById(readerMessages, messageId);
        assertThat(ids(readerMessage.path("readBy"), "id")).contains(READER_ID);
        assertThat(findChat(READER_ID, CHAT_ID).getUnread()).isZero();

        JsonNode edited = postJson("/activities/chats/" + CHAT_ID + "/messages/" + messageId + "/edit?userId=" + SENDER_ID,
                Map.of("text", "Updated backend-only plan with stronger validation"));
        assertThat(edited.path("text").asString()).isEqualTo("Updated backend-only plan with stronger validation");
        assertThat(edited.path("editedAtIso").asString()).isNotBlank();

        JsonNode pinned = postJson("/activities/chats/" + CHAT_ID + "/messages/" + messageId + "/pin?userId=" + READER_ID,
                Map.of("pinned", true));
        assertThat(pinned.path("pinnedByUserId").asString()).isEqualTo(READER_ID);
        assertThat(pinned.path("pinnedAtIso").asString()).isNotBlank();

        JsonNode reacted = postJson("/activities/chats/" + CHAT_ID + "/messages/" + messageId + "/reaction?userId=" + READER_ID,
                Map.of("emoji", ":thumbsup:"));
        assertThat(reactionEmojis(reacted)).containsExactly(":thumbsup:");

        JsonNode updatedAttachments = postJson("/activities/chats/" + CHAT_ID + "/messages/" + messageId + "/attachments?userId=" + SENDER_ID,
                Map.of("attachments", updatedAttachments()));
        assertAttachment(updatedAttachments, EVENT_ID, "available", "");
        assertAttachment(updatedAttachments, ASSET_ID, "available", "");
        assertThat(attachmentByEntity(updatedAttachments, ASSET_ID).path("title").asString()).isEqualTo("Updated shared team car");

        postOk("/activities/events/trash", Map.of(
                "userId", SENDER_ID,
                "type", "hosting",
                "sourceId", EVENT_ID));
        JsonNode afterEventTrash = messageById(
                getJson("/activities/chats/" + CHAT_ID + "/messages?userId=" + SENDER_ID),
                messageId);
        assertAttachment(afterEventTrash, EVENT_ID, "unavailable", "trashed");
        assertAttachment(afterEventTrash, ASSET_ID, "available", "");

        postOk("/activities/events/restore", Map.of(
                "userId", SENDER_ID,
                "type", "hosting",
                "sourceId", EVENT_ID));
        JsonNode afterEventRestore = messageById(
                getJson("/activities/chats/" + CHAT_ID + "/messages?userId=" + SENDER_ID),
                messageId);
        assertAttachment(afterEventRestore, EVENT_ID, "available", "");

        postOk("/assets/delete", Map.of(
                "userId", SENDER_ID,
                "assetId", ASSET_ID));
        JsonNode afterAssetDelete = messageById(
                getJson("/activities/chats/" + CHAT_ID + "/messages?userId=" + SENDER_ID),
                messageId);
        assertAttachment(afterAssetDelete, ASSET_ID, "unavailable", "trashed");

        JsonNode restoredAsset = postJson("/assets/restore", Map.of(
                "userId", SENDER_ID,
                "assetId", ASSET_ID));
        assertThat(restoredAsset.path("status").asString()).isEqualTo("A");
        JsonNode afterAssetRestore = messageById(
                getJson("/activities/chats/" + CHAT_ID + "/messages?userId=" + SENDER_ID),
                messageId);
        assertAttachment(afterAssetRestore, ASSET_ID, "available", "");

        JsonNode deleted = postJson("/activities/chats/" + CHAT_ID + "/messages/" + messageId + "/delete?userId=" + SENDER_ID, Map.of());
        assertThat(deleted.path("deletedAtIso").asString()).isNotBlank();
        assertThat(deleted.path("deletedByUserId").asString()).isEqualTo(SENDER_ID);
        assertThat(deleted.path("text").asString()).isBlank();
        assertThat(deleted.path("attachments")).isEmpty();
        assertThat(deleted.path("reactions")).isEmpty();
        assertThat(deleted.path("pinnedAtIso").asString()).isBlank();

        assertThat(findChatNotifications()).hasSize(1);
        assertThat(fromReal(() -> mongoTemplate.find(
                Query.query(Criteria.where("targetId").in(EVENT_ID, ASSET_ID)),
                AffinityRecomputeTask.class))).isNotEmpty();
    }

    @Test
    void supportCaseLifecycleIsAdminOnlyAndFilterableThroughHttp() {
        JsonNode pendingPage = getJson("/activities/chats/page?userId=" + ADMIN_ID
                + "&contextFilter=service&adminServiceOnly=true&supportCaseFilter=pending&limit=20");
        assertThat(ids(pendingPage.path("items"), "id")).contains(SUPPORT_CHAT_ID);
        assertThat(pendingPage.path("total").asInt()).isGreaterThanOrEqualTo(1);

        postExpectStatus(
                "/activities/chats/" + SUPPORT_CHAT_ID + "/support-case?userId=" + READER_ID,
                Map.of("userId", READER_ID, "action", "pick"),
                403);

        JsonNode picked = postJson("/activities/chats/" + SUPPORT_CHAT_ID + "/support-case?userId=" + ADMIN_ID,
                Map.of("userId", ADMIN_ID, "action", "pick"));
        assertThat(picked.path("supportCaseStatus").asString()).isEqualTo("picked");
        assertThat(picked.path("supportCaseAssigneeUserId").asString()).isEqualTo(ADMIN_ID);
        assertThat(picked.path("supportCaseAssigneeName").asString()).isEqualTo("Chat User 50");

        JsonNode pickedPage = getJson("/activities/chats/page?userId=" + ADMIN_ID
                + "&contextFilter=service&adminServiceOnly=true&supportCaseFilter=picked&limit=20");
        assertThat(ids(pickedPage.path("items"), "id")).contains(SUPPORT_CHAT_ID);

        JsonNode solved = postJson("/activities/chats/" + SUPPORT_CHAT_ID + "/support-case?userId=" + ADMIN_ID,
                Map.of("userId", ADMIN_ID, "action", "solve"));
        assertThat(solved.path("supportCaseStatus").asString()).isEqualTo("solved");
        assertThat(solved.path("supportCaseAssigneeUserId").asString()).isEqualTo(ADMIN_ID);

        JsonNode solvedPage = getJson("/activities/chats/page?userId=" + ADMIN_ID
                + "&contextFilter=service&adminServiceOnly=true&supportCaseFilter=solved&limit=20");
        assertThat(ids(solvedPage.path("items"), "id")).contains(SUPPORT_CHAT_ID);

        JsonNode reopened = postJson("/activities/chats/" + SUPPORT_CHAT_ID + "/support-case?userId=" + ADMIN_ID,
                Map.of("userId", ADMIN_ID, "action", "reopen"));
        assertThat(reopened.path("supportCaseStatus").asString()).isEqualTo("pending");
        assertThat(reopened.path("supportCaseAssigneeUserId").asString()).isBlank();
        assertThat(findChat(REPORTER_ID, SUPPORT_CHAT_ID).getSupportCaseStatus()).isEqualTo("pending");
    }

    private void clearE2eCollections() {
        mongoTemplate.remove(new Query(), Users.class);
        mongoTemplate.remove(new Query(), ActivityChat.class);
        mongoTemplate.remove(new Query(), ActivityEvent.class);
        mongoTemplate.remove(new Query(), Asset.class);
        mongoTemplate.remove(new Query(), NotificationOutboxItem.class);
        mongoTemplate.remove(new Query(), AffinityRecomputeTask.class);
    }

    private void seedUsers() {
        List<Users> users = new ArrayList<>();
        for (int index = 1; index <= 50; index += 1) {
            String id = userId(index);
            Users user = user(id, "Chat User " + String.format("%02d", index));
            if (ADMIN_ID.equals(id)) {
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
        user.setSyncKey("e2e-chat-user-" + userId + "-" + UUID.randomUUID());
        user.setId(userId);
        user.setEmail(userId + "@example.test");
        user.setName(name);
        user.setInitials("CU");
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
        chat.setTitle("Chat Media E2E Crew");
        chat.setAvatar("/assets/logo/heart.webp");
        chat.setMemberIds(chatRecipientIds());
        chat.setUnread(0);
        chat.setDateIso(BASE_TIME.toString());
        chat.setChannelType("mainEvent");
        chat.setEventId(EVENT_ID);
        chat.setMessages(new ArrayList<>());
        mongoTemplate.save(chat);
    }

    private void seedSupportCaseChat() {
        ActivityChat chat = new ActivityChat();
        chat.setMongoId(SUPPORT_CHAT_ID + ":" + REPORTER_ID);
        chat.setChatId(SUPPORT_CHAT_ID);
        chat.setOwnerUserId(REPORTER_ID);
        chat.setTitle("Support case from Chat User 04");
        chat.setAvatar("/assets/logo/heart.webp");
        chat.setMemberIds(List.of(REPORTER_ID));
        chat.setUnread(1);
        chat.setDateIso(BASE_TIME.plus(Duration.ofMinutes(2)).toString());
        chat.setChannelType("serviceEvent");
        chat.setLastMessage("I need moderation support.");
        chat.setLastSenderId(REPORTER_ID);
        chat.setSupportCaseStatus("pending");
        chat.setSupportCaseUpdatedAtIso(BASE_TIME.plus(Duration.ofMinutes(2)).toString());
        chat.setMessages(new ArrayList<>());
        mongoTemplate.save(chat);
    }

    private void seedSharedEvent() {
        mongoTemplate.save(eventDocument("hosting", "H"));
        mongoTemplate.save(eventDocument("events", "A"));
    }

    private ActivityEvent eventDocument(String type, String status) {
        ActivityEvent event = new ActivityEvent();
        event.setId(new ObjectId().toHexString());
        event.setSyncKey("e2e-chat-event-" + type + "-" + UUID.randomUUID());
        event.setSourceId(EVENT_ID);
        event.setOwnerUserId(SENDER_ID);
        event.setType(type);
        event.setStatus(status);
        event.setPublished(true);
        event.setIsTrashed(false);
        event.setIsHosting("hosting".equals(type));
        event.setIsAdmin(true);
        event.setAdmins(List.of(SENDER_ID));
        event.setAvatar("https://example.test/events/chat-media.png");
        event.setTitle("Shared Chat Event");
        event.setSubtitle("Attachment lifecycle target");
        event.setTimeframe("Sat 20 Jun, 12:00");
        event.setCreatorUserId(SENDER_ID);
        event.setCreatorName("Chat User 01");
        event.setCreatorInitials("CU");
        event.setCreatorGender("woman");
        event.setCreatorCity("Bratislava");
        event.setVisibility("Public");
        event.setBlindMode("Visible");
        event.setStartAtIso(BASE_TIME.plus(Duration.ofDays(3)).toString());
        event.setEndAtIso(BASE_TIME.plus(Duration.ofDays(3)).plus(Duration.ofHours(2)).toString());
        event.setLocation("Chat Media Arena");
        event.setLocationCoordinates(new LocationCoordinatesDto(48.1486d, 17.1077d));
        event.setCapacityMin(1);
        event.setCapacityMax(10);
        event.setCapacityTotal(10);
        event.setGenerated(false);
        event.setCreatedDate(BASE_TIME.toString());
        event.setCreatedUser(SENDER_ID);
        event.setUpdatedDate(BASE_TIME.toString());
        event.setUpdatedUser(SENDER_ID);
        return event;
    }

    private void seedSharedAsset() {
        Asset asset = new Asset();
        asset.setId(new ObjectId().toHexString());
        asset.setSyncKey("e2e-chat-asset-" + UUID.randomUUID());
        asset.setAssetId(ASSET_ID);
        asset.setOwnerUserId(SENDER_ID);
        asset.setType("Car");
        asset.setTitle("Shared team car");
        asset.setSubtitle("Four seats");
        asset.setCategory("Transport");
        asset.setCity("Bratislava");
        asset.setCapacityTotal(4);
        asset.setQuantity(1);
        asset.setDetails("Asset attached to a chat message.");
        asset.setImageUrl("https://example.test/assets/chat-media-car.png");
        asset.setRoutes(List.of("Chat Media Arena"));
        asset.setVisibility("Public");
        asset.setStatus("A");
        asset.setCreatedDate(BASE_TIME.toString());
        asset.setCreatedUser(SENDER_ID);
        asset.setUpdatedDate(BASE_TIME.toString());
        asset.setUpdatedUser(SENDER_ID);
        mongoTemplate.save(asset);
    }

    private List<Map<String, Object>> initialAttachments() {
        List<Map<String, Object>> attachments = new ArrayList<>();
        attachments.add(eventAttachment("Shared Chat Event"));
        attachments.add(assetAttachment("Shared team car"));
        attachments.add(linkAttachment());
        return attachments;
    }

    private static List<String> chatRecipientIds() {
        List<String> ids = new ArrayList<>();
        for (int index = 2; index <= 50; index += 1) {
            ids.add(userId(index));
        }
        return ids;
    }

    private List<Map<String, Object>> updatedAttachments() {
        List<Map<String, Object>> attachments = new ArrayList<>();
        attachments.add(eventAttachment("Updated shared event"));
        attachments.add(assetAttachment("Updated shared team car"));
        return attachments;
    }

    private Map<String, Object> eventAttachment(String title) {
        Map<String, Object> attachment = new LinkedHashMap<>();
        attachment.put("id", "att-event");
        attachment.put("type", "event");
        attachment.put("title", title);
        attachment.put("entityId", EVENT_ID);
        attachment.put("ownerUserId", SENDER_ID);
        attachment.put("status", "available");
        attachment.put("subtitle", "Hosting");
        attachment.put("description", "Shared via backend e2e.");
        return attachment;
    }

    private Map<String, Object> assetAttachment(String title) {
        Map<String, Object> attachment = new LinkedHashMap<>();
        attachment.put("id", "att-asset");
        attachment.put("type", "asset");
        attachment.put("title", title);
        attachment.put("entityId", ASSET_ID);
        attachment.put("assetType", "Car");
        attachment.put("ownerUserId", SENDER_ID);
        attachment.put("status", "available");
        attachment.put("subtitle", "Transport");
        attachment.put("description", "Shared asset in a chat.");
        return attachment;
    }

    private Map<String, Object> linkAttachment() {
        Map<String, Object> attachment = new LinkedHashMap<>();
        attachment.put("id", "att-link");
        attachment.put("type", "link");
        attachment.put("title", "Backend contract");
        attachment.put("url", "https://example.test/backend-contract");
        attachment.put("previewUrl", "https://example.test/backend-contract-preview.png");
        attachment.put("status", "available");
        return attachment;
    }

    private ActivityChat findChat(String ownerUserId, String chatId) {
        ActivityChat chat = fromReal(() -> mongoTemplate.findOne(
                Query.query(Criteria.where("ownerUserId").is(ownerUserId)
                        .and("id").is(chatId)),
                ActivityChat.class));
        assertThat(chat).as("chat %s/%s", ownerUserId, chatId).isNotNull();
        return chat;
    }

    private NotificationOutboxItem findOnlyChatNotification() {
        List<NotificationOutboxItem> notifications = findChatNotifications();
        assertThat(notifications).hasSize(1);
        return notifications.get(0);
    }

    private List<NotificationOutboxItem> findChatNotifications() {
        return fromReal(() -> mongoTemplate.find(
                Query.query(Criteria.where("entityId").is(CHAT_ID)
                        .and("notificationType").is("chat-message")),
                NotificationOutboxItem.class));
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

    private void postOk(String path, Object body) {
        post(path, body);
    }

    private void postExpectStatus(String path, Object body, int expectedStatus) {
        HttpResponse<String> response = postWithoutStatus(path, body);
        assertThat(response.statusCode())
                .as(path + " body=" + response.body())
                .isEqualTo(expectedStatus);
    }

    private HttpResponse<String> post(String path, Object body) {
        HttpResponse<String> response = postWithoutStatus(path, body);
        assertOk(path, response.statusCode(), response.body());
        return response;
    }

    private HttpResponse<String> postWithoutStatus(String path, Object body) {
        String json = writeJson(body);
        return send(HttpRequest.newBuilder(uri(path))
                .header("Accept", "application/json")
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(json))
                .build());
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

    private JsonNode messageById(JsonNode messages, String messageId) {
        for (JsonNode message : messages) {
            if (messageId.equals(message.path("id").asString())) {
                return message;
            }
        }
        throw new AssertionError("Missing chat message " + messageId + " in " + messages);
    }

    private void assertAttachment(JsonNode message, String entityId, String expectedStatus, String expectedReason) {
        JsonNode attachment = attachmentByEntity(message, entityId);
        assertThat(attachment).as("attachment %s in %s", entityId, message).isNotNull();
        assertThat(attachment.path("status").asString()).isEqualTo(expectedStatus);
        assertThat(attachment.path("unavailableReason").asString()).isEqualTo(expectedReason);
    }

    private JsonNode attachmentByEntity(JsonNode message, String entityId) {
        for (JsonNode attachment : message.path("attachments")) {
            if (entityId.equals(attachment.path("entityId").asString())) {
                return attachment;
            }
        }
        return null;
    }

    private List<String> reactionEmojis(JsonNode message) {
        List<String> values = new ArrayList<>();
        for (JsonNode reaction : message.path("reactions")) {
            values.add(reaction.path("emoji").asString());
        }
        return values;
    }

    private List<String> ids(JsonNode array, String fieldName) {
        List<String> values = new ArrayList<>();
        for (JsonNode item : array) {
            values.add(item.path(fieldName).asString());
        }
        return values;
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

    private static String userId(int index) {
        return "e2e-chat-u" + String.format("%02d", index);
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
            Document document = new Document("_id", "country-hu-e2e-chat-media")
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
                    .append("notificationOutboxPollDelayMs", 60000)
                    .append("accountPurgeWindowDays", 30);
            Document notifications = new Document("firebaseWindowStartHour", 0)
                    .append("firebaseWindowEndHour", 24)
                    .append("maxWorkers", 1)
                    .append("maxRetries", 2)
                    .append("initialBackoffSeconds", 1)
                    .append("collapseWindowSeconds", 300)
                    .append("multicastThreshold", 3)
                    .append("topicThreshold", 250);
            Document document = new Document("_id", "affinity-config-e2e-chat-media")
                    .append("key", "default")
                    .append("active", true)
                    .append("version", 100)
                    .append("jobs", jobs)
                    .append("notifications", notifications)
                    .append("changedDate", BASE_TIME.toString())
                    .append("changedUser", "e2e")
                    .append("changedSection", "chat-media-e2e")
                    .append("changeSummary", "Chat/media e2e platform parameters.");
            client.getDatabase(databaseName)
                    .getCollection("affinityConfigs")
                    .replaceOne(
                            Filters.eq("_id", "affinity-config-e2e-chat-media"),
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
