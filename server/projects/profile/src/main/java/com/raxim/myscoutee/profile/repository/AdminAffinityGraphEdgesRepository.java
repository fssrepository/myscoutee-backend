package com.raxim.myscoutee.profile.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.raxim.myscoutee.profile.data.document.AdminAffinityGraphEdge;

public interface AdminAffinityGraphEdgesRepository extends MongoRepository<AdminAffinityGraphEdge, String> {
    long countByLayoutVersion(String layoutVersion);

    @Query("{'layoutVersion': ?0, '$or': [ {'sourceUserId': {'$in': ?1}}, {'targetUserId': {'$in': ?1}} ]}")
    List<AdminAffinityGraphEdge> findRelevantByLayoutVersionAndUserIds(String layoutVersion, List<String> userIds);

    @Query("{'layoutVersion': ?0, 'componentId': ?1, 'weight': {'$gte': ?2, '$lte': ?3}}")
    List<AdminAffinityGraphEdge> findByLayoutVersionAndComponentIdAndWeightRange(
            String layoutVersion,
            String componentId,
            Double minWeight,
            Double maxWeight);
}
