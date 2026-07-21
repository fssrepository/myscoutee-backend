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
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetDeleteRequestDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetDetailDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetExplorePageDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetMakeManagerRequestDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetReplaceRequestDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetRequestMetricsDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetTicketDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetTicketsPageDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetUpsertRequestDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventDto;
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
    private static final String STATUS_ACTIVE = "A";
    private static final String STATUS_UNDER_REVIEW = "UR";
    private static final String STATUS_TRASHED = "T";
    private static final String STATUS_BLOCKED = "B";
    private static final String STATUS_DELETED = "D";
    private static final String STATUS_INACTIVE = "I";
    private static final String OWNER_TYPE_EVENT = "event";
    private static final String OWNER_TYPE_ASSET = "asset";
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

    public List<AssetDto> queryAssets(String userId) {
        String normalizedUserId = effectiveActorUserId(userId);
        if (!StringUtils.hasText(normalizedUserId)) {
            return List.of();
        }

        List<Asset> assets = queryOwnerAssets(normalizedUserId).stream()
                .filter(asset -> asset != null && !isSuppressedLifecycleStatus(asset.getStatus()))
                .toList();
        Map<String, String> ownerNamesByUserId = resolveOwnerNamesByUserId(assets);
        Map<String, AssetRequestMetricsDto> metricsByAssetId = resolveAssetRequestMetricsByAssetId(assets);
        return assets.stream()
                .map(asset -> toAssetDto(asset, ownerNamesByUserId, normalizedUserId, metricsByAssetId.get(normalizeId(asset.getAssetId()))))
                .filter(Objects::nonNull)
                .toList();
    }

    public AssetDetailDto queryAssetDetail(String userId, String assetId) {
        String normalizedUserId = effectiveActorUserId(userId);
        String normalizedAssetId = normalizeId(assetId);
        if (!StringUtils.hasText(normalizedUserId) || !StringUtils.hasText(normalizedAssetId)) {
            return null;
        }
        return assetsRepository.findByOwnerUserIdAndAssetId(normalizedUserId, normalizedAssetId)
                .filter(asset -> asset != null && !isSuppressedLifecycleStatus(asset.getStatus()))
                .map(asset -> toAssetDetailDto(
                        asset,
                        resolveOwnerNamesByUserId(List.of(asset)),
                        normalizedUserId,
                        resolveAssetRequestMetrics(asset)))
                .orElse(null);
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
        Map<String, String> ownerNamesByUserId = resolveOwnerNamesByUserId(assets);
        Map<String, AssetRequestMetricsDto> metricsByAssetId = resolveAssetRequestMetricsByAssetId(assets);
        return assets.stream()
                .map(asset -> toAssetDto(asset, ownerNamesByUserId, normalizedUserId, metricsByAssetId.get(normalizeId(asset.getAssetId()))))
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
        Map<String, String> ownerNamesByUserId = resolveOwnerNamesByUserId(pageAssets);
        Map<String, AssetRequestMetricsDto> metricsByAssetId = resolveAssetRequestMetricsByAssetId(pageAssets);
        List<AssetDto> items = pageAssets.stream()
                .map(asset -> toAssetDto(asset, ownerNamesByUserId, normalizedUserId, metricsByAssetId.get(normalizeId(asset.getAssetId()))))
                .filter(Objects::nonNull)
                .toList();

        return new AssetExplorePageDto(
                items,
                pageResult.total(),
                pageResult.nextCursor());
    }

    public AssetTicketsPageDto queryTicketPage(String userId, Integer page, Integer pageSize, String order) {
        String normalizedUserId = effectiveActorUserId(userId);
        if (!StringUtils.hasText(normalizedUserId)) {
            return new AssetTicketsPageDto(List.of(), 0);
        }

        int normalizedPage = Math.max(0, page == null ? 0 : page.intValue());
        int normalizedPageSize = Math.max(1, pageSize == null ? 20 : pageSize.intValue());
        boolean upcoming = !"past".equalsIgnoreCase(safeText(order));

        List<AssetTicketDto> ordered = eventParticipationTicketService.queryTicketRecordsForUser(normalizedUserId).stream()
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

    public AssetDto upsert(AssetUpsertRequestDto request) {
        if (request == null || request.asset() == null) {
            return null;
        }
        Asset saved = saveOwnedAsset(normalizeId(request.userId()), request.asset());
        return saved == null ? null : toAssetDto(saved, resolveOwnerNamesByUserId(List.of(saved)), normalizeId(request.userId()));
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
                .filter(asset -> !STATUS_TRASHED.equals(safeText(asset.getStatus())))
                .map(asset -> toTrashedAsset(asset, normalizedUserId, Instant.now().toString()))
                .ifPresent(trashed -> {
                    assetsRepository.save(trashed);
                    handleAssetTrashed(trashed, normalizedUserId);
                    userActivityCountersService.refreshAssetCountersForUser(normalizedUserId);
                });
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
        return toAssetDto(next, resolveOwnerNamesByUserId(List.of(next)), normalizedUserId);
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
        if (!isEligibleAssetManager(current, normalizedUserId)) {
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
        return toAssetDto(next, resolveOwnerNamesByUserId(List.of(next)), normalizedUserId);
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
        AssetRequestRecord targetRequest = findAssetRequest(current, normalizedTargetUserId);
        String targetRequestEventId = assetRequestEventId(targetRequest);
        if (current == null
                || normalizedTargetUserId.equals(normalizeId(current.getOwnerUserId()))
                || !canManageAssetMembers(current, normalizedUserId)
                || !isActiveUser(normalizedTargetUserId)
                || isAcceptedAssetManagerMember(existingMember.orElse(null))
                || !isKnownAssetParticipant(current, normalizedTargetUserId, existingMember.orElse(null))
                || (StringUtils.hasText(targetRequestEventId)
                        && !accessControlService.canReceiveEventAssetManagerRole(targetRequestEventId, normalizedTargetUserId))) {
            return null;
        }

        String nowIso = Instant.now().toString();
        ActivityMember member = existingMember.orElseGet(ActivityMember::new);
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
        member.setActionAtIso(nowIso);
        member.setUpdatedDate(nowIso);
        member.setUpdatedUser(normalizedUserId);
        ActivityMember promotedMember = promoteAssetMemberIfSnapshotCurrent(existingMember.orElse(null), member);
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
        affinityRecomputeTaskService.enqueueAssetChanged(normalizedAssetId, normalizedUserId);
        enqueueAssetManagerPromotedNotification(next, normalizedUserId, normalizedTargetUserId);
        return toAssetDto(next, resolveOwnerNamesByUserId(List.of(next)), normalizedUserId);
    }

    private boolean updateAssetTakeOverIfSnapshotCurrent(Asset current, Asset next) {
        Update update = new Update()
                .set("ownerUserId", normalizeId(next.getOwnerUserId()))
                .set("status", safeText(next.getStatus()))
                .unset("statusBeforeSuppression")
                .set("updatedDate", safeText(next.getUpdatedDate()))
                .set("updatedUser", safeText(next.getUpdatedUser()))
                .set("affinity", next.getAffinity())
                .set("boost", next.getBoost());
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

    public void syncRequestsFromMembers(String assetId, List<ActivityMember> members) {
        Optional<Asset> assetOptional = findAssetByAssetId(assetId);
        if (assetOptional.isEmpty()) {
            return;
        }

        Asset current = assetOptional.get();
        String ownerUserId = normalizeId(current.getOwnerUserId());
        Map<String, AssetRequestRecord> existingByUserId = new LinkedHashMap<>();
        for (AssetRequestRecord request : safeRequests(current.getRequests())) {
            String requestUserId = normalizeId(request.userId());
            if (StringUtils.hasText(requestUserId)) {
                existingByUserId.put(requestUserId, request);
            }
        }

        List<AssetRequestRecord> nextRequests = members == null ? List.of() : members.stream()
                .filter(Objects::nonNull)
                .filter(member -> !ownerUserId.equals(normalizeId(member.getUserId())))
                .filter(member -> !"deleted".equals(normalizeMemberStatus(member.getStatus())))
                .map(member -> toAssetRequest(member, existingByUserId.get(normalizeId(member.getUserId()))))
                .filter(Objects::nonNull)
                .toList();

        Asset next = cloneAsset(current);
        next.setRequests(nextRequests);
        next.setUpdatedDate(Instant.now().toString());
        next.setUpdatedUser(ownerUserId);
        next.setAffinity(resolveAssetAffinity(next, ownerUserId));
        next.setBoost(resolveAssetBoost(next, ownerUserId));
        assetsRepository.save(next);
        affinityRecomputeTaskService.enqueueAssetRequestsChanged(normalizeId(next.getAssetId()), ownerUserId);
        adminTelemetryService.record("asset.requests.changed", "assets", normalizeId(next.getAssetId()), ownerUserId);
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
        Asset saved = proposed;
        if (existing != null) {
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
        affinityRecomputeTaskService.enqueueAssetChanged(normalizeId(saved.getAssetId()), ownerUserId);
        adminTelemetryService.record("asset.saved", "assets", normalizeId(saved.getAssetId()), ownerUserId);
        syncAssetRequestPayments(existing, saved);
        userActivityCountersService.refreshAssetCountersForUser(ownerUserId);
        return saved;
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
            if (!canApplyAddedOrUpdatedAssetRequestPolicy(assetId, previous, next, fullAssetWriteAllowed)) {
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
        if (previous == null) {
            if (MEMBER_STATUS_ACCEPTED.equals(normalizeRequestStatus(next.status()))) {
                return accessControlService.canCurrentActorApproveAssetBorrow(requesterUserId, assetId);
            }
            return accessControlService.canCurrentActorRequestAssetBorrow(requesterUserId, assetRequestEventId(next));
        }

        String previousStatus = normalizeRequestStatus(previous.status());
        String nextStatus = normalizeRequestStatus(next.status());
        if ("pending".equals(previousStatus) && MEMBER_STATUS_ACCEPTED.equals(nextStatus)) {
            return accessControlService.canCurrentActorApproveAssetBorrow(requesterUserId, assetId);
        }
        if ("pending".equals(previousStatus) && "pending".equals(nextStatus)) {
            return accessControlService.canCurrentActorRequestAssetBorrow(requesterUserId, assetRequestEventId(next));
        }
        if (MEMBER_STATUS_ACCEPTED.equals(previousStatus) && MEMBER_STATUS_ACCEPTED.equals(nextStatus)) {
            return fullAssetWriteAllowed;
        }
        return false;
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
        next.setQuantity(proposed.getQuantity());
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
                        nextCancellationPolicy);
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
        clone.setRequests(new ArrayList<>(safeRequests(source.getRequests())));
        clone.setVisibility(source.getVisibility());
        clone.setStatus(source.getStatus());
        clone.setStatusBeforeSuppression(source.getStatusBeforeSuppression());
        clone.setTrashedAtIso(source.getTrashedAtIso());
        clone.setAffinity(source.getAffinity());
        clone.setBoost(source.getBoost());
        clone.setCreatedDate(source.getCreatedDate());
        clone.setCreatedUser(source.getCreatedUser());
        clone.setUpdatedDate(source.getUpdatedDate());
        clone.setUpdatedUser(source.getUpdatedUser());
        return clone;
    }

    private AssetTicketDto toAssetTicketDto(ActivityEvent event) {
        String sourceId = normalizeId(event.getSourceId());
        if (!StringUtils.hasText(sourceId)) {
            return null;
        }
        boolean admin = Boolean.TRUE.equals(event.getIsAdmin());
        return new AssetTicketDto(
                sourceId,
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
                safeText(event.getCreatorInitials()));
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

    private Map<String, String> resolveOwnerNamesByUserId(List<Asset> assets) {
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

        Map<String, String> ownerNamesByUserId = new LinkedHashMap<>();
        for (String ownerUserId : ownerUserIds) {
            Users owner = usersById.get(ownerUserId);
            ownerNamesByUserId.put(ownerUserId, owner == null ? null : safeText(owner.getName()));
        }
        return ownerNamesByUserId;
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
                new Document("$gt", List.of(quantity, 0)),
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
                        new Document("$or", List.of(
                                new Document("$eq", List.of("$$request.status", MEMBER_STATUS_ACCEPTED)),
                                new Document("$eq", List.of("$$request.requestKind", "manual")))),
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
        Map<String, String> ownerUserIdByAssetId = new LinkedHashMap<>();
        for (Asset asset : assets) {
            String assetId = normalizeId(asset == null ? null : asset.getAssetId());
            String ownerUserId = normalizeId(asset == null ? null : asset.getOwnerUserId());
            if (StringUtils.hasText(assetId) && StringUtils.hasText(ownerUserId)) {
                ownerUserIdByAssetId.put(assetId, ownerUserId);
            }
        }
        if (ownerUserIdByAssetId.isEmpty()) {
            return Map.of();
        }
        List<AssetRequest> requests = mongoTemplate.find(
                Query.query(Criteria.where("assetId").in(ownerUserIdByAssetId.keySet())),
                AssetRequest.class);
        Map<String, List<AssetRequest>> requestsByAssetId = new LinkedHashMap<>();
        for (AssetRequest request : requests == null ? List.<AssetRequest>of() : requests) {
            String assetId = normalizeId(request == null ? null : request.assetId());
            String ownerUserId = normalizeId(request == null ? null : request.ownerUserId());
            if (!StringUtils.hasText(assetId) || !Objects.equals(ownerUserIdByAssetId.get(assetId), ownerUserId)) {
                continue;
            }
            requestsByAssetId.computeIfAbsent(assetId, ignored -> new ArrayList<>()).add(request);
        }
        Map<String, AssetRequestMetricsDto> metricsByAssetId = new LinkedHashMap<>();
        for (String assetId : ownerUserIdByAssetId.keySet()) {
            metricsByAssetId.put(assetId, toAssetRequestMetrics(requestsByAssetId.getOrDefault(assetId, List.of())));
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

    private AssetRequestMetricsDto toAssetRequestMetrics(Collection<AssetRequest> requests) {
        int assignedItems = 0;
        int borrowedItems = 0;
        int pendingItems = 0;
        for (AssetRequest request : requests == null ? List.<AssetRequest>of() : requests) {
            if (!isLaterAssetRequest(request)) {
                continue;
            }
            if (isManualAssetRequest(request)) {
                assignedItems++;
            } else if (MEMBER_STATUS_ACCEPTED.equals(normalizeRequestStatus(request == null ? null : request.status()))) {
                borrowedItems++;
            } else if ("pending".equals(normalizeRequestStatus(request == null ? null : request.status()))) {
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

    private boolean isLaterAssetRequest(AssetRequest request) {
        long endAtMs = assetRequestEndAtMs(request);
        return endAtMs != Long.MIN_VALUE && endAtMs >= System.currentTimeMillis();
    }

    private long assetRequestEndAtMs(AssetRequest request) {
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

    private boolean isManualAssetRequest(AssetRequest request) {
        return "manual".equals(normalizeAssetRequestKind(request == null ? null : request.requestKind()));
    }

    private AssetDto toAssetDto(Asset asset, Map<String, String> ownerNamesByUserId, String viewerUserId) {
        return toAssetDto(asset, ownerNamesByUserId, viewerUserId, resolveAssetRequestMetrics(asset));
    }

    private AssetDto toAssetDto(
            Asset asset,
            Map<String, String> ownerNamesByUserId,
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
                resolveOwnerName(asset.getOwnerUserId(), ownerNamesByUserId),
                toAssetRequestDtos(asset, viewerUserId),
                normalizeAssetRequestMetrics(metrics),
                resolveAssetMenuActions(asset, viewerUserId));
    }

    private AssetDetailDto toAssetDetailDto(Asset asset, Map<String, String> ownerNamesByUserId, String viewerUserId) {
        return toAssetDetailDto(asset, ownerNamesByUserId, viewerUserId, resolveAssetRequestMetrics(asset));
    }

    private AssetDetailDto toAssetDetailDto(
            Asset asset,
            Map<String, String> ownerNamesByUserId,
            String viewerUserId,
            AssetRequestMetricsDto metrics) {
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
                resolveOwnerName(asset.getOwnerUserId(), ownerNamesByUserId),
                toAssetRequestDtos(asset, viewerUserId),
                normalizeAssetRequestMetrics(metrics),
                resolveAssetMenuActions(asset, viewerUserId));
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
        if (pricing == null) {
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
                existing != null ? normalizeAssetRequestKind(existing.requestKind()) : "borrow",
                existing != null
                        ? safeNullableText(existing.requestedAtIso())
                        : safeNullableText(normalizeDateTime(member.getActionAtIso(), Instant.now().toString())),
                existing != null ? cloneRequestBooking(existing.booking()) : null);
    }

    private List<AssetMemberRequestDto> toAssetRequestDtos(Asset asset, String viewerUserId) {
        List<AssetMemberRequestDto> next = new ArrayList<>();
        List<AssetRequestRecord> requests = safeRequests(asset.getRequests());
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

    private List<String> resolveAssetMenuActions(Asset asset, String viewerUserId) {
        String normalizedViewerUserId = normalizeId(viewerUserId);
        if (asset == null || !StringUtils.hasText(normalizedViewerUserId)) {
            return List.of();
        }
        boolean owner = normalizedViewerUserId.equals(normalizeId(asset.getOwnerUserId()));
        boolean manager = owner || hasAcceptedAssetManagerRole(asset, normalizedViewerUserId);
        String status = safeText(asset.getStatus());
        if (STATUS_TRASHED.equals(status)) {
            return owner ? List.of("restore") : List.of();
        }
        if (!manager) {
            return List.of("share");
        }
        LinkedHashSet<String> actions = new LinkedHashSet<>();
        if (STATUS_UNDER_REVIEW.equals(status) && isActiveUser(normalizedViewerUserId)) {
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
            return true;
        }
        return hasAcceptedAssetManagerRole(asset, normalizedUserId);
    }

    private boolean canManageAssetMembers(Asset asset, String userId) {
        String normalizedUserId = normalizeId(userId);
        if (asset == null
                || !StringUtils.hasText(normalizedUserId)
                || !isActiveUser(normalizedUserId)
                || STATUS_TRASHED.equals(safeText(asset.getStatus()))) {
            return false;
        }
        return normalizedUserId.equals(normalizeId(asset.getOwnerUserId()))
                || hasAcceptedAssetManagerRole(asset, normalizedUserId);
    }

    private boolean hasAcceptedAssetManagerRole(Asset asset, String userId) {
        String normalizedUserId = normalizeId(userId);
        if (asset == null || !StringUtils.hasText(normalizedUserId)) {
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
        List<String> recipients = activeResponsibleAssetUserIds(previous == null ? next : previous).stream()
                .filter(userId -> !normalizedActorUserId.equals(userId))
                .toList();
        if (recipients.isEmpty()) {
            return;
        }
        String title = "Asset responsibility changed";
        String body = assetTitle(next) + " was taken over by an active manager.";
        notificationOutboxService.enqueue(new NotificationIntent(
                "asset-takeover",
                "asset",
                assetId,
                "asset-active-managers",
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
                "asset-manager-promoted-" + assetId,
                Map.of(
                        "assetId", assetId,
                        "assetTitle", assetTitle(asset),
                        "targetUserId", normalizedTargetUserId,
                        "actorUserId", normalizedActorUserId),
                normalizedActorUserId));
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
        if (StringUtils.hasText(ownerUserId)) {
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

    private String resolveOwnerName(String ownerUserId, Map<String, String> ownerNamesByUserId) {
        String normalizedOwnerUserId = normalizeId(ownerUserId);
        if (!StringUtils.hasText(normalizedOwnerUserId)) {
            return null;
        }
        if (ownerNamesByUserId != null && ownerNamesByUserId.containsKey(normalizedOwnerUserId)) {
            return ownerNamesByUserId.get(normalizedOwnerUserId);
        }
        return usersRepository.findByUserId(normalizedOwnerUserId)
                .map(Users::getName)
                .map(this::safeText)
                .orElse(null);
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
        int parsed = Math.max(0, normalizeCount(value));
        if (parsed > 0) {
            return parsed;
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
        return next;
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
                || StringUtils.hasText(booking.currency())
                || !normalizeStrings(booking.acceptedPolicyIds()).isEmpty()
                || StringUtils.hasText(booking.paymentSessionId())
                || Boolean.TRUE.equals(booking.inventoryApplied()));
    }

    private String assetRequestPaymentSessionId(AssetRequestRecord request) {
        return normalizeId(request == null || request.booking() == null ? null : request.booking().paymentSessionId());
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

    private String effectiveActorUserId(String userId) {
        String normalizedUserId = normalizeId(userId);
        return StringUtils.hasText(normalizedUserId) ? normalizedUserId : currentActorUserId();
    }

    private String normalizeAssetType(String type) {
        String normalizedType = safeText(type);
        return AssetCatalog.ASSET_TYPES.contains(normalizedType) ? normalizedType : null;
    }

    private String normalizeAssetRequestKind(String kind) {
        return "manual".equals(safeText(kind)) ? "manual" : "borrow";
    }

    private String normalizeRequestStatus(String status) {
        return "accepted".equals(safeText(status)) ? "accepted" : "pending";
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

    private String safeText(String value) {
        return value == null ? "" : value.trim();
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
