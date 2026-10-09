package com.raxim.myscoutee.microservices.transport.notifications;

import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.domain.notifications.service.NotificationCatalogService;
import com.raxim.myscoutee.domain.affinity.service.RecomputeQueueService;
import com.raxim.myscoutee.domain.affinity.repository.AffinityRecomputeTasksRepository;
import com.raxim.myscoutee.microservices.transport.affinity.*;
import com.raxim.myscoutee.domain.notifications.document.NotificationRuleConfig;
import com.raxim.myscoutee.domain.notifications.document.NotificationTemplate;
import com.raxim.myscoutee.domain.notifications.repository.*;
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
import tools.jackson.databind.json.JsonMapper;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class NotificationCatalogHttpTest {
    static final String TOKEN = "test-only-notification-catalog-token-0000000000000";
    static ConfigurableApplicationContext server;
    static RemoteNotificationCatalog remote;
    static RemoteRecomputeQueue recompute;
    static final String RECOMPUTE_TOKEN = "test-only-recompute-queue-token-000000000000000000";
    static HttpClient http;
    static URI origin;
    static SimpleMeterRegistry meters;
    static Path evidence;
    static final AtomicInteger sequence = new AtomicInteger();
    @BeforeAll static void start() throws Exception {
        evidence = Path.of(System.getProperty("wireEvidenceDirectory"), "notification-catalog");
        Files.createDirectories(evidence);
        var queueEvidence = evidence.resolveSibling("recompute-queue");
        Files.createDirectories(queueEvidence);
        try (var files = Files.list(queueEvidence)) {
            for (var file : files.filter(p -> p.getFileName().toString().matches("response-[0-9]+\\.json")).toList()) Files.delete(file);
        }
        try (var files = Files.list(evidence)) {
            for (var file : files.filter(p -> p.getFileName().toString().matches("response-[0-9]+\\.json")).toList()) Files.delete(file);
        }
        server = new SpringApplicationBuilder(Fixture.class).properties(
                "server.address=127.0.0.1", "server.port=0", "management.server.port=0",
                "myscoutee.remote.notification-catalog.read-token=" + TOKEN,
                "myscoutee.remote.recompute-queue.read-token=" + RECOMPUTE_TOKEN,
                "spring.main.allow-bean-definition-overriding=false",
                "spring.main.banner-mode=off", "logging.level.root=WARN").run();
        origin = URI.create("http://127.0.0.1:" + server.getEnvironment().getProperty("local.server.port"));
        http = HttpClient.newBuilder().followRedirects(HttpClient.Redirect.NEVER).build();
        meters = new SimpleMeterRegistry();
        recompute = new RemoteRecomputeQueue(origin, RECOMPUTE_TOKEN, true, Duration.ofSeconds(1), Duration.ofSeconds(3), new JsonMapper(), meters);
        remote = new RemoteNotificationCatalog(origin, TOKEN, true, Duration.ofSeconds(1), Duration.ofSeconds(3), new JsonMapper(), meters);
    }
    @AfterEach void clear() { MongoSessionModeContext.clear(); }
    @AfterAll static void stop() {
        if (remote != null) remote.close();
        if (recompute != null) recompute.close();
        if (http != null) http.shutdownNow();
        if (server != null) server.close();
        if (meters != null) meters.close();
    }
    @Test void countsRetainLongRangeModeAndCountEachFailedRuleOnce() throws Exception {
        var local = server.getBean(NotificationCatalogService.class);
        for (var mode : List.of(MongoSessionMode.REAL, MongoSessionMode.DEMO, MongoSessionMode.REAL)) {
            MongoSessionModeContext.set(mode);
            assertEquals(local.countUnread("account&é/?"), remote.countUnread("account&é/?"));
            assertEquals(local.failedJobs("base&é/?"), remote.failedJobs("base&é/?"));
            assertEquals(local.countOutbox("base&é/?", "pending"), remote.countOutbox("base&é/?", "pending"));
            assertEquals(2, remote.failedJobs("base"));
            for (var path : List.of(NotificationCatalogProtocol.UNREAD, NotificationCatalogProtocol.FAILED_JOBS, NotificationCatalogProtocol.OUTBOX))
                assertEquals(200, request(path, "?userId=id&baseGroupId=base&status=pending", TOKEN, mode.name(), "GET").statusCode());
        }
        MongoSessionModeContext.set(MongoSessionMode.REAL);
        assertEquals(4294967296L, remote.countUnread("id"));
        assertEquals(0, remote.countOutbox("base", "unknown-status"));
        assertEquals(200, request(NotificationCatalogProtocol.OUTBOX, "?baseGroupId=base&status=unknown-status", TOKEN, "REAL", "GET").statusCode());
    }
    @Test void templatesPreserveDisabledNullableAndAbsentStatesWithoutPersistenceFields() throws Exception {
        var local = server.getBean(NotificationCatalogService.class);
        for (var mode : List.of(MongoSessionMode.REAL, MongoSessionMode.DEMO)) {
            MongoSessionModeContext.set(mode);
            for (var key : List.of("known", "unset", "missing")) {
                assertEquals(local.findByTemplateKey(key), remote.findByTemplateKey(key));
                var response = request(NotificationCatalogProtocol.TEMPLATE, "?templateKey=" + key, TOKEN, mode.name(), "GET");
                assertEquals(key.equals("missing") ? 404 : 200, response.statusCode());
                assertFalse(response.body().contains("private-persistence-id"));
            }
            assertEquals(mode.name(), remote.findByTemplateKey("known").orElseThrow().titleTemplate());
        }
        assertFalse(remote.findByTemplateKey("known").orElseThrow().enabled());
        assertNull(remote.findByTemplateKey("unset").orElseThrow().enabled());
        assertNull(remote.findByTemplateKey("unset").orElseThrow().bodyTemplate());
    }
    @Test void allOperationsEnforceCredentialModeMethodAndParameterBounds() throws Exception {
        for (var path : NotificationCatalogProtocol.paths()) {
            for (var token : new String[]{null, "test-only-localization-token-00000000000000000000000"})
                assertEquals(401, request(path, "", token, "REAL", "GET").statusCode());
            for (var mode : new String[]{null, "demo", "ANY"})
                assertEquals(400, request(path, "", TOKEN, mode, "GET").statusCode());
            assertEquals(403, request(path, "", TOKEN, "REAL", "POST").statusCode());
            String parameter = path.equals(NotificationCatalogProtocol.TEMPLATE) ? "templateKey" : path.equals(NotificationCatalogProtocol.UNREAD) ? "userId" : "baseGroupId";
            assertEquals(400, request(path, "?" + parameter + "=" + "x".repeat(513), TOKEN, "REAL", "GET").statusCode());
        }
        assertThrows(IllegalArgumentException.class, () -> remote.countOutbox("base", "x".repeat(513)));
    }
    @Test void failuresAreNotZeroCountsAndNullVersusEmptyParametersStayDistinct() throws Exception {
        for (var path : NotificationCatalogProtocol.paths()) {
            var response = request(path, "?userId=fail&baseGroupId=fail&templateKey=fail", TOKEN, "REAL", "GET");
            assertEquals(503, response.statusCode());
            assertEquals("{\"code\":\"NOTIFICATION_CATALOG_UNAVAILABLE\"}", response.body());
        }
        assertEquals(503, assertThrows(RemoteReadException.class, () -> remote.countUnread("fail")).status());
        assertEquals(503, assertThrows(RemoteReadException.class, () -> remote.failedJobs("fail")).status());
        assertEquals(503, assertThrows(RemoteReadException.class, () -> remote.countOutbox("fail", null)).status());
        assertEquals(503, assertThrows(RemoteReadException.class, () -> remote.findByTemplateKey("fail")).status());
        var inbox = server.getBean(UserNotificationPageRepository.class);
        remote.countUnread(null); remote.countUnread("");
        verify(inbox).countUnread(null); verify(inbox).countUnread("");
        var outbox = server.getBean(NotificationOutboxRepository.class);
        remote.countOutbox(null, ""); remote.countOutbox("", null);
        verify(outbox).countByBaseGroupIdAndStatus(null, ""); verify(outbox).countByBaseGroupIdAndStatus("", null);
    }
    @Test void recomputeCountsPreserveScopeModeLongRangeAndNullParameters() throws Exception {
        var local = server.getBean(RecomputeQueueService.class);
        for (var mode : List.of(MongoSessionMode.REAL, MongoSessionMode.DEMO)) {
            MongoSessionModeContext.set(mode);
            for (var status : List.of("pending", "running", "failed", "unknown-status")) {
                assertEquals(local.count("base&é/?", status), recompute.count("base&é/?", status));
                assertEquals(200, request(RecomputeQueueProtocol.PATH, "?baseGroupId=base&status=" + status, RECOMPUTE_TOKEN, mode.name(), "GET").statusCode());
            }
        }
        recompute.count(null, ""); recompute.count("", null);
        var repository = server.getBean(AffinityRecomputeTasksRepository.class);
        verify(repository).countByBaseGroupIdAndStatus(null, ""); verify(repository).countByBaseGroupIdAndStatus("", null);
    }
    @Test void recomputeReadHasSeparateAuthorityAndDoesNotHideOwnerFailures() throws Exception {
        String path = RecomputeQueueProtocol.PATH;
        for (var token : new String[]{null, TOKEN})
            assertEquals(401, request(path, "", token, "REAL", "GET").statusCode());
        for (var mode : new String[]{null, "demo", "ANY"})
            assertEquals(400, request(path, "", RECOMPUTE_TOKEN, mode, "GET").statusCode());
        assertEquals(403, request(path, "", RECOMPUTE_TOKEN, "REAL", "POST").statusCode());
        assertEquals(400, request(path, "?status=" + "x".repeat(513), RECOMPUTE_TOKEN, "REAL", "GET").statusCode());
        assertEquals(503, request(path, "?baseGroupId=fail", RECOMPUTE_TOKEN, "REAL", "GET").statusCode());
        assertEquals(503, assertThrows(RemoteReadException.class, () -> recompute.count("fail", "pending")).status());
        assertThrows(IllegalArgumentException.class, () -> recompute.count("base", "x".repeat(513)));
        assertEquals(401, request(NotificationCatalogProtocol.UNREAD, "", RECOMPUTE_TOKEN, "REAL", "GET").statusCode());
    }
    static HttpResponse<String> request(String path, String suffix, String token, String mode, String method) throws Exception {
        var builder = HttpRequest.newBuilder(origin.resolve(path + suffix)).timeout(Duration.ofSeconds(3));
        if (token != null) builder.header("Authorization", "Bearer " + token);
        if (mode != null) builder.header(InternalReadCredentialFilter.MODE_HEADER, mode);
        var response = http.send(builder.method(method, HttpRequest.BodyPublishers.noBody()).build(), HttpResponse.BodyHandlers.ofString());
        assertEquals("no-store", response.headers().firstValue("Cache-Control").orElseThrow());
        Files.writeString((path.equals(RecomputeQueueProtocol.PATH) ? evidence.resolveSibling("recompute-queue") : evidence).resolve("response-" + sequence.incrementAndGet() + ".json"), new JsonMapper().writeValueAsString(
                Map.of("path", path, "status", response.statusCode(), "body", new JsonMapper().readTree(response.body()))));
        return response;
    }
    @SpringBootConfiguration
    @EnableAutoConfiguration(excludeName = {
            "org.springframework.boot.mongodb.autoconfigure.MongoAutoConfiguration",
            "org.springframework.boot.data.mongodb.autoconfigure.DataMongoAutoConfiguration",
            "org.springframework.boot.data.mongodb.autoconfigure.DataMongoRepositoriesAutoConfiguration",
            "org.springframework.boot.security.autoconfigure.UserDetailsServiceAutoConfiguration"})
    @Import({NotificationCatalogServerConfiguration.class, RecomputeQueueServerConfiguration.class, ServiceSecurityConfiguration.class})
    static class Fixture {
        static void fail(String value) { if ("fail".equals(value)) throw new IllegalStateException("secret database details"); }
        @Bean UserNotificationPageRepository inbox() {
            var repository = mock(UserNotificationPageRepository.class);
            when(repository.countUnread(nullable(String.class))).thenAnswer(call -> {
                fail(call.getArgument(0)); return MongoSessionModeContext.currentMode() == MongoSessionMode.REAL ? 4294967296L : 9L;
            });
            return repository;
        }
        @Bean NotificationRuleConfigsRepository rules() {
            var repository = mock(NotificationRuleConfigsRepository.class);
            when(repository.findByBaseGroupId(nullable(String.class))).thenAnswer(call -> {
                fail(call.getArgument(0));
                return List.of(rule("FAILED", "timeout"), rule("ready", " MISSED "), rule("running", "completed"));
            });
            return repository;
        }
        static NotificationRuleConfig rule(String current, String last) {
            var rule = new NotificationRuleConfig(); var state = new NotificationRuleConfig.RunState();
            state.setCurrentStatus(current); state.setLastRunStatus(last); rule.setRunState(state); return rule;
        }
        @Bean NotificationOutboxRepository outbox() {
            var repository = mock(NotificationOutboxRepository.class);
            when(repository.countByBaseGroupIdAndStatus(nullable(String.class), nullable(String.class))).thenAnswer(call -> {
                fail(call.getArgument(0)); return "pending".equals(call.getArgument(1)) ? 7L : 0L;
            });
            return repository;
        }
        @Bean NotificationTemplatesRepository templates() {
            var repository = mock(NotificationTemplatesRepository.class);
            when(repository.findByTemplateKey(nullable(String.class))).thenAnswer(call -> {
                String key = call.getArgument(0); fail(key);
                if ("missing".equals(key)) return Optional.empty();
                var template = new NotificationTemplate(); template.setTemplateKey(key);
                template.setId("private-persistence-id"); template.setTitleTemplate(MongoSessionModeContext.currentMode().name());
                template.setEnabled("unset".equals(key) ? null : false);
                template.setBodyTemplate("unset".equals(key) ? null : "Body");
                template.setIconUrl("/icon"); template.setBadgeUrl("/badge"); template.setCtaPath("/event");
                return Optional.of(template);
            });
            return repository;
        }
        @Bean AffinityRecomputeTasksRepository recomputeTasks() {
            var repository = mock(AffinityRecomputeTasksRepository.class);
            when(repository.countByBaseGroupIdAndStatus(nullable(String.class), nullable(String.class))).thenAnswer(call -> {
                fail(call.getArgument(0));
                return "unknown-status".equals(call.getArgument(1)) ? 0L : MongoSessionModeContext.currentMode() == MongoSessionMode.REAL ? 4294967296L : 3L;
            });
            return repository;
        }
        @Bean RecomputeQueueService queueOwner(AffinityRecomputeTasksRepository tasks) { return new RecomputeQueueService(tasks); }
        @Bean NotificationCatalogService owner(UserNotificationPageRepository inbox, NotificationRuleConfigsRepository rules,
                NotificationOutboxRepository outbox, NotificationTemplatesRepository templates) {
            return new NotificationCatalogService(inbox, rules, outbox, templates);
        }
    }
}
