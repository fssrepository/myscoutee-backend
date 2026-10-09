package com.raxim.myscoutee.domain.events.dto;

import com.raxim.myscoutee.domain.events.api.EventChangeView;

public record EventChangeDto(String id, String sourceId, String ownerUserId, Boolean isAdmin, String title, String status, String startAtIso, String endAtIso, String sourceLink, String mode, com.raxim.myscoutee.common.dto.SharedDtos.MingleConfigurationDto mingleConfiguration, Integer acceptedMembers, Integer pendingMembers) implements EventChangeView {
    public static EventChangeDto from(EventChangeView value) {
        return value == null ? null : new EventChangeDto(value.getId(), value.getSourceId(), value.getOwnerUserId(), value.getIsAdmin(), value.getTitle(), value.getStatus(), value.getStartAtIso(), value.getEndAtIso(), value.getSourceLink(), value.getMode(), value.getMingleConfiguration(), value.getAcceptedMembers(), value.getPendingMembers());
    }
    @Override public String getId() { return id; }
    @Override public String getSourceId() { return sourceId; }
    @Override public String getOwnerUserId() { return ownerUserId; }
    @Override public Boolean getIsAdmin() { return isAdmin; }
    @Override public String getTitle() { return title; }
    @Override public String getStatus() { return status; }
    @Override public String getStartAtIso() { return startAtIso; }
    @Override public String getEndAtIso() { return endAtIso; }
    @Override public String getSourceLink() { return sourceLink; }
    @Override public String getMode() { return mode; }
    @Override public com.raxim.myscoutee.common.dto.SharedDtos.MingleConfigurationDto getMingleConfiguration() { return mingleConfiguration; }
    @Override public Integer getAcceptedMembers() { return acceptedMembers; }
    @Override public Integer getPendingMembers() { return pendingMembers; }
}
