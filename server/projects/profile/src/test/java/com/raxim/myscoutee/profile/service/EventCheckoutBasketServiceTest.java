package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.atLeastOnce;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.util.List;
import java.util.Map;

import org.bson.Document;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.ArgumentCaptor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import com.raxim.myscoutee.profile.data.document.EventCheckoutBasketItem;
import com.raxim.myscoutee.profile.data.document.NotificationRuleConfig;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutBasketItemDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutRequestDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutStateChangeRequestDto;
import com.raxim.myscoutee.profile.repository.EventCheckoutBasketItemsRepository;
import com.raxim.myscoutee.profile.service.notifications.NotificationRuleRegistryService;

class EventCheckoutBasketServiceTest {
    private EventCheckoutBasketItemsRepository repository;
    private MongoTemplate mongoTemplate;
    private NotificationRuleRegistryService notificationRuleRegistryService;
    private EventCheckoutBasketService service;
    private EventCheckoutPricingService checkoutPricing;

    @BeforeEach
    void setUp() {
        repository = mock(EventCheckoutBasketItemsRepository.class);
        mongoTemplate = mock(MongoTemplate.class);
        notificationRuleRegistryService = mock(NotificationRuleRegistryService.class);
        checkoutPricing = mock(EventCheckoutPricingService.class);
        service = new EventCheckoutBasketService(
                repository,
                mongoTemplate,
                notificationRuleRegistryService,
                mock(org.springframework.beans.factory.ObjectProvider.class),
                checkoutPricing);
        org.springframework.test.util.ReflectionTestUtils.setField(service, "jobGroupScope",
            new com.raxim.myscoutee.profile.service.JobGroupScopeService(mock(org.springframework.data.mongodb.core.MongoTemplate.class)));
        when(repository.findByUserIdAndSourceIdAndStatusInAndVisibleResultState(
                any(String.class),
                any(String.class),
                anyList(),
                anyList()))
                .thenReturn(List.of());
    }

    @Test
    void resourceBasketPreservesBorrowExpiryWithoutLookingUpAnEvent() {
        String expiry = Instant.now().plusSeconds(600).toString();
        var item = new EventCheckoutBasketItemDto(
                "resource:asset-1", "resource", "asset-1", null, null, null,
                "stage-1", "Transport", "Borrow", "Tomorrow", 20d, "EUR", 1,
                "confirmed", "pending", List.of(), null, null, null, expiry);

        service.saveBasket(request(item));

        verify(checkoutPricing, never()).checkoutDeadline(any());
        ArgumentCaptor<Update> updates = ArgumentCaptor.forClass(Update.class);
        verify(mongoTemplate).upsert(any(Query.class), updates.capture(), eq(EventCheckoutBasketItem.class));
        Document values = (Document) updates.getValue().getUpdateObject().get("$set");
        assertThat(values.get("expiresAtIso")).isEqualTo(expiry);
    }

    @Test
    void appliedPromoCodesAreNormalizedOnWriteAndRoundTripFromEveryBasketItem() {
        EventCheckoutBasketItem persisted = persistedItem();
        persisted.setAppliedPromoCodes(List.of(" vip20 ", "VIP20", "save10"));
        when(repository.findByUserIdAndSourceIdAndStatusInAndVisibleResultState(
                eq("user-1"),
                eq("event-1"),
                anyList(),
                anyList()))
                .thenReturn(List.of(persisted));

        assertThat(service.loadBasketByEvent(" user-1 ", " event-1 ").appliedPromoCodes())
                .containsExactly("VIP20", "SAVE10");

        service.saveBasket(new EventCheckoutRequestDto(
                "user-1",
                "event-1",
                null,
                List.of(),
                List.of(),
                List.of(),
                List.of(itemDto()),
                List.of(),
                "draft",
                List.of(),
                25d,
                "USD",
                null,
                List.of(" vip20 ", "VIP20", "save10")));

        ArgumentCaptor<Update> updateCaptor = ArgumentCaptor.forClass(Update.class);
        verify(mongoTemplate).upsert(
                any(Query.class),
                updateCaptor.capture(),
                eq(EventCheckoutBasketItem.class));
        Document setValues = (Document) updateCaptor.getValue().getUpdateObject().get("$set");
        assertThat(setValues.get("appliedPromoCodes"))
                .isEqualTo(List.of("VIP20", "SAVE10"));
    }

    @Test
    void resultStatesForVisibleCardsAreLoadedInOneBatch() {
        EventCheckoutBasketItem pending = persistedItem();
        pending.setSourceId("event-1");
        pending.setResultState("pending");
        EventCheckoutBasketItem failed = persistedItem();
        failed.setSourceId("event-1");
        failed.setResultState("failed");
        EventCheckoutBasketItem succeeded = persistedItem();
        succeeded.setSourceId("event-2");
        succeeded.setResultState("succeeded");
        EventCheckoutBasketItem deletedBeforeSuccess = persistedItem();
        deletedBeforeSuccess.setSourceId("event-2");
        deletedBeforeSuccess.setResultState("deleted");
        EventCheckoutBasketItem deleted = persistedItem();
        deleted.setSourceId("event-3");
        deleted.setResultState("deleted");
        when(repository.findByUserIdAndSourceIdInAndStatusInAndVisibleResultState(
                eq("user-1"),
                eq(List.of("event-1", "event-2", "event-3")),
                anyList(),
                anyList()))
                .thenReturn(List.of(pending, failed, deletedBeforeSuccess, succeeded, deleted));

        Map<String, String> result = service.loadResultStatesByEvent(
                " user-1 ",
                List.of(" event-1 ", "event-2", "event-3", "event-1"));

        assertThat(result).containsExactlyInAnyOrderEntriesOf(Map.of(
                "event-1", "failed",
                "event-2", "succeeded",
                "event-3", "deleted"));
        verify(repository).findByUserIdAndSourceIdInAndStatusInAndVisibleResultState(
                eq("user-1"),
                eq(List.of("event-1", "event-2", "event-3")),
                anyList(),
                anyList());
    }

    @Test
    void cardReasonsDistinguishApprovalFromPaymentWithoutAnotherQuery() {
        EventCheckoutBasketItem manual = persistedItem();
        manual.setSourceId("manual"); manual.setStatus("approval-pending"); manual.setResultState("pending");
        EventCheckoutBasketItem approved = persistedItem();
        approved.setSourceId("approved"); approved.setStatus("approved"); approved.setResultState("pending");
        EventCheckoutBasketItem automatic = persistedItem();
        automatic.setSourceId("automatic"); automatic.setStatus("confirmed"); automatic.setResultState("pending");
        EventCheckoutBasketItem oldApproval = persistedItem();
        oldApproval.setSourceId("approved"); oldApproval.setStatus("approval-pending"); oldApproval.setResultState("deleted");
        when(repository.findByUserIdAndSourceIdInAndStatusInAndVisibleResultState(
                eq("user-1"), anyList(), anyList(), anyList()))
                .thenReturn(List.of(manual, approved, automatic, oldApproval));

        var states = service.loadCardStatesByEvent("user-1", List.of("manual", "approved", "automatic"));

        assertThat(states.pendingReasons()).containsExactlyInAnyOrderEntriesOf(Map.of(
                "manual", "approval", "approved", "payment", "automatic", "payment"));
        verify(repository).findByUserIdAndSourceIdInAndStatusInAndVisibleResultState(
                eq("user-1"), anyList(), anyList(), anyList());
    }

    @Test
    void everySaveCreatesANewPhysicalAuditRecord() {
        service.saveBasket(request(itemDto(
                "approval-pending",
                "pending",
                "2026-08-12T08:00:00Z")));
        service.saveBasket(request(itemDto(
                "approval-pending",
                "pending",
                "2026-08-12T09:00:00Z")));

        ArgumentCaptor<Query> queryCaptor = ArgumentCaptor.forClass(Query.class);
        ArgumentCaptor<Update> updateCaptor = ArgumentCaptor.forClass(Update.class);
        verify(mongoTemplate, times(2)).upsert(
                queryCaptor.capture(),
                updateCaptor.capture(),
                eq(EventCheckoutBasketItem.class));
        assertThat(queryCaptor.getAllValues())
                .extracting(query -> query.getQueryObject().getString("_id"))
                .allSatisfy(id -> assertThat(id).hasSize(24))
                .doesNotHaveDuplicates();
        assertThat(updateCaptor.getAllValues())
                .extracting(update -> (Document) update.getUpdateObject().get("$set"))
                .allSatisfy(setValues -> assertThat(setValues.getBoolean("reservationActive")).isTrue());
        assertThat(updateCaptor.getAllValues())
                .extracting(update -> (Document) update.getUpdateObject().get("$setOnInsert"))
                .extracting(setOnInsert -> setOnInsert.getString("createdAtIso"))
                .containsExactly("2026-08-12T08:00:00Z", "2026-08-12T09:00:00Z");
        verify(mongoTemplate, never()).findOne(any(Query.class), eq(EventCheckoutBasketItem.class));
    }

    @Test
    void missingExpiryUsesTheCheckoutPricingDeadline() {
        when(checkoutPricing.checkoutDeadline(any())).thenAnswer(invocation -> Instant.now().plusSeconds(600).toString());
        Instant beforeSave = Instant.now();

        service.saveBasket(request(itemDto()));

        Instant afterSave = Instant.now();
        ArgumentCaptor<Update> updateCaptor = ArgumentCaptor.forClass(Update.class);
        verify(mongoTemplate).upsert(
                any(Query.class),
                updateCaptor.capture(),
                eq(EventCheckoutBasketItem.class));
        Document setValues = (Document) updateCaptor.getValue().getUpdateObject().get("$set");
        Instant expiresAt = Instant.parse(setValues.getString("expiresAtIso"));
        assertThat(expiresAt)
                .isBetween(beforeSave.plusSeconds(600), afterSave.plusSeconds(600));
    }

    @Test
    void cancelClosesTheReservationUniquenessSlot() {
        service.updateBasketState(new EventCheckoutStateChangeRequestDto(
                "user-1",
                "event-1",
                "cancelled",
                "deleted",
                null,
                null));

        ArgumentCaptor<Update> updateCaptor = ArgumentCaptor.forClass(Update.class);
        verify(mongoTemplate, atLeastOnce()).updateMulti(
                any(Query.class),
                updateCaptor.capture(),
                eq(EventCheckoutBasketItem.class));
        assertThat(updateCaptor.getAllValues())
                .allSatisfy(update -> {
                    Document setValues = (Document) update.getUpdateObject().get("$set");
                    assertThat(setValues.getBoolean("reservationActive")).isFalse();
                });
    }

    @ParameterizedTest
    @ValueSource(strings = {"approval-pending", "waiting", "approved", "confirmed"})
    void acceptanceKeepsUnpaidBasketAvailableUntilPayment(String status) {
        EventCheckoutBasketItem item = persistedItem();
        item.setStatus(status);
        item.setResultState("pending");
        item.setAmount(100d);
        item.setCheckoutSessionId(null);
        when(repository.findByUserIdAndSourceIdAndStatusInAndVisibleResultState(
                eq("user-1"), eq("event-1"), anyList(), anyList())).thenReturn(List.of(item));

        service.finalizeAcceptedReservation("user-1", "event-1");

        ArgumentCaptor<Update> updates = ArgumentCaptor.forClass(Update.class);
        verify(mongoTemplate, atLeastOnce()).updateMulti(any(Query.class), updates.capture(), eq(EventCheckoutBasketItem.class));
        assertThat(updates.getAllValues()).allSatisfy(update -> {
            Document values = (Document) update.getUpdateObject().get("$set");
            assertThat(values.getString("status")).isEqualTo("approved");
            assertThat(values.getString("resultState")).isEqualTo("pending");
            assertThat(values.getBoolean("reservationActive")).isTrue();
        });
    }

    @ParameterizedTest
    @ValueSource(booleans = {false, true})
    void freeOrPaymentBackedAcceptanceStillClosesReservation(boolean paymentBacked) {
        EventCheckoutBasketItem item = persistedItem();
        item.setStatus("approved");
        item.setResultState("pending");
        item.setAmount(paymentBacked ? 100d : 0d);
        item.setCheckoutSessionId(paymentBacked ? "payment-1" : null);
        when(repository.findByUserIdAndSourceIdAndStatusInAndVisibleResultState(
                eq("user-1"), eq("event-1"), anyList(), anyList())).thenReturn(List.of(item));

        service.finalizeAcceptedReservation("user-1", "event-1");

        ArgumentCaptor<Update> updates = ArgumentCaptor.forClass(Update.class);
        verify(mongoTemplate, times(2)).updateMulti(any(Query.class), updates.capture(), eq(EventCheckoutBasketItem.class));
        assertThat(updates.getAllValues()).allSatisfy(update -> {
            Document values = (Document) update.getUpdateObject().get("$set");
            assertThat(values.getString("resultState")).isEqualTo("succeeded");
            assertThat(values.getBoolean("reservationActive")).isFalse();
        });
    }

    @Test
    void terminalAcceptanceClosesOnlyTheActiveReservationSlot() {
        service.finalizeAcceptedReservation(" user-1 ", " event-1 ");

        ArgumentCaptor<Query> queryCaptor = ArgumentCaptor.forClass(Query.class);
        ArgumentCaptor<Update> updateCaptor = ArgumentCaptor.forClass(Update.class);
        verify(mongoTemplate, times(2)).updateMulti(
                queryCaptor.capture(),
                updateCaptor.capture(),
                eq(EventCheckoutBasketItem.class));
        assertThat(queryCaptor.getAllValues())
                .allSatisfy(query -> {
                    String predicate = query.getQueryObject().toJson();
                    assertThat(predicate).contains("user-1", "event-1", "reservationActive", "true");
                });
        assertThat(updateCaptor.getAllValues())
                .allSatisfy(update -> {
                    Document setValues = (Document) update.getUpdateObject().get("$set");
                    assertThat(setValues.getString("status")).isEqualTo("approved");
                    assertThat(setValues.getString("resultState")).isEqualTo("succeeded");
                    assertThat(setValues.getBoolean("reservationActive")).isFalse();
                    assertThat(setValues.getBoolean("pendingCounterTracked")).isFalse();
                });
    }

    @Test
    void purgeDoesNotReadOrWriteWhenAnotherInstanceOwnsTheScheduledRun() {
        int processed = service.purgeExpiredDraftBasketsScheduled(Instant.now());

        assertThat(processed).isZero();
        verify(notificationRuleRegistryService).beginScheduledRun(
                eq(NotificationRuleRegistryService.RULE_EVENT_CHECKOUT_BASKET_PURGE),
                any(String.class),
                any(String.class),
                any(Instant.class));
        verify(mongoTemplate, never()).updateMulti(
                any(Query.class),
                any(Update.class),
                eq(EventCheckoutBasketItem.class));
    }

    @Test
    void purgeScansExpiredDraftsAfterOwningTheScheduledRun() {
        when(notificationRuleRegistryService.beginScheduledRun(
                eq(NotificationRuleRegistryService.RULE_EVENT_CHECKOUT_BASKET_PURGE),
                any(String.class),
                any(String.class),
                any(Instant.class)))
                .thenReturn(new NotificationRuleConfig());

        int processed = service.purgeExpiredDraftBasketsScheduled(Instant.now());

        assertThat(processed).isZero();
        verify(mongoTemplate, atLeastOnce()).updateMulti(
                any(Query.class),
                any(Update.class),
                eq(EventCheckoutBasketItem.class));
    }

    private EventCheckoutBasketItem persistedItem() {
        EventCheckoutBasketItem item = new EventCheckoutBasketItem();
        item.setItemId("event:event-1:main");
        item.setUserId("user-1");
        item.setSourceId("event-1");
        item.setKind("event");
        item.setLabel("Canonical Event");
        item.setAmount(25d);
        item.setCurrency("USD");
        item.setQuantity(1);
        item.setStatus("draft");
        item.setResultState("pending");
        item.setPricingSummaryRows(List.of());
        return item;
    }

    private EventCheckoutBasketItemDto itemDto() {
        return itemDto("draft", "pending", null);
    }

    private EventCheckoutBasketItemDto itemDto(String status, String resultState, String createdAtIso) {
        return new EventCheckoutBasketItemDto(
                "event:event-1:main",
                "event",
                "event-1",
                null,
                null,
                null,
                null,
                null,
                "Canonical Event",
                "Tomorrow",
                25d,
                "USD",
                1,
                status,
                resultState,
                List.of(),
                null,
                createdAtIso,
                null,
                null);
    }

    private EventCheckoutRequestDto request(EventCheckoutBasketItemDto item) {
        return new EventCheckoutRequestDto(
                "user-1",
                "event-1",
                null,
                List.of(),
                List.of(),
                List.of(),
                List.of(item),
                List.of(),
                item.status(),
                List.of(),
                25d,
                "USD",
                null,
                List.of());
    }
}
