package com.raxim.myscoutee.domain.accounts.api;
import java.util.Map;
import com.raxim.myscoutee.domain.groups.api.GroupView;
/** Account-owned workspace admission, selection and activity summaries. */
public interface AccountWorkspaces extends com.raxim.myscoutee.domain.groups.api.WorkspaceMembership {
    DiscoveryProfile admit(GroupView group, String accountId);
    void applyPolicy(GroupView group);
    DiscoveryProfile activate(String accountId, String groupId);
    Map<String, com.raxim.myscoutee.domain.accounts.dto.AccountWorkspaceDto> profilesByGroup(String accountId);
    void clearActiveWorkspace(String accountId, String groupId);
}
