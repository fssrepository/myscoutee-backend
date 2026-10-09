package com.raxim.myscoutee.microservices.transport.events;

import com.raxim.myscoutee.domain.events.api.ParticipationTickets;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Bounded scoped call to the existing owner; no automatic retries. */
public final class RemoteParticipationTickets extends RemoteReadTransport implements ParticipationTickets {
    private final ObjectMapper mapper;
    public RemoteParticipationTickets(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public java.util.List<com.raxim.myscoutee.domain.events.dto.ParticipationTicketDto.SnapshotDto> queryTicketSnapshotRecordsForUser(String id) {
        var command = new ParticipationTicketsProtocol.User(ParticipationTicketsProtocol.Scope.current(), id);
        if (!ParticipationTicketsProtocol.valid(command)) throw new IllegalArgumentException("Invalid participation-tickets request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > ParticipationTicketsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("participation-tickets request exceeds byte limit");
        var result = exchange(ParticipationTicketsProtocol.SINGLE, bytes, new TypeReference<java.util.List<com.raxim.myscoutee.domain.events.dto.ParticipationTicketDto.SnapshotDto>>() {},
                "participation-tickets.single", ParticipationTicketsProtocol.MAX_RESPONSE_BYTES, value -> value.stream().allMatch(java.util.Objects::nonNull));
        return result;
    }
    @Override public java.util.List<com.raxim.myscoutee.domain.events.dto.ParticipationTicketDto.SnapshotDto> queryTicketSnapshotRecordsForUsers(java.util.Collection<String> ids) {
        var command = new ParticipationTicketsProtocol.Users(ParticipationTicketsProtocol.Scope.current(), ids);
        if (!ParticipationTicketsProtocol.valid(command)) throw new IllegalArgumentException("Invalid participation-tickets request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > ParticipationTicketsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("participation-tickets request exceeds byte limit");
        var result = exchange(ParticipationTicketsProtocol.BATCH, bytes, new TypeReference<java.util.List<com.raxim.myscoutee.domain.events.dto.ParticipationTicketDto.SnapshotDto>>() {},
                "participation-tickets.batch", ParticipationTicketsProtocol.MAX_RESPONSE_BYTES, value -> value.stream().allMatch(java.util.Objects::nonNull));
        return result;
    }
    @Override public java.util.List<com.raxim.myscoutee.domain.events.dto.EventOwnershipDto> queryTicketRecordsForUser(String userId) {
        var command = new ParticipationTicketsProtocol.User(ParticipationTicketsProtocol.Scope.current(), userId);
        if (!ParticipationTicketsProtocol.valid(command)) throw new IllegalArgumentException("Invalid participation-tickets request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > ParticipationTicketsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("participation-tickets request exceeds byte limit");
        var result = exchange(ParticipationTicketsProtocol.RECORDS, bytes, new TypeReference<java.util.List<com.raxim.myscoutee.domain.events.dto.EventOwnershipDto>>() {},
                "participation-tickets.records", ParticipationTicketsProtocol.MAX_RESPONSE_BYTES, value -> value.stream().allMatch(java.util.Objects::nonNull));
        return result;
    }
    @Override public com.raxim.myscoutee.domain.events.dto.ParticipationTicketDto.CheckInDto checkIn(String code, String scannerUserId, java.time.Instant now) {
        var command = new ParticipationTicketsProtocol.Check(ParticipationTicketsProtocol.Scope.current(), code, scannerUserId, now);
        if (!ParticipationTicketsProtocol.valid(command)) throw new IllegalArgumentException("Invalid participation-tickets request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > ParticipationTicketsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("participation-tickets request exceeds byte limit");
        var result = exchange(ParticipationTicketsProtocol.CHECK, bytes, new TypeReference<ParticipationTicketsProtocol.CheckResult>() {},
                "participation-tickets.check", ParticipationTicketsProtocol.MAX_RESPONSE_BYTES, value -> Boolean.TRUE.equals(value.resolved()));
        return result.value();
    }
}
