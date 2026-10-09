package com.raxim.myscoutee.domain.accounts.dto;

import java.util.List;
import com.raxim.myscoutee.domain.events.api.EventOwnership.Event;

/** Only event owners consumed by the existing feedback counter transition. */
public record FeedbackOwnersDto(String ownerUserId, String creatorUserId, List<String> admins) {
    public FeedbackOwnersDto { if (admins != null) admins = java.util.Collections.unmodifiableList(new java.util.ArrayList<>(admins)); }
    public static FeedbackOwnersDto from(Event event) {
        return event == null ? null : new FeedbackOwnersDto(event.getOwnerUserId(), event.getCreatorUserId(), event.getAdmins());
    }
}
