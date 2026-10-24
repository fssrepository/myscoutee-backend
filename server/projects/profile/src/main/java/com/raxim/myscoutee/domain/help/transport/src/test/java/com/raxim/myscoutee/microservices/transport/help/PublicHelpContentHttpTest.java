package com.raxim.myscoutee.microservices.transport.help;

import com.raxim.myscoutee.common.config.mongo.*;
import com.raxim.myscoutee.domain.help.api.PublicHelpContent;
import com.raxim.myscoutee.domain.help.dto.HelpCenterDtos.*;
import com.raxim.myscoutee.microservices.bootstrap.ServiceSecurityConfiguration;
import com.raxim.myscoutee.microservices.transport.common.InternalReadCredentialFilter;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport.RemoteReadException;
import io.micrometer.core.instrument.simple.SimpleMeterRegistry;
import java.net.URI;
import java.net.http.*;
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
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import tools.jackson.databind.json.JsonMapper;
import static org.junit.jupiter.api.Assertions.*;

class PublicHelpContentHttpTest {
    static final String TOKEN = "test-only-public-help-token-0000000000000000000000";
    static final JsonMapper mapper = new JsonMapper();
    static final AtomicInteger sequence = new AtomicInteger();
    static ConfigurableApplicationContext server;
    static RemotePublicHelpContent remote;
    static HttpClient http;
    static URI origin;
    static SimpleMeterRegistry meters;
    static Path evidence;

    @BeforeAll static void start() throws Exception {
        evidence = Path.of(System.getProperty("wireEvidenceDirectory"), "public-help-content");
        Files.createDirectories(evidence);
        try (var files = Files.list(evidence)) {
            for (var file : files.filter(p -> p.getFileName().toString().matches("response-[0-9]+\\.json")).toList()) Files.delete(file);
        }
        server = new SpringApplicationBuilder(Fixture.class).properties("server.address=127.0.0.1", "server.port=0", "management.server.port=0",
                "myscoutee.remote.public-help-content.read-token=" + TOKEN, "spring.main.banner-mode=off", "logging.level.root=WARN").run();
        origin = URI.create("http://127.0.0.1:" + server.getEnvironment().getProperty("local.server.port"));
        http = HttpClient.newBuilder().followRedirects(HttpClient.Redirect.NEVER).build();
        meters = new SimpleMeterRegistry();
        remote = new RemotePublicHelpContent(origin, TOKEN, true, Duration.ofSeconds(1), Duration.ofSeconds(3), mapper, meters);
    }
    @AfterEach void clear() { MongoSessionModeContext.clear(); }
    @AfterAll static void stop() {
        if (remote != null) remote.close();
        if (http != null) http.shutdownNow();
        if (server != null) server.close();
        if (meters != null) meters.close();
    }
    @Test void preservesPublicDocumentArgumentsNullsAndDatabaseModeThroughRealHttp() throws Exception {
        for (var mode : List.of(MongoSessionMode.REAL, MongoSessionMode.DEMO, MongoSessionMode.REAL)) {
            MongoSessionModeContext.set(mode);
            for (var kind : List.of("privacy", "terms", "explanation")) {
                var query = new PublicHelpContentProtocol.Query(kind, "hu", "en", "landing.consent", "myscoutee-work");
                assertEquals(server.getBean(PublicHelpContent.class).activeState(kind, "hu", "en", "landing.consent", "myscoutee-work"),
                        remote.activeState(kind, "hu", "en", "landing.consent", "myscoutee-work"));
                assertEquals(200, request(mapper.writeValueAsString(query), TOKEN, mode.name(), "POST", "application/json").statusCode());
            }
            assertEquals(List.of(), remote.activeState(null, null, null, null, null).revisions());
            assertEquals(mode, MongoSessionModeContext.currentMode());
        }
    }
    @Test void requiresServiceCapabilityAndValidModeAndRejectsNonReadOperations() throws Exception {
        for (var token : new String[]{null, "wrong-token-000000000000000000000000000000000"})
            assertEquals(401, request("{}", token, "REAL", "POST", "application/json").statusCode());
        for (var mode : new String[]{null, "demo", "ANY"})
            assertEquals(400, request("{}", TOKEN, mode, "POST", "application/json").statusCode());
        assertEquals(403, request("{}", TOKEN, "REAL", "GET", "application/json").statusCode());
    }
    @Test void rejectsUnknownTrailingAndOversizedInput() throws Exception {
        for (var invalid : List.of("null", "[]", "{} {}", "{\"actorUserId\":\"admin\"}", "{\"documentType\":\"" + "x".repeat(513) + "\"}"))
            assertEquals(400, request(invalid, TOKEN, "REAL", "POST", "application/json").statusCode());
        assertEquals(415, request("{}", TOKEN, "REAL", "POST", "text/plain").statusCode());
        assertEquals(413, request("x".repeat(PublicHelpContentProtocol.MAX_REQUEST_BYTES + 1), TOKEN, "REAL", "POST", "application/json").statusCode());
        assertThrows(IllegalArgumentException.class, () -> remote.activeState("x".repeat(513), null, null, null, null));
    }
    @Test void preservesOwnerRejectionAndDoesNotTurnFailureIntoEmptyContent() throws Exception {
        assertEquals(400, request("{\"baseGroupId\":\"invalid\"}", TOKEN, "REAL", "POST", "application/json").statusCode());
        assertEquals(400, assertThrows(ResponseStatusException.class,
                () -> remote.activeState(null, null, null, null, "invalid")).getStatusCode().value());
        var failed = request("{\"documentType\":\"fail\"}", TOKEN, "REAL", "POST", "application/json");
        assertEquals(503, failed.statusCode());
        assertFalse(failed.body().contains("private-storage"));
        assertEquals(503, assertThrows(RemoteReadException.class,
                () -> remote.activeState("fail", null, null, null, null)).status());
    }
    static HttpResponse<String> request(String body, String token, String mode, String method, String media) throws Exception {
        var builder = HttpRequest.newBuilder(origin.resolve(PublicHelpContentProtocol.PATH)).timeout(Duration.ofSeconds(3)).header("Content-Type", media);
        if (token != null) builder.header("Authorization", "Bearer " + token);
        if (mode != null) builder.header(InternalReadCredentialFilter.MODE_HEADER, mode);
        var response = http.send(builder.method(method, HttpRequest.BodyPublishers.ofString(body)).build(), HttpResponse.BodyHandlers.ofString());
        assertEquals("no-store", response.headers().firstValue("Cache-Control").orElseThrow());
        Files.writeString(evidence.resolve("response-" + sequence.incrementAndGet() + ".json"), mapper.writeValueAsString(Map.of(
                "path", PublicHelpContentProtocol.PATH, "method", method.toLowerCase(Locale.ROOT), "status", response.statusCode(), "body", mapper.readTree(response.body()))));
        return response;
    }
    @SpringBootConfiguration
    @EnableAutoConfiguration(excludeName = {"org.springframework.boot.mongodb.autoconfigure.MongoAutoConfiguration",
            "org.springframework.boot.data.mongodb.autoconfigure.DataMongoAutoConfiguration",
            "org.springframework.boot.data.mongodb.autoconfigure.DataMongoRepositoriesAutoConfiguration",
            "org.springframework.boot.security.autoconfigure.UserDetailsServiceAutoConfiguration"})
    @Import({PublicHelpContentServerConfiguration.class, ServiceSecurityConfiguration.class})
    static class Fixture {
        @Bean PublicHelpContent owner() {
            return (kind, lang, acceptLanguage, context, group) -> {
                if ("fail".equals(kind)) throw new IllegalStateException("private-storage");
                if ("invalid".equals(group)) throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
                var revision = kind == null ? null : new HelpCenterRevisionDto(
                        "published-" + MongoSessionModeContext.currentMode(), kind, context, lang, "Magyar", 3,
                        "Adatvédelem", "Summary", null, "#123456", "sections",
                        List.of(new HelpCenterSectionDto("intro", null, "Title", null, "<p>Published &amp; safe</p>",
                                List.of("https://example.test/image.png"), null, false, null)),
                        true, "2026-10-10T00:00:00Z", "author", null, null, true);
                return new HelpCenterStateDto(revision, revision == null ? List.of() : List.of(revision), List.of(),
                        List.of(new ContentLanguageDto(lang, MongoSessionModeContext.currentMode().name())),
                        List.of(new HelpCenterGuideFieldDto(kind, context, group, acceptLanguage, 1)));
            };
        }
    }
}
