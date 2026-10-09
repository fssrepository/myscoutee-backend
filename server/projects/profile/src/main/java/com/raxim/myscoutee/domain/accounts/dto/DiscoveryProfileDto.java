package com.raxim.myscoutee.domain.accounts.dto;

import com.raxim.myscoutee.domain.accounts.api.DiscoveryProfile;

/** Discovery display, distance and language facts; no devices, payments or private configuration. */
public record DiscoveryProfileDto(
        String userId,
        String accountUserId,
        String workspaceGroupId,
        String deletedAtIso,
        String profileStatus,
        String status,
        String hostTier,
        String statusText,
        String name,
        String headline, String about,
        String traitLabel,
        Integer age,
        String city,
        String initials,
        String gender,
        java.util.List<String> images, Coordinates locationCoordinates, java.util.List<String> languages, Double affinity) implements DiscoveryProfile {
    @Override public Double getAffinity() { return affinity; }
    public record Coordinates(Double latitude, Double longitude) implements com.raxim.myscoutee.domain.accounts.api.ScoringProfile.Coordinates {}
    @Override public Coordinates getLocationCoordinates() { return locationCoordinates; }
    @Override public java.util.List<String> getLanguages() { return languages; }
    public DiscoveryProfileDto {
        if (languages != null) languages = java.util.Collections.unmodifiableList(new java.util.ArrayList<>(languages));
        if (images != null) images = java.util.Collections.unmodifiableList(new java.util.ArrayList<>(images));
    }
    public static DiscoveryProfileDto from(DiscoveryProfile value) {
        return new DiscoveryProfileDto(
                value.getUserId(),
                value.getAccountUserId(),
                value.getWorkspaceGroupId(),
                value.getDeletedAtIso(),
                value.getProfileStatus(),
                value.getStatus(),
                value.getHostTier(),
                value.getStatusText(),
                value.getName(),
                value.getHeadline(), value.getAbout(),
                value.getTraitLabel(),
                value.getAge(),
                value.getCity(),
                value.getInitials(),
                value.getGender(),
                value.getImages(), value.getLocationCoordinates() == null ? null : new Coordinates(
                        value.getLocationCoordinates().latitude(), value.getLocationCoordinates().longitude()), value.getLanguages(), value.getAffinity());
    }
    @Override public String getUserId() { return userId; }
    @Override public String getAccountUserId() { return accountUserId; }
    @Override public String getWorkspaceGroupId() { return workspaceGroupId; }
    @Override public String getDeletedAtIso() { return deletedAtIso; }
    @Override public String getProfileStatus() { return profileStatus; }
    @Override public String getStatus() { return status; }
    @Override public String getHostTier() { return hostTier; }
    @Override public String getStatusText() { return statusText; }
    @Override public Integer getAge() { return age; }
    @Override public String getCity() { return city; }
    @Override public String getAbout() { return about; }
    @Override public String getHeadline() { return headline; }
    @Override public String getTraitLabel() { return traitLabel; }
    @Override public String getName() { return name; }
    @Override public String getInitials() { return initials; }
    @Override public String getGender() { return gender; }
    @Override public java.util.List<String> getImages() { return images; }
}
