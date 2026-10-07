package com.raxim.myscoutee.domain.affinity.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.raxim.myscoutee.domain.affinity.document.UserAffinityEdge;

public interface UserAffinityEdgesRepository extends MongoRepository<UserAffinityEdge, String> {
    Optional<UserAffinityEdge> findByPairKey(String pairKey);

    void deleteByPairKey(String pairKey);

    @Query("{'$or': [ {'leftUserId': {'$in': ?0}}, {'rightUserId': {'$in': ?0}} ]}")
    List<UserAffinityEdge> findRelevantByUserIds(List<String> userIds);
}
