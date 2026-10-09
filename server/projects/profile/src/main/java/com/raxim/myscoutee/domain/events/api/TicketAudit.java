package com.raxim.myscoutee.domain.events.api;
public interface TicketAudit {
    void recordReplay(ParticipationTickets.Ticket ticket, String eventSourceId, String actor, java.time.Instant at);
}
