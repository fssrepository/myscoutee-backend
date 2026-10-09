package com.raxim.myscoutee.microservices.transport.integrations;

import com.raxim.myscoutee.domain.integrations.api.ParticipantStatistics;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Bounded scoped call to the existing owner; no automatic retries. */
public final class RemoteParticipantStatistics extends RemoteReadTransport implements ParticipantStatistics {
    private final ObjectMapper mapper;
    public RemoteParticipantStatistics(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public com.raxim.myscoutee.domain.integrations.dto.IntegrationDtos.IntegrationParticipantSummaryDto participantSummary(String owner) {
        var command = new ParticipantStatisticsProtocol.Query(ParticipantStatisticsProtocol.Scope.current(), owner);
        if (!ParticipantStatisticsProtocol.valid(command)) throw new IllegalArgumentException("Invalid participant-statistics request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > ParticipantStatisticsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("participant-statistics request exceeds byte limit");
        var result = exchange(ParticipantStatisticsProtocol.SUMMARY, bytes, new TypeReference<com.raxim.myscoutee.domain.integrations.dto.IntegrationDtos.IntegrationParticipantSummaryDto>() {},
                "participant-statistics.summary", ParticipantStatisticsProtocol.MAX_RESPONSE_BYTES, value -> value.registered() >= 0 && value.imported() >= 0);
        return result;
    }
}
