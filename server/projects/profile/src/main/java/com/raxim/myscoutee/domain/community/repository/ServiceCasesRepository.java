package com.raxim.myscoutee.domain.community.repository;

import java.util.Collection;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.Update;
import com.raxim.myscoutee.domain.community.document.ServiceCase;

public interface ServiceCasesRepository extends MongoRepository<ServiceCase, String> {
    List<ServiceCase> findByCommunityId(String communityId, Pageable page);
    @Query("{'baseGroupId':?0,'participantAccountIds':?1,'status':{'$nin':['cancelled','trash']},'boardTasks':{'$elemMatch':{'assigneeAccountIds':?1,'startAtIso':{'$lt':?3},'$or':[{'endAtIso':{'$gt':?2}},{'endAtIso':null,'startAtIso':{'$gte':?2}}]}}}")
    List<ServiceCase> assignedCalendar(String baseId, String actor, String from, String to);
    @Query("{'baseGroupId':?0,'$or':[{'participantAccountIds':?1},{'communityId':{'$in':?2}}],'status':{'$in':?3},'caseType':{'$in':?4}}")
    List<ServiceCase> visible(String baseId, String accountId, Collection<String> managedGroups,
            Collection<String> statuses, Collection<String> types, Pageable page);
    @Query("{'baseGroupId':?0,'$or':[{'participantAccountIds':?1},{'communityId':{'$in':?2}}],'status':{'$in':?3},'caseType':{'$in':?4},'boardTasks':{'$elemMatch':{'status':{'$ne':'deleted'},'startAtIso':{'$ne':null,'$lt':?6},'$or':[{'endAtIso':{'$gt':?5}},{'endAtIso':null,'startAtIso':{'$gte':?5}}]}}}")
    List<ServiceCase> visibleCalendar(String baseId, String accountId, Collection<String> managedGroups,
            Collection<String> statuses, Collection<String> types, String from, String to);
    @Query("{'_id':?0,'attentionAccountIds':?1}")
    @Update("{'$pull':{'attentionAccountIds':?1},'$inc':{'version':0}}")
    long markRead(String id, String accountId);
}
