package com.raxim.myscoutee.profile.service;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.Instant;
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
import org.jsoup.Jsoup;
import org.jsoup.nodes.Element;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.mongodb.client.result.UpdateResult;

import com.raxim.myscoutee.common.config.properties.AssetSourceRefreshProperties;
import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.ActivityMember;
import com.raxim.myscoutee.profile.data.document.Asset;
import com.raxim.myscoutee.profile.data.document.Asset.AssetPolicyRecord;
import com.raxim.myscoutee.profile.data.document.Asset.AssetRequestRecord;
import com.raxim.myscoutee.profile.data.document.Asset.AssetRequestBookingRecord;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetDeleteRequestDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetMakeManagerRequestDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetReplaceRequestDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetSourceRefreshRequestDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetSourceRefreshResponseDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetTicketsPageDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetUpsertRequestDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventRecordDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.AssetRequestBookingDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.AssetCardDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.AssetMemberRequestDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.PolicyItemDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.PricingCancellationPolicyDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.PricingConfigDto;
import com.raxim.myscoutee.profile.repository.ActivityMembersRepository;
import com.raxim.myscoutee.profile.repository.AssetsRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;
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
    private static final String OWNER_TYPE_ASSET = "asset";
    private static final String ROLE_ADMIN = "Admin";
    private static final String ROLE_MANAGER = "Manager";
    private static final String MEMBER_STATUS_ACCEPTED = "accepted";

    private static final Set<String> ASSET_TYPES = Set.of("Car", "Accommodation", "Supplies");

    private final AssetsRepository assetsRepository;
    private final UsersRepository usersRepository;
    private final ActivityMembersRepository activityMembersRepository;
    private final EventParticipationTicketService eventParticipationTicketService;
    private final PaymentService paymentService;
    private final MongoTemplate mongoTemplate;
    private final AssetSourceRefreshProperties assetSourceRefreshProperties;
    private final AbsoluteAffinityService absoluteAffinityService;
    private final AffinityRecomputeTaskService affinityRecomputeTaskService;
    private final AdminTelemetryService adminTelemetryService;
    private final NotificationOutboxService notificationOutboxService;
    private final ChatAttachmentLifecycleService chatAttachmentLifecycleService;

    public AssetsService(
            AssetsRepository assetsRepository,
            UsersRepository usersRepository,
            ActivityMembersRepository activityMembersRepository,
            EventParticipationTicketService eventParticipationTicketService,
            PaymentService paymentService,
            MongoTemplate mongoTemplate,
            AssetSourceRefreshProperties assetSourceRefreshProperties,
            AbsoluteAffinityService absoluteAffinityService,
            AffinityRecomputeTaskService affinityRecomputeTaskService,
            AdminTelemetryService adminTelemetryService,
            NotificationOutboxService notificationOutboxService,
            ChatAttachmentLifecycleService chatAttachmentLifecycleService) {
        this.assetsRepository = assetsRepository;
        this.usersRepository = usersRepository;
        this.activityMembersRepository = activityMembersRepository;
        this.eventParticipationTicketService = eventParticipationTicketService;
        this.paymentService = paymentService;
        this.mongoTemplate = mongoTemplate;
        this.assetSourceRefreshProperties = assetSourceRefreshProperties;
        this.absoluteAffinityService = absoluteAffinityService;
        this.affinityRecomputeTaskService = affinityRecomputeTaskService;
        this.adminTelemetryService = adminTelemetryService;
        this.notificationOutboxService = notificationOutboxService;
        this.chatAttachmentLifecycleService = chatAttachmentLifecycleService;
    }

    public List<AssetCardDto> queryAssets(String userId) {
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(normalizedUserId)) {
            return List.of();
        }

        List<Asset> assets = queryOwnerAssets(normalizedUserId).stream()
                .filter(asset -> asset != null && !isSuppressedLifecycleStatus(asset.getStatus()))
                .toList();
        Map<String, String> ownerNamesByUserId = resolveOwnerNamesByUserId(assets);
        return assets.stream()
                .map(asset -> toDto(asset, ownerNamesByUserId, normalizedUserId))
                .filter(Objects::nonNull)
                .toList();
    }

    public List<AssetCardDto> queryVisibleAssets(String userId, String type, String category) {
        String normalizedUserId = normalizeId(userId);
        String normalizedType = normalizeAssetType(type);
        String normalizedCategory = safeText(category);
        if (!StringUtils.hasText(normalizedUserId) || !StringUtils.hasText(normalizedType)) {
            return List.of();
        }

        double viewerAffinity = resolveStoredUserAffinity(normalizedUserId);
        return assetsRepository.findAll().stream()
                .filter(Objects::nonNull)
                .filter(asset -> normalizedType.equals(normalizeAssetType(asset.getType())))
                .filter(asset -> !normalizedUserId.equals(normalizeId(asset.getOwnerUserId())))
                .filter(asset -> !StringUtils.hasText(normalizedCategory) || normalizedCategory.equals(safeText(asset.getCategory())))
                .filter(asset -> shouldIncludeExploreAsset(asset, normalizedUserId))
                .sorted(visibleAssetComparator(viewerAffinity))
                .map(this::toDto)
                .filter(Objects::nonNull)
                .toList();
    }

    public AssetTicketsPageDto queryTicketPage(String userId, Integer page, Integer pageSize, String order) {
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(normalizedUserId)) {
            return new AssetTicketsPageDto(List.of(), 0);
        }

        int normalizedPage = Math.max(0, page == null ? 0 : page.intValue());
        int normalizedPageSize = Math.max(1, pageSize == null ? 20 : pageSize.intValue());
        boolean upcoming = !"past".equalsIgnoreCase(safeText(order));

        List<EventRecordDto> ordered = eventParticipationTicketService.queryTicketRecordsForUser(normalizedUserId).stream()
                .filter(Objects::nonNull)
                .map(this::toTicketEventRecordDto)
                .filter(Objects::nonNull)
                .sorted(Comparator.comparing((EventRecordDto item) -> toSortableDate(item.startAtIso())))
                .toList();

        List<EventRecordDto> visible = new ArrayList<>(ordered.stream()
                .filter(item -> matchesTicketOrder(item, upcoming))
                .toList());
        if (!upcoming) {
            java.util.Collections.reverse(visible);
        }

        int startIndex = Math.min(visible.size(), normalizedPage * normalizedPageSize);
        int endIndex = Math.min(visible.size(), startIndex + normalizedPageSize);
        return new AssetTicketsPageDto(visible.subList(startIndex, endIndex), visible.size());
    }

    public void upsert(AssetUpsertRequestDto request) {
        if (request == null || request.asset() == null) {
            return;
        }
        saveOwnedAsset(normalizeId(request.userId()), request.asset());
    }

    public void replace(AssetReplaceRequestDto request) {
        if (request == null) {
            return;
        }
        String normalizedUserId = normalizeId(request.userId());
        if (!StringUtils.hasText(normalizedUserId)) {
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
        for (AssetCardDto assetDto : safeAssets(request.assets())) {
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
        assetsRepository.findByOwnerUserIdAndAssetId(normalizedUserId, normalizedAssetId)
                .filter(asset -> !STATUS_TRASHED.equals(safeText(asset.getStatus())))
                .map(asset -> toTrashedAsset(asset, normalizedUserId, Instant.now().toString()))
                .ifPresent(trashed -> {
                    assetsRepository.save(trashed);
                    handleAssetTrashed(trashed, normalizedUserId);
                });
    }

    public AssetCardDto restore(AssetDeleteRequestDto request) {
        if (request == null) {
            return null;
        }
        String normalizedUserId = normalizeId(request.userId());
        String normalizedAssetId = normalizeId(request.assetId());
        if (!StringUtils.hasText(normalizedUserId) || !StringUtils.hasText(normalizedAssetId)) {
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
        return toDto(next, resolveOwnerNamesByUserId(List.of(next)), normalizedUserId);
    }

    public AssetCardDto takeOver(AssetDeleteRequestDto request) {
        if (request == null) {
            return null;
        }
        String normalizedUserId = normalizeId(request.userId());
        String normalizedAssetId = normalizeId(request.assetId());
        if (!StringUtils.hasText(normalizedUserId) || !StringUtils.hasText(normalizedAssetId)) {
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
        return toDto(next, resolveOwnerNamesByUserId(List.of(next)), normalizedUserId);
    }

    public AssetCardDto makeManager(AssetMakeManagerRequestDto request) {
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
        return toDto(next, resolveOwnerNamesByUserId(List.of(next)), normalizedUserId);
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

    public AssetSourceRefreshResponseDto refreshFromSource(AssetSourceRefreshRequestDto request) {
        String normalizedUrl = normalizeExternalUrl(request == null ? null : request.sourceLink());
        boolean enabled = assetSourceRefreshProperties.isEnabled();
        if (!StringUtils.hasText(normalizedUrl)) {
            return new AssetSourceRefreshResponseDto(enabled, false, normalizedUrl, null, null, null, null);
        }
        if (!enabled) {
            return new AssetSourceRefreshResponseDto(false, false, normalizedUrl, null, null, null, null);
        }

        URI uri = toUri(normalizedUrl);
        String normalizedHost = normalizeHost(uri == null ? null : uri.getHost());
        if (!isAllowedRefreshHost(normalizedHost)) {
            return new AssetSourceRefreshResponseDto(true, false, normalizedUrl, null, null, null, null);
        }

        try {
            org.jsoup.nodes.Document document = Jsoup.connect(normalizedUrl)
                    .userAgent("Mozilla/5.0 (compatible; MyScouteeBot/1.0)")
                    .timeout(Math.max(1000, assetSourceRefreshProperties.getTimeoutMs()))
                    .followRedirects(false)
                    .get();
            String finalUrl = normalizeExternalUrl(document.location());
            String title = firstMetaContent(document, "property", "og:title");
            if (!StringUtils.hasText(title)) {
                title = safeText(document.title());
            }
            String subtitle = firstMetaContent(document, "property", "og:site_name");
            if (!StringUtils.hasText(subtitle)) {
                subtitle = normalizedHost;
            }
            String details = firstMetaContent(document, "property", "og:description");
            if (!StringUtils.hasText(details)) {
                details = firstMetaContent(document, "name", "description");
            }
            String imageUrl = firstMetaContent(document, "property", "og:image");
            if (!StringUtils.hasText(imageUrl)) {
                imageUrl = firstMetaContent(document, "name", "twitter:image");
            }
            return new AssetSourceRefreshResponseDto(
                    true,
                    true,
                    StringUtils.hasText(finalUrl) ? finalUrl : normalizedUrl,
                    safeNullableText(title),
                    safeNullableText(subtitle),
                    safeNullableText(details),
                    safeNullableText(imageUrl));
        } catch (IOException ex) {
            return new AssetSourceRefreshResponseDto(true, true, normalizedUrl, null, null, null, null);
        }
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

    private AssetCardDto saveOwnedAsset(String ownerUserId, AssetCardDto assetDto) {
        if (!StringUtils.hasText(ownerUserId)) {
            return null;
        }

        Asset existing = assetsRepository.findByOwnerUserIdAndAssetId(ownerUserId, normalizeId(assetDto.id())).orElse(null);
        Asset saved = toDocument(assetDto, ownerUserId, existing);
        if (saved == null) {
            return null;
        }
        assetsRepository.save(saved);
        affinityRecomputeTaskService.enqueueAssetChanged(normalizeId(saved.getAssetId()), ownerUserId);
        adminTelemetryService.record("asset.saved", "assets", normalizeId(saved.getAssetId()), ownerUserId);
        syncAssetRequestPayments(existing, saved);
        return toDto(saved);
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

    private Asset toDocument(AssetCardDto dto, String ownerUserId, Asset current) {
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

    private EventRecordDto toTicketEventRecordDto(ActivityEvent event) {
        String sourceId = normalizeId(event.getSourceId());
        if (!StringUtils.hasText(sourceId)) {
            return null;
        }
        EventMemberSnapshot memberSnapshot = resolveEventMemberSnapshot(event);
        return new EventRecordDto(
                sourceId,
                normalizeId(event.getOwnerUserId()),
                safeText(event.getType()),
                safeText(event.getStatus()),
                safeText(event.getAvatar()),
                safeText(event.getTitle()),
                safeText(event.getSubtitle()),
                safeText(event.getTimeframe()),
                StringUtils.hasText(event.getInviter()) ? event.getInviter().trim() : null,
                normalizeCount(event.getUnread()),
                normalizeCount(event.getActivity()),
                Boolean.TRUE.equals(event.getIsAdmin()),
                Boolean.TRUE.equals(event.getIsInvitation()),
                Boolean.TRUE.equals(event.getIsHosting()),
                Boolean.TRUE.equals(event.getIsTrashed()),
                Boolean.FALSE.equals(event.getPublished()) ? Boolean.FALSE : Boolean.TRUE,
                safeNullableText(event.getTrashedAtIso()),
                normalizeId(event.getCreatorUserId()),
                safeText(event.getCreatorName()),
                safeText(event.getCreatorInitials()),
                safeText(event.getCreatorGender()),
                safeText(event.getCreatorCity()),
                safeText(event.getVisibility()),
                safeText(event.getBlindMode()),
                safeNullableText(event.getStartAtIso()),
                safeNullableText(event.getEndAtIso()),
                safeDouble(event.getDistanceKm()),
                safeText(event.getImageUrl()),
                safeText(event.getSourceLink()),
                safeText(event.getLocation()),
                event.getLocationCoordinates(),
                nullableCount(event.getCapacityMin()),
                nullableCount(event.getCapacityMax()),
                normalizeCount(event.getCapacityTotal()),
                Boolean.TRUE.equals(event.getAutoInviter()),
                safeText(event.getFrequency()),
                Boolean.TRUE.equals(event.getTicketing()),
                clonePricing(event.getPricing()),
                event.getPolicies() == null ? List.of() : new ArrayList<>(event.getPolicies()),
                Boolean.TRUE.equals(event.getSlotsEnabled()),
                event.getSlotTemplates() == null ? List.of() : new ArrayList<>(event.getSlotTemplates()),
                safeNullableText(event.getParentEventId()),
                safeNullableText(event.getSlotTemplateId()),
                Boolean.TRUE.equals(event.getGenerated()),
                safeText(event.getEventType()),
                null,
                List.of(),
                memberSnapshot.acceptedUserIds().size(),
                memberSnapshot.pendingUserIds().size(),
                normalizeStrings(event.getTopics()),
                event.getSubEvents() == null ? List.of() : new ArrayList<>(event.getSubEvents()),
                safeText(event.getSubEventsDisplayMode()),
                safeDouble(event.getRating()),
                safeDouble(event.getBoost()),
                safeDouble(event.getAffinity()));
    }

    private EventMemberSnapshot resolveEventMemberSnapshot(ActivityEvent event) {
        String eventId = event == null ? null : normalizeId(event.getSourceId());
        String creatorUserId = event == null ? null : normalizeId(event.getCreatorUserId());
        if (!StringUtils.hasText(eventId)) {
            return new EventMemberSnapshot(List.of(), List.of());
        }

        Query query = Query.query(Criteria.where("ownerType").is("event").and("ownerId").is(eventId));
        List<ActivityMember> members = mongoTemplate.find(query, ActivityMember.class);
        LinkedHashSet<String> acceptedUserIds = new LinkedHashSet<>();
        LinkedHashSet<String> pendingUserIds = new LinkedHashSet<>();
        for (ActivityMember member : members) {
            if (member == null) {
                continue;
            }
            String memberUserId = normalizeId(member.getUserId());
            if (!StringUtils.hasText(memberUserId)) {
                continue;
            }
            if ("pending".equals(normalizeMemberStatus(member.getStatus()))) {
                pendingUserIds.add(memberUserId);
            } else {
                acceptedUserIds.add(memberUserId);
            }
        }
        if (acceptedUserIds.isEmpty() && StringUtils.hasText(creatorUserId)) {
            acceptedUserIds.add(creatorUserId);
        }
        pendingUserIds.removeAll(acceptedUserIds);
        return new EventMemberSnapshot(new ArrayList<>(acceptedUserIds), new ArrayList<>(pendingUserIds));
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

    private Comparator<Asset> visibleAssetComparator(double viewerAffinity) {
        return Comparator
                .comparingDouble((Asset asset) -> -assetExploreScore(asset, viewerAffinity))
                .thenComparing(asset -> safeText(asset.getTitle()))
                .thenComparing(asset -> normalizeId(asset.getAssetId()));
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

    private AssetCardDto toDto(Asset asset) {
        return toDto(asset, Map.of(), null);
    }

    private AssetCardDto toDto(Asset asset, Map<String, String> ownerNamesByUserId, String viewerUserId) {
        if (asset == null || !StringUtils.hasText(normalizeId(asset.getAssetId()))) {
            return null;
        }
        return new AssetCardDto(
                normalizeId(asset.getAssetId()),
                normalizeAssetType(asset.getType()),
                safeText(asset.getTitle()),
                safeText(asset.getSubtitle()),
                safeText(asset.getCategory()),
                safeText(asset.getCity()),
                Math.max(1, normalizeCount(asset.getCapacityTotal())),
                normalizeAssetQuantity(normalizeAssetType(asset.getType()), asset.getQuantity(), asset.getCapacityTotal()),
                safeText(asset.getDetails()),
                safeText(asset.getImageUrl()),
                safeText(asset.getSourceLink()),
                normalizeStrings(asset.getRoutes()),
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
                resolveAssetMenuActions(asset, viewerUserId));
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
        if (booking == null) {
            booking = fallbackSeededRequestBooking(asset, index);
        }
        String requestedAtIso = safeNullableText(request.requestedAtIso());
        if (!StringUtils.hasText(requestedAtIso) && booking != null && StringUtils.hasText(booking.startAtIso())) {
            requestedAtIso = fallbackSeededRequestedAtIso(booking.startAtIso(), index);
        }
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

    private boolean isAllowedRefreshHost(String host) {
        if (!StringUtils.hasText(host)) {
            return false;
        }
        for (String allowedHost : assetSourceRefreshProperties.getAllowedHosts()) {
            String normalizedAllowedHost = normalizeHost(allowedHost);
            if (!StringUtils.hasText(normalizedAllowedHost)) {
                continue;
            }
            if (host.equals(normalizedAllowedHost) || host.endsWith("." + normalizedAllowedHost)) {
                return true;
            }
        }
        return false;
    }

    private String firstMetaContent(org.jsoup.nodes.Document document, String attributeName, String attributeValue) {
        if (document == null || !StringUtils.hasText(attributeName) || !StringUtils.hasText(attributeValue)) {
            return "";
        }
        for (Element element : document.select("meta[" + attributeName + "]")) {
            if (!attributeValue.equalsIgnoreCase(safeText(element.attr(attributeName)))) {
                continue;
            }
            String absoluteContent = safeText(element.absUrl("content"));
            if (StringUtils.hasText(absoluteContent)) {
                return absoluteContent;
            }
            String content = safeText(element.attr("content"));
            if (StringUtils.hasText(content)) {
                return content;
            }
        }
        return "";
    }

    private List<AssetCardDto> safeAssets(List<AssetCardDto> assets) {
        return assets == null ? List.of() : assets;
    }

    private Integer normalizeAssetQuantity(String type, Object value, Object capacityFallback) {
        int parsed = Math.max(0, normalizeCount(value));
        if (parsed > 0) {
            return parsed;
        }
        if ("Supplies".equals(type)) {
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

    private AssetRequestBookingDto fallbackSeededRequestBooking(Asset asset, int index) {
        if (asset == null) {
            return null;
        }
        SeededAssetRequestSlot slot = seededAssetRequestSlot(safeText(asset.getTitle()), index);
        if (slot == null) {
            return null;
        }
        return new AssetRequestBookingDto(
                slugifySeededRequestValue(slot.eventTitle()) + "-event",
                slot.eventTitle(),
                slugifySeededRequestValue(slot.subEventTitle()) + "-subevent",
                slot.subEventTitle(),
                slugifySeededRequestValue(asset.getTitle()) + ":" + (index + 1),
                slot.subEventTitle(),
                slot.timeframe(),
                slot.startAtIso(),
                slot.endAtIso(),
                1,
                null,
                null,
                List.of(),
                null,
                null);
    }

    private SeededAssetRequestSlot seededAssetRequestSlot(String assetTitle, int index) {
        int slotIndex = Math.max(0, index);
        return switch (safeText(assetTitle)) {
            case "Camping Gear Kit" -> slotIndex % 2 == 0
                    ? new SeededAssetRequestSlot("Forest Basecamp Weekend", "Camp Setup", "Apr 18 5:00 PM - Apr 20 12:00 PM", "2026-04-18T15:00:00.000Z", "2026-04-20T10:00:00.000Z")
                    : new SeededAssetRequestSlot("Forest Basecamp Weekend", "Night Watch", "Apr 19 8:00 PM - Apr 20 10:00 AM", "2026-04-19T18:00:00.000Z", "2026-04-20T08:00:00.000Z");
            case "Game Night Box" -> slotIndex % 2 == 0
                    ? new SeededAssetRequestSlot("Indoor Strategy Social", "Board Game Lounge", "May 2 7:30 PM - 12:00 AM", "2026-05-02T17:30:00.000Z", "2026-05-02T22:00:00.000Z")
                    : new SeededAssetRequestSlot("Indoor Strategy Social", "Late Table Finals", "May 2 10:00 PM - May 3 2:30 AM", "2026-05-02T20:00:00.000Z", "2026-05-03T00:30:00.000Z");
            case "South Congress Loft" -> slotIndex % 2 == 0
                    ? new SeededAssetRequestSlot("Austin Host Meetup", "Weekend Stay", "Jun 12 4:00 PM - Jun 14 1:00 PM", "2026-06-12T14:00:00.000Z", "2026-06-14T11:00:00.000Z")
                    : new SeededAssetRequestSlot("Austin Host Meetup", "Overflow Rooms", "Jun 13 7:00 PM - Jun 14 12:00 PM", "2026-06-13T17:00:00.000Z", "2026-06-14T10:00:00.000Z");
            case "Eastside Guest Room" -> slotIndex % 2 == 0
                    ? new SeededAssetRequestSlot("Sunrise Photo Walk", "Overnight Stay", "Jul 3 8:00 PM - Jul 4 11:00 AM", "2026-07-03T18:00:00.000Z", "2026-07-04T09:00:00.000Z")
                    : new SeededAssetRequestSlot("Sunrise Photo Walk", "Second Night", "Jul 4 8:00 PM - Jul 5 11:00 AM", "2026-07-04T18:00:00.000Z", "2026-07-05T09:00:00.000Z");
            case "City-to-Lake SUV" -> switch (slotIndex % 3) {
                case 0 -> new SeededAssetRequestSlot("Lake Cleanup Trip", "Departure Ride", "May 9 9:30 AM - 12:30 PM", "2026-05-09T07:30:00.000Z", "2026-05-09T10:30:00.000Z");
                case 1 -> new SeededAssetRequestSlot("Lake Cleanup Trip", "Return Ride", "May 9 6:00 PM - 9:00 PM", "2026-05-09T16:00:00.000Z", "2026-05-09T19:00:00.000Z");
                default -> new SeededAssetRequestSlot("Trail Weekend", "Gear Shuttle", "May 16 11:00 AM - 2:30 PM", "2026-05-16T09:00:00.000Z", "2026-05-16T12:30:00.000Z");
            };
            case "Airport Shuttle Hatchback" -> switch (slotIndex % 3) {
                case 0 -> new SeededAssetRequestSlot("Late Arrival Crew", "Airport Pickup", "Aug 21 11:30 PM - Aug 22 1:45 AM", "2026-08-21T21:30:00.000Z", "2026-08-21T23:45:00.000Z");
                case 1 -> new SeededAssetRequestSlot("Late Arrival Crew", "Hotel Dropoff", "Aug 22 2:00 AM - 3:15 AM", "2026-08-22T00:00:00.000Z", "2026-08-22T01:15:00.000Z");
                default -> new SeededAssetRequestSlot("Night Market Run", "Pickup Loop", "Aug 28 8:30 PM - 11:00 PM", "2026-08-28T18:30:00.000Z", "2026-08-28T21:00:00.000Z");
            };
            default -> null;
        };
    }

    private String fallbackSeededRequestedAtIso(String startAtIso, int index) {
        try {
            Instant start = Instant.parse(startAtIso);
            return start.minusSeconds((long) (index + 2) * 24 * 60 * 60).toString();
        } catch (Exception ignored) {
            return null;
        }
    }

    private String slugifySeededRequestValue(String value) {
        String normalized = safeText(value).toLowerCase().replaceAll("[^a-z0-9]+", "-");
        return normalized.replaceAll("(^-|-$)", "");
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

    private record SeededAssetRequestSlot(
            String eventTitle,
            String subEventTitle,
            String timeframe,
            String startAtIso,
            String endAtIso) {
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

    private record EventMemberSnapshot(List<String> acceptedUserIds, List<String> pendingUserIds) {
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

    private String normalizeExternalUrl(String value) {
        String trimmed = safeText(value);
        if (!StringUtils.hasText(trimmed)) {
            return "";
        }
        String candidate = trimmed.matches("^[a-zA-Z][a-zA-Z0-9+.-]*://.*$") ? trimmed : "https://" + trimmed;
        URI uri = toUri(candidate);
        if (uri == null || !StringUtils.hasText(uri.getHost())) {
            return "";
        }
        String scheme = StringUtils.hasText(uri.getScheme()) ? uri.getScheme().toLowerCase() : "https";
        if (!"http".equals(scheme) && !"https".equals(scheme)) {
            return "";
        }
        return uri.normalize().toString();
    }

    private URI toUri(String value) {
        try {
            return new URI(value);
        } catch (URISyntaxException ex) {
            return null;
        }
    }

    private String normalizeId(String value) {
        String normalizedValue = safeText(value);
        return StringUtils.hasText(normalizedValue) ? normalizedValue : null;
    }

    private String normalizeHost(String value) {
        return safeText(value).toLowerCase();
    }

    private String normalizeAssetType(String type) {
        String normalizedType = safeText(type);
        return ASSET_TYPES.contains(normalizedType) ? normalizedType : null;
    }

    private String normalizeAssetRequestKind(String kind) {
        return "manual".equals(safeText(kind)) ? "manual" : "borrow";
    }

    private String normalizeRequestStatus(String status) {
        return "accepted".equals(safeText(status)) ? "accepted" : "pending";
    }

    private String normalizeGender(String value) {
        return "woman".equals(safeText(value)) ? "woman" : "man";
    }

    private String normalizeDateTime(String value, String fallback) {
        String normalizedValue = safeText(value);
        return StringUtils.hasText(normalizedValue) ? normalizedValue : fallback;
    }

    private boolean matchesTicketOrder(EventRecordDto item, boolean upcoming) {
        long endAtMs = resolveTicketEndAtMs(item);
        boolean past = endAtMs < System.currentTimeMillis();
        return upcoming ? !past : past;
    }

    private long resolveTicketEndAtMs(EventRecordDto item) {
        if (item == null) {
            return Long.MIN_VALUE;
        }
        long endAtMs = toSortableDate(item.endAtIso());
        if (endAtMs != Long.MIN_VALUE) {
            return endAtMs;
        }
        return toSortableDate(item.startAtIso());
    }

    private long toSortableDate(String value) {
        String normalizedValue = safeText(value);
        if (!StringUtils.hasText(normalizedValue)) {
            return Long.MIN_VALUE;
        }
        try {
            return Instant.parse(normalizedValue).toEpochMilli();
        } catch (Exception ignored) {
            return Long.MIN_VALUE;
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
}
