package com.raxim.myscoutee.profile.data.dto.navigator;

import java.util.List;

import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.UserDto;
import com.raxim.myscoutee.profile.data.dto.experience.ExperienceDtos.ExperienceEntryDto;

public final class NavigatorContactsDtos {
    private NavigatorContactsDtos() {
    }

    public record NavigatorContactMethodDto(
            String id,
            String type,
            String value) {
    }

    public record NavigatorContactDto(
            String id,
            String userId,
            String name,
            String initials,
            String gender,
            String city,
            String avatarUrl,
            String headline,
            String createdAtIso,
            String updatedAtIso,
            List<NavigatorContactMethodDto> methods) {
    }

    public record ContactChatAccessDto(String id, String requestedBy, String status,
            String requestedAtIso, String decidedAtIso, Long version, NavigatorContactDto contact) {}

    public record ContactChatAccessSnapshot(List<ContactChatAccessDto> records, int pendingCount, List<NavigatorContactDto> contacts) {}

    public record ContactChatAccessCommand(String action, Long version) {}

    public record NavigatorContactsSaveRequestDto(
            String userId,
            List<NavigatorContactDto> contacts) {
    }

    public record NavigatorContactDeleteRequestDto(
            String userId) {
    }

    public record NavigatorContactProfileDto(
            UserDto user,
            List<ExperienceEntryDto> experiences,
            List<String> hiddenFields) {
    }
}
