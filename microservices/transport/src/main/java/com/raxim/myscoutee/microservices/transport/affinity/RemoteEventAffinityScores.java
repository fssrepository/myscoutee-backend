package com.raxim.myscoutee.microservices.transport.affinity;

import com.raxim.myscoutee.domain.affinity.api.EventAffinityScores;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Bounded scoped call to the existing owner; no automatic retries. */
public final class RemoteEventAffinityScores extends RemoteReadTransport implements EventAffinityScores {
    private final ObjectMapper mapper;
    public RemoteEventAffinityScores(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public com.raxim.myscoutee.domain.affinity.dto.EventAffinityScoresDto calculate(com.raxim.myscoutee.domain.events.api.EventOwnership.Event event, java.util.Collection<String> participantIds) {
        var command = new EventAffinityScoresProtocol.Query(EventAffinityScoresProtocol.Scope.current(), event == null ? null : com.raxim.myscoutee.domain.events.dto.EventOwnershipDto.from(event), participantIds);
        if (!EventAffinityScoresProtocol.valid(command)) throw new IllegalArgumentException("Invalid event-affinity-scores request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > EventAffinityScoresProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("event-affinity-scores request exceeds byte limit");
        var result = exchange(EventAffinityScoresProtocol.CALCULATE, bytes, new TypeReference<com.raxim.myscoutee.domain.affinity.dto.EventAffinityScoresDto>() {},
                "event-affinity-scores.calculate", EventAffinityScoresProtocol.MAX_RESPONSE_BYTES, value -> Double.isFinite(value.affinity()) && value.affinity() >= 0 && Double.isFinite(value.boost()) && value.boost() >= 0);
        return result;
    }
}
