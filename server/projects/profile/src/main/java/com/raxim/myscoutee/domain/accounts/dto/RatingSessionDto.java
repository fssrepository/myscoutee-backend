package com.raxim.myscoutee.domain.accounts.dto;

import com.raxim.myscoutee.common.dto.SharedDtos.LocationCoordinatesDto;

/** One account read: selected identity, distance origin and existing game counter. */
public record RatingSessionDto(ProfileIdentityDto identity, LocationCoordinatesDto locationCoordinates, Integer gameCount) {}
