package com.raxim.myscoutee.profile.service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import org.bson.Document;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationOperation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.BasicQuery;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.mongodb.client.result.UpdateResult;

import com.raxim.myscoutee.profile.data.AssetCatalog;
import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.ActivityMember;
import com.raxim.myscoutee.profile.data.document.Asset;
import com.raxim.myscoutee.profile.data.document.Asset.AssetPolicyRecord;
import com.raxim.myscoutee.profile.data.document.Asset.AssetRequestRecord;
import com.raxim.myscoutee.profile.data.document.Asset.AssetRequestBookingRecord;
import com.raxim.myscoutee.profile.data.document.AssetRequest;
import com.raxim.myscoutee.profile.data.document.EventTicket;
import com.raxim.myscoutee.profile.data.document.SubEventItem;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetDeleteRequestDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetBorrowWindowDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetDetailDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetExplorePageDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetMakeManagerRequestDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetMemberStatusChangeDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetMemberStatusChangeRequestDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetReplaceRequestDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetRequestMetricsDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetTicketDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetTicketScanPayloadDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetTicketSyncKnownItemDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetTicketSyncRequestDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetTicketSyncResponseDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetTicketValidationDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetTicketValidationRequestDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetTicketsPageDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetUpsertRequestDto;
import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.UserPaymentTotalsDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.ActivityMemberEntryDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.AssetRequestBookingDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.AssetMemberRequestDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.PolicyItemDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.PricingCancellationPolicyDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.PricingConfigDto;
import com.raxim.myscoutee.profile.repository.ActivityMembersRepository;
import com.raxim.myscoutee.profile.repository.AssetsRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;
import com.raxim.myscoutee.profile.security.AccessControlService;
import com.raxim.myscoutee.profile.service.notifications.NotificationOutboxService;
import com.raxim.myscoutee.profile.service.notifications.NotificationOutboxService.NotificationIntent;

@Service
public class AssetsService {
    private static final Logger LOGGER = LoggerFactory.getLogger(AssetsService.class);
    private static final String STATUS_ACTIVE = "A";
    private static final String STATUS_UNDER_REVIEW = "UR";
    private static final String STATUS_TRASHED = "T";
    private static final String STATUS_BLOCKED = "B";
    private static final String STATUS_DELETED = "D";
    private static final String STATUS_INACTIVE = "I";
    private static final String OWNER_TYPE_EVENT = "event";
    private static final String OWNER_TYPE_ASSET = "asset";
    private static final String ASSET_REQUEST_KIND_INVITE = "invite";
    private static final String ROLE_ADMIN = "Admin";
    private static final String ROLE_MANAGER = "Manager";
    private static final String MEMBER_STATUS_ACCEPTED = "accepted";

    private final AssetsRepository assetsRepository;
    private final UsersRepository usersRepository;
    private final ActivityMembersRepository activityMembersRepository;
    private final EventParticipationTicketService eventParticipationTicketService;
    private final PaymentService paymentService;
    private final MongoTemplate mongoTemplate;
    private final AbsoluteAffinityService absoluteAffinityService;
    private final AffinityRecomputeTaskService affinityRecomputeTaskService;
    private final AdminTelemetryService adminTelemetryService;
    private final NotificationOutboxService notificationOutboxService;
    private final ChatAttachmentLifecycleService chatAttachmentLifecycleService;
    private final AccessControlService accessControlService;
    private final UserActivityCountersService userActivityCountersService;
    private ObjectProvider<ActivitiesResourcesService> activitiesResourcesServiceProvider;
    private EventTicketAuditService eventTicketAuditService;
    private TranslationService translationService;
    private EventCheckoutBasketService eventCheckoutBasketService;

    public AssetsService(
            AssetsRepository assetsRepository,
            UsersRepository usersRepository,
            ActivityMembersRepository activityMembersRepository,
            EventParticipationTicketService eventParticipationTicketService,
            PaymentService paymentService,
            MongoTemplate mongoTemplate,
            AbsoluteAffinityService absoluteAffinityService,
            AffinityRecomputeTaskService affinityRecomputeTaskService,
            AdminTelemetryService adminTelemetryService,
            NotificationOutboxService notificationOutboxService,
            ChatAttachmentLifecycleService chatAttachmentLifecycleService,
            AccessControlService accessControlService,
            UserActivityCountersService userActivityCountersService) {
        this.assetsRepository = assetsRepository;
        this.usersRepository = usersRepository;
        this.activityMembersRepository = activityMembersRepository;
        this.eventParticipationTicketService = eventParticipationTicketService;
        this.paymentService = paymentService;
        this.mongoTemplate = mongoTemplate;
        this.absoluteAffinityService = absoluteAffinityService;
        this.affinityRecomputeTaskService = affinityRecomputeTaskService;
        this.adminTelemetryService = adminTelemetryService;
        this.notificationOutboxService = notificationOutboxService;
        this.chatAttachmentLifecycleService = chatAttachmentLifecycleService;
        this.accessControlService = accessControlService;
        this.userActivityCountersService = userActivityCountersService;
    }

    @Autowired
    void setActivitiesResourcesServiceProvider(
            ObjectProvider<ActivitiesResourcesService> activitiesResourcesServiceProvider) {
        this.activitiesResourcesServiceProvider = activitiesResourcesServiceProvider;
    }

    @Autowired(required = false)
    void setEventTicketAuditService(EventTicketAuditService eventTicketAuditService) {
        this.eventTicketAuditService = eventTicketAuditService;
    }

    @Autowired(required = false)
    void setTranslationService(TranslationService translationService) {
        this.translationService = translationService;
    }

    @Autowired(required = false)
    void setEventCheckoutBasketService(EventCheckoutBasketService eventCheckoutBasketService) {
        this.eventCheckoutBasketService = eventCheckoutBasketService;
    }

    public List<AssetDto> queryAssets(String userId) {
        String normalizedUserId = effectiveActorUserId(userId);
        if (!StringUtils.hasText(normalizedUserId)) {
            return List.of();
        }

        Map<String, Asset> assetsById = new LinkedHashMap<>();
        queryOwnerAssets(normalizedUserId).stream()
                .filter(asset -> asset != null && !isSuppressedLifecycleStatus(asset.getStatus()))
                .forEach(asset -> assetsById.put(normalizeId(asset.getAssetId()), asset));
        mongoTemplate.find(
                        Query.query(Criteria.where("status").is(STATUS_UNDER_REVIEW)),
                        Asset.class)
                .stream()
                .filter(asset -> isEligibleAssetTakeOverCandidate(asset, normalizedUserId))
                .forEach(asset -> assetsById.put(normalizeId(asset.getAssetId()), asset));
        List<Asset> assets = assetsById.values().stream()
                .sorted(Comparator.comparing(
                        asset -> normalizeDateTime(asset.getUpdatedDate(), ""),
                        Comparator.reverseOrder()))
                .toList();
        Map<String, AssetOwnerSummary> ownersByUserId = resolveOwnersByUserId(assets);
        Map<String, AssetRequestMetricsDto> metricsByAssetId = resolveAssetRequestMetricsByAssetId(assets);
        return assets.stream()
                .map(asset -> toAssetDto(asset, ownersByUserId, normalizedUserId, metricsByAssetId.get(normalizeId(asset.getAssetId()))))
                .filter(Objects::nonNull)
                .toList();
    }

    public AssetDetailDto queryAssetDetail(String userId, String assetId) {
        return queryAssetDetail(userId, assetId, null, null);
    }

    public AssetDetailDto queryAssetDetail(String userId, String assetId, String eventId, String subEventId) {
        String normalizedUserId = effectiveReadActorUserId(userId);
        String normalizedAssetId = normalizeId(assetId);
        if (!StringUtils.hasText(normalizedUserId) || !StringUtils.hasText(normalizedAssetId)) {
            return null;
        }
        AssetBorrowWindowDto borrowWindow = resolveAssetBorrowWindow(
                normalizedUserId,
                eventId,
                subEventId);
        boolean scopedBorrowRequest = StringUtils.hasText(normalizeId(eventId))
                || StringUtils.hasText(normalizeId(subEventId));
        if (scopedBorrowRequest && borrowWindow == null) {
            return null;
        }
        AssetBorrowWindowDto resolvedBorrowWindow = borrowWindow;
        return assetsRepository.findByAssetId(normalizedAssetId)
                .filter(asset -> asset != null && !isSuppressedLifecycleStatus(asset.getStatus()))
                .filter(asset -> canViewAssetDetail(asset, normalizedUserId))
                .map(asset -> toAssetDetailDto(
                        asset,
                        resolveOwnersByUserId(List.of(asset)),
                        normalizedUserId,
                        resolveAssetRequestMetrics(asset),
                        resolvedBorrowWindow))
                .orElse(null);
    }

    private AssetBorrowWindowDto resolveAssetBorrowWindow(String userId, String eventId, String subEventId) {
        String normalizedUserId = normalizeId(userId);
        String normalizedEventId = normalizeId(eventId);
        String normalizedSubEventId = normalizeId(subEventId);
        if (!StringUtils.hasText(normalizedEventId) && !StringUtils.hasText(normalizedSubEventId)) {
            return null;
        }
        if (!StringUtils.hasText(normalizedUserId)
                || !StringUtils.hasText(normalizedEventId)
                || !StringUtils.hasText(normalizedSubEventId)
                || !accessControlService.canCurrentActorRequestAssetBorrow(normalizedUserId, normalizedEventId)) {
            return null;
        }
        return findAssetBorrowWindow(normalizedEventId, normalizedSubEventId);
    }

    private AssetBorrowWindowDto findAssetBorrowWindow(String eventId, String subEventId) {
        String normalizedEventId = normalizeId(eventId);
        String normalizedSubEventId = normalizeId(subEventId);
        if (!StringUtils.hasText(normalizedEventId) || !StringUtils.hasText(normalizedSubEventId)) {
            return null;
        }
        Query eventQuery = Query.query(new Criteria().orOperator(
                Criteria.where("_id").is(normalizedEventId),
                Criteria.where("sourceId").is(normalizedEventId)));
        ActivityEvent event = mongoTemplate.findOne(eventQuery, ActivityEvent.class);
        if (event == null || !STATUS_ACTIVE.equals(safeText(event.getStatus()))) {
            return null;
        }
        return (event.getSubEvents() == null ? List.<SubEventItem>of() : event.getSubEvents())
                .stream()
                .filter(Objects::nonNull)
                .filter(item -> normalizedSubEventId.equals(normalizeId(item.id())))
                .filter(item -> StringUtils.hasText(safeText(item.startAt())) && StringUtils.hasText(safeText(item.endAt())))
                .findFirst()
                .map(item -> new AssetBorrowWindowDto(
                        firstNonBlank(normalizeId(event.getSourceId()), normalizedEventId),
                        normalizedSubEventId,
                        safeText(item.startAt()),
                        safeText(item.endAt())))
                .orElse(null);
    }

    public Map<String, AssetDetailDto> queryAssignableAssetDetails(
            String userId,
            String eventId,
            String subEventId,
            Collection<String> assetIds) {
        String normalizedUserId = effectiveActorUserId(userId);
        String normalizedEventId = normalizeId(eventId);
        String normalizedSubEventId = normalizeId(subEventId);
        Set<String> normalizedAssetIds = (assetIds == null ? List.<String>of() : assetIds).stream()
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .collect(LinkedHashSet::new, Set::add, Set::addAll);
        if (!StringUtils.hasText(normalizedUserId)
                || !StringUtils.hasText(normalizedEventId)
                || !StringUtils.hasText(normalizedSubEventId)
                || normalizedAssetIds.isEmpty()) {
            return Map.of();
        }

        Query borrowedRequestQuery = new Query(Criteria.where("userId").is(normalizedUserId)
                .and("assetId").in(normalizedAssetIds)
                .and("requestKind").is("borrow")
                .and("status").in("pending", "accepted")
                .and("booking.eventId").is(normalizedEventId)
                .and("booking.subEventId").is(normalizedSubEventId));
        Set<String> borrowedAssetIds = mongoTemplate.find(borrowedRequestQuery, AssetRequest.class).stream()
                .map(AssetRequest::assetId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .collect(LinkedHashSet::new, Set::add, Set::addAll);
        Set<String> memberAssetIds = activityMembersRepository
                .findAcceptedByOwnerTypeOwnerIdInAndUserId(
                        OWNER_TYPE_ASSET,
                        normalizedAssetIds,
                        normalizedUserId,
                        MEMBER_STATUS_ACCEPTED)
                .stream()
                .map(ActivityMember::getOwnerId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .collect(LinkedHashSet::new, Set::add, Set::addAll);

        List<Asset> eligibleAssets = assetsRepository.findByAssetIdIn(normalizedAssetIds).stream()
                .filter(Objects::nonNull)
                .filter(asset -> !isSuppressedLifecycleStatus(asset.getStatus()))
                .filter(asset -> normalizedUserId.equals(normalizeId(asset.getOwnerUserId()))
                        || memberAssetIds.contains(normalizeId(asset.getAssetId()))
                        || borrowedAssetIds.contains(normalizeId(asset.getAssetId())))
                .toList();
        Map<String, AssetOwnerSummary> ownersByUserId = resolveOwnersByUserId(eligibleAssets);
        Map<String, AssetRequestMetricsDto> metricsByAssetId = resolveAssetRequestMetricsByAssetId(eligibleAssets);
        Map<String, AssetDetailDto> detailsByAssetId = new LinkedHashMap<>();
        for (Asset asset : eligibleAssets) {
            String assetId = normalizeId(asset.getAssetId());
            AssetDetailDto detail = toAssetDetailDto(
                    asset,
                    ownersByUserId,
                    normalizedUserId,
                    metricsByAssetId.get(assetId));
            if (StringUtils.hasText(assetId) && detail != null) {
                detailsByAssetId.put(assetId, detail);
            }
        }
        return detailsByAssetId;
    }

    /**
     * Resolves cards for Asset ids that are already part of an Activity resource state.
     * An owner handover must not erase the Group-to-Asset relationship merely because
     * the Asset is temporarily under review. New assignments still use the stricter
     * {@link #queryAssignableAssetDetails(String, String, String, Collection)} path.
     */
    public Map<String, AssetDetailDto> queryReferencedAssetDetails(
            String viewerUserId,
            Collection<String> assetIds) {
        String normalizedViewerUserId = normalizeId(viewerUserId);
        Set<String> normalizedAssetIds = (assetIds == null ? List.<String>of() : assetIds).stream()
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .collect(LinkedHashSet::new, Set::add, Set::addAll);
        if (!StringUtils.hasText(normalizedViewerUserId) || normalizedAssetIds.isEmpty()) {
            return Map.of();
        }

        List<Asset> referencedAssets = assetsRepository.findByAssetIdIn(normalizedAssetIds).stream()
                .filter(Objects::nonNull)
                .filter(asset -> isReferencedResourceVisibleStatus(asset.getStatus()))
                .toList();
        Map<String, AssetOwnerSummary> ownersByUserId = resolveOwnersByUserId(referencedAssets);
        Map<String, AssetRequestMetricsDto> metricsByAssetId = resolveAssetRequestMetricsByAssetId(referencedAssets);
        Map<String, AssetDetailDto> detailsByAssetId = new LinkedHashMap<>();
        for (Asset asset : referencedAssets) {
            String assetId = normalizeId(asset.getAssetId());
            AssetDetailDto detail = toAssetDetailDto(
                    asset,
                    ownersByUserId,
                    normalizedViewerUserId,
                    metricsByAssetId.get(assetId));
            if (StringUtils.hasText(assetId) && detail != null) {
                detailsByAssetId.put(assetId, detail);
            }
        }
        return detailsByAssetId;
    }

    public List<AssetDto> queryVisibleAssets(String userId, String type, String category) {
        String normalizedUserId = effectiveActorUserId(userId);
        String normalizedType = normalizeAssetType(type);
        String normalizedCategory = safeText(category);
        if (!StringUtils.hasText(normalizedUserId) || !StringUtils.hasText(normalizedType)) {
            return List.of();
        }

        double viewerAffinity = resolveStoredUserAffinity(normalizedUserId);
        List<Asset> assets = queryVisibleExploreAssets(normalizedUserId, normalizedType, normalizedCategory).stream()
                .filter(asset -> shouldIncludeExploreAsset(asset, normalizedUserId))
                .sorted(visibleAssetComparator(viewerAffinity))
                .toList();
        Map<String, AssetOwnerSummary> ownersByUserId = resolveOwnersByUserId(assets);
        Map<String, AssetRequestMetricsDto> metricsByAssetId = resolveAssetRequestMetricsByAssetId(assets);
        return assets.stream()
                .map(asset -> toAssetDto(asset, ownersByUserId, normalizedUserId, metricsByAssetId.get(normalizeId(asset.getAssetId()))))
                .filter(Objects::nonNull)
                .toList();
    }

    public AssetExplorePageDto queryVisibleAssetsPage(
            String userId,
            String type,
            String category,
            String startAtIso,
            String endAtIso,
            Integer page,
            Integer pageSize,
            String cursor,
            String order) {
        String normalizedUserId = effectiveActorUserId(userId);
        String normalizedType = normalizeAssetType(type);
        String normalizedCategory = safeText(category);
        if (!StringUtils.hasText(normalizedUserId) || !StringUtils.hasText(normalizedType)) {
            return new AssetExplorePageDto(List.of(), 0, null);
        }

        String normalizedOrder = normalizeAssetExploreOrder(order);
        String normalizedStartAtIso = safeText(startAtIso);
        String normalizedEndAtIso = safeText(endAtIso);
        int normalizedPageSize = Math.max(1, Math.min(100, pageSize == null ? 20 : pageSize.intValue()));
        int normalizedPage = Math.max(0, page == null ? 0 : page.intValue());
        int cursorOffset = parseAssetExploreCursor(cursor);
        int startIndex = cursorOffset >= 0 ? cursorOffset : normalizedPage * normalizedPageSize;

        AssetExploreMongoPage pageResult = queryVisibleExploreAssetsPage(
                normalizedUserId,
                normalizedType,
                normalizedCategory,
                normalizedStartAtIso,
                normalizedEndAtIso,
                normalizedOrder,
                Math.max(0, startIndex),
                normalizedPageSize);
        List<Asset> pageAssets = pageResult.items();
        Map<String, AssetOwnerSummary> ownersByUserId = resolveOwnersByUserId(pageAssets);
        Map<String, AssetRequestMetricsDto> metricsByAssetId = resolveAssetRequestMetricsByAssetId(pageAssets);
        List<AssetDto> items = pageAssets.stream()
                .map(asset -> toAssetDto(asset, ownersByUserId, normalizedUserId, metricsByAssetId.get(normalizeId(asset.getAssetId()))))
                .filter(Objects::nonNull)
                .toList();
        Map<String, String> checkoutResultStates = eventCheckoutBasketService == null
                ? Map.of()
                : eventCheckoutBasketService.loadResultStatesByEvent(
                        normalizedUserId,
                        items.stream().map(AssetDto::id).toList());

        return new AssetExplorePageDto(
                items,
                pageResult.total(),
                pageResult.nextCursor(),
                checkoutResultStates);
    }

    public AssetTicketsPageDto queryTicketPage(String userId, Integer page, Integer pageSize, String order) {
        String normalizedUserId = ticketActorUserId(userId);
        if (!StringUtils.hasText(normalizedUserId)) {
            return new AssetTicketsPageDto(List.of(), 0);
        }

        int normalizedPage = Math.max(0, page == null ? 0 : page.intValue());
        int normalizedPageSize = Math.max(1, pageSize == null ? 20 : pageSize.intValue());
        boolean upcoming = !"past".equalsIgnoreCase(safeText(order));

        List<AssetTicketDto> ordered = eventParticipationTicketService.queryTicketSnapshotRecordsForUser(normalizedUserId).stream()
                .filter(Objects::nonNull)
                .map(this::toAssetTicketDto)
                .filter(Objects::nonNull)
                .sorted(Comparator.comparing((AssetTicketDto item) -> toSortableDate(item.dateIso())))
                .toList();

        List<AssetTicketDto> visible = new ArrayList<>(ordered.stream()
                .filter(item -> matchesTicketOrder(item, upcoming))
                .toList());
        if (!upcoming) {
            java.util.Collections.reverse(visible);
        }

        int startIndex = Math.min(visible.size(), normalizedPage * normalizedPageSize);
        int endIndex = Math.min(visible.size(), startIndex + normalizedPageSize);
        return new AssetTicketsPageDto(visible.subList(startIndex, endIndex), visible.size());
    }

    public AssetTicketSyncResponseDto syncTickets(AssetTicketSyncRequestDto request) {
        if (request == null) {
            return new AssetTicketSyncResponseDto(List.of(), List.of(), 0);
        }
        AssetTicketsPageDto page = queryTicketPage(request.userId(), 0, Integer.MAX_VALUE, request.order());
        List<AssetTicketDto> rows = page.items() == null ? List.of() : page.items();
        Map<String, AssetTicketDto> currentById = new LinkedHashMap<>();
        for (AssetTicketDto row : rows) {
            currentById.put(assetTicketIdentity(row), row);
        }

        Map<String, String> knownRevisions = new LinkedHashMap<>();
        for (AssetTicketSyncKnownItemDto item : request.knownItems() == null ? List.<AssetTicketSyncKnownItemDto>of() : request.knownItems()) {
            String id = safeText(item == null ? null : item.id());
            if (StringUtils.hasText(id)) {
                knownRevisions.put(id, safeText(item.revision()));
            }
        }
        List<String> removedIds = knownRevisions.keySet().stream()
                .filter(id -> !currentById.containsKey(id))
                .toList();
        Map<String, AssetTicketDto> upsertsById = new LinkedHashMap<>();
        knownRevisions.forEach((id, revision) -> {
            AssetTicketDto current = currentById.get(id);
            if (current != null && !Objects.equals(safeText(current.revision()), revision)) {
                upsertsById.put(id, current);
            }
        });

        int limit = Math.max(1, Math.min(100, request.limit() == null ? 18 : request.limit().intValue()));
        String tailId = safeText(request.loadedTail() == null ? null : request.loadedTail().id());
        int tailIndex = -1;
        for (int index = 0; index < rows.size(); index++) {
            if (Objects.equals(assetTicketIdentity(rows.get(index)), tailId)) {
                tailIndex = index;
                break;
            }
        }
        int windowLimit = tailIndex >= 0
                ? Math.max(knownRevisions.size() + limit, tailIndex + 1 + limit)
                : (knownRevisions.isEmpty() ? limit : knownRevisions.size() + limit);
        for (AssetTicketDto row : rows.subList(0, Math.min(rows.size(), windowLimit))) {
            String id = assetTicketIdentity(row);
            String knownRevision = knownRevisions.get(id);
            if (knownRevision == null || !Objects.equals(knownRevision, safeText(row.revision()))) {
                upsertsById.put(id, row);
            }
        }
        return new AssetTicketSyncResponseDto(
                List.copyOf(upsertsById.values()),
                removedIds,
                page.total());
    }

    public AssetTicketValidationDto validateTicket(AssetTicketValidationRequestDto request) {
        if (request == null) {
            return invalidTicketValidation("invalid_code");
        }
        String actorUserId = ticketActorUserId(request.userId());
        if (!StringUtils.hasText(actorUserId)) {
            return invalidTicketValidation("not_authorized");
        }

        Instant attemptedAt = Instant.now();
        EventTicketService.CheckInResult result = eventParticipationTicketService.checkIn(
                request.code(),
                actorUserId,
                attemptedAt);
        if (result == null || !result.valid() || result.ticket() == null || result.event() == null) {
            if (result != null
                    && "already_used".equals(result.reason())
                    && result.ticket() != null
                    && result.event() != null) {
                recordTicketReplayAttempt(result.ticket(), result.event(), actorUserId, attemptedAt);
                enqueueTicketReplayWarning(result.ticket(), result.event(), actorUserId);
            }
            return invalidTicketValidation(result == null ? "not_found" : result.reason());
        }

        AssetTicketScanPayloadDto payload;
        try {
            payload = toTicketScanPayload(result.ticket(), result.event());
        } catch (RuntimeException exception) {
            LOGGER.warn(
                    "Ticket holder enrichment failed after a successful check-in; returning the canonical fallback payload. eventId={}, ticketId={}",
                    safeText(result.event().getSourceId()),
                    safeText(result.ticket().getId()),
                    exception);
            payload = toCanonicalTicketScanPayload(result.ticket(), result.event(), null, null);
        }
        if (payload == null) {
            payload = toCanonicalTicketScanPayload(result.ticket(), result.event(), null, null);
        }
        if (payload == null) {
            return invalidTicketValidation("event_unavailable");
        }
        try {
            enqueueTicketCheckedInNotification(result.ticket(), result.event(), actorUserId);
        } catch (RuntimeException exception) {
            LOGGER.warn(
                    "Ticket check-in notification failed after a successful check-in; the scanner response remains successful. eventId={}, ticketId={}",
                    safeText(result.event().getSourceId()),
                    safeText(result.ticket().getId()),
                    exception);
        }
        return new AssetTicketValidationDto(true, "valid", payload);
    }

    public AssetDto upsert(AssetUpsertRequestDto request) {
        if (request == null || request.asset() == null) {
            return null;
        }
        Asset saved = saveOwnedAsset(normalizeId(request.userId()), request.asset());
        return saved == null ? null : toAssetDto(saved, resolveOwnersByUserId(List.of(saved)), normalizeId(request.userId()));
    }

    public AssetMemberStatusChangeDto applyMemberStatusChange(AssetMemberStatusChangeRequestDto request) {
        if (request == null) {
            return null;
        }
        String assetId = normalizeId(request.assetId());
        String eventId = normalizeId(request.eventId());
        String subEventId = normalizeId(request.subEventId());
        String actorUserId = normalizeId(request.actorUserId());
        String action = safeText(request.action()).toLowerCase(Locale.ROOT);
        if (!StringUtils.hasText(assetId)
                || !StringUtils.hasText(eventId)
                || !StringUtils.hasText(subEventId)
                || !StringUtils.hasText(actorUserId)
                || (!"join".equals(action) && !"leave".equals(action) && !"take-over".equals(action))) {
            return null;
        }

        Asset current = findAssetByAssetId(assetId).orElse(null);
        if (current == null || STATUS_TRASHED.equals(safeText(current.getStatus()))) {
            return null;
        }
        AssetRequestRecord previous = safeRequests(current.getRequests()).stream()
                .filter(Objects::nonNull)
                .filter(item -> !isDeletedAssetRequest(item))
                .filter(item -> !"manual".equals(normalizeAssetRequestKind(item.requestKind())))
                .filter(item -> actorUserId.equals(normalizeId(item.userId())))
                .filter(item -> isRequestInScope(item, eventId, subEventId))
                .findFirst()
                .orElse(null);
        String previousStatus = previous == null ? null : normalizeRequestStatus(previous.status());

        if ("leave".equals(action) && previous == null) {
            return null;
        }
        if ("leave".equals(action)
                && !"pending".equals(previousStatus)
                && !MEMBER_STATUS_ACCEPTED.equals(previousStatus)) {
            return null;
        }
        if ("join".equals(action) && previous != null) {
            return memberStatusChange(
                    assetId,
                    eventId,
                    subEventId,
                    actorUserId,
                    previousStatus,
                    previousStatus,
                    0,
                    0);
        }

        AssetRequestRecord joinedRequest = null;
        if ("join".equals(action)) {
            if (request.request() == null) {
                return null;
            }
            joinedRequest = normalizeRequests(List.of(request.request())).stream().findFirst().orElse(null);
            AssetRequestBookingRecord booking = joinedRequest == null ? null : joinedRequest.booking();
            if (joinedRequest == null
                    || !actorUserId.equals(normalizeId(joinedRequest.userId()))
                    || !"borrow".equals(normalizeAssetRequestKind(joinedRequest.requestKind()))
                    || !"pending".equals(normalizeRequestStatus(joinedRequest.status()))
                    || booking == null
                    || !eventId.equals(normalizeId(booking.eventId()))
                    || !subEventId.equals(normalizeId(booking.subEventId()))) {
                return null;
            }
        }

        ActivitiesResourcesService activitiesResourcesService = activitiesResourcesServiceProvider == null
                ? null
                : activitiesResourcesServiceProvider.getIfAvailable();
        String scopedManagerUserId = activitiesResourcesService == null
                ? null
                : activitiesResourcesService.scopedAssetManagerUserId(eventId, subEventId, assetId);
        if ("take-over".equals(action)) {
            return takeOverScopedBorrowedAsset(
                    current,
                    previous,
                    request,
                    activitiesResourcesService,
                    scopedManagerUserId,
                    assetId,
                    eventId,
                    subEventId,
                    actorUserId);
        }
        boolean acceptedManagerLeave = "leave".equals(action)
                && MEMBER_STATUS_ACCEPTED.equals(previousStatus)
                && actorUserId.equals(normalizeId(scopedManagerUserId));
        boolean acceptedSuccessorRemains = acceptedManagerLeave
                && safeRequests(current.getRequests()).stream()
                        .filter(Objects::nonNull)
                        .filter(item -> !isDeletedAssetRequest(item))
                        .filter(item -> "borrow".equals(normalizeAssetRequestKind(item.requestKind())))
                        .filter(item -> isRequestInScope(item, eventId, subEventId))
                        .filter(item -> MEMBER_STATUS_ACCEPTED.equals(normalizeRequestStatus(item.status())))
                        .anyMatch(item -> !actorUserId.equals(normalizeId(item.userId())));

        List<AssetRequestRecord> nextRequests = new ArrayList<>();
        for (AssetRequestRecord item : safeRequests(current.getRequests())) {
            if (item == null) {
                continue;
            }
            if (item == previous) {
                if ("leave".equals(action)) {
                    nextRequests.add(withAssetRequestStatus(item, STATUS_DELETED));
                }
                continue;
            }
            boolean remainingScopedBorrower = acceptedManagerLeave
                    && acceptedSuccessorRemains
                    && !isDeletedAssetRequest(item)
                    && "borrow".equals(normalizeAssetRequestKind(item.requestKind()))
                    && MEMBER_STATUS_ACCEPTED.equals(normalizeRequestStatus(item.status()))
                    && isRequestInScope(item, eventId, subEventId);
            nextRequests.add(remainingScopedBorrower
                    ? withAssetRequestTakeOverAmount(item, previous)
                    : item);
        }
        if (joinedRequest != null) {
            nextRequests.add(joinedRequest);
        }

        Asset next = cloneAsset(current);
        next.setRequests(deduplicateRequests(nextRequests));
        next.setUpdatedDate(Instant.now().toString());
        next.setUpdatedUser(actorUserId);
        next.setAffinity(resolveAssetAffinity(next, actorUserId));
        next.setBoost(resolveAssetBoost(next, actorUserId));
        boolean requestPoliciesAllowed = acceptedManagerLeave && acceptedSuccessorRemains
                // The actor-owned accepted request is being cancelled, while the
                // successor settlement amount is written by this service as part
                // of the same transition. It is not a user edit of the accepted
                // successor request.
                ? accessControlService.canCurrentActorCancelAssetBorrow(actorUserId, assetId)
                : canApplyAssetRequestPolicies(current, next, false);
        if (!requestPoliciesAllowed) {
            return null;
        }

        assetsRepository.save(next);
        syncAssetRequestProjection(current, next);
        syncAssetRequestPayments(current, next);
        enqueueScopedAssetPendingRequestNotifications(
                current,
                next,
                eventId,
                subEventId,
                actorUserId);
        enqueueAssetMembershipTransitionNotifications(current, next, actorUserId);
        if (acceptedManagerLeave && acceptedSuccessorRemains) {
            enqueueScopedAssetTakeOverRequestedNotification(
                    current,
                    previous,
                    eventId,
                    subEventId,
                    actorUserId);
        }
        affinityRecomputeTaskService.enqueueAssetRequestsChanged(assetId, actorUserId);
        adminTelemetryService.record("asset.requests.changed", "assets", assetId, actorUserId);
        userActivityCountersService.refreshAssetCountersForUser(normalizeId(current.getOwnerUserId()));

        boolean resourceAssignmentRemoved = false;
        if (acceptedManagerLeave && !acceptedSuccessorRemains) {
            resourceAssignmentRemoved = activitiesResourcesService != null
                    && activitiesResourcesService.removeScopedAssetAssignment(
                            eventId,
                            subEventId,
                            assetId,
                            actorUserId,
                            actorUserId);
            if (!resourceAssignmentRemoved) {
                LOGGER.warn(
                        "Accepted last Asset borrower left, but the scoped resource assignment could not be removed. assetId={}, eventId={}, subEventId={}, actorUserId={}",
                        assetId,
                        eventId,
                        subEventId,
                        actorUserId);
            }
        }

        String nextStatus = "join".equals(action) ? "pending" : "deleted";
        return memberStatusChange(
                assetId,
                eventId,
                subEventId,
                actorUserId,
                previousStatus,
                nextStatus,
                statusDelta(previousStatus, nextStatus, MEMBER_STATUS_ACCEPTED),
                statusDelta(previousStatus, nextStatus, "pending"),
                resourceAssignmentRemoved);
    }

    private AssetMemberStatusChangeDto takeOverScopedBorrowedAsset(
            Asset current,
            AssetRequestRecord successorRequest,
            AssetMemberStatusChangeRequestDto request,
            ActivitiesResourcesService activitiesResourcesService,
            String scopedManagerUserId,
            String assetId,
            String eventId,
            String subEventId,
            String actorUserId) {
        String previousManagerUserId = normalizeId(request.previousManagerUserId());
        if (activitiesResourcesService == null
                || successorRequest == null
                || !MEMBER_STATUS_ACCEPTED.equals(normalizeRequestStatus(successorRequest.status()))
                || !"borrow".equals(normalizeAssetRequestKind(successorRequest.requestKind()))
                || !hasAcceptedRequiredPolicies(current, request.acceptedPolicyIds())
                || !StringUtils.hasText(previousManagerUserId)
                || previousManagerUserId.equals(actorUserId)) {
            return null;
        }
        if (actorUserId.equals(normalizeId(scopedManagerUserId))) {
            return memberStatusChange(
                    assetId,
                    eventId,
                    subEventId,
                    actorUserId,
                    MEMBER_STATUS_ACCEPTED,
                    MEMBER_STATUS_ACCEPTED,
                    0,
                    0);
        }
        if (!previousManagerUserId.equals(normalizeId(scopedManagerUserId))) {
            return null;
        }
        AssetRequestRecord predecessorRequest = safeRequests(current.getRequests()).stream()
                .filter(Objects::nonNull)
                .filter(item -> "borrow".equals(normalizeAssetRequestKind(item.requestKind())))
                .filter(item -> previousManagerUserId.equals(normalizeId(item.userId())))
                .filter(item -> isRequestInScope(item, eventId, subEventId))
                .filter(this::isDeletedAssetRequest)
                .findFirst()
                .orElse(null);
        if (predecessorRequest == null) {
            return null;
        }

        String predecessorPaymentSessionId = assetRequestPaymentSessionId(predecessorRequest);
        String successorPaymentSessionId = normalizeId(request.paymentSessionId());
        PaymentService.AssetPaymentReplacement paymentReplacement = paymentService.validateAssetPaymentReplacement(
                predecessorPaymentSessionId,
                successorPaymentSessionId,
                previousManagerUserId,
                actorUserId,
                assetId,
                eventId,
                subEventId);

        AssetRequestRecord updatedSuccessorRequest = withAssetRequestReplacementPayment(
                successorRequest,
                successorPaymentSessionId,
                request.acceptedPolicyIds());
        List<AssetRequestRecord> nextRequests = safeRequests(current.getRequests()).stream()
                .filter(Objects::nonNull)
                .map(item -> item == successorRequest ? updatedSuccessorRequest : item)
                .toList();
        Asset next = cloneAsset(current);
        next.setRequests(deduplicateRequests(nextRequests));
        next.setUpdatedDate(Instant.now().toString());
        next.setUpdatedUser(actorUserId);
        next.setAffinity(resolveAssetAffinity(next, actorUserId));
        next.setBoost(resolveAssetBoost(next, actorUserId));

        if (!activitiesResourcesService.transferScopedAssetManager(
                eventId,
                subEventId,
                assetId,
                previousManagerUserId,
                actorUserId)) {
            return null;
        }
        try {
            assetsRepository.save(next);
            syncAssetRequestProjection(current, next);
            syncAssetRequestPayments(current, next);
            paymentService.completeAssetPaymentReplacement(
                    paymentReplacement,
                    actorUserId,
                    eventId,
                    subEventId);
        } catch (RuntimeException exception) {
            activitiesResourcesService.transferScopedAssetManager(
                    eventId,
                    subEventId,
                    assetId,
                    actorUserId,
                    previousManagerUserId);
            throw exception;
        }

        enqueueScopedAssetTakeOverCompletedNotification(
                next,
                predecessorRequest,
                eventId,
                subEventId,
                previousManagerUserId,
                actorUserId);
        if (paymentReplacement.paymentRequired()) {
            enqueueScopedAssetTakeOverRefundedNotification(
                    next,
                    eventId,
                    subEventId,
                    previousManagerUserId,
                    paymentReplacement.predecessorPaymentId());
        }
        affinityRecomputeTaskService.enqueueAssetRequestsChanged(assetId, actorUserId);
        adminTelemetryService.record("asset.assignment.taken-over", "assets", assetId, actorUserId);
        userActivityCountersService.refreshAssetCountersForUser(normalizeId(current.getOwnerUserId()));
        return memberStatusChange(
                assetId,
                eventId,
                subEventId,
                actorUserId,
                MEMBER_STATUS_ACCEPTED,
                MEMBER_STATUS_ACCEPTED,
                0,
                0,
                usersRepository.findByUserId(actorUserId)
                        .map(user -> new UserPaymentTotalsDto(
                                new LinkedHashMap<>(user.getPaymentSpentTotals()),
                                new LinkedHashMap<>(user.getPaymentIncomeTotals()),
                                new LinkedHashMap<>(user.getPaymentAllTotals())))
                        .orElse(null));
    }

    private AssetMemberStatusChangeDto memberStatusChange(
            String assetId,
            String eventId,
            String subEventId,
            String userId,
            String previousStatus,
            String status,
            int acceptedMemberDelta,
            int pendingMemberDelta) {
        return memberStatusChange(
                assetId,
                eventId,
                subEventId,
                userId,
                previousStatus,
                status,
                acceptedMemberDelta,
                pendingMemberDelta,
                false,
                null);
    }

    private AssetMemberStatusChangeDto memberStatusChange(
            String assetId,
            String eventId,
            String subEventId,
            String userId,
            String previousStatus,
            String status,
            int acceptedMemberDelta,
            int pendingMemberDelta,
            boolean resourceAssignmentRemoved) {
        return memberStatusChange(
                assetId,
                eventId,
                subEventId,
                userId,
                previousStatus,
                status,
                acceptedMemberDelta,
                pendingMemberDelta,
                resourceAssignmentRemoved,
                null);
    }

    private AssetMemberStatusChangeDto memberStatusChange(
            String assetId,
            String eventId,
            String subEventId,
            String userId,
            String previousStatus,
            String status,
            int acceptedMemberDelta,
            int pendingMemberDelta,
            UserPaymentTotalsDto paymentTotals) {
        return memberStatusChange(
                assetId,
                eventId,
                subEventId,
                userId,
                previousStatus,
                status,
                acceptedMemberDelta,
                pendingMemberDelta,
                false,
                paymentTotals);
    }

    private AssetMemberStatusChangeDto memberStatusChange(
            String assetId,
            String eventId,
            String subEventId,
            String userId,
            String previousStatus,
            String status,
            int acceptedMemberDelta,
            int pendingMemberDelta,
            boolean resourceAssignmentRemoved,
            UserPaymentTotalsDto paymentTotals) {
        return new AssetMemberStatusChangeDto(
                assetId,
                eventId,
                subEventId,
                userId,
                previousStatus,
                status,
                acceptedMemberDelta,
                pendingMemberDelta,
                resourceAssignmentRemoved,
                paymentTotals);
    }

    private int statusDelta(String previousStatus, String nextStatus, String countedStatus) {
        int previous = countedStatus.equals(safeText(previousStatus)) ? 1 : 0;
        int next = countedStatus.equals(safeText(nextStatus)) ? 1 : 0;
        return next - previous;
    }

    public void replace(AssetReplaceRequestDto request) {
        if (request == null) {
            return;
        }
        String normalizedUserId = normalizeId(request.userId());
        if (!StringUtils.hasText(normalizedUserId)) {
            return;
        }
        if (!accessControlService.canCurrentActorReplaceAssets(normalizedUserId)) {
            return;
        }

        List<Asset> existing = assetsRepository.findByOwnerUserId(normalizedUserId);
        Map<String, Asset> existingByAssetId = new LinkedHashMap<>();
        for (Asset asset : existing) {
            String assetId = normalizeId(asset == null ? null : asset.getAssetId());
            if (StringUtils.hasText(assetId)) {
                existingByAssetId.put(assetId, asset);
            }
        }

        List<Asset> nextDocuments = new ArrayList<>();
        Set<String> retainedIds = new LinkedHashSet<>();
        for (AssetDto assetDto : safeAssets(request.assets())) {
            Asset next = toDocument(assetDto, normalizedUserId, existingByAssetId.get(normalizeId(assetDto.id())));
            if (next == null) {
                continue;
            }
            nextDocuments.add(next);
            retainedIds.add(next.getId());
        }

        String nowIso = Instant.now().toString();
        List<Asset> toTrash = existing.stream()
                .filter(Objects::nonNull)
                .filter(asset -> !retainedIds.contains(asset.getId()))
                .filter(asset -> !STATUS_TRASHED.equals(safeText(asset.getStatus())))
                .map(asset -> toTrashedAsset(asset, normalizedUserId, nowIso))
                .toList();
        if (!toTrash.isEmpty()) {
            assetsRepository.saveAll(toTrash);
            for (Asset trashed : toTrash) {
                handleAssetTrashed(trashed, normalizedUserId);
            }
        }
        if (!nextDocuments.isEmpty()) {
            assetsRepository.saveAll(nextDocuments);
            for (Asset saved : nextDocuments) {
                syncAssetRequestProjection(existingByAssetId.get(normalizeId(saved.getAssetId())), saved);
                affinityRecomputeTaskService.enqueueAssetChanged(normalizeId(saved == null ? null : saved.getAssetId()), normalizedUserId);
            }
        }
        userActivityCountersService.refreshAssetCountersForUser(normalizedUserId);
    }

    public void delete(AssetDeleteRequestDto request) {
        if (request == null) {
            return;
        }
        String normalizedUserId = normalizeId(request.userId());
        String normalizedAssetId = normalizeId(request.assetId());
        if (!StringUtils.hasText(normalizedUserId) || !StringUtils.hasText(normalizedAssetId)) {
            return;
        }
        if (!accessControlService.canCurrentActorDeleteAsset(normalizedUserId, normalizedAssetId)) {
            return;
        }
        assetsRepository.findByOwnerUserIdAndAssetId(normalizedUserId, normalizedAssetId)
                .filter(asset -> !isOwnerResponsibilityReleased(asset))
                .filter(asset -> !STATUS_TRASHED.equals(safeText(asset.getStatus())))
                .map(asset -> toTrashedAsset(asset, normalizedUserId, Instant.now().toString()))
                .ifPresent(trashed -> {
                    assetsRepository.save(trashed);
                    handleAssetTrashed(trashed, normalizedUserId);
                    userActivityCountersService.refreshAssetCountersForUser(normalizedUserId);
                });
    }

    public AssetDto leaveOwnership(AssetDeleteRequestDto request) {
        if (request == null) {
            return null;
        }
        String normalizedUserId = normalizeId(request.userId());
        String normalizedAssetId = normalizeId(request.assetId());
        if (!StringUtils.hasText(normalizedUserId) || !StringUtils.hasText(normalizedAssetId)) {
            return null;
        }
        if (!accessControlService.canCurrentActorDeleteAsset(normalizedUserId, normalizedAssetId)) {
            return null;
        }
        Asset current = assetsRepository.findByOwnerUserIdAndAssetId(normalizedUserId, normalizedAssetId).orElse(null);
        if (current == null
                || isOwnerResponsibilityReleased(current)
                || isSuppressedLifecycleStatus(current.getStatus())) {
            return null;
        }

        String nowIso = Instant.now().toString();
        Asset next = cloneAsset(current);
        next.setStatusBeforeSuppression(safeText(current.getStatus()));
        next.setStatus(STATUS_UNDER_REVIEW);
        next.setOwnerReleasedAtIso(nowIso);
        next.setRequests(safeRequests(current.getRequests()).stream()
                .filter(Objects::nonNull)
                .filter(memberRequest -> !normalizedUserId.equals(normalizeId(memberRequest.userId())))
                .toList());
        next.setUpdatedDate(nowIso);
        next.setUpdatedUser(normalizedUserId);
        if (!updateAssetOwnerReleaseIfSnapshotCurrent(current, next)) {
            return null;
        }
        activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId(
                        OWNER_TYPE_ASSET,
                        normalizedAssetId,
                        normalizedUserId)
                .ifPresent(activityMembersRepository::delete);
        syncAssetRequestProjection(current, next);

        List<String> successorCandidateUserIds = assetOwnerReleaseRecipientUserIds(next, normalizedUserId);
        if (successorCandidateUserIds.isEmpty() && activitiesResourcesServiceProvider != null) {
            ActivitiesResourcesService activitiesResourcesService = activitiesResourcesServiceProvider.getIfAvailable();
            if (activitiesResourcesService != null) {
                activitiesResourcesService.removeAssetFromResourceAssignments(normalizedAssetId, normalizedUserId);
            }
        }

        affinityRecomputeTaskService.enqueueAssetChanged(normalizedAssetId, normalizedUserId);
        markAssetAttachmentUnavailable(normalizedAssetId, "owner-left");
        enqueueAssetOwnerReleasedNotification(next, normalizedUserId);
        adminTelemetryService.record("asset.owner.left", "assets", normalizedAssetId, normalizedUserId);
        userActivityCountersService.refreshAssetCountersForUser(normalizedUserId);
        for (String recipientUserId : successorCandidateUserIds) {
            userActivityCountersService.refreshAssetCountersForUser(recipientUserId);
        }
        return toAssetDto(next, resolveOwnersByUserId(List.of(next)), normalizedUserId);
    }

    public AssetDto restore(AssetDeleteRequestDto request) {
        if (request == null) {
            return null;
        }
        String normalizedUserId = normalizeId(request.userId());
        String normalizedAssetId = normalizeId(request.assetId());
        if (!StringUtils.hasText(normalizedUserId) || !StringUtils.hasText(normalizedAssetId)) {
            return null;
        }
        if (!accessControlService.canCurrentActorRestoreAsset(normalizedUserId, normalizedAssetId)) {
            return null;
        }
        Asset current = assetsRepository.findByOwnerUserIdAndAssetId(normalizedUserId, normalizedAssetId).orElse(null);
        if (current == null || !STATUS_TRASHED.equals(safeText(current.getStatus()))) {
            return null;
        }
        Asset next = cloneAsset(current);
        next.setStatus(STATUS_ACTIVE);
        next.setStatusBeforeSuppression(null);
        next.setTrashedAtIso(null);
        next.setUpdatedDate(Instant.now().toString());
        next.setUpdatedUser(normalizedUserId);
        next.setAffinity(resolveAssetAffinity(next, normalizedUserId));
        next.setBoost(resolveAssetBoost(next, normalizedUserId));
        assetsRepository.save(next);
        affinityRecomputeTaskService.enqueueAssetChanged(normalizedAssetId, normalizedUserId);
        adminTelemetryService.record("asset.restored", "assets", normalizedAssetId, normalizedUserId);
        markAssetAttachmentAvailable(normalizedAssetId);
        enqueueAssetRestoredNotification(next, normalizedUserId);
        userActivityCountersService.refreshAssetCountersForUser(normalizedUserId);
        return toAssetDto(next, resolveOwnersByUserId(List.of(next)), normalizedUserId);
    }

    public AssetDto takeOver(AssetDeleteRequestDto request) {
        if (request == null) {
            return null;
        }
        String normalizedUserId = normalizeId(request.userId());
        String normalizedAssetId = normalizeId(request.assetId());
        if (!StringUtils.hasText(normalizedUserId) || !StringUtils.hasText(normalizedAssetId)) {
            return null;
        }
        if (!accessControlService.canCurrentActorTakeOverAsset(normalizedUserId, normalizedAssetId)) {
            return null;
        }
        Asset current = findAssetByAssetId(normalizedAssetId).orElse(null);
        if (current == null || !STATUS_UNDER_REVIEW.equals(safeText(current.getStatus()))) {
            return null;
        }
        if (!isEligibleAssetTakeOverCandidate(current, normalizedUserId)) {
            return null;
        }
        Asset next = cloneAsset(current);
        String restoredStatus = safeText(next.getStatusBeforeSuppression());
        if (!StringUtils.hasText(restoredStatus) || isSuppressedLifecycleStatus(restoredStatus)) {
            restoredStatus = STATUS_ACTIVE;
        }
        next.setOwnerUserId(normalizedUserId);
        next.setStatus(restoredStatus);
        next.setStatusBeforeSuppression(null);
        next.setOwnerReleasedAtIso(null);
        next.setUpdatedDate(Instant.now().toString());
        next.setUpdatedUser(normalizedUserId);
        next.setAffinity(resolveAssetAffinity(next, normalizedUserId));
        next.setBoost(resolveAssetBoost(next, normalizedUserId));
        if (!updateAssetTakeOverIfSnapshotCurrent(current, next)) {
            return null;
        }
        affinityRecomputeTaskService.enqueueAssetChanged(normalizedAssetId, normalizedUserId);
        markAssetAttachmentAvailable(normalizedAssetId);
        enqueueAssetTakeOverNotification(current, next, normalizedUserId);
        userActivityCountersService.refreshAssetCountersForUser(normalizeId(current.getOwnerUserId()));
        userActivityCountersService.refreshAssetCountersForUser(normalizedUserId);
        return toAssetDto(next, resolveOwnersByUserId(List.of(next)), normalizedUserId);
    }

    public AssetDto makeManager(AssetMakeManagerRequestDto request) {
        if (request == null) {
            return null;
        }
        String normalizedUserId = normalizeId(request.userId());
        String normalizedAssetId = normalizeId(request.assetId());
        String normalizedTargetUserId = normalizeId(request.targetUserId());
        if (!StringUtils.hasText(normalizedUserId)
                || !StringUtils.hasText(normalizedAssetId)
                || !StringUtils.hasText(normalizedTargetUserId)) {
            return null;
        }
        if (!accessControlService.canCurrentActorPromoteAssetManager(normalizedUserId, normalizedAssetId)) {
            return null;
        }
        Asset current = findAssetByAssetId(normalizedAssetId).orElse(null);
        Optional<ActivityMember> existingMember = activityMembersRepository
                .findByOwnerTypeAndOwnerIdAndUserId(OWNER_TYPE_ASSET, normalizedAssetId, normalizedTargetUserId);
        if (current == null
                || normalizedTargetUserId.equals(normalizeId(current.getOwnerUserId()))
                || !canManageAssetMembers(current, normalizedUserId)
                || !isActiveUser(normalizedTargetUserId)
                || isAcceptedAssetManagerMember(existingMember.orElse(null))
                || !isKnownAssetParticipant(current, normalizedTargetUserId, existingMember.orElse(null))) {
            return null;
        }

        String nowIso = Instant.now().toString();
        ActivityMember currentMember = existingMember.orElse(null);
        ActivityMember member = new ActivityMember();
        if (currentMember != null) {
            member.setId(currentMember.getId());
            member.setSyncKey(currentMember.getSyncKey());
            member.setCreatedDate(currentMember.getCreatedDate());
            member.setCreatedUser(currentMember.getCreatedUser());
        }
        if (!StringUtils.hasText(member.getId())) {
            member.setId(new ObjectId().toHexString());
            member.setSyncKey(UUID.randomUUID().toString());
            member.setOwnerType(OWNER_TYPE_ASSET);
            member.setOwnerId(normalizedAssetId);
            member.setUserId(normalizedTargetUserId);
            member.setCreatedDate(nowIso);
            member.setCreatedUser(normalizedUserId);
        }
        member.setOwnerType(OWNER_TYPE_ASSET);
        member.setOwnerId(normalizedAssetId);
        member.setUserId(normalizedTargetUserId);
        member.setRole(ROLE_MANAGER);
        member.setStatus(MEMBER_STATUS_ACCEPTED);
        member.setPendingSource(null);
        member.setRequestKind(null);
        member.setInvitedByUserId(null);
        member.setManagerGrantedByUserId(normalizedUserId);
        member.setActionAtIso(nowIso);
        member.setUpdatedDate(nowIso);
        member.setUpdatedUser(normalizedUserId);
        ActivityMember promotedMember = promoteAssetMemberIfSnapshotCurrent(currentMember, member);
        if (promotedMember == null) {
            return null;
        }

        Asset next = cloneAsset(current);
        next.setRequests(promotedAssetRequests(current, promotedMember));
        next.setUpdatedDate(nowIso);
        next.setUpdatedUser(normalizedUserId);
        next.setAffinity(resolveAssetAffinity(next, next.getOwnerUserId()));
        next.setBoost(resolveAssetBoost(next, next.getOwnerUserId()));
        if (!updateAssetManagerRequestsIfSnapshotCurrent(current, next)) {
            return null;
        }
        syncAssetRequestProjection(current, next);
        affinityRecomputeTaskService.enqueueAssetChanged(normalizedAssetId, normalizedUserId);
        enqueueAssetManagerPromotedNotification(next, normalizedUserId, normalizedTargetUserId);
        return toAssetDto(next, resolveOwnersByUserId(List.of(next)), normalizedUserId);
    }

    public AssetDto revokeManager(AssetMakeManagerRequestDto request) {
        if (request == null) return null;
        String actorId = normalizeId(request.userId());
        String assetId = normalizeId(request.assetId());
        String targetId = normalizeId(request.targetUserId());
        if (!StringUtils.hasText(actorId)
                || !StringUtils.hasText(assetId)
                || !StringUtils.hasText(targetId)
                || actorId.equals(targetId)) {
            return null;
        }
        Asset current = findAssetByAssetId(assetId).orElse(null);
        Optional<ActivityMember> member = activityMembersRepository
                .findByOwnerTypeAndOwnerIdAndUserId(OWNER_TYPE_ASSET, assetId, targetId);
        boolean actorOwnsAsset = current != null && actorId.equals(normalizeId(current.getOwnerUserId()));
        boolean actorGrantedManagerRole = member
                .map(ActivityMember::getManagerGrantedByUserId)
                .map(this::normalizeId)
                .filter(actorId::equals)
                .isPresent();
        if (current == null || !canManageAssetMembers(current, actorId)
                || !accessControlService.canCurrentActorPromoteAssetManager(actorId, assetId)
                || !isAcceptedAssetManagerMember(member.orElse(null))
                || (!actorOwnsAsset && !actorGrantedManagerRole)) return null;
        Asset next = cloneAsset(current);
        next.setRequests(safeRequests(current.getRequests()).stream().map(item ->
                targetId.equals(normalizeId(item.userId()))
                        ? new AssetRequestRecord(item.id(), item.userId(), item.name(), item.initials(), item.gender(),
                                item.status(), "Borrow request approved by the owner.", item.requestKind(),
                                item.requestedAtIso(), item.booking())
                        : item).toList());
        next.setUpdatedDate(Instant.now().toString());
        next.setUpdatedUser(actorId);
        if (!updateAssetManagerRequestsIfSnapshotCurrent(current, next)) return null;
        member.ifPresent(activityMembersRepository::delete);
        syncAssetRequestProjection(current, next);
        affinityRecomputeTaskService.enqueueAssetChanged(assetId, actorId);
        enqueueAssetManagerRevokedNotification(next, actorId, targetId);
        return toAssetDto(next, resolveOwnersByUserId(List.of(next)), actorId);
    }

    private boolean updateAssetTakeOverIfSnapshotCurrent(Asset current, Asset next) {
        Update update = new Update()
                .set("ownerUserId", normalizeId(next.getOwnerUserId()))
                .set("status", safeText(next.getStatus()))
                .unset("statusBeforeSuppression")
                .unset("ownerReleasedAtIso")
                .set("updatedDate", safeText(next.getUpdatedDate()))
                .set("updatedUser", safeText(next.getUpdatedUser()))
                .set("affinity", next.getAffinity())
                .set("boost", next.getBoost());
        return updateAssetIfSnapshotCurrent(current, update);
    }

    private boolean updateAssetOwnerReleaseIfSnapshotCurrent(Asset current, Asset next) {
        Update update = new Update()
                .set("status", STATUS_UNDER_REVIEW)
                .set("statusBeforeSuppression", safeText(next.getStatusBeforeSuppression()))
                .set("ownerReleasedAtIso", safeText(next.getOwnerReleasedAtIso()))
                .set("requests", safeRequests(next.getRequests()))
                .set("updatedDate", safeText(next.getUpdatedDate()))
                .set("updatedUser", safeText(next.getUpdatedUser()));
        return updateAssetIfSnapshotCurrent(current, update);
    }

    private boolean updateAssetManagerRequestsIfSnapshotCurrent(Asset current, Asset next) {
        Update update = new Update()
                .set("requests", safeRequests(next.getRequests()))
                .set("updatedDate", safeText(next.getUpdatedDate()))
                .set("updatedUser", safeText(next.getUpdatedUser()))
                .set("affinity", next.getAffinity())
                .set("boost", next.getBoost());
        return updateAssetIfSnapshotCurrent(current, update);
    }

    private boolean updateAssetIfSnapshotCurrent(Asset current, Update update) {
        if (current == null || update == null || !StringUtils.hasText(normalizeId(current.getId()))) {
            return false;
        }
        Criteria criteria = Criteria.where("_id").is(normalizeId(current.getId()))
                .and("updatedDate").is(StringUtils.hasText(safeText(current.getUpdatedDate())) ? safeText(current.getUpdatedDate()) : null);
        UpdateResult result = mongoTemplate.updateFirst(Query.query(criteria), update, Asset.class);
        return result != null && result.getMatchedCount() > 0;
    }

    private ActivityMember promoteAssetMemberIfSnapshotCurrent(ActivityMember current, ActivityMember next) {
        if (next == null) {
            return null;
        }
        if (current == null) {
            try {
                return activityMembersRepository.save(next);
            } catch (DuplicateKeyException ignored) {
                return null;
            }
        }
        Criteria criteria = memberSnapshotCriteria(current);
        if (criteria == null) {
            return null;
        }
        Update update = new Update()
                .set("ownerType", safeText(next.getOwnerType()))
                .set("ownerId", normalizeId(next.getOwnerId()))
                .set("userId", normalizeId(next.getUserId()))
                .set("role", safeText(next.getRole()))
                .set("status", safeText(next.getStatus()))
                .unset("pendingSource")
                .unset("requestKind")
                .unset("invitedByUserId")
                .set("managerGrantedByUserId", normalizeId(next.getManagerGrantedByUserId()))
                .set("actionAtIso", safeText(next.getActionAtIso()))
                .set("updatedDate", safeText(next.getUpdatedDate()))
                .set("updatedUser", safeText(next.getUpdatedUser()));
        UpdateResult result = mongoTemplate.updateFirst(Query.query(criteria), update, ActivityMember.class);
        return result != null && result.getMatchedCount() > 0 ? next : null;
    }

    private Criteria memberSnapshotCriteria(ActivityMember current) {
        if (current == null) {
            return null;
        }
        String id = normalizeId(current.getId());
        Criteria criteria;
        if (StringUtils.hasText(id)) {
            criteria = Criteria.where("_id").is(id);
        } else {
            String ownerType = safeText(current.getOwnerType());
            String ownerId = normalizeId(current.getOwnerId());
            String userId = normalizeId(current.getUserId());
            if (!StringUtils.hasText(ownerType) || !StringUtils.hasText(ownerId) || !StringUtils.hasText(userId)) {
                return null;
            }
            criteria = Criteria.where("ownerType").is(ownerType)
                    .and("ownerId").is(ownerId)
                    .and("userId").is(userId);
        }
        return criteria
                .and("updatedDate").is(StringUtils.hasText(safeText(current.getUpdatedDate())) ? safeText(current.getUpdatedDate()) : null)
                .and("role").is(StringUtils.hasText(safeText(current.getRole())) ? safeText(current.getRole()) : null)
                .and("status").is(StringUtils.hasText(safeText(current.getStatus())) ? safeText(current.getStatus()) : null);
    }

    private AssetRequestRecord findAssetRequest(Asset asset, String userId) {
        String normalizedUserId = normalizeId(userId);
        if (asset == null || !StringUtils.hasText(normalizedUserId)) {
            return null;
        }
        return safeRequests(asset.getRequests()).stream()
                .filter(Objects::nonNull)
                .filter(request -> normalizedUserId.equals(normalizeId(request.userId())))
                .findFirst()
                .orElse(null);
    }

    private String assetRequestEventId(AssetRequestRecord request) {
        return normalizeId(request == null || request.booking() == null ? null : request.booking().eventId());
    }

    public Optional<Asset> findAssetByAssetId(String assetId) {
        String normalizedAssetId = normalizeId(assetId);
        if (!StringUtils.hasText(normalizedAssetId)) {
            return Optional.empty();
        }

        return assetsRepository.findByAssetId(normalizedAssetId);
    }

    public Optional<Asset> findAssetByAssetIdWithScopedRequests(
            String assetId,
            String eventId,
            String subEventId,
            String requestStatus) {
        String normalizedAssetId = normalizeId(assetId);
        String normalizedEventId = normalizeId(eventId);
        String normalizedSubEventId = normalizeId(subEventId);
        String normalizedRequestStatus = safeText(requestStatus);
        if (!StringUtils.hasText(normalizedAssetId)
                || !StringUtils.hasText(normalizedEventId)
                || !StringUtils.hasText(normalizedSubEventId)) {
            return Optional.empty();
        }

        List<String> scopedEventIds = new ArrayList<>(new LinkedHashSet<>(List.of(
                normalizedEventId,
                authorizationEventId(normalizedEventId, normalizedSubEventId))));
        List<Document> requestConditions = new ArrayList<>();
        requestConditions.add(new Document("$in", List.of("$$request.booking.eventId", scopedEventIds)));
        requestConditions.add(new Document("$eq", List.of("$$request.booking.subEventId", normalizedSubEventId)));
        requestConditions.add(new Document("$ne", List.of("$$request.status", STATUS_DELETED)));
        requestConditions.add(new Document("$ne", List.of("$$request.status", "deleted")));
        if (StringUtils.hasText(normalizedRequestStatus)) {
            requestConditions.add(new Document("$eq", List.of("$$request.status", normalizedRequestStatus)));
        }

        Aggregation aggregation = Aggregation.newAggregation(
                context -> new Document("$match", new Document("assetId", normalizedAssetId)),
                context -> new Document("$set", new Document("requests", new Document("$filter", new Document()
                        .append("input", new Document("$ifNull", List.of("$requests", List.of())))
                        .append("as", "request")
                        .append("cond", new Document("$and", requestConditions))))));
        Asset asset = mongoTemplate.aggregate(aggregation, "assets", Asset.class).getUniqueMappedResult();
        return Optional.ofNullable(asset);
    }

    private String authorizationEventId(String eventId, String subEventId) {
        String normalizedEventId = normalizeId(eventId);
        String normalizedSubEventId = normalizeId(subEventId);
        String runtimeEventId = normalizedEventId;
        if (StringUtils.hasText(normalizedSubEventId)) {
            int groupOwnerMarker = normalizedEventId.indexOf(":" + normalizedSubEventId + ":");
            if (groupOwnerMarker > 0) {
                runtimeEventId = normalizedEventId.substring(0, groupOwnerMarker);
            }
        }
        int slotMarker = runtimeEventId.indexOf(":slot:");
        return slotMarker > 0 ? runtimeEventId.substring(0, slotMarker) : runtimeEventId;
    }

    public void syncRequestsFromMembers(String assetId, List<ActivityMember> members) {
        Optional<Asset> assetOptional = findAssetByAssetId(assetId);
        if (assetOptional.isEmpty()) {
            return;
        }

        Asset current = assetOptional.get();
        String ownerUserId = normalizeId(current.getOwnerUserId());
        Map<String, ActivityMember> suppliedMembersByUserId = new LinkedHashMap<>();
        for (ActivityMember member : members == null ? List.<ActivityMember>of() : members) {
            String memberUserId = normalizeId(member == null ? null : member.getUserId());
            if (StringUtils.hasText(memberUserId) && !ownerUserId.equals(memberUserId)) {
                suppliedMembersByUserId.put(memberUserId, member);
            }
        }

        Set<String> updatedUserIds = new LinkedHashSet<>();
        List<AssetRequestRecord> nextRequests = new ArrayList<>();
        for (AssetRequestRecord existing : safeRequests(current.getRequests())) {
            if (existing == null) {
                continue;
            }
            if (isDeletedAssetRequest(existing)) {
                nextRequests.add(existing);
                continue;
            }
            if ("manual".equals(normalizeAssetRequestKind(existing.requestKind()))) {
                nextRequests.add(existing);
                continue;
            }
            String requestUserId = normalizeId(existing.userId());
            ActivityMember suppliedMember = suppliedMembersByUserId.get(requestUserId);
            if (suppliedMember == null) {
                nextRequests.add(existing);
                continue;
            }
            updatedUserIds.add(requestUserId);
            if (!"deleted".equals(normalizeMemberStatus(suppliedMember.getStatus()))) {
                AssetRequestRecord updated = toAssetRequest(suppliedMember, existing);
                if (updated != null) {
                    nextRequests.add(updated);
                }
            } else {
                nextRequests.add(withAssetRequestStatus(existing, STATUS_DELETED));
            }
        }
        for (Map.Entry<String, ActivityMember> entry : suppliedMembersByUserId.entrySet()) {
            if (updatedUserIds.contains(entry.getKey())
                    || "deleted".equals(normalizeMemberStatus(entry.getValue().getStatus()))) {
                continue;
            }
            AssetRequestRecord added = toAssetRequest(entry.getValue(), null);
            if (added != null) {
                nextRequests.add(added);
            }
        }

        Asset next = cloneAsset(current);
        next.setRequests(deduplicateRequests(nextRequests));
        next.setUpdatedDate(Instant.now().toString());
        next.setUpdatedUser(ownerUserId);
        next.setAffinity(resolveAssetAffinity(next, ownerUserId));
        next.setBoost(resolveAssetBoost(next, ownerUserId));
        assetsRepository.save(next);
        syncAssetRequestProjection(current, next);
        affinityRecomputeTaskService.enqueueAssetRequestsChanged(normalizeId(next.getAssetId()), ownerUserId);
        adminTelemetryService.record("asset.requests.changed", "assets", normalizeId(next.getAssetId()), ownerUserId);
    }

    public String syncScopedRequestsFromMemberEntries(
            String assetId,
            String eventId,
            String subEventId,
            List<ActivityMemberEntryDto> members,
            String actorUserId) {
        String normalizedAssetId = normalizeId(assetId);
        String normalizedEventId = normalizeId(eventId);
        String normalizedSubEventId = normalizeId(subEventId);
        if (!StringUtils.hasText(normalizedAssetId)
                || !StringUtils.hasText(normalizedEventId)
                || !StringUtils.hasText(normalizedSubEventId)) {
            return null;
        }

        Asset current = findAssetByAssetId(normalizedAssetId).orElse(null);
        if (current == null) {
            return null;
        }
        String ownerUserId = normalizeId(current.getOwnerUserId());
        Map<String, ActivityMemberEntryDto> suppliedByUserId = new LinkedHashMap<>();
        for (ActivityMemberEntryDto member : members == null ? List.<ActivityMemberEntryDto>of() : members) {
            String memberUserId = normalizeId(member == null ? null : member.userId());
            if (StringUtils.hasText(memberUserId) && !ownerUserId.equals(memberUserId)) {
                suppliedByUserId.put(memberUserId, member);
            }
        }

        AssetRequestBookingRecord scopedBooking = safeRequests(current.getRequests()).stream()
                .filter(request -> isRequestInScope(request, normalizedEventId, normalizedSubEventId))
                .map(AssetRequestRecord::booking)
                .filter(Objects::nonNull)
                .findFirst()
                .map(this::cloneRequestBooking)
                .orElseGet(() -> minimalRequestBooking(normalizedEventId, normalizedSubEventId));
        Set<String> retainedUserIds = new LinkedHashSet<>();
        List<AssetRequestRecord> nextRequests = new ArrayList<>();
        for (AssetRequestRecord existing : safeRequests(current.getRequests())) {
            if (existing == null || !isRequestInScope(existing, normalizedEventId, normalizedSubEventId)) {
                if (existing != null) {
                    nextRequests.add(existing);
                }
                continue;
            }
            if (isDeletedAssetRequest(existing)) {
                nextRequests.add(existing);
                continue;
            }
            if ("manual".equals(normalizeAssetRequestKind(existing.requestKind()))) {
                nextRequests.add(existing);
                continue;
            }
            String requestUserId = normalizeId(existing.userId());
            // A take-over keeps the successor's accepted scoped membership as the
            // authoritative occupant of the resource. Member-list updates omit the
            // current owner, so dropping this row would incorrectly turn 2 -> 0
            // when the other member is removed instead of the expected 2 -> 1.
            if (ownerUserId.equals(requestUserId)) {
                nextRequests.add(existing);
                continue;
            }
            ActivityMemberEntryDto supplied = suppliedByUserId.get(requestUserId);
            if (supplied == null || "deleted".equals(normalizeMemberStatus(supplied.status()))) {
                nextRequests.add(withAssetRequestStatus(existing, STATUS_DELETED));
                continue;
            }
            retainedUserIds.add(requestUserId);
            AssetRequestRecord updated = toScopedAssetRequest(supplied, existing, scopedBooking);
            if (updated != null) {
                nextRequests.add(updated);
            }
        }
        for (Map.Entry<String, ActivityMemberEntryDto> entry : suppliedByUserId.entrySet()) {
            if (retainedUserIds.contains(entry.getKey())
                    || "deleted".equals(normalizeMemberStatus(entry.getValue().status()))) {
                continue;
            }
            AssetRequestRecord added = toScopedAssetRequest(entry.getValue(), null, scopedBooking);
            if (added != null) {
                nextRequests.add(added);
            }
        }

        Asset next = cloneAsset(current);
        next.setRequests(deduplicateRequests(nextRequests));
        next.setUpdatedDate(Instant.now().toString());
        next.setUpdatedUser(firstNonBlank(normalizeId(actorUserId), ownerUserId));
        next.setAffinity(resolveAssetAffinity(next, ownerUserId));
        next.setBoost(resolveAssetBoost(next, ownerUserId));
        assetsRepository.save(next);
        syncAssetRequestProjection(current, next);
        enqueueScopedAssetPendingRequestNotifications(
                current,
                next,
                normalizedEventId,
                normalizedSubEventId,
                firstNonBlank(normalizeId(actorUserId), ownerUserId));
        enqueueAssetMembershipTransitionNotifications(
                current,
                next,
                firstNonBlank(normalizeId(actorUserId), ownerUserId));
        affinityRecomputeTaskService.enqueueAssetRequestsChanged(normalizedAssetId, ownerUserId);
        adminTelemetryService.record("asset.requests.changed", "assets", normalizedAssetId, ownerUserId);
        return ownerUserId;
    }

    public boolean canManageScopedAssetMembers(
            String assetId,
            String eventId,
            String subEventId,
            String userId) {
        String normalizedAssetId = normalizeId(assetId);
        String normalizedEventId = normalizeId(eventId);
        String normalizedSubEventId = normalizeId(subEventId);
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(normalizedAssetId)
                || !StringUtils.hasText(normalizedEventId)
                || !StringUtils.hasText(normalizedSubEventId)
                || !StringUtils.hasText(normalizedUserId)) {
            return false;
        }

        Asset asset = findAssetByAssetId(normalizedAssetId).orElse(null);
        if (asset == null || STATUS_TRASHED.equals(safeText(asset.getStatus()))) {
            return false;
        }
        if (normalizedUserId.equals(normalizeId(asset.getOwnerUserId()))
                || hasAcceptedAssetManagerRole(asset, normalizedUserId)) {
            return true;
        }
        ActivitiesResourcesService activitiesResourcesService = activitiesResourcesServiceProvider == null
                ? null
                : activitiesResourcesServiceProvider.getIfAvailable();
        return activitiesResourcesService != null
                && normalizedUserId.equals(normalizeId(
                        activitiesResourcesService.scopedAssetManagerUserId(
                                normalizedEventId,
                                normalizedSubEventId,
                                normalizedAssetId)));
    }

    private boolean isRequestInScope(AssetRequestRecord request, String eventId, String subEventId) {
        AssetRequestBookingRecord booking = request == null ? null : request.booking();
        return booking != null
                && eventId.equals(normalizeId(booking.eventId()))
                && subEventId.equals(normalizeId(booking.subEventId()));
    }

    private AssetRequestBookingRecord minimalRequestBooking(String eventId, String subEventId) {
        return new AssetRequestBookingRecord(
                eventId,
                null,
                subEventId,
                null,
                subEventId,
                null,
                null,
                null,
                null,
                1,
                null,
                null,
                List.of(),
                null,
                null);
    }

    private AssetRequestRecord toScopedAssetRequest(
            ActivityMemberEntryDto member,
            AssetRequestRecord existing,
            AssetRequestBookingRecord booking) {
        if (member == null || !StringUtils.hasText(normalizeId(member.userId()))) {
            return null;
        }
        Users user = usersRepository.findByUserId(normalizeId(member.userId())).orElse(null);
        String status = "pending".equals(normalizeMemberStatus(member.status())) ? "pending" : "accepted";
        return new AssetRequestRecord(
                existing != null && StringUtils.hasText(existing.id()) ? existing.id().trim() : UUID.randomUUID().toString(),
                normalizeId(member.userId()),
                user == null ? safeText(member.name()) : safeText(user.getName()),
                user == null ? safeText(member.initials()) : safeText(user.getInitials()),
                user == null ? safeText(member.gender()) : normalizeGender(user.getGender()),
                status,
                StringUtils.hasText(safeText(member.statusText()))
                        ? safeText(member.statusText())
                        : "pending".equals(status) ? "Awaiting owner confirmation." : "Approved and synced with the plan.",
                existing != null
                        ? normalizeAssetRequestKind(existing.requestKind())
                        : assetRequestKindForMember(member.requestKind()),
                existing != null && StringUtils.hasText(existing.requestedAtIso())
                        ? existing.requestedAtIso()
                        : normalizeDateTime(member.actionAtIso(), Instant.now().toString()),
                existing != null && existing.booking() != null
                        ? cloneRequestBooking(existing.booking())
                        : cloneRequestBooking(booking));
    }

    private Asset saveOwnedAsset(String ownerUserId, AssetDetailDto assetDto) {
        if (!StringUtils.hasText(ownerUserId)) {
            return null;
        }

        String assetId = normalizeId(assetDto == null ? null : assetDto.id());
        if (!StringUtils.hasText(assetId)) {
            return null;
        }
        Asset existing = assetsRepository.findByOwnerUserIdAndAssetId(ownerUserId, assetId).orElse(null);
        boolean fullAssetWriteAllowed = existing == null
                ? accessControlService.canCurrentActorCreateAsset(ownerUserId, assetId)
                : accessControlService.canCurrentActorEditAsset(ownerUserId, assetId);
        if (existing == null && !fullAssetWriteAllowed) {
            return null;
        }
        Asset proposed = toDocument(assetDto, ownerUserId, existing);
        if (proposed == null) {
            return null;
        }
        if (existing != null) {
            proposed.setRequests(preserveRequestAudits(existing.getRequests(), proposed.getRequests()));
        }
        Asset saved = proposed;
        if (existing != null) {
            if (!fullAssetWriteAllowed) {
                proposed = mergeRequestScopedAssetProposal(existing, proposed);
            }
            if (!canApplyAssetRequestPolicies(existing, proposed, fullAssetWriteAllowed)) {
                return null;
            }
            if (!fullAssetWriteAllowed) {
                if (!hasAssetRequestChanges(existing, proposed)) {
                    return null;
                }
                saved = toRequestScopedAsset(existing, proposed, ownerUserId);
            }
        }
        assetsRepository.save(saved);
        syncAssetRequestProjection(existing, saved);
        String actorUserId = currentActorUserId();
        enqueueNewScopedAssetPendingRequestNotifications(existing, saved, actorUserId);
        enqueueAssetMembershipTransitionNotifications(existing, saved, actorUserId);
        affinityRecomputeTaskService.enqueueAssetChanged(normalizeId(saved.getAssetId()), ownerUserId);
        adminTelemetryService.record("asset.saved", "assets", normalizeId(saved.getAssetId()), ownerUserId);
        syncAssetRequestPayments(existing, saved);
        userActivityCountersService.refreshAssetCountersForUser(ownerUserId);
        return saved;
    }

    private Asset mergeRequestScopedAssetProposal(Asset existing, Asset proposed) {
        if (existing == null || proposed == null) {
            return proposed;
        }
        String actorUserId = currentActorUserId();
        String assetId = normalizeId(existing.getAssetId());
        Map<String, AssetRequestRecord> nextById = requestsById(proposed.getRequests());
        List<AssetRequestRecord> merged = new ArrayList<>();
        for (AssetRequestRecord previous : safeRequests(existing.getRequests())) {
            String requestId = normalizeId(previous == null ? null : previous.id());
            if (!StringUtils.hasText(requestId)) {
                continue;
            }
            AssetRequestRecord next = nextById.remove(requestId);
            if (next != null) {
                merged.add(next);
                continue;
            }
            String requesterUserId = normalizeId(previous.userId());
            boolean actorCanRemove = !StringUtils.hasText(actorUserId)
                    ? nextById.isEmpty()
                    : actorUserId.equals(requesterUserId)
                            || accessControlService.canManageAsset(assetId, actorUserId);
            if (!actorCanRemove) {
                merged.add(previous);
            }
        }
        merged.addAll(nextById.values());
        proposed.setRequests(merged);
        return proposed;
    }

    private void syncAssetRequestProjection(Asset existing, Asset saved) {
        if (saved == null) {
            return;
        }
        String assetId = normalizeId(saved.getAssetId());
        String ownerUserId = normalizeId(saved.getOwnerUserId());
        if (!StringUtils.hasText(assetId) || !StringUtils.hasText(ownerUserId)) {
            return;
        }

        String previousOwnerUserId = normalizeId(existing == null ? null : existing.getOwnerUserId());
        if (StringUtils.hasText(previousOwnerUserId) && !previousOwnerUserId.equals(ownerUserId)) {
            mongoTemplate.remove(Query.query(Criteria.where("ownerUserId").is(previousOwnerUserId)
                    .and("assetId").is(assetId)), AssetRequest.class);
        }

        Query ownerAssetQuery = Query.query(Criteria.where("ownerUserId").is(ownerUserId)
                .and("assetId").is(assetId));
        List<AssetRequest> currentDocuments = mongoTemplate.find(ownerAssetQuery, AssetRequest.class);
        Map<String, AssetRequest> currentById = new LinkedHashMap<>();
        for (AssetRequest current : currentDocuments == null ? List.<AssetRequest>of() : currentDocuments) {
            String projectionId = normalizeId(current == null ? null : current.id());
            if (StringUtils.hasText(projectionId)) {
                currentById.put(projectionId, current);
            }
        }

        String nowIso = Instant.now().toString();
        String updatedDate = StringUtils.hasText(safeText(saved.getUpdatedDate()))
                ? safeText(saved.getUpdatedDate())
                : nowIso;
        Set<String> retainedRequestIds = new LinkedHashSet<>();
        for (AssetRequestRecord request : safeRequests(saved.getRequests())) {
            String requestId = normalizeId(request == null ? null : request.id());
            if (!StringUtils.hasText(requestId)) {
                continue;
            }
            String projectionId = assetRequestProjectionId(assetId, requestId);
            retainedRequestIds.add(projectionId);
            AssetRequest current = currentById.get(projectionId);
            String createdDate = current != null && StringUtils.hasText(safeText(current.createdDate()))
                    ? safeText(current.createdDate())
                    : StringUtils.hasText(safeText(request.requestedAtIso()))
                            ? safeText(request.requestedAtIso())
                            : StringUtils.hasText(safeText(saved.getCreatedDate()))
                                    ? safeText(saved.getCreatedDate())
                                    : nowIso;
            mongoTemplate.save(new AssetRequest(
                    projectionId,
                    requestId,
                    assetId,
                    ownerUserId,
                    "asset:" + assetId,
                    Math.max(0, saved.getCapacityTotal() == null ? 0 : saved.getCapacityTotal()),
                    normalizeId(request.userId()),
                    safeText(request.name()),
                    safeText(request.initials()),
                    safeText(request.gender()),
                    safeText(request.status()),
                    safeText(request.note()),
                    safeText(request.requestKind()),
                    safeText(request.requestedAtIso()),
                    request.booking(),
                    "Promoted to asset manager.".equals(safeText(request.note()))
                            ? List.of("revokeManager")
                            : current == null || current.menuActions() == null
                                    ? List.of()
                                    : current.menuActions().contains("revokeManager")
                                            ? List.of("makeManager")
                                            : List.copyOf(current.menuActions()),
                    createdDate,
                    updatedDate));
        }

        Set<String> removedProjectionIds = new LinkedHashSet<>();
        for (AssetRequestRecord previous : safeRequests(existing == null ? null : existing.getRequests())) {
            String previousRequestId = normalizeId(previous == null ? null : previous.id());
            if (!StringUtils.hasText(previousRequestId)) {
                continue;
            }
            String projectionId = assetRequestProjectionId(assetId, previousRequestId);
            if (!retainedRequestIds.contains(projectionId)) {
                removedProjectionIds.add(projectionId);
            }
        }
        if (!removedProjectionIds.isEmpty()) {
            Query staleQuery = Query.query(Criteria.where("ownerUserId").is(ownerUserId)
                    .and("assetId").is(assetId)
                    .and("_id").in(removedProjectionIds));
            mongoTemplate.remove(staleQuery, AssetRequest.class);
        }
        refreshEventSubEventResourceCounters(existing, saved);
    }

    private void refreshEventSubEventResourceCounters(Asset existing, Asset saved) {
        if (activitiesResourcesServiceProvider == null) {
            return;
        }
        ActivitiesResourcesService activitiesResourcesService =
                activitiesResourcesServiceProvider.getIfAvailable();
        if (activitiesResourcesService == null) {
            return;
        }
        Set<String> scopes = new LinkedHashSet<>();
        collectEventSubEventResourceScopes(existing, scopes);
        collectEventSubEventResourceScopes(saved, scopes);
        for (String scope : scopes) {
            String[] parts = scope.split("\n", 2);
            if (parts.length == 2) {
                activitiesResourcesService.refreshResourceMetricsForScope(
                        parts[0],
                        parts[1],
                        saved == null ? null : saved.getUpdatedUser());
            }
        }
    }

    private void collectEventSubEventResourceScopes(Asset asset, Set<String> scopes) {
        if (asset == null || scopes == null) {
            return;
        }
        for (AssetRequestRecord request : safeRequests(asset.getRequests())) {
            AssetRequestBookingRecord booking = request == null ? null : request.booking();
            String eventId = normalizeId(booking == null ? null : booking.eventId());
            String subEventId = normalizeId(booking == null ? null : booking.subEventId());
            if (StringUtils.hasText(eventId) && StringUtils.hasText(subEventId)) {
                scopes.add(eventId + "\n" + subEventId);
            }
        }
    }

    private String assetRequestProjectionId(String assetId, String requestId) {
        return normalizeId(assetId) + ":request:" + normalizeId(requestId);
    }

    private boolean canApplyAssetRequestPolicies(Asset existing, Asset proposed, boolean fullAssetWriteAllowed) {
        if (existing == null || proposed == null) {
            return true;
        }

        String assetId = normalizeId(existing.getAssetId());
        Map<String, AssetRequestRecord> previousById = requestsById(existing.getRequests());
        Map<String, AssetRequestRecord> nextById = requestsById(proposed.getRequests());

        for (Map.Entry<String, AssetRequestRecord> entry : nextById.entrySet()) {
            AssetRequestRecord previous = previousById.get(entry.getKey());
            AssetRequestRecord next = entry.getValue();
            if (Objects.equals(previous, next)) {
                continue;
            }
            if (!canApplyAddedOrUpdatedAssetRequestPolicy(
                    existing,
                    assetId,
                    previous,
                    next,
                    fullAssetWriteAllowed)) {
                return false;
            }
        }

        for (Map.Entry<String, AssetRequestRecord> entry : previousById.entrySet()) {
            if (nextById.containsKey(entry.getKey())) {
                continue;
            }
            if (!canApplyRemovedAssetRequestPolicy(assetId, entry.getValue(), fullAssetWriteAllowed)) {
                return false;
            }
        }
        return true;
    }

    private boolean canApplyAddedOrUpdatedAssetRequestPolicy(
            Asset asset,
            String assetId,
            AssetRequestRecord previous,
            AssetRequestRecord next,
            boolean fullAssetWriteAllowed) {
        if (!isBorrowRequest(previous) && !isBorrowRequest(next)) {
            return fullAssetWriteAllowed;
        }

        String requesterUserId = normalizeId(next == null ? null : next.userId());
        if (!StringUtils.hasText(requesterUserId)) {
            return false;
        }
        if (!isDeletedAssetRequest(next)
                && !hasAcceptedRequiredPolicies(
                        asset,
                        next == null || next.booking() == null
                                ? List.of()
                                : next.booking().acceptedPolicyIds())) {
            return false;
        }
        if (previous == null) {
            if (MEMBER_STATUS_ACCEPTED.equals(normalizeRequestStatus(next.status()))) {
                return accessControlService.canCurrentActorApproveAssetBorrow(requesterUserId, assetId)
                        && isBorrowRequestWithinParentWindow(next);
            }
            return accessControlService.canCurrentActorRequestAssetBorrow(requesterUserId, assetRequestEventId(next))
                    && isBorrowRequestWithinParentWindow(next);
        }

        String previousStatus = normalizeRequestStatus(previous.status());
        String nextStatus = normalizeRequestStatus(next.status());
        if ("pending".equals(previousStatus) && MEMBER_STATUS_ACCEPTED.equals(nextStatus)) {
            return accessControlService.canCurrentActorApproveAssetBorrow(requesterUserId, assetId);
        }
        if ("pending".equals(previousStatus) && "pending".equals(nextStatus)) {
            return accessControlService.canCurrentActorRequestAssetBorrow(requesterUserId, assetRequestEventId(next))
                    && isBorrowRequestWithinParentWindow(next);
        }
        if (MEMBER_STATUS_ACCEPTED.equals(previousStatus) && MEMBER_STATUS_ACCEPTED.equals(nextStatus)) {
            return fullAssetWriteAllowed;
        }
        if (MEMBER_STATUS_ACCEPTED.equals(previousStatus) && isDeletedAssetRequest(next)) {
            return accessControlService.canCurrentActorCancelAssetBorrow(requesterUserId, assetId);
        }
        return false;
    }

    private boolean isBorrowRequestWithinParentWindow(AssetRequestRecord request) {
        AssetRequestBookingRecord booking = request == null ? null : request.booking();
        if (booking == null) {
            return false;
        }
        AssetBorrowWindowDto borrowWindow = findAssetBorrowWindow(booking.eventId(), booking.subEventId());
        if (borrowWindow == null) {
            return false;
        }
        long requestStart = toSortableMinute(booking.startAtIso());
        long requestEnd = toSortableMinute(booking.endAtIso());
        long parentStart = toSortableMinute(borrowWindow.startAtIso());
        long parentEnd = toSortableMinute(borrowWindow.endAtIso());
        return requestStart != Long.MIN_VALUE
                && requestEnd != Long.MIN_VALUE
                && parentStart != Long.MIN_VALUE
                && parentEnd != Long.MIN_VALUE
                && parentStart <= requestStart
                && requestStart < requestEnd
                && requestEnd <= parentEnd;
    }

    private boolean canApplyRemovedAssetRequestPolicy(
            String assetId,
            AssetRequestRecord previous,
            boolean fullAssetWriteAllowed) {
        if (!isBorrowRequest(previous)) {
            return fullAssetWriteAllowed;
        }
        String requesterUserId = normalizeId(previous == null ? null : previous.userId());
        if (!StringUtils.hasText(requesterUserId)) {
            return false;
        }
        if ("pending".equals(normalizeRequestStatus(previous.status()))
                && accessControlService.canCurrentActorRejectAssetBorrow(requesterUserId, assetId)) {
            return true;
        }
        return accessControlService.canCurrentActorCancelAssetBorrow(requesterUserId, assetId);
    }

    private Asset toRequestScopedAsset(Asset existing, Asset proposed, String ownerUserId) {
        Asset next = cloneAsset(existing);
        next.setRequests(new ArrayList<>(safeRequests(proposed.getRequests())));
        next.setUpdatedDate(proposed.getUpdatedDate());
        next.setUpdatedUser(ownerUserId);
        next.setAffinity(resolveAssetAffinity(next, ownerUserId));
        next.setBoost(resolveAssetBoost(next, ownerUserId));
        return next;
    }

    private boolean hasAssetRequestChanges(Asset existing, Asset proposed) {
        return !Objects.equals(
                requestsById(existing == null ? null : existing.getRequests()),
                requestsById(proposed == null ? null : proposed.getRequests()));
    }

    private Map<String, AssetRequestRecord> requestsById(List<AssetRequestRecord> requests) {
        Map<String, AssetRequestRecord> byId = new LinkedHashMap<>();
        for (AssetRequestRecord request : safeRequests(requests)) {
            String requestId = normalizeId(request == null ? null : request.id());
            if (StringUtils.hasText(requestId)) {
                byId.put(requestId, request);
            }
        }
        return byId;
    }

    private boolean isBorrowRequest(AssetRequestRecord request) {
        return request != null && "borrow".equals(normalizeAssetRequestKind(request.requestKind()));
    }

    private void syncAssetRequestPayments(Asset existing, Asset saved) {
        if (saved == null) {
            return;
        }

        PricingCancellationPolicyDto nextCancellationPolicy = saved.getPricing() == null
                ? null
                : saved.getPricing().cancellationPolicy();
        PricingCancellationPolicyDto previousCancellationPolicy = existing == null || existing.getPricing() == null
                ? nextCancellationPolicy
                : existing.getPricing().cancellationPolicy();

        Map<String, AssetRequestRecord> previousByRequestId = new LinkedHashMap<>();
        for (AssetRequestRecord request : safeRequests(existing == null ? null : existing.getRequests())) {
            String requestId = normalizeId(request == null ? null : request.id());
            if (StringUtils.hasText(requestId)) {
                previousByRequestId.put(requestId, request);
            }
        }

        Map<String, AssetRequestRecord> nextByRequestId = new LinkedHashMap<>();
        for (AssetRequestRecord request : safeRequests(saved.getRequests())) {
            String requestId = normalizeId(request == null ? null : request.id());
            if (StringUtils.hasText(requestId)) {
                nextByRequestId.put(requestId, request);
            }
        }

        for (AssetRequestRecord nextRequest : nextByRequestId.values()) {
            String nextPaymentSessionId = assetRequestPaymentSessionId(nextRequest);
            if (!StringUtils.hasText(nextPaymentSessionId)) {
                continue;
            }

            AssetRequestRecord previousRequest = previousByRequestId.get(normalizeId(nextRequest.id()));
            String previousPaymentSessionId = assetRequestPaymentSessionId(previousRequest);
            if (StringUtils.hasText(previousPaymentSessionId) && !nextPaymentSessionId.equals(previousPaymentSessionId)) {
                paymentService.cancelAssetBooking(
                        previousPaymentSessionId,
                        assetRequestBookingStartAtIso(previousRequest),
                        previousCancellationPolicy);
            }

            if (!nextPaymentSessionId.equals(previousPaymentSessionId)) {
                paymentService.recordAssetBooking(
                        nextPaymentSessionId,
                        normalizeId(nextRequest.userId()),
                        normalizeId(saved.getAssetId()),
                        assetRequestBookingSlotSourceId(nextRequest),
                        assetRequestBookingStartAtIso(nextRequest),
                        safeNullableText(nextRequest.booking().endAtIso()),
                        nextCancellationPolicy,
                        normalizeId(nextRequest.booking().eventId()),
                        normalizeId(nextRequest.booking().subEventId()));
            } else if (hasAssetBookingPriceRevision(previousRequest, nextRequest)) {
                paymentService.recordAssetBookingPriceRevision(
                        nextPaymentSessionId,
                        normalizeId(nextRequest.userId()),
                        normalizeId(saved.getAssetId()),
                        safeText(saved.getTitle()),
                        safeNullableText(nextRequest.booking().timeframe()),
                        previousRequest.booking().quantity(),
                        nextRequest.booking().quantity(),
                        assetBookingRevisionBaseline(
                                nextRequest.booking().previousTotalAmount(),
                                previousRequest.booking().totalAmount()),
                        nextRequest.booking().totalAmount(),
                        nextRequest.booking().currency());
            }
        }

        for (AssetRequestRecord previousRequest : previousByRequestId.values()) {
            String previousRequestId = normalizeId(previousRequest == null ? null : previousRequest.id());
            if (StringUtils.hasText(previousRequestId) && nextByRequestId.containsKey(previousRequestId)) {
                continue;
            }
            String previousPaymentSessionId = assetRequestPaymentSessionId(previousRequest);
            if (!StringUtils.hasText(previousPaymentSessionId)) {
                continue;
            }
            paymentService.cancelAssetBooking(
                    previousPaymentSessionId,
                    assetRequestBookingStartAtIso(previousRequest),
                    previousCancellationPolicy);
        }
    }

    private Asset toDocument(AssetDetailDto dto, String ownerUserId, Asset current) {
        String assetId = normalizeId(dto == null ? null : dto.id());
        String type = normalizeAssetType(dto == null ? null : dto.type());
        if (dto == null || !StringUtils.hasText(assetId) || !StringUtils.hasText(ownerUserId) || !StringUtils.hasText(type)) {
            return null;
        }

        String nowIso = Instant.now().toString();
        Asset next = current == null ? new Asset() : cloneAsset(current);
        next.setId(current == null ? new ObjectId().toHexString() : current.getId());
        next.setSyncKey(current != null && StringUtils.hasText(current.getSyncKey()) ? current.getSyncKey().trim() : UUID.randomUUID().toString());
        next.setAssetId(assetId);
        next.setOwnerUserId(ownerUserId);
        next.setType(type);
        next.setTitle(safeText(dto.title()));
        next.setSubtitle(safeText(dto.subtitle()));
        next.setCategory(safeText(dto.category()));
        next.setCity(safeText(dto.city()));
        next.setCapacityTotal(Math.max(1, normalizeCount(dto.capacityTotal())));
        next.setQuantity(normalizeAssetQuantity(type, dto.quantity(), dto.capacityTotal()));
        next.setDetails(safeText(dto.details()));
        next.setImageUrl(safeText(dto.imageUrl()));
        next.setSourceLink(safeText(dto.sourceLink()));
        next.setRoutes(normalizeStrings(dto.routes()));
        next.setPoliciesEnabled(Boolean.TRUE.equals(dto.policiesEnabled()));
        next.setPolicies(normalizePolicies(dto.policies()));
        next.setPricing(clonePricing(dto.pricing()));
        next.setRequests(normalizeRequests(dto.requests()));
        String nextVisibility = normalizeVisibility(dto.visibility());
        if (!StringUtils.hasText(nextVisibility)) {
            nextVisibility = normalizeVisibility(current == null ? null : current.getVisibility());
        }
        next.setVisibility(StringUtils.hasText(nextVisibility) ? nextVisibility : "Public");
        if (current == null) {
            next.setStatus(STATUS_ACTIVE);
            next.setStatusBeforeSuppression(null);
            next.setTrashedAtIso(null);
        }
        next.setAffinity(resolveAssetAffinity(next, ownerUserId));
        next.setBoost(resolveAssetBoost(next, ownerUserId));
        next.setCreatedDate(current == null ? nowIso : normalizeDateTime(current.getCreatedDate(), nowIso));
        next.setCreatedUser(current == null ? ownerUserId : safeText(current.getCreatedUser()));
        next.setUpdatedDate(nowIso);
        next.setUpdatedUser(ownerUserId);
        return next;
    }

    private Asset toDocument(AssetDto dto, String ownerUserId, Asset current) {
        String assetId = normalizeId(dto == null ? null : dto.id());
        String type = normalizeAssetType(dto == null ? null : dto.type());
        if (dto == null || !StringUtils.hasText(assetId) || !StringUtils.hasText(ownerUserId) || !StringUtils.hasText(type)) {
            return null;
        }

        String nowIso = Instant.now().toString();
        Asset next = current == null ? new Asset() : cloneAsset(current);
        next.setId(current == null ? new ObjectId().toHexString() : current.getId());
        next.setSyncKey(current != null && StringUtils.hasText(current.getSyncKey()) ? current.getSyncKey().trim() : UUID.randomUUID().toString());
        next.setAssetId(assetId);
        next.setOwnerUserId(ownerUserId);
        next.setType(type);
        next.setTitle(safeText(dto.title()));
        next.setSubtitle(safeText(dto.subtitle()));
        next.setCategory(safeText(dto.category()));
        next.setCity(safeText(dto.city()));
        next.setCapacityTotal(Math.max(1, normalizeCount(dto.capacityTotal())));
        next.setQuantity(normalizeAssetQuantity(type, dto.quantity(), dto.capacityTotal()));
        next.setDetails(current == null ? safeText(dto.description()) : safeText(current.getDetails()));
        next.setImageUrl(safeText(dto.imageUrl()));
        next.setSourceLink(current == null ? "" : safeText(current.getSourceLink()));
        next.setRoutes(current == null ? List.of() : normalizeStrings(current.getRoutes()));
        next.setPoliciesEnabled(current == null ? Boolean.TRUE.equals(dto.policiesEnabled()) : Boolean.TRUE.equals(current.getPoliciesEnabled()));
        next.setPolicies(current == null ? List.of() : new ArrayList<>(safePolicies(current.getPolicies())));
        next.setPricing(current == null ? null : clonePricing(current.getPricing()));
        next.setRequests(normalizeRequests(dto.requests()));
        String nextVisibility = normalizeVisibility(dto.visibility());
        if (!StringUtils.hasText(nextVisibility)) {
            nextVisibility = normalizeVisibility(current == null ? null : current.getVisibility());
        }
        next.setVisibility(StringUtils.hasText(nextVisibility) ? nextVisibility : "Public");
        if (current == null) {
            next.setStatus(STATUS_ACTIVE);
            next.setStatusBeforeSuppression(null);
            next.setTrashedAtIso(null);
        }
        next.setAffinity(resolveAssetAffinity(next, ownerUserId));
        next.setBoost(resolveAssetBoost(next, ownerUserId));
        next.setCreatedDate(current == null ? nowIso : normalizeDateTime(current.getCreatedDate(), nowIso));
        next.setCreatedUser(current == null ? ownerUserId : safeText(current.getCreatedUser()));
        next.setUpdatedDate(nowIso);
        next.setUpdatedUser(ownerUserId);
        return next;
    }

    private Asset cloneAsset(Asset source) {
        Asset clone = new Asset();
        clone.setId(source.getId());
        clone.setSyncKey(source.getSyncKey());
        clone.setAssetId(source.getAssetId());
        clone.setOwnerUserId(source.getOwnerUserId());
        clone.setType(source.getType());
        clone.setTitle(source.getTitle());
        clone.setSubtitle(source.getSubtitle());
        clone.setCategory(source.getCategory());
        clone.setCity(source.getCity());
        clone.setCapacityTotal(source.getCapacityTotal());
        clone.setQuantity(source.getQuantity());
        clone.setDetails(source.getDetails());
        clone.setImageUrl(source.getImageUrl());
        clone.setSourceLink(source.getSourceLink());
        clone.setRoutes(new ArrayList<>(normalizeStrings(source.getRoutes())));
        clone.setPoliciesEnabled(Boolean.TRUE.equals(source.getPoliciesEnabled()));
        clone.setPolicies(new ArrayList<>(safePolicies(source.getPolicies())));
        clone.setPricing(clonePricing(source.getPricing()));
        clone.setRequests(new ArrayList<>(deduplicateRequests(source.getRequests())));
        clone.setVisibility(source.getVisibility());
        clone.setStatus(source.getStatus());
        clone.setStatusBeforeSuppression(source.getStatusBeforeSuppression());
        clone.setOwnerReleasedAtIso(source.getOwnerReleasedAtIso());
        clone.setTrashedAtIso(source.getTrashedAtIso());
        clone.setAffinity(source.getAffinity());
        clone.setBoost(source.getBoost());
        clone.setCreatedDate(source.getCreatedDate());
        clone.setCreatedUser(source.getCreatedUser());
        clone.setUpdatedDate(source.getUpdatedDate());
        clone.setUpdatedUser(source.getUpdatedUser());
        return clone;
    }

    private AssetTicketDto toAssetTicketDto(EventParticipationTicketService.TicketSnapshotRecord snapshot) {
        ActivityEvent event = snapshot == null ? null : snapshot.event();
        EventTicket credential = snapshot == null ? null : snapshot.credential();
        if (event == null) {
            return null;
        }
        String sourceId = normalizeId(event.getSourceId());
        String holderUserId = normalizeId(event.getOwnerUserId());
        if (!StringUtils.hasText(sourceId) || !StringUtils.hasText(holderUserId)) {
            return null;
        }
        if (credential == null || !StringUtils.hasText(credential.getCode())) {
            return null;
        }
        boolean admin = Boolean.TRUE.equals(event.getIsAdmin());
        return new AssetTicketDto(
                sourceId,
                holderUserId,
                credential.getCode(),
                safeNullableText(credential.getUsedAtIso()),
                admin ? "hosting" : "events",
                safeText(event.getStatus()),
                safeText(event.getTitle()),
                safeText(event.getSubtitle()),
                safeText(event.getTimeframe()),
                safeNullableText(event.getStartAtIso()),
                Math.max(0, (int) Math.round(safeDouble(event.getDistanceKm()) * 1000d)),
                admin,
                safeNullableText(event.getStartAtIso()),
                safeNullableText(event.getEndAtIso()),
                safeText(event.getImageUrl()),
                safeText(event.getVisibility()),
                safeText(event.getCreatorInitials()),
                safeText(event.getCreatorInitials()),
                assetTicketRevision(event, credential));
    }

    private String assetTicketIdentity(AssetTicketDto ticket) {
        if (ticket == null) {
            return "";
        }
        return safeText(ticket.type()) + ":" + normalizeId(ticket.id());
    }

    private String assetTicketRevision(ActivityEvent event, EventTicket credential) {
        return String.join("\u001f",
                normalizeId(credential == null ? null : credential.getId()),
                safeText(credential == null ? null : credential.getCode()),
                safeText(credential == null ? null : credential.getStatus()),
                safeText(credential == null ? null : credential.getIssuedAtIso()),
                safeText(credential == null ? null : credential.getUsedAtIso()),
                safeText(event == null ? null : event.getStatus()),
                safeText(event == null ? null : event.getTitle()),
                safeText(event == null ? null : event.getSubtitle()),
                safeText(event == null ? null : event.getTimeframe()),
                safeText(event == null ? null : event.getStartAtIso()),
                safeText(event == null ? null : event.getEndAtIso()),
                safeText(event == null ? null : event.getImageUrl()),
                safeText(event == null ? null : event.getVisibility()));
    }

    private AssetTicketScanPayloadDto toTicketScanPayload(EventTicket ticket, ActivityEvent event) {
        String holderUserId = normalizeId(ticket == null ? null : ticket.getHolderUserId());
        String eventId = normalizeId(event == null ? null : event.getSourceId());
        if (!StringUtils.hasText(holderUserId) || !StringUtils.hasText(eventId)) {
            return null;
        }
        Users holder = usersRepository.findByUserId(holderUserId).orElse(null);
        String holderRole = resolveTicketHolderRole(eventId, holderUserId, event);
        return toCanonicalTicketScanPayload(ticket, event, holder, holderRole);
    }

    private AssetTicketScanPayloadDto toCanonicalTicketScanPayload(
            EventTicket ticket,
            ActivityEvent event,
            Users holder,
            String holderRole) {
        String holderUserId = normalizeId(ticket == null ? null : ticket.getHolderUserId());
        String eventId = normalizeId(event == null ? null : event.getSourceId());
        if (!StringUtils.hasText(holderUserId) || !StringUtils.hasText(eventId)) {
            return null;
        }
        String fallbackRole = holderUserId.equals(normalizeId(event.getCreatorUserId()))
                ? ROLE_ADMIN
                : "Member";
        return new AssetTicketScanPayloadDto(
                safeText(ticket.getCode()),
                holderUserId,
                firstNonBlank(holder == null ? null : holder.getName(), holderUserId),
                firstNonBlank(
                        holder == null ? null : holder.getInitials(),
                        initialsFromText(holder == null ? null : holder.getName())),
                firstUserImageUrl(holder),
                Math.max(0, holder == null || holder.getAge() == null ? 0 : holder.getAge()),
                safeText(holder == null ? null : holder.getCity()),
                firstNonBlank(holderRole, fallbackRole),
                eventId,
                safeText(event.getTitle()),
                safeText(event.getSubtitle()),
                safeText(event.getTimeframe()),
                firstNonBlank(event.getStartAtIso(), event.getTimeframe()),
                safeNullableText(ticket.getIssuedAtIso()),
                safeNullableText(ticket.getUsedAtIso()));
    }

    private String resolveTicketHolderRole(String eventId, String holderUserId, ActivityEvent event) {
        if (holderUserId.equals(normalizeId(event == null ? null : event.getCreatorUserId()))) {
            return ROLE_ADMIN;
        }
        return activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId(
                        OWNER_TYPE_EVENT,
                        eventId,
                        holderUserId)
                .filter(member -> MEMBER_STATUS_ACCEPTED.equals(safeText(member.getStatus())))
                .map(ActivityMember::getRole)
                .map(this::safeText)
                .filter(role -> ROLE_ADMIN.equals(role) || ROLE_MANAGER.equals(role))
                .orElse("Member");
    }

    private AssetTicketValidationDto invalidTicketValidation(String reason) {
        String normalizedReason = safeText(reason);
        return new AssetTicketValidationDto(
                false,
                StringUtils.hasText(normalizedReason) ? normalizedReason : "not_found",
                null);
    }

    private String normalizeMemberStatus(String status) {
        String normalized = safeText(status);
        if ("pending".equals(normalized)) {
            return "pending";
        }
        if ("deleted".equals(normalized)) {
            return "deleted";
        }
        return "accepted";
    }

    private List<Asset> queryOwnerAssets(String ownerUserId) {
        return assetsRepository.findByOwnerUserIdOrderByUpdatedDateDesc(ownerUserId);
    }

    private Map<String, AssetOwnerSummary> resolveOwnersByUserId(List<Asset> assets) {
        List<String> ownerUserIds = (assets == null ? List.<Asset>of() : assets).stream()
                .map(asset -> normalizeId(asset == null ? null : asset.getOwnerUserId()))
                .filter(StringUtils::hasText)
                .distinct()
                .toList();
        if (ownerUserIds.isEmpty()) {
            return Map.of();
        }

        Map<String, Users> usersById = usersRepository.findByUserIdIn(ownerUserIds).stream()
                .filter(Objects::nonNull)
                .collect(LinkedHashMap::new, (target, user) -> target.put(normalizeId(user.getUserId()), user), Map::putAll);

        Map<String, AssetOwnerSummary> ownersByUserId = new LinkedHashMap<>();
        for (String ownerUserId : ownerUserIds) {
            Users owner = usersById.get(ownerUserId);
            ownersByUserId.put(ownerUserId, owner == null
                    ? new AssetOwnerSummary(null, null)
                    : new AssetOwnerSummary(safeText(owner.getName()), firstUserImageUrl(owner)));
        }
        return ownersByUserId;
    }

    private List<Asset> queryVisibleExploreAssets(String userId, String type, String category) {
        String normalizedUserId = normalizeId(userId);
        String normalizedType = normalizeAssetType(type);
        String normalizedCategory = safeText(category);
        if (!StringUtils.hasText(normalizedUserId) || !StringUtils.hasText(normalizedType)) {
            return List.of();
        }

        Query query = new BasicQuery(visibleExploreMatchDocument(normalizedUserId, normalizedType, normalizedCategory));
        return mongoTemplate.find(query, Asset.class);
    }

    private AssetExploreMongoPage queryVisibleExploreAssetsPage(
            String userId,
            String type,
            String category,
            String startAtIso,
            String endAtIso,
            String order,
            int startIndex,
            int pageSize) {
        List<AggregationOperation> operations = new ArrayList<>();
        operations.add(context -> new Document("$match", visibleExploreMatchDocument(userId, type, category)));
        operations.add(context -> new Document("$addFields", new Document()
                .append("assetExploreAvailability", assetExploreAvailabilityExpression(startAtIso, endAtIso))
                .append("assetExplorePrice", assetExplorePriceExpression())
                .append("assetExplorePolicyCount", assetExplorePolicyCountExpression())));
        operations.add(context -> new Document("$match", new Document("assetExploreAvailability", new Document("$gt", 0))));
        operations.add(context -> new Document("$sort", assetExploreSortDocument(order)));
        operations.add(context -> new Document("$facet", new Document()
                .append("metadata", List.of(new Document("$count", "total")))
                .append("items", List.of(
                        new Document("$skip", Math.max(0, startIndex)),
                        new Document("$limit", Math.max(1, pageSize))))));

        Aggregation aggregation = Aggregation.newAggregation(operations);
        AggregationResults<Document> results = mongoTemplate.aggregate(aggregation, "assets", Document.class);
        Document result = results.getUniqueMappedResult();
        if (result == null) {
            return new AssetExploreMongoPage(List.of(), 0, null);
        }

        List<Document> metadata = documents(result.get("metadata"));
        int total = metadata.isEmpty() ? 0 : normalizeCount(metadata.get(0).get("total"));
        List<Asset> items = documents(result.get("items")).stream()
                .map(document -> mongoTemplate.getConverter().read(Asset.class, document))
                .filter(Objects::nonNull)
                .toList();
        int nextIndex = Math.max(0, startIndex) + items.size();
        return new AssetExploreMongoPage(items, total, nextIndex < total ? String.valueOf(nextIndex) : null);
    }

    private Document visibleExploreMatchDocument(String userId, String type, String category) {
        List<Document> and = new ArrayList<>();
        and.add(new Document("type", type));
        and.add(new Document("ownerUserId", new Document("$ne", userId)));
        and.add(new Document("status", new Document("$in", List.of(STATUS_ACTIVE, "active"))));
        if (StringUtils.hasText(category)) {
            and.add(new Document("category", category));
        }

        List<String> friendOwnerUserIds = visibleExploreFriendOwnerUserIds(userId);
        List<String> publicVisibilities = new ArrayList<>();
        publicVisibilities.add(null);
        publicVisibilities.add("");
        publicVisibilities.add("Public");
        List<Document> visibilityOr = new ArrayList<>();
        visibilityOr.add(new Document("visibility", new Document("$in", publicVisibilities)));
        if (!friendOwnerUserIds.isEmpty()) {
            visibilityOr.add(new Document("$and", List.of(
                    new Document("visibility", "Friends only"),
                    new Document("ownerUserId", new Document("$in", friendOwnerUserIds)))));
        }
        and.add(new Document("$or", visibilityOr));
        return new Document("$and", and);
    }

    private List<String> visibleExploreFriendOwnerUserIds(String userId) {
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(normalizedUserId)) {
            return List.of();
        }
        return usersRepository.findAll().stream()
                .map(user -> normalizeId(user == null ? null : user.getUserId()))
                .filter(StringUtils::hasText)
                .filter(ownerUserId -> isFriendOfActiveUser(ownerUserId, normalizedUserId))
                .toList();
    }

    @SuppressWarnings("unchecked")
    private List<Document> documents(Object value) {
        if (value instanceof List<?> list) {
            return list.stream()
                    .filter(Document.class::isInstance)
                    .map(Document.class::cast)
                    .toList();
        }
        return List.of();
    }

    private Comparator<Asset> visibleAssetComparator(double viewerAffinity) {
        return Comparator
                .comparingDouble((Asset asset) -> -assetExploreScore(asset, viewerAffinity))
                .thenComparing(asset -> safeText(asset.getTitle()))
                .thenComparing(asset -> normalizeId(asset.getAssetId()));
    }

    private String normalizeAssetExploreOrder(String order) {
        String normalized = safeText(order);
        return "lowest-price".equals(normalized) || "fewest-policies".equals(normalized)
                ? normalized
                : "availability";
    }

    private int parseAssetExploreCursor(String cursor) {
        String normalized = safeText(cursor);
        if (!StringUtils.hasText(normalized)) {
            return -1;
        }
        try {
            return Math.max(0, Integer.parseInt(normalized));
        } catch (NumberFormatException ex) {
            return -1;
        }
    }

    private Document assetExploreAvailabilityExpression(String startAtIso, String endAtIso) {
        Document quantity = numericExpression("$quantity", 0);
        Document capacityTotal = numericExpression("$capacityTotal", 0);
        Document totalQuantity = new Document("$cond", List.of(
                new Document("$ne", List.of(new Document("$type", "$quantity"), "missing")),
                quantity,
                new Document("$cond", List.of(
                        new Document("$eq", List.of("$type", AssetCatalog.TYPE_SUPPLIES)),
                        new Document("$max", List.of(1, capacityTotal)),
                        1))));
        Document overlappingQuantity = assetExploreOverlappingQuantityExpression(startAtIso, endAtIso);
        return new Document("$max", List.of(0, new Document("$subtract", List.of(totalQuantity, overlappingQuantity))));
    }

    private Document assetExploreOverlappingQuantityExpression(String startAtIso, String endAtIso) {
        if (!StringUtils.hasText(startAtIso) || !StringUtils.hasText(endAtIso)) {
            return new Document("$literal", 0);
        }
        Document requestFilter = new Document("$filter", new Document()
                .append("input", new Document("$ifNull", List.of("$requests", List.of())))
                .append("as", "request")
                .append("cond", new Document("$and", List.of(
                        new Document("$ne", List.of("$$request.status", STATUS_DELETED)),
                        new Document("$ne", List.of("$$request.status", "deleted")),
                        new Document("$or", List.of(
                                new Document("$eq", List.of("$$request.status", MEMBER_STATUS_ACCEPTED)),
                                new Document("$eq", List.of("$$request.requestKind", "manual")),
                                new Document("$and", List.of(
                                        new Document("$eq", List.of("$$request.status", "pending")),
                                        new Document("$eq", List.of("$$request.requestKind", "borrow")))))),
                        new Document("$ne", List.of("$$request.booking.inventoryApplied", true)),
                        new Document("$lt", List.of("$$request.booking.startAtIso", endAtIso)),
                        new Document("$lt", List.of(startAtIso, "$$request.booking.endAtIso"))))));
        Document requestQuantity = new Document("$max", List.of(1, numericExpression("$$request.booking.quantity", 1)));
        return new Document("$sum", new Document("$map", new Document()
                .append("input", requestFilter)
                .append("as", "request")
                .append("in", requestQuantity)));
    }

    private Document assetExplorePriceExpression() {
        return numericExpression("$pricing.basePrice", 0);
    }

    private Document assetExplorePolicyCountExpression() {
        return new Document("$cond", List.of(
                new Document("$eq", List.of("$policiesEnabled", true)),
                new Document("$size", new Document("$ifNull", List.of("$policies", List.of()))),
                0));
    }

    private Document assetExploreSortDocument(String order) {
        Document sort = new Document();
        if ("lowest-price".equals(order)) {
            sort.append("assetExplorePrice", 1);
            sort.append("assetExploreAvailability", -1);
        } else if ("fewest-policies".equals(order)) {
            sort.append("assetExplorePolicyCount", 1);
            sort.append("assetExploreAvailability", -1);
        } else {
            sort.append("assetExploreAvailability", -1);
            sort.append("assetExplorePrice", 1);
        }
        sort.append("title", 1);
        sort.append("ownerUserId", 1);
        sort.append("assetId", 1);
        return sort;
    }

    private Document numericExpression(String input, Number fallback) {
        return new Document("$convert", new Document()
                .append("input", input)
                .append("to", "double")
                .append("onError", fallback)
                .append("onNull", fallback));
    }

    private double assetExploreScore(Asset asset, double viewerAffinity) {
        double assetAffinity = safeDouble(asset == null ? null : asset.getAffinity());
        double boost = safeDouble(asset == null ? null : asset.getBoost());
        if (viewerAffinity > 0d && assetAffinity > 0d) {
            return boost - (Math.abs(viewerAffinity - assetAffinity) / 10_000d);
        }
        return boost + (assetAffinity / 10_000d);
    }

    private double resolveAssetAffinity(Asset asset, String ownerUserId) {
        String normalizedOwnerUserId = normalizeId(ownerUserId);
        if (!StringUtils.hasText(normalizedOwnerUserId)) {
            return 0d;
        }
        return usersRepository.findByUserId(normalizedOwnerUserId)
                .map(owner -> absoluteAffinityService.resolveAssetAffinity(asset, owner))
                .orElse(0d);
    }

    private double resolveAssetBoost(Asset asset, String ownerUserId) {
        String normalizedOwnerUserId = normalizeId(ownerUserId);
        if (!StringUtils.hasText(normalizedOwnerUserId)) {
            return 0d;
        }
        return usersRepository.findByUserId(normalizedOwnerUserId)
                .map(owner -> absoluteAffinityService.resolveAssetBoost(asset, owner))
                .orElse(0d);
    }

    private double resolveStoredUserAffinity(String userId) {
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(normalizedUserId)) {
            return 0d;
        }
        return usersRepository.findByUserId(normalizedUserId)
                .map(this::resolveStoredUserAffinity)
                .orElse(0d);
    }

    private double resolveStoredUserAffinity(Users user) {
        return user == null || user.getAffinity() == null || !Double.isFinite(user.getAffinity())
                ? 0d
                : Math.max(0d, user.getAffinity());
    }

    private AssetDto toAssetDto(Asset asset) {
        return toAssetDto(asset, Map.of(), null);
    }

    private Map<String, AssetRequestMetricsDto> resolveAssetRequestMetricsByAssetId(Collection<Asset> assets) {
        if (assets == null || assets.isEmpty()) {
            return Map.of();
        }
        Map<String, AssetRequestMetricsDto> metricsByAssetId = new LinkedHashMap<>();
        for (Asset asset : assets) {
            String assetId = normalizeId(asset == null ? null : asset.getAssetId());
            if (StringUtils.hasText(assetId)) {
                metricsByAssetId.put(assetId, toAssetRequestMetrics(asset.getRequests()));
            }
        }
        return metricsByAssetId;
    }

    private AssetRequestMetricsDto resolveAssetRequestMetrics(Asset asset) {
        String assetId = normalizeId(asset == null ? null : asset.getAssetId());
        if (!StringUtils.hasText(assetId)) {
            return emptyAssetRequestMetrics();
        }
        return resolveAssetRequestMetricsByAssetId(List.of(asset)).getOrDefault(assetId, emptyAssetRequestMetrics());
    }

    private AssetRequestMetricsDto toAssetRequestMetrics(Collection<AssetRequestRecord> requests) {
        int assignedItems = 0;
        int borrowedItems = 0;
        int pendingItems = 0;
        for (AssetRequestRecord request : requests == null ? List.<AssetRequestRecord>of() : requests) {
            if (!isLaterAssetRequest(request)) {
                continue;
            }
            if (isManualAssetRequest(request)) {
                assignedItems++;
            } else if (MEMBER_STATUS_ACCEPTED.equals(normalizeRequestStatus(request.status()))) {
                borrowedItems++;
            } else if ("pending".equals(normalizeRequestStatus(request.status()))) {
                pendingItems++;
            }
        }
        int activeItems = assignedItems + borrowedItems;
        return new AssetRequestMetricsDto(
                activeItems + pendingItems,
                activeItems,
                assignedItems,
                borrowedItems,
                pendingItems);
    }

    private boolean isLaterAssetRequest(AssetRequestRecord request) {
        long endAtMs = assetRequestEndAtMs(request);
        return endAtMs != Long.MIN_VALUE && endAtMs >= System.currentTimeMillis();
    }

    private long assetRequestEndAtMs(AssetRequestRecord request) {
        AssetRequestBookingRecord booking = request == null ? null : request.booking();
        long startAtMs = toSortableDate(firstNonBlank(
                booking == null ? null : booking.startAtIso(),
                request == null ? null : request.requestedAtIso()));
        if (startAtMs == Long.MIN_VALUE) {
            return Long.MIN_VALUE;
        }
        long endAtMs = toSortableDate(booking == null ? null : booking.endAtIso());
        return endAtMs > startAtMs ? endAtMs : startAtMs + 24L * 60L * 60L * 1000L;
    }

    private AssetRequestMetricsDto normalizeAssetRequestMetrics(AssetRequestMetricsDto metrics) {
        if (metrics == null) {
            return emptyAssetRequestMetrics();
        }
        int assignedItems = normalizeCount(metrics.assignedItems());
        int borrowedItems = normalizeCount(metrics.borrowedItems());
        int pendingItems = normalizeCount(metrics.pendingItems());
        int activeItems = normalizeCount(metrics.activeItems());
        int allItems = normalizeCount(metrics.allItems());
        return new AssetRequestMetricsDto(allItems, activeItems, assignedItems, borrowedItems, pendingItems);
    }

    private AssetRequestMetricsDto emptyAssetRequestMetrics() {
        return new AssetRequestMetricsDto(0, 0, 0, 0, 0);
    }

    private boolean isManualAssetRequest(AssetRequestRecord request) {
        return "manual".equals(normalizeAssetRequestKind(request == null ? null : request.requestKind()));
    }

    private AssetDto toAssetDto(Asset asset, Map<String, AssetOwnerSummary> ownersByUserId, String viewerUserId) {
        return toAssetDto(asset, ownersByUserId, viewerUserId, resolveAssetRequestMetrics(asset));
    }

    private AssetDto toAssetDto(
            Asset asset,
            Map<String, AssetOwnerSummary> ownersByUserId,
            String viewerUserId,
            AssetRequestMetricsDto metrics) {
        if (asset == null || !StringUtils.hasText(normalizeId(asset.getAssetId()))) {
            return null;
        }
        String type = normalizeAssetType(asset.getType());
        List<AssetPolicyRecord> policies = safePolicies(asset.getPolicies());
        boolean policiesEnabled = Boolean.TRUE.equals(asset.getPoliciesEnabled());
        return new AssetDto(
                normalizeId(asset.getAssetId()),
                type,
                safeText(asset.getTitle()),
                safeText(asset.getSubtitle()),
                safeText(asset.getCategory()),
                safeText(asset.getCity()),
                Math.max(1, normalizeCount(asset.getCapacityTotal())),
                normalizeAssetQuantity(type, asset.getQuantity(), asset.getCapacityTotal()),
                safeText(asset.getDetails()),
                safeText(asset.getImageUrl()),
                safeText(asset.getSourceLink()),
                assetLocationLabel(asset, type),
                assetPriceLabel(asset),
                policiesEnabled,
                policiesEnabled ? policies.size() : 0,
                normalizeVisibility(asset.getVisibility()),
                safeText(asset.getStatus()),
                normalizeId(asset.getOwnerUserId()),
                resolveOwnerName(asset.getOwnerUserId(), ownersByUserId),
                toAssetRequestDtos(asset, viewerUserId),
                normalizeAssetRequestMetrics(metrics),
                resolveAssetMenuActions(asset, viewerUserId),
                safeText(asset.getOwnerReleasedAtIso()),
                resolveOwnerAvatarUrl(asset.getOwnerUserId(), ownersByUserId));
    }

    private AssetDetailDto toAssetDetailDto(Asset asset, Map<String, AssetOwnerSummary> ownersByUserId, String viewerUserId) {
        return toAssetDetailDto(asset, ownersByUserId, viewerUserId, resolveAssetRequestMetrics(asset));
    }

    private AssetDetailDto toAssetDetailDto(
            Asset asset,
            Map<String, AssetOwnerSummary> ownersByUserId,
            String viewerUserId,
            AssetRequestMetricsDto metrics) {
        return toAssetDetailDto(asset, ownersByUserId, viewerUserId, metrics, null);
    }

    private AssetDetailDto toAssetDetailDto(
            Asset asset,
            Map<String, AssetOwnerSummary> ownersByUserId,
            String viewerUserId,
            AssetRequestMetricsDto metrics,
            AssetBorrowWindowDto borrowWindow) {
        if (asset == null || !StringUtils.hasText(normalizeId(asset.getAssetId()))) {
            return null;
        }
        String type = normalizeAssetType(asset.getType());
        return new AssetDetailDto(
                normalizeId(asset.getAssetId()),
                type,
                safeText(asset.getTitle()),
                safeText(asset.getSubtitle()),
                safeText(asset.getCategory()),
                safeText(asset.getCity()),
                Math.max(1, normalizeCount(asset.getCapacityTotal())),
                normalizeAssetQuantity(type, asset.getQuantity(), asset.getCapacityTotal()),
                safeText(asset.getDetails()),
                safeText(asset.getImageUrl()),
                safeText(asset.getSourceLink()),
                normalizeStrings(asset.getRoutes()),
                Boolean.TRUE.equals(asset.getPoliciesEnabled()),
                safePolicies(asset.getPolicies()).stream()
                        .map(policy -> new PolicyItemDto(
                                normalizeId(policy.id()),
                                safeText(policy.title()),
                                safeText(policy.description()),
                                policy.required() != null ? policy.required() : Boolean.TRUE))
                        .toList(),
                clonePricing(asset.getPricing()),
                normalizeVisibility(asset.getVisibility()),
                safeText(asset.getStatus()),
                normalizeId(asset.getOwnerUserId()),
                resolveOwnerName(asset.getOwnerUserId(), ownersByUserId),
                toAssetRequestDtos(asset, viewerUserId),
                normalizeAssetRequestMetrics(metrics),
                resolveAssetMenuActions(asset, viewerUserId),
                safeText(asset.getOwnerReleasedAtIso()),
                borrowWindow,
                resolveOwnerAvatarUrl(asset.getOwnerUserId(), ownersByUserId));
    }

    private String assetLocationLabel(Asset asset, String type) {
        if (!AssetCatalog.TYPE_ACCOMMODATION.equals(type)) {
            return safeText(asset == null ? null : asset.getCity());
        }
        return normalizeStrings(asset == null ? null : asset.getRoutes()).stream()
                .filter(StringUtils::hasText)
                .findFirst()
                .orElse(safeText(asset == null ? null : asset.getCity()));
    }

    private String assetPriceLabel(Asset asset) {
        PricingConfigDto pricing = asset == null ? null : asset.getPricing();
        if (pricing == null || !Boolean.TRUE.equals(pricing.enabled())) {
            return null;
        }
        double amount = pricing.basePrice() == null || !Double.isFinite(pricing.basePrice())
                ? 0d
                : Math.max(0d, pricing.basePrice());
        if (amount <= 0d) {
            return "Free borrow";
        }
        String currency = StringUtils.hasText(pricing.currency()) ? pricing.currency().trim() : "USD";
        try {
            java.text.NumberFormat format = java.text.NumberFormat.getCurrencyInstance(Locale.US);
            format.setCurrency(java.util.Currency.getInstance(currency));
            format.setMaximumFractionDigits(0);
            return format.format(amount);
        } catch (RuntimeException ex) {
            return currency + " " + String.format(Locale.US, "%.0f", amount);
        }
    }

    private AssetRequestRecord toAssetRequest(ActivityMember member, AssetRequestRecord existing) {
        if (member == null || !StringUtils.hasText(normalizeId(member.getUserId()))) {
            return null;
        }
        Users user = usersRepository.findByUserId(normalizeId(member.getUserId())).orElse(null);
        String status = "pending".equals(safeText(member.getStatus())) ? "pending" : "accepted";
        String note = "pending".equals(status)
                ? "Awaiting owner confirmation."
                : "Approved and synced with the plan.";
        return new AssetRequestRecord(
                existing != null && StringUtils.hasText(existing.id()) ? existing.id().trim() : UUID.randomUUID().toString(),
                normalizeId(member.getUserId()),
                user == null ? normalizeId(member.getUserId()) : safeText(user.getName()),
                user == null ? initialsFromText(normalizeId(member.getUserId())) : safeText(user.getInitials()),
                user == null ? "man" : normalizeGender(user.getGender()),
                status,
                note,
                existing != null
                        ? normalizeAssetRequestKind(existing.requestKind())
                        : assetRequestKindForMember(member.getRequestKind()),
                existing != null
                        ? safeNullableText(existing.requestedAtIso())
                        : safeNullableText(normalizeDateTime(member.getActionAtIso(), Instant.now().toString())),
                existing != null ? cloneRequestBooking(existing.booking()) : null);
    }

    private List<AssetMemberRequestDto> toAssetRequestDtos(Asset asset, String viewerUserId) {
        List<AssetMemberRequestDto> next = new ArrayList<>();
        List<AssetRequestRecord> requests = deduplicateRequests(asset.getRequests()).stream()
                .filter(request -> !isDeletedAssetRequest(request))
                .toList();
        Set<String> managerUserIds = acceptedAssetManagerUserIds(asset);
        for (int index = 0; index < requests.size(); index += 1) {
            AssetMemberRequestDto dto = toAssetRequestDto(
                    asset,
                    requests.get(index),
                    index,
                    resolveAssetRequestMenuActions(asset, requests.get(index), viewerUserId, managerUserIds));
            if (dto != null) {
                next.add(dto);
            }
        }
        return next;
    }

    private List<AssetRequestRecord> deduplicateRequests(List<AssetRequestRecord> requests) {
        Map<String, AssetRequestRecord> byScope = new LinkedHashMap<>();
        Map<String, AssetRequestRecord> deletedById = new LinkedHashMap<>();
        for (AssetRequestRecord request : safeRequests(requests)) {
            if (request == null) {
                continue;
            }
            if (isDeletedAssetRequest(request)) {
                String requestId = normalizeId(request.id());
                if (StringUtils.hasText(requestId)) {
                    deletedById.put(requestId, request);
                }
                continue;
            }
            String scopeKey = requestScopeKey(request);
            AssetRequestRecord existing = byScope.get(scopeKey);
            if (existing == null
                    || !MEMBER_STATUS_ACCEPTED.equals(normalizeRequestStatus(existing.status()))
                    || MEMBER_STATUS_ACCEPTED.equals(normalizeRequestStatus(request.status()))) {
                byScope.put(scopeKey, request);
            }
        }
        List<AssetRequestRecord> result = new ArrayList<>(deletedById.values());
        result.addAll(byScope.values());
        return result;
    }

    private List<AssetRequestRecord> preserveRequestAudits(
            List<AssetRequestRecord> existing,
            List<AssetRequestRecord> proposed) {
        List<AssetRequestRecord> merged = new ArrayList<>(safeRequests(proposed));
        Set<String> proposedIds = merged.stream()
                .filter(Objects::nonNull)
                .map(AssetRequestRecord::id)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .collect(LinkedHashSet::new, Set::add, Set::addAll);
        safeRequests(existing).stream()
                .filter(Objects::nonNull)
                .filter(request -> !proposedIds.contains(normalizeId(request.id())))
                .map(request -> isDeletedAssetRequest(request)
                        ? request
                        : withAssetRequestStatus(request, STATUS_DELETED))
                .forEach(merged::add);
        return deduplicateRequests(merged);
    }

    public void statusDeleteAssignmentScopeRequests(
            String assetOwnerUserId,
            Collection<String> assetIds,
            String ownerId,
            String authorizationEventId,
            String subEventId,
            String actorUserId,
            String deletedAtIso) {
        String normalizedAssetOwnerUserId = normalizeId(assetOwnerUserId);
        String normalizedOwnerId = normalizeId(ownerId);
        String normalizedAuthorizationEventId = normalizeId(authorizationEventId);
        String normalizedSubEventId = normalizeId(subEventId);
        if (!StringUtils.hasText(normalizedAssetOwnerUserId)
                || !StringUtils.hasText(normalizedOwnerId)
                || !StringUtils.hasText(normalizedSubEventId)) {
            return;
        }
        String nowIso = normalizeDateTime(deletedAtIso, Instant.now().toString());
        for (String rawAssetId : assetIds == null ? List.<String>of() : assetIds) {
            String assetId = normalizeId(rawAssetId);
            if (!StringUtils.hasText(assetId)) {
                continue;
            }
            Asset current = findAssetByAssetId(assetId).orElse(null);
            if (current == null) {
                continue;
            }
            boolean changed = false;
            List<AssetRequestRecord> nextRequests = new ArrayList<>();
            for (AssetRequestRecord request : safeRequests(current.getRequests())) {
                if (!isDeletedAssetRequest(request)
                        && isAssignmentScopeRequest(
                                request,
                                normalizedOwnerId,
                                normalizedAuthorizationEventId,
                                normalizedSubEventId)) {
                    nextRequests.add(withAssetRequestStatus(request, STATUS_DELETED));
                    changed = true;
                } else if (request != null) {
                    nextRequests.add(request);
                }
            }
            if (!changed) {
                continue;
            }
            Asset next = cloneAsset(current);
            next.setRequests(nextRequests);
            next.setUpdatedDate(nowIso);
            next.setUpdatedUser(firstNonBlank(normalizeId(actorUserId), normalizedAssetOwnerUserId));
            assetsRepository.save(next);
            syncAssetRequestProjection(current, next);
            affinityRecomputeTaskService.enqueueAssetRequestsChanged(assetId, next.getUpdatedUser());
            userActivityCountersService.refreshAssetCountersForUser(normalizeId(current.getOwnerUserId()));
        }
    }

    public Set<String> statusDeleteEventAssignmentRequestsForUsers(
            Collection<String> assetIds,
            Collection<String> userIds,
            String eventId,
            String actorUserId,
            String deletedAtIso) {
        Set<String> normalizedUserIds = (userIds == null ? List.<String>of() : userIds).stream()
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .collect(LinkedHashSet::new, Set::add, Set::addAll);
        String normalizedEventId = normalizeId(eventId);
        if (normalizedUserIds.isEmpty() || !StringUtils.hasText(normalizedEventId)) {
            return Set.of();
        }

        String nowIso = normalizeDateTime(deletedAtIso, Instant.now().toString());
        Set<String> changedAssetIds = new LinkedHashSet<>();
        for (String rawAssetId : assetIds == null ? List.<String>of() : assetIds) {
            String assetId = normalizeId(rawAssetId);
            if (!StringUtils.hasText(assetId)) {
                continue;
            }
            Asset current = findAssetByAssetId(assetId).orElse(null);
            if (current == null) {
                continue;
            }

            boolean changed = false;
            List<AssetRequestRecord> nextRequests = new ArrayList<>();
            for (AssetRequestRecord request : safeRequests(current.getRequests())) {
                if (!isDeletedAssetRequest(request)
                        && normalizedUserIds.contains(normalizeId(request == null ? null : request.userId()))
                        && requestBelongsToEvent(request, normalizedEventId)) {
                    nextRequests.add(withAssetRequestStatus(request, STATUS_DELETED));
                    changed = true;
                } else if (request != null) {
                    nextRequests.add(request);
                }
            }
            if (!changed) {
                continue;
            }

            Asset next = cloneAsset(current);
            next.setRequests(nextRequests);
            next.setUpdatedDate(nowIso);
            next.setUpdatedUser(firstNonBlank(normalizeId(actorUserId), normalizeId(current.getOwnerUserId())));
            assetsRepository.save(next);
            syncAssetRequestProjection(current, next);
            affinityRecomputeTaskService.enqueueAssetRequestsChanged(assetId, next.getUpdatedUser());
            userActivityCountersService.refreshAssetCountersForUser(normalizeId(next.getOwnerUserId()));
            changedAssetIds.add(assetId);
        }
        return Set.copyOf(changedAssetIds);
    }

    private boolean requestBelongsToEvent(AssetRequestRecord request, String eventId) {
        AssetRequestBookingRecord booking = request == null ? null : request.booking();
        if (booking == null) {
            return false;
        }
        return Objects.equals(
                normalizeId(eventId),
                authorizationEventId(booking.eventId(), booking.subEventId()));
    }

    private boolean isAssignmentScopeRequest(
            AssetRequestRecord request,
            String ownerId,
            String authorizationEventId,
            String subEventId) {
        AssetRequestBookingRecord booking = request == null ? null : request.booking();
        String bookingOwnerId = normalizeId(booking == null ? null : booking.eventId());
        return Objects.equals(subEventId, normalizeId(booking == null ? null : booking.subEventId()))
                && (Objects.equals(ownerId, bookingOwnerId)
                        || (StringUtils.hasText(authorizationEventId)
                                && Objects.equals(authorizationEventId, bookingOwnerId)));
    }

    private AssetRequestRecord withAssetRequestStatus(AssetRequestRecord request, String status) {
        return new AssetRequestRecord(
                request.id(),
                request.userId(),
                request.name(),
                request.initials(),
                request.gender(),
                status,
                request.note(),
                request.requestKind(),
                request.requestedAtIso(),
                cloneRequestBooking(request.booking()));
    }

    private AssetRequestRecord withAssetRequestTakeOverAmount(
            AssetRequestRecord request,
            AssetRequestRecord departedManagerRequest) {
        AssetRequestBookingRecord booking = cloneRequestBooking(request == null ? null : request.booking());
        AssetRequestBookingRecord departedBooking = departedManagerRequest == null
                ? null
                : departedManagerRequest.booking();
        if (request == null || booking == null || departedBooking == null) {
            return request;
        }
        AssetRequestBookingRecord updatedBooking = new AssetRequestBookingRecord(
                booking.eventId(),
                booking.eventTitle(),
                booking.subEventId(),
                booking.subEventTitle(),
                booking.slotKey(),
                booking.slotLabel(),
                booking.timeframe(),
                booking.startAtIso(),
                booking.endAtIso(),
                booking.quantity(),
                booking.totalAmount(),
                departedBooking.totalAmount() == null || !Double.isFinite(departedBooking.totalAmount())
                        ? 0d
                        : Math.max(0d, departedBooking.totalAmount()),
                StringUtils.hasText(departedBooking.currency())
                        ? departedBooking.currency()
                        : booking.currency(),
                booking.acceptedPolicyIds(),
                booking.paymentSessionId(),
                booking.inventoryApplied());
        return new AssetRequestRecord(
                request.id(),
                request.userId(),
                request.name(),
                request.initials(),
                request.gender(),
                request.status(),
                request.note(),
                request.requestKind(),
                request.requestedAtIso(),
                updatedBooking);
    }

    private AssetRequestRecord withAssetRequestReplacementPayment(
            AssetRequestRecord request,
            String paymentSessionId,
            List<String> acceptedPolicyIds) {
        AssetRequestBookingRecord booking = cloneRequestBooking(request == null ? null : request.booking());
        if (request == null || booking == null) {
            return request;
        }
        Double replacementTotal = booking.previousTotalAmount() == null || !Double.isFinite(booking.previousTotalAmount())
                ? booking.totalAmount()
                : Math.max(0d, booking.previousTotalAmount());
        AssetRequestBookingRecord updatedBooking = new AssetRequestBookingRecord(
                booking.eventId(),
                booking.eventTitle(),
                booking.subEventId(),
                booking.subEventTitle(),
                booking.slotKey(),
                booking.slotLabel(),
                booking.timeframe(),
                booking.startAtIso(),
                booking.endAtIso(),
                booking.quantity(),
                replacementTotal,
                null,
                booking.currency(),
                normalizeStrings(acceptedPolicyIds),
                normalizeId(paymentSessionId),
                booking.inventoryApplied());
        return new AssetRequestRecord(
                request.id(),
                request.userId(),
                request.name(),
                request.initials(),
                request.gender(),
                request.status(),
                request.note(),
                request.requestKind(),
                request.requestedAtIso(),
                updatedBooking);
    }

    private boolean hasAcceptedRequiredPolicies(Asset asset, List<String> acceptedPolicyIds) {
        if (asset == null || !Boolean.TRUE.equals(asset.getPoliciesEnabled())) {
            return true;
        }
        Set<String> accepted = new LinkedHashSet<>(normalizeStrings(acceptedPolicyIds));
        return safePolicies(asset.getPolicies()).stream()
                .filter(Objects::nonNull)
                .filter(policy -> policy.required() == null || Boolean.TRUE.equals(policy.required()))
                .allMatch(policy -> StringUtils.hasText(normalizeId(policy.id()))
                        && accepted.contains(normalizeId(policy.id())));
    }

    private boolean isDeletedAssetRequest(AssetRequestRecord request) {
        String status = safeText(request == null ? null : request.status());
        return STATUS_DELETED.equalsIgnoreCase(status) || "deleted".equalsIgnoreCase(status);
    }

    private String requestScopeKey(AssetRequestRecord request) {
        String requestId = normalizeId(request == null ? null : request.id());
        if (StringUtils.hasText(requestId)) {
            return "id:" + requestId;
        }
        String userId = normalizeId(request == null ? null : request.userId());
        String requestKind = normalizeAssetRequestKind(request == null ? null : request.requestKind());
        String eventId = normalizeId(request == null || request.booking() == null ? null : request.booking().eventId());
        String subEventId = normalizeId(request == null || request.booking() == null ? null : request.booking().subEventId());
        String slotKey = normalizeId(request == null || request.booking() == null ? null : request.booking().slotKey());
        if (StringUtils.hasText(userId) && StringUtils.hasText(eventId) && StringUtils.hasText(subEventId)) {
            return requestKind + ":" + userId + ":" + eventId + ":" + subEventId + ":" + slotKey;
        }
        return "request:" + byScopeFallback(request);
    }

    private String byScopeFallback(AssetRequestRecord request) {
        return normalizeId(request == null ? null : request.userId())
                + ":" + safeText(request == null ? null : request.requestedAtIso());
    }

    private AssetMemberRequestDto toAssetRequestDto(
            Asset asset,
            AssetRequestRecord request,
            int index,
            List<String> menuActions) {
        if (request == null) {
            return null;
        }
        AssetRequestBookingDto booking = toRequestBookingDto(request.booking());
        String requestedAtIso = safeNullableText(request.requestedAtIso());
        return new AssetMemberRequestDto(
                normalizeId(request.id()),
                normalizeId(request.userId()),
                safeText(request.name()),
                safeText(request.initials()),
                normalizeGender(request.gender()),
                normalizeRequestStatus(request.status()),
                safeText(request.note()),
                normalizeAssetRequestKind(request.requestKind()),
                requestedAtIso,
                booking,
                menuActions == null ? List.of() : menuActions);
    }

    private List<String> resolveAssetRequestMenuActions(
            Asset asset,
            AssetRequestRecord request,
            String viewerUserId,
            Set<String> managerUserIds) {
        String normalizedViewerUserId = normalizeId(viewerUserId);
        String targetUserId = normalizeId(request == null ? null : request.userId());
        if (asset == null
                || request == null
                || !StringUtils.hasText(normalizedViewerUserId)
                || !StringUtils.hasText(targetUserId)
                || targetUserId.equals(normalizeId(asset.getOwnerUserId()))
                || !MEMBER_STATUS_ACCEPTED.equals(normalizeRequestStatus(request.status()))
                || !canManageAssetMembers(asset, normalizedViewerUserId)
                || !isActiveUser(targetUserId)
                || (managerUserIds != null && managerUserIds.contains(targetUserId))) {
            return List.of();
        }
        return List.of("makeManager");
    }

    private boolean shouldIncludeExploreAsset(Asset asset, String activeUserId) {
        if (asset == null) {
            return false;
        }
        String status = safeText(asset.getStatus());
        if (!STATUS_ACTIVE.equals(status) && !"active".equals(status)) {
            return false;
        }
        String visibility = normalizeVisibility(asset.getVisibility());
        if ("Invitation only".equals(visibility)) {
            return false;
        }
        return !"Friends only".equals(visibility) || isFriendOfActiveUser(normalizeId(asset.getOwnerUserId()), activeUserId);
    }

    private boolean canViewAssetDetail(Asset asset, String viewerUserId) {
        return asset != null
                && StringUtils.hasText(viewerUserId)
                && (viewerUserId.equals(normalizeId(asset.getOwnerUserId()))
                        || shouldIncludeExploreAsset(asset, viewerUserId));
    }

    private List<String> resolveAssetMenuActions(Asset asset, String viewerUserId) {
        String normalizedViewerUserId = normalizeId(viewerUserId);
        if (asset == null || !StringUtils.hasText(normalizedViewerUserId)) {
            return List.of();
        }
        boolean sameOwner = normalizedViewerUserId.equals(normalizeId(asset.getOwnerUserId()));
        boolean owner = sameOwner && !isOwnerResponsibilityReleased(asset);
        boolean manager = owner || hasAcceptedAssetManagerRole(asset, normalizedViewerUserId);
        String status = safeText(asset.getStatus());
        if (STATUS_TRASHED.equals(status)) {
            return owner ? List.of("restore") : List.of();
        }
        boolean takeOverCandidate = STATUS_UNDER_REVIEW.equals(status)
                && isEligibleAssetTakeOverCandidate(asset, normalizedViewerUserId);
        if (!manager && !takeOverCandidate) {
            return List.of("share");
        }
        LinkedHashSet<String> actions = new LinkedHashSet<>();
        if (takeOverCandidate) {
            actions.add("takeOver");
        }
        actions.add("share");
        if (owner && !isSuppressedLifecycleStatus(status)) {
            actions.add("edit");
            actions.add("delete");
        }
        return new ArrayList<>(actions);
    }

    private boolean isSuppressedLifecycleStatus(String status) {
        String normalized = normalizeLifecycleStatusCode(status);
        return STATUS_UNDER_REVIEW.equals(normalized)
                || STATUS_BLOCKED.equals(normalized)
                || STATUS_DELETED.equals(normalized)
                || STATUS_INACTIVE.equals(normalized)
                || STATUS_TRASHED.equals(normalized);
    }

    private boolean isReferencedResourceVisibleStatus(String status) {
        String normalized = normalizeLifecycleStatusCode(status);
        return !STATUS_BLOCKED.equals(normalized)
                && !STATUS_DELETED.equals(normalized)
                && !STATUS_INACTIVE.equals(normalized)
                && !STATUS_TRASHED.equals(normalized);
    }

    private String normalizeLifecycleStatusCode(String status) {
        String normalized = safeText(status);
        return switch (normalized.toLowerCase(Locale.ROOT)) {
            case "active" -> STATUS_ACTIVE;
            case "under-review", "under review" -> STATUS_UNDER_REVIEW;
            case "blocked" -> STATUS_BLOCKED;
            case "deleted" -> STATUS_DELETED;
            case "inactive" -> STATUS_INACTIVE;
            case "trashed", "trash" -> STATUS_TRASHED;
            default -> normalized;
        };
    }

    private boolean isEligibleAssetManager(Asset asset, String userId) {
        String normalizedUserId = normalizeId(userId);
        if (asset == null || !StringUtils.hasText(normalizedUserId) || !isActiveUser(normalizedUserId)) {
            return false;
        }
        if (normalizedUserId.equals(normalizeId(asset.getOwnerUserId()))) {
            if (isOwnerResponsibilityReleased(asset)) {
                return false;
            }
            return true;
        }
        return hasAcceptedAssetManagerRole(asset, normalizedUserId);
    }

    private boolean isEligibleAssetTakeOverCandidate(Asset asset, String userId) {
        String normalizedUserId = normalizeId(userId);
        if (asset == null
                || !STATUS_UNDER_REVIEW.equals(safeText(asset.getStatus()))
                || !isOwnerResponsibilityReleased(asset)
                || !StringUtils.hasText(normalizedUserId)
                || !isActiveUser(normalizedUserId)) {
            return false;
        }
        String releasedOwnerUserId = normalizeId(asset.getOwnerUserId());
        List<String> activeManagerUserIds = activeResponsibleAssetUserIds(asset).stream()
                .filter(candidateUserId -> !candidateUserId.equals(releasedOwnerUserId))
                .toList();
        if (!activeManagerUserIds.isEmpty()) {
            return activeManagerUserIds.contains(normalizedUserId);
        }
        return activeAcceptedAssetMemberUserIds(asset).stream()
                .filter(candidateUserId -> !candidateUserId.equals(releasedOwnerUserId))
                .anyMatch(normalizedUserId::equals);
    }

    private boolean canManageAssetMembers(Asset asset, String userId) {
        String normalizedUserId = normalizeId(userId);
        if (asset == null
                || !StringUtils.hasText(normalizedUserId)
                || !isActiveUser(normalizedUserId)
                || STATUS_TRASHED.equals(safeText(asset.getStatus()))) {
            return false;
        }
        if (normalizedUserId.equals(normalizeId(asset.getOwnerUserId()))) {
            return !isOwnerResponsibilityReleased(asset);
        }
        return hasAcceptedAssetManagerRole(asset, normalizedUserId);
    }

    private boolean isOwnerResponsibilityReleased(Asset asset) {
        return asset != null && StringUtils.hasText(safeText(asset.getOwnerReleasedAtIso()));
    }

    private boolean hasAcceptedAssetManagerRole(Asset asset, String userId) {
        String normalizedUserId = normalizeId(userId);
        if (asset == null || !StringUtils.hasText(normalizedUserId)) {
            return false;
        }
        if (normalizedUserId.equals(normalizeId(asset.getOwnerUserId()))
                && isOwnerResponsibilityReleased(asset)) {
            return false;
        }
        return activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId(
                        OWNER_TYPE_ASSET,
                        normalizeId(asset.getAssetId()),
                        normalizedUserId)
                .filter(member -> MEMBER_STATUS_ACCEPTED.equals(safeText(member.getStatus())))
                .filter(member -> isManagerRole(member.getRole()))
                .isPresent();
    }

    private boolean isKnownAssetParticipant(Asset asset, String userId, ActivityMember member) {
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(normalizedUserId)) {
            return false;
        }
        if (member != null
                && normalizedUserId.equals(normalizeId(member.getUserId()))
                && !"deleted".equals(normalizeMemberStatus(member.getStatus()))) {
            return true;
        }
        return safeRequests(asset == null ? null : asset.getRequests()).stream()
                .filter(Objects::nonNull)
                .filter(request -> !isDeletedAssetRequest(request))
                .anyMatch(request -> normalizedUserId.equals(normalizeId(request.userId())));
    }

    private boolean isAcceptedAssetManagerMember(ActivityMember member) {
        return member != null
                && MEMBER_STATUS_ACCEPTED.equals(safeText(member.getStatus()))
                && isManagerRole(member.getRole());
    }

    private Set<String> acceptedAssetManagerUserIds(Asset asset) {
        String assetId = normalizeId(asset == null ? null : asset.getAssetId());
        if (!StringUtils.hasText(assetId)) {
            return Set.of();
        }
        List<ActivityMember> assetMembers = activityMembersRepository.findByOwnerTypeAndOwnerId(OWNER_TYPE_ASSET, assetId);
        LinkedHashSet<String> userIds = new LinkedHashSet<>();
        String ownerUserId = normalizeId(asset.getOwnerUserId());
        for (ActivityMember member : assetMembers == null ? List.<ActivityMember>of() : assetMembers) {
            if (member == null
                    || !MEMBER_STATUS_ACCEPTED.equals(safeText(member.getStatus()))
                    || !isManagerRole(member.getRole())) {
                continue;
            }
            String userId = normalizeId(member.getUserId());
            if (StringUtils.hasText(userId)
                    && !(isOwnerResponsibilityReleased(asset) && userId.equals(ownerUserId))) {
                userIds.add(userId);
            }
        }
        return userIds;
    }

    private List<AssetRequestRecord> promotedAssetRequests(Asset current, ActivityMember member) {
        String targetUserId = normalizeId(member == null ? null : member.getUserId());
        if (!StringUtils.hasText(targetUserId)) {
            return safeRequests(current == null ? null : current.getRequests());
        }
        List<AssetRequestRecord> nextRequests = new ArrayList<>();
        boolean promotedExistingRequest = false;
        for (AssetRequestRecord request : safeRequests(current == null ? null : current.getRequests())) {
            if (isDeletedAssetRequest(request)) {
                nextRequests.add(request);
                continue;
            }
            if (targetUserId.equals(normalizeId(request == null ? null : request.userId()))) {
                nextRequests.add(promotedAssetRequest(current, request, member));
                promotedExistingRequest = true;
            } else if (request != null) {
                nextRequests.add(request);
            }
        }
        if (!promotedExistingRequest) {
            nextRequests.add(promotedAssetRequest(current, null, member));
        }
        return nextRequests;
    }

    private AssetRequestRecord promotedAssetRequest(Asset asset, AssetRequestRecord existing, ActivityMember member) {
        AssetRequestRecord base = toAssetRequest(member, existing);
        if (base == null) {
            return existing;
        }
        return new AssetRequestRecord(
                base.id(),
                base.userId(),
                base.name(),
                base.initials(),
                base.gender(),
                MEMBER_STATUS_ACCEPTED,
                "Promoted to asset manager.",
                normalizeAssetRequestKind(base.requestKind()),
                safeNullableText(base.requestedAtIso()),
                existing != null ? cloneRequestBooking(existing.booking()) : base.booking());
    }

    private Asset toTrashedAsset(Asset current, String actorUserId, String nowIso) {
        Asset next = cloneAsset(current);
        next.setStatus(STATUS_TRASHED);
        next.setStatusBeforeSuppression(null);
        next.setTrashedAtIso(nowIso);
        next.setUpdatedDate(nowIso);
        next.setUpdatedUser(actorUserId);
        return next;
    }

    private void handleAssetTrashed(Asset trashed, String actorUserId) {
        String assetId = normalizeId(trashed == null ? null : trashed.getAssetId());
        String normalizedActorUserId = normalizeId(actorUserId);
        if (!StringUtils.hasText(assetId)) {
            return;
        }
        affinityRecomputeTaskService.enqueueAssetChanged(assetId, normalizedActorUserId);
        adminTelemetryService.record("asset.trashed", "assets", assetId, normalizedActorUserId);
        markAssetAttachmentUnavailable(assetId, "trashed");
        enqueueAssetUnavailableNotification(trashed, normalizedActorUserId);
    }

    private void markAssetAttachmentUnavailable(String assetId, String reason) {
        if (chatAttachmentLifecycleService != null) {
            chatAttachmentLifecycleService.markAssetUnavailable(assetId, reason);
        }
    }

    private void markAssetAttachmentAvailable(String assetId) {
        if (chatAttachmentLifecycleService != null) {
            chatAttachmentLifecycleService.markAssetAvailable(assetId);
        }
    }

    private void enqueueAssetUnavailableNotification(Asset asset, String actorUserId) {
        String assetId = normalizeId(asset == null ? null : asset.getAssetId());
        String normalizedActorUserId = normalizeId(actorUserId);
        if (!StringUtils.hasText(assetId)) {
            return;
        }
        LinkedHashSet<String> recipients = new LinkedHashSet<>(assetRequesterUserIds(asset));
        recipients.addAll(activeResponsibleAssetUserIds(asset));
        if (StringUtils.hasText(normalizedActorUserId)) {
            recipients.remove(normalizedActorUserId);
        }
        if (recipients.isEmpty()) {
            return;
        }
        notificationOutboxService.enqueue(new NotificationIntent(
                "asset-unavailable",
                "asset",
                assetId,
                "asset-affected-users",
                new ArrayList<>(recipients),
                "Asset unavailable",
                assetTitle(asset) + " is no longer available.",
                "/game",
                firstNonBlank(asset == null ? null : asset.getImageUrl(), "/assets/logo/heart.webp"),
                "/assets/logo/heart.webp",
                "asset-unavailable-" + assetId,
                Map.of(
                        "assetId", assetId,
                        "assetTitle", assetTitle(asset),
                        "assetStatus", STATUS_TRASHED,
                        "previousStatus", STATUS_ACTIVE),
                normalizedActorUserId));
    }

    private void enqueueTicketCheckedInNotification(
            EventTicket ticket,
            ActivityEvent event,
            String actorUserId) {
        String eventId = normalizeId(event == null ? null : event.getSourceId());
        String holderUserId = normalizeId(ticket == null ? null : ticket.getHolderUserId());
        String usedAtIso = safeText(ticket == null ? null : ticket.getUsedAtIso());
        if (notificationOutboxService == null
                || !StringUtils.hasText(eventId)
                || !StringUtils.hasText(holderUserId)
                || !StringUtils.hasText(usedAtIso)) {
            return;
        }
        String eventTitle = firstNonBlank(event.getTitle(), "Event");
        Map<String, String> payload = new LinkedHashMap<>();
        payload.put("eventId", eventId);
        payload.put("eventTitle", eventTitle);
        payload.put("eventScope", "tickets");
        payload.put("ticketStatus", "checked-in");
        payload.put("usedAtIso", usedAtIso);
        payload.put("notification_message_key", "notification.ticket.checked.in.message");
        notificationOutboxService.enqueue(new NotificationIntent(
                "event-ticket-checked-in",
                "event",
                eventId,
                "ticket-holder",
                List.of(holderUserId),
                "Ticket checked in",
                translated(
                        "notification.ticket.checked.in.message",
                        "Your ticket was checked in."),
                "/game",
                firstNonBlank(event.getImageUrl(), "/assets/logo/heart.webp"),
                "/assets/logo/heart.webp",
                "event-ticket-checked-in-" + ticket.getId(),
                payload,
                normalizeId(actorUserId)));
    }

    private void recordTicketReplayAttempt(
            EventTicket ticket,
            ActivityEvent event,
            String actorUserId,
            Instant attemptedAt) {
        if (eventTicketAuditService == null) {
            return;
        }
        try {
            eventTicketAuditService.recordAlreadyUsedAttempt(ticket, event, actorUserId, attemptedAt);
        } catch (RuntimeException exception) {
            LOGGER.warn(
                    "Ticket replay audit failed; the already-used scanner response remains authoritative. eventId={}, ticketId={}, actorUserId={}",
                    safeText(event == null ? null : event.getSourceId()),
                    safeText(ticket == null ? null : ticket.getId()),
                    safeText(actorUserId),
                    exception);
        }
    }

    private void enqueueTicketReplayWarning(
            EventTicket ticket,
            ActivityEvent event,
            String actorUserId) {
        String ticketId = normalizeId(ticket == null ? null : ticket.getId());
        String eventId = normalizeId(event == null ? null : event.getSourceId());
        String holderUserId = normalizeId(ticket == null ? null : ticket.getHolderUserId());
        if (notificationOutboxService == null
                || !StringUtils.hasText(ticketId)
                || !StringUtils.hasText(eventId)
                || !StringUtils.hasText(holderUserId)) {
            return;
        }
        String eventTitle = firstNonBlank(event.getTitle(), "Event");
        Map<String, String> payload = new LinkedHashMap<>();
        payload.put("eventId", eventId);
        payload.put("eventTitle", eventTitle);
        payload.put("eventScope", "tickets");
        payload.put("ticketId", ticketId);
        payload.put("ticketStatus", "already-used");
        payload.put("usedAtIso", safeText(ticket.getUsedAtIso()));
        payload.put("actorUserId", normalizeId(actorUserId));
        payload.put("notification_message_key", "notification.ticket.reuse.message");
        payload.put("notification_tone", "warning");
        payload.put("notification_aggregation_key", "event-ticket-replay:" + ticketId);
        try {
            notificationOutboxService.enqueue(new NotificationIntent(
                    "event-ticket-replay-warning",
                    "event",
                    eventId,
                    "ticket-holder",
                    List.of(holderUserId),
                    "Ticket reuse warning",
                    translated(
                            "notification.ticket.reuse.message",
                            "This ticket was already used."),
                    "/game",
                    firstNonBlank(event.getImageUrl(), "/assets/logo/heart.webp"),
                    "/assets/logo/heart.webp",
                    "event-ticket-replay-warning-" + ticketId,
                    payload,
                    normalizeId(actorUserId)));
        } catch (RuntimeException exception) {
            LOGGER.warn(
                    "Ticket replay warning failed; the already-used scanner response remains authoritative. eventId={}, ticketId={}, actorUserId={}",
                    eventId,
                    ticketId,
                    safeText(actorUserId),
                    exception);
        }
    }

    private void enqueueAssetRestoredNotification(Asset asset, String actorUserId) {
        String assetId = normalizeId(asset == null ? null : asset.getAssetId());
        String normalizedActorUserId = normalizeId(actorUserId);
        if (!StringUtils.hasText(assetId)) {
            return;
        }
        LinkedHashSet<String> recipients = new LinkedHashSet<>(assetRequesterUserIds(asset));
        recipients.addAll(activeResponsibleAssetUserIds(asset));
        if (StringUtils.hasText(normalizedActorUserId)) {
            recipients.remove(normalizedActorUserId);
        }
        if (recipients.isEmpty()) {
            return;
        }
        notificationOutboxService.enqueue(new NotificationIntent(
                "asset-restored",
                "asset",
                assetId,
                "asset-affected-users",
                new ArrayList<>(recipients),
                "Asset restored",
                assetTitle(asset) + " is available again.",
                "/game",
                firstNonBlank(asset == null ? null : asset.getImageUrl(), "/assets/logo/heart.webp"),
                "/assets/logo/heart.webp",
                "asset-restored-" + assetId,
                Map.of(
                        "assetId", assetId,
                        "assetTitle", assetTitle(asset),
                        "assetStatus", STATUS_ACTIVE,
                        "previousStatus", STATUS_TRASHED),
                normalizedActorUserId));
    }

    private void enqueueAssetTakeOverNotification(Asset previous, Asset next, String actorUserId) {
        if (next == null) {
            return;
        }
        String assetId = normalizeId(next.getAssetId());
        String normalizedActorUserId = normalizeId(actorUserId);
        if (!StringUtils.hasText(assetId) || !StringUtils.hasText(normalizedActorUserId)) {
            return;
        }
        Asset handoverState = previous == null ? next : previous;
        String previousOwnerUserId = normalizeId(previous == null ? null : previous.getOwnerUserId());
        List<String> recipients = assetOwnerReleaseRecipientUserIds(handoverState, previousOwnerUserId).stream()
                .filter(userId -> !normalizedActorUserId.equals(userId))
                .toList();
        if (recipients.isEmpty()) {
            return;
        }
        String actorName = usersRepository.findByUserId(normalizedActorUserId)
                .map(Users::getName)
                .map(this::safeText)
                .filter(StringUtils::hasText)
                .orElse("A member");
        String title = "Asset responsibility changed";
        String body = actorName + " took over responsibility for " + assetTitle(next) + ".";
        notificationOutboxService.enqueue(new NotificationIntent(
                "asset-takeover",
                "asset",
                assetId,
                "asset-members",
                recipients,
                title,
                body,
                "/game",
                firstNonBlank(next == null ? null : next.getImageUrl(), "/assets/logo/heart.webp"),
                "/assets/logo/heart.webp",
                "asset-takeover-" + assetId,
                Map.of(
                        "assetId", assetId,
                        "assetTitle", assetTitle(next),
                        "previousOwnerUserId", safeText(previous == null ? null : previous.getOwnerUserId()),
                        "ownerUserId", safeText(next.getOwnerUserId()),
                        "actorUserId", normalizedActorUserId),
                normalizedActorUserId));
    }

    private void enqueueAssetOwnerReleasedNotification(Asset asset, String actorUserId) {
        String assetId = normalizeId(asset == null ? null : asset.getAssetId());
        String normalizedActorUserId = normalizeId(actorUserId);
        List<String> recipients = assetOwnerReleaseRecipientUserIds(asset, normalizedActorUserId);
        if (!StringUtils.hasText(assetId) || recipients.isEmpty()) {
            return;
        }
        String actorName = usersRepository.findByUserId(normalizedActorUserId)
                .map(Users::getName)
                .map(this::safeText)
                .filter(StringUtils::hasText)
                .orElse("The Asset owner");
        boolean managerCandidatesExist = activeResponsibleAssetUserIds(asset).stream()
                .anyMatch(userId -> !normalizedActorUserId.equals(userId));
        notificationOutboxService.enqueue(new NotificationIntent(
                "asset-owner-left",
                "asset",
                assetId,
                managerCandidatesExist ? "asset-active-managers" : "asset-members",
                recipients,
                "Asset needs a new owner",
                actorName + " left " + assetTitle(asset) + ". "
                        + (managerCandidatesExist
                                ? "An Asset Manager can take over responsibility."
                                : "An accepted Asset Member can take over responsibility."),
                "/game",
                firstNonBlank(asset == null ? null : asset.getImageUrl(), "/assets/logo/heart.webp"),
                "/assets/logo/heart.webp",
                "asset-owner-left-" + assetId + "-" + safeText(asset.getOwnerReleasedAtIso()),
                Map.of(
                        "assetId", assetId,
                        "assetTitle", assetTitle(asset),
                        "previousOwnerUserId", normalizedActorUserId,
                        "assetStatus", STATUS_UNDER_REVIEW),
                normalizedActorUserId));
    }

    private List<String> assetOwnerReleaseRecipientUserIds(Asset asset, String actorUserId) {
        String normalizedActorUserId = normalizeId(actorUserId);
        LinkedHashSet<String> recipients = activeResponsibleAssetUserIds(asset).stream()
                .filter(userId -> !normalizedActorUserId.equals(userId))
                .collect(LinkedHashSet::new, Set::add, Set::addAll);
        if (recipients.isEmpty()) {
            recipients.addAll(activeAcceptedAssetMemberUserIds(asset));
            recipients.remove(normalizedActorUserId);
        }
        return recipients.stream()
                .filter(StringUtils::hasText)
                .filter(this::isActiveUser)
                .toList();
    }

    private void enqueueAssetManagerPromotedNotification(Asset asset, String actorUserId, String targetUserId) {
        String assetId = normalizeId(asset == null ? null : asset.getAssetId());
        String normalizedActorUserId = normalizeId(actorUserId);
        String normalizedTargetUserId = normalizeId(targetUserId);
        if (!StringUtils.hasText(assetId) || !StringUtils.hasText(normalizedActorUserId) || !StringUtils.hasText(normalizedTargetUserId)) {
            return;
        }
        LinkedHashSet<String> recipients = new LinkedHashSet<>();
        recipients.add(normalizedTargetUserId);
        recipients.addAll(activeResponsibleAssetUserIds(asset));
        recipients.remove(normalizedActorUserId);
        if (recipients.isEmpty()) {
            return;
        }
        String targetName = usersRepository.findByUserId(normalizedTargetUserId)
                .map(Users::getName)
                .map(this::safeText)
                .filter(StringUtils::hasText)
                .orElse("A member");
        String title = "Asset manager updated";
        String body = targetName + " can now help manage " + assetTitle(asset) + ".";
        notificationOutboxService.enqueue(new NotificationIntent(
                "asset-manager-promoted",
                "asset",
                assetId,
                "asset-active-managers",
                recipients,
                title,
                body,
                "/game",
                firstNonBlank(asset == null ? null : asset.getImageUrl(), "/assets/logo/heart.webp"),
                "/assets/logo/heart.webp",
                "asset-manager-promoted-" + assetId + "-" + normalizedTargetUserId,
                Map.of(
                        "assetId", assetId,
                        "assetTitle", assetTitle(asset),
                        "memberUserId", normalizedTargetUserId,
                        "targetUserId", normalizedTargetUserId,
                        "actorUserId", normalizedActorUserId),
                normalizedActorUserId));
    }

    private void enqueueAssetManagerRevokedNotification(Asset asset, String actorUserId, String targetUserId) {
        String assetId = normalizeId(asset == null ? null : asset.getAssetId());
        String normalizedActorUserId = normalizeId(actorUserId);
        String normalizedTargetUserId = normalizeId(targetUserId);
        if (!StringUtils.hasText(assetId)
                || !StringUtils.hasText(normalizedActorUserId)
                || !StringUtils.hasText(normalizedTargetUserId)) {
            return;
        }
        LinkedHashSet<String> recipients = new LinkedHashSet<>();
        recipients.add(normalizedTargetUserId);
        recipients.addAll(activeResponsibleAssetUserIds(asset));
        recipients.remove(normalizedActorUserId);
        if (recipients.isEmpty()) {
            return;
        }
        String targetName = usersRepository.findByUserId(normalizedTargetUserId)
                .map(Users::getName)
                .map(this::safeText)
                .filter(StringUtils::hasText)
                .orElse("A member");
        String title = "Asset manager updated";
        String body = targetName + " is no longer a manager of " + assetTitle(asset) + ".";
        notificationOutboxService.enqueue(new NotificationIntent(
                "asset-manager-revoked",
                "asset",
                assetId,
                "asset-active-managers",
                recipients,
                title,
                body,
                "/game",
                firstNonBlank(asset == null ? null : asset.getImageUrl(), "/assets/logo/heart.webp"),
                "/assets/logo/heart.webp",
                "asset-manager-revoked-" + assetId + "-" + normalizedTargetUserId,
                Map.of(
                        "assetId", assetId,
                        "assetTitle", assetTitle(asset),
                        "memberUserId", normalizedTargetUserId,
                        "targetUserId", normalizedTargetUserId,
                        "actorUserId", normalizedActorUserId),
                normalizedActorUserId));
    }

    private void enqueueScopedAssetPendingRequestNotifications(
            Asset previous,
            Asset next,
            String eventId,
            String subEventId,
            String actorUserId) {
        String assetId = normalizeId(next == null ? null : next.getAssetId());
        String normalizedEventId = normalizeId(eventId);
        String normalizedSubEventId = normalizeId(subEventId);
        String normalizedActorUserId = normalizeId(actorUserId);
        if (!StringUtils.hasText(assetId)
                || !StringUtils.hasText(normalizedEventId)
                || !StringUtils.hasText(normalizedSubEventId)) {
            return;
        }

        Set<String> previousPendingKeys = safeRequests(previous == null ? null : previous.getRequests()).stream()
                .filter(Objects::nonNull)
                .filter(request -> isRequestInScope(request, normalizedEventId, normalizedSubEventId))
                .filter(request -> "pending".equals(normalizeRequestStatus(request.status())))
                .filter(request -> !"manual".equals(normalizeAssetRequestKind(request.requestKind())))
                .map(request -> scopedAssetRequestNotificationKey(request, normalizedEventId, normalizedSubEventId))
                .collect(LinkedHashSet::new, Set::add, Set::addAll);

        safeRequests(next.getRequests()).stream()
                .filter(Objects::nonNull)
                .filter(request -> isRequestInScope(request, normalizedEventId, normalizedSubEventId))
                .filter(request -> "pending".equals(normalizeRequestStatus(request.status())))
                .filter(request -> !"manual".equals(normalizeAssetRequestKind(request.requestKind())))
                .filter(request -> !previousPendingKeys.contains(
                        scopedAssetRequestNotificationKey(request, normalizedEventId, normalizedSubEventId)))
                .forEach(request -> enqueueScopedAssetPendingRequestNotification(
                        next,
                        request,
                        normalizedEventId,
                        normalizedSubEventId,
                        normalizedActorUserId));
    }

    private void enqueueNewScopedAssetPendingRequestNotifications(
            Asset previous,
            Asset next,
            String actorUserId) {
        Set<String> notifiedScopes = new LinkedHashSet<>();
        for (AssetRequestRecord request : safeRequests(next == null ? null : next.getRequests())) {
            if (request == null
                    || !"pending".equals(normalizeRequestStatus(request.status()))
                    || "manual".equals(normalizeAssetRequestKind(request.requestKind()))) {
                continue;
            }
            AssetRequestBookingRecord booking = request.booking();
            String eventId = normalizeId(booking == null ? null : booking.eventId());
            String subEventId = normalizeId(booking == null ? null : booking.subEventId());
            if (!StringUtils.hasText(eventId)
                    || !StringUtils.hasText(subEventId)
                    || !notifiedScopes.add(eventId + "\u0000" + subEventId)) {
                continue;
            }
            enqueueScopedAssetPendingRequestNotifications(
                    previous,
                    next,
                    eventId,
                    subEventId,
                    actorUserId);
        }
    }

    private void enqueueScopedAssetPendingRequestNotification(
            Asset asset,
            AssetRequestRecord request,
            String eventId,
            String subEventId,
            String actorUserId) {
        String assetId = normalizeId(asset == null ? null : asset.getAssetId());
        String memberUserId = normalizeId(request == null ? null : request.userId());
        String requestKind = normalizeAssetRequestKind(request == null ? null : request.requestKind());
        boolean invitation = ASSET_REQUEST_KIND_INVITE.equals(requestKind);
        if (!StringUtils.hasText(assetId) || !StringUtils.hasText(memberUserId)) {
            return;
        }

        List<String> recipients;
        String notificationType;
        String recipientScope;
        String body;
        if (invitation) {
            recipients = memberUserId.equals(actorUserId) || !isActiveUser(memberUserId)
                    ? List.of()
                    : List.of(memberUserId);
            notificationType = "asset-member-invite";
            recipientScope = "asset-invitee";
            body = "Asset invitation";
        } else {
            recipients = activeResponsibleAssetUserIds(asset).stream()
                    .filter(userId -> !userId.equals(actorUserId))
                    .filter(userId -> !userId.equals(memberUserId))
                    .toList();
            notificationType = "asset-admin-join-request";
            recipientScope = "asset-responsible-users";
            String memberName = firstNonBlank(request.name(), memberUserId);
            body = memberName + " requested access · " + assetTitle(asset);
        }
        if (recipients.isEmpty()) {
            return;
        }

        String requestId = firstNonBlank(
                normalizeId(request.id()),
                scopedAssetRequestNotificationKey(request, eventId, subEventId));
        Map<String, String> payload = new LinkedHashMap<>();
        payload.put("assetId", assetId);
        payload.put("assetTitle", assetTitle(asset));
        payload.put("eventId", eventId);
        payload.put("subEventId", subEventId);
        payload.put("requestId", requestId);
        payload.put("requestKind", requestKind);
        payload.put("memberUserId", memberUserId);
        payload.put("memberName", firstNonBlank(request.name(), memberUserId));
        payload.put("membershipAction", invitation ? "invited" : "requested");
        payload.put("notification_tone", "accent");
        payload.put("notification_status_badge_fallback", "Pending");
        payload.put("notification_status_badge_tone", "accent");
        if (StringUtils.hasText(actorUserId)) {
            payload.put("senderUserId", actorUserId);
        }
        if (StringUtils.hasText(safeText(request.requestedAtIso()))) {
            payload.put("requestedAtIso", safeText(request.requestedAtIso()));
        }

        notificationOutboxService.enqueue(new NotificationIntent(
                notificationType,
                "asset",
                assetId,
                recipientScope,
                recipients,
                assetTitle(asset),
                body,
                "/game",
                firstNonBlank(asset == null ? null : asset.getImageUrl(), "/assets/logo/heart.webp"),
                "/assets/logo/heart.webp",
                notificationType + "-" + assetId + "-" + requestId,
                payload,
                StringUtils.hasText(actorUserId) ? actorUserId : memberUserId));
    }

    private void enqueueAcceptedAssetInviteNotifications(
            Asset previous,
            Asset next,
            String actorUserId) {
        String assetId = normalizeId(next == null ? null : next.getAssetId());
        String normalizedActorUserId = normalizeId(actorUserId);
        if (!StringUtils.hasText(assetId) || !StringUtils.hasText(normalizedActorUserId)) {
            return;
        }

        Map<String, AssetRequestRecord> previousById = requestsById(
                previous == null ? null : previous.getRequests());
        for (AssetRequestRecord accepted : safeRequests(next.getRequests())) {
            String requestId = normalizeId(accepted == null ? null : accepted.id());
            AssetRequestRecord pending = previousById.get(requestId);
            if (!StringUtils.hasText(requestId)
                    || pending == null
                    || !ASSET_REQUEST_KIND_INVITE.equals(normalizeAssetRequestKind(accepted.requestKind()))
                    || !"pending".equals(normalizeRequestStatus(pending.status()))
                    || !MEMBER_STATUS_ACCEPTED.equals(normalizeRequestStatus(accepted.status()))
                    || !normalizedActorUserId.equals(normalizeId(accepted.userId()))) {
                continue;
            }

            List<String> recipients = activeResponsibleAssetUserIds(next).stream()
                    .filter(userId -> !normalizedActorUserId.equals(userId))
                    .toList();
            if (recipients.isEmpty()) {
                continue;
            }

            AssetRequestBookingRecord booking = accepted.booking();
            String memberName = firstNonBlank(accepted.name(), normalizedActorUserId);
            String acceptedAtIso = Instant.now().toString();
            Map<String, String> payload = new LinkedHashMap<>();
            payload.put("assetId", assetId);
            payload.put("assetTitle", assetTitle(next));
            payload.put("eventId", safeText(booking == null ? null : booking.eventId()));
            payload.put("subEventId", safeText(booking == null ? null : booking.subEventId()));
            payload.put("requestId", requestId);
            payload.put("requestKind", ASSET_REQUEST_KIND_INVITE);
            payload.put("memberUserId", normalizedActorUserId);
            payload.put("memberName", memberName);
            payload.put("membershipAction", "accepted");
            payload.put("acceptedAtIso", acceptedAtIso);
            payload.put("senderUserId", normalizedActorUserId);
            payload.put("notification_tone", "accent");

            notificationOutboxService.enqueue(new NotificationIntent(
                    "asset-invitation-accepted",
                    "asset",
                    assetId,
                    "asset-responsible-users",
                    recipients,
                    "Asset invitation accepted",
                    memberName + " accepted the invitation to use " + assetTitle(next) + ".",
                    "/game",
                    firstNonBlank(next.getImageUrl(), "/assets/logo/heart.webp"),
                    "/assets/logo/heart.webp",
                    "asset-invitation-accepted-" + assetId + "-" + requestId,
                    payload,
                    normalizedActorUserId));
        }
    }

    private void enqueueAssetMembershipTransitionNotifications(
            Asset previous,
            Asset next,
            String actorUserId) {
        enqueueAcceptedAssetInviteNotifications(previous, next, actorUserId);

        String assetId = normalizeId(next == null ? null : next.getAssetId());
        String normalizedActorUserId = normalizeId(actorUserId);
        if (!StringUtils.hasText(assetId) || !StringUtils.hasText(normalizedActorUserId)) {
            return;
        }

        Map<String, AssetRequestRecord> nextById = requestsById(next.getRequests());
        for (AssetRequestRecord previousRequest : safeRequests(previous == null ? null : previous.getRequests())) {
            String requestId = normalizeId(previousRequest == null ? null : previousRequest.id());
            String memberUserId = normalizeId(previousRequest == null ? null : previousRequest.userId());
            if (!StringUtils.hasText(requestId)
                    || !StringUtils.hasText(memberUserId)
                    || "manual".equals(normalizeAssetRequestKind(previousRequest.requestKind()))) {
                continue;
            }

            String previousStatus = normalizeRequestStatus(previousRequest.status());
            AssetRequestRecord nextRequest = nextById.get(requestId);
            if (isDeletedAssetRequest(nextRequest)) {
                nextRequest = null;
            }
            if (nextRequest != null
                    && "pending".equals(previousStatus)
                    && MEMBER_STATUS_ACCEPTED.equals(normalizeRequestStatus(nextRequest.status()))) {
                boolean acceptingOwnInvitation = memberUserId.equals(normalizedActorUserId)
                        && ASSET_REQUEST_KIND_INVITE.equals(normalizeAssetRequestKind(nextRequest.requestKind()));
                if (!acceptingOwnInvitation && !memberUserId.equals(normalizedActorUserId)) {
                    enqueueAssetMemberTransitionNotification(
                            next,
                            nextRequest,
                            normalizedActorUserId,
                            "asset-member-request-accepted",
                            "asset-member",
                            List.of(memberUserId),
                            "Borrow accepted",
                            assetTitle(next),
                            "accepted");
                }
                continue;
            }
            if (nextRequest != null) {
                continue;
            }

            if (memberUserId.equals(normalizedActorUserId)) {
                if (MEMBER_STATUS_ACCEPTED.equals(previousStatus)) {
                    LinkedHashSet<String> recipients = new LinkedHashSet<>(activeResponsibleAssetUserIds(previous));
                    recipients.addAll(acceptedAssetParticipantUserIds(previous));
                    recipients.remove(normalizedActorUserId);
                    String memberName = firstNonBlank(previousRequest.name(), memberUserId);
                    enqueueAssetMemberTransitionNotification(
                            previous,
                            previousRequest,
                            normalizedActorUserId,
                            "asset-member-left",
                            "asset-members",
                            new ArrayList<>(recipients),
                            "Asset member left",
                            memberName + " left " + assetTitle(previous) + ".",
                            "left");
                } else if ("pending".equals(previousStatus)
                        && ASSET_REQUEST_KIND_INVITE.equals(
                                normalizeAssetRequestKind(previousRequest.requestKind()))) {
                    String memberName = firstNonBlank(previousRequest.name(), memberUserId);
                    enqueueAssetMemberTransitionNotification(
                            previous,
                            previousRequest,
                            normalizedActorUserId,
                            "asset-invitation-declined",
                            "asset-responsible-users",
                            activeResponsibleAssetUserIds(previous),
                            "Asset invitation declined",
                            memberName + " declined the invitation to use " + assetTitle(previous) + ".",
                            "declined");
                }
                continue;
            }

            boolean pendingRemoval = "pending".equals(previousStatus);
            boolean invitation = ASSET_REQUEST_KIND_INVITE.equals(
                    normalizeAssetRequestKind(previousRequest.requestKind()));
            String notificationType = pendingRemoval
                    ? invitation ? "asset-member-invitation-withdrawn" : "asset-member-request-declined"
                    : "asset-member-removed";
            String body = pendingRemoval
                    ? invitation
                            ? "Your invitation to use " + assetTitle(previous) + " was withdrawn."
                            : "Your request to use " + assetTitle(previous) + " was declined."
                    : "You were removed from " + assetTitle(previous) + ".";
            enqueueAssetMemberTransitionNotification(
                    previous,
                    previousRequest,
                    normalizedActorUserId,
                    notificationType,
                    "asset-member",
                    List.of(memberUserId),
                    pendingRemoval ? "Asset request updated" : "Asset membership removed",
                    body,
                    pendingRemoval ? invitation ? "invitation-withdrawn" : "declined" : "removed");
        }
    }

    private void enqueueAssetMemberTransitionNotification(
            Asset asset,
            AssetRequestRecord request,
            String actorUserId,
            String notificationType,
            String recipientScope,
            List<String> recipientUserIds,
            String title,
            String body,
            String membershipAction) {
        String assetId = normalizeId(asset == null ? null : asset.getAssetId());
        String requestId = normalizeId(request == null ? null : request.id());
        String memberUserId = normalizeId(request == null ? null : request.userId());
        String normalizedActorUserId = normalizeId(actorUserId);
        List<String> recipients = (recipientUserIds == null ? List.<String>of() : recipientUserIds).stream()
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .filter(userId -> !userId.equals(normalizedActorUserId))
                .filter(this::isActiveUser)
                .distinct()
                .toList();
        if (!StringUtils.hasText(assetId)
                || !StringUtils.hasText(requestId)
                || !StringUtils.hasText(memberUserId)
                || recipients.isEmpty()) {
            return;
        }

        AssetRequestBookingRecord booking = request.booking();
        Map<String, String> payload = new LinkedHashMap<>();
        payload.put("assetId", assetId);
        payload.put("assetTitle", assetTitle(asset));
        payload.put("eventId", safeText(booking == null ? null : booking.eventId()));
        payload.put("subEventId", safeText(booking == null ? null : booking.subEventId()));
        payload.put("requestId", requestId);
        payload.put("requestKind", normalizeAssetRequestKind(request.requestKind()));
        payload.put("memberUserId", memberUserId);
        payload.put("memberName", firstNonBlank(request.name(), memberUserId));
        payload.put("membershipAction", membershipAction);
        payload.put("senderUserId", normalizedActorUserId);
        payload.put("notification_tone", "accent");

        notificationOutboxService.enqueue(new NotificationIntent(
                notificationType,
                "asset",
                assetId,
                recipientScope,
                recipients,
                title,
                body,
                "/game",
                firstNonBlank(asset == null ? null : asset.getImageUrl(), "/assets/logo/heart.webp"),
                "/assets/logo/heart.webp",
                notificationType + "-" + assetId + "-" + requestId,
                payload,
                normalizedActorUserId));
    }

    private void enqueueScopedAssetTakeOverRequestedNotification(
            Asset asset,
            AssetRequestRecord departedManagerRequest,
            String eventId,
            String subEventId,
            String departedManagerUserId) {
        String assetId = normalizeId(asset == null ? null : asset.getAssetId());
        String normalizedEventId = normalizeId(eventId);
        String normalizedSubEventId = normalizeId(subEventId);
        String normalizedDepartedManagerUserId = normalizeId(departedManagerUserId);
        List<String> recipients = safeRequests(asset == null ? null : asset.getRequests()).stream()
                .filter(Objects::nonNull)
                .filter(item -> !isDeletedAssetRequest(item))
                .filter(item -> "borrow".equals(normalizeAssetRequestKind(item.requestKind())))
                .filter(item -> MEMBER_STATUS_ACCEPTED.equals(normalizeRequestStatus(item.status())))
                .filter(item -> isRequestInScope(item, normalizedEventId, normalizedSubEventId))
                .map(AssetRequestRecord::userId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .filter(userId -> !normalizedDepartedManagerUserId.equals(userId))
                .filter(this::isActiveUser)
                .distinct()
                .toList();
        if (!StringUtils.hasText(assetId) || recipients.isEmpty()) {
            return;
        }
        String managerName = firstNonBlank(
                departedManagerRequest == null ? null : departedManagerRequest.name(),
                normalizedDepartedManagerUserId);
        Map<String, String> payload = new LinkedHashMap<>();
        payload.put("assetId", assetId);
        payload.put("assetTitle", assetTitle(asset));
        payload.put("ownerId", normalizedEventId);
        payload.put("eventId", normalizedEventId);
        payload.put("subEventId", normalizedSubEventId);
        payload.put("resourceType", normalizeAssetType(asset.getType()));
        payload.put("previousManagerUserId", normalizedDepartedManagerUserId);
        payload.put("membershipAction", "takeover-required");
        payload.put("notification_tone", "warning");
        payload.put("notification_title_key", "notification.asset.takeover.required.title");
        payload.put("notification_message_key", "notification.asset.takeover.required.message");
        notificationOutboxService.enqueue(new NotificationIntent(
                "asset-assignment-takeover-required",
                "asset",
                assetId,
                "asset-scoped-members",
                recipients,
                "notification.asset.takeover.required.title",
                "notification.asset.takeover.required.message",
                "/game",
                firstNonBlank(asset.getImageUrl(), "/assets/logo/heart.webp"),
                "/assets/logo/heart.webp",
                "asset-assignment-takeover-required-" + assetId + "-" + normalizedEventId + "-" + normalizedSubEventId,
                payload,
                normalizedDepartedManagerUserId));
    }

    private void enqueueScopedAssetTakeOverCompletedNotification(
            Asset asset,
            AssetRequestRecord departedManagerRequest,
            String eventId,
            String subEventId,
            String previousManagerUserId,
            String successorUserId) {
        String assetId = normalizeId(asset == null ? null : asset.getAssetId());
        String normalizedEventId = normalizeId(eventId);
        String normalizedSubEventId = normalizeId(subEventId);
        String normalizedPreviousManagerUserId = normalizeId(previousManagerUserId);
        String normalizedSuccessorUserId = normalizeId(successorUserId);
        LinkedHashSet<String> recipientIds = safeRequests(asset == null ? null : asset.getRequests()).stream()
                .filter(Objects::nonNull)
                .filter(item -> !isDeletedAssetRequest(item))
                .filter(item -> "borrow".equals(normalizeAssetRequestKind(item.requestKind())))
                .filter(item -> MEMBER_STATUS_ACCEPTED.equals(normalizeRequestStatus(item.status())))
                .filter(item -> isRequestInScope(item, normalizedEventId, normalizedSubEventId))
                .map(AssetRequestRecord::userId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .collect(LinkedHashSet::new, Set::add, Set::addAll);
        recipientIds.remove(normalizedSuccessorUserId);
        recipientIds.remove(normalizedPreviousManagerUserId);
        List<String> recipients = recipientIds.stream()
                .filter(StringUtils::hasText)
                .filter(this::isActiveUser)
                .toList();
        if (!StringUtils.hasText(assetId) || recipients.isEmpty()) {
            return;
        }
        String successorName = usersRepository.findByUserId(normalizedSuccessorUserId)
                .map(Users::getName)
                .map(this::safeText)
                .filter(StringUtils::hasText)
                .orElse("A member");
        Map<String, String> payload = new LinkedHashMap<>();
        payload.put("assetId", assetId);
        payload.put("assetTitle", assetTitle(asset));
        payload.put("ownerId", normalizedEventId);
        payload.put("eventId", normalizedEventId);
        payload.put("subEventId", normalizedSubEventId);
        payload.put("resourceType", normalizeAssetType(asset.getType()));
        payload.put("previousManagerUserId", normalizedPreviousManagerUserId);
        payload.put("managerUserId", normalizedSuccessorUserId);
        payload.put("membershipAction", "taken-over");
        payload.put("notification_tone", "accent");
        notificationOutboxService.enqueue(new NotificationIntent(
                "asset-assignment-taken-over",
                "asset",
                assetId,
                "asset-scoped-members",
                recipients,
                "Asset manager changed",
                successorName + " took over " + assetTitle(asset) + ".",
                "/game",
                firstNonBlank(asset.getImageUrl(), "/assets/logo/heart.webp"),
                "/assets/logo/heart.webp",
                "asset-assignment-taken-over-" + assetId + "-" + normalizedEventId + "-" + normalizedSubEventId,
                payload,
                normalizedSuccessorUserId));
    }

    private void enqueueScopedAssetTakeOverRefundedNotification(
            Asset asset,
            String eventId,
            String subEventId,
            String previousManagerUserId,
            String predecessorPaymentId) {
        String assetId = normalizeId(asset == null ? null : asset.getAssetId());
        String normalizedPreviousManagerUserId = normalizeId(previousManagerUserId);
        String paymentId = normalizeId(predecessorPaymentId);
        if (!StringUtils.hasText(assetId)
                || !StringUtils.hasText(normalizedPreviousManagerUserId)
                || !StringUtils.hasText(paymentId)
                || !isActiveUser(normalizedPreviousManagerUserId)) {
            return;
        }
        Map<String, String> payload = new LinkedHashMap<>();
        payload.put("paymentId", paymentId);
        payload.put("sourceId", assetId);
        payload.put("assetId", assetId);
        payload.put("assetTitle", assetTitle(asset));
        payload.put("eventId", normalizeId(eventId));
        payload.put("subEventId", normalizeId(subEventId));
        payload.put("refundRequestStatus", "approved");
        payload.put("refundStatus", "full");
        payload.put("paymentStatus", "refunded");
        payload.put("refundReason", "asset-manager-takeover");
        payload.put("notification_title_key", "notification.kind.payment-refund-approved.title");
        payload.put("notification_message_key", "notification.payment.refund.takeover.message");
        payload.put("notification_tone", "accent");
        notificationOutboxService.enqueue(new NotificationIntent(
                "payment-refund-approved",
                "payment",
                paymentId,
                "app-admin-payment-participant",
                List.of(normalizedPreviousManagerUserId),
                "Payment refunded",
                "Your payment for " + assetTitle(asset) + " was refunded because the Asset was taken over.",
                "/game",
                firstNonBlank(asset.getImageUrl(), "/assets/logo/heart.webp"),
                "/assets/logo/heart.webp",
                "payment-refund-approved-" + paymentId,
                payload,
                null));
    }

    private List<String> acceptedAssetParticipantUserIds(Asset asset) {
        return safeRequests(asset == null ? null : asset.getRequests()).stream()
                .filter(Objects::nonNull)
                .filter(request -> !isDeletedAssetRequest(request))
                .filter(request -> MEMBER_STATUS_ACCEPTED.equals(normalizeRequestStatus(request.status())))
                .map(AssetRequestRecord::userId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .filter(this::isActiveUser)
                .distinct()
                .toList();
    }

    private List<String> activeAcceptedAssetMemberUserIds(Asset asset) {
        if (asset == null || !StringUtils.hasText(normalizeId(asset.getAssetId()))) {
            return List.of();
        }
        LinkedHashSet<String> userIds = new LinkedHashSet<>(acceptedAssetParticipantUserIds(asset));
        for (ActivityMember member : activityMembersRepository.findByOwnerTypeAndOwnerId(
                OWNER_TYPE_ASSET,
                normalizeId(asset.getAssetId()))) {
            if (member == null
                    || !MEMBER_STATUS_ACCEPTED.equals(normalizeMemberStatus(member.getStatus()))) {
                continue;
            }
            String userId = normalizeId(member.getUserId());
            if (StringUtils.hasText(userId)) {
                userIds.add(userId);
            }
        }
        return userIds.stream()
                .filter(this::isActiveUser)
                .toList();
    }

    private String scopedAssetRequestNotificationKey(
            AssetRequestRecord request,
            String eventId,
            String subEventId) {
        String requestId = normalizeId(request == null ? null : request.id());
        if (StringUtils.hasText(requestId)) {
            return requestId;
        }
        return String.join(":",
                normalizeAssetRequestKind(request == null ? null : request.requestKind()),
                normalizeId(request == null ? null : request.userId()),
                normalizeId(eventId),
                normalizeId(subEventId));
    }

    private List<String> activeResponsibleAssetUserIds(Asset asset) {
        if (asset == null) {
            return List.of();
        }
        String assetId = normalizeId(asset.getAssetId());
        if (!StringUtils.hasText(assetId)) {
            return List.of();
        }
        LinkedHashSet<String> userIds = new LinkedHashSet<>();
        String ownerUserId = normalizeId(asset.getOwnerUserId());
        if (StringUtils.hasText(ownerUserId) && !isOwnerResponsibilityReleased(asset)) {
            userIds.add(ownerUserId);
        }
        List<ActivityMember> assetMembers = activityMembersRepository.findByOwnerTypeAndOwnerId(OWNER_TYPE_ASSET, assetId);
        for (ActivityMember member : assetMembers == null ? List.<ActivityMember>of() : assetMembers) {
            if (member == null
                    || !MEMBER_STATUS_ACCEPTED.equals(safeText(member.getStatus()))
                    || !isManagerRole(member.getRole())) {
                continue;
            }
            String userId = normalizeId(member.getUserId());
            if (StringUtils.hasText(userId)) {
                userIds.add(userId);
            }
        }
        return userIds.stream()
                .filter(this::isActiveUser)
                .toList();
    }

    private List<String> assetRequesterUserIds(Asset asset) {
        if (asset == null || asset.getRequests() == null || asset.getRequests().isEmpty()) {
            return List.of();
        }
        String ownerUserId = normalizeId(asset.getOwnerUserId());
        return asset.getRequests().stream()
                .filter(Objects::nonNull)
                .filter(request -> !isDeletedAssetRequest(request))
                .map(AssetRequestRecord::userId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .filter(userId -> !userId.equals(ownerUserId))
                .distinct()
                .toList();
    }

    private boolean isActiveUser(String userId) {
        return usersRepository.findByUserId(normalizeId(userId))
                .map(user -> {
                    String profileStatus = safeText(user.getProfileStatus());
                    String status = safeText(user.getStatus());
                    return !"blocked".equals(profileStatus)
                            && !"deleted".equals(profileStatus)
                            && !"inactive".equals(profileStatus)
                            && !STATUS_BLOCKED.equalsIgnoreCase(status)
                            && !STATUS_DELETED.equalsIgnoreCase(status)
                            && !STATUS_INACTIVE.equalsIgnoreCase(status);
                })
                .orElse(false);
    }

    private String assetTitle(Asset asset) {
        String title = safeText(asset == null ? null : asset.getTitle());
        return StringUtils.hasText(title) ? title : "This asset";
    }

    private String firstNonBlank(String first, String second) {
        String normalizedFirst = safeText(first);
        return StringUtils.hasText(normalizedFirst) ? normalizedFirst : safeText(second);
    }

    private String firstUserImageUrl(Users user) {
        if (user == null || user.getImages() == null) {
            return "";
        }
        return user.getImages().stream()
                .map(this::safeText)
                .filter(StringUtils::hasText)
                .findFirst()
                .orElse("");
    }

    private boolean isManagerRole(String role) {
        String normalizedRole = safeText(role);
        return ROLE_MANAGER.equals(normalizedRole) || ROLE_ADMIN.equals(normalizedRole);
    }

    private String normalizeVisibility(String visibility) {
        String normalized = safeText(visibility);
        if ("Friends only".equals(normalized)) {
            return "Friends only";
        }
        if ("Invitation only".equals(normalized)) {
            return "Invitation only";
        }
        return "Public";
    }

    private String resolveOwnerName(String ownerUserId, Map<String, AssetOwnerSummary> ownersByUserId) {
        String normalizedOwnerUserId = normalizeId(ownerUserId);
        if (!StringUtils.hasText(normalizedOwnerUserId)) {
            return null;
        }
        if (ownersByUserId != null && ownersByUserId.containsKey(normalizedOwnerUserId)) {
            AssetOwnerSummary owner = ownersByUserId.get(normalizedOwnerUserId);
            return owner == null ? null : owner.name();
        }
        return usersRepository.findByUserId(normalizedOwnerUserId)
                .map(Users::getName)
                .map(this::safeText)
                .orElse(null);
    }

    private String resolveOwnerAvatarUrl(String ownerUserId, Map<String, AssetOwnerSummary> ownersByUserId) {
        String normalizedOwnerUserId = normalizeId(ownerUserId);
        if (!StringUtils.hasText(normalizedOwnerUserId)) {
            return null;
        }
        if (ownersByUserId != null && ownersByUserId.containsKey(normalizedOwnerUserId)) {
            AssetOwnerSummary owner = ownersByUserId.get(normalizedOwnerUserId);
            return owner == null ? null : safeNullableText(owner.avatarUrl());
        }
        return usersRepository.findByUserId(normalizedOwnerUserId)
                .map(this::firstUserImageUrl)
                .map(this::safeNullableText)
                .orElse(null);
    }

    private record AssetOwnerSummary(String name, String avatarUrl) {
    }

    private boolean isFriendOfActiveUser(String userId, String activeUserId) {
        if (!StringUtils.hasText(userId) || !StringUtils.hasText(activeUserId) || userId.equals(activeUserId)) {
            return false;
        }
        String firstId = userId.compareTo(activeUserId) <= 0 ? userId : activeUserId;
        String secondId = userId.compareTo(activeUserId) <= 0 ? activeUserId : userId;
        int seed = hashText("friend-pair:" + firstId + ":" + secondId);
        return (seed % 100) < 32;
    }

    private int hashText(String value) {
        int hash = 0;
        for (int index = 0; index < value.length(); index += 1) {
            hash = (hash * 31 + value.charAt(index)) % 104729;
        }
        return Math.abs(hash);
    }

    private List<AssetDto> safeAssets(List<AssetDto> assets) {
        return assets == null ? List.of() : assets;
    }

    private Integer normalizeAssetQuantity(String type, Object value, Object capacityFallback) {
        if (value != null) {
            return normalizeCount(value);
        }
        if (AssetCatalog.TYPE_SUPPLIES.equals(type)) {
            return Math.max(1, normalizeCount(capacityFallback));
        }
        return 1;
    }

    private PricingConfigDto clonePricing(PricingConfigDto pricing) {
        return pricing;
    }

    private List<AssetPolicyRecord> normalizePolicies(List<PolicyItemDto> policies) {
        if (policies == null) {
            return List.of();
        }
        List<AssetPolicyRecord> next = new ArrayList<>();
        for (PolicyItemDto policy : policies) {
            if (policy == null) {
                continue;
            }
            String policyId = normalizeId(policy.id());
            String title = safeText(policy.title());
            String description = safeText(policy.description());
            if (!StringUtils.hasText(policyId) && !StringUtils.hasText(title) && !StringUtils.hasText(description)) {
                continue;
            }
            next.add(new AssetPolicyRecord(
                    StringUtils.hasText(policyId) ? policyId : UUID.randomUUID().toString(),
                    title,
                    description,
                    policy.required() != null ? policy.required() : Boolean.TRUE));
        }
        return next;
    }

    private List<AssetRequestRecord> normalizeRequests(List<AssetMemberRequestDto> requests) {
        if (requests == null) {
            return List.of();
        }

        List<AssetRequestRecord> next = new ArrayList<>();
        for (AssetMemberRequestDto request : requests) {
            if (request == null) {
                continue;
            }
            String requestId = normalizeId(request.id());
            if (!StringUtils.hasText(requestId)) {
                continue;
            }
            next.add(new AssetRequestRecord(
                    requestId,
                    normalizeId(request.userId()),
                    safeText(request.name()),
                    safeText(request.initials()),
                    normalizeGender(request.gender()),
                    normalizeRequestStatus(request.status()),
                    safeText(request.note()),
                    normalizeAssetRequestKind(request.requestKind()),
                    safeNullableText(request.requestedAtIso()),
                    normalizeRequestBooking(request.booking())));
        }
        return deduplicateRequests(next);
    }

    private List<AssetRequestRecord> safeRequests(List<AssetRequestRecord> requests) {
        return requests == null ? List.of() : requests;
    }

    private AssetRequestBookingDto toRequestBookingDto(AssetRequestBookingRecord booking) {
        if (booking == null) {
            return null;
        }
        return new AssetRequestBookingDto(
                normalizeId(booking.eventId()),
                safeNullableText(booking.eventTitle()),
                normalizeId(booking.subEventId()),
                safeNullableText(booking.subEventTitle()),
                safeNullableText(booking.slotKey()),
                safeNullableText(booking.slotLabel()),
                safeNullableText(booking.timeframe()),
                safeNullableText(booking.startAtIso()),
                safeNullableText(booking.endAtIso()),
                nullableCount(booking.quantity()),
                booking.totalAmount() == null || !Double.isFinite(booking.totalAmount()) ? null : Math.max(0d, booking.totalAmount()),
                booking.previousTotalAmount() == null || !Double.isFinite(booking.previousTotalAmount())
                        ? null
                        : Math.max(0d, booking.previousTotalAmount()),
                safeNullableText(booking.currency()),
                normalizeStrings(booking.acceptedPolicyIds()),
                normalizeId(booking.paymentSessionId()),
                Boolean.TRUE.equals(booking.inventoryApplied()) ? Boolean.TRUE : null);
    }

    private AssetRequestBookingRecord normalizeRequestBooking(AssetRequestBookingDto booking) {
        if (booking == null) {
            return null;
        }
        AssetRequestBookingRecord normalized = new AssetRequestBookingRecord(
                normalizeId(booking.eventId()),
                safeNullableText(booking.eventTitle()),
                normalizeId(booking.subEventId()),
                safeNullableText(booking.subEventTitle()),
                safeNullableText(booking.slotKey()),
                safeNullableText(booking.slotLabel()),
                safeNullableText(booking.timeframe()),
                safeNullableText(booking.startAtIso()),
                safeNullableText(booking.endAtIso()),
                nullableCount(booking.quantity()),
                booking.totalAmount() == null || !Double.isFinite(booking.totalAmount()) ? null : Math.max(0d, booking.totalAmount()),
                booking.previousTotalAmount() == null || !Double.isFinite(booking.previousTotalAmount())
                        ? null
                        : Math.max(0d, booking.previousTotalAmount()),
                safeNullableText(booking.currency()),
                normalizeStrings(booking.acceptedPolicyIds()),
                normalizeId(booking.paymentSessionId()),
                Boolean.TRUE.equals(booking.inventoryApplied()) ? Boolean.TRUE : null);
        return hasRequestBookingContent(normalized) ? normalized : null;
    }

    private AssetRequestBookingRecord cloneRequestBooking(AssetRequestBookingRecord booking) {
        if (booking == null) {
            return null;
        }
        return new AssetRequestBookingRecord(
                normalizeId(booking.eventId()),
                safeNullableText(booking.eventTitle()),
                normalizeId(booking.subEventId()),
                safeNullableText(booking.subEventTitle()),
                safeNullableText(booking.slotKey()),
                safeNullableText(booking.slotLabel()),
                safeNullableText(booking.timeframe()),
                safeNullableText(booking.startAtIso()),
                safeNullableText(booking.endAtIso()),
                nullableCount(booking.quantity()),
                booking.totalAmount() == null || !Double.isFinite(booking.totalAmount()) ? null : Math.max(0d, booking.totalAmount()),
                booking.previousTotalAmount() == null || !Double.isFinite(booking.previousTotalAmount())
                        ? null
                        : Math.max(0d, booking.previousTotalAmount()),
                safeNullableText(booking.currency()),
                normalizeStrings(booking.acceptedPolicyIds()),
                normalizeId(booking.paymentSessionId()),
                Boolean.TRUE.equals(booking.inventoryApplied()) ? Boolean.TRUE : null);
    }

    private boolean hasRequestBookingContent(AssetRequestBookingRecord booking) {
        return booking != null
                && (StringUtils.hasText(booking.eventId())
                || StringUtils.hasText(booking.eventTitle())
                || StringUtils.hasText(booking.subEventId())
                || StringUtils.hasText(booking.subEventTitle())
                || StringUtils.hasText(booking.slotKey())
                || StringUtils.hasText(booking.slotLabel())
                || StringUtils.hasText(booking.timeframe())
                || StringUtils.hasText(booking.startAtIso())
                || StringUtils.hasText(booking.endAtIso())
                || booking.quantity() != null
                || booking.totalAmount() != null
                || booking.previousTotalAmount() != null
                || StringUtils.hasText(booking.currency())
                || !normalizeStrings(booking.acceptedPolicyIds()).isEmpty()
                || StringUtils.hasText(booking.paymentSessionId())
                || Boolean.TRUE.equals(booking.inventoryApplied()));
    }

    private Double assetBookingRevisionBaseline(Double preferred, Double fallback) {
        if (preferred != null && Double.isFinite(preferred)) {
            return Math.max(0d, preferred);
        }
        return fallback != null && Double.isFinite(fallback) && fallback > 0d
                ? Math.max(0d, fallback)
                : null;
    }

    private String assetRequestPaymentSessionId(AssetRequestRecord request) {
        return normalizeId(request == null || request.booking() == null ? null : request.booking().paymentSessionId());
    }

    private boolean hasAssetBookingPriceRevision(
            AssetRequestRecord previousRequest,
            AssetRequestRecord nextRequest) {
        if (previousRequest == null
                || previousRequest.booking() == null
                || nextRequest == null
                || nextRequest.booking() == null) {
            return false;
        }
        int previousQuantity = Math.max(1, previousRequest.booking().quantity() == null ? 1 : previousRequest.booking().quantity());
        int nextQuantity = Math.max(1, nextRequest.booking().quantity() == null ? 1 : nextRequest.booking().quantity());
        long previousAmount = Math.round(Math.max(0d, safeDouble(previousRequest.booking().totalAmount())) * 100d);
        long nextAmount = Math.round(Math.max(0d, safeDouble(nextRequest.booking().totalAmount())) * 100d);
        return previousQuantity != nextQuantity || previousAmount != nextAmount;
    }

    private String assetRequestBookingStartAtIso(AssetRequestRecord request) {
        return safeNullableText(request == null || request.booking() == null ? null : request.booking().startAtIso());
    }

    private String assetRequestBookingSlotSourceId(AssetRequestRecord request) {
        if (request == null || request.booking() == null) {
            return null;
        }
        String slotKey = safeNullableText(request.booking().slotKey());
        if (StringUtils.hasText(slotKey)) {
            return slotKey;
        }
        return normalizeId(request.booking().subEventId());
    }

    private List<AssetPolicyRecord> safePolicies(List<AssetPolicyRecord> policies) {
        return policies == null ? List.of() : policies;
    }

    private Document toDocument(Object raw) {
        if (raw instanceof Document document) {
            return document;
        }
        if (raw instanceof Map<?, ?> map) {
            Document document = new Document();
            for (Map.Entry<?, ?> entry : map.entrySet()) {
                if (entry.getKey() instanceof String key) {
                    document.put(key, entry.getValue());
                }
            }
            return document;
        }
        return new Document();
    }

    private List<String> normalizeStrings(Object rawValues) {
        if (!(rawValues instanceof Collection<?> values)) {
            return List.of();
        }
        LinkedHashSet<String> next = new LinkedHashSet<>();
        for (Object rawValue : values) {
            String value = normalizeId(String.valueOf(rawValue));
            if (StringUtils.hasText(value)) {
                next.add(value);
            }
        }
        return new ArrayList<>(next);
    }

    private Double safeDouble(Double value) {
        return value == null || !Double.isFinite(value) ? 0d : value;
    }

    private String safeNullableText(String value) {
        String normalizedValue = safeText(value);
        return StringUtils.hasText(normalizedValue) ? normalizedValue : null;
    }

    private int normalizeCount(Object value) {
        if (value instanceof Number number) {
            return Math.max(0, (int) Math.floor(number.doubleValue()));
        }
        try {
            return Math.max(0, (int) Math.floor(Double.parseDouble(String.valueOf(value))));
        } catch (Exception ignored) {
            return 0;
        }
    }

    private Integer nullableCount(Number value) {
        return value == null ? null : Math.max(0, (int) Math.floor(value.doubleValue()));
    }

    private Double safeNullableDouble(Object value) {
        if (!(value instanceof Number number)) {
            return null;
        }
        double normalized = number.doubleValue();
        return Double.isFinite(normalized) ? Math.max(0d, normalized) : null;
    }

    private String normalizeId(String value) {
        String normalizedValue = safeText(value);
        return StringUtils.hasText(normalizedValue) ? normalizedValue : null;
    }

    private String currentActorUserId() {
        return normalizeId(accessControlService.resolveActorUserId(SecurityContextHolder.getContext().getAuthentication()));
    }

    private String ticketActorUserId(String requestedUserId) {
        String authenticatedUserId = currentActorUserId();
        if (accessControlService.requiresAuthenticatedActor()) {
            return authenticatedUserId;
        }
        return StringUtils.hasText(authenticatedUserId)
                ? authenticatedUserId
                : normalizeId(requestedUserId);
    }

    private String effectiveActorUserId(String userId) {
        String normalizedUserId = normalizeId(userId);
        return StringUtils.hasText(normalizedUserId) ? normalizedUserId : currentActorUserId();
    }

    private String effectiveReadActorUserId(String requestedUserId) {
        String authenticatedUserId = currentActorUserId();
        if (accessControlService.requiresAuthenticatedActor()) {
            return authenticatedUserId;
        }
        return StringUtils.hasText(authenticatedUserId)
                ? authenticatedUserId
                : normalizeId(requestedUserId);
    }

    private String normalizeAssetType(String type) {
        String normalizedType = safeText(type);
        return AssetCatalog.ASSET_TYPES.contains(normalizedType) ? normalizedType : null;
    }

    private String normalizeAssetRequestKind(String kind) {
        String normalizedKind = safeText(kind);
        if ("manual".equals(normalizedKind)) {
            return "manual";
        }
        return ASSET_REQUEST_KIND_INVITE.equals(normalizedKind)
                ? ASSET_REQUEST_KIND_INVITE
                : "borrow";
    }

    private String assetRequestKindForMember(String memberRequestKind) {
        String normalizedKind = safeText(memberRequestKind);
        return "invite".equals(normalizedKind) || "waitlist-invite".equals(normalizedKind)
                ? ASSET_REQUEST_KIND_INVITE
                : "borrow";
    }

    private String normalizeRequestStatus(String status) {
        String normalized = safeText(status);
        if (STATUS_DELETED.equalsIgnoreCase(normalized) || "deleted".equalsIgnoreCase(normalized)) {
            return "deleted";
        }
        return "accepted".equals(normalized) ? "accepted" : "pending";
    }

    private String normalizeMode(String value) {
        return "tournament".equalsIgnoreCase(safeText(value)) ? "Tournament" : "Casual";
    }

    private String normalizeGender(String value) {
        return "woman".equals(safeText(value)) ? "woman" : "man";
    }

    private String normalizeDateTime(String value, String fallback) {
        String normalizedValue = safeText(value);
        return StringUtils.hasText(normalizedValue) ? normalizedValue : fallback;
    }

    private boolean matchesTicketOrder(AssetTicketDto item, boolean upcoming) {
        long endAtMs = resolveTicketEndAtMs(item);
        boolean past = endAtMs < System.currentTimeMillis();
        return upcoming ? !past : past;
    }

    private long resolveTicketEndAtMs(AssetTicketDto item) {
        if (item == null) {
            return Long.MIN_VALUE;
        }
        long endAtMs = toSortableDate(item.endAt());
        if (endAtMs != Long.MIN_VALUE) {
            return endAtMs;
        }
        return toSortableDate(item.dateIso());
    }

    private long toSortableDate(String value) {
        String normalizedValue = safeText(value);
        if (!StringUtils.hasText(normalizedValue)) {
            return Long.MIN_VALUE;
        }
        try {
            return Instant.parse(normalizedValue).toEpochMilli();
        } catch (Exception ignored) {
            try {
                return LocalDateTime.parse(normalizedValue).toInstant(ZoneOffset.UTC).toEpochMilli();
            } catch (Exception ignoredAgain) {
                return Long.MIN_VALUE;
            }
        }
    }

    private long toSortableMinute(String value) {
        long timestamp = toSortableDate(value);
        return timestamp == Long.MIN_VALUE ? Long.MIN_VALUE : Math.floorDiv(timestamp, 60_000L);
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }

    private String translated(String key, String fallback) {
        if (translationService == null) {
            return fallback;
        }
        try {
            return translationService.t(key);
        } catch (RuntimeException exception) {
            return fallback;
        }
    }

    private String initialsFromText(String value) {
        String normalizedValue = safeText(value);
        if (!StringUtils.hasText(normalizedValue)) {
            return "";
        }
        StringBuilder initials = new StringBuilder();
        for (String part : normalizedValue.split("\\s+")) {
            if (!part.isEmpty()) {
                initials.append(Character.toUpperCase(part.charAt(0)));
            }
            if (initials.length() >= 2) {
                break;
            }
        }
        return initials.toString();
    }

    private record AssetExploreMongoPage(
            List<Asset> items,
            int total,
            String nextCursor) {
    }

}
