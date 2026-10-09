package com.raxim.myscoutee.domain.accounts.dto;

import com.raxim.myscoutee.common.dto.SharedDtos.LocationCoordinatesDto;

/** Rating-specific facts; visibility is evaluated by the existing account policy. */
public record RatingProfileDto(String id, String userId, String workspaceGroupId,
        LocationCoordinatesDto locationCoordinates, boolean activityRateVisible) {}
