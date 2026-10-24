package com.raxim.myscoutee.microservices.transport.payments;

import com.raxim.myscoutee.domain.payments.api.Affiliates;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Bounded scoped call to the existing owner; no automatic retries. */
public final class RemoteAffiliates extends RemoteReadTransport implements Affiliates {
    private final ObjectMapper mapper;
    public RemoteAffiliates(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public String link(String owner) {
        var command = new AffiliatesProtocol.Query(AffiliatesProtocol.Scope.current(), owner);
        if (!AffiliatesProtocol.valid(command)) throw new IllegalArgumentException("Invalid affiliates request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > AffiliatesProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("affiliates request exceeds byte limit");
        var result = ownerExchange(AffiliatesProtocol.LINK, bytes, new TypeReference<AffiliatesProtocol.Link>() {},
                "affiliates.link", AffiliatesProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.resolved()));
        return result.value();
    }
    @Override public com.raxim.myscoutee.domain.integrations.dto.IntegrationDtos.AffiliateSummaryDto summary(String owner) {
        var command = new AffiliatesProtocol.Query(AffiliatesProtocol.Scope.current(), owner);
        if (!AffiliatesProtocol.valid(command)) throw new IllegalArgumentException("Invalid affiliates request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > AffiliatesProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("affiliates request exceeds byte limit");
        var result = ownerExchange(AffiliatesProtocol.SUMMARY, bytes, new TypeReference<com.raxim.myscoutee.domain.integrations.dto.IntegrationDtos.AffiliateSummaryDto>() {},
                "affiliates.summary", AffiliatesProtocol.MAX_RESPONSE_BYTES, v -> true);
        return result;
    }
    @Override public com.raxim.myscoutee.domain.integrations.dto.IntegrationDtos.IntegrationParticipantSummaryDto participantSummary(String owner) {
        var command = new AffiliatesProtocol.Query(AffiliatesProtocol.Scope.current(), owner);
        if (!AffiliatesProtocol.valid(command)) throw new IllegalArgumentException("Invalid affiliates request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > AffiliatesProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("affiliates request exceeds byte limit");
        var result = ownerExchange(AffiliatesProtocol.PARTICIPANTS, bytes, new TypeReference<com.raxim.myscoutee.domain.integrations.dto.IntegrationDtos.IntegrationParticipantSummaryDto>() {},
                "affiliates.participants", AffiliatesProtocol.MAX_RESPONSE_BYTES, v -> true);
        return result;
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
