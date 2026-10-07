package com.raxim.myscoutee.domain.accounts.dto;

import java.util.List;

public final class ExperienceDtos {
    private ExperienceDtos() {
    }

    public record ExperienceEntryDto(
            String id,
            String type,
            String title,
            String org,
            String city,
            String dateFrom,
            String dateTo,
            String description) {
    }

    public record UserExperiencesResponseDto(
            String userId,
            List<ExperienceEntryDto> entries) {
    }

    public record UserExperiencesSaveRequestDto(
            String userId,
            List<ExperienceEntryDto> entries) {
    }
}
