package com.raxim.myscoutee.profile.data.dto.rates;

import java.util.List;

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
            Integer scoreGiven,
            Integer scoreReceived,
            String eventName,
            String happenedAt,
            Integer distanceMetersExact) {
    }

    public record ActivityRatePageResponseDto(
            List<RateMenuItemDto> items,
            Integer total,
            String nextCursor,
            List<UserDto> users) {
    }

    public record UserRateRecordDto(
            String id,
            String fromUserId,
            String toUserId,
            Integer rate,
            String mode,
            String createdAtIso,
            String updatedAtIso,
            String ownerUserId,
            String displayId,
            String displayDirection,
            String socialContext,
            String bridgeUserId,
            Integer bridgeCount,
            Integer scoreGiven,
            Integer scoreReceived,
            String eventName,
            String happenedAtIso,
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
