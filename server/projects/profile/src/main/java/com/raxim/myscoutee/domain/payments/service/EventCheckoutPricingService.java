package com.raxim.myscoutee.domain.payments.service;

import com.raxim.myscoutee.domain.localization.api.Translations;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.domain.events.api.EventOwnership.Event;
import com.raxim.myscoutee.domain.events.dto.EventsDtos.EventCheckoutBasketItemDto;
import com.raxim.myscoutee.domain.events.dto.EventsDtos.EventCheckoutLineItemDto;
import com.raxim.myscoutee.domain.events.dto.EventsDtos.EventCheckoutPromoCodeValidationRequestDto;
import com.raxim.myscoutee.domain.events.dto.EventsDtos.EventCheckoutPromoCodeValidationResultDto;
import com.raxim.myscoutee.domain.events.dto.EventsDtos.EventCheckoutPricingSummaryRowDto;
import com.raxim.myscoutee.domain.events.dto.EventsDtos.EventCheckoutRequestDto;
import com.raxim.myscoutee.common.dto.SharedDtos.EventSlotOccurrenceDto;
import com.raxim.myscoutee.common.dto.SharedDtos.EventSlotTemplateDto;
import com.raxim.myscoutee.common.dto.SharedDtos.PricingActionDto;
import com.raxim.myscoutee.common.dto.SharedDtos.PricingConfigDto;
import com.raxim.myscoutee.common.dto.SharedDtos.PricingDemandRuleDto;
import com.raxim.myscoutee.common.dto.SharedDtos.PricingPromoCodeDto;
import com.raxim.myscoutee.common.dto.SharedDtos.PricingSlotOverrideDto;
import com.raxim.myscoutee.common.dto.SharedDtos.PricingTimeRuleDto;
import com.raxim.myscoutee.common.dto.SharedDtos.SubEventDefinitionDto;
import com.raxim.myscoutee.domain.events.api.EventOwnership;
import com.raxim.myscoutee.domain.events.api.MemberDirectory;

/**
 * Rebuilds event checkout prices from the current event definition. Client
 * amounts and promo actions are display hints only and never reach a payment
 * processor without passing through this service.
 */
@Service
public class EventCheckoutPricingService implements com.raxim.myscoutee.domain.payments.api.ServiceSlotPricing, com.raxim.myscoutee.domain.payments.api.CheckoutPricing {
    public static final String INVALID_PROMO_CODE_MESSAGE_KEY = "event.checkout.promo.invalid";

    private final EventOwnership activityEventsRepository;
    private final Translations translationService;
    private final MemberDirectory activityMembersRepository;

    public EventCheckoutPricingService(
            EventOwnership activityEventsRepository,
            MemberDirectory activityMembersRepository,
            Translations translationService) {
        this.activityEventsRepository = activityEventsRepository;
        this.activityMembersRepository = activityMembersRepository;
        this.translationService = translationService;
    }

    public PricingConfigDto vipPricingOffer(String sourceId, String userId) {
        Event parent = resolveParentEvent(sourceId);
        return parent == null ? null : storedVipOffer(parent.getSourceId(), userId);
    }

    private PricingConfigDto storedVipOffer(String sourceId, String userId) {
        return activityMembersRepository.vipPricingOffer(normalizeId(sourceId), normalizeId(userId));
    }

    /**
     * Verifies a promo code against the event's current pricing definition. This
     * operation is intentionally read-only: applying/consuming a code remains part
     * of the checkout/payment flow.
     */
    public EventCheckoutPromoCodeValidationResultDto validatePromoCode(
            EventCheckoutPromoCodeValidationRequestDto request) {
        if (request == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Promo code validation request is required.");
        }
        String sourceId = normalizeId(request.sourceId());
        if (!StringUtils.hasText(sourceId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Checkout event is required.");
        }

        Event parent = resolveParentEvent(sourceId);
        if (parent == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Checkout event was not found.");
        }

        String code = normalizePromoCode(request.code());
        PricingConfigDto pricing = parent.getPricing();
        if (!StringUtils.hasText(code) || !promoCodesEnabled(pricing)) {
            return invalidPromoCodeResult(code);
        }
        PricingPromoCodeDto configured = configuredPromoCodes(pricing).get(code);
        if (configured == null) {
            return invalidPromoCodeResult(code);
        }

        PricingPromoCodeDto canonical = new PricingPromoCodeDto(
                normalizeId(configured.id()),
                code,
                configured.action());
        return new EventCheckoutPromoCodeValidationResultDto(
                true,
                code,
                canonical,
                describeAction(canonical.action()),
                null,
                null);
    }

    /** Canonical payment cutoff; neither client deadlines nor approval time extend it. */
    public String checkoutDeadline(EventCheckoutRequestDto request) {
        Event parent = resolveParentEvent(normalizeId(request.sourceId()));
        if (parent == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Checkout event was not found.");
        }
        var slotIds = new LinkedHashSet<String>();
        for (var item : incomingItems(request)) {
            String slotId = normalizeId(firstText(item.slotSourceId(), request.slotSourceId()));
            slotIds.add(slotId == null ? "" : slotId);
        }
        if (slotIds.isEmpty()) slotIds.add("");
        Instant earliest = null;
        for (String slotId : slotIds) {
            var slot = resolveSlot(parent, slotId);
            String startAt = slot == null ? parent.getStartAtIso() : slot.startAtIso();
            long startMillis = sortableDate(startAt);
            if (startMillis <= 0) {
                throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Checkout event start time is required.");
            }
            Instant start = Instant.ofEpochMilli(startMillis);
            if (earliest == null || start.isBefore(earliest)) earliest = start;
        }
        int leadHours = parent.getPricing() != null && !Boolean.FALSE.equals(parent.getPricing().enabled())
                && !Boolean.FALSE.equals(parent.getPaymentDeadlineEnabled())
                ? Math.max(0, parent.getPaymentDeadlineHours() == null ? 4 : parent.getPaymentDeadlineHours()) : 0;
        return earliest.minus(java.time.Duration.ofHours(leadHours)).toString();
    }

    public EventCheckoutRequestDto reprice(EventCheckoutRequestDto request) {
        if (request == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Checkout request is required.");
        }
        String sourceId = normalizeId(request.sourceId());
        if (!StringUtils.hasText(sourceId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Checkout event is required.");
        }

        Event parent = resolveParentEvent(sourceId);
        if (parent == null) {
            if (hasEventCheckoutItems(request)) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Checkout event was not found.");
            }
            return request;
        }
        if (StringUtils.hasText(parent.getCancelledAtIso())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This event has been cancelled.");
        }
        String canonicalSourceId = normalizeId(parent.getSourceId());
        String generatedSlotSourceId = !sourceId.equals(canonicalSourceId) ? sourceId : null;
        List<EventCheckoutBasketItemDto> incomingItems = incomingItems(request);
        List<EventCheckoutBasketItemDto> incomingMainItems = incomingItems.stream()
                .filter(item -> "event".equals(safeText(item.kind())))
                .toList();
        PricingConfigDto vipOffer = storedVipOffer(parent.getSourceId(), request.userId());
        List<String> appliedPromoCodes = normalizePromoCodes(request.appliedPromoCodes());
        List<MainQuote> mainQuotes = new ArrayList<>();
        for (EventCheckoutBasketItemDto incomingMain : incomingMainItems) {
            String requestedSlotSourceId = firstText(
                    incomingMain.slotSourceId(),
                    request.slotSourceId(),
                    generatedSlotSourceId);
            mainQuotes.add(quoteMainItem(
                    request,
                    parent,
                    incomingMain,
                    requestedSlotSourceId,
                    appliedPromoCodes, vipOffer));
        }
        if (mainQuotes.isEmpty()) {
            LinkedHashSet<String> derivedSlotSourceIds = new LinkedHashSet<>();
            incomingItems.stream()
                    .filter(item -> "sub_event".equals(safeText(item.kind())))
                    .map(EventCheckoutBasketItemDto::slotSourceId)
                    .map(this::normalizeId)
                    .filter(StringUtils::hasText)
                    .forEach(derivedSlotSourceIds::add);
            if (derivedSlotSourceIds.isEmpty()) {
                derivedSlotSourceIds.add(firstText(request.slotSourceId(), generatedSlotSourceId));
            }
            for (String derivedSlotSourceId : derivedSlotSourceIds) {
                mainQuotes.add(quoteMainItem(
                        request,
                        parent,
                        null,
                        derivedSlotSourceId,
                        appliedPromoCodes, vipOffer));
            }
        }

        PricingSnapshot mainPricing = mainQuotes.get(0).pricing();
        String canonicalSlotSourceId = mainQuotes.stream()
                .map(MainQuote::slotSourceId)
                .filter(StringUtils::hasText)
                .findFirst()
                .orElse(null);
        List<EventCheckoutBasketItemDto> canonicalItems = new ArrayList<>();
        LinkedHashSet<String> selectedOptionalIds = selectedOptionalIds(request);
        LinkedHashSet<String> representedOptionalIds = new LinkedHashSet<>();
        int mainQuoteIndex = 0;
        if (incomingMainItems.isEmpty()) {
            mainQuotes.stream().map(MainQuote::item).forEach(canonicalItems::add);
        }
        for (EventCheckoutBasketItemDto incoming : incomingItems) {
            String kind = safeText(incoming.kind());
            if ("event".equals(kind)) {
                canonicalItems.add(mainQuotes.get(mainQuoteIndex).item());
                mainQuoteIndex += 1;
                continue;
            }
            if ("sub_event".equals(kind)) {
                String optionalId = normalizeId(incoming.subEventId());
                if (!StringUtils.hasText(optionalId)) {
                    throw optionalEventUnavailable();
                }
                MainQuote mainQuote = mainQuoteForOptional(mainQuotes, incoming.slotSourceId());
                canonicalItems.add(quoteOptionalItem(request, parent, incoming, optionalId, mainQuote, mainPricing.currency()));
                representedOptionalIds.add(optionalId);
                continue;
            }
            if ("resource".equals(kind)) {
                EventCheckoutBasketItemDto resource = canonicalResourceItem(request, parent, incoming, mainPricing.currency());
                if (resource != null) {
                    canonicalItems.add(resource);
                }
            }
        }

        for (String optionalId : selectedOptionalIds) {
            if (representedOptionalIds.contains(optionalId)) {
                continue;
            }
            if (mainQuotes.size() != 1) {
                throw new ResponseStatusException(
                        HttpStatus.UNPROCESSABLE_ENTITY,
                        "An optional event selection is missing its event slot.");
            }
            canonicalItems.add(quoteOptionalItem(
                    request,
                    parent,
                    null,
                    optionalId,
                    mainQuotes.get(0),
                    mainPricing.currency()));
        }

        String currency = mainPricing.currency();
        for (EventCheckoutBasketItemDto item : canonicalItems) {
            if (item == null || item.amount() == null || item.amount() <= 0d) {
                continue;
            }
            if (!currency.equalsIgnoreCase(firstText(item.currency(), currency))) {
                throw new ResponseStatusException(
                        HttpStatus.UNPROCESSABLE_ENTITY,
                        "Checkout items must use one currency.");
            }
        }

        List<EventCheckoutLineItemDto> lineItems = canonicalItems.stream()
                .map(this::toLineItem)
                .toList();
        double totalAmount = roundMoney(lineItems.stream()
                .map(EventCheckoutLineItemDto::amount)
                .filter(Objects::nonNull)
                .mapToDouble(Double::doubleValue)
                .sum());
        List<EventCheckoutPricingSummaryRowDto> pricingRows = canonicalItems.stream()
                .flatMap(item -> (item.pricingSummaryRows() == null
                        ? List.<EventCheckoutPricingSummaryRowDto>of()
                        : item.pricingSummaryRows()).stream())
                .toList();

        return new EventCheckoutRequestDto(
                normalizeId(request.userId()),
                canonicalSourceId,
                canonicalSlotSourceId,
                List.copyOf(selectedOptionalIds),
                request.assetSelections() == null ? List.of() : List.copyOf(request.assetSelections()),
                normalizeIds(request.acceptedPolicyIds()),
                List.copyOf(canonicalItems),
                pricingRows,
                safeText(request.checkoutState()),
                lineItems,
                totalAmount,
                currency,
                request.pendingReason(),
                appliedPromoCodes,
                request.paymentMethodId());
    }

    private MainQuote quoteMainItem(
            EventCheckoutRequestDto request,
            Event parent,
            EventCheckoutBasketItemDto incoming,
            String requestedSlotSourceId,
            List<String> appliedPromoCodes,
            PricingConfigDto vipOffer) {
        EventSlotOccurrenceDto slot = resolveSlot(parent, requestedSlotSourceId);
        String slotSourceId = firstText(slot == null ? null : slot.id(), requestedSlotSourceId);
        String slotTemplateId = normalizeId(slot == null ? null : slot.slotTemplateId());
        PricingConfigDto offeredPricing = vipOffer == null ? parent.getPricing() : vipOffer;
        PricingSnapshot pricing = calculatePricing(
                offeredPricing,
                parent,
                slot,
                slotTemplateId,
                StringUtils.hasText(slotTemplateId) ? "base:" + slotTemplateId : "base",
                StringUtils.hasText(slotTemplateId) ? "pricing.slot.base.price" : "pricing.base.price", vipOffer != null);
        pricing = applyPromoCodes(pricing, parent.getPricing(), appliedPromoCodes, offeredPricing);
        EventCheckoutBasketItemDto item = canonicalMainItem(
                request,
                parent,
                incoming,
                slot,
                slotSourceId,
                slotTemplateId,
                pricing);
        return new MainQuote(item, slot, slotSourceId, slotTemplateId, pricing);
    }

    private EventCheckoutBasketItemDto quoteOptionalItem(
            EventCheckoutRequestDto request,
            Event parent,
            EventCheckoutBasketItemDto incoming,
            String optionalId,
            MainQuote mainQuote,
            String fallbackCurrency) {
        Map<String, SubEventDefinitionDto> definitions = optionalDefinitions(parent, mainQuote.slotTemplateId());
        SubEventDefinitionDto definition = definitions.get(optionalId);
        if (definition == null || !Boolean.TRUE.equals(definition.optional())) {
            throw optionalEventUnavailable();
        }
        PricingSnapshot pricing = calculatePricing(
                definition.pricing(),
                parent,
                mainQuote.slot(),
                null,
                "subevent:" + optionalId + ":base",
                firstText(definition.name(), "event.checkout.optional.sub.event"), false);
        pricing = finishRounding(pricing, definition.pricing(), "rounding");
        if (definition.pricing() == null) {
            pricing = new PricingSnapshot(pricing.amount(), fallbackCurrency, pricing.rows());
        }
        return canonicalOptionalItem(
                request,
                parent,
                definition,
                incoming,
                mainQuote.slot(),
                mainQuote.slotSourceId(),
                mainQuote.slotTemplateId(),
                pricing);
    }

    private MainQuote mainQuoteForOptional(List<MainQuote> mainQuotes, String requestedSlotSourceId) {
        String slotSourceId = normalizeId(requestedSlotSourceId);
        if (StringUtils.hasText(slotSourceId)) {
            return mainQuotes.stream()
                    .filter(item -> slotSourceId.equals(normalizeId(item.slotSourceId())))
                    .findFirst()
                    .orElseThrow(this::optionalEventUnavailable);
        }
        if (mainQuotes.size() == 1) {
            return mainQuotes.get(0);
        }
        throw new ResponseStatusException(
                HttpStatus.UNPROCESSABLE_ENTITY,
                "An optional event selection is missing its event slot.");
    }

    private Event resolveParentEvent(String sourceId) {
        List<? extends Event> records = safeEvents(activityEventsRepository.findBySourceId(sourceId));
        Event selected = records.stream().map(Event.class::cast)
                .filter(Objects::nonNull)
                .filter(item -> !isGeneratedSlot(item))
                .max(Comparator.comparingInt(this::eventDefinitionPriority))
                .orElseGet(() -> records.stream().filter(Objects::nonNull).findFirst().orElse(null));
        if (selected != null && isGeneratedSlot(selected) && StringUtils.hasText(normalizeId(selected.getParentEventId()))) {
            String parentId = normalizeId(selected.getParentEventId());
            selected = safeEvents(activityEventsRepository.findBySourceId(parentId)).stream()
                    .filter(Objects::nonNull)
                    .filter(item -> !isGeneratedSlot(item))
                    .max(Comparator.comparingInt(this::eventDefinitionPriority))
                    .orElse(null);
        }
        return selected;
    }

    private boolean hasEventCheckoutItems(EventCheckoutRequestDto request) {
        return incomingItems(request).stream()
                .map(EventCheckoutBasketItemDto::kind)
                .map(this::safeText)
                .anyMatch(kind -> "event".equals(kind) || "sub_event".equals(kind));
    }

    private int eventDefinitionPriority(Event event) {
        int priority = event != null && event.getPricing() != null ? 4 : 0;
        if (event != null && normalizeId(event.getOwnerUserId()) != null
                && normalizeId(event.getOwnerUserId()).equals(normalizeId(event.getCreatorUserId()))) {
            priority += 2;
        }
        if (event != null && "A".equals(event.getStatus())) {
            priority += 1;
        }
        return priority;
    }

    private EventSlotOccurrenceDto resolveSlot(Event parent, String slotSourceId) {
        String normalizedSlotId = normalizeId(slotSourceId);
        if (!StringUtils.hasText(normalizedSlotId)) {
            return null;
        }
        EventSlotOccurrenceDto occurrence = (parent.getUpcomingSlots() == null
                ? List.<EventSlotOccurrenceDto>of()
                : parent.getUpcomingSlots()).stream()
                .filter(Objects::nonNull)
                .filter(item -> normalizedSlotId.equals(normalizeId(item.id())))
                .findFirst()
                .orElse(null);
        if (occurrence != null) {
            return occurrence;
        }
        Event slotRecord = safeEvents(activityEventsRepository.findBySourceId(normalizedSlotId)).stream()
                .filter(Objects::nonNull)
                .filter(this::isGeneratedSlot)
                .findFirst()
                .orElse(null);
        if (slotRecord == null
                || !Objects.equals(normalizeId(parent.getSourceId()), normalizeId(slotRecord.getParentEventId()))) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "The selected event slot is no longer available.");
        }
        return new EventSlotOccurrenceDto(
                normalizedSlotId,
                normalizeId(parent.getSourceId()),
                normalizeId(slotRecord.getSlotTemplateId()),
                firstText(slotRecord.getTitle(), parent.getTitle()),
                firstText(slotRecord.getTimeframe(), parent.getTimeframe()),
                firstText(slotRecord.getStartAtIso(), parent.getStartAtIso()),
                firstText(slotRecord.getEndAtIso(), parent.getEndAtIso()),
                normalizeCount(slotRecord.getCapacityTotal()),
                normalizeCount(slotRecord.getAcceptedMembers()),
                normalizeCount(slotRecord.getPendingMembers()));
    }

    private PricingSnapshot calculatePricing(
            PricingConfigDto pricing,
            Event parent,
            EventSlotOccurrenceDto slot,
            String requestedSlotTemplateId,
            String baseKey,
            String baseLabel,
            boolean vipEligible) {
        return calculateSlotPricing(pricing, requestedSlotTemplateId, slot == null ? null : slot.slotTemplateId(),
                slot == null ? parent.getCapacityTotal() : slot.capacityTotal(),
                slot == null ? parent.getAcceptedMembers() : slot.acceptedMembers(),
                firstText(slot == null ? null : slot.startAtIso(), parent.getStartAtIso()), baseKey, baseLabel, vipEligible);
    }

    /** Shared pricing definition for a service appointment; no event or payment is created. */
    public PricingSnapshot quoteServiceSlot(PricingConfigDto pricing, String templateId, String startAtIso, int occupied) {
        return finishRounding(calculateSlotPricing(pricing, templateId, templateId, 1, occupied, startAtIso,
                "base", "pricing.base.price", false), pricing, "rounding");
    }

    private PricingSnapshot calculateSlotPricing(PricingConfigDto pricing, String requestedSlotTemplateId,
            String occurrenceTemplateId, Integer capacity, Integer accepted, String startsAt,
            String baseKey, String baseLabel, boolean vipEligible) {
        String currency = pricingCurrency(pricing);
        if (pricing == null || Boolean.FALSE.equals(pricing.enabled())) {
            return new PricingSnapshot(0d, currency, List.of());
        }

        String slotTemplateId = firstText(requestedSlotTemplateId, occurrenceTemplateId);
        double basePrice = Math.max(0d, safeDouble(pricing.basePrice()));
        if (Boolean.TRUE.equals(pricing.slotPricingEnabled()) && StringUtils.hasText(slotTemplateId)) {
            basePrice = (pricing.slotOverrides() == null ? List.<PricingSlotOverrideDto>of() : pricing.slotOverrides()).stream()
                    .filter(Objects::nonNull)
                    .filter(item -> slotTemplateId.equals(normalizeId(item.slotId())))
                    .map(PricingSlotOverrideDto::price)
                    .filter(Objects::nonNull)
                    .findFirst()
                    .map(value -> Math.max(0d, safeDouble(value)))
                    .orElse(basePrice);
        }

        boolean vipAudience = vipEligible && pricing.audience() != null
                && Boolean.TRUE.equals(pricing.audience().enabled());
        if (vipAudience && pricing.audience().vipPrice() != null) {
            basePrice = Math.max(0d, safeDouble(pricing.audience().vipPrice()));
            baseLabel = "pricing.vip.price";
        }
        List<EventCheckoutPricingSummaryRowDto> rows = new ArrayList<>();
        rows.add(new EventCheckoutPricingSummaryRowDto(
                firstText(baseKey, "base"),
                firstText(baseLabel, "pricing.base.price"),
                null,
                roundMoney(basePrice),
                currency,
                1));
        double nextPrice = basePrice;
        int capacityTotal = normalizeCount(capacity);
        int acceptedMembers = normalizeCount(accepted);
        int filledPercent = capacityTotal > 0
                ? (int) Math.round((acceptedMembers / (double) capacityTotal) * 100d)
                : 0;
        double hoursUntilStart = hoursUntilStart(startsAt);

        if (!vipAudience && pricingModeMatches(pricing.mode(), "demand-based", "hybrid")
                && Boolean.TRUE.equals(pricing.demandRulesEnabled())) {
            for (PricingDemandRuleDto rule : pricing.demandRules() == null
                    ? List.<PricingDemandRuleDto>of()
                    : pricing.demandRules()) {
                if (!matchesDemandRule(rule, filledPercent, slotTemplateId)) {
                    continue;
                }
                double previous = nextPrice;
                nextPrice = applyAction(nextPrice, rule.action());
                rows.add(new EventCheckoutPricingSummaryRowDto(
                        "demand:" + firstText(rule.id(), "rule"),
                        "pricing.demand.adjustment",
                        describeAction(rule.action()),
                        roundMoney(nextPrice - previous),
                        currency,
                        1));
            }
        }
        if (!vipAudience && pricingModeMatches(pricing.mode(), "time-based", "hybrid")
                && Boolean.TRUE.equals(pricing.timeRulesEnabled())) {
            for (PricingTimeRuleDto rule : pricing.timeRules() == null
                    ? List.<PricingTimeRuleDto>of()
                    : pricing.timeRules()) {
                if (!matchesTimeRule(rule, hoursUntilStart, slotTemplateId, startsAt)) {
                    continue;
                }
                double previous = nextPrice;
                nextPrice = applyAction(nextPrice, rule.action());
                rows.add(new EventCheckoutPricingSummaryRowDto(
                        "time:" + firstText(rule.id(), "rule"),
                        "pricing.time.adjustment",
                        describeAction(rule.action()),
                        roundMoney(nextPrice - previous),
                        currency,
                        1));
            }
        }
        if (vipAudience && pricing.audience().inviteOnlyDiscountPercent() != null) {
            double previous = nextPrice;
            int percent = Math.max(0, Math.min(100, pricing.audience().inviteOnlyDiscountPercent()));
            nextPrice *= 1d - percent / 100d;
            if (percent > 0) {
                rows.add(new EventCheckoutPricingSummaryRowDto(
                        "invitation", "pricing.invite.discount.percent", "-" + percent + "%",
                        roundMoney(nextPrice - previous), currency, 1));
            }
        }
        if (pricing.minPrice() != null) {
            double previous = nextPrice;
            nextPrice = Math.max(Math.max(0d, safeDouble(pricing.minPrice())), nextPrice);
            if (nextPrice != previous) {
                rows.add(new EventCheckoutPricingSummaryRowDto(
                        "min-price", "pricing.minimum", null, roundMoney(nextPrice - previous), currency, 1));
            }
        }
        if (pricing.maxPrice() != null) {
            double previous = nextPrice;
            nextPrice = Math.min(Math.max(0d, safeDouble(pricing.maxPrice())), nextPrice);
            if (nextPrice != previous) {
                rows.add(new EventCheckoutPricingSummaryRowDto(
                        "max-price", "pricing.maximum", null, roundMoney(nextPrice - previous), currency, 1));
            }
        }

        return new PricingSnapshot(Math.max(0d, nextPrice), currency, List.copyOf(rows));
    }

    private PricingSnapshot applyPromoCodes(
            PricingSnapshot pricing,
            PricingConfigDto pricingConfig,
            List<String> appliedPromoCodes,
            PricingConfigDto roundingConfig) {
        if (appliedPromoCodes.isEmpty()) {
            return finishRounding(pricing, roundingConfig, "rounding");
        }
        if (!promoCodesEnabled(pricingConfig)) {
            throw invalidPromoCode();
        }
        Map<String, PricingPromoCodeDto> configuredByCode = configuredPromoCodes(pricingConfig);

        double nextPrice = pricing.amount();
        List<EventCheckoutPricingSummaryRowDto> rows = new ArrayList<>(pricing.rows());
        for (String code : appliedPromoCodes) {
            PricingPromoCodeDto promo = configuredByCode.get(code);
            if (promo == null) {
                throw invalidPromoCode();
            }
            double previous = nextPrice;
            nextPrice = applyAction(nextPrice, promo.action());
            rows.add(new EventCheckoutPricingSummaryRowDto(
                    "promo:" + firstText(promo.id(), code),
                    "pricing.promo.code",
                    describeAction(promo.action()),
                    roundMoney(nextPrice - previous),
                    pricing.currency(),
                    1));
        }
        return finishRounding(
                new PricingSnapshot(Math.max(0d, nextPrice), pricing.currency(), List.copyOf(rows)),
                roundingConfig,
                "rounding");
    }

    private boolean promoCodesEnabled(PricingConfigDto pricingConfig) {
        return pricingConfig != null
                && !Boolean.FALSE.equals(pricingConfig.enabled())
                && pricingConfig.audience() != null
                && Boolean.TRUE.equals(pricingConfig.audience().enabled());
    }

    private Map<String, PricingPromoCodeDto> configuredPromoCodes(PricingConfigDto pricingConfig) {
        Map<String, PricingPromoCodeDto> configuredByCode = new LinkedHashMap<>();
        if (!promoCodesEnabled(pricingConfig)) {
            return configuredByCode;
        }
        for (PricingPromoCodeDto configured : pricingConfig.audience().promoCodes() == null
                ? List.<PricingPromoCodeDto>of()
                : pricingConfig.audience().promoCodes()) {
            String code = normalizePromoCode(configured == null ? null : configured.code());
            if (StringUtils.hasText(code)) {
                configuredByCode.putIfAbsent(code, configured);
            }
        }
        return configuredByCode;
    }

    private EventCheckoutPromoCodeValidationResultDto invalidPromoCodeResult(String code) {
        return new EventCheckoutPromoCodeValidationResultDto(
                false,
                code,
                null,
                null,
                invalidPromoCodeMessage(),
                INVALID_PROMO_CODE_MESSAGE_KEY);
    }

    private PricingSnapshot finishRounding(PricingSnapshot pricing, PricingConfigDto config, String rowKey) {
        if (pricing == null) {
            return new PricingSnapshot(0d, pricingCurrency(config), List.of());
        }
        double roundedPrice = applyRounding(pricing.amount(), config == null ? null : config.rounding());
        if (roundedPrice == pricing.amount()) {
            return new PricingSnapshot(roundMoney(roundedPrice), pricing.currency(), pricing.rows());
        }
        List<EventCheckoutPricingSummaryRowDto> rows = new ArrayList<>(pricing.rows());
        rows.add(new EventCheckoutPricingSummaryRowDto(
                firstText(rowKey, "rounding"),
                "pricing.rounding",
                null,
                roundMoney(roundedPrice - pricing.amount()),
                pricing.currency(),
                1));
        return new PricingSnapshot(roundMoney(roundedPrice), pricing.currency(), List.copyOf(rows));
    }

    private EventCheckoutBasketItemDto canonicalMainItem(
            EventCheckoutRequestDto request,
            Event parent,
            EventCheckoutBasketItemDto incoming,
            EventSlotOccurrenceDto slot,
            String slotSourceId,
            String slotTemplateId,
            PricingSnapshot pricing) {
        return new EventCheckoutBasketItemDto(
                firstText(
                        incoming == null ? null : incoming.id(),
                        "event:" + normalizeId(parent.getSourceId()) + ":" + firstText(slotSourceId, "main")),
                "event",
                normalizeId(parent.getSourceId()),
                StringUtils.hasText(slotSourceId) ? slotSourceId : null,
                StringUtils.hasText(slotTemplateId) ? slotTemplateId : null,
                slotDateKey(slot == null ? null : slot.startAtIso(), incoming == null ? null : incoming.selectedDateKey()),
                null,
                null,
                firstText(parent.getTitle(), "Event"),
                firstText(slot == null ? null : slot.timeframe(), parent.getTimeframe()),
                pricing.amount(),
                pricing.currency(),
                1,
                firstText(incoming == null ? null : incoming.status(), request.checkoutState(), "draft"),
                firstText(incoming == null ? null : incoming.resultState(), "pending"),
                pricing.rows(),
                incoming == null ? null : incoming.checkoutSessionId(),
                incoming == null ? null : incoming.createdAtIso(),
                incoming == null ? null : incoming.updatedAtIso(),
                incoming == null ? null : incoming.expiresAtIso());
    }

    private EventCheckoutBasketItemDto canonicalOptionalItem(
            EventCheckoutRequestDto request,
            Event parent,
            SubEventDefinitionDto definition,
            EventCheckoutBasketItemDto incoming,
            EventSlotOccurrenceDto slot,
            String slotSourceId,
            String slotTemplateId,
            PricingSnapshot pricing) {
        String optionalId = normalizeId(definition.id());
        return new EventCheckoutBasketItemDto(
                firstText(
                        incoming == null ? null : incoming.id(),
                        "subevent:" + optionalId + ":" + firstText(slotSourceId, "main")),
                "sub_event",
                normalizeId(parent.getSourceId()),
                StringUtils.hasText(slotSourceId) ? slotSourceId : null,
                StringUtils.hasText(slotTemplateId) ? slotTemplateId : null,
                slotDateKey(slot == null ? null : slot.startAtIso(), incoming == null ? null : incoming.selectedDateKey()),
                optionalId,
                null,
                firstText(definition.name(), "Optional sub event"),
                firstText(definition.description(), slot == null ? null : slot.timeframe()),
                pricing.amount(),
                pricing.currency(),
                1,
                firstText(incoming == null ? null : incoming.status(), request.checkoutState(), "draft"),
                firstText(incoming == null ? null : incoming.resultState(), "pending"),
                pricing.rows(),
                incoming == null ? null : incoming.checkoutSessionId(),
                incoming == null ? null : incoming.createdAtIso(),
                incoming == null ? null : incoming.updatedAtIso(),
                incoming == null ? null : incoming.expiresAtIso());
    }

    private EventCheckoutBasketItemDto canonicalResourceItem(
            EventCheckoutRequestDto request,
            Event parent,
            EventCheckoutBasketItemDto incoming,
            String currency) {
        String id = normalizeId(incoming == null ? null : incoming.id());
        if (!StringUtils.hasText(id)) {
            return null;
        }
        return new EventCheckoutBasketItemDto(
                id,
                "resource",
                normalizeId(parent.getSourceId()),
                normalizeId(incoming.slotSourceId()),
                normalizeId(incoming.slotTemplateId()),
                safeText(incoming.selectedDateKey()),
                normalizeId(incoming.subEventId()),
                safeText(incoming.resourceType()),
                firstText(incoming.label(), "Resource request"),
                safeText(incoming.detail()),
                0d,
                currency,
                Math.max(1, incoming.quantity() == null ? 1 : incoming.quantity()),
                firstText(incoming.status(), request.checkoutState(), "draft"),
                firstText(incoming.resultState(), "pending"),
                List.of(),
                normalizeId(incoming.checkoutSessionId()),
                safeText(incoming.createdAtIso()),
                safeText(incoming.updatedAtIso()),
                safeText(incoming.expiresAtIso()));
    }

    private Map<String, SubEventDefinitionDto> optionalDefinitions(Event parent, String slotTemplateId) {
        Map<String, SubEventDefinitionDto> definitions = new LinkedHashMap<>();
        addDefinitions(definitions, parent.getSubEventDefinitions());
        for (EventSlotTemplateDto template : parent.getSlotTemplates() == null
                ? List.<EventSlotTemplateDto>of()
                : parent.getSlotTemplates()) {
            if (template == null || (StringUtils.hasText(slotTemplateId)
                    && !slotTemplateId.equals(normalizeId(template.id())))) {
                continue;
            }
            addDefinitions(definitions, template.subEventDefinitions());
        }
        return definitions;
    }

    private void addDefinitions(Map<String, SubEventDefinitionDto> target, List<SubEventDefinitionDto> definitions) {
        for (SubEventDefinitionDto definition : definitions == null
                ? List.<SubEventDefinitionDto>of()
                : definitions) {
            String id = normalizeId(definition == null ? null : definition.id());
            if (StringUtils.hasText(id)) {
                target.putIfAbsent(id, definition);
            }
        }
    }

    private LinkedHashSet<String> selectedOptionalIds(EventCheckoutRequestDto request) {
        LinkedHashSet<String> ids = new LinkedHashSet<>(normalizeIds(request.optionalSubEventIds()));
        incomingItems(request).stream()
                .filter(item -> "sub_event".equals(safeText(item.kind())))
                .map(EventCheckoutBasketItemDto::subEventId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .forEach(ids::add);
        return ids;
    }

    private List<EventCheckoutBasketItemDto> incomingItems(EventCheckoutRequestDto request) {
        return request == null || request.basketItems() == null
                ? List.of()
                : request.basketItems().stream().filter(Objects::nonNull).toList();
    }

    private EventCheckoutLineItemDto toLineItem(EventCheckoutBasketItemDto item) {
        int quantity = Math.max(1, item.quantity() == null ? 1 : item.quantity());
        return new EventCheckoutLineItemDto(
                item.id(),
                item.kind(),
                item.label(),
                item.detail(),
                roundMoney(safeDouble(item.amount()) * quantity),
                item.currency());
    }

    private boolean matchesDemandRule(PricingDemandRuleDto rule, int filledPercent, String slotTemplateId) {
        if (rule == null) {
            return false;
        }
        if ("selected_slots".equals(safeText(rule.appliesTo()))
                && !includesSlot(rule.slotIds(), slotTemplateId)) {
            return false;
        }
        int threshold = normalizeCount(rule.capacityFilledPercent());
        return "lte".equals(safeText(rule.operator()))
                ? filledPercent <= threshold
                : filledPercent >= threshold;
    }

    private boolean matchesTimeRule(
            PricingTimeRuleDto rule,
            double hoursUntilStart,
            String slotTemplateId,
            String startsAt) {
        if (rule == null) {
            return false;
        }
        if ("selected_slots".equals(safeText(rule.appliesTo()))
                && !includesSlot(rule.slotIds(), slotTemplateId)) {
            return false;
        }
        if ("specific_date".equals(safeText(rule.trigger()))) {
            String comparisonDate = safeText(startsAt);
            comparisonDate = comparisonDate.length() >= 10 ? comparisonDate.substring(0, 10) : "";
            String start = safeText(rule.specificDateStart());
            String end = safeText(rule.specificDateEnd());
            return StringUtils.hasText(start)
                    && StringUtils.hasText(end)
                    && StringUtils.hasText(comparisonDate)
                    && comparisonDate.compareTo(start) >= 0
                    && comparisonDate.compareTo(end) <= 0;
        }
        double window = Math.max(0d, safeDouble(rule.offsetValue()));
        return "hours_before_start".equals(safeText(rule.trigger()))
                ? hoursUntilStart <= window
                : hoursUntilStart <= window * 24d;
    }

    private boolean includesSlot(List<String> slotIds, String slotTemplateId) {
        String normalizedSlotId = normalizeId(slotTemplateId);
        return StringUtils.hasText(normalizedSlotId)
                && (slotIds == null ? List.<String>of() : slotIds).stream()
                        .anyMatch(item -> normalizedSlotId.equals(normalizeId(item)));
    }

    private double applyAction(double currentPrice, PricingActionDto action) {
        if (action == null) {
            return roundMoney(currentPrice);
        }
        double value = Math.max(0d, safeDouble(action.value()));
        double result = switch (safeText(action.kind())) {
            case "set_exact_price" -> value;
            case "increase_amount" -> currentPrice + value;
            case "decrease_amount" -> currentPrice - value;
            case "decrease_percent" -> currentPrice * (1d - (value / 100d));
            default -> currentPrice * (1d + (value / 100d));
        };
        return Math.max(0d, result);
    }

    private String describeAction(PricingActionDto action) {
        double value = action == null ? 0d : Math.max(0d, safeDouble(action.value()));
        return switch (safeText(action == null ? null : action.kind())) {
            case "set_exact_price" -> "= " + roundMoney(value);
            case "increase_amount" -> "+" + roundMoney(value);
            case "decrease_amount" -> "-" + roundMoney(value);
            case "decrease_percent" -> "-" + roundMoney(value) + "%";
            default -> "+" + roundMoney(value) + "%";
        };
    }

    private double applyRounding(double price, String rounding) {
        return switch (safeText(rounding)) {
            case "whole" -> Math.round(Math.max(0d, price));
            case "half" -> Math.round(Math.max(0d, price) * 2d) / 2d;
            default -> roundMoney(price);
        };
    }

    private boolean pricingModeMatches(String mode, String... expected) {
        String normalized = safeText(mode).toLowerCase(Locale.ROOT);
        for (String candidate : expected == null ? new String[0] : expected) {
            if (normalized.equals(safeText(candidate).toLowerCase(Locale.ROOT))) {
                return true;
            }
        }
        return false;
    }

    private double hoursUntilStart(String startsAt) {
        long start = sortableDate(startsAt);
        if (start <= 0L) {
            return 0d;
        }
        return Math.max(0d, Math.round((start - System.currentTimeMillis()) / (60d * 60d * 1000d)));
    }

    private long sortableDate(String value) {
        if (!StringUtils.hasText(value)) {
            return 0L;
        }
        try {
            return Instant.parse(value.trim()).toEpochMilli();
        } catch (DateTimeParseException ignored) {
            try {
                return LocalDateTime.parse(value.trim()).toInstant(ZoneOffset.UTC).toEpochMilli();
            } catch (DateTimeParseException secondIgnored) {
                try {
                    return LocalDate.parse(value.trim()).atStartOfDay().toInstant(ZoneOffset.UTC).toEpochMilli();
                } catch (DateTimeParseException thirdIgnored) {
                    return 0L;
                }
            }
        }
    }

    private String slotDateKey(String startAtIso, String fallback) {
        String normalized = safeText(startAtIso);
        if (normalized.length() >= 10) {
            return normalized.substring(0, 10);
        }
        normalized = safeText(fallback);
        return StringUtils.hasText(normalized) ? normalized : null;
    }

    private List<String> normalizePromoCodes(List<String> values) {
        if (values == null || values.isEmpty()) {
            return List.of();
        }
        return values.stream()
                .map(this::normalizePromoCode)
                .filter(StringUtils::hasText)
                .distinct()
                .toList();
    }

    private String normalizePromoCode(String value) {
        String normalized = safeText(value);
        return StringUtils.hasText(normalized) ? normalized.toUpperCase(Locale.ROOT) : "";
    }

    private List<String> normalizeIds(List<String> values) {
        if (values == null || values.isEmpty()) {
            return List.of();
        }
        return values.stream()
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .distinct()
                .toList();
    }

    private List<? extends Event> safeEvents(List<? extends Event> values) {
        return values == null ? List.of() : values;
    }

    private boolean isGeneratedSlot(Event event) {
        return event != null && (Boolean.TRUE.equals(event.getGenerated())
                || "slot".equalsIgnoreCase(safeText(event.getEventType()))
                || StringUtils.hasText(normalizeId(event.getParentEventId())));
    }

    private String pricingCurrency(PricingConfigDto pricing) {
        String currency = safeText(pricing == null ? null : pricing.currency()).toUpperCase(Locale.ROOT);
        return StringUtils.hasText(currency) ? currency : "USD";
    }

    private int normalizeCount(Integer value) {
        return value == null ? 0 : Math.max(0, value);
    }

    private double safeDouble(Number value) {
        if (value == null) {
            return 0d;
        }
        double normalized = value.doubleValue();
        return Double.isFinite(normalized) ? normalized : 0d;
    }

    private double roundMoney(double value) {
        return Math.round(value * 100d) / 100d;
    }

    private String normalizeId(String value) {
        String normalized = safeText(value);
        return StringUtils.hasText(normalized) ? normalized : null;
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }

    private String firstText(String... values) {
        for (String value : values == null ? new String[0] : values) {
            String normalized = safeText(value);
            if (StringUtils.hasText(normalized)) {
                return normalized;
            }
        }
        return null;
    }

    private ResponseStatusException invalidPromoCode() {
        return new ResponseStatusException(
                HttpStatus.UNPROCESSABLE_ENTITY,
                invalidPromoCodeMessage());
    }

    private String invalidPromoCodeMessage() {
        return translationService.t(INVALID_PROMO_CODE_MESSAGE_KEY);
    }

    private ResponseStatusException optionalEventUnavailable() {
        return new ResponseStatusException(
                HttpStatus.UNPROCESSABLE_ENTITY,
                "A selected optional event item is no longer available.");
    }

    private record MainQuote(
            EventCheckoutBasketItemDto item,
            EventSlotOccurrenceDto slot,
            String slotSourceId,
            String slotTemplateId,
            PricingSnapshot pricing) {
    }

    public record PricingSnapshot(
            double amount,
            String currency,
            List<EventCheckoutPricingSummaryRowDto> rows) implements com.raxim.myscoutee.domain.payments.api.ServiceSlotPricing.Quote {
    }
}
