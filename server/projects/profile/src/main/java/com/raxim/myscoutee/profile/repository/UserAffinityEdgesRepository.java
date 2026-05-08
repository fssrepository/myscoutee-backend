package com.raxim.myscoutee.profile.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.raxim.myscoutee.profile.data.document.UserAffinityEdge;

public interface UserAffinityEdgesRepository extends MongoRepository<UserAffinityEdge, String> {
    Optional<UserAffinityEdge> findByPairKey(String pairKey);

    void deleteByPairKey(String pairKey);

    @Query("{'$or': [ {'leftUserId': {'$in': ?0}}, {'rightUserId': {'$in': ?0}} ]}")
    List<UserAffinityEdge> findRelevantByUserIds(List<String> userIds);
}
