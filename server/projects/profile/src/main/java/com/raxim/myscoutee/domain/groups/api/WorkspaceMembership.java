package com.raxim.myscoutee.domain.groups.api;

import com.raxim.myscoutee.domain.accounts.api.WorkspaceProfile;

public interface WorkspaceMembership { WorkspaceProfile select(String accountId, String groupId); }
