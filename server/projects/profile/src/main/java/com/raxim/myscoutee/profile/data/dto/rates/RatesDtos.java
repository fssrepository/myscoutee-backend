package com.raxim.myscoutee.profile.data.dto.rates;

import java.util.List;
import java.util.Map;

import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.UserDto;

public final class RatesDtos {
    private RatesDtos() {
    }

    public record RateMenuItemDto(
            String id,
            String userId,
            String secondaryUserId,
            String mode,
            String direction,
            String socialContext,
            String bridgeUserId,
            Integer bridgeCount,
            Double scoreGiven,
            Double scoreReceived,
            String eventName,
            String happenedAt,
            Integer distanceMetersExact,
            Boolean met,
            RatingSnapshotDto ratingSnapshot) {
    }

    public record ActivityRatePageResponseDto(
            List<RateMenuItemDto> items,
            Integer total,
            String nextCursor,
            List<UserDto> users,
            Integer gameCounter) {
    }

    public record UserRateRecordDto(
            String id,
            String fromUserId,
            String toUserId,
            Number rate,
            String mode,
            String createdAtIso,
            String updatedAtIso,
            String ownerUserId,
            String displayId,
            String displayDirection,
            String socialContext,
            String bridgeUserId,
            Integer bridgeCount,
            Number scoreGiven,
            Number scoreReceived,
            String eventName,
            String happenedAtIso,
            Integer distanceMetersExact,
            RatingSnapshotDto ratingSnapshot) {
    }

    public record RatingSnapshotDto(
            Integer version,
            String profileType,
            Map<String, Double> criteria,
            Double average) {
    }

    public record UserRatesSyncRequestDto(
            List<UserRateRecordDto> rates) {
    }

    public record UserRatesSyncResponseDto(
            List<String> syncedRateIds,
            List<String> failedRateIds) {
    }
}
