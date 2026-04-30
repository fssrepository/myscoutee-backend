package com.raxim.myscoutee.profile.data.dto.auth;

import java.util.List;

import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.LocationCoordinatesDto;

public final class AuthDtos {
    private AuthDtos() {
    }

    public record UserPersonalityTraitDto(
            String id,
            String label,
            Integer percent,
            Integer evidenceCount,
            String lastRatedAtIso) {
    }

    public record UserImpressionsSectionDto(
            Integer unreadCount,
            Double averageRating,
            Integer peopleMet,
            Integer totalEvents,
            Integer repeatCount,
            Integer noShowCount,
            List<String> vibeBadges,
            List<String> personalityBadges,
            List<UserPersonalityTraitDto> personalityTraits,
            List<String> categoryBadges) {
    }

    public record UserImpressionsDto(
            UserImpressionsSectionDto host,
            UserImpressionsSectionDto member) {
    }

    public record UserMenuCountersDto(
            Integer game,
            Integer chat,
            Integer invitations,
            Integer events,
            Integer hosting,
            Integer tickets,
            Integer feedback) {
    }

    public record UserRealtimeCountersDto(
            Integer game,
            Integer chat,
            Integer invitations,
            Integer events,
            Integer hosting,
            Integer tickets,
            Integer feedback,
            Boolean impressionsHostChanged,
            Boolean impressionsMemberChanged) {
    }

    public record UserGameFilterPreferencesDto(
            Integer ageMin,
            Integer ageMax,
            Integer heightMinCm,
            Integer heightMaxCm,
            List<String> interests,
            List<String> values,
            List<String> physiques,
            List<String> languages,
            List<String> genders,
            List<String> horoscopes,
            List<String> traitLabels,
            List<String> smoking,
            List<String> drinking,
            List<String> workout,
            List<String> pets,
            List<String> familyPlans,
            List<String> children,
            List<String> loveStyles,
            List<String> communicationStyles,
            List<String> sexualOrientations,
            List<String> religions) {
    }

    public record UserActivitiesDto(
            Integer game,
            Integer chat,
            Integer invitations,
            Integer events,
            Integer hosting,
            Integer tickets,
            Integer feedback) {
    }

    public record UserDto(
            String id,
            String name,
            Integer age,
            String birthday,
            String city,
            String height,
            String physique,
            List<String> languages,
            String horoscope,
            String initials,
            String gender,
            String statusText,
            String hostTier,
            String traitLabel,
            Integer completion,
            String headline,
            String about,
            Double affinity,
            LocationCoordinatesDto locationCoordinates,
            String partitionKey,
            List<String> images,
            UserImpressionsDto impressions,
            String profileStatus,
            String previousProfileStatus,
            String deletedAtIso,
            UserActivitiesDto activities) {
    }

    public record UserByIdResponseDto(
            String id,
            String name,
            Integer age,
            String birthday,
            String city,
            String height,
            String physique,
            List<String> languages,
            String horoscope,
            String initials,
            String gender,
            String statusText,
            String hostTier,
            String traitLabel,
            Integer completion,
            String headline,
            String about,
            Double affinity,
            LocationCoordinatesDto locationCoordinates,
            String partitionKey,
            List<String> images,
            UserImpressionsDto impressions,
            String profileStatus,
            String previousProfileStatus,
            String deletedAtIso,
            UserActivitiesDto activities,
            Integer filterCount,
            UserGameFilterPreferencesDto filterPreferences,
            UserMenuCountersDto counterOverrides) {
    }

    public record UserRealtimeLongPollRequestDto(
            String userId,
            String cursor) {
    }

    public record UserLocationEligibilityResponseDto(
            boolean eligible,
            String partitionKey,
            String message,
            boolean securityGateEnabled,
            boolean locationRequired) {
    }

    public record DemoUserListItemDto(
            String id,
            String name,
            String city,
            String initials,
            String gender) {
    }

    public record UserRealtimeLongPollResponseDto(
            String userId,
            UserRealtimeCountersDto counters,
            UserImpressionsDto impressions,
            String cursor,
            String serverTsIso) {
    }

    public record UserFilterPreferencesRequestDto(
            String userId,
            UserGameFilterPreferencesDto filterPreferences) {
    }

    public record UserFeedbackSubmitRequestDto(
            String userId,
            String category,
            String subject,
            String details) {
    }

    public record UserReportUserSubmitRequestDto(
            String userId,
            String handle,
            String reason,
            String details,
            String targetUserId,
            String memberEntryId,
            String eventId,
            String eventTitle,
            String eventStartAtIso,
            String sourceType,
            String sourceId,
            String sourceText,
            String chatId,
            String messageId,
            String assetId,
            String assetType) {
    }

    public record UserLogoutRequestDto(
            String userId) {
    }

    public record UserDeleteRequestDto(
            String userId) {
    }

    public record UserSubmitActionResponseDto(
            boolean submitted,
            String message) {
    }

    public record UserProfileImageUploadResponseDto(
            String imageUrl,
            String url) {
    }
}
