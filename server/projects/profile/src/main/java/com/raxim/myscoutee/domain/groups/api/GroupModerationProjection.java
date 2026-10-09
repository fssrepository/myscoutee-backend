package com.raxim.myscoutee.domain.groups.api;
public interface GroupModerationProjection {
    void queue(String groupId, long revision, long pendingCount);
    void resource(String groupId, long version, String status);
}
