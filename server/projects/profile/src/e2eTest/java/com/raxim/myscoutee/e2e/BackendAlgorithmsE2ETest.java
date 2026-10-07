package com.raxim.myscoutee.e2e;

import static org.assertj.core.api.Assertions.assertThat;
import static org.awaitility.Awaitility.await;
import static org.mockito.Mockito.RETURNS_DEEP_STUBS;
import static org.mockito.Mockito.mock;

import java.time.Duration;
import java.time.Instant;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicReference;
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
import com.raxim.myscoutee.domain.events.document.ActivityEvent;
import com.raxim.myscoutee.domain.events.document.ActivityMainEventRuntime;
import com.raxim.myscoutee.domain.events.document.ActivityMember;
import com.raxim.myscoutee.domain.affinity.document.AffinityRecomputeTask;
import com.raxim.myscoutee.domain.chat.document.Chat;
import com.raxim.myscoutee.domain.events.document.EventLeaderboardEntry;
import com.raxim.myscoutee.domain.notifications.document.NotificationOutboxItem;
import com.raxim.myscoutee.domain.notifications.document.NotificationRuleConfig;
import com.raxim.myscoutee.domain.events.document.SchedulerPlanMarker;
import com.raxim.myscoutee.domain.events.document.SubEventItem;
import com.raxim.myscoutee.domain.affinity.document.UserAffinityEdge;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.common.dto.SharedDtos.LocationCoordinatesDto;
import com.raxim.myscoutee.domain.events.repository.ActivityMembersRepository;
import com.raxim.myscoutee.domain.notifications.service.NotificationRuleRegistryService;

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
        classes = Main.class,
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
        properties = {
                "config.firebase-enabled=false",
                "config.member-user=member1@myscoutee.local",
                "admin.stats.enabled=false",
                "assets.source-refresh.enabled=false",
                "media.enabled=false",
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
class BackendAlgorithmsE2ETest {
    private static final String DB_SUFFIX = UUID.randomUUID().toString().replace("-", "");
    private static final String REAL_DB = "myscoutee_e2e_real_" + DB_SUFFIX;
    private static final String DEMO_DB = "myscoutee_e2e_demo_" + DB_SUFFIX;
    private static final String SESSION_KIND_HEADER = "X-App-Session-Kind";
    private static final String DEMO_SESSION = "demo";
    private static final String ADMIN_ID = "admin-demo-ava";
    private static final String RANDOM_EVENT_ID = "e2e-random-tournament";
    private static final String RANDOM_STAGE_ID = "e2e-random-stage";
    private static final List<String> RANDOM_GROUP_IDS = List.of(
            RANDOM_STAGE_ID + ":group:1",
            RANDOM_STAGE_ID + ":group:2",
            RANDOM_STAGE_ID + ":group:3",
            RANDOM_STAGE_ID + ":group:4");
    private static final List<String> RANDOM_ROOM_EVENT_IDS = RANDOM_GROUP_IDS.stream()
            .map(groupId -> "random-room:" + RANDOM_EVENT_ID + ":" + RANDOM_STAGE_ID + ":" + groupId)
            .toList();
    private static final String PRIORITY_EVENT_ID = "e2e-priority-auto-invite";
    private static final String SCORE_EVENT_ID = "e2e-score-event";
    private static final String SCORE_STAGE_ID = "e2e-score-stage";
    private static final String SCORE_GROUP_ID = SCORE_STAGE_ID + ":group:1";
    private static final String FIFA_EVENT_ID = "e2e-fifa-event";
    private static final String FIFA_STAGE_ID = "e2e-fifa-stage";
    private static final String FIFA_GROUP_ID = FIFA_STAGE_ID + ":group:1";
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
    private ActivityMembersRepository activityMembersRepository;
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
    void seedDemoBackend() {
        withDemo(() -> {
            clearE2eCollections();
            seedUsers();
            seedNotificationRules();
            seedAffinityGraph();
            seedRandomEvent();
            seedPriorityEvent();
            seedLeaderboardEvents();
        });
    }

    @Test
    void backendAlgorithmsHandleFiftyUsersThroughHttpAndWorkers() {
        assertThat(countSeededUsers()).isEqualTo(50L);

        JsonNode me = getJson("/auth/me?userId=" + userId(1));
        assertThat(me.path("id").asString()).isEqualTo(userId(1));

        Instant randomRunStarted = Instant.now();
        JsonNode runResult = postJson(
                "/admin/notifications/" + NotificationRuleRegistryService.RULE_EVENT_RANDOM_GROUPS + "/run",
                Map.of("adminUserId", ADMIN_ID));
        assertThat(runResult.path("status").asString()).isEqualTo("running");

        JsonNode completedRule = waitForRandomGroupingRun();
        assertThat(completedRule.path("runState").path("lastRunStatus").asString()).isEqualTo("completed");
        assertThat(completedRule.path("runState").path("lastRunCount").asInt()).isEqualTo(20);
        assertThat(Duration.between(randomRunStarted, Instant.now())).isLessThan(Duration.ofSeconds(20));
        assertRandomGroupsWereAssignedByAffinityClusters();
        assertAdminNotificationRuleEditingRoundTripsThroughHttp();

        postOk("/activities/events/publish", Map.of(
                "userId", userId(41),
                "type", "hosting",
                "sourceId", PRIORITY_EVENT_ID));
        assertPriorityAutoInvitesAndAffinityQueue();
        assertPriorityInvitesAreGroupedIntoOneNotification();

        JsonNode hosting = getJson("/activities/events/hosting?userId=" + userId(41));
        assertThat(ids(hosting, "id")).contains(PRIORITY_EVENT_ID);

        assertScoreLeaderboardOverHttp();
        assertFifaLeaderboardTieBreaksOverHttp();
    }

    private void assertAdminNotificationRuleEditingRoundTripsThroughHttp() {
        JsonNode initialState = getJson("/admin/notifications?adminUserId=" + ADMIN_ID);
        assertThat(ruleByKey(initialState, NotificationRuleRegistryService.RULE_EVENT_AUTO_INVITER)
                .path("enabled").asBoolean()).isTrue();
        JsonNode counterExpiryRule = ruleByKey(initialState, NotificationRuleRegistryService.RULE_EVENT_COUNTER_EXPIRY);
        assertThat(counterExpiryRule.path("enabled").asBoolean()).isTrue();
        assertThat(counterExpiryRule.path("timing").path("intervalAmount").asInt()).isEqualTo(5);
        assertThat(counterExpiryRule.path("timing").path("intervalUnit").asString()).isEqualTo("seconds");

        JsonNode savedState = postJson("/admin/notifications", Map.of(
                "adminUserId", ADMIN_ID,
                "rules", List.of(editedAutoInviterRule())));
        JsonNode savedRule = ruleByKey(savedState, NotificationRuleRegistryService.RULE_EVENT_AUTO_INVITER);
        assertThat(savedRule.path("enabled").asBoolean()).isFalse();
        assertThat(savedRule.path("priority").asInt()).isEqualTo(777);
        assertThat(savedRule.path("description").asString()).isEqualTo("E2E edited auto inviter cadence.");
        assertThat(savedRule.path("timing").path("intervalAmount").asInt()).isEqualTo(5);
        assertThat(savedRule.path("timing").path("intervalUnit").asString()).isEqualTo("minutes");
        assertThat(savedRule.path("message").path("pushTitle").asString()).isEqualTo("E2E Auto Invite");

        JsonNode runtimeRule = getJson("/admin/notifications/"
                + NotificationRuleRegistryService.RULE_EVENT_AUTO_INVITER
                + "/runtime?adminUserId=" + ADMIN_ID);
        assertThat(runtimeRule.path("enabled").asBoolean()).isFalse();
        assertThat(runtimeRule.path("updatedUser").asString()).isEqualTo(ADMIN_ID);

        JsonNode restoredState = postJson("/admin/notifications", Map.of(
                "adminUserId", ADMIN_ID,
                "rules", List.of(restoredAutoInviterRule())));
        JsonNode restoredRule = ruleByKey(restoredState, NotificationRuleRegistryService.RULE_EVENT_AUTO_INVITER);
        assertThat(restoredRule.path("enabled").asBoolean()).isTrue();
    }

    private Map<String, Object> editedAutoInviterRule() {
        Map<String, Object> rule = new LinkedHashMap<>();
        rule.put("ruleKey", NotificationRuleRegistryService.RULE_EVENT_AUTO_INVITER);
        rule.put("label", "admin.jobs.rule.event.auto.inviter");
        rule.put("category", "admin.jobs.category.scheduled");
        rule.put("description", "E2E edited auto inviter cadence.");
        rule.put("actionKey", "event.scheduler.auto-inviter");
        rule.put("triggerKind", "scheduled_process");
        rule.put("enabled", false);
        rule.put("manualRunEnabled", false);
        rule.put("adminManageable", true);
        rule.put("priority", 777);
        rule.put("channels", Map.of(
                        "pushEnabled", true,
                        "emailEnabled", false,
                        "inAppEnabled", true,
                        "supportChatEnabled", false));
        rule.put("timing", Map.of(
                        "mode", "interval",
                        "intervalAmount", 5,
                        "intervalUnit", "minutes",
                        "time", "09:15",
                        "timezone", "UTC"));
        rule.put("scheduleSlots", List.of(Map.of(
                        "id", "e2e-auto-inviter-slot",
                        "frequency", "daily",
                        "time", "09:15",
                        "timezone", "UTC",
                        "actionKey", "event.scheduler.auto-inviter",
                        "enabled", true)));
        rule.put("parameters", List.of());
        rule.put("message", Map.of(
                        "pushTitle", "E2E Auto Invite",
                        "pushBody", "Edited through backend e2e.",
                        "emailTemplateKey", "",
                        "emailSubject", "",
                        "emailBody", "",
                        "ctaPath", "/game"));
        return rule;
    }

    private Map<String, Object> restoredAutoInviterRule() {
        Map<String, Object> rule = editedAutoInviterRule();
        rule.put("description", "E2E auto inviter rule.");
        rule.put("enabled", true);
        rule.put("priority", 20);
        rule.put("message", Map.of(
                        "pushTitle", "Auto invite",
                        "pushBody", "You have a priority event invite.",
                        "emailTemplateKey", "",
                        "emailSubject", "",
                        "emailBody", "",
                        "ctaPath", "/game"));
        return rule;
    }

    private JsonNode waitForRandomGroupingRun() {
        AtomicReference<JsonNode> ruleReference = new AtomicReference<>();
        await().atMost(Duration.ofSeconds(20)).pollInterval(Duration.ofMillis(250)).untilAsserted(() -> {
            JsonNode rule = getJson("/admin/notifications/"
                    + NotificationRuleRegistryService.RULE_EVENT_RANDOM_GROUPS
                    + "/runtime?adminUserId=" + ADMIN_ID);
            ruleReference.set(rule);
            assertThat(rule.path("runState").path("currentStatus").asString())
                    .isIn("completed", "failed");
        });
        return ruleReference.get();
    }

    private void assertRandomGroupsWereAssignedByAffinityClusters() {
        List<ActivityMember> groupMembers = fromDemo(() ->
                activityMembersRepository.findByOwnerTypeAndOwnerIdIn("event", RANDOM_ROOM_EVENT_IDS));
        assertThat(groupMembers).hasSize(20);

        Map<String, List<String>> usersByGroupId = new LinkedHashMap<>();
        for (ActivityMember member : groupMembers) {
            if ("accepted".equals(member.getStatus())) {
                usersByGroupId.computeIfAbsent(member.getOwnerId(), ignored -> new ArrayList<>()).add(member.getUserId());
            }
        }
        assertThat(usersByGroupId).hasSize(4);
        assertThat(usersByGroupId.keySet()).containsExactlyInAnyOrderElementsOf(RANDOM_ROOM_EVENT_IDS);
        assertThat(usersByGroupId.values().stream().flatMap(Collection::stream).toList())
                .containsExactlyInAnyOrderElementsOf(userIds(1, 20));

        for (List<String> memberUserIds : usersByGroupId.values()) {
            assertThat(memberUserIds).hasSize(5);
            assertThat(memberUserIds.stream().map(this::clusterIndex).distinct().toList())
                    .as("each generated room should stay inside one high-affinity cluster")
                    .hasSize(1);
        }

        List<ActivityEvent> roomEvents = fromDemo(() -> mongoTemplate.find(
                Query.query(Criteria.where("sourceId").in(RANDOM_ROOM_EVENT_IDS)),
                ActivityEvent.class));
        assertThat(roomEvents).hasSize(4);
        Map<String, ActivityEvent> roomById = roomEvents.stream().collect(
                LinkedHashMap::new,
                (rooms, room) -> rooms.put(room.getSourceId(), room),
                Map::putAll);
        for (int index = 0; index < RANDOM_ROOM_EVENT_IDS.size(); index += 1) {
            ActivityEvent room = roomById.get(RANDOM_ROOM_EVENT_IDS.get(index));
            assertThat(room).isNotNull();
            assertThat(room.getTitle()).isEqualTo("Random Room R" + (index + 1));
            assertThat(room.getEventType()).isEqualTo("random-room");
            assertThat(room.getCreatorUserId()).isNull();
            assertThat(room.getCreatorName()).isEqualTo("MyScoutee System");
            assertThat(room.getParentEventId()).isNull();
            assertThat(room.getImageUrl())
                    .isEqualTo("/media/public?key=images/system/random-room-default.png");
        }

        List<ActivityMainEventRuntime> roomRuntimes = fromDemo(() -> mongoTemplate.find(
                Query.query(Criteria.where("eventId").in(RANDOM_ROOM_EVENT_IDS)
                        .and("runtimeKind").is(ActivityMainEventRuntime.RUNTIME_KIND_MAIN_EVENT)),
                ActivityMainEventRuntime.class));
        assertThat(roomRuntimes).hasSize(4);
        assertThat(roomRuntimes).allSatisfy(runtime -> {
            assertThat(runtime.getOwnerId()).isEqualTo(runtime.getEventId());
            assertThat(runtime.getRecordId()).isEqualTo("main-event:" + runtime.getEventId());
            assertThat(runtime.getStatus()).isEqualTo(ActivityEvent.STATUS_ACTIVE);
        });

        List<Chat> roomChatViews = fromDemo(() -> mongoTemplate.find(
                Query.query(Criteria.where("id").in(RANDOM_ROOM_EVENT_IDS)),
                Chat.class));
        assertThat(roomChatViews).hasSize(20);
        for (String roomEventId : RANDOM_ROOM_EVENT_IDS) {
            List<Chat> chatViews = roomChatViews.stream()
                    .filter(chat -> roomEventId.equals(chat.getChatId()))
                    .toList();
            assertThat(chatViews).hasSize(5);
            assertThat(chatViews).allSatisfy(chat -> {
                assertThat(chat.getEventId()).isEqualTo(roomEventId);
                assertThat(chat.getOwnerId()).isEqualTo(roomEventId);
                assertThat(chat.getChannelType()).isEqualTo("mainEvent");
                assertThat(chat.getMemberIds())
                        .containsExactlyInAnyOrderElementsOf(usersByGroupId.get(roomEventId));
            });
        }

        List<NotificationOutboxItem> roomNotifications = fromDemo(() -> mongoTemplate.find(
                Query.query(Criteria.where("notificationType")
                        .is(NotificationRuleRegistryService.RULE_EVENT_RANDOM_GROUPS)),
                NotificationOutboxItem.class));
        assertThat(roomNotifications).hasSize(4);
        assertThat(roomNotifications).extracting(NotificationOutboxItem::getEntityId)
                .containsExactlyInAnyOrderElementsOf(RANDOM_ROOM_EVENT_IDS);
    }

    private void assertPriorityAutoInvitesAndAffinityQueue() {
        List<ActivityMember> eventMembers = fromDemo(() ->
                activityMembersRepository.findByOwnerTypeAndOwnerId("event", PRIORITY_EVENT_ID));
        List<String> pendingInvites = eventMembers.stream()
                .filter(member -> "pending".equals(member.getStatus()))
                .filter(member -> "invite".equals(member.getRequestKind()))
                .map(ActivityMember::getUserId)
                .sorted()
                .toList();
        assertThat(pendingInvites).containsExactly(userId(43), userId(44), userId(45));

        List<AffinityRecomputeTask> tasks = fromDemo(() -> mongoTemplate.find(
                Query.query(Criteria.where("targetId").is(PRIORITY_EVENT_ID)),
                AffinityRecomputeTask.class));
        assertThat(tasks).isNotEmpty();
        assertThat(tasks.stream().flatMap(task -> task.getReasons().stream()).toList())
                .contains("EVENT_CHANGED");
    }

    private void assertPriorityInvitesAreGroupedIntoOneNotification() {
        List<NotificationOutboxItem> notifications = fromDemo(() -> mongoTemplate.find(
                Query.query(Criteria.where("entityId").is(PRIORITY_EVENT_ID)
                        .and("notificationType").is("event-invite")),
                NotificationOutboxItem.class));
        assertThat(notifications).hasSize(1);
        NotificationOutboxItem inviteNotification = notifications.get(0);
        assertThat(inviteNotification.getRecipientUserIds())
                .containsExactlyInAnyOrder(userId(43), userId(44), userId(45));
        assertThat(inviteNotification.getDeliveryStrategy()).isEqualTo("multicast");
        assertThat(inviteNotification.getPayload())
                .containsEntry("eventId", PRIORITY_EVENT_ID)
                .containsEntry("eventScope", "invitations");
    }

    private void assertScoreLeaderboardOverHttp() {
        postJson("/activities/events/leaderboard/entry", Map.of(
                "actorUserId", userId(21),
                "eventId", SCORE_EVENT_ID,
                "subEventId", SCORE_STAGE_ID,
                "groupId", SCORE_GROUP_ID,
                "mode", "Score",
                "memberId", userId(22),
                "scoreValue", 3));
        postJson("/activities/events/leaderboard/entry", Map.of(
                "actorUserId", userId(21),
                "eventId", SCORE_EVENT_ID,
                "subEventId", SCORE_STAGE_ID,
                "groupId", SCORE_GROUP_ID,
                "mode", "Score",
                "memberId", userId(21),
                "scoreValue", 5));
        postJson("/activities/events/leaderboard/entry", Map.of(
                "actorUserId", userId(21),
                "eventId", SCORE_EVENT_ID,
                "subEventId", SCORE_STAGE_ID,
                "groupId", SCORE_GROUP_ID,
                "mode", "Score",
                "memberId", userId(22),
                "scoreValue", 4));
        JsonNode state = postJson("/activities/events/leaderboard/entry", Map.of(
                "actorUserId", userId(21),
                "eventId", SCORE_EVENT_ID,
                "subEventId", SCORE_STAGE_ID,
                "groupId", SCORE_GROUP_ID,
                "mode", "Score",
                "memberId", userId(23),
                "scoreValue", 2));

        JsonNode group = groupById(state, SCORE_GROUP_ID);
        assertThat(ids(group.path("advancingMemberIds"))).containsExactly(userId(22), userId(21));
        assertThat(ids(group.path("scoreRows"), "memberId")).containsExactly(userId(22), userId(21), userId(23), userId(24));
        assertThat(group.path("scoreRows").get(0).path("total").asInt()).isEqualTo(7);
        assertThat(group.path("scoreRows").get(0).path("updates").asInt()).isEqualTo(2);
        assertThat(group.path("scoreRows").get(1).path("total").asInt()).isEqualTo(5);
    }

    private void assertFifaLeaderboardTieBreaksOverHttp() {
        postJson("/activities/events/leaderboard/entry", Map.of(
                "actorUserId", userId(31),
                "eventId", FIFA_EVENT_ID,
                "subEventId", FIFA_STAGE_ID,
                "groupId", FIFA_GROUP_ID,
                "mode", "Fifa",
                "homeMemberId", userId(31),
                "awayMemberId", userId(32),
                "homeScore", 2,
                "awayScore", 0));
        postJson("/activities/events/leaderboard/entry", Map.of(
                "actorUserId", userId(31),
                "eventId", FIFA_EVENT_ID,
                "subEventId", FIFA_STAGE_ID,
                "groupId", FIFA_GROUP_ID,
                "mode", "Fifa",
                "homeMemberId", userId(33),
                "awayMemberId", userId(34),
                "homeScore", 1,
                "awayScore", 0));
        JsonNode state = postJson("/activities/events/leaderboard/entry", Map.of(
                "actorUserId", userId(31),
                "eventId", FIFA_EVENT_ID,
                "subEventId", FIFA_STAGE_ID,
                "groupId", FIFA_GROUP_ID,
                "mode", "Fifa",
                "homeMemberId", userId(34),
                "awayMemberId", userId(32),
                "homeScore", 4,
                "awayScore", 0));

        JsonNode group = groupById(state, FIFA_GROUP_ID);
        assertThat(ids(group.path("advancingMemberIds"))).containsExactly(userId(34), userId(31));
        assertThat(ids(group.path("fifaRows"), "memberId"))
                .containsExactly(userId(34), userId(31), userId(33), userId(32));
        assertThat(group.path("fifaRows").get(0).path("points").asInt()).isEqualTo(3);
        assertThat(group.path("fifaRows").get(0).path("goalDiff").asInt()).isEqualTo(3);
        assertThat(group.path("fifaRows").get(1).path("goalDiff").asInt()).isEqualTo(2);
        assertThat(group.path("fifaRows").get(2).path("goalDiff").asInt()).isEqualTo(1);
    }

    private JsonNode getJson(String path) {
        HttpResponse<String> response = send(HttpRequest.newBuilder(uri(path))
                .header(SESSION_KIND_HEADER, DEMO_SESSION)
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

    private HttpResponse<String> post(String path, Object body) {
        String actor = body instanceof Map<?, ?> payload
                ? String.valueOf(payload.containsKey("userId") ? payload.get("userId")
                        : payload.containsKey("actorUserId") ? payload.get("actorUserId") : ADMIN_ID)
                : ADMIN_ID;
        String json = writeJson(body);
        HttpResponse<String> response = send(HttpRequest.newBuilder(uri(path))
                .header(SESSION_KIND_HEADER, DEMO_SESSION)
                .header("X-Demo-User-Id", actor)
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

    private JsonNode groupById(JsonNode state, String groupId) {
        for (JsonNode group : state.path("groups")) {
            if (groupId.equals(group.path("groupId").asString())) {
                return group;
            }
        }
        throw new AssertionError("Missing group " + groupId + " in " + state);
    }

    private JsonNode ruleByKey(JsonNode state, String ruleKey) {
        for (JsonNode rule : state.path("rules")) {
            if (ruleKey.equals(rule.path("ruleKey").asString())) {
                return rule;
            }
        }
        throw new AssertionError("Missing notification rule " + ruleKey + " in " + state);
    }

    private List<String> ids(JsonNode array) {
        List<String> values = new ArrayList<>();
        for (JsonNode item : array) {
            values.add(item.asString());
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

    private long countSeededUsers() {
        return fromDemo(() -> mongoTemplate.count(
                Query.query(Criteria.where("userId").regex("^e2e-u")),
                Users.class));
    }

    private void clearE2eCollections() {
        mongoTemplate.remove(new Query(), Users.class);
        mongoTemplate.remove(new Query(), ActivityEvent.class);
        mongoTemplate.remove(new Query(), ActivityMember.class);
        mongoTemplate.remove(new Query(), Chat.class);
        mongoTemplate.remove(new Query(), UserAffinityEdge.class);
        mongoTemplate.remove(new Query(), EventLeaderboardEntry.class);
        mongoTemplate.remove(new Query(), NotificationOutboxItem.class);
        mongoTemplate.remove(new Query(), NotificationRuleConfig.class);
        mongoTemplate.remove(new Query(), SchedulerPlanMarker.class);
        mongoTemplate.remove(new Query(), AffinityRecomputeTask.class);
    }

    private void seedNotificationRules() {
        NotificationRuleConfig randomGroups = notificationRule(
                "e2e-random-groups-rule",
                NotificationRuleRegistryService.RULE_EVENT_RANDOM_GROUPS,
                "Random groups",
                "E2E random group generation.",
                "event.random.groups",
                true,
                true,
                10);
        mongoTemplate.save(randomGroups);

        NotificationRuleConfig autoInviter = notificationRule(
                "e2e-auto-inviter-rule",
                NotificationRuleRegistryService.RULE_EVENT_AUTO_INVITER,
                "Auto inviter",
                "E2E auto inviter rule.",
                "event.scheduler.auto-inviter",
                true,
                false,
                20);
        mongoTemplate.save(autoInviter);

        NotificationRuleConfig counterExpiry = notificationRule(
                "e2e-event-counter-expiry-rule",
                NotificationRuleRegistryService.RULE_EVENT_COUNTER_EXPIRY,
                "Event counter expiry",
                "E2E event counter expiry rule.",
                "event.counter.expiry",
                true,
                false,
                25);
        NotificationRuleConfig.Timing timing = new NotificationRuleConfig.Timing();
        timing.setMode("interval");
        timing.setIntervalMinutes(1);
        timing.setIntervalSeconds(5);
        timing.setIntervalAmount(5);
        timing.setIntervalUnit("seconds");
        timing.setTime("00:00");
        timing.setTimezone("UTC");
        timing.setCronExpression("0/5 * * * * ?");
        counterExpiry.setTiming(timing);
        mongoTemplate.save(counterExpiry);
    }

    private NotificationRuleConfig notificationRule(
            String id,
            String ruleKey,
            String label,
            String description,
            String actionKey,
            boolean enabled,
            boolean manualRunEnabled,
            int priority) {
        NotificationRuleConfig randomGroups = new NotificationRuleConfig();
        randomGroups.setId(id);
        randomGroups.setSyncKey(id);
        randomGroups.setRuleKey(ruleKey);
        randomGroups.setLabel(label);
        randomGroups.setCategory("events");
        randomGroups.setDescription(description);
        randomGroups.setActionKey(actionKey);
        randomGroups.setTriggerKind("scheduled_process");
        randomGroups.setEnabled(enabled);
        randomGroups.setManualRunEnabled(manualRunEnabled);
        randomGroups.setAdminManageable(true);
        randomGroups.setPriority(priority);
        randomGroups.setCreatedDate(BASE_TIME.toString());
        randomGroups.setCreatedUser("e2e");
        randomGroups.setUpdatedDate(BASE_TIME.toString());
        randomGroups.setUpdatedUser("e2e");
        return randomGroups;
    }

    private void seedUsers() {
        List<Users> users = new ArrayList<>();
        for (int index = 1; index <= 50; index += 1) {
            Users user = new Users();
            user.setMongoId(new ObjectId().toHexString());
            user.setSyncKey("e2e-user-" + index + "-" + UUID.randomUUID());
            user.setId(userId(index));
            user.setEmail(userId(index) + "@example.test");
            user.setName("E2E User " + index);
            user.setInitials("U" + index);
            user.setAge(20 + index % 17);
            user.setCity(index % 2 == 0 ? "Bratislava" : "Kosice");
            user.setGender(index % 2 == 0 ? "woman" : "man");
            user.setStatusText(index % 3 == 0 ? "Ready to play" : "Open to meet");
            user.setHostTier(index % 5 == 0 ? "Host" : "Member");
            user.setTraitLabel(index % 4 == 0 ? "Strategist" : "Explorer");
            user.setCompletion(100);
            user.setProfileFormVersion(1);
            user.setHeadline("Backend e2e profile " + index);
            user.setAbout("Seeded backend-only e2e user " + index);
            user.setAffinity(40d + index);
            user.setLocationCoordinates(new Users.LocationCoordinatesRecord(48.1d + index * 0.001d, 17.1d + index * 0.001d));
            user.setImages(List.of("https://example.test/avatar/" + index + ".png"));
            user.setStatus("A");
            user.setProfileStatus("public");
            user.setActivities(new Users.UserActivitiesRecord(
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                new Users.UserChatCountersRecord(0, 0, 0, 0, 0, 0),
                new Users.UserEventCountersRecord(0, 0, 0, 0, 0, 0, 0),
                new Users.UserAssetCountersRecord(0, 0, 0, 0),
                new Users.UserEventFeedbackCountersRecord(0, 0, 0, 0),
                0, 0));
            users.add(user);
        }
        mongoTemplate.insert(users, Users.class);
    }

    private void seedAffinityGraph() {
        List<UserAffinityEdge> edges = new ArrayList<>();
        for (int cluster = 0; cluster < 10; cluster += 1) {
            int first = cluster * 5 + 1;
            int last = first + 4;
            for (int left = first; left <= last; left += 1) {
                for (int right = left + 1; right <= last; right += 1) {
                    double weight = 0.99d - cluster * 0.01d - (right - left) * 0.005d;
                    edges.add(edge(userId(left), userId(right), Math.max(0.55d, weight)));
                }
            }
        }
        mongoTemplate.insert(edges, UserAffinityEdge.class);
    }

    private void seedRandomEvent() {
        mongoTemplate.insert(event(
                RANDOM_EVENT_ID,
                userId(1),
                "E2E Random Rooms",
                true,
                false,
                20,
                List.of(generatedStage(RANDOM_STAGE_ID, "Affinity Rooms", 4, 5, 5))));
        mongoTemplate.insert(eventMembers("event", RANDOM_EVENT_ID, userIds(1, 20), "accepted", "join"), ActivityMember.class);
    }

    private void seedPriorityEvent() {
        mongoTemplate.insert(event(
                PRIORITY_EVENT_ID,
                userId(41),
                "E2E Auto Inviter",
                false,
                true,
                5,
                List.of()));
        mongoTemplate.insert(eventMembers("event", PRIORITY_EVENT_ID, List.of(userId(41), userId(42)), "accepted", "join"),
                ActivityMember.class);
    }

    private void seedLeaderboardEvents() {
        mongoTemplate.insert(event(
                SCORE_EVENT_ID,
                userId(21),
                "E2E Score Event",
                true,
                false,
                4,
                List.of(explicitStage(SCORE_STAGE_ID, "Score Stage", "Score", 2))));
        mongoTemplate.insert(eventMembers("group", SCORE_GROUP_ID, userIds(21, 24), "accepted", "join"), ActivityMember.class);

        mongoTemplate.insert(event(
                FIFA_EVENT_ID,
                userId(31),
                "E2E Fifa Event",
                true,
                false,
                4,
                List.of(explicitStage(FIFA_STAGE_ID, "Fifa Stage", "Fifa", 2))));
        mongoTemplate.insert(eventMembers("group", FIFA_GROUP_ID, userIds(31, 34), "accepted", "join"), ActivityMember.class);
    }

    private ActivityEvent event(
            String sourceId,
            String ownerUserId,
            String title,
            boolean published,
            boolean autoInviter,
            int capacityTotal,
            List<SubEventItem> subEvents) {
        ActivityEvent event = new ActivityEvent();
        event.setId(new ObjectId().toHexString());
        event.setSyncKey("e2e-event-" + sourceId + "-" + UUID.randomUUID());
        event.setSourceId(sourceId);
        event.setOwnerUserId(ownerUserId);
        event.setStatus(published ? ActivityEvent.STATUS_ACTIVE : ActivityEvent.STATUS_DRAFT);
        event.setCreatorUserId(ownerUserId);
        event.setCreatorName("Host " + ownerUserId);
        event.setCreatorInitials("EH");
        event.setCreatorGender("woman");
        event.setCreatorCity("Bratislava");
        event.setTitle(title);
        event.setSubtitle(title + " seeded by backend e2e");
        event.setTimeframe("Jun 10, 12:00");
        event.setVisibility("public");
        event.setBlindMode("off");
        event.setStartAtIso(BASE_TIME.plus(Duration.ofDays(7)).toString());
        event.setEndAtIso(BASE_TIME.plus(Duration.ofDays(7)).plus(Duration.ofHours(3)).toString());
        event.setLocation("E2E Arena");
        event.setLocationCoordinates(new LocationCoordinatesDto(48.1486d, 17.1077d));
        event.setCapacityMin(Math.min(2, capacityTotal));
        event.setCapacityMax(capacityTotal);
        event.setCapacityTotal(capacityTotal);
        event.setAutoInviter(autoInviter);
        event.setFrequency("One-time");
        event.setTicketing(false);
        event.setAcceptedMembers(0);
        event.setPendingMembers(0);
        event.setTopics(List.of("games", "e2e"));
        event.setSubEvents(subEvents);
        event.setMode(subEvents == null || subEvents.isEmpty() ? "Casual" : "Tournament");
        event.setRating(0d);
        event.setBoost(0d);
        event.setAffinity(0d);
        event.setAdmins(List.of(ownerUserId));
        event.setCreatedDate(BASE_TIME.toString());
        event.setCreatedUser("e2e");
        event.setUpdatedDate(BASE_TIME.toString());
        event.setUpdatedUser("e2e");
        event.normalizeLifecycleState();
        return event;
    }

    private SubEventItem generatedStage(String id, String name, int groupCount, int min, int max) {
        return new SubEventItem(
                id,
                name,
                name + " generated by backend e2e",
                BASE_TIME.plus(Duration.ofDays(7)).toString(),
                BASE_TIME.plus(Duration.ofDays(7)).plus(Duration.ofHours(2)).toString(),
                "E2E Arena",
                userId(1),
                min,
                max,
                "Score",
                1,
                false,
                null,
                min,
                groupCount * max,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                null,
                null);
    }

    private SubEventItem explicitStage(String id, String name, String leaderboardType, int advancePerGroup) {
        return new SubEventItem(
                id,
                name,
                name + " explicit group",
                BASE_TIME.plus(Duration.ofDays(7)).toString(),
                BASE_TIME.plus(Duration.ofDays(7)).plus(Duration.ofHours(2)).toString(),
                "E2E Arena",
                userId(1),
                4,
                4,
                leaderboardType,
                advancePerGroup,
                false,
                null,
                4,
                4,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                null,
                null);
    }

    private List<ActivityMember> eventMembers(
            String ownerType,
            String ownerId,
            Collection<String> userIds,
            String status,
            String requestKind) {
        List<ActivityMember> members = new ArrayList<>();
        int offset = 0;
        for (String userId : userIds) {
            ActivityMember member = new ActivityMember();
            member.setId(new ObjectId().toHexString());
            member.setSyncKey("e2e-member-" + ownerType + "-" + ownerId + "-" + userId + "-" + UUID.randomUUID());
            member.setOwnerType(ownerType);
            member.setOwnerId(ownerId);
            member.setUserId(userId);
            member.setRole(offset == 0 && "event".equals(ownerType) ? "admin" : "member");
            member.setStatus(status);
            member.setRequestKind(requestKind);
            member.setPendingSource("accepted".equals(status) ? null : "admin");
            member.setInvitedByUserId("accepted".equals(status) ? null : ADMIN_ID);
            member.setActionAtIso(BASE_TIME.plusSeconds(offset).toString());
            member.setMetAtIso(BASE_TIME.plusSeconds(offset).toString());
            member.setMetWhere("E2E Arena");
            member.setCreatedDate(BASE_TIME.toString());
            member.setCreatedUser("e2e");
            member.setUpdatedDate(BASE_TIME.toString());
            member.setUpdatedUser("e2e");
            members.add(member);
            offset += 1;
        }
        return members;
    }

    private UserAffinityEdge edge(String leftUserId, String rightUserId, double weight) {
        String left = leftUserId.compareTo(rightUserId) <= 0 ? leftUserId : rightUserId;
        String right = leftUserId.compareTo(rightUserId) <= 0 ? rightUserId : leftUserId;
        UserAffinityEdge edge = new UserAffinityEdge();
        edge.setId(new ObjectId().toHexString());
        edge.setPairKey(left + ":" + right);
        edge.setLeftUserId(left);
        edge.setRightUserId(right);
        edge.setAffinityScore(weight * 10d);
        edge.setEdgeWeight(weight);
        UserAffinityEdge.EvidenceSummary evidence = new UserAffinityEdge.EvidenceSummary();
        evidence.setMutualSingleCount(weight >= 0.9d ? 2 : 0);
        evidence.setPairInsideNetworkCount(weight >= 0.8d ? 1 : 0);
        evidence.setPairOutsideNetworkCount(weight < 0.5d ? 1 : 0);
        evidence.setMetCount(weight >= 0.8d ? 1 : 0);
        edge.setEvidence(evidence);
        edge.setUpdatedDate(BASE_TIME.toString());
        return edge;
    }

    private List<String> userIds(int firstInclusive, int lastInclusive) {
        List<String> ids = new ArrayList<>();
        for (int index = firstInclusive; index <= lastInclusive; index += 1) {
            ids.add(userId(index));
        }
        return ids;
    }

    private String userId(int index) {
        return "e2e-u" + String.format("%02d", index);
    }

    private int clusterIndex(String userId) {
        String suffix = userId.substring("e2e-u".length());
        return (Integer.parseInt(suffix) - 1) / 5;
    }

    private void withDemo(Runnable action) {
        MongoSessionMode previousMode = MongoSessionModeContext.currentMode();
        try {
            MongoSessionModeContext.set(MongoSessionMode.DEMO);
            action.run();
        } finally {
            MongoSessionModeContext.set(previousMode);
        }
    }

    private <T> T fromDemo(Supplier<T> supplier) {
        MongoSessionMode previousMode = MongoSessionModeContext.currentMode();
        try {
            MongoSessionModeContext.set(MongoSessionMode.DEMO);
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
        E2eAccessPolicySeedSupport.seedAccessPolicies(mongoBaseUri, REAL_DB);
        E2eAccessPolicySeedSupport.seedAccessPolicies(mongoBaseUri, DEMO_DB);
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

    @TestConfiguration(proxyBeanMethods = false)
    static class E2eInfrastructure {
        @Bean
        @Primary
        StringRedisTemplate stringRedisTemplate() {
            return mock(StringRedisTemplate.class, RETURNS_DEEP_STUBS);
        }
    }
}
