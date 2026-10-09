package com.raxim.myscoutee.microservices.transport.accounts;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.accounts.api.PaymentTotals;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class PaymentTotalsEndpoint {
    private final PaymentTotals owner;
    private final ObjectMapper mapper;
    public PaymentTotalsEndpoint(PaymentTotals owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = PaymentTotalsProtocol.INCREMENT, produces = "application/json")
    public ResponseEntity<?> increment(HttpServletRequest request) throws java.io.IOException {
        return read(request, PaymentTotalsProtocol.Delta.class, PaymentTotalsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> receipt(() -> owner.increment(command.userId(), command.direction(), command.currency(), command.amount()))));
    }
    @PostMapping(value = PaymentTotalsProtocol.REVERSE, produces = "application/json")
    public ResponseEntity<?> reverse(HttpServletRequest request) throws java.io.IOException {
        return read(request, PaymentTotalsProtocol.Reversal.class, PaymentTotalsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> receipt(() -> owner.reverseReceipt(command.userId(), command.receiptId(), command.direction(), command.currency(), command.amount()))));
    }
    @PostMapping(value = PaymentTotalsProtocol.INCREMENT_REFUNDS, produces = "application/json")
    public ResponseEntity<?> increment_refunds(HttpServletRequest request) throws java.io.IOException {
        return read(request, PaymentTotalsProtocol.User.class, PaymentTotalsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> receipt(() -> owner.incrementPendingRefunds(command.userId()))));
    }
    @PostMapping(value = PaymentTotalsProtocol.DECREMENT_REFUNDS, produces = "application/json")
    public ResponseEntity<?> decrement_refunds(HttpServletRequest request) throws java.io.IOException {
        return read(request, PaymentTotalsProtocol.User.class, PaymentTotalsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> receipt(() -> owner.decrementPendingRefunds(command.userId()))));
    }
    @PostMapping(value = PaymentTotalsProtocol.CURRENCY, produces = "application/json")
    public ResponseEntity<?> currency(HttpServletRequest request) throws java.io.IOException {
        return read(request, PaymentTotalsProtocol.User.class, PaymentTotalsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new PaymentTotalsProtocol.CurrencyResult(true, owner.summaryCurrency(command.userId()))));
    }
    @PostMapping(value = PaymentTotalsProtocol.SELECT_CURRENCY, produces = "application/json")
    public ResponseEntity<?> select_currency(HttpServletRequest request) throws java.io.IOException {
        return read(request, PaymentTotalsProtocol.Currency.class, PaymentTotalsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> receipt(() -> owner.selectSummaryCurrency(command.userId(), command.currency()))));
    }
    private PaymentTotalsProtocol.Receipt receipt(Runnable action) { action.run(); return new PaymentTotalsProtocol.Receipt(true); }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            byte[] bytes = ReadQueryBodies.readBytes(request, PaymentTotalsProtocol.MAX_REQUEST_BYTES);
            T query;
            try {
                query = mapper.readerFor(type).with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                        .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).with(DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES).readValue(bytes);
            } catch (RuntimeException invalid) { throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST"); }
            if (!valid.test(query)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            return response(200, action.apply(query));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new PaymentTotalsProtocol.Error(invalid.code())); }
        catch (RuntimeException unavailable) { return response(503, new PaymentTotalsProtocol.Error("PAYMENT_TOTALS_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}
