package com.raxim.myscoutee.domain.events.api;

public interface MemberAttention {
    void incrementCommunityUpdates(String communityId, String userId, int delta);
}
