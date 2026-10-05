package com.raxim.myscoutee.profile.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.AffinityRecomputeTask;

public interface AffinityRecomputeTasksRepository extends MongoRepository<AffinityRecomputeTask, String> {
    Optional<AffinityRecomputeTask> findByTaskKey(String taskKey);

    long countByStatus(String status);
    long countByBaseGroupIdAndStatus(String baseGroupId, String status);
    List<AffinityRecomputeTask> findByBaseGroupIdAndStatusAndAvailableAtIsoLessThanEqualOrderByAvailableAtIsoAsc(
            String baseGroupId, String status, String availableAtIso, org.springframework.data.domain.Pageable page);

    List<AffinityRecomputeTask> findByStatusAndAvailableAtIsoLessThanEqualOrderByAvailableAtIsoAsc(
            String status,
            String availableAtIso);
}
