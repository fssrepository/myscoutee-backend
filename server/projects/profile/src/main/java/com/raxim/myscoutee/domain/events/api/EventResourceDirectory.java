package com.raxim.myscoutee.domain.events.api;
import java.util.*;
public interface EventResourceDirectory {
    List<? extends Resource> findByOwnerIdInAndAssetOwnerUserIdInAndStatusNot(Collection<String> owners, Collection<String> assetOwners, String status);
    List<? extends StageRuntime> findByOwnerIdInAndStatusNot(Collection<String> owners, String status);
    interface Resource {
        String getId(); String getRecordId(); String getOwnerId(); String getSubEventId(); String getAssetOwnerUserId();
        Map<String, List<String>> getAssetAssignmentIds();
        Map<String, ? extends Map<String, ? extends AssetSettings>> getAssetSettingsByType();
        Map<String, ? extends List<? extends SupplyContribution>> getSupplyContributionEntriesByAssetId();
    }
    interface AssetSettings { Integer capacityMin(); Integer capacityMax(); }
    interface SupplyContribution { Integer quantity(); }
    interface StageRuntime { String getOwnerId(); String getSubEventId(); Integer getGroupsCount(); }
}
