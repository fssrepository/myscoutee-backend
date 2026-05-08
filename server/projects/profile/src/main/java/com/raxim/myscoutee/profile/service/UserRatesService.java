package com.raxim.myscoutee.profile.service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

import org.bson.types.ObjectId;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.index.Index;
import org.springframework.data.mongodb.core.index.IndexInfo;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import jakarta.annotation.PostConstruct;

import com.raxim.myscoutee.profile.data.document.UserRate;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.UserDto;
import com.raxim.myscoutee.profile.data.dto.rates.RatesDtos.ActivityRatePageResponseDto;
import com.raxim.myscoutee.profile.data.dto.rates.RatesDtos.RateMenuItemDto;
import com.raxim.myscoutee.profile.data.dto.rates.RatesDtos.UserRateRecordDto;
import com.raxim.myscoutee.profile.data.dto.rates.RatesDtos.UserRatesSyncRequestDto;
import com.raxim.myscoutee.profile.data.dto.rates.RatesDtos.UserRatesSyncResponseDto;
import com.raxim.myscoutee.profile.repository.UserRatesRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;

@Service
public class UserRatesService {
    private static final RateDistance ZERO_DISTANCE = new RateDistance(0);

    private final UserRatesRepository userRatesRepository;
    private final UsersRepository usersRepository;
    private final HomeUserProfileService homeUserProfileService;
    private final AffinityCalculationService affinityCalculationService;
    private final UserAffinityEdgeService userAffinityEdgeService;
    private final MongoTemplate mongoTemplate;

    public UserRatesService(
            UserRatesRepository userRatesRepository,
            UsersRepository usersRepository,
            HomeUserProfileService homeUserProfileService,
            AffinityCalculationService affinityCalculationService,
            UserAffinityEdgeService userAffinityEdgeService,
            MongoTemplate mongoTemplate) {
        this.userRatesRepository = userRatesRepository;
        this.usersRepository = usersRepository;
        this.homeUserProfileService = homeUserProfileService;
        this.affinityCalculationService = affinityCalculationService;
        this.userAffinityEdgeService = userAffinityEdgeService;
        this.mongoTemplate = mongoTemplate;
    }

    @PostConstruct
    void ensureUserRateIndexes() {
        ensureCanonicalUserRateIndexes();
    }

    public List<RateMenuItemDto> queryRateItemsByUser(String requestedUserId) {
        Users currentUser = homeUserProfileService.resolveCurrentUser(requestedUserId);
        String ownerUserId = currentUser == null ? null : normalizeId(currentUser.getId());
        if (!StringUtils.hasText(ownerUserId)) {
            return List.of();
        }

        return queryNormalizedRateItems(currentUser, ownerUserId).stream()
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
            boolean socialBadgeEnabled,
            String cursor,
            Integer limitValue,
            String rangeStartIso,
            String rangeEndIso) {
        Users currentUser = homeUserProfileService.resolveCurrentUser(requestedUserId);
        String ownerUserId = currentUser == null ? null : normalizeId(currentUser.getId());
        String mode = normalizeMode(modeValue);
        String direction = normalizeDisplayDirection(directionValue);
        if (!StringUtils.hasText(ownerUserId) || !StringUtils.hasText(mode) || !StringUtils.hasText(direction)) {
            return new ActivityRatePageResponseDto(List.of(), 0, null, List.of());
        }

        String sort = normalizeQuerySort(sortValue);
        String innerOrder = resolveActivityInnerOrder(sort, sortDirectionValue, secondaryFilterValue);
        String groupDirection = resolveActivityGroupDirection(sort, sortDirectionValue, innerOrder);
        long rangeStartMs = parseRangeBoundaryMillis(rangeStartIso, 0L, false);
        long rangeEndMs = parseRangeBoundaryMillis(rangeEndIso, Long.MAX_VALUE, true);
        if (rangeStartMs > rangeEndMs) {
            return new ActivityRatePageResponseDto(List.of(), 0, null, List.of());
        }

        List<RatePageProjection> projections = queryNormalizedRateItems(currentUser, ownerUserId).stream()
                .filter(item -> matchesRequestedMode(item, mode))
                .filter(item -> direction.equals(item.direction()))
                .filter(item -> matchesSocialBadgeFilter(item, mode, socialBadgeEnabled))
                .filter(item -> isWithinRange(item, rangeStartMs, rangeEndMs))
                .map(this::toRatePageProjection)
                .filter(Objects::nonNull)
                .toList();

        List<RateMenuItemDto> items = dedupeRatePageProjections(projections).stream()
                .sorted(ratePageComparator(sort, groupDirection, innerOrder))
                .map(RatePageProjection::item)
                .toList();

        int startIndex = resolveCursorStartIndex(items, cursor);
        int limit = normalizeLimit(limitValue);
        int endIndex = Math.min(items.size(), startIndex + limit);
        List<RateMenuItemDto> pageItems = items.subList(startIndex, endIndex);
        String nextCursor = endIndex < items.size() && !pageItems.isEmpty()
                ? serializeCursor(pageItems.get(pageItems.size() - 1))
                : null;
        List<UserDto> users = homeUserProfileService.queryUsersByIds(resolveDisplayUserIds(pageItems));

        return new ActivityRatePageResponseDto(pageItems, items.size(), nextCursor, users);
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
            affinityCalculationService.applyAffinity(normalizedRates);
            List<UserRate> savedRates = new ArrayList<>();
            userRatesRepository.saveAll(normalizedRates).forEach(savedRates::add);
            userAffinityEdgeService.recomputeForRates(savedRates.isEmpty() ? normalizedRates : savedRates);
        }
        return new UserRatesSyncResponseDto(syncedRateIds, failedRateIds);
    }

    private void ensureCanonicalUserRateIndexes() {
        var indexOps = mongoTemplate.indexOps(UserRate.class);
        Set<String> existingIndexNames = indexOps.getIndexInfo().stream()
                .map(IndexInfo::getName)
                .filter(Objects::nonNull)
                .collect(LinkedHashSet::new, Set::add, Set::addAll);

        dropIndexIfPresent(indexOps, existingIndexNames, "user_rate_game_card_from");
        dropIndexIfPresent(indexOps, existingIndexNames, "user_rate_game_card_to");
        dropIndexIfPresent(indexOps, existingIndexNames, "user_rate_game_card_pair_owner");
        dropIndexIfPresent(indexOps, existingIndexNames, "user_rate_lane_owner");
        dropIndexIfPresent(indexOps, existingIndexNames, "user_rate_owner_mode_updated");
        dropIndexIfPresent(indexOps, existingIndexNames, "user_rate_primary_lookup");
        dropIndexIfPresent(indexOps, existingIndexNames, "user_rate_secondary_lookup");
        dropIndexIfPresent(indexOps, existingIndexNames, "user_rate_owner_primary_mode");

        indexOps.createIndex(new Index()
                .named("user_rate_owner_mode_updated_v2")
                .on("ownerUserId", Sort.Direction.ASC)
                .on("mode", Sort.Direction.ASC)
                .on("updatedDate", Sort.Direction.DESC));
        indexOps.createIndex(new Index()
                .named("user_rate_primary_lookup_v2")
                .on("relatedUserId", Sort.Direction.ASC)
                .on("updatedDate", Sort.Direction.DESC));
        indexOps.createIndex(new Index()
                .named("user_rate_secondary_lookup_v2")
                .on("secondaryRelatedUserId", Sort.Direction.ASC)
                .on("updatedDate", Sort.Direction.DESC)
                .sparse());
        indexOps.createIndex(new Index()
                .named("user_rate_owner_primary_mode_v2")
                .on("ownerUserId", Sort.Direction.ASC)
                .on("relatedUserId", Sort.Direction.ASC)
                .on("secondaryRelatedUserId", Sort.Direction.ASC)
                .on("mode", Sort.Direction.ASC));
        indexOps.createIndex(new Index()
                .named("user_rate_pair_lookup_v2")
                .on("relatedUserId", Sort.Direction.ASC)
                .on("secondaryRelatedUserId", Sort.Direction.ASC)
                .on("mode", Sort.Direction.ASC));
    }

    private void dropIndexIfPresent(
            org.springframework.data.mongodb.core.index.IndexOperations indexOps,
            Set<String> existingIndexNames,
            String indexName) {
        if (!existingIndexNames.contains(indexName)) {
            return;
        }
        indexOps.dropIndex(indexName);
    }

    private List<RateMenuItemDto> queryNormalizedRateItems(Users currentUser, String ownerUserId) {
        Map<String, UserRate> recordsById = new LinkedHashMap<>();
        addRecords(recordsById, userRatesRepository.findRelevantByUserIds(List.of(ownerUserId)));

        List<RateMenuItemDto> items = dedupeRateItems(recordsById.values().stream()
                .map(record -> toRateMenuItem(record, currentUser))
                .filter(Objects::nonNull)
                .toList());
        return filterActivityRateVisibleItems(items, ownerUserId);
    }

    private void addRecords(Map<String, UserRate> target, List<UserRate> records) {
        for (UserRate record : records) {
            if (record == null || !StringUtils.hasText(normalizeId(record.getId()))) {
                continue;
            }
            target.put(record.getId(), record);
        }
    }

    private Set<String> resolveDisplayUserIds(List<RateMenuItemDto> items) {
        Set<String> userIds = new LinkedHashSet<>();
        for (RateMenuItemDto item : items) {
            if (item == null) {
                continue;
            }
            addUserId(userIds, item.userId());
            addUserId(userIds, item.secondaryUserId());
            addUserId(userIds, item.bridgeUserId());
        }
        return userIds;
    }

    private List<RateMenuItemDto> filterActivityRateVisibleItems(List<RateMenuItemDto> items, String ownerUserId) {
        if (items == null || items.isEmpty()) {
            return List.of();
        }
        Set<String> checkedUserIds = resolveDisplayUserIds(items).stream()
                .filter(userId -> !normalizeId(userId).equals(normalizeId(ownerUserId)))
                .collect(LinkedHashSet::new, Set::add, Set::addAll);
        if (checkedUserIds.isEmpty()) {
            return items;
        }

        Map<String, Users> usersById = usersRepository.findByUserIdIn(checkedUserIds).stream()
                .filter(Objects::nonNull)
                .collect(LinkedHashMap::new, (target, user) -> target.put(normalizeId(user.getId()), user), Map::putAll);
        return items.stream()
                .filter(item -> activityRateItemUsersAreVisible(item, ownerUserId, usersById))
                .toList();
    }

    private boolean activityRateItemUsersAreVisible(
            RateMenuItemDto item,
            String ownerUserId,
            Map<String, Users> usersById) {
        if (item == null) {
            return false;
        }
        String normalizedOwnerUserId = normalizeId(ownerUserId);
        Set<String> displayedUserIds = new LinkedHashSet<>();
        addUserId(displayedUserIds, item.userId());
        addUserId(displayedUserIds, item.secondaryUserId());
        addUserId(displayedUserIds, item.bridgeUserId());
        displayedUserIds.remove(normalizedOwnerUserId);
        for (String userId : displayedUserIds) {
            Users user = usersById.get(normalizeId(userId));
            if (!homeUserProfileService.isActivityRateVisibleUser(user)) {
                return false;
            }
        }
        return true;
    }

    private void addUserId(Set<String> target, String userId) {
        String normalizedUserId = normalizeId(userId);
        if (StringUtils.hasText(normalizedUserId)) {
            target.add(normalizedUserId);
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

    private List<RatePageProjection> dedupeRatePageProjections(List<RatePageProjection> projections) {
        Map<String, RatePageProjection> deduped = new LinkedHashMap<>();
        for (RatePageProjection projection : projections) {
            if (projection == null || projection.item() == null || !StringUtils.hasText(safeText(projection.item().id()))) {
                continue;
            }
            RatePageProjection existing = deduped.get(projection.item().id());
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
        if (!StringUtils.hasText(syncKey)
                || !StringUtils.hasText(mode)) {
            return null;
        }

        UserRate existing = userRatesRepository.findBySyncKey(syncKey).orElse(null);
        String fromUserId = normalizeOptionalId(rate.fromUserId());
        String toUserId = normalizeOptionalId(rate.toUserId());
        String ownerUserId = resolveOwnerUserId(mode, rate.ownerUserId(), fromUserId);
        String updatedUserId = resolveUpdatedUser(rate, ownerUserId, fromUserId, toUserId);
        String createdUserId = existing != null
                ? normalizeOptionalText(existing.getCreatedUser())
                : resolveCreatedUser(rate, ownerUserId, fromUserId, toUserId, updatedUserId);
        String nowIso = Instant.now().toString();

        UserRate document = existing != null ? existing : new UserRate();
        document.setId(existing != null ? existing.getId() : new ObjectId().toHexString());
        document.setSyncKey(syncKey);
        document.setMode(mode);
        document.setCreatedDate(existing != null
                ? normalizeDate(existing.getCreatedDate(), nowIso)
                : normalizeDate(rate.createdAtIso(), normalizeDate(rate.happenedAtIso(), normalizeDate(rate.updatedAtIso(), nowIso))));
        document.setCreatedUser(createdUserId);
        document.setUpdatedDate(normalizeDate(rate.updatedAtIso(), nowIso));
        document.setUpdatedUser(updatedUserId);
        document.setOwnerUserId(ownerUserId);
        document.setOwnerLocation(resolveLocationSnapshot(ownerUserId));

        return normalizeRateRecord(document, rate, mode, ownerUserId, fromUserId, toUserId);
    }

    private UserRate normalizeRateRecord(
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

        document.setRelatedUserId(relatedUserId);
        document.setSecondaryRelatedUserId(secondaryRelatedUserId);
        String storedSocialContext = resolveStoredSocialContext(mode, rate.socialContext());
        document.setScoreGiven(resolveScoreGiven(rate));
        document.setScoreReceived(normalizeScore(rate.scoreReceived()));
        document.setSocialContext(storedSocialContext);
        document.setBridgeUserId(resolveStoredBridgeUserId(
                mode,
                storedSocialContext,
                rate.bridgeUserId(),
                ownerUserId,
                relatedUserId,
                secondaryRelatedUserId));
        document.setBridgeCount(resolveStoredBridgeCount(storedSocialContext, rate.bridgeCount()));
        document.setMet(met);
        document.setEventName(met
                ? (StringUtils.hasText(requestedEventName) ? requestedEventName : preservedEventName)
                : null);
        return document;
    }

    private RateMenuItemDto toRateMenuItem(UserRate record, Users currentUser) {
        if (record == null || currentUser == null) {
            return null;
        }
        return toActivityRateMenuItem(record, currentUser);
    }

    private RateMenuItemDto toActivityRateMenuItem(UserRate record, Users currentUser) {
        String currentUserId = normalizeOptionalId(currentUser == null ? null : currentUser.getId());
        String recordOwnerUserId = normalizeOptionalId(record.getOwnerUserId());
        if (currentUserId == null || recordOwnerUserId == null) {
            return null;
        }
        final String resolvedCurrentUserId = currentUserId;

        boolean isOwnerView = resolvedCurrentUserId.equals(recordOwnerUserId);
        boolean isParticipantView = matchesActivityParticipant(record, resolvedCurrentUserId);
        if (!isOwnerView && !isParticipantView) {
            return null;
        }

        String direction = isOwnerView
                ? deriveActivityDirection(record, resolvedCurrentUserId)
                : deriveParticipantActivityDirection(record, resolvedCurrentUserId);
        if (!StringUtils.hasText(direction)) {
            return null;
        }

        String displayId = resolveResponseId(record);
        String happenedAt = normalizeDate(record.getCreatedDate(), normalizeDate(record.getUpdatedDate(), Instant.now().toString()));
        int scoreGiven = isOwnerView ? normalizeScore(record.getScoreGiven()) : 0;
        int scoreReceived = isOwnerView
                ? normalizeScore(record.getScoreReceived())
                : resolveParticipantIncomingScore(record);
        String eventName = StringUtils.hasText(normalizeOptionalText(record.getEventName()))
                ? normalizeOptionalText(record.getEventName())
                : ("met".equals(direction) ? "Met" : "Rate");
        RateDistance distance = resolveActivityDistance(currentUser, record.getOwnerLocation());
        String socialContext = resolvePairSocialContext(normalizeMode(record.getMode()), record.getSocialContext());
        String bridgeUserId = resolvePairBridgeUserId(record, resolvedCurrentUserId, socialContext);
        Integer bridgeCount = resolvePairBridgeCount(socialContext);

        if ("pair".equals(normalizeMode(record.getMode()))) {
            String primaryUserId = normalizeOptionalId(record.getRelatedUserId());
            String secondaryUserId = normalizeOptionalId(record.getSecondaryRelatedUserId());
            if (!StringUtils.hasText(primaryUserId)
                    || !StringUtils.hasText(secondaryUserId)
                    || primaryUserId.equals(secondaryUserId)) {
                return null;
            }
            if (!isOwnerView) {
                String participantOtherUserId = resolveParticipantOtherUserId(record, resolvedCurrentUserId);
                if (!StringUtils.hasText(participantOtherUserId)) {
                    return null;
                }
                return new RateMenuItemDto(displayId, participantOtherUserId, resolvedCurrentUserId, "pair", direction,
                        socialContext, bridgeUserId, bridgeCount,
                        scoreGiven, scoreReceived, eventName, happenedAt, distance.metersExact());
            }
            return new RateMenuItemDto(displayId, primaryUserId, secondaryUserId, "pair", direction,
                    socialContext, bridgeUserId, bridgeCount,
                    scoreGiven, scoreReceived, eventName, happenedAt, distance.metersExact());
        }

        String relatedUserId = isOwnerView
                ? normalizeOptionalId(record.getRelatedUserId())
                : recordOwnerUserId;
        if (!StringUtils.hasText(relatedUserId) || currentUserId.equals(relatedUserId)) {
            return null;
        }
        String individualSocialContext = resolveIndividualSocialContext(record);
        return new RateMenuItemDto(displayId, relatedUserId, null, "individual", direction,
                individualSocialContext,
                resolveIndividualBridgeUserId(record, resolvedCurrentUserId, relatedUserId, individualSocialContext),
                resolveIndividualBridgeCount(record, individualSocialContext),
                scoreGiven, scoreReceived, eventName, happenedAt, distance.metersExact());
    }

    private RatePageProjection toRatePageProjection(RateMenuItemDto item) {
        if (item == null) {
            return null;
        }
        int distanceMeters = exactDistanceMeters(item.distanceMetersExact());
        return new RatePageProjection(
                item,
                resolveRateRelevanceScore(item),
                dayStartMillis(item.happenedAt()),
                rateDateMillis(item.happenedAt()),
                distanceBucketMeters(item.distanceMetersExact()),
                distanceMeters);
    }

    private Comparator<RatePageProjection> ratePageComparator(String sort, String groupDirection, String innerOrder) {
        if ("distance".equals(sort)) {
            return Comparator
                    .comparingInt(RatePageProjection::distanceBucketMeters)
                    .thenComparing(ratePageInnerComparator(innerOrder))
                    .thenComparingInt(RatePageProjection::distanceMetersExact)
                    .thenComparing(projection -> safeText(projection.item().id()));
        }

        String effectiveInnerOrder = "relevance".equals(sort) ? "relevant" : innerOrder;
        Comparator<RatePageProjection> dayComparator = "asc".equals(groupDirection)
                ? Comparator.comparingLong(RatePageProjection::dayStartMs)
                : Comparator.comparingLong(RatePageProjection::dayStartMs).reversed();
        return dayComparator
                .thenComparing(ratePageInnerComparator(effectiveInnerOrder));
    }

    private Comparator<RatePageProjection> ratePageInnerComparator(String innerOrder) {
        if ("past".equals(innerOrder)) {
            return Comparator
                    .comparingLong(RatePageProjection::happenedAtMs)
                    .thenComparing(RatePageProjection::relevanceScore, Comparator.reverseOrder())
                    .thenComparing(projection -> safeText(projection.item().id()));
        }
        if ("relevant".equals(innerOrder)) {
            return Comparator
                    .comparingDouble(RatePageProjection::relevanceScore)
                    .reversed()
                    .thenComparing(RatePageProjection::happenedAtMs, Comparator.reverseOrder())
                    .thenComparing(projection -> safeText(projection.item().id()));
        }
        return Comparator
                .comparing(RatePageProjection::happenedAtMs, Comparator.reverseOrder())
                .thenComparing(RatePageProjection::relevanceScore, Comparator.reverseOrder())
                .thenComparing(projection -> safeText(projection.item().id()));
    }

    private boolean isWithinRange(RateMenuItemDto item, long rangeStartMs, long rangeEndMs) {
        long happenedAtMs = rateDateMillis(item.happenedAt());
        return happenedAtMs >= rangeStartMs && happenedAtMs <= rangeEndMs;
    }

    private boolean matchesRequestedMode(RateMenuItemDto item, String mode) {
        if (item == null || !StringUtils.hasText(mode)) {
            return false;
        }
        if ("pair".equals(mode)) {
            return "pair".equals(normalizeId(item.mode()));
        }
        return "individual".equals(normalizeId(item.mode()));
    }

    private double resolveRateRelevanceScore(RateMenuItemDto item) {
        if (item == null) {
            return 0d;
        }
        int scoreGiven = normalizeScore(item.scoreGiven());
        int scoreReceived = normalizeScore(item.scoreReceived());
        if ("mutual".equals(normalizeDisplayDirection(item.direction()))) {
            return scoreGiven + scoreReceived;
        }
        return scoreGiven > 0 ? scoreGiven : 5d;
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

    private String resolveOwnerUserId(String mode, String requestedOwnerUserId, String fromUserId) {
        String ownerUserId = normalizeOptionalId(requestedOwnerUserId);
        if (StringUtils.hasText(ownerUserId)) {
            return ownerUserId;
        }
        if ("single".equals(mode)) {
            return normalizeOptionalId(fromUserId);
        }
        return null;
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
        if ("received".equals(direction) || "mutual".equals(direction)) {
            return resolveActivityCounterpartyActor(ownerUserId, fromUserId, toUserId, updatedUserId);
        }
        if (StringUtils.hasText(ownerUserId)) {
            return ownerUserId;
        }
        if (StringUtils.hasText(updatedUserId)) {
            return updatedUserId;
        }
        return fromUserId;
    }

    private String resolveUpdatedUser(UserRateRecordDto rate, String ownerUserId, String fromUserId, String toUserId) {
        Users currentUser = homeUserProfileService.resolveCurrentUser(ownerUserId);
        if (currentUser != null && StringUtils.hasText(normalizeId(currentUser.getId()))) {
            return normalizeId(currentUser.getId());
        }
        String persistedDirection = normalizeDisplayDirection(rate.displayDirection());
        if ("received".equals(persistedDirection)) {
            return resolveActivityCounterpartyActor(ownerUserId, fromUserId, toUserId, fromUserId);
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
        String mode = normalizeMode(record.getMode());
        int scoreGiven = normalizeScore(record.getScoreGiven());
        int scoreReceived = normalizeScore(record.getScoreReceived());
        if ("pair".equals(mode)) {
            if (matchesActivityParticipant(record, ownerUserId) && scoreGiven <= 0 && scoreReceived > 0) {
                return "received";
            }
            return scoreGiven > 0 || scoreReceived > 0 ? "given" : null;
        }
        if (scoreGiven > 0 && scoreReceived > 0) {
            return "mutual";
        }
        if (scoreGiven > 0) {
            return "given";
        }
        if (scoreReceived > 0) {
            return "received";
        }
        return null;
    }

    private String deriveParticipantActivityDirection(UserRate record, String currentUserId) {
        if (record == null || !StringUtils.hasText(currentUserId) || !matchesActivityParticipant(record, currentUserId)) {
            return null;
        }
        if (Boolean.TRUE.equals(record.getMet())) {
            return "met";
        }
        if (normalizeScore(record.getScoreGiven()) > 0 || normalizeScore(record.getScoreReceived()) > 0) {
            return "received";
        }
        return null;
    }

    private boolean matchesActivityParticipant(UserRate record, String currentUserId) {
        if (record == null || !StringUtils.hasText(currentUserId)) {
            return false;
        }
        return currentUserId.equals(normalizeOptionalId(record.getRelatedUserId()))
                || currentUserId.equals(normalizeOptionalId(record.getSecondaryRelatedUserId()));
    }

    private int resolveParticipantIncomingScore(UserRate record) {
        int scoreGiven = normalizeScore(record == null ? null : record.getScoreGiven());
        if (scoreGiven > 0) {
            return scoreGiven;
        }
        return normalizeScore(record == null ? null : record.getScoreReceived());
    }

    private String resolveParticipantOtherUserId(UserRate record, String currentUserId) {
        String primaryUserId = normalizeOptionalId(record == null ? null : record.getRelatedUserId());
        String secondaryUserId = normalizeOptionalId(record == null ? null : record.getSecondaryRelatedUserId());
        if (!StringUtils.hasText(currentUserId)) {
            return null;
        }
        if (currentUserId.equals(primaryUserId)) {
            return secondaryUserId;
        }
        if (currentUserId.equals(secondaryUserId)) {
            return primaryUserId;
        }
        return null;
    }

    private String resolvePairSocialContext(String mode, String storedSocialContext) {
        if (!"pair".equals(mode)) {
            return null;
        }
        if ("separated-friends".equals(normalizeOptionalText(storedSocialContext))) {
            return "separated-friends";
        }
        return null;
    }

    private String resolveIndividualSocialContext(UserRate record) {
        String socialContext = normalizeOptionalText(record == null ? null : record.getSocialContext());
        return "friends-in-common".equals(socialContext) ? "friends-in-common" : null;
    }

    private String resolveStoredSocialContext(String mode, String socialContext) {
        String normalized = normalizeOptionalText(socialContext);
        if ("single".equals(mode) && "friends-in-common".equals(normalized)) {
            return normalized;
        }
        if ("pair".equals(mode) && "separated-friends".equals(normalized)) {
            return normalized;
        }
        return null;
    }

    private String resolveStoredBridgeUserId(
            String mode,
            String socialContext,
            String bridgeUserId,
            String ownerUserId,
            String relatedUserId,
            String secondaryRelatedUserId) {
        if (!"single".equals(mode) || !"friends-in-common".equals(socialContext)) {
            return null;
        }
        String normalizedBridgeUserId = normalizeOptionalId(bridgeUserId);
        if (!StringUtils.hasText(normalizedBridgeUserId)
                || normalizedBridgeUserId.equals(ownerUserId)
                || normalizedBridgeUserId.equals(relatedUserId)
                || normalizedBridgeUserId.equals(secondaryRelatedUserId)) {
            return null;
        }
        return normalizedBridgeUserId;
    }

    private Integer resolveStoredBridgeCount(String socialContext, Integer bridgeCount) {
        if (!"friends-in-common".equals(socialContext)) {
            return null;
        }
        if (bridgeCount == null) {
            return null;
        }
        return Math.max(1, bridgeCount);
    }

    private String resolveIndividualBridgeUserId(
            UserRate record,
            String currentUserId,
            String relatedUserId,
            String socialContext) {
        if (!"friends-in-common".equals(socialContext) || record == null) {
            return null;
        }
        String bridgeUserId = normalizeOptionalId(record.getBridgeUserId());
        if (!StringUtils.hasText(bridgeUserId)
                || bridgeUserId.equals(currentUserId)
                || bridgeUserId.equals(relatedUserId)) {
            return null;
        }
        return bridgeUserId;
    }

    private Integer resolveIndividualBridgeCount(UserRate record, String socialContext) {
        if (!"friends-in-common".equals(socialContext) || record == null || record.getBridgeCount() == null) {
            return null;
        }
        return Math.max(1, record.getBridgeCount());
    }

    private boolean matchesSocialBadgeFilter(RateMenuItemDto item, String mode, boolean socialBadgeEnabled) {
        String socialContext = normalizeOptionalText(item == null ? null : item.socialContext());
        if ("single".equals(mode)) {
            boolean friendsInCommon = "friends-in-common".equals(socialContext);
            return socialBadgeEnabled ? friendsInCommon : !friendsInCommon;
        }
        if ("pair".equals(mode)) {
            boolean insideNetwork = "separated-friends".equals(socialContext);
            return socialBadgeEnabled ? insideNetwork : !insideNetwork;
        }
        return true;
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

    private int normalizeScore(Integer value) {
        if (value == null) {
            return 0;
        }
        return Math.max(0, Math.min(10, value));
    }

    private int resolveScoreGiven(UserRateRecordDto rate) {
        int scoreGiven = normalizeScore(rate == null ? null : rate.scoreGiven());
        if (scoreGiven > 0) {
            return scoreGiven;
        }
        return normalizeScore(rate == null ? null : rate.rate());
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
        return new RateDistance(meters);
    }

    private static int exactDistanceMeters(Integer distanceMetersExact) {
        if (distanceMetersExact != null) {
            return Math.max(0, distanceMetersExact);
        }
        return 0;
    }

    private static int distanceBucketMeters(Integer distanceMetersExact) {
        int meters = exactDistanceMeters(distanceMetersExact);
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
            try {
                return LocalDate.parse(safeText(value)).atStartOfDay(ZoneOffset.UTC).toInstant().toEpochMilli();
            } catch (DateTimeParseException secondException) {
                return fallback;
            }
        }
    }

    private static long parseRangeBoundaryMillis(String value, long fallback, boolean endOfDay) {
        long parsed = parseIsoMillis(value, fallback);
        if (parsed == fallback || !StringUtils.hasText(value) || !safeText(value).trim().matches("\\d{4}-\\d{2}-\\d{2}")) {
            return parsed;
        }
        return endOfDay ? parsed + 86_399_999L : parsed;
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

    private record RatePageProjection(
            RateMenuItemDto item,
            double relevanceScore,
            long dayStartMs,
            long happenedAtMs,
            int distanceBucketMeters,
            int distanceMetersExact) {
    }

    private record RateDistance(int metersExact) {
    }
}
