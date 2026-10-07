package com.raxim.myscoutee.domain.groups.repository;

import com.raxim.myscoutee.domain.groups.api.BaseGroups;

import java.util.Collection;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import com.raxim.myscoutee.domain.groups.document.CommunityGroup;

public interface CommunityGroupsRepository extends MongoRepository<CommunityGroup, String> {
    @Query("{ 'lifecycleStatus': { '$nin': ['deleted', 'under-review'] }, 'visibility': { '$in': ['public', 'private'] }, '_id': { '$nin': ?0 } }")
    List<CommunityGroup> findDiscoverable(Collection<String> memberGroupIds, String userId);
    @Query("{ '_id': ?0, 'lifecycleStatus': ?4, 'ownerReleasedAtIso': ?1 }")
    @org.springframework.data.mongodb.repository.Update("{ '$set': { 'ownerUserId': ?2, 'lifecycleStatus': 'active', 'updatedAtIso': ?3 }, '$inc': { 'version': 1 } }")
    long claimResponsibility(String id, String releasedAtIso, String ownerUserId, String now, String expectedStatus);
    @Query("{ '_id': ?0, 'lifecycleStatus': { '$ne': 'deleted' } }")
    @org.springframework.data.mongodb.repository.Update("{ '$set': { 'lifecycleStatus': ?1, 'ownerReleasedAtIso': ?2, 'updatedAtIso': ?2, 'takeoverCandidates': ?3 }, '$inc': { 'version': 1 } }")
    long updateLifecycle(String id, String status, String now, List<String> candidates);
    List<CommunityGroup> findByIdIn(Collection<String> ids);

    /** Non-Dating workspace ownership, resolved with one bounded batch query. */
    default java.util.Map<String, String> baseGroupIds(Collection<String> ids) {
        var result = new java.util.HashMap<String, String>();
        var custom = new java.util.HashSet<String>();
        for (String id : ids) {
            if (BaseGroups.isBaseId(id)) result.put(id, id);
            else if (id != null && !id.isBlank()) custom.add(id);
        }
        if (!custom.isEmpty()) findByIdIn(custom).forEach(group -> {
            if (group.baseId() != null) result.put(group.id(), group.baseId());
        });
        return result;
    }

    /** Resolve type once for a batch; the built-in Work base needs no extra query. */
    default java.util.Set<String> workGroupIds(Collection<String> ids) {
        var result = new java.util.HashSet<String>();
        var customIds = new java.util.HashSet<String>();
        for (String id : ids) {
            if (BaseGroups.WORK_BASE_ID.equals(id)) result.add(id);
            else if (id != null && !id.isBlank()) customIds.add(id);
        }
        if (!customIds.isEmpty()) findByIdIn(customIds).stream()
                .filter(group -> "work".equals(group.effectiveType())).forEach(group -> result.add(group.id()));
        return result;
    }
}
