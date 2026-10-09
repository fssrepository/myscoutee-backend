package com.raxim.myscoutee.domain.groups.api;

import com.raxim.myscoutee.domain.accounts.api.DiscoveryProfile;
import com.raxim.myscoutee.domain.groups.api.GroupView;
import com.raxim.myscoutee.domain.integrations.api.ParticipantInvitation;
import java.util.*;
import com.raxim.myscoutee.domain.groups.dto.CommunityGroupDtos.*;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.ProfileExtByIdResponseDto;
import com.raxim.myscoutee.domain.events.dto.ActivityMembersDtos.*;
import com.raxim.myscoutee.common.dto.SharedDtos.*;

public interface Groups extends ProfileWorkspaceLoads, IntegrationGroups {
    String OWNER_TYPE = "community";
    List<Workspace> workspaces(DiscoveryProfile actor);
    ProfileExtByIdResponseDto completeProfileLoad(
            DiscoveryProfile account, ProfileExtByIdResponseDto response,
            String requestedGroup);
    WorkspaceSelection select(DiscoveryProfile actor, String id);
    SyncResponse sync(DiscoveryProfile actor, SyncRequest request);
    Group save(DiscoveryProfile actor, Save request);
    Group moderationDetail(String id);
    void report(DiscoveryProfile actor, Report request);
    Group join(DiscoveryProfile actor, String id);
    List<ActivityMemberEntryDto> roster(DiscoveryProfile actor, String id, boolean pendingOnly);
    ActivityMembersSummaryDto summary(DiscoveryProfile actor, String id);
    ActivityMembersSyncResponseDto sync(DiscoveryProfile actor, ActivityMembersSyncRequestDto request);
    ActivityMembersInviteResponseDto invite(DiscoveryProfile actor, String id, List<String> userIds);
    ActivityMemberActionResponseDto action(DiscoveryProfile actor, ActivityMemberActionRequestDto request);
}
