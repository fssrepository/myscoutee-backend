package com.raxim.myscoutee.domain.groups.dto;

import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserDto;
import com.raxim.myscoutee.domain.groups.dto.CommunityGroupDtos.Workspace;

/** The two workspace fields appended to an account-owned profile response. */
public record ProfileWorkspaceDto(Workspace workspace, UserDto accountProfile) {}
