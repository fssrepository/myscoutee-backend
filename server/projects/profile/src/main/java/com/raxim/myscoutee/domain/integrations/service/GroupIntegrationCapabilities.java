package com.raxim.myscoutee.domain.integrations.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import com.raxim.myscoutee.domain.accounts.api.WorkspaceProfile;
import com.raxim.myscoutee.domain.access.api.AccessPermissions;
import com.raxim.myscoutee.domain.groups.api.GroupDirectory;
import com.raxim.myscoutee.domain.groups.api.IntegrationGroups;
import com.raxim.myscoutee.domain.integrations.dto.IntegrationAccess;
import com.raxim.myscoutee.domain.integrations.dto.IntegrationDtos.IntegrationConnectDto;
import com.raxim.myscoutee.domain.integrations.dto.IntegrationDtos.IntegrationGroupScopeDto;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

/** Existing product operations and workspace scope checks for member integrations. */
@Service
class GroupIntegrationCapabilities implements IntegrationProductCapabilities {
    private final IntegrationGroups groups;
    private final GroupDirectory groupRepository;
    private final AccessPermissions access;

    GroupIntegrationCapabilities(IntegrationGroups groups, GroupDirectory groupRepository, AccessPermissions access) {
        this.groups = groups;
        this.groupRepository = groupRepository;
        this.access = access;
    }

    @Override
    public IntegrationConnectDto describe(WorkspaceProfile profile, IntegrationAccess.Mode mode) {
        String profileId = profile.getUserId();
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
        if (mode.allowsRead()) {
            operations.addAll(List.of("listEvents", "eventDetails", "listGroups", "groupDetails"));
            operations.addAll(IntegrationCapabilitiesService.PERSONAL_READ_OPERATIONS);
            operations.add("listRatings");
            if (groupId == null) operations.addAll(List.of("listAssets", "assetDetails"));
            if (group != null && "work".equals(group.effectiveType()))
                operations.addAll(List.of("listCampaigns", "campaignDetails", "campaignHistory"));
            if (group != null && "community".equals(group.effectiveType()))
                operations.addAll(List.of("listServices", "serviceDetails", "listCases", "caseDetails",
                        "listAnnouncements", "announcementDetails", "listScheduledTasks"));
        }
        return new IntegrationConnectDto(true, IntegrationTokenService.MAX_BATCH_SIZE,
                profileId, profile.getName(), groupId, groupName, List.copyOf(operations), inviteGroups, mode);
    }

    @Override
    public void requireDomain(WorkspaceProfile profile, String domain) {
        String groupId = profile.getWorkspaceGroupId();
        var group = groupId == null ? null : groupRepository.findById(groupId).orElse(null);
        if (group == null || !domain.equals(group.effectiveType())) throw new ResponseStatusException(HttpStatus.FORBIDDEN);
    }
}
