package com.raxim.myscoutee.microservices.transport.affinity;

import com.raxim.myscoutee.domain.affinity.api.RatingPageReads;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Bounded scoped call to the existing owner; no automatic retries. */
public final class RemoteRatingPageReads extends RemoteReadTransport implements RatingPageReads {
    private final ObjectMapper mapper;
    private final com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Signer signer;
    public RemoteRatingPageReads(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics, com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Signer signer) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper; this.signer = signer;
    }
    @Override public com.raxim.myscoutee.domain.affinity.dto.RatesDtos.ActivityRatePageResponseDto queryActivityRatePage(String userId, String mode, String direction, String sort, String sortDirection, String secondary, boolean badge, String cursor, Integer limit, String rangeStart, String rangeEnd, String campaignId) {
        var command = new RatingPageReadsProtocol.Query(RatingPageReadsProtocol.Scope.current(), userId, mode, direction, sort, sortDirection, secondary, badge, cursor, limit, rangeStart, rangeEnd, campaignId);
        if (!RatingPageReadsProtocol.valid(command)) throw new IllegalArgumentException("Invalid rating-page-reads request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > RatingPageReadsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("rating-page-reads request exceeds byte limit");
        var result = ownerExchange(RatingPageReadsProtocol.PAGE, bytes, new TypeReference<com.raxim.myscoutee.domain.affinity.dto.RatesDtos.ActivityRatePageResponseDto>() {},
                "rating-page-reads.page", RatingPageReadsProtocol.MAX_RESPONSE_BYTES, v -> true);
        return result;
    }
    private <T> T ownerExchange(String path, byte[] bytes, TypeReference<T> type, String operation, int limit,
            java.util.function.Predicate<T> valid) {
        try { return exchangeAuthorized(path, bytes, type, operation, limit, valid,
                    java.util.Map.of(com.raxim.myscoutee.microservices.transport.security.ActorDelegation.HEADER,
                            signer.issueForCurrent(RatingPageReadsProtocol.AUDIENCE, "POST", path, bytes))); }
        catch (RemoteReadException failure) {
            if (failure.status() >= 400 && failure.status() < 500 && "OWNER_REJECTED".equals(failure.remoteCode()))
                throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatusCode.valueOf(failure.status()));
            throw failure;
        }
    }

}
