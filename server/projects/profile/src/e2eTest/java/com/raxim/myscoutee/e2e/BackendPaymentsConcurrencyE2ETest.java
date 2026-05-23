package com.raxim.myscoutee.e2e;

import static org.assertj.core.api.Assertions.assertThat;
import static org.awaitility.Awaitility.await;
import static org.mockito.Mockito.RETURNS_DEEP_STUBS;
import static org.mockito.Mockito.mock;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.function.Supplier;

import org.bson.Document;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.web.server.ResponseStatusException;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.ReplaceOptions;
import com.raxim.myscoutee.Main;
import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.profile.data.document.ActivityChat;
import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.ActivityMember;
import com.raxim.myscoutee.profile.data.document.Payment;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutRequestDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutSessionDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.LocationCoordinatesDto;
import com.raxim.myscoutee.profile.service.PaymentProcessor;

import de.flapdoodle.embed.mongo.commands.ServerAddress;
import de.flapdoodle.embed.mongo.distribution.Version;
import de.flapdoodle.embed.mongo.transitions.Mongod;
import de.flapdoodle.embed.mongo.transitions.RunningMongodProcess;
import de.flapdoodle.reverse.TransitionWalker;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

@Tag("e2e")
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
@SpringBootTest(
        classes = {Main.class, BackendPaymentsConcurrencyE2ETest.E2eInfrastructure.class},
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
        properties = {
                "config.firebase-enabled=false",
                "config.dev-user=e2e-pay-u01@example.test",
                "admin.stats.enabled=false",
                "assets.source-refresh.enabled=false",
                "media.enabled=false",
                "payment.enablePay=true",
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
class BackendPaymentsConcurrencyE2ETest {
    private static final String DB_SUFFIX = UUID.randomUUID().toString().replace("-", "");
    private static final String REAL_DB = "ms_payment_concurrency_real_" + DB_SUFFIX;
    private static final String DEMO_DB = "ms_payment_concurrency_demo_" + DB_SUFFIX;
    private static final String HOST_ID = userId(1);
    private static final String IDEMPOTENT_EVENT_ID = "e2e-pay-idempotent-event";
    private static final String CONCURRENCY_EVENT_ID = "e2e-pay-capacity-event";
    private static final int CONCURRENCY_CAPACITY = 7;
    private static final Instant BASE_TIME = Instant.parse("2026-07-01T12:00:00Z");

    private static TransitionWalker.ReachedState<RunningMongodProcess> embeddedMongo;
    private static String mongoBaseUri;

    @LocalServerPort
    private int port;
    @org.springframework.beans.factory.annotation.Autowired
    private ObjectMapper objectMapper;
    @org.springframework.beans.factory.annotation.Autowired
    private MongoTemplate mongoTemplate;

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

    @BeforeEach
    void seedBackend() {
        withReal(() -> {
            clearE2eCollections();
            seedUsers();
        });
    }

    @Test
    void paymentSessionsAreIdempotentAndRejectCrossUserMutationThroughHttp() {
        publishPaidEvent(IDEMPOTENT_EVENT_ID, 3);

        JsonNode checkout = postJson("/activities/events/checkout?provider=e2e", checkoutPayload(IDEMPOTENT_EVENT_ID, userId(2), 30d));
        String paymentSessionId = checkout.path("id").asString();
        assertThat(paymentSessionId).startsWith("e2e_checkout_");

        JsonNode paidOnce = postJson("/activities/events/pay?provider=e2e&paymentSessionId=" + paymentSessionId,
                checkoutPayload(IDEMPOTENT_EVENT_ID, userId(2), 30d));
        JsonNode paidTwice = postJson("/activities/events/pay?provider=e2e&paymentSessionId=" + paymentSessionId,
                checkoutPayload(IDEMPOTENT_EVENT_ID, userId(2), 30d));
        assertThat(paidOnce.path("id").asString()).isEqualTo(paymentSessionId);
        assertThat(paidTwice.path("id").asString()).isEqualTo(paymentSessionId);
        assertThat(paymentsForEvent(IDEMPOTENT_EVENT_ID)).hasSize(1);

        HttpResponse<String> wrongUserPay = postRaw(
                "/activities/events/pay?provider=e2e&paymentSessionId=" + paymentSessionId,
                checkoutPayload(IDEMPOTENT_EVENT_ID, userId(3), 30d));
        assertThat(wrongUserPay.statusCode()).isEqualTo(409);

        HttpResponse<String> wrongSourcePay = postRaw(
                "/activities/events/pay?provider=e2e&paymentSessionId=" + paymentSessionId,
                checkoutPayload("another-event", userId(2), 30d));
        assertThat(wrongSourcePay.statusCode()).isEqualTo(409);

        HttpResponse<String> wrongAmountPay = postRaw(
                "/activities/events/pay?provider=e2e&paymentSessionId=" + paymentSessionId,
                checkoutPayload(IDEMPOTENT_EVENT_ID, userId(2), 31d));
        assertThat(wrongAmountPay.statusCode()).isEqualTo(409);

        Map<String, Object> wrongCurrencyPayload = checkoutPayload(IDEMPOTENT_EVENT_ID, userId(2), 30d);
        wrongCurrencyPayload.put("currency", "USD");
        wrongCurrencyPayload.put("lineItems", List.of(Map.of(
                "id", "ticket",
                "kind", "event-ticket",
                "label", "Ticket",
                "detail", "One seat",
                "amount", 30d,
                "currency", "USD")));
        HttpResponse<String> wrongCurrencyPay = postRaw(
                "/activities/events/pay?provider=e2e&paymentSessionId=" + paymentSessionId,
                wrongCurrencyPayload);
        assertThat(wrongCurrencyPay.statusCode()).isEqualTo(409);

        Payment protectedPayment = onlyPayment(IDEMPOTENT_EVENT_ID, userId(2));
        assertThat(protectedPayment.getUserId()).isEqualTo(userId(2));
        assertThat(protectedPayment.getAmount()).isEqualTo(30d);
        assertThat(protectedPayment.getCurrency()).isEqualTo("EUR");
        assertThat(paymentsForEvent(IDEMPOTENT_EVENT_ID)).hasSize(1);
        assertThat(paymentsForEvent("another-event")).isEmpty();

        HttpResponse<String> failingCheckout = postRaw("/activities/events/checkout?provider=e2e-fail",
                checkoutPayload(IDEMPOTENT_EVENT_ID, userId(4), 30d));
        assertThat(failingCheckout.statusCode()).isGreaterThanOrEqualTo(500);
        assertThat(paymentsForUser(userId(4))).isEmpty();

        HttpResponse<String> missingSessionPay = postRaw("/activities/events/pay?provider=e2e",
                checkoutPayload(IDEMPOTENT_EVENT_ID, userId(4), 30d));
        assertThat(missingSessionPay.statusCode()).isEqualTo(400);
        assertThat(paymentsForUser(userId(4))).isEmpty();

        postJson("/activities/events/join", joinPayload(IDEMPOTENT_EVENT_ID, userId(2), paymentSessionId));
        postJson("/activities/events/join", joinPayload(IDEMPOTENT_EVENT_ID, userId(2), paymentSessionId));
        assertThat(nonHostMembers(members(IDEMPOTENT_EVENT_ID, "accepted"))).extracting(ActivityMember::getUserId)
                .containsExactly(userId(2));
        assertThat(getJson("/assets/tickets?userId=" + userId(2)).path("total").asInt()).isEqualTo(1);
        assertThat(onlyPayment(IDEMPOTENT_EVENT_ID, userId(2)).getBookingStatus()).isEqualTo("joined");
    }

    @Test
    void pendingAndWaitlistPaidJoinsDoNotRecordPaymentOrPostMemberJoinedChatSideEffectsThroughHttp() {
        String eventId = "e2e-pay-side-effects";
        publishPaidEvent(eventId, 2);
        seedEventChat(eventId);

        String acceptedSessionId = postJson("/activities/events/checkout?provider=e2e",
                checkoutPayload(eventId, userId(2), 12d)).path("id").asString();
        postJson("/activities/events/pay?provider=e2e&paymentSessionId=" + acceptedSessionId,
                checkoutPayload(eventId, userId(2), 12d));
        postJson("/activities/events/join", joinPayload(eventId, userId(2), acceptedSessionId));

        ActivityChat afterAccepted = eventChat(eventId);
        assertThat(afterAccepted.getMessages()).hasSize(1);
        assertThat(afterAccepted.getMessages().get(0).getClientId()).isEqualTo("member-joined");
        assertThat(onlyPayment(eventId, userId(2)).getBookingStatus()).isEqualTo("joined");

        String waitlistSessionId = postJson("/activities/events/checkout?provider=e2e",
                checkoutPayload(eventId, userId(3), 12d)).path("id").asString();
        postJson("/activities/events/pay?provider=e2e&paymentSessionId=" + waitlistSessionId,
                checkoutPayload(eventId, userId(3), 12d));
        postJson("/activities/events/join", joinPayload(eventId, userId(3), waitlistSessionId));

        ActivityMember waitlistMember = nonHostMembers(members(eventId, "pending")).get(0);
        assertThat(waitlistMember.getUserId()).isEqualTo(userId(3));
        assertThat(waitlistMember.getRequestKind()).isEqualTo("waitlist");
        assertThat(onlyPayment(eventId, userId(3)).getBookingStatus()).isEqualTo("initiated");
        assertThat(eventChat(eventId).getMessages()).hasSize(1);

        String approvalEventId = "e2e-pay-approval-side-effects";
        publishPaidEvent(approvalEventId, 4);
        seedEventChat(approvalEventId);
        String approvalSessionId = postJson("/activities/events/checkout?provider=e2e",
                checkoutPayload(approvalEventId, userId(4), 12d)).path("id").asString();
        postJson("/activities/events/pay?provider=e2e&paymentSessionId=" + approvalSessionId,
                checkoutPayload(approvalEventId, userId(4), 12d));
        Map<String, Object> approvalJoinPayload = joinPayload(approvalEventId, userId(4), approvalSessionId);
        approvalJoinPayload.put("pendingReason", "approval");
        postJson("/activities/events/join", approvalJoinPayload);

        ActivityMember approvalMember = members(approvalEventId, "pending").stream()
                .filter(member -> userId(4).equals(member.getUserId()))
                .findFirst()
                .orElseThrow();
        assertThat(approvalMember.getRequestKind()).isEqualTo("approval");
        assertThat(onlyPayment(approvalEventId, userId(4)).getBookingStatus()).isEqualTo("initiated");
        assertThat(eventChat(approvalEventId).getMessages()).isEmpty();
    }

    @Test
    void duplicateCheckoutCreatesIndependentPendingSessionsForSameUserSourceAmountAndCurrencyThroughHttp() {
        String eventId = "e2e-pay-duplicate-checkout";
        publishPaidEvent(eventId, 3);

        JsonNode firstCheckout = postJson("/activities/events/checkout?provider=e2e",
                checkoutPayload(eventId, userId(5), 12d));
        JsonNode secondCheckout = postJson("/activities/events/checkout?provider=e2e",
                checkoutPayload(eventId, userId(5), 12d));

        assertThat(secondCheckout.path("id").asString()).isNotEqualTo(firstCheckout.path("id").asString());
        assertThat(paymentsForEvent(eventId)).hasSize(2)
                .allSatisfy(payment -> {
                    assertThat(payment.getUserId()).isEqualTo(userId(5));
                    assertThat(payment.getBookingStatus()).isEqualTo("initiated");
                    assertThat(payment.getAmount()).isEqualTo(12d);
                    assertThat(payment.getCurrency()).isEqualTo("EUR");
                });
    }

    @Test
    void failedProviderPayLeavesCheckoutUnapprovedAndWithoutMembershipSideEffectsThroughHttp() {
        String eventId = "e2e-pay-provider-failure";
        publishPaidEvent(eventId, 3);
        seedEventChat(eventId);

        JsonNode checkout = postJson("/activities/events/checkout?provider=e2e",
                checkoutPayload(eventId, userId(6), 12d));
        String paymentSessionId = checkout.path("id").asString();
        HttpResponse<String> failedPay = postRaw("/activities/events/pay?provider=e2e-fail&paymentSessionId=" + paymentSessionId,
                checkoutPayload(eventId, userId(6), 12d));

        assertThat(failedPay.statusCode()).isEqualTo(502);
        Payment payment = onlyPayment(eventId, userId(6));
        assertThat(payment.getBookingStatus()).isEqualTo("initiated");
        assertThat(payment.getJoinedAtIso()).isNull();
        assertThat(members(eventId).stream().map(ActivityMember::getUserId).toList()).doesNotContain(userId(6));
        assertThat(eventChat(eventId).getMessages()).isEmpty();
    }

    @Test
    void concurrentPaidJoinsRespectCapacityWaitlistTicketsAndPaymentStateThroughHttp() throws Exception {
        publishPaidEvent(CONCURRENCY_EVENT_ID, CONCURRENCY_CAPACITY);
        Map<String, String> sessionIdsByUserId = new LinkedHashMap<>();
        for (int index = 2; index <= 50; index++) {
            String userId = userId(index);
            JsonNode checkout = postJson("/activities/events/checkout?provider=e2e",
                    checkoutPayload(CONCURRENCY_EVENT_ID, userId, 12d));
            String sessionId = checkout.path("id").asString();
            postJson("/activities/events/pay?provider=e2e&paymentSessionId=" + sessionId,
                    checkoutPayload(CONCURRENCY_EVENT_ID, userId, 12d));
            sessionIdsByUserId.put(userId, sessionId);
        }

        ExecutorService executor = Executors.newFixedThreadPool(16);
        CountDownLatch start = new CountDownLatch(1);
        List<Future<Integer>> futures = new ArrayList<>();
        for (Map.Entry<String, String> entry : sessionIdsByUserId.entrySet()) {
            futures.add(executor.submit(() -> {
                start.await();
                return postRaw("/activities/events/join", joinPayload(CONCURRENCY_EVENT_ID, entry.getKey(), entry.getValue())).statusCode();
            }));
        }
        start.countDown();
        for (Future<Integer> future : futures) {
            assertThat(future.get()).isBetween(200, 299);
        }
        executor.shutdownNow();

        await().atMost(Duration.ofSeconds(5)).pollInterval(Duration.ofMillis(100)).untilAsserted(() ->
                assertThat(members(CONCURRENCY_EVENT_ID)).hasSize(50));

        List<ActivityMember> accepted = nonHostMembers(members(CONCURRENCY_EVENT_ID, "accepted"));
        List<ActivityMember> waitlisted = members(CONCURRENCY_EVENT_ID, "pending").stream()
                .filter(member -> "waitlist".equals(member.getRequestKind()))
                .toList();
        int participantCapacity = CONCURRENCY_CAPACITY - 1;
        assertThat(accepted).hasSize(participantCapacity);
        assertThat(waitlisted).hasSize(49 - participantCapacity);

        List<String> acceptedUserIds = accepted.stream().map(ActivityMember::getUserId).toList();
        List<String> waitlistedUserIds = waitlisted.stream().map(ActivityMember::getUserId).toList();
        assertThat(acceptedUserIds).doesNotContainAnyElementsOf(waitlistedUserIds);
        assertThat(getJson("/assets/tickets?userId=" + acceptedUserIds.get(0)).path("total").asInt()).isEqualTo(1);
        assertThat(getJson("/assets/tickets?userId=" + waitlistedUserIds.get(0)).path("total").asInt()).isZero();

        List<Payment> joinedPayments = paymentsForEvent(CONCURRENCY_EVENT_ID).stream()
                .filter(payment -> "joined".equals(payment.getBookingStatus()))
                .toList();
        List<Payment> stillPendingPayments = paymentsForEvent(CONCURRENCY_EVENT_ID).stream()
                .filter(payment -> "initiated".equals(payment.getBookingStatus()))
                .toList();
        assertThat(joinedPayments).hasSize(participantCapacity);
        assertThat(stillPendingPayments).hasSize(49 - participantCapacity);
        assertThat(joinedPayments.stream().map(Payment::getUserId).toList())
                .containsExactlyInAnyOrderElementsOf(acceptedUserIds);
        assertThat(stillPendingPayments.stream().map(Payment::getUserId).toList())
                .containsExactlyInAnyOrderElementsOf(waitlistedUserIds);
    }

    private void clearE2eCollections() {
        mongoTemplate.remove(new Query(), Users.class);
        mongoTemplate.remove(new Query(), ActivityEvent.class);
        mongoTemplate.remove(new Query(), ActivityMember.class);
        mongoTemplate.remove(new Query(), Payment.class);
        mongoTemplate.remove(new Query(), ActivityChat.class);
    }

    private void seedUsers() {
        List<Users> users = new ArrayList<>();
        for (int index = 1; index <= 50; index++) {
            users.add(user(index));
        }
        mongoTemplate.insert(users, Users.class);
    }

    private Users user(int index) {
        String userId = userId(index);
        Users user = new Users();
        user.setMongoId(userId);
        user.setSyncKey("sync-" + userId + "-" + UUID.randomUUID());
        user.setId(userId);
        user.setEmail(userId + "@example.test");
        user.setName("Payment User " + String.format("%02d", index));
        user.setInitials("PU");
        user.setAge(25 + (index % 11));
        user.setCity("Budapest");
        user.setGender(index % 2 == 0 ? "man" : "woman");
        user.setStatus("A");
        user.setProfileStatus("public");
        user.setCompletion(100);
        user.setPartitionKey("country:hu");
        user.setLocationCoordinates(new Users.LocationCoordinatesRecord(47.4979d, 19.0402d));
        user.setActivities(new Users.UserActivitiesRecord(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0));
        return user;
    }

    private void publishPaidEvent(String eventId, int capacityTotal) {
        postJson("/activities/events/sync", eventPayload(eventId, capacityTotal));
        postJson("/activities/events/publish", Map.of(
                "userId", HOST_ID,
                "type", "hosting",
                "sourceId", eventId));
    }

    private Map<String, Object> eventPayload(String eventId, int capacityTotal) {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("id", eventId);
        payload.put("target", "hosting");
        payload.put("title", "Payment concurrency " + eventId);
        payload.put("shortDescription", "Backend e2e paid capacity event");
        payload.put("timeframe", "Paid event");
        payload.put("activity", 3);
        payload.put("startAt", BASE_TIME.plus(Duration.ofDays(7)).toString());
        payload.put("endAt", BASE_TIME.plus(Duration.ofDays(7)).plus(Duration.ofHours(2)).toString());
        payload.put("imageUrl", "https://example.test/payments/event.png");
        payload.put("capacityMin", 1);
        payload.put("capacityMax", capacityTotal);
        payload.put("capacityTotal", capacityTotal);
        payload.put("ticketing", true);
        payload.put("pricing", Map.of(
                "mode", "paid",
                "basePrice", 12d,
                "currency", "EUR",
                "taxMode", "included",
                "chargeType", "per_person",
                "cancellationPolicy", Map.of("enabled", false, "rules", List.of())));
        payload.put("frequency", "One-time");
        payload.put("visibility", "Public");
        payload.put("blindMode", "Visible");
        payload.put("published", false);
        payload.put("creatorUserId", HOST_ID);
        payload.put("creatorName", "Payment User 01");
        payload.put("creatorInitials", "PU");
        payload.put("creatorGender", "woman");
        payload.put("creatorCity", "Budapest");
        payload.put("location", "Payment Arena");
        payload.put("locationCoordinates", new LocationCoordinatesDto(47.4979d, 19.0402d));
        payload.put("topics", List.of("payments"));
        return payload;
    }

    private Map<String, Object> checkoutPayload(String eventId, String userId, double amount) {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("userId", userId);
        payload.put("sourceId", eventId);
        payload.put("acceptedPolicyIds", List.of("pay-policy"));
        payload.put("lineItems", List.of(Map.of(
                "id", "ticket",
                "kind", "event-ticket",
                "label", "Ticket",
                "detail", "One seat",
                "amount", amount,
                "currency", "EUR")));
        payload.put("totalAmount", amount);
        payload.put("currency", "EUR");
        return payload;
    }

    private Map<String, Object> joinPayload(String eventId, String userId, String paymentSessionId) {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("userId", userId);
        payload.put("type", "events");
        payload.put("sourceId", eventId);
        payload.put("acceptedPolicyIds", List.of("pay-policy"));
        payload.put("paymentSessionId", paymentSessionId);
        payload.put("bookingConfirmed", true);
        return payload;
    }

    private void seedEventChat(String eventId) {
        withReal(() -> {
            ActivityChat chat = new ActivityChat();
            chat.setMongoId(eventId + ":" + HOST_ID);
            chat.setChatId(eventId);
            chat.setOwnerUserId(HOST_ID);
            chat.setTitle("Payment side effects chat");
            chat.setAvatar("/assets/logo/heart.webp");
            chat.setMemberIds(List.of(HOST_ID));
            chat.setUnread(0);
            chat.setDateIso(BASE_TIME.toString());
            chat.setChannelType("event");
            chat.setEventId(eventId);
            chat.setMessages(new ArrayList<>());
            mongoTemplate.save(chat);
        });
    }

    private ActivityChat eventChat(String eventId) {
        ActivityChat chat = fromReal(() -> mongoTemplate.findOne(
                Query.query(Criteria.where("chatId").is(eventId).and("ownerUserId").is(HOST_ID)),
                ActivityChat.class));
        assertThat(chat).isNotNull();
        return chat;
    }

    private List<ActivityMember> members(String eventId) {
        return fromReal(() -> mongoTemplate.find(
                Query.query(Criteria.where("ownerType").is("event").and("ownerId").is(eventId)),
                ActivityMember.class));
    }

    private List<ActivityMember> members(String eventId, String status) {
        return members(eventId).stream()
                .filter(member -> status.equals(member.getStatus()))
                .toList();
    }

    private List<ActivityMember> nonHostMembers(List<ActivityMember> members) {
        return members.stream()
                .filter(member -> !HOST_ID.equals(member.getUserId()))
                .toList();
    }

    private Payment onlyPayment(String eventId, String userId) {
        List<Payment> payments = paymentsForEvent(eventId).stream()
                .filter(payment -> userId.equals(payment.getUserId()))
                .toList();
        assertThat(payments).hasSize(1);
        return payments.get(0);
    }

    private List<Payment> paymentsForEvent(String eventId) {
        return fromReal(() -> mongoTemplate.find(
                Query.query(Criteria.where("sourceId").is(eventId)),
                Payment.class));
    }

    private List<Payment> paymentsForUser(String userId) {
        return fromReal(() -> mongoTemplate.find(
                Query.query(Criteria.where("userId").is(userId)),
                Payment.class));
    }

    private JsonNode getJson(String path) {
        HttpResponse<String> response = sendString(HttpRequest.newBuilder(uri(path))
                .header("Accept", "application/json")
                .GET()
                .build());
        assertOk(path, response.statusCode(), response.body());
        return parse(response.body());
    }

    private JsonNode postJson(String path, Object body) {
        HttpResponse<String> response = postRaw(path, body);
        assertOk(path, response.statusCode(), response.body());
        return parse(response.body());
    }

    private HttpResponse<String> postRaw(String path, Object body) {
        return sendString(HttpRequest.newBuilder(uri(path))
                .header("Accept", "application/json")
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(writeJson(body)))
                .build());
    }

    private URI uri(String path) {
        return URI.create("http://localhost:" + port + path);
    }

    private HttpResponse<String> sendString(HttpRequest request) {
        try {
            return httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        } catch (Exception exception) {
            throw new AssertionError("HTTP request failed: " + request.uri(), exception);
        }
    }

    private void assertOk(String path, int status, String body) {
        assertThat(status >= 200 && status < 300)
                .as(path + " returned " + status + " body=" + body)
                .isTrue();
    }

    private JsonNode parse(String json) {
        try {
            return objectMapper.readTree(json);
        } catch (Exception exception) {
            throw new AssertionError("Invalid JSON: " + json, exception);
        }
    }

    private String writeJson(Object body) {
        try {
            return objectMapper.writeValueAsString(body);
        } catch (Exception exception) {
            throw new AssertionError("Unable to write JSON", exception);
        }
    }

    private void withReal(Runnable action) {
        MongoSessionMode previousMode = MongoSessionModeContext.currentMode();
        try {
            MongoSessionModeContext.set(MongoSessionMode.REAL);
            action.run();
        } finally {
            MongoSessionModeContext.set(previousMode);
        }
    }

    private <T> T fromReal(Supplier<T> supplier) {
        MongoSessionMode previousMode = MongoSessionModeContext.currentMode();
        try {
            MongoSessionModeContext.set(MongoSessionMode.REAL);
            return supplier.get();
        } finally {
            MongoSessionModeContext.set(previousMode);
        }
    }

    private static String userId(int index) {
        return "e2e-pay-u" + String.format("%02d", index);
    }

    private static void ensureEmbeddedMongo() {
        if (embeddedMongo != null) {
            return;
        }
        embeddedMongo = Mongod.instance().start(Version.Main.V6_0);
        ServerAddress serverAddress = embeddedMongo.current().getServerAddress();
        mongoBaseUri = "mongodb://" + serverAddress.getHost() + ":" + serverAddress.getPort();
        seedCountryPartition(REAL_DB);
        seedCountryPartition(DEMO_DB);
    }

    private static void seedCountryPartition(String databaseName) {
        try (MongoClient client = MongoClients.create(mongoBaseUri)) {
            Document geometry = new Document("type", "MultiPolygon")
                    .append("coordinates", List.of(List.of(List.of(
                            List.of(16.0d, 45.0d),
                            List.of(23.0d, 45.0d),
                            List.of(23.0d, 49.0d),
                            List.of(16.0d, 49.0d),
                            List.of(16.0d, 45.0d)))));
            Document document = new Document("_id", "country-hu-e2e-payment")
                    .append("partitionKey", "country:hu")
                    .append("countryCode", "HU")
                    .append("countryName", "Hungary")
                    .append("displayName", "Hungary")
                    .append("source", "e2e")
                    .append("specificity", 100)
                    .append("importedAtIso", BASE_TIME.toString())
                    .append("geometry", geometry);
            client.getDatabase(databaseName)
                    .getCollection("countryPartitions")
                    .replaceOne(
                            Filters.eq("partitionKey", "country:hu"),
                            document,
                            new ReplaceOptions().upsert(true));
        }
    }

    @TestConfiguration(proxyBeanMethods = false)
    static class E2eInfrastructure {
        @Bean
        @Primary
        StringRedisTemplate stringRedisTemplate() {
            return mock(StringRedisTemplate.class, RETURNS_DEEP_STUBS);
        }

        @Bean
        PaymentProcessor e2ePaymentProcessor() {
            return new PaymentProcessor() {
                @Override
                public String getType() {
                    return "e2e";
                }

                @Override
                public EventCheckoutSessionDto checkout(EventCheckoutRequestDto request) {
                    return new EventCheckoutSessionDto(
                            "e2e_checkout_" + UUID.randomUUID(),
                            "e2e",
                            "e2e",
                            "created",
                            request == null ? 0D : request.totalAmount(),
                            request == null ? "EUR" : request.currency(),
                            "/e2e/payment");
                }

                @Override
                public EventCheckoutSessionDto pay(EventCheckoutRequestDto request, String paymentSessionId) {
                    return new EventCheckoutSessionDto(
                            paymentSessionId,
                            "e2e",
                            "e2e",
                            "approved",
                            request == null ? 0D : request.totalAmount(),
                            request == null ? "EUR" : request.currency(),
                            null);
                }
            };
        }

        @Bean
        PaymentProcessor failingPaymentProcessor() {
            return new PaymentProcessor() {
                @Override
                public String getType() {
                    return "e2e-fail";
                }

                @Override
                public EventCheckoutSessionDto checkout(EventCheckoutRequestDto request) {
                    throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "E2E provider unavailable.");
                }

                @Override
                public EventCheckoutSessionDto pay(EventCheckoutRequestDto request, String paymentSessionId) {
                    throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "E2E provider unavailable.");
                }
            };
        }
    }
}
