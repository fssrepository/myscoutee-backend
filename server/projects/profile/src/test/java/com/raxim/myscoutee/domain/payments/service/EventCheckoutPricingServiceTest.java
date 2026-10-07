package com.raxim.myscoutee.domain.payments.service;

import com.raxim.myscoutee.domain.localization.service.DBMessageSource;
import com.raxim.myscoutee.domain.localization.service.TranslationService;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Locale;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.context.i18n.LocaleContextHolder;
import com.raxim.myscoutee.domain.localization.repository.I18nMessageRepository;
import com.raxim.myscoutee.domain.localization.document.I18nMessage;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.domain.events.document.ActivityEvent;
import com.raxim.myscoutee.domain.events.dto.EventsDtos.EventCheckoutBasketItemDto;
import com.raxim.myscoutee.domain.events.dto.EventsDtos.EventCheckoutLineItemDto;
import com.raxim.myscoutee.domain.events.dto.EventsDtos.EventCheckoutPromoCodeValidationRequestDto;
import com.raxim.myscoutee.domain.events.dto.EventsDtos.EventCheckoutRequestDto;
import com.raxim.myscoutee.common.dto.SharedDtos.EventSlotOccurrenceDto;
import com.raxim.myscoutee.common.dto.SharedDtos.PricingActionDto;
import com.raxim.myscoutee.common.dto.SharedDtos.PricingAudienceSettingsDto;
import com.raxim.myscoutee.common.dto.SharedDtos.PricingCancellationPolicyDto;
import com.raxim.myscoutee.common.dto.SharedDtos.PricingConfigDto;
import com.raxim.myscoutee.common.dto.SharedDtos.PricingPromoCodeDto;
import com.raxim.myscoutee.common.dto.SharedDtos.SubEventDefinitionDto;
import com.raxim.myscoutee.domain.events.repository.ActivityEventsRepository;

@org.junit.jupiter.api.Tag("standard")
class EventCheckoutPricingServiceTest {
    private ActivityEventsRepository eventsRepository;
    private EventCheckoutPricingService service;
    private com.raxim.myscoutee.domain.events.repository.ActivityMembersRepository membersRepository;

    @BeforeEach
    void setUp() {
        eventsRepository = mock(ActivityEventsRepository.class);
        membersRepository = mock(com.raxim.myscoutee.domain.events.repository.ActivityMembersRepository.class);
        I18nMessageRepository messages = mock(I18nMessageRepository.class);
        for (String language : List.of("en", "hu")) {
            I18nMessage message = new I18nMessage();
            message.setKey("event.checkout.promo.invalid"); message.setLang(language);
            message.setValue("hu".equals(language) ? "Ez a promóciós kód nem érvényes ehhez az eseményhez."
                    : "This promo code is not valid for this event.");
            when(messages.findByLang(language)).thenReturn(List.of(message));
        }
        DBMessageSource messageSource = new DBMessageSource(messages);
        service = new EventCheckoutPricingService(eventsRepository, membersRepository, new TranslationService(messageSource));
        LocaleContextHolder.setLocale(Locale.ENGLISH);
    }

    @AfterEach
    void tearDown() {
        LocaleContextHolder.resetLocaleContext();
    }

    @Test
    void paymentDeadlineUsesConfiguredHoursForBothApprovalModes() {
        ActivityEvent event = eventWithPricing(pricing(100d, false, List.of()));
        event.setStartAtIso("2026-09-25T18:00:00Z");
        event.setApprovalRequired(true);
        when(eventsRepository.findBySourceId("event-1")).thenReturn(List.of(event));
        var checkout = request(List.of(item("main", "event", null, 100d)), List.of(), List.of(), 100d);
        assertThat(service.checkoutDeadline(checkout)).isEqualTo("2026-09-25T14:00:00Z");
        event.setPaymentDeadlineHours(5);
        assertThat(service.checkoutDeadline(checkout)).isEqualTo("2026-09-25T13:00:00Z");
        event.setApprovalRequired(false);
        assertThat(service.checkoutDeadline(checkout)).isEqualTo("2026-09-25T13:00:00Z");
        event.setPaymentDeadlineEnabled(false);
        assertThat(service.checkoutDeadline(checkout)).isEqualTo("2026-09-25T18:00:00Z");
        event.setPaymentDeadlineEnabled(true);
        event.setPricing(pricing(0d, false, List.of(), false));
        assertThat(service.checkoutDeadline(checkout)).isEqualTo("2026-09-25T18:00:00Z");
    }

    @Test
    void validatesAndCanonicalizesPromoCodeWithoutConsumingIt() {
        ActivityEvent event = eventWithPricing(pricing(
                100d,
                true,
                List.of(promo("save-ten", "SAVE10", "decrease_percent", 10d))));
        when(eventsRepository.findBySourceId("event-1")).thenReturn(List.of(event));

        var result = service.validatePromoCode(
                new EventCheckoutPromoCodeValidationRequestDto("event-1", "  save10  "));

        assertThat(result.valid()).isTrue();
        assertThat(result.code()).isEqualTo("SAVE10");
        assertThat(result.promoCode()).isEqualTo(promo("save-ten", "SAVE10", "decrease_percent", 10d));
        assertThat(result.effect()).isEqualTo("-10.0%");
        assertThat(result.message()).isNull();
        verify(eventsRepository, never()).save(org.mockito.ArgumentMatchers.any(ActivityEvent.class));
    }

    @Test
    void unknownBlankAndDisabledPromoCodesReturnAFieldValidationResult() {
        ActivityEvent event = eventWithPricing(pricing(
                40d,
                true,
                List.of(promo("known", "KNOWN", "decrease_amount", 5d))));
        when(eventsRepository.findBySourceId("event-1")).thenReturn(List.of(event));

        var unknown = service.validatePromoCode(
                new EventCheckoutPromoCodeValidationRequestDto("event-1", "missing"));
        var blank = service.validatePromoCode(
                new EventCheckoutPromoCodeValidationRequestDto("event-1", "  "));

        assertThat(unknown.valid()).isFalse();
        assertThat(unknown.code()).isEqualTo("MISSING");
        assertThat(unknown.promoCode()).isNull();
        assertThat(unknown.message()).isEqualTo("This promo code is not valid for this event.");
        assertThat(unknown.messageKey()).isEqualTo(EventCheckoutPricingService.INVALID_PROMO_CODE_MESSAGE_KEY);
        assertThat(blank.valid()).isFalse();
        assertThat(blank.code()).isEmpty();

        ActivityEvent disabled = eventWithPricing(pricing(
                40d,
                false,
                List.of(promo("known", "KNOWN", "decrease_amount", 5d))));
        when(eventsRepository.findBySourceId("event-1")).thenReturn(List.of(disabled));

        var disabledResult = service.validatePromoCode(
                new EventCheckoutPromoCodeValidationRequestDto("event-1", "known"));

        assertThat(disabledResult.valid()).isFalse();
        assertThat(disabledResult.code()).isEqualTo("KNOWN");
    }

    @Test
    void invalidPromoCodeUsesTheRequestLocaleAndSharedBundleKey() {
        LocaleContextHolder.setLocale(Locale.forLanguageTag("hu"));
        ActivityEvent event = eventWithPricing(pricing(40d, true, List.of()));
        when(eventsRepository.findBySourceId("event-1")).thenReturn(List.of(event));

        var result = service.validatePromoCode(
                new EventCheckoutPromoCodeValidationRequestDto("event-1", "missing"));

        assertThat(result.valid()).isFalse();
        assertThat(result.messageKey()).isEqualTo("event.checkout.promo.invalid");
        assertThat(result.message()).isEqualTo("Ez a promóciós kód nem érvényes ehhez az eseményhez.");
    }

    @Test
    void promoValidationResolvesGeneratedSlotToCurrentParentDefinition() {
        ActivityEvent parent = eventWithPricing(pricing(
                45d,
                true,
                List.of(promo("vip", "VIP", "decrease_amount", 5d))));
        ActivityEvent generatedSlot = new ActivityEvent();
        generatedSlot.setSourceId("event-1:slot:morning");
        generatedSlot.setParentEventId("event-1");
        generatedSlot.setGenerated(true);
        when(eventsRepository.findBySourceId("event-1:slot:morning")).thenReturn(List.of(generatedSlot));
        when(eventsRepository.findBySourceId("event-1")).thenReturn(List.of(parent));

        var result = service.validatePromoCode(
                new EventCheckoutPromoCodeValidationRequestDto("event-1:slot:morning", "vip"));

        assertThat(result.valid()).isTrue();
        assertThat(result.code()).isEqualTo("VIP");
        assertThat(result.effect()).isEqualTo("-5.0");
    }

    @Test
    void promoValidationTreatsMissingEventAsARealRequestFailure() {
        when(eventsRepository.findBySourceId("missing-event")).thenReturn(List.of());

        assertThatThrownBy(() -> service.validatePromoCode(
                new EventCheckoutPromoCodeValidationRequestDto("missing-event", "SAVE10")))
                .isInstanceOfSatisfying(ResponseStatusException.class,
                        exception -> assertThat(exception.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND));
    }

    @Test
    void canonicalQuoteReplacesForgedMainAndOptionalAmountsAndStacksDistinctCodes() {
        ActivityEvent event = eventWithPricing(pricing(
                100d,
                true,
                List.of(
                        promo("save-ten", "SAVE10", "decrease_percent", 10d),
                        promo("less-five", "LESS5", "decrease_amount", 5d))));
        event.setSubEventsEnabled(true);
        event.setSubEventDefinitions(List.of(optionalDefinition("afterparty", 20d)));
        when(eventsRepository.findBySourceId("event-1")).thenReturn(List.of(event));

        EventCheckoutRequestDto forged = request(
                List.of(
                        item("event:event-1", "event", null, 0.01d),
                        item("subevent:afterparty", "sub_event", "afterparty", 999d)),
                List.of("afterparty"),
                List.of(" save10 ", "SAVE10", "less5"),
                0.01d);

        EventCheckoutRequestDto quote = service.reprice(forged);

        assertThat(quote.appliedPromoCodes()).containsExactly("SAVE10", "LESS5");
        assertThat(quote.totalAmount()).isEqualTo(105d);
        assertThat(quote.lineItems()).extracting(item -> item.amount())
                .containsExactly(85d, 20d);
        assertThat(quote.basketItems()).extracting(EventCheckoutBasketItemDto::amount)
                .containsExactly(85d, 20d);
        assertThat(quote.pricingSummaryRows())
                .filteredOn(row -> row.key().startsWith("promo:"))
                .extracting(row -> row.key(), row -> row.label(), row -> row.amount())
                .containsExactly(
                        org.assertj.core.groups.Tuple.tuple("promo:save-ten", "pricing.promo.code", -10d),
                        org.assertj.core.groups.Tuple.tuple("promo:less-five", "pricing.promo.code", -5d));
    }

    @Test
    void promoDiscountIsClampedAtZero() {
        ActivityEvent event = eventWithPricing(pricing(
                30d,
                true,
                List.of(promo("free", "FREE", "decrease_amount", 500d))));
        when(eventsRepository.findBySourceId("event-1")).thenReturn(List.of(event));

        EventCheckoutRequestDto quote = service.reprice(request(
                List.of(item("event:event-1", "event", null, 999d)),
                List.of(),
                List.of("free"),
                999d));

        assertThat(quote.totalAmount()).isZero();
        assertThat(quote.basketItems()).singleElement().satisfies(item -> {
            assertThat(item.amount()).isZero();
            assertThat(item.pricingSummaryRows())
                    .filteredOn(row -> row.key().equals("promo:free"))
                    .extracting(row -> row.amount())
                    .containsExactly(-30d);
        });
    }

    @Test
    void unknownOrDisabledPromoCodeIsRejectedAsStale() {
        ActivityEvent unknownCodeEvent = eventWithPricing(pricing(
                40d,
                true,
                List.of(promo("known", "KNOWN", "decrease_percent", 10d))));
        when(eventsRepository.findBySourceId("event-1")).thenReturn(List.of(unknownCodeEvent));

        assertUnprocessable(() -> service.reprice(request(
                List.of(item("event:event-1", "event", null, 40d)),
                List.of(),
                List.of("missing"),
                40d)));

        ActivityEvent disabledEvent = eventWithPricing(pricing(
                40d,
                false,
                List.of(promo("known", "KNOWN", "decrease_percent", 10d))));
        when(eventsRepository.findBySourceId("event-1")).thenReturn(List.of(disabledEvent));

        assertUnprocessable(() -> service.reprice(request(
                List.of(item("event:event-1", "event", null, 40d)),
                List.of(),
                List.of("known"),
                40d)));
    }

    @Test
    void legacyResourceOnlyCheckoutIsLeftUntouchedWhenSourceIsNotAnEvent() {
        when(eventsRepository.findBySourceId("asset-1")).thenReturn(List.of());
        EventCheckoutRequestDto resourceRequest = new EventCheckoutRequestDto(
                "user-1",
                "asset-1",
                null,
                List.of(),
                List.of(),
                List.of(),
                List.of(),
                List.of(),
                "draft",
                List.of(new EventCheckoutLineItemDto(
                        "asset-ticket",
                        "resource",
                        "Kayak",
                        "One booking",
                        15d,
                        "EUR")),
                15d,
                "EUR",
                null,
                List.of());

        assertThat(service.reprice(resourceRequest)).isSameAs(resourceRequest);
    }

    @Test
    void globallyDisabledPricingProducesAFreeCanonicalQuote() {
        ActivityEvent event = eventWithPricing(pricing(
                250d,
                true,
                List.of(promo("save", "SAVE", "decrease_percent", 10d)),
                false));
        when(eventsRepository.findBySourceId("event-1")).thenReturn(List.of(event));

        EventCheckoutRequestDto quote = service.reprice(request(
                List.of(item("event:event-1", "event", null, 0.01d)),
                List.of(),
                List.of(),
                0.01d));

        assertThat(quote.totalAmount()).isZero();
        assertThat(quote.lineItems()).singleElement().satisfies(item -> assertThat(item.amount()).isZero());
        assertThat(quote.pricingSummaryRows()).isEmpty();

        assertUnprocessable(() -> service.reprice(request(
                List.of(item("event:event-1", "event", null, 0.01d)),
                List.of(),
                List.of("SAVE"),
                0.01d)));
    }

    @Test
    void everySelectedMainSlotAndItsOptionalItemIsRepricedWithoutCollapsingTheBasket() {
        ActivityEvent event = eventWithPricing(pricing(
                100d,
                true,
                List.of(promo("save-ten", "SAVE10", "decrease_percent", 10d))));
        event.setSubEventsEnabled(true);
        event.setSubEventDefinitions(List.of(optionalDefinition("afterparty", 20d)));
        event.setUpcomingSlots(List.of(
                slot("slot-a", "morning", "2099-01-01T09:00:00Z"),
                slot("slot-b", "evening", "2099-01-02T18:00:00Z")));
        when(eventsRepository.findBySourceId("event-1")).thenReturn(List.of(event));

        EventCheckoutRequestDto forged = request(
                List.of(
                        item("event:event-1:slot-a", "event", null, "slot-a", 0.01d),
                        item("subevent:afterparty:slot-a", "sub_event", "afterparty", "slot-a", 999d),
                        item("event:event-1:slot-b", "event", null, "slot-b", 0.02d),
                        item("subevent:afterparty:slot-b", "sub_event", "afterparty", "slot-b", 888d)),
                List.of("afterparty"),
                List.of("SAVE10"),
                0.03d);

        EventCheckoutRequestDto quote = service.reprice(forged);

        assertThat(quote.basketItems())
                .extracting(EventCheckoutBasketItemDto::id)
                .containsExactly(
                        "event:event-1:slot-a",
                        "subevent:afterparty:slot-a",
                        "event:event-1:slot-b",
                        "subevent:afterparty:slot-b");
        assertThat(quote.basketItems())
                .extracting(EventCheckoutBasketItemDto::amount)
                .containsExactly(90d, 20d, 90d, 20d);
        assertThat(quote.lineItems()).hasSize(4);
        assertThat(quote.totalAmount()).isEqualTo(220d);
        assertThat(quote.basketItems())
                .filteredOn(item -> "event".equals(item.kind()))
                .allSatisfy(item -> assertThat(item.pricingSummaryRows())
                        .filteredOn(row -> row.key().equals("promo:save-ten"))
                        .hasSize(1));
    }

    @Test
    void generatedSlotSourceIsCanonicalizedToItsParentAndRepriced() {
        ActivityEvent parent = eventWithPricing(pricing(45d, true, List.of()));
        ActivityEvent generatedSlot = new ActivityEvent();
        generatedSlot.setSourceId("event-1:slot:morning:2099-01-01T12:00:00Z");
        generatedSlot.setParentEventId("event-1");
        generatedSlot.setSlotTemplateId("morning");
        generatedSlot.setGenerated(true);
        generatedSlot.setEventType("slot");
        generatedSlot.setTitle("Canonical Event");
        generatedSlot.setTimeframe("Jan 1, 12:00 - 14:00");
        generatedSlot.setStartAtIso("2099-01-01T12:00:00Z");
        generatedSlot.setEndAtIso("2099-01-01T14:00:00Z");
        generatedSlot.setCapacityTotal(10);
        generatedSlot.setAcceptedMembers(2);
        String generatedSourceId = generatedSlot.getSourceId();
        when(eventsRepository.findBySourceId(generatedSourceId)).thenReturn(List.of(generatedSlot));
        when(eventsRepository.findBySourceId("event-1")).thenReturn(List.of(parent));

        EventCheckoutRequestDto generatedRequest = new EventCheckoutRequestDto(
                "user-1",
                generatedSourceId,
                null,
                List.of(),
                List.of(),
                List.of(),
                List.of(),
                List.of(),
                "confirmed",
                List.of(),
                0.01d,
                "USD",
                null,
                List.of());

        EventCheckoutRequestDto quote = service.reprice(generatedRequest);

        assertThat(quote.sourceId()).isEqualTo("event-1");
        assertThat(quote.slotSourceId()).isEqualTo(generatedSourceId);
        assertThat(quote.totalAmount()).isEqualTo(45d);
        assertThat(quote.basketItems()).singleElement().satisfies(item -> {
            assertThat(item.sourceId()).isEqualTo("event-1");
            assertThat(item.slotSourceId()).isEqualTo(generatedSourceId);
            assertThat(item.slotTemplateId()).isEqualTo("morning");
            assertThat(item.amount()).isEqualTo(45d);
        });
    }

    private void assertUnprocessable(org.assertj.core.api.ThrowableAssert.ThrowingCallable action) {
        assertThatThrownBy(action)
                .isInstanceOfSatisfying(ResponseStatusException.class,
                        exception -> assertThat(exception.getStatusCode()).isEqualTo(HttpStatus.UNPROCESSABLE_ENTITY));
    }

    private ActivityEvent eventWithPricing(PricingConfigDto pricing) {
        ActivityEvent event = new ActivityEvent();
        event.setId("event-1-document");
        event.setSourceId("event-1");
        event.setOwnerUserId("host-1");
        event.setCreatorUserId("host-1");
        event.setStatus(ActivityEvent.STATUS_ACTIVE);
        event.setGenerated(false);
        event.setTitle("Canonical Event");
        event.setTimeframe("Tomorrow");
        event.setStartAtIso("2099-01-01T12:00:00Z");
        event.setEndAtIso("2099-01-01T14:00:00Z");
        event.setCapacityTotal(10);
        event.setAcceptedMembers(2);
        event.setPricing(pricing);
        return event;
    }

    private EventCheckoutRequestDto request(
            List<EventCheckoutBasketItemDto> items,
            List<String> optionalIds,
            List<String> promoCodes,
            double forgedTotal) {
        return new EventCheckoutRequestDto(
                "user-1",
                "event-1",
                null,
                optionalIds,
                List.of(),
                List.of(),
                items,
                List.of(),
                "confirmed",
                List.of(),
                forgedTotal,
                "USD",
                null,
                promoCodes);
    }

    private EventCheckoutBasketItemDto item(String id, String kind, String subEventId, double amount) {
        return item(id, kind, subEventId, null, amount);
    }

    private EventCheckoutBasketItemDto item(
            String id,
            String kind,
            String subEventId,
            String slotSourceId,
            double amount) {
        return new EventCheckoutBasketItemDto(
                id,
                kind,
                "event-1",
                slotSourceId,
                null,
                null,
                subEventId,
                null,
                "Forged label",
                "Forged detail",
                amount,
                "USD",
                1,
                "confirmed",
                "pending",
                List.of(),
                null,
                null,
                null,
                null);
    }

    private EventSlotOccurrenceDto slot(String id, String slotTemplateId, String startAtIso) {
        return new EventSlotOccurrenceDto(
                id,
                "event-1",
                slotTemplateId,
                "Canonical Event",
                startAtIso,
                startAtIso,
                startAtIso,
                10,
                2,
                0);
    }

    private SubEventDefinitionDto optionalDefinition(String id, double amount) {
        return new SubEventDefinitionDto(
                id,
                "Afterparty",
                "Optional event",
                "After",
                0,
                60,
                null,
                null,
                null,
                null,
                null,
                true,
                pricing(amount, false, List.of()),
                0,
                20,
                null);
    }

    private PricingConfigDto pricing(
            double basePrice,
            boolean audienceEnabled,
            List<PricingPromoCodeDto> promoCodes) {
        return pricing(basePrice, audienceEnabled, promoCodes, true);
    }

    private PricingConfigDto pricing(
            double basePrice,
            boolean audienceEnabled,
            List<PricingPromoCodeDto> promoCodes,
            boolean enabled) {
        return new PricingConfigDto(
                "fixed",
                basePrice,
                "USD",
                "excluded",
                "per_attendee",
                false,
                List.of(),
                null,
                null,
                "none",
                false,
                List.of(),
                false,
                List.of(),
                new PricingCancellationPolicyDto(false, List.of()),
                false,
                List.of(),
                new PricingAudienceSettingsDto(
                        audienceEnabled,
                        null,
                        null,
                        null,
                        promoCodes,
                        "Sold out"),
                enabled);
    }

    private PricingPromoCodeDto promo(String id, String code, String kind, double value) {
        return new PricingPromoCodeDto(id, code, new PricingActionDto(kind, value));
    }
}
