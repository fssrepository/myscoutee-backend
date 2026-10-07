package com.raxim.myscoutee.domain.groups.service;

import java.util.Optional;
import org.springframework.stereotype.Service;
import com.raxim.myscoutee.domain.groups.api.GroupDirectory;
import com.raxim.myscoutee.domain.groups.repository.CommunityGroupsRepository;

@Service
public class GroupDirectoryService implements GroupDirectory {
    private final CommunityGroupsRepository groups;

    public GroupDirectoryService(CommunityGroupsRepository groups) {
        this.groups = groups;
    }

    @Override
    public Optional<GroupName> name(String groupId) {
        return groups.findById(groupId).map(group -> new GroupName(group.name()));
    }
    @Override public java.util.Optional<GroupType> type(String groupId) {
        return groups.findById(groupId).map(group -> new GroupType(group.id(), group.effectiveType()));
    }

}
