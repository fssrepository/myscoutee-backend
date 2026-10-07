package com.raxim.myscoutee.domain.affinity.api;

public interface AffinityStatusChanges {
    Task enqueueAdminStatusChanged(String userId);
    interface Task { String getTaskKey(); String getStatus(); }
}
