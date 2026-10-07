package com.raxim.myscoutee.domain.accounts.api;

import java.util.List;

/** Read-only local profile view; callers must not retain it as a persistence handle. */
public interface WorkspaceProfile {
    String getId();
    Integer getCompletion();
    String getPartitionKey();
    ActivityCounts getActivities();
    List<? extends Device> getDevices();
    interface ActivityCounts { Integer events(); Integer hosting(); }
    interface Device {
        String getLastSeenAtIso();
        String getLastRegisteredAtIso();
        Boolean getNotificationsEnabled();
        String getFirebaseToken();
    }
    String getUserId();
    String getAccountUserId();
    String getWorkspaceGroupId();
    String getProfileStatus();
    String getStatus();
    String getHostTier();
    String getStatusText();
    String getEmail();
    String getInitials();
    String getGender();
    String getName();
    String getCity();
    List<String> getImages();
    List<String> getLanguages();
    Coordinates getLocationCoordinates();
    interface Coordinates { Double latitude(); Double longitude(); }
}
