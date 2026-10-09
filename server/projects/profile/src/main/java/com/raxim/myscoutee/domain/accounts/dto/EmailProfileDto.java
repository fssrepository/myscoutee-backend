package com.raxim.myscoutee.domain.accounts.dto;

import java.util.List;
import com.raxim.myscoutee.domain.accounts.api.EmailProfile;

public record EmailProfileDto(String id, String userId, String workspaceGroupId, String status,
        String profileStatus, String name, String email, String city, String partitionKey, Integer completion,
        ActivitiesDto activities, List<DeviceActivityDto> devices) implements EmailProfile {
    public record ActivitiesDto(Integer events, Integer hosting) implements EmailProfile.ActivityCounts {}
    public record DeviceActivityDto(String lastSeenAtIso, String lastRegisteredAtIso,
            Boolean notificationsEnabled, boolean pushTokenPresent) implements EmailProfile.Device {
        @Override public String getLastSeenAtIso() { return lastSeenAtIso; }
        @Override public String getLastRegisteredAtIso() { return lastRegisteredAtIso; }
        @Override public Boolean getNotificationsEnabled() { return notificationsEnabled; }
        @Override public boolean hasPushToken() { return pushTokenPresent; }
    }
    public static EmailProfileDto from(EmailProfile value) {
        if (value == null) return null;
        var counts = value.getActivities();
        return new EmailProfileDto(value.getId(), value.getUserId(), value.getWorkspaceGroupId(), value.getStatus(),
                value.getProfileStatus(), value.getName(), value.getEmail(), value.getCity(), value.getPartitionKey(), value.getCompletion(),
                counts == null ? null : new ActivitiesDto(counts.events(), counts.hosting()),
                value.getDevices() == null ? null : value.getDevices().stream().map(device -> device == null ? null :
                        new DeviceActivityDto(device.getLastSeenAtIso(), device.getLastRegisteredAtIso(), device.getNotificationsEnabled(), device.hasPushToken())).toList());
    }
    @Override public String getId() { return id; }
    @Override public String getUserId() { return userId; }
    @Override public String getWorkspaceGroupId() { return workspaceGroupId; }
    @Override public String getStatus() { return status; }
    @Override public String getProfileStatus() { return profileStatus; }
    @Override public String getName() { return name; }
    @Override public String getEmail() { return email; }
    @Override public String getCity() { return city; }
    @Override public String getPartitionKey() { return partitionKey; }
    @Override public Integer getCompletion() { return completion; }
    @Override public ActivitiesDto getActivities() { return activities; }
    @Override public List<DeviceActivityDto> getDevices() { return devices; }
}
