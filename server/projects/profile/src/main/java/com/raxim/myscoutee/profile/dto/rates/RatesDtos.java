package com.raxim.myscoutee.profile.dto.rates;

import java.util.List;

public final class RatesDtos {
    private RatesDtos() {
    }

    public record RateMenuItemDto(
            String id,
            String userId,
            String secondaryUserId,
            String mode,
            String direction,
            Integer scoreGiven,
            Integer scoreReceived,
            String eventName,
            String happenedAt,
            Double distanceKm,
            Integer distanceMetersExact) {
    }

    public record UserRateRecordDto(
            String id,
            String fromUserId,
            String toUserId,
            Integer rate,
            String mode,
            String source,
            String createdAtIso,
            String updatedAtIso,
            String ownerUserId,
            String displayId,
            String displayDirection,
            Integer scoreGiven,
            Integer scoreReceived,
            String eventName,
            String happenedAtIso,
            Double distanceKm,
            Integer distanceMetersExact) {
    }

    public record UserRatesSyncRequestDto(
            List<UserRateRecordDto> rates) {
    }

    public record UserRatesSyncResponseDto(
            List<String> syncedRateIds,
            List<String> failedRateIds) {
    }
}
