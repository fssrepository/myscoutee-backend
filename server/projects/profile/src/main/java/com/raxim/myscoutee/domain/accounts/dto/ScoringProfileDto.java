package com.raxim.myscoutee.domain.accounts.dto;

import java.util.List;
import com.raxim.myscoutee.domain.accounts.api.ScoringProfile;

/** Stored scoring input. This immutable value is not a persistence handle. */
public record ScoringProfileDto(
        String userId,
        String workspaceGroupId,
        String syncKey,
        String city,
        String physique,
        List<String> languages,
        String horoscope,
        String gender,
        String hostTier,
        String traitLabel,
        String headline,
        String about,
        Integer age,
        String height,
        Integer completion,
        Double affinity,
        CoordinatesDto locationCoordinates,
        List<DetailGroupDto> profileDetails,
        ImpressionsDto impressions) implements ScoringProfile {
    public ScoringProfileDto { languages = snapshot(languages); profileDetails = snapshot(profileDetails); }
    private static <T> List<T> snapshot(List<T> source) {
        return source == null ? null : java.util.Collections.unmodifiableList(new java.util.ArrayList<>(source));
    }
    public static ScoringProfileDto from(ScoringProfile value) {
        if (value == null) return null;
        return new ScoringProfileDto(
                value.getId(),
                value.getWorkspaceGroupId(),
                value.getSyncKey(),
                value.getCity(),
                value.getPhysique(),
                value.getLanguages(),
                value.getHoroscope(),
                value.getGender(),
                value.getHostTier(),
                value.getTraitLabel(),
                value.getHeadline(),
                value.getAbout(),
                value.getAge(),
                value.getHeight(),
                value.getCompletion(),
                value.getAffinity(),
                CoordinatesDto.from(value.getLocationCoordinates()),
                value.getProfileDetails() == null ? null : value.getProfileDetails().stream().map(DetailGroupDto::from).toList(),
                ImpressionsDto.from(value.getImpressions()));
    }
    public ScoringProfileDto withAffinity(double updated) {
        return new ScoringProfileDto(userId, workspaceGroupId, syncKey, city, physique, languages, horoscope, gender, hostTier, traitLabel, headline, about, age, height, completion, updated, locationCoordinates, profileDetails, impressions);
    }
    @com.fasterxml.jackson.annotation.JsonIgnore
    @Override public String getId() { return userId; }
    @Override public String getUserId() { return userId; }
    @Override public String getWorkspaceGroupId() { return workspaceGroupId; }
    @Override public String getSyncKey() { return syncKey; }
    @Override public String getCity() { return city; }
    @Override public String getPhysique() { return physique; }
    @Override public List<String> getLanguages() { return languages; }
    @Override public String getHoroscope() { return horoscope; }
    @Override public String getGender() { return gender; }
    @Override public String getHostTier() { return hostTier; }
    @Override public String getTraitLabel() { return traitLabel; }
    @Override public String getHeadline() { return headline; }
    @Override public String getAbout() { return about; }
    @Override public Integer getAge() { return age; }
    @Override public String getHeight() { return height; }
    @Override public Integer getCompletion() { return completion; }
    @Override public Double getAffinity() { return affinity; }
    @Override public CoordinatesDto getLocationCoordinates() { return locationCoordinates; }
    @Override public List<DetailGroupDto> getProfileDetails() { return profileDetails; }
    @Override public ImpressionsDto getImpressions() { return impressions; }
    public record CoordinatesDto(Double latitude, Double longitude) implements ScoringProfile.Coordinates {
        static CoordinatesDto from(ScoringProfile.Coordinates value) { return value == null ? null : new CoordinatesDto(value.latitude(), value.longitude()); }
    }
    public record DetailGroupDto(String title, List<DetailRowDto> rows) implements ScoringProfile.ProfileDetailGroupRecord {
        public DetailGroupDto { rows = snapshot(rows); }
        static DetailGroupDto from(ScoringProfile.ProfileDetailGroupRecord value) {
            return value == null ? null : new DetailGroupDto(value.title(), value.rows() == null ? null : value.rows().stream().map(DetailRowDto::from).toList());
        }
    }
    public record DetailRowDto(String labelKey, String value, String privacy, List<String> options) implements ScoringProfile.ProfileDetailRowRecord {
        public DetailRowDto { options = snapshot(options); }
        static DetailRowDto from(ScoringProfile.ProfileDetailRowRecord value) {
            return value == null ? null : new DetailRowDto(value.labelKey(), value.value(), value.privacy(), value.options());
        }
    }
    public record ImpressionsDto(ImpressionSectionDto host, ImpressionSectionDto member) implements ScoringProfile.UserImpressionsRecord {
        static ImpressionsDto from(ScoringProfile.UserImpressionsRecord value) {
            return value == null ? null : new ImpressionsDto(ImpressionSectionDto.from(value.host()), ImpressionSectionDto.from(value.member()));
        }
    }
    public record ImpressionSectionDto(Integer unreadCount, Double averageRating, Integer peopleMet, Integer totalEvents,
            Integer repeatCount, Integer noShowCount, List<String> vibeBadges, List<String> personalityBadges,
            List<TraitDto> personalityTraits, List<String> categoryBadges) implements ScoringProfile.UserImpressionsSectionRecord {
        public ImpressionSectionDto {
            vibeBadges = snapshot(vibeBadges); personalityBadges = snapshot(personalityBadges);
            personalityTraits = snapshot(personalityTraits); categoryBadges = snapshot(categoryBadges);
        }
        static ImpressionSectionDto from(ScoringProfile.UserImpressionsSectionRecord value) {
            return value == null ? null : new ImpressionSectionDto(value.unreadCount(), value.averageRating(), value.peopleMet(),
                    value.totalEvents(), value.repeatCount(), value.noShowCount(), value.vibeBadges(), value.personalityBadges(),
                    value.personalityTraits() == null ? null : value.personalityTraits().stream().map(TraitDto::from).toList(), value.categoryBadges());
        }
    }
    public record TraitDto(String id, String label, Integer percent, Integer evidenceCount, String lastRatedAtIso) implements ScoringProfile.UserPersonalityTraitRecord {
        static TraitDto from(ScoringProfile.UserPersonalityTraitRecord value) {
            return value == null ? null : new TraitDto(value.id(), value.label(), value.percent(), value.evidenceCount(), value.lastRatedAtIso());
        }
    }
}
