package com.raxim.myscoutee.profile.service;

import java.time.Instant;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.profile.data.document.mongo.UserRate;
import com.raxim.myscoutee.profile.data.document.mongo.Users;
import com.raxim.myscoutee.profile.dto.rates.RatesDtos.ActivityRatePageResponseDto;
import com.raxim.myscoutee.profile.dto.rates.RatesDtos.RateMenuItemDto;
import com.raxim.myscoutee.profile.dto.rates.RatesDtos.UserRateRecordDto;
import com.raxim.myscoutee.profile.dto.rates.RatesDtos.UserRatesSyncRequestDto;
import com.raxim.myscoutee.profile.dto.rates.RatesDtos.UserRatesSyncResponseDto;
import com.raxim.myscoutee.profile.repository.mongo.UserRatesRepository;
import com.raxim.myscoutee.profile.repository.mongo.UsersRepository;

@Service
public class UserRatesService {
    private static final String SOURCE_ACTIVITY_RATE = "activity-rate";
    private static final String SOURCE_GAME_CARD = "game-card";
    private static final RateDistance ZERO_DISTANCE = new RateDistance(0d, 0);

    private final UserRatesRepository userRatesRepository;
    private final UsersRepository usersRepository;
    private final HomeUserProfileService homeUserProfileService;

    public UserRatesService(
            UserRatesRepository userRatesRepository,
            UsersRepository usersRepository,
            HomeUserProfileService homeUserProfileService) {
        this.userRatesRepository = userRatesRepository;
        this.usersRepository = usersRepository;
        this.homeUserProfileService = homeUserProfileService;
    }

    public List<RateMenuItemDto> queryRateItemsByUser(String requestedUserId) {
        Users currentUser = homeUserProfileService.resolveCurrentUser(requestedUserId);
        String ownerUserId = currentUser == null ? null : normalizeId(currentUser.getId());
        if (!StringUtils.hasText(ownerUserId)) {
            return List.of();
        }

        Map<String, UserRate> recordsById = new LinkedHashMap<>();
        addRecords(recordsById, userRatesRepository.findByOwnerUserIdAndSource(ownerUserId, SOURCE_ACTIVITY_RATE));
        addRecords(recordsById, userRatesRepository.findBySourceAndFromUserId(SOURCE_GAME_CARD, ownerUserId));
        addRecords(recordsById, userRatesRepository.findBySourceAndToUserId(SOURCE_GAME_CARD, ownerUserId));
        addRecords(recordsById, userRatesRepository.findBySourceAndModeAndOwnerUserId(SOURCE_GAME_CARD, "pair", ownerUserId));

        List<RateMenuItemDto> dedupedItems = dedupeRateItems(recordsById.values().stream()
                .map(record -> toRateMenuItem(record, currentUser))
                .filter(Objects::nonNull)
                .toList());

        return dedupedItems.stream()
                .sorted(Comparator
                        .comparing((RateMenuItemDto item) -> rateDateMillis(item.happenedAt()), Comparator.reverseOrder())
                        .thenComparing(item -> safeText(item.id())))
                .toList();
    }

    public ActivityRatePageResponseDto queryActivityRatePage(
            String requestedUserId,
            String modeValue,
            String directionValue,
            String sortValue,
            String sortDirectionValue,
            String secondaryFilterValue,
            String cursor,
            Integer limitValue,
            String rangeStartIso,
            String rangeEndIso) {
        Users currentUser = homeUserProfileService.resolveCurrentUser(requestedUserId);
        String ownerUserId = currentUser == null ? null : normalizeId(currentUser.getId());
        String mode = normalizeMode(modeValue);
        String direction = normalizeDisplayDirection(directionValue);
        if (!StringUtils.hasText(ownerUserId) || !StringUtils.hasText(mode) || !StringUtils.hasText(direction)) {
            return new ActivityRatePageResponseDto(List.of(), 0, null);
        }

        String sort = normalizeQuerySort(sortValue);
        String innerOrder = resolveActivityInnerOrder(sort, sortDirectionValue, secondaryFilterValue);
        String groupDirection = resolveActivityGroupDirection(sort, sortDirectionValue, innerOrder);
        long rangeStartMs = parseIsoMillis(rangeStartIso, 0L);
        long rangeEndMs = parseIsoMillis(rangeEndIso, Long.MAX_VALUE);
        if (rangeStartMs > rangeEndMs) {
            return new ActivityRatePageResponseDto(List.of(), 0, null);
        }

        List<ActivityRateProjection> projections = dedupeActivityRateProjections(userRatesRepository
                .findByOwnerUserIdAndSourceAndMode(ownerUserId, SOURCE_ACTIVITY_RATE, mode)
                .stream()
                .map(record -> toActivityRateProjection(record, currentUser))
                .filter(Objects::nonNull)
                .filter(projection -> direction.equals(projection.item().direction()))
                .filter(projection -> isWithinRange(projection.item(), rangeStartMs, rangeEndMs))
                .toList());

        List<RateMenuItemDto> items = projections.stream()
                .sorted(activityRateComparator(sort, groupDirection, innerOrder))
                .map(ActivityRateProjection::item)
                .toList();

        int startIndex = resolveCursorStartIndex(items, cursor);
        int limit = normalizeLimit(limitValue);
        int endIndex = Math.min(items.size(), startIndex + limit);
        List<RateMenuItemDto> pageItems = items.subList(startIndex, endIndex);
        String nextCursor = endIndex < items.size() && !pageItems.isEmpty()
                ? serializeCursor(pageItems.get(pageItems.size() - 1))
                : null;

        return new ActivityRatePageResponseDto(pageItems, items.size(), nextCursor);
    }

    public UserRatesSyncResponseDto sync(UserRatesSyncRequestDto request) {
        if (request == null || request.rates() == null || request.rates().isEmpty()) {
            return new UserRatesSyncResponseDto(List.of(), List.of());
        }

        List<UserRate> normalizedRates = new ArrayList<>();
        List<String> syncedRateIds = new ArrayList<>();
        List<String> failedRateIds = new ArrayList<>();
        for (UserRateRecordDto rate : request.rates()) {
            UserRate normalized = normalizeRecord(rate);
            if (normalized == null) {
                String failedId = rate == null ? "" : normalizeId(rate.id());
                if (StringUtils.hasText(failedId)) {
                    failedRateIds.add(failedId);
                }
                continue;
            }
            normalizedRates.add(normalized);
            syncedRateIds.add(resolveSyncAcknowledgementId(rate, normalized));
        }

        if (!normalizedRates.isEmpty()) {
            userRatesRepository.saveAll(normalizedRates);
        }
        return new UserRatesSyncResponseDto(syncedRateIds, failedRateIds);
    }

    private void addRecords(Map<String, UserRate> target, List<UserRate> records) {
        for (UserRate record : records) {
            if (record == null || !StringUtils.hasText(normalizeId(record.getId()))) {
                continue;
            }
            target.put(record.getId(), record);
        }
    }

    private List<RateMenuItemDto> dedupeRateItems(List<RateMenuItemDto> items) {
        Map<String, RateMenuItemDto> deduped = new LinkedHashMap<>();
        for (RateMenuItemDto item : items) {
            if (item == null || !StringUtils.hasText(safeText(item.id()))) {
                continue;
            }
            RateMenuItemDto existing = deduped.get(item.id());
            if (existing == null || rateDateMillis(item.happenedAt()) >= rateDateMillis(existing.happenedAt())) {
                deduped.put(item.id(), item);
            }
        }
        return new ArrayList<>(deduped.values());
    }

    private List<ActivityRateProjection> dedupeActivityRateProjections(List<ActivityRateProjection> projections) {
        Map<String, ActivityRateProjection> deduped = new LinkedHashMap<>();
        for (ActivityRateProjection projection : projections) {
            if (projection == null || projection.item() == null || !StringUtils.hasText(safeText(projection.item().id()))) {
                continue;
            }
            ActivityRateProjection existing = deduped.get(projection.item().id());
            if (existing == null || projection.happenedAtMs() >= existing.happenedAtMs()) {
                deduped.put(projection.item().id(), projection);
            }
        }
        return new ArrayList<>(deduped.values());
    }

    private UserRate normalizeRecord(UserRateRecordDto rate) {
        if (rate == null) {
            return null;
        }
        String syncKey = resolveSyncKey(rate);
        String mode = normalizeMode(rate.mode());
        String source = normalizeSource(rate.source());
        if (!StringUtils.hasText(syncKey)
                || !StringUtils.hasText(mode)
                || !StringUtils.hasText(source)) {
            return null;
        }

        UserRate existing = userRatesRepository.findBySyncKey(syncKey).orElse(null);
        String ownerUserId = normalizeOptionalId(rate.ownerUserId());
        String fromUserId = normalizeOptionalId(rate.fromUserId());
        String toUserId = normalizeOptionalId(rate.toUserId());
        String updatedUserId = resolveUpdatedUser(rate, ownerUserId, fromUserId, toUserId);
        String createdUserId = existing != null
                ? normalizeOptionalText(existing.getCreatedUser())
                : resolveCreatedUser(rate, ownerUserId, fromUserId, toUserId, updatedUserId);
        String nowIso = Instant.now().toString();

        UserRate document = existing != null ? existing : new UserRate();
        document.setId(existing != null ? existing.getId() : new ObjectId().toHexString());
        document.setSyncKey(syncKey);
        document.setMode(mode);
        document.setSource(source);
        document.setCreatedDate(existing != null
                ? normalizeDate(existing.getCreatedDate(), nowIso)
                : normalizeDate(rate.createdAtIso(), normalizeDate(rate.happenedAtIso(), normalizeDate(rate.updatedAtIso(), nowIso))));
        document.setCreatedUser(createdUserId);
        document.setUpdatedDate(normalizeDate(rate.updatedAtIso(), nowIso));
        document.setUpdatedUser(updatedUserId);
        document.setOwnerUserId(ownerUserId);
        document.setOwnerLocation(resolveLocationSnapshot(ownerUserId));

        if (SOURCE_ACTIVITY_RATE.equals(source)) {
            return normalizeActivityRateRecord(document, rate, mode, ownerUserId, fromUserId, toUserId);
        }
        return normalizeGameCardRecord(document, rate, mode, fromUserId, toUserId);
    }

    private UserRate normalizeActivityRateRecord(
            UserRate document,
            UserRateRecordDto rate,
            String mode,
            String ownerUserId,
            String fromUserId,
            String toUserId) {
        if (!StringUtils.hasText(ownerUserId)) {
            return null;
        }

        String relatedUserId = resolveActivityRelatedUserId(mode, ownerUserId, fromUserId, toUserId);
        String secondaryRelatedUserId = resolveActivitySecondaryRelatedUserId(mode, fromUserId, toUserId);
        if (!StringUtils.hasText(relatedUserId)) {
            return null;
        }
        if ("single".equals(mode) && ownerUserId.equals(relatedUserId)) {
            return null;
        }
        if ("pair".equals(mode) && (!StringUtils.hasText(secondaryRelatedUserId) || relatedUserId.equals(secondaryRelatedUserId))) {
            return null;
        }

        boolean met = isMetRequest(rate);
        String preservedEventName = normalizeOptionalText(document.getEventName());
        String requestedEventName = normalizeOptionalText(rate.eventName());

        document.setFromUserId(null);
        document.setToUserId(null);
        document.setRate(null);
        document.setRelatedUserId(relatedUserId);
        document.setSecondaryRelatedUserId(secondaryRelatedUserId);
        document.setScoreGiven(normalizeScore(rate.scoreGiven()));
        document.setScoreReceived(normalizeScore(rate.scoreReceived()));
        document.setAffinityScore(resolveAffinityScore(mode, relatedUserId, secondaryRelatedUserId));
        document.setMet(met);
        document.setEventName(met
                ? (StringUtils.hasText(requestedEventName) ? requestedEventName : preservedEventName)
                : null);
        return document;
    }

    private UserRate normalizeGameCardRecord(
            UserRate document,
            UserRateRecordDto rate,
            String mode,
            String fromUserId,
            String toUserId) {
        if (!StringUtils.hasText(fromUserId)
                || !StringUtils.hasText(toUserId)
                || fromUserId.equals(toUserId)) {
            return null;
        }
        Integer normalizedRate = normalizeRate(rate.rate(), false);
        if (normalizedRate == null) {
            return null;
        }
        document.setFromUserId(fromUserId);
        document.setToUserId(toUserId);
        document.setRate(normalizedRate);
        document.setRelatedUserId(null);
        document.setSecondaryRelatedUserId(null);
        document.setScoreGiven(null);
        document.setScoreReceived(null);
        document.setAffinityScore(null);
        document.setMet(null);
        document.setEventName(null);
        return document;
    }

    private RateMenuItemDto toRateMenuItem(UserRate record, Users currentUser) {
        String ownerUserId = currentUser == null ? null : normalizeId(currentUser.getId());
        if (record == null || !StringUtils.hasText(ownerUserId)) {
            return null;
        }
        String source = normalizeSource(record.getSource());
        if (SOURCE_ACTIVITY_RATE.equals(source)) {
            return toActivityRateMenuItem(record, currentUser);
        }
        if (SOURCE_GAME_CARD.equals(source)) {
            return toGameCardRateMenuItem(record, currentUser);
        }
        return null;
    }

    private RateMenuItemDto toActivityRateMenuItem(UserRate record, Users currentUser) {
        String ownerUserId = currentUser == null ? null : normalizeId(currentUser.getId());
        String recordOwnerUserId = normalizeOptionalId(record.getOwnerUserId());
        String direction = deriveActivityDirection(record, ownerUserId);
        if (!StringUtils.hasText(direction)
                || !StringUtils.hasText(recordOwnerUserId)
                || !recordOwnerUserId.equals(ownerUserId)) {
            return null;
        }

        String displayId = resolveResponseId(record);
        String happenedAt = normalizeDate(record.getCreatedDate(), normalizeDate(record.getUpdatedDate(), Instant.now().toString()));
        int scoreGiven = normalizeScore(record.getScoreGiven());
        int scoreReceived = normalizeScore(record.getScoreReceived());
        String eventName = StringUtils.hasText(normalizeOptionalText(record.getEventName()))
                ? normalizeOptionalText(record.getEventName())
                : ("met".equals(direction) ? "Met" : "Rate");
        RateDistance distance = resolveActivityDistance(currentUser, record.getOwnerLocation());
        String socialContext = resolvePairSocialContext(normalizeMode(record.getMode()), direction);
        String bridgeUserId = resolvePairBridgeUserId(record, ownerUserId, socialContext);
        Integer bridgeCount = resolvePairBridgeCount(socialContext);

        if ("pair".equals(normalizeMode(record.getMode()))) {
            String primaryUserId = normalizeOptionalId(record.getRelatedUserId());
            String secondaryUserId = normalizeOptionalId(record.getSecondaryRelatedUserId());
            if (!StringUtils.hasText(primaryUserId)
                        || !StringUtils.hasText(secondaryUserId)
                        || primaryUserId.equals(secondaryUserId)) {
                return null;
            }
            return new RateMenuItemDto(displayId, primaryUserId, secondaryUserId, "pair", direction,
                    socialContext, bridgeUserId, bridgeCount,
                    scoreGiven, scoreReceived, eventName, happenedAt, distance.kilometers(), distance.metersExact());
        }

        String relatedUserId = normalizeOptionalId(record.getRelatedUserId());
        if (!StringUtils.hasText(relatedUserId)) {
            return null;
        }
        return new RateMenuItemDto(displayId, relatedUserId, null, "individual", direction,
                null, null, null,
                scoreGiven, scoreReceived, eventName, happenedAt, distance.kilometers(), distance.metersExact());
    }

    private RateMenuItemDto toGameCardRateMenuItem(UserRate record, Users currentUser) {
        String ownerUserId = currentUser == null ? null : normalizeId(currentUser.getId());
        if (!StringUtils.hasText(ownerUserId)) {
            return null;
        }
        final String resolvedOwnerUserId = Objects.requireNonNull(ownerUserId);
        String recordMode = normalizeMode(record.getMode());
        String happenedAt = normalizeDate(record.getCreatedDate(), normalizeDate(record.getUpdatedDate(), Instant.now().toString()));
        int normalizedScore = normalizeScore(record.getRate());
        RateDistance distance = resolveGameCardDistance(record, currentUser);

        if ("pair".equals(recordMode)) {
            String firstUserId = normalizeId(record.getFromUserId());
            String secondUserId = normalizeId(record.getToUserId());
            if (!StringUtils.hasText(firstUserId)
                    || !StringUtils.hasText(secondUserId)
                    || firstUserId.equals(secondUserId)) {
                return null;
            }
            String recordOwnerUserId = normalizeOptionalId(record.getOwnerUserId());
            if (resolvedOwnerUserId.equals(recordOwnerUserId)) {
                return new RateMenuItemDto(resolveResponseId(record), firstUserId, secondUserId, "pair", "given",
                        "separated-friends", null, 2,
                        normalizedScore, 0, "Pair rate", happenedAt, distance.kilometers(), distance.metersExact());
            }
            if (firstUserId.equals(resolvedOwnerUserId) || secondUserId.equals(resolvedOwnerUserId)) {
                String otherUserId = firstUserId.equals(resolvedOwnerUserId) ? secondUserId : firstUserId;
                return new RateMenuItemDto(resolveResponseId(record), otherUserId, resolvedOwnerUserId, "pair", "received",
                        "friends-in-common", recordOwnerUserId, 1,
                        0, normalizedScore, "Pair rate", happenedAt, distance.kilometers(), distance.metersExact());
            }
            return null;
        }

        boolean isGiven = resolvedOwnerUserId.equals(normalizeId(record.getFromUserId()));
        boolean isReceived = resolvedOwnerUserId.equals(normalizeId(record.getToUserId()));
        if (!isGiven && !isReceived) {
            return null;
        }
        String counterpartyUserId = isGiven ? normalizeId(record.getToUserId()) : normalizeId(record.getFromUserId());
        if (!StringUtils.hasText(counterpartyUserId)) {
            return null;
        }
        return new RateMenuItemDto(resolveResponseId(record), counterpartyUserId, null, "individual",
                isGiven ? "given" : "received",
                null, null, null,
                isGiven ? normalizedScore : 0,
                isReceived ? normalizedScore : 0,
                "Single rate",
                happenedAt,
                distance.kilometers(),
                distance.metersExact());
    }

    private ActivityRateProjection toActivityRateProjection(UserRate record, Users currentUser) {
        RateMenuItemDto item = toActivityRateMenuItem(record, currentUser);
        if (item == null) {
            return null;
        }
        int distanceMeters = exactDistanceMeters(item.distanceMetersExact(), item.distanceKm());
        return new ActivityRateProjection(
                item,
                normalizeAffinityScore(record.getAffinityScore()),
                dayStartMillis(item.happenedAt()),
                rateDateMillis(item.happenedAt()),
                distanceBucketMeters(item.distanceMetersExact(), item.distanceKm()),
                distanceMeters);
    }

    private Comparator<ActivityRateProjection> activityRateComparator(String sort, String groupDirection, String innerOrder) {
        if ("distance".equals(sort)) {
            return Comparator
                    .comparingInt(ActivityRateProjection::distanceBucketMeters)
                    .thenComparing(activityRateInnerComparator(innerOrder))
                    .thenComparingInt(ActivityRateProjection::distanceMetersExact)
                    .thenComparing(projection -> safeText(projection.item().id()));
        }

        String effectiveInnerOrder = "relevance".equals(sort) ? "relevant" : innerOrder;
        Comparator<ActivityRateProjection> dayComparator = "asc".equals(groupDirection)
                ? Comparator.comparingLong(ActivityRateProjection::dayStartMs)
                : Comparator.comparingLong(ActivityRateProjection::dayStartMs).reversed();
        return dayComparator
                .thenComparing(activityRateInnerComparator(effectiveInnerOrder));
    }

    private Comparator<ActivityRateProjection> activityRateInnerComparator(String innerOrder) {
        if ("past".equals(innerOrder)) {
            return Comparator
                    .comparingLong(ActivityRateProjection::happenedAtMs)
                    .thenComparing(ActivityRateProjection::affinityScore, Comparator.reverseOrder())
                    .thenComparing(projection -> safeText(projection.item().id()));
        }
        if ("relevant".equals(innerOrder)) {
            return Comparator
                    .comparingDouble(ActivityRateProjection::affinityScore)
                    .reversed()
                    .thenComparing(ActivityRateProjection::happenedAtMs, Comparator.reverseOrder())
                    .thenComparing(projection -> safeText(projection.item().id()));
        }
        return Comparator
                .comparing(ActivityRateProjection::happenedAtMs, Comparator.reverseOrder())
                .thenComparing(ActivityRateProjection::affinityScore, Comparator.reverseOrder())
                .thenComparing(projection -> safeText(projection.item().id()));
    }

    private boolean isWithinRange(RateMenuItemDto item, long rangeStartMs, long rangeEndMs) {
        long happenedAtMs = rateDateMillis(item.happenedAt());
        return happenedAtMs >= rangeStartMs && happenedAtMs <= rangeEndMs;
    }

    private int resolveCursorStartIndex(List<RateMenuItemDto> items, String cursor) {
        String cursorId = parseCursorId(cursor);
        if (!StringUtils.hasText(cursorId)) {
            return 0;
        }
        for (int index = 0; index < items.size(); index += 1) {
            if (cursorId.equals(normalizeId(items.get(index).id()))) {
                return index + 1;
            }
        }
        return 0;
    }

    private String serializeCursor(RateMenuItemDto item) {
        return String.format("{\"id\":\"%s\"}", safeText(item.id()));
    }

    private String parseCursorId(String cursor) {
        String normalized = safeText(cursor).trim();
        if (!normalized.contains("\"id\"")) {
            return null;
        }
        int keyIndex = normalized.indexOf("\"id\"");
        int colonIndex = normalized.indexOf(':', keyIndex);
        int firstQuote = normalized.indexOf('"', colonIndex + 1);
        int secondQuote = normalized.indexOf('"', firstQuote + 1);
        if (colonIndex < 0 || firstQuote < 0 || secondQuote < 0) {
            return null;
        }
        String value = normalized.substring(firstQuote + 1, secondQuote).trim();
        return value.isEmpty() ? null : value;
    }

    private int normalizeLimit(Integer value) {
        if (value == null) {
            return 50;
        }
        return Math.max(1, Math.min(200, value));
    }

    private String normalizeQuerySort(String value) {
        String normalized = normalizeId(value).toLowerCase();
        if ("distance".equals(normalized) || "relevance".equals(normalized)) {
            return normalized;
        }
        return "happenedAt";
    }

    private String resolveActivityInnerOrder(String sort, String sortDirectionValue, String secondaryFilterValue) {
        String normalizedSecondaryFilter = normalizeActivityInnerOrder(secondaryFilterValue);
        if (normalizedSecondaryFilter != null) {
            return normalizedSecondaryFilter;
        }

        String normalizedSortDirection = normalizeActivityInnerOrder(sortDirectionValue);
        if (normalizedSortDirection != null) {
            return normalizedSortDirection;
        }

        if ("relevance".equals(sort)) {
            return "relevant";
        }
        if ("distance".equals(sort)) {
            return "recent";
        }

        String normalizedLegacyDirection = normalizeId(sortDirectionValue).toLowerCase();
        if ("asc".equals(normalizedLegacyDirection)) {
            return "past";
        }
        return "recent";
    }

    private String resolveActivityGroupDirection(String sort, String sortDirectionValue, String innerOrder) {
        if ("distance".equals(sort)) {
            return "asc";
        }
        if ("past".equals(innerOrder)) {
            return "asc";
        }
        if ("recent".equals(innerOrder) || "relevant".equals(innerOrder)) {
            return "desc";
        }
        String normalized = normalizeId(sortDirectionValue).toLowerCase();
        if ("asc".equals(normalized) || "desc".equals(normalized)) {
            return normalized;
        }
        return "desc";
    }

    private String normalizeActivityInnerOrder(String value) {
        String normalized = normalizeId(value).toLowerCase();
        if ("recent".equals(normalized) || "past".equals(normalized) || "relevant".equals(normalized)) {
            return normalized;
        }
        return null;
    }

    private String normalizeId(String value) {
        return value == null ? "" : value.trim();
    }

    private String normalizeOptionalId(String value) {
        String normalized = normalizeId(value);
        return StringUtils.hasText(normalized) ? normalized : null;
    }

    private String normalizeOptionalText(String value) {
        if (value == null) {
            return null;
        }
        String normalized = value.trim();
        return normalized.isEmpty() ? null : normalized;
    }

    private String resolveSyncKey(UserRateRecordDto rate) {
        String id = normalizeOptionalText(rate.id());
        if (StringUtils.hasText(id)) {
            return id;
        }
        return normalizeOptionalText(rate.displayId());
    }


    private String resolveCreatedUser(
            UserRateRecordDto rate,
            String ownerUserId,
            String fromUserId,
            String toUserId,
            String updatedUserId) {
        String direction = normalizeDisplayDirection(rate.displayDirection());
        if (SOURCE_ACTIVITY_RATE.equals(normalizeSource(rate.source()))) {
            if ("received".equals(direction) || "mutual".equals(direction)) {
                return resolveActivityCounterpartyActor(ownerUserId, fromUserId, toUserId, updatedUserId);
            }
            if (StringUtils.hasText(ownerUserId)) {
                return ownerUserId;
            }
        }
        if (SOURCE_GAME_CARD.equals(normalizeSource(rate.source())) && "single".equals(normalizeMode(rate.mode()))) {
            return fromUserId;
        }
        if (StringUtils.hasText(updatedUserId)) {
            return updatedUserId;
        }
        if (StringUtils.hasText(ownerUserId)) {
            return ownerUserId;
        }
        return fromUserId;
    }

    private String resolveUpdatedUser(UserRateRecordDto rate, String ownerUserId, String fromUserId, String toUserId) {
        Users currentUser = homeUserProfileService.resolveCurrentUser(ownerUserId);
        if (currentUser != null && StringUtils.hasText(normalizeId(currentUser.getId()))) {
            return normalizeId(currentUser.getId());
        }
        String persistedDirection = normalizeDisplayDirection(rate.displayDirection());
        if (SOURCE_ACTIVITY_RATE.equals(normalizeSource(rate.source()))) {
            if ("received".equals(persistedDirection)) {
                return resolveActivityCounterpartyActor(ownerUserId, fromUserId, toUserId, fromUserId);
            }
            if (StringUtils.hasText(ownerUserId)) {
                return ownerUserId;
            }
        }
        if (SOURCE_GAME_CARD.equals(normalizeSource(rate.source())) && "single".equals(normalizeMode(rate.mode()))) {
            return fromUserId;
        }
        if (StringUtils.hasText(ownerUserId)) {
            return ownerUserId;
        }
        return fromUserId;
    }

    private String resolveActivityCounterpartyActor(String ownerUserId, String fromUserId, String toUserId, String fallback) {
        String normalizedOwnerUserId = normalizeOptionalId(ownerUserId);
        String normalizedFromUserId = normalizeOptionalId(fromUserId);
        String normalizedToUserId = normalizeOptionalId(toUserId);
        if (StringUtils.hasText(normalizedFromUserId) && !normalizedFromUserId.equals(normalizedOwnerUserId)) {
            return normalizedFromUserId;
        }
        if (StringUtils.hasText(normalizedToUserId) && !normalizedToUserId.equals(normalizedOwnerUserId)) {
            return normalizedToUserId;
        }
        return normalizeOptionalId(fallback);
    }

    private String deriveActivityDirection(UserRate record, String ownerUserId) {
        if (record == null || !StringUtils.hasText(ownerUserId)) {
            return null;
        }
        if (Boolean.TRUE.equals(record.getMet())) {
            return "met";
        }
        String createdUser = normalizeOptionalId(record.getCreatedUser());
        int scoreGiven = normalizeScore(record.getScoreGiven());
        int scoreReceived = normalizeScore(record.getScoreReceived());
        if (ownerUserId.equals(createdUser)) {
            return "given";
        }
        if (scoreGiven > 0 && scoreReceived > 0) {
            return "mutual";
        }
        if (scoreReceived > 0) {
            return "received";
        }
        if (scoreGiven > 0) {
            return "given";
        }
        return null;
    }

    private String resolvePairSocialContext(String mode, String direction) {
        if (!"pair".equals(mode)) {
            return null;
        }
        if ("given".equals(direction)) {
            return "separated-friends";
        }
        if ("received".equals(direction)) {
            return "friends-in-common";
        }
        return null;
    }

    private String resolvePairBridgeUserId(UserRate record, String ownerUserId, String socialContext) {
        if (!"friends-in-common".equals(socialContext) || record == null) {
            return null;
        }
        String recordOwnerUserId = normalizeOptionalId(record.getOwnerUserId());
        if (StringUtils.hasText(recordOwnerUserId) && !recordOwnerUserId.equals(ownerUserId)) {
            return recordOwnerUserId;
        }
        String createdUserId = normalizeOptionalId(record.getCreatedUser());
        if (StringUtils.hasText(createdUserId) && !createdUserId.equals(ownerUserId)) {
            return createdUserId;
        }
        return null;
    }

    private Integer resolvePairBridgeCount(String socialContext) {
        if ("friends-in-common".equals(socialContext)) {
            return 1;
        }
        if ("separated-friends".equals(socialContext)) {
            return 2;
        }
        return null;
    }

    private String resolveResponseId(UserRate record) {
        String syncKey = normalizeOptionalText(record.getSyncKey());
        if (StringUtils.hasText(syncKey)) {
            return syncKey;
        }
        return normalizeId(record.getId());
    }

    private String resolveSyncAcknowledgementId(UserRateRecordDto requestRate, UserRate normalizedRate) {
        String requestedId = requestRate == null ? null : normalizeOptionalText(requestRate.id());
        if (StringUtils.hasText(requestedId)) {
            return requestedId;
        }
        return resolveResponseId(normalizedRate);
    }

    private String normalizeMode(String value) {
        String normalized = normalizeId(value).toLowerCase();
        if ("single".equals(normalized) || "pair".equals(normalized)) {
            return normalized;
        }
        return null;
    }

    private String normalizeSource(String value) {
        String normalized = normalizeId(value).toLowerCase();
        if (SOURCE_GAME_CARD.equals(normalized) || SOURCE_ACTIVITY_RATE.equals(normalized)) {
            return normalized;
        }
        return null;
    }

    private String normalizeDisplayDirection(String value) {
        String normalized = normalizeId(value).toLowerCase();
        if ("given".equals(normalized) || "received".equals(normalized)
                || "mutual".equals(normalized) || "met".equals(normalized)) {
            return normalized;
        }
        return null;
    }

    private String normalizeDate(String value, String fallback) {
        String normalized = normalizeId(value);
        return StringUtils.hasText(normalized) ? normalized : fallback;
    }

    private Integer normalizeRate(Integer value, boolean allowZero) {
        if (value == null) {
            return allowZero ? 0 : null;
        }
        int normalized = Math.max(allowZero ? 0 : 1, Math.min(10, value));
        if (!allowZero && normalized <= 0) {
            return null;
        }
        return normalized;
    }

    private int normalizeScore(Integer value) {
        if (value == null) {
            return 0;
        }
        return Math.max(0, Math.min(10, value));
    }

    private boolean isMetRequest(UserRateRecordDto rate) {
        String direction = normalizeDisplayDirection(rate.displayDirection());
        return "met".equals(direction);
    }

    private String resolveActivityRelatedUserId(String mode, String ownerUserId, String fromUserId, String toUserId) {
        if ("pair".equals(mode)) {
            return normalizeOptionalId(fromUserId);
        }
        if (ownerUserId.equals(fromUserId)) {
            return normalizeOptionalId(toUserId);
        }
        if (ownerUserId.equals(toUserId)) {
            return normalizeOptionalId(fromUserId);
        }
        return null;
    }

    private String resolveActivitySecondaryRelatedUserId(String mode, String fromUserId, String toUserId) {
        if (!"pair".equals(mode)) {
            return null;
        }
        return normalizeOptionalId(toUserId);
    }

    private Double resolveAffinityScore(String mode, String relatedUserId, String secondaryRelatedUserId) {
        double total = 0d;
        int count = 0;

        Double relatedAffinity = resolveUserAffinityScore(relatedUserId);
        if (relatedAffinity != null) {
            total += relatedAffinity;
            count += 1;
        }

        if ("pair".equals(mode)) {
            Double secondaryAffinity = resolveUserAffinityScore(secondaryRelatedUserId);
            if (secondaryAffinity != null) {
                total += secondaryAffinity;
                count += 1;
            }
        }

        return count == 0 ? 0d : total / count;
    }

    private Double resolveUserAffinityScore(String userId) {
        if (!StringUtils.hasText(userId)) {
            return null;
        }
        Users user = usersRepository.findByUserId(userId).orElse(null);
        if (user == null || user.getAffinity() == null || !Double.isFinite(user.getAffinity())) {
            return null;
        }
        return Math.max(0d, user.getAffinity());
    }

    private UserRate.LocationSnapshot resolveLocationSnapshot(String userId) {
        if (!StringUtils.hasText(userId)) {
            return null;
        }
        Users user = usersRepository.findByUserId(userId).orElse(null);
        if (user == null || user.getLocationCoordinates() == null) {
            return null;
        }
        Double latitude = user.getLocationCoordinates().latitude();
        Double longitude = user.getLocationCoordinates().longitude();
        if (latitude == null || longitude == null || !Double.isFinite(latitude) || !Double.isFinite(longitude)) {
            return null;
        }
        return new UserRate.LocationSnapshot(latitude, longitude);
    }

    private RateDistance resolveActivityDistance(Users currentUser, UserRate.LocationSnapshot ownerLocation) {
        UserRate.LocationSnapshot origin = resolveCurrentUserLocation(currentUser);
        if (origin == null) {
            return ZERO_DISTANCE;
        }
        return distanceBetween(origin, ownerLocation);
    }

    private RateDistance resolveGameCardDistance(UserRate record, Users currentUser) {
        String ownerUserId = currentUser == null ? null : normalizeId(currentUser.getId());
        if (!StringUtils.hasText(ownerUserId)) {
            return ZERO_DISTANCE;
        }
        final String resolvedOwnerUserId = Objects.requireNonNull(ownerUserId);
        UserRate.LocationSnapshot origin = resolveCurrentUserLocation(currentUser);
        if (origin == null) {
            return ZERO_DISTANCE;
        }
        String firstUserId = normalizeId(record.getFromUserId());
        String secondUserId = normalizeId(record.getToUserId());
        if ("pair".equals(normalizeMode(record.getMode()))) {
            String recordOwnerUserId = normalizeOptionalId(record.getOwnerUserId());
            if (resolvedOwnerUserId.equals(recordOwnerUserId)) {
                return distanceBetween(origin, record.getOwnerLocation());
            }
            if (firstUserId.equals(resolvedOwnerUserId)) {
                return distanceBetween(origin, record.getOwnerLocation());
            }
            if (secondUserId.equals(resolvedOwnerUserId)) {
                return distanceBetween(origin, record.getOwnerLocation());
            }
            return ZERO_DISTANCE;
        }
        if (resolvedOwnerUserId.equals(firstUserId)) {
            return distanceBetween(origin, record.getOwnerLocation());
        }
        if (resolvedOwnerUserId.equals(secondUserId)) {
            return distanceBetween(origin, record.getOwnerLocation());
        }
        return ZERO_DISTANCE;
    }

    private UserRate.LocationSnapshot resolveCurrentUserLocation(Users currentUser) {
        if (currentUser == null || currentUser.getLocationCoordinates() == null) {
            return null;
        }
        Double latitude = currentUser.getLocationCoordinates().latitude();
        Double longitude = currentUser.getLocationCoordinates().longitude();
        if (latitude == null || longitude == null || !Double.isFinite(latitude) || !Double.isFinite(longitude)) {
            return null;
        }
        return new UserRate.LocationSnapshot(latitude, longitude);
    }

    private RateDistance distanceBetween(UserRate.LocationSnapshot origin, UserRate.LocationSnapshot target) {
        if (origin == null || target == null) {
            return ZERO_DISTANCE;
        }
        Double originLat = origin.latitude();
        Double originLng = origin.longitude();
        Double targetLat = target.latitude();
        Double targetLng = target.longitude();
        if (originLat == null || originLng == null || targetLat == null || targetLng == null
                || !Double.isFinite(originLat) || !Double.isFinite(originLng)
                || !Double.isFinite(targetLat) || !Double.isFinite(targetLng)) {
            return ZERO_DISTANCE;
        }
        double earthRadiusMeters = 6371000d;
        double deltaLat = Math.toRadians(targetLat - originLat);
        double deltaLng = Math.toRadians(targetLng - originLng);
        double originLatRad = Math.toRadians(originLat);
        double targetLatRad = Math.toRadians(targetLat);
        double a = Math.sin(deltaLat / 2d) * Math.sin(deltaLat / 2d)
                + Math.cos(originLatRad) * Math.cos(targetLatRad)
                * Math.sin(deltaLng / 2d) * Math.sin(deltaLng / 2d);
        double c = 2d * Math.atan2(Math.sqrt(a), Math.sqrt(1d - a));
        int meters = Math.max(0, (int) Math.round(earthRadiusMeters * c));
        return new RateDistance(meters / 1000d, meters);
    }

    private static double normalizeAffinityScore(Double value) {
        if (value == null || !Double.isFinite(value)) {
            return 0d;
        }
        return Math.max(0d, value);
    }

    private static int exactDistanceMeters(Integer distanceMetersExact, Double distanceKm) {
        if (distanceMetersExact != null) {
            return Math.max(0, distanceMetersExact);
        }
        if (distanceKm == null || !Double.isFinite(distanceKm)) {
            return 0;
        }
        return Math.max(0, (int) Math.round(distanceKm * 1000d));
    }

    private static int distanceBucketMeters(Integer distanceMetersExact, Double distanceKm) {
        int meters = exactDistanceMeters(distanceMetersExact, distanceKm);
        return Math.max(5000, (int) Math.ceil(meters / 5000d) * 5000);
    }

    private static long rateDateMillis(String value) {
        return parseIsoMillis(value, 0L);
    }

    private static long dayStartMillis(String value) {
        return toDayStartMs(rateDateMillis(value));
    }

    private static long parseIsoMillis(String value, long fallback) {
        try {
            return Instant.parse(safeText(value)).toEpochMilli();
        } catch (Exception exception) {
            return fallback;
        }
    }

    private static long toDayStartMs(long value) {
        return ZonedDateTime.ofInstant(Instant.ofEpochMilli(value), ZoneOffset.UTC)
                .toLocalDate()
                .atStartOfDay(ZoneOffset.UTC)
                .toInstant()
                .toEpochMilli();
    }

    private static String safeText(String value) {
        return value == null ? "" : value;
    }

    private record ActivityRateProjection(
            RateMenuItemDto item,
            double affinityScore,
            long dayStartMs,
            long happenedAtMs,
            int distanceBucketMeters,
            int distanceMetersExact) {
    }

    private record RateDistance(double kilometers, int metersExact) {
    }
}
