package com.raxim.myscoutee.microservices.transport.payments;

import com.raxim.myscoutee.domain.payments.api.CurrentPaymentProvider;
import com.raxim.myscoutee.domain.payments.api.PaymentProviderChangedException;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
public final class CurrentPaymentProviderEndpoint {
    private final CurrentPaymentProvider owner;
    public CurrentPaymentProviderEndpoint(CurrentPaymentProvider owner) { this.owner = owner; }
    @GetMapping(value = CurrentPaymentProviderProtocol.PATH, produces = "application/json")
    public ResponseEntity<?> cashOnly() {
        try {
            owner.requireCashOnly();
            return response(200, new CurrentPaymentProviderProtocol.Result(true, true, null));
        } catch (PaymentProviderChangedException changed) {
            return response(200, new CurrentPaymentProviderProtocol.Result(true, false, changed.getCurrentProvider()));
        } catch (RuntimeException unavailable) {
            return response(503, new CurrentPaymentProviderProtocol.Error("CURRENT_PAYMENT_PROVIDER_UNAVAILABLE"));
        }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}
