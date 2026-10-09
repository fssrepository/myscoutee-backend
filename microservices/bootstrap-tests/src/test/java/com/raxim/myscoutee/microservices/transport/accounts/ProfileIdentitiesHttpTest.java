package com.raxim.myscoutee.microservices.transport.accounts;

import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.domain.accounts.api.ProfileIdentities;
import com.raxim.myscoutee.domain.accounts.dto.ProfileIdentityDto;
import com.raxim.myscoutee.microservices.bootstrap.ServiceSecurityConfiguration;
import com.raxim.myscoutee.microservices.transport.common.InternalReadCredentialFilter;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport.RemoteReadException;
import io.micrometer.core.instrument.simple.SimpleMeterRegistry;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.Optional;
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

/** HTTP/serialization/scope tests with a port fixture; canonical mapping has its own JUnit regression. */
class ProfileIdentitiesHttpTest {
    static final String TOKEN = "test-only-profile-identities-token-000000000000000000";
    static ConfigurableApplicationContext server;
    static HttpClient http;
    static RemoteProfileIdentities remote;
    static SimpleMeterRegistry meters;
    static URI origin;
    static Path evidence;
    static final AtomicInteger sequence = new AtomicInteger();

    @BeforeAll static void start() throws Exception {
        evidence = Path.of(System.getProperty("wireEvidenceDirectory"), "profile-identities");
        Files.createDirectories(evidence);
        try (var files = Files.list(evidence)) {
            for (var file : files.filter(p -> p.getFileName().toString().matches("response-[0-9]+\\.json")).toList()) Files.delete(file);
        }
        server = new SpringApplicationBuilder(Fixture.class).properties(
                "server.address=127.0.0.1", "server.port=0", "management.server.port=0",
                "myscoutee.remote.profile-identities.read-token=" + TOKEN,
                "spring.main.banner-mode=off", "logging.level.root=WARN").run();
        origin = URI.create("http://127.0.0.1:" + server.getEnvironment().getProperty("local.server.port"));
        http = HttpClient.newBuilder().followRedirects(HttpClient.Redirect.NEVER).build();
        meters = new SimpleMeterRegistry();
        remote = new RemoteProfileIdentities(origin, TOKEN, true, Duration.ofSeconds(1), Duration.ofSeconds(3), new JsonMapper(), meters);
    }

    @AfterEach void clear() { MongoSessionModeContext.clear(); }
    @AfterAll static void stop() {
        if (remote != null) remote.close();
        if (http != null) http.shutdownNow();
        if (server != null) server.close();
        if (meters != null) meters.close();
    }

    @Test void modeIdentityAbsenceAndEncodedIdsSurviveTransport() throws Exception {
        for (var mode : List.of(MongoSessionMode.REAL, MongoSessionMode.DEMO, MongoSessionMode.REAL)) {
            MongoSessionModeContext.set(mode);
            var id = "profile &+#é?";
            assertEquals(Optional.of(new ProfileIdentityDto(id, mode.name(), "work")), remote.findIdentityByUserId(id));
            assertTrue(remote.findIdentityByUserId("missing").isEmpty());
            assertEquals(Optional.of(new ProfileIdentityDto(id, mode.name(), "work")), remote.findFirstIdentityByUserId(id));
            assertTrue(remote.findFirstIdentityByUserId("missing").isEmpty());
            assertTrue(remote.existsNotDeleted("known"));
            assertFalse(remote.existsNotDeleted("missing"));
            assertEquals(List.of(mode.name(), "work"), remote.userIdsByWorkspace("work"));
            assertEquals(List.of("base-account"), remote.userIdsByWorkspace(null));
            assertEquals(List.of(mode.name(), ""), remote.userIdsByWorkspace(""));
            assertEquals(List.of(), remote.userIdsByWorkspace("empty"));
            assertEquals(200, request(ProfileIdentitiesProtocol.PROFILE_PATH, "?userId=known", TOKEN, mode.name(), "GET").statusCode());
            assertEquals(404, request(ProfileIdentitiesProtocol.PROFILE_PATH, "?userId=missing", TOKEN, mode.name(), "GET").statusCode());
            assertEquals(200, request(ProfileIdentitiesProtocol.WORKSPACE_PATH, "?groupId=work", TOKEN, mode.name(), "GET").statusCode());
            assertEquals(200, request(ProfileIdentitiesProtocol.WORKSPACE_PATH, "?groupId=empty", TOKEN, mode.name(), "GET").statusCode());
            assertEquals(200, request(ProfileIdentitiesProtocol.FIRST_PROFILE_PATH, "?userId=known", TOKEN, mode.name(), "GET").statusCode());
            assertEquals(404, request(ProfileIdentitiesProtocol.FIRST_PROFILE_PATH, "?userId=missing", TOKEN, mode.name(), "GET").statusCode());
            assertEquals(200, request(ProfileIdentitiesProtocol.EXISTS_PATH, "?userId=known", TOKEN, mode.name(), "GET").statusCode());
            assertEquals(200, request(ProfileIdentitiesProtocol.EXISTS_PATH, "?userId=missing", TOKEN, mode.name(), "GET").statusCode());
        }
    }

    @Test void identityDataRequiresDedicatedCredentialAndExplicitMode() throws Exception {
        for (var path : List.of(ProfileIdentitiesProtocol.PROFILE_PATH, ProfileIdentitiesProtocol.FIRST_PROFILE_PATH,
                ProfileIdentitiesProtocol.EXISTS_PATH, ProfileIdentitiesProtocol.WORKSPACE_PATH)) {
            for (var token : new String[]{null, "wrong"})
                assertEquals(401, request(path, "", token, "DEMO", "GET").statusCode());
            for (var mode : new String[]{null, "demo", "ANY"})
                assertEquals(400, request(path, "", TOKEN, mode, "GET").statusCode());
            assertEquals(403, request(path, "", TOKEN, "REAL", "POST").statusCode());
        }
    }

    @Test void boundedInputAndOwnerFailureDoNotMasqueradeAsEmptyIdentityOrWorkspace() throws Exception {
        for (var entry : Map.of(ProfileIdentitiesProtocol.PROFILE_PATH, "userId", ProfileIdentitiesProtocol.FIRST_PROFILE_PATH, "userId",
                ProfileIdentitiesProtocol.EXISTS_PATH, "userId", ProfileIdentitiesProtocol.WORKSPACE_PATH, "groupId").entrySet()) {
            assertEquals(400, request(entry.getKey(), "?" + entry.getValue() + "=" + "x".repeat(513), TOKEN, "REAL", "GET").statusCode());
            var failure = request(entry.getKey(), "?" + entry.getValue() + "=fail", TOKEN, "REAL", "GET");
            assertEquals(503, failure.statusCode());
            assertEquals("{\"code\":\"PROFILE_IDENTITIES_UNAVAILABLE\"}", failure.body());
        }
        assertEquals(503, assertThrows(RemoteReadException.class, () -> remote.findIdentityByUserId("fail")).status());
        assertEquals(503, assertThrows(RemoteReadException.class, () -> remote.userIdsByWorkspace("fail")).status());
        assertEquals(503, assertThrows(RemoteReadException.class, () -> remote.findFirstIdentityByUserId("fail")).status());
        assertEquals(503, assertThrows(RemoteReadException.class, () -> remote.existsNotDeleted("fail")).status());
    }

    static HttpResponse<String> request(String path, String suffix, String token, String mode, String method) throws Exception {
        var builder = HttpRequest.newBuilder(origin.resolve(path + suffix)).timeout(Duration.ofSeconds(3));
        if (token != null) builder.header("Authorization", "Bearer " + token);
        if (mode != null) builder.header(InternalReadCredentialFilter.MODE_HEADER, mode);
        var response = http.send(builder.method(method, HttpRequest.BodyPublishers.noBody()).build(), HttpResponse.BodyHandlers.ofString());
        var mapper = new JsonMapper();
        Files.writeString(evidence.resolve("response-" + sequence.incrementAndGet() + ".json"), mapper.writeValueAsString(
                Map.of("path", path, "status", response.statusCode(), "body", mapper.readTree(response.body()))));
        assertEquals("no-store", response.headers().firstValue("Cache-Control").orElseThrow());
        return response;
    }

    @SpringBootConfiguration
    @EnableAutoConfiguration(excludeName = {
            "org.springframework.boot.mongodb.autoconfigure.MongoAutoConfiguration",
            "org.springframework.boot.data.mongodb.autoconfigure.DataMongoAutoConfiguration",
            "org.springframework.boot.data.mongodb.autoconfigure.DataMongoRepositoriesAutoConfiguration",
            "org.springframework.boot.security.autoconfigure.UserDetailsServiceAutoConfiguration"})
    @Import({ProfileIdentitiesServerConfiguration.class, ServiceSecurityConfiguration.class})
    static class Fixture {
        @Bean ProfileIdentities canonicalPortFixture() {
            var profiles = mock(ProfileIdentities.class);
            when(profiles.findIdentityByUserId(nullable(String.class))).thenAnswer(call -> {
                String id = call.getArgument(0);
                if ("fail".equals(id)) throw new IllegalStateException("secret database details");
                return "missing".equals(id) ? Optional.empty() : Optional.of(new ProfileIdentityDto(id, MongoSessionModeContext.currentMode().name(), "work"));
            });
            when(profiles.findFirstIdentityByUserId(nullable(String.class))).thenAnswer(call ->
                    profiles.findIdentityByUserId(call.getArgument(0)));
            when(profiles.existsNotDeleted(nullable(String.class))).thenAnswer(call -> {
                if ("fail".equals(call.getArgument(0))) throw new IllegalStateException("secret database details");
                return !"missing".equals(call.getArgument(0));
            });
            when(profiles.userIdsByWorkspace(nullable(String.class))).thenAnswer(call -> {
                String group = call.getArgument(0);
                if ("fail".equals(group)) throw new IllegalStateException("secret database details");
                if (group == null) return List.of("base-account");
                if (group.equals("empty")) return List.of();
                return List.of(MongoSessionModeContext.currentMode().name(), group);
            });
            return profiles;
        }
    }
}
