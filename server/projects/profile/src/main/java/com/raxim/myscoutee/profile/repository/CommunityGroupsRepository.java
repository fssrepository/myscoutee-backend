package com.raxim.myscoutee.profile.repository;

import java.util.Collection;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import com.raxim.myscoutee.profile.data.document.CommunityGroup;

public interface CommunityGroupsRepository extends MongoRepository<CommunityGroup, String> {
    @Query("{ 'lifecycleStatus': { '$nin': ['deleted', 'under-review'] }, 'visibility': { '$in': ['public', 'private'] }, '_id': { '$nin': ?0 } }")
    List<CommunityGroup> findDiscoverable(Collection<String> memberGroupIds, String userId);
    @Query("{ '_id': ?0, 'lifecycleStatus': 'under-review', 'ownerReleasedAtIso': ?1 }")
    @org.springframework.data.mongodb.repository.Update("{ '$set': { 'ownerUserId': ?2, 'lifecycleStatus': 'active', 'updatedAtIso': ?3 }, '$inc': { 'version': 1 } }")
    long claimResponsibility(String id, String releasedAtIso, String ownerUserId, String now);
    @Query("{ '_id': ?0, 'lifecycleStatus': { '$ne': 'deleted' } }")
    @org.springframework.data.mongodb.repository.Update("{ '$set': { 'lifecycleStatus': ?1, 'ownerReleasedAtIso': ?2, 'updatedAtIso': ?2, 'takeoverCandidates': ?3 }, '$inc': { 'version': 1 } }")
    long updateLifecycle(String id, String status, String now, List<String> candidates);
    List<CommunityGroup> findByIdIn(Collection<String> ids);
}
