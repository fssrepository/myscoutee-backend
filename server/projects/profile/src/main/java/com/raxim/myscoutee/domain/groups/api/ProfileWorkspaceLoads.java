package com.raxim.myscoutee.domain.groups.api;

import com.raxim.myscoutee.domain.groups.dto.ProfileWorkspaceDto;

/** Completes an already-authorized account profile load using the existing workspace selection rules. */
public interface ProfileWorkspaceLoads {
    ProfileWorkspaceDto loadProfileWorkspace(String accountId, String currentGroupId, String requestedGroupId);
}
