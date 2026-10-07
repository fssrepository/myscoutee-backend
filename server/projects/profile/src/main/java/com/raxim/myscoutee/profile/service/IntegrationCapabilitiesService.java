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
import com.raxim.myscoutee.profile.data.document.IntegrationAccess;
import com.raxim.myscoutee.profile.data.document.Users;

/** Describes the authenticated integration, without probing any write endpoint. */
@Service
public class IntegrationCapabilitiesService {
    private final CommunityGroupsService groups;
    private final CommunityGroupsRepository groupRepository;
    private final AccessControlService access;
    private final IntegrationRoleAccessService roles;

    public IntegrationCapabilitiesService(CommunityGroupsService groups,
            CommunityGroupsRepository groupRepository, AccessControlService access, IntegrationRoleAccessService roles) {
        this.groups = groups;
        this.groupRepository = groupRepository;
        this.access = access; this.roles = roles;
    }

    public IntegrationConnectDto describe(Authentication authentication) {
        var profile = profile(authentication);
        var client = (AuthenticatedIntegrationClient) authentication.getDetails();
        String profileId = profile.getUserId();
        if (roles.privileged(profile)) {
            var operations = new ArrayList<String>();
            if (client.accessMode().allowsRead()) {
                if (roles.admin(profile)) operations.add("adminOverview");
                if (roles.operator(profile)) operations.addAll(List.of("operatorMeasurements", "operatorRevenueReports"));
            }
            return new IntegrationConnectDto(true, IntegrationTokenService.MAX_BATCH_SIZE,
                    profileId, profile.getName(), null, null, List.copyOf(operations), List.of(), client.accessMode());
        }
        String groupId = StringUtils.hasText(profile.getWorkspaceGroupId()) ? profile.getWorkspaceGroupId() : null;
        var group = groupId == null ? null : groupRepository.findById(groupId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN));
        String groupName = group == null ? null : group.name();
        var inviteGroups = groups.administeredGroups(groups.actor(profileId)).stream()
                .map(inviteGroup -> new IntegrationGroupScopeDto(inviteGroup.id(), inviteGroup.name()))
                .sorted(Comparator.comparing(IntegrationGroupScopeDto::id)).toList();
        var operations = new ArrayList<>(List.of("event", "encounters", "inviteParticipants"));
        // Per-resource restrictions and lifecycle preconditions remain with their domain owners.
        if (access.canCurrentActorCreateEvent(profileId, "*")) operations.add("createEvents");
        if (groupId == null && access.canCurrentActorCreateAsset(profileId, "*")) operations.add("createAssets");
        if (group != null && "work".equals(group.effectiveType()))
            operations.addAll(List.of("createCampaigns", "updateCampaign", "campaignAction"));
        if (group != null && "community".equals(group.effectiveType()))
            operations.addAll(List.of("saveCase", "caseAction", "saveAnnouncement", "announcementAction",
                    "saveScheduledTask", "scheduledTaskAction", "serviceAction"));
        if (!inviteGroups.isEmpty()) operations.add("inviteGroupParticipants");
        if (client.accessMode().allowsRead()) {
            operations.addAll(List.of("listEvents", "eventDetails", "listGroups", "groupDetails",
                    "listChats", "chatDetails", "chatMessages", "listNotifications", "listRatings"));
            if (groupId == null) operations.addAll(List.of("listAssets", "assetDetails"));
            if (group != null && "work".equals(group.effectiveType()))
                operations.addAll(List.of("listCampaigns", "campaignDetails", "campaignHistory"));
            if (group != null && "community".equals(group.effectiveType()))
                operations.addAll(List.of("listServices", "serviceDetails", "listCases", "caseDetails",
                        "listAnnouncements", "announcementDetails", "listScheduledTasks"));
        }
        return new IntegrationConnectDto(true, IntegrationTokenService.MAX_BATCH_SIZE,
                profileId, profile.getName(), groupId, groupName, List.copyOf(operations), inviteGroups, client.accessMode());
    }

    public String requireRead(Authentication authentication, String domain) {
        String actor = requireWrite(authentication, domain);
        if (!((AuthenticatedIntegrationClient) authentication.getDetails()).accessMode().allowsRead())
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Read or Full integration access is required.");
        return actor;
    }

    public String requireWrite(Authentication authentication, String domain) {
        var profile = profile(authentication);
        if (roles.privileged(profile)) throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Role integrations are read-only.");
        if (domain != null) {
            String groupId = profile.getWorkspaceGroupId();
            var group = groupId == null ? null : groupRepository.findById(groupId).orElse(null);
            if (group == null || !domain.equals(group.effectiveType())) throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        return profile.getUserId();
    }

    public AuthenticatedIntegrationClient requireClient(Authentication authentication) {
        profile(authentication);
        return (AuthenticatedIntegrationClient) authentication.getDetails();
    }

    public String requireRoleRead(Authentication authentication, String role) {
        var profile = profile(authentication);
        var client = (AuthenticatedIntegrationClient) authentication.getDetails();
        if (!client.accessMode().allowsRead() || !("admin".equals(role) ? roles.admin(profile) : roles.operator(profile)))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        return profile.getUserId();
    }

    private Users profile(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()
                || !(authentication.getPrincipal() instanceof FirebasePrincipal principal)
                || principal.getUser() == null
                || !(authentication.getDetails() instanceof AuthenticatedIntegrationClient client)
                || !client.ownerUserId().equals(principal.getUser().getUserId())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        if (client.accessMode() == IntegrationAccess.Mode.BLOCKED) throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        roles.requireActive(principal.getUser());
        return principal.getUser();
    }
}
