package com.raxim.myscoutee.domain.affinity.document;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "affinityRecomputeTasks")
@CompoundIndexes({
        @CompoundIndex(name = "affinity_recompute_group_status_available", def = "{'baseGroupId': 1, 'status': 1, 'availableAtIso': 1}"),
        @CompoundIndex(name = "affinity_recompute_task_status_available", def = "{'status': 1, 'availableAtIso': 1}"),
        @CompoundIndex(name = "affinity_recompute_task_target_status", def = "{'targetType': 1, 'status': 1}")
})
@lombok.Getter @lombok.Setter
public class AffinityRecomputeTask implements com.raxim.myscoutee.domain.affinity.api.AffinityStatusChanges.Task {
    private String baseGroupId;

    @Id
    private String id;

    @Version
    private Long version;

    @Indexed(name = "affinity_recompute_task_key", unique = true)
    private String taskKey;

    private String targetType;
    private String targetId;
    private List<String> reasons = new ArrayList<>();
    private String status;
    private Boolean pendingCounterTracked;
    private String availableAtIso;
    private String leaseUntilIso;
    private String workerId;
    private Boolean rerunRequested;
    private Integer attemptCount;
    private String lastError;
    private String completedAtIso;
    private String createdDate;
    private String updatedDate;
    private String updatedUser;

    public void setReasons(List<String> reasons) { this.reasons = reasons == null ? new ArrayList<>() : new ArrayList<>(reasons); }
}
