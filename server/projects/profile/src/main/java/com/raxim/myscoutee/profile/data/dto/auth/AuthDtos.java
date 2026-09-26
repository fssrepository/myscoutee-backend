package com.raxim.myscoutee.profile.data.dto.auth;

import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetTicketsPageDto;
import com.raxim.myscoutee.profile.data.dto.experience.ExperienceDtos.ExperienceEntryDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.LocationCoordinatesDto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public final class AuthDtos {
    private AuthDtos() {
    }

    public record OperatorBootstrapLoginRequestDto(
            @NotBlank @Email @Size(max = 254) String email,
            @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
            @NotBlank @Size(max = 512) String password) {
    }

    public record OperatorBootstrapLoginResponseDto(
            String tokenType,
            String accessToken,
            String email,
            String expiresAt) {
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
            Integer chats,
            Integer invitations,
            Integer events,
            Integer hosting,
            Integer cars,
            Integer accommodation,
            Integer supplies,
            Integer tickets,
            Integer contacts,
            Integer feedback,
            UserChatCountersDto chat,
            UserEventCountersDto event,
            UserAssetCountersDto asset,
            UserEventFeedbackCountersDto eventFeedback,
            Integer adminJobs,
            Integer adminMetrics,
            Integer paymentRefundsPending,
            Integer contactRequestsPending,
            Integer notifications) {
        public UserMenuCountersDto(Integer game, Integer chats, Integer invitations, Integer events, Integer hosting, Integer cars, Integer accommodation, Integer supplies, Integer tickets, Integer contacts, Integer feedback, UserChatCountersDto chat, UserEventCountersDto event, UserAssetCountersDto asset, UserEventFeedbackCountersDto eventFeedback, Integer adminJobs, Integer adminMetrics, Integer paymentRefundsPending, Integer notifications) {
            this(game, chats, invitations, events, hosting, cars, accommodation, supplies, tickets, contacts, feedback, chat, event, asset, eventFeedback, adminJobs, adminMetrics, paymentRefundsPending, 0, notifications);
        }

        public UserMenuCountersDto(
                Integer game,
                Integer chats,
                Integer invitations,
                Integer events,
                Integer hosting,
                Integer cars,
                Integer accommodation,
                Integer supplies,
                Integer tickets,
                Integer contacts,
                Integer feedback,
                UserChatCountersDto chat,
                UserEventCountersDto event,
                UserAssetCountersDto asset,
                UserEventFeedbackCountersDto eventFeedback,
                Integer adminJobs,
                Integer adminMetrics) {
            this(
                    game,
                    chats,
                    invitations,
                    events,
                    hosting,
                    cars,
                    accommodation,
                    supplies,
                    tickets,
                    contacts,
                    feedback,
                    chat,
                    event,
                    asset,
                    eventFeedback,
                    adminJobs,
                    adminMetrics,
                    0,
                    0);
        }

        public UserMenuCountersDto(
                Integer game, Integer chats, Integer invitations, Integer events, Integer hosting,
                Integer cars, Integer accommodation, Integer supplies, Integer tickets,
                Integer contacts, Integer feedback, UserChatCountersDto chat,
                UserEventCountersDto event, UserAssetCountersDto asset,
                UserEventFeedbackCountersDto eventFeedback, Integer adminJobs,
                Integer adminMetrics, Integer notifications) {
            this(game, chats, invitations, events, hosting, cars, accommodation, supplies,
                    tickets, contacts, feedback, chat, event, asset, eventFeedback,
                    adminJobs, adminMetrics, 0, notifications);
        }
    }

    public record UserChatCountersDto(
            Integer all,
            Integer event,
            Integer subEvent,
            Integer group,
            Integer service,
            Integer appSupport,
            UserSupportCaseCountersDto supportCases,
            Integer groupSupport,
            Integer contacts) {
        public UserChatCountersDto(Integer all, Integer event, Integer subEvent, Integer group, Integer service,
                Integer appSupport, UserSupportCaseCountersDto supportCases, Integer groupSupport) {
            this(all, event, subEvent, group, service, appSupport, supportCases, groupSupport, 0);
        }
        public UserChatCountersDto(Integer all, Integer event, Integer subEvent, Integer group, Integer service,
                Integer appSupport, UserSupportCaseCountersDto supportCases) {
            this(all, event, subEvent, group, service, appSupport, supportCases, 0);
        }
        public UserChatCountersDto(
                Integer all,
                Integer event,
                Integer subEvent,
                Integer group,
                Integer service,
                Integer appSupport) {
            this(all, event, subEvent, group, service, appSupport,
                    new UserSupportCaseCountersDto(0, 0, 0, 0, 0, 0));
        }
    }

    public record UserSupportCaseCountersDto(
            Integer pending,
            Integer warned,
            Integer picked,
            Integer solved,
            Integer blocked,
            Integer all) {
    }

    public record UserEventCountersDto(
            Integer all,
            Integer active,
            Integer pending,
            Integer invitations,
            Integer hosting,
            Integer drafts,
            Integer trash,
            Integer watchlist) {
        public UserEventCountersDto(
                Integer all,
                Integer active,
                Integer pending,
                Integer invitations,
                Integer hosting,
                Integer drafts,
                Integer trash) {
            this(all, active, pending, invitations, hosting, drafts, trash, 0);
        }
    }

    public record UserAssetCountersDto(
            Integer cars,
            Integer accommodation,
            Integer supplies,
            Integer tickets,
            Integer carsPending,
            Integer accommodationPending,
            Integer suppliesPending) {
        public UserAssetCountersDto(
                Integer cars,
                Integer accommodation,
                Integer supplies,
                Integer tickets) {
            this(cars, accommodation, supplies, tickets, 0, 0, 0);
        }
    }

    public record UserEventFeedbackCountersDto(
            Integer ownEvents,
            Integer pending,
            Integer feedbacked,
            Integer removed) {
    }

    public record UserNotificationPreferencesDto(
            Boolean muted) {
    }

    public record UserRealtimeCountersDto(
            Integer game,
            Integer chats,
            Integer invitations,
            Integer events,
            Integer hosting,
            Integer cars,
            Integer accommodation,
            Integer supplies,
            Integer tickets,
            Integer contacts,
            Integer feedback,
            UserChatCountersDto chat,
            UserEventCountersDto event,
            UserAssetCountersDto asset,
            UserEventFeedbackCountersDto eventFeedback,
            Integer adminJobs,
            Integer adminMetrics,
            Integer paymentRefundsPending,
            Integer contactRequestsPending,
            Integer notifications,
            Boolean impressionsHostChanged,
            Boolean impressionsMemberChanged) {
        public UserRealtimeCountersDto(Integer game, Integer chats, Integer invitations, Integer events, Integer hosting, Integer cars, Integer accommodation, Integer supplies, Integer tickets, Integer contacts, Integer feedback, UserChatCountersDto chat, UserEventCountersDto event, UserAssetCountersDto asset, UserEventFeedbackCountersDto eventFeedback, Integer adminJobs, Integer adminMetrics, Integer paymentRefundsPending, Integer notifications, Boolean impressionsHostChanged, Boolean impressionsMemberChanged) {
            this(game, chats, invitations, events, hosting, cars, accommodation, supplies, tickets, contacts, feedback, chat, event, asset, eventFeedback, adminJobs, adminMetrics, paymentRefundsPending, 0, notifications, impressionsHostChanged, impressionsMemberChanged);
        }

        public UserRealtimeCountersDto(
                Integer game,
                Integer chats,
                Integer invitations,
                Integer events,
                Integer hosting,
                Integer cars,
                Integer accommodation,
                Integer supplies,
                Integer tickets,
                Integer contacts,
                Integer feedback,
                UserChatCountersDto chat,
                UserEventCountersDto event,
                UserAssetCountersDto asset,
                UserEventFeedbackCountersDto eventFeedback,
                Integer adminJobs,
                Integer adminMetrics,
                Boolean impressionsHostChanged,
                Boolean impressionsMemberChanged) {
            this(
                    game,
                    chats,
                    invitations,
                    events,
                    hosting,
                    cars,
                    accommodation,
                    supplies,
                    tickets,
                    contacts,
                    feedback,
                    chat,
                    event,
                    asset,
                    eventFeedback,
                    adminJobs,
                    adminMetrics,
                    0,
                    0,
                    impressionsHostChanged,
                    impressionsMemberChanged);
        }

        public UserRealtimeCountersDto(
                Integer game, Integer chats, Integer invitations, Integer events, Integer hosting,
                Integer cars, Integer accommodation, Integer supplies, Integer tickets,
                Integer contacts, Integer feedback, UserChatCountersDto chat,
                UserEventCountersDto event, UserAssetCountersDto asset,
                UserEventFeedbackCountersDto eventFeedback, Integer adminJobs,
                Integer adminMetrics, Integer notifications, Boolean impressionsHostChanged,
                Boolean impressionsMemberChanged) {
            this(game, chats, invitations, events, hosting, cars, accommodation, supplies,
                    tickets, contacts, feedback, chat, event, asset, eventFeedback,
                    adminJobs, adminMetrics, 0, notifications,
                    impressionsHostChanged, impressionsMemberChanged);
        }
    }

    public record UserPaymentTotalsDto(
            Map<String, Double> outgoing,
            Map<String, Double> incoming,
            Map<String, Double> all) {
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
            Integer chats,
            Integer invitations,
            Integer events,
            Integer hosting,
            Integer cars,
            Integer accommodation,
            Integer supplies,
            Integer tickets,
            Integer contacts,
            Integer feedback,
            UserChatCountersDto chat,
            UserEventCountersDto event,
            UserAssetCountersDto asset,
            UserEventFeedbackCountersDto eventFeedback,
            Integer adminJobs,
            Integer adminMetrics,
            Integer paymentRefundsPending,
            Integer contactRequestsPending,
            Integer notifications) {
        public UserActivitiesDto(Integer game, Integer chats, Integer invitations, Integer events, Integer hosting, Integer cars, Integer accommodation, Integer supplies, Integer tickets, Integer contacts, Integer feedback, UserChatCountersDto chat, UserEventCountersDto event, UserAssetCountersDto asset, UserEventFeedbackCountersDto eventFeedback, Integer adminJobs, Integer adminMetrics, Integer paymentRefundsPending, Integer notifications) {
            this(game, chats, invitations, events, hosting, cars, accommodation, supplies, tickets, contacts, feedback, chat, event, asset, eventFeedback, adminJobs, adminMetrics, paymentRefundsPending, 0, notifications);
        }

        public UserActivitiesDto(
                Integer game,
                Integer chats,
                Integer invitations,
                Integer events,
                Integer hosting,
                Integer cars,
                Integer accommodation,
                Integer supplies,
                Integer tickets,
                Integer contacts,
                Integer feedback,
                UserChatCountersDto chat,
                UserEventCountersDto event,
                UserAssetCountersDto asset,
                UserEventFeedbackCountersDto eventFeedback,
                Integer adminJobs,
                Integer adminMetrics) {
            this(
                    game,
                    chats,
                    invitations,
                    events,
                    hosting,
                    cars,
                    accommodation,
                    supplies,
                    tickets,
                    contacts,
                    feedback,
                    chat,
                    event,
                    asset,
                    eventFeedback,
                    adminJobs,
                    adminMetrics,
                    0,
                    0);
        }

        public UserActivitiesDto(
                Integer game, Integer chats, Integer invitations, Integer events, Integer hosting,
                Integer cars, Integer accommodation, Integer supplies, Integer tickets,
                Integer contacts, Integer feedback, UserChatCountersDto chat,
                UserEventCountersDto event, UserAssetCountersDto asset,
                UserEventFeedbackCountersDto eventFeedback, Integer adminJobs,
                Integer adminMetrics, Integer notifications) {
            this(game, chats, invitations, events, hosting, cars, accommodation, supplies,
                    tickets, contacts, feedback, chat, event, asset, eventFeedback,
                    adminJobs, adminMetrics, 0, notifications);
        }
    }

    public record ProfileDetailRowDto(
            String labelKey,
            String value,
            String privacy,
            List<String> options) {
    }

    public record ProfileDetailGroupDto(
            String title,
            List<ProfileDetailRowDto> rows) {
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
            Integer profileFormVersion,
            String headline,
            String about,
            Double affinity,
            LocationCoordinatesDto locationCoordinates,
            String partitionKey,
            List<String> images,
            List<ProfileDetailGroupDto> profileDetails,
            UserImpressionsDto impressions,
            String profileStatus,
            String previousProfileStatus,
            String deletedAtIso,
            Boolean admin,
            Boolean operator,
            UserActivitiesDto activities,
            UserNotificationPreferencesDto notificationPreferences) {
    }

    public record ProfileExtDto(
            UserDto profile,
            List<ExperienceEntryDto> experienceEntries,
            String affiliateCode) {
        public ProfileExtDto(UserDto profile, List<ExperienceEntryDto> experienceEntries) {
            this(profile, experienceEntries, null);
        }
    }

    public record ProfileExtByIdResponseDto(
            ProfileExtDto profileExt,
            Integer filterCount,
            UserGameFilterPreferencesDto filterPreferences,
            UserMenuCountersDto counterOverrides,
            com.raxim.myscoutee.profile.data.dto.groups.CommunityGroupDtos.Workspace workspace,
            UserDto accountProfile) {
        public ProfileExtByIdResponseDto(ProfileExtDto profileExt, Integer filterCount,
                UserGameFilterPreferencesDto filterPreferences, UserMenuCountersDto counterOverrides) {
            this(profileExt, filterCount, filterPreferences, counterOverrides, null, null);
        }
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
            Integer profileFormVersion,
            String headline,
            String about,
            Double affinity,
            LocationCoordinatesDto locationCoordinates,
            String partitionKey,
            List<String> images,
            List<ProfileDetailGroupDto> profileDetails,
            UserImpressionsDto impressions,
            String profileStatus,
            String previousProfileStatus,
            String deletedAtIso,
            Boolean admin,
            Boolean operator,
            UserActivitiesDto activities,
            UserNotificationPreferencesDto notificationPreferences,
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
            LocationCoordinatesDto locationCoordinates,
            boolean locationRequired,
            String name,
            String city,
            String initials,
            String avatarUrl,
            String gender,
            String statusText,
            Integer completion,
            Integer profileFormVersion,
            String status,
            String profileStatus,
            String deletedAtIso) {
    }

    public record UserNotificationDeviceDto(String deviceId, boolean notificationsEnabled) {
    }

    public record UserRealtimeLongPollResponseDto(
            String userId,
            String profileStatus,
            LocationCoordinatesDto locationCoordinates,
            UserRealtimeCountersDto counters,
            UserImpressionsDto impressions,
            AssetTicketsPageDto offlineTicketSnapshot,
            UserPaymentTotalsDto paymentTotals,
            List<UserNotificationDeviceDto> notificationDevices,
            String cursor,
            String serverTsIso,
            com.raxim.myscoutee.profile.data.document.Users.FollowingRecord following,
            com.raxim.myscoutee.profile.data.dto.admin.ContentModerationDtos.Snapshot contentModeration,
            com.raxim.myscoutee.profile.data.document.Users.FeedCountersRecord feedCounters,
            boolean paymentCardsAvailable) {
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

    public record UserSessionLoginRequestDto(
            @NotBlank @Size(max = 128) String attemptId,
            @Size(max = 32) String provider) {
    }

    public record UserSessionLoginResponseDto(
            boolean accepted,
            boolean existingSession,
            String outcome,
            Integer activeSessionCount,
            Integer maxActiveSessions,
            String message) {
    }

    public record UserDeleteRequestDto(
            String userId) {
    }

    public record FacebookDataDeletionResponseDto(
            String url,
            String confirmation_code) {
    }

    public record UserSubmitActionResponseDto(
            boolean submitted,
            String message) {
    }
}
