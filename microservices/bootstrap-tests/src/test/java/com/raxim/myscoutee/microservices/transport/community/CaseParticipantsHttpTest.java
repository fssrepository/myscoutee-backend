package com.raxim.myscoutee.microservices.transport.community;

import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.domain.community.document.ServiceCase;
import com.raxim.myscoutee.domain.community.dto.CaseDetails;
import com.raxim.myscoutee.domain.community.dto.CaseVisibilityQueryDto;
import com.raxim.myscoutee.domain.community.repository.ServiceCasesRepository;
import com.raxim.myscoutee.domain.community.service.CaseParticipantsService;
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

class CaseParticipantsHttpTest {
    static final String TOKEN = "test-only-case-participants-token-00000000000000000";
    static ConfigurableApplicationContext server;
    static RemoteCaseParticipants remote;
    static HttpClient http;
    static URI origin;
    static SimpleMeterRegistry meters;
    static Path evidence;
    static final AtomicInteger sequence = new AtomicInteger();
    @BeforeAll static void start() throws Exception {
        evidence = Path.of(System.getProperty("wireEvidenceDirectory"), "case-participants");
        Files.createDirectories(evidence);
        try (var files = Files.list(evidence)) {
            for (var file : files.filter(p -> p.getFileName().toString().matches("response-[0-9]+\\.json")).toList()) Files.delete(file);
        }
        server = new SpringApplicationBuilder(Fixture.class).properties(
                "server.address=127.0.0.1", "server.port=0", "management.server.port=0",
                "myscoutee.remote.case-participants.read-token=" + TOKEN,
                "spring.main.allow-bean-definition-overriding=false",
                "spring.main.banner-mode=off", "logging.level.root=WARN").run();
        origin = URI.create("http://127.0.0.1:" + server.getEnvironment().getProperty("local.server.port"));
        http = HttpClient.newBuilder().followRedirects(HttpClient.Redirect.NEVER).build();
        meters = new SimpleMeterRegistry();
        remote = new RemoteCaseParticipants(origin, TOKEN, true, Duration.ofSeconds(1), Duration.ofSeconds(3), new JsonMapper(), meters);
    }
    @AfterEach void clear() { MongoSessionModeContext.clear(); }
    @AfterAll static void stop() {
        if (remote != null) remote.close();
        if (http != null) http.shutdownNow();
        if (server != null) server.close();
        if (meters != null) meters.close();
    }
    @Test void conversationAndActiveAccountsRetainCanonicalPrivateOfferMembershipModesAndAbsence() throws Exception {
        var local = server.getBean(CaseParticipantsService.class);
        for (var mode : List.of(MongoSessionMode.REAL, MongoSessionMode.DEMO, MongoSessionMode.REAL)) {
            MongoSessionModeContext.set(mode);
            for (var id : List.of("known", "empty", "missing")) {
                assertEquals(local.conversation(id), remote.conversation(id));
                assertEquals(local.activeAccounts(id), remote.activeAccounts(id));
                for (var path : List.of(CaseParticipantsProtocol.CONVERSATION, CaseParticipantsProtocol.ACTIVE)) {
                    var response = request(path, "?caseId=" + id, "", TOKEN, mode.name(), "GET", "application/json", false);
                    assertEquals(id.equals("missing") ? 404 : 200, response.statusCode());
                    assertFalse(response.body().contains("private-description"));
                }
            }
            assertEquals(mode.name(), remote.conversation("known").orElseThrow().baseGroupId());
        }
        var conversation = remote.conversation("known").orElseThrow();
        assertEquals(List.of("owner", "resident", "provider-a", "provider-b"), conversation.activeParticipantAccountIds());
        assertEquals(List.of("owner", "resident", "provider-b"), conversation.chatParticipantAccountIds());
        assertEquals(List.of("owner", "resident", "provider-a"), conversation.offerChatParticipantAccountIds("offer-a"));
        assertEquals(List.of("owner", "resident", "provider-b"), conversation.offerChatParticipantAccountIds("offer-b"));
        assertEquals(Optional.of(List.of()), remote.activeAccounts("empty"));
    }
    @Test void countsKeepTrashExclusionIntegerCapAndNullEmptyOrLargeManagedGroupInputs() throws Exception {
        var local = server.getBean(CaseParticipantsService.class);
        for (var mode : List.of(MongoSessionMode.REAL, MongoSessionMode.DEMO)) {
            MongoSessionModeContext.set(mode);
            for (var base : List.of("base&é/?", "large", "empty")) {
                var ids = List.of("g&é/?", "g-two");
                assertEquals(local.visibleCount(base, "account&é/?", ids), remote.visibleCount(base, "account&é/?", ids));
                assertEquals(200, request(CaseParticipantsProtocol.COUNT, "", query(base, "account&é/?", ids), TOKEN, mode.name(), "POST", "application/json", false).statusCode());
            }
        }
        assertEquals(Integer.MAX_VALUE, remote.visibleCount("large", "id", List.of()));
        var repository = server.getBean(ServiceCasesRepository.class);
        remote.visibleCount(null, "", null); remote.visibleCount("", null, List.of());
        verify(repository).bucketCounts(null, "", null); verify(repository).bucketCounts("", null, List.of());
        assertEquals(local.visibleCount("base", "id", Collections.nCopies(100, "x".repeat(500))),
                remote.visibleCount("base", "id", Collections.nCopies(100, "x".repeat(500))));
    }
    @Test void allOperationsRequireTheirOwnCredentialModeAndMethod() throws Exception {
        for (var path : CaseParticipantsProtocol.paths()) {
            String method = path.equals(CaseParticipantsProtocol.COUNT) ? "POST" : "GET";
            String body = query("base", "id", List.of());
            for (var token : new String[]{null, "test-only-community-media-token-0000000000000000000"})
                assertEquals(401, request(path, "", body, token, "REAL", method, "application/json", false).statusCode());
            for (var mode : new String[]{null, "demo", "ANY"})
                assertEquals(400, request(path, "", body, TOKEN, mode, method, "application/json", false).statusCode());
            assertEquals(403, request(path, "", body, TOKEN, "REAL", method.equals("GET") ? "POST" : "GET", "application/json", false).statusCode());
        }
    }
    @Test void malformedOversizedAndChunkedCountQueriesCannotBecomeZeroCounts() throws Exception {
        var path = CaseParticipantsProtocol.COUNT;
        for (var body : List.of("{", "null", "{}", "{\"baseGroupId\":7,\"accountId\":null,\"managedGroupIds\":[]}",
                "{\"baseGroupId\":null,\"accountId\":null,\"managedGroupIds\":[7]}",
                "{\"baseGroupId\":null,\"accountId\":null,\"managedGroupIds\":{},\"extra\":true}",
                query("base", "id", Collections.nCopies(4097, "g")), query("x".repeat(513), "id", List.of()),
                query("base", "id", List.of()) + " {}"))
            assertEquals(400, request(path, "", body, TOKEN, "REAL", "POST", "application/json", false).statusCode());
        assertEquals(415, request(path, "", "{}", TOKEN, "REAL", "POST", "text/plain", false).statusCode());
        for (var chunked : List.of(false, true))
            assertEquals(413, request(path, "", " ".repeat(CaseParticipantsProtocol.MAX_QUERY_BYTES + 1), TOKEN, "REAL", "POST", "application/json", chunked).statusCode());
        for (var getPath : List.of(CaseParticipantsProtocol.CONVERSATION, CaseParticipantsProtocol.ACTIVE))
            assertEquals(400, request(getPath, "?caseId=" + "x".repeat(513), "", TOKEN, "REAL", "GET", "application/json", false).statusCode());
        assertThrows(IllegalArgumentException.class, () -> remote.visibleCount("base", "id", Collections.nCopies(4097, "g")));
    }
    @Test void ownerFailuresRemainUnavailableInsteadOfAbsenceOrZero() throws Exception {
        for (var path : CaseParticipantsProtocol.paths()) {
            boolean count = path.equals(CaseParticipantsProtocol.COUNT);
            var response = request(path, count ? "" : "?caseId=fail", query("fail", "id", List.of()), TOKEN, "REAL", count ? "POST" : "GET", "application/json", false);
            assertEquals(503, response.statusCode());
            assertEquals("{\"code\":\"CASE_PARTICIPANTS_UNAVAILABLE\"}", response.body());
        }
        assertEquals(503, assertThrows(RemoteReadException.class, () -> remote.conversation("fail")).status());
        assertEquals(503, assertThrows(RemoteReadException.class, () -> remote.activeAccounts("fail")).status());
        assertEquals(503, assertThrows(RemoteReadException.class, () -> remote.visibleCount("fail", "id", List.of())).status());
    }
    static String query(String base, String account, List<String> groups) {
        return new JsonMapper().writeValueAsString(new CaseVisibilityQueryDto(base, account, groups));
    }
    static HttpResponse<String> request(String path, String suffix, String body, String token, String mode, String method, String contentType, boolean chunked) throws Exception {
        var builder = HttpRequest.newBuilder(origin.resolve(path + suffix)).timeout(Duration.ofSeconds(3)).header("Content-Type", contentType);
        if (token != null) builder.header("Authorization", "Bearer " + token);
        if (mode != null) builder.header(InternalReadCredentialFilter.MODE_HEADER, mode);
        var publisher = chunked ? HttpRequest.BodyPublishers.ofInputStream(() -> new ByteArrayInputStream(body.getBytes(StandardCharsets.UTF_8))) : HttpRequest.BodyPublishers.ofString(body);
        var response = http.send(builder.method(method, publisher).build(), HttpResponse.BodyHandlers.ofString());
        assertEquals("no-store", response.headers().firstValue("Cache-Control").orElseThrow());
        Files.writeString(evidence.resolve("response-" + sequence.incrementAndGet() + ".json"), new JsonMapper().writeValueAsString(
                Map.of("path", path, "method", path.equals(CaseParticipantsProtocol.COUNT) ? "post" : "get", "status", response.statusCode(), "body", new JsonMapper().readTree(response.body()))));
        return response;
    }
    @SpringBootConfiguration
    @EnableAutoConfiguration(excludeName = {
            "org.springframework.boot.mongodb.autoconfigure.MongoAutoConfiguration",
            "org.springframework.boot.data.mongodb.autoconfigure.DataMongoAutoConfiguration",
            "org.springframework.boot.data.mongodb.autoconfigure.DataMongoRepositoriesAutoConfiguration",
            "org.springframework.boot.security.autoconfigure.UserDetailsServiceAutoConfiguration"})
    @Import({CaseParticipantsServerConfiguration.class, ServiceSecurityConfiguration.class})
    static class Fixture {
        @Bean ServiceCasesRepository repository() {
            var repository = mock(ServiceCasesRepository.class);
            when(repository.findById(nullable(String.class))).thenAnswer(call -> {
                String id = call.getArgument(0);
                if ("fail".equals(id)) throw new IllegalStateException("secret database details");
                if ("missing".equals(id)) return Optional.empty();
                return Optional.of(new ServiceCase(id, MongoSessionModeContext.currentMode().name(), "homes", "owner", "Title", "private-description", "maintenance", "open", false,
                        List.of("owner", "resident"), "empty".equals(id) ? List.of() : List.of("owner", "resident", "provider-a", "provider-b", "invited", "removed"), List.of(),
                        List.of(new CaseDetails.Support("provider-a", "a", "accepted"), new CaseDetails.Support("provider-b", "b", "accepted")), List.of(),
                        List.of(offer("offer-a", "provider-a"), offer("offer-b", "provider-b")), null, null, "now", "now", 1L,
                        Map.of("invited", "invited", "removed", "removed"), List.of(), List.of("provider-b")));
            });
            when(repository.bucketCounts(nullable(String.class), nullable(String.class), nullable(Collection.class))).thenAnswer(call -> {
                String base = call.getArgument(0);
                if ("fail".equals(base)) throw new IllegalStateException("secret database details");
                if ("empty".equals(base)) return List.of();
                return List.of(new ServiceCasesRepository.CaseBucket("open", "maintenance", "large".equals(base) ? Integer.MAX_VALUE : MongoSessionModeContext.currentMode() == MongoSessionMode.REAL ? 3 : 7),
                        new ServiceCasesRepository.CaseBucket("completed", "maintenance", 2), new ServiceCasesRepository.CaseBucket("trash", "maintenance", 10));
            });
            return repository;
        }
        static CaseDetails.Offer offer(String id, String provider) {
            return new CaseDetails.Offer(id, provider, "service", 25, "EUR", "", "accepted", "now", null, null, List.of(), List.of());
        }
        @Bean CaseParticipantsService owner(ServiceCasesRepository repository) { return new CaseParticipantsService(repository); }
    }
}
