package com.raxim.myscoutee.profile.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.AffinityRecomputeTask;

public interface AffinityRecomputeTasksRepository extends MongoRepository<AffinityRecomputeTask, String> {
    Optional<AffinityRecomputeTask> findByTaskKey(String taskKey);

    List<AffinityRecomputeTask> findByStatusAndAvailableAtIsoLessThanEqualOrderByAvailableAtIsoAsc(
            String status,
            String availableAtIso);
}
