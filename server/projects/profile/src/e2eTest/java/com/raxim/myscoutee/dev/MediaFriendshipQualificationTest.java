package com.raxim.myscoutee.dev;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assumptions.assumeTrue;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Date;
import java.util.HexFormat;
import java.util.List;
import java.util.UUID;
import org.bson.Document;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.repository.support.MongoRepositoryFactory;
import com.mongodb.client.MongoClients;
import com.raxim.myscoutee.domain.media.config.MediaStorageProperties;
import com.raxim.myscoutee.domain.events.repository.ActivityMembersRepository;
import com.raxim.myscoutee.domain.events.service.EventFriendshipProjectionService;
import com.raxim.myscoutee.domain.media.service.S3CompatibleMediaObjectStoreClient;

import com.raxim.myscoutee.domain.affinity.repository.UserRatesRepository;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;
import com.raxim.myscoutee.domain.affinity.service.UserRatesService;
import com.raxim.myscoutee.domain.accounts.service.HomeUserProfileService;
import com.raxim.myscoutee.domain.affinity.service.AffinityCalculationService;
import com.raxim.myscoutee.domain.affinity.service.UserAffinityEdgeService;
import com.raxim.myscoutee.domain.administration.service.AdminTelemetryService;
import static org.mockito.Mockito.mock;

/** Opt-in disposable fixture against the existing dev Mongo/MinIO/API; starts no server.
 * Session cookies are fixture-issued. This does not prove external Firebase sign-in. */
@Tag("qualification")
@Tag("dev")
@Tag("integration")
class MediaFriendshipQualificationTest {
    @Test
    void demoMediaSessionUsesProfileVisibilityAndRejectsRevokedOrAlteredCredentials() throws Exception {
        assumeTrue("true".equals(System.getenv("QA_MEDIA_FRIENDSHIP_FIXTURE")));
        assertThat(System.getenv("SPRING_PROFILES_ACTIVE")).isEqualTo("dev");
        assertThat(System.getenv("MONGODB_DATABASE")).isEqualTo("demo_db");
        String prefix = "qa-media-session-" + UUID.randomUUID();
        String owner = prefix + "-owner", viewer = prefix + "-viewer";
        String uri = "mongodb://" + encoded(env("MONGODB_USERNAME", "guest")) + ":"
                + encoded(env("MONGODB_PASSWORD", "guest")) + "@mongodb:27017/demo_db?authSource=demo_db";
        MediaStorageProperties storage = new MediaStorageProperties();
        storage.setEndpoint("http://minio:9000");
        storage.setBucket(env("MEDIA_BUCKET", "myscoutee-media"));
        storage.setAccessKey(env("MEDIA_OBJECT_STORE_ACCESS_KEY", "minioadmin"));
        storage.setSecretKey(env("MEDIA_OBJECT_STORE_SECRET_KEY", "minioadmin"));
        var objects = new S3CompatibleMediaObjectStoreClient(storage);
        List<String> keys = new ArrayList<>();
        byte[] png = Base64.getDecoder().decode("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9Zl1sAAAAASUVORK5CYII=");
        try (var client = MongoClients.create(uri)) {
            var db = client.getDatabase("demo_db");
            try {
                for (String user : List.of(owner, viewer)) {
                    db.getCollection("users").insertOne(new Document("_id", user).append("userId", user)
                            .append("email", user + "@myscoutee.local").append("profileStatus", "public"));
                }
                String retainedRealCookie = session(db, viewer);
                String key = "private/images/" + owner + "/" + owner + "/fixture/large.webp";
                put(objects, storage, keys, key, png);
                assertBytes(key, retainedRealCookie, png);
                var profileRequest = HttpRequest.newBuilder(URI.create("http://nginx/api/auth/me"))
                        .header("X-App-Session-Kind", "demo").header("X-Demo-User-Id", viewer)
                        .header("X-App-Session-Id", "fixture").GET().build();
                var profile = HttpClient.newHttpClient().send(profileRequest, HttpResponse.BodyHandlers.ofString());
                assertThat(profile.statusCode()).isEqualTo(200);
                String setCookie = profile.headers().allValues("set-cookie").stream()
                        .filter(value -> value.startsWith("myscoutee_media_session=")).findFirst().orElseThrow();
                String cookie = setCookie.substring("myscoutee_media_session=".length()).split(";", 2)[0];
                assertThat(cookie).startsWith("demo.");
                assertBytes(key, cookie, png);
                assertStatus(key, null, 401);
                assertStatus(key, "invalid", 401);
                assertStatus(key, cookie.substring("demo.".length()), 401);
                db.getCollection("users").updateOne(new Document("_id", owner),
                        new Document("$set", new Document("profileStatus", "private")));
                assertStatus(key, cookie, 403);
                db.getCollection("users").updateOne(new Document("_id", owner),
                        new Document("$set", new Document("profileStatus", "public")));
                assertBytes(key, cookie, png);
                db.getCollection("userSessionStates").deleteOne(new Document("_id", viewer));
                assertStatus(key, cookie, 401);
            } finally {
                db.getCollection("users").deleteMany(new Document("_id", new Document("$in", List.of(owner, viewer))));
                db.getCollection("userSessionStates").deleteOne(new Document("_id", viewer));
                for (String key : keys) objects.deleteObject(storage.getBucket(), key);
            }
            assertThat(db.getCollection("users").countDocuments(new Document("_id", new Document("$in", List.of(owner, viewer))))).isZero();
            assertThat(db.getCollection("userSessionStates").countDocuments(new Document("_id", viewer))).isZero();
        }
    }

    @Test
    void completedParticipationAndMediaVisibilityUseTheRealDatabaseAndHttpBoundary() throws Exception {
        assumeTrue("true".equals(System.getenv("QA_MEDIA_FRIENDSHIP_FIXTURE")));
        assertThat(System.getenv("SPRING_PROFILES_ACTIVE")).isEqualTo("dev");
        assertThat(System.getenv("MONGODB_DATABASE")).isEqualTo("demo_db");
        String prefix = "qa-media-" + UUID.randomUUID();
        String owner = prefix + "-owner", viewer = prefix + "-viewer", outsider = prefix + "-outsider";
        Instant firstEnd = Instant.now().plusSeconds(300);
        String uri = "mongodb://" + encoded(env("MONGODB_USERNAME", env("MONGO_APP_USERNAME", "guest"))) + ":"
                + encoded(env("MONGODB_PASSWORD", env("MONGO_APP_PASSWORD", "guest"))) + "@mongodb:27017/demo_db?authSource=demo_db";
        MediaStorageProperties storage = new MediaStorageProperties();
        storage.setEndpoint("http://minio:9000");
        storage.setBucket(env("MEDIA_BUCKET", "myscoutee-media"));
        storage.setAccessKey(env("MEDIA_OBJECT_STORE_ACCESS_KEY", env("MINIO_ROOT_USER", "minioadmin")));
        storage.setSecretKey(env("MEDIA_OBJECT_STORE_SECRET_KEY", env("MINIO_ROOT_PASSWORD", "minioadmin")));
        var objects = new S3CompatibleMediaObjectStoreClient(storage);
        List<String> keys = new ArrayList<>();
        byte[] png = Base64.getDecoder().decode("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9Zl1sAAAAASUVORK5CYII=");
        try (var client = MongoClients.create(uri)) {
            var db = client.getDatabase("demo_db");
            MongoTemplate mongo = new MongoTemplate(client, "demo_db");
            var members = new MongoRepositoryFactory(mongo).getRepository(ActivityMembersRepository.class);
            var ratesRepository = new MongoRepositoryFactory(mongo).getRepository(UserRatesRepository.class);
            var rates = new UserRatesService(ratesRepository, mock(com.raxim.myscoutee.domain.accounts.api.RatingProfiles.class),
                    mock(HomeUserProfileService.class), mock(HomeUserProfileService.class), mock(HomeUserProfileService.class), mock(AffinityCalculationService.class),
                    mock(UserAffinityEdgeService.class), mongo, mock(AdminTelemetryService.class), null, null, org.mockito.Mockito.mock(com.raxim.myscoutee.domain.accounts.service.OrganizerFollowingService.class));
            var projector = new EventFriendshipProjectionService(mongo, members, rates);
            // Never let the test clock expire an unrelated fixture/seed event.
            assertThat(db.getCollection("events").countDocuments(new Document("status", "A")
                    .append("published", new Document("$ne", false))
                    .append("friendshipsProjected", new Document("$ne", true))
                    .append("endAtIso", new Document("$lte", firstEnd.plusSeconds(120).toString())))).isZero();
            try {
                db.getCollection("users").insertOne(new Document("_id", owner).append("userId", owner).append("profileStatus", "public"));
                String ownerCookie = session(db, owner), viewerCookie = session(db, viewer), outsiderCookie = session(db, outsider);
                String key = "private/images/" + owner + "/" + owner + "/fixture/large.webp";
                put(objects, storage, keys, key, png);
                assertStatus(key, null, 401);
                assertStatus(key, "invalid", 401);
                assertBytes(key, ownerCookie, png);
                assertBytes(key, viewerCookie, png);
                db.getCollection("users").updateOne(new Document("_id", owner), new Document("$set", new Document("profileStatus", "friends only")));
                assertStatus(key, viewerCookie, 403);
                String eventId = prefix + "-event";
                db.getCollection("events").insertOne(event(eventId, firstEnd));
                for (String user : List.of(owner, viewer, outsider, prefix + "-organizer")) {
                    db.getCollection("activityMembers").insertOne(new Document("_id", prefix + "-member-" + user)
                            .append("ownerType", "event").append("ownerId", eventId).append("userId", user)
                            .append("status", user.equals(outsider) ? "pending" : "accepted")
                            .append("organizerOnly", user.endsWith("-organizer")));
                }
                assertThat(projector.projectCompletedEvents(firstEnd.minusSeconds(1), 20)).isZero();
                assertStatus(key, viewerCookie, 403);
                assertThat(projector.projectCompletedEvents(firstEnd.plusSeconds(1), 20)).isEqualTo(1);
                var pairFilter = new Document("$or", List.of(new Document("leftUserId", owner), new Document("rightUserId", owner)));
                assertThat(db.getCollection("userFriendships").countDocuments(pairFilter)).isZero();
                Document metRate = db.getCollection("userRates").find(new Document("met", true)
                        .append("ownerUserId", owner).append("relatedUserId", viewer)).first();
                assertThat(metRate).isNotNull();
                assertThat(metRate.getInteger("scoreGiven")).isZero();
                assertThat(metRate.getInteger("scoreReceived")).isZero();
                db.getCollection("userFriendships").insertOne(new Document("_id", owner.length() + ":" + owner + viewer)
                        .append("leftUserId", owner).append("rightUserId", viewer)
                        .append("friendsSince", Date.from(firstEnd)).append("firstEventId", eventId)
                        .append("lastMetAt", Date.from(firstEnd)).append("lastEventId", eventId)
                        .append("lastEventName", "Media friendship fixture"));
                Document original = db.getCollection("userFriendships").find(pairFilter).first();
                assertThat(original.getDate("friendsSince")).isEqualTo(Date.from(firstEnd));
                assertThat(original.getString("firstEventId")).isEqualTo(eventId);
                assertThat(projector.projectCompletedEvents(firstEnd.plusSeconds(1), 20)).isZero();
                db.getCollection("events").updateOne(new Document("_id", eventId), new Document("$unset", new Document("friendshipsProjected", "")));
                assertThat(projector.projectCompletedEvents(firstEnd.plusSeconds(1), 20)).isEqualTo(1);
                assertThat(db.getCollection("userFriendships").find(pairFilter).first()).isEqualTo(original);
                String laterEvent = prefix + "-later-event";
                Instant laterEnd = firstEnd.plusSeconds(60);
                db.getCollection("events").insertOne(event(laterEvent, laterEnd));
                for (String user : List.of(owner, viewer)) {
                    db.getCollection("activityMembers").insertOne(new Document("_id", prefix + "-later-member-" + user)
                            .append("ownerType", "event").append("ownerId", laterEvent).append("userId", user)
                            .append("status", "accepted").append("organizerOnly", false));
                }
                assertThat(projector.projectCompletedEvents(laterEnd.plusSeconds(1), 20)).isEqualTo(1);
                Document updated = db.getCollection("userFriendships").find(pairFilter).first();
                assertThat(updated).isEqualTo(original);
                assertBytes(key, viewerCookie, png);
                assertStatus(key, outsiderCookie, 403);
                db.getCollection("users").updateOne(new Document("_id", owner), new Document("$set", new Document("profileStatus", "blocked")));
                assertStatus(key, viewerCookie, 403);
                String assetKey = "private/images/" + owner + "/asset/fixture/large.webp";
                put(objects, storage, keys, assetKey, png);
                db.getCollection("assets").insertOne(new Document("_id", prefix + "-asset").append("assetId", prefix + "-asset")
                        .append("ownerUserId", owner).append("status", "A").append("visibility", "Friends only").append("imageUrl", mediaUrl(assetKey)));
                assertBytes(assetKey, viewerCookie, png);
                assertStatus(assetKey, outsiderCookie, 403);
                db.getCollection("assets").updateOne(new Document("_id", prefix + "-asset"), new Document("$set", new Document("visibility", "Public")));
                assertBytes(assetKey, outsiderCookie, png);
                String eventKey = "private/images/" + owner + "/event/fixture/large.webp";
                put(objects, storage, keys, eventKey, png);
                db.getCollection("events").updateOne(new Document("_id", eventId), new Document("$set",
                        new Document("creatorUserId", owner).append("visibility", "Friends only").append("imageUrl", mediaUrl(eventKey))));
                assertBytes(eventKey, viewerCookie, png);
                assertStatus(eventKey, outsiderCookie, 403);
                db.getCollection("events").updateOne(new Document("_id", eventId), new Document("$set",
                        new Document("visibility", "Invitation only").append("acceptedMemberUserIds", List.of(outsider))));
                assertStatus(eventKey, viewerCookie, 403);
                assertBytes(eventKey, outsiderCookie, png);
                String chatKey = "private/images/" + owner + "/chat/fixture/large.webp";
                put(objects, storage, keys, chatKey, png);
                db.getCollection("chats").insertOne(new Document("_id", prefix + "-chat").append("id", prefix + "-chat")
                        .append("ownerUserId", owner).append("memberIds", List.of(owner, viewer)));
                db.getCollection("chatMessages").insertOne(new Document("_id", prefix + "-message").append("chatId", prefix + "-chat")
                        .append("attachments", List.of(new Document("url", mediaUrl(chatKey)))));
                assertBytes(chatKey, viewerCookie, png);
                assertStatus(chatKey, outsiderCookie, 403);
                db.getCollection("chats").updateOne(new Document("_id", prefix + "-chat"), new Document("$set", new Document("memberIds", List.of(owner))));
                assertStatus(chatKey, viewerCookie, 403);
                db.getCollection("assets").updateOne(new Document("_id", prefix + "-asset"), new Document("$set", new Document("visibility", "Friends only")));
                assertBytes(assetKey, viewerCookie, png);
                db.getCollection("userFriendships").deleteMany(pairFilter);
                assertStatus(assetKey, viewerCookie, 403);
                db.getCollection("userSessionStates").deleteOne(new Document("_id", viewer));
                assertStatus(assetKey, viewerCookie, 401);
                String publicKey = "public/demo/images/" + prefix + "/large.webp";
                put(objects, storage, keys, publicKey, png);
                assertThat(request("/media/public?key=" + encoded(publicKey), null).body()).isEqualTo(png);
                assertStatus(assetKey, null, 401);
            } finally {
                for (String collection : List.of("users", "userSessionStates", "events", "activityMembers", "assets", "chats", "chatMessages")) {
                    db.getCollection(collection).deleteMany(new Document("_id", new Document("$regex", "^" + prefix)));
                }
                db.getCollection("userFriendships").deleteMany(new Document("$or", List.of(
                        new Document("leftUserId", new Document("$regex", "^" + prefix)),
                        new Document("rightUserId", new Document("$regex", "^" + prefix)))));
                db.getCollection("userRates").deleteMany(new Document("$or", List.of(
                        new Document("ownerUserId", new Document("$regex", "^" + prefix)),
                        new Document("relatedUserId", new Document("$regex", "^" + prefix)))));
                for (String stored : keys) objects.deleteObject(storage.getBucket(), stored);
            }
        }
    }

    private Document event(String id, Instant end) {
        return new Document("_id", id).append("sourceId", id).append("status", "A").append("published", true)
                .append("title", "Media friendship fixture").append("endAtIso", end.toString());
    }

    private String session(com.mongodb.client.MongoDatabase db, String user) throws Exception {
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(user.getBytes(StandardCharsets.UTF_8))
                + "." + UUID.randomUUID().toString().replace("-", "") + UUID.randomUUID().toString().replace("-", "");
        String hash = HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(token.getBytes(StandardCharsets.UTF_8)));
        db.getCollection("userSessionStates").insertOne(new Document("_id", user)
                .append("activeSessions", List.of(new Document("sessionId", "fixture").append("mediaTokenHash", hash))));
        return token;
    }

    private void put(S3CompatibleMediaObjectStoreClient objects, MediaStorageProperties storage, List<String> keys, String key, byte[] bytes) {
        keys.add(key);
        objects.putObject(storage.getBucket(), key, "image/png", bytes);
    }

    private HttpResponse<byte[]> request(String path, String cookie) throws Exception {
        var builder = HttpRequest.newBuilder(URI.create("http://nginx" + path)).timeout(java.time.Duration.ofSeconds(10)).GET();
        if (cookie != null) builder.header("Cookie", "myscoutee_media_session=" + cookie);
        return HttpClient.newHttpClient().send(builder.build(), HttpResponse.BodyHandlers.ofByteArray());
    }

    private void assertStatus(String key, String cookie, int status) throws Exception {
        assertThat(request(mediaUrl(key), cookie).statusCode()).as("private media HTTP status").isEqualTo(status);
    }

    private void assertBytes(String key, String cookie, byte[] bytes) throws Exception {
        var response = request(mediaUrl(key), cookie);
        assertThat(response.statusCode()).isEqualTo(200);
        assertThat(response.body()).isEqualTo(bytes);
        assertThat(response.headers().firstValue("cache-control").orElse("")).contains("no-store");
    }

    private String mediaUrl(String key) { return "/api/media/private?key=" + org.springframework.web.util.UriUtils.encodeQueryParam(key, StandardCharsets.UTF_8); }
    private String encoded(String value) { return URLEncoder.encode(value, StandardCharsets.UTF_8); }
    private String env(String key, String fallback) { String value = System.getenv(key); return value == null ? fallback : value; }
}
