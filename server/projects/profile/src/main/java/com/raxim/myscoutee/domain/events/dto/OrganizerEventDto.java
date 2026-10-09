package com.raxim.myscoutee.domain.events.dto;

import com.raxim.myscoutee.domain.events.api.OrganizerEventReads;

/** Only the event facts consumed by following eligibility and expiry calculation. */
public record OrganizerEventDto(
        String sourceId,
        String creatorUserId,
        String status,
        Boolean published,
        Boolean generated,
        Boolean isTrashed,
        String eventType,
        String parentEventId,
        String visibility,
        String startAtIso,
        String endAtIso) implements OrganizerEventReads.Event {
    public static OrganizerEventDto from(OrganizerEventReads.Event event) {
        return new OrganizerEventDto(
                event.getSourceId(),
                event.getCreatorUserId(),
                event.getStatus(),
                event.getPublished(),
                event.getGenerated(),
                event.getIsTrashed(),
                event.getEventType(),
                event.getParentEventId(),
                event.getVisibility(),
                event.getStartAtIso(),
                event.getEndAtIso());
    }
    @Override public String getSourceId() { return sourceId; }
    @Override public String getCreatorUserId() { return creatorUserId; }
    @Override public String getStatus() { return status; }
    @Override public Boolean getPublished() { return published; }
    @Override public Boolean getGenerated() { return generated; }
    @Override public Boolean getIsTrashed() { return isTrashed; }
    @Override public String getEventType() { return eventType; }
    @Override public String getParentEventId() { return parentEventId; }
    @Override public String getVisibility() { return visibility; }
    @Override public String getStartAtIso() { return startAtIso; }
    @Override public String getEndAtIso() { return endAtIso; }
}
