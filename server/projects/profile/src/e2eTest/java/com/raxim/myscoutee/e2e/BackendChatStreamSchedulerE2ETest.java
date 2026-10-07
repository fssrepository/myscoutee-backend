package com.raxim.myscoutee.e2e;

import static org.assertj.core.api.Assertions.assertThat;
import static org.awaitility.Awaitility.await;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.RETURNS_DEEP_STUBS;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

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
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicLong;
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
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.redis.connection.stream.MapRecord;
import org.springframework.data.redis.connection.stream.RecordId;
import org.springframework.data.redis.connection.stream.StreamReadOptions;
import org.springframework.data.redis.connection.stream.StreamRecords;
import org.springframework.data.redis.connection.stream.StreamOffset;
import org.springframework.data.redis.core.StreamOperations;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.ReplaceOptions;
import com.raxim.myscoutee.Main;
import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.domain.chat.document.Chat;
import com.raxim.myscoutee.domain.notifications.document.NotificationOutboxItem;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.chat.service.ChatStreamPublisher;
import com.raxim.myscoutee.domain.chat.service.ChatWebSocketSessionRegistry;
import com.raxim.myscoutee.common.redis.RedisStreamRetentionService;
import com.raxim.myscoutee.domain.chat.websocket.ChatHandshakeInterceptor;
import com.raxim.myscoutee.domain.chat.websocket.ChatWebSocketHandler;

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
        classes = {Main.class, BackendChatStreamSchedulerE2ETest.E2eInfrastructure.class},
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
        properties = {
                "config.firebase-enabled=false",
                "config.member-user=e2e-chat-stream-sender@example.test",
                "admin.stats.enabled=false",
                "assets.source-refresh.enabled=false",
                "media.enabled=false",
                "payment.enablePay=false",
                "events.scheduler.enabled=false",
                "events.scheduler.check-delay-ms=600000",
                "events.waitlist.inviter-check-delay-ms=600000",
                "scheduled-messages.task-poll-delay-ms=600000",
                "chat.stream.poll-delay-ms=100",
                "notifications.outbox.worker-check-delay-ms=600000",
                "notifications.outbox.wakeup-poll-delay-ms=600000",
                "email.promotions.scheduler-poll-delay-ms=600000",
                "email.promotions.delivery-delay-ms=600000",
                "affinity.recompute.worker-tick-ms=600000",
                "users.deleted-account-purge-delay-ms=600000",
                "spring.main.allow-bean-definition-overriding=true",
                "logging.level.org.springframework.data.mongodb.core.MongoTemplate=WARN"
        })
class BackendChatStreamSchedulerE2ETest {
    private static final String DB_SUFFIX = UUID.randomUUID().toString().replace("-", "");
    private static final String REAL_DB = "ms_chat_stream_real_" + DB_SUFFIX;
    private static final String DEMO_DB = "ms_chat_stream_demo_" + DB_SUFFIX;
    private static final String SENDER_ID = "e2e-chat-stream-sender";
    private static final String RECIPIENT_ID = "e2e-chat-stream-recipient";
    private static final String OUTSIDER_ID = "e2e-chat-stream-outsider";
    private static final String CHAT_ID = "e2e-chat-stream-main";
    private static final Instant BASE_TIME = Instant.parse("2026-07-12T12:00:00Z");

    private static TransitionWalker.ReachedState<RunningMongodProcess> embeddedMongo;
    private static String mongoBaseUri;

    @LocalServerPort
    private int port;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private MongoTemplate mongoTemplate;
    @Autowired
    private ChatWebSocketSessionRegistry sessionRegistry;
    @Autowired
    private ChatWebSocketHandler chatWebSocketHandler;
    @Autowired
    private InMemoryRedisStream redisStream;

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
        redisStream.clear();
        withReal(() -> {
            mongoTemplate.remove(new Query(), Users.class);
            mongoTemplate.remove(new Query(), Chat.class);
            mongoTemplate.remove(new Query(), NotificationOutboxItem.class);
            mongoTemplate.insert(List.of(
                    user(SENDER_ID, "Stream Sender"),
                    user(RECIPIENT_ID, "Stream Recipient"),
                    user(OUTSIDER_ID, "Stream Outsider")),
                    Users.class);
            seedChat();
        });
    }

    @Test
    void scheduledChatStreamConsumerBroadcastsHttpMessagesToRegisteredBackendSessions() throws Exception {
        CopyOnWriteArrayList<String> recipientMessages = new CopyOnWriteArrayList<>();
        CopyOnWriteArrayList<String> outsiderMessages = new CopyOnWriteArrayList<>();
        WebSocketSession recipientSession = session("recipient-session", recipientMessages);
        WebSocketSession outsiderSession = session("outsider-session", outsiderMessages);
        sessionRegistry.register(CHAT_ID, RECIPIENT_ID, recipientSession);
        sessionRegistry.register("another-chat", OUTSIDER_ID, outsiderSession);

        JsonNode posted = postJson("/activities/chats/" + CHAT_ID + "/messages?userId=" + SENDER_ID,
                Map.of("text", "Stream scheduler broadcast from HTTP"));
        String messageId = posted.path("id").asString();
        assertThat(messageId).isNotBlank();
        await().atMost(Duration.ofSeconds(5)).pollInterval(Duration.ofMillis(50)).untilAsserted(() ->
                assertThat(redisStream.size(ChatStreamPublisher.STREAM_KEY))
                        .isEqualTo(1));

        await().atMost(Duration.ofSeconds(5)).pollInterval(Duration.ofMillis(100)).untilAsserted(() -> {
            assertThat(recipientMessages).hasSize(1);
            JsonNode socketEvent = parse(recipientMessages.get(0));
            assertThat(socketEvent.path("type").asString()).isEqualTo("message");
            assertThat(socketEvent.path("chatId").asString()).isEqualTo(CHAT_ID);
            assertThat(socketEvent.path("message").path("id").asString()).isEqualTo(messageId);
            assertThat(socketEvent.path("message").path("senderId").asString()).isEqualTo(SENDER_ID);
            assertThat(socketEvent.path("message").path("mine").asBoolean()).isFalse();
        });
        assertThat(outsiderMessages).isEmpty();
    }

    @Test
    void scheduledChatStreamConsumerDeliversEachPublishedMessageOnce() throws Exception {
        CopyOnWriteArrayList<String> recipientMessages = new CopyOnWriteArrayList<>();
        WebSocketSession recipientSession = session("recipient-session", recipientMessages);
        sessionRegistry.register(CHAT_ID, RECIPIENT_ID, recipientSession);

        JsonNode firstPosted = postJson("/activities/chats/" + CHAT_ID + "/messages?userId=" + SENDER_ID,
                Map.of("text", "First Redis fanout frame"));
        JsonNode secondPosted = postJson("/activities/chats/" + CHAT_ID + "/messages?userId=" + SENDER_ID,
                Map.of("text", "Second Redis fanout frame"));
        String firstMessageId = firstPosted.path("id").asString();
        String secondMessageId = secondPosted.path("id").asString();
        assertThat(firstMessageId).isNotBlank();
        assertThat(secondMessageId).isNotBlank();

        await().atMost(Duration.ofSeconds(5)).pollInterval(Duration.ofMillis(100)).untilAsserted(() -> {
            assertThat(redisStream.deliveredCount(ChatStreamPublisher.STREAM_KEY))
                    .isEqualTo(2);
            assertThat(recipientMessages).hasSize(2);
        });

        assertThat(recipientMessages).extracting(message -> parse(message).path("message").path("id").asString())
                .containsExactly(firstMessageId, secondMessageId);
    }

    @Test
    void websocketMessageSendsMongoAckDirectlyAndUsesRedisForRoomFanout() throws Exception {
        CopyOnWriteArrayList<String> senderMessages = new CopyOnWriteArrayList<>();
        CopyOnWriteArrayList<String> recipientMessages = new CopyOnWriteArrayList<>();
        WebSocketSession senderSession = session("sender-session", senderMessages, Map.of(
                ChatHandshakeInterceptor.CHAT_ID_ATTRIBUTE, CHAT_ID,
                ChatHandshakeInterceptor.USER_ID_ATTRIBUTE, SENDER_ID));
        WebSocketSession recipientSession = session("recipient-session", recipientMessages, Map.of(
                ChatHandshakeInterceptor.CHAT_ID_ATTRIBUTE, CHAT_ID,
                ChatHandshakeInterceptor.USER_ID_ATTRIBUTE, RECIPIENT_ID));
        chatWebSocketHandler.afterConnectionEstablished(senderSession);
        chatWebSocketHandler.afterConnectionEstablished(recipientSession);

        String clientId = "e2e-direct-ack-client";
        chatWebSocketHandler.handleMessage(senderSession, new TextMessage(writeJson(Map.of(
                "type", "message",
                "clientId", clientId,
                "text", "Mongo ack is direct; room fanout is Redis"))));

        await().atMost(Duration.ofSeconds(5)).pollInterval(Duration.ofMillis(50)).untilAsserted(() -> {
            assertThat(senderMessages.stream().map(this::parse).map(node -> node.path("type").asString()))
                    .contains("ack", "message");
            assertThat(recipientMessages.stream().map(this::parse).map(node -> node.path("type").asString()))
                    .containsExactly("message");
        });

        JsonNode ack = senderMessages.stream()
                .map(this::parse)
                .filter(node -> "ack".equals(node.path("type").asString()))
                .findFirst()
                .orElseThrow();
        assertThat(ack.path("clientId").asString()).isEqualTo(clientId);
        assertThat(ack.path("message").path("clientId").asString()).isEqualTo(clientId);
        assertThat(recipientMessages).extracting(message -> parse(message).path("type").asString())
                .doesNotContain("ack");
    }

    private WebSocketSession session(String id, CopyOnWriteArrayList<String> messages) throws Exception {
        return session(id, messages, Map.of());
    }

    private WebSocketSession session(String id, CopyOnWriteArrayList<String> messages, Map<String, Object> attributes) throws Exception {
        WebSocketSession session = mock(WebSocketSession.class);
        when(session.getId()).thenReturn(id);
        when(session.isOpen()).thenReturn(true);
        when(session.getAttributes()).thenReturn(new LinkedHashMap<>(attributes));
        doAnswer(invocation -> {
            TextMessage message = invocation.getArgument(0);
            messages.add(message.getPayload());
            return null;
        }).when(session).sendMessage(any(TextMessage.class));
        return session;
    }

    private Users user(String userId, String name) {
        Users user = new Users();
        user.setMongoId(userId);
        user.setSyncKey("e2e-chat-stream-user-" + userId + "-" + UUID.randomUUID());
        user.setId(userId);
        user.setEmail(userId + "@example.test");
        user.setName(name);
        user.setInitials("CS");
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

    private void seedChat() {
        Chat chat = new Chat();
        chat.setMongoId(CHAT_ID + ":" + SENDER_ID);
        chat.setChatId(CHAT_ID);
        chat.setOwnerUserId(SENDER_ID);
        chat.setTitle("Chat Stream E2E");
        chat.setAvatar("/assets/logo/heart.webp");
        chat.setMemberIds(List.of(RECIPIENT_ID));
        chat.setUnread(0);
        chat.setDateIso(BASE_TIME.toString());
        chat.setChannelType("group");
        chat.setMessages(new ArrayList<>());
        mongoTemplate.save(chat);
    }

    private JsonNode postJson(String path, Object body) {
        String json = writeJson(body);
        HttpResponse<String> response = send(HttpRequest.newBuilder(uri(path))
                .header("Accept", "application/json")
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(json))
                .build());
        assertThat(response.statusCode() >= 200 && response.statusCode() < 300)
                .as(path + " returned " + response.statusCode() + " body=" + response.body())
                .isTrue();
        return parse(response.body());
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
            throw new AssertionError("Unable to parse JSON: " + body, exception);
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

    @SuppressWarnings("unused")
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
            Document document = new Document("_id", "country-hu-e2e-chat-stream")
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
        InMemoryRedisStream inMemoryRedisStream() {
            return new InMemoryRedisStream();
        }

        @Bean
        @Primary
        @SuppressWarnings("unchecked")
        StringRedisTemplate stringRedisTemplate(InMemoryRedisStream redisStream) {
            StringRedisTemplate template = mock(StringRedisTemplate.class, RETURNS_DEEP_STUBS);
            StreamOperations<String, Object, Object> streamOperations = mock(StreamOperations.class);
            when(template.opsForStream()).thenReturn(streamOperations);
            when(streamOperations.add(any(MapRecord.class))).thenAnswer(invocation -> redisStream.add(invocation.getArgument(0)));
            when(streamOperations.read(any(StreamReadOptions.class), any(StreamOffset[].class)))
                    .thenAnswer(invocation -> redisStream.read(List.of(
                            invocation.<StreamOffset<String>>getArgument(1))));
            return template;
        }

        @Bean
        @Primary
        RedisStreamRetentionService redisStreamRetentionService() {
            return new RedisStreamRetentionService() {
                @Override
                public void trimByAge(StringRedisTemplate stringRedisTemplate, String streamKey, Duration retention) {
                }

                @Override
                public void deleteRecords(StringRedisTemplate stringRedisTemplate, String streamKey, java.util.Collection<String> recordIds) {
                }
            };
        }
    }

    static class InMemoryRedisStream {
        private final Map<String, AtomicLong> sequenceByStream =
                new ConcurrentHashMap<>();
        private final Map<String, List<MapRecord<String, Object, Object>>>
                recordsByStream = new ConcurrentHashMap<>();
        private final Map<String, AtomicLong> deliveredThroughByStream =
                new ConcurrentHashMap<>();

        RecordId add(MapRecord<String, Object, Object> record) {
            String streamKey = record.getStream() == null
                    ? ChatStreamPublisher.STREAM_KEY
                    : record.getStream();
            long idValue = sequenceByStream
                    .computeIfAbsent(streamKey, ignored -> new AtomicLong())
                    .incrementAndGet();
            RecordId id = RecordId.of(idValue, 0);
            Map<Object, Object> value = new LinkedHashMap<>();
            value.putAll(record.getValue());
            recordsByStream
                    .computeIfAbsent(
                            streamKey,
                            ignored -> new CopyOnWriteArrayList<>())
                    .add(StreamRecords.<String, Object, Object>mapBacked(value)
                            .withStreamKey(streamKey)
                            .withId(id));
            return id;
        }

        List<MapRecord<String, Object, Object>> read(
                List<StreamOffset<String>> offsets) {
            if (offsets == null || offsets.isEmpty()) {
                return List.of();
            }
            List<MapRecord<String, Object, Object>> next = new ArrayList<>();
            for (StreamOffset<String> offset : offsets) {
                if (offset == null || offset.getKey() == null) {
                    continue;
                }
                String streamKey = offset.getKey();
                long delivered = numericOffset(streamKey, offset);
                List<MapRecord<String, Object, Object>> streamRecords =
                        recordsByStream.getOrDefault(streamKey, List.of());
                List<MapRecord<String, Object, Object>> unread =
                        streamRecords.stream()
                                .filter(record ->
                                        numericId(record.getId()) > delivered)
                                .toList();
                next.addAll(unread);
                unread.stream()
                        .map(MapRecord::getId)
                        .mapToLong(this::numericId)
                        .max()
                        .ifPresent(value -> deliveredThroughByStream
                                .computeIfAbsent(
                                        streamKey,
                                        ignored -> new AtomicLong())
                                .accumulateAndGet(value, Math::max));
            }
            return next;
        }

        int size(String streamKey) {
            return recordsByStream
                    .getOrDefault(streamKey, List.of())
                    .size();
        }

        long deliveredCount(String streamKey) {
            AtomicLong delivered = deliveredThroughByStream.get(streamKey);
            return delivered == null ? 0L : delivered.get();
        }

        void clear() {
            recordsByStream.clear();
            sequenceByStream.clear();
            deliveredThroughByStream.clear();
        }

        private long numericOffset(
                String streamKey,
                StreamOffset<String> offset) {
            if (offset.getOffset() == null
                    || offset.getOffset().getOffset() == null) {
                return 0L;
            }
            String value = offset.getOffset().getOffset();
            if ("$".equals(value)) {
                AtomicLong sequence = sequenceByStream.get(streamKey);
                return sequence == null ? 0L : sequence.get();
            }
            if (">".equals(value)) {
                AtomicLong delivered =
                        deliveredThroughByStream.get(streamKey);
                return delivered == null ? 0L : delivered.get();
            }
            try {
                return numericId(RecordId.of(value));
            } catch (IllegalArgumentException ignored) {
                return 0L;
            }
        }

        private long numericId(RecordId id) {
            if (id == null || id.getTimestamp() == null) {
                return 0L;
            }
            return id.getTimestamp();
        }
    }
}
