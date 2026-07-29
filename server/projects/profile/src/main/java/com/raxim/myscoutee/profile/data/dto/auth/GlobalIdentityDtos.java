package com.raxim.myscoutee.profile.data.dto.auth;

public final class GlobalIdentityDtos {
    private GlobalIdentityDtos() {
    }

    public record GlobalIdentityStatusDto(
            String state,
            boolean linked,
            String consentVersion,
            Long keyVersion,
            String suite,
            String activeFromPeriod,
            String inactiveFromPeriod,
            String verifiedAt,
            Boolean rotationRequired,
            boolean syncAvailable,
            String updatedAt) {
    }

    public record GlobalIdentityConsentRequestDto(Boolean accepted) {
    }

    public record GlobalIdentityUnlinkRequestDto(Boolean confirmed) {
    }
}
