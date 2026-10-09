package com.raxim.myscoutee.domain.accounts.dto;

import java.util.List;

public final class ExperienceDtos {
    private ExperienceDtos() {
    }

    public record ExperienceEntryDto(
            String id,
            String type,
            String title,
            String org,
            String city,
            String dateFrom,
            String dateTo,
            String description) implements com.raxim.myscoutee.domain.accounts.api.Experiences.Entry {
        public static ExperienceEntryDto from(com.raxim.myscoutee.domain.accounts.api.Experiences.Entry entry) {
            return entry == null ? null : new ExperienceEntryDto(entry.getId(), entry.getType(), entry.getTitle(),
                    entry.getOrg(), entry.getCity(), entry.getDateFrom(), entry.getDateTo(), entry.getDescription());
        }
        @Override public String getId() { return id; }
        @Override public String getType() { return type; }
        @Override public String getTitle() { return title; }
        @Override public String getOrg() { return org; }
        @Override public String getCity() { return city; }
        @Override public String getDateFrom() { return dateFrom; }
        @Override public String getDateTo() { return dateTo; }
        @Override public String getDescription() { return description; }
    }

    public record UserExperiencesResponseDto(
            String userId,
            List<ExperienceEntryDto> entries) implements com.raxim.myscoutee.domain.accounts.api.Experiences.Profile {
        public static UserExperiencesResponseDto from(com.raxim.myscoutee.domain.accounts.api.Experiences.Profile profile) {
            return profile == null ? null : new UserExperiencesResponseDto(profile.getUserId(),
                    profile.getEntries() == null ? null : profile.getEntries().stream().map(ExperienceEntryDto::from).toList());
        }
        @Override public String getUserId() { return userId; }
        @Override public List<ExperienceEntryDto> getEntries() { return entries; }
    }

    public record UserExperiencesSaveRequestDto(
            String userId,
            List<ExperienceEntryDto> entries) {
    }
}
