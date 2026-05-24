package com.raxim.myscoutee.e2e;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.RETURNS_DEEP_STUBS;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Map;
import java.util.UUID;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

import com.google.firebase.auth.FirebaseToken;
import com.raxim.myscoutee.common.config.FirebaseConfig;
import com.raxim.myscoutee.Main;
import com.raxim.myscoutee.common.config.firebase.FirebaseTokenVerifier;
import com.raxim.myscoutee.common.config.firebase.dto.FirebaseCredential;
import com.raxim.myscoutee.common.config.firebase.exception.FirebaseTokenInvalidException;
import com.raxim.myscoutee.common.config.properties.ConfigProperties;

import de.flapdoodle.embed.mongo.commands.ServerAddress;
import de.flapdoodle.embed.mongo.distribution.Version;
import de.flapdoodle.embed.mongo.transitions.Mongod;
import de.flapdoodle.embed.mongo.transitions.RunningMongodProcess;
import de.flapdoodle.reverse.TransitionWalker;

@Tag("e2e")
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
@SpringBootTest(
        classes = {Main.class, BackendSecurityContractsE2ETest.E2eInfrastructure.class},
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
        properties = {
                "config.firebase-enabled=true",
                "config.admin-user=e2e-security-admin@example.test",
                "admin.stats.enabled=false",
                "assets.source-refresh.enabled=false",
                "media.enabled=false",
                "payment.enablePay=false",
                "events.scheduler.enabled=false",
                "events.scheduler.check-delay-ms=600000",
                "events.waitlist.inviter-check-delay-ms=600000",
                "scheduled-messages.task-poll-delay-ms=600000",
                "chat.stream.poll-delay-ms=600000",
                "notifications.outbox.worker-check-delay-ms=600000",
                "notifications.outbox.wakeup-poll-delay-ms=600000",
                "email.promotions.scheduler-poll-delay-ms=600000",
                "email.promotions.delivery-delay-ms=600000",
                "affinity.recompute.worker-tick-ms=600000",
                "users.deleted-account-purge-delay-ms=600000",
                "spring.main.allow-bean-definition-overriding=true",
                "logging.level.org.springframework.data.mongodb.core.MongoTemplate=WARN"
        })
class BackendSecurityContractsE2ETest {
    private static final String ADMIN_EMAIL = "e2e-security-admin@example.test";
    private static final String USER_EMAIL = "e2e-security-user@example.test";
    private static final String DB_SUFFIX = UUID.randomUUID().toString().replace("-", "");
    private static final String REAL_DB = "ms_security_contracts_real_" + DB_SUFFIX;
    private static final String DEMO_DB = "ms_security_contracts_demo_" + DB_SUFFIX;

    private static TransitionWalker.ReachedState<RunningMongodProcess> embeddedMongo;
    private static String mongoBaseUri;

    @LocalServerPort
    private int port;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(5))
            .build();

    @DynamicPropertySource
    static void mongoProperties(DynamicPropertyRegistry registry) {
        ensureEmbeddedMongo();
        registry.add("SPRING_MONGODB_URI", () -> mongoBaseUri + "/" + REAL_DB);
        registry.add("MONGODB_DEMO_URI", () -> mongoBaseUri + "/" + DEMO_DB);
        registry.add("spring.mongodb.database", () -> REAL_DB);
        registry.add("MONGODB_DEMO_DATABASE", () -> DEMO_DB);
    }

    @AfterAll
    static void stopEmbeddedMongo() throws Exception {
        if (embeddedMongo != null) {
            embeddedMongo.close();
        }
    }

    @AfterEach
    void clearSecurityContext() {
        org.springframework.security.core.context.SecurityContextHolder.clearContext();
    }

    @Test
    void firebaseEnabledAdminRoutesRejectUnauthenticatedRequests() {
        HttpResponse<String> adminResponse = get("/admin/params?adminUserId=e2e-security-admin");
        assertThat(adminResponse.statusCode())
                .as("admin route should require an authenticated admin principal, body=" + adminResponse.body())
                .isIn(401, 403);

        HttpResponse<String> publicHelpResponse = get("/help/active");
        assertThat(publicHelpResponse.statusCode())
                .as("public help route should remain available, body=" + publicHelpResponse.body())
                .isBetween(200, 299);
    }

    @Test
    void firebaseEnabledAdminRoutesDoNotTreatDemoSessionHeaderAsAdminBypass() {
        HttpResponse<String> demoHeaderWithoutToken = getWithDemoSessionHeader("/admin/dashboard?adminUserId=e2e-security-admin");
        assertThat(demoHeaderWithoutToken.statusCode())
                .as("demo routing header must not bypass Firebase admin authentication, body=" + demoHeaderWithoutToken.body())
                .isIn(401, 403);

        HttpResponse<String> demoHeaderNormalUser = getWithDemoSessionHeader(
                "/admin/dashboard?adminUserId=e2e-security-admin",
                "normal-user-token");
        assertThat(demoHeaderNormalUser.statusCode())
                .as("demo routing header must not turn a normal Firebase user into admin, body=" + demoHeaderNormalUser.body())
                .isEqualTo(403);

        HttpResponse<String> demoHeaderAdmin = getWithDemoSessionHeader(
                "/admin/dashboard?adminUserId=e2e-security-admin",
                "admin-token");
        assertThat(demoHeaderAdmin.statusCode())
                .as("configured admin should still work when the frontend sends session routing headers, body=" + demoHeaderAdmin.body())
                .isBetween(200, 299);
    }

    @Test
    void firebaseEnabledAdminRoutesRejectNormalUsersAndAllowConfiguredAdmins() {
        HttpResponse<String> normalUserResponse = get(
                "/admin/params?adminUserId=e2e-security-admin",
                "normal-user-token");
        assertThat(normalUserResponse.statusCode())
                .as("authenticated non-admins should not reach admin routes, body=" + normalUserResponse.body())
                .isEqualTo(403);

        HttpResponse<String> adminResponse = get(
                "/admin/params?adminUserId=e2e-security-admin",
                "admin-token");
        assertThat(adminResponse.statusCode())
                .as("configured admin token should reach admin routes, body=" + adminResponse.body())
                .isBetween(200, 299);
    }

    @Test
    void invalidFirebaseTokensDoNotReachAdminRoutesOrFallbackToDevUser() {
        HttpResponse<String> invalidTokenResponse = get(
                "/admin/monitoring?adminUserId=e2e-security-admin",
                "unknown-token");
        assertThat(invalidTokenResponse.statusCode())
                .as("invalid Firebase token must be rejected, body=" + invalidTokenResponse.body())
                .isIn(401, 403);

        HttpResponse<String> malformedHeaderResponse = send(HttpRequest.newBuilder(uri("/admin/monitoring?adminUserId=e2e-security-admin"))
                .header("Accept", "application/json")
                .header("Authorization", "Token unknown-token")
                .GET()
                .build());
        assertThat(malformedHeaderResponse.statusCode())
                .as("malformed auth header must not bypass Firebase, body=" + malformedHeaderResponse.body())
                .isIn(401, 403);
    }

    @Test
    void firebaseEnabledAdminMutationRoutesRejectNormalUsers() {
        HttpResponse<String> normalUserResponse = post(
                "/admin/notifications",
                "normal-user-token",
                Map.of("adminUserId", "e2e-security-admin", "rules", java.util.List.of()));
        assertThat(normalUserResponse.statusCode())
                .as("authenticated non-admins should not mutate admin notification rules, body=" + normalUserResponse.body())
                .isEqualTo(403);
    }

    private HttpResponse<String> get(String path) {
        return send(HttpRequest.newBuilder(uri(path))
                .header("Accept", "application/json")
                .GET()
                .build());
    }

    private HttpResponse<String> get(String path, String token) {
        return send(HttpRequest.newBuilder(uri(path))
                .header("Accept", "application/json")
                .header("Authorization", "Bearer " + token)
                .GET()
                .build());
    }

    private HttpResponse<String> post(String path, String token, Object body) {
        return send(HttpRequest.newBuilder(uri(path))
                .header("Accept", "application/json")
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + token)
                .POST(HttpRequest.BodyPublishers.ofString(body == null ? "{}" : body.toString()))
                .build());
    }

    private HttpResponse<String> getWithDemoSessionHeader(String path) {
        return send(HttpRequest.newBuilder(uri(path))
                .header("Accept", "application/json")
                .header("X-App-Session-Kind", "demo")
                .GET()
                .build());
    }

    private HttpResponse<String> getWithDemoSessionHeader(String path, String token) {
        return send(HttpRequest.newBuilder(uri(path))
                .header("Accept", "application/json")
                .header("X-App-Session-Kind", "demo")
                .header("Authorization", "Bearer " + token)
                .GET()
                .build());
    }

    private URI uri(String path) {
        return URI.create("http://localhost:" + port + path);
    }

    private HttpResponse<String> send(HttpRequest request) {
        try {
            return httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        } catch (Exception exception) {
            throw new AssertionError("HTTP request failed: " + request.uri(), exception);
        }
    }

    private static void ensureEmbeddedMongo() {
        if (embeddedMongo != null) {
            return;
        }
        embeddedMongo = Mongod.instance().start(Version.Main.V6_0);
        ServerAddress serverAddress = embeddedMongo.current().getServerAddress();
        mongoBaseUri = "mongodb://" + serverAddress.getHost() + ":" + serverAddress.getPort();
    }

    @TestConfiguration(proxyBeanMethods = false)
    static class E2eInfrastructure {
        @Bean
        @Primary
        StringRedisTemplate stringRedisTemplate() {
            return mock(StringRedisTemplate.class, RETURNS_DEEP_STUBS);
        }

        @Bean
        @Primary
        FirebaseTokenVerifier firebaseTokenVerifier() {
            return firebaseToken -> switch (firebaseToken) {
                case "normal-user-token" -> credential(USER_EMAIL);
                case "admin-token" -> credential(ADMIN_EMAIL);
                default -> throw new FirebaseTokenInvalidException("Unknown e2e Firebase token");
            };
        }

        @Bean
        @Primary
        FirebaseConfig firebaseConfig(ConfigProperties configProperties) {
            return new FirebaseConfig(configProperties) {
                @Override
                public void init() {
                    // The e2e security tests exercise the HTTP auth filter with a fake verifier.
                }
            };
        }

        private FirebaseCredential credential(String email) {
            FirebaseToken token = mock(FirebaseToken.class);
            when(token.getEmail()).thenReturn(email);
            when(token.getClaims()).thenReturn(java.util.Map.of());
            return new FirebaseCredential(token);
        }
    }
}
