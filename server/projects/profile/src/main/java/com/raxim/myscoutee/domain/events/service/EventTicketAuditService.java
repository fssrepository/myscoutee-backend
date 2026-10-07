package com.raxim.myscoutee.domain.events.service;

import java.time.Instant;

import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.domain.events.document.ActivityEvent;
import com.raxim.myscoutee.domain.events.document.EventTicket;
import com.raxim.myscoutee.domain.events.document.EventTicketAudit;
import com.raxim.myscoutee.domain.events.repository.EventTicketAuditRepository;

@Service
public class EventTicketAuditService implements com.raxim.myscoutee.domain.events.api.TicketAudit {
    private final EventTicketAuditRepository repository;

    public EventTicketAuditService(EventTicketAuditRepository repository) {
        this.repository = repository;
    }

    public EventTicketAudit recordAlreadyUsedAttempt(
            com.raxim.myscoutee.domain.events.api.ParticipationTickets.Ticket ticket,
            com.raxim.myscoutee.domain.events.api.EventOwnership.Event event,
            String actorUserId,
            Instant attemptedAt) {
        String ticketId = text(ticket == null ? null : ticket.getId());
        String holderUserId = text(ticket == null ? null : ticket.getHolderUserId());
        String normalizedActorUserId = text(actorUserId);
        if (!StringUtils.hasText(ticketId)
                || !StringUtils.hasText(holderUserId)
                || !StringUtils.hasText(normalizedActorUserId)) {
            return null;
        }
        String nowIso = (attemptedAt == null ? Instant.now() : attemptedAt).toString();
        EventTicketAudit audit = new EventTicketAudit();
        audit.setId(new ObjectId().toHexString());
        audit.setAction("check-in-replay");
        audit.setResult("already_used");
        audit.setTicketId(ticketId);
        audit.setEventId(firstText(
                event == null ? null : event.getSourceId(),
                ticket.getEventId()));
        audit.setHolderUserId(holderUserId);
        audit.setActorUserId(normalizedActorUserId);
        audit.setAttemptedAtIso(nowIso);
        audit.setOriginalUsedAtIso(text(ticket.getUsedAtIso()));
        audit.setOriginalUsedByUserId(text(ticket.getUsedByUserId()));
        audit.setCreatedDate(nowIso);
        return repository.save(audit);
    }

    private String firstText(String... values) {
        for (String value : values == null ? new String[0] : values) {
            String normalized = text(value);
            if (StringUtils.hasText(normalized)) {
                return normalized;
            }
        }
        return "";
    }

    private String text(String value) {
        return value == null ? "" : value.trim();
    }
    @Override public void recordReplay(com.raxim.myscoutee.domain.events.api.ParticipationTickets.Ticket ticket,
            com.raxim.myscoutee.domain.events.api.EventOwnership.Event event, String actor, Instant at) {
        recordAlreadyUsedAttempt(ticket, event, actor, at);
    }
}
