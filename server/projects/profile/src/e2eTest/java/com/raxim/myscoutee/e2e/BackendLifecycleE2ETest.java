package com.raxim.myscoutee.e2e;

import static org.assertj.core.api.Assertions.assertThat;
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
import java.util.function.Supplier;

import org.bson.Document;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.ReplaceOptions;
import com.raxim.myscoutee.Main;
import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.domain.assets.api.AssetCatalog;
import com.raxim.myscoutee.domain.chat.document.Chat;
import com.raxim.myscoutee.domain.events.document.ActivityEvent;
import com.raxim.myscoutee.domain.events.document.ActivityMember;
import com.raxim.myscoutee.domain.events.document.ActivitySubEventResource;
import com.raxim.myscoutee.domain.affinity.document.AffinityRecomputeTask;
import com.raxim.myscoutee.domain.assets.document.Asset;
import com.raxim.myscoutee.domain.notifications.document.NotificationOutboxItem;
import com.raxim.myscoutee.domain.payments.document.Payment;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.common.dto.SharedDtos.LocationCoordinatesDto;

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
        classes = {Main.class, BackendLifecycleE2ETest.E2eInfrastructure.class},
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
        properties = {
                "config.firebase-enabled=false",
                "config.member-user=e2e-life-u01@example.test",
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
class BackendLifecycleE2ETest {
    private static final String DB_SUFFIX = UUID.randomUUID().toString().replace("-", "");
    private static final String REAL_DB = "ms_lifecycle_real_" + DB_SUFFIX;
    private static final String DEMO_DB = "ms_lifecycle_demo_" + DB_SUFFIX;
    private static final String HOST_ID = userId(1);
    private static final String PAID_MEMBER_ID = userId(2);
    private static final String WAITLIST_MEMBER_ID = userId(3);
    private static final String RESOURCE_OWNER_ID = userId(4);
    private static final String ASSET_OWNER_ID = userId(5);
    private static final String ASSET_MANAGER_ID = userId(6);
    private static final String OUTSIDER_ID = userId(50);
    private static final String EVENT_ID = "e2e-life-paid-camp";
    private static final String SUB_EVENT_ID = "e2e-life-sub-cars";
    private static final String RESOURCE_ASSET_ID = "e2e-life-resource-transport";
    private static final String MANAGED_ASSET_ID = "e2e-life-managed-transport";
    private static final Instant BASE_TIME = Instant.now().plus(Duration.ofDays(30));

    private static TransitionWalker.ReachedState<RunningMongodProcess> embeddedMongo;
    private static String mongoBaseUri;

    @LocalServerPort
    private int port;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
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
    void seedLifecycleBackend() {
        withReal(() -> {
            clearE2eCollections();
            seedUsers();
        });
    }

    @Test
    void eventLifecycleCheckoutTicketsWaitlistMembersAndResourcesWorkThroughHttp() {
        JsonNode draft = postJson("/activities/events/sync", eventSyncPayload(false));
        assertThat(draft.path("id").asString()).isEqualTo(EVENT_ID);
        assertThat(draft.path("status").asString()).isEqualTo("DR");
        assertThat(ids(postJson("/activities/events/explore", Map.of("userId", OUTSIDER_ID)), "id"))
                .doesNotContain(EVENT_ID);

        postOk("/activities/events/publish", Map.of(
                "userId", HOST_ID,
                "sourceId", EVENT_ID));
        assertThat(ids(postJson("/activities/events/explore", Map.of("userId", OUTSIDER_ID)), "id"))
                .contains(EVENT_ID);

        ActivityEvent ownerEvent = findEvent(HOST_ID, EVENT_ID);
        assertThat(ownerEvent.getStatus()).isEqualTo("A");
        assertThat(ownerEvent.getPublished()).isTrue();

        JsonNode checkout = postJson("/activities/events/checkout", checkoutPayload(PAID_MEMBER_ID));
        String paymentSessionId = checkout.path("id").asString();
        assertThat(paymentSessionId).isNotBlank();
        assertThat(checkout.path("status").asString()).isEqualTo("approved");
        assertThat(checkout.path("amount").asDouble()).isEqualTo(42.5d);

        JsonNode paid = postJson("/activities/events/pay?paymentSessionId=" + paymentSessionId, checkoutPayload(PAID_MEMBER_ID));
        assertThat(paid.path("id").asString()).isEqualTo(paymentSessionId);
        assertThat(paid.path("status").asString()).isEqualTo("approved");

        JsonNode joined = postJson("/activities/events/join", joinPayload(PAID_MEMBER_ID, paymentSessionId, true, null));
        assertThat(joined.path("sourceId").asString()).isEqualTo(EVENT_ID);

        ActivityMember paidMember = findMember("event", EVENT_ID, PAID_MEMBER_ID);
        assertThat(paidMember.getStatus()).isEqualTo("accepted");
        assertThat(paidMember.getRequestKind()).isNull();
        assertThat(paidMember.getPendingSource()).isNull();

        Payment joinedPayment = findPayment(paymentSessionId);
        assertThat(joinedPayment.getBookingStatus()).isEqualTo("joined");
        assertThat(joinedPayment.getJoinedAtIso()).isNotBlank();
        assertThat(joinedPayment.getAmount()).isEqualTo(42.5d);
        assertThat(joinedPayment.getCurrency()).isEqualTo("EUR");
        assertThat(joinedPayment.getOptionalSubEventIds()).containsExactly(SUB_EVENT_ID);
        assertThat(joinedPayment.getAcceptedPolicyIds()).containsExactly("policy-cancel-1d");

        JsonNode paidTickets = getJson("/assets/tickets?userId=" + PAID_MEMBER_ID);
        assertThat(paidTickets.path("total").asInt()).isEqualTo(1);
        assertThat(ids(paidTickets.path("items"), "id")).containsExactly(EVENT_ID);
        assertThat(ids(getJson("/activities/events/attending?userId=" + PAID_MEMBER_ID), "id"))
                .contains(EVENT_ID);

        postJson("/activities/events/join", joinPayload(WAITLIST_MEMBER_ID, null, true, "waitlist"));
        ActivityMember waitlistMember = findMember("event", EVENT_ID, WAITLIST_MEMBER_ID);
        assertThat(waitlistMember.getStatus()).isEqualTo("pending");
        assertThat(waitlistMember.getRequestKind()).isEqualTo("waitlist");
        assertThat(getJson("/assets/tickets?userId=" + WAITLIST_MEMBER_ID).path("total").asInt()).isZero();

        postOk("/assets/upsert", Map.of(
                "userId", RESOURCE_OWNER_ID,
                "asset", resourceAssetCard()));
        HttpResponse<String> nonMemberResourceAssignment = postRaw(
                "/activities/events/subevent-resources/replace",
                resourceAssignmentState());
        assertThat(nonMemberResourceAssignment.statusCode()).isEqualTo(403);
        assertThat(fromReal(() -> mongoTemplate.find(
                Query.query(Criteria.where("ownerId").is(EVENT_ID)
                        .and("subEventId").is(SUB_EVENT_ID)
                        .and("assetOwnerUserId").is(RESOURCE_OWNER_ID)),
                ActivitySubEventResource.class))).isEmpty();

        seedAcceptedEventMember(EVENT_ID, RESOURCE_OWNER_ID);
        JsonNode resources = postJson("/activities/events/subevent-resources/replace", resourceAssignmentState());
        assertThat(ids(resources.path("assetAssignmentIds").path(AssetCatalog.TYPE_TRANSPORT)))
                .containsExactly(RESOURCE_ASSET_ID);
        JsonNode eventMembersAfterResource = getJson("/activities/events/members?ownerType=event&ownerId=" + EVENT_ID);
        assertThat(memberStatus(eventMembersAfterResource, RESOURCE_OWNER_ID)).isEqualTo("accepted");
        assertThat(memberRole(eventMembersAfterResource, RESOURCE_OWNER_ID)).isEqualTo("Member");
        assertThat(findMember("event", EVENT_ID, RESOURCE_OWNER_ID).getRole()).isEqualTo("Member");

        JsonNode afterDisqualify = postJson("/activities/events/members/action", memberAction(PAID_MEMBER_ID, "disqualify"));
        assertThat(memberStatus(afterDisqualify, PAID_MEMBER_ID)).isEqualTo("disqualified");
        assertThat(getJson("/assets/tickets?userId=" + PAID_MEMBER_ID).path("total").asInt()).isZero();

        JsonNode afterReinstate = postJson("/activities/events/members/action", memberAction(PAID_MEMBER_ID, "reinstate"));
        assertThat(memberStatus(afterReinstate, PAID_MEMBER_ID)).isEqualTo("accepted");
        assertThat(getJson("/assets/tickets?userId=" + PAID_MEMBER_ID).path("total").asInt()).isEqualTo(1);

        postOk("/activities/events/trash", Map.of(
                "userId", PAID_MEMBER_ID,
                "sourceId", EVENT_ID));

        ActivityEvent paidOverlay = findEvent(PAID_MEMBER_ID, EVENT_ID);
        assertThat(paidOverlay.getStatus()).isEqualTo("T");
        assertThat(paidOverlay.getIsTrashed()).isTrue();
        assertThat(getJson("/assets/tickets?userId=" + PAID_MEMBER_ID).path("total").asInt()).isZero();

        assertThat(findPayment(paymentSessionId).getRefundStatus()).isEqualTo("none");
        requestAndApproveRefund(paymentSessionId, PAID_MEMBER_ID);
        Payment cancelledPayment = findPayment(paymentSessionId);
        assertThat(cancelledPayment.getBookingStatus()).isEqualTo("joined");
        assertThat(cancelledPayment.getRefundStatus()).isEqualTo("full");
        assertThat(cancelledPayment.getRefundedAmount()).isEqualTo(42.5d);
        assertThat(cancelledPayment.getRefundRuleId()).isEqualTo("refund-full-1d");
    }

    @Test
    void assetLifecyclePromotionsSuppressionRestoreAndTakeoverNotifyAffectedUsers() {
        postOk("/assets/upsert", Map.of(
                "userId", ASSET_OWNER_ID,
                "asset", managedAssetCard()));

        JsonNode ownerAssets = getJson("/assets?userId=" + ASSET_OWNER_ID);
        assertThat(ids(ownerAssets, "id")).contains(MANAGED_ASSET_ID);

        JsonNode promoted = postJson("/assets/make-manager", Map.of(
                "userId", ASSET_OWNER_ID,
                "assetId", MANAGED_ASSET_ID,
                "targetUserId", ASSET_MANAGER_ID));
        assertThat(promoted.path("id").asString()).isEqualTo(MANAGED_ASSET_ID);
        assertThat(promoted.path("ownerUserId").asString()).isEqualTo(ASSET_OWNER_ID);

        ActivityMember manager = findMember("asset", MANAGED_ASSET_ID, ASSET_MANAGER_ID);
        assertThat(manager.getStatus()).isEqualTo("accepted");
        assertThat(manager.getRole()).isEqualTo("Manager");

        NotificationOutboxItem promotedNotification = findOnlyNotification("asset-manager-promoted", MANAGED_ASSET_ID);
        assertThat(promotedNotification.getRecipientUserIds()).containsExactly(ASSET_MANAGER_ID);
        assertThat(promotedNotification.getCreatedUser()).isEqualTo(ASSET_OWNER_ID);

        postOk("/assets/delete", Map.of(
                "userId", ASSET_OWNER_ID,
                "assetId", MANAGED_ASSET_ID));
        Asset trashed = findAsset(MANAGED_ASSET_ID);
        assertThat(trashed.getStatus()).isEqualTo("T");
        assertThat(trashed.getTrashedAtIso()).isNotBlank();
        assertThat(ids(getJson("/assets/explore?userId=" + OUTSIDER_ID + "&type=" + AssetCatalog.TYPE_TRANSPORT), "id"))
                .doesNotContain(MANAGED_ASSET_ID);

        NotificationOutboxItem unavailableNotification = findOnlyNotification("asset-unavailable", MANAGED_ASSET_ID);
        assertThat(unavailableNotification.getRecipientUserIds()).containsExactlyInAnyOrder(ASSET_MANAGER_ID, userId(7));
        assertThat(unavailableNotification.getPayload()).containsEntry("assetStatus", "T");

        JsonNode restored = postJson("/assets/restore", Map.of(
                "userId", ASSET_OWNER_ID,
                "assetId", MANAGED_ASSET_ID));
        assertThat(restored.path("status").asString()).isEqualTo("A");
        assertThat(findAsset(MANAGED_ASSET_ID).getStatus()).isEqualTo("A");

        NotificationOutboxItem restoredNotification = findOnlyNotification("asset-restored", MANAGED_ASSET_ID);
        assertThat(restoredNotification.getRecipientUserIds()).containsExactlyInAnyOrder(ASSET_MANAGER_ID, userId(7));
        assertThat(restoredNotification.getPayload()).containsEntry("assetStatus", "A");

        postJson("/assets/make-manager", Map.of(
                "userId", ASSET_OWNER_ID, "assetId", MANAGED_ASSET_ID, "targetUserId", userId(7)));
        postJson("/assets/leave-ownership", Map.of(
                "userId", ASSET_OWNER_ID,
                "assetId", MANAGED_ASSET_ID));
        assertThat(findAsset(MANAGED_ASSET_ID).getOwnerReleasedAtIso()).isNotBlank();

        JsonNode takenOver = postJson("/assets/take-over", Map.of(
                "userId", ASSET_MANAGER_ID,
                "assetId", MANAGED_ASSET_ID));
        assertThat(takenOver.path("ownerUserId").asString()).isEqualTo(ASSET_MANAGER_ID);
        assertThat(takenOver.path("status").asString()).isEqualTo("A");

        Asset transferred = findAsset(MANAGED_ASSET_ID);
        assertThat(transferred.getOwnerUserId()).isEqualTo(ASSET_MANAGER_ID);
        assertThat(transferred.getStatus()).isEqualTo("A");
        assertThat(transferred.getStatusBeforeSuppression()).isNull();

        NotificationOutboxItem takeOverNotification = findOnlyNotification("asset-takeover", MANAGED_ASSET_ID);
        assertThat(takeOverNotification.getRecipientUserIds()).containsExactly(userId(7));
        assertThat(takeOverNotification.getPayload())
                .containsEntry("previousOwnerUserId", ASSET_OWNER_ID)
                .containsEntry("ownerUserId", ASSET_MANAGER_ID);

        assertThat(fromReal(() -> mongoTemplate.find(
                Query.query(Criteria.where("targetId").is(MANAGED_ASSET_ID)),
                AffinityRecomputeTask.class))).isNotEmpty();
    }

    @Test
    void paymentRefundAndPendingApprovalEdgesWorkThroughHttp() {
        String partialEventId = "e2e-life-payment-partial";
        String noRefundEventId = "e2e-life-payment-none";
        String approvalEventId = "e2e-life-payment-approval";

        publishPaymentEdgeEvent(partialEventId, Instant.now().plus(Duration.ofDays(3)), true);
        String partialSessionId = checkoutPayAndJoinEdgeEvent(partialEventId, userId(7), null);
        postOk("/activities/events/trash", Map.of(
                "userId", userId(7),
                "sourceId", partialEventId));
        assertThat(findPayment(partialSessionId).getRefundStatus()).isEqualTo("none");
        requestAndApproveRefund(partialSessionId, userId(7));
        Payment partialPayment = findPayment(partialSessionId);
        assertThat(partialPayment.getBookingStatus()).isEqualTo("joined");
        assertThat(partialPayment.getRefundStatus()).isEqualTo("partial");
        assertThat(partialPayment.getRefundedAmount()).isEqualTo(40.0d);
        assertThat(partialPayment.getRefundCurrency()).isEqualTo("EUR");
        assertThat(partialPayment.getRefundRuleId()).isEqualTo("edge-partial-1d");
        assertThat(partialPayment.getStatus()).isEqualTo("approved");
        assertThat(getJson("/assets/tickets?userId=" + userId(7)).path("total").asInt()).isZero();

        publishPaymentEdgeEvent(noRefundEventId, Instant.now().plus(Duration.ofHours(10)), true);
        String noRefundSessionId = checkoutPayAndJoinEdgeEvent(noRefundEventId, userId(8), null);
        postOk("/activities/events/trash", Map.of(
                "userId", userId(8),
                "sourceId", noRefundEventId));
        HttpResponse<String> ineligibleRefund = postRaw("/payment-methods/history/"
                + findPayment(noRefundSessionId).getId() + "/refund-request?userId=" + userId(8), Map.of());
        assertThat(ineligibleRefund.statusCode()).as(ineligibleRefund.body()).isEqualTo(409);
        Payment noRefundPayment = findPayment(noRefundSessionId);
        assertThat(noRefundPayment.getBookingStatus()).isEqualTo("joined");
        assertThat(noRefundPayment.getRefundStatus()).isEqualTo("none");
        assertThat(noRefundPayment.getRefundedAmount()).isNull();
        assertThat(noRefundPayment.getRefundedAtIso()).isNull();
        assertThat(noRefundPayment.getStatus()).isEqualTo("approved");

        publishPaymentEdgeEvent(approvalEventId, Instant.now().plus(Duration.ofDays(3)), false);
        String approvalSessionId = checkoutPayAndJoinEdgeEvent(approvalEventId, userId(9), "approval");
        ActivityMember approvalMember = findMember("event", approvalEventId, userId(9));
        assertThat(approvalMember.getStatus()).isEqualTo("pending");
        assertThat(approvalMember.getRequestKind()).isEqualTo("approval");
        Payment approvalPayment = findPayment(approvalSessionId);
        assertThat(approvalPayment.getBookingStatus()).isEqualTo("initiated");
        assertThat(approvalPayment.getJoinedAtIso()).isNull();
        assertThat(getJson("/assets/tickets?userId=" + userId(9)).path("total").asInt()).isZero();
    }

    @Test
    void eventExplorePaginationFiltersVisibilityAndOpenSpotContractsWorkThroughHttp() {
        String publicFirst = "e2e-life-explore-public-1";
        String publicSecond = "e2e-life-explore-public-2";
        String fullEvent = "e2e-life-explore-full";
        String invitationOnlyEvent = "e2e-life-explore-invitation-only";
        String unpublishedEvent = "e2e-life-explore-unpublished";

        publishExploreEvent(publicFirst, BASE_TIME.plus(Duration.ofDays(2)), 5, "Public", true);
        publishExploreEvent(publicSecond, BASE_TIME.plus(Duration.ofDays(3)), 5, "Public", true);
        publishExploreEvent(fullEvent, BASE_TIME.plus(Duration.ofDays(4)), 1, "Public", true);
        publishExploreEvent(invitationOnlyEvent, BASE_TIME.plus(Duration.ofDays(5)), 5, "Invitation only", true);
        publishExploreEvent(unpublishedEvent, BASE_TIME.plus(Duration.ofDays(6)), 5, "Public", false);

        JsonNode firstPage = postJson("/activities/events/explore", Map.of(
                "userId", OUTSIDER_ID,
                "order", "upcoming",
                "view", "day",
                "topic", "payments",
                "limit", 2));
        assertThat(firstPage.path("total").asInt()).isEqualTo(3);
        List<String> firstIds = ids(firstPage.path("records"), "id");
        assertThat(firstIds).hasSize(2);
        assertThat(firstIds).doesNotContain(invitationOnlyEvent, unpublishedEvent);
        assertThat(firstPage.path("nextCursor").asString()).isNotBlank();

        JsonNode secondPage = postJson("/activities/events/explore", Map.of(
                "userId", OUTSIDER_ID,
                "order", "upcoming",
                "view", "day",
                "topic", "payments",
                "limit", 2,
                "cursor", firstPage.path("nextCursor").asString()));
        List<String> secondIds = ids(secondPage.path("records"), "id");
        assertThat(secondIds).hasSize(1);
        assertThat(secondIds).doesNotContainAnyElementsOf(firstIds);
        assertThat(secondPage.path("nextCursor").isNull()).isTrue();

        List<String> allPagedIds = new ArrayList<>();
        allPagedIds.addAll(firstIds);
        allPagedIds.addAll(secondIds);
        assertThat(allPagedIds).containsExactly(publicFirst, publicSecond, fullEvent);

        JsonNode openSpotsOnly = postJson("/activities/events/explore", Map.of(
                "userId", OUTSIDER_ID,
                "order", "upcoming",
                "view", "day",
                "topic", "payments",
                "openSpotsOnly", true,
                "limit", 10));
        assertThat(ids(openSpotsOnly.path("records"), "id"))
                .contains(publicFirst, publicSecond)
                .doesNotContain(fullEvent, invitationOnlyEvent, unpublishedEvent);

        JsonNode excluded = postJson("/activities/events/explore", Map.of(
                "userId", OUTSIDER_ID,
                "order", "upcoming",
                "view", "day",
                "topic", "payments",
                "excludedSourceIds", List.of(publicFirst),
                "limit", 10));
        assertThat(ids(excluded.path("records"), "id")).doesNotContain(publicFirst);
    }

    @Test
    void eventExploreFriendsOnlyUsesBackendFriendGateThroughHttp() {
        String friendUserId = userId(2);
        String nonFriendUserId = userId(3);
        withReal(() -> mongoTemplate.save(new com.raxim.myscoutee.domain.accounts.document.UserFriendship(
                HOST_ID.length() + ":" + HOST_ID + friendUserId, HOST_ID, friendUserId,
                Instant.now(), "e2e-prior-event", Instant.now(), "e2e-prior-event", "Previous meeting")));
        String publicEvent = "e2e-life-friend-public";
        String friendsOnlyEvent = "e2e-life-friend-only";

        publishExploreEvent(publicEvent, BASE_TIME.plus(Duration.ofDays(7)), 5, "Public", true);
        publishExploreEvent(friendsOnlyEvent, BASE_TIME.plus(Duration.ofDays(8)), 5, "Friends only", true);

        JsonNode friendExplore = postJson("/activities/events/explore", Map.of(
                "userId", friendUserId,
                "topic", "explore",
                "order", "upcoming",
                "limit", 10));
        assertThat(ids(friendExplore.path("records"), "id")).contains(publicEvent, friendsOnlyEvent);

        JsonNode nonFriendExplore = postJson("/activities/events/explore", Map.of(
                "userId", nonFriendUserId,
                "topic", "explore",
                "order", "upcoming",
                "limit", 10));
        assertThat(ids(nonFriendExplore.path("records"), "id"))
                .contains(publicEvent)
                .doesNotContain(friendsOnlyEvent);

        JsonNode friendOnlyFilter = postJson("/activities/events/explore", Map.of(
                "userId", friendUserId,
                "topic", "explore",
                "friendsOnly", true,
                "limit", 10));
        assertThat(ids(friendOnlyFilter.path("records"), "id")).contains(publicEvent, friendsOnlyEvent);
    }

    @Test
    void eventTrashRestoreKeepsExploreTrashAndHostingListsConsistentThroughHttp() {
        postOk("/activities/events/sync", eventSyncPayload(false));
        postOk("/activities/events/publish", Map.of(
                "userId", HOST_ID,
                "sourceId", EVENT_ID));

        assertThat(ids(postJson("/activities/events/explore", Map.of("userId", OUTSIDER_ID)), "id"))
                .contains(EVENT_ID);

        postOk("/activities/events/trash", Map.of(
                "userId", HOST_ID,
                "sourceId", EVENT_ID));
        assertThat(findEvent(HOST_ID, EVENT_ID).getStatus()).isEqualTo("T");
        assertThat(ids(getJson("/activities/events/trash?userId=" + HOST_ID), "id")).contains(EVENT_ID);
        assertThat(ids(postJson("/activities/events/explore", Map.of("userId", OUTSIDER_ID)), "id"))
                .doesNotContain(EVENT_ID);

        postOk("/activities/events/restore", Map.of(
                "userId", HOST_ID,
                "sourceId", EVENT_ID));
        assertThat(findEvent(HOST_ID, EVENT_ID).getStatus()).isEqualTo("A");
        assertThat(ids(getJson("/activities/events/hosting?userId=" + HOST_ID), "id")).contains(EVENT_ID);
        assertThat(ids(postJson("/activities/events/explore", Map.of("userId", OUTSIDER_ID)), "id"))
                .contains(EVENT_ID);
    }

    @Test
    void assetExploreFiltersVisibilityTypeAndTrashRestoreThroughHttp() {
        String publicTransport = "e2e-life-public-transport";
        String publicTent = "e2e-life-public-tent";
        String invitationTransport = "e2e-life-invite-transport";

        postOk("/assets/upsert", Map.of("userId", ASSET_OWNER_ID, "asset", assetCard(publicTransport, AssetCatalog.TYPE_TRANSPORT, "Public")));
        postOk("/assets/upsert", Map.of("userId", ASSET_OWNER_ID, "asset", assetCard(publicTent, AssetCatalog.TYPE_SUPPLIES, "Public")));
        postOk("/assets/upsert", Map.of("userId", ASSET_OWNER_ID, "asset", assetCard(invitationTransport, AssetCatalog.TYPE_TRANSPORT, "Invitation only")));

        assertThat(ids(getJson("/assets/explore?userId=" + OUTSIDER_ID + "&type=" + AssetCatalog.TYPE_TRANSPORT), "id"))
                .contains(publicTransport)
                .doesNotContain(publicTent, invitationTransport);

        postOk("/assets/delete", Map.of("userId", ASSET_OWNER_ID, "assetId", publicTransport));
        assertThat(ids(getJson("/assets/explore?userId=" + OUTSIDER_ID + "&type=" + AssetCatalog.TYPE_TRANSPORT), "id"))
                .doesNotContain(publicTransport, invitationTransport);

        postOk("/assets/restore", Map.of("userId", ASSET_OWNER_ID, "assetId", publicTransport));
        assertThat(ids(getJson("/assets/explore?userId=" + OUTSIDER_ID + "&type=" + AssetCatalog.TYPE_TRANSPORT), "id"))
                .contains(publicTransport)
                .doesNotContain(invitationTransport);
    }

    @Test
    void unauthorizedMemberActionsLeaveAcceptedMemberAndTicketUntouchedThroughHttp() {
        postOk("/activities/events/sync", eventSyncPayload(false));
        postOk("/activities/events/publish", Map.of(
                "userId", HOST_ID,
                "sourceId", EVENT_ID));
        JsonNode checkout = postJson("/activities/events/checkout", checkoutPayload(PAID_MEMBER_ID));
        String paymentSessionId = checkout.path("id").asString();
        postJson("/activities/events/pay?paymentSessionId=" + paymentSessionId, checkoutPayload(PAID_MEMBER_ID));
        postJson("/activities/events/join", joinPayload(PAID_MEMBER_ID, paymentSessionId, true, null));

        HttpResponse<String> outsiderAction = postRaw("/activities/events/members/action",
                memberActionByActor(OUTSIDER_ID, PAID_MEMBER_ID, "disqualify"));
        assertThat(outsiderAction.statusCode()).as(outsiderAction.body()).isEqualTo(403);
        assertThat(findMember("event", EVENT_ID, PAID_MEMBER_ID).getStatus()).isEqualTo("accepted");
        assertThat(getJson("/assets/tickets?userId=" + PAID_MEMBER_ID).path("total").asInt()).isEqualTo(1);
    }

    @Test
    void eventJoinIsIdempotentForAcceptedMembersThroughHttp() {
        postOk("/activities/events/sync", eventSyncPayload(false));
        postOk("/activities/events/publish", Map.of(
                "userId", HOST_ID,
                "sourceId", EVENT_ID));
        JsonNode checkout = postJson("/activities/events/checkout", checkoutPayload(PAID_MEMBER_ID));
        String paymentSessionId = checkout.path("id").asString();
        postJson("/activities/events/pay?paymentSessionId=" + paymentSessionId, checkoutPayload(PAID_MEMBER_ID));

        postJson("/activities/events/join", joinPayload(PAID_MEMBER_ID, paymentSessionId, true, null));
        postJson("/activities/events/join", joinPayload(PAID_MEMBER_ID, paymentSessionId, true, null));

        assertThat(findMembers("event", EVENT_ID).stream()
                .filter(member -> PAID_MEMBER_ID.equals(member.getUserId()))
                .toList()).hasSize(1);
        assertThat(findMember("event", EVENT_ID, PAID_MEMBER_ID).getStatus()).isEqualTo("accepted");
        assertThat(findPayment(paymentSessionId).getBookingStatus()).isEqualTo("joined");
        assertThat(getJson("/assets/tickets?userId=" + PAID_MEMBER_ID).path("total").asInt()).isEqualTo(1);
    }

    private void clearE2eCollections() {
        mongoTemplate.remove(new Query(), Users.class);
        mongoTemplate.remove(new Query(), com.raxim.myscoutee.domain.accounts.document.UserFriendship.class);
        mongoTemplate.remove(new Query(), ActivityEvent.class);
        mongoTemplate.remove(new Query(), ActivityMember.class);
        mongoTemplate.remove(new Query(), ActivitySubEventResource.class);
        mongoTemplate.remove(new Query(), Chat.class);
        mongoTemplate.remove(new Query(), Asset.class);
        mongoTemplate.remove(new Query(), Payment.class);
        mongoTemplate.remove(new Query(), NotificationOutboxItem.class);
        mongoTemplate.remove(new Query(), AffinityRecomputeTask.class);
    }

    private void seedUsers() {
        List<Users> users = new ArrayList<>();
        for (int index = 1; index <= 50; index += 1) {
            users.add(user(userId(index), "Lifecycle User " + String.format("%02d", index)));
        }
        mongoTemplate.insert(users, Users.class);
    }

    private Users user(String userId, String name) {
        Users user = new Users();
        user.setMongoId(userId);
        user.setSyncKey("e2e-life-user-" + userId + "-" + UUID.randomUUID());
        user.setId(userId);
        user.setEmail(userId + "@example.test");
        user.setName(name);
        user.setInitials("LU");
        user.setAge(29);
        user.setCity("Bratislava");
        user.setGender("woman");
        user.setStatus("A");
        user.setProfileStatus("public");
        user.setCompletion(100);
        user.setLocationCoordinates(new Users.LocationCoordinatesRecord(48.1486d, 17.1077d));
        user.setImages(List.of("https://example.test/avatar/" + userId + ".png"));
        user.setActivities(new Users.UserActivitiesRecord(
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                new Users.UserChatCountersRecord(0, 0, 0, 0, 0, 0),
                new Users.UserEventCountersRecord(0, 0, 0, 0, 0, 0, 0),
                new Users.UserAssetCountersRecord(0, 0, 0, 0),
                new Users.UserEventFeedbackCountersRecord(0, 0, 0, 0),
                0, 0));
        return user;
    }

    private void seedAcceptedEventMember(String eventId, String userId) {
        withReal(() -> {
            String nowIso = Instant.now().toString();
            ActivityMember member = new ActivityMember();
            member.setId(new ObjectId().toHexString());
            member.setSyncKey("e2e-life-member-" + eventId + "-" + userId + "-" + UUID.randomUUID());
            member.setOwnerType("event");
            member.setOwnerId(eventId);
            member.setUserId(userId);
            member.setRole("Member");
            member.setStatus("accepted");
            member.setPendingSource(null);
            member.setRequestKind(null);
            member.setActionAtIso(nowIso);
            member.setMetAtIso(nowIso);
            member.setMetWhere("Lifecycle Arena");
            member.setCreatedDate(nowIso);
            member.setCreatedUser(HOST_ID);
            member.setUpdatedDate(nowIso);
            member.setUpdatedUser(HOST_ID);
            mongoTemplate.save(member);
        });
    }

    private Map<String, Object> eventSyncPayload(boolean published) {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("id", EVENT_ID);
        payload.put("status", published ? "A" : "DR");
        payload.put("title", "Lifecycle Paid Camp");
        payload.put("subtitle", "Backend e2e lifecycle camp");
        payload.put("timeframe", "Mon 15 Jun, 12:00");
        payload.put("activity", 3);
        payload.put("startAtIso", BASE_TIME.toString());
        payload.put("endAtIso", BASE_TIME.plus(Duration.ofHours(3)).toString());
        payload.put("imageUrl", "https://example.test/events/lifecycle.png");
        payload.put("capacityMin", 1);
        payload.put("capacityMax", 2);
        payload.put("capacityTotal", 2);
        payload.put("ticketing", true);
        payload.put("pricing", paidPricing());
        payload.put("frequency", "One-time");
        payload.put("visibility", "Public");
        payload.put("blindMode", "Visible");
        payload.put("creatorUserId", HOST_ID);
        payload.put("creatorName", "Lifecycle User 01");
        payload.put("creatorInitials", "LU");
        payload.put("creatorGender", "woman");
        payload.put("creatorCity", "Bratislava");
        payload.put("location", "Lifecycle Arena");
        payload.put("locationCoordinates", new LocationCoordinatesDto(48.1486d, 17.1077d));
        payload.put("topics", List.of("football", "transport"));
        payload.put("subEventDefinitions", List.of(subEvent()));
        payload.put("mode", "Casual");
        return payload;
    }

    private Map<String, Object> subEvent() {
        Map<String, Object> item = new LinkedHashMap<>();
        item.put("id", SUB_EVENT_ID);
        item.put("name", "Transport logistics");
        item.put("description", "Coordinate shared transport");
        item.put("startAt", BASE_TIME.plus(Duration.ofMinutes(30)).toString());
        item.put("endAt", BASE_TIME.plus(Duration.ofHours(1)).toString());
        item.put("location", "Lifecycle Arena parking");
        item.put("createdByUserId", HOST_ID);
        item.put("optional", true);
        item.put("capacityMin", 1);
        item.put("capacityMax", 2);
        item.put("carsCapacityMin", 1);
        item.put("carsCapacityMax", 1);
        return item;
    }

    private Map<String, Object> paidPricing() {
        Map<String, Object> pricing = new LinkedHashMap<>();
        pricing.put("mode", "paid");
        pricing.put("basePrice", 42.5d);
        pricing.put("currency", "EUR");
        pricing.put("taxMode", "included");
        pricing.put("chargeType", "per_person");
        pricing.put("cancellationPolicy", Map.of(
                "enabled", true,
                "rules", List.of(Map.of(
                        "id", "refund-full-1d",
                        "offsetUnit", "days",
                        "offsetValue", 1,
                        "refundKind", "full",
                        "refundValue", 100d))));
        return pricing;
    }

    private Map<String, Object> checkoutPayload(String userId) {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("userId", userId);
        payload.put("sourceId", EVENT_ID);
        payload.put("optionalSubEventIds", List.of(SUB_EVENT_ID));
        payload.put("acceptedPolicyIds", List.of("policy-cancel-1d"));
        payload.put("lineItems", List.of(Map.of(
                "id", "ticket-main",
                "kind", "event-ticket",
                "label", "Lifecycle camp ticket",
                "detail", "One paid event seat",
                "amount", 42.5d,
                "currency", "EUR")));
        payload.put("totalAmount", 42.5d);
        payload.put("currency", "EUR");
        return payload;
    }

    private Map<String, Object> joinPayload(String userId, String paymentSessionId, boolean bookingConfirmed, String pendingReason) {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("userId", userId);
        payload.put("sourceId", EVENT_ID);
        payload.put("optionalSubEventIds", List.of(SUB_EVENT_ID));
        payload.put("acceptedPolicyIds", List.of("policy-cancel-1d"));
        payload.put("paymentSessionId", paymentSessionId);
        payload.put("bookingConfirmed", bookingConfirmed);
        payload.put("pendingReason", pendingReason);
        return payload;
    }

    private void publishPaymentEdgeEvent(String eventId, Instant startAt, boolean fullRefundRule) {
        postOk("/activities/events/sync", paymentEdgeEventPayload(eventId, startAt, fullRefundRule));
        postOk("/activities/events/publish", Map.of(
                "userId", HOST_ID,
                "sourceId", eventId));
    }

    private void publishExploreEvent(
            String eventId,
            Instant startAt,
            int capacityTotal,
            String visibility,
            boolean publish) {
        Map<String, Object> payload = paymentEdgeEventPayload(eventId, startAt, false);
        payload.put("capacityMax", capacityTotal);
        payload.put("capacityTotal", capacityTotal);
        payload.put("visibility", visibility);
        payload.put("topics", List.of("payments", "explore"));
        postOk("/activities/events/sync", payload);
        if (publish) {
            postOk("/activities/events/publish", Map.of(
                    "userId", HOST_ID,
                    "sourceId", eventId));
        }
    }

    private String checkoutPayAndJoinEdgeEvent(String eventId, String userId, String pendingReason) {
        JsonNode checkout = postJson("/activities/events/checkout", edgeCheckoutPayload(eventId, userId));
        String paymentSessionId = checkout.path("id").asString();
        assertThat(paymentSessionId).isNotBlank();
        postJson("/activities/events/pay?paymentSessionId=" + paymentSessionId, edgeCheckoutPayload(eventId, userId));
        JsonNode joined = postJson("/activities/events/join", edgeJoinPayload(eventId, userId, paymentSessionId, pendingReason));
        assertThat(joined.path("sourceId").asString()).isEqualTo(eventId);
        return paymentSessionId;
    }

    private Map<String, Object> paymentEdgeEventPayload(String eventId, Instant startAt, boolean fullRefundRule) {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("id", eventId);
        payload.put("status", "DR");
        payload.put("title", "Payment Edge " + eventId);
        payload.put("subtitle", "Backend e2e payment edge event");
        payload.put("timeframe", "Payment edge");
        payload.put("activity", 3);
        payload.put("startAtIso", startAt.toString());
        payload.put("endAtIso", startAt.plus(Duration.ofHours(2)).toString());
        payload.put("imageUrl", "https://example.test/events/payment-edge.png");
        payload.put("capacityMin", 1);
        payload.put("capacityMax", 5);
        payload.put("capacityTotal", 5);
        payload.put("ticketing", true);
        payload.put("pricing", edgePricing(fullRefundRule));
        payload.put("frequency", "One-time");
        payload.put("visibility", "Public");
        payload.put("blindMode", "Visible");
        payload.put("creatorUserId", HOST_ID);
        payload.put("creatorName", "Lifecycle User 01");
        payload.put("creatorInitials", "LU");
        payload.put("creatorGender", "woman");
        payload.put("creatorCity", "Bratislava");
        payload.put("location", "Payment Edge Arena");
        payload.put("locationCoordinates", new LocationCoordinatesDto(48.1486d, 17.1077d));
        payload.put("topics", List.of("payments"));
        return payload;
    }

    private Map<String, Object> edgePricing(boolean fullRefundRule) {
        List<Map<String, Object>> rules = new ArrayList<>();
        if (fullRefundRule) {
            rules.add(Map.of(
                    "id", "edge-full-7d",
                    "offsetUnit", "days",
                    "offsetValue", 7,
                    "refundKind", "full",
                    "refundValue", 100d));
        }
        rules.add(Map.of(
                "id", "edge-partial-1d",
                "offsetUnit", "days",
                "offsetValue", 1,
                "refundKind", "percent",
                "refundValue", 40d));

        Map<String, Object> pricing = new LinkedHashMap<>();
        pricing.put("mode", "paid");
        pricing.put("basePrice", 100d);
        pricing.put("currency", "EUR");
        pricing.put("taxMode", "included");
        pricing.put("chargeType", "per_person");
        pricing.put("cancellationPolicy", Map.of(
                "enabled", true,
                "rules", rules));
        return pricing;
    }

    private Map<String, Object> edgeCheckoutPayload(String eventId, String userId) {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("userId", userId);
        payload.put("sourceId", eventId);
        payload.put("acceptedPolicyIds", List.of("edge-policy"));
        payload.put("lineItems", List.of(Map.of(
                "id", "edge-ticket",
                "kind", "event-ticket",
                "label", "Payment edge ticket",
                "detail", "One edge event seat",
                "amount", 100d,
                "currency", "EUR")));
        payload.put("totalAmount", 100d);
        payload.put("currency", "EUR");
        return payload;
    }

    private Map<String, Object> edgeJoinPayload(String eventId, String userId, String paymentSessionId, String pendingReason) {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("userId", userId);
        payload.put("sourceId", eventId);
        payload.put("acceptedPolicyIds", List.of("edge-policy"));
        payload.put("paymentSessionId", paymentSessionId);
        payload.put("bookingConfirmed", true);
        payload.put("pendingReason", pendingReason);
        return payload;
    }

    private Map<String, Object> memberAction(String targetUserId, String action) {
        return memberActionByActor(HOST_ID, targetUserId, action);
    }

    private Map<String, Object> memberActionByActor(String actorUserId, String targetUserId, String action) {
        return Map.of(
                "owner", Map.of("ownerType", "event", "ownerId", EVENT_ID),
                "actorUserId", actorUserId,
                "targetUserId", targetUserId,
                "action", action);
    }

    private Map<String, Object> resourceAssetCard() {
        Map<String, Object> asset = new LinkedHashMap<>();
        asset.put("id", RESOURCE_ASSET_ID);
        asset.put("type", AssetCatalog.TYPE_TRANSPORT);
        asset.put("title", "Resource Transport");
        asset.put("subtitle", "Four seats");
        asset.put("category", AssetCatalog.CATEGORY_SEDAN);
        asset.put("city", "Bratislava");
        asset.put("capacityTotal", 4);
        asset.put("quantity", 1);
        asset.put("details", "Resource transport for event logistics");
        asset.put("imageUrl", "https://example.test/assets/resource-transport.png");
        asset.put("routes", List.of("Lifecycle Arena"));
        asset.put("visibility", "Public");
        return asset;
    }

    private Map<String, Object> resourceAssignmentState() {
        return Map.of(
                "ownerId", EVENT_ID,
                "subEventId", SUB_EVENT_ID,
                "assetOwnerUserId", RESOURCE_OWNER_ID,
                "assetAssignmentIds", Map.of(AssetCatalog.TYPE_TRANSPORT, List.of(RESOURCE_ASSET_ID)),
                "assetSettingsByType", Map.of(
                        AssetCatalog.TYPE_TRANSPORT, Map.of(
                                RESOURCE_ASSET_ID, Map.of(
                                        "capacityMin", 1,
                                        "capacityMax", 1,
                                        "addedByUserId", RESOURCE_OWNER_ID,
                                        "routes", List.of("Lifecycle Arena")))),
                "supplyContributionEntriesByAssetId", Map.of());
    }

    private Map<String, Object> managedAssetCard() {
        Map<String, Object> asset = new LinkedHashMap<>();
        asset.put("id", MANAGED_ASSET_ID);
        asset.put("type", AssetCatalog.TYPE_TRANSPORT);
        asset.put("title", "Managed Team Transport");
        asset.put("subtitle", "Owner plus manager");
        asset.put("category", AssetCatalog.CATEGORY_SEDAN);
        asset.put("city", "Bratislava");
        asset.put("capacityTotal", 4);
        asset.put("quantity", 1);
        asset.put("details", "Asset lifecycle e2e transport");
        asset.put("imageUrl", "https://example.test/assets/managed-transport.png");
        asset.put("routes", List.of("Bratislava", "Lifecycle Arena"));
        asset.put("visibility", "Public");
        asset.put("requests", List.of(Map.of(
                "id", "managed-request-1",
                "userId", ASSET_MANAGER_ID,
                "name", "Lifecycle User 06",
                "initials", "LU",
                "gender", "woman",
                "status", "pending",
                "note", "Can manage the transport",
                "requestKind", "borrow",
                "requestedAtIso", BASE_TIME.minus(Duration.ofDays(1)).toString()),
                Map.of("id", "managed-request-2", "userId", userId(7), "name", "Lifecycle User 07",
                        "initials", "LU", "gender", "man", "status", "pending",
                        "note", "Second manager", "requestKind", "borrow",
                        "requestedAtIso", BASE_TIME.minus(Duration.ofDays(1)).toString())));
        return asset;
    }

    private Map<String, Object> assetCard(String assetId, String type, String visibility) {
        Map<String, Object> asset = new LinkedHashMap<>();
        asset.put("id", assetId);
        asset.put("type", type);
        asset.put("title", "Lifecycle " + type + " " + assetId);
        asset.put("subtitle", "Explore contract asset");
        asset.put("category", AssetCatalog.TYPE_TRANSPORT.equals(type) ? AssetCatalog.CATEGORY_SEDAN : AssetCatalog.CATEGORY_CAMPING);
        asset.put("city", "Bratislava");
        asset.put("capacityTotal", 4);
        asset.put("quantity", 1);
        asset.put("details", "Asset explore e2e fixture");
        asset.put("imageUrl", "https://example.test/assets/" + assetId + ".png");
        asset.put("routes", List.of("Lifecycle Arena"));
        asset.put("visibility", visibility);
        return asset;
    }

    private ActivityEvent findEvent(String ownerUserId, String sourceId) {
        ActivityEvent event = fromReal(() -> mongoTemplate.findOne(
                Query.query(Criteria.where("ownerUserId").is(ownerUserId)
                        .and("sourceId").is(sourceId)),
                ActivityEvent.class));
        assertThat(event).as("event %s/%s", ownerUserId, sourceId).isNotNull();
        return event;
    }

    private ActivityMember findMember(String ownerType, String ownerId, String userId) {
        List<ActivityMember> ownerMembers = fromReal(() -> mongoTemplate.find(
                Query.query(Criteria.where("ownerType").is(ownerType)
                        .and("ownerId").is(ownerId)),
                ActivityMember.class));
        ActivityMember member = ownerMembers.stream()
                .filter(candidate -> userId.equals(candidate.getUserId()))
                .findFirst()
                .orElse(null);
        assertThat(member)
                .as("member %s/%s/%s among %s", ownerType, ownerId, userId,
                        ownerMembers.stream()
                                .map(candidate -> candidate.getUserId() + ":" + candidate.getStatus() + ":" + candidate.getRequestKind())
                                .toList())
                .isNotNull();
        return member;
    }

    private List<ActivityMember> findMembers(String ownerType, String ownerId) {
        return fromReal(() -> mongoTemplate.find(
                Query.query(Criteria.where("ownerType").is(ownerType)
                        .and("ownerId").is(ownerId)),
                ActivityMember.class));
    }

    private Asset findAsset(String assetId) {
        Asset asset = fromReal(() -> mongoTemplate.findOne(
                Query.query(Criteria.where("assetId").is(assetId)),
                Asset.class));
        assertThat(asset).as("asset %s", assetId).isNotNull();
        return asset;
    }

    private Payment findPayment(String sessionId) {
        Payment payment = fromReal(() -> mongoTemplate.findOne(
                Query.query(new Criteria().orOperator(
                        Criteria.where("checkoutSessionId").is(sessionId),
                        Criteria.where("gatewaySessionId").is(sessionId))),
                Payment.class));
        assertThat(payment).as("payment %s", sessionId).isNotNull();
        return payment;
    }

    private NotificationOutboxItem findOnlyNotification(String notificationType, String entityId) {
        List<NotificationOutboxItem> notifications = fromReal(() -> mongoTemplate.find(
                Query.query(Criteria.where("notificationType").is(notificationType)
                        .and("entityId").is(entityId)),
                NotificationOutboxItem.class));
        assertThat(notifications).as("%s for %s", notificationType, entityId).hasSize(1);
        return notifications.get(0);
    }

    private String memberStatus(JsonNode members, String userId) {
        return memberField(members, userId, "status");
    }

    private String memberRole(JsonNode members, String userId) {
        return memberField(members, userId, "role");
    }

    private String memberField(JsonNode members, String userId, String field) {
        for (JsonNode member : members.isArray() ? members : members.path("members")) {
            if (userId.equals(member.path("userId").asString())) {
                return member.path(field).asString();
            }
        }
        throw new AssertionError("Missing member " + userId + " in " + members);
    }

    private JsonNode getJson(String path) {
        HttpResponse<String> response = send(HttpRequest.newBuilder(uri(path))
                .header("Accept", "application/json")
                .GET()
                .build());
        assertOk(path, response.statusCode(), response.body());
        return parse(response.body());
    }

    private JsonNode postJson(String path, Object body) {
        HttpResponse<String> response = post(path, body);
        return parse(response.body());
    }

    private void requestAndApproveRefund(String paymentSessionId, String payerId) {
        String paymentId = findPayment(paymentSessionId).getId();
        // Removing an event from the participant's list does not authorize a refund.
        // Exercise the existing payer request and recipient approval as separate HTTP actions.
        JsonNode requested = postJson("/payment-methods/history/" + paymentId + "/refund-request?userId=" + payerId, Map.of());
        assertThat(requested.path("item").path("refundRequestStatus").asString()).isEqualTo("pending");
        JsonNode approved = postJson("/payment-methods/history/" + paymentId + "/refund-approve?userId=" + HOST_ID, Map.of());
        assertThat(approved.path("item").path("refundRequestStatus").asString()).isEqualTo("approved");
    }

    private void postOk(String path, Object body) {
        post(path, body);
    }

    private HttpResponse<String> post(String path, Object body) {
        HttpResponse<String> response = postRaw(path, body);
        assertOk(path, response.statusCode(), response.body());
        return response;
    }

    private HttpResponse<String> postRaw(String path, Object body) {
        // Select the request actor through the existing Firebase-disabled test mode.
        if (body instanceof Map<?, ?> payload) {
            Object actor = payload.containsKey("actorUserId") ? payload.get("actorUserId") : payload.get("userId");
            if (actor instanceof String actorId) {
                path += (path.contains("?") ? "&" : "?") + "userId=" + actorId;
            }
        }
        String json = writeJson(body);
        return send(HttpRequest.newBuilder(uri(path))
                .header("Accept", "application/json")
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(json))
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

    private void assertOk(String path, int status, String body) {
        assertThat(status >= 200 && status < 300)
                .as(path + " returned " + status + " body=" + body)
                .isTrue();
    }

    private String writeJson(Object value) {
        try {
            return objectMapper.writeValueAsString(value == null ? Map.of() : value);
        } catch (Exception exception) {
            throw new AssertionError("Unable to serialize request body: " + value, exception);
        }
    }

    private JsonNode parse(String body) {
        try {
            String json = body == null || body.isBlank() ? "{}" : body;
            return objectMapper.readTree(json);
        } catch (Exception exception) {
            throw new AssertionError("Unable to parse HTTP response body: " + body, exception);
        }
    }

    private List<String> ids(JsonNode array, String fieldName) {
        List<String> values = new ArrayList<>();
        for (JsonNode item : array) {
            values.add(item.path(fieldName).asString());
        }
        return values;
    }

    private List<String> ids(JsonNode array) {
        List<String> values = new ArrayList<>();
        for (JsonNode item : array) {
            values.add(item.asString());
        }
        return values;
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
        return "e2e-life-u" + String.format("%02d", index);
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
        seedFastPlatformConfig(REAL_DB);
        seedFastPlatformConfig(DEMO_DB);
        E2eAccessPolicySeedSupport.seedAccessPolicies(mongoBaseUri, REAL_DB);
        E2eAccessPolicySeedSupport.seedAccessPolicies(mongoBaseUri, DEMO_DB);
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
            Document document = new Document("_id", "country-hu-e2e-lifecycle")
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

    private static void seedFastPlatformConfig(String databaseName) {
        try (MongoClient client = MongoClients.create(mongoBaseUri)) {
            Document jobs = new Document("workerPollDelayMs", 60000)
                    .append("batchSize", 50)
                    .append("leaseDurationSeconds", 5)
                    .append("eventSchedulerPollDelayMs", 60000)
                    .append("autoInviterCadenceMs", 60000)
                    .append("notificationOutboxPollDelayMs", 60000)
                    .append("accountPurgeWindowDays", 30);
            Document notifications = new Document("firebaseWindowStartHour", 0)
                    .append("firebaseWindowEndHour", 24)
                    .append("maxWorkers", 1)
                    .append("maxRetries", 2)
                    .append("initialBackoffSeconds", 1)
                    .append("collapseWindowSeconds", 300)
                    .append("multicastThreshold", 3)
                    .append("topicThreshold", 250);
            Document document = new Document("_id", "affinity-config-e2e-lifecycle")
                    .append("key", "default")
                    .append("active", true)
                    .append("version", 100)
                    .append("jobs", jobs)
                    .append("notifications", notifications)
                    .append("changedDate", BASE_TIME.toString())
                    .append("changedUser", "e2e")
                    .append("changedSection", "lifecycle-e2e")
                    .append("changeSummary", "Lifecycle e2e platform parameters.");
            client.getDatabase(databaseName)
                    .getCollection("affinityConfigs")
                    .replaceOne(
                            Filters.eq("_id", "affinity-config-e2e-lifecycle"),
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
    }
}
