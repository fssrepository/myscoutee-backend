package com.raxim.myscoutee.profile.service;

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

import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.ActivityMember;
import com.raxim.myscoutee.profile.data.document.IntegrationExternalId;
import com.raxim.myscoutee.profile.data.document.IntegrationToken;
import com.raxim.myscoutee.profile.data.document.IntegrationWebhookDelivery;
import com.raxim.myscoutee.profile.data.document.IntegrationWebhookSubscription;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.data.dto.integration.IntegrationDtos.IntegrationWatchRequestDto;
import com.raxim.myscoutee.profile.repository.IntegrationExternalIdsRepository;
import com.raxim.myscoutee.profile.repository.IntegrationTokensRepository;
import com.raxim.myscoutee.profile.repository.IntegrationWebhookDeliveriesRepository;
import com.raxim.myscoutee.profile.repository.IntegrationWebhookSubscriptionsRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;
import com.raxim.myscoutee.profile.service.IntegrationTokenService.AuthenticatedIntegrationClient;

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

    @BeforeEach
    void setUp() {
        service = new IntegrationWebhookService(
                subscriptionsRepository,
                deliveriesRepository,
                externalIdsRepository,
                tokensRepository,
                usersRepository,
                mongoTemplate,
                new ObjectMapper(),
                true,
                true,
                100,
                100);
    }

    @Test
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
    void encounterPublicationUsesStableDeliveryIdsAcrossProducerRetries() {
        var subscription = new IntegrationWebhookSubscription();
        subscription.setId("watch"); subscription.setTokenId("token"); subscription.setEventTypes(List.of("event.encounters"));
        when(subscriptionsRepository.findByOwnerUserIdAndEnabledTrue("owner")).thenReturn(List.of(subscription));
        var token = new IntegrationToken(); token.setOwnerUserId("owner"); token.setExpiresAtIso(Instant.now().plus(1, ChronoUnit.DAYS).toString());
        when(tokensRepository.findByIdAndOwnerUserId("token", "owner")).thenReturn(Optional.of(token));
        var result = new com.raxim.myscoutee.profile.data.dto.integration.IntegrationDtos.IntegrationEncountersDto(
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
    void participantChangeUsesMappedIdsAndOmitsEmailAndInternalUserId() {
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
