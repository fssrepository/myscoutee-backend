package com.raxim.myscoutee.domain.accounts.dto;

import java.util.List;
import com.raxim.myscoutee.domain.accounts.api.AssetProfile;

/** Read-only asset view; payment totals, devices and integration configuration have separate owners. */
public record AssetProfileDto(String userId, String accountUserId, String workspaceGroupId,
        String deletedAtIso, String profileStatus, String status, String hostTier, String statusText,
        String name, String headline, String about, String traitLabel, String initials, String gender, List<String> images, Integer age, String city,
        Double affinity, HostConfidenceFactsDto hostConfidenceFacts) implements AssetProfile {
    public AssetProfileDto {
        if (images != null) images = java.util.Collections.unmodifiableList(new java.util.ArrayList<>(images));
    }
    public static AssetProfileDto from(AssetProfile value) {
        if (value == null) return null;
        return new AssetProfileDto(value.getUserId(), value.getAccountUserId(), value.getWorkspaceGroupId(),
                value.getDeletedAtIso(), value.getProfileStatus(), value.getStatus(), value.getHostTier(), value.getStatusText(),
                value.getName(), value.getHeadline(), value.getAbout(), value.getTraitLabel(), value.getInitials(), value.getGender(), value.getImages(), value.getAge(), value.getCity(),
                value.getAffinity(), value.getHostConfidenceFacts());
    }
    @Override public String getUserId() { return userId; }
    @Override public String getAccountUserId() { return accountUserId; }
    @Override public String getWorkspaceGroupId() { return workspaceGroupId; }
    @Override public String getDeletedAtIso() { return deletedAtIso; }
    @Override public String getProfileStatus() { return profileStatus; }
    @Override public String getStatus() { return status; }
    @Override public String getHostTier() { return hostTier; }
    @Override public String getStatusText() { return statusText; }
    @Override public String getAbout() { return about; }
    @Override public String getHeadline() { return headline; }
    @Override public String getTraitLabel() { return traitLabel; }
    @Override public String getName() { return name; }
    @Override public String getInitials() { return initials; }
    @Override public String getGender() { return gender; }
    @Override public List<String> getImages() { return images; }
    @Override public Integer getAge() { return age; }
    @Override public String getCity() { return city; }
    @Override public Double getAffinity() { return affinity; }
    @Override public HostConfidenceFactsDto getHostConfidenceFacts() { return hostConfidenceFacts; }
}
