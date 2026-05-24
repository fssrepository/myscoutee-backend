package com.raxim.myscoutee.e2e;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.RETURNS_DEEP_STUBS;
import static org.mockito.Mockito.mock;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

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
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

import com.raxim.myscoutee.Main;
import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.profile.data.document.ActivityChat;
import com.raxim.myscoutee.profile.data.document.ActivityChatMessage;
import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.ActivityMember;
import com.raxim.myscoutee.profile.data.document.Payment;
import com.raxim.myscoutee.profile.data.document.Users;

import de.flapdoodle.embed.mongo.commands.ServerAddress;
import de.flapdoodle.embed.mongo.distribution.Version;
import de.flapdoodle.embed.mongo.transitions.Mongod;
import de.flapdoodle.embed.mongo.transitions.RunningMongodProcess;
import de.flapdoodle.reverse.TransitionWalker;

@Tag("e2e")
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
@SpringBootTest(
        classes = {Main.class, BackendIndexesPerformanceE2ETest.E2eInfrastructure.class},
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
        properties = {
                "config.firebase-enabled=false",
                "config.dev-user=perf-u01@example.test",
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
class BackendIndexesPerformanceE2ETest {
    private static final String DB_SUFFIX = UUID.randomUUID().toString().replace("-", "");
    private static final String REAL_DB = "ms_indexes_perf_real_" + DB_SUFFIX;
    private static final String DEMO_DB = "ms_indexes_perf_demo_" + DB_SUFFIX;
    private static final Instant BASE_TIME = Instant.parse("2026-07-01T12:00:00Z");

    private static TransitionWalker.ReachedState<RunningMongodProcess> embeddedMongo;
    private static String mongoBaseUri;

    @LocalServerPort
    private int port;

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
    void seed() {
        MongoSessionMode previousMode = MongoSessionModeContext.currentMode();
        try {
            MongoSessionModeContext.set(MongoSessionMode.REAL);
            clearHotCollections();
            seedUsers();
            seedEventsAndMembers();
            seedChats();
        } finally {
            MongoSessionModeContext.set(previousMode);
        }
    }

    @Test
    void dockerChatIndexesAndSeedShapeExistAndBackendReadsStayWithinBudgetThroughHttp() {
        assertDockerChatIndexesAreDeclared();
        assertDevelopmentChatSeedIncludesParentSearchFields();
        assertChatParentSearchFieldsAreMaintained();

        assertFastGet("/activities/chats?userId=perf-u01", Duration.ofSeconds(3));
        assertFastGet("/activities/events?userId=perf-u01", Duration.ofSeconds(3));
        assertFastGet("/activities/events/attending?userId=perf-u01", Duration.ofSeconds(3));
    }

    private void assertDockerChatIndexesAreDeclared() {
        String dbInit = readRepoFile("../../docker/conf/mongodb/db_init.js");
        String mongoImport = readRepoFile("../../docker/conf/mongodb/mongo_import.sh");
        for (String indexName : chatIndexNames()) {
            assertThat(dbInit).contains(indexName);
            assertThat(mongoImport).contains(indexName);
        }
    }

    private void assertDevelopmentChatSeedIncludesParentSearchFields() {
        String seed = readRepoFile("../../docker/conf/mongodb/demo_db/chatMessages.json");
        assertThat(seed).contains(
                "\"messageSenderUserIds\"",
                "\"messageReadByUserIds\"",
                "\"messageReactionUserIds\"",
                "\"messageAttachmentKeys\"",
                "\"pollVoterUserIds\"");
    }

    private void assertChatParentSearchFieldsAreMaintained() {
        ActivityChatMessage message = mongoTemplate.findById("chat-message:perf-chat-1:perf-message-1", ActivityChatMessage.class);
        assertThat(message).isNotNull();
        assertThat(message.getMessageSenderUserIds()).contains("perf-u02");
        assertThat(message.getMessageReadByUserIds()).contains("perf-u03");
        assertThat(message.getMessageReactionUserIds()).contains("perf-u04");
        assertThat(message.getMessageAttachmentKeys()).contains(ActivityChatMessage.messageAttachmentKey("event", "perf-event-1"));
        assertThat(message.getPollVoterUserIds()).contains("perf-u05");
    }

    private List<String> chatIndexNames() {
        return List.of(
                "chat_owner_public_id",
                "chat_public_id_lookup",
                "chat_owner_date",
                "chat_member_date",
                "chat_channel_date",
                "chat_message_sender_date",
                "chat_message_reader_date",
                "chat_message_reaction_date",
                "chat_message_attachment_date",
                "chat_poll_voter_date");
    }

    private String readRepoFile(String relativePath) {
        try {
            return Files.readString(Path.of(relativePath));
        } catch (Exception exception) {
            throw new AssertionError("Could not read " + relativePath, exception);
        }
    }

    private HttpResponse<String> assertFastGet(String path, Duration maxDuration) {
        long startedAt = System.nanoTime();
        HttpResponse<String> response = get(path);
        Duration duration = Duration.ofNanos(System.nanoTime() - startedAt);
        assertThat(response.statusCode())
                .as(path + " response body=" + response.body())
                .isBetween(200, 299);
        assertThat(duration)
                .as(path + " should stay within backend e2e performance budget")
                .isLessThan(maxDuration);
        return response;
    }

    private HttpResponse<String> get(String path) {
        return send(HttpRequest.newBuilder(uri(path))
                .header("Accept", "application/json")
                .GET()
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

    private void clearHotCollections() {
        mongoTemplate.remove(new Query(), Payment.class);
        mongoTemplate.remove(new Query(), ActivityChat.class);
        mongoTemplate.remove(new Query(), ActivityMember.class);
        mongoTemplate.remove(new Query(), ActivityEvent.class);
        mongoTemplate.remove(new Query(), Users.class);
    }

    private void seedUsers() {
        for (int index = 1; index <= 50; index++) {
            Users user = new Users();
            user.setId(userId(index));
            user.setEmail(userId(index) + "@example.test");
            user.setName("Performance User " + index);
            user.setInitials("PU" + index);
            user.setAffinity(Double.valueOf(60 + (index % 30)));
            user.setProfileStatus(index % 17 == 0 ? "deleted" : "active");
            user.setHostTier(index % 10 == 0 ? "Admin" : "Member");
            if ("deleted".equals(user.getProfileStatus())) {
                user.setDeletedAtIso(BASE_TIME.minus(Duration.ofDays(index)).toString());
            }
            mongoTemplate.save(user);
        }
    }

    private void seedEventsAndMembers() {
        List<ActivityEvent> events = new ArrayList<>();
        List<ActivityMember> members = new ArrayList<>();
        for (int index = 1; index <= 80; index++) {
            String ownerUserId = userId((index % 50) + 1);
            String sourceId = "perf-event-" + index;

            ActivityEvent event = new ActivityEvent();
            event.setSourceId(sourceId);
            event.setOwnerUserId(ownerUserId);
            event.setCreatorUserId(ownerUserId);
            event.setAdmins(List.of(ownerUserId));
            event.setType(index % 4 == 0 ? "hosting" : "events");
            event.setStatus("A");
            event.setPublished(true);
            event.setGenerated(false);
            event.setVisibility("public");
            event.setTitle("Performance Event " + index);
            event.setSubtitle("Seeded backend e2e event");
            event.setStartAtIso(BASE_TIME.plus(Duration.ofHours(index)).toString());
            event.setEndAtIso(BASE_TIME.plus(Duration.ofHours(index + 2L)).toString());
            event.setAutoInviter(index % 5 == 0);
            event.setCapacityTotal(200);
            event.setAcceptedMembers(20);
            events.add(event);

            ActivityMember member = new ActivityMember();
            member.setOwnerType("event");
            member.setOwnerId(sourceId);
            member.setUserId("perf-u01");
            member.setStatus("accepted");
            member.setRole("member");
            member.setRequestKind("join");
            member.setActionAtIso(BASE_TIME.minus(Duration.ofMinutes(index)).toString());
            members.add(member);
        }
        events.forEach(mongoTemplate::save);
        members.forEach(mongoTemplate::save);
    }

    private void seedChats() {
        for (int index = 1; index <= 80; index++) {
            String chatId = "perf-chat-" + index;
            ActivityChat chat = new ActivityChat();
            chat.setMongoId("perf-u01:" + chatId);
            chat.setChatId(chatId);
            chat.setOwnerUserId("perf-u01");
            chat.setMemberIds(List.of("perf-u01", userId((index % 49) + 2)));
            chat.setTitle("Performance Chat " + index);
            chat.setLastMessage("message " + index);
            chat.setDateIso(BASE_TIME.plus(Duration.ofMinutes(index)).toString());
            chat.setChannelType(index % 6 == 0 ? "serviceEvent" : "direct");
            chat.setUnread(index % 3);
            if (index == 1) {
                mongoTemplate.save(ActivityChatMessage.fromRecord(chatId, seedSearchMessage()));
            }
            mongoTemplate.save(chat);
        }
    }

    private ActivityChat.ChatMessageRecord seedSearchMessage() {
        ActivityChat.ChatAvatarRecord senderAvatar = new ActivityChat.ChatAvatarRecord();
        senderAvatar.setId("perf-u02");
        senderAvatar.setInitials("PU2");
        senderAvatar.setGender("woman");

        ActivityChat.ChatReadAvatarRecord reader = new ActivityChat.ChatReadAvatarRecord();
        reader.setId("perf-u03");
        reader.setInitials("PU3");
        reader.setGender("man");

        ActivityChat.ChatMessageReactionRecord reaction = new ActivityChat.ChatMessageReactionRecord();
        reaction.setUserId("perf-u04");
        reaction.setEmoji("+1");
        reaction.setReactedAtIso(BASE_TIME.toString());

        ActivityChat.ChatMessageAttachmentRecord eventAttachment = new ActivityChat.ChatMessageAttachmentRecord();
        eventAttachment.setId("perf-attachment-event");
        eventAttachment.setType("event");
        eventAttachment.setEntityId("perf-event-1");
        eventAttachment.setTitle("Performance Event 1");

        ActivityChat.ChatMessageAttachmentRecord pollAttachment = new ActivityChat.ChatMessageAttachmentRecord();
        pollAttachment.setId("perf-attachment-poll");
        pollAttachment.setType("poll");
        pollAttachment.setDescription("{\"options\":[{\"votes\":[{\"userId\":\"perf-u05\"}]}]}");

        ActivityChat.ChatMessageRecord message = new ActivityChat.ChatMessageRecord();
        message.setId("perf-message-1");
        message.setSender("Performance User 2");
        message.setSenderAvatar(senderAvatar);
        message.setText("Indexed parent search field seed");
        message.setSentAtIso(BASE_TIME.toString());
        message.setReadBy(List.of(reader));
        message.setReactions(List.of(reaction));
        message.setAttachments(List.of(eventAttachment, pollAttachment));
        return message;
    }

    private String userId(int index) {
        return "perf-u" + String.format("%02d", index);
    }

    private static void ensureEmbeddedMongo() {
        if (embeddedMongo != null) {
            return;
        }
        embeddedMongo = Mongod.instance().start(Version.Main.V6_0);
        ServerAddress serverAddress = embeddedMongo.current().getServerAddress();
        mongoBaseUri = "mongodb://" + serverAddress.getHost() + ":" + serverAddress.getPort();
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
