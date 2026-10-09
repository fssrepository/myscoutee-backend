package com.raxim.myscoutee.microservices.transport.payments;

import com.raxim.myscoutee.domain.payments.api.PaymentRefunds;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Bounded scoped call to the existing owner; no automatic retries. */
public final class RemotePaymentRefunds extends RemoteReadTransport implements PaymentRefunds {
    private final ObjectMapper mapper;
    private final com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Signer signer;
    public RemotePaymentRefunds(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics, com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Signer signer) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper; this.signer = signer;
    }
    @Override public com.raxim.myscoutee.domain.payments.dto.PaymentDtos.PaymentHistoryMutationDto requestChangedTermsRefund(String paymentId, String actorUserId) {
        var command = new PaymentRefundsProtocol.Request(PaymentRefundsProtocol.Scope.current(), paymentId, actorUserId);
        if (!PaymentRefundsProtocol.valid(command)) throw new IllegalArgumentException("Invalid payment-refunds request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > PaymentRefundsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("payment-refunds request exceeds byte limit");
        var result = ownerExchange(PaymentRefundsProtocol.CHANGED_TERMS, bytes, new TypeReference<PaymentRefundsProtocol.Result>() {},
                "payment-refunds.changed-terms", PaymentRefundsProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.resolved()));
        return result.value();
    }
    private <T> T ownerExchange(String path, byte[] bytes, TypeReference<T> type, String operation, int limit,
            java.util.function.Predicate<T> valid) {
        try {
            if (PaymentRefundsProtocol.CHANGED_TERMS.equals(path)) return exchangeAuthorized(path, bytes, type, operation, limit, valid,
                    java.util.Map.of(com.raxim.myscoutee.microservices.transport.security.ActorDelegation.HEADER,
                            signer.issueForCurrent(PaymentRefundsProtocol.AUDIENCE, "POST", path, bytes)));
            return exchange(path, bytes, type, operation, limit, valid);
        }
        catch (RemoteReadException failure) {
            if (failure.status() >= 400 && failure.status() < 500 && "OWNER_REJECTED".equals(failure.remoteCode()))
                throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatusCode.valueOf(failure.status()));
            if (java.util.Set.of(PaymentRefundsProtocol.CHANGED_TERMS).contains(path))
                throw new com.raxim.myscoutee.domain.payments.api.CheckoutOutcomeUnknown(failure);
            throw failure;
        }
    }

}
