package com.raxim.myscoutee.domain.groups.api;

import com.raxim.myscoutee.domain.accounts.api.WorkspaceProfile;
import com.raxim.myscoutee.domain.groups.api.GroupView;
import com.raxim.myscoutee.domain.integrations.api.ParticipantInvitation;
import java.util.*;
import com.raxim.myscoutee.domain.groups.dto.CommunityGroupDtos.*;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.ProfileExtByIdResponseDto;
import com.raxim.myscoutee.domain.events.dto.ActivityMembersDtos.*;
import com.raxim.myscoutee.common.dto.SharedDtos.*;

public interface Groups {
    String OWNER_TYPE = "community";
    WorkspaceProfile actor(String requestedId);
    List<Workspace> workspaces(WorkspaceProfile actor);
    ProfileExtByIdResponseDto completeProfileLoad(
            WorkspaceProfile account, ProfileExtByIdResponseDto response,
            String requestedGroup);
    WorkspaceSelection select(WorkspaceProfile actor, String id);
    Group detail(WorkspaceProfile actor, String id);
    Page page(WorkspaceProfile actor, String bucket, String category, int pageSize, String cursor);
    Page page(WorkspaceProfile actor, String bucket, String category, int pageSize, String cursor, String sort);
    SyncResponse sync(WorkspaceProfile actor, SyncRequest request);
    Group save(WorkspaceProfile actor, Save request);
    Group moderationDetail(String id);
    void report(WorkspaceProfile actor, Report request);
    Group join(WorkspaceProfile actor, String id);
    void joinWorkspaceBase(WorkspaceProfile actor, String groupId);
    List<ActivityMemberEntryDto> roster(WorkspaceProfile actor, String id, boolean pendingOnly);
    ActivityMembersSummaryDto summary(WorkspaceProfile actor, String id);
    ActivityMembersSyncResponseDto sync(WorkspaceProfile actor, ActivityMembersSyncRequestDto request);
    ActivityMembersInviteResponseDto invite(WorkspaceProfile actor, String id, List<String> userIds);
    void claimIntegrationInvite(ParticipantInvitation invite, String actorUserId);
    WorkspaceProfile claimEventInvite(String groupId, String inviterProfileId, String accountId);
    ActivityMemberActionResponseDto action(WorkspaceProfile actor, ActivityMemberActionRequestDto request);
    List<? extends GroupView> administeredGroups(WorkspaceProfile actor);
    void requireAdmin(WorkspaceProfile actor, String id);
}
