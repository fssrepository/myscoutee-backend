package com.raxim.myscoutee.profile.service;

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
import java.util.Set;
import java.util.UUID;

import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.profile.data.AssetCatalog;
import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.ActivityMember;
import com.raxim.myscoutee.profile.data.document.ActivitySubEventResource;
import com.raxim.myscoutee.profile.data.document.ActivitySubEventStageRuntime;
import com.raxim.myscoutee.profile.data.document.SubEventItem;
import com.raxim.myscoutee.profile.data.document.ActivitySubEventStageRuntime.GroupResourceMetricRecord;
import com.raxim.myscoutee.profile.data.document.ActivitySubEventResource.SubEventAssignedAssetSettingsRecord;
import com.raxim.myscoutee.profile.data.document.ActivitySubEventResource.SubEventResourceMetricRecord;
import com.raxim.myscoutee.profile.data.document.ActivitySubEventResource.SubEventSupplyContributionEntryRecord;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.AssetMemberRequestDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.ActivitySubEventResourceReadRequestDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.ActivitySubEventResourceReadReceiptDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.ActivitySubEventResourceScopeDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.ActivitySubEventResourceStateDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.SubEventAssignedAssetSettingsDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.SubEventResourceMetricDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.SubEventSupplyContributionEntryDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.SubEventSupplyContributionPageDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetDetailDto;
import com.raxim.myscoutee.profile.repository.ActivitySubEventResourcesRepository;
import com.raxim.myscoutee.profile.repository.ActivitySubEventStageRuntimeRepository;
import com.raxim.myscoutee.profile.repository.ActivityEventsRepository;
import com.raxim.myscoutee.profile.security.AccessControlService;
import com.raxim.myscoutee.profile.service.mapper.ActivitySubEventResourceMapper;

@Service
public class ActivitiesResourcesService {
    private static final String STATUS_ACTIVE = "A";
    private static final String STATUS_DELETED = "D";

    private final ActivitySubEventResourcesRepository activitySubEventResourcesRepository;
    private final ActivitySubEventStageRuntimeRepository activitySubEventStageRuntimeRepository;
    private final ActivityEventsRepository activityEventsRepository;
    private final AssetsService assetsService;
    private final ObjectProvider<ActivitiesMembersService> activitiesMembersServiceProvider;
    private final AccessControlService accessControlService;
    private final ActivitySubEventResourceMapper activitySubEventResourceMapper;
    private final EventSlotReadModelService eventSlotReadModelService;
    private final ActivityTournamentGroupCounterService tournamentGroupCounterService;
    private final MongoTemplate mongoTemplate;

    public ActivitiesResourcesService(
            ActivitySubEventResourcesRepository activitySubEventResourcesRepository,
            ActivitySubEventStageRuntimeRepository activitySubEventStageRuntimeRepository,
            ActivityEventsRepository activityEventsRepository,
            AssetsService assetsService,
            ObjectProvider<ActivitiesMembersService> activitiesMembersServiceProvider,
            AccessControlService accessControlService,
            ActivitySubEventResourceMapper activitySubEventResourceMapper,
            EventSlotReadModelService eventSlotReadModelService,
            ActivityTournamentGroupCounterService tournamentGroupCounterService,
            MongoTemplate mongoTemplate) {
        this.activitySubEventResourcesRepository = activitySubEventResourcesRepository;
        this.activitySubEventStageRuntimeRepository = activitySubEventStageRuntimeRepository;
        this.activityEventsRepository = activityEventsRepository;
        this.assetsService = assetsService;
        this.activitiesMembersServiceProvider = activitiesMembersServiceProvider;
        this.accessControlService = accessControlService;
        this.activitySubEventResourceMapper = activitySubEventResourceMapper;
        this.eventSlotReadModelService = eventSlotReadModelService;
        this.tournamentGroupCounterService = tournamentGroupCounterService;
        this.mongoTemplate = mongoTemplate;
    }

    public ActivitySubEventResourceStateDto queryState(String ownerId, String subEventId, String assetOwnerUserId) {
        ActivitySubEventResource record = resolveRecord(ownerId, subEventId, assetOwnerUserId);
        if (record == null) {
            return null;
        }
        Map<String, AssetDetailDto> eligibleAssets = resolveAssignableAssetDetails(record);
        return toStateDto(record, eligibleAssets);
    }

    public ActivitySubEventResourceScopeDto queryScope(String ownerId, String subEventId, String viewerUserId) {
        String normalizedOwnerId = normalizeId(ownerId);
        String normalizedSubEventId = normalizeId(subEventId);
        String normalizedViewerUserId = normalizeId(viewerUserId);
        if (!StringUtils.hasText(normalizedOwnerId)
                || !StringUtils.hasText(normalizedSubEventId)
                || !StringUtils.hasText(normalizedViewerUserId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Resource scope and viewer are required.");
        }
        String eventId = authorizationEventId(normalizedOwnerId, normalizedSubEventId);
        if (!accessControlService.canAssignEventResourcesForSubject(eventId, normalizedViewerUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Event membership is required to view resources.");
        }

        List<ActivitySubEventResourceStateDto> visibleStates = activitySubEventResourcesRepository
                .findByOwnerIdAndSubEventIdAndStatusNot(normalizedOwnerId, normalizedSubEventId, STATUS_DELETED)
                .stream()
                .filter(Objects::nonNull)
                .sorted(Comparator.comparing(record -> normalizeId(record.getAssetOwnerUserId())))
                .map(record -> {
                    Map<String, AssetDetailDto> eligibleAssets = resolveAssignableAssetDetails(record);
                    return toStateDto(record, eligibleAssets);
                })
                .filter(Objects::nonNull)
                .toList();
        ActivitySubEventResourceStateDto viewerState = visibleStates.stream()
                .filter(state -> normalizedViewerUserId.equals(normalizeId(state.assetOwnerUserId())))
                .findFirst()
                .orElseGet(() -> emptyState(normalizedOwnerId, normalizedSubEventId, normalizedViewerUserId));
        return new ActivitySubEventResourceScopeDto(viewerState, visibleStates);
    }

    private ActivitySubEventResourceStateDto emptyState(
            String ownerId,
            String subEventId,
            String assetOwnerUserId) {
        return new ActivitySubEventResourceStateDto(
                ownerId,
                subEventId,
                assetOwnerUserId,
                Map.of(),
                Map.of(),
                Map.of(),
                Map.of(),
                Map.of());
    }

    public ActivitySubEventResourceReadReceiptDto markResourceTypeRead(
            ActivitySubEventResourceReadRequestDto request,
            String resolvedUserId) {
        if (request == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Resource read request is required.");
        }
        String ownerId = normalizeId(request.ownerId());
        String subEventId = normalizeId(request.subEventId());
        String resourceType = normalizeResourceType(request.resourceType());
        String userId = normalizeId(resolvedUserId);
        GroupRuntimeScope scope = groupRuntimeScope(ownerId, subEventId);
        if (scope == null || !StringUtils.hasText(resourceType)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Valid group resource scope and type are required.");
        }
        if (!StringUtils.hasText(userId)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Current user is required.");
        }
        String eventId = authorizationEventId(ownerId, subEventId);
        if (!accessControlService.canAssignEventResourcesForSubject(eventId, userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Event membership is required to read group resources.");
        }

        String nowIso = Instant.now().toString();
        Query runtimeQuery = Query.query(Criteria.where("ownerId").is(scope.runtimeOwnerId())
                .and("subEventId").is(scope.subEventId())
                .and("status").ne(STATUS_DELETED));
        Update readUpdate = new Update()
                .set("groupResourceReadAtByUserId."
                        + scope.groupId() + "." + userId + "." + resourceType, nowIso)
                .set("updatedDate", nowIso)
                .set("updatedUser", userId);
        if (mongoTemplate.updateFirst(runtimeQuery, readUpdate, ActivitySubEventStageRuntime.class).getMatchedCount() == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Tournament stage runtime was not found.");
        }
        return new ActivitySubEventResourceReadReceiptDto(
                ownerId,
                subEventId,
                scope.groupId(),
                resourceType,
                userId,
                nowIso);
    }

    public void refreshEventSubEventResourceProjection(String ownerId, String subEventId) {
        String normalizedOwnerId = normalizeId(ownerId);
        String normalizedSubEventId = normalizeId(subEventId);
        if (!isDirectEventResourceScope(normalizedOwnerId) || !StringUtils.hasText(normalizedSubEventId)) {
            return;
        }
        List<ActivitySubEventResource> records = activitySubEventResourcesRepository
                .findByOwnerIdAndSubEventIdAndStatusNot(
                        normalizedOwnerId,
                        normalizedSubEventId,
                        STATUS_DELETED);
        List<ActivityEvent> changed = new ArrayList<>();
        for (ActivityEvent document : activityEventsRepository.findBySourceId(normalizedOwnerId)) {
            if (document == null || document.getSubEvents() == null) {
                continue;
            }
            String projectionUserId = firstNonBlank(
                    normalizeId(document.getOwnerUserId()),
                    normalizeId(document.getCreatorUserId()));
            Map<String, SubEventResourceMetricDto> aggregate = aggregateResourceMetrics(
                    records.stream()
                            .filter(Objects::nonNull)
                            .filter(record -> projectionUserId.equals(normalizeId(record.getAssetOwnerUserId())))
                            .toList());
            SubEventResourceMetricDto transport = metricOrEmpty(aggregate.get(AssetCatalog.TYPE_TRANSPORT));
            SubEventResourceMetricDto accommodation = metricOrEmpty(aggregate.get(AssetCatalog.TYPE_ACCOMMODATION));
            SubEventResourceMetricDto supplies = metricOrEmpty(aggregate.get(AssetCatalog.TYPE_SUPPLIES));
            boolean updated = false;
            boolean matchedSubEvent = false;
            List<SubEventItem> nextItems = new ArrayList<>();
            for (SubEventItem item : document.getSubEvents()) {
                if (item == null || !normalizedSubEventId.equals(normalizeId(item.id()))) {
                    nextItems.add(item);
                    continue;
                }
                matchedSubEvent = true;
                SubEventItem next = item.withResourceMetrics(
                        transport.accepted(),
                        transport.pending(),
                        transport.capacityMin(),
                        transport.capacityMax(),
                        accommodation.accepted(),
                        accommodation.pending(),
                        accommodation.capacityMin(),
                        accommodation.capacityMax(),
                        supplies.accepted(),
                        supplies.pending(),
                        supplies.capacityMin(),
                        supplies.capacityMax());
                nextItems.add(next);
                updated = updated || !next.equals(item);
            }
            int nextActivity = runtimeActivity(nextItems);
            if (!matchedSubEvent && isMainEventRuntimeSubEvent(normalizedOwnerId, normalizedSubEventId)) {
                nextActivity = Math.addExact(nextActivity, pendingResourceCount(aggregate));
            }
            updated = updated || normalizeCount(document.getActivity()) != nextActivity;
            if (updated) {
                document.setSubEvents(nextItems);
                document.setActivity(nextActivity);
                changed.add(document);
            }
        }
        if (!changed.isEmpty()) {
            eventSlotReadModelService.refreshForChangedEvents(activityEventsRepository.saveAll(changed));
        }
        ActivitiesMembersService membersService = activitiesMembersServiceProvider.getIfAvailable();
        if (membersService != null) {
            membersService.refreshSubEventParticipationProjection(normalizedOwnerId, normalizedSubEventId);
        }
    }

    private Map<String, SubEventResourceMetricDto> aggregateResourceMetrics(
            List<ActivitySubEventResource> records) {
        Map<String, int[]> totalsByType = new LinkedHashMap<>();
        for (ActivitySubEventResource record : records == null
                ? List.<ActivitySubEventResource>of()
                : records) {
            if (record == null) {
                continue;
            }
            for (Map.Entry<String, SubEventResourceMetricDto> entry
                    : storedResourceMetricsByType(record).entrySet()) {
                SubEventResourceMetricDto metric = metricOrEmpty(entry.getValue());
                int[] totals = totalsByType.computeIfAbsent(entry.getKey(), ignored -> new int[4]);
                totals[0] += normalizeCount(metric.accepted());
                totals[1] += normalizeCount(metric.pending());
                totals[2] += normalizeCount(metric.capacityMin());
                totals[3] += normalizeCount(metric.capacityMax());
            }
        }
        Map<String, SubEventResourceMetricDto> result = new LinkedHashMap<>();
        for (Map.Entry<String, int[]> entry : totalsByType.entrySet()) {
            int[] totals = entry.getValue();
            result.put(entry.getKey(), new SubEventResourceMetricDto(
                    totals[0],
                    totals[1],
                    totals[2],
                    Math.max(totals[2], totals[3])));
        }
        return result;
    }

    private int runtimeActivity(List<SubEventItem> items) {
        int pending = 0;
        for (SubEventItem item : items == null ? List.<SubEventItem>of() : items) {
            if (item == null) {
                continue;
            }
            if (Boolean.TRUE.equals(item.optional())) {
                pending = Math.addExact(pending, normalizeCount(item.membersPending()));
            }
            pending = Math.addExact(pending, normalizeCount(item.carsPending()));
            pending = Math.addExact(pending, normalizeCount(item.accommodationPending()));
            pending = Math.addExact(pending, normalizeCount(item.suppliesPending()));
            pending = Math.addExact(pending, normalizeCount(item.groupsPending()));
        }
        return pending;
    }

    private int pendingResourceCount(Map<String, SubEventResourceMetricDto> metricsByType) {
        return (metricsByType == null ? List.<SubEventResourceMetricDto>of() : metricsByType.values()).stream()
                .filter(Objects::nonNull)
                .map(SubEventResourceMetricDto::pending)
                .mapToInt(this::normalizeCount)
                .sum();
    }

    private boolean isMainEventRuntimeSubEvent(String ownerId, String subEventId) {
        return Objects.equals(normalizeId(subEventId), "main-event:" + normalizeId(ownerId));
    }

    private SubEventResourceMetricDto metricOrEmpty(SubEventResourceMetricDto value) {
        return value == null
                ? new SubEventResourceMetricDto(0, 0, 0, 0)
                : new SubEventResourceMetricDto(
                        normalizeCount(value.accepted()),
                        normalizeCount(value.pending()),
                        normalizeCount(value.capacityMin()),
                        Math.max(normalizeCount(value.capacityMin()), normalizeCount(value.capacityMax())));
    }

    private boolean isDirectEventResourceScope(String ownerId) {
        String normalizedOwnerId = normalizeId(ownerId);
        return StringUtils.hasText(normalizedOwnerId)
                && !normalizedOwnerId.contains(":slot:")
                && !normalizedOwnerId.contains(":group:");
    }

    public Map<String, SubEventResourceMetricDto> refreshGroupRuntimeResourceMetrics(
            String ownerId,
            String subEventId,
            String assetOwnerUserId,
            String actorUserId) {
        ActivitySubEventResource record = resolveRecord(ownerId, subEventId, assetOwnerUserId);
        if (record == null) {
            return Map.of();
        }
        Map<String, SubEventResourceMetricDto> metricsByType = persistResourceMetricSnapshot(
                record,
                actorUserId,
                Instant.now().toString());
        refreshEventSubEventResourceProjection(ownerId, subEventId);
        refreshEventParticipationProjection(ownerId);
        return metricsByType;
    }

    public void refreshResourceMetricsForScope(
            String ownerId,
            String subEventId,
            String actorUserId) {
        String normalizedOwnerId = normalizeId(ownerId);
        String normalizedSubEventId = normalizeId(subEventId);
        if (!StringUtils.hasText(normalizedOwnerId) || !StringUtils.hasText(normalizedSubEventId)) {
            return;
        }
        String nowIso = Instant.now().toString();
        for (ActivitySubEventResource record : activitySubEventResourcesRepository
                .findByOwnerIdAndSubEventIdAndStatusNot(
                        normalizedOwnerId,
                        normalizedSubEventId,
                        STATUS_DELETED)) {
            if (record != null) {
                persistResourceMetricSnapshot(record, actorUserId, nowIso);
            }
        }
        refreshEventSubEventResourceProjection(normalizedOwnerId, normalizedSubEventId);
        refreshEventParticipationProjection(normalizedOwnerId);
    }

    private Map<String, SubEventResourceMetricDto> persistResourceMetricSnapshot(
            ActivitySubEventResource record,
            String actorUserId,
            String nowIso) {
        Map<String, AssetDetailDto> eligibleAssets = resolveAssignableAssetDetails(record);
        ActivitySubEventResource next = filterToAssignableAssets(record, eligibleAssets.keySet());
        Map<String, SubEventResourceMetricDto> metricsByType = resourceMetricsByType(next, eligibleAssets);
        next.setResourceMetricsByType(toResourceMetricRecords(metricsByType));
        next.setUpdatedDate(normalizeDateTime(nowIso, Instant.now().toString()));
        next.setUpdatedUser(firstNonBlank(
                normalizeId(actorUserId),
                firstNonBlank(
                        normalizeId(record.getUpdatedUser()),
                        normalizeId(record.getAssetOwnerUserId()))));
        ActivitySubEventResource saved = activitySubEventResourcesRepository.save(next);
        return persistGroupRuntimeResourceMetrics(
                saved,
                metricsByType,
                actorUserId,
                next.getUpdatedDate());
    }

    public SubEventSupplyContributionPageDto querySupplyContributions(
            String ownerId,
            String subEventId,
            String assetOwnerUserId,
            String assetId,
            Integer page,
            Integer pageSize) {
        int normalizedPage = Math.max(0, page == null ? 0 : page);
        int normalizedPageSize = Math.max(1, Math.min(60, pageSize == null ? 12 : pageSize));
        String normalizedAssetId = normalizeId(assetId);
        ActivitySubEventResource record = resolveRecord(ownerId, subEventId, assetOwnerUserId);
        if (record == null || !StringUtils.hasText(normalizedAssetId)) {
            return new SubEventSupplyContributionPageDto(List.of(), 0, normalizedPage, normalizedPageSize);
        }
        Map<String, AssetDetailDto> eligibleAssets = resolveAssignableAssetDetails(record);
        ActivitySubEventResource filtered = filterToAssignableAssets(record, eligibleAssets.keySet());
        List<SubEventSupplyContributionEntryRecord> entries = new ArrayList<>(
                filtered.getSupplyContributionEntriesByAssetId().getOrDefault(normalizedAssetId, List.of()));
        entries.sort(Comparator.comparing(
                entry -> normalizeDateTime(entry == null ? null : entry.addedAtIso(), ""),
                Comparator.reverseOrder()));
        int total = entries.size();
        long requestedStart = (long) normalizedPage * normalizedPageSize;
        int start = (int) Math.min(total, requestedStart);
        int end = Math.min(total, start + normalizedPageSize);
        List<SubEventSupplyContributionEntryDto> items = entries.subList(start, end).stream()
                .filter(Objects::nonNull)
                .map(entry -> new SubEventSupplyContributionEntryDto(
                        safeText(entry.id()),
                        safeText(entry.userId()),
                        Math.max(0, entry.quantity() == null ? 0 : entry.quantity()),
                        normalizeDateTime(entry.addedAtIso(), "")))
                .toList();
        return new SubEventSupplyContributionPageDto(items, total, normalizedPage, normalizedPageSize);
    }

    public ActivitySubEventResourceStateDto replace(ActivitySubEventResourceStateDto request) {
        return replace(request, request == null ? null : request.assetOwnerUserId());
    }

    public ActivitySubEventResourceStateDto replace(
            ActivitySubEventResourceStateDto request,
            String actorUserId) {
        if (request == null) {
            return null;
        }

        String ownerId = normalizeId(request.ownerId());
        String subEventId = normalizeId(request.subEventId());
        String assetOwnerUserId = normalizeId(request.assetOwnerUserId());
        String authorizationEventId = normalizeId(request.authorizationEventId());
        if (!StringUtils.hasText(ownerId) || !StringUtils.hasText(subEventId) || !StringUtils.hasText(assetOwnerUserId)) {
            return null;
        }
        if (!accessControlService.canCurrentActorAssignEventResources(request)
                && !accessControlService.canCurrentActorManageEventResourceAssignment(request)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Authenticated user is not allowed to assign resources for this event.");
        }
        if (!accessControlService.canAssignEventResourcesForSubject(authorizationEventId, assetOwnerUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Event membership is required to assign resources.");
        }

        String recordId = recordId(ownerId, subEventId, assetOwnerUserId);
        ActivitySubEventResource current = resolveRecord(ownerId, subEventId, assetOwnerUserId);
        String nowIso = Instant.now().toString();
        Map<String, AssetDetailDto> eligibleAssets = assetsService.queryAssignableAssetDetails(
                assetOwnerUserId,
                authorizationEventId,
                subEventId,
                referencedAssetIds(request));
        Set<String> eligibleAssetIds = eligibleAssets == null ? Set.of() : eligibleAssets.keySet();

        ActivitySubEventResource next = current == null ? new ActivitySubEventResource() : cloneRecord(current);
        next.setId(current == null ? new ObjectId().toHexString() : current.getId());
        next.setSyncKey(current != null && StringUtils.hasText(current.getSyncKey()) ? current.getSyncKey().trim() : UUID.randomUUID().toString());
        next.setRecordId(recordId);
        next.setOwnerKey(ownerKey(ownerId, assetOwnerUserId));
        next.setStatus(STATUS_ACTIVE);
        next.setOwnerId(ownerId);
        next.setSubEventId(subEventId);
        next.setAssetOwnerUserId(assetOwnerUserId);
        next.setAssetAssignmentIds(filterAssignmentIds(request.assetAssignmentIds(), eligibleAssetIds));
        next.setAssetSettingsByType(filterAssetSettings(request.assetSettingsByType(), eligibleAssetIds));
        next.setSupplyContributionEntriesByAssetId(filterSupplyContributionEntries(request.supplyContributionEntriesByAssetId(), eligibleAssetIds));
        Map<String, SubEventResourceMetricDto> metricsByType = resourceMetricsByType(next, eligibleAssets);
        next.setResourceMetricsByType(toResourceMetricRecords(metricsByType));
        next.setCreatedDate(current == null ? nowIso : normalizeDateTime(current.getCreatedDate(), nowIso));
        next.setCreatedUser(current == null ? assetOwnerUserId : safeText(current.getCreatedUser()));
        next.setUpdatedDate(nowIso);
        next.setUpdatedUser(assetOwnerUserId);

        ActivitySubEventResource saved = activitySubEventResourcesRepository.save(next);
        Map<String, SubEventResourceMetricDto> groupMetricsByType = persistGroupRuntimeResourceMetrics(
                saved,
                metricsByType,
                actorUserId,
                nowIso);
        refreshEventSubEventResourceProjection(ownerId, subEventId);
        refreshEventParticipationProjection(ownerId);
        return toStateDto(saved, eligibleAssets, groupMetricsByType);
    }

    public Set<String> removeManagedResourcesForRemovedEventMembers(
            String ownerId,
            List<ActivityMember> removedMembers,
            String actorUserId,
            String nowIso) {
        String normalizedOwnerId = normalizeId(ownerId);
        if (!StringUtils.hasText(normalizedOwnerId) || removedMembers == null || removedMembers.isEmpty()) {
            return Set.of();
        }
        if (!accessControlService.canCleanupEventResourceAssignments(normalizedOwnerId, actorUserId)) {
            return Set.of();
        }

        Set<String> removedManagerUserIds = removedMembers.stream()
                .filter(Objects::nonNull)
                .map(ActivityMember::getUserId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .collect(LinkedHashSet::new, Set::add, Set::addAll);
        if (removedManagerUserIds.isEmpty()) {
            return Set.of();
        }

        String normalizedActorUserId = normalizeId(actorUserId);
        String effectiveNowIso = normalizeDateTime(nowIso, Instant.now().toString());
        List<ActivitySubEventResource> changedRecords = new ArrayList<>();
        Set<String> removedAssignedAssetIds = new LinkedHashSet<>();
        for (ActivitySubEventResource record : activitySubEventResourcesRepository.findByOwnerIdAndStatusNot(normalizedOwnerId, STATUS_DELETED)) {
            if (record == null) {
                continue;
            }
            ResourceCleanupResult cleanup = cleanupRecordForRemovedManagers(record, removedManagerUserIds);
            removedAssignedAssetIds.addAll(cleanup.removedAssignedAssetIds());
            if (!cleanup.changed()) {
                continue;
            }

            ActivitySubEventResource next = cloneRecord(record);
            next.setAssetAssignmentIds(cleanup.assetAssignmentIds());
            next.setAssetSettingsByType(cleanup.assetSettingsByType());
            next.setSupplyContributionEntriesByAssetId(cleanup.supplyContributionEntriesByAssetId());
            Map<String, AssetDetailDto> eligibleAssets = resolveAssignableAssetDetails(next);
            ActivitySubEventResource filtered = filterToAssignableAssets(next, eligibleAssets.keySet());
            next.setAssetAssignmentIds(filtered.getAssetAssignmentIds());
            next.setAssetSettingsByType(filtered.getAssetSettingsByType());
            next.setSupplyContributionEntriesByAssetId(filtered.getSupplyContributionEntriesByAssetId());
            next.setResourceMetricsByType(toResourceMetricRecords(resourceMetricsByType(next, eligibleAssets)));
            next.setUpdatedDate(effectiveNowIso);
            next.setUpdatedUser(StringUtils.hasText(normalizedActorUserId)
                    ? normalizedActorUserId
                    : firstNonBlank(record.getUpdatedUser(), record.getAssetOwnerUserId()));
            changedRecords.add(next);
        }
        if (!changedRecords.isEmpty()) {
            activitySubEventResourcesRepository.saveAll(changedRecords);
            changedRecords.stream()
                    .map(ActivitySubEventResource::getSubEventId)
                    .map(this::normalizeId)
                    .filter(StringUtils::hasText)
                    .distinct()
                    .forEach(subEventId ->
                            refreshEventSubEventResourceProjection(normalizedOwnerId, subEventId));
            refreshEventParticipationProjection(normalizedOwnerId);
        }
        return removedAssignedAssetIds;
    }

    private ActivitySubEventResource resolveRecord(String ownerId, String subEventId, String assetOwnerUserId) {
        String normalizedOwnerId = normalizeId(ownerId);
        String normalizedSubEventId = normalizeId(subEventId);
        String normalizedAssetOwnerUserId = normalizeId(assetOwnerUserId);
        if (!StringUtils.hasText(normalizedOwnerId) || !StringUtils.hasText(normalizedSubEventId) || !StringUtils.hasText(normalizedAssetOwnerUserId)) {
            return null;
        }

        return activitySubEventResourcesRepository.findByOwnerIdAndSubEventIdAndAssetOwnerUserIdAndStatusNot(
                        normalizedOwnerId,
                        normalizedSubEventId,
                        normalizedAssetOwnerUserId,
                        STATUS_DELETED)
                .orElse(null);
    }

    private ActivitySubEventResource filterToAssignableAssets(ActivitySubEventResource source, Set<String> eligibleAssetIds) {
        ActivitySubEventResource next = cloneRecord(source);
        next.setAssetAssignmentIds(filterAssignmentIds(next.getAssetAssignmentIds(), eligibleAssetIds));
        next.setAssetSettingsByType(filterSettings(next.getAssetSettingsByType(), eligibleAssetIds));
        next.setSupplyContributionEntriesByAssetId(filterSupplyEntries(next.getSupplyContributionEntriesByAssetId(), eligibleAssetIds));
        return next;
    }

    private ActivitySubEventResource cloneRecord(ActivitySubEventResource source) {
        ActivitySubEventResource clone = new ActivitySubEventResource();
        clone.setId(source.getId());
        clone.setSyncKey(source.getSyncKey());
        clone.setRecordId(source.getRecordId());
        clone.setOwnerKey(source.getOwnerKey());
        clone.setStatus(source.getStatus());
        clone.setOwnerId(source.getOwnerId());
        clone.setSubEventId(source.getSubEventId());
        clone.setAssetOwnerUserId(source.getAssetOwnerUserId());
        clone.setAssetAssignmentIds(filterAssignmentIds(source.getAssetAssignmentIds(), null));
        clone.setAssetSettingsByType(filterSettings(source.getAssetSettingsByType(), null));
        clone.setSupplyContributionEntriesByAssetId(filterSupplyEntries(source.getSupplyContributionEntriesByAssetId(), null));
        clone.setResourceMetricsByType(cloneResourceMetricRecords(source.getResourceMetricsByType()));
        clone.setCreatedDate(source.getCreatedDate());
        clone.setCreatedUser(source.getCreatedUser());
        clone.setUpdatedDate(source.getUpdatedDate());
        clone.setUpdatedUser(source.getUpdatedUser());
        return clone;
    }

    private ResourceCleanupResult cleanupRecordForRemovedManagers(
            ActivitySubEventResource record,
            Set<String> removedManagerUserIds) {
        Map<String, List<String>> nextAssignmentIds = filterAssignmentIds(record.getAssetAssignmentIds(), null);
        Map<String, Map<String, SubEventAssignedAssetSettingsRecord>> nextSettingsByType = filterSettings(record.getAssetSettingsByType(), null);
        Map<String, List<SubEventSupplyContributionEntryRecord>> nextSupplyEntriesByAssetId = filterSupplyEntries(record.getSupplyContributionEntriesByAssetId(), null);
        Set<String> removedAssignedAssetIds = new LinkedHashSet<>();
        boolean changed = false;
        String fallbackManagerUserId = normalizeId(record.getAssetOwnerUserId());

        for (String type : List.of(AssetCatalog.TYPE_TRANSPORT, AssetCatalog.TYPE_ACCOMMODATION)) {
            List<String> assignmentIds = new ArrayList<>(nextAssignmentIds.getOrDefault(type, List.of()));
            Map<String, SubEventAssignedAssetSettingsRecord> settingsByAssetId = new LinkedHashMap<>(nextSettingsByType.getOrDefault(type, Map.of()));
            Set<String> candidateAssetIds = new LinkedHashSet<>(assignmentIds);
            candidateAssetIds.addAll(settingsByAssetId.keySet());
            boolean typeChanged = false;
            for (String rawAssetId : candidateAssetIds) {
                String assetId = normalizeId(rawAssetId);
                if (!StringUtils.hasText(assetId)) {
                    continue;
                }
                String managerUserId = resolveManagedUserId(settingsByAssetId.get(assetId), fallbackManagerUserId);
                if (!removedManagerUserIds.contains(managerUserId)) {
                    continue;
                }

                boolean removedAssignment = assignmentIds.removeIf(existingAssetId -> assetId.equals(normalizeId(existingAssetId)));
                SubEventAssignedAssetSettingsRecord removedSettings = settingsByAssetId.remove(assetId);
                if (removedAssignment || removedSettings != null) {
                    removedAssignedAssetIds.add(assetId);
                    typeChanged = true;
                }
            }
            if (typeChanged) {
                storeAssignmentIds(nextAssignmentIds, type, assignmentIds);
                storeSettings(nextSettingsByType, type, settingsByAssetId);
                changed = true;
            }
        }

        List<String> supplyAssignmentIds = new ArrayList<>(nextAssignmentIds.getOrDefault(AssetCatalog.TYPE_SUPPLIES, List.of()));
        Map<String, SubEventAssignedAssetSettingsRecord> supplySettingsByAssetId = new LinkedHashMap<>(nextSettingsByType.getOrDefault(AssetCatalog.TYPE_SUPPLIES, Map.of()));
        Set<String> supplyAssetIds = new LinkedHashSet<>(supplyAssignmentIds);
        supplyAssetIds.addAll(supplySettingsByAssetId.keySet());
        supplyAssetIds.addAll(nextSupplyEntriesByAssetId.keySet());
        boolean suppliesChanged = false;
        for (String rawAssetId : supplyAssetIds) {
            String assetId = normalizeId(rawAssetId);
            if (!StringUtils.hasText(assetId)) {
                continue;
            }
            String managerUserId = resolveManagedUserId(supplySettingsByAssetId.get(assetId), fallbackManagerUserId);
            if (!removedManagerUserIds.contains(managerUserId)) {
                continue;
            }

            List<SubEventSupplyContributionEntryRecord> currentEntries = new ArrayList<>(nextSupplyEntriesByAssetId.getOrDefault(assetId, List.of()));
            List<SubEventSupplyContributionEntryRecord> remainingEntries = currentEntries.stream()
                    .filter(Objects::nonNull)
                    .filter(entry -> !removedManagerUserIds.contains(normalizeId(entry.userId())))
                    .filter(entry -> normalizeCount(entry.quantity()) > 0)
                    .toList();
            if (remainingEntries.isEmpty()) {
                boolean removedAssignment = supplyAssignmentIds.removeIf(existingAssetId -> assetId.equals(normalizeId(existingAssetId)));
                SubEventAssignedAssetSettingsRecord removedSettings = supplySettingsByAssetId.remove(assetId);
                List<SubEventSupplyContributionEntryRecord> removedEntries = nextSupplyEntriesByAssetId.remove(assetId);
                if (removedAssignment || removedSettings != null || removedEntries != null) {
                    suppliesChanged = true;
                }
                continue;
            }

            String nextManagerUserId = selectSupplyManagerUserId(remainingEntries, fallbackManagerUserId);
            SubEventAssignedAssetSettingsRecord currentSettings = supplySettingsByAssetId.get(assetId);
            SubEventAssignedAssetSettingsRecord nextSettings = currentSettings == null
                    ? new SubEventAssignedAssetSettingsRecord(
                            0,
                            remainingEntries.stream().mapToInt(entry -> normalizeCount(entry.quantity())).sum(),
                            remainingEntries.stream().mapToInt(entry -> normalizeCount(entry.quantity())).sum(),
                            nextManagerUserId,
                            false,
                            List.of())
                    : new SubEventAssignedAssetSettingsRecord(
                            currentSettings.capacityMin(),
                            currentSettings.capacityMax(),
                            currentSettings.quantity(),
                            nextManagerUserId,
                            normalizeRouteEnabled(currentSettings.routeEnabled(), currentSettings.routes()),
                            currentSettings.routes() == null ? List.of() : new ArrayList<>(currentSettings.routes()));
            if (supplyAssignmentIds.stream().noneMatch(existingAssetId -> assetId.equals(normalizeId(existingAssetId)))) {
                supplyAssignmentIds.add(assetId);
            }
            if (!remainingEntries.equals(nextSupplyEntriesByAssetId.get(assetId)) || !nextSettings.equals(currentSettings)) {
                nextSupplyEntriesByAssetId.put(assetId, new ArrayList<>(remainingEntries));
                supplySettingsByAssetId.put(assetId, nextSettings);
                suppliesChanged = true;
            }
        }
        if (suppliesChanged) {
            storeAssignmentIds(nextAssignmentIds, AssetCatalog.TYPE_SUPPLIES, supplyAssignmentIds);
            storeSettings(nextSettingsByType, AssetCatalog.TYPE_SUPPLIES, supplySettingsByAssetId);
            changed = true;
        }

        return new ResourceCleanupResult(
                changed,
                nextAssignmentIds,
                nextSettingsByType,
                nextSupplyEntriesByAssetId,
                removedAssignedAssetIds);
    }

    private Map<String, Map<String, SubEventAssignedAssetSettingsRecord>> filterAssetSettings(
            Map<String, Map<String, SubEventAssignedAssetSettingsDto>> source,
            Set<String> eligibleAssetIds) {
        Map<String, Map<String, SubEventAssignedAssetSettingsRecord>> next = new LinkedHashMap<>();
        if (source == null) {
            return next;
        }

        for (Map.Entry<String, Map<String, SubEventAssignedAssetSettingsDto>> typeEntry : source.entrySet()) {
            Map<String, SubEventAssignedAssetSettingsRecord> normalizedSettings = new LinkedHashMap<>();
            if (typeEntry.getValue() != null) {
                for (Map.Entry<String, SubEventAssignedAssetSettingsDto> assetEntry : typeEntry.getValue().entrySet()) {
                    String assetId = normalizeId(assetEntry.getKey());
                    if (!StringUtils.hasText(assetId) || !eligibleAssetIds.contains(assetId) || assetEntry.getValue() == null) {
                        continue;
                    }
                    normalizedSettings.put(assetId, new SubEventAssignedAssetSettingsRecord(
                            Math.max(0, normalizeCount(assetEntry.getValue().capacityMin())),
                            Math.max(0, normalizeCount(assetEntry.getValue().capacityMax())),
                            Math.max(0, normalizeCount(assetEntry.getValue().quantity())),
                            normalizeId(assetEntry.getValue().addedByUserId()),
                            normalizeRouteEnabled(assetEntry.getValue().routeEnabled(), assetEntry.getValue().routes()),
                            normalizeStrings(assetEntry.getValue().routes())));
                }
            }
            if (!normalizedSettings.isEmpty()) {
                next.put(safeText(typeEntry.getKey()), normalizedSettings);
            }
        }
        return next;
    }

    private Map<String, List<SubEventSupplyContributionEntryRecord>> filterSupplyContributionEntries(
            Map<String, List<SubEventSupplyContributionEntryDto>> source,
            Set<String> eligibleAssetIds) {
        Map<String, List<SubEventSupplyContributionEntryRecord>> next = new LinkedHashMap<>();
        if (source == null) {
            return next;
        }

        for (Map.Entry<String, List<SubEventSupplyContributionEntryDto>> entry : source.entrySet()) {
            String assetId = normalizeId(entry.getKey());
            if (!StringUtils.hasText(assetId) || !eligibleAssetIds.contains(assetId) || entry.getValue() == null) {
                continue;
            }
            List<SubEventSupplyContributionEntryRecord> records = entry.getValue().stream()
                    .filter(Objects::nonNull)
                    .map(item -> new SubEventSupplyContributionEntryRecord(
                            StringUtils.hasText(normalizeId(item.id())) ? normalizeId(item.id()) : UUID.randomUUID().toString(),
                            normalizeId(item.userId()),
                            Math.max(0, normalizeCount(item.quantity())),
                            normalizeDateTime(item.addedAtIso(), Instant.now().toString())))
                    .filter(item -> StringUtils.hasText(item.userId()) && item.quantity() > 0)
                    .toList();
            if (!records.isEmpty()) {
                next.put(assetId, records);
            }
        }
        return next;
    }

    private Map<String, List<String>> filterAssignmentIds(Map<String, List<String>> source, Set<String> eligibleAssetIds) {
        Map<String, List<String>> next = new LinkedHashMap<>();
        if (source == null) {
            return next;
        }

        for (Map.Entry<String, List<String>> entry : source.entrySet()) {
            List<String> filtered = normalizeStrings(entry.getValue()).stream()
                    .filter(assetId -> eligibleAssetIds == null || eligibleAssetIds.contains(assetId))
                    .toList();
            if (!filtered.isEmpty()) {
                next.put(safeText(entry.getKey()), filtered);
            }
        }
        return next;
    }

    private void storeAssignmentIds(Map<String, List<String>> target, String type, List<String> assetIds) {
        List<String> normalizedAssetIds = normalizeStrings(assetIds);
        if (normalizedAssetIds.isEmpty()) {
            target.remove(type);
            return;
        }
        target.put(type, normalizedAssetIds);
    }

    private Map<String, Map<String, SubEventAssignedAssetSettingsRecord>> filterSettings(
            Map<String, Map<String, SubEventAssignedAssetSettingsRecord>> source,
            Set<String> eligibleAssetIds) {
        Map<String, Map<String, SubEventAssignedAssetSettingsRecord>> next = new LinkedHashMap<>();
        if (source == null) {
            return next;
        }
        for (Map.Entry<String, Map<String, SubEventAssignedAssetSettingsRecord>> entry : source.entrySet()) {
            Map<String, SubEventAssignedAssetSettingsRecord> settings = new LinkedHashMap<>();
            if (entry.getValue() != null) {
                for (Map.Entry<String, SubEventAssignedAssetSettingsRecord> assetEntry : entry.getValue().entrySet()) {
                    String assetId = normalizeId(assetEntry.getKey());
                    if (!StringUtils.hasText(assetId) || assetEntry.getValue() == null || (eligibleAssetIds != null && !eligibleAssetIds.contains(assetId))) {
                        continue;
                    }
                    settings.put(assetId, assetEntry.getValue());
                }
            }
            if (!settings.isEmpty()) {
                next.put(safeText(entry.getKey()), settings);
            }
        }
        return next;
    }

    private void storeSettings(
            Map<String, Map<String, SubEventAssignedAssetSettingsRecord>> target,
            String type,
            Map<String, SubEventAssignedAssetSettingsRecord> settingsByAssetId) {
        Map<String, SubEventAssignedAssetSettingsRecord> normalizedSettings = new LinkedHashMap<>();
        for (Map.Entry<String, SubEventAssignedAssetSettingsRecord> entry : settingsByAssetId.entrySet()) {
            String assetId = normalizeId(entry.getKey());
            if (!StringUtils.hasText(assetId) || entry.getValue() == null) {
                continue;
            }
            normalizedSettings.put(assetId, entry.getValue());
        }
        if (normalizedSettings.isEmpty()) {
            target.remove(type);
            return;
        }
        target.put(type, normalizedSettings);
    }

    private Map<String, List<SubEventSupplyContributionEntryRecord>> filterSupplyEntries(
            Map<String, List<SubEventSupplyContributionEntryRecord>> source,
            Set<String> eligibleAssetIds) {
        Map<String, List<SubEventSupplyContributionEntryRecord>> next = new LinkedHashMap<>();
        if (source == null) {
            return next;
        }
        for (Map.Entry<String, List<SubEventSupplyContributionEntryRecord>> entry : source.entrySet()) {
            String assetId = normalizeId(entry.getKey());
            if (!StringUtils.hasText(assetId) || (eligibleAssetIds != null && !eligibleAssetIds.contains(assetId)) || entry.getValue() == null || entry.getValue().isEmpty()) {
                continue;
            }
            next.put(assetId, new ArrayList<>(entry.getValue()));
        }
        return next;
    }

    private Map<String, AssetDetailDto> resolveAssignableAssetDetails(ActivitySubEventResource record) {
        if (record == null) {
            return Map.of();
        }
        Map<String, AssetDetailDto> details = assetsService.queryAssignableAssetDetails(
                record.getAssetOwnerUserId(),
                authorizationEventId(record.getOwnerId(), record.getSubEventId()),
                record.getSubEventId(),
                referencedAssetIds(record));
        return details == null ? Map.of() : details;
    }

    private Set<String> referencedAssetIds(ActivitySubEventResourceStateDto state) {
        Set<String> ids = new LinkedHashSet<>();
        if (state == null) {
            return ids;
        }
        collectAssignmentIds(ids, state.assetAssignmentIds());
        if (state.assetSettingsByType() != null) {
            state.assetSettingsByType().values().stream()
                    .filter(Objects::nonNull)
                    .forEach(settings -> settings.keySet().forEach(id -> addNormalizedId(ids, id)));
        }
        if (state.supplyContributionEntriesByAssetId() != null) {
            state.supplyContributionEntriesByAssetId().keySet().forEach(id -> addNormalizedId(ids, id));
        }
        return ids;
    }

    private Set<String> referencedAssetIds(ActivitySubEventResource record) {
        Set<String> ids = new LinkedHashSet<>();
        if (record == null) {
            return ids;
        }
        collectAssignmentIds(ids, record.getAssetAssignmentIds());
        if (record.getAssetSettingsByType() != null) {
            record.getAssetSettingsByType().values().stream()
                    .filter(Objects::nonNull)
                    .forEach(settings -> settings.keySet().forEach(id -> addNormalizedId(ids, id)));
        }
        if (record.getSupplyContributionEntriesByAssetId() != null) {
            record.getSupplyContributionEntriesByAssetId().keySet().forEach(id -> addNormalizedId(ids, id));
        }
        return ids;
    }

    private void collectAssignmentIds(Set<String> target, Map<String, List<String>> assignments) {
        if (assignments == null) {
            return;
        }
        assignments.values().stream()
                .filter(Objects::nonNull)
                .flatMap(Collection::stream)
                .forEach(id -> addNormalizedId(target, id));
    }

    private void addNormalizedId(Set<String> target, String value) {
        String id = normalizeId(value);
        if (StringUtils.hasText(id)) {
            target.add(id);
        }
    }

    private ActivitySubEventResourceStateDto toStateDto(
            ActivitySubEventResource record,
            Map<String, AssetDetailDto> eligibleAssets) {
        return toStateDto(record, eligibleAssets, storedResourceMetricsByType(record));
    }

    private ActivitySubEventResourceStateDto toStateDto(
            ActivitySubEventResource record,
            Map<String, AssetDetailDto> eligibleAssets,
            Map<String, SubEventResourceMetricDto> metricsByType) {
        ActivitySubEventResourceStateDto base = activitySubEventResourceMapper.toDto(record);
        if (base == null) {
            return null;
        }
        Map<String, List<AssetDetailDto>> fallbackByType = new LinkedHashMap<>();
        for (AssetDetailDto detail : eligibleAssets == null ? List.<AssetDetailDto>of() : eligibleAssets.values()) {
            if (detail == null) {
                continue;
            }
            String type = safeText(detail.type());
            fallbackByType.computeIfAbsent(type, ignored -> new ArrayList<>()).add(detail);
        }
        return new ActivitySubEventResourceStateDto(
                base.ownerId(),
                base.subEventId(),
                base.assetOwnerUserId(),
                base.assetAssignmentIds(),
                base.assetSettingsByType(),
                base.supplyContributionEntriesByAssetId(),
                fallbackByType,
                metricsByType == null ? Map.of() : metricsByType);
    }

    private Map<String, SubEventResourceMetricDto> storedResourceMetricsByType(
            ActivitySubEventResource record) {
        Map<String, SubEventResourceMetricDto> result = new LinkedHashMap<>();
        for (Map.Entry<String, SubEventResourceMetricRecord> entry : record == null
                || record.getResourceMetricsByType() == null
                        ? Map.<String, SubEventResourceMetricRecord>of().entrySet()
                        : record.getResourceMetricsByType().entrySet()) {
            String type = safeText(entry.getKey());
            SubEventResourceMetricRecord metric = entry.getValue();
            if (!StringUtils.hasText(type) || metric == null) {
                continue;
            }
            result.put(type, new SubEventResourceMetricDto(
                    normalizeCount(metric.accepted()),
                    normalizeCount(metric.pending()),
                    normalizeCount(metric.capacityMin()),
                    Math.max(normalizeCount(metric.capacityMin()), normalizeCount(metric.capacityMax()))));
        }
        return result;
    }

    private Map<String, SubEventResourceMetricRecord> toResourceMetricRecords(
            Map<String, SubEventResourceMetricDto> source) {
        Map<String, SubEventResourceMetricRecord> result = new LinkedHashMap<>();
        for (Map.Entry<String, SubEventResourceMetricDto> entry : source == null
                ? Map.<String, SubEventResourceMetricDto>of().entrySet()
                : source.entrySet()) {
            String type = safeText(entry.getKey());
            SubEventResourceMetricDto metric = entry.getValue();
            if (!StringUtils.hasText(type) || metric == null) {
                continue;
            }
            int capacityMin = normalizeCount(metric.capacityMin());
            result.put(type, new SubEventResourceMetricRecord(
                    normalizeCount(metric.accepted()),
                    normalizeCount(metric.pending()),
                    capacityMin,
                    Math.max(capacityMin, normalizeCount(metric.capacityMax()))));
        }
        return result;
    }

    private Map<String, SubEventResourceMetricRecord> cloneResourceMetricRecords(
            Map<String, SubEventResourceMetricRecord> source) {
        Map<String, SubEventResourceMetricRecord> result = new LinkedHashMap<>();
        for (Map.Entry<String, SubEventResourceMetricRecord> entry : source == null
                ? Map.<String, SubEventResourceMetricRecord>of().entrySet()
                : source.entrySet()) {
            String type = safeText(entry.getKey());
            SubEventResourceMetricRecord metric = entry.getValue();
            if (StringUtils.hasText(type) && metric != null) {
                result.put(type, new SubEventResourceMetricRecord(
                        normalizeCount(metric.accepted()),
                        normalizeCount(metric.pending()),
                        normalizeCount(metric.capacityMin()),
                        Math.max(normalizeCount(metric.capacityMin()), normalizeCount(metric.capacityMax()))));
            }
        }
        return result;
    }

    private Map<String, SubEventResourceMetricDto> resourceMetricsByType(
            ActivitySubEventResource record,
            Map<String, AssetDetailDto> eligibleAssets) {
        Map<String, SubEventResourceMetricDto> result = new LinkedHashMap<>();
        for (String type : List.of(
                AssetCatalog.TYPE_TRANSPORT,
                AssetCatalog.TYPE_ACCOMMODATION,
                AssetCatalog.TYPE_SUPPLIES)) {
            result.put(type, resourceMetric(record, type, eligibleAssets));
        }
        return result;
    }

    private SubEventResourceMetricDto resourceMetric(
            ActivitySubEventResource record,
            String type,
            Map<String, AssetDetailDto> eligibleAssets) {
        Map<String, SubEventAssignedAssetSettingsRecord> settingsByAssetId = record == null
                || record.getAssetSettingsByType() == null
                ? Map.of()
                : record.getAssetSettingsByType().getOrDefault(type, Map.of());
        List<String> assignedIds = record == null || record.getAssetAssignmentIds() == null
                ? List.of()
                : record.getAssetAssignmentIds().getOrDefault(type, List.of());
        LinkedHashSet<String> assetIds = new LinkedHashSet<>();
        for (String rawAssetId : assignedIds == null ? List.<String>of() : assignedIds) {
            String assetId = normalizeId(rawAssetId);
            if (StringUtils.hasText(assetId)) {
                assetIds.add(assetId);
            }
        }
        if (assetIds.isEmpty()) {
            settingsByAssetId.keySet().stream()
                    .map(this::normalizeId)
                    .filter(StringUtils::hasText)
                    .forEach(assetIds::add);
        }

        int accepted = 0;
        int pending = 0;
        int capacityMin = 0;
        int capacityMax = 0;
        for (String assetId : assetIds) {
            SubEventAssignedAssetSettingsRecord settings = settingsByAssetId.get(assetId);
            AssetDetailDto detail = eligibleAssets == null ? null : eligibleAssets.get(assetId);
            capacityMin += normalizeCount(settings == null ? null : settings.capacityMin());
            int assignedQuantity = Math.max(1, normalizeCount(settings == null ? null : settings.quantity()));
            capacityMax += detail != null && detail.capacityTotal() != null
                    ? normalizeCount(detail.capacityTotal()) * assignedQuantity
                    : normalizeCount(settings == null ? null : settings.capacityMax()) * assignedQuantity;
            if (AssetCatalog.TYPE_SUPPLIES.equals(type)) {
                accepted += supplyContributionQuantity(record, assetId);
                continue;
            }
            List<AssetMemberRequestDto> requests = detail == null ? List.of() : detail.requests();
            int[] requestCounts = assetRequestCounts(
                    requests,
                    record == null ? null : record.getOwnerId(),
                    record == null ? null : record.getSubEventId());
            accepted += requestCounts[0];
            pending += requestCounts[1];
            String managerUserId = normalizeId(settings == null ? null : settings.addedByUserId());
            if (StringUtils.hasText(managerUserId)
                    && detail != null
                    && !hasScopedAssetRequestForUser(
                            requests,
                            record == null ? null : record.getOwnerId(),
                            record == null ? null : record.getSubEventId(),
                            managerUserId)) {
                if (managerUserId.equals(normalizeId(detail.ownerUserId()))) {
                    accepted += 1;
                } else {
                    pending += 1;
                }
            }
        }
        return new SubEventResourceMetricDto(
                accepted,
                pending,
                capacityMin,
                Math.max(capacityMin, capacityMax));
    }

    private int supplyContributionQuantity(ActivitySubEventResource record, String assetId) {
        if (record == null || record.getSupplyContributionEntriesByAssetId() == null) {
            return 0;
        }
        return record.getSupplyContributionEntriesByAssetId().getOrDefault(assetId, List.of()).stream()
                .filter(Objects::nonNull)
                .mapToInt(entry -> normalizeCount(entry.quantity()))
                .sum();
    }

    private int[] assetRequestCounts(
            List<AssetMemberRequestDto> requests,
            String ownerId,
            String subEventId) {
        String normalizedOwnerId = normalizeId(ownerId);
        String normalizedSubEventId = normalizeId(subEventId);
        Map<String, String> statusByIdentity = new LinkedHashMap<>();
        for (AssetMemberRequestDto request : requests == null ? List.<AssetMemberRequestDto>of() : requests) {
            if (request == null || request.booking() == null
                    || !Objects.equals(normalizedOwnerId, normalizeId(request.booking().eventId()))
                    || !Objects.equals(normalizedSubEventId, normalizeId(request.booking().subEventId()))) {
                continue;
            }
            String status = safeText(request.status()).toLowerCase(Locale.ROOT);
            if (!"accepted".equals(status) && !"pending".equals(status)) {
                continue;
            }
            String identity = firstNonBlank(normalizeId(request.userId()), normalizeId(request.id()));
            if (!StringUtils.hasText(identity)) {
                continue;
            }
            String existing = statusByIdentity.get(identity);
            if (!"accepted".equals(existing) || "accepted".equals(status)) {
                statusByIdentity.put(identity, status);
            }
        }
        return new int[] {
                (int) statusByIdentity.values().stream().filter("accepted"::equals).count(),
                (int) statusByIdentity.values().stream().filter("pending"::equals).count()
        };
    }

    private boolean hasScopedAssetRequestForUser(
            List<AssetMemberRequestDto> requests,
            String ownerId,
            String subEventId,
            String userId) {
        String normalizedOwnerId = normalizeId(ownerId);
        String normalizedSubEventId = normalizeId(subEventId);
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(normalizedUserId)) {
            return false;
        }
        return (requests == null ? List.<AssetMemberRequestDto>of() : requests).stream()
                .filter(Objects::nonNull)
                .filter(request -> request.booking() != null)
                .filter(request -> Objects.equals(
                        normalizedOwnerId,
                        normalizeId(request.booking().eventId())))
                .filter(request -> Objects.equals(
                        normalizedSubEventId,
                        normalizeId(request.booking().subEventId())))
                .filter(request -> Objects.equals(normalizedUserId, normalizeId(request.userId())))
                .map(request -> safeText(request.status()).toLowerCase(Locale.ROOT))
                .anyMatch(status -> "accepted".equals(status) || "pending".equals(status));
    }

    private Map<String, SubEventResourceMetricDto> persistGroupRuntimeResourceMetrics(
            ActivitySubEventResource resource,
            Map<String, SubEventResourceMetricDto> metricsByType,
            String actorUserId,
            String nowIso) {
        GroupRuntimeScope scope = groupRuntimeScope(resource == null ? null : resource.getOwnerId(),
                resource == null ? null : resource.getSubEventId());
        String assetOwnerUserId = normalizeId(resource == null ? null : resource.getAssetOwnerUserId());
        if (scope == null || !StringUtils.hasText(assetOwnerUserId)) {
            return metricsByType == null ? Map.of() : metricsByType;
        }
        ActivitySubEventStageRuntime runtime = activitySubEventStageRuntimeRepository
                .findByOwnerIdAndSubEventId(scope.runtimeOwnerId(), scope.subEventId())
                .orElseGet(ActivitySubEventStageRuntime::new);
        runtime.setId(StringUtils.hasText(runtime.getId()) ? runtime.getId() : new ObjectId().toHexString());
        runtime.setSyncKey(StringUtils.hasText(runtime.getSyncKey()) ? runtime.getSyncKey() : UUID.randomUUID().toString());
        runtime.setRecordId(scope.runtimeOwnerId() + ":" + scope.subEventId());
        runtime.setStatus(STATUS_ACTIVE);
        runtime.setOwnerId(scope.runtimeOwnerId());
        runtime.setSubEventId(scope.subEventId());

        Map<String, Map<String, Map<String, GroupResourceMetricRecord>>> byGroup =
                cloneGroupRuntimeMetrics(runtime.getGroupResourceMetricsByAssetOwnerId());
        Map<String, Map<String, GroupResourceMetricRecord>> byAssetOwner = new LinkedHashMap<>(
                byGroup.getOrDefault(scope.groupId(), Map.of()));
        Map<String, GroupResourceMetricRecord> previousRuntimeMetrics = new LinkedHashMap<>(
                byAssetOwner.getOrDefault(assetOwnerUserId, Map.of()));
        Map<String, GroupResourceMetricRecord> runtimeMetrics = new LinkedHashMap<>();
        for (Map.Entry<String, SubEventResourceMetricDto> entry :
                (metricsByType == null ? Map.<String, SubEventResourceMetricDto>of() : metricsByType).entrySet()) {
            SubEventResourceMetricDto metric = entry.getValue();
            if (metric == null) {
                continue;
            }
            runtimeMetrics.put(entry.getKey(), new GroupResourceMetricRecord(
                    normalizeCount(metric.accepted()),
                    normalizeCount(metric.pending()),
                    normalizeCount(metric.capacityMin()),
                    normalizeCount(metric.capacityMax())));
        }
        byAssetOwner.put(assetOwnerUserId, runtimeMetrics);
        byGroup.put(scope.groupId(), byAssetOwner);
        runtime.setGroupResourceMetricsByAssetOwnerId(byGroup);
        Set<String> changedResourceTypes = new LinkedHashSet<>(previousRuntimeMetrics.keySet());
        changedResourceTypes.addAll(runtimeMetrics.keySet());
        changedResourceTypes.removeIf(type -> sameGroupResourceMetric(
                previousRuntimeMetrics.get(type),
                runtimeMetrics.get(type)));
        if (!changedResourceTypes.isEmpty()) {
            Map<String, Map<String, Map<String, String>>> readsByGroup = clearGroupResourceReads(
                    runtime.getGroupResourceReadAtByUserId(),
                    scope.groupId(),
                    changedResourceTypes);
            runtime.setGroupResourceReadAtByUserId(markGroupResourceTypesRead(
                    readsByGroup,
                    scope.groupId(),
                    actorUserId,
                    changedResourceTypes,
                    nowIso));
        }
        runtime.setCreatedDate(StringUtils.hasText(runtime.getCreatedDate()) ? runtime.getCreatedDate() : nowIso);
        runtime.setCreatedUser(StringUtils.hasText(runtime.getCreatedUser()) ? runtime.getCreatedUser() : normalizeId(actorUserId));
        runtime.setUpdatedDate(nowIso);
        runtime.setUpdatedUser(normalizeId(actorUserId));
        activitySubEventStageRuntimeRepository.save(runtime);
        tournamentGroupCounterService.syncParent(scope.runtimeOwnerId(), scope.subEventId());
        return applyResourceReads(
                aggregateGroupRuntimeMetrics(byAssetOwner),
                runtime.getGroupResourceReadAtByUserId()
                        .getOrDefault(scope.groupId(), Map.of())
                        .getOrDefault(normalizeId(actorUserId), Map.of()));
    }

    private Map<String, SubEventResourceMetricDto> aggregateGroupRuntimeMetrics(
            Map<String, Map<String, GroupResourceMetricRecord>> byAssetOwner) {
        Map<String, int[]> totalsByType = new LinkedHashMap<>();
        for (Map<String, GroupResourceMetricRecord> metricsByType :
                (byAssetOwner == null ? List.<Map<String, GroupResourceMetricRecord>>of() : byAssetOwner.values())) {
            for (Map.Entry<String, GroupResourceMetricRecord> entry :
                    (metricsByType == null ? Map.<String, GroupResourceMetricRecord>of() : metricsByType).entrySet()) {
                GroupResourceMetricRecord metric = entry.getValue();
                if (metric == null) {
                    continue;
                }
                int[] totals = totalsByType.computeIfAbsent(entry.getKey(), ignored -> new int[4]);
                totals[0] += normalizeCount(metric.accepted());
                totals[1] += normalizeCount(metric.pending());
                totals[2] += normalizeCount(metric.capacityMin());
                totals[3] += normalizeCount(metric.capacityMax());
            }
        }
        Map<String, SubEventResourceMetricDto> result = new LinkedHashMap<>();
        for (Map.Entry<String, int[]> entry : totalsByType.entrySet()) {
            int[] totals = entry.getValue();
            result.put(entry.getKey(), new SubEventResourceMetricDto(
                    totals[0],
                    totals[1],
                    totals[2],
                    Math.max(totals[2], totals[3])));
        }
        return result;
    }

    private boolean sameGroupResourceMetric(
            GroupResourceMetricRecord left,
            GroupResourceMetricRecord right) {
        return normalizeCount(left == null ? null : left.accepted())
                        == normalizeCount(right == null ? null : right.accepted())
                && normalizeCount(left == null ? null : left.pending())
                        == normalizeCount(right == null ? null : right.pending())
                && normalizeCount(left == null ? null : left.capacityMin())
                        == normalizeCount(right == null ? null : right.capacityMin())
                && normalizeCount(left == null ? null : left.capacityMax())
                        == normalizeCount(right == null ? null : right.capacityMax());
    }

    private Map<String, Map<String, Map<String, GroupResourceMetricRecord>>> cloneGroupRuntimeMetrics(
            Map<String, Map<String, Map<String, GroupResourceMetricRecord>>> source) {
        Map<String, Map<String, Map<String, GroupResourceMetricRecord>>> result = new LinkedHashMap<>();
        for (Map.Entry<String, Map<String, Map<String, GroupResourceMetricRecord>>> groupEntry :
                (source == null ? Map.<String, Map<String, Map<String, GroupResourceMetricRecord>>>of() : source).entrySet()) {
            Map<String, Map<String, GroupResourceMetricRecord>> byAssetOwner = new LinkedHashMap<>();
            for (Map.Entry<String, Map<String, GroupResourceMetricRecord>> ownerEntry :
                    (groupEntry.getValue() == null ? Map.<String, Map<String, GroupResourceMetricRecord>>of() : groupEntry.getValue()).entrySet()) {
                byAssetOwner.put(ownerEntry.getKey(), new LinkedHashMap<>(
                        ownerEntry.getValue() == null ? Map.of() : ownerEntry.getValue()));
            }
            result.put(groupEntry.getKey(), byAssetOwner);
        }
        return result;
    }

    private Map<String, Map<String, Map<String, String>>> cloneGroupResourceReadAt(
            Map<String, Map<String, Map<String, String>>> source) {
        Map<String, Map<String, Map<String, String>>> result = new LinkedHashMap<>();
        for (Map.Entry<String, Map<String, Map<String, String>>> groupEntry :
                (source == null ? Map.<String, Map<String, Map<String, String>>>of() : source).entrySet()) {
            Map<String, Map<String, String>> byUser = new LinkedHashMap<>();
            for (Map.Entry<String, Map<String, String>> userEntry :
                    (groupEntry.getValue() == null ? Map.<String, Map<String, String>>of() : groupEntry.getValue()).entrySet()) {
                byUser.put(userEntry.getKey(), new LinkedHashMap<>(
                        userEntry.getValue() == null ? Map.of() : userEntry.getValue()));
            }
            result.put(groupEntry.getKey(), byUser);
        }
        return result;
    }

    private Map<String, Map<String, Map<String, String>>> clearGroupResourceReads(
            Map<String, Map<String, Map<String, String>>> source,
            String groupId,
            Set<String> resourceTypes) {
        Map<String, Map<String, Map<String, String>>> result = cloneGroupResourceReadAt(source);
        Map<String, Map<String, String>> byUser = new LinkedHashMap<>(
                result.getOrDefault(groupId, Map.of()));
        for (Map.Entry<String, Map<String, String>> userEntry : new ArrayList<>(byUser.entrySet())) {
            Map<String, String> byType = new LinkedHashMap<>(userEntry.getValue());
            resourceTypes.forEach(byType::remove);
            if (byType.isEmpty()) {
                byUser.remove(userEntry.getKey());
            } else {
                byUser.put(userEntry.getKey(), byType);
            }
        }
        if (byUser.isEmpty()) {
            result.remove(groupId);
        } else {
            result.put(groupId, byUser);
        }
        return result;
    }

    private Map<String, Map<String, Map<String, String>>> markGroupResourceTypesRead(
            Map<String, Map<String, Map<String, String>>> source,
            String groupId,
            String actorUserId,
            Set<String> resourceTypes,
            String readAtIso) {
        Map<String, Map<String, Map<String, String>>> result = cloneGroupResourceReadAt(source);
        String normalizedActorUserId = normalizeId(actorUserId);
        if (!StringUtils.hasText(normalizedActorUserId) || resourceTypes == null || resourceTypes.isEmpty()) {
            return result;
        }
        Map<String, Map<String, String>> byUser = new LinkedHashMap<>(
                result.getOrDefault(groupId, Map.of()));
        Map<String, String> byType = new LinkedHashMap<>(
                byUser.getOrDefault(normalizedActorUserId, Map.of()));
        for (String resourceType : resourceTypes) {
            if (StringUtils.hasText(resourceType)) {
                byType.put(resourceType, readAtIso);
            }
        }
        byUser.put(normalizedActorUserId, byType);
        result.put(groupId, byUser);
        return result;
    }

    private Map<String, SubEventResourceMetricDto> applyResourceReads(
            Map<String, SubEventResourceMetricDto> metricsByType,
            Map<String, String> readAtByType) {
        Map<String, SubEventResourceMetricDto> result = new LinkedHashMap<>();
        for (Map.Entry<String, SubEventResourceMetricDto> entry :
                (metricsByType == null ? Map.<String, SubEventResourceMetricDto>of() : metricsByType).entrySet()) {
            SubEventResourceMetricDto metric = metricOrEmpty(entry.getValue());
            result.put(entry.getKey(), new SubEventResourceMetricDto(
                    metric.accepted(),
                    readAtByType != null && readAtByType.containsKey(entry.getKey()) ? 0 : metric.pending(),
                    metric.capacityMin(),
                    metric.capacityMax()));
        }
        return result;
    }

    private String normalizeResourceType(String value) {
        String normalized = safeText(value);
        return AssetCatalog.ASSET_TYPES.stream()
                .filter(type -> type.equalsIgnoreCase(normalized))
                .findFirst()
                .orElse(null);
    }

    private GroupRuntimeScope groupRuntimeScope(String ownerId, String subEventId) {
        String normalizedOwnerId = normalizeId(ownerId);
        String normalizedSubEventId = normalizeId(subEventId);
        if (!StringUtils.hasText(normalizedOwnerId) || !StringUtils.hasText(normalizedSubEventId)) {
            return null;
        }
        String marker = ":" + normalizedSubEventId + ":";
        int markerIndex = normalizedOwnerId.indexOf(marker);
        if (markerIndex <= 0) {
            return null;
        }
        String runtimeOwnerId = normalizeId(normalizedOwnerId.substring(0, markerIndex));
        String groupId = normalizeId(normalizedOwnerId.substring(markerIndex + marker.length()));
        return StringUtils.hasText(runtimeOwnerId) && StringUtils.hasText(groupId)
                ? new GroupRuntimeScope(runtimeOwnerId, normalizedSubEventId, groupId)
                : null;
    }

    private String recordId(String ownerId, String subEventId, String assetOwnerUserId) {
        return assetOwnerUserId + ":" + ownerId + ":" + subEventId;
    }

    private String ownerKey(String ownerId, String assetOwnerUserId) {
        return assetOwnerUserId + ":" + ownerId;
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

    private String normalizeId(String value) {
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

    private String resolveManagedUserId(SubEventAssignedAssetSettingsRecord settings, String fallbackUserId) {
        String addedByUserId = normalizeId(settings == null ? null : settings.addedByUserId());
        if (StringUtils.hasText(addedByUserId)) {
            return addedByUserId;
        }
        return normalizeId(fallbackUserId);
    }

    private boolean normalizeRouteEnabled(Boolean value, List<String> routes) {
        if (value != null) {
            return Boolean.TRUE.equals(value);
        }
        return routes != null && routes.stream().anyMatch(item -> StringUtils.hasText(safeText(item)));
    }

    private String selectSupplyManagerUserId(
            List<SubEventSupplyContributionEntryRecord> entries,
            String fallbackUserId) {
        String selectedUserId = null;
        long selectedDate = Long.MAX_VALUE;
        for (SubEventSupplyContributionEntryRecord entry : entries) {
            String userId = normalizeId(entry == null ? null : entry.userId());
            if (!StringUtils.hasText(userId)) {
                continue;
            }
            long addedAt = toSortableDate(entry == null ? null : entry.addedAtIso());
            if (selectedUserId == null
                    || addedAt < selectedDate
                    || (addedAt == selectedDate && userId.compareTo(selectedUserId) < 0)) {
                selectedUserId = userId;
                selectedDate = addedAt;
            }
        }
        return StringUtils.hasText(selectedUserId) ? selectedUserId : normalizeId(fallbackUserId);
    }

    private String normalizeDateTime(String value, String fallback) {
        String normalizedValue = safeText(value);
        return StringUtils.hasText(normalizedValue) ? normalizedValue : fallback;
    }

    private long toSortableDate(String value) {
        String normalizedValue = safeText(value);
        if (!StringUtils.hasText(normalizedValue)) {
            return Long.MAX_VALUE;
        }
        try {
            return Instant.parse(normalizedValue).toEpochMilli();
        } catch (Exception ignored) {
            return Long.MAX_VALUE;
        }
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }

    private String firstNonBlank(String first, String second) {
        String firstValue = safeText(first);
        if (StringUtils.hasText(firstValue)) {
            return firstValue;
        }
        return safeText(second);
    }

    private String authorizationEventId(String ownerId, String subEventId) {
        String normalizedOwnerId = normalizeId(ownerId);
        String normalizedSubEventId = normalizeId(subEventId);
        String runtimeOwnerId = normalizedOwnerId;
        if (StringUtils.hasText(normalizedSubEventId)) {
            int groupOwnerMarker = normalizedOwnerId.indexOf(":" + normalizedSubEventId + ":");
            if (groupOwnerMarker > 0) {
                runtimeOwnerId = normalizedOwnerId.substring(0, groupOwnerMarker);
            }
        }
        int slotMarker = runtimeOwnerId.indexOf(":slot:");
        return slotMarker > 0 ? runtimeOwnerId.substring(0, slotMarker) : runtimeOwnerId;
    }

    private void refreshEventParticipationProjection(String ownerId) {
        ActivitiesMembersService activitiesMembersService = activitiesMembersServiceProvider.getIfAvailable();
        if (activitiesMembersService == null) {
            return;
        }
        activitiesMembersService.refreshEventParticipationProjection(ownerId);
    }

    private record ResourceCleanupResult(
            boolean changed,
            Map<String, List<String>> assetAssignmentIds,
            Map<String, Map<String, SubEventAssignedAssetSettingsRecord>> assetSettingsByType,
            Map<String, List<SubEventSupplyContributionEntryRecord>> supplyContributionEntriesByAssetId,
            Set<String> removedAssignedAssetIds) {
    }

    private record GroupRuntimeScope(
            String runtimeOwnerId,
            String subEventId,
            String groupId) {
    }
}
