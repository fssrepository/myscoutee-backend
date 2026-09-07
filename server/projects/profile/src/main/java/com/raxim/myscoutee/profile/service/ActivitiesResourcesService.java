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
import java.util.regex.Pattern;

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
import com.raxim.myscoutee.profile.data.document.Users;
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
import com.raxim.myscoutee.profile.repository.UsersRepository;
import com.raxim.myscoutee.profile.security.AccessControlService;
import com.raxim.myscoutee.profile.service.mapper.ActivitySubEventResourceMapper;
import com.raxim.myscoutee.profile.service.notifications.NotificationOutboxService;
import com.raxim.myscoutee.profile.service.notifications.NotificationOutboxService.NotificationIntent;

@Service
public class ActivitiesResourcesService {
    private static final String STATUS_ACTIVE = "A";
    private static final String STATUS_DELETED = "D";

    private final ActivitySubEventResourcesRepository activitySubEventResourcesRepository;
    private final ActivitySubEventStageRuntimeRepository activitySubEventStageRuntimeRepository;
    private final ActivityEventsRepository activityEventsRepository;
    private final UsersRepository usersRepository;
    private final AssetsService assetsService;
    private final ObjectProvider<ActivitiesMembersService> activitiesMembersServiceProvider;
    private final AccessControlService accessControlService;
    private final ActivitySubEventResourceMapper activitySubEventResourceMapper;
    private final EventSlotReadModelService eventSlotReadModelService;
    private final ActivityTournamentGroupCounterService tournamentGroupCounterService;
    private final ObjectProvider<NotificationOutboxService> notificationOutboxServiceProvider;
    private final MongoTemplate mongoTemplate;

    public ActivitiesResourcesService(
            ActivitySubEventResourcesRepository activitySubEventResourcesRepository,
            ActivitySubEventStageRuntimeRepository activitySubEventStageRuntimeRepository,
            ActivityEventsRepository activityEventsRepository,
            UsersRepository usersRepository,
            AssetsService assetsService,
            ObjectProvider<ActivitiesMembersService> activitiesMembersServiceProvider,
            AccessControlService accessControlService,
            ActivitySubEventResourceMapper activitySubEventResourceMapper,
            EventSlotReadModelService eventSlotReadModelService,
            ActivityTournamentGroupCounterService tournamentGroupCounterService,
            ObjectProvider<NotificationOutboxService> notificationOutboxServiceProvider,
            MongoTemplate mongoTemplate) {
        this.activitySubEventResourcesRepository = activitySubEventResourcesRepository;
        this.activitySubEventStageRuntimeRepository = activitySubEventStageRuntimeRepository;
        this.activityEventsRepository = activityEventsRepository;
        this.usersRepository = usersRepository;
        this.assetsService = assetsService;
        this.activitiesMembersServiceProvider = activitiesMembersServiceProvider;
        this.accessControlService = accessControlService;
        this.activitySubEventResourceMapper = activitySubEventResourceMapper;
        this.eventSlotReadModelService = eventSlotReadModelService;
        this.tournamentGroupCounterService = tournamentGroupCounterService;
        this.notificationOutboxServiceProvider = notificationOutboxServiceProvider;
        this.mongoTemplate = mongoTemplate;
    }

    public ActivitySubEventResourceStateDto queryState(String ownerId, String subEventId, String assetOwnerUserId) {
        ActivitySubEventResource record = resolveRecord(ownerId, subEventId, assetOwnerUserId);
        if (record == null) {
            return null;
        }
        Map<String, AssetDetailDto> referencedAssets = resolveReferencedAssetDetails(record, assetOwnerUserId);
        return toStateDto(record, referencedAssets);
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
                    Map<String, AssetDetailDto> referencedAssets = resolveReferencedAssetDetails(record, normalizedViewerUserId);
                    return toStateDto(record, referencedAssets);
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
        requireAcceptedGroupMember(ownerId, subEventId, userId);

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

    public Map<String, SubEventResourceMetricDto> updateEventSubEventResourceCounters(
            String ownerId,
            String subEventId) {
        String normalizedOwnerId = normalizeId(ownerId);
        String normalizedSubEventId = normalizeId(subEventId);
        if (!isDirectEventResourceScope(normalizedOwnerId) || !StringUtils.hasText(normalizedSubEventId)) {
            return Map.of();
        }
        List<ActivitySubEventResource> records = activitySubEventResourcesRepository
                .findByOwnerIdAndSubEventIdAndStatusNot(
                        normalizedOwnerId,
                        normalizedSubEventId,
                        STATUS_DELETED);
        Map<String, SubEventResourceMetricDto> aggregate = aggregateResourceMetrics(records);
        List<ActivityEvent> changed = new ArrayList<>();
        for (ActivityEvent document : activityEventsRepository.findBySourceId(normalizedOwnerId)) {
            if (document == null || document.getSubEvents() == null) {
                continue;
            }
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
        if (!isMainEventRuntimeSubEvent(normalizedOwnerId, normalizedSubEventId)) {
            ActivitiesMembersService membersService = activitiesMembersServiceProvider.getIfAvailable();
            if (membersService != null) {
                membersService.refreshSubEventParticipationProjection(normalizedOwnerId, normalizedSubEventId);
            }
        }
        return aggregate;
    }

    private Map<String, SubEventResourceMetricDto> aggregateResourceMetrics(
            List<ActivitySubEventResource> records) {
        List<ActivitySubEventResource> normalizedRecords = (records == null
                ? List.<ActivitySubEventResource>of()
                : records).stream()
                .filter(Objects::nonNull)
                .toList();
        Map<String, SubEventResourceMetricDto> result = aggregateResourceMetricMaps(normalizedRecords.stream()
                .map(this::storedResourceMetricsByType)
                .toList());

        Map<String, Map<String, int[]>> capacityByTypeAndAsset = new LinkedHashMap<>();
        Map<String, Integer> supplyQuantityByEntry = new LinkedHashMap<>();
        for (ActivitySubEventResource record : normalizedRecords) {
            if (record.getSupplyContributionEntriesByAssetId() != null) {
                for (Map.Entry<String, List<SubEventSupplyContributionEntryRecord>> contributionEntry
                        : record.getSupplyContributionEntriesByAssetId().entrySet()) {
                    String assetId = normalizeId(contributionEntry.getKey());
                    int entryIndex = 0;
                    for (SubEventSupplyContributionEntryRecord entry : contributionEntry.getValue() == null
                            ? List.<SubEventSupplyContributionEntryRecord>of()
                            : contributionEntry.getValue()) {
                        if (entry == null || !StringUtils.hasText(assetId)) {
                            continue;
                        }
                        String entryId = firstNonBlank(
                                normalizeId(entry.id()),
                                normalizeId(record.getRecordId()) + ":" + entryIndex);
                        supplyQuantityByEntry.putIfAbsent(
                                assetId + ":" + entryId,
                                normalizeCount(entry.quantity()));
                        entryIndex++;
                    }
                }
            }
            for (String type : AssetCatalog.ASSET_TYPES) {
                List<String> assetIds = record.getAssetAssignmentIds() == null
                        ? List.of()
                        : record.getAssetAssignmentIds().getOrDefault(type, List.of());
                Map<String, SubEventAssignedAssetSettingsRecord> settingsByAssetId =
                        record.getAssetSettingsByType() == null
                                ? Map.of()
                                : record.getAssetSettingsByType().getOrDefault(type, Map.of());
                for (String rawAssetId : assetIds == null ? List.<String>of() : assetIds) {
                    String assetId = normalizeId(rawAssetId);
                    if (!StringUtils.hasText(assetId)) {
                        continue;
                    }
                    SubEventAssignedAssetSettingsRecord settings = settingsByAssetId.get(assetId);
                    int quantity = Math.max(1, normalizeCount(settings == null ? null : settings.quantity()));
                    int[] capacity = capacityByTypeAndAsset
                            .computeIfAbsent(type, ignored -> new LinkedHashMap<>())
                            .computeIfAbsent(assetId, ignored -> new int[2]);
                    capacity[0] = Math.max(capacity[0], normalizeCount(settings == null ? null : settings.capacityMin()));
                    capacity[1] = Math.max(capacity[1],
                            normalizeCount(settings == null ? null : settings.capacityMax()) * quantity);
                }
            }
        }
        for (Map.Entry<String, Map<String, int[]>> typeEntry : capacityByTypeAndAsset.entrySet()) {
            SubEventResourceMetricDto current = metricOrEmpty(result.get(typeEntry.getKey()));
            int capacityMin = typeEntry.getValue().values().stream().mapToInt(value -> value[0]).sum();
            int capacityMax = typeEntry.getValue().values().stream().mapToInt(value -> value[1]).sum();
            result.put(typeEntry.getKey(), new SubEventResourceMetricDto(
                    AssetCatalog.TYPE_SUPPLIES.equals(typeEntry.getKey())
                            ? supplyQuantityByEntry.values().stream().mapToInt(Integer::intValue).sum()
                            : current.accepted(),
                    current.pending(),
                    capacityMin,
                    Math.max(capacityMin, capacityMax)));
        }
        return result;
    }

    private Map<String, SubEventResourceMetricDto> aggregateResourceMetricMaps(
            Collection<Map<String, SubEventResourceMetricDto>> metricsByScope) {
        Map<String, int[]> totalsByType = new LinkedHashMap<>();
        for (Map<String, SubEventResourceMetricDto> metricsByType : metricsByScope == null
                ? List.<Map<String, SubEventResourceMetricDto>>of()
                : metricsByScope) {
            for (Map.Entry<String, SubEventResourceMetricDto> entry
                    : (metricsByType == null
                            ? Map.<String, SubEventResourceMetricDto>of()
                            : metricsByType).entrySet()) {
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
                Instant.now().toString(),
                false);
        updateEventSubEventResourceCounters(ownerId, subEventId);
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
                persistResourceMetricSnapshot(record, actorUserId, nowIso, false);
            }
        }
        updateEventSubEventResourceCounters(normalizedOwnerId, normalizedSubEventId);
    }

    private Map<String, SubEventResourceMetricDto> persistResourceMetricSnapshot(
            ActivitySubEventResource record,
            String actorUserId,
            String nowIso,
            boolean markActorRead) {
        Map<String, AssetDetailDto> referencedAssets = resolveReferencedAssetDetails(record, actorUserId);
        ActivitySubEventResource next = filterToAssignableAssets(record, referencedAssets.keySet());
        Map<String, SubEventResourceMetricDto> metricsByType = resourceMetricsByType(next, referencedAssets);
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
                next.getUpdatedDate(),
                markActorRead);
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
        if (!StringUtils.hasText(normalizedAssetId)) {
            return new SubEventSupplyContributionPageDto(List.of(), 0, normalizedPage, normalizedPageSize);
        }
        List<SubEventSupplyContributionEntryRecord> entries = activitySubEventResourcesRepository
                .findByOwnerIdAndSubEventIdAndStatusNot(
                        normalizeId(ownerId),
                        normalizeId(subEventId),
                        STATUS_DELETED)
                .stream()
                .filter(Objects::nonNull)
                .filter(record -> record.getSupplyContributionEntriesByAssetId() != null)
                .flatMap(record -> record.getSupplyContributionEntriesByAssetId()
                        .getOrDefault(normalizedAssetId, List.of())
                        .stream())
                .filter(Objects::nonNull)
                .collect(java.util.stream.Collectors.toCollection(ArrayList::new));
        entries.sort(Comparator.comparing(
                entry -> normalizeDateTime(entry == null ? null : entry.addedAtIso(), ""),
                Comparator.reverseOrder()));
        int total = entries.size();
        long requestedStart = (long) normalizedPage * normalizedPageSize;
        int start = (int) Math.min(total, requestedStart);
        int end = Math.min(total, start + normalizedPageSize);
        List<SubEventSupplyContributionEntryRecord> pageEntries = entries.subList(start, end);
        Set<String> contributorUserIds = pageEntries.stream()
                .map(SubEventSupplyContributionEntryRecord::userId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .collect(LinkedHashSet::new, Set::add, Set::addAll);
        Map<String, Users> contributorsById = (contributorUserIds.isEmpty()
                ? List.<Users>of()
                : usersRepository.findByUserIdIn(contributorUserIds)).stream()
                .filter(Objects::nonNull)
                .collect(LinkedHashMap::new,
                        (target, user) -> target.put(normalizeId(user.getId()), user),
                        Map::putAll);
        List<SubEventSupplyContributionEntryDto> items = pageEntries.stream()
                .filter(Objects::nonNull)
                .map(entry -> {
                    Users contributor = contributorsById.get(normalizeId(entry.userId()));
                    return new SubEventSupplyContributionEntryDto(
                            safeText(entry.id()),
                            safeText(entry.userId()),
                            Math.max(0, entry.quantity() == null ? 0 : entry.quantity()),
                            normalizeDateTime(entry.addedAtIso(), ""),
                            safeText(contributor == null ? null : contributor.getName()),
                            safeText(contributor == null ? null : contributor.getInitials()),
                            safeText(contributor == null ? null : contributor.getGender()),
                            normalizeCount(contributor == null ? null : contributor.getAge()),
                            safeText(contributor == null ? null : contributor.getCity()));
                })
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
        requireAcceptedGroupMember(ownerId, subEventId, actorUserId);
        requireAcceptedGroupMember(ownerId, subEventId, assetOwnerUserId);

        ActivitySubEventResource current = resolveRecord(ownerId, subEventId, assetOwnerUserId);
        String nowIso = Instant.now().toString();
        Map<String, AssetDetailDto> eligibleAssets = assetsService.queryAssignableAssetDetails(
                assetOwnerUserId,
                authorizationEventId,
                subEventId,
                referencedAssetIds(request));
        Set<String> eligibleAssetIds = eligibleAssets == null ? Set.of() : eligibleAssets.keySet();
        Set<String> eligibleSupplyContributionAssetIds = new LinkedHashSet<>(eligibleAssetIds);
        activitySubEventResourcesRepository
                .findByOwnerIdAndSubEventIdAndStatusNot(ownerId, subEventId, STATUS_DELETED)
                .stream()
                .filter(Objects::nonNull)
                .map(ActivitySubEventResource::getAssetAssignmentIds)
                .filter(Objects::nonNull)
                .map(assignments -> assignments.getOrDefault(AssetCatalog.TYPE_SUPPLIES, List.of()))
                .filter(Objects::nonNull)
                .flatMap(Collection::stream)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .forEach(eligibleSupplyContributionAssetIds::add);

        ActivitySubEventResource next = current == null ? new ActivitySubEventResource() : cloneRecord(current);
        next.setId(current == null ? new ObjectId().toHexString() : current.getId());
        next.setSyncKey(current != null && StringUtils.hasText(current.getSyncKey()) ? current.getSyncKey().trim() : UUID.randomUUID().toString());
        next.setRecordId(current != null && StringUtils.hasText(current.getRecordId())
                ? current.getRecordId().trim()
                : recordId(ownerId, subEventId, assetOwnerUserId) + ":" + UUID.randomUUID());
        next.setOwnerKey(ownerKey(ownerId, assetOwnerUserId));
        next.setStatus(STATUS_ACTIVE);
        next.setOwnerId(ownerId);
        next.setSubEventId(subEventId);
        next.setAssetOwnerUserId(assetOwnerUserId);
        next.setAssetAssignmentIds(filterAssignmentIds(request.assetAssignmentIds(), eligibleAssetIds));
        next.setAssetSettingsByType(filterAssetSettings(request.assetSettingsByType(), eligibleAssetIds));
        next.setSupplyContributionEntriesByAssetId(filterSupplyContributionEntries(
                request.supplyContributionEntriesByAssetId(),
                eligibleSupplyContributionAssetIds));
        Set<String> addedSupplyAssetIds = addedAssignmentIds(
                current,
                next,
                AssetCatalog.TYPE_SUPPLIES);
        List<SupplyContributionAddition> addedSupplyContributions = addedSupplyContributions(current, next);
        List<SupplyContributionRemoval> removedSupplyContributions = removedSupplyContributions(current, next);
        List<AssetAssignmentRemoval> removedAssetAssignments = removedAssetAssignments(current, next);
        boolean resourceBecameEmpty = current != null && referencedAssetIds(next).isEmpty();
        Map<String, SubEventResourceMetricDto> metricsByType = resourceMetricsByType(next, eligibleAssets);
        next.setResourceMetricsByType(toResourceMetricRecords(metricsByType));
        if (resourceBecameEmpty) {
            next.setStatus(STATUS_DELETED);
        }
        next.setCreatedDate(current == null ? nowIso : normalizeDateTime(current.getCreatedDate(), nowIso));
        next.setCreatedUser(current == null ? assetOwnerUserId : safeText(current.getCreatedUser()));
        next.setUpdatedDate(nowIso);
        next.setUpdatedUser(assetOwnerUserId);

        ActivitySubEventResource saved = activitySubEventResourcesRepository.save(next);
        Map<String, SubEventResourceMetricDto> groupMetricsByType;
        if (resourceBecameEmpty) {
            removeGroupRuntimeResourceMetrics(saved, actorUserId, nowIso);
            groupMetricsByType = Map.of();
        } else {
            groupMetricsByType = persistGroupRuntimeResourceMetrics(
                    saved,
                    metricsByType,
                    actorUserId,
                    nowIso,
                    true);
        }
        Map<String, SubEventResourceMetricDto> commonMetrics =
                updateEventSubEventResourceCounters(ownerId, subEventId);
        if (commonMetrics.isEmpty()) {
            commonMetrics = groupMetricsByType;
        }
        enqueueSupplyContributionOpenNotifications(
                ownerId,
                subEventId,
                actorUserId,
                addedSupplyAssetIds,
                eligibleAssets);
        enqueueSupplyContributionAddedNotifications(
                ownerId,
                subEventId,
                actorUserId,
                addedSupplyContributions,
                eligibleAssets);
        enqueueSupplyContributionRemovedNotifications(
                ownerId,
                subEventId,
                actorUserId,
                removedSupplyContributions,
                eligibleAssets);
        enqueueAssetAssignmentRemovedNotifications(
                ownerId,
                subEventId,
                actorUserId,
                assetOwnerUserId,
                nowIso,
                removedAssetAssignments);
        assetsService.statusDeleteAssignmentScopeRequests(
                assetOwnerUserId,
                removedAssetAssignments.stream()
                        .map(AssetAssignmentRemoval::assetId)
                        .collect(LinkedHashSet::new, Set::add, Set::addAll),
                ownerId,
                authorizationEventId,
                subEventId,
                actorUserId,
                nowIso);
        refreshEventParticipationProjection(ownerId);
        return toMutationStateDto(saved, eligibleAssets, commonMetrics);
    }

    private Set<String> addedAssignmentIds(
            ActivitySubEventResource previous,
            ActivitySubEventResource next,
            String type) {
        Set<String> previousIds = assignmentIds(previous, type);
        Set<String> addedIds = assignmentIds(next, type);
        addedIds.removeAll(previousIds);
        return addedIds;
    }

    private Set<String> assignmentIds(ActivitySubEventResource resource, String type) {
        if (resource == null || resource.getAssetAssignmentIds() == null) {
            return new LinkedHashSet<>();
        }
        return resource.getAssetAssignmentIds().getOrDefault(type, List.of()).stream()
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .collect(LinkedHashSet::new, Set::add, Set::addAll);
    }

    private List<AssetAssignmentRemoval> removedAssetAssignments(
            ActivitySubEventResource previous,
            ActivitySubEventResource next) {
        List<AssetAssignmentRemoval> removals = new ArrayList<>();
        for (String type : List.of(
                AssetCatalog.TYPE_TRANSPORT,
                AssetCatalog.TYPE_ACCOMMODATION,
                AssetCatalog.TYPE_SUPPLIES)) {
            Set<String> removedIds = assignmentIds(previous, type);
            removedIds.removeAll(assignmentIds(next, type));
            removedIds.forEach(assetId -> removals.add(new AssetAssignmentRemoval(assetId, type)));
        }
        return removals;
    }

    private List<SupplyContributionAddition> addedSupplyContributions(
            ActivitySubEventResource previous,
            ActivitySubEventResource next) {
        Map<String, Set<String>> previousEntryIdsByAsset = new LinkedHashMap<>();
        if (previous != null && previous.getSupplyContributionEntriesByAssetId() != null) {
            previous.getSupplyContributionEntriesByAssetId().forEach((rawAssetId, entries) -> {
                String assetId = normalizeId(rawAssetId);
                if (!StringUtils.hasText(assetId)) {
                    return;
                }
                Set<String> entryIds = (entries == null ? List.<SubEventSupplyContributionEntryRecord>of() : entries)
                        .stream()
                        .filter(Objects::nonNull)
                        .map(SubEventSupplyContributionEntryRecord::id)
                        .map(this::normalizeId)
                        .filter(StringUtils::hasText)
                        .collect(LinkedHashSet::new, Set::add, Set::addAll);
                previousEntryIdsByAsset.put(assetId, entryIds);
            });
        }
        List<SupplyContributionAddition> additions = new ArrayList<>();
        if (next == null || next.getSupplyContributionEntriesByAssetId() == null) {
            return additions;
        }
        next.getSupplyContributionEntriesByAssetId().forEach((rawAssetId, entries) -> {
            String assetId = normalizeId(rawAssetId);
            Set<String> previousEntryIds = previousEntryIdsByAsset.getOrDefault(assetId, Set.of());
            for (SubEventSupplyContributionEntryRecord entry : entries == null
                    ? List.<SubEventSupplyContributionEntryRecord>of()
                    : entries) {
                String entryId = normalizeId(entry == null ? null : entry.id());
                if (StringUtils.hasText(assetId)
                        && StringUtils.hasText(entryId)
                        && !previousEntryIds.contains(entryId)
                        && normalizeCount(entry.quantity()) > 0) {
                    additions.add(new SupplyContributionAddition(
                            assetId,
                            entryId,
                            normalizeId(entry.userId()),
                            normalizeCount(entry.quantity())));
                }
            }
        });
        return additions;
    }

    private List<SupplyContributionRemoval> removedSupplyContributions(
            ActivitySubEventResource previous,
            ActivitySubEventResource next) {
        Map<String, Set<String>> nextEntryIdsByAsset = new LinkedHashMap<>();
        if (next != null && next.getSupplyContributionEntriesByAssetId() != null) {
            next.getSupplyContributionEntriesByAssetId().forEach((rawAssetId, entries) -> {
                String assetId = normalizeId(rawAssetId);
                if (!StringUtils.hasText(assetId)) {
                    return;
                }
                Set<String> entryIds = (entries == null ? List.<SubEventSupplyContributionEntryRecord>of() : entries)
                        .stream()
                        .filter(Objects::nonNull)
                        .map(SubEventSupplyContributionEntryRecord::id)
                        .map(this::normalizeId)
                        .filter(StringUtils::hasText)
                        .collect(LinkedHashSet::new, Set::add, Set::addAll);
                nextEntryIdsByAsset.put(assetId, entryIds);
            });
        }
        List<SupplyContributionRemoval> removals = new ArrayList<>();
        if (previous == null || previous.getSupplyContributionEntriesByAssetId() == null) {
            return removals;
        }
        previous.getSupplyContributionEntriesByAssetId().forEach((rawAssetId, entries) -> {
            String assetId = normalizeId(rawAssetId);
            Set<String> nextEntryIds = nextEntryIdsByAsset.getOrDefault(assetId, Set.of());
            for (SubEventSupplyContributionEntryRecord entry : entries == null
                    ? List.<SubEventSupplyContributionEntryRecord>of()
                    : entries) {
                String entryId = normalizeId(entry == null ? null : entry.id());
                if (StringUtils.hasText(assetId)
                        && StringUtils.hasText(entryId)
                        && !nextEntryIds.contains(entryId)
                        && normalizeCount(entry.quantity()) > 0) {
                    removals.add(new SupplyContributionRemoval(
                            assetId,
                            entryId,
                            normalizeId(entry.userId()),
                            normalizeCount(entry.quantity())));
                }
            }
        });
        return removals;
    }

    private void enqueueSupplyContributionOpenNotifications(
            String ownerId,
            String subEventId,
            String actorUserId,
            Set<String> addedSupplyAssetIds,
            Map<String, AssetDetailDto> assetDetails) {
        NotificationOutboxService notificationOutboxService = notificationOutboxServiceProvider == null
                ? null
                : notificationOutboxServiceProvider.getIfAvailable();
        if (notificationOutboxService == null || addedSupplyAssetIds == null || addedSupplyAssetIds.isEmpty()) {
            return;
        }
        List<String> recipients = resourceNotificationRecipientUserIds(ownerId, subEventId, actorUserId);
        if (recipients.isEmpty()) {
            return;
        }
        String eventId = authorizationEventId(ownerId, subEventId);
        ActivityEvent event = activityEventsRepository.findBySourceId(eventId).stream()
                .filter(Objects::nonNull)
                .findFirst()
                .orElse(null);
        String eventTitle = firstNonBlank(event == null ? null : event.getTitle(), "Event");
        String iconUrl = firstNonBlank(event == null ? null : event.getImageUrl(), "/assets/logo/heart.webp");
        for (String assetId : addedSupplyAssetIds) {
            AssetDetailDto asset = assetDetails == null ? null : assetDetails.get(assetId);
            String assetTitle = firstNonBlank(asset == null ? null : asset.title(), "Supplies");
            Map<String, String> payload = new LinkedHashMap<>();
            payload.put("eventId", eventId);
            payload.put("eventTitle", eventTitle);
            payload.put("ownerId", normalizeId(ownerId));
            payload.put("subEventId", normalizeId(subEventId));
            payload.put("assetId", assetId);
            payload.put("assetTitle", assetTitle);
            payload.put("resourceType", AssetCatalog.TYPE_SUPPLIES);
            payload.put("notification_tone", "info");
            notificationOutboxService.enqueue(new NotificationIntent(
                    "event-supplies-open",
                    "event",
                    eventId,
                    "event-resource-participants",
                    recipients,
                    "Supplies requested",
                    "Contributions open · " + assetTitle,
                    "/game",
                    iconUrl,
                    "/assets/logo/heart.webp",
                    "event-supplies-open-" + normalizeId(ownerId) + "-" + normalizeId(subEventId) + "-" + assetId,
                    payload,
                    normalizeId(actorUserId)));
        }
    }

    private void enqueueSupplyContributionAddedNotifications(
            String ownerId,
            String subEventId,
            String actorUserId,
            List<SupplyContributionAddition> additions,
            Map<String, AssetDetailDto> assetDetails) {
        NotificationOutboxService notificationOutboxService = notificationOutboxServiceProvider == null
                ? null
                : notificationOutboxServiceProvider.getIfAvailable();
        if (notificationOutboxService == null || additions == null || additions.isEmpty()) {
            return;
        }
        List<String> recipients = resourceNotificationRecipientUserIds(ownerId, subEventId, actorUserId);
        if (recipients.isEmpty()) {
            return;
        }
        String eventId = authorizationEventId(ownerId, subEventId);
        ActivityEvent event = activityEventsRepository.findBySourceId(eventId).stream()
                .filter(Objects::nonNull)
                .findFirst()
                .orElse(null);
        String eventTitle = firstNonBlank(event == null ? null : event.getTitle(), "Event");
        String iconUrl = firstNonBlank(event == null ? null : event.getImageUrl(), "/assets/logo/heart.webp");
        for (SupplyContributionAddition addition : additions) {
            AssetDetailDto asset = assetDetails == null ? null : assetDetails.get(addition.assetId());
            String assetTitle = firstNonBlank(asset == null ? null : asset.title(), "Supplies");
            Map<String, String> payload = new LinkedHashMap<>();
            payload.put("eventId", eventId);
            payload.put("eventTitle", eventTitle);
            payload.put("ownerId", normalizeId(ownerId));
            payload.put("subEventId", normalizeId(subEventId));
            payload.put("assetId", addition.assetId());
            payload.put("assetTitle", assetTitle);
            payload.put("contributionEntryId", addition.entryId());
            payload.put("contributorUserId", firstNonBlank(addition.contributorUserId(), normalizeId(actorUserId)));
            payload.put("quantity", Integer.toString(addition.quantity()));
            payload.put("resourceType", AssetCatalog.TYPE_SUPPLIES);
            payload.put("notification_tone", "info");
            notificationOutboxService.enqueue(new NotificationIntent(
                    "event-supplies-contribution-added",
                    "event",
                    eventId,
                    "event-resource-participants",
                    recipients,
                    "Supplies contribution added",
                    addition.quantity() + " added · " + assetTitle,
                    "/game",
                    iconUrl,
                    "/assets/logo/heart.webp",
                    "event-supplies-contribution-added-" + normalizeId(ownerId) + "-"
                            + normalizeId(subEventId) + "-" + addition.assetId() + "-" + addition.entryId(),
                    payload,
                    normalizeId(actorUserId)));
        }
    }

    private void enqueueSupplyContributionRemovedNotifications(
            String ownerId,
            String subEventId,
            String actorUserId,
            List<SupplyContributionRemoval> removals,
            Map<String, AssetDetailDto> assetDetails) {
        NotificationOutboxService notificationOutboxService = notificationOutboxServiceProvider == null
                ? null
                : notificationOutboxServiceProvider.getIfAvailable();
        if (notificationOutboxService == null || removals == null || removals.isEmpty()) {
            return;
        }
        List<String> recipients = resourceNotificationRecipientUserIds(ownerId, subEventId, actorUserId);
        if (recipients.isEmpty()) {
            return;
        }
        String eventId = authorizationEventId(ownerId, subEventId);
        ActivityEvent event = activityEventsRepository.findBySourceId(eventId).stream()
                .filter(Objects::nonNull)
                .findFirst()
                .orElse(null);
        String eventTitle = firstNonBlank(event == null ? null : event.getTitle(), "Event");
        String iconUrl = firstNonBlank(event == null ? null : event.getImageUrl(), "/assets/logo/heart.webp");
        for (SupplyContributionRemoval removal : removals) {
            AssetDetailDto asset = assetDetails == null ? null : assetDetails.get(removal.assetId());
            String assetTitle = firstNonBlank(asset == null ? null : asset.title(), "Supplies");
            Map<String, String> payload = new LinkedHashMap<>();
            payload.put("eventId", eventId);
            payload.put("eventTitle", eventTitle);
            payload.put("ownerId", normalizeId(ownerId));
            payload.put("subEventId", normalizeId(subEventId));
            payload.put("assetId", removal.assetId());
            payload.put("assetTitle", assetTitle);
            payload.put("contributionEntryId", removal.entryId());
            payload.put("contributorUserId", firstNonBlank(removal.contributorUserId(), normalizeId(actorUserId)));
            payload.put("quantity", Integer.toString(removal.quantity()));
            payload.put("resourceType", AssetCatalog.TYPE_SUPPLIES);
            payload.put("notification_tone", "info");
            notificationOutboxService.enqueue(new NotificationIntent(
                    "event-supplies-contribution-removed",
                    "event",
                    eventId,
                    "event-resource-participants",
                    recipients,
                    "Supplies contribution removed",
                    removal.quantity() + " removed · " + assetTitle,
                    "/game",
                    iconUrl,
                    "/assets/logo/heart.webp",
                    "event-supplies-contribution-removed-" + normalizeId(ownerId) + "-"
                            + normalizeId(subEventId) + "-" + removal.assetId() + "-" + removal.entryId(),
                    payload,
                    normalizeId(actorUserId)));
        }
    }

    private void enqueueAssetAssignmentRemovedNotifications(
            String ownerId,
            String subEventId,
            String actorUserId,
            String assetOwnerUserId,
            String removedAtIso,
            List<AssetAssignmentRemoval> removals) {
        NotificationOutboxService notificationOutboxService = notificationOutboxServiceProvider == null
                ? null
                : notificationOutboxServiceProvider.getIfAvailable();
        if (notificationOutboxService == null || removals == null || removals.isEmpty()) {
            return;
        }
        Set<String> removedAssetIds = removals.stream()
                .map(AssetAssignmentRemoval::assetId)
                .collect(LinkedHashSet::new, Set::add, Set::addAll);
        Map<String, AssetDetailDto> resolvedAssetDetails = assetsService.queryReferencedAssetDetails(
                assetOwnerUserId,
                removedAssetIds);
        Map<String, AssetDetailDto> assetDetails = resolvedAssetDetails == null
                ? Map.of()
                : resolvedAssetDetails;
        String eventId = authorizationEventId(ownerId, subEventId);
        ActivityEvent event = activityEventsRepository.findBySourceId(eventId).stream()
                .filter(Objects::nonNull)
                .findFirst()
                .orElse(null);
        String eventTitle = firstNonBlank(event == null ? null : event.getTitle(), "Event");
        String iconUrl = firstNonBlank(event == null ? null : event.getImageUrl(), "/assets/logo/heart.webp");
        List<String> activeParticipantUserIds = resourceNotificationRecipientUserIds(
                ownerId,
                subEventId,
                actorUserId);
        for (AssetAssignmentRemoval removal : removals) {
            AssetDetailDto asset = assetDetails == null ? null : assetDetails.get(removal.assetId());
            LinkedHashSet<String> recipientUserIds = new LinkedHashSet<>(activeParticipantUserIds);
            String normalizedAssetOwnerUserId = normalizeId(assetOwnerUserId);
            if (StringUtils.hasText(normalizedAssetOwnerUserId)
                    && !normalizedAssetOwnerUserId.equals(normalizeId(actorUserId))) {
                recipientUserIds.add(normalizedAssetOwnerUserId);
            }
            recipientUserIds.addAll(activeAssetMemberUserIds(
                    asset,
                    ownerId,
                    subEventId,
                    actorUserId));
            if (recipientUserIds.isEmpty()) {
                continue;
            }
            String assetTitle = firstNonBlank(asset == null ? null : asset.title(), "Asset");
            Map<String, String> payload = new LinkedHashMap<>();
            payload.put("eventId", eventId);
            payload.put("eventTitle", eventTitle);
            payload.put("ownerId", normalizeId(ownerId));
            payload.put("subEventId", normalizeId(subEventId));
            payload.put("assetId", removal.assetId());
            payload.put("assetTitle", assetTitle);
            payload.put("resourceType", removal.resourceType());
            payload.put("removedAtIso", removedAtIso);
            payload.put("notification_tone", "info");
            notificationOutboxService.enqueue(new NotificationIntent(
                    "event-asset-assignment-removed",
                    "event",
                    eventId,
                    "asset-members",
                    List.copyOf(recipientUserIds),
                    "Asset assignment removed",
                    "Assignment ended · " + assetTitle,
                    "/game",
                    iconUrl,
                    "/assets/logo/heart.webp",
                    "event-asset-assignment-removed-" + normalizeId(ownerId) + "-"
                            + normalizeId(subEventId) + "-" + removal.assetId() + "-" + removedAtIso,
                    payload,
                    normalizeId(actorUserId)));
        }
    }

    private List<String> activeAssetMemberUserIds(
            AssetDetailDto asset,
            String ownerId,
            String subEventId,
            String actorUserId) {
        String normalizedOwnerId = normalizeId(ownerId);
        String normalizedSubEventId = normalizeId(subEventId);
        String normalizedActorUserId = normalizeId(actorUserId);
        return (asset == null || asset.requests() == null
                ? List.<AssetMemberRequestDto>of()
                : asset.requests()).stream()
                .filter(Objects::nonNull)
                .filter(request -> isScopedAssetRequest(request, normalizedOwnerId, normalizedSubEventId))
                .filter(request -> Set.of("accepted", "pending")
                        .contains(safeText(request.status()).toLowerCase(Locale.ROOT)))
                .map(AssetMemberRequestDto::userId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .filter(userId -> !userId.equals(normalizedActorUserId))
                .distinct()
                .toList();
    }

    private List<String> resourceNotificationRecipientUserIds(
            String ownerId,
            String subEventId,
            String actorUserId) {
        ActivitiesMembersService membersService = activitiesMembersServiceProvider.getIfAvailable();
        if (membersService == null) {
            return List.of();
        }
        GroupRuntimeScope scope = groupRuntimeScope(ownerId, subEventId);
        ActivitiesMembersService.OwnerMembersSnapshot snapshot;
        if (scope == null) {
            snapshot = membersService.queryOwnerSnapshot(
                    "event",
                    authorizationEventId(ownerId, subEventId));
        } else {
            String randomRoomOwnerId = "random-room:"
                    + scope.runtimeOwnerId()
                    + ":"
                    + scope.subEventId()
                    + ":"
                    + scope.groupId();
            if (membersService.hasStoredOwnerMembers("event", randomRoomOwnerId)) {
                snapshot = membersService.queryOwnerSnapshot("event", randomRoomOwnerId);
            } else if (membersService.hasStoredOwnerMembers("group", ownerId)) {
                snapshot = membersService.queryOwnerSnapshot("group", ownerId);
            } else {
                snapshot = membersService.queryOwnerSnapshot("group", scope.groupId());
            }
        }
        String normalizedActorUserId = normalizeId(actorUserId);
        return snapshot == null ? List.of() : snapshot.acceptedMemberUserIds().stream()
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .filter(userId -> !userId.equals(normalizedActorUserId))
                .distinct()
                .toList();
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
        Set<String> removedAssignedAssetIds = new LinkedHashSet<>();
        Criteria eventResourceScope = new Criteria().orOperator(
                Criteria.where("ownerId").is(normalizedOwnerId),
                Criteria.where("ownerId").regex(Pattern.compile("^" + Pattern.quote(normalizedOwnerId) + ":")));
        List<ActivitySubEventResource> activeRecords = mongoTemplate.find(
                Query.query(new Criteria().andOperator(
                        Criteria.where("status").ne(STATUS_DELETED),
                        eventResourceScope)),
                ActivitySubEventResource.class);
        Set<String> changedScopes = new LinkedHashSet<>();
        Set<String> changedOwnerIds = new LinkedHashSet<>();
        for (ActivitySubEventResource record : activeRecords) {
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
            Map<String, AssetDetailDto> referencedAssets = resolveReferencedAssetDetails(next, actorUserId);
            ActivitySubEventResource filtered = filterToAssignableAssets(next, referencedAssets.keySet());
            next.setAssetAssignmentIds(filtered.getAssetAssignmentIds());
            next.setAssetSettingsByType(filtered.getAssetSettingsByType());
            next.setSupplyContributionEntriesByAssetId(filtered.getSupplyContributionEntriesByAssetId());
            Map<String, SubEventResourceMetricDto> metricsByType = resourceMetricsByType(next, referencedAssets);
            next.setResourceMetricsByType(toResourceMetricRecords(metricsByType));
            List<AssetAssignmentRemoval> removals = removedAssetAssignments(record, next);
            boolean resourceBecameEmpty = referencedAssetIds(next).isEmpty();
            if (resourceBecameEmpty) {
                next.setStatus(STATUS_DELETED);
            }
            next.setUpdatedDate(effectiveNowIso);
            next.setUpdatedUser(StringUtils.hasText(normalizedActorUserId)
                    ? normalizedActorUserId
                    : firstNonBlank(record.getUpdatedUser(), record.getAssetOwnerUserId()));
            ActivitySubEventResource saved = activitySubEventResourcesRepository.save(next);
            if (resourceBecameEmpty) {
                removeGroupRuntimeResourceMetrics(saved, normalizedActorUserId, effectiveNowIso);
            } else {
                persistGroupRuntimeResourceMetrics(
                        saved,
                        metricsByType,
                        normalizedActorUserId,
                        effectiveNowIso,
                        false);
            }
            enqueueAssetAssignmentRemovedNotifications(
                    saved.getOwnerId(),
                    saved.getSubEventId(),
                    normalizedActorUserId,
                    saved.getAssetOwnerUserId(),
                    effectiveNowIso,
                    removals);
            assetsService.statusDeleteAssignmentScopeRequests(
                    saved.getAssetOwnerUserId(),
                    cleanup.removedAssignedAssetIds(),
                    saved.getOwnerId(),
                    authorizationEventId(saved.getOwnerId(), saved.getSubEventId()),
                    saved.getSubEventId(),
                    normalizedActorUserId,
                    effectiveNowIso);
            String changedOwnerId = normalizeId(saved.getOwnerId());
            String changedSubEventId = normalizeId(saved.getSubEventId());
            if (StringUtils.hasText(changedOwnerId) && StringUtils.hasText(changedSubEventId)) {
                changedScopes.add(changedOwnerId + "\n" + changedSubEventId);
                changedOwnerIds.add(changedOwnerId);
            }
        }
        for (String scope : changedScopes) {
            String[] parts = scope.split("\n", 2);
            updateEventSubEventResourceCounters(parts[0], parts[1]);
        }
        changedOwnerIds.forEach(this::refreshEventParticipationProjection);
        return removedAssignedAssetIds;
    }

    public void removeAssetFromResourceAssignments(String assetId, String actorUserId) {
        String normalizedAssetId = normalizeId(assetId);
        if (!StringUtils.hasText(normalizedAssetId)) {
            return;
        }

        Criteria referencedAsset = new Criteria().orOperator(
                Criteria.where("assetAssignmentIds." + AssetCatalog.TYPE_TRANSPORT).is(normalizedAssetId),
                Criteria.where("assetAssignmentIds." + AssetCatalog.TYPE_ACCOMMODATION).is(normalizedAssetId),
                Criteria.where("assetAssignmentIds." + AssetCatalog.TYPE_SUPPLIES).is(normalizedAssetId),
                Criteria.where("assetSettingsByType." + AssetCatalog.TYPE_TRANSPORT + "." + normalizedAssetId).exists(true),
                Criteria.where("assetSettingsByType." + AssetCatalog.TYPE_ACCOMMODATION + "." + normalizedAssetId).exists(true),
                Criteria.where("assetSettingsByType." + AssetCatalog.TYPE_SUPPLIES + "." + normalizedAssetId).exists(true),
                Criteria.where("supplyContributionEntriesByAssetId." + normalizedAssetId).exists(true));
        Query query = Query.query(new Criteria().andOperator(
                Criteria.where("status").ne(STATUS_DELETED),
                referencedAsset));
        List<ActivitySubEventResource> records = mongoTemplate.find(query, ActivitySubEventResource.class);
        if (records.isEmpty()) {
            return;
        }

        String normalizedActorUserId = normalizeId(actorUserId);
        String nowIso = Instant.now().toString();
        Set<String> changedScopes = new LinkedHashSet<>();
        Set<String> changedOwnerIds = new LinkedHashSet<>();
        for (ActivitySubEventResource record : records) {
            if (record == null || !referencedAssetIds(record).contains(normalizedAssetId)) {
                continue;
            }
            ActivitySubEventResource next = cloneRecord(record);
            Map<String, List<String>> assignmentIds = filterAssignmentIds(next.getAssetAssignmentIds(), null);
            assignmentIds.replaceAll((type, ids) -> ids.stream()
                    .filter(id -> !normalizedAssetId.equals(normalizeId(id)))
                    .toList());
            assignmentIds.entrySet().removeIf(entry -> entry.getValue().isEmpty());
            next.setAssetAssignmentIds(assignmentIds);

            Map<String, Map<String, SubEventAssignedAssetSettingsRecord>> settingsByType =
                    filterSettings(next.getAssetSettingsByType(), null);
            settingsByType.values().forEach(settings -> settings.remove(normalizedAssetId));
            settingsByType.entrySet().removeIf(entry -> entry.getValue().isEmpty());
            next.setAssetSettingsByType(settingsByType);

            Map<String, List<SubEventSupplyContributionEntryRecord>> supplyEntries =
                    filterSupplyEntries(next.getSupplyContributionEntriesByAssetId(), null);
            supplyEntries.remove(normalizedAssetId);
            next.setSupplyContributionEntriesByAssetId(supplyEntries);

            Map<String, AssetDetailDto> referencedAssets = resolveReferencedAssetDetails(next, normalizedActorUserId);
            next.setResourceMetricsByType(toResourceMetricRecords(resourceMetricsByType(next, referencedAssets)));
            boolean resourceBecameEmpty = referencedAssetIds(next).isEmpty();
            if (resourceBecameEmpty) {
                next.setStatus(STATUS_DELETED);
            }
            next.setUpdatedDate(nowIso);
            next.setUpdatedUser(StringUtils.hasText(normalizedActorUserId)
                    ? normalizedActorUserId
                    : firstNonBlank(record.getUpdatedUser(), record.getAssetOwnerUserId()));
            ActivitySubEventResource saved = activitySubEventResourcesRepository.save(next);
            if (resourceBecameEmpty) {
                removeGroupRuntimeResourceMetrics(saved, normalizedActorUserId, nowIso);
            } else {
                persistGroupRuntimeResourceMetrics(
                        saved,
                        resourceMetricsByType(saved, referencedAssets),
                        normalizedActorUserId,
                        nowIso,
                        false);
            }

            String ownerId = normalizeId(saved.getOwnerId());
            String subEventId = normalizeId(saved.getSubEventId());
            if (StringUtils.hasText(ownerId) && StringUtils.hasText(subEventId)) {
                changedScopes.add(ownerId + "\n" + subEventId);
                changedOwnerIds.add(ownerId);
            }
        }
        for (String scope : changedScopes) {
            String[] parts = scope.split("\n", 2);
            updateEventSubEventResourceCounters(parts[0], parts[1]);
        }
        changedOwnerIds.forEach(this::refreshEventParticipationProjection);
    }

    public String scopedAssetManagerUserId(String ownerId, String subEventId, String assetId) {
        String normalizedOwnerId = normalizeId(ownerId);
        String normalizedSubEventId = normalizeId(subEventId);
        String normalizedAssetId = normalizeId(assetId);
        if (!StringUtils.hasText(normalizedOwnerId)
                || !StringUtils.hasText(normalizedSubEventId)
                || !StringUtils.hasText(normalizedAssetId)) {
            return null;
        }
        for (ActivitySubEventResource record : activitySubEventResourcesRepository
                .findByOwnerIdAndSubEventIdAndStatusNot(
                        normalizedOwnerId,
                        normalizedSubEventId,
                        STATUS_DELETED)) {
            if (record == null || record.getAssetSettingsByType() == null) {
                continue;
            }
            for (Map<String, SubEventAssignedAssetSettingsRecord> settingsByAssetId
                    : record.getAssetSettingsByType().values()) {
                SubEventAssignedAssetSettingsRecord settings = settingsByAssetId == null
                        ? null
                        : settingsByAssetId.get(normalizedAssetId);
                String managerUserId = normalizeId(settings == null ? null : settings.addedByUserId());
                if (StringUtils.hasText(managerUserId)) {
                    return managerUserId;
                }
            }
        }
        return null;
    }

    public boolean transferScopedAssetManager(
            String ownerId,
            String subEventId,
            String assetId,
            String expectedManagerUserId,
            String successorUserId) {
        String normalizedOwnerId = normalizeId(ownerId);
        String normalizedSubEventId = normalizeId(subEventId);
        String normalizedAssetId = normalizeId(assetId);
        String normalizedExpectedManagerUserId = normalizeId(expectedManagerUserId);
        String normalizedSuccessorUserId = normalizeId(successorUserId);
        if (!StringUtils.hasText(normalizedOwnerId)
                || !StringUtils.hasText(normalizedSubEventId)
                || !StringUtils.hasText(normalizedAssetId)
                || !StringUtils.hasText(normalizedExpectedManagerUserId)
                || !StringUtils.hasText(normalizedSuccessorUserId)
                || normalizedExpectedManagerUserId.equals(normalizedSuccessorUserId)) {
            return false;
        }

        String nowIso = Instant.now().toString();
        for (String type : AssetCatalog.ASSET_TYPES) {
            String managerPath = "assetSettingsByType." + type + "." + normalizedAssetId + ".addedByUserId";
            Query query = Query.query(new Criteria().andOperator(
                    Criteria.where("ownerId").is(normalizedOwnerId),
                    Criteria.where("subEventId").is(normalizedSubEventId),
                    Criteria.where("status").ne(STATUS_DELETED),
                    Criteria.where(managerPath).is(normalizedExpectedManagerUserId)));
            Update update = new Update()
                    .set(managerPath, normalizedSuccessorUserId)
                    .set("updatedDate", nowIso)
                    .set("updatedUser", normalizedSuccessorUserId);
            if (mongoTemplate.updateFirst(query, update, ActivitySubEventResource.class).getModifiedCount() == 1) {
                refreshEventParticipationProjection(normalizedOwnerId);
                return true;
            }
        }
        return false;
    }

    public boolean removeScopedAssetAssignment(
            String ownerId,
            String subEventId,
            String assetId,
            String expectedManagerUserId,
            String actorUserId) {
        String normalizedOwnerId = normalizeId(ownerId);
        String normalizedSubEventId = normalizeId(subEventId);
        String normalizedAssetId = normalizeId(assetId);
        String normalizedExpectedManagerUserId = normalizeId(expectedManagerUserId);
        String normalizedActorUserId = normalizeId(actorUserId);
        if (!StringUtils.hasText(normalizedOwnerId)
                || !StringUtils.hasText(normalizedSubEventId)
                || !StringUtils.hasText(normalizedAssetId)
                || !StringUtils.hasText(normalizedExpectedManagerUserId)
                || !normalizedExpectedManagerUserId.equals(normalizedActorUserId)) {
            return false;
        }

        for (ActivitySubEventResource record : activitySubEventResourcesRepository
                .findByOwnerIdAndSubEventIdAndStatusNot(
                        normalizedOwnerId,
                        normalizedSubEventId,
                        STATUS_DELETED)) {
            if (record == null || !referencedAssetIds(record).contains(normalizedAssetId)) {
                continue;
            }
            boolean managedByExpectedUser = record.getAssetSettingsByType() != null
                    && record.getAssetSettingsByType().values().stream()
                            .filter(Objects::nonNull)
                            .map(settings -> settings.get(normalizedAssetId))
                            .filter(Objects::nonNull)
                            .map(SubEventAssignedAssetSettingsRecord::addedByUserId)
                            .map(this::normalizeId)
                            .anyMatch(normalizedExpectedManagerUserId::equals);
            if (!managedByExpectedUser) {
                continue;
            }

            ActivitySubEventResource next = cloneRecord(record);
            Map<String, List<String>> assignmentIds = filterAssignmentIds(next.getAssetAssignmentIds(), null);
            assignmentIds.replaceAll((type, ids) -> ids.stream()
                    .filter(id -> !normalizedAssetId.equals(normalizeId(id)))
                    .toList());
            assignmentIds.entrySet().removeIf(entry -> entry.getValue().isEmpty());
            next.setAssetAssignmentIds(assignmentIds);

            Map<String, Map<String, SubEventAssignedAssetSettingsRecord>> settingsByType =
                    filterSettings(next.getAssetSettingsByType(), null);
            settingsByType.values().forEach(settings -> settings.remove(normalizedAssetId));
            settingsByType.entrySet().removeIf(entry -> entry.getValue().isEmpty());
            next.setAssetSettingsByType(settingsByType);

            Map<String, List<SubEventSupplyContributionEntryRecord>> supplyEntries =
                    filterSupplyEntries(next.getSupplyContributionEntriesByAssetId(), null);
            supplyEntries.remove(normalizedAssetId);
            next.setSupplyContributionEntriesByAssetId(supplyEntries);

            Map<String, AssetDetailDto> referencedAssets = resolveReferencedAssetDetails(next, normalizedActorUserId);
            Map<String, SubEventResourceMetricDto> metricsByType = resourceMetricsByType(next, referencedAssets);
            next.setResourceMetricsByType(toResourceMetricRecords(metricsByType));
            boolean resourceBecameEmpty = referencedAssetIds(next).isEmpty();
            if (resourceBecameEmpty) {
                next.setStatus(STATUS_DELETED);
            }
            String nowIso = Instant.now().toString();
            next.setUpdatedDate(nowIso);
            next.setUpdatedUser(normalizedActorUserId);
            ActivitySubEventResource saved = activitySubEventResourcesRepository.save(next);
            if (resourceBecameEmpty) {
                removeGroupRuntimeResourceMetrics(saved, normalizedActorUserId, nowIso);
            } else {
                persistGroupRuntimeResourceMetrics(
                        saved,
                        metricsByType,
                        normalizedActorUserId,
                        nowIso,
                        false);
            }
            enqueueAssetAssignmentRemovedNotifications(
                    saved.getOwnerId(),
                    saved.getSubEventId(),
                    normalizedActorUserId,
                    saved.getAssetOwnerUserId(),
                    nowIso,
                    removedAssetAssignments(record, next));
            updateEventSubEventResourceCounters(normalizedOwnerId, normalizedSubEventId);
            refreshEventParticipationProjection(normalizedOwnerId);
            return true;
        }
        return false;
    }

    private void removeGroupRuntimeResourceMetrics(
            ActivitySubEventResource resource,
            String actorUserId,
            String nowIso) {
        GroupRuntimeScope scope = groupRuntimeScope(resource == null ? null : resource.getOwnerId(),
                resource == null ? null : resource.getSubEventId());
        String assetOwnerUserId = normalizeId(resource == null ? null : resource.getAssetOwnerUserId());
        if (scope == null || !StringUtils.hasText(assetOwnerUserId)) {
            return;
        }
        ActivitySubEventStageRuntime runtime = activitySubEventStageRuntimeRepository
                .findByOwnerIdAndSubEventId(scope.runtimeOwnerId(), scope.subEventId())
                .orElse(null);
        if (runtime == null) {
            return;
        }

        Map<String, Map<String, Map<String, GroupResourceMetricRecord>>> byGroup =
                cloneGroupRuntimeMetrics(runtime.getGroupResourceMetricsByAssetOwnerId());
        Map<String, Map<String, GroupResourceMetricRecord>> byAssetOwner = new LinkedHashMap<>(
                byGroup.getOrDefault(scope.groupId(), Map.of()));
        Map<String, GroupResourceMetricRecord> removedMetrics = byAssetOwner.remove(assetOwnerUserId);
        if (removedMetrics == null) {
            return;
        }
        if (byAssetOwner.isEmpty()) {
            byGroup.remove(scope.groupId());
        } else {
            byGroup.put(scope.groupId(), byAssetOwner);
        }
        runtime.setGroupResourceMetricsByAssetOwnerId(byGroup);
        runtime.setGroupResourceReadAtByUserId(clearGroupResourceReads(
                runtime.getGroupResourceReadAtByUserId(),
                scope.groupId(),
                removedMetrics.keySet()));
        runtime.setUpdatedDate(nowIso);
        runtime.setUpdatedUser(normalizeId(actorUserId));
        activitySubEventStageRuntimeRepository.save(runtime);
        tournamentGroupCounterService.syncParent(scope.runtimeOwnerId(), scope.subEventId());
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

    private Map<String, AssetDetailDto> resolveReferencedAssetDetails(
            ActivitySubEventResource record,
            String viewerUserId) {
        if (record == null) {
            return Map.of();
        }
        String normalizedViewerUserId = normalizeId(viewerUserId);
        Map<String, AssetDetailDto> details = assetsService.queryReferencedAssetDetails(
                StringUtils.hasText(normalizedViewerUserId)
                        ? normalizedViewerUserId
                        : record.getAssetOwnerUserId(),
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

    private ActivitySubEventResourceStateDto toMutationStateDto(
            ActivitySubEventResource record,
            Map<String, AssetDetailDto> eligibleAssets,
            Map<String, SubEventResourceMetricDto> metricsByType) {
        if (record == null || !STATUS_DELETED.equals(safeText(record.getStatus()))) {
            return toStateDto(record, eligibleAssets, metricsByType);
        }
        return new ActivitySubEventResourceStateDto(
                normalizeId(record.getOwnerId()),
                normalizeId(record.getSubEventId()),
                normalizeId(record.getAssetOwnerUserId()),
                Map.of(),
                Map.of(),
                Map.of(),
                fallbackAssetCardsByType(eligibleAssets),
                metricsByType == null ? Map.of() : metricsByType);
    }

    private ActivitySubEventResourceStateDto toStateDto(
            ActivitySubEventResource record,
            Map<String, AssetDetailDto> eligibleAssets,
            Map<String, SubEventResourceMetricDto> metricsByType) {
        ActivitySubEventResourceStateDto base = activitySubEventResourceMapper.toDto(record);
        if (base == null) {
            return null;
        }
        Map<String, List<AssetDetailDto>> fallbackByType = fallbackAssetCardsByType(eligibleAssets);
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

    private Map<String, List<AssetDetailDto>> fallbackAssetCardsByType(
            Map<String, AssetDetailDto> eligibleAssets) {
        Map<String, List<AssetDetailDto>> fallbackByType = new LinkedHashMap<>();
        for (AssetDetailDto detail : eligibleAssets == null ? List.<AssetDetailDto>of() : eligibleAssets.values()) {
            if (detail == null) {
                continue;
            }
            String type = safeText(detail.type());
            fallbackByType.computeIfAbsent(type, ignored -> new ArrayList<>()).add(detail);
        }
        return fallbackByType;
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
                if (managerUserId.equals(normalizeId(detail.ownerUserId()))
                        && !StringUtils.hasText(safeText(detail.ownerReleasedAtIso()))) {
                    accepted += 1;
                }
            }
        }
        if (AssetCatalog.TYPE_SUPPLIES.equals(type)) {
            accepted = record == null || record.getSupplyContributionEntriesByAssetId() == null
                    ? 0
                    : record.getSupplyContributionEntriesByAssetId().values().stream()
                            .filter(Objects::nonNull)
                            .flatMap(Collection::stream)
                            .filter(Objects::nonNull)
                            .mapToInt(entry -> normalizeCount(entry.quantity()))
                            .sum();
        }
        return new SubEventResourceMetricDto(
                accepted,
                pending,
                capacityMin,
                Math.max(capacityMin, capacityMax));
    }

    private int[] assetRequestCounts(
            List<AssetMemberRequestDto> requests,
            String ownerId,
            String subEventId) {
        Map<String, String> statusByIdentity = new LinkedHashMap<>();
        for (AssetMemberRequestDto request : requests == null ? List.<AssetMemberRequestDto>of() : requests) {
            if (!isScopedAssetRequest(request, ownerId, subEventId)) {
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
                .filter(request -> isScopedAssetRequest(request, normalizedOwnerId, normalizedSubEventId))
                .filter(request -> Objects.equals(normalizedUserId, normalizeId(request.userId())))
                .map(request -> safeText(request.status()).toLowerCase(Locale.ROOT))
                .anyMatch(status -> "accepted".equals(status) || "pending".equals(status));
    }

    private boolean isScopedAssetRequest(
            AssetMemberRequestDto request,
            String ownerId,
            String subEventId) {
        if (request == null || request.booking() == null) {
            return false;
        }
        String normalizedOwnerId = normalizeId(ownerId);
        String normalizedSubEventId = normalizeId(subEventId);
        String bookingOwnerId = normalizeId(request.booking().eventId());
        return Objects.equals(normalizedSubEventId, normalizeId(request.booking().subEventId()))
                && (Objects.equals(normalizedOwnerId, bookingOwnerId)
                        || Objects.equals(
                                authorizationEventId(normalizedOwnerId, normalizedSubEventId),
                                bookingOwnerId));
    }

    private Map<String, SubEventResourceMetricDto> persistGroupRuntimeResourceMetrics(
            ActivitySubEventResource resource,
            Map<String, SubEventResourceMetricDto> metricsByType,
            String actorUserId,
            String nowIso,
            boolean markActorRead) {
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
            runtime.setGroupResourceReadAtByUserId(markActorRead
                    ? markGroupResourceTypesRead(
                            readsByGroup,
                            scope.groupId(),
                            actorUserId,
                            changedResourceTypes,
                            nowIso)
                    : readsByGroup);
        }
        runtime.setCreatedDate(StringUtils.hasText(runtime.getCreatedDate()) ? runtime.getCreatedDate() : nowIso);
        runtime.setCreatedUser(StringUtils.hasText(runtime.getCreatedUser()) ? runtime.getCreatedUser() : normalizeId(actorUserId));
        runtime.setUpdatedDate(nowIso);
        runtime.setUpdatedUser(normalizeId(actorUserId));
        activitySubEventStageRuntimeRepository.save(runtime);
        tournamentGroupCounterService.syncParent(scope.runtimeOwnerId(), scope.subEventId());
        return aggregateGroupRuntimeMetrics(byAssetOwner);
    }

    private Map<String, SubEventResourceMetricDto> aggregateGroupRuntimeMetrics(
            Map<String, Map<String, GroupResourceMetricRecord>> byAssetOwner) {
        return aggregateResourceMetricMaps((byAssetOwner == null
                ? List.<Map<String, GroupResourceMetricRecord>>of()
                : byAssetOwner.values()).stream()
                .map(this::groupResourceMetricsByType)
                .toList());
    }

    private Map<String, SubEventResourceMetricDto> groupResourceMetricsByType(
            Map<String, GroupResourceMetricRecord> metricsByType) {
        Map<String, SubEventResourceMetricDto> result = new LinkedHashMap<>();
        for (Map.Entry<String, GroupResourceMetricRecord> entry : (metricsByType == null
                ? Map.<String, GroupResourceMetricRecord>of()
                : metricsByType).entrySet()) {
            GroupResourceMetricRecord metric = entry.getValue();
            if (metric != null) {
                result.put(entry.getKey(), new SubEventResourceMetricDto(
                        normalizeCount(metric.accepted()),
                        normalizeCount(metric.pending()),
                        normalizeCount(metric.capacityMin()),
                        normalizeCount(metric.capacityMax())));
            }
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

    private void requireAcceptedGroupMember(String ownerId, String subEventId, String userId) {
        GroupRuntimeScope scope = groupRuntimeScope(ownerId, subEventId);
        if (scope == null) {
            return;
        }
        String normalizedUserId = normalizeId(userId);
        ActivitiesMembersService activitiesMembersService = activitiesMembersServiceProvider.getIfAvailable();
        if (!StringUtils.hasText(normalizedUserId) || activitiesMembersService == null) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Accepted group membership is required.");
        }

        String randomRoomOwnerId = "random-room:"
                + scope.runtimeOwnerId()
                + ":"
                + scope.subEventId()
                + ":"
                + scope.groupId();
        if (activitiesMembersService.hasStoredOwnerMembers("event", randomRoomOwnerId)) {
            requireAcceptedMembership("event", randomRoomOwnerId, normalizedUserId);
            return;
        }
        if (activitiesMembersService.hasStoredOwnerMembers("group", ownerId)) {
            requireAcceptedMembership("group", ownerId, normalizedUserId);
            return;
        }
        requireAcceptedMembership("group", scope.groupId(), normalizedUserId);
    }

    private void requireAcceptedMembership(String ownerType, String ownerId, String userId) {
        if (!accessControlService.hasAcceptedParticipation(ownerType, ownerId, userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Accepted group membership is required.");
        }
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

    private record SupplyContributionAddition(
            String assetId,
            String entryId,
            String contributorUserId,
            int quantity) {
    }

    private record SupplyContributionRemoval(
            String assetId,
            String entryId,
            String contributorUserId,
            int quantity) {
    }

    private record AssetAssignmentRemoval(
            String assetId,
            String resourceType) {
    }
}
