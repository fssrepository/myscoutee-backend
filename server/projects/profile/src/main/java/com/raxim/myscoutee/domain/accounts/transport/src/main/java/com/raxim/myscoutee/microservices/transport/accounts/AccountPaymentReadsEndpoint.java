package com.raxim.myscoutee.microservices.transport.accounts;

import com.raxim.myscoutee.domain.accounts.api.AccountPaymentReads;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class AccountPaymentReadsEndpoint {
    private final AccountPaymentReads owner;
    private final ObjectMapper mapper;
    public AccountPaymentReadsEndpoint(AccountPaymentReads owner, ObjectMapper mapper) {
        this.owner = owner;
        this.mapper = mapper;
    }
    @PostMapping(value = AccountPaymentReadsProtocol.SUMMARY, produces = "application/json")
    public ResponseEntity<?> summary(HttpServletRequest request) throws java.io.IOException {
        try {
            var query = read(request, AccountPaymentReadsProtocol.SummaryQuery.class, 16384);
            if (!AccountPaymentReadsProtocol.valid(query)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            return response(200, new AccountPaymentReadsProtocol.SummaryResult(true, owner.paymentSummary(query.userId()).orElse(null)));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new AccountPaymentReadsProtocol.Error(invalid.code())); }
        catch (RuntimeException unavailable) { return unavailable(); }
    }
    @PostMapping(value = AccountPaymentReadsProtocol.TOTALS, produces = "application/json")
    public ResponseEntity<?> totals(HttpServletRequest request) throws java.io.IOException {
        try {
            var query = read(request, AccountPaymentReadsProtocol.SummaryQuery.class, 16384);
            if (!AccountPaymentReadsProtocol.valid(query)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            return response(200, new AccountPaymentReadsProtocol.TotalsResult(true, owner.paymentTotals(query.userId()).orElse(null)));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new AccountPaymentReadsProtocol.Error(invalid.code())); }
        catch (RuntimeException unavailable) { return unavailable(); }
    }
    @PostMapping(value = AccountPaymentReadsProtocol.PARTICIPANTS, produces = "application/json")
    public ResponseEntity<?> participants(HttpServletRequest request) throws java.io.IOException {
        try {
            var query = read(request, AccountPaymentReadsProtocol.ParticipantsQuery.class, AccountPaymentReadsProtocol.MAX_REQUEST_BYTES);
            if (!AccountPaymentReadsProtocol.valid(query)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            return response(200, java.util.Objects.requireNonNull(owner.paymentParticipants(query.ids())));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new AccountPaymentReadsProtocol.Error(invalid.code())); }
        catch (RuntimeException unavailable) { return unavailable(); }
    }
    private <T> T read(HttpServletRequest request, Class<T> type, int limit) throws java.io.IOException {
        byte[] body = ReadQueryBodies.readBytes(request, limit);
        try {
            return mapper.readerFor(type).with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                    .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).readValue(body);
        } catch (RuntimeException invalid) { throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST"); }
    }
    private ResponseEntity<?> unavailable() {
        return response(503, new AccountPaymentReadsProtocol.Error("ACCOUNT_PAYMENT_READS_UNAVAILABLE"));
    }
    private ResponseEntity<?> response(int status, Object body) {
        return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body);
    }
}
