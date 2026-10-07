package com.raxim.myscoutee.domain.affinity.service;
import org.springframework.stereotype.Service;
import com.raxim.myscoutee.domain.affinity.api.RecomputeQueue;
import com.raxim.myscoutee.domain.affinity.repository.AffinityRecomputeTasksRepository;
@Service
public class RecomputeQueueService implements RecomputeQueue {
    private final AffinityRecomputeTasksRepository tasks;
    public RecomputeQueueService(AffinityRecomputeTasksRepository tasks) { this.tasks = tasks; }
    @Override public long count(String baseGroupId, String status) { return tasks.countByBaseGroupIdAndStatus(baseGroupId, status); }
}
