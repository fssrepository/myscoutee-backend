package com.raxim.myscoutee.microservices.transport.events;

import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.common.dto.SharedDtos.PricingConfigDto;
import com.raxim.myscoutee.domain.events.api.MemberDirectory;
import com.raxim.myscoutee.domain.events.dto.MemberDirectoryEntryDto;
import com.raxim.myscoutee.domain.events.document.ActivityMember;
import com.raxim.myscoutee.domain.events.repository.ActivityMembersRepository;
import com.raxim.myscoutee.domain.events.service.MemberDirectoryService;
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
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.test.util.ReflectionTestUtils;
import tools.jackson.databind.json.JsonMapper;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class MemberDirectoryHttpTest {
    static final String TOKEN = "test-only-member-directory-token-00000000000000000";
    static ConfigurableApplicationContext server;
    static RemoteMemberDirectory remote;
    static HttpClient http;
    static URI origin;
    static SimpleMeterRegistry meters;
    static Path evidence;
    static final AtomicInteger sequence = new AtomicInteger();
    @BeforeAll static void start() throws Exception {
        evidence = Path.of(System.getProperty("wireEvidenceDirectory"), "member-directory");
        Files.createDirectories(evidence);
        try (var files = Files.list(evidence)) {
            for (var file : files.filter(p -> p.getFileName().toString().matches("response-[0-9]+\\.json")).toList()) Files.delete(file);
        }
        server = new SpringApplicationBuilder(Fixture.class).properties(
                "server.address=127.0.0.1", "server.port=0", "management.server.port=0",
                "myscoutee.remote.member-directory.read-token=" + TOKEN,
                "spring.main.allow-bean-definition-overriding=false",
                "spring.main.banner-mode=off", "logging.level.root=WARN").run();
        origin = URI.create("http://127.0.0.1:" + server.getEnvironment().getProperty("local.server.port"));
        http = HttpClient.newBuilder().followRedirects(HttpClient.Redirect.NEVER).build();
        meters = new SimpleMeterRegistry();
        remote = new RemoteMemberDirectory(origin, TOKEN, true, Duration.ofSeconds(1), Duration.ofSeconds(3), new JsonMapper(), meters);
    }
    @AfterEach void clear() { MongoSessionModeContext.clear(); }
    @AfterAll static void stop() {
        if (remote != null) remote.close();
        if (http != null) http.shutdownNow();
        if (server != null) server.close();
        if (meters != null) meters.close();
    }
    @Test void canonicalViewsListsPageAndModesSurviveTheWireWithoutDocumentExtras() throws Exception {
        var local = server.getBean(MemberDirectoryService.class);
        for (var mode : List.of(MongoSessionMode.REAL, MongoSessionMode.DEMO, MongoSessionMode.REAL)) {
            MongoSessionModeContext.set(mode);
            assertEquals(local.findByOwnerTypeAndOwnerIdAndUserId("event", "known", "user").map(MemberDirectoryEntryDto::from),
                    remote.findByOwnerTypeAndOwnerIdAndUserId("event", "known", "user"));
            assertEquals(mapped(local.findByOwnerTypeAndOwnerId("event", "known")), remote.findByOwnerTypeAndOwnerId("event", "known"));
            assertEquals(mapped(local.findByOwnerTypeAndUserId("event", "user")), remote.findByOwnerTypeAndUserId("event", "user"));
            assertEquals(mapped(local.findAll()), remote.findAll());
            var ids = Arrays.asList("one", "two&é/?", null, "");
            assertEquals(mapped(local.findByOwnerTypeAndOwnerIdIn("event", ids)), remote.findByOwnerTypeAndOwnerIdIn("event", ids));
            assertEquals(mapped(local.findAcceptedByOwnerTypeOwnerIdInAndUserId("event", ids, "user", "accepted")),
                    remote.findAcceptedByOwnerTypeOwnerIdInAndUserId("event", ids, "user", "accepted"));
            var expected = local.pageByOwnerAndStatus("event", "known", "accepted", 7, 20);
            var actual = remote.pageByOwnerAndStatus("event", "known", "accepted", 7, 20);
            assertEquals(expected.total(), actual.total()); assertEquals(mapped(expected.items()), actual.items());
            assertEquals(mode.name(), remote.findAll().getFirst().createdUser());
            for (var path : MemberDirectoryProtocol.paths()) {
                var response = request(path, suffix(path, "known"), body(path, "event"), TOKEN, mode.name(), method(path), "application/json", false);
                assertEquals(200, response.statusCode());
                assertFalse(response.body().contains("private-attendance"));
                assertFalse(response.body().contains("communityUpdates"));
                assertFalse(response.body().contains("eventVipPriceAudit"));
            }
        }
    }
    @Test void canonicalVipEligibilityAndNullablePricingRemainOwnerControlled() throws Exception {
        var local = server.getBean(MemberDirectoryService.class);
        for (String id : List.of("known", "accepted", "rejected", "not-vip", "disabled", "no-audience", "no-price", "missing")) {
            assertEquals(local.vipPricingOffer(id, "user"), remote.vipPricingOffer(id, "user"));
            var response = request(MemberDirectoryProtocol.VIP, "?sourceId=" + id + "&userId=user", "", TOKEN, "REAL", "GET", "application/json", false);
            assertEquals(Set.of("known", "accepted").contains(id) ? 200 : 404, response.statusCode());
        }
        assertEquals(7.25, remote.vipPricingOffer("known", "user").audience().vipPrice());
    }
    @Test void absenceEmptyNullAndEncodedInputsKeepCanonicalMeaning() throws Exception {
        assertTrue(remote.findByOwnerTypeAndOwnerIdAndUserId("event", "missing", "user").isEmpty());
        assertEquals(List.of(), remote.findByOwnerTypeAndOwnerId("event", "empty"));
        assertEquals(List.of(), remote.findByOwnerTypeAndOwnerIdIn("event", List.of()));
        for (var path : List.of(MemberDirectoryProtocol.ENTRY, MemberDirectoryProtocol.OWNER))
            assertEquals(path.equals(MemberDirectoryProtocol.ENTRY) ? 404 : 200,
                    request(path, suffix(path, path.equals(MemberDirectoryProtocol.ENTRY) ? "missing" : "empty"), "", TOKEN, "REAL", "GET", "application/json", false).statusCode());
        var repository = server.getBean(ActivityMembersRepository.class);
        remote.findByOwnerTypeAndOwnerId(null, ""); remote.findByOwnerTypeAndOwnerId("", null);
        remote.findByOwnerTypeAndOwnerId("event&é/?", "owner&é/?");
        remote.findByOwnerTypeAndOwnerIdIn(null, null);
        verify(repository).findByOwnerTypeAndOwnerId(null, ""); verify(repository).findByOwnerTypeAndOwnerId("", null);
        verify(repository).findByOwnerTypeAndOwnerId("event&é/?", "owner&é/?");
        verify(repository).findByOwnerTypeAndOwnerIdIn(null, null);
        assertEquals(200, request(MemberDirectoryProtocol.OWNERS, "", "{\"ownerType\":null,\"ownerIds\":null}", TOKEN, "REAL", "POST", "application/json", false).statusCode());
    }
    @Test void everyOperationRequiresDedicatedCredentialModeAndMethod() throws Exception {
        for (var path : MemberDirectoryProtocol.paths()) {
            for (var token : new String[]{null, "test-only-case-participants-token-00000000000000000"})
                assertEquals(401, request(path, suffix(path, "known"), body(path, "event"), token, "REAL", method(path), "application/json", false).statusCode());
            for (var mode : new String[]{null, "demo", "ANY"})
                assertEquals(400, request(path, suffix(path, "known"), body(path, "event"), TOKEN, mode, method(path), "application/json", false).statusCode());
            assertEquals(403, request(path, "", body(path, "event"), TOKEN, "REAL", method(path).equals("GET") ? "POST" : "GET", "application/json", false).statusCode());
        }
    }
    @Test void batchAndPageValidationIsBoundedAndNeverCoercesQueryTypes() throws Exception {
        for (var path : List.of(MemberDirectoryProtocol.OWNERS, MemberDirectoryProtocol.ACCEPTED)) {
            for (var body : List.of("null", "{", "{}", body(path, "event") + " {}",
                    body(path, "event").replace("\"event\"", "7"), body(path, "event").replace("[\"known\"]", "[7]"),
                    body(path, "x".repeat(513))))
                assertEquals(400, request(path, "", body, TOKEN, "REAL", "POST", "application/json", false).statusCode());
            assertEquals(415, request(path, "", "{}", TOKEN, "REAL", "POST", "text/plain", false).statusCode());
            for (boolean chunked : List.of(false, true))
                assertEquals(413, request(path, "", " ".repeat(MemberDirectoryProtocol.MAX_QUERY_BYTES + 1), TOKEN, "REAL", "POST", "application/json", chunked).statusCode());
        }
        for (var suffix : List.of("", "?offset=a&limit=20", "?offset=-1&limit=20", "?offset=0&limit=0", "?offset=0&limit=1001"))
            assertEquals(400, request(MemberDirectoryProtocol.PAGE, suffix, "", TOKEN, "REAL", "GET", "application/json", false).statusCode());
        assertEquals(400, request(MemberDirectoryProtocol.OWNER, "?ownerId=" + "x".repeat(513), "", TOKEN, "REAL", "GET", "application/json", false).statusCode());
        assertThrows(IllegalArgumentException.class, () -> remote.findByOwnerTypeAndOwnerIdIn("event", Collections.nCopies(4097, "x")));
        assertThrows(IllegalArgumentException.class, () -> remote.pageByOwnerAndStatus("event", "owner", "accepted", 0, 1001));
        var large = Collections.nCopies(100, "x".repeat(500));
        assertEquals(mapped(server.getBean(MemberDirectoryService.class).findByOwnerTypeAndOwnerIdIn("event", large)), remote.findByOwnerTypeAndOwnerIdIn("event", large));
    }
    @Test void ownerErrorsAreUnavailableNotEmptyCollectionsOrFreeVipPricing() throws Exception {
        for (var path : MemberDirectoryProtocol.paths()) {
            if (path.equals(MemberDirectoryProtocol.ALL)) continue;
            assertEquals(503, request(path, suffix(path, "fail"), body(path, "fail"), TOKEN, "REAL", method(path), "application/json", false).statusCode());
        }
        assertEquals(503, assertThrows(RemoteReadException.class, () -> remote.vipPricingOffer("fail", "user")).status());
        assertEquals(503, assertThrows(RemoteReadException.class, () -> remote.findByOwnerTypeAndOwnerIdIn("fail", List.of())).status());
    }
    static List<MemberDirectoryEntryDto> mapped(List<? extends MemberDirectory.Member> members) { return members.stream().map(MemberDirectoryEntryDto::from).toList(); }
    static String method(String path) { return path.equals(MemberDirectoryProtocol.OWNERS) || path.equals(MemberDirectoryProtocol.ACCEPTED) ? "POST" : "GET"; }
    static String suffix(String path, String id) {
        if (method(path).equals("POST") || path.equals(MemberDirectoryProtocol.ALL)) return "";
        if (path.equals(MemberDirectoryProtocol.VIP)) return "?sourceId=" + id + "&userId=user";
        return "?ownerType=event&ownerId=" + id + "&userId=" + id + "&status=accepted&offset=7&limit=20";
    }
    static String body(String path, String type) {
        return "{\"ownerType\":\"" + type + "\",\"ownerIds\":[\"known\"]" +
                (path.equals(MemberDirectoryProtocol.ACCEPTED) ? ",\"userId\":\"user\",\"status\":\"accepted\"}" : "}");
    }
    static HttpResponse<String> request(String path, String suffix, String body, String token, String mode, String method, String contentType, boolean chunked) throws Exception {
        var builder = HttpRequest.newBuilder(origin.resolve(path + suffix)).timeout(Duration.ofSeconds(3)).header("Content-Type", contentType);
        if (token != null) builder.header("Authorization", "Bearer " + token);
        if (mode != null) builder.header(InternalReadCredentialFilter.MODE_HEADER, mode);
        var publisher = chunked ? HttpRequest.BodyPublishers.ofInputStream(() -> new ByteArrayInputStream(body.getBytes(StandardCharsets.UTF_8))) : HttpRequest.BodyPublishers.ofString(body);
        var response = http.send(builder.method(method, publisher).build(), HttpResponse.BodyHandlers.ofString());
        assertEquals("no-store", response.headers().firstValue("Cache-Control").orElseThrow());
        Files.writeString(evidence.resolve("response-" + sequence.incrementAndGet() + ".json"), new JsonMapper().writeValueAsString(
                Map.of("path", path, "method", method(path).toLowerCase(Locale.ROOT), "status", response.statusCode(), "body", new JsonMapper().readTree(response.body()))));
        return response;
    }
    @SpringBootConfiguration
    @EnableAutoConfiguration(excludeName = {
            "org.springframework.boot.mongodb.autoconfigure.MongoAutoConfiguration",
            "org.springframework.boot.data.mongodb.autoconfigure.DataMongoAutoConfiguration",
            "org.springframework.boot.data.mongodb.autoconfigure.DataMongoRepositoriesAutoConfiguration",
            "org.springframework.boot.security.autoconfigure.UserDetailsServiceAutoConfiguration"})
    @Import({MemberDirectoryServerConfiguration.class, ServiceSecurityConfiguration.class})
    static class Fixture {
        @Bean ActivityMembersRepository repository() {
            var repository = mock(ActivityMembersRepository.class);
            when(repository.findByOwnerTypeAndOwnerIdAndUserId(nullable(String.class), nullable(String.class), nullable(String.class)))
                    .thenAnswer(c -> "missing".equals(c.getArgument(1)) ? Optional.empty() : Optional.of(member(c.getArgument(1))));
            when(repository.findByOwnerTypeAndOwnerId(nullable(String.class), nullable(String.class))).thenAnswer(c -> list(c.getArgument(1)));
            when(repository.findByOwnerTypeAndUserId(nullable(String.class), nullable(String.class))).thenAnswer(c -> list(c.getArgument(1)));
            when(repository.findAll()).thenAnswer(c -> list("all"));
            when(repository.findByOwnerTypeAndOwnerIdIn(nullable(String.class), nullable(Collection.class)))
                    .thenAnswer(c -> { if ("fail".equals(c.getArgument(0))) return list("fail"); Collection<?> ids=c.getArgument(1); return ids != null && ids.isEmpty() ? List.of() : list("batch"); });
            when(repository.findAcceptedByOwnerTypeOwnerIdInAndUserId(nullable(String.class), nullable(Collection.class), nullable(String.class), nullable(String.class)))
                    .thenAnswer(c -> list("fail".equals(c.getArgument(0)) ? "fail" : "accepted"));
            return repository;
        }
        @Bean MongoTemplate mongo() {
            var mongo = mock(MongoTemplate.class);
            when(mongo.count(any(Query.class), eq(ActivityMember.class))).thenAnswer(c -> {
                Query query=c.getArgument(0);
                if ("fail".equals(query.getQueryObject().getString("ownerId"))) throw new IllegalStateException("private db error");
                assertEquals("event", query.getQueryObject().getString("ownerType"));
                assertEquals("accepted", query.getQueryObject().getString("status"));
                return 3000000000L;
            });
            when(mongo.find(any(Query.class), eq(ActivityMember.class))).thenAnswer(c -> {
                Query query=c.getArgument(0);
                assertEquals(7, query.getSkip()); assertEquals(20, query.getLimit());
                assertEquals(1, query.getSortObject().getInteger("userId"));
                return list("page");
            });
            return mongo;
        }
        @Bean MemberDirectoryService members(ActivityMembersRepository repository, MongoTemplate mongo) {
            var service = new MemberDirectoryService(repository, mongo);
            return service;
        }
    }
    static List<ActivityMember> list(String id) { return "empty".equals(id) ? List.of() : List.of(member(id)); }
    static ActivityMember member(String id) {
        if ("fail".equals(id)) throw new IllegalStateException("private db error");
        var member = new ActivityMember();
        member.setId(id); member.setOwnerType("event"); member.setOwnerId("owner"); member.setUserId("user");
        member.setStatus("accepted".equals(id) ? "accepted" : "rejected".equals(id) ? "rejected" : "pending");
        member.setRole("Member"); member.setCreatedUser(MongoSessionModeContext.currentMode().name());
        member.setCreatedDate(""); member.setSyncKey("sync"); member.setSuppressionRootOwnerId("root");
        member.setStatusBeforeSuppression("accepted"); member.setManagerGrantedByUserId("manager");
        member.setInvitedByUserId("inviter"); member.setMetAtIso("met"); member.setActionAtIso("action");
        member.setUpdatedDate("updated"); member.setUpdatedUser("editor");
        member.setAttendanceStatus("private-attendance"); member.setCommunityUpdates(123L);
        member.setEventVipInvitation(!"not-vip".equals(id)); member.setRequestKind("invite");
        if ("accepted".equals(id)) member.setEventVipAcceptedAtIso("accepted-at");
        String pricing="{\"enabled\":" + !"disabled".equals(id) + ",\"mode\":\"fixed\",\"basePrice\":20.5,\"currency\":\"EUR\",\"audience\":"
                + ("no-audience".equals(id) ? "null" : "{\"enabled\":true,\"vipPrice\":" + ("no-price".equals(id) ? "null" : "7.25") + "}") + "}";
        member.setEventVipOfferedPricing(new JsonMapper().readValue(pricing, PricingConfigDto.class));
        return member;
    }
}
