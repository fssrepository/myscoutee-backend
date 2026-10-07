package com.raxim.myscoutee.domain.events.document;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "activityResources")
@CompoundIndexes({
        @CompoundIndex(name = "activity_resource_record_id", def = "{'recordId': 1}", unique = true),
        @CompoundIndex(
                name = "activity_resource_active_owner_subevent_asset_owner",
                def = "{'ownerId': 1, 'subEventId': 1, 'assetOwnerUserId': 1}",
                unique = true,
                partialFilter = "{'status': 'A'}"),
        @CompoundIndex(name = "activity_resource_owner_key", def = "{'assetOwnerUserId': 1, 'ownerId': 1}")
})
public class ActivitySubEventResource implements com.raxim.myscoutee.domain.events.api.EventResourceDirectory.Resource {
    @Id
    private String id;

    @Indexed(name = "activity_resource_sync_key", unique = true, sparse = true)
    private String syncKey;

    private String recordId;
    private String ownerKey;
    private String status;
    private String ownerId;
    private String subEventId;
    private String assetOwnerUserId;
    private Map<String, List<String>> assetAssignmentIds = new LinkedHashMap<>();
    private Map<String, Map<String, SubEventAssignedAssetSettingsRecord>> assetSettingsByType = new LinkedHashMap<>();
    private Map<String, List<SubEventSupplyContributionEntryRecord>> supplyContributionEntriesByAssetId = new LinkedHashMap<>();
    private Map<String, SubEventResourceMetricRecord> resourceMetricsByType = new LinkedHashMap<>();
    private String createdDate;
    private String createdUser;
    private String updatedDate;
    private String updatedUser;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSyncKey() {
        return syncKey;
    }

    public void setSyncKey(String syncKey) {
        this.syncKey = syncKey;
    }

    public String getRecordId() {
        return recordId;
    }

    public void setRecordId(String recordId) {
        this.recordId = recordId;
    }

    public String getOwnerKey() {
        return ownerKey;
    }

    public void setOwnerKey(String ownerKey) {
        this.ownerKey = ownerKey;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(String ownerId) {
        this.ownerId = ownerId;
    }

    public String getSubEventId() {
        return subEventId;
    }

    public void setSubEventId(String subEventId) {
        this.subEventId = subEventId;
    }

    public String getAssetOwnerUserId() {
        return assetOwnerUserId;
    }

    public void setAssetOwnerUserId(String assetOwnerUserId) {
        this.assetOwnerUserId = assetOwnerUserId;
    }

    public Map<String, List<String>> getAssetAssignmentIds() {
        return assetAssignmentIds;
    }

    public void setAssetAssignmentIds(Map<String, List<String>> assetAssignmentIds) {
        this.assetAssignmentIds = assetAssignmentIds;
    }

    public Map<String, Map<String, SubEventAssignedAssetSettingsRecord>> getAssetSettingsByType() {
        return assetSettingsByType;
    }

    public void setAssetSettingsByType(Map<String, Map<String, SubEventAssignedAssetSettingsRecord>> assetSettingsByType) {
        this.assetSettingsByType = assetSettingsByType;
    }

    public Map<String, List<SubEventSupplyContributionEntryRecord>> getSupplyContributionEntriesByAssetId() {
        return supplyContributionEntriesByAssetId;
    }

    public void setSupplyContributionEntriesByAssetId(Map<String, List<SubEventSupplyContributionEntryRecord>> supplyContributionEntriesByAssetId) {
        this.supplyContributionEntriesByAssetId = supplyContributionEntriesByAssetId;
    }

    public Map<String, SubEventResourceMetricRecord> getResourceMetricsByType() {
        return resourceMetricsByType;
    }

    public void setResourceMetricsByType(Map<String, SubEventResourceMetricRecord> resourceMetricsByType) {
        this.resourceMetricsByType = resourceMetricsByType;
    }

    public String getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(String createdDate) {
        this.createdDate = createdDate;
    }

    public String getCreatedUser() {
        return createdUser;
    }

    public void setCreatedUser(String createdUser) {
        this.createdUser = createdUser;
    }

    public String getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(String updatedDate) {
        this.updatedDate = updatedDate;
    }

    public String getUpdatedUser() {
        return updatedUser;
    }

    public void setUpdatedUser(String updatedUser) {
        this.updatedUser = updatedUser;
    }

    public record SubEventAssignedAssetSettingsRecord(
            Integer capacityMin,
            Integer capacityMax,
            Integer quantity,
            String addedByUserId,
            Boolean routeEnabled,
            List<String> routes) implements com.raxim.myscoutee.domain.events.api.EventResourceDirectory.AssetSettings {
    }

    public record SubEventSupplyContributionEntryRecord(
            String id,
            String userId,
            Integer quantity,
            String addedAtIso) implements com.raxim.myscoutee.domain.events.api.EventResourceDirectory.SupplyContribution {
    }

    public record SubEventResourceMetricRecord(
            Integer accepted,
            Integer pending,
            Integer capacityMin,
            Integer capacityMax) {
    }
}
