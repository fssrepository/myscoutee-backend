package com.raxim.myscoutee.microservices.transport.common;

import com.raxim.myscoutee.common.config.mongo.*;
import com.raxim.myscoutee.domain.accounts.api.*;
import com.raxim.myscoutee.domain.operator.api.*;
import com.raxim.myscoutee.domain.operator.dto.OperatorMeasurementDtos.*;
import com.raxim.myscoutee.domain.operator.dto.OperatorRevenueDtos.*;
import com.raxim.myscoutee.domain.platform.api.JobGroupContext;
import com.raxim.myscoutee.microservices.bootstrap.ServiceSecurityConfiguration;
import com.raxim.myscoutee.microservices.transport.accounts.*;
import com.raxim.myscoutee.microservices.transport.operator.*;
import com.raxim.myscoutee.microservices.transport.security.*;
import io.micrometer.core.instrument.simple.SimpleMeterRegistry;
import java.net.*;
import java.net.http.*;
import java.nio.file.*;
import java.security.KeyPairGenerator;
import java.time.*;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import org.junit.jupiter.api.*;
import org.springframework.boot.SpringBootConfiguration;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.server.ResponseStatusException;
import tools.jackson.databind.json.JsonMapper;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/** Actual HTTP/security/serialization boundaries; owner fixtures are not KVM persistence evidence. */
class NetworkBoundaryHttpTest {
    static final String TOKEN = "test-only-network-boundary-token-00000000000000000";
    static final JsonMapper mapper = new JsonMapper();
    static final AtomicInteger sequence = new AtomicInteger(), eligibilityCalls = new AtomicInteger(), purgeCalls = new AtomicInteger();
    static final Set<String> intents = ConcurrentHashMap.newKeySet();
    static final String PURGE = GlobalIdentityPrivacyProtocol.PREPARE_PURGE_UNLINK;
    static final String ELIGIBLE = MeasurementEligibilityProtocol.PATH;
    static final String MEASUREMENTS = OperatorReportsProtocol.MEASUREMENTS;
    static final String REVENUE = OperatorReportsProtocol.REVENUE;
    static ConfigurableApplicationContext server;
    static URI origin;
    static HttpClient http;
    static ActorDelegation.Issuer issuer;
    static SimpleMeterRegistry meters;
    static RemoteMeasurementEligibility eligibility;
    static RemoteGlobalIdentityPrivacy privacy;
    static RemoteOperatorReports reports;

    @BeforeAll static void start() throws Exception {
        var keys = KeyPairGenerator.getInstance("RSA"); keys.initialize(2048); var pair = keys.generateKeyPair();
        String publicKey = Base64.getEncoder().encodeToString(pair.getPublic().getEncoded());
        issuer = new ActorDelegation.Issuer(Base64.getEncoder().encodeToString(pair.getPrivate().getEncoded()), publicKey, Clock.systemUTC());
        for (var slug : List.of("measurement-eligibility", "global-identity-privacy", "operator-reports")) {
            var directory = Path.of(System.getProperty("wireEvidenceDirectory"), slug); Files.createDirectories(directory);
            try (var files = Files.list(directory)) {
                for (var file : files.filter(p -> p.getFileName().toString().matches("response-[0-9]+\\.json")).toList()) Files.delete(file);
            }
        }
        server = new SpringApplicationBuilder(Fixture.class).properties(
                "server.address=127.0.0.1", "server.port=0", "management.server.port=0", "spring.main.banner-mode=off", "logging.level.root=WARN",
                "myscoutee.remote.measurement-eligibility.read-token=" + TOKEN,
                "myscoutee.remote.global-identity-privacy.command-token=" + TOKEN,
                "myscoutee.remote.operator-reports.read-token=" + TOKEN,
                "myscoutee.delegation.public-key=" + publicKey).run();
        origin = URI.create("http://127.0.0.1:" + server.getEnvironment().getProperty("local.server.port"));
        http = HttpClient.newBuilder().followRedirects(HttpClient.Redirect.NEVER).build(); meters = new SimpleMeterRegistry();
        eligibility = new RemoteMeasurementEligibility(origin, TOKEN, true, Duration.ofSeconds(1), Duration.ofSeconds(3), mapper, meters);
        privacy = new RemoteGlobalIdentityPrivacy(origin, TOKEN, true, Duration.ofSeconds(1), Duration.ofSeconds(3), mapper, meters);
        reports = new RemoteOperatorReports(origin, TOKEN, true, Duration.ofSeconds(1), Duration.ofSeconds(3), mapper, meters, issuer);
    }
    @BeforeEach void reset() { eligibilityCalls.set(0); purgeCalls.set(0); intents.clear(); }
    @AfterEach void clear() { MongoSessionModeContext.clear(); SecurityContextHolder.clearContext(); }
    @AfterAll static void stop() {
        if (reports != null) reports.close(); if (privacy != null) privacy.close(); if (eligibility != null) eligibility.close();
        if (http != null) http.shutdownNow(); if (server != null) server.close(); if (meters != null) meters.close();
    }
    static void authenticate(String authority, String workspace) {
        var profile = mock(WorkspaceProfile.class); when(profile.getUserId()).thenReturn("operator"); when(profile.getWorkspaceGroupId()).thenReturn(workspace);
        var actor = mock(AccountIdentity.class); when(actor.getUserId()).thenReturn("operator"); when(actor.getUser()).thenReturn(profile); when(actor.getEmail()).thenReturn("operator@example.test");
        SecurityContextHolder.getContext().setAuthentication(UsernamePasswordAuthenticationToken.authenticated(actor, null, List.of(new SimpleGrantedAuthority(authority))));
    }
    static String body(String path) {
        if (path.equals(ELIGIBLE)) return "{\"userIds\":[\"REAL\",\"DEMO\",\"blocked\"]}";
        if (path.equals(PURGE)) return "{\"scope\":{\"active\":true,\"groupId\":\"workspace\"},\"userId\":\"user\"}";
        return "{\"status\":null,\"page\":0,\"size\":25}";
    }
    static String sign(String path, String body) { return issuer.issueForCurrent(OperatorReportsProtocol.AUDIENCE, "POST", path, body.getBytes(java.nio.charset.StandardCharsets.UTF_8)); }
    @Test void eligibilityIsBatchedModeScopedAndDoesNotReturnPartialSuccessOnOwnerFailure() throws Exception {
        for (var mode : List.of(MongoSessionMode.REAL, MongoSessionMode.DEMO, MongoSessionMode.REAL)) {
            MongoSessionModeContext.set(mode);
            assertEquals(Set.of(mode.name()), eligibility.eligible(List.of("REAL", "DEMO", "blocked")));
            assertEquals(200, request(ELIGIBLE, body(ELIGIBLE), TOKEN, mode.name(), "POST", "application/json", null).statusCode());
        }
        var ids = new ArrayList<String>(); for (int i = 0; i < 2050; i++) ids.add("u" + i); ids.add("REAL");
        eligibilityCalls.set(0); assertEquals(Set.of("REAL"), eligibility.eligible(ids)); assertEquals(3, eligibilityCalls.get());
        assertTrue(eligibility.eligible(List.of()).isEmpty()); assertEquals(3, eligibilityCalls.get());
        ids.set(2049, "fail"); assertThrows(RemoteReadTransport.RemoteReadException.class, () -> eligibility.eligible(ids));
        assertEquals(503, request(ELIGIBLE, "{\"userIds\":[\"fail\"]}", TOKEN, "REAL", "POST", "application/json", null).statusCode());
    }
    @Test void reportsRequireCheckedOperatorPermissionAndPreserveSignedBodyModeAndErrors() throws Exception {
        authenticate(MeasurementReports.INTEGRATION_READ_AUTHORITY, null);
        for (var mode : List.of(MongoSessionMode.REAL, MongoSessionMode.DEMO, MongoSessionMode.REAL)) {
            MongoSessionModeContext.set(mode);
            assertEquals(mode.name(), reports.measurements(null, 0, 25).items().getFirst().id());
            assertEquals(mode.name(), reports.revenue(null, 0, 25).items().getFirst().id());
            for (var path : List.of(MEASUREMENTS, REVENUE)) {
                assertEquals(200, request(path, body(path), TOKEN, mode.name(), "POST", "application/json", sign(path, body(path))).statusCode());
                assertEquals(403, request(path, body(path), TOKEN, mode.name(), "POST", "application/json", null).statusCode());
                assertEquals(403, request(path, body(path).replace("25", "24"), TOKEN, mode.name(), "POST", "application/json", sign(path, body(path))).statusCode());
                assertEquals(403, request(path, body(path), TOKEN, mode == MongoSessionMode.REAL ? "DEMO" : "REAL", "POST", "application/json", sign(path, body(path))).statusCode());
                String failed = body(path).replace("null", "\"fail\"");
                assertEquals(503, request(path, failed, TOKEN, mode.name(), "POST", "application/json", sign(path, failed)).statusCode());
            }
        }
        assertEquals(400, assertThrows(ResponseStatusException.class, () -> reports.measurements(null, -1, 25)).getStatusCode().value());
        assertEquals(409, assertThrows(ResponseStatusException.class, () -> reports.revenue("unregistered", 0, 25)).getStatusCode().value());
        for (var authority : List.of("INTEGRATION", "O")) {
            authenticate(authority, null);
            assertEquals(403, request(MEASUREMENTS, body(MEASUREMENTS), TOKEN, "REAL", "POST", "application/json", sign(MEASUREMENTS, body(MEASUREMENTS))).statusCode());
        }
        authenticate(MeasurementReports.INTEGRATION_READ_AUTHORITY, "foreign-workspace");
        assertEquals(403, request(REVENUE, body(REVENUE), TOKEN, "REAL", "POST", "application/json", sign(REVENUE, body(REVENUE))).statusCode());
    }
    @Test void credentialsMethodJsonAndSizeBoundsAreEnforcedBeforeOwnerCalls() throws Exception {
        authenticate(MeasurementReports.INTEGRATION_READ_AUTHORITY, null);
        for (var path : List.of(ELIGIBLE, PURGE, MEASUREMENTS, REVENUE)) {
            boolean signed = path.equals(MEASUREMENTS) || path.equals(REVENUE);
            String body = body(path), delegation = signed ? sign(path, body) : null;
            assertEquals(401, request(path, body, "wrong-credential", "REAL", "POST", "application/json", delegation).statusCode());
            assertEquals(400, request(path, body, TOKEN, "bad-mode", "POST", "application/json", delegation).statusCode());
            assertEquals(403, request(path, body, TOKEN, "REAL", "GET", "application/json", delegation).statusCode());
            for (var invalid : List.of("null", "{} {}", "{\"unknown\":true}"))
                assertEquals(400, request(path, invalid, TOKEN, "REAL", "POST", "application/json", signed ? sign(path, invalid) : null).statusCode());
            assertEquals(415, request(path, body, TOKEN, "REAL", "POST", "text/plain", delegation).statusCode());
            int limit = path.equals(ELIGIBLE) ? MeasurementEligibilityProtocol.MAX_REQUEST_BYTES : path.equals(PURGE) ? GlobalIdentityPrivacyProtocol.MAX_REQUEST_BYTES : OperatorReportsProtocol.MAX_REQUEST_BYTES;
            String big = " ".repeat(limit + 1);
            assertEquals(413, request(path, big, TOKEN, "REAL", "POST", "application/json", signed ? sign(path, big) : null).statusCode());
        }
        assertEquals(0, eligibilityCalls.get()); assertEquals(0, purgeCalls.get());
    }
    @Test void purgePreservesModeAndScopeAndLostReplyDoesNotTriggerTransportRetry() throws Exception {
        for (var mode : List.of(MongoSessionMode.REAL, MongoSessionMode.DEMO)) {
            MongoSessionModeContext.set(mode);
            JobGroupContext.call(true, "workspace", () -> { privacy.preparePurgeUnlink("user"); return null; });
            assertEquals(200, request(PURGE, body(PURGE), TOKEN, mode.name(), "POST", "application/json", null).statusCode());
            assertTrue(intents.contains(mode + ":true:workspace:user"));
        }
        String failed = body(PURGE).replace("\"user\"", "\"fail\"");
        assertEquals(503, request(PURGE, failed, TOKEN, "REAL", "POST", "application/json", null).statusCode());
        var calls = new AtomicInteger();
        var proxy = com.sun.net.httpserver.HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
        proxy.createContext(PURGE, exchange -> {
            calls.incrementAndGet();
            try {
                var forward = HttpRequest.newBuilder(origin.resolve(PURGE)).header("Authorization", "Bearer " + TOKEN)
                        .header(InternalReadCredentialFilter.MODE_HEADER, "REAL").header("Content-Type", "application/json")
                        .POST(HttpRequest.BodyPublishers.ofByteArray(exchange.getRequestBody().readAllBytes())).build();
                http.send(forward, HttpResponse.BodyHandlers.discarding()); exchange.sendResponseHeaders(200, 100);
            } catch (InterruptedException interrupted) { Thread.currentThread().interrupt(); }
            finally { exchange.close(); }
        }); proxy.start();
        MongoSessionModeContext.set(MongoSessionMode.REAL);
        try (var lossy = new RemoteGlobalIdentityPrivacy(URI.create("http://127.0.0.1:" + proxy.getAddress().getPort()), TOKEN, true, Duration.ofSeconds(1), Duration.ofSeconds(2), mapper, meters)) {
            assertThrows(RemoteReadTransport.RemoteReadException.class, () -> lossy.preparePurgeUnlink("lost"));
            assertEquals(1, calls.get()); assertTrue(intents.contains("REAL:false:null:lost"));
            int before = intents.size(); privacy.preparePurgeUnlink("lost"); assertEquals(before, intents.size());
        } finally { proxy.stop(0); }
    }
    static HttpResponse<String> request(String path, String body, String token, String mode, String method, String media, String delegation) throws Exception {
        var builder = HttpRequest.newBuilder(origin.resolve(path)).timeout(Duration.ofSeconds(5)).header("Content-Type", media).header(InternalReadCredentialFilter.MODE_HEADER, mode);
        if (token != null) builder.header("Authorization", "Bearer " + token);
        if (delegation != null) builder.header(ActorDelegation.HEADER, delegation);
        var response = http.send(builder.method(method, HttpRequest.BodyPublishers.ofString(body)).build(), HttpResponse.BodyHandlers.ofString());
        assertEquals("no-store", response.headers().firstValue("Cache-Control").orElseThrow());
        String slug = path.equals(ELIGIBLE) ? "measurement-eligibility" : path.equals(PURGE) ? "global-identity-privacy" : "operator-reports";
        Files.writeString(Path.of(System.getProperty("wireEvidenceDirectory"), slug, "response-" + sequence.incrementAndGet() + ".json"), mapper.writeValueAsString(Map.of(
                "path", path, "method", method.toLowerCase(Locale.ROOT), "status", response.statusCode(), "body", mapper.readTree(response.body()))));
        return response;
    }
    static void reportQuery(String status, int page, int size) {
        assertTrue(SecurityContextHolder.getContext().getAuthentication().getPrincipal() instanceof ActorDelegation.VerifiedPrincipal);
        if ("fail".equals(status)) throw new IllegalStateException("private-database-detail");
        if ("unregistered".equals(status)) throw new ResponseStatusException(HttpStatus.CONFLICT);
        if (page < 0 || size < 1 || size > 100) throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
    }
    @SpringBootConfiguration
    @EnableAutoConfiguration(excludeName = {"org.springframework.boot.mongodb.autoconfigure.MongoAutoConfiguration", "org.springframework.boot.data.mongodb.autoconfigure.DataMongoAutoConfiguration",
            "org.springframework.boot.data.mongodb.autoconfigure.DataMongoRepositoriesAutoConfiguration", "org.springframework.boot.security.autoconfigure.UserDetailsServiceAutoConfiguration"})
    @Import({ServiceSecurityConfiguration.class, MeasurementEligibilityServerConfiguration.class, GlobalIdentityPrivacyServerConfiguration.class, OperatorReportsServerConfiguration.class})
    static class Fixture {
        @Bean MeasurementEligibility eligibility() { return ids -> {
            eligibilityCalls.incrementAndGet(); if (ids.contains("fail")) throw new IllegalStateException("private-database-detail");
            return ids.contains(MongoSessionModeContext.currentMode().name()) ? Set.of(MongoSessionModeContext.currentMode().name()) : Set.of();
        }; }
        @Bean GlobalIdentityPrivacy privacy() { return id -> {
            purgeCalls.incrementAndGet(); if ("fail".equals(id)) throw new IllegalStateException("private-database-detail");
            intents.add(MongoSessionModeContext.currentMode() + ":" + JobGroupContext.isActive() + ":" + JobGroupContext.groupId() + ":" + id);
        }; }
        @Bean MeasurementReports measurements() { return (status, page, size) -> {
            reportQuery(status, page, size);
            return new OperatorMeasurementReportPageDto(List.of(new OperatorMeasurementReportDto(MongoSessionModeContext.currentMode().name(), "2026-09", null, null, 1, "v1", 3, 8, "ACCEPTED", 1, null, null, null, "batch", null, null, null)), page, size, 1, 1);
        }; }
        @Bean RevenueReports revenue() { return (status, page, size) -> {
            reportQuery(status, page, size);
            return new OperatorRevenueReportPageDto(List.of(new OperatorRevenueReportDto(MongoSessionModeContext.currentMode().name(), "2026-09", 1, null, "v1", 300,
                    List.of(new OperatorRevenueReportCurrencyDto("EUR", 2, 100, 10, 90, 90, 3, 1)), "hash", "ACCEPTED", 1, null, null, null, null, null, null, null, null, null)), page, size, 1, 1);
        }; }
    }
}
