package com.raxim.myscoutee.domain.events.mapper;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.domain.events.document.ActivitySubEventResource;
import com.raxim.myscoutee.domain.events.document.ActivitySubEventResource.SubEventAssignedAssetSettingsRecord;
import com.raxim.myscoutee.domain.events.document.ActivitySubEventResource.SubEventResourceMetricRecord;
import com.raxim.myscoutee.domain.events.document.ActivitySubEventResource.SubEventSupplyContributionEntryRecord;
import com.raxim.myscoutee.common.dto.SharedDtos.ActivitySubEventResourceStateDto;
import com.raxim.myscoutee.common.dto.SharedDtos.SubEventAssignedAssetSettingsDto;
import com.raxim.myscoutee.common.dto.SharedDtos.SubEventResourceMetricDto;
import com.raxim.myscoutee.common.dto.SharedDtos.SubEventSupplyContributionEntryDto;

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
                toSupplyContributionDtoMap(record.getSupplyContributionEntriesByAssetId()),
                Map.of(),
                toResourceMetricDtoMap(record.getResourceMetricsByType()));
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
                            normalizeCount(value.quantity()),
                            normalizeId(value.addedByUserId()),
                            normalizeRouteEnabled(value.routeEnabled(), value.routes()),
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

    private Map<String, SubEventResourceMetricDto> toResourceMetricDtoMap(
            Map<String, SubEventResourceMetricRecord> source) {
        Map<String, SubEventResourceMetricDto> next = new LinkedHashMap<>();
        for (Map.Entry<String, SubEventResourceMetricRecord> entry : source == null
                ? Map.<String, SubEventResourceMetricRecord>of().entrySet()
                : source.entrySet()) {
            String type = safeText(entry.getKey());
            SubEventResourceMetricRecord metric = entry.getValue();
            if (!StringUtils.hasText(type) || metric == null) {
                continue;
            }
            int capacityMin = normalizeCount(metric.capacityMin());
            next.put(type, new SubEventResourceMetricDto(
                    normalizeCount(metric.accepted()),
                    normalizeCount(metric.pending()),
                    capacityMin,
                    Math.max(capacityMin, normalizeCount(metric.capacityMax()))));
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

    private boolean normalizeRouteEnabled(Boolean value, List<String> routes) {
        if (value != null) {
            return Boolean.TRUE.equals(value);
        }
        return routes != null && routes.stream().anyMatch(item -> StringUtils.hasText(safeText(item)));
    }

    private String normalizeId(String value) {
        return safeText(value);
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }
}
