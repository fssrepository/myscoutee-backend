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
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.profile.data.document.mongo.ActivitySubEventResource;
import com.raxim.myscoutee.profile.data.document.mongo.ActivitySubEventResource.SubEventAssignedAssetSettingsRecord;
import com.raxim.myscoutee.profile.data.document.mongo.ActivitySubEventResource.SubEventSupplyContributionEntryRecord;
import com.raxim.myscoutee.profile.dto.shared.SharedDtos.ActivitySubEventResourceStateDto;
import com.raxim.myscoutee.profile.dto.shared.SharedDtos.SubEventAssignedAssetSettingsDto;
import com.raxim.myscoutee.profile.dto.shared.SharedDtos.SubEventSupplyContributionEntryDto;
import com.raxim.myscoutee.profile.repository.mongo.ActivitySubEventResourcesRepository;

@Service
public class ActivitiesResourcesService {
    private final ActivitySubEventResourcesRepository activitySubEventResourcesRepository;
    private final AssetsService assetsService;
    private final MongoTemplate mongoTemplate;

    public ActivitiesResourcesService(
            ActivitySubEventResourcesRepository activitySubEventResourcesRepository,
            AssetsService assetsService,
            MongoTemplate mongoTemplate) {
        this.activitySubEventResourcesRepository = activitySubEventResourcesRepository;
        this.assetsService = assetsService;
        this.mongoTemplate = mongoTemplate;
    }

    public ActivitySubEventResourceStateDto queryState(String ownerId, String subEventId, String assetOwnerUserId) {
        ActivitySubEventResource record = resolveRecord(ownerId, subEventId, assetOwnerUserId);
        return record == null ? null : toDto(filterToOwnedAssets(record));
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

        String recordId = recordId(ownerId, subEventId, assetOwnerUserId);
        ActivitySubEventResource current = resolveRecord(ownerId, subEventId, assetOwnerUserId);
        String nowIso = Instant.now().toString();

        ActivitySubEventResource next = current == null ? new ActivitySubEventResource() : cloneRecord(current);
        next.setId(current == null ? new ObjectId().toHexString() : current.getId());
        next.setSyncKey(current != null && StringUtils.hasText(current.getSyncKey()) ? current.getSyncKey().trim() : UUID.randomUUID().toString());
        next.setRecordId(recordId);
        next.setOwnerKey(ownerKey(ownerId, assetOwnerUserId));
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
        return toDto(filterToOwnedAssets(saved));
    }

    private ActivitySubEventResource resolveRecord(String ownerId, String subEventId, String assetOwnerUserId) {
        String normalizedOwnerId = normalizeId(ownerId);
        String normalizedSubEventId = normalizeId(subEventId);
        String normalizedAssetOwnerUserId = normalizeId(assetOwnerUserId);
        if (!StringUtils.hasText(normalizedOwnerId) || !StringUtils.hasText(normalizedSubEventId) || !StringUtils.hasText(normalizedAssetOwnerUserId)) {
            return null;
        }

        return activitySubEventResourcesRepository.findByRecordId(recordId(normalizedOwnerId, normalizedSubEventId, normalizedAssetOwnerUserId))
                .orElseGet(() -> bootstrapFromLegacy(normalizedOwnerId, normalizedSubEventId, normalizedAssetOwnerUserId));
    }

    private ActivitySubEventResource bootstrapFromLegacy(String ownerId, String subEventId, String assetOwnerUserId) {
        Query query = Query.query(new Criteria().andOperator(
                Criteria.where("ownerId").is(ownerId),
                Criteria.where("subEventId").is(subEventId),
                Criteria.where("assetOwnerUserId").is(assetOwnerUserId)));
        Document legacy = mongoTemplate.findOne(query, Document.class, "activityResources");
        if (legacy == null) {
            return null;
        }

        ActivitySubEventResource record = new ActivitySubEventResource();
        String nowIso = Instant.now().toString();
        record.setId(new ObjectId().toHexString());
        record.setSyncKey(UUID.randomUUID().toString());
        record.setRecordId(recordId(ownerId, subEventId, assetOwnerUserId));
        record.setOwnerKey(ownerKey(ownerId, assetOwnerUserId));
        record.setOwnerId(ownerId);
        record.setSubEventId(subEventId);
        record.setAssetOwnerUserId(assetOwnerUserId);
        record.setAssetAssignmentIds(filterAssetAssignmentIds(rawAssetAssignmentIds(legacy.get("assetAssignmentIds")), assetOwnerUserId));
        record.setAssetSettingsByType(filterSettings(rawAssetSettings(legacy.get("assetSettingsByType")), ownedAssetIds(assetOwnerUserId)));
        record.setSupplyContributionEntriesByAssetId(filterSupplyEntries(rawSupplyContributionEntries(legacy.get("supplyContributionEntriesByAssetId")), ownedAssetIds(assetOwnerUserId)));
        record.setCreatedDate(normalizeDateTime(legacy.getString("createdAtIso"), nowIso));
        record.setCreatedUser(assetOwnerUserId);
        record.setUpdatedDate(normalizeDateTime(legacy.getString("updatedAtIso"), record.getCreatedDate()));
        record.setUpdatedUser(assetOwnerUserId);
        return activitySubEventResourcesRepository.save(record);
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

    private ActivitySubEventResourceStateDto toDto(ActivitySubEventResource record) {
        if (record == null) {
            return null;
        }
        return new ActivitySubEventResourceStateDto(
                normalizeId(record.getOwnerId()),
                normalizeId(record.getSubEventId()),
                normalizeId(record.getAssetOwnerUserId()),
                filterAssignmentIds(record.getAssetAssignmentIds(), null),
                toSettingsDtoMap(record.getAssetSettingsByType()),
                toSupplyContributionDtoMap(record.getSupplyContributionEntriesByAssetId()));
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

    private Map<String, List<String>> rawAssetAssignmentIds(Object rawValue) {
        Map<String, List<String>> next = new LinkedHashMap<>();
        if (!(rawValue instanceof Map<?, ?> source)) {
            return next;
        }
        for (Map.Entry<?, ?> entry : source.entrySet()) {
            next.put(safeText(String.valueOf(entry.getKey())), normalizeStrings(entry.getValue()));
        }
        return next;
    }

    private Map<String, Map<String, SubEventAssignedAssetSettingsRecord>> rawAssetSettings(Object rawValue) {
        Map<String, Map<String, SubEventAssignedAssetSettingsRecord>> next = new LinkedHashMap<>();
        if (!(rawValue instanceof Map<?, ?> source)) {
            return next;
        }
        for (Map.Entry<?, ?> typeEntry : source.entrySet()) {
            if (!(typeEntry.getValue() instanceof Map<?, ?> rawSettings)) {
                continue;
            }
            Map<String, SubEventAssignedAssetSettingsRecord> settingsByAssetId = new LinkedHashMap<>();
            for (Map.Entry<?, ?> assetEntry : rawSettings.entrySet()) {
                Document setting = toDocument(assetEntry.getValue());
                String assetId = normalizeId(String.valueOf(assetEntry.getKey()));
                if (!StringUtils.hasText(assetId)) {
                    continue;
                }
                settingsByAssetId.put(assetId, new SubEventAssignedAssetSettingsRecord(
                        Math.max(0, normalizeCount(setting.get("capacityMin"))),
                        Math.max(0, normalizeCount(setting.get("capacityMax"))),
                        normalizeId(setting.getString("addedByUserId")),
                        normalizeStrings(setting.get("routes"))));
            }
            if (!settingsByAssetId.isEmpty()) {
                next.put(safeText(String.valueOf(typeEntry.getKey())), settingsByAssetId);
            }
        }
        return next;
    }

    private Map<String, List<SubEventSupplyContributionEntryRecord>> rawSupplyContributionEntries(Object rawValue) {
        Map<String, List<SubEventSupplyContributionEntryRecord>> next = new LinkedHashMap<>();
        if (!(rawValue instanceof Map<?, ?> source)) {
            return next;
        }
        for (Map.Entry<?, ?> entry : source.entrySet()) {
            String assetId = normalizeId(String.valueOf(entry.getKey()));
            if (!StringUtils.hasText(assetId) || !(entry.getValue() instanceof Collection<?> rawEntries)) {
                continue;
            }
            List<SubEventSupplyContributionEntryRecord> records = new ArrayList<>();
            for (Object rawEntry : rawEntries) {
                Document contribution = toDocument(rawEntry);
                String contributionUserId = normalizeId(contribution.getString("userId"));
                int quantity = Math.max(0, normalizeCount(contribution.get("quantity")));
                if (!StringUtils.hasText(contributionUserId) || quantity <= 0) {
                    continue;
                }
                records.add(new SubEventSupplyContributionEntryRecord(
                        StringUtils.hasText(normalizeId(contribution.getString("id"))) ? normalizeId(contribution.getString("id")) : UUID.randomUUID().toString(),
                        contributionUserId,
                        quantity,
                        normalizeDateTime(contribution.getString("addedAtIso"), Instant.now().toString())));
            }
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

    private Map<String, Map<String, SubEventAssignedAssetSettingsDto>> toSettingsDtoMap(
            Map<String, Map<String, SubEventAssignedAssetSettingsRecord>> source) {
        Map<String, Map<String, SubEventAssignedAssetSettingsDto>> next = new LinkedHashMap<>();
        if (source == null) {
            return next;
        }
        for (Map.Entry<String, Map<String, SubEventAssignedAssetSettingsRecord>> entry : source.entrySet()) {
            Map<String, SubEventAssignedAssetSettingsDto> settings = new LinkedHashMap<>();
            if (entry.getValue() != null) {
                for (Map.Entry<String, SubEventAssignedAssetSettingsRecord> assetEntry : entry.getValue().entrySet()) {
                    if (assetEntry.getValue() == null) {
                        continue;
                    }
                    settings.put(assetEntry.getKey(), new SubEventAssignedAssetSettingsDto(
                            assetEntry.getValue().capacityMin(),
                            assetEntry.getValue().capacityMax(),
                            assetEntry.getValue().addedByUserId(),
                            assetEntry.getValue().routes() == null ? List.of() : new ArrayList<>(assetEntry.getValue().routes())));
                }
            }
            if (!settings.isEmpty()) {
                next.put(entry.getKey(), settings);
            }
        }
        return next;
    }

    private Map<String, List<SubEventSupplyContributionEntryDto>> toSupplyContributionDtoMap(
            Map<String, List<SubEventSupplyContributionEntryRecord>> source) {
        Map<String, List<SubEventSupplyContributionEntryDto>> next = new LinkedHashMap<>();
        if (source == null) {
            return next;
        }
        for (Map.Entry<String, List<SubEventSupplyContributionEntryRecord>> entry : source.entrySet()) {
            if (entry.getValue() == null || entry.getValue().isEmpty()) {
                continue;
            }
            next.put(entry.getKey(), entry.getValue().stream()
                    .filter(Objects::nonNull)
                    .map(item -> new SubEventSupplyContributionEntryDto(
                            item.id(),
                            item.userId(),
                            item.quantity(),
                            item.addedAtIso()))
                    .toList());
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
            return new Document((Map<String, Object>) map);
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

    private String normalizeDateTime(String value, String fallback) {
        String normalizedValue = safeText(value);
        return StringUtils.hasText(normalizedValue) ? normalizedValue : fallback;
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }
}
