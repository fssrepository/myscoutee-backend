package com.raxim.myscoutee.domain.payments.api;

/** A lost mutation reply is not evidence that checkout failed or should be compensated. */
@org.springframework.web.bind.annotation.ResponseStatus(org.springframework.http.HttpStatus.SERVICE_UNAVAILABLE)
public final class CheckoutOutcomeUnknown extends RuntimeException {
    public CheckoutOutcomeUnknown(Throwable cause) { super("Checkout outcome requires reconciliation", cause); }
}
