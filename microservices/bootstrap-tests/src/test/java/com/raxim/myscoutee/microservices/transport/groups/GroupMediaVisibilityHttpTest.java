package com.raxim.myscoutee.microservices.transport.groups;

import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.domain.groups.service.GroupMediaVisibilityService;
import com.raxim.myscoutee.microservices.bootstrap.ServiceSecurityConfiguration;
import com.raxim.myscoutee.microservices.transport.common.InternalReadCredentialFilter;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport.RemoteReadException;
import io.micrometer.core.instrument.simple.SimpleMeterRegistry;
import java.net.URI;
import java.net.InetSocketAddress;
import com.sun.net.httpserver.HttpServer;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
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

/** Loopback HTTP through the canonical group projection; only MongoDB is mocked. */
class GroupMediaVisibilityHttpTest {
    static final String TOKEN = "test-only-groups-media-token-0000000000000000000000";
    static ConfigurableApplicationContext server;
    static HttpClient http;
    static RemoteGroupMediaVisibility remote;
    static SimpleMeterRegistry meters;
    static URI origin;
    static Path evidence;
    static final AtomicInteger sequence = new AtomicInteger();

    @BeforeAll static void start() throws Exception {
        evidence = Path.of(System.getProperty("wireEvidenceDirectory"), "groups-media");
        Files.createDirectories(evidence);
        try (var files = Files.list(evidence)) {
            for (var file : files.filter(p -> p.getFileName().toString().matches("response-[0-9]+\\.json")).toList()) Files.delete(file);
        }
        server = new SpringApplicationBuilder(Fixture.class).properties(
                "server.address=127.0.0.1", "server.port=0", "management.server.port=0",
                "myscoutee.remote.groups-media.read-token=" + TOKEN,
                "spring.main.banner-mode=off", "logging.level.root=WARN").run();
        origin = URI.create("http://127.0.0.1:" + server.getEnvironment().getProperty("local.server.port"));
        http = HttpClient.newBuilder().followRedirects(HttpClient.Redirect.NEVER).build();
        meters = new SimpleMeterRegistry();
        remote = new RemoteGroupMediaVisibility(origin, TOKEN, true, Duration.ofSeconds(1), Duration.ofSeconds(3), new JsonMapper(), meters);
    }

    @AfterEach void clear() { MongoSessionModeContext.clear(); }
    @AfterAll static void stop() {
        if (remote != null) remote.close();
        if (http != null) http.shutdownNow();
        if (server != null) server.close();
        if (meters != null) meters.close();
    }

    @Test void remotePreservesCanonicalModeProjectionAndAbsence() throws Exception {
        var local = server.getBean(GroupMediaVisibilityService.class);
        for (var mode : List.of(MongoSessionMode.REAL, MongoSessionMode.DEMO, MongoSessionMode.REAL)) {
            MongoSessionModeContext.set(mode);
            assertEquals(local.group("known"), remote.group("known"));
            assertEquals(mode.name(), remote.group("known").lifecycleStatus());
            assertEquals(local.group("unset"), remote.group("unset"));
            assertNotNull(remote.group("unset"));
            assertNull(remote.group("unset").lifecycleStatus());
            assertNull(remote.group("missing"));
            for (var id : List.of("known", "unset", "missing")) {
                var response = request("?id=" + id, TOKEN, mode.name(), "GET");
                assertEquals(id.equals("missing") ? 404 : 200, response.statusCode());
                assertEquals("no-store", response.headers().firstValue("Cache-Control").orElseThrow());
                assertFalse(response.body().contains("private-field"));
            }
        }
    }

    @Test void missingOrWrongCredentialCannotSelectMode() throws Exception {
        for (var token : new String[]{null, "wrong"})
            assertEquals(401, request("?id=known", token, "DEMO", "GET").statusCode());
        for (var mode : new String[]{null, "demo", "ANY"})
            assertEquals(400, request("?id=known", TOKEN, mode, "GET").statusCode());
        assertEquals(403, request("?id=known", TOKEN, "REAL", "POST").statusCode());
    }

    @Test void duplicateCredentialsAndModesAreRejected() throws Exception {
        for (var header : List.of("Authorization", InternalReadCredentialFilter.MODE_HEADER)) {
            var builder = HttpRequest.newBuilder(origin.resolve(GroupMediaVisibilityProtocol.PATH + "?id=known"))
                    .header("Authorization", "Bearer " + TOKEN).header(InternalReadCredentialFilter.MODE_HEADER, "REAL");
            builder.header(header, header.equals("Authorization") ? "Bearer " + TOKEN : "DEMO");
            assertEquals(header.equals("Authorization") ? 401 : 400,
                    http.send(builder.GET().build(), HttpResponse.BodyHandlers.ofString()).statusCode());
        }
    }

    @Test void invalidIdAndDatabaseFailureStayDistinctFromMissingGroup() throws Exception {
        for (var suffix : List.of("", "?id=", "?id=%20", "?id=" + "x".repeat(513)))
            assertEquals(400, request(suffix, TOKEN, "REAL", "GET").statusCode());
        var response = request("?id=fail", TOKEN, "REAL", "GET");
        assertEquals(503, response.statusCode());
        assertEquals("{\"code\":\"GROUP_VISIBILITY_UNAVAILABLE\"}", response.body());
        assertEquals(503, assertThrows(RemoteReadException.class, () -> remote.group("fail")).status());
        assertThrows(IllegalArgumentException.class, () -> remote.group(" "));
    }

    @Test void proxyNotFoundIsNotAMissingGroup() throws Exception {
        var peer = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
        peer.createContext("/", exchange -> {
            exchange.getResponseHeaders().add("Content-Type", "text/html");
            exchange.sendResponseHeaders(404, -1);
            exchange.close();
        });
        peer.start();
        try (var adapter = new RemoteGroupMediaVisibility(URI.create("http://127.0.0.1:" + peer.getAddress().getPort()),
                TOKEN, true, Duration.ofSeconds(1), Duration.ofSeconds(3), new JsonMapper(), meters)) {
            assertEquals(404, assertThrows(RemoteReadException.class, () -> adapter.group("known")).status());
        } finally { peer.stop(0); }
    }

    static HttpResponse<String> request(String suffix, String token, String mode, String method) throws Exception {
        var builder = HttpRequest.newBuilder(origin.resolve(GroupMediaVisibilityProtocol.PATH + suffix)).timeout(Duration.ofSeconds(3));
        if (token != null) builder.header("Authorization", "Bearer " + token);
        if (mode != null) builder.header(InternalReadCredentialFilter.MODE_HEADER, mode);
        var response = http.send(builder.method(method, HttpRequest.BodyPublishers.noBody()).build(), HttpResponse.BodyHandlers.ofString());
        var mapper = new JsonMapper();
        Files.writeString(evidence.resolve("response-" + sequence.incrementAndGet() + ".json"), mapper.writeValueAsString(
                Map.of("path", GroupMediaVisibilityProtocol.PATH, "status", response.statusCode(), "body", mapper.readTree(response.body()))));
        return response;
    }

    @SpringBootConfiguration
    @EnableAutoConfiguration(excludeName = {
            "org.springframework.boot.mongodb.autoconfigure.MongoAutoConfiguration",
            "org.springframework.boot.data.mongodb.autoconfigure.DataMongoAutoConfiguration",
            "org.springframework.boot.data.mongodb.autoconfigure.DataMongoRepositoriesAutoConfiguration",
            "org.springframework.boot.security.autoconfigure.UserDetailsServiceAutoConfiguration"})
    @Import({GroupMediaVisibilityServerConfiguration.class, ServiceSecurityConfiguration.class})
    static class Fixture {
        @Bean GroupMediaVisibilityService canonicalOwner() {
            var mongo = mock(MongoTemplate.class);
            when(mongo.findOne(any(Query.class), eq(Document.class), eq("communityGroups"))).thenAnswer(call -> {
                var id = ((Query) call.getArgument(0)).getQueryObject().getString("_id");
                if (id.equals("missing")) return null;
                if (id.equals("fail")) throw new IllegalStateException("secret database details");
                return new Document("lifecycleStatus", id.equals("unset") ? null : MongoSessionModeContext.currentMode().name())
                        .append("private-field", "must not cross the wire");
            });
            return new GroupMediaVisibilityService(mongo);
        }
    }
}
