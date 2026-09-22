package com.raxim.myscoutee.profile.data.dto.integration;

import java.util.List;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.MingleConfigurationDto;

public final class IntegrationDtos {
    private IntegrationDtos() {
    }

    public record IntegrationTokenDto(
            String id,
            String name,
            String prefix,
            String createdAt,
            String expiresAt,
            String claimedAt,
            String claimedAddress,
            String lastUsedAt) {
    }

    public record IntegrationSettingsDto(
            String baseUrl,
            Integer maxActiveTokens,
            Integer maxBatchSize,
            List<IntegrationTokenDto> tokens,
            AffiliateSummaryDto affiliate,
            IntegrationParticipantSummaryDto participants) {
        public IntegrationSettingsDto(String baseUrl, Integer maxActiveTokens, Integer maxBatchSize,
                List<IntegrationTokenDto> tokens) {
            this(baseUrl, maxActiveTokens, maxBatchSize, tokens, null, null);
        }
    }

    public record AffiliateCurrencyRevenueDto(double gross, double refunded, double net) { }
    public record AffiliateRevenueDto(java.util.Map<String, AffiliateCurrencyRevenueDto> currencies,
            long purchases, long eventBookings) { }
    public record AffiliateSummaryDto(String url, long registered, AffiliateRevenueDto revenue) {
        public AffiliateSummaryDto(String url, long registered) { this(url, registered, null); }
    }
    public record IntegrationParticipantSummaryDto(long registered, long imported) { }

    public record IntegrationTokenCreateRequestDto(
            String name,
            Integer expiresInDays) {
    }

    public record IntegrationTokenCreatedDto(
            IntegrationTokenDto token,
            String value) {
    }

    public record IntegrationConnectDto(
            Boolean connected,
            Integer maxBatchSize) {
    }

    public record IntegrationWatchRequestDto(
            String callbackUrl,
            List<String> events,
            Boolean enabled) {
    }

    public record IntegrationWatchResponseDto(
            Boolean enabled,
            String callbackUrl,
            List<String> events) {
    }

    public record IntegrationAssetSyncItemDto(
            String id,
            String type,
            String title,
            String subtitle,
            String category,
            String city,
            Integer capacityTotal,
            Integer quantity,
            String details,
            String sourceLink,
            List<String> routes,
            String visibility) {
    }

    public record IntegrationAssetSyncRequestDto(
            List<IntegrationAssetSyncItemDto> items) {
    }

    public record IntegrationEventSyncItemDto(
            String id,
            String title,
            String subtitle,
            String startAt,
            String endAt,
            String location,
            Integer capacityMin,
            Integer capacityMax,
            String visibility,
            String status,
            String sourceLink,
            List<String> topics,
            String mode,
            MingleConfigurationDto mingleConfiguration) {
    }

    public record IntegrationParticipantInviteRequestDto(List<String> participantIds) { }
    public record IntegrationParticipantInviteDto(String id, String inviteUrl, boolean claimed) { }
    public record IntegrationParticipantInvitesDto(List<IntegrationParticipantInviteDto> items) { }
    public record IntegrationParticipantClaimDto(String eventId, boolean invitationAvailable) { }

    public record IntegrationEventDto(String id, String externalId, String title, String status,
            String sourceLink, String mode, MingleConfigurationDto mingleConfiguration) { }

    public record IntegrationEncounterParticipantDto(String id, String externalId) { }
    public record IntegrationEncounterPairDto(IntegrationEncounterParticipantDto first, IntegrationEncounterParticipantDto second) { }
    public record IntegrationEncountersDto(String id, String externalId, int revision,
            List<IntegrationEncounterPairDto> pairs, int total, Integer nextOffset) { }

    public record IntegrationEventSyncRequestDto(
            List<IntegrationEventSyncItemDto> items) {
    }

    public record IntegrationSyncResultDto(
            String id,
            String externalId,
            String result,
            String error) {
    }

    public record IntegrationSyncResponseDto(
            List<IntegrationSyncResultDto> items) {
    }
}
