package com.raxim.myscoutee.microservices.transport.common;

import java.net.URI;
import java.net.http.*;
import java.nio.file.*;
import java.time.Duration;
import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicInteger;
import com.raxim.myscoutee.common.config.mongo.*;
import com.raxim.myscoutee.domain.platform.api.JobGroupContext;
import com.raxim.myscoutee.domain.events.dto.EventPurgeTargetDto;
import com.raxim.myscoutee.microservices.bootstrap.ServiceSecurityConfiguration;
import com.raxim.myscoutee.microservices.transport.affinity.AffinityPrivacyServerConfiguration;
import com.raxim.myscoutee.domain.affinity.api.AffinityPrivacy;
import com.raxim.myscoutee.microservices.transport.chat.ChatPrivacyServerConfiguration;
import com.raxim.myscoutee.domain.chat.api.ChatPrivacy;
import com.raxim.myscoutee.microservices.transport.content.ContentPrivacyServerConfiguration;
import com.raxim.myscoutee.domain.content.api.ContentPrivacy;
import com.raxim.myscoutee.microservices.transport.email.EmailPrivacyServerConfiguration;
import com.raxim.myscoutee.domain.email.api.EmailPrivacy;
import com.raxim.myscoutee.microservices.transport.help.HelpPrivacyServerConfiguration;
import com.raxim.myscoutee.domain.help.api.HelpPrivacy;
import com.raxim.myscoutee.microservices.transport.payments.PaymentPrivacyServerConfiguration;
import com.raxim.myscoutee.domain.payments.api.PaymentPrivacy;
import com.raxim.myscoutee.microservices.transport.notifications.NotificationPrivacyServerConfiguration;
import com.raxim.myscoutee.domain.notifications.api.NotificationPrivacy;
import com.raxim.myscoutee.microservices.transport.assets.AssetPrivacyServerConfiguration;
import com.raxim.myscoutee.domain.assets.api.AssetPrivacy;
import com.raxim.myscoutee.microservices.transport.events.EventPrivacyServerConfiguration;
import com.raxim.myscoutee.domain.events.api.EventPrivacy;
import com.raxim.myscoutee.domain.accounts.api.AccountPurgeActions;
import com.raxim.myscoutee.domain.events.api.MemberAttention;
import com.raxim.myscoutee.microservices.transport.events.MemberAttentionServerConfiguration;
import com.raxim.myscoutee.microservices.transport.media.MediaCleanupServerConfiguration;
import com.raxim.myscoutee.domain.media.api.MediaCleanup;
import org.junit.jupiter.api.*;
import org.springframework.boot.*;
import org.springframework.boot.autoconfigure.*;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/** One HTTP fixture checks the coherent purge capability group, including chains beyond order 100. */
class PurgeBoundaryHttpTest {
    private static final String TOKEN = "test-only-purge-capability-000000000000000000000000000";
    private static final tools.jackson.databind.ObjectMapper mapper = new com.raxim.myscoutee.common.config.JsonConfig().objectMapper();
    private static final List<Invocation> calls = new CopyOnWriteArrayList<>();
    private static final AtomicInteger sequence = new AtomicInteger();
    private static volatile boolean failOwner;
    private static ConfigurableApplicationContext server;
    private static HttpClient http;
    private static URI origin;
    private record Invocation(String method, MongoSessionMode mode, boolean scoped, String group) {}
    private record Operation(String path, String method, Map<String,Object> fields) {}
    private record Boundary(String slug, int maximumBytes, List<Operation> operations) {}
    private static final List<Boundary> boundaries = List.of(
            new Boundary("member-attention", 2097152, List.of(
                    new Operation("/_internal/v1/events/member-attention/increment", "incrementCommunityUpdates",
                            Map.of("communityId", "community", "userId", "user", "delta", 1))
            )),
            new Boundary("affinity-privacy", 2097152, List.of(
                    new Operation("/_internal/v1/affinity/affinity-privacy/purge-ratings", "purgeRatings", Map.of("userId", "user")),
                    new Operation("/_internal/v1/affinity/affinity-privacy/purge-edges", "purgeEdges", Map.of("userId", "user")),
                    new Operation("/_internal/v1/affinity/affinity-privacy/purge-tasks", "purgeTasks", Map.of("userId", "user")),
                    new Operation("/_internal/v1/affinity/affinity-privacy/anonymize-authors", "anonymizeAuthors", Map.of("userId", "user"))
            )),
            new Boundary("chat-privacy", 2097152, List.of(
                    new Operation("/_internal/v1/chat/chat-privacy/purge-user-chat-activity", "purgeUserChatActivity", Map.of("userId", "user"))
            )),
            new Boundary("content-privacy", 2097152, List.of(
                    new Operation("/_internal/v1/content/content-privacy/purge-idea-posts", "purgeIdeaPosts", Map.of("userId", "user")),
                    new Operation("/_internal/v1/content/content-privacy/purge-feedback", "purgeFeedback", Map.of("userId", "user")),
                    new Operation("/_internal/v1/content/content-privacy/purge-reports", "purgeReports", Map.of("userId", "user")),
                    new Operation("/_internal/v1/content/content-privacy/purge-feed-views", "purgeFeedViews", Map.of("userId", "user")),
                    new Operation("/_internal/v1/content/content-privacy/purge-share-tokens", "purgeShareTokens", Map.of("userId", "user"))
            )),
            new Boundary("email-privacy", 2097152, List.of(
                    new Operation("/_internal/v1/email/email-privacy/purge-delivery-data", "purgeDeliveryData", Map.of("userId", "user")),
                    new Operation("/_internal/v1/email/email-privacy/anonymize-authors", "anonymizeAuthors", Map.of("userId", "user"))
            )),
            new Boundary("help-privacy", 2097152, List.of(
                    new Operation("/_internal/v1/help/help-privacy/anonymize-authors", "anonymizeAuthors", Map.of("userId", "user"))
            )),
            new Boundary("payment-privacy", 2097152, List.of(
                    new Operation("/_internal/v1/payments/payment-privacy/purge-payer-records", "purgePayerRecords", Map.of("userId", "user"))
            )),
            new Boundary("notification-privacy", 2097152, List.of(
                    new Operation("/_internal/v1/notifications/notification-privacy/purge-delivery-data", "purgeDeliveryData", Map.of("userId", "user")),
                    new Operation("/_internal/v1/notifications/notification-privacy/anonymize-rule-authors", "anonymizeRuleAuthors", Map.of("userId", "user"))
            )),
            new Boundary("asset-privacy", 2097152, List.of(
                    new Operation("/_internal/v1/assets/asset-privacy/purge-remaining-asset-requests", "purgeRemainingAssetRequests", Map.of("userId", "user")),
                    new Operation("/_internal/v1/assets/asset-privacy/purge-owned-media", "purgeOwnedMedia", Map.of("ids", List.of("target"))),
                    new Operation("/_internal/v1/assets/asset-privacy/delete-owned-records", "deleteOwnedRecords", Map.of("ids", List.of("target")))
            )),
            new Boundary("event-privacy", 2097152, List.of(
                    new Operation("/_internal/v1/events/event-privacy/purge-activity-memberships", "purgeActivityMemberships", Map.of("userId", "user")),
                    new Operation("/_internal/v1/events/event-privacy/purge-managed-event-admin-references", "purgeManagedEventAdminReferences", Map.of("userId", "user")),
                    new Operation("/_internal/v1/events/event-privacy/anonymize-ticket-audit", "anonymizeTicketAudit", Map.of("userId", "user")),
                    new Operation("/_internal/v1/events/event-privacy/purge-feedback", "purgeFeedback", Map.of("userId", "user")),
                    new Operation("/_internal/v1/events/event-privacy/purge-leaderboard", "purgeLeaderboard", Map.of("userId", "user")),
                    new Operation("/_internal/v1/events/event-privacy/anonymize-scheduler-markers", "anonymizeSchedulerMarkers", Map.of("userId", "user")),
                    new Operation("/_internal/v1/events/event-privacy/find-owned-events-for-purge", "findOwnedEventsForPurge", Map.of("userId", "user")),
                    new Operation("/_internal/v1/events/event-privacy/purge-owned-events", "purgeOwnedEvents", Map.of("documentIds", List.of("document"), "sources", List.of("source"))),
                    new Operation("/_internal/v1/events/event-privacy/purge-activity-resources", "purgeActivityResources", Map.of("userId", "user", "eventIds", List.of("event"), "assetIds", List.of("asset"))),
                    new Operation("/_internal/v1/events/event-privacy/purge-asset-memberships", "purgeAssetMemberships", Map.of("ids", List.of("target")))
            )),
            new Boundary("media-cleanup", 16384, List.of(
                    new Operation("/_internal/v1/media/media-cleanup/delete", "deletePublicObjectOrThrow", Map.of("reference", "/api/media/private?key=private%2Fimages%2Fowner%2Fimage.webp"))
            ))
    );
    @BeforeAll static void start() throws Exception {
        var properties = new HashMap<String,Object>();
        properties.put("server.address", "127.0.0.1"); properties.put("server.port", "0"); properties.put("management.server.port", "0");
        properties.put("spring.main.banner-mode", "off"); properties.put("logging.level.root", "WARN");
        for (var boundary : boundaries) {
            properties.put("myscoutee.remote." + boundary.slug() + ".command-token", TOKEN + boundary.slug());
            Path directory = Path.of(System.getProperty("wireEvidenceDirectory"), boundary.slug()); Files.createDirectories(directory);
            try (var files = Files.list(directory)) {
                for (var file : files.filter(p -> p.getFileName().toString().startsWith("response-")).toList()) Files.delete(file);
            }
        }
        server = new SpringApplicationBuilder(Fixture.class).properties(properties).run();
        origin = URI.create("http://127.0.0.1:" + server.getEnvironment().getProperty("local.server.port"));
        http = HttpClient.newBuilder().followRedirects(HttpClient.Redirect.NEVER).build();
    }
    @BeforeEach void reset() { calls.clear(); failOwner = false; }
    @AfterAll static void stop() { if (http != null) http.shutdownNow(); if (server != null) server.close(); }
    private static String body(Operation operation, boolean active, String group) {
        var fields = new LinkedHashMap<String,Object>(operation.fields());
        var scope = new LinkedHashMap<String,Object>(); scope.put("active", active); scope.put("groupId", group);
        fields.put("scope", scope); return mapper.writeValueAsString(fields);
    }
    @Test void explicitOperationsPreserveBothRealmsAndActiveDatingVersusInactiveScope() throws Exception {
        for (var boundary : boundaries) for (var operation : boundary.operations()) for (var mode : MongoSessionMode.values()) {
            for (int scope = 0; scope < 3; scope++) {
                boolean active = scope != 0; String group = scope == 2 ? "workspace" : null;
                int before = calls.size();
                var response = request(boundary, operation, body(operation, active, group), TOKEN + boundary.slug(), mode.name(), "POST", "application/json");
                assertEquals(200, response.statusCode(), operation.path());
                assertEquals(before + 1, calls.size());
                assertEquals(new Invocation(operation.method(), mode, active, group), calls.getLast());
                if (operation.method().equals("findOwnedEventsForPurge")) {
                    assertEquals(mapper.readTree("{\"targets\":[{\"id\":\"document\",\"sourceId\":\"source\"}]}"), mapper.readTree(response.body()));
                }
            }
        }
    }
    @Test void anotherCapabilityAndMalformedOrOversizedInputNeverReachPurgeOwners() throws Exception {
        for (var boundary : boundaries) {
            var operation = boundary.operations().getFirst(); String body = body(operation, true, null);
            assertEquals(401, request(boundary, operation, body, null, "REAL", "POST", "application/json").statusCode());
            assertEquals(401, request(boundary, operation, body, TOKEN + "unrelated", "REAL", "POST", "application/json").statusCode());
            assertEquals(400, request(boundary, operation, body, TOKEN + boundary.slug(), "WRONG", "POST", "application/json").statusCode());
            assertEquals(400, request(boundary, operation, "{\"unknown\":true}", TOKEN + boundary.slug(), "REAL", "POST", "application/json").statusCode());
            assertEquals(400, request(boundary, operation, body + "{}", TOKEN + boundary.slug(), "REAL", "POST", "application/json").statusCode());
            assertEquals(413, request(boundary, operation, " ".repeat(boundary.maximumBytes() + 1), TOKEN + boundary.slug(), "REAL", "POST", "application/json").statusCode());
            assertEquals(415, request(boundary, operation, body, TOKEN + boundary.slug(), "REAL", "POST", "text/plain").statusCode());
            assertEquals(403, request(boundary, operation, body, TOKEN + boundary.slug(), "REAL", "GET", "application/json").statusCode());
        }
        assertTrue(calls.isEmpty());
    }
    @Test void failedPurgeHasNoSuccessReceiptAndDoesNotExposeOwnerDetails() throws Exception {
        failOwner = true;
        for (var boundary : boundaries) {
            var operation = boundary.operations().getFirst(); int before = calls.size();
            var response = request(boundary, operation, body(operation, true, null), TOKEN + boundary.slug(), "DEMO", "POST", "application/json");
            assertEquals(503, response.statusCode()); assertFalse(response.body().contains("private-owner-detail"));
            assertEquals(before + 1, calls.size());
        }
    }

    @Test void productPurgeContributionsReuseExistingHttpOperationsWithoutExtraCalls() {
        var context = mock(AccountPurgeActions.Context.class);
        when(context.userId()).thenReturn("user");
        when(context.ownedEventIds()).thenReturn(List.of("source"));
        when(context.ownedAssetIds()).thenReturn(List.of("asset"));
        when(context.discoveredAssetIds()).thenReturn(List.of("asset"));
        var meters = new io.micrometer.core.instrument.simple.SimpleMeterRegistry();
        try (var events = new com.raxim.myscoutee.microservices.transport.events.RemoteEventPrivacy(
                        origin, TOKEN + "event-privacy", true, Duration.ofSeconds(1), Duration.ofSeconds(3), mapper, meters);
                var assets = new com.raxim.myscoutee.microservices.transport.assets.RemoteAssetPrivacy(
                        origin, TOKEN + "asset-privacy", true, Duration.ofSeconds(1), Duration.ofSeconds(3), mapper, meters);
                var content = new com.raxim.myscoutee.microservices.transport.content.RemoteContentPrivacy(
                        origin, TOKEN + "content-privacy", true, Duration.ofSeconds(1), Duration.ofSeconds(3), mapper, meters);
                var affinity = new com.raxim.myscoutee.microservices.transport.affinity.RemoteAffinityPrivacy(
                        origin, TOKEN + "affinity-privacy", true, Duration.ofSeconds(1), Duration.ofSeconds(3), mapper, meters);
                var payments = new com.raxim.myscoutee.microservices.transport.payments.RemotePaymentPrivacy(
                        origin, TOKEN + "payment-privacy", true, Duration.ofSeconds(1), Duration.ofSeconds(3), mapper, meters)) {
            for (var mode : MongoSessionMode.values()) {
                MongoSessionModeContext.set(mode);
                JobGroupContext.run("workspace", () -> {
                    for (AccountPurgeActions contributor : List.<AccountPurgeActions>of(events, assets, content, affinity, payments)) {
                        for (var entry : contributor.accountPurgeActions().entrySet()) {
                            int before = calls.size();
                            entry.getValue().accept(context);
                            int expected = entry.getKey() == AccountPurgeActions.Action.OWNED_EVENTS ? 2 : 1;
                            assertEquals(before + expected, calls.size(), entry.getKey().name());
                            for (Invocation call : calls.subList(before, calls.size())) {
                                assertEquals(mode, call.mode()); assertTrue(call.scoped());
                                assertEquals("workspace", call.group());
                            }
                        }
                    }
                });
            }
            verify(context, times(MongoSessionMode.values().length)).rememberOwnedEventIds(List.of("source"));
            assertFalse(JobGroupContext.isActive());
            failOwner = true;
            int before = calls.size();
            assertThrows(RemoteReadTransport.RemoteReadException.class, () -> events.accountPurgeActions()
                    .get(AccountPurgeActions.Action.OWNED_EVENTS).accept(context));
            assertEquals(before + 1, calls.size());
        } finally { MongoSessionModeContext.clear(); meters.close(); }
    }

    @Test void notificationObserverMakesOnlyTheOriginalMatchingMemberUpdate() {
        var meters = new io.micrometer.core.instrument.simple.SimpleMeterRegistry();
        try (var remote = new com.raxim.myscoutee.microservices.transport.events.RemoteMemberAttention(
                        origin, TOKEN + "member-attention", true, Duration.ofSeconds(1), Duration.ofSeconds(3), mapper, meters)) {
            for (var mode : MongoSessionMode.values()) {
                MongoSessionModeContext.set(mode);
                JobGroupContext.run("workspace", () -> {
                    int before = calls.size();
                    remote.onUnreadChange("chat", "chat", "user", Map.of(), 1);
                    remote.onUnreadChange("community", "community", "user", Map.of("communityAttention", "other"), 1);
                    assertEquals(before, calls.size());
                    remote.onUnreadChange("community", "community", "user", Map.of("communityAttention", "members"), 1);
                    remote.onUnreadChange("community", "community", "user", Map.of("communityAttention", "members"), -1);
                    assertEquals(before + 2, calls.size());
                    assertEquals(new Invocation("incrementCommunityUpdates", mode, true, "workspace"), calls.getLast());
                });
            }
            assertFalse(JobGroupContext.isActive());
        } finally { MongoSessionModeContext.clear(); meters.close(); }
    }
    private static HttpResponse<String> request(Boundary boundary, Operation operation, String body, String token,
            String mode, String method, String contentType) throws Exception {
        var builder = HttpRequest.newBuilder(origin.resolve(operation.path())).timeout(Duration.ofSeconds(5))
                .header("X-MyScoutee-Session-Mode", mode).header("Content-Type", contentType);
        if (token != null) builder.header("Authorization", "Bearer " + token);
        var response = http.send(builder.method(method, HttpRequest.BodyPublishers.ofString(body)).build(), HttpResponse.BodyHandlers.ofString());
        assertEquals("no-store", response.headers().firstValue("Cache-Control").orElseThrow());
        var evidence = Map.of("path", operation.path(), "method", "post", "status", response.statusCode(), "body", mapper.readTree(response.body()));
        Files.writeString(Path.of(System.getProperty("wireEvidenceDirectory"), boundary.slug(), "response-" + sequence.incrementAndGet() + ".json"), mapper.writeValueAsString(evidence));
        return response;
    }
    private static <T> T owner(Class<T> type) {
        return mock(type, invocation -> {
            if (invocation.getMethod().getDeclaringClass() == Object.class) return org.mockito.Answers.RETURNS_DEFAULTS.answer(invocation);
            calls.add(new Invocation(invocation.getMethod().getName(), MongoSessionModeContext.currentMode(), JobGroupContext.isActive(), JobGroupContext.groupId()));
            if (failOwner) throw new IllegalStateException("private-owner-detail");
            if (invocation.getMethod().getName().equals("findOwnedEventsForPurge")) return List.of(new EventPurgeTargetDto("document", "source"));
            return null;
        });
    }
    @SpringBootConfiguration
    @EnableAutoConfiguration(excludeName = {"org.springframework.boot.mongodb.autoconfigure.MongoAutoConfiguration", "org.springframework.boot.data.mongodb.autoconfigure.DataMongoAutoConfiguration",
            "org.springframework.boot.data.mongodb.autoconfigure.DataMongoRepositoriesAutoConfiguration", "org.springframework.boot.security.autoconfigure.UserDetailsServiceAutoConfiguration"})
    @Import({com.raxim.myscoutee.common.config.JsonConfig.class, ServiceSecurityConfiguration.class, MemberAttentionServerConfiguration.class, AffinityPrivacyServerConfiguration.class, ChatPrivacyServerConfiguration.class, ContentPrivacyServerConfiguration.class, EmailPrivacyServerConfiguration.class, HelpPrivacyServerConfiguration.class, PaymentPrivacyServerConfiguration.class, NotificationPrivacyServerConfiguration.class, AssetPrivacyServerConfiguration.class, EventPrivacyServerConfiguration.class, MediaCleanupServerConfiguration.class})
    static class Fixture {
        @Bean MemberAttention memberAttention() { return owner(MemberAttention.class); }
        @Bean AffinityPrivacy affinityPrivacy() { return owner(AffinityPrivacy.class); }
        @Bean ChatPrivacy chatPrivacy() { return owner(ChatPrivacy.class); }
        @Bean ContentPrivacy contentPrivacy() { return owner(ContentPrivacy.class); }
        @Bean EmailPrivacy emailPrivacy() { return owner(EmailPrivacy.class); }
        @Bean HelpPrivacy helpPrivacy() { return owner(HelpPrivacy.class); }
        @Bean PaymentPrivacy paymentPrivacy() { return owner(PaymentPrivacy.class); }
        @Bean NotificationPrivacy notificationPrivacy() { return owner(NotificationPrivacy.class); }
        @Bean AssetPrivacy assetPrivacy() { return owner(AssetPrivacy.class); }
        @Bean EventPrivacy eventPrivacy() { return owner(EventPrivacy.class); }
        @Bean MediaCleanup mediaCleanup() { return owner(MediaCleanup.class); }
    }
}
