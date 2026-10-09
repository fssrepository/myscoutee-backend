package com.raxim.myscoutee.domain.events.dto;

import java.util.List;
import com.raxim.myscoutee.domain.events.api.EventHomeReads;

public record EventHomeDto(List<String> acceptedMemberUserIds, String startAtIso, String updatedDate, String createdDate, String endAtIso, String sourceId, String title, String status, String ownerUserId, String creatorUserId, List<String> admins, Integer acceptedMembers, Boolean isTrashed) implements EventHomeReads.Event {
    public EventHomeDto {
        if (acceptedMemberUserIds != null) acceptedMemberUserIds = java.util.Collections.unmodifiableList(new java.util.ArrayList<>(acceptedMemberUserIds));
        if (admins != null) admins = java.util.Collections.unmodifiableList(new java.util.ArrayList<>(admins));
    }
    public static EventHomeDto from(EventHomeReads.Event event) {
        return new EventHomeDto(event.getAcceptedMemberUserIds(), event.getStartAtIso(), event.getUpdatedDate(), event.getCreatedDate(), event.getEndAtIso(), event.getSourceId(), event.getTitle(), event.getStatus(), event.getOwnerUserId(), event.getCreatorUserId(), event.getAdmins(), event.getAcceptedMembers(), event.getIsTrashed());
    }
    @Override public List<String> getAcceptedMemberUserIds() { return acceptedMemberUserIds; }
    @Override public String getStartAtIso() { return startAtIso; }
    @Override public String getUpdatedDate() { return updatedDate; }
    @Override public String getCreatedDate() { return createdDate; }
    @Override public String getEndAtIso() { return endAtIso; }
    @Override public String getTitle() { return title; }
    @Override public String getSourceId() { return sourceId; }
    @Override public String getStatus() { return status; }
    @Override public String getOwnerUserId() { return ownerUserId; }
    @Override public String getCreatorUserId() { return creatorUserId; }
    @Override public List<String> getAdmins() { return admins; }
    @Override public Integer getAcceptedMembers() { return acceptedMembers; }
    @Override public Boolean getIsTrashed() { return isTrashed; }
}
