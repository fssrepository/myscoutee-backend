package com.raxim.myscoutee.domain.accounts.api;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserDto;
/** Renders an account-issued local profile view using the established profile presentation. */
public interface ProfilePresentation extends CurrentProfile { UserDto present(WorkspaceProfile profile); }
