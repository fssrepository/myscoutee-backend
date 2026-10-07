package com.raxim.myscoutee.domain.affinity.api;

public interface AffinityStatusChanges {
    Task enqueueUserChanged(String userId);
    Task enqueueEventChanged(String eventSourceId, String actorUserId);
    Task enqueueEventMembersChanged(String eventSourceId, String actorUserId);
    Task enqueueAssetChanged(String assetId, String actorUserId);
    Task enqueueAssetRequestsChanged(String assetId, String actorUserId);
    Task enqueueConfigChanged(String configId, String actorUserId);
    Task enqueueAdminStatusChanged(String userId);
    interface Task { String getTaskKey(); String getStatus(); }
}
