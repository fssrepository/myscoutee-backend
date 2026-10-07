package com.raxim.myscoutee.domain.accounts.api;
import java.util.Map;
import com.raxim.myscoutee.domain.groups.api.GroupView;
/** Local account workspace operations; profile arguments must be account-issued views. */
public interface AccountWorkspaces extends com.raxim.myscoutee.domain.groups.api.WorkspaceMembership {
    WorkspaceProfile admit(GroupView group, String accountId);
    void applyPolicy(GroupView group);
    WorkspaceProfile activate(WorkspaceProfile account, String groupId);
    Map<String, ? extends WorkspaceProfile> profilesByGroup(String accountId);
    void clearActiveWorkspace(String accountId, String groupId);
    long attention(WorkspaceProfile profile);
}
