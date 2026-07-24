package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Map;

import org.bson.Document;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import com.raxim.myscoutee.profile.data.document.EventCheckoutBasketItem;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutBasketItemDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutRequestDto;
import com.raxim.myscoutee.profile.repository.EventCheckoutBasketItemsRepository;
import com.raxim.myscoutee.profile.service.notifications.NotificationRuleRegistryService;

class EventCheckoutBasketServiceTest {
    private EventCheckoutBasketItemsRepository repository;
    private MongoTemplate mongoTemplate;
    private EventCheckoutBasketService service;

    @BeforeEach
    void setUp() {
        repository = mock(EventCheckoutBasketItemsRepository.class);
        mongoTemplate = mock(MongoTemplate.class);
        service = new EventCheckoutBasketService(
                repository,
                mongoTemplate,
                mock(NotificationRuleRegistryService.class));
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
        when(repository.findByUserIdAndSourceIdInAndStatusInAndVisibleResultState(
                eq("user-1"),
                eq(List.of("event-1", "event-2")),
                anyList(),
                anyList()))
                .thenReturn(List.of(pending, failed, succeeded));

        Map<String, String> result = service.loadResultStatesByEvent(
                " user-1 ",
                List.of(" event-1 ", "event-2", "event-1"));

        assertThat(result).containsExactlyInAnyOrderEntriesOf(Map.of(
                "event-1", "failed",
                "event-2", "succeeded"));
        verify(repository).findByUserIdAndSourceIdInAndStatusInAndVisibleResultState(
                eq("user-1"),
                eq(List.of("event-1", "event-2")),
                anyList(),
                anyList());
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
                "draft",
                "pending",
                List.of(),
                null,
                null,
                null,
                null);
    }
}
