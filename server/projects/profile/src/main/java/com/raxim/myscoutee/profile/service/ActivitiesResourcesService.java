package com.raxim.myscoutee.profile.service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.profile.data.AssetCatalog;
import com.raxim.myscoutee.profile.data.document.ActivityMember;
import com.raxim.myscoutee.profile.data.document.ActivitySubEventResource;
import com.raxim.myscoutee.profile.data.document.ActivitySubEventResource.SubEventAssignedAssetSettingsRecord;
import com.raxim.myscoutee.profile.data.document.ActivitySubEventResource.SubEventSupplyContributionEntryRecord;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.ActivitySubEventResourceStateDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.SubEventAssignedAssetSettingsDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.SubEventSupplyContributionEntryDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.SubEventSupplyContributionPageDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetDetailDto;
import com.raxim.myscoutee.profile.repository.ActivitySubEventResourcesRepository;
import com.raxim.myscoutee.profile.security.AccessControlService;
import com.raxim.myscoutee.profile.service.mapper.ActivitySubEventResourceMapper;

@Service
public class ActivitiesResourcesService {
    private static final String STATUS_ACTIVE = "A";
    private static final String STATUS_DELETED = "D";

    private final ActivitySubEventResourcesRepository activitySubEventResourcesRepository;
    private final AssetsService assetsService;
    private final ObjectProvider<ActivitiesMembersService> activitiesMembersServiceProvider;
    private final AccessControlService accessControlService;
    private final ActivitySubEventResourceMapper activitySubEventResourceMapper;

    public ActivitiesResourcesService(
            ActivitySubEventResourcesRepository activitySubEventResourcesRepository,
            AssetsService assetsService,
            ObjectProvider<ActivitiesMembersService> activitiesMembersServiceProvider,
            AccessControlService accessControlService,
            ActivitySubEventResourceMapper activitySubEventResourceMapper) {
        this.activitySubEventResourcesRepository = activitySubEventResourcesRepository;
        this.assetsService = assetsService;
        this.activitiesMembersServiceProvider = activitiesMembersServiceProvider;
        this.accessControlService = accessControlService;
        this.activitySubEventResourceMapper = activitySubEventResourceMapper;
    }

    public ActivitySubEventResourceStateDto queryState(String ownerId, String subEventId, String assetOwnerUserId) {
        ActivitySubEventResource record = resolveRecord(ownerId, subEventId, assetOwnerUserId);
        if (record == null) {
            return null;
        }
        Map<String, AssetDetailDto> eligibleAssets = resolveAssignableAssetDetails(record);
        return toStateDto(filterToAssignableAssets(record, eligibleAssets.keySet()), eligibleAssets);
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
        next.setCreatedDate(current == null ? nowIso : normalizeDateTime(current.getCreatedDate(), nowIso));
        next.setCreatedUser(current == null ? assetOwnerUserId : safeText(current.getCreatedUser()));
        next.setUpdatedDate(nowIso);
        next.setUpdatedUser(assetOwnerUserId);

        ActivitySubEventResource saved = activitySubEventResourcesRepository.save(next);
        refreshEventParticipationProjection(ownerId);
        return toStateDto(filterToAssignableAssets(saved, eligibleAssetIds), eligibleAssets);
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
            next.setUpdatedDate(effectiveNowIso);
            next.setUpdatedUser(StringUtils.hasText(normalizedActorUserId)
                    ? normalizedActorUserId
                    : firstNonBlank(record.getUpdatedUser(), record.getAssetOwnerUserId()));
            changedRecords.add(next);
        }
        if (!changedRecords.isEmpty()) {
            activitySubEventResourcesRepository.saveAll(changedRecords);
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
                authorizationEventId(record.getOwnerId()),
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
        ActivitySubEventResourceStateDto base = activitySubEventResourceMapper.toDto(record);
        if (base == null) {
            return null;
        }
        Map<String, List<AssetDetailDto>> fallbackByType = new LinkedHashMap<>();
        String assetOwnerUserId = normalizeId(record.getAssetOwnerUserId());
        for (AssetDetailDto detail : eligibleAssets == null ? List.<AssetDetailDto>of() : eligibleAssets.values()) {
            if (detail == null || assetOwnerUserId.equals(normalizeId(detail.ownerUserId()))) {
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
                fallbackByType);
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

    private String authorizationEventId(String ownerId) {
        String normalizedOwnerId = normalizeId(ownerId);
        int slotMarker = normalizedOwnerId.indexOf(":slot:");
        return slotMarker > 0 ? normalizedOwnerId.substring(0, slotMarker) : normalizedOwnerId;
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
}
