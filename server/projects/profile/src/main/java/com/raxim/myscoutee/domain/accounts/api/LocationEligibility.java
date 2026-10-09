package com.raxim.myscoutee.domain.accounts.api;

import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserLocationEligibilityResponseDto;

/** Existing account login-region decision, using the owner's active configuration. */
public interface LocationEligibility {
    UserLocationEligibilityResponseDto queryLocationEligibility(Double latitude, Double longitude);
}
