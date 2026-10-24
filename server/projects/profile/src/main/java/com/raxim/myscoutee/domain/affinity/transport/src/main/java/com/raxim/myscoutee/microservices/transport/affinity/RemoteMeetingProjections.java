package com.raxim.myscoutee.microservices.transport.affinity;

import com.raxim.myscoutee.domain.affinity.api.MeetingProjections;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Bounded scoped call to the existing owner; no automatic retries. */
public final class RemoteMeetingProjections extends RemoteReadTransport implements MeetingProjections {
    private final ObjectMapper mapper;
    public RemoteMeetingProjections(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public void projectRecordedMeetings(java.util.Collection<String> ids) {
        var command = new MeetingProjectionsProtocol.Query(MeetingProjectionsProtocol.Scope.current(), ids);
        if (!MeetingProjectionsProtocol.valid(command)) throw new IllegalArgumentException("Invalid meeting-projections request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > MeetingProjectionsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("meeting-projections request exceeds byte limit");
        var result = ownerExchange(MeetingProjectionsProtocol.PROJECT, bytes, new TypeReference<MeetingProjectionsProtocol.Receipt>() {},
                "meeting-projections.project", MeetingProjectionsProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.completed()));
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
