package com.raxim.myscoutee.domain.integrations.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;

import com.raxim.myscoutee.domain.events.document.ActivityEvent;
import com.raxim.myscoutee.domain.events.document.ActivityMember;
import com.raxim.myscoutee.domain.integrations.document.IntegrationExternalId;
import com.raxim.myscoutee.domain.integrations.document.IntegrationToken;
import com.raxim.myscoutee.domain.integrations.document.IntegrationWebhookDelivery;
import com.raxim.myscoutee.domain.integrations.document.IntegrationWebhookSubscription;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.integrations.dto.IntegrationDtos.IntegrationWatchRequestDto;
import com.raxim.myscoutee.domain.integrations.repository.IntegrationExternalIdsRepository;
import com.raxim.myscoutee.domain.integrations.repository.IntegrationTokensRepository;
import com.raxim.myscoutee.domain.integrations.repository.IntegrationWebhookDeliveriesRepository;
import com.raxim.myscoutee.domain.integrations.repository.IntegrationWebhookSubscriptionsRepository;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;
import com.raxim.myscoutee.domain.integrations.service.IntegrationTokenService.AuthenticatedIntegrationClient;

import tools.jackson.databind.ObjectMapper;

@ExtendWith(MockitoExtension.class)
class IntegrationWebhookServiceTest {
    @Mock
    private IntegrationWebhookSubscriptionsRepository subscriptionsRepository;
    @Mock
    private IntegrationWebhookDeliveriesRepository deliveriesRepository;
    @Mock
    private IntegrationExternalIdsRepository externalIdsRepository;
    @Mock
    private IntegrationTokensRepository tokensRepository;
    @Mock
    private UsersRepository usersRepository;
    @Mock
    private MongoTemplate mongoTemplate;

    private IntegrationWebhookService service;

    @org.junit.jupiter.api.AfterEach
    void stopWorkers() {
        service.shutdownDeliveryWorkers();
    }

    @org.junit.jupiter.params.ParameterizedTest
    @org.junit.jupiter.params.provider.ValueSource(booleans = {false, true})
    @org.junit.jupiter.api.Timeout(20)

    @org.junit.jupiter.api.Tag("embedded")
    void unresponsiveCallbackTimesOutAndFollowingDeliveryCanSucceed(boolean headersSent) throws Exception {
        var server = com.sun.net.httpserver.HttpServer.create(new java.net.InetSocketAddress("127.0.0.1", 0), 0);
        server.createContext("/silent", exchange -> {
            if (headersSent) {
                exchange.sendResponseHeaders(200, 100);
                exchange.getResponseBody().write(1);
                exchange.getResponseBody().flush();
            }
            // Keep the response open: either no headers, or an unfinished response body.
        });
        server.createContext("/healthy", exchange -> {
            exchange.sendResponseHeaders(204, -1);
            exchange.close();
        });
        server.start();
        try {
            var subscription = deliverySubscription("http://127.0.0.1:" + server.getAddress().getPort() + "/silent");
            var delivery = pendingDelivery();
            long started = System.nanoTime();
            org.springframework.test.util.ReflectionTestUtils.invokeMethod(service, "deliver", delivery);
            long elapsedMillis = java.util.concurrent.TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - started);
            assertThat(elapsedMillis).isBetween(9000L, 15000L);
            assertThat(delivery.getStatus()).isEqualTo("RETRY");
            assertThat(delivery.getAttemptCount()).isEqualTo(1);
            assertThat(delivery.getLastError()).isEqualTo("HttpTimeoutException");
            assertThat(delivery.getNextAttemptAtIso()).isNotBlank();
            org.mockito.Mockito.verify(deliveriesRepository).save(delivery);

            subscription.setCallbackUrl("http://127.0.0.1:" + server.getAddress().getPort() + "/healthy");
            var following = pendingDelivery();
            following.setId("following");
            org.springframework.test.util.ReflectionTestUtils.invokeMethod(service, "deliver", following);
            assertThat(following.getStatus()).isEqualTo("SENT");
            assertThat(following.getSentAtIso()).isNotBlank();
            org.mockito.Mockito.verify(deliveriesRepository).save(following);
        } finally {
            server.stop(0);
        }
    }

    @Test
    @org.junit.jupiter.api.Timeout(15)
    @org.junit.jupiter.api.Tag("standard")
    void refusedCallbackHasBoundedRetriesAndTerminalFailure() throws Exception {
        int port;
        try (var socket = new java.net.ServerSocket(0, 1, java.net.InetAddress.getLoopbackAddress())) {
            port = socket.getLocalPort();
        }
        deliverySubscription("http://127.0.0.1:" + port + "/callback");
        var delivery = pendingDelivery();
        long[] delays = {5, 30};
        for (int attempt = 1; attempt <= 3; attempt++) {
            var before = Instant.now();
            // Exercise each delivery attempt directly; no production wait or fabricated HTTP response.
            org.springframework.test.util.ReflectionTestUtils.invokeMethod(service, "deliver", delivery);
            assertThat(delivery.getAttemptCount()).isEqualTo(attempt);
            assertThat(delivery.getLastError()).isEqualTo("ConnectException");
            if (attempt <= delays.length) {
                assertThat(delivery.getStatus()).isEqualTo("RETRY");
                assertThat(Instant.parse(delivery.getNextAttemptAtIso()))
                        .isBetween(before.plusSeconds(delays[attempt - 1]), Instant.now().plusSeconds(delays[attempt - 1]));
            } else {
                assertThat(delivery.getStatus()).isEqualTo("FAILED");
                assertThat(delivery.getNextAttemptAtIso()).isNull();
            }
        }
        org.mockito.Mockito.verify(deliveriesRepository, org.mockito.Mockito.times(3)).save(delivery);
    }

    private IntegrationWebhookSubscription deliverySubscription(String callback) {
        Users callbackOwner = new Users(); callbackOwner.setUserId("owner-timeout");
        when(usersRepository.findByUserId("owner-timeout")).thenReturn(Optional.of(callbackOwner));
        var subscription = new IntegrationWebhookSubscription();
        subscription.setId("watch-timeout");
        subscription.setTokenId("token-timeout");
        subscription.setEnabled(true);
        subscription.setCallbackUrl(callback);
        when(subscriptionsRepository.findById("watch-timeout")).thenReturn(Optional.of(subscription));
        var token = new IntegrationToken();
        token.setExpiresAtIso(Instant.now().plusSeconds(3600).toString());
        when(tokensRepository.findByIdAndOwnerUserId("token-timeout", "owner-timeout"))
                .thenReturn(Optional.of(token));
        return subscription;
    }

    @Test
    @org.junit.jupiter.api.Tag("standard")
    void blockingAClientStopsAnAlreadyQueuedCallbackBeforeNetworkDelivery() {
        // Invalid callback deliberately proves rejection occurs before URL resolution/delivery.
        deliverySubscription("not-a-url");
        var owner = new Users(); owner.setUserId("owner-timeout");
        owner.setIntegrationAccess(new com.raxim.myscoutee.domain.integrations.dto.IntegrationAccess(1,
                com.raxim.myscoutee.domain.integrations.dto.IntegrationAccess.Mode.WRITE,
                java.util.Map.of("token-timeout", com.raxim.myscoutee.domain.integrations.dto.IntegrationAccess.Mode.BLOCKED)));
        when(usersRepository.findByUserId("owner-timeout")).thenReturn(Optional.of(owner));
        var delivery = pendingDelivery();
        org.springframework.test.util.ReflectionTestUtils.invokeMethod(service, "deliver", delivery);
        assertThat(delivery.getStatus()).isEqualTo("FAILED");
        assertThat(delivery.getLastError()).isEqualTo("subscription_inactive");
        assertThat(delivery.getSentAtIso()).isNull();
        org.mockito.Mockito.verify(deliveriesRepository).save(delivery);
    }

    @Test
    @org.junit.jupiter.api.Tag("standard")
    void localEventsThrottlingDefersWithoutSpendingAnAttemptAndPermanentResponsesDoNotRetry() throws Exception {
        var events = org.mockito.Mockito.mock(McpEventsService.class);
        org.springframework.test.util.ReflectionTestUtils.setField(service, "mcpEvents", events);
        var delivery = pendingDelivery(); delivery.setProtocol(McpEventsService.PROTOCOL); delivery.setAttemptCount(1);
        when(events.deliver(org.mockito.ArgumentMatchers.eq(delivery), org.mockito.ArgumentMatchers.isNull()))
                .thenThrow(new McpEventCallbackClient.Throttled()).thenReturn(413);
        org.springframework.test.util.ReflectionTestUtils.invokeMethod(service, "deliver", delivery);
        assertThat(delivery.getStatus()).isEqualTo("RETRY");
        assertThat(delivery.getAttemptCount()).isEqualTo(1);
        org.springframework.test.util.ReflectionTestUtils.invokeMethod(service, "deliver", delivery);
        assertThat(delivery.getStatus()).isEqualTo("FAILED");
        assertThat(delivery.getLastError()).isEqualTo("http_413");
    }

    private IntegrationWebhookDelivery pendingDelivery() {
        var delivery = new IntegrationWebhookDelivery();
        delivery.setId("delivery-timeout");
        delivery.setSubscriptionId("watch-timeout");
        delivery.setOwnerUserId("owner-timeout");
        delivery.setPayloadJson("{}");
        delivery.setStatus("SENDING");
        return delivery;
    }

    @BeforeEach
    void setUp() {
        service = new IntegrationWebhookService(
                subscriptionsRepository,
                deliveriesRepository,
                externalIdsRepository,
                tokensRepository, new com.raxim.myscoutee.domain.accounts.service.ProfileDirectoryService(usersRepository),
                mongoTemplate,
                new ObjectMapper(),
                true,
                true,
                100,
                100);
        var eventOwner = new com.raxim.myscoutee.domain.events.service.EventOwnershipService(null);
        org.springframework.test.util.ReflectionTestUtils.setField(eventOwner, "mongo", mongoTemplate);
        org.springframework.test.util.ReflectionTestUtils.setField(service, "eventOwnership", eventOwner);
        org.springframework.test.util.ReflectionTestUtils.setField(service, "assetOwnership", com.raxim.myscoutee.domain.assets.service.AssetTestSupport.ownership(null, mongoTemplate));
    }

    @Test
    @org.junit.jupiter.api.Tag("standard")
    void configureDefaultsToBothSupportedEventsForTheClaimedClient() {
        when(subscriptionsRepository.findByTokenIdAndClientId("token-1", "client-1"))
                .thenReturn(Optional.empty());
        when(subscriptionsRepository.save(any(IntegrationWebhookSubscription.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        var response = service.configure(
                new AuthenticatedIntegrationClient("owner-1", "token-1", "client-1"),
                new IntegrationWatchRequestDto("http://127.0.0.1:18090/callback", List.of(), true));

        assertThat(response.enabled()).isTrue();
        assertThat(response.events()).containsExactly("event.changed", "asset.changed");
    }

    @Test
    @org.junit.jupiter.api.Tag("standard")
    void encounterPublicationUsesStableDeliveryIdsAcrossProducerRetries() {
        var subscription = new IntegrationWebhookSubscription();
        subscription.setId("watch"); subscription.setTokenId("token"); subscription.setEventTypes(List.of("event.encounters"));
        when(subscriptionsRepository.findByOwnerUserIdAndEnabledTrue("owner")).thenReturn(List.of(subscription));
        var token = new IntegrationToken(); token.setOwnerUserId("owner"); token.setExpiresAtIso(Instant.now().plus(1, ChronoUnit.DAYS).toString());
        when(tokensRepository.findByIdAndOwnerUserId("token", "owner")).thenReturn(Optional.of(token));
        Users callbackOwner = new Users(); callbackOwner.setUserId("owner");
        when(usersRepository.findByUserId("owner")).thenReturn(Optional.of(callbackOwner));
        var result = new com.raxim.myscoutee.domain.integrations.dto.IntegrationDtos.IntegrationEncountersDto(
                "partner-event", "event", 9, List.of(), 0, null);
        when(deliveriesRepository.insert(any(IntegrationWebhookDelivery.class)))
                .thenAnswer(call -> call.getArgument(0))
                .thenThrow(new org.springframework.dao.DuplicateKeyException("already queued"));
        service.enqueueEncounters("owner", () -> result);
        service.enqueueEncounters("owner", () -> result);
        var captor = ArgumentCaptor.forClass(IntegrationWebhookDelivery.class);
        org.mockito.Mockito.verify(deliveriesRepository, org.mockito.Mockito.times(2)).insert(captor.capture());
        assertThat(captor.getAllValues().get(0).getId()).isEqualTo(captor.getAllValues().get(1).getId());
        assertThat(captor.getValue().getPayloadJson()).contains("event.encounters", "partner-event", "nextOffset", "revision");
        org.mockito.Mockito.verify(deliveriesRepository, org.mockito.Mockito.never()).save(any(IntegrationWebhookDelivery.class));
    }

    @Test
    @org.junit.jupiter.api.Tag("standard")
    void participantChangeUsesMappedIdsAndOmitsEmailAndInternalUserId() {
        Users callbackOwner = new Users(); callbackOwner.setUserId("owner-1");
        when(usersRepository.findByUserId("owner-1")).thenReturn(Optional.of(callbackOwner));
        ActivityEvent event = new ActivityEvent();
        event.setId("event-record-1");
        event.setSourceId("10000000-0000-4000-8000-000000000001");
        event.setOwnerUserId("owner-1");
        event.setCreatorUserId("owner-1");
        event.setTitle("API callback event");
        event.setStatus("A");
        when(mongoTemplate.find(any(Query.class), eq(ActivityEvent.class))).thenReturn(List.of(event));

        IntegrationWebhookSubscription subscription = new IntegrationWebhookSubscription();
        subscription.setId("subscription-1");
        subscription.setOwnerUserId("owner-1");
        subscription.setTokenId("token-1");
        subscription.setClientId("client-1");
        subscription.setEnabled(true);
        subscription.setEventTypes(List.of("event.changed"));
        when(subscriptionsRepository.findByOwnerUserIdAndEnabledTrue("owner-1"))
                .thenReturn(List.of(subscription));

        IntegrationToken token = new IntegrationToken();
        token.setId("token-1");
        token.setOwnerUserId("owner-1");
        token.setExpiresAtIso(Instant.now().plus(1, ChronoUnit.DAYS).toString());
        when(tokensRepository.findByIdAndOwnerUserId("token-1", "owner-1"))
                .thenReturn(Optional.of(token));

        IntegrationExternalId mapping = new IntegrationExternalId();
        mapping.setExternalId("20000000-0000-4000-8000-000000000002");
        mapping.setInternalId(event.getSourceId());
        when(externalIdsRepository.findByOwnerUserIdAndResourceTypeAndInternalId(
                "owner-1", "event", event.getSourceId()))
                .thenReturn(Optional.of(mapping));

        Users participant = new Users();
        participant.setId("private-user-id");
        participant.setEmail("private@example.test");
        participant.setName("Peter Test");
        participant.setAge(29);
        participant.setGender("Male");
        participant.setImages(List.of("https://images.example.test/peter.webp"));
        when(usersRepository.findByUserId("private-user-id")).thenReturn(Optional.of(participant));

        ActivityMember member = new ActivityMember();
        member.setOwnerType("event");
        member.setOwnerId(event.getSourceId());
        member.setUserId("private-user-id");
        member.setRole("Member");
        member.setStatus("accepted");
        member.setActionAtIso(Instant.now().toString());

        service.enqueue(member);

        ArgumentCaptor<IntegrationWebhookDelivery> delivery =
                ArgumentCaptor.forClass(IntegrationWebhookDelivery.class);
        org.mockito.Mockito.verify(deliveriesRepository).save(delivery.capture());
        assertThat(delivery.getValue().getPayloadJson())
                .contains("event.changed")
                .contains("20000000-0000-4000-8000-000000000002")
                .contains(event.getSourceId())
                .contains("Peter Test")
                .contains("accepted")
                .doesNotContain("private@example.test")
                .doesNotContain("private-user-id");
    }
}
