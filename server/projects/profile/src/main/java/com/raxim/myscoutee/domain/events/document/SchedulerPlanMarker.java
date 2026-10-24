package com.raxim.myscoutee.domain.events.document;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "schedulerPlanMarkers")
@CompoundIndexes({
        @CompoundIndex(name = "scheduler_plan_marker_scope", def = "{'wrapperType': 1, 'actionType': 1, 'ownerId': 1, 'scopeId': 1}", unique = true)
})
@lombok.Getter @lombok.Setter
public class SchedulerPlanMarker {
    @Id
    private String id;

    @Indexed(name = "scheduler_plan_marker_sync_key", unique = true, sparse = true)
    private String syncKey;

    private String wrapperType;
    private String actionType;
    private String ownerId;
    private String scopeId;
    private String fingerprint;
    private List<String> userIds;
    private String updatedDate;
    private String updatedUser;

}
