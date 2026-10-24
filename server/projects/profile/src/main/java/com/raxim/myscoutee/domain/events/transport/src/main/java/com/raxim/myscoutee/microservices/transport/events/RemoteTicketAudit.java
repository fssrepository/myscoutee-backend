package com.raxim.myscoutee.microservices.transport.events;

import com.raxim.myscoutee.domain.events.api.TicketAudit;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Bounded scoped call to the existing owner; no automatic retries. */
public final class RemoteTicketAudit extends RemoteReadTransport implements TicketAudit {
    private final ObjectMapper mapper;
    public RemoteTicketAudit(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public void recordReplay(com.raxim.myscoutee.domain.events.api.ParticipationTickets.Ticket ticket, String eventSourceId, String actor, java.time.Instant at) {
        var command = new TicketAuditProtocol.Replay(TicketAuditProtocol.Scope.current(), com.raxim.myscoutee.domain.events.dto.ParticipationTicketDto.from(ticket), eventSourceId, actor, at);
        if (!TicketAuditProtocol.valid(command)) throw new IllegalArgumentException("Invalid ticket-audit request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > TicketAuditProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("ticket-audit request exceeds byte limit");
        var result = exchange(TicketAuditProtocol.REPLAY, bytes, new TypeReference<TicketAuditProtocol.Receipt>() {},
                "ticket-audit.replay", TicketAuditProtocol.MAX_RESPONSE_BYTES, value -> Boolean.TRUE.equals(value.completed()));
    }
}
