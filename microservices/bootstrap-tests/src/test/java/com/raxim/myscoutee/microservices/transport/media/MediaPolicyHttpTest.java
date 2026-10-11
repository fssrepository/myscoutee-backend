package com.raxim.myscoutee.microservices.transport.media;

import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.domain.events.service.EventMediaVisibilityService;
import com.raxim.myscoutee.domain.campaigns.service.CampaignCatalogService;
import com.raxim.myscoutee.microservices.transport.campaigns.*;
import com.raxim.myscoutee.domain.content.service.ContentMediaVisibilityService;
import com.raxim.myscoutee.domain.chat.service.ChatMediaVisibilityService;
import com.raxim.myscoutee.microservices.bootstrap.ServiceSecurityConfiguration;
import com.raxim.myscoutee.microservices.transport.events.*;
import com.raxim.myscoutee.microservices.transport.content.*;
import com.raxim.myscoutee.microservices.transport.chat.*;
import com.raxim.myscoutee.microservices.transport.common.InternalReadCredentialFilter;
import com.raxim.myscoutee.microservices.transport.common.MediaReferenceQueries;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport.RemoteReadException;
import io.micrometer.core.instrument.simple.SimpleMeterRegistry;
import java.io.ByteArrayInputStream;
import java.net.URI;
import java.net.http.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.time.Duration;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicReference;
import org.bson.Document;
import org.junit.jupiter.api.*;
import org.springframework.boot.SpringBootConfiguration;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import tools.jackson.databind.json.JsonMapper;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/** Real HTTP around the canonical owners, including co-located distinct credentials. */
class MediaPolicyHttpTest {
    record Route(String domain, String path, String method) {
        String token() { return "test-only-" + domain + "-media-token-0000000000000000000000"; }
    }
    static final Route EVENT = new Route("events", EventMediaVisibilityProtocol.PATH, "POST");
    static final Route MEMBER = new Route("events", EventMediaVisibilityProtocol.MEMBERSHIP_PATH, "GET");
    static final Route CONTENT = new Route("content", ContentMediaVisibilityProtocol.PATH, "POST");
    static final Route CHAT = new Route("chat", ChatMediaVisibilityProtocol.PATH, "POST");
    static final Route CAMPAIGN = new Route("campaigns", CampaignMediaVisibilityProtocol.PATH, "POST");
    static final List<Route> MEDIA = List.of(EVENT, CONTENT, CHAT, CAMPAIGN);
    static final List<Route> ALL = List.of(EVENT, MEMBER, CONTENT, CHAT, CAMPAIGN);
    static ConfigurableApplicationContext server;
    static HttpClient http;
    static RemoteEventMediaVisibility events;
    static RemoteContentMediaVisibility content;
    static RemoteChatMediaVisibility chat;
    static RemoteCampaignMediaVisibility campaigns;
    static SimpleMeterRegistry meters;
    static URI origin;
    static Path evidence;
    static final AtomicInteger sequence = new AtomicInteger();
    static final AtomicReference<Document> membershipQuery = new AtomicReference<>();

    @BeforeAll static void start() throws Exception {
        evidence = Path.of(System.getProperty("wireEvidenceDirectory"));
        for (var domain : List.of("events", "content", "chat", "campaigns")) {
            var directory = evidence.resolve(domain + "-media");
            Files.createDirectories(directory);
            try (var files = Files.list(directory)) {
                for (var file : files.filter(p -> p.getFileName().toString().matches("response-[0-9]+\\.json")).toList()) Files.delete(file);
            }
        }
        server = new SpringApplicationBuilder(Fixture.class).properties(
                "server.address=127.0.0.1", "server.port=0", "management.server.port=0",
                "myscoutee.remote.events-media.read-token=" + EVENT.token(),
                "myscoutee.remote.content-media.read-token=" + CONTENT.token(),
                "myscoutee.remote.chat-media.read-token=" + CHAT.token(),
                "myscoutee.remote.campaigns-media.read-token=" + CAMPAIGN.token(),
                "spring.main.allow-bean-definition-overriding=false",
                "spring.main.banner-mode=off", "logging.level.root=WARN").run();
        origin = URI.create("http://127.0.0.1:" + server.getEnvironment().getProperty("local.server.port"));
        http = HttpClient.newBuilder().followRedirects(HttpClient.Redirect.NEVER).build();
        meters = new SimpleMeterRegistry();
        events = new RemoteEventMediaVisibility(origin, EVENT.token(), true, Duration.ofSeconds(1), Duration.ofSeconds(3), new JsonMapper(), meters);
        content = new RemoteContentMediaVisibility(origin, CONTENT.token(), true, Duration.ofSeconds(1), Duration.ofSeconds(3), new JsonMapper(), meters);
        campaigns = new RemoteCampaignMediaVisibility(origin, CAMPAIGN.token(), true, Duration.ofSeconds(1), Duration.ofSeconds(3), new JsonMapper(), meters);
        chat = new RemoteChatMediaVisibility(origin, CHAT.token(), true, Duration.ofSeconds(1), Duration.ofSeconds(3), new JsonMapper(), meters);
    }
    @AfterEach void clear() { MongoSessionModeContext.clear(); }
    @AfterAll static void stop() {
        if (events != null) events.close();
        if (content != null) content.close();
        if (chat != null) chat.close();
        if (campaigns != null) campaigns.close();
        if (http != null) http.shutdownNow();
        if (server != null) server.close();
        if (meters != null) meters.close();
    }

    @Test void eventProjectionPreservesListsNullableFieldsModesAndAbsence() throws Exception {
        var local = server.getBean(EventMediaVisibilityService.class);
        for (var mode : List.of(MongoSessionMode.REAL, MongoSessionMode.DEMO, MongoSessionMode.REAL)) {
            MongoSessionModeContext.set(mode);
            for (var value : List.of("known", "unset", "missing")) {
                assertEquals(local.event(List.of(value)), events.event(List.of(value)));
                var response = request(EVENT, "", query(value), EVENT.token(), mode.name(), "POST", "application/json", false);
                assertEquals(value.equals("missing") ? 404 : 200, response.statusCode());
                if (!value.equals("missing")) assertEquals(mode.name(), events.event(List.of(value)).creatorUserId());
                assertFalse(response.body().contains("private-field"));
            }
        }
        var event = events.event(List.of("known"));
        assertTrue(event.invitedMemberUserIds().contains("invited"));
        assertEquals(Arrays.asList("admin", null, 7), event.admins());
        assertEquals(List.of(), events.event(List.of("unset")).admins());
    }

    @Test void acceptedMembershipPreservesCanonicalQueryAndNullVersusEmpty() throws Exception {
        var local = server.getBean(EventMediaVisibilityService.class);
        for (var mode : List.of(MongoSessionMode.REAL, MongoSessionMode.DEMO)) {
            MongoSessionModeContext.set(mode);
            for (String group : new String[]{null, "", "g&é/?", "unset", "missing"}) {
                for (String account : new String[]{null, "", "account&é/?"}) {
                    assertEquals(local.acceptedCommunityMember(group, account), events.acceptedCommunityMember(group, account));
                    assertEquals(new Document("ownerType", "community").append("ownerId", group)
                            .append("userId", account).append("status", "accepted"), membershipQuery.get());
                }
                String suffix = group == null ? "" : "?communityId=" + java.net.URLEncoder.encode(group, StandardCharsets.UTF_8);
                var response = request(MEMBER, suffix, "", MEMBER.token(), mode.name(), "GET", "application/json", false);
                assertEquals("missing".equals(group) ? 404 : 200, response.statusCode());
            }
        }
        assertEquals(400, request(MEMBER, "?accountId=" + "x".repeat(513), "", MEMBER.token(), "REAL", "GET", "application/json", false).statusCode());
        assertThrows(IllegalArgumentException.class, () -> events.acceptedCommunityMember("x".repeat(513), "id"));
    }

    @Test void feedProjectionPreservesNullableModerationAndAbsence() throws Exception {
        var local = server.getBean(ContentMediaVisibilityService.class);
        for (var mode : List.of(MongoSessionMode.REAL, MongoSessionMode.DEMO)) {
            MongoSessionModeContext.set(mode);
            for (var value : List.of("known", "unset", "missing")) {
                assertEquals(local.feedPost(List.of(value)), content.feedPost(List.of(value)));
                var response = request(CONTENT, "", query(value), CONTENT.token(), mode.name(), "POST", "application/json", false);
                assertEquals(value.equals("missing") ? 404 : 200, response.statusCode());
                if (value.equals("known")) assertEquals(mode.name(), content.feedPost(List.of(value)).moderationStatus());
                assertFalse(response.body().contains("private-field"));
            }
        }
    }

    @Test void chatPreservesEveryReferenceAndEmptyListWithoutAnAbsenceError() throws Exception {
        var local = server.getBean(ChatMediaVisibilityService.class);
        for (var mode : List.of(MongoSessionMode.REAL, MongoSessionMode.DEMO)) {
            MongoSessionModeContext.set(mode);
            for (var value : List.of("known", "missing")) {
                assertEquals(local.messages(List.of(value)), chat.messages(List.of(value)));
                var response = request(CHAT, "", query(value), CHAT.token(), mode.name(), "POST", "application/json", false);
                assertEquals(200, response.statusCode());
                assertFalse(response.body().contains("private-field"));
                if (value.equals("missing")) assertEquals("[]", response.body());
            }
        }
        var messages = chat.messages(List.of("known"));
        assertEquals(3, messages.size());
        assertNull(messages.get(0).deletedAtIso());
        assertEquals("", messages.get(1).deletedAtIso());
        assertEquals("2026-01-01T00:00:00Z", messages.get(2).deletedAtIso());
    }

    @Test void campaignMediaRetainsTheCanonicalWorkspaceAndLifecycleProjection() throws Exception {
        var local = server.getBean(CampaignCatalogService.class);
        for (var mode : List.of(MongoSessionMode.REAL, MongoSessionMode.DEMO)) {
            MongoSessionModeContext.set(mode);
            for (var value : List.of("known", "unset", "missing")) {
                assertEquals(local.mediaReference(List.of(value)), campaigns.mediaReference(List.of(value)));
                var response = request(CAMPAIGN, "", query(value), CAMPAIGN.token(), mode.name(), "POST", "application/json", false);
                assertEquals(value.equals("missing") ? 404 : 200, response.statusCode());
                assertFalse(response.body().contains("private-field"));
            }
            assertEquals(mode.name(), campaigns.mediaReference(List.of("known")).workspaceGroupId());
        }
    }

    @Test void eachRouteRequiresItsOwnCredentialModeAndMethod() throws Exception {
        for (var route : ALL) {
            for (var token : new String[]{null, "test-only-other-read-token-000000000000000000000000"})
                assertEquals(401, request(route, "", query("known"), token, "REAL", route.method(), "application/json", false).statusCode());
            for (var other : MEDIA) {
                if (!other.domain().equals(route.domain()))
                    assertEquals(401, request(route, "", query("known"), other.token(), "REAL", route.method(), "application/json", false).statusCode());
            }
            for (var mode : new String[]{null, "demo", "ANY"})
                assertEquals(400, request(route, "", query("known"), route.token(), mode, route.method(), "application/json", false).statusCode());
            assertEquals(403, request(route, "", query("known"), route.token(), "REAL", route.method().equals("GET") ? "POST" : "GET", "application/json", false).statusCode());
        }
    }

    @Test void mediaQueriesReuseTheBoundedReaderForMalformedAndChunkedBodies() throws Exception {
        for (var route : MEDIA) {
            for (var body : List.of("{", "null", "{}", "{\"urls\":[42]}", "{\"urls\":[true]}", "{\"urls\":[\"known\"],\"extra\":true}", "{\"urls\":[\"known\"]} {}", "{\"urls\":[]}", "{\"urls\":[null]}", "{\"urls\":[\" \"]}",
                    new JsonMapper().writeValueAsString(Map.of("urls", Collections.nCopies(33, "known"))), query("x".repeat(24577))))
                assertEquals(400, request(route, "", body, route.token(), "REAL", "POST", "application/json", false).statusCode());
            assertEquals(415, request(route, "", "{}", route.token(), "REAL", "POST", "text/plain", false).statusCode());
            for (var chunked : List.of(false, true))
                assertEquals(413, request(route, "", " ".repeat(MediaReferenceQueries.MAX_QUERY_BYTES + 1), route.token(), "REAL", "POST", "application/json", chunked).statusCode());
        }
    }

    @Test void ownerFailuresRemainErrorsRatherThanAbsenceOrEmptyLists() throws Exception {
        for (var route : ALL) {
            var response = request(route, route == MEMBER ? "?communityId=fail" : "", query("fail"), route.token(), "REAL", route.method(), "application/json", false);
            assertEquals(503, response.statusCode());
            assertFalse(response.body().contains("secret database"));
        }
        assertEquals(503, assertThrows(RemoteReadException.class, () -> events.event(List.of("fail"))).status());
        assertEquals(503, assertThrows(RemoteReadException.class, () -> events.acceptedCommunityMember("fail", "id")).status());
        assertEquals(503, assertThrows(RemoteReadException.class, () -> content.feedPost(List.of("fail"))).status());
        assertEquals(503, assertThrows(RemoteReadException.class, () -> chat.messages(List.of("fail"))).status());
        assertEquals(503, assertThrows(RemoteReadException.class, () -> campaigns.mediaReference(List.of("fail"))).status());
    }

    @Test void existingUrlVariantBatchCanExceedHttpRequestLineSize() {
        var urls = Collections.nCopies(20, "/api/media/private?key=" + "x".repeat(1800));
        assertNotNull(events.event(urls));
        assertNotNull(content.feedPost(urls));
        assertEquals(3, chat.messages(urls).size());
        assertNotNull(campaigns.mediaReference(urls));
    }

    static String query(String value) { return new JsonMapper().writeValueAsString(Map.of("urls", List.of(value))); }
    static HttpResponse<String> request(Route route, String suffix, String body, String token, String mode, String method, String contentType, boolean chunked) throws Exception {
        var builder = HttpRequest.newBuilder(origin.resolve(route.path() + suffix)).timeout(Duration.ofSeconds(3)).header("Content-Type", contentType);
        if (token != null) builder.header("Authorization", "Bearer " + token);
        if (mode != null) builder.header(InternalReadCredentialFilter.MODE_HEADER, mode);
        var publisher = chunked ? HttpRequest.BodyPublishers.ofInputStream(() -> new ByteArrayInputStream(body.getBytes(StandardCharsets.UTF_8))) : HttpRequest.BodyPublishers.ofString(body);
        var response = http.send(builder.method(method, publisher).build(), HttpResponse.BodyHandlers.ofString());
        assertEquals("no-store", response.headers().firstValue("Cache-Control").orElseThrow());
        var mapper = new JsonMapper();
        Files.writeString(evidence.resolve(route.domain() + "-media/response-" + sequence.incrementAndGet() + ".json"), mapper.writeValueAsString(
                Map.of("path", route.path(), "method", route.method().toLowerCase(Locale.ROOT), "status", response.statusCode(), "body", mapper.readTree(response.body()))));
        return response;
    }

    @SpringBootConfiguration
    @EnableAutoConfiguration(excludeName = {
            "org.springframework.boot.mongodb.autoconfigure.MongoAutoConfiguration",
            "org.springframework.boot.data.mongodb.autoconfigure.DataMongoAutoConfiguration",
            "org.springframework.boot.data.mongodb.autoconfigure.DataMongoRepositoriesAutoConfiguration",
            "org.springframework.boot.security.autoconfigure.UserDetailsServiceAutoConfiguration"})
    @Import({EventMediaVisibilityServerConfiguration.class, ContentMediaVisibilityServerConfiguration.class,
            ChatMediaVisibilityServerConfiguration.class, CampaignMediaVisibilityServerConfiguration.class, ServiceSecurityConfiguration.class})
    static class Fixture {
        @Bean MongoTemplate mongo() {
            var mongo = mock(MongoTemplate.class);
            when(mongo.findOne(any(Query.class), eq(Document.class), anyString())).thenAnswer(call -> {
                var query = ((Query) call.getArgument(0)).getQueryObject();
                String collection = call.getArgument(2);
                String mode = MongoSessionModeContext.currentMode().name();
                if (collection.equals("activityMembers")) {
                    membershipQuery.set(query);
                    assertEquals("community", query.getString("ownerType"));
                    assertEquals("accepted", query.getString("status"));
                    Object group = query.get("ownerId");
                    if ("fail".equals(group)) throw new IllegalStateException("secret database details");
                    return "missing".equals(group) ? null : new Document("role", "unset".equals(group) ? null : mode).append("private-field", "hidden");
                }
                String value = firstUrl(query);
                if (value.equals("fail")) throw new IllegalStateException("secret database details");
                if (value.equals("missing")) return null;
                if (collection.equals("photoFeedPosts")) {
                    assertEquals(new Document("$ne", true), query.get("deleted"));
                    return new Document("moderationStatus", value.equals("unset") ? null : mode).append("private-field", "hidden");
                }
                if (collection.equals("campaigns")) return new Document("workspaceGroupId", mode)
                        .append("status", value.equals("unset") ? null : "published").append("private-field", "hidden");
                assertEquals("events", collection);
                return new Document("creatorUserId", mode).append("organizerUserId", null)
                        .append("moderationStatus", "accepted").append("visibility", "Invitation only").append("status", value.equals("unset") ? null : "A")
                        .append("admins", value.equals("unset") ? null : Arrays.asList("admin", null, 7))
                        .append("invitedMemberUserIds", List.of("invited"))
                        .append("acceptedMemberUserIds", List.of("accepted"))
                        .append("pendingRequestMemberUserIds", List.of("pending"))
                        .append("private-field", "hidden");
            });
            when(mongo.find(any(Query.class), eq(Document.class), eq("chatMessages"))).thenAnswer(call -> {
                String value = firstUrl(((Query) call.getArgument(0)).getQueryObject());
                if (value.equals("fail")) throw new IllegalStateException("secret database details");
                if (value.equals("missing")) return List.of();
                String mode = MongoSessionModeContext.currentMode().name();
                return List.of(new Document("chatId", mode).append("deletedAtIso", null).append("private-field", "hidden"),
                        new Document("chatId", "forwarded").append("deletedAtIso", ""),
                        new Document("chatId", "deleted").append("deletedAtIso", "2026-01-01T00:00:00Z"));
            });
            return mongo;
        }
        static String firstUrl(Document query) {
            if (query.get("$or") instanceof List<?> branches) return firstUrl((Document) branches.get(0));
            for (var value : query.values()) {
                if (value instanceof Document criterion && criterion.get("$in") instanceof List<?> urls) return (String) urls.get(0);
            }
            throw new AssertionError("Canonical media URL query was absent.");
        }
        @Bean CampaignCatalogService campaignOwner(MongoTemplate mongo) { return new CampaignCatalogService(mongo, mock(com.raxim.myscoutee.domain.affinity.api.RatingDirectory.class)); }
        @Bean EventMediaVisibilityService eventOwner(MongoTemplate mongo) { return new EventMediaVisibilityService(mongo); }
        @Bean ContentMediaVisibilityService contentOwner(MongoTemplate mongo) { return new ContentMediaVisibilityService(mongo); }
        @Bean ChatMediaVisibilityService chatOwner(MongoTemplate mongo) { return new ChatMediaVisibilityService(mongo); }
    }
}
