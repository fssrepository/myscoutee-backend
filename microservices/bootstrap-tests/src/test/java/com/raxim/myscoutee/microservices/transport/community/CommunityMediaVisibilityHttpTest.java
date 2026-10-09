package com.raxim.myscoutee.microservices.transport.community;

import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.domain.community.service.CommunityMediaVisibilityService;
import com.raxim.myscoutee.domain.groups.service.GroupMediaVisibilityService;
import com.raxim.myscoutee.microservices.transport.groups.GroupMediaVisibilityServerConfiguration;
import com.raxim.myscoutee.microservices.bootstrap.ServiceSecurityConfiguration;
import com.raxim.myscoutee.microservices.transport.common.InternalReadCredentialFilter;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport.RemoteReadException;
import io.micrometer.core.instrument.simple.SimpleMeterRegistry;
import java.io.ByteArrayInputStream;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;
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

/** Canonical two-field projections over real HTTP, with isolated Mongo fixtures. */
class CommunityMediaVisibilityHttpTest {
    static final String TOKEN = "test-only-community-media-token-0000000000000000000";
    static ConfigurableApplicationContext server;
    static HttpClient http;
    static RemoteCommunityMediaVisibility remote;
    static SimpleMeterRegistry meters;
    static URI origin;
    static Path evidence;
    static final AtomicInteger sequence = new AtomicInteger();
    static final List<String> PATHS = List.of(CommunityMediaVisibilityProtocol.ANNOUNCEMENT_PATH, CommunityMediaVisibilityProtocol.OFFERING_PATH);

    @BeforeAll static void start() throws Exception {
        evidence = Path.of(System.getProperty("wireEvidenceDirectory"), "community-media");
        Files.createDirectories(evidence);
        try (var files = Files.list(evidence)) {
            for (var file : files.filter(p -> p.getFileName().toString().matches("response-[0-9]+\\.json")).toList()) Files.delete(file);
        }
        server = new SpringApplicationBuilder(Fixture.class).properties(
                "server.address=127.0.0.1", "server.port=0", "management.server.port=0",
                "myscoutee.remote.community-media.read-token=" + TOKEN,
                "myscoutee.remote.groups-media.read-token=test-only-groups-media-token-0000000000000000000000",
                "spring.main.allow-bean-definition-overriding=false",
                "spring.main.banner-mode=off", "logging.level.root=WARN").run();
        origin = URI.create("http://127.0.0.1:" + server.getEnvironment().getProperty("local.server.port"));
        http = HttpClient.newBuilder().followRedirects(HttpClient.Redirect.NEVER).build();
        meters = new SimpleMeterRegistry();
        remote = new RemoteCommunityMediaVisibility(origin, TOKEN, true, Duration.ofSeconds(1), Duration.ofSeconds(3), new JsonMapper(), meters);
    }

    @AfterEach void clear() { MongoSessionModeContext.clear(); }
    @AfterAll static void stop() {
        if (remote != null) remote.close();
        if (http != null) http.shutdownNow();
        if (server != null) server.close();
        if (meters != null) meters.close();
    }

    @Test void bothOperationsPreserveCanonicalProjectionModeAndAbsence() throws Exception {
        var local = server.getBean(CommunityMediaVisibilityService.class);
        for (var mode : List.of(MongoSessionMode.REAL, MongoSessionMode.DEMO, MongoSessionMode.REAL)) {
            MongoSessionModeContext.set(mode);
            for (var value : List.of("/media/private?key=images%2Fid%2Fé%26original", "unset", "missing")) {
                var urls = List.of(value);
                assertEquals(local.announcement(urls), remote.announcement(urls));
                assertEquals(local.offering(urls), remote.offering(urls));
                if (!value.equals("missing")) assertEquals(mode.name(), remote.announcement(urls).communityId());
                for (var path : PATHS) {
                    var response = request(path, query(urls), TOKEN, mode.name(), "POST", "application/json", false);
                    assertEquals(value.equals("missing") ? 404 : 200, response.statusCode());
                    assertEquals("no-store", response.headers().firstValue("Cache-Control").orElseThrow());
                    assertFalse(response.body().contains("private-field"));
                }
            }
        }
    }

    @Test void readRequiresItsOwnCredentialExplicitModeAndPost() throws Exception {
        for (var path : PATHS) {
            for (var token : new String[]{null, "test-only-groups-media-token-0000000000000000000000"})
                assertEquals(401, request(path, query(List.of("known")), token, "DEMO", "POST", "application/json", false).statusCode());
            for (var mode : new String[]{null, "demo", "ANY"})
                assertEquals(400, request(path, query(List.of("known")), TOKEN, mode, "POST", "application/json", false).statusCode());
            assertEquals(403, request(path, "", TOKEN, "REAL", "GET", "application/json", false).statusCode());
        }
    }

    @Test void malformedAndOversizedQueriesCannotBecomeAnEmptyResult() throws Exception {
        for (var path : PATHS) {
            for (var body : List.of("{", "null", "{}", "{\"urls\":[]}", "{\"urls\":[null]}", "{\"urls\":[\" \"]}",
                    query(java.util.Collections.nCopies(33, "known")), query(List.of("x".repeat(24577)))))
                assertEquals(400, request(path, body, TOKEN, "REAL", "POST", "application/json", false).statusCode());
            assertEquals(415, request(path, "{}", TOKEN, "REAL", "POST", "text/plain", false).statusCode());
            var large = " ".repeat(CommunityMediaVisibilityProtocol.MAX_QUERY_BYTES + 1);
            for (var chunked : List.of(false, true))
                assertEquals(413, request(path, large, TOKEN, "REAL", "POST", "application/json", chunked).statusCode());
            var failure = request(path, query(List.of("fail")), TOKEN, "REAL", "POST", "application/json", false);
            assertEquals(503, failure.statusCode());
            assertEquals("{\"code\":\"COMMUNITY_VISIBILITY_UNAVAILABLE\"}", failure.body());
        }
        assertEquals(503, assertThrows(RemoteReadException.class, () -> remote.announcement(List.of("fail"))).status());
        assertEquals(503, assertThrows(RemoteReadException.class, () -> remote.offering(List.of("fail"))).status());
        assertThrows(IllegalArgumentException.class, () -> remote.announcement(List.of()));
    }

    @Test void urlVariantsBeyondARequestLineLimitStillWorkAsOneRead() {
        var urls = java.util.Collections.nCopies(20, "/api/media/private?key=" + "x".repeat(1800));
        assertNotNull(remote.announcement(urls));
        assertNotNull(remote.offering(urls));
    }

    @Test void coLocatedGroupsEndpointDoesNotAcceptCommunityCredential() throws Exception {
        var response = http.send(HttpRequest.newBuilder(origin.resolve("/_internal/v1/groups/media-visibility?id=known"))
                .header("Authorization", "Bearer " + TOKEN).header(InternalReadCredentialFilter.MODE_HEADER, "REAL").GET().build(),
                HttpResponse.BodyHandlers.ofString());
        assertEquals(401, response.statusCode());
    }

    static String query(List<String> urls) { return new JsonMapper().writeValueAsString(Map.of("urls", urls)); }

    static HttpResponse<String> request(String path, String body, String token, String mode, String method, String contentType, boolean chunked) throws Exception {
        var builder = HttpRequest.newBuilder(origin.resolve(path)).timeout(Duration.ofSeconds(3)).header("Content-Type", contentType);
        if (token != null) builder.header("Authorization", "Bearer " + token);
        if (mode != null) builder.header(InternalReadCredentialFilter.MODE_HEADER, mode);
        var publisher = chunked ? HttpRequest.BodyPublishers.ofInputStream(() -> new ByteArrayInputStream(body.getBytes(StandardCharsets.UTF_8)))
                : HttpRequest.BodyPublishers.ofString(body);
        var response = http.send(builder.method(method, publisher).build(), HttpResponse.BodyHandlers.ofString());
        var mapper = new JsonMapper();
        Files.writeString(evidence.resolve("response-" + sequence.incrementAndGet() + ".json"), mapper.writeValueAsString(
                Map.of("path", path, "method", "post", "status", response.statusCode(), "body", mapper.readTree(response.body()))));
        return response;
    }

    @SpringBootConfiguration
    @EnableAutoConfiguration(excludeName = {
            "org.springframework.boot.mongodb.autoconfigure.MongoAutoConfiguration",
            "org.springframework.boot.data.mongodb.autoconfigure.DataMongoAutoConfiguration",
            "org.springframework.boot.data.mongodb.autoconfigure.DataMongoRepositoriesAutoConfiguration",
            "org.springframework.boot.security.autoconfigure.UserDetailsServiceAutoConfiguration"})
    @Import({CommunityMediaVisibilityServerConfiguration.class, GroupMediaVisibilityServerConfiguration.class, ServiceSecurityConfiguration.class})
    static class Fixture {
        @Bean GroupMediaVisibilityService groupsOwner() { return new GroupMediaVisibilityService(mock(MongoTemplate.class)); }
        @Bean CommunityMediaVisibilityService canonicalOwner() {
            var mongo = mock(MongoTemplate.class);
            when(mongo.findOne(any(Query.class), eq(Document.class), anyString())).thenAnswer(call -> {
                var query = ((Query) call.getArgument(0)).getQueryObject();
                var values = (Document) query.values().iterator().next();
                var urls = (List<?>) values.get("$in");
                if (urls.contains("missing")) return null;
                if (urls.contains("fail")) throw new IllegalStateException("secret database details");
                return new Document("communityId", MongoSessionModeContext.currentMode().name())
                        .append("baseGroupId", MongoSessionModeContext.currentMode().name())
                        .append("status", urls.contains("unset") ? null : "published")
                        .append("private-field", "must not cross the wire");
            });
            return new CommunityMediaVisibilityService(mongo);
        }
    }
}
