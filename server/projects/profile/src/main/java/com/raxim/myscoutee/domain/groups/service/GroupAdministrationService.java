package com.raxim.myscoutee.domain.groups.service;
import org.springframework.stereotype.Service;
import com.raxim.myscoutee.domain.groups.api.GroupAdministration;
import com.raxim.myscoutee.domain.groups.repository.CommunityGroupsRepository;
import com.raxim.myscoutee.domain.events.api.CommunityMemberships;
@Service
public class GroupAdministrationService implements GroupAdministration {
    private final CommunityGroupsRepository groups;
    private final CommunityMemberships members;
    public GroupAdministrationService(CommunityGroupsRepository groups, CommunityMemberships members) { this.groups = groups; this.members = members; }
    @Override public java.util.Set<String> managedGroups(String accountId) { return CommunityAccessService.managedGroups(accountId, members, groups); }
}
