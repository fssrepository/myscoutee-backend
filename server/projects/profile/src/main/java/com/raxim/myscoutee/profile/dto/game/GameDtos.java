package com.raxim.myscoutee.profile.dto.game;

import java.util.List;

import com.raxim.myscoutee.profile.dto.auth.AuthDtos.UserGameFilterPreferencesDto;

public final class GameDtos {
    private GameDtos() {
    }

    public record UserGameCardsQueryRequestDto(
            UserGameFilterPreferencesDto filterPreferences,
            String cursor,
            Integer pageSize) {
    }

    public record UserGameCardsQueryResponseDto(
            Integer filterCount,
            List<String> cardUserIds,
            String nextCursor) {
    }
}
