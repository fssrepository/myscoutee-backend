package com.raxim.myscoutee.domain.events.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Instant;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import com.raxim.myscoutee.domain.events.document.ActivityEvent;
import com.raxim.myscoutee.domain.events.document.EventTicket;
import com.raxim.myscoutee.domain.events.document.EventTicketAudit;
import com.raxim.myscoutee.domain.events.repository.EventTicketAuditRepository;

@org.junit.jupiter.api.Tag("standard")
class EventTicketAuditServiceTest {
    @Test
    void alreadyUsedAttemptPersistsActorAndCanonicalUseWithoutQrCode() {
        EventTicketAuditRepository repository = mock(EventTicketAuditRepository.class);
        when(repository.save(any(EventTicketAudit.class))).thenAnswer(invocation -> invocation.getArgument(0));
        EventTicket ticket = new EventTicket();
        ticket.setId("ticket-1");
        ticket.setCode("secret-qr-code");
        ticket.setEventId("event-1");
        ticket.setHolderUserId("holder-1");
        ticket.setUsedAtIso("2026-08-06T06:59:21Z");
        ticket.setUsedByUserId("admin-1");
        ActivityEvent event = new ActivityEvent();
        event.setSourceId("event-1");
        Instant attemptedAt = Instant.parse("2026-08-06T07:15:00Z");

        new EventTicketAuditService(repository).recordAlreadyUsedAttempt(
                ticket,
                event,
                "scanner-2",
                attemptedAt);

        ArgumentCaptor<EventTicketAudit> audit = ArgumentCaptor.forClass(EventTicketAudit.class);
        verify(repository).save(audit.capture());
        assertThat(audit.getValue().getAction()).isEqualTo("check-in-replay");
        assertThat(audit.getValue().getResult()).isEqualTo("already_used");
        assertThat(audit.getValue().getTicketId()).isEqualTo("ticket-1");
        assertThat(audit.getValue().getHolderUserId()).isEqualTo("holder-1");
        assertThat(audit.getValue().getActorUserId()).isEqualTo("scanner-2");
        assertThat(audit.getValue().getAttemptedAtIso()).isEqualTo(attemptedAt.toString());
        assertThat(audit.getValue().getOriginalUsedAtIso()).isEqualTo("2026-08-06T06:59:21Z");
        assertThat(audit.getValue().getOriginalUsedByUserId()).isEqualTo("admin-1");
        assertThat(audit.getValue().toString()).doesNotContain("secret-qr-code");
    }
}
