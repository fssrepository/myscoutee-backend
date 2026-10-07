package com.raxim.myscoutee.domain.accounts.api;

import java.util.List;

/** Read-only local profile view; callers must not retain it as a persistence handle. */
public interface WorkspaceProfile {
    String getUserId();
    String getAccountUserId();
    String getWorkspaceGroupId();
    String getProfileStatus();
    String getStatus();
    String getHostTier();
    String getStatusText();
    String getEmail();
    String getName();
    String getCity();
    List<String> getImages();
    Coordinates getLocationCoordinates();
    interface Coordinates { Double latitude(); Double longitude(); }
}
