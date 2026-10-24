package com.raxim.myscoutee.domain.events.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "activitySubEventGroups")
@CompoundIndexes({
        @CompoundIndex(name = "activity_subevent_group_record_id", def = "{'recordId': 1}", unique = true),
        @CompoundIndex(name = "activity_subevent_group_owner_group", def = "{'ownerId': 1, 'groupId': 1}", unique = true),
        @CompoundIndex(name = "activity_subevent_group_owner", def = "{'ownerId': 1}")
})
@lombok.Getter @lombok.Setter
public class ActivitySubEventGroup {
    @Id
    private String id;

    @Indexed(name = "activity_subevent_group_sync_key", unique = true, sparse = true)
    private String syncKey;

    private String recordId;
    private String status;
    private String ownerId;
    private String groupId;
    private String name;
    private Integer capacityMin;
    private Integer capacityMax;
    private String createdDate;
    private String createdUser;
    private String updatedDate;
    private String updatedUser;

}
