package com.raxim.myscoutee.domain.platform.dto;

import java.util.List;

/** Explicit bucket preserves the Dating group's null key across JSON. */
public record JobAudienceGroupDto(String groupId, List<String> userIds) {}
