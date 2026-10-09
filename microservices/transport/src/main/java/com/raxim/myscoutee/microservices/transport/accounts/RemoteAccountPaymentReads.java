package com.raxim.myscoutee.microservices.transport.accounts;

import java.net.URI;
import java.time.Duration;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import com.raxim.myscoutee.domain.accounts.api.AccountPaymentReads;
import com.raxim.myscoutee.domain.accounts.dto.AccountPaymentSummaryDto;
import com.raxim.myscoutee.domain.accounts.dto.PaymentParticipantDto;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

public final class RemoteAccountPaymentReads extends RemoteReadTransport implements AccountPaymentReads {
    private final ObjectMapper mapper;
    public RemoteAccountPaymentReads(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
        this.mapper = mapper;
    }
    @Override public Optional<AccountPaymentSummaryDto> paymentSummary(String userId) {
        var query = new AccountPaymentReadsProtocol.SummaryQuery(userId);
        if (!AccountPaymentReadsProtocol.valid(query)) throw new IllegalArgumentException("Invalid payment-summary query");
        var result = exchange(AccountPaymentReadsProtocol.SUMMARY, body(query, 16384),
                new TypeReference<AccountPaymentReadsProtocol.SummaryResult>() {}, "account-payment.summary",
                AccountPaymentReadsProtocol.MAX_RESPONSE_BYTES, value -> Boolean.TRUE.equals(value.resolved()));
        return Optional.ofNullable(result.value());
    }
    @Override public Optional<com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserPaymentTotalsDto> paymentTotals(String userId) {
        var query = new AccountPaymentReadsProtocol.SummaryQuery(userId);
        if (!AccountPaymentReadsProtocol.valid(query)) throw new IllegalArgumentException("Invalid payment-totals query");
        var result = exchange(AccountPaymentReadsProtocol.TOTALS, body(query, 16384),
                new TypeReference<AccountPaymentReadsProtocol.TotalsResult>() {}, "account-payment.totals",
                AccountPaymentReadsProtocol.MAX_RESPONSE_BYTES, value -> Boolean.TRUE.equals(value.resolved()));
        return Optional.ofNullable(result.value());
    }
    @Override public List<PaymentParticipantDto> paymentParticipants(Collection<String> ids) {
        var query = new AccountPaymentReadsProtocol.ParticipantsQuery(ids);
        if (!AccountPaymentReadsProtocol.valid(query)) throw new IllegalArgumentException("Invalid payment-participants query");
        return exchange(AccountPaymentReadsProtocol.PARTICIPANTS, body(query, AccountPaymentReadsProtocol.MAX_REQUEST_BYTES),
                new TypeReference<List<PaymentParticipantDto>>() {}, "account-payment.participants",
                AccountPaymentReadsProtocol.MAX_RESPONSE_BYTES,
                values -> values.stream().allMatch(value -> value != null && ids.contains(value.userId())));
    }
    private byte[] body(Object query, int limit) {
        byte[] bytes = mapper.writeValueAsBytes(query);
        if (bytes.length > limit) throw new IllegalArgumentException("Request exceeds limit");
        return bytes;
    }
}
