package com.raxim.myscoutee.domain.groups.api;
public interface GroupCounters {
    void applyCommunityMemberDelta(String groupId, int pendingDelta);
    void touchCommunityGroup(String groupId, String changedAtIso);
}
