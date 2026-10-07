package com.raxim.myscoutee.domain.accounts.api;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserDto;
/** Renders an account-issued local profile view using the established profile presentation. */
public interface ProfilePresentation extends CurrentProfile {
    java.util.List<UserDto> queryUsersByIds(java.util.Collection<String> ids);
    boolean activityRateVisible(WorkspaceProfile profile);
    void evictUserReadCaches(java.util.Collection<String> ids);
 UserDto present(WorkspaceProfile profile); }
