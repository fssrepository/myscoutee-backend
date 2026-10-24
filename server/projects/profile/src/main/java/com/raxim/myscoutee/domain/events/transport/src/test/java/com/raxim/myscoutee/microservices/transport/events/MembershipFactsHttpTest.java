package com.raxim.myscoutee.microservices.transport.events;

import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.microservices.bootstrap.ServiceSecurityConfiguration;
import com.raxim.myscoutee.microservices.transport.common.InternalReadCredentialFilter;
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
import org.junit.jupiter.api.*;
import org.springframework.boot.SpringBootConfiguration;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import tools.jackson.databind.json.JsonMapper;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import com.raxim.myscoutee.domain.events.api.EventMembershipFacts;
import com.raxim.myscoutee.domain.events.dto.EventMembershipFactsDto;
import com.raxim.myscoutee.domain.assets.api.AssetMembershipFacts;
import com.raxim.myscoutee.domain.assets.dto.AssetMembershipFactsDto;
import com.raxim.myscoutee.domain.assets.dto.AssetMembershipRequestDto;
import com.raxim.myscoutee.microservices.transport.assets.AssetMembershipFactsProtocol;
import com.raxim.myscoutee.microservices.transport.assets.AssetMembershipFactsServerConfiguration;
import com.raxim.myscoutee.microservices.transport.assets.RemoteAssetMembershipFacts;
class MembershipFactsHttpTest {
    static final String EVENT_TOKEN = "test-only-event-membership-facts-token-000000000000";
    static final String ASSET_TOKEN = "test-only-asset-membership-facts-token-000000000000";
    static ConfigurableApplicationContext server;
    static RemoteEventMembershipFacts events;
    static RemoteAssetMembershipFacts assets;
    static HttpClient http;
    static URI origin;
    static SimpleMeterRegistry meters;
    static final AtomicInteger sequence = new AtomicInteger();
    static final String EVENT_PATH = EventMembershipFactsProtocol.PATH, ASSET_PATH = AssetMembershipFactsProtocol.PATH;
    @BeforeAll static void start() throws Exception {
        for (var directory : List.of("event-membership-facts", "asset-membership-facts")) {
            var path = Path.of(System.getProperty("wireEvidenceDirectory"), directory);
            Files.createDirectories(path);
            try (var files = Files.list(path)) {
                for (var file : files.filter(p -> p.getFileName().toString().matches("response-[0-9]+\\.json")).toList()) Files.delete(file);
            }
        }
        server = new SpringApplicationBuilder(Fixture.class).properties(
                "server.address=127.0.0.1", "server.port=0", "management.server.port=0",
                "myscoutee.remote.event-membership-facts.read-token=" + EVENT_TOKEN,
                "myscoutee.remote.asset-membership-facts.read-token=" + ASSET_TOKEN,
                "spring.main.allow-bean-definition-overriding=false",
                "spring.main.banner-mode=off", "logging.level.root=WARN").run();
        origin = URI.create("http://127.0.0.1:" + server.getEnvironment().getProperty("local.server.port"));
        http = HttpClient.newBuilder().followRedirects(HttpClient.Redirect.NEVER).build();
        meters = new SimpleMeterRegistry();
        events = new RemoteEventMembershipFacts(origin, EVENT_TOKEN, true, Duration.ofSeconds(1), Duration.ofSeconds(3), new JsonMapper(), meters);
        assets = new RemoteAssetMembershipFacts(origin, ASSET_TOKEN, true, Duration.ofSeconds(1), Duration.ofSeconds(3), new JsonMapper(), meters);
    }
    @AfterEach void clear() { MongoSessionModeContext.clear(); }
    @AfterAll static void stop() {
        if (events != null) events.close(); if (assets != null) assets.close();
        if (http != null) http.shutdownNow(); if (server != null) server.close(); if (meters != null) meters.close();
    }
    @Test void detachedFactsPreserveWorkspaceDatesRolesRequestsNullsAndModes() throws Exception {
        for (var mode : List.of(MongoSessionMode.REAL, MongoSessionMode.DEMO, MongoSessionMode.REAL)) {
            MongoSessionModeContext.set(mode);
            for (var id : List.of("known", "nulls", "empty", "missing")) {
                assertEquals(server.getBean(EventMembershipFacts.class).findBySourceId(id), events.findBySourceId(id));
                assertEquals(server.getBean(AssetMembershipFacts.class).findByAssetId(id), assets.findByAssetId(id));
                assertEquals(200, request(EVENT_PATH, "?id=" + id, EVENT_TOKEN, mode.name(), "GET").statusCode());
                assertEquals(id.equals("missing") ? 404 : 200, request(ASSET_PATH, "?id=" + id, ASSET_TOKEN, mode.name(), "GET").statusCode());
            }
            assertEquals(mode.name(), events.findBySourceId("known").getFirst().workspaceGroupId());
            assertEquals(mode.name(), assets.findByAssetId("known").orElseThrow().ownerUserId());
        }
        assertEquals(2, events.findBySourceId("known").size());
        assertNull(events.findBySourceId("known").get(1));
        assertEquals(Arrays.asList("admin", null, ""), events.findBySourceId("known").getFirst().admins());
        assertEquals(Arrays.asList(new AssetMembershipRequestDto("applicant", "accepted"), null), assets.findByAssetId("known").orElseThrow().requests());
    }
    @Test void optionalNullEmptyAndEncodedIdentifiersReachTheSameCanonicalPort() {
        var eventOwner = server.getBean(EventMembershipFacts.class);
        var assetOwner = server.getBean(AssetMembershipFacts.class);
        for (var id : Arrays.asList(null, "", "source&é/?")) {
            events.findBySourceId(id); assets.findByAssetId(id);
            verify(eventOwner).findBySourceId(id); verify(assetOwner).findByAssetId(id);
        }
    }
    @Test void cohostedOwnersRequireSeparateCredentialsModeAndMethod() throws Exception {
        for (var path : List.of(EVENT_PATH, ASSET_PATH)) {
            String token = path.equals(EVENT_PATH) ? EVENT_TOKEN : ASSET_TOKEN;
            String other = path.equals(EVENT_PATH) ? ASSET_TOKEN : EVENT_TOKEN;
            for (var supplied : new String[]{null, other}) assertEquals(401, request(path, "?id=known", supplied, "REAL", "GET").statusCode());
            for (var mode : new String[]{null, "demo", "ANY"}) assertEquals(400, request(path, "?id=known", token, mode, "GET").statusCode());
            assertEquals(403, request(path, "", token, "REAL", "POST").statusCode());
            assertEquals(400, request(path, "?id=" + "x".repeat(513), token, "REAL", "GET").statusCode());
        }
    }
    @Test void errorsNeverTurnIntoMissingOwnershipFacts() throws Exception {
        assertEquals(503, request(EVENT_PATH, "?id=fail", EVENT_TOKEN, "REAL", "GET").statusCode());
        assertEquals(503, request(ASSET_PATH, "?id=fail", ASSET_TOKEN, "REAL", "GET").statusCode());
        assertEquals(503, assertThrows(RemoteReadException.class, () -> events.findBySourceId("fail")).status());
        assertEquals(503, assertThrows(RemoteReadException.class, () -> assets.findByAssetId("fail")).status());
    }
    static HttpResponse<String> request(String path, String suffix, String token, String mode, String method) throws Exception {
        var builder = HttpRequest.newBuilder(origin.resolve(path + suffix)).timeout(Duration.ofSeconds(3));
        if (token != null) builder.header("Authorization", "Bearer " + token);
        if (mode != null) builder.header(InternalReadCredentialFilter.MODE_HEADER, mode);
        var response = http.send(builder.method(method, HttpRequest.BodyPublishers.noBody()).build(), HttpResponse.BodyHandlers.ofString());
        assertEquals("no-store", response.headers().firstValue("Cache-Control").orElseThrow());
        var directory = path.equals(EVENT_PATH) ? "event-membership-facts" : "asset-membership-facts";
        Files.writeString(Path.of(System.getProperty("wireEvidenceDirectory"), directory, "response-" + sequence.incrementAndGet() + ".json"),
                new JsonMapper().writeValueAsString(Map.of("path", path, "method", "get", "status", response.statusCode(), "body", new JsonMapper().readTree(response.body()))));
        return response;
    }
    @SpringBootConfiguration
    @EnableAutoConfiguration(excludeName = {
            "org.springframework.boot.mongodb.autoconfigure.MongoAutoConfiguration",
            "org.springframework.boot.data.mongodb.autoconfigure.DataMongoAutoConfiguration",
            "org.springframework.boot.data.mongodb.autoconfigure.DataMongoRepositoriesAutoConfiguration",
            "org.springframework.boot.security.autoconfigure.UserDetailsServiceAutoConfiguration"})
    @Import({EventMembershipFactsServerConfiguration.class, AssetMembershipFactsServerConfiguration.class, ServiceSecurityConfiguration.class})
    static class Fixture {
        @Bean EventMembershipFacts events() {
            var owner = mock(EventMembershipFacts.class);
            when(owner.findBySourceId(nullable(String.class))).thenAnswer(c -> {
                String id = c.getArgument(0);
                if ("fail".equals(id)) throw new IllegalStateException("private failure details");
                if ("missing".equals(id) || "empty".equals(id)) return List.of();
                return Arrays.asList(new EventMembershipFactsDto(MongoSessionModeContext.currentMode().name(), "2026-10-08T07:00:00Z", "creator", "UR",
                        "nulls".equals(id) ? null : Arrays.asList("admin", null, "")), null);
            });
            return owner;
        }
        @Bean AssetMembershipFacts assets() {
            var owner = mock(AssetMembershipFacts.class);
            when(owner.findByAssetId(nullable(String.class))).thenAnswer(c -> {
                String id = c.getArgument(0);
                if ("fail".equals(id)) throw new IllegalStateException("private failure details");
                if ("missing".equals(id)) return Optional.empty();
                return Optional.of(new AssetMembershipFactsDto(MongoSessionModeContext.currentMode().name(), "UR", "released",
                        "nulls".equals(id) ? null : "empty".equals(id) ? List.of() : Arrays.asList(new AssetMembershipRequestDto("applicant", "accepted"), null)));
            });
            return owner;
        }
    }
}
