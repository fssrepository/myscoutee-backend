package com.raxim.myscoutee.domain.events.api;

import java.util.List;
import com.raxim.myscoutee.domain.events.dto.EventMediaVisibilityDto;
import com.raxim.myscoutee.domain.events.dto.CommunityMediaMembershipDto;

public interface EventMediaVisibility {
    EventMediaVisibilityDto event(List<String> urls);
    CommunityMediaMembershipDto acceptedCommunityMember(String communityId, String accountId);
}
