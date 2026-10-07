package com.raxim.myscoutee.domain.groups.service;
import java.time.Instant;
import org.springframework.stereotype.Service;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.*;
import com.raxim.myscoutee.domain.groups.api.GroupCounters;
@Service
public class GroupCounterService implements GroupCounters {
    private final MongoTemplate mongoTemplate;
    public GroupCounterService(MongoTemplate mongoTemplate) { this.mongoTemplate = mongoTemplate; }
    public void applyCommunityMemberDelta(String groupId, int pendingDelta) {
        if (pendingDelta == 0) return;
        mongoTemplate.updateFirst(Query.query(Criteria.where("_id").is(groupId)),
                new Update().inc("pendingMembers", pendingDelta).inc("version", 1L).set("updatedAtIso", Instant.now().toString()),
                com.raxim.myscoutee.domain.groups.document.CommunityGroup.class);
    }
    public void touchCommunityGroup(String groupId, String changedAtIso) {
        mongoTemplate.updateFirst(Query.query(Criteria.where("_id").is(groupId)),
                new Update().max("updatedAtIso", changedAtIso).inc("version", 1L),
                com.raxim.myscoutee.domain.groups.document.CommunityGroup.class);
    }
}
