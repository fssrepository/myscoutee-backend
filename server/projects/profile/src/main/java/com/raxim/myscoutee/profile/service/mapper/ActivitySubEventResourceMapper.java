package com.raxim.myscoutee.profile.service.mapper;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.profile.data.document.ActivitySubEventResource;
import com.raxim.myscoutee.profile.data.document.ActivitySubEventResource.SubEventAssignedAssetSettingsRecord;
import com.raxim.myscoutee.profile.data.document.ActivitySubEventResource.SubEventSupplyContributionEntryRecord;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.ActivitySubEventResourceStateDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.SubEventAssignedAssetSettingsDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.SubEventSupplyContributionEntryDto;

@Component
public class ActivitySubEventResourceMapper {
    private static final String STATUS_DELETED = "D";

    public ActivitySubEventResourceStateDto toDto(ActivitySubEventResource record) {
        if (record == null || STATUS_DELETED.equals(safeText(record.getStatus()))) {
            return null;
        }
        return new ActivitySubEventResourceStateDto(
                normalizeId(record.getOwnerId()),
                normalizeId(record.getSubEventId()),
                normalizeId(record.getAssetOwnerUserId()),
                cloneAssignmentIds(record.getAssetAssignmentIds()),
                toSettingsDtoMap(record.getAssetSettingsByType()),
                toSupplyContributionDtoMap(record.getSupplyContributionEntriesByAssetId()));
    }

    private Map<String, List<String>> cloneAssignmentIds(Map<String, List<String>> source) {
        Map<String, List<String>> next = new LinkedHashMap<>();
        if (source == null) {
            return next;
        }
        for (Map.Entry<String, List<String>> entry : source.entrySet()) {
            String type = safeText(entry.getKey());
            if (!StringUtils.hasText(type) || entry.getValue() == null || entry.getValue().isEmpty()) {
                continue;
            }
            List<String> ids = normalizeStrings(entry.getValue());
            if (!ids.isEmpty()) {
                next.put(type, ids);
            }
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
            String type = safeText(entry.getKey());
            if (!StringUtils.hasText(type)) {
                continue;
            }
            Map<String, SubEventAssignedAssetSettingsDto> settings = new LinkedHashMap<>();
            if (entry.getValue() != null) {
                for (Map.Entry<String, SubEventAssignedAssetSettingsRecord> assetEntry : entry.getValue().entrySet()) {
                    String assetId = normalizeId(assetEntry.getKey());
                    SubEventAssignedAssetSettingsRecord value = assetEntry.getValue();
                    if (!StringUtils.hasText(assetId) || value == null) {
                        continue;
                    }
                    settings.put(assetId, new SubEventAssignedAssetSettingsDto(
                            normalizeCount(value.capacityMin()),
                            normalizeCount(value.capacityMax()),
                            normalizeId(value.addedByUserId()),
                            value.routes() == null ? List.of() : new ArrayList<>(value.routes())));
                }
            }
            if (!settings.isEmpty()) {
                next.put(type, settings);
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
            String assetId = normalizeId(entry.getKey());
            if (!StringUtils.hasText(assetId) || entry.getValue() == null || entry.getValue().isEmpty()) {
                continue;
            }
            List<SubEventSupplyContributionEntryDto> entries = entry.getValue().stream()
                    .filter(Objects::nonNull)
                    .map(item -> new SubEventSupplyContributionEntryDto(
                            normalizeId(item.id()),
                            normalizeId(item.userId()),
                            normalizeCount(item.quantity()),
                            safeText(item.addedAtIso())))
                    .toList();
            if (!entries.isEmpty()) {
                next.put(assetId, entries);
            }
        }
        return next;
    }

    private List<String> normalizeStrings(List<String> values) {
        return values == null
                ? List.of()
                : values.stream()
                        .map(this::normalizeId)
                        .filter(StringUtils::hasText)
                        .distinct()
                        .toList();
    }

    private int normalizeCount(Integer value) {
        return Math.max(0, value == null ? 0 : value);
    }

    private String normalizeId(String value) {
        return safeText(value);
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }
}
