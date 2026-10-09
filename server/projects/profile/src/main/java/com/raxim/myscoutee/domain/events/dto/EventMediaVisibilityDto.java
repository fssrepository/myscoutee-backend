package com.raxim.myscoutee.domain.events.dto;

import java.util.List;

/** Existing event projection used by media policy, without the event document. */
public record EventMediaVisibilityDto(String creatorUserId, String organizerUserId,
        String moderationStatus, String visibility, String status, List<?> admins,
        List<?> acceptedMemberUserIds, List<?> invitedMemberUserIds,
        List<?> pendingRequestMemberUserIds) {}
