package com.raxim.myscoutee.profile.repository;

import java.util.Collection;
import java.util.List;
import org.bson.Document;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.Aggregation;
import com.raxim.myscoutee.profile.data.document.CommunityScheduledTask;

public interface CommunityScheduledTasksRepository extends MongoRepository<CommunityScheduledTask, String> {
    String VISIBLE = "{'baseGroupId':?0,'$or':[{'communityId':null,'ownerAccountId':?1},{'communityId':{'$in':?2}},{'communityId':{'$in':?3},'$or':[{'audienceAll':true},{'audienceAccountIds':?1}]}]}";
    @Query("{'$and':[" + VISIBLE + ",?4]}")
    List<CommunityScheduledTask> visible(String baseId, String actor, Collection<String> managed, Collection<String> joined, Document status, Pageable page);
    record TaskBucket(String status, long count) {}
    @Aggregation(pipeline = {"{'$match':" + VISIBLE + "}", "{'$group':{'_id':{'$cond':['$deleted','trash',{'$cond':['$enabled','active','paused']}]},'count':{'$sum':1}}}",
            "{'$project':{'_id':0,'status':'$_id','count':1}}"})
    List<TaskBucket> counters(String baseId, String actor, Collection<String> managed, Collection<String> joined);
    @Query("{'baseGroupId':?0,'enabled':true,'deleted':{'$ne':true},'nextDueAtIso':{'$lte':?1}}")
    List<CommunityScheduledTask> due(String baseId, String leadWindowEnd, Pageable page);
}
