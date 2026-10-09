package com.raxim.myscoutee.domain.events.dto;

import java.util.List;
import com.raxim.myscoutee.domain.events.api.EventMembershipFacts;

public record EventMembershipFactsDto(String workspaceGroupId, String updatedDate,
        String creatorUserId, String status, List<String> admins) implements EventMembershipFacts.Event {
    public EventMembershipFactsDto {
        if (admins != null) admins = java.util.Collections.unmodifiableList(new java.util.ArrayList<>(admins));
    }
    public static EventMembershipFactsDto from(EventMembershipFacts.Event event) {
        return new EventMembershipFactsDto(event.getWorkspaceGroupId(), event.getUpdatedDate(), event.getCreatorUserId(), event.getStatus(), event.getAdmins());
    }
    @Override public String getWorkspaceGroupId() { return workspaceGroupId; }
    @Override public String getUpdatedDate() { return updatedDate; }
    @Override public String getCreatorUserId() { return creatorUserId; }
    @Override public String getStatus() { return status; }
    @Override public List<String> getAdmins() { return admins; }
}
