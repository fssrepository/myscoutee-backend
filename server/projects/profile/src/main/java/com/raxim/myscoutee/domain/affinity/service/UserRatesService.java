package com.raxim.myscoutee.domain.affinity.service;

import com.raxim.myscoutee.domain.groups.api.GroupDirectory;

import com.raxim.myscoutee.domain.groups.api.WorkspaceContext;

import com.raxim.myscoutee.domain.accounts.api.RatingSession;
import com.raxim.myscoutee.domain.accounts.api.ProfileCards;
import com.raxim.myscoutee.domain.accounts.api.ProfileReadState;
import com.raxim.myscoutee.domain.accounts.api.FollowingEvents;
import com.raxim.myscoutee.domain.administration.api.OperationalTelemetry;
import com.raxim.myscoutee.domain.feedback.api.FeedbackPreparation;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.index.Index;
import org.springframework.data.mongodb.core.index.IndexInfo;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;


import jakarta.annotation.PostConstruct;

import com.raxim.myscoutee.domain.affinity.document.UserRate;
import com.raxim.myscoutee.domain.accounts.dto.RatingSessionDto;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserDto;
import com.raxim.myscoutee.domain.affinity.dto.RatesDtos.ActivityRatePageResponseDto;
import com.raxim.myscoutee.domain.affinity.dto.RatesDtos.RateMenuItemDto;
import com.raxim.myscoutee.domain.affinity.dto.RatesDtos.UserRateRecordDto;
import com.raxim.myscoutee.domain.affinity.dto.RatesDtos.RatingSnapshotDto;
import com.raxim.myscoutee.domain.affinity.dto.RatesDtos.UserRatesSyncRequestDto;
import com.raxim.myscoutee.domain.affinity.dto.RatesDtos.UserRatesSyncResponseDto;
import com.raxim.myscoutee.domain.affinity.repository.UserRatesRepository;
import com.raxim.myscoutee.domain.accounts.api.RatingProfiles;
import com.raxim.myscoutee.domain.accounts.dto.RatingProfileDto;
import com.raxim.myscoutee.domain.notifications.api.NotificationDelivery;
import com.raxim.myscoutee.domain.notifications.api.NotificationDelivery.NotificationIntent;

@Service
public class UserRatesService implements com.raxim.myscoutee.domain.affinity.api.Ratings {
    private GroupDirectory groupDirectory;

    @org.springframework.beans.factory.annotation.Autowired
    void setGroupDirectory(GroupDirectory groupDirectory) {
        this.groupDirectory = groupDirectory;
    }
    private com.raxim.myscoutee.domain.campaigns.api.CampaignCatalog campaignCatalog;

    @org.springframework.beans.factory.annotation.Autowired
    void setCampaignCatalog(com.raxim.myscoutee.domain.campaigns.api.CampaignCatalog campaignCatalog) {
        this.campaignCatalog = campaignCatalog;
    }
    private static final RateDistance ZERO_DISTANCE = new RateDistance(0);

    private com.raxim.myscoutee.domain.accounts.api.AccountAffinityProjections accountProjections;

    @Autowired
    void setAccountProjections(com.raxim.myscoutee.domain.accounts.api.AccountAffinityProjections accountProjections) {
        this.accountProjections = accountProjections;
    }
    private final UserRatesRepository userRatesRepository;
    private final RatingProfiles ratingProfiles;
    private final RatingSession ratingSession;
    private final ProfileCards profileCards;
    private final ProfileReadState profileReadState;
    private final AffinityCalculationService affinityCalculationService;
    private final UserAffinityEdgeService userAffinityEdgeService;
    private final MongoTemplate mongoTemplate;
    private final OperationalTelemetry adminTelemetryService;
    private final AffinityRecomputeTaskService affinityRecomputeTaskService;
    private final NotificationDelivery notificationOutboxService;
    private final FollowingEvents organizerFollowingService;
    private com.raxim.myscoutee.domain.accounts.api.FriendshipProjections friendships;

    @Autowired
    void setFriendships(com.raxim.myscoutee.domain.accounts.api.FriendshipProjections friendships) {
        this.friendships = friendships;
    }

    @Autowired
    public UserRatesService(
            UserRatesRepository userRatesRepository,
            RatingProfiles ratingProfiles,
            RatingSession ratingSession,
            ProfileCards profileCards,
            ProfileReadState profileReadState,
            AffinityCalculationService affinityCalculationService,
            UserAffinityEdgeService userAffinityEdgeService,
            MongoTemplate mongoTemplate,
            OperationalTelemetry adminTelemetryService,
            AffinityRecomputeTaskService affinityRecomputeTaskService,
            NotificationDelivery notificationOutboxService,
            FollowingEvents organizerFollowingService) {
        this.userRatesRepository = userRatesRepository;
        this.ratingProfiles = ratingProfiles;
        this.ratingSession = ratingSession;
        this.profileCards = profileCards;
        this.profileReadState = profileReadState;
        this.affinityCalculationService = affinityCalculationService;
        this.userAffinityEdgeService = userAffinityEdgeService;
        this.mongoTemplate = mongoTemplate;
        this.adminTelemetryService = adminTelemetryService;
        this.affinityRecomputeTaskService = affinityRecomputeTaskService;
        this.notificationOutboxService = notificationOutboxService;
        this.organizerFollowingService = organizerFollowingService;
    }

    UserRatesService(
            UserRatesRepository userRatesRepository,
            RatingProfiles ratingProfiles,
            RatingSession ratingSession,
            ProfileCards profileCards,
            ProfileReadState profileReadState,
            AffinityCalculationService affinityCalculationService,
            UserAffinityEdgeService userAffinityEdgeService,
            MongoTemplate mongoTemplate,
            OperationalTelemetry adminTelemetryService,
            FollowingEvents organizerFollowingService) {
        this(
                userRatesRepository,
                ratingProfiles,
                ratingSession,
                profileCards,
                profileReadState,
                affinityCalculationService,
                userAffinityEdgeService,
                mongoTemplate,
                adminTelemetryService,
                null,
                null,
                organizerFollowingService);
    }

    @PostConstruct
    void ensureUserRateIndexes() {
        ensureCanonicalUserRateIndexes();
        backfillHomeGameRateProjections();
        userAffinityEdgeService.backfillCampaignRatings();
    }

    public List<RateMenuItemDto> queryRateItemsByUser(String requestedUserId) {
        return queryRateItemsByUser(requestedUserId, null);
    }

    public List<RateMenuItemDto> queryRateItemsByUser(String requestedUserId, String campaignId) {
        RatingSessionDto currentUser = ratingSession.resolveRatingSession(requestedUserId);
        String ownerUserId = currentUser == null ? null : normalizeId(currentUser.identity().userId());
        if (!StringUtils.hasText(ownerUserId)) {
            return List.of();
        }

        return queryNormalizedRateItems(currentUser, ownerUserId, campaignId).stream()
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
        return queryActivityRatePage(requestedUserId, modeValue, directionValue, sortValue, sortDirectionValue, secondaryFilterValue, socialBadgeEnabled, cursor, limitValue, rangeStartIso, rangeEndIso, null);
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
            String rangeEndIso, String campaignId) {
        RatingSessionDto currentUser = ratingSession.resolveRatingSession(requestedUserId);
        String ownerUserId = currentUser == null ? null : normalizeId(currentUser.identity().userId());
        String mode = normalizeMode(modeValue);
        String direction = normalizeDisplayDirection(directionValue);
        int gameCounter = currentUser == null
                ? 0
                : Math.max(0, Objects.requireNonNullElse(currentUser.gameCount(), 0));
        if (!StringUtils.hasText(ownerUserId) || !StringUtils.hasText(mode) || !StringUtils.hasText(direction)) {
            return new ActivityRatePageResponseDto(List.of(), 0, null, List.of(), gameCounter);
        }

        String sort = normalizeQuerySort(sortValue);
        String innerOrder = resolveActivityInnerOrder(sort, sortDirectionValue, secondaryFilterValue);
        String groupDirection = resolveActivityGroupDirection(sort, sortDirectionValue, innerOrder);
        long rangeStartMs = parseRangeBoundaryMillis(rangeStartIso, 0L, false);
        long rangeEndMs = parseRangeBoundaryMillis(rangeEndIso, Long.MAX_VALUE, true);
        if (rangeStartMs > rangeEndMs) {
            return new ActivityRatePageResponseDto(List.of(), 0, null, List.of(), gameCounter);
        }

        List<RatePageProjection> projections = queryNormalizedRateItems(currentUser, ownerUserId, campaignId).stream()
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
        List<UserDto> users = profileCards.queryUsersByIds(resolveDisplayUserIds(pageItems));

        return new ActivityRatePageResponseDto(pageItems, items.size(), nextCursor, users, gameCounter);
    }

    public UserRatesSyncResponseDto sync(UserRatesSyncRequestDto request) {
        if (request == null || request.rates() == null || request.rates().isEmpty()) {
            return new UserRatesSyncResponseDto(List.of(), List.of());
        }

        Map<String, UserRate> normalizedRatesByNaturalKey = new LinkedHashMap<>();
        Map<String, Double> previousScoresByNaturalKey = new LinkedHashMap<>();
        Set<String> affectedHomeProjectionOwnerIds = new LinkedHashSet<>();
        List<String> syncedRateIds = new ArrayList<>();
        List<String> failedRateIds = new ArrayList<>();
        Set<String> participantIds = new LinkedHashSet<>();
        for (var rate : request.rates()) if (rate != null) {
            addIfText(participantIds, rate.ownerUserId()); addIfText(participantIds, rate.fromUserId()); addIfText(participantIds, rate.toUserId());
        }
        Map<String, RatingProfileDto> participantProfiles = ratingProfiles.queryRatingProfiles(participantIds).stream()
                .filter(Objects::nonNull).collect(java.util.stream.Collectors.toMap(RatingProfileDto::userId, user -> user, (left, right) -> right));
        Set<String> workspaceParticipants = participantProfiles.values().stream()
                .filter(user -> WorkspaceContext.allows(user.workspaceGroupId()))
                .map(RatingProfileDto::userId).collect(java.util.stream.Collectors.toSet());
        Set<String> campaignIds = request.rates().stream().filter(Objects::nonNull).map(UserRateRecordDto::campaignId)
                .filter(StringUtils::hasText).collect(java.util.stream.Collectors.toSet());
        var campaigns = campaignCatalog.findByIds(campaignIds);
        for (UserRateRecordDto rate : request.rates()) {
            if (rate != null && StringUtils.hasText(rate.campaignId())) {
                var campaign = campaigns.get(rate.campaignId());
                if (campaign == null || !"published".equals(campaign.status()) || !"single".equals(rate.mode())
                    || !WorkspaceContext.allows(campaign.workspaceGroupId())
                    || (!campaign.ownerUserId().equals(rate.ownerUserId()) && !campaign.ownerUserId().equals(rate.toUserId()) && !campaign.ownerUserId().equals(rate.fromUserId()))) {
                    if (StringUtils.hasText(rate.id())) failedRateIds.add(rate.id());
                    continue;
                }
            }
            if (rate != null && java.util.stream.Stream.of(rate.ownerUserId(), rate.fromUserId(), rate.toUserId())
                    .filter(org.springframework.util.StringUtils::hasText).anyMatch(id -> !workspaceParticipants.contains(id))) {
                if (StringUtils.hasText(rate.id())) failedRateIds.add(rate.id());
                continue;
            }
            NormalizedRate normalizedResult = normalizeRecord(rate, affectedHomeProjectionOwnerIds, participantProfiles);
            if (normalizedResult == null || normalizedResult.rate() == null) {
                String failedId = rate == null ? "" : normalizeId(rate.id());
                if (StringUtils.hasText(failedId)) {
                    failedRateIds.add(failedId);
                }
                continue;
            }
            UserRate normalized = normalizedResult.rate();
            String normalizedNaturalKey = naturalKey(normalized);
            normalizedRatesByNaturalKey.put(normalizedNaturalKey, normalized);
            previousScoresByNaturalKey.putIfAbsent(normalizedNaturalKey, normalizedResult.previousScoreGiven());
            syncedRateIds.add(resolveSyncAcknowledgementId(rate, normalized));
        }

        List<UserRate> normalizedRates = new ArrayList<>(normalizedRatesByNaturalKey.values());
        if (!normalizedRates.isEmpty()) {
            affinityCalculationService.applyAffinity(normalizedRates);
            List<UserRate> savedRates = new ArrayList<>();
            userRatesRepository.saveAll(normalizedRates).forEach(savedRates::add);
            List<UserRate> persistedRates = savedRates.isEmpty() ? normalizedRates : savedRates;
            enqueueRateRecomputeTasks(persistedRates);
            projectMutualMetFriendships(persistedRates);
            enqueueRatingNotifications(persistedRates, previousScoresByNaturalKey);
            userAffinityEdgeService.recomputeForRates(persistedRates);
            refreshHomeGameRateProjections(affectedHomeProjectionOwnerIds, persistedRates);
            adminTelemetryService.record("rates.synced", "matching", "", normalizedRates.get(0).getOwnerUserId(), normalizedRates.size());
        }
        return new UserRatesSyncResponseDto(syncedRateIds, failedRateIds);
    }

    public void projectRecordedMeetings(Collection<String> participantIds) {
        if (participantIds == null || participantIds.isEmpty()) return;
        List<UserRate> meetings = userRatesRepository.findRelevantByUserIds(new ArrayList<>(participantIds)).stream()
                .filter(rate -> Boolean.TRUE.equals(rate.getMet()))
                .filter(rate -> participantIds.contains(rate.getOwnerUserId())
                        && participantIds.contains(rate.getRelatedUserId()))
                .toList();
        if (!meetings.isEmpty()) {
            affinityCalculationService.applyAffinity(meetings);
            userRatesRepository.saveAll(meetings);
            projectMutualMetFriendships(meetings);
            userAffinityEdgeService.recomputeForRates(meetings);
        }
        refreshHomeGameRateProjections(new LinkedHashSet<>(participantIds), meetings);
        enqueueRateRecomputeTasks(meetings);
    }

    private void projectMutualMetFriendships(Collection<UserRate> persistedRates) {
        if (persistedRates == null || persistedRates.isEmpty()) {
            return;
        }
        Map<String, com.raxim.myscoutee.domain.accounts.api.FriendshipProjections.Meeting> writesByPair = new LinkedHashMap<>();
        Set<String> affectedUsers = new LinkedHashSet<>();
        for (UserRate rate : persistedRates) {
            if (rate == null
                    || !"single".equals(normalizeMode(rate.getMode()))
                    || !Boolean.TRUE.equals(rate.getMet())
                    || normalizeScore(rate.getScoreGiven()) <= 0
                    || normalizeScore(rate.getScoreReceived()) <= 0) {
                continue;
            }
            String ownerUserId = normalizeOptionalId(rate.getOwnerUserId());
            String relatedUserId = normalizeOptionalId(rate.getRelatedUserId());
            if (!StringUtils.hasText(ownerUserId)
                    || !StringUtils.hasText(relatedUserId)
                    || ownerUserId.equals(relatedUserId)) {
                continue;
            }
            String left = ownerUserId.compareTo(relatedUserId) <= 0 ? ownerUserId : relatedUserId;
            String right = ownerUserId.compareTo(relatedUserId) <= 0 ? relatedUserId : ownerUserId;
            writesByPair.put(left.length() + ":" + left + right, new com.raxim.myscoutee.domain.accounts.api.FriendshipProjections.Meeting(left, right,
                    parseIsoMillis(firstNonBlank(rate.getUpdatedDate(), rate.getCreatedDate()), Instant.now().toEpochMilli()),
                    safeText(rate.getMetEventId()), safeText(rate.getEventName())));
            affectedUsers.add(left);
            affectedUsers.add(right);
        }
        if (writesByPair.isEmpty()) {
            return;
        }
        friendships.projectMeetings(new ArrayList<>(writesByPair.values()));
        organizerFollowingService.refreshForViewers(affectedUsers);
    }

    private void enqueueRatingNotifications(
            Collection<UserRate> persistedRates,
            Map<String, Double> previousScoresByNaturalKey) {
        if (notificationOutboxService == null || persistedRates == null || persistedRates.isEmpty()) {
            return;
        }
        var changedRates = persistedRates.stream().filter(Objects::nonNull).filter(rate -> {
            double currentScore = normalizeScore(rate.getScoreGiven());
            double previousScore = previousScoresByNaturalKey == null ? currentScore
                    : previousScoresByNaturalKey.getOrDefault(naturalKey(rate), currentScore);
            return currentScore > 0 && currentScore != previousScore;
        }).toList();
        if (changedRates.isEmpty()) return;
        var candidateRecipients = new LinkedHashSet<String>();
        for (var rate : changedRates) {
            addIfText(candidateRecipients, rate.getRelatedUserId());
            if ("pair".equals(normalizeMode(rate.getMode()))) addIfText(candidateRecipients, rate.getSecondaryRelatedUserId());
        }
        var existingRecipients = candidateRecipients.isEmpty() ? Set.<String>of()
                : ratingProfiles.queryRatingProfiles(candidateRecipients).stream().filter(Objects::nonNull)
                        .map(RatingProfileDto::userId).collect(java.util.stream.Collectors.toSet());
        for (UserRate rate : changedRates) {
            String actorUserId = normalizeId(rate.getOwnerUserId());
            LinkedHashSet<String> recipientUserIds = new LinkedHashSet<>();
            addIfText(recipientUserIds, rate.getRelatedUserId());
            if ("pair".equals(normalizeMode(rate.getMode()))) {
                addIfText(recipientUserIds, rate.getSecondaryRelatedUserId());
            }
            recipientUserIds.remove(actorUserId);
            recipientUserIds.retainAll(existingRecipients);
            if (recipientUserIds.isEmpty()) {
                continue;
            }

            String rateId = normalizeId(rate.getId());
            Map<String, String> payload = new LinkedHashMap<>();
            payload.put("rateId", rateId);
            if (StringUtils.hasText(rate.getCampaignId())) payload.put("campaignId", rate.getCampaignId());
            payload.put("mode", normalizeMode(rate.getMode()));
            payload.put("senderUserId", actorUserId);
            notificationOutboxService.enqueue(new NotificationIntent(
                    "user-rated",
                    "user-rate",
                    rateId,
                    "rated-users",
                    recipientUserIds,
                    "New rating",
                    "You received a new rating.",
                    "/game?ratings=1" + (StringUtils.hasText(rate.getCampaignId()) ? "&campaignId=" + java.net.URLEncoder.encode(rate.getCampaignId(), java.nio.charset.StandardCharsets.UTF_8) : ""),
                    "/assets/logo/heart.webp",
                    "/assets/logo/heart.webp",
                    "user-rated-" + rateId,
                    payload,
                    actorUserId));
        }
    }

    private void enqueueRateRecomputeTasks(List<UserRate> rates) {
        if (affinityRecomputeTaskService == null || rates == null || rates.isEmpty()) {
            return;
        }
        LinkedHashSet<String> userIds = new LinkedHashSet<>();
        for (UserRate rate : rates) {
            if (rate == null) {
                continue;
            }
            addIfText(userIds, rate.getOwnerUserId());
            addIfText(userIds, rate.getRelatedUserId());
            addIfText(userIds, rate.getSecondaryRelatedUserId());
        }
        for (String userId : userIds) {
            affinityRecomputeTaskService.enqueueUserChanged(userId);
        }
    }

    private void addIfText(Set<String> target, String value) {
        String normalized = normalizeId(value);
        if (target != null && StringUtils.hasText(normalized)) {
            target.add(normalized);
        }
    }

    private void backfillHomeGameRateProjections() {
        Set<String> staleUserIds = new LinkedHashSet<>(accountProjections.staleRatingProfileIds());
        if (staleUserIds.isEmpty()) return;

        List<UserRate> rates = userRatesRepository.findHomeGameRateProjectionsByOwnerUserIdIn(staleUserIds);
        Map<String, List<UserRate>> ratesByOwnerUserId = ratesByOwnerUserId(rates);
        Map<String, Long> latestActivityMsByUserId = latestRateActivityMsByUserId(rates);
        String nowIso = Instant.now().toString();
        var projections = new ArrayList<com.raxim.myscoutee.domain.accounts.api.AccountAffinityProjections.RatingProjection>();
        for (String userId : staleUserIds) {
            HomeGameRateProjection projection = buildHomeGameRateProjection(userId, ratesByOwnerUserId.getOrDefault(userId, List.of()));
            projections.add(new com.raxim.myscoutee.domain.accounts.api.AccountAffinityProjections.RatingProjection(
                    userId, projection.ratedUserIds(), projection.ratedPairKeys(), latestActivityMsByUserId.get(userId)));
        }
        accountProjections.backfillRatings(projections, nowIso);
    }

    private void refreshHomeGameRateProjections(
            Set<String> affectedOwnerUserIds,
            List<UserRate> persistedRates) {
        LinkedHashSet<String> ownerUserIds = affectedOwnerUserIds == null
                ? new LinkedHashSet<>()
                : affectedOwnerUserIds.stream()
                        .map(this::normalizeId)
                        .filter(StringUtils::hasText)
                        .collect(LinkedHashSet::new, Set::add, Set::addAll);
        for (UserRate rate : persistedRates == null ? List.<UserRate>of() : persistedRates) {
            addIfText(ownerUserIds, rate == null ? null : rate.getOwnerUserId());
        }
        if (ownerUserIds.isEmpty()) {
            return;
        }

        List<UserRate> currentOwnerRates =
                userRatesRepository.findHomeGameRateProjectionsByOwnerUserIdIn(ownerUserIds);
        Map<String, List<UserRate>> ratesByOwnerUserId = ratesByOwnerUserId(currentOwnerRates);
        String nowIso = Instant.now().toString();
        for (String ownerUserId : ownerUserIds) {
            HomeGameRateProjection projection = buildHomeGameRateProjection(
                    ownerUserId,
                    ratesByOwnerUserId.getOrDefault(ownerUserId, List.of()));
            accountProjections.refreshRating(new com.raxim.myscoutee.domain.accounts.api.AccountAffinityProjections.RatingProjection(
                    ownerUserId, projection.ratedUserIds(), projection.ratedPairKeys(), null), nowIso);
        }

        LinkedHashSet<String> affectedUserIds = new LinkedHashSet<>(ownerUserIds);
        for (UserRate rate : persistedRates == null ? List.<UserRate>of() : persistedRates) {
            if (rate == null) {
                continue;
            }
            long activityMs = rateDateMillis(firstNonBlank(rate.getUpdatedDate(), rate.getCreatedDate()));
            LinkedHashSet<String> rateUserIds = new LinkedHashSet<>();
            addIfText(rateUserIds, rate.getOwnerUserId());
            addIfText(rateUserIds, rate.getRelatedUserId());
            addIfText(rateUserIds, rate.getSecondaryRelatedUserId());
            affectedUserIds.addAll(rateUserIds);
            if (activityMs <= 0L) {
                continue;
            }
            for (String userId : rateUserIds) {
                accountProjections.touchRatingActivity(userId, activityMs);
            }
        }
        profileReadState.evictUserReadCaches(affectedUserIds);
    }

    private Map<String, List<UserRate>> ratesByOwnerUserId(List<UserRate> rates) {
        Map<String, List<UserRate>> ratesByOwnerUserId = new LinkedHashMap<>();
        for (UserRate rate : rates == null ? List.<UserRate>of() : rates) {
            String ownerUserId = normalizeId(rate == null ? null : rate.getOwnerUserId());
            if (StringUtils.hasText(ownerUserId)) {
                ratesByOwnerUserId.computeIfAbsent(ownerUserId, ignored -> new ArrayList<>()).add(rate);
            }
        }
        return ratesByOwnerUserId;
    }

    private Map<String, Long> latestRateActivityMsByUserId(List<UserRate> rates) {
        Map<String, Long> latestActivityMsByUserId = new LinkedHashMap<>();
        for (UserRate rate : rates == null ? List.<UserRate>of() : rates) {
            if (rate == null) {
                continue;
            }
            long activityMs = rateDateMillis(firstNonBlank(rate.getUpdatedDate(), rate.getCreatedDate()));
            rememberLatestRateActivity(latestActivityMsByUserId, rate.getOwnerUserId(), activityMs);
            rememberLatestRateActivity(latestActivityMsByUserId, rate.getRelatedUserId(), activityMs);
            rememberLatestRateActivity(latestActivityMsByUserId, rate.getSecondaryRelatedUserId(), activityMs);
        }
        return latestActivityMsByUserId;
    }

    private void rememberLatestRateActivity(Map<String, Long> latestByUserId, String userId, long activityMs) {
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(normalizedUserId) || activityMs <= 0L) {
            return;
        }
        latestByUserId.merge(normalizedUserId, activityMs, Math::max);
    }

    private HomeGameRateProjection buildHomeGameRateProjection(String ownerUserId, List<UserRate> rates) {
        String normalizedOwnerUserId = normalizeId(ownerUserId);
        LinkedHashSet<String> ratedUserIds = new LinkedHashSet<>();
        LinkedHashSet<String> ratedPairKeys = new LinkedHashSet<>();
        for (UserRate rate : rates == null ? List.<UserRate>of() : rates) {
            if (!isHomeGameExclusionRate(rate, normalizedOwnerUserId)) {
                continue;
            }
            String relatedUserId = normalizeId(rate.getRelatedUserId());
            String secondaryRelatedUserId = normalizeId(rate.getSecondaryRelatedUserId());
            if (StringUtils.hasText(relatedUserId) && !normalizedOwnerUserId.equals(relatedUserId)) {
                ratedUserIds.add(relatedUserId);
            }
            if (StringUtils.hasText(secondaryRelatedUserId) && !normalizedOwnerUserId.equals(secondaryRelatedUserId)) {
                ratedUserIds.add(secondaryRelatedUserId);
            }
            if ("pair".equals(normalizeId(rate.getMode()))
                    && StringUtils.hasText(relatedUserId)
                    && StringUtils.hasText(secondaryRelatedUserId)
                    && !relatedUserId.equals(secondaryRelatedUserId)) {
                ratedPairKeys.add(homeGamePairKey(relatedUserId, secondaryRelatedUserId));
            }
        }
        return new HomeGameRateProjection(List.copyOf(ratedUserIds), List.copyOf(ratedPairKeys));
    }

    private boolean isHomeGameExclusionRate(UserRate rate, String ownerUserId) {
        return rate != null
                && ownerUserId.equals(normalizeId(rate.getOwnerUserId()))
                && (Boolean.TRUE.equals(rate.getMet())
                        || (rate.getScoreGiven() != null && rate.getScoreGiven().intValue() > 0));
    }

    private String homeGamePairKey(String firstUserId, String secondUserId) {
        String normalizedFirstUserId = normalizeId(firstUserId);
        String normalizedSecondUserId = normalizeId(secondUserId);
        return normalizedFirstUserId.compareTo(normalizedSecondUserId) <= 0
                ? normalizedFirstUserId + ":" + normalizedSecondUserId
                : normalizedSecondUserId + ":" + normalizedFirstUserId;
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
                .named("user_rate_owner_mode_target_campaign_unique_v2")
                .on("ownerUserId", Sort.Direction.ASC)
                .on("mode", Sort.Direction.ASC)
                .on("relatedUserId", Sort.Direction.ASC)
                .on("secondaryRelatedUserId", Sort.Direction.ASC)
                .on("campaignId", Sort.Direction.ASC)
                .unique());
        dropIndexIfPresent(indexOps, existingIndexNames, "user_rate_owner_mode_target_unique_v1");
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

    private List<RateMenuItemDto> queryNormalizedRateItems(RatingSessionDto currentUser, String ownerUserId) {
        return queryNormalizedRateItems(currentUser, ownerUserId, null);
    }
    private List<RateMenuItemDto> queryNormalizedRateItems(RatingSessionDto currentUser, String ownerUserId, String campaignId) {
        List<UserRate> records = userRatesRepository.findRelevantInCampaign(ownerUserId,
                StringUtils.hasText(campaignId) ? campaignId : null);
        if (StringUtils.hasText(campaignId)) {
            return filterActivityRateVisibleItems(dedupeRateItems(aggregateCampaignRatings(records.stream()
                    .map(record -> toRateMenuItem(record, currentUser)).filter(Objects::nonNull).toList(), ownerUserId, campaignId)), ownerUserId);
        }
        var summaries = userAffinityEdgeService.ratingSummaries(ownerUserId);
        Set<String> summarizedPeople = summaries.stream().map(s -> ownerUserId.equals(s.leftUserId()) ? s.rightUserId() : s.leftUserId())
                .collect(java.util.stream.Collectors.toSet());
        List<RateMenuItemDto> items = new ArrayList<>(records.stream().map(record -> toRateMenuItem(record, currentUser))
                .filter(Objects::nonNull).filter(item -> !"individual".equals(item.mode()) || !summarizedPeople.contains(item.userId())).toList());
        for (var summary : summaries) {
            var item = toRateMenuItem(summary.rate(), currentUser);
            if (item == null) continue;
            items.add(new RateMenuItemDto("game-card:" + ownerUserId + ":" + item.userId(), item.userId(), null,
                    item.mode(), item.direction(), item.socialContext(), item.bridgeUserId(), item.bridgeCount(),
                    item.scoreGiven(), item.scoreReceived(), item.eventName(), item.happenedAt(), item.distanceMetersExact(),
                    item.met(), item.ratingSnapshot(), null));
        }
        String workspaceId = currentUser == null || currentUser.identity() == null
                ? null : currentUser.identity().workspaceGroupId();
        var group = StringUtils.hasText(workspaceId) ? groupDirectory.findById(workspaceId).orElse(null) : null;
        String defaultDomain = group == null ? "dating" : "work".equals(group.effectiveType()) ? "work"
                : "community".equals(group.effectiveType()) ? "service-interest" : "dating";
        return filterActivityRateVisibleItems(dedupeRateItems(items.stream().map(item -> item.withRatingDomain(
                summarizedPeople.contains(item.userId()) && "individual".equals(item.mode()) ? "campaign"
                : "pair".equals(item.mode()) ? "dating-pair" : defaultDomain)).toList()), ownerUserId);
    }

    private List<RateMenuItemDto> aggregateCampaignRatings(List<RateMenuItemDto> items, String viewerId, String campaignId) {
        Set<String> people = items.stream().filter(i -> "individual".equals(i.mode()) && StringUtils.hasText(i.campaignId()))
                .map(RateMenuItemDto::userId).collect(java.util.stream.Collectors.toSet());
        var result = new ArrayList<RateMenuItemDto>();
        var byPerson = new LinkedHashMap<String, List<RateMenuItemDto>>();
        for (var item : items) {
            if (!"individual".equals(item.mode()) || !people.contains(item.userId())) result.add(item);
            else byPerson.computeIfAbsent(item.userId(), ignored -> new ArrayList<>()).add(item);
        }
        for (var entry : byPerson.entrySet()) {
            var rows = entry.getValue(); rows.sort(Comparator.comparing(RateMenuItemDto::happenedAt).reversed());
            var latest = rows.getFirst();
            var given = new LinkedHashMap<String, Double>(); var received = new LinkedHashMap<String, Double>();
            for (var row : rows) {
                if (row.scoreGiven() != null && row.scoreGiven() > 0) given.putIfAbsent(normalizeId(row.campaignId()), row.scoreGiven());
                if (row.scoreReceived() != null && row.scoreReceived() > 0) received.putIfAbsent(normalizeId(row.campaignId()), row.scoreReceived());
            }
            double g = Math.round(given.values().stream().mapToDouble(Double::doubleValue).average().orElse(0) * 100d) / 100d;
            double r = Math.round(received.values().stream().mapToDouble(Double::doubleValue).average().orElse(0) * 100d) / 100d;
            boolean met = rows.stream().anyMatch(row -> Boolean.TRUE.equals(row.met()));
            String direction = met ? "met" : g > 0 && r > 0 ? "mutual" : g > 0 ? "given" : "received";
            String id = "game-card:" + viewerId + ":" + entry.getKey() + (StringUtils.hasText(campaignId) ? ":campaign:" + campaignId : "");
            result.add(new RateMenuItemDto(id, entry.getKey(), null, "individual", direction, latest.socialContext(), latest.bridgeUserId(),
                latest.bridgeCount(), g, r, latest.eventName(), latest.happenedAt(), latest.distanceMetersExact(), met,
                StringUtils.hasText(campaignId) ? rows.stream().map(RateMenuItemDto::ratingSnapshot).filter(Objects::nonNull).findFirst().orElse(null) : null,
                StringUtils.hasText(campaignId) ? campaignId : null));
        }
        return result;
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

        Map<String, RatingProfileDto> usersById = ratingProfiles.queryRatingProfiles(checkedUserIds).stream()
                .filter(Objects::nonNull)
                .collect(LinkedHashMap::new, (target, user) -> target.put(normalizeId(user.id()), user), Map::putAll);
        return items.stream()
                .filter(item -> activityRateItemUsersAreVisible(item, ownerUserId, usersById))
                .toList();
    }

    private boolean activityRateItemUsersAreVisible(
            RateMenuItemDto item,
            String ownerUserId,
            Map<String, RatingProfileDto> usersById) {
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
            RatingProfileDto user = usersById.get(normalizeId(userId));
            if (user == null || !user.activityRateVisible()) {
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

    private NormalizedRate normalizeRecord(UserRateRecordDto rate, Set<String> affectedHomeProjectionOwnerIds, Map<String, RatingProfileDto> participantProfiles) {
        if (rate == null || !validRatingSnapshot(rate.ratingSnapshot(), resolveScoreGiven(rate))
                || (StringUtils.hasText(rate.campaignId()) && rate.ratingSnapshot() != null && !"campaign".equals(rate.ratingSnapshot().profileType()))) {
            return null;
        }
        String syncKey = resolveSyncKey(rate);
        String mode = normalizeMode(rate.mode());
        if (!StringUtils.hasText(syncKey)
                || !StringUtils.hasText(mode)) {
            return null;
        }

        String fromUserId = normalizeOptionalId(rate.fromUserId());
        String toUserId = normalizeOptionalId(rate.toUserId());
        String ownerUserId = resolveOwnerUserId(mode, rate.ownerUserId(), fromUserId);
        String relatedUserId = resolveActivityRelatedUserId(mode, ownerUserId, fromUserId, toUserId);
        String secondaryRelatedUserId = resolveActivitySecondaryRelatedUserId(mode, fromUserId, toUserId);
        if (!isValidNaturalKey(mode, ownerUserId, relatedUserId, secondaryRelatedUserId)) {
            return null;
        }
        UserRate syncKeyRecord = userRatesRepository.findBySyncKey(syncKey).orElse(null);
        if (syncKeyRecord != null && !Objects.equals(normalizeOptionalId(syncKeyRecord.getCampaignId()), normalizeOptionalId(rate.campaignId()))) return null;
        UserRate naturalKeyRecord = findByNaturalKey(ownerUserId, mode, relatedUserId, secondaryRelatedUserId, normalizeOptionalId(rate.campaignId()));
        addIfText(affectedHomeProjectionOwnerIds, syncKeyRecord == null ? null : syncKeyRecord.getOwnerUserId());
        addIfText(affectedHomeProjectionOwnerIds, naturalKeyRecord == null ? null : naturalKeyRecord.getOwnerUserId());
        addIfText(affectedHomeProjectionOwnerIds, ownerUserId);
        UserRate existing = naturalKeyRecord != null ? naturalKeyRecord : syncKeyRecord;
        double previousScoreGiven = normalizeScore(existing == null ? null : existing.getScoreGiven());
        boolean syncKeyBelongsToDifferentRecord = naturalKeyRecord != null
                && syncKeyRecord != null
                && !Objects.equals(naturalKeyRecord.getId(), syncKeyRecord.getId());
        String updatedUserId = resolveUpdatedUser(rate, ownerUserId, fromUserId, toUserId);
        String createdUserId = existing != null
                ? normalizeOptionalText(existing.getCreatedUser())
                : resolveCreatedUser(rate, ownerUserId, fromUserId, toUserId, updatedUserId);
        String nowIso = Instant.now().toString();

        // A Met record is shared by both viewers. Preserve the other person's
        // authoritative score when a stale client submits a rating or edits its own.
        Double metCounterpartyScore = existing != null && Boolean.TRUE.equals(existing.getMet())
                && "single".equals(mode)
                ? (ownerUserId.equals(existing.getOwnerUserId())
                        ? existing.getScoreReceived() : existing.getScoreGiven())
                : null;
        UserRate document = existing != null ? existing : new UserRate();
        document.setId(existing != null ? existing.getId() : new ObjectId().toHexString());
        document.setSyncKey(syncKeyBelongsToDifferentRecord ? naturalKeyRecord.getSyncKey() : syncKey);
        document.setMode(mode);
        document.setCampaignId(normalizeOptionalId(rate.campaignId()));
        document.setCreatedDate(existing != null
                ? normalizeDate(existing.getCreatedDate(), nowIso)
                : normalizeDate(rate.createdAtIso(), normalizeDate(rate.happenedAtIso(), normalizeDate(rate.updatedAtIso(), nowIso))));
        document.setCreatedUser(createdUserId);
        document.setUpdatedDate(normalizeDate(rate.updatedAtIso(), nowIso));
        document.setUpdatedUser(updatedUserId);
        document.setOwnerUserId(ownerUserId);
        document.setOwnerLocation(resolveLocationSnapshot(participantProfiles.get(ownerUserId)));

        UserRate normalized = normalizeRateRecord(document, rate, mode, ownerUserId, fromUserId, toUserId);
        if (normalized != null && metCounterpartyScore != null) {
            normalized.setScoreReceived(normalizeScore(metCounterpartyScore));
        }
        if (normalized != null) {
            Map<String, UserRate.RatingSnapshot> snapshots = new LinkedHashMap<>(
                    normalized.getRatingSnapshots() == null ? Map.of() : normalized.getRatingSnapshots());
            if (rate.ratingSnapshot() == null) snapshots.remove(ownerUserId);
            else snapshots.put(ownerUserId, new UserRate.RatingSnapshot(1, rate.ratingSnapshot().profileType(),
                    Map.copyOf(rate.ratingSnapshot().criteria()), rate.ratingSnapshot().average()));
            normalized.setRatingSnapshots(snapshots);
        }
        return normalized == null ? null : new NormalizedRate(normalized, previousScoreGiven);
    }

    private boolean validRatingSnapshot(RatingSnapshotDto snapshot, double score) {
        if (snapshot == null) return true;
        Set<String> keys = switch (snapshot.profileType() == null ? "" : snapshot.profileType()) {
            case "dating" -> Set.of("attraction", "personality", "interests", "values");
            case "dating-pair" -> Set.of("chemistry", "interests", "values", "compatibility");
            case "campaign" -> Set.of("relevance", "appeal", "clarity", "collaboration");
            case "work" -> Set.of("fit", "interests", "communication", "collaboration");
            case "service-interest" -> Set.of("relevance", "clarity", "confidence", "value");
            case "service" -> FeedbackPreparation.CRITERIA;
            default -> Set.of();
        };
        if (!Integer.valueOf(1).equals(snapshot.version()) || keys.isEmpty() || snapshot.criteria() == null
                || !snapshot.criteria().keySet().equals(keys)
                || snapshot.average() == null || !Double.isFinite(snapshot.average())) return false;
        double sum = 0;
        for (Double value : snapshot.criteria().values()) {
            if (value == null || !Double.isFinite(value) || value < 1 || value > 10 || value != Math.rint(value)) return false;
            sum += value;
        }
        double average = sum / snapshot.criteria().size();
        return Math.abs(average - snapshot.average()) < 0.000001 && Math.abs(average - score) < 0.000001;
    }

    private RatingSnapshotDto ratingSnapshotFor(UserRate record, String userId) {
        UserRate.RatingSnapshot snapshot = record.getRatingSnapshots() == null ? null : record.getRatingSnapshots().get(userId);
        return snapshot == null ? null : new RatingSnapshotDto(snapshot.version(), snapshot.profileType(),
                snapshot.criteria(), snapshot.average());
    }

    private record NormalizedRate(UserRate rate, double previousScoreGiven) {}

    private UserRate findByNaturalKey(
            String ownerUserId,
            String mode,
            String relatedUserId,
            String secondaryRelatedUserId, String campaignId) {
        return userRatesRepository.findByOwnerUserIdAndMode(ownerUserId, mode).stream()
                .filter(record -> Objects.equals(relatedUserId, normalizeOptionalId(record.getRelatedUserId())))
                .filter(record -> Objects.equals(secondaryRelatedUserId, normalizeOptionalId(record.getSecondaryRelatedUserId())))
                .filter(record -> Objects.equals(campaignId, normalizeOptionalId(record.getCampaignId())))
                .findFirst()
                .orElse(null);
    }

    private String naturalKey(UserRate record) {
        return String.join("\u0000",
                normalizeId(record.getOwnerUserId()),
                normalizeId(record.getMode()),
                normalizeId(record.getRelatedUserId()),
                normalizeId(record.getSecondaryRelatedUserId()), normalizeId(record.getCampaignId()));
    }

    private boolean isValidNaturalKey(
            String mode,
            String ownerUserId,
            String relatedUserId,
            String secondaryRelatedUserId) {
        if (!StringUtils.hasText(ownerUserId) || !StringUtils.hasText(relatedUserId)) {
            return false;
        }
        if ("single".equals(mode)) {
            return !ownerUserId.equals(relatedUserId);
        }
        return !"pair".equals(mode)
                || (StringUtils.hasText(secondaryRelatedUserId) && !relatedUserId.equals(secondaryRelatedUserId));
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

        boolean met = Boolean.TRUE.equals(document.getMet()) || isMetRequest(rate);
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
        if (rate.distanceMetersExact() != null) {
            document.setDistanceMetersExact(Math.max(0, rate.distanceMetersExact()));
        }
        document.setEventName(met
                ? (StringUtils.hasText(requestedEventName) ? requestedEventName : preservedEventName)
                : null);
        return document;
    }

    private RateMenuItemDto toRateMenuItem(UserRate record, RatingSessionDto currentUser) {
        if (record == null || currentUser == null) {
            return null;
        }
        return toActivityRateMenuItem(record, currentUser);
    }

    private RateMenuItemDto toActivityRateMenuItem(UserRate record, RatingSessionDto currentUser) {
        String currentUserId = normalizeOptionalId(currentUser == null ? null : currentUser.identity().userId());
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
        if ("met".equals(direction) && isFutureActivityDate(happenedAt)) {
            return null;
        }
        boolean isSingle = "single".equals(normalizeMode(record.getMode()));
        double scoreGiven = isOwnerView ? normalizeScore(record.getScoreGiven())
                : isSingle ? normalizeScore(record.getScoreReceived()) : 0;
        double scoreReceived = isOwnerView
                ? normalizeScore(record.getScoreReceived())
                : isSingle ? normalizeScore(record.getScoreGiven()) : resolveParticipantIncomingScore(record);
        String eventName = StringUtils.hasText(normalizeOptionalText(record.getEventName()))
                ? normalizeOptionalText(record.getEventName())
                : ("met".equals(direction) ? "Met" : "Rate");
        RateDistance distance = resolveActivityDistance(currentUser, record);
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
                        scoreGiven, scoreReceived, eventName, happenedAt, distance.metersExact(),
                        Boolean.TRUE.equals(record.getMet()), ratingSnapshotFor(record, resolvedCurrentUserId), record.getCampaignId());
            }
            return new RateMenuItemDto(displayId, primaryUserId, secondaryUserId, "pair", direction,
                    socialContext, bridgeUserId, bridgeCount,
                    scoreGiven, scoreReceived, eventName, happenedAt, distance.metersExact(),
                    Boolean.TRUE.equals(record.getMet()), ratingSnapshotFor(record, resolvedCurrentUserId), record.getCampaignId());
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
                scoreGiven, scoreReceived, eventName, happenedAt, distance.metersExact(),
                Boolean.TRUE.equals(record.getMet()), ratingSnapshotFor(record, resolvedCurrentUserId), record.getCampaignId());
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
                .thenComparing(ratePageInnerComparator(effectiveInnerOrder))
                .thenComparing(projection -> safeText(projection.item().id()));
    }

    private Comparator<RatePageProjection> ratePageInnerComparator(String innerOrder) {
        if ("past".equals(innerOrder)) {
            return Comparator
                    .comparingLong(RatePageProjection::happenedAtMs)
                    .thenComparing(RatePageProjection::relevanceScore, Comparator.reverseOrder());
        }
        if ("relevant".equals(innerOrder)) {
            return Comparator
                    .comparingDouble(RatePageProjection::relevanceScore)
                    .reversed()
                    .thenComparing(RatePageProjection::happenedAtMs, Comparator.reverseOrder());
        }
        return Comparator
                .comparing(RatePageProjection::happenedAtMs, Comparator.reverseOrder())
                .thenComparing(RatePageProjection::relevanceScore, Comparator.reverseOrder());
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
        double scoreGiven = normalizeScore(item.scoreGiven());
        double scoreReceived = normalizeScore(item.scoreReceived());
        if ("mutual".equals(normalizeDisplayDirection(item.direction()))) {
            return harmonicScore(scoreGiven, scoreReceived);
        }
        return scoreGiven > 0 ? scoreGiven : 5d;
    }

    private double harmonicScore(double scoreGiven, double scoreReceived) {
        if (scoreGiven <= 0 || scoreReceived <= 0) {
            return 0d;
        }
        return 2d * scoreGiven * scoreReceived / (scoreGiven + scoreReceived);
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
        RatingSessionDto currentUser = ratingSession.resolveRatingSession(ownerUserId);
        if (currentUser != null && StringUtils.hasText(normalizeId(currentUser.identity().userId()))) {
            return normalizeId(currentUser.identity().userId());
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
        String mode = normalizeMode(record.getMode());
        double scoreGiven = normalizeScore(record.getScoreGiven());
        double scoreReceived = normalizeScore(record.getScoreReceived());
        if (Boolean.TRUE.equals(record.getMet())
                && ((scoreGiven <= 0 && scoreReceived <= 0) || (scoreGiven > 0 && scoreReceived > 0))) {
            return "met";
        }
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
        double scoreGiven = normalizeScore(record.getScoreGiven());
        double scoreReceived = normalizeScore(record.getScoreReceived());
        if (Boolean.TRUE.equals(record.getMet())
                && ((scoreGiven <= 0 && scoreReceived <= 0) || (scoreGiven > 0 && scoreReceived > 0))) {
            return "met";
        }
        if ("single".equals(normalizeMode(record.getMode())) && scoreReceived > 0) {
            return scoreGiven > 0 ? "mutual" : "given";
        }
        if (scoreGiven > 0 || scoreReceived > 0) {
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

    private double resolveParticipantIncomingScore(UserRate record) {
        double scoreGiven = normalizeScore(record == null ? null : record.getScoreGiven());
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

    private double normalizeScore(Number value) {
        if (value == null || !Double.isFinite(value.doubleValue())) {
            return 0;
        }
        return Math.max(0, Math.min(10, value.doubleValue()));
    }

    private double resolveScoreGiven(UserRateRecordDto rate) {
        double scoreGiven = normalizeScore(rate == null ? null : rate.scoreGiven());
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

    private UserRate.LocationSnapshot resolveLocationSnapshot(RatingProfileDto user) {
        if (user == null || user.locationCoordinates() == null) {
            return null;
        }
        Double latitude = user.locationCoordinates().latitude();
        Double longitude = user.locationCoordinates().longitude();
        if (latitude == null || longitude == null || !Double.isFinite(latitude) || !Double.isFinite(longitude)) {
            return null;
        }
        return new UserRate.LocationSnapshot(latitude, longitude);
    }

    private RateDistance resolveActivityDistance(RatingSessionDto currentUser, UserRate record) {
        if (record != null && record.getDistanceMetersExact() != null) {
            return new RateDistance(Math.max(0, record.getDistanceMetersExact()));
        }
        UserRate.LocationSnapshot origin = resolveCurrentUserLocation(currentUser);
        if (origin == null) {
            return ZERO_DISTANCE;
        }
        return distanceBetween(origin, record == null ? null : record.getOwnerLocation());
    }

    private UserRate.LocationSnapshot resolveCurrentUserLocation(RatingSessionDto currentUser) {
        if (currentUser == null || currentUser.locationCoordinates() == null) {
            return null;
        }
        Double latitude = currentUser.locationCoordinates().latitude();
        Double longitude = currentUser.locationCoordinates().longitude();
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
        return (meters / 5000) * 5000;
    }

    private static long rateDateMillis(String value) {
        return parseIsoMillis(value, 0L);
    }

    private static boolean isFutureActivityDate(String value) {
        long parsed = parseIsoMillis(value, 0L);
        return parsed > 0L && parsed > Instant.now().toEpochMilli();
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

    private static String firstNonBlank(String... values) {
        for (String value : values == null ? new String[0] : values) {
            if (StringUtils.hasText(value)) {
                return value.trim();
            }
        }
        return null;
    }

    private record HomeGameRateProjection(
            List<String> ratedUserIds,
            List<String> ratedPairKeys) {
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
