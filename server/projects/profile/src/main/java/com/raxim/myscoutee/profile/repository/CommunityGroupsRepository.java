package com.raxim.myscoutee.profile.repository;

import java.util.Collection;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import com.raxim.myscoutee.profile.data.document.CommunityGroup;

public interface CommunityGroupsRepository extends MongoRepository<CommunityGroup, String> {
    @Query("{ '$or': [ { 'visibility': { '$in': ['public', 'private'] } }, { '_id': { '$in': ?0 } } ] }")
    List<CommunityGroup> findDiscoverable(Collection<String> memberGroupIds);
    List<CommunityGroup> findByIdIn(Collection<String> ids);
}
