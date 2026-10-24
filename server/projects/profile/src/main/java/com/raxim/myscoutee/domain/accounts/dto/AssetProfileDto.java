package com.raxim.myscoutee.domain.accounts.dto;

import java.util.List;
import com.raxim.myscoutee.domain.accounts.api.AssetProfile;

/** Read-only asset view; payment totals, devices and integration configuration have separate owners. */
public record AssetProfileDto(String userId, String accountUserId, String workspaceGroupId,
        String deletedAtIso, String profileStatus, String status, String hostTier, String statusText,
        String name, String headline, String about, String traitLabel, String initials, String gender, List<String> images, Integer age, String city,
        Double affinity, HostConfidenceFactsDto hostConfidenceFacts) implements AssetProfile, com.raxim.myscoutee.domain.accounts.api.ProfileSummary.RecordFields {
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
    @Override public String getWorkspaceGroupId() { return workspaceGroupId; }
    @Override public Integer getAge() { return age; }
    @Override public String getCity() { return city; }
    @Override public Double getAffinity() { return affinity; }
    @Override public HostConfidenceFactsDto getHostConfidenceFacts() { return hostConfidenceFacts; }
}
