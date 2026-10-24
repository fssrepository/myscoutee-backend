package com.raxim.myscoutee.domain.events.document;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "activitySubEventStageRuntime")
@CompoundIndexes({
        @CompoundIndex(name = "activity_subevent_stage_runtime_record_id", def = "{'recordId': 1}", unique = true),
        @CompoundIndex(name = "activity_subevent_stage_runtime_owner_subevent", def = "{'ownerId': 1, 'subEventId': 1}", unique = true),
        @CompoundIndex(name = "activity_subevent_stage_runtime_owner", def = "{'ownerId': 1}")
})
@lombok.Getter @lombok.Setter
public class ActivitySubEventStageRuntime implements com.raxim.myscoutee.domain.events.api.EventResourceDirectory.StageRuntime {
    @Id
    private String id;

    @Indexed(name = "activity_subevent_stage_runtime_sync_key", unique = true, sparse = true)
    private String syncKey;

    private String recordId;
    private String status;
    private String ownerId;
    private String subEventId;
    private String stageStatus;
    private String stageStatusReason;
    private String stageStatusUpdatedAt;
    private String stageFinalizedAt;
    private String stageFinalizedByUserId;
    private Integer stageResultRevision;
    private Integer groupsCount;
    private Map<String, Map<String, Map<String, GroupResourceMetricRecord>>> groupResourceMetricsByAssetOwnerId = new LinkedHashMap<>();
    private Map<String, Map<String, Map<String, String>>> groupResourceReadAtByUserId = new LinkedHashMap<>();
    private String createdDate;
    private String createdUser;
    private String updatedDate;
    private String updatedUser;

    public void setGroupResourceMetricsByAssetOwnerId(Map<String, Map<String, Map<String, GroupResourceMetricRecord>>> groupResourceMetricsByAssetOwnerId) {
        this.groupResourceMetricsByAssetOwnerId = groupResourceMetricsByAssetOwnerId == null ? new LinkedHashMap<>() : groupResourceMetricsByAssetOwnerId;
    }
    public void setGroupResourceReadAtByUserId(Map<String, Map<String, Map<String, String>>> groupResourceReadAtByUserId) {
        this.groupResourceReadAtByUserId = groupResourceReadAtByUserId == null ? new LinkedHashMap<>() : groupResourceReadAtByUserId;
    }

    public record GroupResourceMetricRecord(
            Integer accepted,
            Integer pending,
            Integer capacityMin,
            Integer capacityMax) {
    }
}
