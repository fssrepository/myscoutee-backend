package com.raxim.myscoutee.domain.community.repository;

import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.raxim.myscoutee.domain.community.document.CommunityAnnouncement;

public interface CommunityAnnouncementsRepository extends MongoRepository<CommunityAnnouncement, String> {
    List<CommunityAnnouncement> findByCommunityIdAndStatus(String communityId, String status, Pageable page);
    long countByCommunityIdAndStatus(String communityId, String status);
    List<CommunityAnnouncement> findByCommunityIdAndStatusAndVoting(String communityId, String status, boolean voting, Pageable page);
    long countByCommunityIdAndStatusAndVoting(String communityId, String status, boolean voting);
    @org.springframework.data.mongodb.repository.Aggregation(pipeline = {
        "{'$match':{'status':'published','voting':true,'$or':[{'deadlineIso':{'$lte':?0}},{'closedAtIso':{'$ne':null}}],'closureNotifiedAtIso':null}}",
        "{'$sort':{'_id':1}}"
    })
    List<CommunityAnnouncement> pendingClosure(String now, Pageable page);
}
