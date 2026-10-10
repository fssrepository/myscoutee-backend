package com.raxim.myscoutee.microservices.transport.security;

import java.net.URI;
import java.net.http.*;
import java.nio.file.*;
import java.security.KeyPairGenerator;
import java.time.*;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import com.raxim.myscoutee.common.config.mongo.*;
import com.raxim.myscoutee.domain.accounts.api.*;
import com.raxim.myscoutee.microservices.bootstrap.ServiceSecurityConfiguration;
import com.raxim.myscoutee.microservices.transport.accounts.*;
import com.raxim.myscoutee.microservices.transport.content.*;
import io.micrometer.core.instrument.simple.SimpleMeterRegistry;
import org.junit.jupiter.api.*;
import org.springframework.boot.*;
import org.springframework.boot.autoconfigure.*;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ActorDelegationBrokerHttpTest {
    private static final String CALLER_TOKEN = "test-only-caller-token-000000000000000000000000000";
    private static final String OWNER_TOKEN = "test-only-selection-token-000000000000000000000000";
    private static final String ADMIN_TOKEN = "test-only-admin-actor-token-000000000000000000000000";
    private static final String READ_STATE_TOKEN = "test-only-profile-read-state-000000000000000000000";
    private static final List<String> evicted = new java.util.concurrent.CopyOnWriteArrayList<>();
    private static final String INCOMING = "assembly:public:communication";
    private static final byte[] PARENT_BODY = "{}".getBytes(java.nio.charset.StandardCharsets.UTF_8);
    private static final ActorDelegationBrokerProtocol.Operation OPERATION = new ActorDelegationBrokerProtocol.Operation(
            SelectedProfileProtocol.AUDIENCE, "POST", SelectedProfileProtocol.PATH);
    private static final tools.jackson.databind.ObjectMapper mapper = new com.raxim.myscoutee.common.config.JsonConfig().objectMapper();
    private static final AtomicInteger sequence = new AtomicInteger(), calls = new AtomicInteger();
    private static ConfigurableApplicationContext server;
    private static HttpClient http;
    private static URI origin;
    private static String privateKey, publicKey;
    private static ActorDelegation.Issuer issuer;
    private static ActorDelegation.Verifier verifier;
    private static SimpleMeterRegistry metrics;
    private static RemoteActorDelegationSigner remoteSigner;
    private static RemoteSelectedProfile remoteSelection;
    private static RemoteAdministrativeActors remoteAdmins;
    private static RemoteProfileReadState remoteReadState;
    private static Path evidence;

    @BeforeAll static void start() throws Exception {
        var generator = KeyPairGenerator.getInstance("RSA"); generator.initialize(2048);
        var keys = generator.generateKeyPair();
        privateKey = Base64.getEncoder().encodeToString(keys.getPrivate().getEncoded());
        publicKey = Base64.getEncoder().encodeToString(keys.getPublic().getEncoded());
        issuer = new ActorDelegation.Issuer(privateKey, publicKey, Clock.systemUTC());
        verifier = new ActorDelegation.Verifier(publicKey, Clock.systemUTC());
        var operations = new ArrayList<>(List.of(OPERATION, new ActorDelegationBrokerProtocol.Operation(
                ProfileReadStateProtocol.AUDIENCE, "POST", ProfileReadStateProtocol.COUNTERS)));
        for (String path : AdministrativeActorsProtocol.paths()) operations.add(new ActorDelegationBrokerProtocol.Operation(
                AdministrativeActorsProtocol.AUDIENCE, "POST", path));
        operations.add(new ActorDelegationBrokerProtocol.Operation(SelectedProfileProtocol.AUDIENCE, "POST", SelectedProfileProtocol.DISCOVERY));
        var policies = Map.of("communication", new ActorDelegationBrokerProtocol.ClientPolicy(
                CALLER_TOKEN, Set.of(INCOMING), operations));
        server = new SpringApplicationBuilder(Fixture.class).properties(
                "server.address=127.0.0.1", "server.port=0", "management.server.port=0",
                "myscoutee.delegation.private-key=" + privateKey, "myscoutee.delegation.public-key=" + publicKey,
                "myscoutee.delegation.clients-json=" + mapper.writeValueAsString(policies),
                "myscoutee.remote.selected-profile.read-token=" + OWNER_TOKEN,
                "myscoutee.remote.profile-read-state.read-token=" + READ_STATE_TOKEN,
                "myscoutee.remote.administrative-actors.read-token=" + ADMIN_TOKEN,
                "spring.main.banner-mode=off", "logging.level.root=WARN").run();
        origin = URI.create("http://127.0.0.1:" + server.getEnvironment().getProperty("local.server.port"));
        http = HttpClient.newBuilder().followRedirects(HttpClient.Redirect.NEVER).build();
        metrics = new SimpleMeterRegistry();
        remoteSigner = new RemoteActorDelegationSigner(origin, CALLER_TOKEN, true, Duration.ofSeconds(1), Duration.ofSeconds(3), mapper, metrics, verifier);
        remoteSelection = new RemoteSelectedProfile(origin, OWNER_TOKEN, true, Duration.ofSeconds(1), Duration.ofSeconds(3), mapper, metrics, remoteSigner);
        remoteAdmins = new RemoteAdministrativeActors(origin, ADMIN_TOKEN, true, Duration.ofSeconds(1), Duration.ofSeconds(3), mapper, metrics, remoteSigner);
        remoteReadState = new RemoteProfileReadState(origin, READ_STATE_TOKEN, true, Duration.ofSeconds(1), Duration.ofSeconds(3), mapper, metrics, remoteSigner);
        evidence = Path.of(System.getProperty("wireEvidenceDirectory"));
        for (String directory : List.of("actor-delegation", "selected-profile", "administrative-actors", "profile-read-state")) {
            Files.createDirectories(evidence.resolve(directory));
            try (var files = Files.list(evidence.resolve(directory))) {
                for (var file : files.filter(path -> path.getFileName().toString().startsWith("response-")).toList()) Files.delete(file);
            }
        }
    }

    private static void nativeActor() { nativeActor("U"); }
    private static void nativeActor(String role) {
        var profile = mock(WorkspaceProfile.class);
        when(profile.getUserId()).thenReturn("selected");
        when(profile.getAccountUserId()).thenReturn("account");
        when(profile.getWorkspaceGroupId()).thenReturn("workspace");
        var principal = mock(AccountIdentity.class);
        when(principal.getUserId()).thenReturn("selected");
        when(principal.getUser()).thenReturn(profile);
        when(principal.getEmail()).thenReturn("actor@example.invalid");
        SecurityContextHolder.getContext().setAuthentication(UsernamePasswordAuthenticationToken.authenticated(
                principal, null, List.of(new SimpleGrantedAuthority(role))));
    }
    private static String parent() { return issuer.issueForCurrent(INCOMING, "POST", "/notifications/query", PARENT_BODY); }
    private static ActorDelegationBrokerProtocol.Request request(String parent) {
        return new ActorDelegationBrokerProtocol.Request(parent, OPERATION, ActorDelegation.digest(mapper.writeValueAsBytes(new SelectedProfileProtocol.Query("spoofed"))));
    }
    @BeforeEach void prepare() { nativeActor(); calls.set(0); evicted.clear(); }
    @AfterEach void clear() { SecurityContextHolder.clearContext(); MongoSessionModeContext.clear(); }
    @AfterAll static void stop() {
        if (remoteReadState != null) remoteReadState.close();
        if (remoteAdmins != null) remoteAdmins.close();
        if (remoteSelection != null) remoteSelection.close(); if (remoteSigner != null) remoteSigner.close();
        if (http != null) http.shutdownNow(); if (server != null) server.close(); if (metrics != null) metrics.close();
    }

    @Test void serviceWithoutPrivateKeyDerivesOneScopedCallAndPreservesActorInBothDatabases() throws Exception {
        for (var mode : MongoSessionMode.values()) {
            MongoSessionModeContext.set(mode); nativeActor();
            String parent = parent();
            var principal = verifier.verifyPrincipal(parent, INCOMING, "POST", "/notifications/query", PARENT_BODY);
            try (var ignored = DelegatedActorContext.open(principal)) {
                assertEquals("selected", remoteSelection.resolveSelectedUserId("spoofed"));
                assertNull(remoteSelection.resolveSelectedUserId("missing"));
                assertSame(principal, SecurityContextHolder.getContext().getAuthentication().getPrincipal());
            }
            var granted = post(ActorDelegationBrokerProtocol.PATH, mapper.writeValueAsBytes(request(parent)), CALLER_TOKEN, null, mode.name(), "application/json");
            assertEquals(200, granted.statusCode());
            String proof = mapper.readValue(granted.body(), ActorDelegationBrokerProtocol.Result.class).token();
            var selected = post(SelectedProfileProtocol.PATH, mapper.writeValueAsBytes(new SelectedProfileProtocol.Query("spoofed")), OWNER_TOKEN, proof, mode.name(), "application/json");
            assertEquals(200, selected.statusCode());
            assertEquals("selected", mapper.readValue(selected.body(), SelectedProfileProtocol.Result.class).identity().userId());
        }
    }

    @Test void brokerRejectsOtherRecipientsOperationsTenantsAndExpiredParents() throws Exception {
        String other = issuer.issueForCurrent("assembly:public:payments", "POST", "/notifications/query", PARENT_BODY);
        assertEquals(403, post(ActorDelegationBrokerProtocol.PATH, mapper.writeValueAsBytes(request(other)), CALLER_TOKEN, null, "REAL", "application/json").statusCode());
        var wrongOperation = new ActorDelegationBrokerProtocol.Request(parent(),
                new ActorDelegationBrokerProtocol.Operation("accounts:other", "POST", "/_internal/v1/accounts/other"), ActorDelegation.digest(PARENT_BODY));
        assertEquals(403, post(ActorDelegationBrokerProtocol.PATH, mapper.writeValueAsBytes(wrongOperation), CALLER_TOKEN, null, "REAL", "application/json").statusCode());
        assertEquals(403, post(ActorDelegationBrokerProtocol.PATH, mapper.writeValueAsBytes(request(parent())), CALLER_TOKEN, null, "DEMO", "application/json").statusCode());
        var expiredIssuer = new ActorDelegation.Issuer(privateKey, publicKey, Clock.offset(Clock.systemUTC(), Duration.ofSeconds(-40)));
        String expired = expiredIssuer.issueForCurrent(INCOMING, "POST", "/notifications/query", PARENT_BODY);
        assertEquals(403, post(ActorDelegationBrokerProtocol.PATH, mapper.writeValueAsBytes(request(expired)), CALLER_TOKEN, null, "REAL", "application/json").statusCode());
        assertEquals(0, calls.get());
    }

    @Test void bothEndpointsRejectMissingCredentialsMalformedOversizedAndNonJsonInput() throws Exception {
        byte[] selection = mapper.writeValueAsBytes(new SelectedProfileProtocol.Query("spoofed"));
        String signed = issuer.issueForCurrent(SelectedProfileProtocol.AUDIENCE, "POST", SelectedProfileProtocol.PATH, selection);
        for (String path : List.of(ActorDelegationBrokerProtocol.PATH, SelectedProfileProtocol.PATH)) {
            boolean broker = path.equals(ActorDelegationBrokerProtocol.PATH);
            String token = broker ? CALLER_TOKEN : OWNER_TOKEN;
            byte[] body = broker ? mapper.writeValueAsBytes(request(parent())) : selection;
            assertEquals(401, post(path, body, null, broker ? null : signed, "REAL", "application/json").statusCode());
            assertEquals(400, post(path, body, token, broker ? null : signed, "invalid", "application/json").statusCode());
            byte[] invalid = "{".getBytes(java.nio.charset.StandardCharsets.UTF_8);
            String invalidProof = issuer.issueForCurrent(SelectedProfileProtocol.AUDIENCE, "POST", SelectedProfileProtocol.PATH, invalid);
            assertEquals(400, post(path, invalid, token, broker ? null : invalidProof, "REAL", "application/json").statusCode());
            assertEquals(413, post(path, new byte[16385], token, broker ? null : signed, "REAL", "application/json").statusCode());
            assertEquals(415, post(path, body, token, broker ? null : signed, "REAL", "text/plain").statusCode());
        }
        assertEquals(403, post(SelectedProfileProtocol.PATH, selection, OWNER_TOKEN, null, "REAL", "application/json").statusCode());
        byte[] unavailable = mapper.writeValueAsBytes(new SelectedProfileProtocol.Query("unavailable"));
        String proof = issuer.issueForCurrent(SelectedProfileProtocol.AUDIENCE, "POST", SelectedProfileProtocol.PATH, unavailable);
        assertEquals(503, post(SelectedProfileProtocol.PATH, unavailable, OWNER_TOKEN, proof, "REAL", "application/json").statusCode());
    }

    @Test void discoveryUsesTheSameVerifiedActorAndRejectsAnOwnerIdentityMismatch() throws Exception {
        for (var mode : MongoSessionMode.values()) {
            MongoSessionModeContext.set(mode);
            var principal = verifier.verifyPrincipal(parent(), INCOMING, "POST", "/notifications/query", PARENT_BODY);
            try (var ignored = DelegatedActorContext.open(principal)) {
                var result = remoteSelection.resolveCurrentUser("spoofed");
                assertEquals("selected", result.getUserId());
                assertEquals("account", result.getAccountUserId());
                assertEquals("workspace", result.getWorkspaceGroupId());
                assertEquals("Selected profile", result.getName());
            }
            byte[] body = mapper.writeValueAsBytes(new SelectedProfileProtocol.Query("mismatched"));
            String proof = issuer.issueForCurrent(SelectedProfileProtocol.AUDIENCE, "POST", SelectedProfileProtocol.DISCOVERY, body);
            assertEquals(403, post(SelectedProfileProtocol.DISCOVERY, body, OWNER_TOKEN, proof, mode.name(), "application/json").statusCode());
        }
    }

    @Test void administrativeActorsRequireSignedAdminAuthorityAndPreserveNativeRejection() throws Exception {
        nativeActor("A");
        var principal = verifier.verifyPrincipal(parent(), INCOMING, "POST", "/notifications/query", PARENT_BODY);
        try (var ignored = DelegatedActorContext.open(principal)) {
            assertEquals("workspace", remoteAdmins.baseGroupId("workspace-admin"));
            assertNull(remoteAdmins.baseGroupId("global"));
            assertEquals("workspace-admin", remoteAdmins.resolveAdminActor("workspace-admin").id());
            var missing = assertThrows(org.springframework.web.server.ResponseStatusException.class, () -> remoteAdmins.baseGroupId("missing"));
            assertEquals(404, missing.getStatusCode().value());
        }
        for (String path : AdministrativeActorsProtocol.paths()) {
            byte[] body = mapper.writeValueAsBytes(new AdministrativeActorsProtocol.Query("workspace-admin"));
            String proof = issuer.issueForCurrent(AdministrativeActorsProtocol.AUDIENCE, "POST", path, body);
            assertEquals(200, post(path, body, ADMIN_TOKEN, proof, "REAL", "application/json").statusCode());
            assertEquals(401, post(path, body, null, proof, "REAL", "application/json").statusCode());
            assertEquals(413, post(path, new byte[16385], ADMIN_TOKEN, proof, "REAL", "application/json").statusCode());
            assertEquals(415, post(path, body, ADMIN_TOKEN, proof, "REAL", "text/plain").statusCode());
            byte[] malformed = "{".getBytes(java.nio.charset.StandardCharsets.UTF_8);
            String malformedProof = issuer.issueForCurrent(AdministrativeActorsProtocol.AUDIENCE, "POST", path, malformed);
            assertEquals(400, post(path, malformed, ADMIN_TOKEN, malformedProof, "REAL", "application/json").statusCode());
        }
        for (String rejected : List.of("missing", "unavailable")) {
            byte[] body = mapper.writeValueAsBytes(new AdministrativeActorsProtocol.Query(rejected));
            String proof = issuer.issueForCurrent(AdministrativeActorsProtocol.AUDIENCE, "POST", AdministrativeActorsProtocol.GROUP, body);
            assertEquals("missing".equals(rejected) ? 404 : 503,
                    post(AdministrativeActorsProtocol.GROUP, body, ADMIN_TOKEN, proof, "REAL", "application/json").statusCode());
        }
        nativeActor("U");
        byte[] body = mapper.writeValueAsBytes(new AdministrativeActorsProtocol.Query("workspace-admin"));
        String proof = issuer.issueForCurrent(AdministrativeActorsProtocol.AUDIENCE, "POST", AdministrativeActorsProtocol.GROUP, body);
        assertEquals(403, post(AdministrativeActorsProtocol.GROUP, body, ADMIN_TOKEN, proof, "REAL", "application/json").statusCode());
    }

    @Test void countersKeepActorAndDatabaseWhileCacheEvictionNeedsOnlyItsServiceCapability() throws Exception {
        for (var mode : MongoSessionMode.values()) {
            MongoSessionModeContext.set(mode);
            var principal = verifier.verifyPrincipal(parent(), INCOMING, "POST", "/notifications/query", PARENT_BODY);
            try (var ignored = DelegatedActorContext.open(principal)) {
                assertEquals(mode == MongoSessionMode.DEMO ? 9 : 7, remoteReadState.queryMenuCounters("requested").game());
            }
            byte[] body = mapper.writeValueAsBytes(new ProfileReadStateProtocol.CounterQuery("requested"));
            String proof = issuer.issueForCurrent(ProfileReadStateProtocol.AUDIENCE, "POST", ProfileReadStateProtocol.COUNTERS, body);
            assertEquals(200, post(ProfileReadStateProtocol.COUNTERS, body, READ_STATE_TOKEN, proof, mode.name(), "application/json").statusCode());
        }
        SecurityContextHolder.clearContext();
        var ids = java.util.stream.IntStream.range(0, 513).mapToObj(i -> "profile-" + i).toList();
        remoteReadState.evictUserReadCaches(ids);
        assertEquals(ids, evicted);
        assertEquals(200, post(ProfileReadStateProtocol.EVICT, mapper.writeValueAsBytes(new ProfileReadStateProtocol.Eviction(List.of("last"))),
                READ_STATE_TOKEN, null, "REAL", "application/json").statusCode());
        assertEquals("last", evicted.getLast());
    }

    @Test void readStateRejectsUnsignedCounterReadsAndInvalidBodiesWithoutInvokingOwner() throws Exception {
        for (String path : ProfileReadStateProtocol.paths()) {
            boolean counters = path.equals(ProfileReadStateProtocol.COUNTERS);
            byte[] body = mapper.writeValueAsBytes(counters ? new ProfileReadStateProtocol.CounterQuery("requested") : new ProfileReadStateProtocol.Eviction(List.of("one")));
            String proof = counters ? issuer.issueForCurrent(ProfileReadStateProtocol.AUDIENCE, "POST", path, body) : null;
            assertEquals(401, post(path, body, null, proof, "REAL", "application/json").statusCode());
            assertEquals(415, post(path, body, READ_STATE_TOKEN, proof, "REAL", "text/plain").statusCode());
            assertEquals(413, post(path, new byte[counters ? 16385 : ProfileReadStateProtocol.MAX_REQUEST_BYTES + 1], READ_STATE_TOKEN, proof, "REAL", "application/json").statusCode());
            byte[] malformed = "{\"unexpected\":true}".getBytes(java.nio.charset.StandardCharsets.UTF_8);
            String malformedProof = counters ? issuer.issueForCurrent(ProfileReadStateProtocol.AUDIENCE, "POST", path, malformed) : null;
            assertEquals(400, post(path, malformed, READ_STATE_TOKEN, malformedProof, "REAL", "application/json").statusCode());
        }
        byte[] body = mapper.writeValueAsBytes(new ProfileReadStateProtocol.CounterQuery("requested"));
        assertEquals(403, post(ProfileReadStateProtocol.COUNTERS, body, READ_STATE_TOKEN, null, "REAL", "application/json").statusCode());
        assertEquals(0, calls.get()); assertTrue(evicted.isEmpty());
        body = mapper.writeValueAsBytes(new ProfileReadStateProtocol.CounterQuery("unavailable"));
        String proof = issuer.issueForCurrent(ProfileReadStateProtocol.AUDIENCE, "POST", ProfileReadStateProtocol.COUNTERS, body);
        assertEquals(503, post(ProfileReadStateProtocol.COUNTERS, body, READ_STATE_TOKEN, proof, "REAL", "application/json").statusCode());
    }

    private static HttpResponse<String> post(String path, byte[] body, String token, String proof, String mode, String contentType) throws Exception {
        var builder = HttpRequest.newBuilder(origin.resolve(path)).timeout(Duration.ofSeconds(5))
                .header("Content-Type", contentType).header("X-MyScoutee-Session-Mode", mode);
        if (token != null) builder.header("Authorization", "Bearer " + token);
        if (proof != null) builder.header(ActorDelegation.HEADER, proof);
        var response = http.send(builder.POST(HttpRequest.BodyPublishers.ofByteArray(body)).build(), HttpResponse.BodyHandlers.ofString());
        assertEquals("no-store", response.headers().firstValue("Cache-Control").orElseThrow());
        String directory = path.equals(ActorDelegationBrokerProtocol.PATH) ? "actor-delegation"
                : (path.equals(SelectedProfileProtocol.PATH) || path.equals(SelectedProfileProtocol.DISCOVERY)) ? "selected-profile"
                : path.startsWith("/_internal/v1/accounts/profile-read-state/") ? "profile-read-state" : "administrative-actors";
        Files.writeString(evidence.resolve(directory).resolve("response-" + sequence.incrementAndGet() + ".json"), mapper.writeValueAsString(
                Map.of("path", path, "method", "post", "status", response.statusCode(), "body", mapper.readTree(response.body()))));
        return response;
    }

    @SpringBootConfiguration
    @EnableAutoConfiguration(excludeName = {"org.springframework.boot.mongodb.autoconfigure.MongoAutoConfiguration", "org.springframework.boot.data.mongodb.autoconfigure.DataMongoAutoConfiguration",
            "org.springframework.boot.data.mongodb.autoconfigure.DataMongoRepositoriesAutoConfiguration", "org.springframework.boot.security.autoconfigure.UserDetailsServiceAutoConfiguration"})
    @Import({com.raxim.myscoutee.common.config.JsonConfig.class, ActorDelegationBrokerServerConfiguration.class,
            SelectedProfileServerConfiguration.class, AdministrativeActorsServerConfiguration.class, ProfileReadStateServerConfiguration.class, ServiceSecurityConfiguration.class})
    static class Fixture {
        @Bean ProfileReadState profileReadState() {
            return new ProfileReadState() {
                public com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserMenuCountersDto queryMenuCounters(String requested) {
                    calls.incrementAndGet();
                    var actor = assertInstanceOf(AuthenticatedActor.class, SecurityContextHolder.getContext().getAuthentication().getPrincipal());
                    assertEquals("selected", actor.getUserId());
                    if ("unavailable".equals(requested)) throw new IllegalStateException("owner unavailable");
                    return mapper.readValue("{\"game\":" + (MongoSessionModeContext.currentMode() == MongoSessionMode.DEMO ? 9 : 7) + "}",
                            com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserMenuCountersDto.class);
                }
                public void evictUserReadCaches(String id) { evicted.add(id); }
                public void evictUserReadCaches(Collection<String> ids) { if (ids != null) evicted.addAll(ids); }
            };
        }
        @Bean com.raxim.myscoutee.domain.administration.api.AdministrativeActors administrativeActors() {
            return new com.raxim.myscoutee.domain.administration.api.AdministrativeActors() {
                public com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminUserDto resolveAdminActor(String requested) {
                    var actor = assertInstanceOf(AuthenticatedActor.class, SecurityContextHolder.getContext().getAuthentication().getPrincipal());
                    assertEquals("actor@example.invalid", actor.getEmail());
                    assertEquals(List.of(new SimpleGrantedAuthority("A")), actor.getAuthorities());
                    return new com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminUserDto(
                            "workspace-admin", "Administrator", "A", actor.getEmail(), "", "", List.of());
                }
                public String baseGroupId(String requested) {
                    resolveAdminActor(requested);
                    if ("missing".equals(requested)) throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND);
                    if ("unavailable".equals(requested)) throw new IllegalStateException("owner unavailable");
                    return "global".equals(requested) ? null : "workspace";
                }
            };
        }
        @Bean CurrentProfile currentProfile() {
            return requested -> {
                var actor = assertInstanceOf(AuthenticatedActor.class, SecurityContextHolder.getContext().getAuthentication().getPrincipal());
                var profile = mock(DiscoveryProfile.class);
                when(profile.getUserId()).thenReturn("mismatched".equals(requested) ? "other" : actor.getUserId());
                when(profile.getAccountUserId()).thenReturn(actor.getProfileIdentity().accountUserId());
                when(profile.getWorkspaceGroupId()).thenReturn(actor.getProfileIdentity().workspaceGroupId());
                when(profile.getName()).thenReturn("Selected profile");
                return profile;
            };
        }
        @Bean SelectedProfile selectedProfile() {
            return requested -> {
                calls.incrementAndGet();
                var authentication = SecurityContextHolder.getContext().getAuthentication();
                assertTrue(authentication.isAuthenticated());
                var actor = assertInstanceOf(AuthenticatedActor.class, authentication.getPrincipal());
                assertEquals("workspace", actor.getProfileIdentity().workspaceGroupId());
                assertEquals("actor@example.invalid", actor.getEmail());
                assertEquals(List.of(new SimpleGrantedAuthority("U")), actor.getAuthorities());
                if ("unavailable".equals(requested)) throw new IllegalStateException("owner unavailable");
                return "missing".equals(requested) ? null : actor.getProfileIdentity();
            };
        }
    }
}
