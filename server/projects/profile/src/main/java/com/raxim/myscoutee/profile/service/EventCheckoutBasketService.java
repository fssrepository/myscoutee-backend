package com.raxim.myscoutee.profile.service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Collection;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
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
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutStateChangeRequestDto;
import com.raxim.myscoutee.profile.repository.EventCheckoutBasketItemsRepository;
import com.raxim.myscoutee.profile.service.notifications.NotificationRuleRegistryService;

@Service
public class EventCheckoutBasketService {
    private static final Logger LOGGER = LoggerFactory.getLogger(EventCheckoutBasketService.class);
    private static final List<String> ACTIVE_STATUSES = List.of("draft", "confirmed", "waiting", "approval-pending", "approved", "pay");
    private static final List<String> DISPLAY_RESULT_STATES = List.of("pending", "active", "failed", "succeeded");
    private static final List<String> RESERVATION_RESULT_STATES = List.of("pending", "active", "failed");
    private static final List<String> PURGEABLE_STATUSES = List.of("draft", "confirmed", "waiting", "approval-pending", "approved");
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

        List<EventCheckoutBasketItem> persistedItems = repository
                .findByUserIdAndSourceIdAndStatusInAndVisibleResultState(
                        normalizedUserId,
                        normalizedSourceId,
                        ACTIVE_STATUSES,
                        DISPLAY_RESULT_STATES);
        List<EventCheckoutBasketItemDto> items = persistedItems
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
                                : items.stream().anyMatch(item -> "waiting".equals(item.status()))
                                        ? "waiting"
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
                items.stream().map(EventCheckoutBasketItemDto::expiresAtIso).filter(StringUtils::hasText).findFirst().orElse(null),
                normalizePromoCodes(persistedItems.stream()
                        .filter(Objects::nonNull)
                        .flatMap(item -> (item.getAppliedPromoCodes() == null ? List.<String>of() : item.getAppliedPromoCodes()).stream())
                        .toList()));
    }

    public Map<String, String> loadResultStatesByEvent(String userId, Collection<String> sourceIds) {
        String normalizedUserId = normalizeId(userId);
        List<String> normalizedSourceIds = normalizeIds(sourceIds);
        if (!StringUtils.hasText(normalizedUserId) || normalizedSourceIds.isEmpty()) {
            return Map.of();
        }
        Map<String, List<EventCheckoutBasketItem>> itemsBySourceId = repository
                .findByUserIdAndSourceIdInAndStatusInAndVisibleResultState(
                        normalizedUserId,
                        normalizedSourceIds,
                        ACTIVE_STATUSES,
                        DISPLAY_RESULT_STATES)
                .stream()
                .filter(Objects::nonNull)
                .filter(item -> StringUtils.hasText(normalizeId(item.getSourceId())))
                .collect(
                        LinkedHashMap::new,
                        (result, item) -> result
                                .computeIfAbsent(normalizeId(item.getSourceId()), ignored -> new java.util.ArrayList<>())
                                .add(item),
                        Map::putAll);
        if (itemsBySourceId.isEmpty()) {
            return Map.of();
        }
        Map<String, String> result = new LinkedHashMap<>();
        itemsBySourceId.forEach((sourceId, items) -> result.put(sourceId, checkoutResultState(items)));
        return result;
    }

    private String checkoutResultState(List<EventCheckoutBasketItem> items) {
        List<String> resultStates = (items == null ? List.<EventCheckoutBasketItem>of() : items).stream()
                .map(item -> safeText(item == null ? null : item.getResultState()))
                .map(value -> StringUtils.hasText(value) ? value : "pending")
                .toList();
        if (resultStates.stream().anyMatch("failed"::equals)) {
            return "failed";
        }
        if (!resultStates.isEmpty() && resultStates.stream().allMatch("succeeded"::equals)) {
            return "succeeded";
        }
        return "pending";
    }

    public Map<String, Integer> activeSlotReservationCountsByEvent(String sourceId) {
        return activeReservationCountsByEvent(sourceId, "event", true);
    }

    public Map<String, Integer> activeOptionalReservationCountsByEvent(String sourceId) {
        return activeReservationCountsByEvent(sourceId, "sub_event", false);
    }

    private Map<String, Integer> activeReservationCountsByEvent(
            String sourceId,
            String kind,
            boolean slotReservation) {
        String normalizedSourceId = normalizeId(sourceId);
        if (!StringUtils.hasText(normalizedSourceId)) {
            return Map.of();
        }
        Map<String, Integer> counts = new LinkedHashMap<>();
        Set<String> countedItemKeys = new HashSet<>();
        for (EventCheckoutBasketItem item : repository.findBySourceIdAndStatusInAndVisibleResultState(
                normalizedSourceId,
                ACTIVE_STATUSES,
                RESERVATION_RESULT_STATES)) {
            if (item == null || !kind.equals(safeText(item.getKind()))) {
                continue;
            }
            String countedItemKey = normalizeId(item.getUserId()) + "::" + firstText(item.getItemId(), item.getKind() + ":" + item.getSlotSourceId() + ":" + item.getSubEventId());
            if (!countedItemKeys.add(countedItemKey)) {
                continue;
            }
            String key = normalizeId(slotReservation ? item.getSlotSourceId() : item.getSubEventId());
            if (!StringUtils.hasText(key)) {
                continue;
            }
            int quantity = Math.max(1, item.getQuantity() == null ? 1 : item.getQuantity());
            counts.put(key, counts.getOrDefault(key, 0) + quantity);
        }
        return counts;
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
        String nowIso = Instant.now().toString();
        String requestStatus = normalizeStatus(request.checkoutState());
        List<String> appliedPromoCodes = normalizePromoCodes(request.appliedPromoCodes());
        Query staleQuery = new Query(new Criteria().andOperator(
                Criteria.where("userId").is(normalizedUserId),
                Criteria.where("sourceId").is(normalizedSourceId),
                Criteria.where("status").in(ACTIVE_STATUSES),
                displayResultStateCriteria()));
        Query trackedStaleQuery = new Query(new Criteria().andOperator(
                Criteria.where("userId").is(normalizedUserId),
                Criteria.where("sourceId").is(normalizedSourceId),
                Criteria.where("status").in(ACTIVE_STATUSES),
                displayResultStateCriteria(),
                Criteria.where("pendingCounterTracked").is(true)));
        UpdateResult trackedStaleResult = mongoTemplate.updateMulti(trackedStaleQuery, new Update()
                .set("resultState", RESULT_STATE_DELETED)
                .set("pendingCounterTracked", false)
                .set("updatedAtIso", nowIso), EventCheckoutBasketItem.class);
        adjustPendingCount(-modifiedCount(trackedStaleResult));
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
            boolean shouldTrack = isPurgeCandidate(status, resultState, expiresAtIso);
            boolean newlyTracked = shouldTrack
                    && (existing == null || !Boolean.TRUE.equals(existing.getPendingCounterTracked()));
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
                    .set("pendingCounterTracked", shouldTrack)
                    .set("pricingSummaryRows", item.pricingSummaryRows() == null ? List.of() : List.copyOf(item.pricingSummaryRows()))
                    .set("appliedPromoCodes", appliedPromoCodes)
                    .set("checkoutSessionId", normalizeId(item.checkoutSessionId()))
                    .set("updatedAtIso", nowIso)
                    .set("expiresAtIso", expiresAtIso)
                    .setOnInsert("createdAtIso", firstText(item.createdAtIso(), nowIso));
            UpdateResult updateResult = mongoTemplate.upsert(itemQuery, update, EventCheckoutBasketItem.class);
            if (newlyTracked
                    && (modifiedCount(updateResult) > 0
                            || (updateResult != null && updateResult.getUpsertedId() != null))) {
                adjustPendingCount(1);
            }
        }

        return loadBasketByEvent(normalizedUserId, normalizedSourceId);
    }

    public EventCheckoutBasketDto updateBasketState(EventCheckoutStateChangeRequestDto request) {
        String normalizedUserId = normalizeId(request == null ? null : request.userId());
        String normalizedSourceId = normalizeId(request == null ? null : request.sourceId());
        if (!StringUtils.hasText(normalizedUserId) || !StringUtils.hasText(normalizedSourceId)) {
            return null;
        }
        String checkoutState = normalizeStatus(request.checkoutState());
        String resultState = normalizeResultState(request.resultState());
        String nowIso = Instant.now().toString();
        boolean terminalState = !PURGEABLE_STATUSES.contains(checkoutState)
                || (StringUtils.hasText(resultState) && !RESERVATION_RESULT_STATES.contains(resultState));
        Update update = new Update()
                .set("status", checkoutState)
                .set("updatedAtIso", nowIso);
        if (StringUtils.hasText(resultState)) {
            update.set("resultState", resultState);
        }
        String checkoutSessionId = normalizeId(request.checkoutSessionId());
        if (StringUtils.hasText(checkoutSessionId)) {
            update.set("checkoutSessionId", checkoutSessionId);
        }
        Query query = new Query(new Criteria().andOperator(
                Criteria.where("userId").is(normalizedUserId),
                Criteria.where("sourceId").is(normalizedSourceId),
                Criteria.where("status").in(ACTIVE_STATUSES),
                displayResultStateCriteria()));
        if (terminalState) {
            Query trackedQuery = new Query(new Criteria().andOperator(
                    Criteria.where("userId").is(normalizedUserId),
                    Criteria.where("sourceId").is(normalizedSourceId),
                    Criteria.where("status").in(ACTIVE_STATUSES),
                    displayResultStateCriteria(),
                    Criteria.where("pendingCounterTracked").is(true)));
            Update trackedUpdate = new Update()
                    .set("status", checkoutState)
                    .set("pendingCounterTracked", false)
                    .set("updatedAtIso", nowIso);
            if (StringUtils.hasText(resultState)) {
                trackedUpdate.set("resultState", resultState);
            }
            if (StringUtils.hasText(checkoutSessionId)) {
                trackedUpdate.set("checkoutSessionId", checkoutSessionId);
            }
            adjustPendingCount(-modifiedCount(
                    mongoTemplate.updateMulti(trackedQuery, trackedUpdate, EventCheckoutBasketItem.class)));
        } else {
            List<Criteria> trackCriteria = new java.util.ArrayList<>(List.of(
                    Criteria.where("userId").is(normalizedUserId),
                    Criteria.where("sourceId").is(normalizedSourceId),
                    Criteria.where("status").in(ACTIVE_STATUSES),
                    displayResultStateCriteria(),
                    Criteria.where("expiresAtIso").exists(true).nin("", null),
                    Criteria.where("pendingCounterTracked").ne(true)));
            if (!StringUtils.hasText(resultState)) {
                trackCriteria.add(reservationResultStateCriteria());
            }
            Query untrackedQuery = new Query(new Criteria().andOperator(trackCriteria));
            Update trackedUpdate = new Update()
                    .set("status", checkoutState)
                    .set("pendingCounterTracked", true)
                    .set("updatedAtIso", nowIso);
            if (StringUtils.hasText(resultState)) {
                trackedUpdate.set("resultState", resultState);
            }
            if (StringUtils.hasText(checkoutSessionId)) {
                trackedUpdate.set("checkoutSessionId", checkoutSessionId);
            }
            adjustPendingCount(modifiedCount(
                    mongoTemplate.updateMulti(untrackedQuery, trackedUpdate, EventCheckoutBasketItem.class)));
        }
        mongoTemplate.updateMulti(query, update, EventCheckoutBasketItem.class);
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
                    reservationResultStateCriteria(),
                    Criteria.where("expiresAtIso").exists(true).nin("", null),
                    Criteria.where("expiresAtIso").lte(nowIso)));
            Update update = new Update()
                    .set("resultState", RESULT_STATE_DELETED)
                    .set("pendingCounterTracked", false)
                    .set("updatedAtIso", nowIso);
            Query trackedQuery = new Query(new Criteria().andOperator(
                    Criteria.where("status").in(PURGEABLE_STATUSES),
                    reservationResultStateCriteria(),
                    Criteria.where("expiresAtIso").exists(true).nin("", null),
                    Criteria.where("expiresAtIso").lte(nowIso),
                    Criteria.where("pendingCounterTracked").is(true)));
            int trackedModified = modifiedCount(
                    mongoTemplate.updateMulti(trackedQuery, update, EventCheckoutBasketItem.class));
            int modified = trackedModified + modifiedCount(
                    mongoTemplate.updateMulti(query, update, EventCheckoutBasketItem.class));
            adjustPendingCount(-trackedModified);
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

    private boolean isPurgeCandidate(String status, String resultState, String expiresAtIso) {
        String normalizedResultState = safeText(resultState);
        return PURGEABLE_STATUSES.contains(safeText(status))
                && (!StringUtils.hasText(normalizedResultState)
                        || RESERVATION_RESULT_STATES.contains(normalizedResultState))
                && StringUtils.hasText(safeText(expiresAtIso));
    }

    private int modifiedCount(UpdateResult result) {
        return result == null
                ? 0
                : Math.toIntExact(Math.min(Integer.MAX_VALUE, result.getModifiedCount()));
    }

    private void adjustPendingCount(int delta) {
        if (delta != 0) {
            notificationRuleRegistryService.adjustPendingCount(
                    NotificationRuleRegistryService.RULE_EVENT_CHECKOUT_BASKET_PURGE,
                    delta,
                    "admin.jobs.table.affected");
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
                || "waiting".equals(normalized)
                || "approval-pending".equals(normalized)
                || "approved".equals(normalized)
                || "pay".equals(normalized)
                || "cancelled".equals(normalized)
                || "rejected".equals(normalized)
                ? normalized
                : "draft";
    }

    private String normalizeResultState(String resultState) {
        String normalized = safeText(resultState);
        return "deleted".equals(normalized) || "succeeded".equals(normalized) || "failed".equals(normalized)
                ? normalized
                : "pending";
    }

    private List<String> normalizePromoCodes(List<String> promoCodes) {
        if (promoCodes == null || promoCodes.isEmpty()) {
            return List.of();
        }
        return promoCodes.stream()
                .map(this::safeText)
                .filter(StringUtils::hasText)
                .map(value -> value.toUpperCase(Locale.ROOT))
                .distinct()
                .toList();
    }

    private String mergeStatus(String existingStatus, String nextStatus) {
        String existing = normalizeStatus(existingStatus);
        String next = normalizeStatus(nextStatus);
        if ("pay".equals(existing)) {
            return existing;
        }
        return next;
    }

    private Criteria displayResultStateCriteria() {
        return new Criteria().orOperator(
                Criteria.where("resultState").exists(false),
                Criteria.where("resultState").in(DISPLAY_RESULT_STATES));
    }

    private Criteria reservationResultStateCriteria() {
        return new Criteria().orOperator(
                Criteria.where("resultState").exists(false),
                Criteria.where("resultState").in(RESERVATION_RESULT_STATES));
    }

    private String firstText(String value, String fallback) {
        String normalized = safeText(value);
        return StringUtils.hasText(normalized) ? normalized : safeText(fallback);
    }

    private String normalizeId(String value) {
        return safeText(value);
    }

    private List<String> normalizeIds(Collection<String> values) {
        if (values == null || values.isEmpty()) {
            return List.of();
        }
        return values.stream()
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .distinct()
                .toList();
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }
}
