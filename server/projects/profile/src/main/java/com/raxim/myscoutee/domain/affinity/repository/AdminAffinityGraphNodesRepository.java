package com.raxim.myscoutee.domain.affinity.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.raxim.myscoutee.domain.affinity.document.AdminAffinityGraphNode;

public interface AdminAffinityGraphNodesRepository extends MongoRepository<AdminAffinityGraphNode, String> {
    long countByLayoutVersion(String layoutVersion);

    Optional<AdminAffinityGraphNode> findByLayoutVersionAndUserId(String layoutVersion, String userId);

    List<AdminAffinityGraphNode> findByLayoutVersionAndUserIdIn(String layoutVersion, List<String> userIds);

    List<AdminAffinityGraphNode> findByLayoutVersionAndTileZAndTileXAndTileY(
            String layoutVersion,
            Integer tileZ,
            Integer tileX,
            Integer tileY);

    List<AdminAffinityGraphNode> findByLayoutVersionAndTileZAndTileXAndTileYAndComponentId(
            String layoutVersion,
            Integer tileZ,
            Integer tileX,
            Integer tileY,
            String componentId);

    List<AdminAffinityGraphNode> findByLayoutVersionAndComponentId(String layoutVersion, String componentId);

    @Query("{'layoutVersion': ?0, 'x': {'$gte': ?1, '$lte': ?2}, 'z': {'$gte': ?3, '$lte': ?4}}")
    List<AdminAffinityGraphNode> findByLayoutVersionAndViewport(
            String layoutVersion,
            Double minX,
            Double maxX,
            Double minZ,
            Double maxZ);

    @Query("{'layoutVersion': ?0, 'componentId': ?1, 'x': {'$gte': ?2, '$lte': ?3}, 'z': {'$gte': ?4, '$lte': ?5}}")
    List<AdminAffinityGraphNode> findByLayoutVersionAndComponentIdAndViewport(
            String layoutVersion,
            String componentId,
            Double minX,
            Double maxX,
            Double minZ,
            Double maxZ);
}
