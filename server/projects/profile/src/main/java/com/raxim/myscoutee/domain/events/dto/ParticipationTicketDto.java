package com.raxim.myscoutee.domain.events.dto;

import com.raxim.myscoutee.domain.events.api.ParticipationTickets;

public record ParticipationTicketDto(String id, String code, String eventId, String holderUserId,
        String status, String issuedAtIso, String usedAtIso, String usedByUserId) implements ParticipationTickets.Ticket {
    public static ParticipationTicketDto from(ParticipationTickets.Ticket value) {
        return value == null ? null : new ParticipationTicketDto(value.getId(), value.getCode(), value.getEventId(),
                value.getHolderUserId(), value.getStatus(), value.getIssuedAtIso(), value.getUsedAtIso(), value.getUsedByUserId());
    }
    @Override public String getId() { return id; }
    @Override public String getCode() { return code; }
    @Override public String getEventId() { return eventId; }
    @Override public String getHolderUserId() { return holderUserId; }
    @Override public String getStatus() { return status; }
    @Override public String getIssuedAtIso() { return issuedAtIso; }
    @Override public String getUsedAtIso() { return usedAtIso; }
    @Override public String getUsedByUserId() { return usedByUserId; }
    public record SnapshotDto(EventOwnershipDto event, ParticipationTicketDto credential) implements ParticipationTickets.Snapshot {
        public static SnapshotDto from(ParticipationTickets.Snapshot value) {
            return new SnapshotDto(value.event() == null ? null : EventOwnershipDto.from(value.event()), ParticipationTicketDto.from(value.credential()));
        }
    }
    public record CheckInDto(
            @com.fasterxml.jackson.annotation.JsonProperty(required = true)
            @com.fasterxml.jackson.annotation.JsonSetter(nulls = com.fasterxml.jackson.annotation.Nulls.FAIL) boolean valid,
            String reason, ParticipationTicketDto ticket, EventOwnershipDto event) implements ParticipationTickets.CheckIn {
        public static CheckInDto from(ParticipationTickets.CheckIn value) {
            return value == null ? null : new CheckInDto(value.valid(), value.reason(), ParticipationTicketDto.from(value.ticket()),
                    value.event() == null ? null : EventOwnershipDto.from(value.event()));
        }
    }
}
