package com.raxim.myscoutee.e2e;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.RETURNS_DEEP_STUBS;
import static org.mockito.Mockito.mock;

import java.io.ByteArrayOutputStream;
import java.net.URI;
import java.net.URLDecoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
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
import com.raxim.myscoutee.domain.assets.api.AssetCatalog;
import com.raxim.myscoutee.domain.chat.document.Chat;
import com.raxim.myscoutee.domain.events.document.ActivityEvent;
import com.raxim.myscoutee.domain.events.document.ActivityMember;
import com.raxim.myscoutee.domain.affinity.document.AffinityRecomputeTask;
import com.raxim.myscoutee.domain.assets.document.Asset;
import com.raxim.myscoutee.domain.help.document.HelpCenterAuditEntry;
import com.raxim.myscoutee.domain.help.document.HelpCenterRevision;
import com.raxim.myscoutee.domain.content.document.IdeaPost;
import com.raxim.myscoutee.domain.accounts.document.PrivacyConsent;
import com.raxim.myscoutee.domain.content.document.ShareToken;
import com.raxim.myscoutee.domain.content.document.UserFeedbackSubmission;
import com.raxim.myscoutee.domain.content.document.UserReportSubmission;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.common.dto.SharedDtos.LocationCoordinatesDto;
import com.raxim.myscoutee.domain.media.service.MediaObjectStoreClient;

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
        classes = {Main.class, BackendContentMediaE2ETest.E2eInfrastructure.class},
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
        properties = {
                "config.firebase-enabled=false",
                "config.member-user=e2e-content-u03@example.test",
                "auth.region-security.enabled=true",
                "admin.stats.enabled=false",
                "assets.source-refresh.enabled=false",
                "media.enabled=true",
                "media.bucket=e2e-content-media",
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
class BackendContentMediaE2ETest {
    private static final String DB_SUFFIX = UUID.randomUUID().toString().replace("-", "");
    private static final String REAL_DB = "ms_content_media_real_" + DB_SUFFIX;
    private static final String DEMO_DB = "ms_content_media_demo_" + DB_SUFFIX;
    private static final String SESSION_KIND_HEADER = "X-App-Session-Kind";
    private static final String DEMO_SESSION = "demo";
    private static final String ADMIN_ID = "admin-demo-ava";
    private static final String REPORTER_ID = userId(1);
    private static final String TARGET_ID = userId(2);
    private static final String MEDIA_USER_ID = userId(3);
    private static final String SHARE_EVENT_ID = "e2e-content-share-event";
    private static final String REPORT_EVENT_ID = "e2e-content-report-event";
    private static final String SHARE_ASSET_ID = "e2e-content-share-transport";
    private static final Instant BASE_TIME = Instant.parse("2026-06-25T12:00:00Z");

    private static TransitionWalker.ReachedState<RunningMongodProcess> embeddedMongo;
    private static String mongoBaseUri;

    @LocalServerPort
    private int port;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private MongoTemplate mongoTemplate;
    @Autowired
    private InMemoryMediaObjectStoreClient mediaObjectStoreClient;

    private String mediaCookie;

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
    void seedContentMediaBackend() {
        withReal(() -> {
            clearE2eCollections();
            seedUsers();
            seedShareEvent();
            seedShareAsset();
        });
        withDemo(() -> {
            clearE2eCollections();
            seedUsers();
            seedReportableEvent();
        });
    }

    @Test
    void mediaContentPrivacyLandingAndShareTokensWorkThroughHttp() throws Exception {
        seedMediaSession();
        JsonNode imageUpload = uploadImage("/media/images", "image", Map.of(
                "ownerId", MEDIA_USER_ID,
                "entityId", "avatar"),
                "avatar.png",
                "image/png",
                pngBytes());
        String imageUrl = imageUpload.path("url").asString();
        assertThat(imageUrl).startsWith("/api/media/private?key=private/images/");
        String originalImageUrl = mediaUploadUrl(imageUpload, "originalUrl", imageUrl);
        String smallImageUrl = mediaUploadUrl(imageUpload, "smallUrl", imageUrl);
        String mediumImageUrl = mediaUploadUrl(imageUpload, "mediumUrl", imageUrl);
        String largeImageUrl = mediaUploadUrl(imageUpload, "largeUrl", imageUrl);
        assertThat(imageUrl).isEqualTo(largeImageUrl);
        assertThat(List.of(originalImageUrl, smallImageUrl, mediumImageUrl, largeImageUrl))
                .doesNotHaveDuplicates();
        assertThat(sendBytes(HttpRequest.newBuilder(uri(originalImageUrl.replaceFirst("^/api/", "/")))
                .GET().build()).statusCode()).isEqualTo(401);
        assertPrivateMedia(originalImageUrl, "image/png", pngBytes());
        assertPrivateMediaContentType(smallImageUrl, "image/webp");
        assertPrivateMediaContentType(mediumImageUrl, "image/webp");
        assertPrivateMediaContentType(largeImageUrl, "image/webp");

        String profileImageUrl = uploadImage("/media/images", "image", Map.of(
                "ownerId", MEDIA_USER_ID,
                "entityId", "profile-0"),
                "profile.png",
                "image/png",
                pngBytes()).path("url").asString();
        assertThat(getJson("/auth/me?userId=" + MEDIA_USER_ID).path("images")).isEmpty();
        postJson("/auth/me/profile", userProfilePayloadWithImages(MEDIA_USER_ID, List.of(profileImageUrl)));
        assertThat(getJson("/auth/me?userId=" + MEDIA_USER_ID).path("images").path(0).asString())
                .isEqualTo(profileImageUrl);

        String audioUrl = uploadImage("/media/audio", "audio", Map.of(
                "ownerId", MEDIA_USER_ID,
                "entityId", "voice"),
                "voice.wav",
                "audio/wav",
                wavBytes()).path("url").asString();
        assertThat(audioUrl).startsWith("/api/media/private?key=private/audio/");
        assertPrivateMedia(audioUrl, "audio/wav", wavBytes());

        assertThat(uploadStatus("/media/images", "image", Map.of(
                "ownerId", MEDIA_USER_ID),
                "not-image.txt",
                "text/plain",
                "not an image".getBytes(StandardCharsets.UTF_8)))
                .isEqualTo(503);

        JsonNode savedHelp = postJson("/admin/help/revisions", helpRevisionPayload(), DEMO_SESSION);
        JsonNode helpRevision = revisionByTitle(savedHelp.path("revisions"), "E2E Help Contract");
        assertThat(helpRevision.path("sections").path(0).path("contentHtml").asString())
                .doesNotContain("script")
                .doesNotContain("onclick");
        postJson("/admin/help/revisions/" + helpRevision.path("id").asString() + "/activate",
                Map.of("actorUserId", ADMIN_ID),
                DEMO_SESSION);
        JsonNode activeHelp = getJson("/help/active?lang=en", DEMO_SESSION);
        assertThat(activeHelp.path("activeRevision").path("title").asString()).isEqualTo("E2E Help Contract");

        JsonNode savedPrivacy = postJson("/admin/privacy/revisions", privacyRevisionPayload(), DEMO_SESSION);
        JsonNode privacyRevision = revisionByTitle(savedPrivacy.path("revisions"), "E2E Privacy Contract");
        postJson("/admin/privacy/revisions/" + privacyRevision.path("id").asString() + "/activate",
                Map.of("actorUserId", ADMIN_ID),
                DEMO_SESSION);
        JsonNode consent = postJson("/privacy/consents", Map.of(
                "userId", MEDIA_USER_ID,
                "revisionId", privacyRevision.path("id").asString(),
                "revisionVersion", privacyRevision.path("version").asInt(),
                "approvedOptionalSectionIds", List.of("analytics", "missing"),
                "source", "entry"), DEMO_SESSION);
        assertThat(ids(consent.path("approvedOptionalSectionIds"))).containsExactly("analytics");
        assertThat(consent.path("source").asString()).isEqualTo("entry");

        JsonNode savedIdea = postJson("/admin/ideas", ideaPayload(imageUrl), DEMO_SESSION);
        assertThat(savedIdea.path("contentHtml").asString())
                .doesNotContain("script")
                .doesNotContain("javascript:");
        JsonNode landing = getJson("/landing/content?lang=en&latitude=47.4979&longitude=19.0402", DEMO_SESSION);
        assertThat(landing.path("privacy").path("activeRevision").path("title").asString())
                .isEqualTo("E2E Privacy Contract");
        assertThat(ids(landing.path("ideas"), "id")).contains("e2e-content-idea");
        assertThat(landing.path("loginAvailability").path("eligible").asBoolean()).isTrue();
        assertThat(landing.path("loginAvailability").path("partitionKey").asString()).isEqualTo("country:hu");

        deleteJson("/admin/ideas/e2e-content-idea", Map.of("actorUserId", ADMIN_ID), DEMO_SESSION);
        assertThat(ids(getJson("/landing/content?lang=en", DEMO_SESSION).path("ideas"), "id"))
                .doesNotContain("e2e-content-idea");
        JsonNode restoredIdea = postJson("/admin/ideas/e2e-content-idea/restore",
                Map.of("actorUserId", ADMIN_ID),
                DEMO_SESSION);
        assertThat(restoredIdea.path("trashed").asBoolean()).isFalse();
        assertThat(restoredIdea.path("published").asBoolean()).isFalse();

        JsonNode eventShareToken = postJson("/share-tokens", Map.of(
                "kind", "event",
                "entityId", SHARE_EVENT_ID,
                "ownerUserId", MEDIA_USER_ID));
        JsonNode resolvedEvent = getJson("/share-tokens/resolve?token=" + encode(eventShareToken.path("token").asString())
                + "&userId=" + MEDIA_USER_ID);
        assertThat(resolvedEvent.path("kind").asString()).isEqualTo("event");
        assertThat(resolvedEvent.path("entityId").asString()).isEqualTo(SHARE_EVENT_ID);
        assertThat(resolvedEvent.path("title").asString()).isEqualTo("Shareable Backend Picnic");

        JsonNode assetShareToken = postJson("/share-tokens", Map.of(
                "kind", "asset",
                "entityId", SHARE_ASSET_ID,
                "assetType", AssetCatalog.TYPE_TRANSPORT,
                "ownerUserId", MEDIA_USER_ID));
        JsonNode resolvedAsset = getJson("/share-tokens/resolve?token=" + encode(assetShareToken.path("token").asString())
                + "&userId=" + MEDIA_USER_ID);
        assertThat(resolvedAsset.path("kind").asString()).isEqualTo("asset");
        assertThat(resolvedAsset.path("entityId").asString()).isEqualTo(SHARE_ASSET_ID);
        assertThat(resolvedAsset.path("ownerUserId").asString()).isEqualTo(MEDIA_USER_ID);
    }

    @Test
    void moderationReportWarnBlockAndUnblockWorkThroughHttp() {
        JsonNode report = postJson("/auth/me/report-user", reportPayload(), DEMO_SESSION);
        assertThat(report.path("submitted").asBoolean()).isTrue();

        JsonNode feedback = postJson("/auth/me/feedback", Map.of(
                "userId", REPORTER_ID,
                "category", "safety",
                "subject", "Moderation feedback",
                "details", "Please review the reporting flow."), DEMO_SESSION);
        assertThat(feedback.path("submitted").asBoolean()).isTrue();

        JsonNode dashboard = getJson("/admin/dashboard?adminUserId=" + ADMIN_ID, DEMO_SESSION);
        assertThat(ids(dashboard.path("reportedUsers"), "userId")).contains(TARGET_ID);
        assertThat(ids(dashboard.path("feedback"), "userId")).contains(REPORTER_ID);

        postJson("/admin/users/" + TARGET_ID + "/warn", Map.of(
                "adminUserId", ADMIN_ID,
                "message", "E2E warning from moderation."), DEMO_SESSION);
        JsonNode targetChatsAfterWarn = getJson("/activities/chats?userId=" + TARGET_ID, DEMO_SESSION);
        JsonNode supportChat = chatById(targetChatsAfterWarn, "c-support-admin-" + TARGET_ID);
        assertThat(supportChat.path("unread").asInt()).isGreaterThanOrEqualTo(1);
        assertThat(supportChat.path("supportCase").path("status").asString()).isEqualTo("warned");
        assertThat(supportChat.path("lastMessage").asString()).contains("E2E warning");

        postJson("/admin/users/" + TARGET_ID + "/block", Map.of(
                "adminUserId", ADMIN_ID,
                "message", "E2E blocking after review."), DEMO_SESSION);
        JsonNode blockedUser = getJson("/auth/me?userId=" + TARGET_ID, DEMO_SESSION);
        assertThat(blockedUser.path("profileStatus").asString()).isEqualTo("blocked");
        assertThat(findDemoChat(ADMIN_ID, "c-support-admin-" + TARGET_ID).getSupportCase().getStatus()).isEqualTo("blocked");
        assertThat(fromDemo(() -> mongoTemplate.find(
                Query.query(Criteria.where("targetId").is(TARGET_ID)),
                AffinityRecomputeTask.class))).isNotEmpty();

        JsonNode dashboardAfterBlock = getJson("/admin/dashboard?adminUserId=" + ADMIN_ID, DEMO_SESSION);
        assertThat(ids(dashboardAfterBlock.path("blockedUsers"), "userId")).contains(TARGET_ID);

        postJson("/admin/users/" + TARGET_ID + "/unblock", Map.of(
                "adminUserId", ADMIN_ID,
                "message", "E2E unblock"), DEMO_SESSION);
        JsonNode unblockedUser = getJson("/auth/me?userId=" + TARGET_ID, DEMO_SESSION);
        assertThat(unblockedUser.path("profileStatus").asString()).isEqualTo("public");
    }

    @Test
    void failedProfileImageUploadLeavesProfileAndStorageCleanThroughHttp() {
        assertThat(getJson("/auth/me?userId=" + MEDIA_USER_ID).path("images")).isEmpty();

        mediaObjectStoreClient.failNextPut();
        int status = uploadStatus("/media/images", "image", Map.of(
                "ownerId", MEDIA_USER_ID,
                "entityId", "profile-0"),
                "profile.png",
                "image/png",
                pngBytes());

        assertThat(status).isEqualTo(503);
        assertThat(getJson("/auth/me?userId=" + MEDIA_USER_ID).path("images")).isEmpty();
        assertThat(mediaObjectStoreClient.storedObjectCount()).isZero();
    }

    private void clearE2eCollections() {
        mongoTemplate.remove(new Query(), Users.class);
        mongoTemplate.remove(new Query(), com.raxim.myscoutee.domain.accounts.document.UserSessionState.class);
        mongoTemplate.remove(new Query(), ActivityEvent.class);
        mongoTemplate.remove(new Query(), ActivityMember.class);
        mongoTemplate.remove(new Query(), Asset.class);
        mongoTemplate.remove(new Query(), ShareToken.class);
        mongoTemplate.remove(new Query(), HelpCenterRevision.class);
        mongoTemplate.remove(new Query(), HelpCenterAuditEntry.class);
        mongoTemplate.remove(new Query(), PrivacyConsent.class);
        mongoTemplate.remove(new Query(), IdeaPost.class);
        mongoTemplate.remove(new Query(), UserFeedbackSubmission.class);
        mongoTemplate.remove(new Query(), UserReportSubmission.class);
        mongoTemplate.remove(new Query(), Chat.class);
        mongoTemplate.remove(new Query(), AffinityRecomputeTask.class);
    }

    private void seedUsers() {
        List<Users> users = new ArrayList<>();
        for (int index = 1; index <= 50; index++) {
            users.add(user(index));
        }
        mongoTemplate.insert(users, Users.class);
    }

    private Users user(int index) {
        String userId = userId(index);
        Users user = new Users();
        user.setMongoId(userId);
        user.setSyncKey("sync-" + userId + "-" + UUID.randomUUID());
        user.setId(userId);
        user.setEmail(userId + "@example.test");
        user.setName("Content User " + String.format("%02d", index));
        user.setInitials("CU");
        user.setAge(24 + (index % 12));
        user.setCity(index % 3 == 0 ? "Budapest" : "Bratislava");
        user.setGender(index % 2 == 0 ? "man" : "woman");
        user.setStatus("A");
        user.setProfileStatus("public");
        user.setCompletion(100);
        user.setProfileFormVersion(1);
        user.setHeadline("Backend e2e content user");
        user.setAbout("Seeded for content, media, and moderation e2e coverage.");
        user.setPartitionKey("country:hu");
        user.setImages(new ArrayList<>());
        user.setLocationCoordinates(new Users.LocationCoordinatesRecord(47.4979d, 19.0402d));
        user.setActivities(new Users.UserActivitiesRecord(
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                new Users.UserChatCountersRecord(0, 0, 0, 0, 0, 0),
                new Users.UserEventCountersRecord(0, 0, 0, 0, 0, 0, 0),
                new Users.UserAssetCountersRecord(0, 0, 0, 0),
                new Users.UserFeedbackCountersRecord(0, 0, 0, 0),
                0, 0));
        return user;
    }

    private Map<String, Object> userProfilePayloadWithImages(String userId, List<String> images) {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("id", userId);
        payload.put("name", "Content User 03");
        payload.put("age", 27);
        payload.put("birthday", "");
        payload.put("city", "Budapest");
        payload.put("height", "");
        payload.put("physique", "");
        payload.put("languages", List.of());
        payload.put("horoscope", "");
        payload.put("initials", "CU");
        payload.put("gender", "woman");
        payload.put("statusText", "");
        payload.put("hostTier", "");
        payload.put("traitLabel", "");
        payload.put("completion", 100);
        payload.put("profileFormVersion", 1);
        payload.put("headline", "Backend e2e content user");
        payload.put("about", "Seeded for content, media, and moderation e2e coverage.");
        payload.put("affinity", 0);
        payload.put("locationCoordinates", new LocationCoordinatesDto(47.4979d, 19.0402d));
        payload.put("partitionKey", "country:hu");
        payload.put("images", images);
        payload.put("profileDetails", List.of());
        payload.put("impressions", null);
        payload.put("profileStatus", "public");
        payload.put("previousProfileStatus", "");
        payload.put("deletedAtIso", null);
        payload.put("admin", false);
        payload.put("activities", null);
        return payload;
    }

    private void seedShareEvent() {
        ActivityEvent event = new ActivityEvent();
        event.setId(new ObjectId().toHexString());
        event.setSyncKey("content-share-event-" + UUID.randomUUID());
        event.setSourceId(SHARE_EVENT_ID);
        event.setOwnerUserId(MEDIA_USER_ID);
        event.setCreatorUserId(MEDIA_USER_ID);
        event.setStatus("A");
        event.setStatus("A");
        event.setTitle("Shareable Backend Picnic");
        event.setTimeframe("Saturday afternoon");
        event.setSubtitle("Backend share token e2e");
        event.setImageUrl("https://example.test/share-event.png");
        event.setSourceLink("/activities/events/" + SHARE_EVENT_ID);
        event.setStartAtIso(BASE_TIME.plus(Duration.ofDays(5)).toString());
        event.setEndAtIso(BASE_TIME.plus(Duration.ofDays(5)).plus(Duration.ofHours(2)).toString());
        event.setLocation("Budapest");
        event.setLocationCoordinates(new LocationCoordinatesDto(47.4979d, 19.0402d));
        event.setCapacityMin(1);
        event.setCapacityMax(8);
        event.setCapacityTotal(8);
        event.setCreatedDate(BASE_TIME.toString());
        event.setCreatedUser(MEDIA_USER_ID);
        event.setUpdatedDate(BASE_TIME.toString());
        event.setUpdatedUser(MEDIA_USER_ID);
        event.normalizeLifecycleState();
        mongoTemplate.insert(event);
    }

    private void seedReportableEvent() {
        ActivityEvent event = new ActivityEvent();
        event.setId(new ObjectId().toHexString());
        event.setSyncKey("content-report-event-" + UUID.randomUUID());
        event.setSourceId(REPORT_EVENT_ID);
        event.setOwnerUserId(REPORTER_ID);
        event.setCreatorUserId(REPORTER_ID);
        event.setStatus("A");
        event.setStatus("A");
        event.setTitle("Reportable Backend Dinner");
        event.setTimeframe("Friday evening");
        event.setStartAtIso(BASE_TIME.plus(Duration.ofDays(2)).toString());
        event.setEndAtIso(BASE_TIME.plus(Duration.ofDays(2)).plus(Duration.ofHours(2)).toString());
        event.setLocation("Budapest");
        event.setLocationCoordinates(new LocationCoordinatesDto(47.4979d, 19.0402d));
        event.setCapacityMin(2);
        event.setCapacityMax(6);
        event.setCapacityTotal(6);
        event.setCreatedDate(BASE_TIME.toString());
        event.setCreatedUser(REPORTER_ID);
        event.setUpdatedDate(BASE_TIME.toString());
        event.setUpdatedUser(REPORTER_ID);
        event.normalizeLifecycleState();
        mongoTemplate.insert(event);
        mongoTemplate.insert(List.of(
                acceptedMember(REPORT_EVENT_ID, REPORTER_ID, "Member"),
                acceptedMember(REPORT_EVENT_ID, TARGET_ID, "Member")),
                ActivityMember.class);
    }

    private ActivityMember acceptedMember(String ownerId, String userId, String role) {
        ActivityMember member = new ActivityMember();
        member.setId(new ObjectId().toHexString());
        member.setSyncKey("member-" + ownerId + "-" + userId + "-" + UUID.randomUUID());
        member.setOwnerType("event");
        member.setOwnerId(ownerId);
        member.setUserId(userId);
        member.setRole(role);
        member.setStatus("accepted");
        member.setActionAtIso(BASE_TIME.toString());
        member.setMetAtIso(BASE_TIME.toString());
        member.setCreatedDate(BASE_TIME.toString());
        member.setCreatedUser("e2e");
        member.setUpdatedDate(BASE_TIME.toString());
        member.setUpdatedUser("e2e");
        return member;
    }

    private void seedShareAsset() {
        Asset asset = new Asset();
        asset.setId(new ObjectId().toHexString());
        asset.setSyncKey("content-share-asset-" + UUID.randomUUID());
        asset.setAssetId(SHARE_ASSET_ID);
        asset.setOwnerUserId(MEDIA_USER_ID);
        asset.setType(AssetCatalog.TYPE_TRANSPORT);
        asset.setTitle("Shareable Backend Transport");
        asset.setSubtitle("Transport - Budapest");
        asset.setCity("Budapest");
        asset.setDetails("A backend e2e transport asset that can be resolved from a share token.");
        asset.setImageUrl("https://example.test/share-transport.png");
        asset.setSourceLink("/assets/" + SHARE_ASSET_ID);
        asset.setStatus("A");
        asset.setVisibility("Public");
        asset.setCapacityTotal(4);
        asset.setQuantity(1);
        asset.setCreatedDate(BASE_TIME.toString());
        asset.setCreatedUser(MEDIA_USER_ID);
        asset.setUpdatedDate(BASE_TIME.toString());
        asset.setUpdatedUser(MEDIA_USER_ID);
        mongoTemplate.insert(asset);
    }

    private Map<String, Object> helpRevisionPayload() {
        return Map.of(
                "actorUserId", ADMIN_ID,
                "lang", "en",
                "title", "E2E Help Contract",
                "summary", "HTTP-saved help content",
                "description", "Content saved through the admin backend.",
                "headerColor", "#123456",
                "sections", List.of(Map.of(
                        "id", "getting-started",
                        "icon", "sparkles",
                        "title", "Getting started",
                        "blurb", "Backend e2e help",
                        "contentHtml", "<p onclick=\"bad()\">Useful help</p><script>bad()</script>",
                        "imageUrls", List.of("https://example.test/help.png"))));
    }

    private Map<String, Object> privacyRevisionPayload() {
        return Map.of(
                "actorUserId", ADMIN_ID,
                "lang", "en",
                "title", "E2E Privacy Contract",
                "summary", "Privacy saved by e2e",
                "description", "Privacy content saved through the admin backend.",
                "sections", List.of(
                        Map.of(
                                "id", "required",
                                "title", "Required privacy terms",
                                "contentHtml", "<p>Required terms</p>",
                                "optional", false),
                        Map.of(
                                "id", "analytics",
                                "title", "Analytics",
                                "contentHtml", "<p>Optional analytics</p>",
                                "optional", true)));
    }

    private Map<String, Object> ideaPayload(String imageUrl) {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("actorUserId", ADMIN_ID);
        payload.put("id", "e2e-content-idea");
        payload.put("contentKey", "e2e-content-idea");
        payload.put("lang", "en");
        payload.put("title", "E2E Content Idea");
        payload.put("excerpt", "Published through backend e2e.");
        payload.put("contentHtml", "<article><p>Safe article</p><a href=\"javascript:bad()\">bad</a><script>bad()</script></article>");
        payload.put("imageUrl", imageUrl);
        payload.put("imageUrls", List.of(imageUrl));
        payload.put("featured", true);
        payload.put("published", true);
        payload.put("submittedAtIso", BASE_TIME.toString());
        return payload;
    }

    private Map<String, Object> reportPayload() {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("userId", REPORTER_ID);
        payload.put("handle", "unsafe-match");
        payload.put("reason", "harassment");
        payload.put("details", "Backend e2e report");
        payload.put("targetUserId", TARGET_ID);
        payload.put("eventId", REPORT_EVENT_ID);
        payload.put("eventTitle", "Reportable Backend Dinner");
        payload.put("eventStartAtIso", BASE_TIME.plus(Duration.ofDays(2)).toString());
        payload.put("sourceType", "profile");
        payload.put("sourceId", TARGET_ID);
        payload.put("sourceText", "Reported from backend e2e");
        return payload;
    }

    private JsonNode revisionByTitle(JsonNode revisions, String title) {
        for (JsonNode revision : revisions) {
            if (title.equals(revision.path("title").asString())) {
                return revision;
            }
        }
        throw new AssertionError("Missing revision " + title + " in " + revisions);
    }

    private JsonNode chatById(JsonNode chats, String chatId) {
        for (JsonNode chat : chats) {
            if (chatId.equals(chat.path("id").asString())) {
                return chat;
            }
        }
        throw new AssertionError("Missing chat " + chatId + " in " + chats);
    }

    private Chat findDemoChat(String ownerUserId, String chatId) {
        Chat chat = fromDemo(() -> mongoTemplate.findOne(
                Query.query(Criteria.where("ownerUserId").is(ownerUserId).and("chatId").is(chatId)),
                Chat.class));
        assertThat(chat).as("chat " + chatId + " for " + ownerUserId).isNotNull();
        return chat;
    }

    private JsonNode uploadImage(
            String path,
            String fileFieldName,
            Map<String, String> fields,
            String filename,
            String contentType,
            byte[] bytes) {
        HttpResponse<String> response = postMultipart(path, fileFieldName, fields, filename, contentType, bytes);
        assertOk(path, response.statusCode(), response.body());
        return parse(response.body());
    }

    private int uploadStatus(
            String path,
            String fileFieldName,
            Map<String, String> fields,
            String filename,
            String contentType,
            byte[] bytes) {
        return postMultipart(path, fileFieldName, fields, filename, contentType, bytes).statusCode();
    }

    private HttpResponse<String> postMultipart(
            String path,
            String fileFieldName,
            Map<String, String> fields,
            String filename,
            String contentType,
            byte[] bytes) {
        String boundary = "----e2e-" + UUID.randomUUID();
        byte[] body = multipartBody(boundary, fileFieldName, fields, filename, contentType, bytes);
        return sendString(HttpRequest.newBuilder(uri(path))
                .header("Accept", "application/json")
                .header("X-App-Session-Id", "e2e-media-session")
                .header("Content-Type", "multipart/form-data; boundary=" + boundary)
                .POST(HttpRequest.BodyPublishers.ofByteArray(body))
                .build());
    }

    private byte[] multipartBody(
            String boundary,
            String fileFieldName,
            Map<String, String> fields,
            String filename,
            String contentType,
            byte[] bytes) {
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        for (Map.Entry<String, String> field : fields.entrySet()) {
            output.writeBytes(("--" + boundary + "\r\n").getBytes(StandardCharsets.UTF_8));
            output.writeBytes(("Content-Disposition: form-data; name=\"" + field.getKey() + "\"\r\n\r\n")
                    .getBytes(StandardCharsets.UTF_8));
            output.writeBytes(field.getValue().getBytes(StandardCharsets.UTF_8));
            output.writeBytes("\r\n".getBytes(StandardCharsets.UTF_8));
        }
        output.writeBytes(("--" + boundary + "\r\n").getBytes(StandardCharsets.UTF_8));
        output.writeBytes(("Content-Disposition: form-data; name=\"" + fileFieldName + "\"; filename=\"" + filename + "\"\r\n")
                .getBytes(StandardCharsets.UTF_8));
        output.writeBytes(("Content-Type: " + contentType + "\r\n\r\n").getBytes(StandardCharsets.UTF_8));
        output.writeBytes(bytes);
        output.writeBytes(("\r\n--" + boundary + "--\r\n").getBytes(StandardCharsets.UTF_8));
        return output.toByteArray();
    }

    private void seedMediaSession() throws Exception {
        // Fixture-issued media credential, using the same stored session contract as the dev qualification.
        String token = java.util.Base64.getUrlEncoder().withoutPadding()
                .encodeToString(MEDIA_USER_ID.getBytes(StandardCharsets.UTF_8)) + "."
                + UUID.randomUUID().toString().replace("-", "") + UUID.randomUUID().toString().replace("-", "");
        String hash = java.util.HexFormat.of().formatHex(java.security.MessageDigest.getInstance("SHA-256")
                .digest(token.getBytes(StandardCharsets.UTF_8)));
        var state = new com.raxim.myscoutee.domain.accounts.document.UserSessionState();
        state.setId(MEDIA_USER_ID);
        state.setUserId(MEDIA_USER_ID);
        var session = new com.raxim.myscoutee.domain.accounts.document.UserSessionState.ActiveSession();
        session.setSessionId("e2e-media-session");
        session.setMediaTokenHash(hash);
        state.setActiveSessions(List.of(session));
        withReal(() -> mongoTemplate.save(state));
        mediaCookie = "myscoutee_media_session=" + token;
    }

    private void assertPrivateMedia(String mediaUrl, String contentType, byte[] bytes) {
        HttpResponse<byte[]> response = sendBytes(HttpRequest.newBuilder(uri(mediaUrl.replaceFirst("^/api/", "/")))
                .header("Cookie", mediaCookie)
                .GET()
                .build());
        assertThat(response.statusCode()).as(mediaUrl).isEqualTo(200);
        assertThat(response.headers().firstValue("content-type")).contains(contentType);
        assertThat(response.body()).isEqualTo(bytes);
        assertThat(extractPublicKey(mediaUrl)).isNotBlank();
    }

    private void assertPrivateMediaContentType(String mediaUrl, String contentType) {
        HttpResponse<byte[]> response = sendBytes(HttpRequest.newBuilder(uri(mediaUrl.replaceFirst("^/api/", "/")))
                .header("Cookie", mediaCookie)
                .GET()
                .build());
        assertThat(response.statusCode()).as(mediaUrl).isEqualTo(200);
        assertThat(response.headers().firstValue("content-type")).contains(contentType);
        assertThat(response.body()).isNotEmpty();
        assertThat(extractPublicKey(mediaUrl)).isNotBlank();
    }

    private String mediaUploadUrl(JsonNode upload, String fieldName, String fallback) {
        String directValue = textOrNull(upload.path(fieldName));
        if (directValue != null) {
            return directValue;
        }
        String nestedValue = textOrNull(upload.path("imageSet").path(fieldName));
        return nestedValue == null ? fallback : nestedValue;
    }

    private String textOrNull(JsonNode node) {
        String value = node.asString();
        return value == null || value.isBlank() ? null : value.trim();
    }

    private byte[] pngBytes() {
        try {
            var image = new java.awt.image.BufferedImage(2, 2, java.awt.image.BufferedImage.TYPE_INT_RGB);
            image.setRGB(0, 0, 0xff0000);
            var output = new ByteArrayOutputStream();
            assertThat(javax.imageio.ImageIO.write(image, "png", output)).isTrue();
            return output.toByteArray();
        } catch (java.io.IOException exception) {
            throw new AssertionError("Unable to generate the PNG fixture", exception);
        }
    }

    private byte[] wavBytes() {
        return new byte[] {
                82, 73, 70, 70, 36, 0, 0, 0,
                87, 65, 86, 69, 102, 109, 116, 32,
                16, 0, 0, 0, 1, 0, 1, 0,
                64, 31, 0, 0, 64, 31, 0, 0,
                1, 0, 8, 0, 100, 97, 116, 97,
                0, 0, 0, 0
        };
    }

    private JsonNode getJson(String path) {
        return getJson(path, null);
    }

    private JsonNode getJson(String path, String sessionKind) {
        HttpRequest.Builder builder = HttpRequest.newBuilder(uri(path))
                .header("Accept", "application/json")
                .header("X-App-Session-Id", "e2e-media-session")
                .GET();
        applySessionHeader(builder, sessionKind);
        HttpResponse<String> response = sendString(builder.build());
        assertOk(path, response.statusCode(), response.body());
        return parse(response.body());
    }

    private JsonNode postJson(String path, Object body) {
        return postJson(path, body, null);
    }

    private JsonNode postJson(String path, Object body, String sessionKind) {
        if (body instanceof Map<?, ?> payload && payload.get("userId") instanceof String actorId) {
            path += (path.contains("?") ? "&" : "?") + "userId=" + actorId;
        }
        String json = writeJson(body);
        HttpRequest.Builder builder = HttpRequest.newBuilder(uri(path))
                .header("Accept", "application/json")
                .header("X-App-Session-Id", "e2e-media-session")
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(json));
        applySessionHeader(builder, sessionKind);
        HttpResponse<String> response = sendString(builder.build());
        assertOk(path, response.statusCode(), response.body());
        return parse(response.body());
    }

    private JsonNode deleteJson(String path, Object body, String sessionKind) {
        String json = writeJson(body);
        HttpRequest.Builder builder = HttpRequest.newBuilder(uri(path))
                .header("Accept", "application/json")
                .header("X-App-Session-Id", "e2e-media-session")
                .header("Content-Type", "application/json")
                .method("DELETE", HttpRequest.BodyPublishers.ofString(json));
        applySessionHeader(builder, sessionKind);
        HttpResponse<String> response = sendString(builder.build());
        assertOk(path, response.statusCode(), response.body());
        return parse(response.body());
    }

    private void applySessionHeader(HttpRequest.Builder builder, String sessionKind) {
        if (sessionKind != null && !sessionKind.isBlank()) {
            builder.header(SESSION_KIND_HEADER, sessionKind);
        }
    }

    private URI uri(String path) {
        return URI.create("http://localhost:" + port + path);
    }

    private HttpResponse<String> sendString(HttpRequest request) {
        try {
            return httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        } catch (Exception exception) {
            throw new AssertionError("HTTP request failed: " + request.uri(), exception);
        }
    }

    private HttpResponse<byte[]> sendBytes(HttpRequest request) {
        try {
            return httpClient.send(request, HttpResponse.BodyHandlers.ofByteArray());
        } catch (Exception exception) {
            throw new AssertionError("HTTP request failed: " + request.uri(), exception);
        }
    }

    private void assertOk(String path, int status, String body) {
        assertThat(status >= 200 && status < 300)
                .as(path + " returned " + status + " body=" + body)
                .isTrue();
    }

    private JsonNode parse(String json) {
        try {
            return objectMapper.readTree(json);
        } catch (Exception exception) {
            throw new AssertionError("Invalid JSON: " + json, exception);
        }
    }

    private String writeJson(Object body) {
        try {
            return objectMapper.writeValueAsString(body);
        } catch (Exception exception) {
            throw new AssertionError("Unable to write JSON", exception);
        }
    }

    private String encode(String value) {
        return java.net.URLEncoder.encode(value, StandardCharsets.UTF_8);
    }

    private String extractPublicKey(String mediaUrl) {
        int keyIndex = mediaUrl.indexOf("key=");
        if (keyIndex < 0) {
            return "";
        }
        return URLDecoder.decode(mediaUrl.substring(keyIndex + 4), StandardCharsets.UTF_8);
    }

    private List<String> ids(JsonNode array) {
        List<String> values = new ArrayList<>();
        for (JsonNode item : array) {
            values.add(item.asString());
        }
        return values;
    }

    private List<String> ids(JsonNode array, String field) {
        List<String> values = new ArrayList<>();
        for (JsonNode item : array) {
            values.add(item.path(field).asString());
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

    private static String userId(int index) {
        return "e2e-content-u" + String.format("%02d", index);
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
            Document document = new Document("_id", "country-hu-e2e-content")
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
            Document document = new Document("_id", "affinity-config-e2e-content")
                    .append("key", "default")
                    .append("active", true)
                    .append("version", 100)
                    .append("jobs", jobs)
                    .append("notifications", notifications)
                    .append("changedDate", BASE_TIME.toString())
                    .append("changedUser", "e2e")
                    .append("changedSection", "content-media-e2e")
                    .append("changeSummary", "Content media e2e platform parameters.");
            client.getDatabase(databaseName)
                    .getCollection("affinityConfigs")
                    .replaceOne(
                            Filters.eq("_id", "affinity-config-e2e-content"),
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
        InMemoryMediaObjectStoreClient mediaObjectStoreClient() {
            return new InMemoryMediaObjectStoreClient();
        }
    }

    private static class InMemoryMediaObjectStoreClient implements MediaObjectStoreClient {
        private final Map<String, com.raxim.myscoutee.domain.media.api.MediaStorage.StoredMediaObject> objects = new ConcurrentHashMap<>();
        private volatile boolean failNextPut;

        @Override
        public boolean isEnabled() {
            return true;
        }

        @Override
        public void putObject(String bucket, String key, String contentType, byte[] bytes) {
            if (failNextPut) {
                failNextPut = false;
                throw new IllegalStateException("E2E media store failure");
            }
            objects.put(storageKey(bucket, key), new com.raxim.myscoutee.domain.media.api.MediaStorage.StoredMediaObject(bytes.clone(), contentType));
        }

        @Override
        public com.raxim.myscoutee.domain.media.api.MediaStorage.StoredMediaObject getObject(String bucket, String key) {
            com.raxim.myscoutee.domain.media.api.MediaStorage.StoredMediaObject stored = objects.get(storageKey(bucket, key));
            if (stored == null || stored.bytes() == null) {
                return null;
            }
            return new com.raxim.myscoutee.domain.media.api.MediaStorage.StoredMediaObject(stored.bytes().clone(), stored.contentType());
        }

        @Override
        public void deleteObject(String bucket, String key) {
            objects.remove(storageKey(bucket, key));
        }

        void failNextPut() {
            failNextPut = true;
        }

        int storedObjectCount() {
            return objects.size();
        }

        private String storageKey(String bucket, String key) {
            return bucket + ":" + key;
        }
    }
}
