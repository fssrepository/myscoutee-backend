package com.raxim.myscoutee.domain.community.document;

import java.util.List;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("communityScheduledTasks")
@CompoundIndex(name="community_task_due", def="{'baseGroupId':1,'enabled':1,'nextDueAtIso':1,'_id':1}")
public record CommunityScheduledTask(@Id String id, String baseGroupId, String communityId,
        String ownerAccountId, String title, String description, String caseType,
        boolean audienceAll, List<String> audienceAccountIds, String startAtIso, String nextDueAtIso, String frequency,
        boolean enabled, boolean deleted, String createdAtIso, String updatedAtIso, @Version Long version) {
    public CommunityScheduledTask {
        // Records saved before the start-date field used the first due date as their anchor.
        if (startAtIso == null) startAtIso = nextDueAtIso;
    }
}
