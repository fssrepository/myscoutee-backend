package com.raxim.myscoutee.domain.events.dto;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import com.raxim.myscoutee.domain.events.api.EventResourceDirectory;

/** Chat's existing resource view; excludes booking, payment and owner persistence state. */
public record EventResourceDto(String id, String recordId, String ownerId, String subEventId,
        String assetOwnerUserId, Map<String, List<String>> assetAssignmentIds,
        Map<String, Map<String, AssetSettingsDto>> assetSettingsByType,
        Map<String, List<SupplyContributionDto>> supplyContributionEntriesByAssetId)
        implements EventResourceDirectory.Resource {
    public record AssetSettingsDto(Integer capacityMin, Integer capacityMax) implements EventResourceDirectory.AssetSettings {}
    public record SupplyContributionDto(Integer quantity) implements EventResourceDirectory.SupplyContribution {}
    public record StageRuntimeDto(String ownerId, String subEventId, Integer groupsCount) implements EventResourceDirectory.StageRuntime {
        public static StageRuntimeDto from(EventResourceDirectory.StageRuntime value) {
            return new StageRuntimeDto(value.getOwnerId(), value.getSubEventId(), value.getGroupsCount());
        }
        @Override public String getOwnerId() { return ownerId; }
        @Override public String getSubEventId() { return subEventId; }
        @Override public Integer getGroupsCount() { return groupsCount; }
    }
    public static EventResourceDto from(EventResourceDirectory.Resource value) {
        Map<String, Map<String, AssetSettingsDto>> settings = null;
        if (value.getAssetSettingsByType() != null) {
            settings = new LinkedHashMap<>();
            for (var entry : value.getAssetSettingsByType().entrySet()) {
                Map<String, AssetSettingsDto> byAsset = null;
                if (entry.getValue() != null) {
                    byAsset = new LinkedHashMap<>();
                    for (var asset : entry.getValue().entrySet()) {
                        var item = asset.getValue();
                        byAsset.put(asset.getKey(), item == null ? null : new AssetSettingsDto(item.capacityMin(), item.capacityMax()));
                    }
                }
                settings.put(entry.getKey(), byAsset);
            }
        }
        Map<String, List<SupplyContributionDto>> contributions = null;
        if (value.getSupplyContributionEntriesByAssetId() != null) {
            contributions = new LinkedHashMap<>();
            for (var entry : value.getSupplyContributionEntriesByAssetId().entrySet()) {
                contributions.put(entry.getKey(), entry.getValue() == null ? null : entry.getValue().stream()
                        .map(item -> item == null ? null : new SupplyContributionDto(item.quantity())).toList());
            }
        }
        return new EventResourceDto(value.getId(), value.getRecordId(), value.getOwnerId(), value.getSubEventId(),
                value.getAssetOwnerUserId(), value.getAssetAssignmentIds(), settings, contributions);
    }
    @Override public String getId() { return id; }
    @Override public String getRecordId() { return recordId; }
    @Override public String getOwnerId() { return ownerId; }
    @Override public String getSubEventId() { return subEventId; }
    @Override public String getAssetOwnerUserId() { return assetOwnerUserId; }
    @Override public Map<String, List<String>> getAssetAssignmentIds() { return assetAssignmentIds; }
    @Override public Map<String, Map<String, AssetSettingsDto>> getAssetSettingsByType() { return assetSettingsByType; }
    @Override public Map<String, List<SupplyContributionDto>> getSupplyContributionEntriesByAssetId() { return supplyContributionEntriesByAssetId; }
}
