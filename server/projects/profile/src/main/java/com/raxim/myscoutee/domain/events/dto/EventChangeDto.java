package com.raxim.myscoutee.domain.events.dto;

import com.raxim.myscoutee.domain.events.api.EventChangeView;

public record EventChangeDto(String id, String sourceId, String ownerUserId, Boolean isAdmin, String title, String status, String startAtIso, String endAtIso, String sourceLink, String mode, com.raxim.myscoutee.common.dto.SharedDtos.MingleConfigurationDto mingleConfiguration, Integer acceptedMembers, Integer pendingMembers) implements EventChangeView.RecordFields {
    public static EventChangeDto from(EventChangeView value) {
        return value == null ? null : new EventChangeDto(value.getId(), value.getSourceId(), value.getOwnerUserId(), value.getIsAdmin(), value.getTitle(), value.getStatus(), value.getStartAtIso(), value.getEndAtIso(), value.getSourceLink(), value.getMode(), value.getMingleConfiguration(), value.getAcceptedMembers(), value.getPendingMembers());
    }
}
