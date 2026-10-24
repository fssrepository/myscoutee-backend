package com.raxim.myscoutee.microservices.transport.payments;

import com.raxim.myscoutee.domain.payments.api.CheckoutResults;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Bounded scoped call to the existing owner; no automatic retries. */
public final class RemoteCheckoutResults extends RemoteReadTransport implements CheckoutResults {
    private final ObjectMapper mapper;
    public RemoteCheckoutResults(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public java.util.Map<String, String> loadResultStatesByEvent(String userId, java.util.Collection<String> sourceIds) {
        var command = new CheckoutResultsProtocol.Query(CheckoutResultsProtocol.Scope.current(), userId, sourceIds);
        if (!CheckoutResultsProtocol.valid(command)) throw new IllegalArgumentException("Invalid checkout-results request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > CheckoutResultsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("checkout-results request exceeds byte limit");
        var result = exchange(CheckoutResultsProtocol.BATCH, bytes, new TypeReference<java.util.Map<String, String>>() {},
                "checkout-results.batch", CheckoutResultsProtocol.MAX_RESPONSE_BYTES, value -> value.keySet().stream().allMatch(sourceIds::contains));
        return result;
    }
}
