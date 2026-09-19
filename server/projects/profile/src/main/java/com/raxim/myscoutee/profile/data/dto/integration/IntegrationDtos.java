package com.raxim.myscoutee.profile.data.dto.integration;

import java.util.List;

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
            List<IntegrationTokenDto> tokens) {
    }

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
            List<String> topics) {
    }

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
