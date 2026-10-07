package com.raxim.myscoutee.domain.events.api;
public interface TicketAudit {
    void recordReplay(ParticipationTickets.Ticket ticket, EventOwnership.Event event, String actor, java.time.Instant at);
}
