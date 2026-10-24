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
@lombok.Getter @lombok.Setter
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
