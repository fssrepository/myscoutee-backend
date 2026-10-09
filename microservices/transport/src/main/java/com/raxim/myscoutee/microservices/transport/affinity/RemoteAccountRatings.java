package com.raxim.myscoutee.microservices.transport.affinity;

import com.raxim.myscoutee.domain.affinity.api.AccountRatings;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Bounded scoped call to the existing owner; no automatic retries. */
public final class RemoteAccountRatings extends RemoteReadTransport implements AccountRatings {
    private final ObjectMapper mapper;
    public RemoteAccountRatings(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public java.util.Map<String, Double> scoresGiven(String profileId) {
        var command = new AccountRatingsProtocol.Query(AccountRatingsProtocol.Scope.current(), profileId);
        if (!AccountRatingsProtocol.valid(command)) throw new IllegalArgumentException("Invalid account-ratings request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > AccountRatingsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("account-ratings request exceeds byte limit");
        var result = ownerExchange(AccountRatingsProtocol.SCORES, bytes, new TypeReference<java.util.Map<String, Double>>() {},
                "account-ratings.scores", AccountRatingsProtocol.MAX_RESPONSE_BYTES, v -> true);
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
