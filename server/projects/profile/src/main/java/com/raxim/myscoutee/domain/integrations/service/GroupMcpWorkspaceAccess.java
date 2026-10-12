package com.raxim.myscoutee.domain.integrations.service;

import com.raxim.myscoutee.domain.accounts.api.AccountWorkspaces;
import com.raxim.myscoutee.domain.accounts.api.WorkspaceProfile;
import com.raxim.myscoutee.domain.groups.api.GroupDirectory;
import org.springframework.stereotype.Service;

/** Keeps the existing workspace selection and group lookup in their original owners. */
@Service
class GroupMcpWorkspaceAccess implements McpWorkspaceAccess {
    private final AccountWorkspaces profiles;
    private final GroupDirectory groups;

    GroupMcpWorkspaceAccess(AccountWorkspaces profiles, GroupDirectory groups) {
        this.profiles = profiles;
        this.groups = groups;
    }

    @Override
    public void requireProfile(String owner, WorkspaceProfile profile) {
        if (!profiles.select(profile.getAccountUserId(), profile.getWorkspaceGroupId()).getUserId().equals(owner))
            throw McpAuthorizationService.error("access_denied");
    }

    @Override
    public String name(String workspaceId) {
        return groups.findById(workspaceId).orElseThrow(() -> McpAuthorizationService.error("access_denied")).name();
    }
}
