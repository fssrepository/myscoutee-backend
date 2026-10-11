package com.raxim.myscoutee.microservices.transport.campaigns;

import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.domain.affinity.api.RatingDirectory;
import com.raxim.myscoutee.domain.campaigns.document.Campaign;
import com.raxim.myscoutee.domain.campaigns.service.CampaignCatalogService;
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
import org.springframework.data.mongodb.core.MongoTemplate;
import tools.jackson.databind.json.JsonMapper;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class CampaignCatalogHttpTest {
    static final String TOKEN = "test-only-campaign-catalog-token-0000000000000000";
    static final String PATH = CampaignCatalogProtocol.ORGANIZER_CONTACT;
    static final String QUERY = "{\"id\":\"campaign\",\"viewerId\":\"viewer\",\"workspaceGroupId\":\"work\"}";
    static ConfigurableApplicationContext server;
    static RemoteCampaignCatalog remote;
    static HttpClient http;
    static URI origin;
    static SimpleMeterRegistry meters;
    static Path evidence;
    static AtomicInteger sequence = new AtomicInteger();

    @BeforeAll static void start() throws Exception {
        evidence = Path.of(System.getProperty("wireEvidenceDirectory"), "campaign-catalog");
        Files.createDirectories(evidence);
        try (var files = Files.list(evidence)) {
            for (var file : files.filter(p -> p.getFileName().toString().matches("response-[0-9]+\\.json")).toList()) Files.delete(file);
        }
        server = new SpringApplicationBuilder(Fixture.class).properties(
                "server.address=127.0.0.1", "server.port=0", "management.server.port=0",
                "myscoutee.remote.campaign-catalog.read-token=" + TOKEN,
                "spring.main.banner-mode=off", "logging.level.root=WARN").run();
        origin = URI.create("http://127.0.0.1:" + server.getEnvironment().getProperty("local.server.port"));
        http = HttpClient.newBuilder().followRedirects(HttpClient.Redirect.NEVER).build();
        meters = new SimpleMeterRegistry();
        remote = new RemoteCampaignCatalog(origin, TOKEN, true, Duration.ofSeconds(1), Duration.ofSeconds(3), new JsonMapper(), meters);
    }
    @AfterEach void clear() { MongoSessionModeContext.clear(); }
    @AfterAll static void stop() {
        if (remote != null) remote.close();
        if (http != null) http.shutdownNow();
        if (server != null) server.close();
        if (meters != null) meters.close();
    }

    @Test void localAndHttpPreserveAvailabilityAndRatingsInBothModes() throws Exception {
        var local = server.getBean(CampaignCatalogService.class);
        for (var mode : List.of(MongoSessionMode.REAL, MongoSessionMode.DEMO, MongoSessionMode.REAL)) {
            MongoSessionModeContext.set(mode);
            assertEquals(local.organizerContact("campaign", "viewer", "work"), remote.organizerContact("campaign", "viewer", "work"));
            assertEquals(mode == MongoSessionMode.DEMO, remote.organizerContact("campaign", "viewer", "work").positivelyRated());
            assertNull(remote.organizerContact("missing", "viewer", "work"));
            assertNull(remote.organizerContact("campaign", "viewer", "other"));
            assertNull(remote.organizerContact("campaign", "organizer", "work"));
            assertEquals(200, request(TOKEN, mode.name(), "POST", QUERY, "application/json").statusCode());
        }
    }

    @Test void credentialsModeAndOperationRemainMandatory() throws Exception {
        for (var token : new String[]{null, "test-only-other-capability-token-0000000000000000"})
            assertEquals(401, request(token, "DEMO", "POST", QUERY, "application/json").statusCode());
        for (var mode : new String[]{null, "demo", "ANY"})
            assertEquals(400, request(TOKEN, mode, "POST", QUERY, "application/json").statusCode());
        assertEquals(403, request(TOKEN, "DEMO", "DELETE", null, null).statusCode());
    }

    @Test void strictBodiesAndBoundsAreEnforced() throws Exception {
        for (var body : List.of("{}", QUERY.replace("\"viewer\"", "\" \""), QUERY.replace("\"viewer\"", "\"" + "x".repeat(513) + "\""),
                QUERY.replace("viewer\"", "viewer\",\"extra\":true"), QUERY + "{}"))
            assertEquals(400, request(TOKEN, "DEMO", "POST", body, "application/json").statusCode());
        assertEquals(415, request(TOKEN, "DEMO", "POST", QUERY, "text/plain").statusCode());
        assertEquals(413, request(TOKEN, "DEMO", "POST", " ".repeat(CampaignCatalogProtocol.MAX_REQUEST_BYTES + 1), "application/json").statusCode());
    }

    @Test void failedRatingLookupRemainsUnavailable() throws Exception {
        MongoSessionModeContext.set(MongoSessionMode.DEMO);
        var failure = assertThrows(RemoteReadException.class, () -> remote.organizerContact("campaign", "fail", "work"));
        assertEquals(503, failure.status());
        var response = request(TOKEN, "DEMO", "POST", QUERY.replace("\"viewer\"", "\"fail\""), "application/json");
        assertEquals(503, response.statusCode());
        assertFalse(response.body().contains("private"));
    }

    static HttpResponse<String> request(String token, String mode, String method, String body, String contentType) throws Exception {
        var builder = HttpRequest.newBuilder(origin.resolve(PATH)).timeout(Duration.ofSeconds(3));
        if (token != null) builder.header("Authorization", "Bearer " + token);
        if (mode != null) builder.header(InternalReadCredentialFilter.MODE_HEADER, mode);
        if (contentType != null) builder.header("Content-Type", contentType);
        var response = http.send(builder.method(method, body == null ? HttpRequest.BodyPublishers.noBody() : HttpRequest.BodyPublishers.ofString(body)).build(), HttpResponse.BodyHandlers.ofString());
        assertEquals("no-store", response.headers().firstValue("Cache-Control").orElseThrow());
        Files.writeString(evidence.resolve("response-" + sequence.incrementAndGet() + ".json"),
                new JsonMapper().writeValueAsString(Map.of("path", PATH, "method", method.toLowerCase(java.util.Locale.ROOT), "status", response.statusCode(),
                        "body", new JsonMapper().readTree(response.body()))));
        return response;
    }

    @SpringBootConfiguration
    @EnableAutoConfiguration(excludeName={
            "org.springframework.boot.mongodb.autoconfigure.MongoAutoConfiguration",
            "org.springframework.boot.data.mongodb.autoconfigure.DataMongoAutoConfiguration",
            "org.springframework.boot.data.mongodb.autoconfigure.DataMongoRepositoriesAutoConfiguration",
            "org.springframework.boot.security.autoconfigure.UserDetailsServiceAutoConfiguration"})
    @Import({CampaignCatalogServerConfiguration.class, ServiceSecurityConfiguration.class})
    static class Fixture {
        @Bean MongoTemplate mongo() {
            var mongo = mock(MongoTemplate.class);
            when(mongo.findById(eq("campaign"), eq(Campaign.class))).thenReturn(new Campaign("campaign", "work", "organizer",
                    "Idea", "Description", "business", "technology", List.of(), List.of(), "published", "now", "now", 1L));
            return mongo;
        }
        @Bean RatingDirectory ratings() {
            var ratings = mock(RatingDirectory.class);
            when(ratings.hasPositiveCampaignRating(eq("campaign"), anyString(), eq("organizer"))).thenAnswer(call -> {
                if ("fail".equals(call.getArgument(1))) throw new IllegalStateException("private rating details");
                return MongoSessionModeContext.currentMode() == MongoSessionMode.DEMO;
            });
            return ratings;
        }
        @Bean CampaignCatalogService campaigns(MongoTemplate mongo, RatingDirectory ratings) { return new CampaignCatalogService(mongo, ratings); }
    }
}
