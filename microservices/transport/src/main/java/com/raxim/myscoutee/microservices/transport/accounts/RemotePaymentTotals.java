package com.raxim.myscoutee.microservices.transport.accounts;

import com.raxim.myscoutee.domain.accounts.api.PaymentTotals;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Bounded scoped call to the existing owner; no automatic retries. */
public final class RemotePaymentTotals extends RemoteReadTransport implements PaymentTotals {
    private final ObjectMapper mapper;
    public RemotePaymentTotals(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public void increment(String userId, Direction direction, String currency, double amount) {
        var command = new PaymentTotalsProtocol.Delta(PaymentTotalsProtocol.Scope.current(), userId, direction, currency, amount);
        if (!PaymentTotalsProtocol.valid(command)) throw new IllegalArgumentException("Invalid payment-totals request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > PaymentTotalsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("payment-totals request exceeds byte limit");
        var result = exchange(PaymentTotalsProtocol.INCREMENT, bytes, new TypeReference<PaymentTotalsProtocol.Receipt>() {},
                "payment-totals.increment", PaymentTotalsProtocol.MAX_RESPONSE_BYTES, value -> Boolean.TRUE.equals(value.completed()));
    }
    @Override public void reverseReceipt(String userId, String receiptId, Direction direction, String currency, double amount) {
        var command = new PaymentTotalsProtocol.Reversal(PaymentTotalsProtocol.Scope.current(), userId, receiptId, direction, currency, amount);
        if (!PaymentTotalsProtocol.valid(command)) throw new IllegalArgumentException("Invalid payment-totals request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > PaymentTotalsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("payment-totals request exceeds byte limit");
        var result = exchange(PaymentTotalsProtocol.REVERSE, bytes, new TypeReference<PaymentTotalsProtocol.Receipt>() {},
                "payment-totals.reverse", PaymentTotalsProtocol.MAX_RESPONSE_BYTES, value -> Boolean.TRUE.equals(value.completed()));
    }
    @Override public void incrementPendingRefunds(String userId) {
        var command = new PaymentTotalsProtocol.User(PaymentTotalsProtocol.Scope.current(), userId);
        if (!PaymentTotalsProtocol.valid(command)) throw new IllegalArgumentException("Invalid payment-totals request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > PaymentTotalsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("payment-totals request exceeds byte limit");
        var result = exchange(PaymentTotalsProtocol.INCREMENT_REFUNDS, bytes, new TypeReference<PaymentTotalsProtocol.Receipt>() {},
                "payment-totals.increment-refunds", PaymentTotalsProtocol.MAX_RESPONSE_BYTES, value -> Boolean.TRUE.equals(value.completed()));
    }
    @Override public void decrementPendingRefunds(String userId) {
        var command = new PaymentTotalsProtocol.User(PaymentTotalsProtocol.Scope.current(), userId);
        if (!PaymentTotalsProtocol.valid(command)) throw new IllegalArgumentException("Invalid payment-totals request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > PaymentTotalsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("payment-totals request exceeds byte limit");
        var result = exchange(PaymentTotalsProtocol.DECREMENT_REFUNDS, bytes, new TypeReference<PaymentTotalsProtocol.Receipt>() {},
                "payment-totals.decrement-refunds", PaymentTotalsProtocol.MAX_RESPONSE_BYTES, value -> Boolean.TRUE.equals(value.completed()));
    }
    @Override public String summaryCurrency(String userId) {
        var command = new PaymentTotalsProtocol.User(PaymentTotalsProtocol.Scope.current(), userId);
        if (!PaymentTotalsProtocol.valid(command)) throw new IllegalArgumentException("Invalid payment-totals request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > PaymentTotalsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("payment-totals request exceeds byte limit");
        var result = exchange(PaymentTotalsProtocol.CURRENCY, bytes, new TypeReference<PaymentTotalsProtocol.CurrencyResult>() {},
                "payment-totals.currency", PaymentTotalsProtocol.MAX_RESPONSE_BYTES, value -> Boolean.TRUE.equals(value.resolved()) && (value.value() == null || value.value().length() <= 512));
        return result.value();
    }
    @Override public void selectSummaryCurrency(String userId, String currency) {
        var command = new PaymentTotalsProtocol.Currency(PaymentTotalsProtocol.Scope.current(), userId, currency);
        if (!PaymentTotalsProtocol.valid(command)) throw new IllegalArgumentException("Invalid payment-totals request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > PaymentTotalsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("payment-totals request exceeds byte limit");
        var result = exchange(PaymentTotalsProtocol.SELECT_CURRENCY, bytes, new TypeReference<PaymentTotalsProtocol.Receipt>() {},
                "payment-totals.select-currency", PaymentTotalsProtocol.MAX_RESPONSE_BYTES, value -> Boolean.TRUE.equals(value.completed()));
    }
}
