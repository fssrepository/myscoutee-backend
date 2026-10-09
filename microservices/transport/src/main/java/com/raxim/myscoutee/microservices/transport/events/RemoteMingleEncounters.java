package com.raxim.myscoutee.microservices.transport.events;

import com.raxim.myscoutee.domain.events.api.MingleEncounters;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Bounded scoped call to the existing owner; no automatic retries. */
public final class RemoteMingleEncounters extends RemoteReadTransport implements MingleEncounters {
    private final ObjectMapper mapper;
    public RemoteMingleEncounters(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public java.util.Optional<com.raxim.myscoutee.domain.events.dto.MingleEncounterDtos.SessionDto> findSession(String eventId) {
        var command = new MingleEncountersProtocol.Query(MingleEncountersProtocol.Scope.current(), eventId);
        if (!MingleEncountersProtocol.valid(command)) throw new IllegalArgumentException("Invalid mingle-encounters request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > MingleEncountersProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("mingle-encounters request exceeds byte limit");
        var result = ownerExchange(MingleEncountersProtocol.FIND, bytes, new TypeReference<MingleEncountersProtocol.Result>() {},
                "mingle-encounters.find", MingleEncountersProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.resolved()) && (v.value()==null || java.util.Objects.equals(eventId,v.value().eventId())));
        return java.util.Optional.ofNullable(result.value());
    }
    @Override public java.util.List<com.raxim.myscoutee.domain.events.dto.MingleEncounterDtos.RoundDto> completedRounds(java.util.Collection<String> eventIds) {
        var command = new MingleEncountersProtocol.Batch(MingleEncountersProtocol.Scope.current(), eventIds);
        if (!MingleEncountersProtocol.valid(command)) throw new IllegalArgumentException("Invalid mingle-encounters request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > MingleEncountersProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("mingle-encounters request exceeds byte limit");
        var result = ownerExchange(MingleEncountersProtocol.ROUNDS, bytes, new TypeReference<java.util.List<com.raxim.myscoutee.domain.events.dto.MingleEncounterDtos.RoundDto>>() {},
                "mingle-encounters.rounds", MingleEncountersProtocol.MAX_RESPONSE_BYTES, v -> true);
        return result;
    }
    @Override public boolean isCompleted(String eventId) {
        var command = new MingleEncountersProtocol.Query(MingleEncountersProtocol.Scope.current(), eventId);
        if (!MingleEncountersProtocol.valid(command)) throw new IllegalArgumentException("Invalid mingle-encounters request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > MingleEncountersProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("mingle-encounters request exceeds byte limit");
        var result = ownerExchange(MingleEncountersProtocol.COMPLETED, bytes, new TypeReference<MingleEncountersProtocol.Decision>() {},
                "mingle-encounters.completed", MingleEncountersProtocol.MAX_RESPONSE_BYTES, v -> v.value()!=null);
        return result.value();
    }
    @Override public java.util.List<com.raxim.myscoutee.domain.events.dto.MingleEncounterDtos.SessionDto> pendingPublication() {
        var command = new MingleEncountersProtocol.Query(MingleEncountersProtocol.Scope.current(), null);
        if (!MingleEncountersProtocol.valid(command)) throw new IllegalArgumentException("Invalid mingle-encounters request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > MingleEncountersProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("mingle-encounters request exceeds byte limit");
        var result = ownerExchange(MingleEncountersProtocol.PENDING, bytes, new TypeReference<java.util.List<com.raxim.myscoutee.domain.events.dto.MingleEncounterDtos.SessionDto>>() {},
                "mingle-encounters.pending", MingleEncountersProtocol.MAX_RESPONSE_BYTES, v -> true);
        return result;
    }
    @Override public void acknowledgePublication(Session session) {
        var command = new MingleEncountersProtocol.Ack(MingleEncountersProtocol.Scope.current(), com.raxim.myscoutee.domain.events.dto.MingleEncounterDtos.SessionDto.from(session));
        if (!MingleEncountersProtocol.valid(command)) throw new IllegalArgumentException("Invalid mingle-encounters request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > MingleEncountersProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("mingle-encounters request exceeds byte limit");
        var result = ownerExchange(MingleEncountersProtocol.ACK, bytes, new TypeReference<MingleEncountersProtocol.Receipt>() {},
                "mingle-encounters.ack", MingleEncountersProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.completed()));
    }
    private <T> T ownerExchange(String path, byte[] bytes, TypeReference<T> type, String operation, int limit,
            java.util.function.Predicate<T> valid) {
        try { return exchange(path, bytes, type, operation, limit, valid); }
        catch (RemoteReadException failure) {
            if (failure.status() >= 400 && failure.status() < 500 && "OWNER_REJECTED".equals(failure.remoteCode()))
                throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatusCode.valueOf(failure.status()));
            throw failure;
        }
    }

}
