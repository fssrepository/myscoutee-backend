package com.raxim.myscoutee.domain.accounts.dto;

import java.util.List;

import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserDto;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserGameFilterPreferencesDto;

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
            Integer pageSize,
            List<String> excludedCardUserIds,
            List<String> excludedSocialCardIds) {
        public UserGameCardsQueryRequestDto(
                String userId,
                String mode,
                String leftQuery,
                String rightQuery,
                UserGameFilterPreferencesDto filterPreferences,
                String cursor,
                Integer pageSize) {
            this(
                    userId,
                    mode,
                    leftQuery,
                    rightQuery,
                    filterPreferences,
                    cursor,
                    pageSize,
                    List.of(),
                    List.of());
        }
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
