package com.raxim.myscoutee.microservices.transport.payments;

import com.raxim.myscoutee.domain.payments.api.ServiceSlotPricing;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Bounded scoped call to the existing owner; no automatic retries. */
public final class RemoteServiceSlotPricing extends RemoteReadTransport implements ServiceSlotPricing {
    private final ObjectMapper mapper;
    public RemoteServiceSlotPricing(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public com.raxim.myscoutee.domain.payments.dto.ServiceSlotQuoteDto quoteServiceSlot(com.raxim.myscoutee.common.dto.SharedDtos.PricingConfigDto pricing, String templateId, String startAtIso, int occupied) {
        var command = new ServiceSlotPricingProtocol.Query(ServiceSlotPricingProtocol.Scope.current(), pricing, templateId, startAtIso, occupied);
        if (!ServiceSlotPricingProtocol.valid(command)) throw new IllegalArgumentException("Invalid service-slot-pricing request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > ServiceSlotPricingProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("service-slot-pricing request exceeds byte limit");
        var result = ownerExchange(ServiceSlotPricingProtocol.QUOTE, bytes, new TypeReference<ServiceSlotPricingProtocol.Result>() {},
                "service-slot-pricing.quote", ServiceSlotPricingProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.resolved()));
        return result.value();
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
