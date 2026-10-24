package com.raxim.myscoutee.domain.community.repository;

import java.util.Collection;
import java.util.List;
import org.bson.Document;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import com.raxim.myscoutee.domain.community.document.CommunityScheduledTask;

public interface CommunityScheduledTasksRepository extends MongoRepository<CommunityScheduledTask, String> {
    String VISIBILITY_QUERY = "{'baseGroupId':?0,'$or':[{'communityId':null,'ownerAccountId':?1},{'communityId':{'$in':?2}},{'communityId':{'$in':?3},'$or':[{'audienceAll':true},{'audienceAccountIds':?1}]}]}";
    @Query("{'$and':[" + VISIBILITY_QUERY + ",?4]}")
    List<CommunityScheduledTask> visible(String baseId, String actor, Collection<String> managed, Collection<String> joined, Document status, Pageable page);
    List<CommunityScheduledTask> findByCommunityId(String communityId, Pageable page);
    @Query("{'baseGroupId':?0,'enabled':true,'deleted':{'$ne':true},'nextDueAtIso':{'$ne':null}}")
    List<CommunityScheduledTask> nextScheduled(String baseId, Pageable page);
    @Query("{'baseGroupId':?0,'enabled':true,'deleted':{'$ne':true},'nextDueAtIso':{'$lte':?1}}")
    List<CommunityScheduledTask> due(String baseId, String leadWindowEnd, Pageable page);
}
