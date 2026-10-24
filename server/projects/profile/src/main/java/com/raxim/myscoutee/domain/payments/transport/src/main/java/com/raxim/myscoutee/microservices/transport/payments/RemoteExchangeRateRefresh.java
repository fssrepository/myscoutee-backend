package com.raxim.myscoutee.microservices.transport.payments;

import java.net.URI;
import java.time.Duration;
import java.time.Instant;
import com.raxim.myscoutee.domain.payments.api.ExchangeRateRefresh;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Existing worker owns both refresh and final job status; a lost reply is never retried here. */
public final class RemoteExchangeRateRefresh extends RemoteReadTransport implements ExchangeRateRefresh {
    private final ObjectMapper mapper;
    public RemoteExchangeRateRefresh(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics, Duration.ofMinutes(15)); this.mapper = mapper;
    }
    @Override public void run(String actor, Instant startedAt) {
        var command = ExchangeRateRefreshProtocol.Command.current(actor, startedAt);
        if (!ExchangeRateRefreshProtocol.valid(command)) throw new IllegalArgumentException("Invalid exchange-rate refresh request");
        exchange(ExchangeRateRefreshProtocol.RUN, mapper.writeValueAsBytes(command),
                new TypeReference<ExchangeRateRefreshProtocol.Receipt>() {}, "payments.exchange-rate-refresh",
                ExchangeRateRefreshProtocol.MAX_RESPONSE_BYTES, result -> Boolean.TRUE.equals(result.returned()));
    }
}
