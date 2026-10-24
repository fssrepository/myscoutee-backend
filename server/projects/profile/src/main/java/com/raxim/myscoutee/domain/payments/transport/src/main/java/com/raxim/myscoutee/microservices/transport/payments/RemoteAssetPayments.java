package com.raxim.myscoutee.microservices.transport.payments;

import com.raxim.myscoutee.domain.payments.api.AssetPayments;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Bounded scoped call to the existing owner; no automatic retries. */
public final class RemoteAssetPayments extends RemoteReadTransport implements AssetPayments {
    private final ObjectMapper mapper;
    public RemoteAssetPayments(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public com.raxim.myscoutee.domain.payments.dto.AssetPaymentReplacement validateAssetPaymentReplacement(String predecessorSession, String successorSession, String predecessorUser, String successorUser, String assetId, String eventId, String subEventId) {
        var command = new AssetPaymentsProtocol.Validate(AssetPaymentsProtocol.Scope.current(), predecessorSession, successorSession, predecessorUser, successorUser, assetId, eventId, subEventId);
        if (!AssetPaymentsProtocol.valid(command)) throw new IllegalArgumentException("Invalid asset-payments request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > AssetPaymentsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("asset-payments request exceeds byte limit");
        var result = ownerExchange(AssetPaymentsProtocol.VALIDATE, bytes, new TypeReference<com.raxim.myscoutee.domain.payments.dto.AssetPaymentReplacement>() {},
                "asset-payments.validate", AssetPaymentsProtocol.MAX_RESPONSE_BYTES, value -> !value.paymentRequired() || value.predecessorPaymentId() != null && value.successorPaymentId() != null);
        return result;
    }
    @Override public void completeAssetPaymentReplacement(com.raxim.myscoutee.domain.payments.dto.AssetPaymentReplacement replacement, String successorUser, String eventId, String subEventId) {
        var command = new AssetPaymentsProtocol.Complete(AssetPaymentsProtocol.Scope.current(), replacement, successorUser, eventId, subEventId);
        if (!AssetPaymentsProtocol.valid(command)) throw new IllegalArgumentException("Invalid asset-payments request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > AssetPaymentsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("asset-payments request exceeds byte limit");
        var result = ownerExchange(AssetPaymentsProtocol.COMPLETE, bytes, new TypeReference<AssetPaymentsProtocol.Receipt>() {},
                "asset-payments.complete", AssetPaymentsProtocol.MAX_RESPONSE_BYTES, value -> Boolean.TRUE.equals(value.completed()));
    }
    @Override public void recordAssetBooking(String session, String userId, String sourceId, String slot, String start, String end, com.raxim.myscoutee.common.dto.SharedDtos.PricingCancellationPolicyDto policy, String eventId, String subEventId) {
        var command = new AssetPaymentsProtocol.Booking(AssetPaymentsProtocol.Scope.current(), session, userId, sourceId, slot, start, end, policy, eventId, subEventId);
        if (!AssetPaymentsProtocol.valid(command)) throw new IllegalArgumentException("Invalid asset-payments request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > AssetPaymentsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("asset-payments request exceeds byte limit");
        var result = ownerExchange(AssetPaymentsProtocol.BOOKING, bytes, new TypeReference<AssetPaymentsProtocol.Receipt>() {},
                "asset-payments.booking", AssetPaymentsProtocol.MAX_RESPONSE_BYTES, value -> Boolean.TRUE.equals(value.completed()));
    }
    @Override public com.raxim.myscoutee.domain.events.dto.EventsDtos.EventCheckoutPaymentAuditDto recordAssetBookingPriceRevision(String session, String userId, String sourceId, String title, String timeframe, Integer previousQuantity, Integer nextQuantity, Double previousTotal, Double nextTotal, String currency) {
        var command = new AssetPaymentsProtocol.Revision(AssetPaymentsProtocol.Scope.current(), session, userId, sourceId, title, timeframe, previousQuantity, nextQuantity, previousTotal, nextTotal, currency);
        if (!AssetPaymentsProtocol.valid(command)) throw new IllegalArgumentException("Invalid asset-payments request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > AssetPaymentsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("asset-payments request exceeds byte limit");
        var result = ownerExchange(AssetPaymentsProtocol.REVISION, bytes, new TypeReference<AssetPaymentsProtocol.Audit>() {},
                "asset-payments.revision", AssetPaymentsProtocol.MAX_RESPONSE_BYTES, value -> Boolean.TRUE.equals(value.resolved()));
        return result.value();
    }
    @Override public void cancelAssetBooking(String session, String start, com.raxim.myscoutee.common.dto.SharedDtos.PricingCancellationPolicyDto policy) {
        var command = new AssetPaymentsProtocol.Cancel(AssetPaymentsProtocol.Scope.current(), session, start, policy);
        if (!AssetPaymentsProtocol.valid(command)) throw new IllegalArgumentException("Invalid asset-payments request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > AssetPaymentsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("asset-payments request exceeds byte limit");
        var result = ownerExchange(AssetPaymentsProtocol.CANCEL, bytes, new TypeReference<AssetPaymentsProtocol.Receipt>() {},
                "asset-payments.cancel", AssetPaymentsProtocol.MAX_RESPONSE_BYTES, value -> Boolean.TRUE.equals(value.completed()));
    }
    @Override public void recordAssetBooking(String session, String userId, String sourceId, String slot,
            String start, String end, com.raxim.myscoutee.common.dto.SharedDtos.PricingCancellationPolicyDto policy) {
        recordAssetBooking(session, userId, sourceId, slot, start, end, policy, null, null);
    }
    private <T> T ownerExchange(String path, byte[] bytes, TypeReference<T> type, String operation, int limit,
            java.util.function.Predicate<T> valid) {
        try { return exchange(path, bytes, type, operation, limit, valid); }
        catch (RemoteReadException failure) {
            if (failure.status() >= 400 && failure.status() < 500 && "OWNER_REJECTED".equals(failure.remoteCode()))
                throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatusCode.valueOf(failure.status()));
            if (!AssetPaymentsProtocol.VALIDATE.equals(path)) throw new AssetPayments.OutcomeUnknown(failure);
            throw failure;
        }
    }
}
