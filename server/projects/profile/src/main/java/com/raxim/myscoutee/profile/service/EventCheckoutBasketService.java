package com.raxim.myscoutee.profile.service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.concurrent.atomic.AtomicBoolean;

import com.mongodb.client.result.UpdateResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.profile.data.document.EventCheckoutBasketItem;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutBasketDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutBasketItemDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutLineItemDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutPricingSummaryRowDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutRequestDto;
import com.raxim.myscoutee.profile.repository.EventCheckoutBasketItemsRepository;
import com.raxim.myscoutee.profile.service.notifications.NotificationRuleRegistryService;

@Service
public class EventCheckoutBasketService {
    private static final Logger LOGGER = LoggerFactory.getLogger(EventCheckoutBasketService.class);
    private static final List<String> ACTIVE_STATUSES = List.of("draft", "confirmed", "approval-pending", "approved", "pay");
    private static final List<String> ACTIVE_RESULT_STATES = List.of("active", "failed");
    private static final List<String> PURGEABLE_STATUSES = List.of("draft", "confirmed", "approval-pending", "approved");
    private static final String RESULT_STATE_DELETED = "deleted";
    private static final String SYSTEM_USER = "checkout-basket-purge";

    private final EventCheckoutBasketItemsRepository repository;
    private final MongoTemplate mongoTemplate;
    private final NotificationRuleRegistryService notificationRuleRegistryService;
    private final AtomicBoolean processing = new AtomicBoolean(false);

    public EventCheckoutBasketService(
            EventCheckoutBasketItemsRepository repository,
            MongoTemplate mongoTemplate,
            NotificationRuleRegistryService notificationRuleRegistryService) {
        this.repository = repository;
        this.mongoTemplate = mongoTemplate;
        this.notificationRuleRegistryService = notificationRuleRegistryService;
    }

    public EventCheckoutBasketDto loadBasketByEvent(String userId, String sourceId) {
        String normalizedUserId = normalizeId(userId);
        String normalizedSourceId = normalizeId(sourceId);
        if (!StringUtils.hasText(normalizedUserId) || !StringUtils.hasText(normalizedSourceId)) {
            return null;
        }

        List<EventCheckoutBasketItemDto> items = repository
                .findByUserIdAndSourceIdAndStatusInAndActiveResultState(
                        normalizedUserId,
                        normalizedSourceId,
                        ACTIVE_STATUSES,
                        ACTIVE_RESULT_STATES)
                .stream()
                .map(this::toItemDto)
                .filter(Objects::nonNull)
                .toList();
        if (items.isEmpty()) {
            return null;
        }

        List<EventCheckoutLineItemDto> lineItems = items.stream()
                .map(this::toLineItemDto)
                .toList();
        List<EventCheckoutPricingSummaryRowDto> pricingSummaryRows = aggregatePricingSummaryRows(items);
        double totalAmount = lineItems.stream()
                .map(EventCheckoutLineItemDto::amount)
                .filter(Objects::nonNull)
                .mapToDouble(Double::doubleValue)
                .sum();
        String currency = items.stream()
                .map(EventCheckoutBasketItemDto::currency)
                .filter(StringUtils::hasText)
                .findFirst()
                .orElse("USD");
        String status = items.stream().anyMatch(item -> "pay".equals(item.status()))
                ? "pay"
                : items.stream().anyMatch(item -> "approved".equals(item.status()))
                        ? "approved"
                        : items.stream().anyMatch(item -> "approval-pending".equals(item.status()))
                                ? "approval-pending"
                                : items.stream().anyMatch(item -> "confirmed".equals(item.status()))
                                        ? "confirmed"
                                        : "draft";

        return new EventCheckoutBasketDto(
                normalizedUserId,
                normalizedSourceId,
                status,
                items,
                pricingSummaryRows,
                lineItems,
                Math.round(totalAmount * 100.0) / 100.0,
                currency,
                items.stream().map(EventCheckoutBasketItemDto::slotSourceId).filter(StringUtils::hasText).findFirst().orElse(null),
                items.stream().map(EventCheckoutBasketItemDto::selectedDateKey).filter(StringUtils::hasText).findFirst().orElse(null),
                items.stream().map(EventCheckoutBasketItemDto::checkoutSessionId).filter(StringUtils::hasText).findFirst().orElse(null),
                items.stream().map(EventCheckoutBasketItemDto::expiresAtIso).filter(StringUtils::hasText).findFirst().orElse(null));
    }

    public EventCheckoutBasketDto saveBasket(EventCheckoutRequestDto request) {
        String normalizedUserId = normalizeId(request == null ? null : request.userId());
        String normalizedSourceId = normalizeId(request == null ? null : request.sourceId());
        if (!StringUtils.hasText(normalizedUserId) || !StringUtils.hasText(normalizedSourceId)) {
            return null;
        }

        List<EventCheckoutBasketItemDto> incomingItems = request.basketItems() == null
                ? List.of()
                : request.basketItems().stream().filter(Objects::nonNull).toList();
        Set<String> incomingItemIds = new HashSet<>();
        for (EventCheckoutBasketItemDto item : incomingItems) {
            String itemId = normalizeId(item.id());
            if (StringUtils.hasText(itemId)) {
                incomingItemIds.add(itemId);
            }
        }

        String nowIso = Instant.now().toString();
        String requestStatus = normalizeStatus(request.checkoutState());
        List<String> staleStatuses = "pay".equals(requestStatus) ? ACTIVE_STATUSES : PURGEABLE_STATUSES;
        Query staleQuery = new Query(new Criteria().andOperator(
                Criteria.where("userId").is(normalizedUserId),
                Criteria.where("sourceId").is(normalizedSourceId),
                Criteria.where("status").in(staleStatuses),
                activeResultStateCriteria(),
                incomingItemIds.isEmpty()
                        ? Criteria.where("itemId").exists(true)
                        : Criteria.where("itemId").nin(incomingItemIds)));
        mongoTemplate.updateMulti(staleQuery, new Update()
                .set("resultState", RESULT_STATE_DELETED)
                .set("updatedAtIso", nowIso), EventCheckoutBasketItem.class);

        for (EventCheckoutBasketItemDto item : incomingItems) {
            String itemId = normalizeId(firstText(item.id(), item.kind() + ":" + normalizedSourceId));
            if (!StringUtils.hasText(itemId)) {
                continue;
            }
            String expiresAtIso = firstText(item.expiresAtIso(), Instant.now()
                    .plus(20, ChronoUnit.MINUTES)
                    .toString());
            Query itemQuery = new Query(new Criteria().andOperator(
                    Criteria.where("userId").is(normalizedUserId),
                    Criteria.where("sourceId").is(normalizedSourceId),
                    Criteria.where("itemId").is(itemId)));
            EventCheckoutBasketItem existing = mongoTemplate.findOne(itemQuery, EventCheckoutBasketItem.class);
            String status = mergeStatus(existing == null ? null : existing.getStatus(), firstText(item.status(), requestStatus));
            String resultState = normalizeResultState(item.resultState());
            Update update = new Update()
                    .set("itemId", itemId)
                    .set("userId", normalizedUserId)
                    .set("sourceId", normalizedSourceId)
                    .set("kind", firstText(item.kind(), "event"))
                    .set("slotSourceId", normalizeId(item.slotSourceId()))
                    .set("slotTemplateId", normalizeId(item.slotTemplateId()))
                    .set("selectedDateKey", safeText(item.selectedDateKey()))
                    .set("subEventId", normalizeId(item.subEventId()))
                    .set("resourceType", safeText(item.resourceType()))
                    .set("label", safeText(item.label()))
                    .set("detail", safeText(item.detail()))
                    .set("amount", Math.round((item.amount() == null ? 0.0 : item.amount()) * 100.0) / 100.0)
                    .set("currency", firstText(item.currency(), firstText(request.currency(), "USD")))
                    .set("quantity", Math.max(1, item.quantity() == null ? 1 : item.quantity()))
                    .set("status", status)
                    .set("resultState", resultState)
                    .set("pricingSummaryRows", item.pricingSummaryRows() == null ? List.of() : List.copyOf(item.pricingSummaryRows()))
                    .set("checkoutSessionId", normalizeId(item.checkoutSessionId()))
                    .set("updatedAtIso", nowIso)
                    .set("expiresAtIso", expiresAtIso)
                    .setOnInsert("createdAtIso", firstText(item.createdAtIso(), nowIso));
            mongoTemplate.upsert(itemQuery, update, EventCheckoutBasketItem.class);
        }

        return loadBasketByEvent(normalizedUserId, normalizedSourceId);
    }

    public int purgeExpiredDraftBasketsNow() {
        return purgeExpiredDraftBaskets(Instant.now());
    }

    public int purgeExpiredDraftBaskets(Instant now) {
        if (!processing.compareAndSet(false, true)) {
            return 0;
        }
        Instant startedAt = Instant.now();
        try {
            notificationRuleRegistryService.beginRun(
                    NotificationRuleRegistryService.RULE_EVENT_CHECKOUT_BASKET_PURGE,
                    "Scanning expired checkout basket drafts.",
                    SYSTEM_USER,
                    startedAt);
            String nowIso = (now == null ? Instant.now() : now).toString();
            Query query = new Query(new Criteria().andOperator(
                    Criteria.where("status").in(PURGEABLE_STATUSES),
                    activeResultStateCriteria(),
                    Criteria.where("expiresAtIso").exists(true).nin("", null),
                    Criteria.where("expiresAtIso").lte(nowIso)));
            Update update = new Update()
                    .set("resultState", RESULT_STATE_DELETED)
                    .set("updatedAtIso", nowIso);
            UpdateResult result = mongoTemplate.updateMulti(query, update, EventCheckoutBasketItem.class);
            int modified = result == null ? 0 : Math.toIntExact(Math.min(Integer.MAX_VALUE, result.getModifiedCount()));
            String detail = modified == 0
                    ? "No expired checkout basket items were due."
                    : "Marked " + modified + " expired checkout basket item(s) as deleted.";
            notificationRuleRegistryService.recordRun(
                    NotificationRuleRegistryService.RULE_EVENT_CHECKOUT_BASKET_PURGE,
                    modified,
                    "completed",
                    detail,
                    SYSTEM_USER,
                    startedAt);
            return modified;
        } catch (RuntimeException exception) {
            LOGGER.warn("Checkout basket purge pass failed.", exception);
            notificationRuleRegistryService.recordRun(
                    NotificationRuleRegistryService.RULE_EVENT_CHECKOUT_BASKET_PURGE,
                    0,
                    "failed",
                    safeText(exception.getMessage()),
                    SYSTEM_USER,
                    startedAt);
            return 0;
        } finally {
            processing.set(false);
        }
    }

    private EventCheckoutBasketItemDto toItemDto(EventCheckoutBasketItem item) {
        String itemId = normalizeId(firstText(item.getItemId(), item.getId()));
        String sourceId = normalizeId(item.getSourceId());
        String label = safeText(item.getLabel());
        if (!StringUtils.hasText(itemId) || !StringUtils.hasText(sourceId) || !StringUtils.hasText(label)) {
            return null;
        }
        String currency = firstText(item.getCurrency(), "USD");
        return new EventCheckoutBasketItemDto(
                itemId,
                firstText(item.getKind(), "event"),
                sourceId,
                normalizeId(item.getSlotSourceId()),
                normalizeId(item.getSlotTemplateId()),
                safeText(item.getSelectedDateKey()),
                normalizeId(item.getSubEventId()),
                safeText(item.getResourceType()),
                label,
                safeText(item.getDetail()),
                item.getAmount() == null ? 0.0 : item.getAmount(),
                currency,
                Math.max(1, item.getQuantity() == null ? 1 : item.getQuantity()),
                normalizeStatus(item.getStatus()),
                normalizeResultState(item.getResultState()),
                item.getPricingSummaryRows() == null ? List.of() : List.copyOf(item.getPricingSummaryRows()),
                normalizeId(item.getCheckoutSessionId()),
                safeText(item.getCreatedAtIso()),
                safeText(item.getUpdatedAtIso()),
                safeText(item.getExpiresAtIso()));
    }

    private EventCheckoutLineItemDto toLineItemDto(EventCheckoutBasketItemDto item) {
        int quantity = Math.max(1, item.quantity() == null ? 1 : item.quantity());
        double amount = Math.round((item.amount() == null ? 0.0 : item.amount()) * quantity * 100.0) / 100.0;
        return new EventCheckoutLineItemDto(
                item.id(),
                item.kind(),
                item.label(),
                item.detail(),
                amount,
                firstText(item.currency(), "USD"));
    }

    private List<EventCheckoutPricingSummaryRowDto> aggregatePricingSummaryRows(List<EventCheckoutBasketItemDto> items) {
        Map<String, EventCheckoutPricingSummaryRowDto> grouped = new LinkedHashMap<>();
        for (EventCheckoutBasketItemDto item : items == null ? List.<EventCheckoutBasketItemDto>of() : items) {
            String fallbackCurrency = firstText(item.currency(), "USD");
            for (EventCheckoutPricingSummaryRowDto row : item.pricingSummaryRows() == null
                    ? List.<EventCheckoutPricingSummaryRowDto>of()
                    : item.pricingSummaryRows()) {
                String label = safeText(row.label());
                if (!StringUtils.hasText(label)) {
                    continue;
                }
                String detail = safeText(row.detail());
                Double amount = row.amount();
                String currency = firstText(row.currency(), fallbackCurrency);
                String key = firstText(row.key(), label) + "::" + detail + "::" + (amount == null ? "none" : amount) + "::" + currency;
                int multiplier = Math.max(1, row.multiplier() == null ? 1 : row.multiplier());
                EventCheckoutPricingSummaryRowDto existing = grouped.get(key);
                if (existing == null) {
                    grouped.put(key, new EventCheckoutPricingSummaryRowDto(
                            key,
                            label,
                            StringUtils.hasText(detail) ? detail : null,
                            amount == null ? null : Math.round(amount * multiplier * 100.0) / 100.0,
                            currency,
                            multiplier));
                    continue;
                }
                int nextMultiplier = Math.max(1, existing.multiplier() == null ? 1 : existing.multiplier()) + multiplier;
                Double nextAmount = existing.amount() != null && amount != null
                        ? Math.round((existing.amount() + (amount * multiplier)) * 100.0) / 100.0
                        : existing.amount() == null ? amount : existing.amount();
                grouped.put(key, new EventCheckoutPricingSummaryRowDto(
                        existing.key(),
                        existing.label(),
                        existing.detail(),
                        nextAmount,
                        existing.currency(),
                        nextMultiplier));
            }
        }
        return List.copyOf(grouped.values());
    }

    private String normalizeStatus(String status) {
        String normalized = safeText(status);
        return "confirmed".equals(normalized)
                || "approval-pending".equals(normalized)
                || "approved".equals(normalized)
                || "pay".equals(normalized)
                || "cancelled".equals(normalized)
                || "rejected".equals(normalized)
                || "deleted".equals(normalized)
                ? normalized
                : "draft";
    }

    private String normalizeResultState(String resultState) {
        String normalized = safeText(resultState);
        return "deleted".equals(normalized) || "succeeded".equals(normalized) || "failed".equals(normalized)
                ? normalized
                : "active";
    }

    private String mergeStatus(String existingStatus, String nextStatus) {
        String existing = normalizeStatus(existingStatus);
        String next = normalizeStatus(nextStatus);
        if ("pay".equals(existing)) {
            return existing;
        }
        return next;
    }

    private Criteria activeResultStateCriteria() {
        return new Criteria().orOperator(
                Criteria.where("resultState").exists(false),
                Criteria.where("resultState").in(ACTIVE_RESULT_STATES));
    }

    private String firstText(String value, String fallback) {
        String normalized = safeText(value);
        return StringUtils.hasText(normalized) ? normalized : safeText(fallback);
    }

    private String normalizeId(String value) {
        return safeText(value);
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }
}
