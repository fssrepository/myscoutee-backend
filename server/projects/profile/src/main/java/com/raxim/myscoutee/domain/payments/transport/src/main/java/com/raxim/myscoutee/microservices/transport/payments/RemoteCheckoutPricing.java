package com.raxim.myscoutee.microservices.transport.payments;

import com.raxim.myscoutee.domain.payments.api.CheckoutPricing;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Bounded scoped call to the existing owner; no automatic retries. */
public final class RemoteCheckoutPricing extends RemoteReadTransport implements CheckoutPricing {
    private final ObjectMapper mapper;
    public RemoteCheckoutPricing(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public com.raxim.myscoutee.common.dto.SharedDtos.PricingConfigDto vipPricingOffer(String sourceId, String userId) {
        var command = new CheckoutPricingProtocol.Vip(CheckoutPricingProtocol.Scope.current(), sourceId, userId);
        if (!CheckoutPricingProtocol.valid(command)) throw new IllegalArgumentException("Invalid checkout-pricing request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > CheckoutPricingProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("checkout-pricing request exceeds byte limit");
        var result = ownerExchange(CheckoutPricingProtocol.VIP, bytes, new TypeReference<CheckoutPricingProtocol.Offer>() {},
                "checkout-pricing.vip", CheckoutPricingProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.resolved()));
        return result.value();
    }
    @Override public com.raxim.myscoutee.domain.events.dto.EventsDtos.EventCheckoutRequestDto reprice(com.raxim.myscoutee.domain.events.dto.EventsDtos.EventCheckoutRequestDto request) {
        var command = new CheckoutPricingProtocol.Reprice(CheckoutPricingProtocol.Scope.current(), request);
        if (!CheckoutPricingProtocol.valid(command)) throw new IllegalArgumentException("Invalid checkout-pricing request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > CheckoutPricingProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("checkout-pricing request exceeds byte limit");
        var result = ownerExchange(CheckoutPricingProtocol.REPRICE, bytes, new TypeReference<CheckoutPricingProtocol.Result>() {},
                "checkout-pricing.reprice", CheckoutPricingProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.resolved()));
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
