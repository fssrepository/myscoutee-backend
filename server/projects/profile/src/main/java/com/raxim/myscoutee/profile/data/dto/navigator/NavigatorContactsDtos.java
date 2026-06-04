package com.raxim.myscoutee.profile.data.dto.navigator;

import java.util.List;

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

    public record NavigatorContactsSaveRequestDto(
            String userId,
            List<NavigatorContactDto> contacts) {
    }

    public record NavigatorContactDeleteRequestDto(
            String userId) {
    }
}
