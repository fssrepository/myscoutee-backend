package com.raxim.myscoutee.profile.data.dto.game;

import java.util.List;

import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.UserDto;
import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.UserGameFilterPreferencesDto;

public final class GameDtos {
    private GameDtos() {
    }

    public record UserGameCardsQueryRequestDto(
            String userId,
            String mode,
            String leftQuery,
            String rightQuery,
            UserGameFilterPreferencesDto filterPreferences,
            String cursor,
            Integer pageSize) {
    }

    public record UserGameSocialCardDto(
            String id,
            String userId,
            String secondaryUserId,
            String socialContext,
            String bridgeUserId,
            Integer bridgeCount,
            String eventName) {
    }

    public record UserGameCardsQueryResponseDto(
            Integer filterCount,
            List<String> cardUserIds,
            String nextCursor,
            List<UserDto> users,
            List<UserGameSocialCardDto> socialCards) {
    }
}
