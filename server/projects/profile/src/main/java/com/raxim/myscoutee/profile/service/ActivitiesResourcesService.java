package com.raxim.myscoutee.profile.service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collection;
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

import com.raxim.myscoutee.profile.data.document.ActivityMember;
import com.raxim.myscoutee.profile.data.document.ActivitySubEventResource;
import com.raxim.myscoutee.profile.data.document.ActivitySubEventResource.SubEventAssignedAssetSettingsRecord;
import com.raxim.myscoutee.profile.data.document.ActivitySubEventResource.SubEventSupplyContributionEntryRecord;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.ActivitySubEventResourceStateDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.SubEventAssignedAssetSettingsDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.SubEventSupplyContributionEntryDto;
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
        return record == null ? null : activitySubEventResourceMapper.toDto(filterToOwnedAssets(record));
    }

    public ActivitySubEventResourceStateDto replace(ActivitySubEventResourceStateDto request) {
        if (request == null) {
            return null;
        }

        String ownerId = normalizeId(request.ownerId());
        String subEventId = normalizeId(request.subEventId());
        String assetOwnerUserId = normalizeId(request.assetOwnerUserId());
        if (!StringUtils.hasText(ownerId) || !StringUtils.hasText(subEventId) || !StringUtils.hasText(assetOwnerUserId)) {
            return null;
        }
        if (!accessControlService.canCurrentActorAssignEventResources(request)
                && !accessControlService.canCurrentActorManageEventResourceAssignment(request)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Authenticated user is not allowed to assign resources for this event.");
        }
        if (!accessControlService.canAssignEventResourcesForSubject(ownerId, assetOwnerUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Event membership is required to assign resources.");
        }

        String recordId = recordId(ownerId, subEventId, assetOwnerUserId);
        ActivitySubEventResource current = resolveRecord(ownerId, subEventId, assetOwnerUserId);
        String nowIso = Instant.now().toString();

        ActivitySubEventResource next = current == null ? new ActivitySubEventResource() : cloneRecord(current);
        next.setId(current == null ? new ObjectId().toHexString() : current.getId());
        next.setSyncKey(current != null && StringUtils.hasText(current.getSyncKey()) ? current.getSyncKey().trim() : UUID.randomUUID().toString());
        next.setRecordId(recordId);
        next.setOwnerKey(ownerKey(ownerId, assetOwnerUserId));
        next.setStatus(STATUS_ACTIVE);
        next.setOwnerId(ownerId);
        next.setSubEventId(subEventId);
        next.setAssetOwnerUserId(assetOwnerUserId);
        next.setAssetAssignmentIds(filterAssetAssignmentIds(request.assetAssignmentIds(), assetOwnerUserId));
        next.setAssetSettingsByType(filterAssetSettings(request.assetSettingsByType(), assetOwnerUserId));
        next.setSupplyContributionEntriesByAssetId(filterSupplyContributionEntries(request.supplyContributionEntriesByAssetId(), assetOwnerUserId));
        next.setCreatedDate(current == null ? nowIso : normalizeDateTime(current.getCreatedDate(), nowIso));
        next.setCreatedUser(current == null ? assetOwnerUserId : safeText(current.getCreatedUser()));
        next.setUpdatedDate(nowIso);
        next.setUpdatedUser(assetOwnerUserId);

        ActivitySubEventResource saved = activitySubEventResourcesRepository.save(next);
        refreshEventParticipationProjection(ownerId);
        return activitySubEventResourceMapper.toDto(filterToOwnedAssets(saved));
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

        return activitySubEventResourcesRepository.findByRecordIdAndStatusNot(
                        recordId(normalizedOwnerId, normalizedSubEventId, normalizedAssetOwnerUserId),
                        STATUS_DELETED)
                .orElse(null);
    }

    private ActivitySubEventResource filterToOwnedAssets(ActivitySubEventResource source) {
        Set<String> eligibleAssetIds = ownedAssetIds(source == null ? null : source.getAssetOwnerUserId());
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

        for (String type : List.of("Car", "Accommodation")) {
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

        List<String> supplyAssignmentIds = new ArrayList<>(nextAssignmentIds.getOrDefault("Supplies", List.of()));
        Map<String, SubEventAssignedAssetSettingsRecord> supplySettingsByAssetId = new LinkedHashMap<>(nextSettingsByType.getOrDefault("Supplies", Map.of()));
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
                            nextManagerUserId,
                            List.of())
                    : new SubEventAssignedAssetSettingsRecord(
                            currentSettings.capacityMin(),
                            currentSettings.capacityMax(),
                            nextManagerUserId,
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
            storeAssignmentIds(nextAssignmentIds, "Supplies", supplyAssignmentIds);
            storeSettings(nextSettingsByType, "Supplies", supplySettingsByAssetId);
            changed = true;
        }

        return new ResourceCleanupResult(
                changed,
                nextAssignmentIds,
                nextSettingsByType,
                nextSupplyEntriesByAssetId,
                removedAssignedAssetIds);
    }

    private Map<String, List<String>> filterAssetAssignmentIds(Map<String, List<String>> source, String assetOwnerUserId) {
        return filterAssignmentIds(source, ownedAssetIds(assetOwnerUserId));
    }

    private Map<String, Map<String, SubEventAssignedAssetSettingsRecord>> filterAssetSettings(
            Map<String, Map<String, SubEventAssignedAssetSettingsDto>> source,
            String assetOwnerUserId) {
        Set<String> eligibleAssetIds = ownedAssetIds(assetOwnerUserId);
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
                            normalizeId(assetEntry.getValue().addedByUserId()),
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
            String assetOwnerUserId) {
        Set<String> eligibleAssetIds = ownedAssetIds(assetOwnerUserId);
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

    private Set<String> ownedAssetIds(String assetOwnerUserId) {
        String normalizedAssetOwnerUserId = normalizeId(assetOwnerUserId);
        if (!StringUtils.hasText(normalizedAssetOwnerUserId)) {
            return Set.of();
        }
        return assetsService.queryAssets(normalizedAssetOwnerUserId).stream()
                .map(asset -> normalizeId(asset.id()))
                .filter(StringUtils::hasText)
                .collect(LinkedHashSet::new, Set::add, Set::addAll);
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
