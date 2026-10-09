package com.raxim.myscoutee.domain.affinity.api;

import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserDto;
import com.raxim.myscoutee.domain.affinity.dto.UserAffinityInputDto;
import com.raxim.myscoutee.domain.groups.api.WorkspaceContext;

/** Profile scoring only; event and asset scoring remain separate operations. */
public interface UserAffinityScores {
    default double resolveUserAffinity(UserDto user) {
        return calculateUserAffinity(UserAffinityInputDto.from(user), WorkspaceContext.currentGroupId());
    }

    double calculateUserAffinity(UserAffinityInputDto user, String workspaceGroupId);
}
