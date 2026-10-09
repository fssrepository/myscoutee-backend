package com.raxim.myscoutee.domain.groups.api;

import com.raxim.myscoutee.domain.accounts.api.DiscoveryProfile;
import com.raxim.myscoutee.domain.groups.api.GroupView;
import com.raxim.myscoutee.domain.integrations.api.ParticipantInvitation;
import java.util.*;
import com.raxim.myscoutee.domain.groups.dto.CommunityGroupDtos.*;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.ProfileExtByIdResponseDto;
import com.raxim.myscoutee.domain.events.dto.ActivityMembersDtos.*;
import com.raxim.myscoutee.common.dto.SharedDtos.*;

/** Group operations used by the existing integration entry points. */
public interface IntegrationGroups {
    DiscoveryProfile actor(String requestedId);
    Group detail(DiscoveryProfile actor, String id);
    Page page(DiscoveryProfile actor, String bucket, String category, int pageSize, String cursor);
    Page page(DiscoveryProfile actor, String bucket, String category, int pageSize, String cursor, String sort);
    void joinWorkspaceBase(DiscoveryProfile actor, String groupId);
    void claimIntegrationInvite(ParticipantInvitation invite, String actorUserId);
    DiscoveryProfile claimEventInvite(String groupId, String inviterProfileId, String accountId);
    List<? extends GroupView> administeredGroups(DiscoveryProfile actor);
    void requireAdmin(DiscoveryProfile actor, String id);
}
