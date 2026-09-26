package com.raxim.myscoutee.profile.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.common.config.firebase.dto.FirebasePrincipal;
import com.raxim.myscoutee.profile.data.dto.integration.IntegrationDtos.IntegrationConnectDto;
import com.raxim.myscoutee.profile.data.dto.integration.IntegrationDtos.IntegrationGroupScopeDto;
import com.raxim.myscoutee.profile.repository.CommunityGroupsRepository;
import com.raxim.myscoutee.profile.security.AccessControlService;
import com.raxim.myscoutee.profile.service.IntegrationTokenService.AuthenticatedIntegrationClient;

/** Describes the authenticated integration, without probing any write endpoint. */
@Service
public class IntegrationCapabilitiesService {
    private final CommunityGroupsService groups;
    private final CommunityGroupsRepository groupRepository;
    private final AccessControlService access;

    public IntegrationCapabilitiesService(CommunityGroupsService groups,
            CommunityGroupsRepository groupRepository, AccessControlService access) {
        this.groups = groups;
        this.groupRepository = groupRepository;
        this.access = access;
    }

    public IntegrationConnectDto describe(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()
                || !(authentication.getPrincipal() instanceof FirebasePrincipal principal)
                || principal.getUser() == null
                || !(authentication.getDetails() instanceof AuthenticatedIntegrationClient client)
                || !client.ownerUserId().equals(principal.getUser().getUserId())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        var profile = principal.getUser();
        String profileId = profile.getUserId();
        String groupId = StringUtils.hasText(profile.getWorkspaceGroupId()) ? profile.getWorkspaceGroupId() : null;
        String groupName = groupId == null ? null : groupRepository.findById(groupId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN)).name();
        var inviteGroups = groups.administeredGroups(groups.actor(profileId)).stream()
                .map(group -> new IntegrationGroupScopeDto(group.id(), group.name()))
                .sorted(Comparator.comparing(IntegrationGroupScopeDto::id)).toList();
        var operations = new ArrayList<>(List.of("event", "encounters", "inviteParticipants"));
        // Discovery describes operation-level access. Per-resource restrictions
        // and lifecycle preconditions are still checked by the normal endpoints.
        if (access.canCurrentActorCreateEvent(profileId, "*")) operations.add("createEvents");
        if (groupId == null && access.canCurrentActorCreateAsset(profileId, "*")) operations.add("createAssets");
        if (!inviteGroups.isEmpty()) operations.add("inviteGroupParticipants");
        return new IntegrationConnectDto(true, IntegrationTokenService.MAX_BATCH_SIZE,
                profileId, profile.getName(), groupId, groupName, List.copyOf(operations), inviteGroups);
    }
}
