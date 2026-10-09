package com.raxim.myscoutee.domain.affinity.dto;

import com.raxim.myscoutee.domain.affinity.api.AffinityStatusChanges;

/** Existing queue receipt without its persistence or lease fields. */
public record RecomputeTaskDto(String taskKey, String status) implements AffinityStatusChanges.Task {
    public static RecomputeTaskDto from(AffinityStatusChanges.Task task) {
        return task == null ? null : new RecomputeTaskDto(task.getTaskKey(), task.getStatus());
    }
    @Override public String getTaskKey() { return taskKey; }
    @Override public String getStatus() { return status; }
}
