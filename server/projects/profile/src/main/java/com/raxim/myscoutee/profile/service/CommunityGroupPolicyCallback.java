package com.raxim.myscoutee.profile.service;

import java.util.*;
import org.springframework.data.mongodb.core.mapping.event.BeforeConvertCallback;
import org.springframework.stereotype.Component;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.repository.CommunityGroupsRepository;

@Component
public class CommunityGroupPolicyCallback implements BeforeConvertCallback<Users> {
    private final org.springframework.beans.factory.ObjectProvider<CommunityGroupsRepository> groups;
    public CommunityGroupPolicyCallback(org.springframework.beans.factory.ObjectProvider<CommunityGroupsRepository> groups) { this.groups = groups; }
    @Override public Users onBeforeConvert(Users user, String collection) {
        if (user.getWorkspaceGroupId() == null) return user;
        var group = groups.getObject().findById(user.getWorkspaceGroupId()).orElse(null);
        if (group == null || !group.policy().enabled() || user.getProfileDetails() == null) return user;
        var required = new HashSet<>(group.policy().requiredFields());
        user.setProfileDetails(user.getProfileDetails().stream().map(section -> new Users.ProfileDetailGroupRecord(section.title(),
            section.rows().stream().map(row -> required.contains(row.labelKey())
                ? new Users.ProfileDetailRowRecord(row.labelKey(), row.value(), "Public", row.options()) : row).toList())).toList());
        return user;
    }
}
